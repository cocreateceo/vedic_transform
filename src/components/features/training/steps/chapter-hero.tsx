"use client";

// The chapter opening, in two sizes.
//
// A 48-day product shows these screens over and over, so ceremony has to be
// something you meet once, not a toll you pay on every visit. The hero renders
// compact by default and expands to its cinematic form only for a reader with
// no progress in this chapter.
//
// That order matters: the compact form is what server-renders, so the returning
// reader — the common case — sees no layout shift at all. Only a first-time
// reader gets the expansion, and they haven't scrolled yet when it happens.

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";
import {
  stageTitleForStep,
  stepAnchorId,
  type ChapterStep,
} from "@/lib/training-steps";
import { useChapterProgressContext } from "./chapter-progress-context";

export function ChapterHero({
  chapterNumber,
  title,
  subtitle,
  readMinutes,
  movements,
  sanskrit,
  translation,
  steps,
}: {
  chapterNumber: number;
  title: string;
  subtitle?: string;
  readMinutes: number;
  movements: number;
  sanskrit: string;
  translation: string;
  steps: ChapterStep[];
}) {
  const { loaded, completedCount, total, nextStep, allDone } =
    useChapterProgressContext();

  // Cinematic only once we know this reader is new to the chapter.
  const cinematic = loaded && completedCount === 0;
  const next = steps.find((s) => s.key === nextStep);
  const href = next ? `#${stepAnchorId(next.key)}` : "#chapter-close";

  return (
    <div
      className={cn(
        "relative z-10 mx-auto w-full max-w-3xl px-2 text-center transition-all duration-500",
        cinematic ? "space-y-6 py-6" : "space-y-4 py-2",
      )}
    >
      {cinematic ? (
        <>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
            Chapter {chapterNumber} · {readMinutes} min read · {movements}{" "}
            movements · {total} activities
          </p>
          <p className={`${SERIF_CLASS} text-lg italic text-amber-100/60`}>
            {sanskrit} — {translation}
          </p>
          <h1
            className={`${SERIF_CLASS} text-4xl font-semibold leading-[1.08] text-amber-50 sm:text-5xl lg:text-6xl`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-base tracking-wide text-amber-100/80 sm:text-lg">
              {subtitle}
            </p>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition-shadow hover:shadow-xl"
          >
            Begin the chapter
            <ChevronDown className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/80">
            Chapter {chapterNumber}
            {loaded && total > 0 && (
              <>
                {" · "}
                {completedCount} of {total} complete
              </>
            )}
          </p>
          <h1
            className={`${SERIF_CLASS} text-3xl font-semibold leading-tight text-amber-50 sm:text-4xl`}
          >
            {title}
          </h1>

          {loaded && total > 0 && (
            <div className="mx-auto max-w-xs">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all duration-700"
                  style={{ width: `${(completedCount / total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition-shadow hover:shadow-xl"
          >
            {!loaded
              ? "Enter the chapter"
              : allDone
                ? "Revisit the chapter"
                : next
                  ? `Continue: ${stageTitleForStep(next.key)}`
                  : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </div>
  );
}

/**
 * Wrapper that owns the hero's height. Kept separate from ChapterHero so the
 * section shell (video, gradients, mandala) stays in the server component and
 * only the height class reacts to progress.
 */
export function ChapterHeroFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loaded, completedCount } = useChapterProgressContext();
  const cinematic = loaded && completedCount === 0;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center px-6 transition-[min-height] duration-500",
        cinematic ? "min-h-[50vh] py-16" : "min-h-[30vh] py-10",
      )}
    >
      {children}
    </div>
  );
}
