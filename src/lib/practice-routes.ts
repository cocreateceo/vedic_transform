// Pillar-slug → "where to actually do the practice" mapping.
//
// 5 of the 11 pillars have an interactive session timer in /sessions.
// Each of those timers already POSTs /data/checkin on completion (see
// src/components/features/sessions/*.tsx → SESSION_PILLAR), so routing
// the dashboard CTA here closes the bridge: Today's Practice → run timer
// → check-in fires → karma updates. No code change in the timers needed.
//
// Pillars without a timer route to the pillar detail page as before.

export type SessionKey =
  | "morning-routine"
  | "meditation"
  | "breathing"
  | "fasting"
  | "movement";

// Order MUST match the `tabs` array in src/app/(main)/sessions/page.tsx so
// the page can resolve the URL param back to a tab index in one line.
//
// Ordered to match the pillar ID sequence (1=Morning, 2=Fasting, 4=Breathing,
// 5=Movement, 6=Meditation) so the daily-ritual flow Morning → Fasting →
// Breathing → Movement → Meditation reads top-to-bottom naturally.
export const SESSION_KEYS: SessionKey[] = [
  "morning-routine",
  "fasting",
  "breathing",
  "movement",
  "meditation",
];

const PILLAR_TO_SESSION: Record<string, SessionKey> = {
  "morning-initiation": "morning-routine",
  "healing-meditation": "meditation",
  // Sandhya is conceptually a 3x/day meditation — the generic Meditation
  // timer is the closest practice we have for it today.
  "sandhya-meditation": "meditation",
  "breathing-meditation": "breathing",
  "nutrition-fasting": "fasting",
  "movement": "movement",
};

const PILLAR_TO_JOURNAL: Record<string, "gratitude" | "intention" | "manifestation"> = {
  "gratitude": "gratitude",
  "thoughts-intention": "intention",
  "divine-manifestation": "manifestation",
};

/**
 * Returns the route the dashboard's "Today's Practice" CTA should send the
 * user to for the given pillar. Three buckets:
 *   - Session timer  → /sessions?practice=<key>  (auto check-in on completion)
 *   - Journal entry  → /journal?action=<kind>    (gratitude / intention / manifestation)
 *   - Otherwise      → /pillars/<slug>           (existing pillar-detail flow)
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
