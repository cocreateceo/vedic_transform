import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { PILLARS, TOTAL_JOURNEY_DAYS } from "@/constants/pillars";
import { GoalsPageClient } from "./goals-client";

export default async function GoalsPage() {
  const user = await requireAuth();
  const userId = user.id;

  // Get user's journey
  const journey = await db.journey.findFirst({
    where: { userId, isActive: true },
  });

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

  // Get all goals (individual tasks)
  const goals = await db.goalTask.findMany({
    where: { userId },
  });

  // Sort goals by weekNumber desc, then createdAt desc (manual sort since DynamoDB doesn't support multi-field orderBy)
  goals.sort((a: any, b: any) => {
    if (b.weekNumber !== a.weekNumber) return b.weekNumber - a.weekNumber;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Get focus pillars
  const focusPillars = await db.focusPillar.findMany({
    where: { userId },
  });

  // Sort focus pillars by priority (manual sort)
  focusPillars.sort((a: any, b: any) => a.priority - b.priority);

  // Get all pillars with completion stats
  const checkins = await db.dailyCheckin.findMany({
    where: { userId, completed: true },
  });

  const pillarsWithStats = PILLARS.map((pillar) => {
    const completedDays = checkins.filter((c) => c.pillarId === pillar.id).length;
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

  // Calculate stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;

  // Weekly completion rates
  const weeklyStats: Record<number, { total: number; completed: number }> = {};
  goals.forEach((g) => {
    if (!weeklyStats[g.weekNumber]) {
      weeklyStats[g.weekNumber] = { total: 0, completed: 0 };
    }
    weeklyStats[g.weekNumber].total++;
    if (g.isCompleted) weeklyStats[g.weekNumber].completed++;
  });

  const weeklyCompletion = Array.from({ length: currentWeek }, (_, i) => {
    const weekData = weeklyStats[i + 1];
    return weekData && weekData.total > 0
      ? Math.round((weekData.completed / weekData.total) * 100)
      : 0;
  });

  // Calculate streak
  let streak = 0;
  for (let w = currentWeek; w >= 1; w--) {
    const weekData = weeklyStats[w];
    if (weekData && weekData.total > 0 && weekData.completed === weekData.total) {
      streak++;
    } else {
      break;
    }
  }

  // Group goals by week
  const goalsByWeek: Record<number, typeof goals> = {};
  goals.forEach((g) => {
    if (!goalsByWeek[g.weekNumber]) {
      goalsByWeek[g.weekNumber] = [];
    }
    goalsByWeek[g.weekNumber].push(g);
  });

  // Prepare pillar list for goal linking
  const pillarList = PILLARS.map((p) => ({ id: p.id.toString(), name: p.name }));

  return (
    <GoalsPageClient
      initialGoals={goals}
      goalsByWeek={goalsByWeek}
      focusPillarIds={focusPillars.map((fp) => fp.pillarId.toString())}
      allPillars={pillarsWithStats}
      pillarList={pillarList}
      currentWeek={currentWeek}
      totalWeeks={totalWeeks}
      stats={{
        totalGoals,
        completedGoals,
        streak,
        weeklyCompletion,
      }}
    />
  );
}
