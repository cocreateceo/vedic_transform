"use client";

import { Sparkles, TrendingUp } from "lucide-react";

interface KarmaPointsProps {
  totalKarma: number;
  todayEarned: number;
}

export function KarmaPoints({ totalKarma, todayEarned }: KarmaPointsProps) {
  return (
    <div className="vedic-card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10" />

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-violet-500" />
        <h3 className="font-semibold text-gray-900">Karma Points</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-violet-600">
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

        {/* Progress to next level */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Level Progress</span>
            <span className="text-violet-600 font-medium">
              {Math.floor(totalKarma / 100) + 1}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${totalKarma % 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {100 - (totalKarma % 100)} points to next level
          </p>
        </div>
      </div>
    </div>
  );
}
