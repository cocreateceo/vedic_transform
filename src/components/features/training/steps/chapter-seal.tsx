"use client";

// The one place a chapter ends.
//
// Before this, "you finished" was said three times — the learning cycle had a
// completion card with a next-chapter link, the sunrise closing had its own
// next-chapter link, and the footer had a third in the prev/next pair. The
// prev/next pair is navigation and stays; these two merged into this.

import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { SERIF_CLASS } from "@/lib/fonts";
import { STEP_SHORT_LABELS, stepAnchorId } from "@/lib/training-steps";
import { useChapterProgressContext } from "./chapter-progress-context";

export function ChapterSeal({
  nextSlug,
  nextTitle,
}: {
  nextSlug?: string;
  nextTitle?: string;
}) {
  const { completedCount, total, allDone, loaded, nextStep } =
    useChapterProgressContext();
  const remaining = total - completedCount;

  return (
    <div className="space-y-6">
      {/* An unfinished chapter gets its next move, not a second progress bar.
          The count and the percentage already live in the spine meter; saying
          them again here told the reader something they had just read and gave
          them nothing to do about it. */}
      {loaded && !allDone && total > 0 && (
        <div className="mx-auto max-w-md space-y-3">
          <p className="text-[15px] font-semibold text-[#5a4a33]">
            {remaining} {remaining === 1 ? "activity" : "activities"} remaining
            to seal this chapter.
          </p>
          {nextStep && (
            <a
              href={`#${stepAnchorId(nextStep)}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
            >
              Continue with {STEP_SHORT_LABELS[nextStep]}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {allDone && (
        <div className="mx-auto max-w-lg rounded-3xl border border-[#DAA520]/60 bg-white/60 p-6 text-center backdrop-blur">
          <Award className="mx-auto h-10 w-10 text-[#B8860B]" />
          <h3 className={`${SERIF_CLASS} mt-3 text-2xl font-semibold text-[#2A1B0E]`}>
            Chapter sealed
          </h3>
          <p className="mt-2 text-[15px] text-[#3d3223]">
            You didn&apos;t just read this chapter — you practiced it, reflected
            on it, and made it yours.
          </p>
        </div>
      )}

      {nextSlug ? (
        // Only the dominant action once the chapter is sealed. While it is
        // unfinished, moving on is still allowed but must not outrank the
        // activity the reader is one tap away from finishing.
        <Link
          href={`/training/${nextSlug}`}
          className={
            allDone
              ? "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
              : "inline-flex items-center gap-1.5 text-[13px] font-medium text-[#8B6914] underline-offset-4 hover:underline"
          }
        >
          {allDone ? "Next chapter unlocked" : "Skip ahead to"}{" "}
          {nextTitle ?? "the next chapter"}
          <ArrowRight className={allDone ? "h-4 w-4" : "h-3.5 w-3.5"} />
        </Link>
      ) : (
        // Last published chapter — say so, rather than dead-ending on a bare
        // "Back to Training" that reads like the book has run out.
        <div className="space-y-3">
          <p className="text-[15px] text-[#5a4a33]">
            This is the last published chapter — the next one is being written.
          </p>
          <Link
            href="/training"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
          >
            Back to your training
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
