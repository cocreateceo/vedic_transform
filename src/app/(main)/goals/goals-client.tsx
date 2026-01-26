"use client";

import { useState } from "react";
import { WeeklyGoalCard, FocusPillarSelector, GoalSummary } from "@/components/features/goals";

interface Goal {
  id: string;
  weekNumber: number;
  title: string;
  description: string | null;
  pillarId: number | null;
  isCompleted: boolean;
  createdAt: Date;
}

interface Pillar {
  id: number | string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
  completionRate?: number;
}

interface GoalsPageClientProps {
  initialGoals: Goal[];
  goalsByWeek: Record<number, Goal[]>;
  focusPillarIds: string[];
  allPillars: Pillar[];
  pillarList: { id: string; name: string }[];
  currentWeek: number;
  totalWeeks: number;
  stats: {
    totalGoals: number;
    completedGoals: number;
    streak: number;
    weeklyCompletion: number[];
  };
}

export function GoalsPageClient({
  initialGoals,
  goalsByWeek: initialGoalsByWeek,
  focusPillarIds: initialFocusPillarIds,
  allPillars,
  pillarList,
  currentWeek,
  totalWeeks,
  stats: initialStats,
}: GoalsPageClientProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [focusPillarIds, setFocusPillarIds] = useState(initialFocusPillarIds);
  const [stats, setStats] = useState(initialStats);

  // Group goals by week
  const goalsByWeek: Record<number, Goal[]> = {};
  goals.forEach((g) => {
    if (!goalsByWeek[g.weekNumber]) {
      goalsByWeek[g.weekNumber] = [];
    }
    goalsByWeek[g.weekNumber].push(g);
  });

  const handleAddGoal = async (title: string, pillarId?: string) => {
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, pillarId, weekNumber: currentWeek }),
      });

      if (res.ok) {
        const data = await res.json();
        setGoals((prev) => [data.goal, ...prev]);
        setStats((prev) => ({ ...prev, totalGoals: prev.totalGoals + 1 }));
      }
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };

  const handleToggleGoal = async (goalId: string, completed: boolean) => {
    try {
      const res = await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, isCompleted: completed }),
      });

      if (res.ok) {
        setGoals((prev) =>
          prev.map((g) => (g.id === goalId ? { ...g, isCompleted: completed } : g))
        );
        setStats((prev) => ({
          ...prev,
          completedGoals: completed ? prev.completedGoals + 1 : prev.completedGoals - 1,
        }));
      }
    } catch (error) {
      console.error("Failed to toggle goal:", error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const res = await fetch(`/api/goals?id=${goalId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const deleted = goals.find((g) => g.id === goalId);
        setGoals((prev) => prev.filter((g) => g.id !== goalId));
        setStats((prev) => ({
          ...prev,
          totalGoals: prev.totalGoals - 1,
          completedGoals: deleted?.isCompleted
            ? prev.completedGoals - 1
            : prev.completedGoals,
        }));
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const handleSaveFocusPillars = async (pillarIds: string[]) => {
    try {
      const res = await fetch("/api/focus-pillars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillarIds }),
      });

      if (res.ok) {
        setFocusPillarIds(pillarIds);
      }
    } catch (error) {
      console.error("Failed to save focus pillars:", error);
    }
  };

  // Get pillar name for goal
  const getPillarName = (pillarId: number | null) => {
    if (!pillarId) return undefined;
    return pillarList.find((p) => p.id === pillarId.toString())?.name;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Goals</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Set and track your weekly transformation goals
        </p>
      </div>

      {/* Goal Summary */}
      <GoalSummary
        totalGoals={stats.totalGoals}
        completedGoals={stats.completedGoals}
        currentStreak={stats.streak}
        weeklyCompletion={stats.weeklyCompletion}
      />

      {/* Focus Pillars */}
      <FocusPillarSelector
        pillars={allPillars}
        selectedPillars={focusPillarIds}
        maxSelection={3}
        onSave={handleSaveFocusPillars}
      />

      {/* Weekly Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Goals</h2>

        {/* Current Week */}
        <WeeklyGoalCard
          weekNumber={currentWeek}
          goals={(goalsByWeek[currentWeek] || []).map((g) => ({
            ...g,
            pillarName: getPillarName(g.pillarId),
          }))}
          onAddGoal={handleAddGoal}
          onToggleGoal={handleToggleGoal}
          onDeleteGoal={handleDeleteGoal}
          pillars={pillarList}
          isCurrentWeek={true}
        />

        {/* Past Weeks */}
        {Array.from({ length: currentWeek - 1 }, (_, i) => currentWeek - 1 - i)
          .filter((w) => w >= 1)
          .map((weekNum) => (
            <WeeklyGoalCard
              key={weekNum}
              weekNumber={weekNum}
              goals={(goalsByWeek[weekNum] || []).map((g) => ({
                ...g,
                pillarName: getPillarName(g.pillarId),
              }))}
              onAddGoal={handleAddGoal}
              onToggleGoal={handleToggleGoal}
              onDeleteGoal={handleDeleteGoal}
              pillars={pillarList}
              isCurrentWeek={false}
            />
          ))}

        {currentWeek === 1 && !goalsByWeek[1]?.length && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Start by adding your first weekly goal above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
