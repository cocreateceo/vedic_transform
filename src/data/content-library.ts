export interface ContentItem {
  id: string;
  title: string;
  type: "video" | "audio" | "article" | "guide";
  pillarSlug: string;
  category: "body" | "mind" | "spirit";
  duration: string;
  url: string;
  thumbnail?: string;
  description: string;
}

export const CONTENT_LIBRARY: ContentItem[] = [
  {
    id: "content-morning-routine",
    title: "Designing Your Sacred Morning Routine",
    type: "video",
    pillarSlug: "morning-routine",
    category: "body",
    duration: "12 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Learn how to craft a morning routine rooted in Vedic principles. This guide walks you through waking with intention, cleansing rituals, and setting the tone for a productive, mindful day. Discover why the Brahma Muhurta — the hour before sunrise — is considered the most powerful time for personal practice.",
  },
  {
    id: "content-vedic-nutrition",
    title: "Introduction to Sattvic Eating",
    type: "video",
    pillarSlug: "vedic-nutrition",
    category: "body",
    duration: "18 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Explore the Ayurvedic framework of Sattvic, Rajasic, and Tamasic foods. Understand how your diet directly influences your mental clarity, emotional balance, and spiritual receptivity. Includes practical meal guidelines and a simple Sattvic recipe to get started.",
  },
  {
    id: "content-thought-reset",
    title: "Mastering the Thought Reset Technique",
    type: "article",
    pillarSlug: "thought-reset",
    category: "mind",
    duration: "8 min read",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Negative thought loops are one of the biggest barriers to transformation. This article teaches you the Vedic-inspired thought reset method — a practical technique for observing, interrupting, and redirecting unhelpful mental patterns using awareness and breath.",
  },
  {
    id: "content-breathing-meditation",
    title: "Pranayama Fundamentals: Breath as Medicine",
    type: "video",
    pillarSlug: "breathing-meditation",
    category: "mind",
    duration: "22 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "A comprehensive introduction to Pranayama — the Vedic science of breath control. Learn Nadi Shodhana (alternate nostril breathing), Kapalabhati (skull-shining breath), and Bhramari (humming bee breath). Each technique is demonstrated with proper form and timing for beginners.",
  },
  {
    id: "content-movement",
    title: "Vedic Movement: Beyond Modern Exercise",
    type: "video",
    pillarSlug: "movement",
    category: "body",
    duration: "15 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Discover how traditional Vedic movement practices — including Surya Namaskar (sun salutations) and mindful walking — differ from conventional exercise. This session emphasizes the union of breath, awareness, and physical motion for holistic vitality.",
  },
  {
    id: "content-healing-meditation",
    title: "Guided Healing Meditation for Emotional Release",
    type: "audio",
    pillarSlug: "healing-meditation",
    category: "mind",
    duration: "20 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "A gentle guided meditation designed to help you release stored emotional tension. Drawing from Yoga Nidra and Vedantic visualization practices, this session guides you through body scanning, emotional acknowledgment, and compassionate letting go.",
  },
  {
    id: "content-sandhya-meditation",
    title: "Sandhya Vandana: The Twilight Meditation Practice",
    type: "video",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "16 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Sandhya Vandana is the ancient practice of meditating at the junction points of the day — dawn, noon, and dusk. Learn why these transitional moments hold special spiritual significance and how to perform a simplified modern version of this timeless ritual.",
  },
  {
    id: "content-gratitude",
    title: "The Neuroscience and Vedic Roots of Gratitude",
    type: "article",
    pillarSlug: "gratitude",
    category: "mind",
    duration: "10 min read",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Gratitude is both an ancient Vedic virtue and a scientifically validated practice for well-being. This article explores how regular gratitude practice rewires neural pathways, reduces cortisol, and aligns with the Vedic principle of Santosha (contentment).",
  },
  {
    id: "content-brahman-connection",
    title: "Understanding Brahman: The Universal Consciousness",
    type: "guide",
    pillarSlug: "brahman-connection",
    category: "spirit",
    duration: "14 min read",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "An accessible introduction to the Vedantic concept of Brahman — the infinite, unchanging reality that underlies all existence. Learn how connecting with this universal consciousness through meditation and contemplation can bring profound peace and purpose to daily life.",
  },
  {
    id: "content-manifestation",
    title: "Sankalpa: The Vedic Science of Manifestation",
    type: "video",
    pillarSlug: "manifestation",
    category: "spirit",
    duration: "13 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Sankalpa is the practice of setting a heartfelt intention aligned with your highest truth. Unlike modern goal-setting, Sankalpa works at the level of identity and consciousness. Learn how to formulate, plant, and nurture your Sankalpa through the 48-day Mandala journey.",
  },
  {
    id: "content-sleep-optimization",
    title: "Vedic Sleep Rituals for Deep Restoration",
    type: "video",
    pillarSlug: "sleep-optimization",
    category: "body",
    duration: "11 min",
    url: "https://www.youtube.com/@10xvedic",
    description:
      "Quality sleep is the foundation of transformation. This session covers Ayurvedic sleep hygiene — including optimal sleep timing, evening wind-down rituals, herbal recommendations, and a short Yoga Nidra practice to help you transition into deep, restorative rest.",
  },
];
