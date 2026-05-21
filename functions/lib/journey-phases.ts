// Six-phase transformation arc across the 48-day journey.
//
// Day 1 and Day 32 used to feel structurally identical in the UI. Phases
// give the journey shape and the Daily Brief tone — Awakening (rhythm),
// Cleansing (purification), Stabilization (grounding), Expansion (energy),
// Alignment (synchronization), Integration (identity).
//
// Mirrored at src/lib/journey-phases.ts for frontend use. Keep both in sync
// when adjusting boundaries or copy.

export type PhaseId =
  | 'awakening'
  | 'cleansing'
  | 'stabilization'
  | 'expansion'
  | 'alignment'
  | 'integration'
  | 'completed';

export interface JourneyPhase {
  id: PhaseId;
  /** Sequential ordinal: 1..6. `completed` returns 7. */
  ordinal: number;
  name: string;
  /** Inclusive day range; `completed` returns [49, Infinity]. */
  range: [number, number];
  /** One-line description of what the phase is about — used in the brief. */
  description: string;
  /** Recommended-pillar slugs that surface in this phase's "Recommended"
   *  tier on the Pillars page. Always 1–3 entries. */
  recommendedPillars: string[];
}

const PHASES: JourneyPhase[] = [
  {
    id: 'awakening',
    ordinal: 1,
    name: 'Awakening',
    range: [1, 7],
    description: 'Building rhythm. Your nervous system begins to remember a steadier cadence.',
    recommendedPillars: ['morning-initiation', 'sleep-optimization', 'nutrition-fasting'],
  },
  {
    id: 'cleansing',
    ordinal: 2,
    name: 'Cleansing',
    range: [8, 14],
    description: 'Purification. Breath and movement release what the body has been carrying.',
    recommendedPillars: ['breathing-meditation', 'movement', 'nutrition-fasting'],
  },
  {
    id: 'stabilization',
    ordinal: 3,
    name: 'Stabilization',
    range: [15, 21],
    description: 'Grounding the habit. Mental patterns settle as the practice becomes yours.',
    recommendedPillars: ['thoughts-intention', 'gratitude', 'breathing-meditation'],
  },
  {
    id: 'expansion',
    ordinal: 4,
    name: 'Expansion',
    range: [22, 30],
    description: 'Energy rises. Meditation deepens; awareness widens.',
    recommendedPillars: ['healing-meditation', 'breathing-meditation', 'movement'],
  },
  {
    id: 'alignment',
    ordinal: 5,
    name: 'Alignment',
    range: [31, 40],
    description: 'The pillars synchronize. Three-times-daily rhythm of Sandhya begins to feel natural.',
    recommendedPillars: ['sandhya-meditation', 'healing-meditation', 'gratitude'],
  },
  {
    id: 'integration',
    ordinal: 6,
    name: 'Integration',
    range: [41, 48],
    description: 'Identity transformation. The practice and the practitioner become one.',
    recommendedPillars: ['brahman-connection', 'divine-manifestation', 'sandhya-meditation'],
  },
];

const COMPLETED: JourneyPhase = {
  id: 'completed',
  ordinal: 7,
  name: 'Completed',
  range: [49, Infinity],
  description: 'Mandala complete. The cycle has been walked end to end.',
  recommendedPillars: [],
};

export const ALL_PHASES = PHASES;

/**
 * Returns the phase for a given journey day (1-based). Days outside any
 * defined phase fall to `completed`. Day 0 (no active journey) returns
 * the first phase as a neutral default so UI consumers can still render.
 */
export function getJourneyPhase(day: number): JourneyPhase {
  if (!Number.isFinite(day) || day <= 0) return PHASES[0];
  for (const p of PHASES) {
    if (day >= p.range[0] && day <= p.range[1]) return p;
  }
  return COMPLETED;
}

/**
 * Returns true if the given calendar day is the *first* day of a phase.
 * Useful for triggering "Welcome to <phase>" copy or notifications.
 */
export function isPhaseTransitionDay(day: number): boolean {
  return PHASES.some((p) => p.range[0] === day);
}
