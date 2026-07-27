"use client";

// Lesson outline drawer — the course-syllabus rail from premium learning
// platforms, adapted to the ceremony. A slim tab on the right edge opens a
// slide-over panel listing every movement (with reading time) and every
// learning-cycle step (with live completion state). Movements open their
// accordion panel and scroll to it; cycle steps jump to the rail.

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Circle, ListTree, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";

export const OPEN_MOVEMENT_EVENT = "vedic:open-movement";

export function LessonOutline({
  slug,
  movements,
  steps,
}: {
  slug: string;
  movements: { heading: string; minutes: number }[];
  steps: { key: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setDone(
          new Set(
            steps
              .filter((s) =>
                records.some(
                  (r) =>
                    r.contentId === `training:${slug}:${s.key}` && r.completed,
                ),
              )
              .map((s) => s.key),
          ),
        );
      })
      .catch(() => {});
  }, [slug, steps]);

  const openMovement = (index: number) => {
    window.dispatchEvent(
      new CustomEvent(OPEN_MOVEMENT_EVENT, { detail: { index } }),
    );
    setOpen(false);
  };

  const jumpToCycle = () => {
    document
      .getElementById("cycle")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      {/* Edge tab */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-xl border border-r-0 border-[#DAA520]/50 bg-[#0C0F22]/90 px-2.5 py-4 text-amber-100 shadow-lg shadow-black/30 backdrop-blur transition-colors hover:border-[#DAA520]"
        aria-label="Open lesson outline"
      >
        <span className="flex flex-col items-center gap-2">
          <ListTree className="h-4 w-4 text-[#FFD700]" />
          <span className="text-[11px] font-bold tracking-widest [writing-mode:vertical-rl]">
            OUTLINE · {done.size}/{steps.length}
          </span>
        </span>
      </button>

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            aria-label="Close outline"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-xs flex-col border-l border-[#DAA520]/40 bg-[#0C0F22] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className={`${SERIF_CLASS} text-lg font-semibold text-amber-50`}>
                Lesson Outline
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
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]/80">
                  The Teaching
                </p>
                <ol className="mt-3 space-y-1">
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

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]/80">
                  Learning Cycle · {done.size}/{steps.length}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                    style={{
                      width: `${(done.size / Math.max(steps.length, 1)) * 100}%`,
                    }}
                  />
                </div>
                <ol className="mt-3 space-y-1">
                  {steps.map((s) => {
                    const isDone = done.has(s.key);
                    return (
                      <li key={s.key}>
                        <button
                          onClick={jumpToCycle}
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
                </ol>
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <button
                onClick={jumpToCycle}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <BookOpen className="h-4 w-4" />
                Go to your learning cycle
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
