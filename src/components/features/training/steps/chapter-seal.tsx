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
import { useChapterProgressContext } from "./chapter-progress-context";

export function ChapterSeal({
  nextSlug,
  nextTitle,
}: {
  nextSlug?: string;
  nextTitle?: string;
}) {
  const { completedCount, total, allDone, loaded } = useChapterProgressContext();

  return (
    <div className="space-y-6">
      {loaded && !allDone && total > 0 && (
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5a4a33]">
            <span>
              {completedCount} of {total} activities complete
            </span>
            <span>{Math.round((completedCount / total) * 100)}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700"
              style={{ width: `${(completedCount / total) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] text-[#5a4a33]">
            Finish the remaining activities to seal this chapter.
          </p>
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
        <Link
          href={`/training/${nextSlug}`}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
        >
          {allDone ? "Next chapter unlocked" : "Continue to"} {nextTitle ?? "the next chapter"}
          <ArrowRight className="h-4 w-4" />
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
