"use client";

// Today's Teaching — the dashboard's one link into Training.
//
// Training used to have no inbound link from anywhere except the sidebar, so a
// learner doing their daily practice had no reason to discover the book at all.
// This card exists to answer one question — "what should I learn next?" — and
// nothing else. It is deliberately not a miniature /training page: no artwork,
// no course statistics, no second CTA.
//
// It sits BELOW Today's Practice. Practice is the daily action; the teaching
// explains and supports it, and must not displace it.
//
// It writes nothing. Opening or finishing a chapter never touches the 48-day
// journey day, check-in, streak or karma — Training progress and practice
// participation are separate ledgers.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { chapterReadMinutes } from "@/data/training-book";
import { chapterLabel } from "@/lib/learning-map";
import {
  selectTraining,
  trainingCtaLabel,
  type TrainingSelection,
} from "@/lib/training-selection";

export function TodaysTeachingCard() {
  const [selection, setSelection] = useState<TrainingSelection | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch("/data/content-progress")
      .then((res) => {
        if (!alive) return;
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setSelection(
          selectTraining(
            new Set(records.filter((r) => r.completed).map((r) => r.contentId)),
          ),
        );
      })
      // Progress is unreachable — stay hidden rather than claiming the learner
      // hasn't started. A dashboard card is no place for an error panel.
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!selection || selection.state === "no-content") return null;

  const { chapter } = selection;
  if (!chapter) return null;

  const caughtUp = selection.state === "caught-up";
  const pillarName = selection.link?.pillar?.name;

  return (
    <Link
      href={selection.href}
      className="vedic-card group flex flex-wrap items-center justify-between gap-4 p-5"
    >
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-[#B8860B]">
          <GraduationCap className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
            {caughtUp ? "Training" : "Today's teaching"}
          </p>

          {caughtUp ? (
            <>
              <p className="mt-0.5 text-base font-semibold text-[var(--color-text-primary)]">
                You&apos;re caught up
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                All currently available chapters are complete.
              </p>
            </>
          ) : (
            <>
              <p className="mt-0.5 text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {chapterLabel(chapter)} · {chapter.title}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {selection.stepKeys.length > 0 ? (
                  <>
                    {selection.stepsComplete} of {selection.stepKeys.length}{" "}
                    activities complete
                    {selection.nextStepStage && (
                      <> · Next: {selection.nextStepStage}</>
                    )}
                  </>
                ) : (
                  // The Introduction has no learning cycle; quoting activity
                  // counts for it would describe a page that doesn't exist.
                  <>{chapterReadMinutes(chapter)} min read</>
                )}
              </p>
              {/* Only when the book actually authors the relationship. */}
              {pillarName && (
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  Related to: {pillarName}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-orange-500/25">
        {trainingCtaLabel(selection)}
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
