"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Award,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InsightCardProps {
  type: "pattern" | "strength" | "weakness" | "recommendation" | "milestone";
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function InsightCard({
  type,
  title,
  description,
  actionText,
  onAction,
  onDismiss,
  className = "",
}: InsightCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "strength":
        return {
          icon: TrendingUp,
          bg: "bg-green-50",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          border: "border-green-200",
        };
      case "weakness":
        return {
          icon: AlertTriangle,
          bg: "bg-amber-50",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          border: "border-amber-200",
        };
      case "milestone":
        return {
          icon: Award,
          bg: "bg-purple-50",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          border: "border-purple-200",
        };
      case "recommendation":
        return {
          icon: Lightbulb,
          bg: "bg-blue-50",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          border: "border-blue-200",
        };
      default: // pattern
        return {
          icon: Lightbulb,
          bg: "bg-amber-50",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          border: "border-amber-200",
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <Card className={cn("overflow-hidden border", styles.border, styles.bg, className)}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3">
          {/* Icon */}
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
              styles.iconBg
            )}
          >
            <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", styles.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-1">
                {title}
              </h4>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200/50 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

            {actionText && onAction && (
              <button
                onClick={onAction}
                className={cn(
                  "mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium",
                  styles.iconColor
                )}
              >
                {actionText}
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Multiple insights component
interface InsightListProps {
  insights: Array<{
    id: string;
    type: InsightCardProps["type"];
    title: string;
    description: string;
    actionText?: string;
  }>;
  onAction?: (id: string) => void;
  onDismiss?: (id: string) => void;
  maxVisible?: number;
  className?: string;
}

export function InsightList({
  insights,
  onAction,
  onDismiss,
  maxVisible = 3,
  className = "",
}: InsightListProps) {
  const visibleInsights = insights.slice(0, maxVisible);
  const remainingCount = Math.max(0, insights.length - maxVisible);

  if (insights.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-6 text-center">
          <Lightbulb className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Keep tracking to unlock personalized insights!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {visibleInsights.map((insight) => (
        <InsightCard
          key={insight.id}
          type={insight.type}
          title={insight.title}
          description={insight.description}
          actionText={insight.actionText}
          onAction={onAction ? () => onAction(insight.id) : undefined}
          onDismiss={onDismiss ? () => onDismiss(insight.id) : undefined}
        />
      ))}

      {remainingCount > 0 && (
        <button className="w-full py-2 text-sm text-amber-600 font-medium hover:bg-amber-50 rounded-lg transition-colors">
          View {remainingCount} more insight{remainingCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
