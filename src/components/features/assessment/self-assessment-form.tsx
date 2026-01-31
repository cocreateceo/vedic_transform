"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  X,
} from "lucide-react";

interface AssessmentData {
  stressLevel: number;
  sleepQuality: number;
  energyLevel: number;
  mentalClarity: number;
  physicalFitness: number;
  emotionalStability: number;
  spiritualConnection: number;
  lifeSatisfaction: number;
  biggestChallenge?: string;
  biggestWin?: string;
  oneWordFeeling?: string;
  notes?: string;
}

interface SelfAssessmentFormProps {
  type: "baseline" | "weekly" | "milestone" | "final";
  dayNumber?: number;
  weekNumber?: number;
  onSubmit: (data: AssessmentData) => Promise<void>;
  onCancel?: () => void;
  previousAssessment?: AssessmentData;
  isLoading?: boolean;
}

const metrics = [
  {
    key: "stressLevel",
    label: "Stress Level",
    icon: Brain,
    color: "#ef4444",
    description: "How stressed do you feel? (1 = very stressed, 10 = calm)",
    invert: true,
  },
  {
    key: "sleepQuality",
    label: "Sleep Quality",
    icon: Moon,
    color: "#3b82f6",
    description: "How well are you sleeping?",
  },
  {
    key: "energyLevel",
    label: "Energy Level",
    icon: Zap,
    color: "#f59e0b",
    description: "How energetic do you feel throughout the day?",
  },
  {
    key: "mentalClarity",
    label: "Mental Clarity",
    icon: Target,
    color: "#8b5cf6",
    description: "How clear and focused is your mind?",
  },
  {
    key: "physicalFitness",
    label: "Physical Fitness",
    icon: Dumbbell,
    color: "#10b981",
    description: "How would you rate your physical condition?",
  },
  {
    key: "emotionalStability",
    label: "Emotional Stability",
    icon: Heart,
    color: "#ec4899",
    description: "How balanced are your emotions?",
  },
  {
    key: "spiritualConnection",
    label: "Spiritual Connection",
    icon: Sparkles,
    color: "#6366f1",
    description: "How connected do you feel to your inner self?",
  },
  {
    key: "lifeSatisfaction",
    label: "Life Satisfaction",
    icon: Smile,
    color: "#14b8a6",
    description: "Overall, how satisfied are you with life right now?",
  },
];

export function SelfAssessmentForm({
  type,
  dayNumber,
  weekNumber,
  onSubmit,
  onCancel,
  previousAssessment,
  isLoading = false,
}: SelfAssessmentFormProps) {
  const [formData, setFormData] = useState<AssessmentData>({
    stressLevel: 5,
    sleepQuality: 5,
    energyLevel: 5,
    mentalClarity: 5,
    physicalFitness: 5,
    emotionalStability: 5,
    spiritualConnection: 5,
    lifeSatisfaction: 5,
    biggestChallenge: "",
    biggestWin: "",
    oneWordFeeling: "",
    notes: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = Math.ceil(metrics.length / 2) + 1; // Metrics in pairs + final step

  const getTitle = () => {
    switch (type) {
      case "baseline":
        return "Day 1 Baseline Assessment";
      case "weekly":
        return `Week ${weekNumber} Check-in`;
      case "milestone":
        return `Day ${dayNumber} Milestone`;
      case "final":
        return "Final Assessment - Day 48";
      default:
        return "Self Assessment";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "baseline":
        return "Let's capture where you're starting. This helps track your transformation.";
      case "weekly":
        return "How has your week been? Take a moment to reflect on your progress.";
      case "final":
        return "Congratulations on completing your journey! Let's see how far you've come.";
      default:
        return "Rate each area of your life on a scale of 1-10.";
    }
  };

  const handleSliderChange = (key: string, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const renderMetricSlider = (metric: (typeof metrics)[0], index: number) => {
    const Icon = metric.icon;
    const value = formData[metric.key as keyof AssessmentData] as number;
    const prevValue = previousAssessment?.[metric.key as keyof AssessmentData] as number;
    const change = prevValue ? value - prevValue : 0;

    return (
      <div key={metric.key} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${metric.color}20` }}
            >
              <Icon className="w-4 h-4" style={{ color: metric.color }} />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">{metric.label}</span>
              {prevValue && change !== 0 && (
                <span
                  className={cn(
                    "ml-2 text-xs font-medium",
                    change > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {change > 0 ? "+" : ""}
                  {change}
                </span>
              )}
            </div>
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: metric.color }}
          >
            {value}
          </span>
        </div>

        <p className="text-xs text-gray-500">{metric.description}</p>

        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => handleSliderChange(metric.key, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            style={{ accentColor: metric.color }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (currentStep < totalSteps - 1) {
      // Metrics steps (2 per step)
      const startIdx = currentStep * 2;
      const stepMetrics = metrics.slice(startIdx, startIdx + 2);

      return (
        <div className="space-y-6">
          {stepMetrics.map((metric, idx) => renderMetricSlider(metric, startIdx + idx))}
        </div>
      );
    }

    // Final step - text inputs
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biggest Challenge
          </label>
          <input
            type="text"
            value={formData.biggestChallenge || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, biggestChallenge: e.target.value }))
            }
            placeholder="What's been your biggest challenge?"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biggest Win
          </label>
          <input
            type="text"
            value={formData.biggestWin || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, biggestWin: e.target.value }))
            }
            placeholder="What's been your biggest win?"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            One Word to Describe How You Feel
          </label>
          <input
            type="text"
            value={formData.oneWordFeeling || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, oneWordFeeling: e.target.value }))
            }
            placeholder="e.g., Energized, Calm, Focused..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Any other thoughts or reflections..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{getTitle()}</CardTitle>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">{getDescription()}</p>

        {/* Progress indicator */}
        <div className="flex gap-1 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= currentStep ? "bg-amber-500" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderCurrentStep()}

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}

          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Saving..." : "Complete Assessment"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
