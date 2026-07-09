"use client";

// Shared before/after mood capture for guided sessions. The value selected
// here is sent to /data/checkin as moodBefore / moodAfter (fields the API
// already persists) so the "Reflect" phase can show how the practice shifted
// the user's state — the integration step a real guided session always has.

import { cn } from "@/lib/utils/cn";

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export const MOODS: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: "😣", label: "Tense" },
  { value: 2, emoji: "😕", label: "Restless" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Calm" },
  { value: 5, emoji: "😌", label: "Serene" },
];

export function moodLabel(value: MoodValue | null): string | null {
  return MOODS.find((m) => m.value === value)?.label ?? null;
}

export function MoodCheck({
  value,
  onChange,
  prompt = "How do you feel right now?",
  light = false,
}: {
  value: MoodValue | null;
  onChange: (v: MoodValue) => void;
  prompt?: string;
  /** Use light text on dark/gradient backgrounds (e.g. Sandhya, Sleep). */
  light?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className={cn("text-sm", light ? "text-white/85" : "text-[var(--color-text-secondary)]")}>
        {prompt}
      </p>
      <div className="flex items-center gap-2">
        {MOODS.map((m) => {
          const selected = value === m.value;
          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              aria-label={m.label}
              aria-pressed={selected}
              title={m.label}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200",
                selected
                  ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                  : light
                    ? "bg-white/15 border border-white/25 hover:bg-white/25"
                    : "bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-orange-50",
              )}
            >
              <span className="text-2xl leading-none">{m.emoji}</span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  selected ? "text-white" : light ? "text-white/70" : "text-[var(--color-text-secondary)]",
                )}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
