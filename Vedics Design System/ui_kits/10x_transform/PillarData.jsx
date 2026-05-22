// ===== 11 Transformation Pillars — translated from src/constants/pillars.ts =====
// Same shape, same colors, same Lucide icon names.

const PILLARS = [
  { id: 1,  slug: 'morning-initiation',  name: '5 AM Initiation',           sanskritName: 'Brahma Muhurta',     description: 'Activate clarity, discipline & emotional balance', icon: 'sunrise',          color: '#FFD700', bgClass: 'pillar-bg-yellow', category: 'body',   defaultDurationMinutes: 10, karmaPointsBase: 15, image: 'assets/pexels/pillar-morning-initiation.jpg',  practice: 'timer' },
  { id: 2,  slug: 'nutrition-fasting',   name: 'Vedic Nutrition + Fasting', sanskritName: 'Ahara Vidhi',         description: 'Plant-forward meals, aligned to circadian rhythm', icon: 'utensils',         color: '#4CAF50', bgClass: 'pillar-bg-green',  category: 'body',   defaultDurationMinutes: 0,  karmaPointsBase: 10, image: 'assets/pexels/pillar-nutrition-fasting.jpg',   practice: 'timer' },
  { id: 3,  slug: 'thoughts-intention',  name: 'Thoughts & Intention Reset',sanskritName: 'Sankalpa',            description: 'Replace negative patterns, build mental strength', icon: 'brain',            color: '#9C27B0', bgClass: 'pillar-bg-purple', category: 'mind',   defaultDurationMinutes: 5,  karmaPointsBase: 12, image: 'assets/pexels/pillar-thoughts-intention.jpg',  practice: 'journal' },
  { id: 4,  slug: 'breathing-meditation',name: 'Breathing + Meditation',    sanskritName: 'Pranayama',           description: 'Stabilize stress hormones, activate focus',        icon: 'wind',             color: '#00BCD4', bgClass: 'pillar-bg-cyan',   category: 'mind',   defaultDurationMinutes: 15, karmaPointsBase: 15, image: 'assets/pexels/pillar-breathing-meditation.jpg',practice: 'timer' },
  { id: 5,  slug: 'movement',            name: 'Movement Everyday',         sanskritName: 'Vyayama',             description: 'Yoga, walking, strength for metabolism',           icon: 'person-standing',  color: '#FF5722', bgClass: 'pillar-bg-orange', category: 'body',   defaultDurationMinutes: 30, karmaPointsBase: 12, image: 'assets/pexels/pillar-movement.jpg',            practice: 'timer' },
  { id: 6,  slug: 'healing-meditation',  name: 'Healing Meditation',        sanskritName: 'Dhyana',              description: 'Inner rewiring through meditation',                icon: 'heart',            color: '#E91E63', bgClass: 'pillar-bg-pink',   category: 'mind',   defaultDurationMinutes: 20, karmaPointsBase: 15, image: 'assets/pexels/pillar-healing-meditation.jpg',  practice: 'timer' },
  { id: 7,  slug: 'gratitude',           name: 'Gratitude Practice',        sanskritName: 'Kritajnata',          description: 'Strengthen positive neural pathways',              icon: 'hand-heart',       color: '#8BC34A', bgClass: 'pillar-bg-lime',   category: 'mind',   defaultDurationMinutes: 5,  karmaPointsBase: 10, image: 'assets/pexels/pillar-gratitude.jpg',           practice: 'journal' },
  { id: 8,  slug: 'sandhya-meditation',  name: 'Sandhya Meditation',        sanskritName: 'Sandhyavandana',      description: 'Align body rhythms with nature (3x daily)',        icon: 'sun',              color: '#FFC107', bgClass: 'pillar-bg-amber',  category: 'spirit', defaultDurationMinutes: 15, karmaPointsBase: 20, image: 'assets/pexels/pillar-sandhya-meditation.jpg',  practice: 'timer' },
  { id: 9,  slug: 'brahman-connection',  name: 'Connection to Brahman',     sanskritName: 'Brahma Sambandha',    description: 'Expand consciousness, connect with universal energy',icon: 'infinity',       color: '#673AB7', bgClass: 'pillar-bg-violet', category: 'spirit', defaultDurationMinutes: 10, karmaPointsBase: 15, image: 'assets/pexels/pillar-brahman-connection.jpg',  practice: 'detail' },
  { id: 10, slug: 'divine-manifestation',name: 'Divine Manifestation',      sanskritName: 'Sankalpa Shakti',     description: 'Set intentions and manifest your highest goals',   icon: 'sparkles',         color: '#A855F7', bgClass: 'pillar-bg-purple', category: 'spirit', defaultDurationMinutes: 10, karmaPointsBase: 12, image: 'assets/pexels/pillar-divine-manifestation.jpg',practice: 'timer' },
  { id: 11, slug: 'sleep-optimization',  name: 'Sleep Optimization',        sanskritName: 'Nidra',               description: 'Deep rest for cellular repair',                    icon: 'moon',             color: '#3F51B5', bgClass: 'pillar-bg-indigo', category: 'body',   defaultDurationMinutes: 0,  karmaPointsBase: 10, image: 'assets/pexels/pillar-sleep-optimization.jpg',  practice: 'timer' },
];

