"use client";

// A self-guided sit, inside the chapter.
//
// Chapters author `meditationMinutes` to mean "sit for this long". That is not
// the same as "a guided session exists for this chapter" — Chapter 2's pillar
// (Thoughts & Intention) is a journal practice, so it has minutes but no
// Sessions tab. Sending that reader to a generic /sessions with fifteen
// unrelated tabs is worse than keeping them here, so when there is no matching
// session the chapter runs the sit itself.

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";

const mmss = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

export function InlineMeditationTimer({
  minutes,
  onComplete,
}: {
  minutes: number;
  onComplete: () => void;
}) {
  const totalSeconds = minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const completedRef = useRef(false);

  // `active` is derived rather than stored, so reaching zero stops the tick
  // without a setState inside an effect.
  const active = running && remaining > 0;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (remaining > 0 || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [remaining, onComplete]);

  const elapsed = totalSeconds - remaining;
  const pct = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;
  const finished = remaining === 0;

  const reset = () => {
    setRunning(false);
    completedRef.current = false;
    setRemaining(totalSeconds);
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-[#DAA520]/40 bg-[var(--color-bg-surface)] px-6 py-5 text-center">
      <p
        className={`${SERIF_CLASS} text-4xl font-semibold tabular-nums text-[var(--color-text-primary)]`}
        aria-live="off"
      >
        {mmss(remaining)}
      </p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-card-bg)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          disabled={finished}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
            finished
              ? "cursor-not-allowed bg-[var(--color-card-bg)] text-[var(--color-text-muted)]"
              : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl",
          )}
        >
          {active ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {finished
                ? "Sit complete"
                : elapsed > 0
                  ? "Resume"
                  : `Start ${minutes}-minute sit`}
            </>
          )}
        </button>

        {elapsed > 0 && (
          <button
            onClick={reset}
            aria-label="Reset the timer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[#B8860B] hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
