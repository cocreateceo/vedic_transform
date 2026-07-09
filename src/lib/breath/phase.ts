import { cycleLength, type BreathPattern } from "./patterns";

export type BreathPhase = "inhale" | "holdIn" | "exhale" | "holdOut";

export interface BreathState {
  phase: BreathPhase;
  /** 0..1 position within the current phase. */
  progress: number;
  /** Completed-cycle index (0 during the first cycle). */
  cycle: number;
  /** 0 = fully exhaled (closed), 1 = fully inhaled (open). Drives the lotus. */
  openness: number;
}

/**
 * Pure mapping from elapsed seconds → breath state for a pattern. Zero-length
 * holds are skipped. `openness` rises over inhale, stays 1 during holdIn,
 * falls over exhale, stays 0 during holdOut.
 */
export function phaseAt(pattern: BreathPattern, elapsedSeconds: number): BreathState {
  const len = cycleLength(pattern);
  const cycle = Math.floor(elapsedSeconds / len);
  let pos = elapsedSeconds - cycle * len;

  const segments: { phase: BreathPhase; dur: number }[] = [
    { phase: "inhale", dur: pattern.inhale },
    { phase: "holdIn", dur: pattern.holdIn },
    { phase: "exhale", dur: pattern.exhale },
    { phase: "holdOut", dur: pattern.holdOut },
  ];

  for (const seg of segments) {
    if (seg.dur <= 0) continue;
    if (pos < seg.dur) {
      const progress = pos / seg.dur;
      const openness =
        seg.phase === "inhale"
          ? progress
          : seg.phase === "holdIn"
            ? 1
            : seg.phase === "exhale"
              ? 1 - progress
              : 0;
      return { phase: seg.phase, progress, cycle, openness };
    }
    pos -= seg.dur;
  }

  // Fallback (only reachable on floating-point edge at the exact cycle end).
  return { phase: "inhale", progress: 0, cycle: cycle + 1, openness: 0 };
}
