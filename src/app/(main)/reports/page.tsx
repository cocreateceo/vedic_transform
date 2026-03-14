import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { TOTAL_JOURNEY_DAYS } from "@/constants/pillars";
import { ReportsPageClient } from "./reports-client";

export const dynamic = "force-dynamic";
export default async function ReportsPage() {
  const user = await requireAuth();
  const userId = user.id;

  // Get journey
  const journey = await db.journey.findFirst({
    where: { userId, isActive: true },
  });

  const currentDay = journey
    ? Math.min(
        Math.floor(
          (new Date().getTime() - new Date(journey.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1,
        TOTAL_JOURNEY_DAYS
      )
    : 0;

  const currentWeek = Math.ceil(currentDay / 7);

  // Get basic stats for report cards
  const checkins = await db.dailyCheckin.findMany({
    where: { userId, completed: true },
  });

  const karmaTransactions = await db.karmaTransaction.findMany({
    where: { userId },
  });

  const totalKarma = karmaTransactions.reduce((sum, t) => sum + t.points, 0);

  const streak = await db.streak.findFirst({
    where: { userId, journeyId: journey?.id || "" },
  });

  const badges = await db.userBadge.findMany({
    where: { userId },
  });

  // Calculate completion rate
  const totalPossible = currentDay * 11; // 11 pillars per day
  const completionRate = totalPossible > 0
    ? Math.round((checkins.length / totalPossible) * 100)
    : 0;

  return (
    <ReportsPageClient
      hasJourney={!!journey}
      currentDay={currentDay}
      currentWeek={currentWeek}
      stats={{
        totalCheckins: checkins.length,
        totalKarma,
        currentStreak: streak?.currentStreak || 0,
        badgesEarned: badges.length,
        completionRate,
      }}
      journeyStartDate={journey?.startDate || new Date()}
      userName={user.name || "Journey Traveler"}
    />
  );
}