const TOTAL_JOURNEY_DAYS = 48;

// Six journey phases — mirrors src/lib/journey-phases.ts. Keep
// `recommendedPillars`, `bannerGradient`, `completionPhrase` in sync with
// the product file when adjusting copy or palette.
const PHASES = [
  { id: 'foundation',   ordinal: 1, name: 'Foundation',   description: 'Lay down rhythm — wake, breath, hydration.',         range: [1, 7],
    recommendedPillars: ['morning-initiation', 'sleep-optimization'],
    bannerClass: 'phase-1', tone: 'border-amber-300 text-amber-700',
    bannerGradient: 'from-amber-500 to-orange-500',
    completionPhrase: 'Rhythm established.' },
  { id: 'cleansing',    ordinal: 2, name: 'Cleansing',    description: 'Lighten the system — diet, pranayama, gratitude.',   range: [8, 15],
    recommendedPillars: ['breathing-meditation', 'nutrition-fasting'],
    bannerClass: 'phase-2', tone: 'border-sky-300 text-sky-700',
    bannerGradient: 'from-sky-500 to-cyan-500',
    completionPhrase: 'Breath cleared.' },
  { id: 'integration',  ordinal: 3, name: 'Integration',  description: 'Deepen practices, layer in healing meditation.',     range: [16, 23],
    recommendedPillars: ['healing-meditation', 'movement'],
    bannerClass: 'phase-3', tone: 'border-violet-300 text-violet-700',
    bannerGradient: 'from-violet-500 to-indigo-500',
    completionPhrase: 'Healing deepened.' },
  { id: 'expansion',    ordinal: 4, name: 'Expansion',    description: 'Sandhya, Brahman connection, sustained focus.',      range: [24, 31],
    recommendedPillars: ['sandhya-meditation', 'brahman-connection'],
    bannerClass: 'phase-4', tone: 'border-pink-300 text-pink-700',
    bannerGradient: 'from-pink-500 to-rose-500',
    completionPhrase: 'Awareness widened.' },
  { id: 'manifestation',ordinal: 5, name: 'Manifestation',description: 'Channel intentions outward; teach what you know.',   range: [32, 41],
    recommendedPillars: ['divine-manifestation', 'gratitude'],
    bannerClass: 'phase-5', tone: 'border-emerald-300 text-emerald-700',
    bannerGradient: 'from-emerald-500 to-teal-500',
    completionPhrase: 'Intention set.' },
  { id: 'completion',   ordinal: 6, name: 'Completion',   description: 'Reflect, integrate, prepare the next mandala.',      range: [42, 48],
    recommendedPillars: ['thoughts-intention', 'movement'],
    bannerClass: 'phase-6', tone: 'border-orange-400 text-orange-700',
    bannerGradient: 'from-amber-600 to-amber-900',
    completionPhrase: 'Mandala complete.' },
];

const COMPLETED_PHASE = {
  id: 'completed', ordinal: 7, name: 'Completed',
  description: 'Mandala walked end to end.',
  range: [49, Infinity], recommendedPillars: [],
  bannerClass: 'phase-6', tone: '',
  bannerGradient: 'from-amber-500 via-orange-500 to-violet-500',
  completionPhrase: 'Mandala walked.',
};

function getJourneyPhase(day) {
  if (!Number.isFinite(day) || day <= 0) return PHASES[0];
  for (const p of PHASES) {
    if (day >= p.range[0] && day <= p.range[1]) return p;
  }
  return COMPLETED_PHASE;
}

// Returns true when `day` is the first day of any defined phase — useful
// for triggering "Welcome to <phase>" copy. Mirrors product helper.
function isPhaseTransitionDay(day) {
  return PHASES.some(p => p.range[0] === day);
}

Object.assign(window, { PILLARS, TOTAL_JOURNEY_DAYS, PHASES, getJourneyPhase, isPhaseTransitionDay });
