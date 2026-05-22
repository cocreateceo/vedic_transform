// Pillar-slug → "where to actually do the practice" mapping.
//
// All 11 pillars now have a dedicated interactive Sessions practice except
// `gratitude` and `thoughts-intention`, which route to the Journal page
// (writing-based practices). Aligned to the Vedics Design System kit.
//
// Each Sessions tab fires /data/checkin on completion (see
// src/components/features/sessions/*.tsx → SESSION_PILLAR), so routing
// the dashboard CTA / pillar card here closes the bridge automatically.

export type SessionKey =
  | "morning-routine"
  | "fasting"
  | "breathing"
  | "movement"
  | "meditation"
  | "sandhya"
  | "brahman"
  | "manifestation"
  | "sleep";

// Order MUST match the `tabs` array in src/app/(main)/sessions/page.tsx so
// the page can resolve the URL param back to a tab index in one line.
//
// Ordered to match the pillar ID sequence:
//   1 Morning · 2 Fasting · 4 Breathing · 5 Movement · 6 Meditation ·
//   8 Sandhya · 9 Brahman · 10 Manifestation · 11 Sleep
export const SESSION_KEYS: SessionKey[] = [
  "morning-routine",
  "fasting",
  "breathing",
  "movement",
  "meditation",
  "sandhya",
  "brahman",
  "manifestation",
  "sleep",
];

const PILLAR_TO_SESSION: Record<string, SessionKey> = {
  "morning-initiation": "morning-routine",
  "nutrition-fasting": "fasting",
  "breathing-meditation": "breathing",
  "movement": "movement",
  "healing-meditation": "meditation",
  "sandhya-meditation": "sandhya",
  "brahman-connection": "brahman",
  "divine-manifestation": "manifestation",
  "sleep-optimization": "sleep",
};

const PILLAR_TO_JOURNAL: Record<string, "gratitude" | "intention" | "manifestation"> = {
  "gratitude": "gratitude",
  "thoughts-intention": "intention",
};

/**
 * Returns the route the dashboard's "Today's Practice" CTA — and the
 * Pillars catalog cards — should send the user to for the given pillar.
 *
 * Three buckets:
 *   - Session timer  → /sessions?practice=<key>  (9 pillars; auto check-in on completion)
 *   - Journal entry  → /journal?action=<kind>    (gratitude, thoughts-intention)
 *   - Otherwise      → /pillars/<slug>           (fallback; no pillar currently lands here)
 */
export function practiceRouteForPillar(pillarSlug: string): string {
  const session = PILLAR_TO_SESSION[pillarSlug];
  if (session) return `/sessions?practice=${session}`;

  const journal = PILLAR_TO_JOURNAL[pillarSlug];
  if (journal) return `/journal?action=${journal}`;

  return `/pillars/${pillarSlug}`;
}

export function sessionKeyToTabIndex(key: string | null | undefined): number {
  if (!key) return 0;
  const idx = SESSION_KEYS.indexOf(key as SessionKey);
  return idx >= 0 ? idx : 0;
}

export type PracticeType = "timer" | "journal" | "detail";

/**
 * Classifies what kind of UX a given pillar opens into. Useful for the
 * Pillars index page so each card can show a small "Timer" / "Journal" /
 * "Read" label, removing the ambiguity about what tapping the card does.
 */
export function practiceTypeForPillar(pillarSlug: string): PracticeType {
  if (PILLAR_TO_SESSION[pillarSlug]) return "timer";
  if (PILLAR_TO_JOURNAL[pillarSlug]) return "journal";
  return "detail";
}
