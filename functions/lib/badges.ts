// Badge catalog — hardcoded (same pattern as pillars.ts) so we don't depend
// on the Badges DynamoDB table being seeded. Add or rename a badge by
// editing this file; rules are evaluated in checkin.ts after a check-in
// is recorded, and surfaced by /data/achievements + /data/reports.

export type BadgeRequirement =
  | { type: 'first-checkin'; value: number }      // n total check-ins ever
  | { type: 'streak'; value: number }             // current streak >= n
  | { type: 'journey'; value: number }            // journey day >= n
  | { type: 'pillar-mastery'; value: number }     // any single pillar completed n times
  | { type: 'pillar-polymath'; value: number }    // at least n different pillars at 10+ each
  | { type: 'karma'; value: number };             // total karma >= n

export interface BadgeDef {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  karmaBonus: number;
  /** JSON-encoded BadgeRequirement. Stored as a string so the field
   *  shape matches the legacy DynamoDB Badges table. */
  requirement: string;
}

function req(r: BadgeRequirement): string {
  return JSON.stringify(r);
}

export const BADGES: BadgeDef[] = [
  // ── Streak badges ─────────────────────────────────────────────────────────
  {
    id: 'streak-first-step',
    slug: 'first-step',
    name: 'First Step',
    description: 'Complete your first check-in',
    icon: 'sparkles',
    color: '#FFD700',
    karmaBonus: 5,
    requirement: req({ type: 'first-checkin', value: 1 }),
  },
  {
    id: 'streak-spark',
    slug: 'spark',
    name: 'Spark',
    description: 'Maintain a 3-day streak',
    icon: 'flame',
    color: '#FF9933',
    karmaBonus: 10,
    requirement: req({ type: 'streak', value: 3 }),
  },
  {
    id: 'streak-lit',
    slug: 'lit',
    name: 'Lit',
    description: 'Maintain a 7-day streak — Karma Shield unlocked',
    icon: 'flame',
    color: '#FF6B00',
    karmaBonus: 20,
    requirement: req({ type: 'streak', value: 7 }),
  },
  {
    id: 'streak-strong-flame',
    slug: 'strong-flame',
    name: 'Strong Flame',
    description: 'Maintain a 14-day streak — past the habit-forming threshold',
    icon: 'flame',
    color: '#E91E63',
    karmaBonus: 30,
    requirement: req({ type: 'streak', value: 14 }),
  },
  {
    id: 'streak-eternal-fire',
    slug: 'eternal-fire',
    name: 'Eternal Fire',
    description: 'Maintain a 30-day streak — the habit is yours',
    icon: 'flame',
    color: '#9C27B0',
    karmaBonus: 50,
    requirement: req({ type: 'streak', value: 30 }),
  },

  // ── Journey milestone badges ──────────────────────────────────────────────
  {
    id: 'journey-halfway',
    slug: 'halfway',
    name: 'Halfway There',
    description: 'Reach Day 24 of your 48-day journey',
    icon: 'target',
    color: '#FFD700',
    karmaBonus: 40,
    requirement: req({ type: 'journey', value: 24 }),
  },
  {
    id: 'journey-complete',
    slug: 'transformation',
    name: 'Transformation Complete',
    description: 'Reach Day 48 — the full Vedic transformation',
    icon: 'trophy',
    color: '#DAA520',
    karmaBonus: 100,
    requirement: req({ type: 'journey', value: 48 }),
  },

  // ── Mastery badges ────────────────────────────────────────────────────────
  {
    id: 'mastery-pillar-master',
    slug: 'pillar-master',
    name: 'Pillar Master',
    description: 'Complete any single pillar 10 times',
    icon: 'star',
    color: '#FFD700',
    karmaBonus: 25,
    requirement: req({ type: 'pillar-mastery', value: 10 }),
  },
  {
    id: 'mastery-polymath',
    slug: 'polymath',
    name: 'Pillar Polymath',
    description: 'Reach 10+ completions on 3 different pillars',
    icon: 'star',
    color: '#9C27B0',
    karmaBonus: 50,
    requirement: req({ type: 'pillar-polymath', value: 3 }),
  },

  // ── Karma milestone badges (bonus is 0 to prevent runaway loops) ─────────
  {
    id: 'karma-centurion',
    slug: 'centurion',
    name: 'Centurion',
    description: 'Earn 100 karma points',
    icon: 'sparkles',
    color: '#4CAF50',
    karmaBonus: 0,
    requirement: req({ type: 'karma', value: 100 }),
  },
  {
    id: 'karma-adept',
    slug: 'karma-adept',
    name: 'Karma Adept',
    description: 'Earn 500 karma points',
    icon: 'sparkles',
    color: '#00BCD4',
    karmaBonus: 0,
    requirement: req({ type: 'karma', value: 500 }),
  },
  {
    id: 'karma-master',
    slug: 'karma-master',
    name: 'Karma Master',
    description: 'Earn 1000 karma points',
    icon: 'sparkles',
    color: '#673AB7',
    karmaBonus: 0,
    requirement: req({ type: 'karma', value: 1000 }),
  },
];

export function parseRequirement(r: string): BadgeRequirement | null {
  try {
    const parsed = JSON.parse(r);
    if (parsed && typeof parsed === 'object' && typeof parsed.type === 'string') {
      return parsed as BadgeRequirement;
    }
  } catch {}
  return null;
}

export function getBadgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}
