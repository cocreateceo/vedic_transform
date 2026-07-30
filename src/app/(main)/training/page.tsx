"use client";

// The training landing as a learning journey, not a chapter list.
//
// Order is deliberate: the hero states where you are and offers one CTA that
// resumes the exact step you owe, then the current chapter is the first
// full-width thing you meet, then how that chapter connects to your daily
// practice, then the roadmap, then the honest course totals.
//
// Two things this page used to get wrong:
//   - Five stat tiles sat between the hero and the current chapter, so the one
//     action on the page was pushed below a wall of numbers. They are now one
//     line, below the roadmap.
//   - It claimed "48 days of transformation", borrowing the 48-day journey's
//     number for a book that has no day mapping. Gone.
//   - It called its four chapter groups "Phases", colliding with the six
//     journey phases the dashboard names. They are now "Parts".
//
// Every number shown is still derived from authored content in
// training-book.ts — no invented lesson counts, durations, or unlock conditions.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  ListChecks,
  Lock,
  Mail,
  MessageCircleQuestion,
  Video,
} from "lucide-react";
import {
  TRAINING_CHAPTERS,
  TrainingChapter,
  chapterReadMinutes,
  getPublishedChapters,
  getTrainingChapterBySlug,
  trainingContentId,
} from "@/data/training-book";
import { introSerif, SERIF_CLASS } from "@/lib/fonts";
import { LotusDivider } from "@/components/features/training/intro/mandala";
import { CurrentChapterCard } from "@/components/features/training/current-chapter-card";
import { stageTitleForStep } from "@/lib/training-steps";
import { selectTraining } from "@/lib/training-selection";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

interface ProgressRecord {
  contentId: string;
  completed: boolean;
}

// Contiguous learning parts — editorial grouping of the fixed reading order.
// Deliberately NOT called phases: the dashboard's "Phase 2" means day 8–14 of
// the 48-day journey, and two different meanings for one word is worse than two
// words.
const PARTS: { name: string; tagline: string; numbers: number[] }[] = [
  {
    name: "Awakening",
    tagline: "Ground yourself in the journey and awaken awareness",
    numbers: [0, 1, 2],
  },
  {
    name: "Inner Practice",
    tagline: "Meditation, purpose, and sustainable vitality",
    numbers: [3, 4, 5],
  },
  {
    name: "Conscious Living",
    tagline: "Relationships, leadership, and care of the body",
    numbers: [6, 7, 8, 9],
  },
  {
    name: "Creation & Integration",
    tagline: "Manifest, integrate, and live the 10x Vedic life",
    numbers: [10, 11],
  },
];

const chapterLabel = (c: TrainingChapter) =>
  c.number === 0 ? "Introduction" : `Chapter ${c.number}`;

function MetaChips({ chapter }: { chapter: TrainingChapter }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" />
        {chapterReadMinutes(chapter)} min read
      </span>
      {chapter.exercises && chapter.exercises.length > 0 && (
        <span className="inline-flex items-center gap-1">
          <ListChecks className="w-3.5 h-3.5" />
          {chapter.exercises.length} practices
        </span>
      )}
      {chapter.reflectionQuestions && chapter.reflectionQuestions.length > 0 && (
        <span className="inline-flex items-center gap-1">
          <MessageCircleQuestion className="w-3.5 h-3.5" />
          {chapter.reflectionQuestions.length} reflections
        </span>
      )}
    </div>
  );
}

/**
 * One part of the roadmap. The part holding the current chapter is open; the
 * rest collapse to a summary row.
 *
 * Chapter titles are the clearest statement of what the programme actually
 * teaches, so they are never removed — collapsing only lowers their default
 * visual weight, and one tap brings them back. Open state is derived rather
 * than stored so a part opens by itself when progress moves into it, while a
 * reader's own toggle still wins.
 */
