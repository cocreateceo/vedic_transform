import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';
import { resolvePillar, TOTAL_PILLARS } from '../lib/pillars';
import { BADGES } from '../lib/badges';

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

      // Insights — rule-based, derived from what we already computed so we
      // don't add another DB round-trip. Keep them few; the InsightList shows
      // only the top 3 by default.
      const insights: Array<{
        id: string;
        type: 'strength' | 'weakness' | 'milestone' | 'pattern' | 'recommendation';
        title: string;
        description: string;
      }> = [];

      const pillarCounts = new Map<string, number>();
      for (const c of checkins.Items || []) {
        const slug = c.pillarSlug || String(c.pillarId || '');
        if (!slug) continue;
        pillarCounts.set(slug, (pillarCounts.get(slug) || 0) + 1);
      }
      const sortedPillars = Array.from(pillarCounts.entries()).sort((a, b) => b[1] - a[1]);

      if (sortedPillars.length > 0) {
        const [topSlug, topCount] = sortedPillars[0];
        if (topCount >= 3) {
          const meta = resolvePillar({ pillarSlug: topSlug });
          insights.push({
            id: `strength-${topSlug}`,
            type: 'strength',
            title: `${meta?.name || topSlug} is your strongest practice`,
            description: `You've completed it ${topCount} time${topCount === 1 ? '' : 's'}. Keep building on this momentum.`,
          });
        }
        if (sortedPillars.length >= 3) {
          const [bottomSlug, bottomCount] = sortedPillars[sortedPillars.length - 1];
          if (bottomCount * 2 < topCount) {
            const meta = resolvePillar({ pillarSlug: bottomSlug });
            insights.push({
              id: `weakness-${bottomSlug}`,
              type: 'weakness',
              title: `${meta?.name || bottomSlug} could use more attention`,
              description: `Only ${bottomCount} completion${bottomCount === 1 ? '' : 's'} so far. Consider making it a focus pillar.`,
            });
          }
        }
      }

      const currentStreakValue = streakItem?.currentStreak || 0;
      if (currentStreakValue >= 30) {
        insights.push({
          id: 'milestone-30',
          type: 'milestone',
          title: '30-day streak!',
          description: 'Incredible consistency. The habit is yours now.',
        });
      } else if (currentStreakValue >= 14) {
        insights.push({
          id: 'milestone-14',
          type: 'milestone',
          title: '2 weeks strong',
          description: "You're past the habit-forming threshold.",
        });
      } else if (currentStreakValue >= 7) {
        insights.push({
          id: 'milestone-7',
          type: 'milestone',
          title: 'First week complete!',
          description: 'You earned your first Karma Shield. Keep going.',
        });
      }

      // Today's drop-off — if today's percentage trails the weekly average by
      // a lot, nudge the user to do one more pillar before the day ends.
      const todayPct = weeklyTrendData[6]?.percentage ?? 0;
      const weekAvg = Math.round(
        weeklyTrendData.reduce((s, d) => s + d.percentage, 0) / 7,
      );
      if (weekAvg > 30 && todayPct + 20 < weekAvg) {
        insights.push({
          id: 'pattern-today-low',
          type: 'recommendation',
          title: 'Today is below your weekly pace',
          description: `Your week average is ${weekAvg}% but today is only ${todayPct}%. One more pillar puts you back on track.`,
        });
      }

      return ok({
        journey: activeJourney || null,
        journeyDay,
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
