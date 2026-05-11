"use client";

import { useState } from "react";
import { CircularProgress } from "@/components/ui/progress";
import { Flame, AlertTriangle, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";

const SHIELD_COST = 200;
const MAX_SHIELDS = 2;

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  isAtRisk?: boolean;
  shields?: number;
  karmaBalance?: number;
  onShieldsChanged?: (shields: number, karmaBalance: number) => void;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  isAtRisk = false,
  shields = 0,
  karmaBalance = 0,
  onShieldsChanged,
}: StreakCounterProps) {
  const [localShields, setLocalShields] = useState(shields);
  const [localKarma, setLocalKarma] = useState(karmaBalance);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const canBuy = localShields < MAX_SHIELDS && localKarma >= SHIELD_COST;
  const atMax = localShields >= MAX_SHIELDS;

  const handleBuy = async () => {
    if (buying || !canBuy) return;
    setBuying(true);
    setBuyError(null);
    try {
      const res = await apiFetch("/data/streaks/buy-shield", { method: "POST" });
      if (res?.success) {
        setLocalShields(res.shields);
        setLocalKarma(res.karmaBalance);
        onShieldsChanged?.(res.shields, res.karmaBalance);
      } else {
        setBuyError(res?.error || "Could not buy shield");
      }
    } catch {
      setBuyError("Network error — try again");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div
      className={cn(
        "vedic-card p-6 relative overflow-hidden",
        isAtRisk && "ring-2 ring-red-500 animate-pulse-glow"
      )}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10" />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900">Current Streak</h3>
          </div>

          {isAtRisk && (
            <div className="flex items-center gap-1 text-red-500 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Complete today&apos;s pillars to keep your streak!</span>
            </div>
          )}

          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600">
                {currentStreak}
              </span>
              <span className="text-gray-500">days</span>
            </div>
            <p className="text-sm text-gray-500">
              Longest streak: {longestStreak} days
            </p>
          </div>
        </div>

        <CircularProgress
          value={currentStreak}
          max={48}
          size={100}
          strokeWidth={8}
          label="of 48"
        />
      </div>

      {/* Karma Shield row */}
      <div className="mt-5 pt-4 border-t border-gray-100 relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Karma Shields
              </p>
              <p className="text-xs text-gray-500">
                {localShields} of {MAX_SHIELDS} — protects 1 missed day each
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {[0, 1].map((i) => (
              <Shield
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < localShields ? "text-amber-500 fill-amber-200" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {atMax ? (
          <p className="text-xs text-gray-500 mt-3">Inventory full.</p>
        ) : (
          <button
            type="button"
            onClick={handleBuy}
            disabled={!canBuy || buying}
            className={cn(
              "mt-3 w-full text-sm px-3 py-2 rounded-xl border transition-colors",
              canBuy && !buying
                ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {buying
              ? "Buying…"
              : canBuy
              ? `Buy a shield — ${SHIELD_COST} karma`
              : `Need ${SHIELD_COST - localKarma} more karma to buy a shield`}
          </button>
        )}

        {buyError && (
          <p className="text-xs text-red-500 mt-2">{buyError}</p>
        )}
      </div>

      {/* Milestone markers */}
      <div className="mt-6 flex justify-between text-xs">
        {[7, 21, 48].map((milestone) => (
          <div
            key={milestone}
            className={cn(
              "flex flex-col items-center",
              currentStreak >= milestone ? "text-amber-600" : "text-gray-400"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium",
                currentStreak >= milestone
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200"
              )}
            >
              {milestone}
            </div>
            <span className="mt-1">
              {milestone === 7 ? "Week" : milestone === 21 ? "Habit" : "Done!"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
