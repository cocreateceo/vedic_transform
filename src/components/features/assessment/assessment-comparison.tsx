"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import {
  Brain,
  Heart,
  Zap,
  Moon,
  Dumbbell,
  Sparkles,
  Smile,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface AssessmentData {
  assessmentDate: Date;
  dayNumber?: number;
  assessmentType: string;
  stressLevel: number;
  sleepQuality: number;
  energyLevel: number;
  mentalClarity: number;
  physicalFitness: number;
  emotionalStability: number;
  spiritualConnection: number;
  lifeSatisfaction: number;
  oneWordFeeling?: string;
}

interface AssessmentComparisonProps {
  baseline: AssessmentData;
  current: AssessmentData;
  className?: string;
}

const metrics = [
  { key: "stressLevel", label: "Stress", icon: Brain, color: "#ef4444", invert: true },
  { key: "sleepQuality", label: "Sleep", icon: Moon, color: "#3b82f6" },
  { key: "energyLevel", label: "Energy", icon: Zap, color: "#f59e0b" },
  { key: "mentalClarity", label: "Clarity", icon: Target, color: "#8b5cf6" },
  { key: "physicalFitness", label: "Fitness", icon: Dumbbell, color: "#10b981" },
  { key: "emotionalStability", label: "Emotional", icon: Heart, color: "#ec4899" },
  { key: "spiritualConnection", label: "Spiritual", icon: Sparkles, color: "#6366f1" },
  { key: "lifeSatisfaction", label: "Satisfaction", icon: Smile, color: "#14b8a6" },
];

export function AssessmentComparison({
  baseline,
  current,
  className = "",
}: AssessmentComparisonProps) {
  // Calculate overall improvement
  const calculateOverallChange = () => {
    let totalChange = 0;
    metrics.forEach((metric) => {
      const baseValue = baseline[metric.key as keyof AssessmentData] as number;
      const currentValue = current[metric.key as keyof AssessmentData] as number;
      // For stress, lower is better (inverted)
      const change = metric.invert
        ? baseValue - currentValue
        : currentValue - baseValue;
      totalChange += change;
    });
    return Math.round((totalChange / metrics.length) * 10) / 10;
  };

  const overallChange = calculateOverallChange();
  const overallDirection =
    overallChange > 0 ? "improved" : overallChange < 0 ? "declined" : "stable";

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Your Transformation</CardTitle>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              overallDirection === "improved"
                ? "bg-green-100 text-green-700"
                : overallDirection === "declined"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {overallDirection === "improved" ? (
              <TrendingUp className="w-3 h-3" />
            ) : overallDirection === "declined" ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>
              {overallChange > 0 ? "+" : ""}
              {overallChange} avg
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">
          Day 1 vs Day {current.dayNumber || "Current"}
        </p>
      </CardHeader>

      <CardContent>
        {/* Comparison header */}
        <div className="grid grid-cols-[1fr,60px,60px,60px] gap-2 mb-3 text-xs text-gray-500 font-medium">
          <div>Metric</div>
          <div className="text-center">Day 1</div>
          <div className="text-center">Now</div>
          <div className="text-center">Change</div>
        </div>

        {/* Metrics comparison */}
        <div className="space-y-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const baseValue = baseline[metric.key as keyof AssessmentData] as number;
            const currentValue = current[metric.key as keyof AssessmentData] as number;

            // For stress, lower is better
            const rawChange = currentValue - baseValue;
            const effectiveChange = metric.invert ? -rawChange : rawChange;
            const isImproved = effectiveChange > 0;
            const isDeclined = effectiveChange < 0;

            return (
              <div
                key={metric.key}
                className="grid grid-cols-[1fr,60px,60px,60px] gap-2 items-center"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <Icon
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      style={{ color: metric.color }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {metric.label}
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-sm text-gray-500">{baseValue}</span>
                </div>

                <div className="text-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: metric.color }}
                  >
                    {currentValue}
                  </span>
                </div>

                <div className="text-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                      isImproved
                        ? "bg-green-100 text-green-700"
                        : isDeclined
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {isImproved ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : isDeclined ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {rawChange > 0 ? "+" : ""}
                    {rawChange}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* One word feelings comparison */}
        {(baseline.oneWordFeeling || current.oneWordFeeling) && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Feeling in one word</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400">Day 1</p>
                <p className="text-sm font-medium text-gray-700">
                  {baseline.oneWordFeeling || "—"}
                </p>
              </div>
              <div className="text-gray-300">→</div>
              <div className="flex-1 text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-600">Now</p>
                <p className="text-sm font-medium text-amber-700">
                  {current.oneWordFeeling || "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary message */}
        <div
          className={cn(
            "mt-6 p-3 rounded-lg text-sm text-center",
            overallDirection === "improved"
              ? "bg-green-50 text-green-700"
              : overallDirection === "declined"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-50 text-gray-700"
          )}
        >
          {overallDirection === "improved" ? (
            <>
              <strong>Amazing progress!</strong> You've improved in most areas.
              Keep up the great work!
            </>
          ) : overallDirection === "declined" ? (
            <>
              <strong>Room for growth.</strong> Some areas need attention.
              Focus on consistency!
            </>
          ) : (
            <>
              <strong>Steady progress.</strong> You're maintaining your baseline.
              Keep showing up!
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
