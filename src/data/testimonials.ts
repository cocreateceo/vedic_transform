export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  dayCompleted: number;
  topPillars: string[];
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Priya M.",
    quote:
      "The 48-day journey completely rewired my mornings. I went from hitting snooze three times to waking at 5 AM with genuine excitement. The Sandhya meditation alone brought a stillness I hadn't felt in years. By day 30, my colleagues started asking what had changed — I was calmer, more focused, and somehow had more energy than ever.",
    rating: 5,
    dayCompleted: 48,
    topPillars: ["morning-routine", "sandhya-meditation", "breathing-meditation"],
  },
  {
    id: "testimonial-2",
    name: "David R.",
    quote:
      "I was skeptical about the breathing exercises at first — Pranayama felt too simple to make a real difference. But after two weeks of consistent practice, my anxiety levels dropped noticeably. The structured approach of the 11 pillars kept me accountable in a way no other program has. I finally understand what discipline feels like when it flows naturally.",
    rating: 5,
    dayCompleted: 48,
    topPillars: ["breathing-meditation", "thought-reset", "gratitude"],
  },
  {
    id: "testimonial-3",
    name: "Anita K.",
    quote:
      "Switching to Sattvic nutrition during the journey was a game-changer. I had more mental clarity, my digestion improved, and I lost weight without even trying. Combining the dietary guidance with the movement pillar gave me a holistic sense of well-being I didn't know was possible. I'm on my second Mandala cycle now.",
    rating: 5,
    dayCompleted: 48,
    topPillars: ["vedic-nutrition", "movement", "sleep-optimization"],
  },
  {
    id: "testimonial-4",
    name: "Marcus T.",
    quote:
      "As someone who has tried every productivity system out there, the 10X Vedic approach is different. It doesn't just optimize your schedule — it transforms how you relate to time itself. The gratitude practice and manifestation exercises shifted my mindset from scarcity to abundance. I'm more present with my family and more effective at work.",
    rating: 4,
    dayCompleted: 42,
    topPillars: ["gratitude", "manifestation", "morning-routine"],
  },
  {
    id: "testimonial-5",
    name: "Sanjay P.",
    quote:
      "The healing meditation pillar helped me process grief I had been carrying for years. Combined with the Brahman connection practices, I found a spiritual depth I had been searching for my entire adult life. The daily wisdom quotes kept me motivated, and the streak system made me not want to miss a single day.",
    rating: 5,
    dayCompleted: 48,
    topPillars: ["healing-meditation", "brahman-connection", "sandhya-meditation"],
  },
  {
    id: "testimonial-6",
    name: "Laura C.",
    quote:
      "I started the 48-day Mandala during a burnout period. The thought-reset techniques taught me to observe my negative patterns without judgment. The sleep optimization pillar fixed my insomnia within the first week. By the end, I felt like a completely different person — not because I changed who I am, but because I finally uncovered who I was meant to be.",
    rating: 5,
    dayCompleted: 48,
    topPillars: ["thought-reset", "sleep-optimization", "breathing-meditation"],
  },
];
