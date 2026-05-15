// Mirror of src/constants/pillars.ts shaped for backend lookups.
// Lambdas can't import from src/, so the {slug, id, karmaPointsBase} mapping
// lives here. Update both files when adding or renaming a pillar.

export interface PillarMeta {
  id: number;
  slug: string;
  karmaPointsBase: number;
  name: string;
}

const BY_SLUG: Record<string, PillarMeta> = {
  'morning-initiation':   { id: 1,  slug: 'morning-initiation',   karmaPointsBase: 15, name: '5 AM Initiation' },
  'nutrition-fasting':    { id: 2,  slug: 'nutrition-fasting',    karmaPointsBase: 10, name: 'Vedic Nutrition + Fasting' },
  'thoughts-intention':   { id: 3,  slug: 'thoughts-intention',   karmaPointsBase: 12, name: 'Thoughts & Intention Reset' },
  'breathing-meditation': { id: 4,  slug: 'breathing-meditation', karmaPointsBase: 15, name: 'Breathing + Meditation' },
  'movement':             { id: 5,  slug: 'movement',             karmaPointsBase: 12, name: 'Movement Everyday' },
  'healing-meditation':   { id: 6,  slug: 'healing-meditation',   karmaPointsBase: 15, name: 'Healing Meditation' },
  'gratitude':            { id: 7,  slug: 'gratitude',            karmaPointsBase: 10, name: 'Gratitude Practice' },
  'sandhya-meditation':   { id: 8,  slug: 'sandhya-meditation',   karmaPointsBase: 20, name: 'Sandhya Meditation' },
  'brahman-connection':   { id: 9,  slug: 'brahman-connection',   karmaPointsBase: 15, name: 'Connection to Brahman' },
  'divine-manifestation': { id: 10, slug: 'divine-manifestation', karmaPointsBase: 12, name: 'Divine Manifestation' },
  'sleep-optimization':   { id: 11, slug: 'sleep-optimization',   karmaPointsBase: 10, name: 'Sleep Optimization' },
};

export const TOTAL_PILLARS = Object.keys(BY_SLUG).length;

const BY_ID: Record<number, PillarMeta> = Object.fromEntries(
  Object.values(BY_SLUG).map((p) => [p.id, p]),
);

export function resolvePillar(input: { pillarId?: unknown; pillarSlug?: unknown }): PillarMeta | null {
  if (typeof input.pillarSlug === 'string' && BY_SLUG[input.pillarSlug]) {
    return BY_SLUG[input.pillarSlug];
  }
  if (typeof input.pillarId === 'number' && BY_ID[input.pillarId]) {
    return BY_ID[input.pillarId];
  }
  // Legacy callers pass the slug under the `pillarId` key.
  if (typeof input.pillarId === 'string' && BY_SLUG[input.pillarId]) {
    return BY_SLUG[input.pillarId];
  }
  return null;
}
