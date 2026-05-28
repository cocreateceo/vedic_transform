"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PILLARS, TOTAL_JOURNEY_DAYS } from "@/constants/pillars";
import { Award, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PillarRadarChart,
  WeeklyTrendChart,
  CalendarHeatmap,
  ConsistencyScore,
  InsightList,
} from "@/components/features/analytics";

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingJourney, setStartingJourney] = useState(false);

  useEffect(() => {
    apiFetch("/data/reports")
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStartJourney = async () => {
    setStartingJourney(true);
    try {
      await apiFetch("/data/journey", {
        method: "POST",
        body: JSON.stringify({ action: "start" }),
      });
      window.location.reload();
    } catch {
      setStartingJourney(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const {
    journey = null,
    journeyDay = 0,
    streak = { currentStreak: 0, longestStreak: 0 },
    totalKarma = 0,
    pillarStats: rawPillarStats,
    weeklyTrendData = [],
    calendarData = [],
    insights = [],
    userBadges = [],
    previousWeekAverage = 0,
  } = data;

  if (!journey) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Your Progress</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track your transformation journey
          </p>
        </div>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  Start your 48-day journey first
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Charts, heatmaps, and insights activate once your transformation
                  journey has begun.
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

  // Pillar completion = days the pillar was checked in ÷ days of journey
  // elapsed. The old math divided by the most-done pillar's count, so the
  // top pillar always hit 100% even when the user had only checked it in once.
  const denom = Math.max(1, journeyDay);
  const pillarStats =
    rawPillarStats && !Array.isArray(rawPillarStats)
      ? (() => {
          const counts = rawPillarStats as Record<string, number>;
          return PILLARS.map((p) => ({
            name: p.name,
            shortName: p.name.split(/[\s&]+/)[0],
            category: p.category,
            color: p.color,
            completion: Math.min(
              100,
              Math.round(((counts[String(p.id)] || 0) / denom) * 100),
            ),
          }));
        })()
      : (rawPillarStats as {
          name: string;
          shortName: string;
          category: string;
          color: string;
          completion: number;
        }[]) || [];

  const currentWeek = Math.max(1, Math.ceil(journeyDay / 7));
  // Today's row is always the last entry in weeklyTrendData (API builds it
  // ending today). Falls back to derived state if the field is missing on
  // an older API response.
  const todayRow = weeklyTrendData[weeklyTrendData.length - 1];
  const todayCompleted: number =
    todayRow?.pillarsCompleted ?? pillarStats.filter((p) => p.completion > 0).length;
  // Consistency score = avg daily completion % over the current week.
  // The old derivation averaged the broken pillarStats — garbage in.
  const consistencyScore =
    weeklyTrendData.length > 0
      ? Math.round(
          weeklyTrendData.reduce(
            (sum: number, d: { percentage: number }) => sum + d.percentage,
            0,
          ) / weeklyTrendData.length,
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Your Progress</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Track your transformation journey
        </p>
      </div>

      {/* Consistency Score */}
      <ConsistencyScore
        currentScore={consistencyScore}
        previousScore={previousWeekAverage}
        streakDays={streak?.currentStreak || 0}
        totalKarma={totalKarma}
        todayCompleted={todayCompleted}
        todayTotal={PILLARS.length}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTrendChart
          data={weeklyTrendData}
          currentWeek={currentWeek}
          previousWeekAverage={previousWeekAverage}
        />
        <PillarRadarChart data={pillarStats} />
      </div>

      {/* Calendar Heatmap */}
      <CalendarHeatmap data={calendarData} totalDays={TOTAL_JOURNEY_DAYS} />

      {/* Insights Section */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Insights</h2>
          <InsightList insights={insights} maxVisible={3} />
        </div>
      )}

      {/* Pillar Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Pillar Consistency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(pillarStats as any[])
              .sort((a: any, b: any) => b.completion - a.completion)
              .map((pillar: any) => {
                const originalPillar = PILLARS.find(
                  (p) => p.name === pillar.name
                );
                const Icon = originalPillar?.icon;

                return (
                  <div key={pillar.name} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${pillar.color}20` }}
                    >
                      {Icon && (
                        <Icon
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: pillar.color }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {pillar.name}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
                          {pillar.completion}%
                        </span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pillar.completion}%`,
                            backgroundColor: pillar.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Badges & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {userBadges && userBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {userBadges.map((ub: any) => (
                <div
                  key={ub.id}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-amber-50 text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-[var(--color-text-primary)] text-xs sm:text-sm">
                    {ub.badge?.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2">
                    {ub.badge?.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Award className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Complete pillars to earn badges!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
