// One-shot streak event handoff: pillar-detail-client writes the event after
// a successful check-in; the dashboard reads and clears it on next mount so
// the user sees a one-time banner ("Shield used — your streak is safe").

const KEY = "vedic:streak-event";

export type StreakEventType = "shield-used" | "shield-granted";

export interface StreakEvent {
  type: StreakEventType;
  currentStreak: number;
  shields: number;
  setAt: number;
}

export function setStreakEvent(event: Omit<StreakEvent, "setAt">) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...event, setAt: Date.now() }));
  } catch {
    // Storage unavailable / quota — silently drop. The banner is non-essential.
  }
}

export function consumeStreakEvent(): StreakEvent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as StreakEvent;
    // Drop events older than 10 minutes — guards against stale tabs.
    if (Date.now() - (parsed.setAt || 0) > 10 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}
