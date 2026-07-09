// Pure decision logic for the lifecycle-email cron: given a user's journey
// state and the set of lifecycle emails already sent to them, decide which
// single email (if any) should go out now. Kept free of AWS/DB imports so it
// is fully unit-testable.

export type LifecycleEmailKey =
  | "welcome"
  | "day3"
  | "day7"
  | "day14"
  | "day21"
  | "day30"
  | "completion"
  | "winback";

export interface LifecycleState {
  /** Whether the user has an active 48-day journey. */
  hasJourney: boolean;
  /** 1-based current journey day; 0 when there is no active journey. */
  journeyDay: number;
  /** Whole days since the user's last check-in; null if they never checked in. */
  daysSinceLastCheckin: number | null;
  /** Lifecycle keys already sent to this user (dedup). */
  alreadySent: ReadonlySet<string>;
}

/** Day → milestone email, ascending. */
const MILESTONES: ReadonlyArray<readonly [number, LifecycleEmailKey]> = [
  [1, "welcome"],
  [3, "day3"],
  [7, "day7"],
  [14, "day14"],
  [21, "day21"],
  [30, "day30"],
  [48, "completion"],
];

/** A lapse of this many days since the last check-in triggers win-back. */
export const WINBACK_DAYS = 3;

/**
 * Returns the one lifecycle email to send now, or null. Win-back takes priority
 * over milestones (a lapsing user should be re-engaged, not congratulated).
 * Each key is sent at most once — the caller records it in `alreadySent`.
 *
 * NOTE (scaffold): win-back currently fires once ever. Re-arming it on
 * re-engagement (clear the flag when the user checks in again) is a follow-up.
 */
export function decideLifecycleEmail(
  s: LifecycleState,
): LifecycleEmailKey | null {
  if (!s.hasJourney) return null;

  if (
    s.daysSinceLastCheckin !== null &&
    s.daysSinceLastCheckin >= WINBACK_DAYS &&
    !s.alreadySent.has("winback")
  ) {
    return "winback";
  }

  // Highest milestone the user has reached and not yet been sent.
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    const [day, key] = MILESTONES[i];
    if (s.journeyDay >= day && !s.alreadySent.has(key)) return key;
  }

  return null;
}
