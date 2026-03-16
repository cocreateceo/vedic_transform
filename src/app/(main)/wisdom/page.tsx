"use client";

import { DAILY_WISDOM } from "@/data/daily-wisdom";
import { BookOpen, Sparkles, Quote } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";

function getDayOfYear(): number {
  return Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
}

export default function WisdomPage() {
  const dayOfYear = getDayOfYear();
  const todayIndex = dayOfYear % DAILY_WISDOM.length;

  const todayWisdom = DAILY_WISDOM[todayIndex];

  // Get past 6 entries (before today)
  const past6: typeof DAILY_WISDOM = [];
  for (let i = 1; i <= 6; i++) {
    const idx =
      ((todayIndex - i) % DAILY_WISDOM.length + DAILY_WISDOM.length) %
      DAILY_WISDOM.length;
    past6.push(DAILY_WISDOM[idx]);
  }

  const categoryColors: Record<string, string> = {
    vedic: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    philosophical: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    scientific: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  };

  const categoryLabels: Record<string, string> = {
    vedic: "Vedic Wisdom",
    philosophical: "Philosophical",
    scientific: "Modern Science",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-[var(--color-secondary)]" />
          Daily Wisdom
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Begin each day with intention
        </p>
      </div>

      {/* Today's Wisdom -- Featured Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-card-bg)] to-[var(--color-secondary)]/10 p-8 md:p-10">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-10">
          <Quote className="h-24 w-24 text-[var(--color-secondary)]" />
        </div>
        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[var(--color-primary)]/5 blur-2xl" />

        <div className="relative space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--color-secondary)]" />
            <span className="text-sm font-medium text-[var(--color-secondary)]">
              Today&apos;s Wisdom — Day {dayOfYear}
            </span>
          </div>

          <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-[var(--color-text-primary)]">
            &ldquo;{todayWisdom.text}&rdquo;
          </blockquote>

          {todayWisdom.sanskrit && (
            <p className="text-sm italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-secondary)]/40 pl-4">
              {todayWisdom.sanskrit}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-[var(--color-text-secondary)] font-medium">
              — {todayWisdom.source}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[todayWisdom.category]}`}
              >
                {categoryLabels[todayWisdom.category]}
              </span>
              <ShareButton
                title="Daily Vedic Wisdom"
                text={`"${todayWisdom.text}" — ${todayWisdom.source}`}
                size="sm"
                variant="outline"
                label="Share"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Past 7 Days Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Past 7 Days
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {past6.map((entry, i) => (
            <div
              key={entry.id}
              className="glass-card p-5 space-y-3 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">
                  {i + 1} day{i + 1 > 1 ? "s" : ""} ago
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${categoryColors[entry.category]}`}
                >
                  {categoryLabels[entry.category]}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-[var(--color-text-primary)] line-clamp-4">
                &ldquo;{entry.text}&rdquo;
              </p>

              {entry.sanskrit && (
                <p className="text-xs italic text-[var(--color-text-muted)] truncate">
                  {entry.sanskrit}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  — {entry.source}
                </p>
                <ShareButton
                  title="Vedic Wisdom"
                  text={`"${entry.text}" — ${entry.source}`}
                  size="sm"
                  variant="outline"
                  label="Share"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
