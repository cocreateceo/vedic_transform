"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Timer } from "lucide-react";
import { StepSection } from "./step-shell";
import { InlineMeditationTimer } from "./inline-meditation-timer";
import { useChapterProgressContext } from "./chapter-progress-context";
import type { ChapterStep } from "@/lib/training-steps";

export function MeditateStep({
  step,
  minutes,
  /**
   * Set only when the chapter's pillar maps to a real Sessions practice. When
   * it doesn't, the sit happens here — never a generic link into /sessions,
   * which drops the reader on tab 1 of 15 with nothing to do.
   */
  sessionHref,
  sessionLabel,
}: {
  step: ChapterStep;
  minutes: number;
  sessionHref?: string;
  sessionLabel?: string;
}) {
  const { done, markStep } = useChapterProgressContext();

  const handleTimerComplete = useCallback(() => {
    if (!done[step.key]) markStep(step.key, true);
  }, [done, markStep, step.key]);

  // Mode A — a guided session exists for this chapter's pillar.
  if (sessionHref) {
    return (
      <StepSection
        step={step}
        markLabel="I sat today"
        action={
          <Link
            href={sessionHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-shadow hover:shadow-xl"
          >
            <Timer className="h-4 w-4" />
            Start {sessionLabel ?? "the guided meditation"}
          </Link>
        }
      >
        <p className="mx-auto max-w-2xl text-center text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Sit for {minutes} minutes with this chapter&apos;s meditation. The
          guided audio and timer are waiting for you.
        </p>
      </StepSection>
    );
  }

  // Mode B — no matching session; the chapter runs the sit itself.
  return (
    <StepSection step={step} markLabel="I sat today" markVariant="subtle">
      <div className="mx-auto max-w-2xl space-y-5">
        <p className="text-center text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Sit quietly for {minutes} minutes and observe your thoughts without
          trying to change them. The timer below is all you need.
        </p>
        <InlineMeditationTimer
          minutes={minutes}
          onComplete={handleTimerComplete}
        />
      </div>
    </StepSection>
  );
}
