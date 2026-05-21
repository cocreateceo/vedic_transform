// User Context Pack — the load-bearing helper for every Phase 2 AI feature
// (daily brief, mood analysis, recovery coach, smart reminder timing, …).
//
// Fans out the per-user DynamoDB queries once and returns a bounded,
// LLM-pasteable snapshot of the user. Every future AI feature should call
// this instead of repeating the fan-out — that keeps the per-user query
// surface in one place and the snapshot small enough to fit in a prompt.
//
// Design spec: docs/superpowers/specs/2026-05-19-user-context-pack-and-daily-brief-design.md

import { Resource } from 'sst';
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from './utils';
import { resolvePillar, TOTAL_PILLARS } from './pillars';
import { getJourneyPhase, type PhaseId } from './journey-phases';

const TOTAL_JOURNEY_DAYS = 48;
const DAY_MS = 86400000;

export type LifecycleState =
  | 'registered'
  | 'new'
  | 'active'
  | 'at-risk'
  | 'dormant'
  | 'completed';

export type DoshaType =
  | 'vata'
  | 'pitta'
  | 'kapha'
  | 'vata-pitta'
  | 'pitta-kapha'
  | 'vata-kapha'
  | 'tridosha'
  | string
  | null;

export interface UserContextPack {
  user: {
    id: string;
    name: string | null;
    email: string;
    dosha: DoshaType;
    doshaSecondary: string | null;
    createdAt: string;
    onboardingCompleted: boolean;
  };

  journey: {
    isActive: boolean;
    day: number;
    totalDays: typeof TOTAL_JOURNEY_DAYS;
    startDate: string | null;
    status: 'not-started' | 'active' | 'completed';
    /** Six-phase transformation arc — same boundaries shared with the
     *  frontend mirror at src/lib/journey-phases.ts. Lets the Daily Brief
     *  and any downstream consumer reason about "where in the arc" without
     *  re-computing from day. */
    phase: {
      id: PhaseId;
      ordinal: number;
      name: string;
      description: string;
      range: [number, number];
      recommendedPillars: string[];
    };
  };

  streak: {
    current: number;
    longest: number;
    shieldsAvailable: number;
    lastCheckinDate: string | null;
    daysSinceLastCheckin: number | null;
  };

  focusPillars: Array<{
    pillarId: string;
    pillarSlug: string | null;
    pillarName: string | null;
    priority: number;
  }>;

  pillarStats: {
    completedToday: string[];
    weeklyCompletionPct: number;
    strongestPillarSlug: string | null;
    weakestPillarSlug: string | null;
    daysSinceWeakest: number | null;
  };

  recentMood: {
    last7Avg: {
      moodScore: number | null;
      energy: number | null;
      stress: number | null;
      sleepQuality: number | null;
    };
    lastEntry: { date: string; notes: string | null } | null;
    count7d: number;
  };

  recentJournal: {
    gratitude: Array<{ date: string; lines: string[] }>;
    intentions: Array<{ date: string; text: string }>;
    manifestations: Array<{
      title: string;
      description: string | null;
      isAchieved: boolean;
    }>;
  };

  lastAssessment: {
    date: string;
    type: string;
    overallWellbeing: number | null;
    stressLevel: number;
    sleepQuality: number;
    energyLevel: number;
    mentalClarity: number;
    physicalFitness: number;
    emotionalStability: number;
    spiritualConnection: number;
    lifeSatisfaction: number;
    oneWordFeeling: string | null;
  } | null;

  karma: {
    total: number;
    todayEarned: number;
    last7Earned: number;
  };

  lifecycleState: LifecycleState;

  generatedAt: string;
  todayUtcDate: string;

  // Internal-only — exposed so consumers like analyzeInsights() can read the
  // raw row shape it expects without re-querying. Stripped before the HTTP
  // response is sent to the client.
  _raw: {
    checkins: any[];
    checkins7d: any[];
  };
}

