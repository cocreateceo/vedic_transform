"use client";

// The navigation shared by the chapter player and the introduction reader.
//
// Both surfaces present the same thing — an ordered set of positions, one open
// at a time — so they present it the same way: a sticky numbered rail on
// desktop, a dot strip on mobile, and exactly one progress meter. Keeping it
// in one component is what stops the two from drifting into two different
// ideas of what progress looks like.

import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SpineItem {
  key: string;
  label: string;
  done: boolean;
  /** Rendered with a flag instead of a number — the closing position. */
  terminal?: boolean;
}

export function PlayerSpine({
  items,
  current,
  onGo,
  navLabel,
  percent,
}: {
  items: SpineItem[];
  current: string;
  onGo: (key: string) => void;
  navLabel: string;
  percent: number;
}) {
  let n = 0;
  return (
    <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
      <nav aria-label={navLabel} className="flex flex-col">
        {items.map((item) => {
          if (!item.terminal) n += 1;
          return (
            <SpineRow
              key={item.key}
              n={item.terminal ? undefined : n}
              label={item.label}
              isDone={item.done}
              isCurrent={current === item.key}
              onClick={() => onGo(item.key)}
            />
          );
        })}
      </nav>

      <div className="mt-6 border-t border-[#DAA520]/20 pt-5">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          <span>Progress</span>
          <span className="tabular-nums text-[#B8860B]">{percent}%</span>
        </div>
        <ProgressBar percent={percent} className="mt-2 h-1.5" />
      </div>
    </aside>
  );
}

function SpineRow({
  n,
  label,
  isDone,
  isCurrent,
  onClick,
}: {
  n?: number;
  label: string;
  isDone: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={isCurrent ? "step" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-2 text-left text-[13.5px] transition-colors",
        isCurrent
          ? "bg-amber-50 font-semibold text-[#8B6914] ring-1 ring-[#DAA520]/30"
          : isDone
            ? "text-[var(--color-text-primary)] hover:bg-amber-50/60"
            : "text-[var(--color-text-secondary)] hover:bg-amber-50/40",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
          isDone
            ? "bg-green-500 text-white"
            : isCurrent
              ? "border border-[#DAA520] text-[#B8860B]"
              : "border border-[var(--color-border)] text-[var(--color-text-muted)]",
        )}
      >
        {isDone ? (
          <Check className="h-3 w-3" />
        ) : n !== undefined ? (
          String(n).padStart(2, "0")
        ) : (
          <Flag className="h-3 w-3" />
        )}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

/**
 * Mobile form of the same thing.
 *
 * A dot strip rather than a bottom sheet: the drawer it replaces overlapped
 * the bottom navigation and the assistant button, and a reader had to open it
 * to learn where they were. Here that is always on screen for the price of one
 * row.
 */
export function PlayerStrip({
  items,
  current,
  onGo,
  navLabel,
  completed,
  total,
  percent,
}: {
  items: SpineItem[];
  current: string;
  onGo: (key: string) => void;
  navLabel: string;
  completed: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-3">
        <div
          className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label={navLabel}
        >
          {items.map((item, i) => {
            const isCurrent = current === item.key;
            return (
              <button
                key={item.key}
                role="tab"
                aria-selected={isCurrent}
                aria-label={item.label || `Section ${i + 1}`}
                onClick={() => onGo(item.key)}
                // 44px tap target via height, 10px visual dot.
                className="flex h-11 w-7 shrink-0 items-center justify-center"
              >
                {item.terminal ? (
                  <Flag
                    className={cn(
                      "h-3.5 w-3.5",
                      isCurrent ? "text-[#DAA520]" : "text-[var(--color-text-muted)]",
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      "block rounded-full transition-all",
                      isCurrent
                        ? "h-2.5 w-6 bg-[#DAA520]"
                        : item.done
                          ? "h-2.5 w-2.5 bg-green-500"
                          : "h-2.5 w-2.5 border border-[var(--color-border)] bg-transparent",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[#B8860B]">
          {completed}/{total}
        </span>
      </div>
      <ProgressBar percent={percent} className="h-1" />
    </div>
  );
}

function ProgressBar({ percent, className }: { percent: number; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-full bg-[#DAA520]/15", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
