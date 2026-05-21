"use client";

// Shown on each session timer's completion view. After a check-in fires,
// this CTA points the user at the NEXT pillar they should do today —
// preferring focus pillars first, falling back to next sequential pillar.
// If everything is done, it routes back to /dashboard instead.

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PILLARS, getPillarBySlug } from "@/constants/pillars";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Sparkles } from "lucide-react";
import { practiceRouteForPillar } from "@/lib/practice-routes";

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

  if (nextSlug === undefined) {
    return <div className="h-12 w-56 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (nextSlug === null) {
    return (
      <div className="flex flex-col items-center gap-2">
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
    <Link href={practiceRouteForPillar(nextSlug)}>
      <Button size="lg" className="min-w-[220px]">
        Next: {next.name}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  );
}
