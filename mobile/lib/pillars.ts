// Mirror of src/constants/pillars.ts — same ids/slugs/names so check-ins
// from the mobile app hit the same /data/checkin contract as the web. Icons
// are MaterialCommunityIcons names (web uses lucide-react which isn't
// native-compatible).

export type PillarCategory = "body" | "mind" | "spirit";

export interface Pillar {
  id: number;
  slug: string;
  name: string;
  sanskritName: string;
  description: string;
  icon: string; // MaterialCommunityIcons name
  color: string;
  category: PillarCategory;
  defaultDurationMinutes: number;
  karmaPointsBase: number;
}

export const PILLARS: Pillar[] = [
  {
    id: 1,
    slug: "morning-initiation",
    name: "5 AM Initiation",
    sanskritName: "Brahma Muhurta",
    description: "Activate clarity, discipline & emotional balance",
    icon: "weather-sunset-up",
    color: "#FFD700",
    category: "body",
    defaultDurationMinutes: 10,
    karmaPointsBase: 15,
  },
  {
    id: 2,
    slug: "nutrition-fasting",
    name: "Vedic Nutrition + Fasting",
    sanskritName: "Ahara Vidhi",
    description: "Plant-forward meals, aligned to circadian rhythm",
    icon: "silverware-fork-knife",
    color: "#4CAF50",
    category: "body",
    defaultDurationMinutes: 0,
    karmaPointsBase: 10,
  },
  {
    id: 3,
    slug: "thoughts-intention",
    name: "Thoughts & Intention Reset",
    sanskritName: "Sankalpa",
    description: "Replace negative patterns, build mental strength",
    icon: "brain",
    color: "#9C27B0",
    category: "mind",
    defaultDurationMinutes: 5,
    karmaPointsBase: 12,
  },
  {
    id: 4,
    slug: "breathing-meditation",
    name: "Breathing + Meditation",
    sanskritName: "Pranayama",
    description: "Stabilize stress hormones, activate focus",
    icon: "weather-windy",
    color: "#00BCD4",
    category: "mind",
    defaultDurationMinutes: 15,
    karmaPointsBase: 15,
  },
  {
    id: 5,
    slug: "movement",
    name: "Movement Everyday",
    sanskritName: "Vyayama",
    description: "Yoga, walking, strength for metabolism",
    icon: "human-handsup",
    color: "#FF5722",
    category: "body",
    defaultDurationMinutes: 30,
    karmaPointsBase: 12,
  },
  {
    id: 6,
    slug: "healing-meditation",
    name: "Healing Meditation",
    sanskritName: "Dhyana",
    description: "Inner rewiring through meditation",
    icon: "heart-pulse",
    color: "#E91E63",
    category: "mind",
    defaultDurationMinutes: 20,
    karmaPointsBase: 15,
  },
  {
    id: 7,
    slug: "gratitude",
    name: "Gratitude Practice",
    sanskritName: "Kritajnata",
    description: "Strengthen positive neural pathways",
    icon: "hand-heart",
    color: "#8BC34A",
    category: "mind",
    defaultDurationMinutes: 5,
    karmaPointsBase: 10,
  },
  {
    id: 8,
    slug: "sandhya-meditation",
    name: "Sandhya Meditation",
    sanskritName: "Sandhyavandana",
    description: "Align body rhythms with nature (3x daily)",
    icon: "white-balance-sunny",
    color: "#FFC107",
    category: "spirit",
    defaultDurationMinutes: 15,
    karmaPointsBase: 20,
  },
  {
    id: 9,
    slug: "brahman-connection",
    name: "Connection to Brahman",
    sanskritName: "Brahma Sambandha",
    description: "Expand consciousness, connect with universal energy",
    icon: "infinity",
    color: "#673AB7",
    category: "spirit",
    defaultDurationMinutes: 10,
    karmaPointsBase: 15,
  },
  {
    id: 10,
    slug: "divine-manifestation",
    name: "Divine Manifestation",
    sanskritName: "Sankalpa Shakti",
    description: "Set intentions and manifest your highest goals",
    icon: "star-shooting",
    color: "#A855F7",
    category: "spirit",
    defaultDurationMinutes: 10,
    karmaPointsBase: 12,
  },
  {
    id: 11,
    slug: "sleep-optimization",
    name: "Sleep Optimization",
    sanskritName: "Nidra",
    description: "Deep rest for cellular repair",
    icon: "weather-night",
    color: "#3F51B5",
    category: "body",
    defaultDurationMinutes: 0,
    karmaPointsBase: 10,
  },
];

export const getPillarBySlug = (slug: string): Pillar | undefined =>
  PILLARS.find((p) => p.slug === slug);

export const getPillarsByCategory = (category: PillarCategory): Pillar[] =>
  PILLARS.filter((p) => p.category === category);

export const TOTAL_JOURNEY_DAYS = 48;
