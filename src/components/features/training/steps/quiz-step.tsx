"use client";

// Self-assessment, one question at a time.
//
// Rendering all five questions with all their options at once made this the
// second-tallest thing on the chapter page (1,530px measured — 16% of the
// whole scroll) for content the reader consumes strictly sequentially. Asking
// one question at a time costs nothing in content and roughly a quarter of the
// height.
//
// Nothing authored is dropped: after submitting, every question is listed with
// its outcome, and every explanation is reachable — expanded by default for the
// ones you got wrong, one tap away for the ones you got right.

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";
import type { TrainingQuizQuestion } from "@/data/training-book";
import type { ChapterStep } from "@/lib/training-steps";
import { StepSection } from "./step-shell";
import { useChapterProgressContext } from "./chapter-progress-context";

export function QuizStep({
  step,
  quiz,
}: {
  step: ChapterStep;
  quiz: TrainingQuizQuestion[];
}) {
  const { done, markStep } = useChapterProgressContext();
  const isDone = Boolean(done[step.key]);

  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    quiz.map(() => null),
  );
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const score = answers.filter((a, i) => a === quiz[i].answer).length;
  const current = quiz[index];
  const chosen = answers[index];
  const isLast = index === quiz.length - 1;

  const reset = () => {
    setAnswers(quiz.map(() => null));
    setIndex(0);
    setSubmitted(false);
  };

  return (
    <StepSection step={step} hideMarkButton>
      <div className="mx-auto max-w-2xl">
        {!submitted ? (
          <div>
            <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--color-text-muted)]">
              <span>
                Question {index + 1} of {quiz.length}
              </span>
              <span>{answers.filter((a) => a !== null).length} answered</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-card-bg)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                style={{ width: `${((index + 1) / quiz.length) * 100}%` }}
              />
            </div>

            <p className="mt-5 text-[16px] font-semibold text-[var(--color-text-primary)]">
              {current.question}
            </p>
            <div className="mt-3 space-y-2">
              {current.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() =>
                    setAnswers((a) => a.map((v, i) => (i === index ? oi : v)))
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-[15px] transition-colors",
                    chosen === oi
                      ? "border-[#DAA520] bg-amber-50 text-[var(--color-text-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[#DAA520]/60",
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="text-[13px] font-medium text-[var(--color-text-muted)] underline-offset-4 transition-colors enabled:hover:text-[#B8860B] enabled:hover:underline disabled:opacity-0"
              >
                Back
              </button>
              <button
                disabled={chosen === null}
                onClick={() => {
                  if (isLast) {
                    setSubmitted(true);
                    markStep(step.key, true);
                  } else {
                    setIndex((i) => i + 1);
                  }
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                  chosen !== null
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "cursor-not-allowed bg-[var(--color-card-bg)] text-[var(--color-text-muted)]",
                )}
              >
                {isLast ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Check my answers
                  </>
                ) : (
                  "Next question"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#DAA520]/40 bg-gradient-to-br from-amber-50 to-orange-50 px-5 py-4 text-center">
              <p className={`${SERIF_CLASS} text-2xl font-semibold text-[#2A1B0E]`}>
                {score} of {quiz.length} correct
              </p>
              <p className="mt-1 text-sm text-[#3d3223]">
                {score === quiz.length
                  ? "Full marks — the teaching landed."
                  : score >= Math.ceil(quiz.length * 0.6)
                    ? "Well done. The explanations below cover the ones you missed."
                    : "Worth a second pass through the chapter — the explanations below point the way."}
              </p>
              {isDone && (
                <button
                  onClick={reset}
                  className="mt-3 text-sm font-semibold text-[#B8860B] underline"
                >
                  Retake the quiz
                </button>
              )}
            </div>

            {quiz.map((q, qi) => (
              <QuizReviewRow
                key={qi}
                index={qi}
                question={q}
                chosen={answers[qi]}
              />
            ))}
          </div>
        )}
      </div>
    </StepSection>
  );
}

/** One reviewed question. Wrong answers open by default; right ones fold away. */
function QuizReviewRow({
  index,
  question,
  chosen,
}: {
  index: number;
  question: TrainingQuizQuestion;
  chosen: number | null;
}) {
  const correct = chosen === question.answer;
  const [open, setOpen] = useState(!correct);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border",
        correct ? "border-green-200 bg-green-50/40" : "border-red-200 bg-red-50/40",
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
            correct ? "bg-green-500" : "bg-red-400",
          )}
        >
          {correct ? "✓" : "✕"}
        </span>
        <span className="min-w-0 flex-1 text-[14px] font-medium text-[var(--color-text-primary)]">
          {index + 1}. {question.question}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-1.5 border-t border-black/5 px-4 py-3 text-[13px] leading-relaxed">
          {!correct && chosen !== null && (
            <p className="text-red-700">
              You chose: {question.options[chosen]}
            </p>
          )}
          <p className="font-medium text-green-800">
            Correct: {question.options[question.answer]}
          </p>
          {question.explanation && (
            <p className="text-[var(--color-text-secondary)]">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
