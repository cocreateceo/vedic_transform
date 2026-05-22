// Six-phase transformation arc across the 48-day journey.
//
// Day 1 and Day 32 used to feel structurally identical in the UI. Phases
// give the journey shape and the Daily Brief tone. Aligned with the
// Vedics Design System kit: Foundation → Cleansing → Integration →
// Expansion → Manifestation → Completion.
//
// Mirrored at src/lib/journey-phases.ts for frontend use. Keep both in sync
// when adjusting boundaries or copy.

export type PhaseId =
  | 'foundation'
  | 'cleansing'
  | 'integration'
  | 'expansion'
  | 'manifestation'
  | 'completion'
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
    id: 'foundation',
    ordinal: 1,
    name: 'Foundation',
    range: [1, 7],
    description: 'Lay down rhythm — wake, breath, hydration.',
    recommendedPillars: ['morning-initiation', 'sleep-optimization'],
  },
  {
    id: 'cleansing',
    ordinal: 2,
    name: 'Cleansing',
    range: [8, 15],
    description: 'Lighten the system — diet, pranayama, gratitude.',
    recommendedPillars: ['breathing-meditation', 'nutrition-fasting'],
  },
  {
    id: 'integration',
    ordinal: 3,
    name: 'Integration',
    range: [16, 23],
    description: 'Deepen practices, layer in healing meditation.',
    recommendedPillars: ['healing-meditation', 'movement'],
  },
  {
    id: 'expansion',
    ordinal: 4,
    name: 'Expansion',
    range: [24, 31],
    description: 'Sandhya, Brahman connection, sustained focus.',
    recommendedPillars: ['sandhya-meditation', 'brahman-connection'],
  },
  {
    id: 'manifestation',
    ordinal: 5,
    name: 'Manifestation',
    range: [32, 41],
    description: 'Channel intentions outward; teach what you know.',
    recommendedPillars: ['divine-manifestation', 'gratitude'],
  },
  {
    id: 'completion',
    ordinal: 6,
    name: 'Completion',
    range: [42, 48],
    description: 'Reflect, integrate, prepare the next mandala.',
    recommendedPillars: ['thoughts-intention', 'movement'],
  },
];

const COMPLETED: JourneyPhase = {
  id: 'completed',
  ordinal: 7,
  name: 'Completed',
  range: [49, Infinity],
  description: 'Mandala walked end to end.',
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
