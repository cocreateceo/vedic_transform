"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wind, X } from "lucide-react";

interface CheckinRow {
  checkinDate?: string;
}

/**
 * Compassionate re-entry card. When a user returns after missing 2+ days,
 * the dashboard otherwise looks identical to a perfect streak — wasting the
 * moment of return. This surfaces a gentle "welcome back" with a 3-minute
 * reset instead of guilt. Dismissible per day (localStorage), and only
 * shown when there's genuine absence (computed from existing check-in data,
 * no extra API call).
 */
export function RecoveryRitualCard({
  checkins,
  hasJourney,
}: {
  checkins: CheckinRow[];
  hasJourney: boolean;
}) {
  const daysAway = useMemo(() => {
    const dates = (checkins || [])
      .map((c) => c.checkinDate)
      .filter((d): d is string => Boolean(d))
      .sort();
    if (dates.length === 0) return 0;
    const last = new Date(dates[dates.length - 1] + "T00:00:00").getTime();
    if (!Number.isFinite(last)) return 0;
    const today = new Date();
    const todayMs = new Date(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T00:00:00`,
    ).getTime();
    return Math.floor((todayMs - last) / (1000 * 60 * 60 * 24));
  }, [checkins]);

  const dismissKey = useMemo(() => {
    const d = new Date();
    return `vedic-recovery-dismissed-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }, []);

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(dismissKey) === "true";
    } catch {
      return false;
    }
  });

  // Only after a genuine 2+ day absence (and an active journey), and not
  // already dismissed today.
  if (!hasJourney || daysAway < 2 || dismissed) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(dismissKey, "true");
    } catch {}
    setDismissed(true);
  };

  return (
    <div className="vedic-card relative overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 text-amber-400 hover:text-amber-600"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Wind className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Welcome back 🙏
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            It&apos;s been {daysAway} days. The path didn&apos;t go anywhere —
            it&apos;s still right here. No guilt, no catching up. Take three
            quiet minutes to re-enter, and today simply begins again.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/sessions?practice=breathing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-sm hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              <Wind className="w-4 h-4" />
              Begin a 3-minute reset
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/60 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
