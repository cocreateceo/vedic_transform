"use client";

// Daily practices as a compact two-column grid of expandable cards —
// titles always visible, steps revealed on tap.

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";
import { TrainingExercise } from "@/data/training-book";

export function PracticeCards({
  exercises,
}: {
  exercises: TrainingExercise[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {exercises.map((ex, i) => {
        const isOpen = open === i;
        return (
          <div
            key={ex.title}
            className={cn(
              "self-start overflow-hidden rounded-2xl border bg-[var(--color-bg-surface)] transition-all",
              isOpen
                ? "border-[#DAA520]/60 sm:col-span-2"
                : "border-[#DAA520]/30 hover:border-[#DAA520] hover:shadow-[0_4px_20px_rgba(218,165,32,0.12)]",
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span
                className={`${SERIF_CLASS} flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-sm font-semibold text-[#B8860B]`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold text-[var(--color-text-primary)]">
                {ex.title}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <ul className="space-y-2 border-t border-[var(--color-border)] px-5 pb-5 pt-4">
                {ex.steps.map((step, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-[var(--color-text-primary)]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DAA520]" />
                    {step}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
