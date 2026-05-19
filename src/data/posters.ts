// Curated Vedic teaching posters. Each entry is hand-OCR'd from
// public/posters/<slug>.webp during Phase 2 of the integration plan;
// pillar/dosha tags reuse the canonical slugs from constants/pillars.ts
// and lib/dosha.ts so lookups stay aligned across the app.

import type { DoshaName } from "@/lib/dosha";

export type DoshaTag = DoshaName;
export type PosterCategory = "body" | "mind" | "spirit";
export type PosterKind = "yoga" | "pranayama" | "general";

export interface PosterScripture {
  sutra: string;
  sanskrit?: string;
  translation: string;
}

export interface PosterSection {
  number?: number;
  title: string;
  body: string;
  bullets?: string[];
}

export interface PosterImage {
  src: string;       // /posters/<slug>.webp
  src2x: string;     // /posters/<slug>@2x.webp
  thumb: string;     // /posters/<slug>.thumb.webp
  width: number;     // intrinsic width of <slug>.webp
  height: number;    // intrinsic height of <slug>.webp
  alt: string;
}

export interface Poster {
  slug: string;
  title: string;
  concept: string;
  pillarSlug?: string;
  dosha?: DoshaTag;
  kind: PosterKind;
  category: PosterCategory;
  image: PosterImage;
  scripture: PosterScripture[];
  sections: PosterSection[];
  tagline?: string;
}

