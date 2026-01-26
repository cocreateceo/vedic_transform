"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";

interface GoalSummaryProps {
  totalGoals: number;
  completedGoals: number;
  currentStreak: number;
  weeklyCompletion: number[];
  className?: string;
}

export function GoalSummary({
  totalGoals,
  completedGoals,
  currentStreak,
  weeklyCompletion,
  className = "",
}: GoalSummaryProps) {
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const avgWeekly =
    weeklyCompletion.length > 0
      ? Math.round(weeklyCompletion.reduce((a, b) => a + b, 0) / weeklyCompletion.length)
      : 0;

  const stats = [
    {
      label: "Completed",
      value: completedGoals,
      subtext: `of ${totalGoals} goals`,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Rate",
      value: `${completionRate}%`,
      subtext: "completion",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Streak",
      value: currentStreak,
      subtext: "weeks",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Weekly Avg",
      value: `${avgWeekly}%`,
      subtext: "per week",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base">Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  "p-3 rounded-xl",
                  stat.bg
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Weekly progress bars */}
        {weeklyCompletion.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Weekly completion</p>
            <div className="flex gap-1">
              {weeklyCompletion.map((pct, idx) => (
                <div key={idx} className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-sm overflow-hidden relative">
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 rounded-sm transition-all",
                        pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-gray-300"
                      )}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-1">W{idx + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
