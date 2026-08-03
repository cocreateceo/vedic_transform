// Whether the desktop rail shows labels or only icons.
//
// Kept as a pure function so the rule can be tested without a DOM, and so the
// one place that decides it is obvious. An icon-only rail hides the labels
// that make abstract destinations legible — Insights, Reports and Progress
// have no self-evident glyph — so the rule below is deliberately conservative:
// it collapses in exactly one situation, and any explicit choice by the reader
// wins permanently.

export type RailPreference = "auto" | "expanded" | "collapsed";

export const RAIL_STORAGE_KEY = "vedic-rail";

/** Reads a stored preference, treating anything unrecognised as "auto". */
export function parseRailPreference(raw: string | null): RailPreference {
  return raw === "expanded" || raw === "collapsed" ? raw : "auto";
}

/**
 * "auto" collapses only inside Training, where the reader already has a second
 * rail — the chapter spine — and two label columns compete. Everywhere else it
 * stays expanded, because the cost of an unreadable icon is higher than the
 * 176px it saves.
 */
export function railCollapsed(
  preference: RailPreference,
  pathname: string,
): boolean {
  if (preference === "collapsed") return true;
  if (preference === "expanded") return false;
  return pathname === "/training" || pathname.startsWith("/training/");
}

/**
 * What the toggle writes.
 *
 * Toggling always produces an explicit preference, never "auto" — once the
 * reader has said what they want, the route must stop overriding them. That is
 * the difference between a preference and a suggestion.
 */
export function nextRailPreference(
  preference: RailPreference,
  pathname: string,
): RailPreference {
  return railCollapsed(preference, pathname) ? "expanded" : "collapsed";
}

/** Width of the rail, and the matching content offset. */
export const RAIL_WIDTH = { expanded: "16rem", collapsed: "5rem" } as const;