function ymd(d: Date): string {
  return d.toISOString().split('T')[0];
}

function avgOf(items: any[], key: string): number | null {
  const nums = items
    .map((m: any) => m[key])
    .filter((v: any) => typeof v === 'number');
  if (nums.length === 0) return null;
  return (
    Math.round(
      (nums.reduce((s: number, v: number) => s + v, 0) / nums.length) * 10,
    ) / 10
  );
}

export async function getUserContextPack(userId: string): Promise<UserContextPack> {
  const now = new Date();
  const todayUtcDate = ymd(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
  const sevenDaysAgoStr = ymd(sevenDaysAgo);

  const [
    userRes,
    journeysRes,
    streaksRes,
    focusRes,
    checkinsRes,
    moodRes,
    gratitudeRes,
    intentionsRes,
    manifestationsRes,
    assessmentsRes,
    karmaRes,
  ] = await Promise.all([
    db.send(
      new GetCommand({
        TableName: Resource.Users.name,
        Key: { id: userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.Journeys.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.Streaks.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.FocusPillars.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.DailyCheckins.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.MoodLogs.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        FilterExpression: 'logDate >= :cutoff',
        ExpressionAttributeValues: { ':u': userId, ':cutoff': sevenDaysAgoStr },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.GratitudeEntries.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.Intentions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.Manifestations.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.SelfAssessments.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: Resource.KarmaTransactions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }),
    ),
  ]);

  // ── User ────────────────────────────────────────────────────────────
  const userRow: any = userRes.Item || { id: userId, email: '' };

  // ── Journey ─────────────────────────────────────────────────────────
  const journeyItems = journeysRes.Items || [];
  const activeJourney = journeyItems.find((j: any) => j.isActive);
  let journeyDay = 0;
  let journeyStatus: 'not-started' | 'active' | 'completed' = 'not-started';
  if (activeJourney?.startDate) {
    journeyDay = Math.min(
      Math.floor(
        (now.getTime() - new Date(activeJourney.startDate).getTime()) / DAY_MS,
      ) + 1,
      TOTAL_JOURNEY_DAYS,
    );
    journeyStatus = journeyDay >= TOTAL_JOURNEY_DAYS ? 'completed' : 'active';
  } else if (journeyItems.length > 0) {
    journeyStatus = 'completed';
  }

  // ── Streak ──────────────────────────────────────────────────────────
  const streakItem =
    (streaksRes.Items || [])
      .slice()
      .sort((a: any, b: any) =>
        (b.updatedAt || '').localeCompare(a.updatedAt || ''),
      )[0] || null;
  const lastCheckinDate: string | null = streakItem?.lastCheckin || null;
  const daysSinceLastCheckin = lastCheckinDate
    ? Math.floor(
        (now.getTime() - new Date(lastCheckinDate).getTime()) / DAY_MS,
      )
    : null;

  // ── Focus pillars ───────────────────────────────────────────────────
  const focusItems = (focusRes.Items || [])
    .slice()
    .sort((a: any, b: any) => (a.priority ?? 99) - (b.priority ?? 99));
  const focusPillars = focusItems.map((f: any) => {
    const meta = resolvePillar({ pillarId: f.pillarId });
    return {
      pillarId: String(f.pillarId),
      pillarSlug: meta?.slug ?? null,
      pillarName: meta?.name ?? null,
      priority: f.priority ?? 99,
    };
  });

  // ── Pillar stats ────────────────────────────────────────────────────
  const allCheckins = checkinsRes.Items || [];
  const checkins7d = allCheckins.filter(
    (c: any) => c.checkinDate && c.checkinDate >= sevenDaysAgoStr,
  );

  const completedToday = Array.from(
    new Set(
      allCheckins
        .filter((c: any) => c.checkinDate === todayUtcDate)
        .map((c: any) => c.pillarSlug || String(c.pillarId || ''))
        .filter(Boolean),
    ),
  );

  const weeklyCompletedSet = new Set<string>();
  for (const c of checkins7d) {
    const slug = c.pillarSlug || String(c.pillarId || '');
    if (slug && c.checkinDate) weeklyCompletedSet.add(`${c.checkinDate}-${slug}`);
  }
  const weeklyCompletionPct = Math.round(
    (weeklyCompletedSet.size / (7 * TOTAL_PILLARS)) * 100,
  );

  const pillarCounts = new Map<string, number>();
  for (const c of allCheckins) {
    const slug = c.pillarSlug || String(c.pillarId || '');
    if (!slug) continue;
    pillarCounts.set(slug, (pillarCounts.get(slug) || 0) + 1);
  }
  const sortedPillars = Array.from(pillarCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  const strongestPillarSlug = sortedPillars[0]?.[0] ?? null;
  const weakestPillarSlug =
    sortedPillars.length >= 3
      ? sortedPillars[sortedPillars.length - 1][0]
      : null;

  let daysSinceWeakest: number | null = null;
  if (weakestPillarSlug) {
    const lastForWeakest = allCheckins
      .filter(
        (c: any) =>
          (c.pillarSlug || String(c.pillarId || '')) === weakestPillarSlug,
      )
      .map((c: any) => c.checkinDate)
      .filter(Boolean)
      .sort()
      .reverse()[0];
    if (lastForWeakest) {
      daysSinceWeakest = Math.floor(
        (now.getTime() - new Date(lastForWeakest).getTime()) / DAY_MS,
      );
    }
  }

  // ── Mood (last 7d) ──────────────────────────────────────────────────
  const moodItems = (moodRes.Items || [])
    .slice()
    .sort((a: any, b: any) =>
      (b.logDate || '').localeCompare(a.logDate || ''),
    );
  const recentMood = {
    last7Avg: {
      moodScore: avgOf(moodItems, 'moodScore'),
      energy: avgOf(moodItems, 'energy'),
      stress: avgOf(moodItems, 'stress'),
      sleepQuality: avgOf(moodItems, 'sleepQuality'),
    },
    lastEntry: moodItems[0]
      ? { date: moodItems[0].logDate, notes: moodItems[0].notes ?? null }
      : null,
    count7d: moodItems.length,
  };

  // ── Journal (last 3 each) ───────────────────────────────────────────
  const recentGratitude = (gratitudeRes.Items || [])
    .slice()
    .sort((a: any, b: any) =>
      (b.entryDate || '').localeCompare(a.entryDate || ''),
    )
    .slice(0, 3)
    .map((g: any) => ({
      date: g.entryDate,
      lines: [g.gratitude1, g.gratitude2, g.gratitude3].filter(
        (l: any): l is string => typeof l === 'string' && l.length > 0,
      ),
    }));
  const recentIntentions = (intentionsRes.Items || [])
    .slice()
    .sort((a: any, b: any) =>
      (b.intentionDate || '').localeCompare(a.intentionDate || ''),
    )
    .slice(0, 3)
    .map((i: any) => ({
      date: i.intentionDate,
      text: i.intentionText ?? '',
    }));
  const recentManifestations = (manifestationsRes.Items || [])
    .slice()
    .sort((a: any, b: any) =>
      (b.createdAt || '').localeCompare(a.createdAt || ''),
    )
    .slice(0, 3)
    .map((m: any) => ({
      title: m.title ?? '',
      description: m.description ?? null,
      isAchieved: Boolean(m.isAchieved),
    }));

  // ── Last assessment ─────────────────────────────────────────────────
  const sortedAssessments = (assessmentsRes.Items || [])
    .slice()
    .sort((a: any, b: any) =>
      (b.assessmentDate || '').localeCompare(a.assessmentDate || ''),
    );
  const lastA = sortedAssessments[0];
  const lastAssessment = lastA
    ? {
        date: lastA.assessmentDate,
        type: lastA.assessmentType,
        overallWellbeing: lastA.overallWellbeing ?? null,
        stressLevel: lastA.stressLevel,
        sleepQuality: lastA.sleepQuality,
        energyLevel: lastA.energyLevel,
        mentalClarity: lastA.mentalClarity,
        physicalFitness: lastA.physicalFitness,
        emotionalStability: lastA.emotionalStability,
        spiritualConnection: lastA.spiritualConnection,
        lifeSatisfaction: lastA.lifeSatisfaction,
        oneWordFeeling: lastA.oneWordFeeling ?? null,
      }
    : null;

  // ── Karma ───────────────────────────────────────────────────────────
  const allKarma = karmaRes.Items || [];
  const totalKarma = allKarma.reduce(
    (s: number, t: any) => s + (t.points || 0),
    0,
  );
  const todayEarned = allKarma
    .filter((t: any) =>
      typeof t.createdAt === 'string' && t.createdAt.startsWith(todayUtcDate),
    )
    .reduce((s: number, t: any) => s + (t.points || 0), 0);
  const sevenDayCutoffMs = sevenDaysAgo.getTime();
  const last7Earned = allKarma
    .filter(
      (t: any) =>
        t.createdAt && new Date(t.createdAt).getTime() >= sevenDayCutoffMs,
    )
    .reduce((s: number, t: any) => s + (t.points || 0), 0);

  // ── Lifecycle state ─────────────────────────────────────────────────
  // Order matters: completed > registered > new > dormant > at-risk > active.
  let lifecycleState: LifecycleState;
  if (journeyStatus === 'completed') {
    lifecycleState = 'completed';
  } else if (!activeJourney) {
    lifecycleState = 'registered';
  } else if (allCheckins.length === 0) {
    lifecycleState = 'new';
  } else if (daysSinceLastCheckin === null || daysSinceLastCheckin >= 3) {
    lifecycleState = 'dormant';
  } else if (daysSinceLastCheckin >= 1) {
    lifecycleState = 'at-risk';
  } else {
    lifecycleState = 'active';
  }

  return {
    user: {
      id: userId,
      name: userRow.name ?? null,
      email: userRow.email ?? '',
      dosha: (userRow.doshaType ?? null) as DoshaType,
      doshaSecondary: userRow.doshaSecondary ?? null,
      createdAt: userRow.createdAt ?? new Date(0).toISOString(),
      onboardingCompleted: Boolean(userRow.onboardingCompleted),
    },
    journey: {
      isActive: Boolean(activeJourney),
      day: journeyDay,
      totalDays: TOTAL_JOURNEY_DAYS,
      startDate: activeJourney?.startDate ?? null,
      status: journeyStatus,
      phase: (() => {
        const p = getJourneyPhase(journeyDay);
        return {
          id: p.id,
          ordinal: p.ordinal,
          name: p.name,
          description: p.description,
          range: p.range,
          recommendedPillars: p.recommendedPillars,
        };
      })(),
    },
    streak: {
      current: streakItem?.currentStreak || 0,
      longest: streakItem?.longestStreak || 0,
      shieldsAvailable: streakItem?.shields || 0,
      lastCheckinDate,
      daysSinceLastCheckin,
    },
    focusPillars,
    pillarStats: {
      completedToday,
      weeklyCompletionPct,
      strongestPillarSlug,
      weakestPillarSlug,
      daysSinceWeakest,
    },
    recentMood,
    recentJournal: {
      gratitude: recentGratitude,
      intentions: recentIntentions,
      manifestations: recentManifestations,
    },
    lastAssessment,
    karma: {
      total: totalKarma,
      todayEarned,
      last7Earned,
    },
    lifecycleState,
    generatedAt: now.toISOString(),
    todayUtcDate,
    _raw: {
      checkins: allCheckins,
      checkins7d,
    },
  };
}
