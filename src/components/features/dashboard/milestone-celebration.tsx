"use client";

import { useState } from "react";
import { PartyPopper, X } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";
import {
  dayMilestoneShare,
  dayMilestoneToCelebrate,
} from "@/lib/share-links";

const KEY = "vedic-celebrated-milestones";

function readCelebrated(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Auto-prompts a share when the user reaches a journey milestone (Day 7/21/48),
 * once each (localStorage-gated). Turns the highest-intent moments into default
 * organic-acquisition actions (AQ3). The share link unfurls with the branded OG
 * card via the /share landing page.
 */
export function MilestoneCelebration({ currentDay }: { currentDay: number }) {
  const [celebrated, setCelebrated] = useState<Set<number>>(() =>
    readCelebrated(),
  );

  const milestone = dayMilestoneToCelebrate(currentDay, celebrated);
  if (milestone === null) return null;

  const share = dayMilestoneShare(milestone);
  const headline =
    milestone >= 48
      ? "You completed all 48 days 🎉"
      : `${milestone}-day milestone reached 🔥`;

  const dismiss = () => {
    const next = new Set(celebrated).add(milestone);
    try {
      window.localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {}
    setCelebrated(next);
  };

  return (
    <div className="vedic-card relative overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-amber-400 hover:text-amber-600"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
          <PartyPopper className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {headline}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Share your progress and inspire someone to begin their own 48-day
            journey.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ShareButton
              title={share.title}
              text={share.text}
              url={share.url}
              variant="primary"
              label="Share my progress"
            />
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/60"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
