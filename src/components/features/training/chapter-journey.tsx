"use client";

// The chapter learning cycle: Learn → Understand → Practice → Reflect →
// Validate → Transform. Each step persists individually to the generic
// /data/content-progress store under `training:<slug>:<step>`, and when every
// step is complete the chapter itself is marked complete (same contentId the
// ChapterActions button uses), unlocking the next stage of the journey.
//
// Progress is best-effort: reads never block the reader, and failed writes
// surface a retry hint without losing local state.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Flame,
  Lightbulb,
  ListChecks,
  NotebookPen,
  PlayCircle,
  Sparkles,
  Timer,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";
import {
  TrainingChapter,
  TrainingQuizQuestion,
  trainingContentId,
} from "@/data/training-book";

const SERIF = SERIF_CLASS;

type StepKey =
  | "read"
  | "watch"
  | "takeaways"
  | "practice"
  | "meditation"
  | "reflection"
  | "quiz"
  | "challenge";

const stepContentId = (slug: string, step: StepKey) =>
  `training:${slug}:${step}`;

export function ChapterJourney({
  chapter,
  nextSlug,
  nextTitle,
}: {
  chapter: TrainingChapter;
  nextSlug?: string;
  nextTitle?: string;
}) {
  const steps = useMemo(() => {
    const list: {
      key: StepKey;
      title: string;
      note: string;
      icon: React.ComponentType<{ className?: string }>;
    }[] = [
      {
        key: "read",
        title: "Read the Chapter",
        note: "The full teaching, above",
        icon: BookOpen,
      },
    ];
    if (chapter.lessonVideoId)
      list.push({
        key: "watch",
        title: "Watch the Cinematic Lesson",
        note: "The chapter's documentary, above",
        icon: PlayCircle,
      });
    if (chapter.keyTakeaways?.length)
      list.push({
        key: "takeaways",
        title: "Key Learnings",
        note: `${chapter.keyTakeaways.length} cards to carry with you`,
        icon: Lightbulb,
      });
    if (chapter.exercises?.length)
      list.push({
        key: "practice",
        title: "Daily Practices",
        note: `${chapter.exercises.length} practices from this chapter`,
        icon: ListChecks,
      });
    if (chapter.meditationMinutes)
      list.push({
        key: "meditation",
        title: "Guided Meditation",
        note: `${chapter.meditationMinutes} minute sit`,
        icon: Timer,
      });
    if (chapter.reflectionQuestions?.length)
      list.push({
        key: "reflection",
        title: "Reflection Journal",
        note: "Write before you move on",
        icon: NotebookPen,
      });
    if (chapter.quiz?.length)
      list.push({
        key: "quiz",
        title: "Self-Assessment",
        note: `${chapter.quiz.length} questions`,
        icon: Sparkles,
      });
    if (chapter.dailyChallenge)
      list.push({
        key: "challenge",
        title: "Daily Challenge",
        note: "One real-world action",
        icon: Flame,
      });
    return list;
  }, [chapter]);

  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<StepKey | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState(false);

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        const next: Record<string, boolean> = {};
        for (const s of steps) {
          next[s.key] = records.some(
            (r) => r.contentId === stepContentId(chapter.slug, s.key) && r.completed,
          );
        }
        setDone(next);
        setChapterCompleted(
          records.some(
            (r) =>
              r.contentId === trainingContentId(chapter.slug) && r.completed,
          ),
        );
      })
      .catch(() => {});
  }, [chapter.slug, steps]);

  const completedCount = steps.filter((s) => done[s.key]).length;
  const allDone = completedCount === steps.length;

  const persist = useCallback(async (contentId: string, completed: boolean) => {
    try {
      await apiFetch("/data/content-progress", {
        method: "POST",
        body: JSON.stringify({
          contentId,
          completed,
          progress: completed ? 100 : 0,
        }),
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const markStep = useCallback(
    async (key: StepKey, value = true) => {
      setDone((d) => ({ ...d, [key]: value }));
      setSaveError(false);
      const ok = await persist(stepContentId(chapter.slug, key), value);
      if (!ok) setSaveError(true);
    },
    [chapter.slug, persist],
  );

  // When the last step lands, seal the chapter itself.
  useEffect(() => {
    if (allDone && steps.length > 0 && !chapterCompleted) {
      setChapterCompleted(true);
      void persist(trainingContentId(chapter.slug), true);
    }
  }, [allDone, steps.length, chapterCompleted, chapter.slug, persist]);

  return (
    <section className="mx-auto max-w-3xl py-16 sm:py-20">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8860B]">
          Learn · Understand · Practice · Reflect · Validate · Transform
        </p>
        <h2
          className={`${SERIF} mt-3 text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
        >
          Your Learning Cycle
        </h2>
        <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
          Reading is only the first step. Complete the cycle to seal this
          chapter into your life.
        </p>
        {/* Progress */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
            <span>
              {completedCount} of {steps.length} complete
            </span>
            <span>{Math.round((completedCount / steps.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--color-card-bg)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {steps.map((step, i) => {
          const isDone = !!done[step.key];
          const isOpen = open === step.key;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className={cn(
                "overflow-hidden rounded-2xl border bg-[var(--color-bg-surface)] transition-colors",
                isDone
                  ? "border-green-300/70"
                  : "border-[#DAA520]/35 hover:border-[#DAA520]",
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : step.key)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    isDone
                      ? "bg-green-100 text-green-700"
                      : "bg-gradient-to-br from-amber-100 to-orange-100 text-[#B8860B]",
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-[var(--color-text-primary)]">
                    <Icon className="h-4 w-4 text-[#B8860B]" />
                    {step.title}
                  </span>
                  <span className="block text-[13px] text-[var(--color-text-muted)]">
                    {step.note}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="border-t border-[var(--color-border)] px-5 py-5">
                  <StepBody
                    step={step.key}
                    chapter={chapter}
                    isDone={isDone}
                    onMark={(v) => markStep(step.key, v)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {saveError && (
        <p className="mt-4 text-center text-sm text-red-600" role="alert">
          Couldn&apos;t save your progress just now — it will retry on your next
          action.
        </p>
      )}

      {allDone && (
        <div className="mt-8 rounded-3xl border border-[#DAA520]/60 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center">
          <Award className="mx-auto h-10 w-10 text-[#B8860B]" />
          <h3
            className={`${SERIF} mt-3 text-2xl font-semibold text-[#2A1B0E]`}
          >
            Chapter complete
          </h3>
          <p className="mt-2 text-[15px] text-[#3d3223]">
            You didn&apos;t just read this chapter — you practiced it,
            reflected on it, and made it yours.
          </p>
          {nextSlug && (
            <Link
              href={`/training/${nextSlug}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25"
            >
              Next stage unlocked: {nextTitle ?? "continue"}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

/* ————— Step bodies ————— */

function StepBody({
  step,
  chapter,
  isDone,
  onMark,
}: {
  step: StepKey;
  chapter: TrainingChapter;
  isDone: boolean;
  onMark: (v: boolean) => void;
}) {
  switch (step) {
    case "read":
      return (
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            The full teaching is the journey you just scrolled through. If you
            reached this point with attention, this step is yours to claim.
          </p>
          <MarkButton isDone={isDone} onMark={onMark} label="I read the chapter" />
        </div>
      );

    case "watch":
      return (
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            The cinematic lesson sits just below the chapter opening — the
            same teaching told as a short documentary. Watch it once with full
            attention.
          </p>
          <MarkButton
            isDone={isDone}
            onMark={onMark}
            label="I watched the lesson"
          />
        </div>
      );

    case "takeaways":
      return (
        <div className="space-y-4">
          <ul className="space-y-2.5">
            {chapter.keyTakeaways?.map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-xl border border-[#DAA520]/25 bg-[var(--color-bg-elevated)] px-4 py-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" />
                <span className="text-[15px] leading-relaxed text-[var(--color-text-primary)]">
                  {t}
                </span>
              </li>
            ))}
          </ul>
          <MarkButton
            isDone={isDone}
            onMark={onMark}
            label="I can recall these without looking"
          />
        </div>
      );

    case "practice":
      return (
        <div className="space-y-4">
          <p className="text-[15px] text-[var(--color-text-secondary)]">
            The practices are laid out in full in the Daily Practices section
            above. Do at least one today — then claim the step.
          </p>
          <ul className="flex flex-wrap gap-2">
            {chapter.exercises?.map((ex) => (
              <li
                key={ex.title}
                className="rounded-full border border-[#DAA520]/35 bg-[var(--color-bg-elevated)] px-3.5 py-1.5 text-sm text-[var(--color-text-primary)]"
              >
                {ex.title}
              </li>
            ))}
          </ul>
          <MarkButton
            isDone={isDone}
            onMark={onMark}
            label="I practiced today"
          />
        </div>
      );

    case "meditation":
      return (
        <div className="space-y-4">
          <p className="text-[15px] text-[var(--color-text-secondary)]">
            Sit for {chapter.meditationMinutes} minutes with this
            chapter&apos;s meditation (guided audio and a timer live in
            Sessions).
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Timer className="h-4 w-4" />
              Open guided sessions
            </Link>
            <MarkButton isDone={isDone} onMark={onMark} label="I sat today" />
          </div>
        </div>
      );

    case "reflection":
      return (
        <div className="space-y-4">
          <ol className="space-y-2">
            {chapter.reflectionQuestions?.map((q, i) => (
              <li
                key={i}
                className={`${SERIF} text-[15px] italic leading-relaxed text-[var(--color-text-primary)]`}
              >
                {i + 1}. {q}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <NotebookPen className="h-4 w-4" />
              Write in your journal
            </Link>
            <MarkButton isDone={isDone} onMark={onMark} label="I wrote today" />
          </div>
        </div>
      );

    case "quiz":
      return <QuizBlock quiz={chapter.quiz ?? []} isDone={isDone} onMark={onMark} />;

    case "challenge":
      return (
        <div className="space-y-4">
          <p
            className={`${SERIF} rounded-2xl border border-[#DAA520]/40 bg-gradient-to-br from-amber-50 to-orange-50 px-5 py-4 text-lg italic leading-relaxed text-[#3d3223]`}
          >
            {chapter.dailyChallenge}
          </p>
          <MarkButton
            isDone={isDone}
            onMark={onMark}
            label="Challenge completed"
          />
        </div>
      );

    default:
      return null;
  }
}

function MarkButton({
  isDone,
  onMark,
  label,
}: {
  isDone: boolean;
  onMark: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onMark(!isDone)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
        isDone
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-[#DAA520]/50 bg-[var(--color-bg-surface)] text-[#B8860B] hover:bg-amber-50",
      )}
    >
      <CheckCircle2 className="h-4 w-4" />
      {isDone ? "Done — tap to undo" : label}
    </button>
  );
}

/* ————— Quiz ————— */

function QuizBlock({
  quiz,
  isDone,
  onMark,
}: {
  quiz: TrainingQuizQuestion[];
  isDone: boolean;
  onMark: (v: boolean) => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    quiz.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const answeredAll = answers.every((a) => a !== null);
  const score = submitted
    ? answers.filter((a, i) => a === quiz[i].answer).length
    : 0;

  return (
    <div className="space-y-6">
      {quiz.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <div key={qi}>
            <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-2.5 space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isCorrect = submitted && oi === q.answer;
                const isWrongPick = submitted && isChosen && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-[15px] transition-colors",
                      isCorrect
                        ? "border-green-400 bg-green-50 text-green-800"
                        : isWrongPick
                          ? "border-red-300 bg-red-50 text-red-700"
                          : isChosen
                            ? "border-[#DAA520] bg-amber-50 text-[var(--color-text-primary)]"
                            : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[#DAA520]/60",
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="mt-2 rounded-xl bg-[var(--color-bg-elevated)] px-4 py-2.5 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          disabled={!answeredAll}
          onClick={() => {
            setSubmitted(true);
            onMark(true);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
            answeredAll
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
              : "cursor-not-allowed bg-[var(--color-card-bg)] text-[var(--color-text-muted)]",
          )}
        >
          <Sparkles className="h-4 w-4" />
          {answeredAll ? "Check my answers" : "Answer every question first"}
        </button>
      ) : (
        <div className="rounded-2xl border border-[#DAA520]/40 bg-gradient-to-br from-amber-50 to-orange-50 px-5 py-4">
          <p className={`${SERIF} text-xl font-semibold text-[#2A1B0E]`}>
            {score} of {quiz.length} correct
          </p>
          <p className="mt-1 text-sm text-[#3d3223]">
            {score === quiz.length
              ? "Full marks — the teaching landed."
              : score >= Math.ceil(quiz.length * 0.6)
                ? "Well done. Revisit the explanations above for the ones you missed."
                : "Worth a second pass through the chapter — the explanations above point the way."}
          </p>
          {isDone && (
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers(quiz.map(() => null));
              }}
              className="mt-3 text-sm font-semibold text-[#B8860B] underline"
            >
              Retake the quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}
