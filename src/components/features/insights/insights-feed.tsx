"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsightDetailCard, InsightType } from "./insight-detail-card";
import { cn } from "@/lib/utils/cn";
import { Sparkles, Filter, CheckCircle2 } from "lucide-react";

interface Insight {
  id: string;
  type: InsightType;
  category?: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  actionText?: string;
  isNew?: boolean;
  createdAt: Date;
}

interface InsightsFeedProps {
  insights: Insight[];
  onDismiss?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
  onMarkAllRead?: () => void;
  showFilters?: boolean;
  className?: string;
}

const filterOptions: { value: InsightType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "recommendation", label: "Tips" },
  { value: "pattern", label: "Patterns" },
  { value: "strength", label: "Strengths" },
  { value: "weakness", label: "Improve" },
  { value: "milestone", label: "Milestones" },
];

export function InsightsFeed({
  insights,
  onDismiss,
  onAction,
  onMarkAllRead,
  showFilters = true,
  className = "",
}: InsightsFeedProps) {
  const [filter, setFilter] = useState<InsightType | "all">("all");

  const filteredInsights = filter === "all"
    ? insights
    : insights.filter((i) => i.type === filter);

  const newCount = insights.filter((i) => i.isNew).length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">Personalized Insights</CardTitle>
              {newCount > 0 && (
                <p className="text-xs text-purple-600">
                  {newCount} new insight{newCount !== 1 ? "s" : ""} for you
                </p>
              )}
            </div>
          </div>

          {newCount > 0 && onMarkAllRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onMarkAllRead}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter tabs */}
        {showFilters && (
          <div className="flex gap-1 mt-3 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
            {filterOptions.map((option) => {
              const count = option.value === "all"
                ? insights.length
                : insights.filter((i) => i.type === option.value).length;

              if (count === 0 && option.value !== "all") return null;

              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    filter === option.value
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {option.label}
                  <span className="ml-1 opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => (
            <InsightDetailCard
              key={insight.id}
              id={insight.id}
              type={insight.type}
              title={insight.title}
              description={insight.description}
              data={insight.data}
              actionText={insight.actionText}
              onAction={onAction ? () => onAction(insight.id, insight.actionText || "") : undefined}
              onDismiss={onDismiss ? () => onDismiss(insight.id) : undefined}
              isNew={insight.isNew}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No insights yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Keep tracking your progress to get personalized insights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
