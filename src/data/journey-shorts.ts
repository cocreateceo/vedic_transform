// 48-Day Journey scripture shorts — one 30-second YouTube Short per day of
// the transformation journey, sourced from the @Vedics_Transform channel.
// Each day pairs a verse (Bhagavad Gita / Upanishads / Yoga Sutras) with the
// uploaded Short. Surfaced on the dashboard as the "wisdom of the day" video,
// keyed to the user's current journey day (1-48). The `verse` text is the
// teaser line from each video's title.

export interface JourneyShort {
  /** Journey day this short belongs to (1-48). */
  day: number;
  /** YouTube video ID. */
  videoId: string;
  /** Short verse teaser shown alongside the video. */
  verse: string;
}

export const JOURNEY_SHORTS: JourneyShort[] = [
  { day: 1, videoId: "4LhAnn25LUI", verse: "Yoga is the cessation of the fluctuations of the mind." },
  { day: 2, videoId: "yemF4fJLhkM", verse: "Then the seer abides in their own true nature." },
  { day: 3, videoId: "rK8Fc6lLGAY", verse: "Yoga is evenness of mind." },
  { day: 4, videoId: "rZPSd3h3wug", verse: "Practice becomes firmly grounded when continued for a long time." },
  { day: 5, videoId: "VOGEV3h0O6Y", verse: "Arise, awake, and learn from the wise." },
  { day: 6, videoId: "jJrqZiKfVmI", verse: "Now, the teaching of yoga begins." },
  { day: 7, videoId: "QKLaLFjYSKs", verse: "Yoga is not for one who eats too much, nor too little." },
  { day: 8, videoId: "Wj6gVZZKYkQ", verse: "Let one lift oneself by one's own self." },
  { day: 9, videoId: "RiUI6EjMwog", verse: "Ignorance, ego, attachment, aversion, and clinging are the afflictions." },
  { day: 10, videoId: "leBIXn-66oA", verse: "From attachment springs desire, from desire anger is born." },
  { day: 11, videoId: "t6fyIxc7NF4", verse: "The yogi succeeds through enthusiasm, perseverance, and discernment." },
  { day: 12, videoId: "ilsTxLdMCF4", verse: "When negative thoughts arise, cultivate their opposites." },
  { day: 13, videoId: "DUmK0zM62Gs", verse: "These pairs of opposites are temporary; endure them." },
  { day: 14, videoId: "oKc9ma0HZsg", verse: "Cultivate friendliness toward the happy, compassion for the suffering." },
  { day: 15, videoId: "aef8UZdgrVs", verse: "One who acts without attachment, surrendering the fruits, is freed." },
  { day: 16, videoId: "fqLFwlXsPC8", verse: "Aham Brahmasmi. I am Brahman." },
  { day: 17, videoId: "1e5fslQCV9k", verse: "Tat tvam asi. That thou art." },
  { day: 18, videoId: "diuLDbWaKn8", verse: "It is pure consciousness — neither this nor that." },
  { day: 19, videoId: "lNYs-0sKD00", verse: "That which the mind cannot think, but by which the mind thinks." },
  { day: 20, videoId: "bOjDOFbs1Zg", verse: "The knower of Brahman attains the supreme." },
  { day: 21, videoId: "tKSv5DQy3m4", verse: "One who sees all beings in the Self, and the Self in all beings." },
  { day: 22, videoId: "T7lG3IWih_U", verse: "Two birds, friends and inseparable, dwell on the same tree." },
  { day: 23, videoId: "iQVqbk-ofUI", verse: "The Self is never born and never dies." },
  { day: 24, videoId: "0uI5EGpaYYw", verse: "Prajnanam Brahma. Consciousness is Brahman." },
  { day: 25, videoId: "QsS5E1wsndc", verse: "Asana is a steady, comfortable seat." },
  { day: 26, videoId: "JUDSpHyOjgY", verse: "When the breath wanders, the mind is unsteady." },
  { day: 27, videoId: "oDZPN10laDg", verse: "Having mastered asana, the regulation of breath follows." },
  { day: 28, videoId: "1BDsaF4vA4c", verse: "When the channels are pure, the breath flows freely." },
  { day: 29, videoId: "2-QqqVNOeXA", verse: "Pranayama has three parts: exhalation, inhalation, and retention." },
  { day: 30, videoId: "enwIXVhHSvw", verse: "Some offer the inhaled breath into the exhaled breath." },
  { day: 31, videoId: "-FSju7r0uF0", verse: "Pranayama removes the covering of the inner light." },
  { day: 32, videoId: "Bbtf2R7Ev0s", verse: "When negative thoughts arise, cultivate their opposites." },
  { day: 33, videoId: "xBhJKbmGjCo", verse: "To prevent obstacles, practice one principle steadily." },
  { day: 34, videoId: "4lidI3sohsg", verse: "You have the right to action, never to its fruits." },
  { day: 35, videoId: "oY0pkPPiHQo", verse: "Perform action without attachment, for one attains the Supreme." },
  { day: 36, videoId: "PNSnuv9tSes", verse: "Tapas, self-study, and surrender to the Lord are the yoga of action." },
  { day: 37, videoId: "eio-8lBHJYE", verse: "Abandon all duties and surrender to Me alone." },
  { day: 38, videoId: "WyqX1iEPmAY", verse: "All this, whatever moves in the universe, is enveloped by the Lord." },
  { day: 39, videoId: "1XMK3N9RoUg", verse: "Whatever you do, eat, offer, or give — do it as an offering." },
  { day: 40, videoId: "tEsMWbNYUKo", verse: "Realization is nearest for those who are intensely devoted." },
  { day: 41, videoId: "EI3AZ_hUntI", verse: "Even from the attainment of the unmanifest, the path is difficult." },
  { day: 42, videoId: "1VvBKNA-yiE", verse: "One who sees Me in all, and all in Me, is never lost to Me." },
  { day: 43, videoId: "R8eDnnvzrq4", verse: "When the gunas have served their purpose, they withdraw." },
  { day: 44, videoId: "KE663vOrcTQ", verse: "When one renounces all desires that arise in the mind." },
  { day: 45, videoId: "mCE2j-2M-1k", verse: "It is the cessation of all sorrow." },
  { day: 46, videoId: "BFc8s0IAYKw", verse: "The Lord dwells in the heart of all beings." },
  { day: 47, videoId: "6MIRxJefXeQ", verse: "The sequence of moments is the basis of transformation." },
  { day: 48, videoId: "RgtBJcVD-Es", verse: "All this, whatever moves in the universe, is the dwelling of the Divine." },
];

/** The short for a given journey day (1-48); clamps out-of-range days. */
export function getShortForDay(day: number): JourneyShort | undefined {
  if (!Number.isFinite(day)) return undefined;
  const clamped = Math.min(48, Math.max(1, Math.floor(day)));
  return JOURNEY_SHORTS.find((s) => s.day === clamped);
}

/** YouTube watch URL for a short. */
export function shortUrl(s: JourneyShort): string {
  return `https://youtu.be/${s.videoId}`;
}

/** YouTube embed URL for inline playback. */
export function shortEmbedUrl(s: JourneyShort): string {
  return `https://www.youtube.com/embed/${s.videoId}?rel=0`;
}

/** Max-res thumbnail for a short. */
export function shortThumb(s: JourneyShort): string {
  return `https://img.youtube.com/vi/${s.videoId}/maxresdefault.jpg`;
}
