import { Resource } from 'sst';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';
import { resolvePillar } from '../lib/pillars';
import { BADGES, parseRequirement, type BadgeDef } from '../lib/badges';
import { emit, EventType } from '../lib/events';

const TOTAL_JOURNEY_DAYS = 48;

/**
 * Evaluate the badge catalog against the user's current state and award any
 * newly-earned ones. Idempotent — only inserts UserBadges rows for badges the
 * user doesn't already have. Returns the badges awarded this call so the
 * client can show a "Badge Unlocked!" toast.
 *
 * Runs after the check-in PUT, streak update, and karma transaction so all
 * those state changes are visible (modulo GSI eventual consistency, which
 * tends to converge within ms and is self-healing on the next check-in).
 */
async function evaluateAndAwardBadges(args: {
  userId: string;
  currentStreak: number;
}): Promise<BadgeDef[]> {
  const { userId, currentStreak } = args;

  const [userBadgesRes, karmaRes, checkinsRes, journeysRes] = await Promise.all([
    db.send(new QueryCommand({
      TableName: Resource.UserBadges.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId },
    })),
    db.send(new QueryCommand({
      TableName: Resource.KarmaTransactions.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId },
    })),
    db.send(new QueryCommand({
      TableName: Resource.DailyCheckins.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId },
    })),
    db.send(new QueryCommand({
      TableName: Resource.Journeys.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId },
    })),
  ]);

  const alreadyEarned = new Set(
    (userBadgesRes.Items || []).map((b: any) => String(b.badgeId)),
  );

  let totalKarma = (karmaRes.Items || []).reduce(
    (sum: number, t: any) => sum + (t.points || 0),
    0,
  );

  const totalCheckins = (checkinsRes.Items || []).length;

  const pillarCounts = new Map<string, number>();
  for (const c of checkinsRes.Items || []) {
    const slug = c.pillarSlug || String(c.pillarId || '');
    if (!slug) continue;
    pillarCounts.set(slug, (pillarCounts.get(slug) || 0) + 1);
  }
  const maxPillarCount = Math.max(0, ...pillarCounts.values());
  const pillarsAt10Plus = Array.from(pillarCounts.values()).filter((c) => c >= 10).length;

  const activeJourney = (journeysRes.Items || []).find((j: any) => j.isActive);
  let journeyDay = 0;
  if (activeJourney?.startDate) {
    journeyDay = Math.min(
      Math.floor(
        (Date.now() - new Date(activeJourney.startDate).getTime()) / 86400000,
      ) + 1,
      TOTAL_JOURNEY_DAYS,
    );
  }

  const newlyEarned: BadgeDef[] = [];
  const nowIso = new Date().toISOString();

  for (const badge of BADGES) {
    if (alreadyEarned.has(badge.id)) continue;
    const r = parseRequirement(badge.requirement);
    if (!r) continue;

    let earned = false;
    switch (r.type) {
      case 'first-checkin': earned = totalCheckins >= r.value; break;
      case 'streak': earned = currentStreak >= r.value; break;
      case 'journey': earned = journeyDay >= r.value; break;
      case 'pillar-mastery': earned = maxPillarCount >= r.value; break;
      case 'pillar-polymath': earned = pillarsAt10Plus >= r.value; break;
      case 'karma': earned = totalKarma >= r.value; break;
    }
    if (!earned) continue;

    // Best-effort writes — if either Put fails we still report the badge as
    // earned in-memory so the next check-in's eval can heal.
    try {
      await db.send(new PutCommand({
        TableName: Resource.UserBadges.name,
        Item: {
          id: generateId(),
          userId,
          badgeId: badge.id,
          earnedAt: nowIso,
        },
      }));

      if (badge.karmaBonus > 0) {
        await db.send(new PutCommand({
          TableName: Resource.KarmaTransactions.name,
          Item: {
            id: generateId(),
            userId,
            points: badge.karmaBonus,
            reason: `Badge earned: ${badge.name}`,
            pillarId: null,
            pillarSlug: null,
            badgeId: badge.id,
            createdAt: nowIso,
          },
        }));
        // Bump the running total so a streak/journey badge bonus that crosses
        // a karma threshold can award the karma badge in the same pass.
        totalKarma += badge.karmaBonus;
      }
    } catch (e) {
      console.error('Badge award error:', badge.id, e);
      continue;
    }

    alreadyEarned.add(badge.id);
    newlyEarned.push(badge);
  }

  return newlyEarned;
}

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

    // Badge evaluation — surface any newly-earned badges so the client can
    // show a one-shot "Badge Unlocked" toast. Best-effort: a badge eval
    // failure must not break the underlying check-in response.
    let newBadges: BadgeDef[] = [];
    try {
      newBadges = await evaluateAndAwardBadges({
        userId: user.id,
        currentStreak: streakAfter?.currentStreak || 0,
      });
    } catch (e) {
      console.error('Badge evaluation error:', e);
    }

    void emit(user.id, EventType.CHECKIN_COMPLETED, {
      pillarSlug: pillar.slug,
      pillarId: pillar.id,
      karmaAwarded: pillar.karmaPointsBase,
      streakEvent,
      currentStreak: streakAfter?.currentStreak ?? 0,
      newBadgeIds: newBadges.map((b) => b.id),
    });

    return ok({
      success: true,
      checkinId: id,
      karmaAwarded: pillar.karmaPointsBase,
      streakEvent,
      streak: streakAfter,
      newBadges: newBadges.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        karmaBonus: b.karmaBonus,
      })),
    });
  }

  return err(405, 'Method not allowed');
}
