"use client";

// Sutra Book (RC7) — the 48-page artifact the user is building toward, shown
// from Day 1 (Mindvalley "Lifebook" pattern). Each page is a journey day:
// unlocked pages show the date + how many pillars were practiced; future pages
// are locked with a teaser. Gives the 48-day arc a tangible, fills-in shape.

import { BookOpen, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CalendarDay {
  date: string;
  pillarsCompleted: number;
}

interface SutraBookProps {
  journeyDay: number;
  startDate?: string;
  calendarData?: CalendarDay[];
}

const TOTAL_PAGES = 48;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local YYYY-MM-DD for `startDate` + `offset` days (0-based). */
function dateForDay(startDate: string, offset: number): string | null {
  const d = new Date(startDate);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function SutraBook({
  journeyDay,
  startDate,
  calendarData = [],
}: SutraBookProps) {
  const completedByDate = new Map(
    calendarData.map((c) => [c.date, c.pillarsCompleted]),
  );
  const unlocked = Math.max(0, Math.min(journeyDay, TOTAL_PAGES));

  return (
    <div className="vedic-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] sm:text-lg">
            Your Sutra Book
          </h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            {unlocked} / {TOTAL_PAGES} pages unlocked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-12">
        {Array.from({ length: TOTAL_PAGES }, (_, i) => {
          const day = i + 1;
          const isUnlocked = day <= journeyDay;
          const dateStr = startDate ? dateForDay(startDate, i) : null;
          const practiced = dateStr ? (completedByDate.get(dateStr) ?? 0) : 0;
          const isToday = day === journeyDay;

          return (
            <div
              key={day}
              title={
                isUnlocked
                  ? `Day ${day}${dateStr ? ` · ${dateStr}` : ""}${practiced ? ` · ${practiced} pillars` : ""}`
                  : `Day ${day} — locked`
              }
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md border text-[10px] font-semibold transition-colors",
                isToday && "ring-2 ring-amber-400 ring-offset-1",
                !isUnlocked
                  ? "border-gray-100 bg-gray-50 text-gray-300"
                  : practiced > 0
                    ? "border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700"
                    : "border-amber-200 bg-amber-50/50 text-amber-500",
              )}
            >
              {!isUnlocked ? (
                <Lock className="h-3 w-3" />
              ) : practiced > 0 ? (
                <Check className="h-3 w-3" />
              ) : (
                <span>{day}</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Each day you practice, a page fills in. Complete all 48 to finish your
        Sutra Book.
      </p>
    </div>
  );
}
