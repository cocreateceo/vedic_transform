// Shared dosha quiz data + scoring. Used by both the authenticated
// /(main)/dosha-assessment route and the public /(public)/dosha-test
// funnel.

export type DoshaName = "vata" | "pitta" | "kapha";

export interface DoshaQuestion {
  id: string;
  question: string;
  category: string;
  options: { label: string; vata: number; pitta: number; kapha: number }[];
}

export const DOSHA_QUESTIONS: DoshaQuestion[] = [
  {
    id: "body-frame",
    question: "What best describes your body frame?",
    category: "Physical",
    options: [
      { label: "Thin, light, and lean with narrow shoulders", vata: 3, pitta: 0, kapha: 0 },
      { label: "Medium build, muscular, well-proportioned", vata: 0, pitta: 3, kapha: 0 },
      { label: "Broad, solid, naturally strong and sturdy", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "skin-type",
    question: "How would you describe your skin?",
    category: "Physical",
    options: [
      { label: "Dry, rough, cool to touch, prone to cracking", vata: 3, pitta: 0, kapha: 0 },
      { label: "Warm, oily, sensitive, prone to redness/rashes", vata: 0, pitta: 3, kapha: 0 },
      { label: "Thick, smooth, soft, cool and moist", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "hair-type",
    question: "What is your hair like?",
    category: "Physical",
    options: [
      { label: "Dry, thin, frizzy, or curly", vata: 3, pitta: 0, kapha: 0 },
      { label: "Fine, straight, oily, early greying or thinning", vata: 0, pitta: 3, kapha: 0 },
      { label: "Thick, wavy, lustrous, and strong", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "appetite",
    question: "How is your appetite?",
    category: "Digestion",
    options: [
      { label: "Irregular — sometimes ravenous, sometimes no appetite", vata: 3, pitta: 0, kapha: 0 },
      { label: "Strong and sharp — I get irritable if I miss a meal", vata: 0, pitta: 3, kapha: 0 },
      { label: "Steady but moderate — I can easily skip meals", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "digestion",
    question: "How is your digestion?",
    category: "Digestion",
    options: [
      { label: "Irregular with gas, bloating, or constipation", vata: 3, pitta: 0, kapha: 0 },
      { label: "Fast — occasional acid reflux or loose stools", vata: 0, pitta: 3, kapha: 0 },
      { label: "Slow but steady — feel heavy after large meals", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "sleep-pattern",
    question: "How do you sleep?",
    category: "Sleep",
    options: [
      { label: "Light sleeper, wake easily, difficulty falling asleep", vata: 3, pitta: 0, kapha: 0 },
      { label: "Moderate — sleep well but may wake from heat or dreams", vata: 0, pitta: 3, kapha: 0 },
      { label: "Deep and heavy sleeper, hard to wake up", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "energy-pattern",
    question: "How does your energy fluctuate through the day?",
    category: "Energy",
    options: [
      { label: "Bursts of energy followed by fatigue — very variable", vata: 3, pitta: 0, kapha: 0 },
      { label: "High and focused energy, but can burn out intensely", vata: 0, pitta: 3, kapha: 0 },
      { label: "Steady and enduring — slow to start but long-lasting", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "mind-nature",
    question: "How does your mind typically work?",
    category: "Mental",
    options: [
      { label: "Quick, restless, many ideas, hard to focus", vata: 3, pitta: 0, kapha: 0 },
      { label: "Sharp, focused, analytical, sometimes critical", vata: 0, pitta: 3, kapha: 0 },
      { label: "Calm, steady, methodical, sometimes slow to decide", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "stress-response",
    question: "How do you respond to stress?",
    category: "Emotional",
    options: [
      { label: "Anxiety, worry, fear — I overthink and get nervous", vata: 3, pitta: 0, kapha: 0 },
      { label: "Irritation, anger, frustration — I get heated", vata: 0, pitta: 3, kapha: 0 },
      { label: "Withdrawal, avoidance, comfort-seeking — I shut down", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "weather-preference",
    question: "What weather do you dislike most?",
    category: "Physical",
    options: [
      { label: "Cold, dry, and windy weather", vata: 3, pitta: 0, kapha: 0 },
      { label: "Hot, humid, and sunny weather", vata: 0, pitta: 3, kapha: 0 },
      { label: "Cold, damp, and rainy weather", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "learning-style",
    question: "How do you learn best?",
    category: "Mental",
    options: [
      { label: "Learn quickly but forget quickly — need repetition", vata: 3, pitta: 0, kapha: 0 },
      { label: "Grasp concepts fast with focus — good memory for details", vata: 0, pitta: 3, kapha: 0 },
      { label: "Take time to learn but remember for a long time", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "social-nature",
    question: "How are you socially?",
    category: "Emotional",
    options: [
      { label: "Talkative, enthusiastic, make friends easily but surface-level", vata: 3, pitta: 0, kapha: 0 },
      { label: "Selective, persuasive, natural leader, competitive", vata: 0, pitta: 3, kapha: 0 },
      { label: "Loyal, nurturing, few deep relationships, supportive", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
];

export interface DoshaInfo {
  name: string;
  sanskrit: string;
  element: string;
  color: string;
  qualities: string[];
  recommendations: string[];
  description: string;
}

export const DOSHA_INFO: Record<DoshaName, DoshaInfo> = {
  vata: {
    name: "Vata",
    sanskrit: "वात",
    element: "Air + Space (Ether)",
    color: "#00BCD4",
    description:
      "Vata governs movement, breath, and creativity. You think quickly, learn quickly, and feel deeply.",
    qualities: ["Creative & Imaginative", "Quick Learner", "Energetic in Bursts", "Adaptable & Flexible"],
    recommendations: [
      "Follow a regular daily routine with consistent meal times",
      "Favor warm, cooked, nourishing foods with healthy fats",
      "Practice grounding yoga poses and slow breathing exercises",
      "Prioritize warm oil self-massage (Abhyanga) before bathing",
      "Focus on the Sleep, Morning Ritual, and Breathing pillars",
    ],
  },
  pitta: {
    name: "Pitta",
    sanskrit: "पित्त",
    element: "Fire + Water",
    color: "#FF5722",
    description:
      "Pitta governs transformation, digestion, and clarity. You are focused, driven, and naturally lead.",
    qualities: ["Sharp Intellect", "Natural Leader", "Strong Digestion", "Determined & Focused"],
    recommendations: [
      "Avoid excessive heat — favor cooling foods and environments",
      "Practice calming, non-competitive exercise like swimming or yoga",
      "Include sweet, bitter, and astringent tastes in your diet",
      "Practice cooling breathwork (Sheetali Pranayama)",
      "Focus on the Gratitude, Healing Meditation, and Sandhya pillars",
    ],
  },
  kapha: {
    name: "Kapha",
    sanskrit: "कफ",
    element: "Earth + Water",
    color: "#4CAF50",
    description:
      "Kapha governs stability, strength, and devotion. You are steady, grounded, and naturally loving.",
    qualities: ["Calm & Grounded", "Loyal & Loving", "Strong Endurance", "Steady & Patient"],
    recommendations: [
      "Stay active with vigorous exercise — avoid daytime sleeping",
      "Favor light, warm, spicy foods — reduce heavy and sweet foods",
      "Wake early (before 6am) and keep a stimulating daily routine",
      "Practice energizing breathwork (Kapalabhati Pranayama)",
      "Focus on the Movement, Fasting, and Thoughts & Intention pillars",
    ],
  },
};

export interface DoshaScores {
  vata: number;
  pitta: number;
  kapha: number;
}

export interface DoshaResult {
  primary: DoshaName;
  secondary: DoshaName;
  scores: DoshaScores;
  percentages: DoshaScores;
}

/** Compute result from raw scores. */
export function scoresToResult(scores: DoshaScores): DoshaResult {
  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const percentages: DoshaScores = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    primary: sorted[0][0] as DoshaName,
    secondary: sorted[1][0] as DoshaName,
    scores,
    percentages,
  };
}

/** localStorage key for an unsigned-in user's saved dosha result ID. */
export const ANON_DOSHA_KEY = "vedic-anonymous-dosha";
