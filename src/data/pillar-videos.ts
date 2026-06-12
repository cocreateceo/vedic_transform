// Per-pillar teaching video — the ~1-minute clip from the @Vedics_Transform
// YouTube channel that introduces each pillar. Surfaced on the pillar detail
// page. Kept as its own map (rather than derived from content-library) so the
// detail page has a single canonical "the video for this pillar" lookup.

export interface PillarVideo {
  videoId: string;
  title: string;
}

export const PILLAR_VIDEOS: Record<string, PillarVideo> = {
  "morning-initiation": {
    videoId: "R-8v8ZdVvis",
    title: "Brahma Muhurta — Doshas, Cortisol & the 5 AM Ritual",
  },
  "nutrition-fasting": {
    videoId: "RRxkLdgDegM",
    title: "Sattvic Eating — The Three Categories Ayurveda Maps Every Food To",
  },
  "thoughts-intention": {
    videoId: "T4qK3HKwc7g",
    title: "Vrittis — The Mind's Fluctuations & the 4-Step Vedic Reset",
  },
  "breathing-meditation": {
    videoId: "HR0HwIixHDY",
    title: "Bhramari — The Humming Bee Breath That Calms in Under 60 Seconds",
  },
  "movement": {
    videoId: "qFhxKp9XfVY",
    title: "Surya Namaskar — 12 Poses, One Breath Cycle",
  },
  "healing-meditation": {
    videoId: "MtfAgxcgveM",
    title: "Mahamrityunjaya — The Healing Mantra of the Rig Veda",
  },
  "gratitude": {
    videoId: "NkpWu1H904Q",
    title: "Kritajnata — The Vedic Word for Gratitude That Means 'Noticing'",
  },
  "sandhya-meditation": {
    videoId: "sJ5BzJawHr4",
    title: "Sandhya Vandana — The Vedic Twilight Practice",
  },
  "brahman-connection": {
    videoId: "29OKHUGj7dw",
    title: "Tat Tvam Asi — You Are That",
  },
  "divine-manifestation": {
    videoId: "P84Ib24a3Ng",
    title: "Sankalpa — The Three Rules of Real Vedic Manifestation",
  },
  "sleep-optimization": {
    videoId: "jzbePUfDQ1o",
    title: "Yoga Nidra — The Yogic Sleep That Equals 4 Hours of Rest in 1 Hour",
  },
};

export function getPillarVideo(slug: string): PillarVideo | undefined {
  return PILLAR_VIDEOS[slug];
}
