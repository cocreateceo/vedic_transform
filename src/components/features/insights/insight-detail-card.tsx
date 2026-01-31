"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";

export type InsightType = "pattern" | "strength" | "weakness" | "recommendation" | "milestone";

interface InsightDetailCardProps {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  isNew?: boolean;
  className?: string;
}

const typeConfig: Record<InsightType, {
  icon: typeof Lightbulb;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}> = {
  pattern: {
    icon: TrendingUp,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  strength: {
    icon: Star,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    borderColor: "border-green-200",
  },
  weakness: {
    icon: AlertCircle,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  recommendation: {
    icon: Lightbulb,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  milestone: {
    icon: Target,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
};

export function InsightDetailCard({
  id,
  type,
  title,
  description,
  data,
  actionText,
  onAction,
  onDismiss,
  isNew = false,
  className = "",
}: InsightDetailCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border transition-all",
        config.borderColor,
        config.bgColor,
        className
      )}
    >
      {isNew && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              config.bgColor === "bg-blue-50" ? "bg-blue-100" :
              config.bgColor === "bg-green-50" ? "bg-green-100" :
              config.bgColor === "bg-amber-50" ? "bg-amber-100" :
              config.bgColor === "bg-purple-50" ? "bg-purple-100" :
              "bg-emerald-100"
            )}
          >
            <Icon className={cn("w-5 h-5", config.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                {isNew && (
                  <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mb-1">
                    NEW
                  </span>
                )}
                <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
              </div>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-1">{description}</p>

            {data && Array.isArray(data.chartData) && (
              <div className="mt-3 p-2 bg-white/50 rounded-lg">
                <div className="flex items-end gap-1 h-12">
                  {(data.chartData as number[]).slice(0, 7).map((value, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex-1 rounded-t transition-all",
                        config.iconColor.replace("text-", "bg-").replace("-600", "-400")
                      )}
                      style={{ height: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            {actionText && onAction && (
              <Button
                size="sm"
                variant="outline"
                onClick={onAction}
                className="mt-3 text-xs"
              >
                {actionText}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
