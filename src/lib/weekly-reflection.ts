// Weekly (phase-boundary) reflection — the look-back layer.
//
// Fires when the user crosses into a new phase (day 8, 15, 22, 31, 41,
// 49). Pure-deterministic narrative built from existing data: check-ins,
// mood logs, pillar variety. Reflective narration, not metrics dump.
//
// Trigger window: current day is one of the transition days OR within 2
// days after (so a user who only opens the app on day 9 still sees the
// Awakening reflection). After that, the reflection rotates out.
//
// Dismiss state is per-phase + per-user, persisted in localStorage by the
// rendering component. This helper is pure — it just computes the payload.

import { PILLARS } from "@/constants/pillars";
import { getJourneyPhase, type JourneyPhase, ALL_PHASES } from "./journey-phases";

export interface PhaseReflection {
  /** The phase the user has just completed. */
  phaseEnded: JourneyPhase;
  /** The phase the user is currently entering / in. */
  currentPhase: JourneyPhase;
  /** 2–4 short narrative observations. Reflective, not metric-y. */
  observations: string[];
  /** localStorage key the UI uses to remember dismissal of this specific
   *  reflection. Includes phase id so each phase's reflection is dismissed
   *  independently. */
  dismissKey: string;
}

/** YYYY-MM-DD helper (UTC). */
function ymd(d: Date): string {
  return d.toISOString().split("T")[0];
}

interface CheckinLike {
  checkinDate?: string;
  pillarSlug?: string;
  pillarId?: number | string;
}

interface MoodLike {
  logDate?: string;
  moodScore?: number;
  energy?: number;
  stress?: number;
  sleepQuality?: number;
}

/**
 * Compute the reflection payload. Returns null when:
 *  - current day is < 8 (no completed phase yet)
 *  - current day is outside any transition show-window
 *  - journey has no startDate (defensive)
 *
 * The component decides whether to actually render based on its own
 * localStorage dismiss check.
 */
export function computeWeeklyReflection(args: {
  currentDay: number;
  startDate: string | null | undefined;
  checkins: CheckinLike[];
  moodLogs: MoodLike[];
}): PhaseReflection | null {
  const { currentDay, startDate, checkins, moodLogs } = args;
  if (!startDate || currentDay < 8) return null;

  // Determine which phase we're reflecting on. Reflection window opens on
  // the first day of the NEW phase and stays open for 3 days total.
  // i.e. transition day → +2 days inclusive.
  const phaseEnded = pickEndedPhase(currentDay);
  if (!phaseEnded) return null;

  const currentPhase = getJourneyPhase(currentDay);

  // Build the date range for the ended phase. Phase 1 covers days 1–7 of
  // the journey, which maps to startDate..startDate+6 (UTC).
  const startMs = new Date(startDate).getTime();
  if (!Number.isFinite(startMs)) return null;
  const phaseStartMs = startMs + (phaseEnded.range[0] - 1) * 86400000;
  const phaseEndMs = startMs + (phaseEnded.range[1] - 1) * 86400000;
  const phaseStartStr = ymd(new Date(phaseStartMs));
  const phaseEndStr = ymd(new Date(phaseEndMs));

  const inPhase = (date?: string): boolean =>
    !!date && date >= phaseStartStr && date <= phaseEndStr;

  const windowCheckins = checkins.filter((c) => inPhase(c.checkinDate));
  const windowMoods = moodLogs.filter((m) => inPhase(m.logDate));

  // ── Narrative observations ─────────────────────────────────────────
  const observations: string[] = [];

  // Sessions practiced + pillar variety
  const totalSessions = windowCheckins.length;
  const pillarCounts = new Map<string, number>();
  for (const c of windowCheckins) {
    const slug = c.pillarSlug || String(c.pillarId || "");
    if (slug) pillarCounts.set(slug, (pillarCounts.get(slug) || 0) + 1);
  }
  const distinctPillars = pillarCounts.size;

  if (totalSessions >= 1) {
    if (distinctPillars >= 3) {
      observations.push(
        `You practiced across ${distinctPillars} pillars — ${totalSessions} session${totalSessions === 1 ? "" : "s"} in total.`,
      );
    } else {
      observations.push(
        `You completed ${totalSessions} session${totalSessions === 1 ? "" : "s"} this phase.`,
      );
    }
  }

  // Anchor pillar — the most-practiced one in the window. Phrased as
  // "anchored your week" rather than a count, to keep it narrative.
  if (pillarCounts.size > 0) {
    const top = Array.from(pillarCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    const pillar = PILLARS.find((p) => p.slug === top[0]);
    if (pillar && top[1] >= 2) {
      observations.push(
        `${pillar.name} was the practice that anchored you.`,
      );
    }
  }

  // Mood trend — only when there's enough data to say something honest.
  const moodAvg = avgOf(windowMoods, "moodScore");
  if (moodAvg !== null && windowMoods.length >= 3) {
    if (moodAvg >= 4) {
      observations.push("Your mood held steady across the week.");
    } else if (moodAvg >= 3) {
      observations.push("Your mood moved through some variability.");
    }
  }

  // Return-after-miss — look for a 2+ day gap inside the window followed
  // by at least one check-in after the gap. Reflective, not punitive.
  const datesInWindow = Array.from(
    new Set(windowCheckins.map((c) => c.checkinDate).filter(Boolean) as string[]),
  ).sort();
  if (datesInWindow.length >= 2) {
    let maxGap = 0;
    let returnedAfterGap = false;
    for (let i = 1; i < datesInWindow.length; i++) {
      const prev = new Date(datesInWindow[i - 1]).getTime();
      const cur = new Date(datesInWindow[i]).getTime();
      const gap = Math.round((cur - prev) / 86400000);
      if (gap >= 2) {
        maxGap = Math.max(maxGap, gap);
        returnedAfterGap = true;
      }
    }
    if (returnedAfterGap && maxGap >= 2) {
      observations.push(
        `You returned after ${maxGap === 2 ? "a missed day" : `${maxGap - 1} missed days`}. The rhythm held.`,
      );
    }
  }

  // Empty-state fallback — if nothing meaningful happened, lean honest.
  if (observations.length === 0) {
    observations.push(
      "This phase was sparse. Tomorrow is another start — small is enough.",
    );
  }

  return {
    phaseEnded,
    currentPhase,
    observations,
    dismissKey: `vedic-reflection-dismissed-${phaseEnded.id}`,
  };
}

/**
 * Returns the phase that just ended, given today's journey day. Returns
 * null when today is not inside any reflection show-window.
 */
function pickEndedPhase(currentDay: number): JourneyPhase | null {
  // Window is the first 3 days after each phase ends (i.e. days
  // <newPhaseStart, +0, +1, +2>). Iterate from Phase 2 onwards because
  // there's no phase before Awakening to reflect on.
  for (let i = 1; i < ALL_PHASES.length; i++) {
    const newPhase = ALL_PHASES[i];
    const windowStart = newPhase.range[0];
    const windowEnd = windowStart + 2;
    if (currentDay >= windowStart && currentDay <= windowEnd) {
      return ALL_PHASES[i - 1];
    }
  }
  // After day 48: reflect on Integration for 3 days.
  if (currentDay >= 49 && currentDay <= 51) {
    return ALL_PHASES[ALL_PHASES.length - 1];
  }
  return null;
}

function avgOf(items: MoodLike[], key: keyof MoodLike): number | null {
  const nums = items
    .map((m) => m[key])
    .filter((v): v is number => typeof v === "number");
  if (nums.length === 0) return null;
  return Math.round((nums.reduce((s, v) => s + v, 0) / nums.length) * 10) / 10;
}
