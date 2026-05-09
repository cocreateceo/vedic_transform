// Mirror of src/constants/pillars.ts shaped for backend lookups.
// Lambdas can't import from src/, so the {slug, id, karmaPointsBase} mapping
// lives here. Update both files when adding or renaming a pillar.

export interface PillarMeta {
  id: number;
  slug: string;
  karmaPointsBase: number;
}

const BY_SLUG: Record<string, PillarMeta> = {
  'morning-initiation':   { id: 1,  slug: 'morning-initiation',   karmaPointsBase: 15 },
  'nutrition-fasting':    { id: 2,  slug: 'nutrition-fasting',    karmaPointsBase: 10 },
  'thoughts-intention':   { id: 3,  slug: 'thoughts-intention',   karmaPointsBase: 12 },
  'breathing-meditation': { id: 4,  slug: 'breathing-meditation', karmaPointsBase: 15 },
  'movement':             { id: 5,  slug: 'movement',             karmaPointsBase: 12 },
  'healing-meditation':   { id: 6,  slug: 'healing-meditation',   karmaPointsBase: 15 },
  'gratitude':            { id: 7,  slug: 'gratitude',            karmaPointsBase: 10 },
  'sandhya-meditation':   { id: 8,  slug: 'sandhya-meditation',   karmaPointsBase: 20 },
  'brahman-connection':   { id: 9,  slug: 'brahman-connection',   karmaPointsBase: 15 },
  'divine-manifestation': { id: 10, slug: 'divine-manifestation', karmaPointsBase: 12 },
  'sleep-optimization':   { id: 11, slug: 'sleep-optimization',   karmaPointsBase: 10 },
};

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
