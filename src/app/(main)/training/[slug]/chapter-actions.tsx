"use client";

// Two related pieces:
//
//   ChapterNav     — prev/next links only.
//   ChapterActions — ChapterNav plus a manual "mark complete" toggle.
//
// The split matters. A chapter with a learning cycle seals itself when its last
// step lands (see src/lib/hooks/use-chapter-progress.ts), so a manual toggle on
// the same page would be a second writer to the same key — mark it by hand and
// the steps stayed at 0/8; finish every step then tap the toggle and the chapter
// un-completed itself with all its steps still green.
//
// Pages with a cycle therefore use ChapterNav. ChapterActions is for pages that
// have no cycle to derive completion from — the Introduction, and the plain
// reader fallback — where an explicit "I'm done" is the only signal available.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

interface ChapterNavProps {
  prevSlug?: string;
  prevTitle?: string;
  nextSlug?: string;
  nextTitle?: string;
}

export function ChapterNav({
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
  divider = true,
}: ChapterNavProps & { divider?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-stretch gap-4",
        divider && "pt-8 border-t border-[var(--color-border)]",
      )}
    >
      {prevSlug ? (
        <Link
          href={`/training/${prevSlug}`}
          className="vedic-card p-4 flex-1 hover:border-[#DAA520] transition-colors group"
        >
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </span>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] mt-1">
            {prevTitle}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {nextSlug ? (
        <Link
          href={`/training/${nextSlug}`}
          className="vedic-card p-4 flex-1 text-right hover:border-[#DAA520] transition-colors group"
        >
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            Next <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] mt-1">
            {nextTitle}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

export function ChapterActions({
  contentId,
  ...nav
}: ChapterNavProps & { contentId: string }) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setCompleted(
          records.some((r) => r.contentId === contentId && r.completed)
        );
      })
      .catch(() => {}); // reading never depends on progress
  }, [contentId]);

  const toggleComplete = async () => {
    const next = !completed;
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/data/content-progress", {
        method: "POST",
        body: JSON.stringify({
          contentId,
          completed: next,
          progress: next ? 100 : 0,
        }),
      });
      setCompleted(next);
    } catch {
      setError("Couldn't save your progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pt-8 border-t border-[var(--color-border)]">
      <button
        onClick={toggleComplete}
        disabled={saving}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60",
          completed
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl"
        )}
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
        {saving
          ? "Saving..."
          : completed
          ? "Chapter completed — tap to undo"
          : "Mark chapter complete"}
      </button>
      {error && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}

      <ChapterNav {...nav} divider={false} />
    </div>
  );
}
