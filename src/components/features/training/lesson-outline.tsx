"use client";

// Lesson outline — the course-syllabus rail, and the only place the chapter
// states its own tracking model.
//
// The eight tracked activities are grouped under the five stages
// (Understand → Explore → Practice → Reflect → Complete) so the reader can see
// where they are without the page printing "Step N of 8" above every section.
//
// Placement differs by width because the desktop treatment doesn't survive a
// 390px viewport: a fixed right-edge tab sits on top of the chapter's content
// there. On mobile it becomes a compact pill above the bottom nav that opens a
// bottom sheet; the desktop edge tab is unchanged.

import { useState } from "react";
import { CheckCircle2, Circle, ListTree, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";
import {
  CLOSING_ANCHOR_ID,
  stepAnchorId,
  type ChapterStage,
} from "@/lib/training-steps";
import { useChapterProgressContext } from "./steps/chapter-progress-context";

export const OPEN_MOVEMENT_EVENT = "vedic:open-movement";

export function LessonOutline({
  movements,
  stages,
}: {
  movements: { heading: string; minutes: number }[];
  stages: ChapterStage[];
}) {
  const [open, setOpen] = useState(false);
  const { done, completedCount, total } = useChapterProgressContext();

  const openMovement = (index: number) => {
    window.dispatchEvent(
      new CustomEvent(OPEN_MOVEMENT_EVENT, { detail: { index } }),
    );
    setOpen(false);
  };

  const jumpTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const counter = `${completedCount}/${total}`;

  return (
    <>
      {/* Desktop: edge tab */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-l-xl border border-r-0 border-[#DAA520]/50 bg-[#0C0F22]/90 px-2.5 py-4 text-amber-100 shadow-lg shadow-black/30 backdrop-blur transition-colors hover:border-[#DAA520] sm:block"
        aria-label="Open lesson outline"
      >
        <span className="flex flex-col items-center gap-2">
          <ListTree className="h-4 w-4 text-[#FFD700]" />
          <span className="text-[11px] font-bold tracking-widest [writing-mode:vertical-rl]">
            OUTLINE · {counter}
          </span>
        </span>
      </button>

      {/* Mobile: compact pill, clear of the bottom nav and the assistant FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#DAA520]/50 bg-[#0C0F22]/95 px-4 py-2.5 text-amber-100 shadow-lg shadow-black/30 backdrop-blur sm:hidden"
        aria-label="Open chapter outline"
      >
        <ListTree className="h-4 w-4 text-[#FFD700]" />
        <span className="text-[12px] font-bold tracking-wide">
          Outline · {counter}
        </span>
      </button>

      {open && (
        // Above the assistant FAB (z-[9999]), which otherwise floats on top of
        // the open sheet and covers a row of the outline on mobile.
        <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true">
          <button
            aria-label="Close outline"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          {/* Bottom sheet under sm, right-hand panel from sm up */}
          <aside
            className={cn(
              "absolute bottom-0 flex flex-col border-[#DAA520]/40 bg-[#0C0F22] shadow-2xl",
              "inset-x-0 max-h-[78vh] rounded-t-2xl border-t",
              "sm:inset-x-auto sm:right-0 sm:top-0 sm:max-h-none sm:w-full sm:max-w-xs sm:rounded-none sm:border-l sm:border-t-0",
            )}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className={`${SERIF_CLASS} text-lg font-semibold text-amber-50`}>
                Chapter Outline
              </p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-amber-100/70 transition-colors hover:bg-white/10 hover:text-amber-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {/* Aggregate progress — stated once, here. */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]/80">
                  {completedCount} of {total} activities complete
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                    style={{
                      width: `${(completedCount / Math.max(total, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* The five stages, with their activities nested */}
              <ol className="space-y-4">
                {stages.map((stage, i) => {
                  const stageDone =
                    stage.steps.length > 0 &&
                    stage.steps.every((s) => done[s.key]);
                  return (
                    <li key={stage.key}>
                      <p
                        className={cn(
                          "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]",
                          stageDone ? "text-green-400/80" : "text-[#FFD700]/80",
                        )}
                      >
                        <span className="text-amber-100/40">{i + 1}</span>
                        {stage.title}
                      </p>
                      {stage.steps.length > 0 ? (
                        <ul className="mt-1.5 space-y-0.5">
                          {stage.steps.map((s) => {
                            const isDone = Boolean(done[s.key]);
                            return (
                              <li key={s.key}>
                                <button
                                  onClick={() => jumpTo(stepAnchorId(s.key))}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.07]"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                                  ) : (
                                    <Circle className="h-4 w-4 shrink-0 text-amber-100/40" />
                                  )}
                                  <span
                                    className={cn(
                                      "text-[13px] font-medium",
                                      isDone
                                        ? "text-amber-100/50 line-through decoration-amber-100/30"
                                        : "text-amber-50/90",
                                    )}
                                  >
                                    {s.title}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <button
                          onClick={() => jumpTo(CLOSING_ANCHOR_ID)}
                          className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium text-amber-50/90 transition-colors hover:bg-white/[0.07]"
                        >
                          <Circle className="h-4 w-4 shrink-0 text-amber-100/40" />
                          Seal the chapter
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]/80">
                  The Teaching
                </p>
                <ol className="mt-2 space-y-0.5">
                  {movements.map((m, i) => (
                    <li key={m.heading}>
                      <button
                        onClick={() => openMovement(i)}
                        className="flex w-full items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.07]"
                      >
                        <span className="w-5 shrink-0 text-xs font-bold text-[#DAA520]/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-amber-50/90">
                          {m.heading}
                        </span>
                        <span className="shrink-0 text-[11px] text-amber-100/50">
                          {m.minutes} min
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
