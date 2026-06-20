// Builders for shareable milestone links. Each returns a config for
// <ShareButton/>, whose `url` points at the public /share landing page so the
// pasted link unfurls with the branded OG card (/api/og/share). Pure +
// testable; no React.

export interface ShareConfig {
  title: string;
  text: string;
  /** Relative /share URL that unfurls with the branded OG card. */
  url: string;
}

function shareUrl(big: string, label: string, sub: string): string {
  const p = new URLSearchParams({ big, label, sub });
  return `/share?${p.toString()}`;
}

/** Journey-day milestone card (Day 7 / 21 / 48, etc.). */
export function dayMilestoneShare(day: number): ShareConfig {
  const complete = day >= 48;
  return {
    title: "10X Vedic Transform",
    text: complete
      ? "I just completed the 48-day Vedic transformation 🎉"
      : `Day ${day} of my 48-day Vedic transformation 🔥`,
    url: shareUrl(
      `Day ${day}`,
      complete ? "of 48 — complete!" : "of 48 complete",
      complete
        ? "I completed the 48-day Vedic transformation 🪷"
        : `${day} days into my 48-day Vedic transformation`,
    ),
  };
}

/** Streak milestone card. */
export function streakShare(days: number): ShareConfig {
  return {
    title: "10X Vedic Transform",
    text: `${days}-day streak on my Vedic transformation 🔥`,
    url: shareUrl(
      String(days),
      "Day Streak",
      `${days} days of consistent Vedic practice`,
    ),
  };
}

/** Journey days that trigger an auto-celebration share prompt. */
export const DAY_MILESTONES = [7, 21, 48] as const;

/**
 * The highest reached day-milestone the user hasn't celebrated yet, or null.
 * Lets the dashboard prompt a share exactly once per milestone.
 */
export function dayMilestoneToCelebrate(
  day: number,
  celebrated: ReadonlySet<number>,
): number | null {
  let hit: number | null = null;
  for (const m of DAY_MILESTONES) {
    if (day >= m && !celebrated.has(m)) hit = m;
  }
  return hit;
}
