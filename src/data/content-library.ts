export interface ContentItem {
  id: string;
  title: string;
  type: "video" | "audio" | "article" | "guide";
  pillarSlug: string;
  category: "body" | "mind" | "spirit";
  duration: string;
  url: string;
  audioUrl?: string; // For in-app audio playback
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
    audioUrl: "generated",
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

  // ── In-App Audio Meditations ────────────────────────────────────

  {
    id: "audio-om-chanting",
    title: "Om Chanting Meditation",
    type: "audio",
    pillarSlug: "breathing-meditation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "generated",
    description:
      "Sacred Om chanting meditation to align your energy centers. The primordial sound of Om resonates with the frequency of the universe, calming the nervous system and deepening your connection to universal consciousness.",
  },
  {
    id: "audio-morning-mantra",
    title: "Morning Mantra & Intention Setting",
    type: "audio",
    pillarSlug: "morning-routine",
    category: "body",
    duration: "8 min",
    url: "#",
    audioUrl: "generated",
    description:
      "Start your day with powerful Vedic mantras and guided intention setting. This short audio practice combines the Gayatri Mantra with a visualization exercise to set your daily Sankalpa.",
  },
  {
    id: "audio-pranayama-guided",
    title: "Guided Pranayama: Nadi Shodhana",
    type: "audio",
    pillarSlug: "breathing-meditation",
    category: "mind",
    duration: "15 min",
    url: "#",
    audioUrl: "generated",
    description:
      "Follow along with this guided alternate nostril breathing (Nadi Shodhana) session. Perfect for balancing the left and right hemispheres of the brain, reducing anxiety, and preparing for deeper meditation.",
  },
  {
    id: "audio-yoga-nidra",
    title: "Yoga Nidra: Yogic Sleep for Deep Rest",
    type: "audio",
    pillarSlug: "sleep-optimization",
    category: "body",
    duration: "25 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A complete Yoga Nidra (yogic sleep) session that guides you through progressive relaxation, body scanning, and visualization. One hour of Yoga Nidra is said to equal 4 hours of regular sleep.",
  },
  {
    id: "audio-gratitude-meditation",
    title: "Gratitude & Heart Opening Meditation",
    type: "audio",
    pillarSlug: "gratitude",
    category: "mind",
    duration: "12 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A gentle heart-centered meditation that cultivates deep gratitude. Using Vedic visualization of the heart chakra (Anahata), this practice opens you to appreciation, love, and contentment.",
  },
  {
    id: "audio-sandhya-evening",
    title: "Evening Sandhya: Twilight Meditation",
    type: "audio",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A calming evening meditation performed at the sacred twilight hour. This practice helps you release the day, process experiences, and prepare your consciousness for restful sleep.",
  },
  {
    id: "audio-chakra-healing",
    title: "7 Chakra Healing Sound Bath",
    type: "audio",
    pillarSlug: "healing-meditation",
    category: "spirit",
    duration: "20 min",
    url: "#",
    audioUrl: "generated",
    description:
      "An immersive sound healing experience using frequencies aligned to each of the 7 chakras. Tibetan singing bowls, crystal bowls, and binaural beats guide energy through your subtle body for deep healing.",
  },
  {
    id: "audio-manifestation-visualization",
    title: "Sankalpa: Guided Manifestation",
    type: "audio",
    pillarSlug: "manifestation",
    category: "spirit",
    duration: "15 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A powerful guided visualization for manifesting your deepest intentions. Using the Vedic practice of Sankalpa combined with modern visualization techniques, this session helps you plant seeds of transformation in your subconscious.",
  },
];
