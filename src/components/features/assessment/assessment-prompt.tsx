"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AssessmentPromptProps {
  type: "baseline" | "weekly" | "milestone";
  dayNumber?: number;
  weekNumber?: number;
  onStart: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function AssessmentPrompt({
  type,
  dayNumber,
  weekNumber,
  onStart,
  onDismiss,
  className = "",
}: AssessmentPromptProps) {
  const getContent = () => {
    switch (type) {
      case "baseline":
        return {
          title: "Start Your Journey",
          description:
            "Take a quick 2-minute assessment to capture your starting point. This helps us track your transformation.",
          buttonText: "Begin Assessment",
          emoji: "🌅",
        };
      case "weekly":
        return {
          title: `Week ${weekNumber} Check-in`,
          description:
            "How was your week? Take a moment to reflect and track your progress.",
          buttonText: "Start Check-in",
          emoji: "📊",
        };
      case "milestone":
        return {
          title: `Day ${dayNumber} Milestone!`,
          description:
            "You've reached a milestone! Let's capture how you're doing.",
          buttonText: "Record Progress",
          emoji: "🎯",
        };
      default:
        return {
          title: "Self Assessment",
          description: "Take a moment to reflect on your progress.",
          buttonText: "Start",
          emoji: "✨",
        };
    }
  };

  const content = getContent();

  return (
    <Card
      className={cn(
        "overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
        className
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icon/Emoji */}
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
            {content.emoji}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {content.title}
              </h3>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 rounded-full hover:bg-amber-100 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {content.description}
            </p>

            <Button
              onClick={onStart}
              size="sm"
              className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <ClipboardCheck className="w-4 h-4 mr-1.5" />
              {content.buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini version for dashboard
interface MiniAssessmentPromptProps {
  dueType: "baseline" | "weekly";
  weekNumber?: number;
  onClick: () => void;
}

export function MiniAssessmentPrompt({
  dueType,
  weekNumber,
  onClick,
}: MiniAssessmentPromptProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {dueType === "baseline" ? "Take Your Baseline" : `Week ${weekNumber} Check-in`}
        </p>
        <p className="text-xs text-gray-500 truncate">2 min reflection</p>
      </div>
      <div className="flex-shrink-0 text-amber-500">→</div>
    </button>
  );
}
