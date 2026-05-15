import { Resource } from 'sst';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';
import { resolvePillar } from '../lib/pillars';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const all = event.queryStringParameters?.all === 'true';
    const date = event.queryStringParameters?.date || new Date().toISOString().split('T')[0];
    const pillarIdQuery = event.queryStringParameters?.pillarId;
    const pillarSlugQuery = event.queryStringParameters?.pillarSlug;

    // `?all=true` skips the date filter and returns every check-in for the
    // user. Goals page uses this to compute per-pillar completion rates
    // across the whole 48-day journey. Without it, only today's check-ins
    // came back and rates were always ~0%.
    if (all) {
      const result = await db.send(new QueryCommand({
        TableName: Resource.DailyCheckins.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));
      return ok({ checkins: result.Items || [] });
    }

    const result = await db.send(new QueryCommand({
      TableName: Resource.DailyCheckins.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'begins_with(checkinDate, :date)',
      ExpressionAttributeValues: {
        ':userId': user.id,
        ':date': date,
      },
    }));

    const checkins = result.Items || [];

    // Derive everything callers actually use:
    //  - completedPillars: array of pillar slugs done today (dashboard grid,
    //    Today's Practice card)
    //  - isCompleted: true if a specific pillar was passed in via query
    //    (pillar detail page's "Mark as Complete" button state)
    const completedPillars = Array.from(
      new Set(
        checkins
          .map((c: any) => c.pillarSlug)
          .filter((s: any): s is string => Boolean(s)),
      ),
    );

    let isCompleted: boolean | undefined = undefined;
    if (pillarSlugQuery || pillarIdQuery) {
      const resolved = resolvePillar({
        pillarId: pillarIdQuery,
        pillarSlug: pillarSlugQuery,
      });
      if (resolved) {
        isCompleted = checkins.some(
          (c: any) => c.pillarSlug === resolved.slug || c.pillarId === resolved.id,
        );
      }
    }

    return ok({ checkins, completedPillars, isCompleted });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { pillarId, pillarSlug, durationMinutes, notes, moodBefore, moodAfter } = body;

    const pillar = resolvePillar({ pillarId, pillarSlug });
    if (!pillar) return err(400, 'pillarId or pillarSlug is required and must reference a known pillar');

    const now = new Date();
    const checkinDate = now.toISOString().split('T')[0];

    // Idempotency — silently dedupe same-pillar, same-day check-ins so a
    // double-click / retry can't farm karma. Karma POST is non-atomic with
    // the checkin PUT, so the check has to live here, not just on the client.
    const existing = await db.send(new QueryCommand({
      TableName: Resource.DailyCheckins.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'checkinDate = :date AND pillarSlug = :slug',
      ExpressionAttributeValues: {
        ':userId': user.id,
        ':date': checkinDate,
        ':slug': pillar.slug,
      },
    }));
    if ((existing.Items || []).length > 0) {
      return ok({
        success: true,
        checkinId: existing.Items![0].id,
        karmaAwarded: 0,
        alreadyCheckedIn: true,
        streakEvent: null,
        streak: null,
      });
    }

    const id = generateId();

    await db.send(new PutCommand({
      TableName: Resource.DailyCheckins.name,
      Item: {
        id,
        userId: user.id,
        pillarId: pillar.id,
        pillarSlug: pillar.slug,
        checkinDate,
        completed: true,
        durationMinutes: durationMinutes || null,
        notes: notes || null,
        moodBefore: moodBefore || null,
        moodAfter: moodAfter || null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    }));

    // Update streak — calendar-day based, with Karma Shield protection (P0-5).
    // See spec at docs/superpowers/specs/2026-05-09-p0-bundle-design.md §4.
    let streakEvent: 'shield-used' | 'shield-granted' | null = null;
    let streakAfter: { currentStreak: number; longestStreak: number; shields: number } | null = null;

    try {
      const streaks = await db.send(new QueryCommand({
        TableName: Resource.Streaks.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));

      // Prefer a streak tied to an active journey; fall back to the most
      // recently updated one. With no sort key on the GSI, item order is
      // not guaranteed — picking by `updatedAt` is deterministic.
      const sorted = (streaks.Items || []).slice().sort((a: any, b: any) =>
        (b.updatedAt || '').localeCompare(a.updatedAt || '')
      );
      const streak = sorted[0];

      if (streak) {
        const lastCheckinDate: string | null = streak.lastCheckin || null;

        // Same calendar day → record the check-in but don't double-count.
        if (lastCheckinDate === checkinDate) {
          streakAfter = {
            currentStreak: streak.currentStreak || 0,
            longestStreak: streak.longestStreak || 0,
            shields: streak.shields || 0,
          };
        } else {
          // Calendar-day diff (UTC). Replaces the legacy 36-hour window —
          // unambiguous and shield-compatible.
          const lastDate = lastCheckinDate ? new Date(lastCheckinDate) : null;
          const today = new Date(checkinDate);
          const daysSinceLast = lastDate
            ? Math.floor((today.getTime() - lastDate.getTime()) / 86400000)
            : null;

          const shields: number = streak.shields || 0;
          const currentStreak: number = streak.currentStreak || 0;
          const longestStreak: number = streak.longestStreak || 0;
          const shieldsEarned: number = streak.shieldsEarned || 0;

          let newCurrent: number;
          let shieldDelta = 0;

          if (daysSinceLast === null) {
            // First check-in.
            newCurrent = 1;
          } else if (daysSinceLast === 1) {
            // Consecutive day.
            newCurrent = currentStreak + 1;
          } else if (daysSinceLast === 2 && shields >= 1) {
            // Exactly one missed day, a shield protects the streak.
            newCurrent = currentStreak + 1;
            shieldDelta = -1;
            streakEvent = 'shield-used';
          } else {
            // No shields available, or more than one missed day (shield
            // can't cover it). Streak resets; shield stays in inventory.
            newCurrent = 1;
          }

          // Auto-grant the first Karma Shield once the user crosses Day 7.
          // Streak Society pattern; lifetime once-per-user via shieldsEarned.
          let earnedDelta = 0;
          if (newCurrent >= 7 && shieldsEarned === 0) {
            shieldDelta += 1;
            earnedDelta = 1;
            if (streakEvent === null) streakEvent = 'shield-granted';
          }

          const newLongest = Math.max(newCurrent, longestStreak);
          const newShields = Math.min(2, Math.max(0, shields + shieldDelta));
          const newShieldsEarned = shieldsEarned + earnedDelta;
          const newShieldsUsed = (streak.shieldsUsed || 0) + (streakEvent === 'shield-used' ? 1 : 0);

          await db.send(new UpdateCommand({
            TableName: Resource.Streaks.name,
            Key: { id: streak.id },
            UpdateExpression:
              'SET currentStreak = :current, longestStreak = :longest, lastCheckin = :lastCheckin, ' +
              'shields = :shields, shieldsEarned = :earned, shieldsUsed = :used, updatedAt = :now',
            ExpressionAttributeValues: {
              ':current': newCurrent,
              ':longest': newLongest,
              ':lastCheckin': checkinDate,
              ':shields': newShields,
              ':earned': newShieldsEarned,
              ':used': newShieldsUsed,
              ':now': now.toISOString(),
            },
          }));

          streakAfter = {
            currentStreak: newCurrent,
            longestStreak: newLongest,
            shields: newShields,
          };
        }
      }
    } catch (e) {
      console.error('Streak update error:', e);
    }

    // Add karma transaction — points are pillar-specific (karmaPointsBase from
    // src/constants/pillars.ts, mirrored in functions/lib/pillars.ts).
    try {
      await db.send(new PutCommand({
        TableName: Resource.KarmaTransactions.name,
        Item: {
          id: generateId(),
          userId: user.id,
          points: pillar.karmaPointsBase,
          reason: 'Pillar checkin completed',
          pillarId: pillar.id,
          pillarSlug: pillar.slug,
          badgeId: null,
          createdAt: now.toISOString(),
        },
      }));
    } catch (e) {
      console.error('Karma transaction error:', e);
    }

    return ok({
      success: true,
      checkinId: id,
      karmaAwarded: pillar.karmaPointsBase,
      streakEvent,
      streak: streakAfter,
    });
  }

  return err(405, 'Method not allowed');
}
