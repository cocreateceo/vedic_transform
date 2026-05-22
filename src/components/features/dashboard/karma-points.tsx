"use client";

import { Sparkles, TrendingUp, Star } from "lucide-react";

interface KarmaPointsProps {
  totalKarma: number;
  todayEarned: number;
}

// Sanskrit-language ranks tied to lifetime karma. Names follow the
// traditional progression of a practitioner: Sadhaka (seeker) → Antevasin
// (resident student) → Yogi (one with steady practice) → Acharya (teacher)
// → Jivanmukta (liberated while living). Thresholds picked so an active
// user crosses ~1 rank per 7-day cycle of consistent practice.
const RANKS: Array<{ name: string; threshold: number }> = [
  { name: "Sadhaka",    threshold: 0 },
  { name: "Antevasin",  threshold: 1000 },
  { name: "Yogi",       threshold: 3000 },
  { name: "Acharya",    threshold: 6000 },
  { name: "Jivanmukta", threshold: 10000 },
];

function rankFor(karma: number) {
  let current = RANKS[0];
  let next: typeof RANKS[number] | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (karma >= RANKS[i].threshold) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }
  return { current, next };
}

export function KarmaPoints({ totalKarma, todayEarned }: KarmaPointsProps) {
  const { current, next } = rankFor(totalKarma);
  const toNext = next ? Math.max(0, next.threshold - totalKarma) : 0;
  const progressPct = next
    ? Math.min(
        100,
        ((totalKarma - current.threshold) /
          (next.threshold - current.threshold)) *
          100,
      )
    : 100;

  return (
    <div className="vedic-card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/10" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Karma Points</h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          {current.name}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-600">
              {totalKarma.toLocaleString()}
            </span>
            <span className="text-gray-500">total</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-green-600 font-medium">+{todayEarned}</span>
          <span className="text-gray-500">earned today</span>
        </div>

        {/* Rank progression */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-baseline text-sm mb-2">
            <span className="text-gray-600">
              {next ? `Next: ${next.name}` : "Highest rank reached"}
            </span>
            <span className="text-orange-600 font-medium">
              {next ? `${toNext.toLocaleString()} away` : ""}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
