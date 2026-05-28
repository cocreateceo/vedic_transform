"use client";

// Shown on each session timer's completion view. After a check-in fires,
// this CTA points the user at the NEXT pillar they should do today —
// preferring focus pillars first, falling back to next sequential pillar.
// If everything is done, it routes back to /dashboard instead. Also
// surfaces a "related teaching poster" card for the pillar the user just
// finished, deep-linking into the gallery modal.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PILLARS, getPillarBySlug } from "@/constants/pillars";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Home, Sparkles } from "lucide-react";
import { practiceRouteForPillar } from "@/lib/practice-routes";
import { getPostersByPillar } from "@/data/posters";

interface NextPracticeCtaProps {
  /** Slug of the pillar the user just finished. Treated as completed for
   *  purposes of the "next" calculation even if the GSI hasn't caught up. */
  justCompletedPillarSlug: string;
}

interface FocusPillarRow {
  pillarId: string | number;
  priority?: number;
}

export function NextPracticeCta({ justCompletedPillarSlug }: NextPracticeCtaProps) {
  // undefined = loading, null = "all done", string = next slug
  const [nextSlug, setNextSlug] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    Promise.all([
      apiFetch("/data/focus-pillars"),
      apiFetch("/data/checkin"),
    ])
      .then(([focusRes, checkinRes]) => {
        if (!alive) return;

        const focusSlugs: string[] = ((focusRes?.focusPillars ?? []) as FocusPillarRow[])
          .slice()
          .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
          .map((fp) => {
            const idNum = Number(fp.pillarId);
            return PILLARS.find((p) => p.id === idNum)?.slug;
          })
          .filter((s): s is string => Boolean(s));

        const completed = new Set<string>(checkinRes?.completedPillars ?? []);
        // The check-in for the timer we just finished may not be visible
        // yet via the userId-index GSI — pre-mark it so the "next" pick
        // never recommends the user redo what they just did.
        completed.add(justCompletedPillarSlug);

        // Preferred order: focus pillars not yet done today.
        const fromFocus = focusSlugs.find((s) => !completed.has(s));
        if (fromFocus) {
          setNextSlug(fromFocus);
          return;
        }

        // Fallback: next sequential pillar by ID that isn't done.
        const fallback = PILLARS.find((p) => !completed.has(p.slug));
        setNextSlug(fallback?.slug ?? null);
      })
      .catch(() => {
        // Network blip — show the "all done" home-button variant rather
        // than blocking the user on a dead-end completion screen.
        if (alive) setNextSlug(null);
      });

    return () => {
      alive = false;
    };
  }, [justCompletedPillarSlug]);

  // Pick a related poster for the pillar the user just completed — first
  // one wins; deep-link into /posters?open=<slug> so the gallery opens its
  // modal directly. Renders only if at least one poster exists.
  const relatedPosters = getPostersByPillar(justCompletedPillarSlug);
  const relatedPoster = relatedPosters[0];

  const posterCard = relatedPoster ? (
    <Link
      href={`/posters?open=${relatedPoster.slug}`}
      className="group w-full max-w-md flex items-center gap-3 vedic-card p-3 hover:ring-2 hover:ring-amber-400 transition"
      aria-label={`Read teaching poster: ${relatedPoster.title}`}
    >
      <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={relatedPoster.image.thumb}
          alt=""
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[10px] uppercase tracking-wider text-amber-700 font-medium flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          Related teaching
        </p>
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 mt-0.5">
          {relatedPoster.title}
        </h4>
        {relatedPoster.tagline && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {relatedPoster.tagline}
          </p>
        )}
      </div>
      <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  ) : null;

  if (nextSlug === undefined) {
    return (
      <div className="flex flex-col items-center gap-3">
        {posterCard}
        <div className="h-12 w-56 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (nextSlug === null) {
    return (
      <div className="flex flex-col items-center gap-3">
        {posterCard}
        <p className="text-sm text-amber-700 font-medium flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          All practices done for today
        </p>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Back to today
          </Button>
        </Link>
      </div>
    );
  }

  const next = getPillarBySlug(nextSlug);
  if (!next) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {posterCard}
      <Link href={practiceRouteForPillar(nextSlug)}>
        <Button size="lg" className="min-w-[220px]">
          Next: {next.name}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
