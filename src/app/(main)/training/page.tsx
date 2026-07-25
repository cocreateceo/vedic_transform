"use client";

// The training landing page as a learning journey, not a chapter list:
// a progress dashboard hero with one dominant Continue CTA, real course
// statistics, a phase-grouped roadmap where the current chapter is the
// biggest thing on the page, and honest coming-soon teasers. Every number
// shown is derived from authored content in training-book.ts — no invented
// lesson counts, durations, or unlock conditions.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
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
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

interface ProgressRecord {
  contentId: string;
  completed: boolean;
}

// Contiguous learning phases — editorial grouping of the fixed reading order.
const PHASES: { name: string; tagline: string; numbers: number[] }[] = [
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

  const published = getPublishedChapters();
  const isComplete = (c: TrainingChapter) =>
    completedIds.has(trainingContentId(c.slug));
  const completedCount = published.filter(isComplete).length;
  const pct =
    published.length > 0
      ? Math.round((completedCount / published.length) * 100)
      : 0;

  // Where the journey stands: first published chapter not yet completed.
  const current = published.find((c) => !isComplete(c));
  const remainingMinutes = published
    .filter((c) => !isComplete(c))
    .reduce((sum, c) => sum + chapterReadMinutes(c), 0);

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
  const stats: { value: string; label: string }[] = [
    { value: "48", label: "days of transformation" },
    { value: "11", label: "chapters + introduction" },
    { value: `${totalMinutes}`, label: "minutes of teaching so far" },
    { value: `${totalPractices}`, label: "guided practices" },
    { value: `${totalReflections}`, label: "reflection prompts" },
  ];

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
            Training course · 48-day journey
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className={`${SERIF_CLASS} text-4xl sm:text-5xl font-semibold text-[#2A1B0E] leading-tight`}
              >
                10x Vedic
              </h1>
              <p className="mt-1 text-sm sm:text-base text-[#5a4a33] max-w-xl">
                Ancient Wisdom. Conscious Leadership. Science-Powered
                Transformation.
              </p>
            </div>
            {current ? (
              <Link
                href={`/training/${current.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-shadow hover:shadow-xl"
              >
                {completedCount === 0 ? "Begin the journey" : "Continue journey"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              published.length > 0 && (
                <Link
                  href={`/training/${published[published.length - 1].slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DAA520] bg-white/70 px-7 py-3 text-sm font-semibold text-[#8B6914] transition-colors hover:bg-white"
                >
                  Revisit the chapters
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )
            )}
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
                    {remainingMinutes > 0 &&
                      ` · about ${remainingMinutes} min of reading remains`}
                  </>
                ) : (
                  "All available chapters complete — Chapter 3 is being written"
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

      {/* ————— Course statistics (real numbers only) ————— */}
      <section
        aria-label="Course statistics"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-5 text-center"
          >
            <p
              className={`${SERIF_CLASS} text-3xl font-semibold text-[var(--color-text-primary)]`}
            >
              {s.value}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-[var(--color-text-muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <LotusDivider />

      {/* ————— Learning roadmap, grouped into phases ————— */}
      <section className="space-y-12">
        {PHASES.map((phase, phaseIdx) => {
          const chapters = phase.numbers
            .map((n) => TRAINING_CHAPTERS.find((c) => c.number === n))
            .filter((c): c is TrainingChapter => Boolean(c));
          const phasePublished = chapters.filter(
            (c) => c.status === "published"
          );
          const phaseDone = phasePublished.filter(isComplete).length;

          return (
            <div key={phase.name}>
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8860B]">
                    Phase {phaseIdx + 1}
                  </p>
                  <h2
                    className={`${SERIF_CLASS} text-2xl sm:text-3xl font-semibold text-[var(--color-text-primary)]`}
                  >
                    {phase.name}
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {phase.tagline}
                  </p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {phasePublished.length === 0
                    ? "In writing"
                    : `${phaseDone} of ${phasePublished.length} available completed`}
                </p>
              </div>

              {/* Spine ties the phase's chapters into one path */}
              <div className="relative space-y-4 pl-9">
                <div
                  aria-hidden="true"
                  className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#DAA520]/60 to-[var(--color-border)]"
                />
                {chapters.map((chapter) => {
                  const done = isComplete(chapter);
                  const isCurrent = current?.slug === chapter.slug;
                  const publishedChapter = chapter.status === "published";

                  const node = (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-9 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                        done
                          ? "border-[#DAA520] bg-gradient-to-br from-amber-300 to-[#DAA520] text-white"
                          : isCurrent
                          ? "border-[var(--color-primary)] bg-[var(--color-bg-surface)] text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/15"
                          : publishedChapter
                          ? "border-[#DAA520]/50 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                          : "border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]"
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : publishedChapter ? (
                        chapter.number
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                    </span>
                  );

                  // Current chapter: the dominant card on the page.
                  if (isCurrent) {
                    return (
                      <div key={chapter.slug} className="relative">
                        {node}
                        <Link
                          href={`/training/${chapter.slug}`}
                          className="group grid overflow-hidden rounded-3xl border-2 border-[var(--color-primary)] bg-[var(--color-bg-surface)] shadow-lg shadow-orange-500/10 transition-shadow hover:shadow-xl sm:grid-cols-[260px_1fr]"
                        >
                          <div className="relative aspect-[16/9] sm:aspect-auto sm:min-h-full">
                            <Image
                              src={chapter.posterImage ?? chapter.image}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, 260px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-5 sm:p-6 space-y-2.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                              {chapterLabel(chapter)} · You are here
                            </p>
                            <h3
                              className={`${SERIF_CLASS} text-2xl font-semibold leading-snug text-[var(--color-text-primary)]`}
                            >
                              {chapter.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                              {chapter.description}
                            </p>
                            <MetaChips chapter={chapter} />
                            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow shadow-orange-500/25">
                              {completedCount === 0 && chapter.number === 0
                                ? "Begin here"
                                : "Resume"}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  }

                  if (publishedChapter) {
                    return (
                      <div key={chapter.slug} className="relative">
                        {node}
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
                                <span className="text-[#B8860B]">
                                  {" "}
                                  · Completed
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
                  }

                  // Coming soon: tease honestly — blurred art, golden lock,
                  // real description. No fake durations or unlock conditions.
                  return (
                    <div key={chapter.slug} className="relative">
                      {node}
                      <div className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4">
                        <div className="relative shrink-0 w-24 h-[54px] rounded-lg overflow-hidden">
                          <Image
                            src={chapter.posterImage ?? chapter.image}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover blur-[3px] scale-110 opacity-80"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/30 to-black/10">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-[#DAA520] shadow">
                              <Lock className="w-3.5 h-3.5 text-white" />
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-[#B8860B]">
                            {chapterLabel(chapter)} · In writing — arriving soon
                          </p>
                          <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
                            {chapter.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-2">
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

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
              Milestones you earn across your whole practice — see what
              completing chapters unlocks.
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
