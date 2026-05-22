// Frontend mirror of functions/lib/journey-phases.ts.
//
// Lambdas can't import from src/, so the phase definitions live in two
// places. Update both when adjusting boundaries or copy.
//
// Phase names + ranges + gradient palette aligned to the canonical Vedics
// Design System kit (Foundation → Cleansing → Integration → Expansion →
// Manifestation → Completion).

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
  ordinal: number;
  name: string;
  range: [number, number];
  description: string;
  recommendedPillars: string[];
  /** Subtle background tone for chips/badges. */
  tone: string;
  /** Full-weight gradient tone for the dashboard banner. Each phase owns
   *  a distinct elemental palette so the dashboard literally changes
   *  color when the user crosses into a new phase. */
  bannerGradient: string;
  /** Short phase-specific phrase shown on the focus-complete celebration
   *  card. Concrete and grounded; not "consciousness expanding" talk. */
  completionPhrase: string;
}

const PHASES: JourneyPhase[] = [
  {
    id: 'foundation',
    ordinal: 1,
    name: 'Foundation',
    range: [1, 7],
    description: 'Lay down rhythm — wake, breath, hydration.',
    recommendedPillars: ['morning-initiation', 'sleep-optimization'],
    tone: 'bg-amber-50 text-amber-800 border-amber-200',
    bannerGradient: 'from-amber-500 to-orange-500',
    completionPhrase: 'Rhythm established.',
  },
  {
    id: 'cleansing',
    ordinal: 2,
    name: 'Cleansing',
    range: [8, 15],
    description: 'Lighten the system — diet, pranayama, gratitude.',
    recommendedPillars: ['breathing-meditation', 'nutrition-fasting'],
    tone: 'bg-sky-50 text-sky-800 border-sky-200',
    bannerGradient: 'from-sky-500 to-cyan-500',
    completionPhrase: 'Breath cleared.',
  },
  {
    id: 'integration',
    ordinal: 3,
    name: 'Integration',
    range: [16, 23],
    description: 'Deepen practices, layer in healing meditation.',
    recommendedPillars: ['healing-meditation', 'movement'],
    tone: 'bg-violet-50 text-violet-800 border-violet-200',
    bannerGradient: 'from-violet-500 to-indigo-500',
    completionPhrase: 'Healing deepened.',
  },
  {
    id: 'expansion',
    ordinal: 4,
    name: 'Expansion',
    range: [24, 31],
    description: 'Sandhya, Brahman connection, sustained focus.',
    recommendedPillars: ['sandhya-meditation', 'brahman-connection'],
    tone: 'bg-pink-50 text-pink-800 border-pink-200',
    bannerGradient: 'from-pink-500 to-rose-500',
    completionPhrase: 'Awareness widened.',
  },
  {
    id: 'manifestation',
    ordinal: 5,
    name: 'Manifestation',
    range: [32, 41],
    description: 'Channel intentions outward; teach what you know.',
    recommendedPillars: ['divine-manifestation', 'gratitude'],
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bannerGradient: 'from-emerald-500 to-teal-500',
    completionPhrase: 'Intention set.',
  },
  {
    id: 'completion',
    ordinal: 6,
    name: 'Completion',
    range: [42, 48],
    description: 'Reflect, integrate, prepare the next mandala.',
    recommendedPillars: ['thoughts-intention', 'movement'],
    tone: 'bg-orange-50 text-orange-900 border-orange-300',
    bannerGradient: 'from-amber-600 to-amber-900',
    completionPhrase: 'Mandala complete.',
  },
];

const COMPLETED: JourneyPhase = {
  id: 'completed',
  ordinal: 7,
  name: 'Completed',
  range: [49, Infinity],
  description: 'Mandala walked end to end.',
  recommendedPillars: [],
  tone: 'bg-gradient-to-r from-amber-50 to-violet-50 text-amber-900 border-amber-200',
  bannerGradient: 'from-amber-500 via-orange-500 to-violet-500',
  completionPhrase: 'Mandala walked.',
};

export const ALL_PHASES = PHASES;

export function getJourneyPhase(day: number): JourneyPhase {
  if (!Number.isFinite(day) || day <= 0) return PHASES[0];
  for (const p of PHASES) {
    if (day >= p.range[0] && day <= p.range[1]) return p;
  }
  return COMPLETED;
}

export function isPhaseTransitionDay(day: number): boolean {
  return PHASES.some((p) => p.range[0] === day);
}
