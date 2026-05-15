import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';
import { TOTAL_PILLARS } from '../lib/pillars';
import { BADGES } from '../lib/badges';
import { analyzeInsights } from '../lib/insights';

const TOTAL_JOURNEY_DAYS = 48;

const ymd = (d: Date) => d.toISOString().split('T')[0];

const dayLabel = (d: Date) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    try {
      // Independent reads — fan out in parallel to cut dashboard latency.
      const [journeys, checkins, karma, streaks, badges] = await Promise.all([
        db.send(new QueryCommand({
          TableName: Resource.Journeys.name,
          IndexName: 'userId-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': user.id },
        })),
        db.send(new QueryCommand({
          TableName: Resource.DailyCheckins.name,
          IndexName: 'userId-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': user.id },
        })),
        db.send(new QueryCommand({
          TableName: Resource.KarmaTransactions.name,
          IndexName: 'userId-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': user.id },
        })),
        db.send(new QueryCommand({
          TableName: Resource.Streaks.name,
          IndexName: 'userId-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': user.id },
        })),
        db.send(new QueryCommand({
          TableName: Resource.UserBadges.name,
          IndexName: 'userId-index',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': user.id },
        })),
      ]);

      const activeJourney = journeys.Items?.find((j: any) => j.isActive);
      const totalKarma = (karma.Items || []).reduce((sum: number, t: any) => sum + (t.points || 0), 0);

      // Karma earned today — separate from lifetime totalKarma. The dashboard's
      // "+todayEarned" pill on the karma card was permanently stuck at 0
      // because we never computed this. Uses the same YYYY-MM-DD prefix
      // convention as checkin.ts.
      const todayPrefix = new Date().toISOString().split('T')[0];
      const todayEarned = (karma.Items || [])
        .filter((t: any) => (t.createdAt || '').startsWith(todayPrefix))
        .reduce((sum: number, t: any) => sum + (t.points || 0), 0);

      // Calculate journey day
      let journeyDay = 0;
      if (activeJourney) {
        const start = new Date(activeJourney.startDate);
        const now = new Date();
        journeyDay = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
      }

      // Pillar completion stats
      const pillarStats: Record<string, number> = {};
      for (const c of checkins.Items || []) {
        const pid = String(c.pillarId);
        pillarStats[pid] = (pillarStats[pid] || 0) + 1;
      }

      // Build distinct-pillar-completions-per-date map. Source of truth for
      // the heatmap, weekly trend, and consistency math. Same-day duplicates
      // collapse via Set so the dedupe fix in checkin.ts is reinforced here.
      const completionsByDate = new Map<string, Set<string>>();
      for (const c of checkins.Items || []) {
        const date = c.checkinDate;
        if (!date) continue;
        if (!completionsByDate.has(date)) completionsByDate.set(date, new Set());
        const slug = c.pillarSlug || String(c.pillarId || '');
        if (slug) completionsByDate.get(date)!.add(slug);
      }

      const now = new Date();
      const todayStr = ymd(now);

      // Weekly trend — last 7 days ending today. Shape matches WeeklyTrendChart.
      const weeklyTrendData = Array.from({ length: 7 }, (_, idx) => {
        const offset = 6 - idx;
        const d = new Date(now);
        d.setUTCDate(d.getUTCDate() - offset);
        const date = ymd(d);
        const pillarsCompleted = completionsByDate.get(date)?.size ?? 0;
        const percentage = Math.round((pillarsCompleted / TOTAL_PILLARS) * 100);
        return {
          date,
          dayLabel: dayLabel(d),
          pillarsCompleted,
          totalPillars: TOTAL_PILLARS,
          percentage,
        };
      });

      // Previous week average — days 8-14 ago. Used to drive the trend pill.
      let prevTotal = 0;
      for (let offset = 13; offset >= 7; offset--) {
        const d = new Date(now);
        d.setUTCDate(d.getUTCDate() - offset);
        const completed = completionsByDate.get(ymd(d))?.size ?? 0;
        prevTotal += Math.round((completed / TOTAL_PILLARS) * 100);
      }
      const previousWeekAverage = Math.round(prevTotal / 7);

      // Calendar heatmap — full 48-day journey when there's an active journey,
      // otherwise an empty grid (the page already shows a no-journey CTA).
      const calendarData: Array<{
        date: string;
        dayNumber: number;
        pillarsCompleted: number;
        totalPillars: number;
        percentage: number;
        isToday: boolean;
        isFuture: boolean;
      }> = [];
      if (activeJourney?.startDate) {
        const start = new Date(activeJourney.startDate);
        for (let dayNum = 1; dayNum <= TOTAL_JOURNEY_DAYS; dayNum++) {
          const d = new Date(start);
          d.setUTCDate(d.getUTCDate() + (dayNum - 1));
          const date = ymd(d);
          const pillarsCompleted = completionsByDate.get(date)?.size ?? 0;
          calendarData.push({
            date,
            dayNumber: dayNum,
            pillarsCompleted,
            totalPillars: TOTAL_PILLARS,
            percentage: Math.round((pillarsCompleted / TOTAL_PILLARS) * 100),
            isToday: date === todayStr,
            isFuture: date > todayStr,
          });
        }
      }

      // Badges joined to definitions — shape matches the Progress page's
      // `userBadges.map(ub => ub.badge?.name)` expectation. Definitions live
      // in functions/lib/badges.ts now (the DynamoDB Badges table was never
      // seeded), so the join is just a Map lookup.
      const badgeById = new Map<string, (typeof BADGES)[number]>();
      for (const b of BADGES) badgeById.set(b.id, b);
      const userBadges = (badges.Items || []).map((ub: any) => ({
        id: ub.id,
        badgeId: ub.badgeId,
        earnedAt: ub.earnedAt,
        badge: badgeById.get(String(ub.badgeId)) || { name: 'Unknown', description: '' },
      }));

      const streakItem =
        (streaks.Items || [])
          .slice()
          .sort((a: any, b: any) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0] ||
        null;

      // Insights — shared analyzer with /data/insights so both pages show
      // the same rules. Lives in functions/lib/insights.ts.
      const insights = analyzeInsights({
        checkins: checkins.Items || [],
        streakCurrent: streakItem?.currentStreak || 0,
        journeyDay,
        totalKarma,
      });

      // Reports page exposes a different shape than the Progress page —
      // currentDay/currentWeek/completionRate/journeyStartDate. Compute
      // them here rather than making the client re-derive.
      const currentDay = Math.min(Math.max(0, journeyDay), TOTAL_JOURNEY_DAYS);
      const currentWeek = Math.max(1, Math.ceil(Math.max(1, currentDay) / 7));
      // Use the weekly trend average as the headline completion rate —
      // matches the Progress page's "Consistency Score" and is intuitive.
      const completionRate =
        weeklyTrendData.length > 0
          ? Math.round(
              weeklyTrendData.reduce((s, d) => s + d.percentage, 0) /
                weeklyTrendData.length,
            )
          : 0;
      const journeyStartDate = activeJourney?.startDate || null;

      // ── CSV export branch ──────────────────────────────────────────
      // Reports page's "Download CSV" hits /data/reports?format=csv.
      // Build a flat row-per-checkin CSV with a small summary header so
      // a user (or spreadsheet app) can immediately make sense of it.
      const format = event.queryStringParameters?.format;
      if (format === 'csv') {
        const lines: string[] = [];
        const esc = (s: string | number | null | undefined) => {
          const v = s == null ? '' : String(s);
          return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        };

        lines.push('# 10X Vedic Transform — Journey Report');
        lines.push(`# Generated: ${now.toISOString()}`);
        lines.push(`# Current Day: ${currentDay} of ${TOTAL_JOURNEY_DAYS}`);
        lines.push(`# Current Week: ${currentWeek}`);
        lines.push(`# Total Karma: ${totalKarma}`);
        lines.push(`# Current Streak: ${streakItem?.currentStreak || 0}`);
        lines.push(`# Longest Streak: ${streakItem?.longestStreak || 0}`);
        lines.push(`# Total Check-ins: ${checkins.Items?.length || 0}`);
        lines.push(`# Completion Rate: ${completionRate}%`);
        lines.push('');
        lines.push('date,pillar_slug,pillar_id,duration_minutes,mood_before,mood_after,notes');

        const sortedCheckins = [...(checkins.Items || [])].sort((a: any, b: any) =>
          (a.checkinDate || '').localeCompare(b.checkinDate || ''),
        );
        for (const c of sortedCheckins) {
          lines.push(
            [
              esc(c.checkinDate),
              esc(c.pillarSlug),
              esc(c.pillarId),
              esc(c.durationMinutes),
              esc(c.moodBefore),
              esc(c.moodAfter),
              esc(c.notes),
            ].join(','),
          );
        }

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="vedic-journey-${todayStr}.csv"`,
          },
          body: lines.join('\n'),
        };
      }

      return ok({
        journey: activeJourney || null,
        journeyDay,
        currentDay,
        currentWeek,
        completionRate,
        journeyStartDate,
        totalCheckins: checkins.Items?.length || 0,
        totalKarma,
        todayEarned,
        // Pick the most-recently-updated streak row when a user has multiple
        // (e.g. across journeys). Matches checkin.ts and buy-shield.ts.
        streak: streakItem,
        badgesEarned: badges.Items?.length || 0,
        pillarStats,
        weeklyTrendData,
        previousWeekAverage,
        calendarData,
        userBadges,
        insights,
      });
    } catch (e: any) {
      console.error('Reports error:', e);
      return err(500, 'Failed to generate report');
    }
  }

  return err(405, 'Method not allowed');
}
