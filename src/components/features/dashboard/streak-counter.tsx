"use client";

import { CircularProgress } from "@/components/ui/progress";
import { Flame, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  isAtRisk?: boolean;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  isAtRisk = false,
}: StreakCounterProps) {
  return (
    <div
      className={cn(
        "vedic-card p-6 relative overflow-hidden",
        isAtRisk && "ring-2 ring-red-500 animate-pulse-glow"
      )}
    >
      {/* Background decoration */}
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