export const POSTERS: Poster[] = [
  // Populated in Phase 2 via manual OCR. Order is presentation order in
  // the gallery; pillar/dosha lookups use the helpers below regardless.
  {
    slug: "morning-routine-5-step",
    title: "5-Step Morning Routine for Manifestation",
    concept: "morning-routine",
    pillarSlug: "morning-initiation",
    kind: "general",
    category: "body",
    image: {
      src: "/posters/morning-routine-5-step.webp",
      src2x: "/posters/morning-routine-5-step@2x.webp",
      thumb: "/posters/morning-routine-5-step.thumb.webp",
      width: 768,
      height: 512,
      alt: "Five-panel infographic showing a morning routine for manifestation: wake up early, center your breath, connect to awareness, gratitude and thought alignment, and visualization for energy alignment.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "When the mind becomes still, inner clarity awakens.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Wake Up Early (5 AM or 20 mins earlier than usual)",
        body: "Rise calmly and consciously. Drink a glass of warm water. Avoid phone use for the first 20–30 minutes. Begin the day with silence, not distraction.",
        bullets: [
          "Sets a peaceful tone for the day",
          "Boosts energy and metabolism",
          "Improves focus and productivity",
          "Strengthens willpower and discipline",
        ],
      },
      {
        number: 2,
        title: "Center Your Breath (2–5 minutes)",
        body: "Sit upright. Inhale for 4 seconds, deep and slow. Exhale for 6 seconds, gentle and steady. Calm the nervous system and the mind.",
        bullets: [
          "Reduces stress and anxiety",
          "Improves oxygen flow and energy",
          "Enhances concentration",
          "Brings balance to body and mind",
        ],
      },
      {
        number: 3,
        title: "Connect to Awareness / Source (1–2 minutes)",
        body: "Sit quietly in stillness. Bring attention to the present moment. Gently become aware of your inner state. Feel the connection to universal energy (Brahman).",
        bullets: [
          "Deepens self-awareness",
          "Creates inner peace and stability",
          "Cultivates spiritual connection",
          "Aligns you with higher wisdom",
        ],
      },
      {
        number: 4,
        title: "Gratitude & Thought Alignment (1–2 minutes)",
        body: "Mentally list three things you're grateful for. Set one positive intention for the day. Replace any negative thought with a constructive one.",
        bullets: [
          "Improves mood and happiness",
          "Rewires the mind for positivity",
          "Builds emotional resilience",
          "Attracts positive experiences",
        ],
      },
      {
        number: 5,
        title: "Manifestation & Energy Alignment (2 minutes)",
        body: "Visualize your key goal for the next 48 days. See yourself already succeeding. Invite clarity, strength, and guidance. Hold that image for a few breaths.",
        bullets: [
          "Clarifies purpose and direction",
          "Boosts confidence and motivation",
          "Aligns energy with goals",
          "Invites divine guidance and support",
        ],
      },
    ],
    tagline: "Inspired by the wisdom of Patanjali Yoga Sutras.",
  },
  {
    slug: "morning-sandhya-meditation",
    title: "Morning Sandhya Meditation",
    concept: "sandhya-meditation",
    pillarSlug: "sandhya-meditation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/posters/morning-sandhya-meditation.webp",
      src2x: "/posters/morning-sandhya-meditation@2x.webp",
      thumb: "/posters/morning-sandhya-meditation.thumb.webp",
      width: 768,
      height: 512,
      alt: "Three-panel infographic on Morning Sandhya Meditation — why morning sandhya, seven practice steps, and the benefits of the practice.",
    },
    scripture: [],
    sections: [
      {
        number: 1,
        title: "Why Morning Sandhya",
        body: "Start your day in light and awareness. The sacred time between night and day — Brahma Muhurta to sunrise — is when the mind is calm, pure, and highly receptive.",
        bullets: [
          "Sacred time between night and day (Brahma Muhurta to sunrise)",
          "Mind is calm, pure, and highly receptive",
          "Positive energy for the whole day",
          "Connects you with nature and the Divine",
        ],
      },
      {
        number: 2,
        title: "Practice Steps",
        body: "Seven steps to settle into morning sandhya.",
        bullets: [
          "Wake early during Brahma Muhurta (90 minutes before sunrise).",
          "Cleanse & prepare — freshen up, wear clean clothes, sit in a quiet place facing East.",
          "Sit with a straight spine in a comfortable posture, eyes closed.",
          "Deep breathing — slow, deep breaths; inhale positivity, exhale stress.",
          "Chant a mantra — OM or the Gayatri Mantra with devotion.",
          "Meditate in silence — observe your breath and thoughts; stay in silence.",
          "Gratitude & Sankalpa — offer gratitude and set a positive intention for the day.",
        ],
      },
      {
        number: 3,
        title: "Amazing Benefits",
        body: "What a consistent morning sandhya practice brings.",
        bullets: [
          "Improves concentration and memory",
          "Reduces stress and anxiety",
          "Brings emotional balance and inner peace",
          "Increases energy and enthusiasm",
          "Strengthens immunity and overall health",
          "Enhances spiritual growth and self-awareness",
          "Creates positivity, clarity, and happiness all day",
        ],
      },
    ],
    tagline: "A peaceful morning, a powerful life.",
  },
  {
    slug: "path-of-manifestation",
    title: "The Path of Manifestation",
    concept: "manifestation-6-steps",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/posters/path-of-manifestation.webp",
      src2x: "/posters/path-of-manifestation@2x.webp",
      thumb: "/posters/path-of-manifestation.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Six-step Path of Manifestation infographic — clarity of intention, believe and visualize, align thoughts and emotions, take inspired action, surrender and trust the divine, receive and be grateful.",
    },
    scripture: [],
    sections: [
      {
        number: 1,
        title: "Clarity of Intention",
        body: "Get clear about what you truly want. A clear intention is the first step of manifestation — your intention is the seed that creates your reality.",
      },
      {
        number: 2,
        title: "Believe & Visualize",
        body: "Believe in your dream and see it as already yours. Visualization creates the blueprint in your subconscious mind. What you visualize with feeling, you attract with ease.",
      },
      {
        number: 3,
        title: "Align Your Thoughts & Emotions",
        body: "Think positive, feel grateful, and raise your vibration. Your inner state attracts your outer reality. Emotions are the energy behind manifestation.",
      },
      {
        number: 4,
        title: "Take Inspired Action",
        body: "Take consistent, inspired action towards your goals. Action turns intention into reality. Small steps daily create massive transformation.",
      },
      {
        number: 5,
        title: "Surrender & Trust the Divine",
        body: "Let go of doubt and attachment. Trust the universe and divine timing. Everything happens for you, not to you. Trust creates flow and miracles.",
      },
      {
        number: 6,
        title: "Receive & Be Grateful",
        body: "Be open to receive blessings. Gratitude multiplies abundance and keeps the flow continuous. Appreciate what you have to attract even more.",
      },
    ],
    tagline: "Your mind is the seed. Your energy is the water. Your actions are the soil. Your reality is the result.",
  },
];

export function getPostersByPillar(slug: string): Poster[] {
  return POSTERS.filter((p) => p.pillarSlug === slug);
}

export function getPosterByDosha(
  dosha: DoshaTag,
  kind: PosterKind,
): Poster | undefined {
  return POSTERS.find((p) => p.dosha === dosha && p.kind === kind);
}

export function getPosterBySlug(slug: string): Poster | undefined {
  return POSTERS.find((p) => p.slug === slug);
}
