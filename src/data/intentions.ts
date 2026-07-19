// Browse-by-intention entry points — an alternative front door into the
// program for visitors who arrive with a feeling ("I can't sleep") rather
// than a plan. Each intention maps to the pillars that serve it and a
// magazine tag deep-link (/blog?tag=...).

export interface Intention {
  key: string;
  label: string;
  tagline: string;
  pillars: string[];
  blogTag: string;
}

export const INTENTIONS: Intention[] = [
  {
    key: "calm",
    label: "Calm",
    tagline: "Quiet an anxious mind with breath and stillness",
    pillars: ["Breathing + Meditation", "Sandhya Meditation"],
    blogTag: "breath",
  },
  {
    key: "sleep",
    label: "Deep Sleep",
    tagline: "Fall asleep faster and wake genuinely rested",
    pillars: ["Sleep Optimization", "Healing Meditation"],
    blogTag: "sleep",
  },
  {
    key: "focus",
    label: "Focus & Clarity",
    tagline: "Steady the wandering mind with mantra and intention",
    pillars: ["Thoughts & Intention Reset", "Breathing + Meditation"],
    blogTag: "mantra",
  },
  {
    key: "energy",
    label: "Energy & Vitality",
    tagline: "Rebuild your mornings and fuel your body cleanly",
    pillars: ["5 AM Initiation", "Vedic Nutrition + Fasting"],
    blogTag: "morning routine",
  },
  {
    key: "healing",
    label: "Healing",
    tagline: "Process what you carry and set it down gently",
    pillars: ["Healing Meditation", "Movement Everyday"],
    blogTag: "meditation",
  },
  {
    key: "abundance",
    label: "Gratitude & Abundance",
    tagline: "Shift from scarcity to appreciation, daily",
    pillars: ["Gratitude", "Divine Manifestation"],
    blogTag: "gratitude",
  },
];
