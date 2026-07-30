"use client";

// Training on /progress — a reader, never a writer.
//
// It answers one question, "how am I progressing through Training?", using the
// same shared selector and counts as the Dashboard card and /training, so the
// three surfaces can never disagree about the current chapter or the totals.
//
// Deliberately excluded: chapter artwork, the roadmap, per-activity rows and
// any achievement UI. Detailed Training progress belongs on /training.
//
// Training is an ADDITIONAL progress dimension. It is not folded into the
// Journey's consistency score, pillar radar, streak or karma — reading a
// chapter is not practising.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { chapterLabel } from "@/lib/learning-map";
import {
  summarizeTraining,
  type TrainingSummary,
} from "@/lib/training-selection";

export function TrainingProgressCard() {
  const [summary, setSummary] = useState<TrainingSummary | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch("/data/content-progress")
      .then((res) => {
        if (!alive) return;
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setSummary(
          summarizeTraining(
            new Set(records.filter((r) => r.completed).map((r) => r.contentId)),
          ),
        );
      })
      // Same resilience pattern as the Dashboard card: stay out of the way
      // rather than turning a reporting page into an error panel.
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!summary || summary.selection.state === "no-content") return null;

  const { selection } = summary;
  const caughtUp = selection.state === "caught-up";
  const notStarted =
    selection.state === "not-started" && summary.completedActivities === 0;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-[#B8860B]">
            <GraduationCap className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
              Training
            </p>

            {notStarted ? (
              <>
                <p className="mt-0.5 text-base font-semibold text-[var(--color-text-primary)]">
                  Not started
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Begin with the {chapterLabel(selection.chapter!)}.
                </p>
              </>
            ) : caughtUp ? (
              <>
                <p className="mt-0.5 text-base font-semibold text-[var(--color-text-primary)]">
                  You&apos;re caught up
                </p>
                {/* "available Training", never "the Journey is complete". */}
                <p className="text-sm text-[var(--color-text-secondary)]">
                  All currently available Training is complete.
                </p>
              </>
            ) : (
              <>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  <strong className="font-semibold text-[var(--color-text-primary)]">
                    {summary.chaptersComplete} of {summary.publishedChapters}
                  </strong>{" "}
                  available chapters complete
                  {summary.totalActivities > 0 && (
                    <>
                      {" · "}
                      <strong className="font-semibold text-[var(--color-text-primary)]">
                        {summary.completedActivities} of{" "}
                        {summary.totalActivities}
                      </strong>{" "}
                      activities
                    </>
                  )}
                </p>
                {selection.chapter && (
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Currently studying{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {chapterLabel(selection.chapter)} ·{" "}
                      {selection.chapter.title}
                    </span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* One CTA. Navigation only — this card writes nothing. */}
        <Link
          href={selection.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DAA520]/60 bg-[var(--color-bg-surface)] px-5 py-2.5 text-sm font-semibold text-[#B8860B] transition-colors hover:bg-amber-50"
        >
          {notStarted
            ? "Begin Training"
            : caughtUp
              ? "Review Training"
              : "Continue Training"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