function PartSection({
  index,
  name,
  tagline,
  status,
  chapterCount,
  holdsCurrent,
  children,
}: {
  index: number;
  name: string;
  tagline: string;
  status: string;
  chapterCount: number;
  holdsCurrent: boolean;
  children: React.ReactNode;
}) {
  const [override, setOverride] = useState<boolean | null>(null);
  const open = override ?? holdsCurrent;

  return (
    <div
      className={cn(
        "rounded-2xl transition-colors",
        open ? "pb-2" : "border border-[var(--color-border)]"
      )}
    >
      <button
        onClick={() => setOverride(!open)}
        aria-expanded={open}
        className={cn(
          "flex w-full flex-wrap items-baseline justify-between gap-2 text-left",
          open ? "mb-5" : "p-4"
        )}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8860B]">
            Part {index + 1}
          </p>
          <h2
            className={cn(
              SERIF_CLASS,
              "font-semibold text-[var(--color-text-primary)]",
              open ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            )}
          >
            {name}
          </h2>
          {open ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              {tagline}
            </p>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              {chapterCount} chapters ·{" "}
              <span className="font-semibold text-[#B8860B]">
                View chapters
              </span>
            </p>
          )}
        </div>
        <span className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          {status}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              open && "rotate-180"
            )}
          />
        </span>
      </button>
      {open && children}
    </div>
  );
}

