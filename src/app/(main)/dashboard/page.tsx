import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { StreakCounter } from "@/components/features/dashboard/streak-counter";
import { KarmaPoints } from "@/components/features/dashboard/karma-points";
import { PillarGrid } from "@/components/features/dashboard/pillar-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, Sunrise } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireAuth();
  const userId = user.id;

  // Get user's active journey
  const journey = await db.journey.findFirst({
    where: {
      userId,
      isActive: true,
    },
  });

  // Get streak data
  let streak: any = null;
  if (journey) {
    streak = await db.streak.findFirst({
      where: {
        userId,
        journeyId: journey.id,
      },
    });
  }

  // Get today's completed pillars
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCheckins = await db.dailyCheckin.findMany({
    where: {
      userId,
      checkinDate: today,
      completed: true,
    },
  });

  // Get all pillars to join with checkins
  const allPillars = await db.pillar.findMany();
  const pillarMap = new Map(allPillars.map((p: any) => [p.id, p]));

  // Manually join pillar data
  const todayCheckinsWithPillars = todayCheckins.map((c: any) => ({
    ...c,
    pillar: pillarMap.get(c.pillarId),
  }));

  // Get total karma
  const karmaTransactions = await db.karmaTransaction.findMany({
    where: { userId },
  });
  const totalKarma = karmaTransactions.reduce((sum: number, t: any) => sum + t.points, 0);

  // Get today's earned karma
  const todayKarmaTransactions = await db.karmaTransaction.findMany({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });
  const todayEarned = todayKarmaTransactions.reduce((sum: number, t: any) => sum + t.points, 0);

  // Calculate current day in journey
  const currentDay = journey
    ? Math.min(
        Math.floor(
          (new Date().getTime() - new Date(journey.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1,
        48
      )
    : 0;

  // Get completed pillar slugs
  const completedPillars = todayCheckinsWithPillars.map((c: any) => c.pillar?.slug).filter(Boolean);

  // Check if streak is at risk (no completions today and it's past noon)
  const isStreakAtRisk =
    completedPillars.length === 0 && new Date().getHours() >= 12;

  // If no journey exists, show start journey prompt
  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25">
              <Sunrise className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Begin Your Transformation
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your 48-day Vedic journey to transform your body, mind, and
              spirit. Commit to 30 minutes for your mind and 30 minutes for your
              body each day.
            </p>
            <StartJourneyButton userId={userId} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="vedic-card p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm">Good morning!</p>
            <h1 className="text-2xl font-bold mt-1">
              Day {currentDay} of Your Journey
            </h1>
            <p className="text-amber-100 mt-2">
              {48 - currentDay} days remaining in your transformation
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCounter
          currentStreak={streak?.currentStreak || 0}
          longestStreak={streak?.longestStreak || 0}
          isAtRisk={isStreakAtRisk}
        />
        <KarmaPoints totalKarma={totalKarma} todayEarned={todayEarned} />
      </div>

      {/* Today's pillars */}
      <PillarGrid completedPillars={completedPillars} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/pillars/morning-initiation">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sunrise className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Morning Routine</h4>
                <p className="text-sm text-gray-500">Start your day right</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pillars/breathing-meditation">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Breathwork</h4>
                <p className="text-sm text-gray-500">4-6 breathing exercise</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/journal">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Journal</h4>
                <p className="text-sm text-gray-500">Record your gratitude</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

// Server action for starting journey
async function StartJourneyButton({ userId }: { userId: string }) {
  async function startJourney() {
    "use server";
    const { db } = await import("@/lib/dynamodb");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create journey
    const journey = await db.journey.create({
      data: {
        userId,
        startDate: today,
        isActive: true,
      },
    });

    // Create streak record
    await db.streak.create({
      data: {
        userId,
        journeyId: journey.id,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    redirect("/dashboard");
  }

  return (
    <form action={startJourney}>
      <Button type="submit" size="lg">
        Start My 48-Day Journey
      </Button>
    </form>
  );
}
