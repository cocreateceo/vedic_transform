"use client";

// The frame every learning-cycle step shares: an anchored section, a heading,
// the content itself, and a completion control.
//
// Two deliberate constraints:
//
//   1. The eyebrow names the STAGE ("Practice"), never "Step 5 of 8". The page
//      used to announce its own tracking model above all eight sections; the
//      count now lives in the outline rail and the closing, where an aggregate
//      belongs.
//   2. Completion is subordinate to the activity. Where a step has a real
//      action — open the practice, start the timer, write the reflection — that
//      action is the only filled button, and the manual "mark done" sits under
//      it as a quiet control. A filled CTA plus an equally loud Mark Done,
//      eight times down the page, is what made the chapter read as a form.

import { Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";
import {
  STEP_ICONS,
  stageTitleForStep,
  stepAnchorId,
  type ChapterStep,
  type StepKey,
} from "@/lib/training-steps";
import { useChapterProgressContext } from "./chapter-progress-context";

type Tone = "light" | "dark";

export function StepSection({
  step,
  tone = "light",
  markLabel,
  /** Filled CTA for the step's real action, when it has one. */
  action,
  /** Steps whose completion is implied by the activity hide the control. */
  hideMarkButton = false,
  /** Promote the completion control when it IS the step's action. */
  markVariant,
  children,
}: {
  step: ChapterStep;
  tone?: Tone;
  markLabel?: string;
  action?: React.ReactNode;
  hideMarkButton?: boolean;
  markVariant?: "primary" | "subtle";
  children: React.ReactNode;
}) {
  const { done } = useChapterProgressContext();
  const isDone = Boolean(done[step.key]);
  const Icon = STEP_ICONS[step.key];
  const stage = stageTitleForStep(step.key);
  const variant = markVariant ?? (action ? "subtle" : "primary");

  // Left-aligned, and with no outer padding or card of its own: the player
  // wraps every activity in one card, so the kicker, the heading, the content
  // and the way out of the activity read as a single object. A second card
  // here would nest, and centred text would fight the reading measure.
  return (
    <div id={stepAnchorId(step.key)} aria-label={`${stage}: ${step.title}`}>
      <p
        className={cn(
          "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]",
          tone === "dark" ? "text-amber-200/80" : "text-[#B8860B]",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {stage}
        {isDone && (
          <CheckCircle2
            className="h-3.5 w-3.5 text-green-500"
            aria-label="complete"
          />
        )}
      </p>
      <h2
        className={cn(
          SERIF_CLASS,
          "mt-2.5 text-2xl font-semibold leading-tight sm:text-3xl",
          tone === "dark" ? "text-amber-50" : "text-[var(--color-text-primary)]",
        )}
      >
        {step.title}
      </h2>
      <p
        className={cn(
          "mt-1.5 max-w-[68ch] text-[14px]",
          tone === "dark"
            ? "text-amber-100/70"
            : "text-[var(--color-text-secondary)]",
        )}
      >
        {step.note}
      </p>

      <div className="mt-6">{children}</div>

      {(action || !hideMarkButton) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5">
          {action}
          {!hideMarkButton && (
            <MarkStepButton
              stepKey={step.key}
              label={markLabel}
              tone={tone}
              variant={variant}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function MarkStepButton({
  stepKey,
  label = "Mark this done",
  tone = "light",
  variant = "primary",
}: {
  stepKey: StepKey;
  label?: string;
  tone?: Tone;
  variant?: "primary" | "subtle";
}) {
  const { done, markStep } = useChapterProgressContext();
  const isDone = Boolean(done[stepKey]);

  // Subtle: a quiet text control beneath the step's real action.
  if (variant === "subtle") {
    return (
      <button
        onClick={() => markStep(stepKey, !isDone)}
        className={cn(
          "inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 transition-colors hover:underline",
          isDone
            ? "text-green-600"
            : tone === "dark"
              ? "text-amber-100/60 hover:text-amber-100"
              : "text-[var(--color-text-muted)] hover:text-[#B8860B]",
        )}
      >
        <Check className="h-3.5 w-3.5" />
        {isDone ? "Done — undo" : label}
      </button>
    );
  }

  return (
    <button
      onClick={() => markStep(stepKey, !isDone)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
        isDone
          ? "border-green-300 bg-green-50 text-green-700"
          : tone === "dark"
            ? "border-[#DAA520]/60 bg-white/5 text-amber-100 hover:bg-white/10"
            : "border-[#DAA520]/50 bg-[var(--color-bg-surface)] text-[#B8860B] hover:bg-amber-50",
      )}
    >
      <CheckCircle2 className="h-4 w-4" />
      {isDone ? "Done — tap to undo" : label}
    </button>
  );
}

/** Surfaces a failed progress write once, near the end of the page. */
export function ProgressSaveError() {
  const { saveError } = useChapterProgressContext();
  if (!saveError) return null;
  return (
    <p className="mt-4 text-center text-sm text-red-600" role="alert">
      Couldn&apos;t save your progress just now — it will retry on your next
      action.
    </p>
  );
}
