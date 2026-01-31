import {
  Sunrise,
  Utensils,
  Brain,
  Wind,
  PersonStanding,
  Heart,
  Sun,
  HandHeart,
  Infinity,
  Sparkles,
  Moon,
} from "lucide-react";

export type PillarCategory = "body" | "mind" | "spirit";

export interface Pillar {
  id: number;
  slug: string;
  name: string;
  sanskritName: string;
  description: string;
  icon: typeof Sunrise;
  color: string;
  bgColor: string;
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
    icon: Sunrise,
    color: "#FFD700",
    bgColor: "bg-yellow-500/20",
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
    icon: Utensils,
    color: "#4CAF50",
    bgColor: "bg-green-500/20",
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
    icon: Brain,
    color: "#9C27B0",
    bgColor: "bg-purple-500/20",
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
    icon: Wind,
    color: "#00BCD4",
    bgColor: "bg-cyan-500/20",
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
    icon: PersonStanding,
    color: "#FF5722",
    bgColor: "bg-orange-500/20",
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
    icon: Heart,
    color: "#E91E63",
    bgColor: "bg-pink-500/20",
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
    icon: HandHeart,
    color: "#8BC34A",
    bgColor: "bg-lime-500/20",
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
    icon: Sun,
    color: "#FFC107",
    bgColor: "bg-amber-500/20",
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
    icon: Infinity,
    color: "#673AB7",
    bgColor: "bg-violet-500/20",
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
    icon: Sparkles,
    color: "#A855F7",
    bgColor: "bg-purple-500/20",
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
    icon: Moon,
    color: "#3F51B5",
    bgColor: "bg-indigo-500/20",
    category: "body",
    defaultDurationMinutes: 0,
    karmaPointsBase: 10,
  },
];

export const getPillarBySlug = (slug: string): Pillar | undefined => {
  return PILLARS.find((p) => p.slug === slug);
};

export const getPillarsByCategory = (category: PillarCategory): Pillar[] => {
  return PILLARS.filter((p) => p.category === category);
};

export const TOTAL_JOURNEY_DAYS = 48;
