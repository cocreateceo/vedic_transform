"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Target, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ConsistencyScoreProps {
  currentScore: number;
  previousScore?: number;
  streakDays: number;
  totalKarma: number;
  todayCompleted: number;
  todayTotal: number;
  className?: string;
}

export function ConsistencyScore({
  currentScore,
  previousScore = 0,
  streakDays,
  totalKarma,
  todayCompleted,
  todayTotal,
  className = "",
}: ConsistencyScoreProps) {
  const trend = currentScore - previousScore;
  const trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "stable";

  // Get score color and label
  const getScoreStyle = (score: number) => {
    if (score >= 90) return { color: "text-green-600", bg: "bg-green-100", label: "Excellent" };
    if (score >= 70) return { color: "text-emerald-600", bg: "bg-emerald-100", label: "Great" };
    if (score >= 50) return { color: "text-amber-600", bg: "bg-amber-100", label: "Good" };
    if (score >= 30) return { color: "text-orange-600", bg: "bg-orange-100", label: "Building" };
    return { color: "text-red-600", bg: "bg-red-100", label: "Starting" };
  };

  const scoreStyle = getScoreStyle(currentScore);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Main score section */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-amber-100">Consistency Score</h3>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                trendDirection === "up"
                  ? "bg-green-400/30 text-green-100"
                  : trendDirection === "down"
                  ? "bg-red-400/30 text-red-100"
                  : "bg-white/20 text-white/80"
              )}
            >
              {trendDirection === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trendDirection === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              <span>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-4xl sm:text-5xl font-bold">{currentScore}</span>
            <span className="text-xl sm:text-2xl text-amber-200 mb-1">%</span>
          </div>

          <div className="mt-2">
            <span
              className={cn(
                "inline-block px-2 py-0.5 rounded text-xs font-medium",
                "bg-white/20 text-white"
              )}
            >
              {scoreStyle.label}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${currentScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{streakDays}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Day Streak</p>
          </div>

          <div className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {totalKarma >= 1000 ? `${(totalKarma / 1000).toFixed(1)}k` : totalKarma}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Total Karma</p>
          </div>

          <div className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {todayCompleted}/{todayTotal}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
