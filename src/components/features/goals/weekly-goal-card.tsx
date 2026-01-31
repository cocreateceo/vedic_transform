"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { Target, Check, Plus, Trash2, Edit2, X, ChevronDown, ChevronUp } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  pillarId?: number | string | null;
  pillarName?: string | null;
  isCompleted: boolean;
  createdAt: Date;
}

interface WeeklyGoalCardProps {
  weekNumber: number;
  goals: Goal[];
  onAddGoal: (title: string, pillarId?: string) => Promise<void>;
  onToggleGoal: (goalId: string, completed: boolean) => Promise<void>;
  onDeleteGoal: (goalId: string) => Promise<void>;
  pillars?: { id: string; name: string }[];
  isCurrentWeek?: boolean;
  className?: string;
}

export function WeeklyGoalCard({
  weekNumber,
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  pillars = [],
  isCurrentWeek = false,
  className = "",
}: WeeklyGoalCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("");
  const [isExpanded, setIsExpanded] = useState(isCurrentWeek);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = goals.filter((g) => g.isCompleted).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleSubmit = async () => {
    if (!newGoalTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddGoal(newGoalTitle.trim(), selectedPillar || undefined);
      setNewGoalTitle("");
      setSelectedPillar("");
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (goalId: string, currentState: boolean) => {
    await onToggleGoal(goalId, !currentState);
  };

  return (
    <Card className={cn(isCurrentWeek && "border-amber-300 shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isCurrentWeek ? "bg-amber-100" : "bg-gray-100"
              )}
            >
              <Target
                className={cn(
                  "w-4 h-4",
                  isCurrentWeek ? "text-amber-600" : "text-gray-600"
                )}
              />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                Week {weekNumber}
                {isCurrentWeek && (
                  <span className="text-xs font-normal px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                    Current
                  </span>
                )}
              </CardTitle>
              <p className="text-xs text-gray-500">
                {completedCount}/{goals.length} goals completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress indicator */}
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(progress / 100) * 125.6} 125.6`}
                  className={cn(
                    progress === 100 ? "text-green-500" : "text-amber-500"
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {progress}%
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-2">
          {/* Goals list */}
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  goal.isCompleted ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <button
                  onClick={() => handleToggle(goal.id, goal.isCompleted)}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    goal.isCompleted
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-amber-500"
                  )}
                >
                  {goal.isCompleted && <Check className="w-3 h-3 text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm",
                      goal.isCompleted && "line-through text-gray-400"
                    )}
                  >
                    {goal.title}
                  </p>
                  {goal.pillarName && (
                    <span className="text-xs text-gray-400">{goal.pillarName}</span>
                  )}
                </div>

                {isCurrentWeek && (
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {goals.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No goals set for this week
              </p>
            )}
          </div>

          {/* Add goal form */}
          {isCurrentWeek && (
            <div className="mt-4">
              {isAdding ? (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="What do you want to achieve?"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    autoFocus
                  />

                  {pillars.length > 0 && (
                    <select
                      value={selectedPillar}
                      onChange={(e) => setSelectedPillar(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Link to pillar (optional)</option>
                      {pillars.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!newGoalTitle.trim() || isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Adding..." : "Add Goal"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setNewGoalTitle("");
                        setSelectedPillar("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdding(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Goal
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
