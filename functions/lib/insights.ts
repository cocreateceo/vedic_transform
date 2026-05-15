// Shared insights analyzer — same rules used by both /data/insights (the
// dedicated Insights page) and /data/reports (the Progress page's inline
// list). Insights are computed live from the user's check-in / streak /
// karma / journey state — there's no UserInsights persistence anymore.
// Stable IDs let the client track "seen" and "dismissed" state in
// localStorage.

import { resolvePillar, TOTAL_PILLARS } from './pillars';

export type InsightType =
  | 'pattern'
  | 'strength'
  | 'weakness'
  | 'recommendation'
  | 'milestone';

export interface Insight {
  id: string;
  type: InsightType;
  category?: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

function ymd(d: Date): string {
  return d.toISOString().split('T')[0];
}

interface AnalyzerInput {
  checkins: any[];
  streakCurrent: number;
  /** 1-based day in the 48-day journey, or 0 if there's no active journey. */
  journeyDay: number;
  totalKarma: number;
}

export function analyzeInsights(input: AnalyzerInput): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  const nowIso = now.toISOString();
  const todayStr = ymd(now);

  // ── Per-pillar completion counts ──────────────────────────────────────
  const pillarCounts = new Map<string, number>();
  for (const c of input.checkins || []) {
    const slug = c.pillarSlug || String(c.pillarId || '');
    if (!slug) continue;
    pillarCounts.set(slug, (pillarCounts.get(slug) || 0) + 1);
  }
  const sortedPillars = Array.from(pillarCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  // ── Strongest pillar (weekly-stable ID, re-fires if top changes) ─────
  if (sortedPillars.length > 0) {
    const [topSlug, topCount] = sortedPillars[0];
    if (topCount >= 3) {
      const meta = resolvePillar({ pillarSlug: topSlug });
      insights.push({
        id: `strength-${topSlug}`,
        type: 'strength',
        category: topSlug,
        title: `${meta?.name || topSlug} is your strongest practice`,
        description: `You've completed it ${topCount} time${
          topCount === 1 ? '' : 's'
        }. Keep building on this momentum.`,
        data: { slug: topSlug, count: topCount },
        createdAt: nowIso,
      });
    }
  }

  // ── Weakest pillar (needs ≥3 tracked, bottom < half of top) ──────────
  if (sortedPillars.length >= 3) {
    const [, topCount] = sortedPillars[0];
    const [bottomSlug, bottomCount] = sortedPillars[sortedPillars.length - 1];
    if (bottomCount * 2 < topCount) {
      const meta = resolvePillar({ pillarSlug: bottomSlug });
      insights.push({
        id: `weakness-${bottomSlug}`,
        type: 'weakness',
        category: bottomSlug,
        title: `${meta?.name || bottomSlug} could use more attention`,
        description: `Only ${bottomCount} completion${
          bottomCount === 1 ? '' : 's'
        } so far. Consider making it a focus pillar.`,
        data: { slug: bottomSlug, count: bottomCount, topCount },
        createdAt: nowIso,
      });
    }
  }

  // ── Days since last completion of weakest pillar ─────────────────────
  if (sortedPillars.length >= 3) {
    const [bottomSlug] = sortedPillars[sortedPillars.length - 1];
    const lastForBottom = (input.checkins || [])
      .filter(
        (c: any) =>
          (c.pillarSlug || String(c.pillarId || '')) === bottomSlug && c.checkinDate,
      )
      .map((c: any) => c.checkinDate)
      .sort()
      .reverse()[0];

    if (lastForBottom) {
      const daysSince = Math.floor(
        (now.getTime() - new Date(lastForBottom).getTime()) / 86400000,
      );
      if (daysSince >= 3) {
        const meta = resolvePillar({ pillarSlug: bottomSlug });
        insights.push({
          id: `days-since-${bottomSlug}-${todayStr}`,
          type: 'recommendation',
          category: bottomSlug,
          title: `${daysSince} days since ${meta?.name || bottomSlug}`,
          description:
            "Pick it up today for a small win — it'll re-balance your week.",
          data: { slug: bottomSlug, daysSince },
          createdAt: nowIso,
        });
      }
    }
  }

  // ── Streak milestones ────────────────────────────────────────────────
  if (input.streakCurrent >= 30) {
    insights.push({
      id: 'milestone-streak-30',
      type: 'milestone',
      title: '30-day streak!',
      description: 'Incredible consistency. The habit is yours now.',
      data: { streak: input.streakCurrent },
      createdAt: nowIso,
    });
  } else if (input.streakCurrent >= 14) {
    insights.push({
      id: 'milestone-streak-14',
      type: 'milestone',
      title: '2 weeks strong',
      description: "You're past the habit-forming threshold.",
      data: { streak: input.streakCurrent },
      createdAt: nowIso,
    });
  } else if (input.streakCurrent >= 7) {
    insights.push({
      id: 'milestone-streak-7',
      type: 'milestone',
      title: 'First week complete!',
      description: 'You earned your first Karma Shield. Keep going.',
      data: { streak: input.streakCurrent },
      createdAt: nowIso,
    });
  }

  // ── Today vs week pace ───────────────────────────────────────────────
  const weeklyCompletions: number[] = [];
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - offset);
    const date = ymd(d);
    const completedSet = new Set(
      (input.checkins || [])
        .filter((c: any) => c.checkinDate === date)
        .map((c: any) => c.pillarSlug || c.pillarId),
    );
    weeklyCompletions.push(Math.round((completedSet.size / TOTAL_PILLARS) * 100));
  }
  const todayPct = weeklyCompletions[0] ?? 0;
  const weekAvg = Math.round(
    weeklyCompletions.reduce((s, v) => s + v, 0) / 7,
  );
  if (weekAvg > 30 && todayPct + 20 < weekAvg) {
    insights.push({
      id: `today-below-pace-${todayStr}`,
      type: 'recommendation',
      title: 'Today is below your weekly pace',
      description: `Week average is ${weekAvg}% but today is only ${todayPct}%. One more pillar puts you back on track.`,
      data: { todayPct, weekAvg },
      createdAt: nowIso,
    });
  }

  // ── Weekly improvement ───────────────────────────────────────────────
  const prevWeekCompletions: number[] = [];
  for (let offset = 7; offset < 14; offset++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - offset);
    const date = ymd(d);
    const completedSet = new Set(
      (input.checkins || [])
        .filter((c: any) => c.checkinDate === date)
        .map((c: any) => c.pillarSlug || c.pillarId),
    );
    prevWeekCompletions.push(Math.round((completedSet.size / TOTAL_PILLARS) * 100));
  }
  const prevWeekAvg = Math.round(
    prevWeekCompletions.reduce((s, v) => s + v, 0) / 7,
  );
  if (prevWeekAvg > 0 && weekAvg >= prevWeekAvg + 15) {
    insights.push({
      id: `weekly-improvement-${todayStr}`,
      type: 'pattern',
      title: `Your week is up ${weekAvg - prevWeekAvg}% vs last week`,
      description: `From ${prevWeekAvg}% to ${weekAvg}% average completion. Whatever you changed is working.`,
      data: { weekAvg, prevWeekAvg },
      createdAt: nowIso,
    });
  }

  // ── Journey milestones ───────────────────────────────────────────────
  if (input.journeyDay === 24) {
    insights.push({
      id: 'journey-halfway',
      type: 'milestone',
      title: 'Halfway there — Day 24 of 48',
      description: "You've crossed the midpoint of your transformation journey.",
      data: { day: 24 },
      createdAt: nowIso,
    });
  } else if (input.journeyDay >= 40 && input.journeyDay < 48) {
    const remaining = 48 - input.journeyDay;
    insights.push({
      id: 'journey-final-stretch',
      type: 'milestone',
      title: `${remaining} day${remaining === 1 ? '' : 's'} to go`,
      description: "You're in the final stretch of your 48-day transformation.",
      data: { day: input.journeyDay, remaining },
      createdAt: nowIso,
    });
  } else if (input.journeyDay >= 48) {
    insights.push({
      id: 'journey-complete',
      type: 'milestone',
      title: 'Transformation complete',
      description: 'You finished all 48 days. Reflect, celebrate, and consider what comes next.',
      data: { day: input.journeyDay },
      createdAt: nowIso,
    });
  }

  // ── Karma milestones ─────────────────────────────────────────────────
  if (input.totalKarma >= 1000) {
    insights.push({
      id: 'milestone-karma-1000',
      type: 'milestone',
      title: '1000 karma earned',
      description: 'A thousand karma points represent consistent commitment.',
      data: { totalKarma: input.totalKarma },
      createdAt: nowIso,
    });
  } else if (input.totalKarma >= 500) {
    insights.push({
      id: 'milestone-karma-500',
      type: 'milestone',
      title: '500 karma earned',
      description: "You're well into the journey — momentum is real now.",
      data: { totalKarma: input.totalKarma },
      createdAt: nowIso,
    });
  }

  // Sort by priority: milestones first, then recommendations, then patterns.
  const order: Record<InsightType, number> = {
    milestone: 0,
    recommendation: 1,
    weakness: 2,
    pattern: 3,
    strength: 4,
  };
  insights.sort((a, b) => order[a.type] - order[b.type]);

  return insights;
}
