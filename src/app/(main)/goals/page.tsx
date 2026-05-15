"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PILLARS, TOTAL_JOURNEY_DAYS } from "@/constants/pillars";
import { GoalsPageClient } from "./goals-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function GoalsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasJourney, setHasJourney] = useState(false);
  const [startingJourney, setStartingJourney] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [journeyData, goalsRes, focusRes, checkinsRes] = await Promise.all([
          apiFetch("/data/journey"),
          apiFetch("/data/goals"),
          apiFetch("/data/focus-pillars"),
          apiFetch("/data/checkin?all=true"),
        ]);

        const journey = journeyData?.journey;
        setHasJourney(!!journey);
        const goals = goalsRes?.goals || [];
        const focusPillars = focusRes?.focusPillars || [];
        const checkins = checkinsRes?.checkins || [];

        // Calculate current day and week
        const currentDay = journey
          ? Math.min(
              Math.floor(
                (new Date().getTime() - new Date(journey.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1,
              TOTAL_JOURNEY_DAYS
            )
          : 0;

        const currentWeek = Math.max(1, Math.ceil(currentDay / 7));
        const totalWeeks = Math.ceil(TOTAL_JOURNEY_DAYS / 7);

        // Sort goals
        goals.sort((a: any, b: any) => {
          if (b.weekNumber !== a.weekNumber) return b.weekNumber - a.weekNumber;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // Pillars with stats
        const pillarsWithStats = PILLARS.map((pillar) => {
          // Match both the new shape (numeric pillarId + pillarSlug) and the
          // legacy shape where pillarId held the slug string.
          const completedDays = checkins.filter((c: any) =>
            c.pillarId === pillar.id ||
            c.pillarSlug === pillar.slug ||
            c.pillarId === pillar.slug
          ).length;
          const completionRate = currentDay > 0 ? Math.round((completedDays / currentDay) * 100) : 0;
          return {
            id: pillar.id,
            name: pillar.name,
            description: pillar.description,
            category: pillar.category,
            icon: "🎯",
            completionRate: Math.min(100, completionRate),
          };
        });

        // Stats
        const totalGoals = goals.length;
        const completedGoals = goals.filter((g: any) => g.isCompleted).length;

        const weeklyStats: Record<number, { total: number; completed: number }> = {};
        goals.forEach((g: any) => {
          if (!weeklyStats[g.weekNumber]) weeklyStats[g.weekNumber] = { total: 0, completed: 0 };
          weeklyStats[g.weekNumber].total++;
          if (g.isCompleted) weeklyStats[g.weekNumber].completed++;
        });

        const weeklyCompletion = Array.from({ length: currentWeek }, (_, i) => {
          const weekData = weeklyStats[i + 1];
          return weekData && weekData.total > 0
            ? Math.round((weekData.completed / weekData.total) * 100)
            : 0;
        });

        let streak = 0;
        for (let w = currentWeek; w >= 1; w--) {
          const weekData = weeklyStats[w];
          if (weekData && weekData.total > 0 && weekData.completed === weekData.total) {
            streak++;
          } else {
            break;
          }
        }

        const goalsByWeek: Record<number, any[]> = {};
        goals.forEach((g: any) => {
          if (!goalsByWeek[g.weekNumber]) goalsByWeek[g.weekNumber] = [];
          goalsByWeek[g.weekNumber].push(g);
        });

        const pillarList = PILLARS.map((p) => ({ id: p.id.toString(), name: p.name }));

        setData({
          goals,
          goalsByWeek,
          focusPillarIds: focusPillars.map((fp: any) => fp.pillarId.toString()),
          allPillars: pillarsWithStats,
          pillarList,
          currentWeek,
          totalWeeks,
          stats: { totalGoals, completedGoals, streak, weeklyCompletion },
        });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!hasJourney) {
    const handleStartJourney = async () => {
      setStartingJourney(true);
      try {
        await apiFetch("/data/journey", {
          method: "POST",
          body: JSON.stringify({ action: "start" }),
        });
        // Reload so the full goals data pipeline (incl. currentDay/currentWeek)
        // rebuilds against the new journey row.
        window.location.reload();
      } catch {
        setStartingJourney(false);
      }
    };
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Set and track your weekly transformation goals
          </p>
        </div>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  Start your 48-day journey first
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Weekly goals, focus pillars, and progress tracking activate once
                  your journey has begun.
                </p>
                <Button
                  className="mt-4"
                  onClick={handleStartJourney}
                  isLoading={startingJourney}
                >
                  Begin my 48-day journey
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <GoalsPageClient
      initialGoals={data.goals}
      goalsByWeek={data.goalsByWeek}
      focusPillarIds={data.focusPillarIds}
      allPillars={data.allPillars}
      pillarList={data.pillarList}
      currentWeek={data.currentWeek}
      totalWeeks={data.totalWeeks}
      stats={data.stats}
    />
  );
}