export default function TrainingPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as ProgressRecord[];
        setCompletedIds(
          new Set(records.filter((r) => r.completed).map((r) => r.contentId))
        );
      })
      .catch(() => {}); // progress is an enhancement, never a blocker
  }, []);

  // Which chapter is current, what activity is next, and how it joins daily
  // practice — computed by the shared selector the dashboard card also uses, so
  // the two surfaces can never name a different "current chapter".
  const selection = selectTraining(completedIds);
  const published = getPublishedChapters();
  const isComplete = (c: TrainingChapter) =>
    completedIds.has(trainingContentId(c.slug));

  const completedCount = selection.chaptersSealed;
  const pct = selection.percentComplete;
  const current = selection.state === "caught-up" ? undefined : selection.chapter;
  const remainingMinutes = selection.remainingMinutes;
  const currentSteps = current ? selection.stepKeys : [];
  const currentStepsDone = current ? selection.stepsComplete : 0;
  const nextStepKey = current ? selection.nextStep : undefined;
  const resumeHref = selection.href;
  const currentLink = current ? selection.link : undefined;

  // Course statistics — real numbers only, from authored content.
  const totalPractices = TRAINING_CHAPTERS.reduce(
    (n, c) => n + (c.exercises?.length ?? 0),
    0
  );
  const totalReflections = TRAINING_CHAPTERS.reduce(
    (n, c) => n + (c.reflectionQuestions?.length ?? 0),
    0
  );
  const totalMinutes = published.reduce(
    (n, c) => n + chapterReadMinutes(c),
    0
  );

  return (
    <div
      className={`${introSerif.variable} max-w-3xl lg:max-w-5xl mx-auto space-y-10`}
    >
      {/* ————— Progress dashboard hero ————— */}
      <header className="relative overflow-hidden rounded-3xl border border-[#DAA520]/40">
        <video
          src="/training-media/ambient-copper-1.mp4"
          poster={getTrainingChapterBySlug("introduction")?.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F0]/92 via-[#FFF9F0]/85 to-white/80" />
        <div className="relative z-10 p-6 sm:p-8 space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8860B]">
            10x Vedic · {TRAINING_CHAPTERS.length - 1} chapters + introduction
          </p>
          {/* Status and context only. The Continue action belongs to the
              current-chapter card below — two Resume buttons 300px apart made
              the page look like it had two different next moves. */}
          <div>
            <h1
              className={`${SERIF_CLASS} text-4xl sm:text-5xl font-semibold text-[#2A1B0E] leading-tight`}
            >
              Your Training
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#5a4a33] max-w-xl">
              Ancient Wisdom. Conscious Leadership. Science-Powered
              Transformation.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#7a6647]">
              <span>
                {current ? (
                  <>
                    You are on{" "}
                    <strong className="font-semibold text-[#2A1B0E]">
                      {chapterLabel(current)} — {current.title}
                    </strong>
                    {currentSteps.length > 0 && (
                      <>
                        {" · "}
                        {currentStepsDone} of {currentSteps.length} activities
                        complete
                      </>
                    )}
                    {remainingMinutes > 0 &&
                      ` · about ${remainingMinutes} min of reading remains`}
                  </>
                ) : (
                  "All available chapters complete — the next one is being written"
                )}
              </span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#DAA520]/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#9a8259]">
              {completedCount} of {published.length} available chapters
              completed · {TRAINING_CHAPTERS.length - published.length} more in
              writing
            </p>
          </div>
        </div>
      </header>

      {/* ————— The current chapter: the first thing below the hero ————— */}
      {current && (
        <section aria-label="Your current chapter" className="space-y-4">
          <CurrentChapterCard
            chapter={current}
            eyebrow={
              currentSteps.length > 0 && currentStepsDone > 0
                ? `Current chapter · ${currentStepsDone}/${currentSteps.length} complete`
                : "Current chapter"
            }
            ctaLabel={
              currentStepsDone > 0 && nextStepKey
                ? `Continue: ${stageTitleForStep(nextStepKey)}`
                : completedCount === 0 && current.number === 0
                  ? "Begin here"
                  : "Start this chapter"
            }
            href={resumeHref}
          />

          {/* How this chapter becomes a daily practice — the join the book
              already authored via relatedPillarSlug, finally surfaced. */}
          {currentLink?.pillar && (
            <div className="vedic-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
                  This chapter in your daily practice
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {chapterLabel(current)} is practiced as the{" "}
                  <Link
                    href={`/pillars/${currentLink.pillar.slug}`}
                    className="font-semibold text-[var(--color-text-primary)] underline underline-offset-2"
                  >
                    {currentLink.pillar.name}
                  </Link>{" "}
                  pillar.
                </p>
              </div>
              {currentLink.practiceHref && (
                <Link
                  href={currentLink.practiceHref}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DAA520]/60 bg-[var(--color-bg-surface)] px-5 py-2.5 text-sm font-semibold text-[#B8860B] transition-colors hover:bg-amber-50"
                >
                  Open {currentLink.practiceLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </section>
      )}

      {/* Every published chapter sealed — the hero carries no action, so the
          revisit route lives here. */}
      {!current && published.length > 0 && (
        <Link
          href={resumeHref}
          className="vedic-card flex items-center justify-between gap-4 p-5"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
              All published chapters sealed
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Revisit the most recent chapter while the next one is written.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
        </Link>
      )}

      <LotusDivider />

      {/* ————— Learning roadmap, grouped into parts ————— */}
      <section className="space-y-6">
        {PARTS.map((part, partIdx) => {
          const chapters = part.numbers
            .map((n) => TRAINING_CHAPTERS.find((c) => c.number === n))
            .filter((c): c is TrainingChapter => Boolean(c));
          const partPublished = chapters.filter(
            (c) => c.status === "published"
          );
          const partComingSoon = chapters.filter(
            (c) => c.status !== "published"
          );
          const partDone = partPublished.filter(isComplete).length;
          const holdsCurrent = Boolean(
            current && chapters.some((c) => c.slug === current.slug)
          );

          return (
            <PartSection
              key={part.name}
              index={partIdx}
              name={part.name}
              tagline={part.tagline}
              chapterCount={chapters.length}
              holdsCurrent={holdsCurrent}
              status={
                partPublished.length === 0
                  ? "In writing"
                  : `${partDone} of ${partPublished.length} available completed`
              }
            >
              {/* Spine ties the part's chapters into one path */}
              <div className="relative space-y-4 pl-9">
                <div
                  aria-hidden="true"
                  className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#DAA520]/60 to-[var(--color-border)]"
                />
                {partPublished.map((chapter) => {
                  const done = isComplete(chapter);
                  const isCurrent = current?.slug === chapter.slug;

                  return (
                    <div key={chapter.slug} className="relative">
                      {/* The current-chapter card above already establishes
                          where the reader is; the roadmap marks it with a
                          filled dot rather than a third focal point. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -left-9 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                          done
                            ? "border-[#DAA520] bg-gradient-to-br from-amber-300 to-[#DAA520] text-white"
                            : isCurrent
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : "border-[#DAA520]/50 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          chapter.number
                        )}
                      </span>
                      <Link
                        href={`/training/${chapter.slug}`}
                        className={cn(
                          "group flex items-start gap-4 rounded-2xl border p-4 transition-all hover:border-[#DAA520]",
                          done
                            ? "border-[#DAA520]/50 bg-gradient-to-br from-amber-50/70 to-white/50"
                            : "border-[var(--color-border)] bg-[var(--color-card-bg)]"
                        )}
                      >
                        <div className="relative shrink-0 w-24 h-[54px] rounded-lg overflow-hidden">
                          <Image
                            src={chapter.posterImage ?? chapter.image}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                            {chapterLabel(chapter)}
                            {done && (
                              <span className="text-[#B8860B]"> · Completed</span>
                            )}
                            {!done && isCurrent && (
                              <span className="text-[var(--color-primary)]">
                                {" "}
                                · Current
                              </span>
                            )}
                          </p>
                          <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                            {chapter.title}
                          </h3>
                          <MetaChips chapter={chapter} />
                        </div>
                      </Link>
                    </div>
                  );
                })}

                {/* Coming soon: one honest row per part rather than a column of
                    padlocks. Titles stay visible so the roadmap still reads as
                    a plan, not a paywall. */}
                {partComingSoon.length > 0 && (
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-9 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]"
                    >
                      <Lock className="w-3 h-3" />
                    </span>
                    <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card-bg)] p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#B8860B]">
                        {partComingSoon.length}{" "}
                        {partComingSoon.length === 1 ? "chapter" : "chapters"} in
                        writing — arriving soon
                      </p>
                      <ul className="mt-2 space-y-1">
                        {partComingSoon.map((c) => (
                          <li
                            key={c.slug}
                            className="text-sm text-[var(--color-text-secondary)]"
                          >
                            <span className="text-[var(--color-text-muted)]">
                              {chapterLabel(c)} ·{" "}
                            </span>
                            {c.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </PartSection>
          );
        })}
      </section>

      {/* ————— Course totals: one honest line, real numbers only ————— */}
      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        <strong className="font-semibold text-[var(--color-text-primary)]">
          {TRAINING_CHAPTERS.length - 1} chapters + introduction
        </strong>{" "}
        · {totalMinutes} minutes of teaching published so far ·{" "}
        {totalPractices} guided practices · {totalReflections} reflection prompts
      </p>

      <LotusDivider />

      {/* ————— Achievements (real feature elsewhere in the app) ————— */}
      <Link
        href="/achievements"
        className="vedic-card group flex items-center justify-between gap-4 p-5 sm:p-6"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-[#B8860B]">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
              Your achievements
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Milestones you earn across your whole practice.
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
      </Link>

      {/* ————— Live classes (honest: enrollment not open yet) ————— */}
      <section className="relative overflow-hidden rounded-3xl border border-[#DAA520]/40 bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
              <Video className="w-3.5 h-3.5" />
              Live classes · Coming soon
            </p>
            <h2
              className={`${SERIF_CLASS} text-2xl font-semibold text-[#2A1B0E]`}
            >
              Practice together, live
            </h2>
            <p className="text-sm leading-relaxed text-[#5a4a33]">
              Guided group sessions for each chapter — meditation, Q&amp;A, and
              practice with a mentor. Enrollment hasn&apos;t opened yet;
              register your interest and you&apos;ll be first to know.
            </p>
          </div>
          <a
            href="mailto:support@10xvedic.com?subject=10x%20Vedic%20Live%20Classes%20%E2%80%94%20Register%20Interest"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
          >
            <Mail className="w-4 h-4" />
            Register interest
          </a>
        </div>
      </section>
    </div>
  );
}
