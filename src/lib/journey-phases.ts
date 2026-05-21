// Frontend mirror of functions/lib/journey-phases.ts.
//
// Lambdas can't import from src/, so the phase definitions live in two
// places. Update both when adjusting boundaries or copy.

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
  ordinal: number;
  name: string;
  range: [number, number];
  description: string;
  recommendedPillars: string[];
  /** Subtle background tone for chips/badges. */
  tone: string;
  /** Full-weight gradient tone for the dashboard banner. Each phase owns
   *  a distinct elemental palette so "Phase 2: Cleansing" actually LOOKS
   *  different from "Phase 4: Expansion" instead of being decorative text. */
  bannerGradient: string;
  /** Optional one-line phase verb pair for the all-focus-done celebration
   *  state — concrete language that names what's stabilizing this phase. */
  completionPhrase: string;
}

const PHASES: JourneyPhase[] = [
  {
    id: 'awakening',
    ordinal: 1,
    name: 'Awakening',
    range: [1, 7],
    description: 'Building rhythm. Your nervous system begins to remember a steadier cadence.',
    recommendedPillars: ['morning-initiation', 'sleep-optimization', 'nutrition-fasting'],
    tone: 'bg-amber-50 text-amber-800 border-amber-200',
    bannerGradient: 'from-amber-500 to-orange-500',
    completionPhrase: 'Rhythm preserved.',
  },
  {
    id: 'cleansing',
    ordinal: 2,
    name: 'Cleansing',
    range: [8, 14],
    description: 'Purification. Breath and movement release what the body has been carrying.',
    recommendedPillars: ['breathing-meditation', 'movement', 'nutrition-fasting'],
    tone: 'bg-sky-50 text-sky-800 border-sky-200',
    bannerGradient: 'from-sky-500 to-cyan-500',
    completionPhrase: 'Breath cleared.',
  },
  {
    id: 'stabilization',
    ordinal: 3,
    name: 'Stabilization',
    range: [15, 21],
    description: 'Grounding the habit. Mental patterns settle as the practice becomes yours.',
    recommendedPillars: ['thoughts-intention', 'gratitude', 'breathing-meditation'],
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bannerGradient: 'from-emerald-500 to-teal-500',
    completionPhrase: 'Mind grounded.',
  },
  {
    id: 'expansion',
    ordinal: 4,
    name: 'Expansion',
    range: [22, 30],
    description: 'Energy rises. Meditation deepens; awareness widens.',
    recommendedPillars: ['healing-meditation', 'breathing-meditation', 'movement'],
    tone: 'bg-orange-50 text-orange-800 border-orange-200',
    bannerGradient: 'from-orange-500 to-amber-600',
    completionPhrase: 'Awareness widened.',
  },
  {
    id: 'alignment',
    ordinal: 5,
    name: 'Alignment',
    range: [31, 40],
    description: 'The pillars synchronize. Three-times-daily Sandhya begins to feel natural.',
    recommendedPillars: ['sandhya-meditation', 'healing-meditation', 'gratitude'],
    tone: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    bannerGradient: 'from-indigo-500 to-purple-500',
    completionPhrase: 'Practice aligned.',
  },
  {
    id: 'integration',
    ordinal: 6,
    name: 'Integration',
    range: [41, 48],
    description: 'Identity transformation. The practice and the practitioner become one.',
    recommendedPillars: ['brahman-connection', 'divine-manifestation', 'sandhya-meditation'],
    tone: 'bg-violet-50 text-violet-800 border-violet-200',
    bannerGradient: 'from-violet-500 to-amber-500',
    completionPhrase: 'Practice integrated.',
  },
];

const COMPLETED: JourneyPhase = {
  id: 'completed',
  ordinal: 7,
  name: 'Completed',
  range: [49, Infinity],
  description: 'Mandala complete. The cycle has been walked end to end.',
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
