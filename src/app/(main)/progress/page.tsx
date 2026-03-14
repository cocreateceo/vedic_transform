import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PILLARS, TOTAL_JOURNEY_DAYS } from "@/constants/pillars";
import { Award } from "lucide-react";
import {
  PillarRadarChart,
  WeeklyTrendChart,
  CalendarHeatmap,
  ConsistencyScore,
  InsightList,
} from "@/components/features/analytics";

export default async function ProgressPage() {
  const user = await requireAuth();
  const userId = user.id;

  // Get user's journey
  const journey = await db.journey.findFirst({
    where: { userId, isActive: true },
  });

  // Get all check-ins for this journey
  const checkins = journey
    ? await db.dailyCheckin.findMany({
        where: { userId, completed: true },
        include: { pillar: { select: { slug: true, name: true } } },
        orderBy: { checkinDate: "asc" },
      })
    : [];

  // Get streak
  const streak = journey
    ? await db.streak.findFirst({
        where: { userId, journeyId: journey.id },
        select: { currentStreak: true, longestStreak: true },
      })
    : null;

  // Get total karma
  const karmaTransactions = await db.karmaTransaction.findMany({
    where: { userId },
    select: { points: true },
  });
  const totalKarma = karmaTransactions.reduce((sum, t) => sum + t.points, 0);

  // Get badges
  const userBadges = await db.userBadge.findMany({
    where: { userId },
    include: { badge: true },
  });

  // Calculate current day
  const currentDay = journey
    ? Math.min(
        Math.floor(
          (new Date().getTime() - new Date(journey.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1,
        TOTAL_JOURNEY_DAYS
      )
    : 0;

  // Calculate current week
  const currentWeek = Math.ceil(currentDay / 7);

  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get today's check-ins
  const todayCheckins = checkins.filter((c) => {
    const checkinDate = new Date(c.checkinDate);
    checkinDate.setHours(0, 0, 0, 0);
    return checkinDate.getTime() === today.getTime();
  });

  // Calculate pillar stats for radar chart
  const pillarStats = PILLARS.map((pillar) => {
    const completions = checkins.filter((c) => c.pillar.slug === pillar.slug).length;
    return {
      name: pillar.name,
      shortName: pillar.name.split(" ")[0].substring(0, 8),
      completion: currentDay > 0 ? Math.round((completions / currentDay) * 100) : 0,
      category: pillar.category,
      color: pillar.color,
    };
  });

  // Calculate overall consistency score
  const totalPossibleCheckins = currentDay * PILLARS.length;
  const totalCompletedCheckins = checkins.length;
  const consistencyScore =
    totalPossibleCheckins > 0
      ? Math.round((totalCompletedCheckins / totalPossibleCheckins) * 100)
      : 0;

  // Prepare weekly trend data (last 7 days)
  const weeklyTrendData = [];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayCheckins = checkins.filter((c) => {
      const checkinDate = new Date(c.checkinDate);
      checkinDate.setHours(0, 0, 0, 0);
      return checkinDate.getTime() === date.getTime();
    });

    weeklyTrendData.push({
      date: date.toISOString().split("T")[0],
      dayLabel: dayLabels[date.getDay() === 0 ? 6 : date.getDay() - 1],
      pillarsCompleted: dayCheckins.length,
      totalPillars: PILLARS.length,
      percentage: Math.round((dayCheckins.length / PILLARS.length) * 100),
    });
  }

  // Calculate previous week average for comparison
  let previousWeekTotal = 0;
  let previousWeekDays = 0;
  for (let i = 13; i >= 7; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayCheckins = checkins.filter((c) => {
      const checkinDate = new Date(c.checkinDate);
      checkinDate.setHours(0, 0, 0, 0);
      return checkinDate.getTime() === date.getTime();
    });

    previousWeekTotal += dayCheckins.length;
    previousWeekDays++;
  }
  const previousWeekAverage =
    previousWeekDays > 0
      ? Math.round((previousWeekTotal / previousWeekDays / PILLARS.length) * 100)
      : 0;

  // Prepare calendar heatmap data
  const calendarData = [];
  if (journey) {
    const journeyStart = new Date(journey.startDate);
    journeyStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < TOTAL_JOURNEY_DAYS; i++) {
      const date = new Date(journeyStart);
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayCheckins = checkins.filter((c) => {
        const checkinDate = new Date(c.checkinDate);
        checkinDate.setHours(0, 0, 0, 0);
        return checkinDate.getTime() === date.getTime();
      });

      calendarData.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayNumber: i + 1,
        pillarsCompleted: dayCheckins.length,
        totalPillars: PILLARS.length,
        percentage: Math.round((dayCheckins.length / PILLARS.length) * 100),
        isToday: date.getTime() === today.getTime(),
        isFuture: date.getTime() > today.getTime(),
      });
    }
  }

  // Generate insights based on data
  const insights = [];

  // Strength insight
  const strongestPillar = pillarStats.reduce((max, p) =>
    p.completion > max.completion ? p : max
  );
  if (strongestPillar.completion >= 70) {
    insights.push({
      id: "strength-1",
      type: "strength" as const,
      title: `Strong in ${strongestPillar.name}`,
      description: `You've completed ${strongestPillar.name} ${strongestPillar.completion}% of the time. Keep it up!`,
    });
  }

  // Weakness insight
  const weakestPillar = pillarStats.reduce((min, p) =>
    p.completion < min.completion ? p : min
  );
  if (weakestPillar.completion < 50 && currentDay > 3) {
    insights.push({
      id: "weakness-1",
      type: "weakness" as const,
      title: `${weakestPillar.name} needs attention`,
      description: `Only ${weakestPillar.completion}% completion. Try setting a reminder for this pillar.`,
      actionText: "Set reminder",
    });
  }

  // Streak insight
  if (streak && streak.currentStreak >= 7) {
    insights.push({
      id: "streak-1",
      type: "milestone" as const,
      title: `${streak.currentStreak} day streak!`,
      description: "Amazing consistency! You're building powerful habits.",
    });
  }

  // Trend insight
  const currentWeekAvg = weeklyTrendData.reduce((sum, d) => sum + d.percentage, 0) / 7;
  if (currentWeekAvg > previousWeekAverage + 10) {
    insights.push({
      id: "trend-1",
      type: "pattern" as const,
      title: "Improving trend",
      description: `Your completion rate is ${Math.round(currentWeekAvg - previousWeekAverage)}% higher than last week!`,
    });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Track your transformation journey
        </p>
      </div>

      {/* Consistency Score - Full width on mobile */}
      <ConsistencyScore
        currentScore={consistencyScore}
        previousScore={previousWeekAverage}
        streakDays={streak?.currentStreak || 0}
        totalKarma={totalKarma}
        todayCompleted={todayCheckins.length}
        todayTotal={PILLARS.length}
      />

      {/* Charts Row - Stack on mobile, side by side on desktop */}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Insights</h2>
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
            {pillarStats
              .sort((a, b) => b.completion - a.completion)
              .map((pillar) => {
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
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
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
              {userBadges.map((ub) => (
                <div
                  key={ub.id}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-amber-50 text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm">
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
