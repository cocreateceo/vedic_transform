import { prisma } from "@/lib/db";
import { PILLARS, TOTAL_JOURNEY_DAYS } from "@/constants/pillars";

export interface JourneyReport {
  user: {
    name: string;
    email: string;
  };
  journey: {
    startDate: Date;
    currentDay: number;
    completionPercentage: number;
  };
  summary: {
    totalCheckins: number;
    uniqueDaysActive: number;
    totalKarma: number;
    currentStreak: number;
    longestStreak: number;
    badgesEarned: number;
  };
  pillarBreakdown: Array<{
    name: string;
    category: string;
    completedDays: number;
    completionRate: number;
    totalMinutes: number;
  }>;
  weeklyProgress: Array<{
    week: number;
    pillarsCompleted: number;
    avgCompletion: number;
    moodAvg?: number;
  }>;
  assessmentProgress?: {
    baseline: {
      date: Date;
      overallScore: number;
    } | null;
    latest: {
      date: Date;
      overallScore: number;
    } | null;
    improvement: number;
  };
  topStrengths: string[];
  areasForGrowth: string[];
  generatedAt: Date;
}

export async function generateJourneyReport(userId: string): Promise<JourneyReport | null> {
  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (!user) return null;

  // Get journey
  const journey = await prisma.journey.findFirst({
    where: { userId, isActive: true },
  });

  if (!journey) return null;

  const currentDay = Math.min(
    Math.floor(
      (new Date().getTime() - new Date(journey.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1,
    TOTAL_JOURNEY_DAYS
  );

  // Get all check-ins
  const checkins = await prisma.dailyCheckin.findMany({
    where: { userId },
    include: { pillar: true },
  });

  // Get karma
  const karmaTransactions = await prisma.karmaTransaction.findMany({
    where: { userId },
  });
  const totalKarma = karmaTransactions.reduce((sum, t) => sum + t.points, 0);

  // Get streak
  const streak = await prisma.streak.findFirst({
    where: { userId, journeyId: journey.id },
  });

  // Get badges
  const badges = await prisma.userBadge.findMany({
    where: { userId },
  });

  // Get assessments
  const baseline = await prisma.selfAssessment.findFirst({
    where: { userId, assessmentType: "baseline" },
    orderBy: { assessmentDate: "asc" },
  });

  const latest = await prisma.selfAssessment.findFirst({
    where: { userId },
    orderBy: { assessmentDate: "desc" },
  });

  // Get mood logs
  const moodLogs = await prisma.moodLog.findMany({
    where: { userId },
  });

  // Calculate pillar breakdown
  const completedCheckins = checkins.filter((c) => c.completed);
  const pillarBreakdown = PILLARS.map((pillar) => {
    const pillarCheckins = completedCheckins.filter((c) => c.pillarId === pillar.id);
    const totalMinutes = pillarCheckins.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);

    return {
      name: pillar.name,
      category: pillar.category,
      completedDays: pillarCheckins.length,
      completionRate: currentDay > 0 ? Math.round((pillarCheckins.length / currentDay) * 100) : 0,
      totalMinutes,
    };
  });

  // Calculate weekly progress
  const weeklyProgress = [];
  const totalWeeks = Math.ceil(currentDay / 7);

  for (let week = 1; week <= totalWeeks; week++) {
    const weekStart = (week - 1) * 7;
    const weekEnd = Math.min(week * 7, currentDay);
    const daysInWeek = weekEnd - weekStart;

    const weekStartDate = new Date(journey.startDate);
    weekStartDate.setDate(weekStartDate.getDate() + weekStart);
    const weekEndDate = new Date(journey.startDate);
    weekEndDate.setDate(weekEndDate.getDate() + weekEnd);

    const weekCheckins = completedCheckins.filter((c) => {
      const date = new Date(c.checkinDate);
      return date >= weekStartDate && date < weekEndDate;
    });

    const weekMoods = moodLogs.filter((m) => {
      const date = new Date(m.logDate);
      return date >= weekStartDate && date < weekEndDate;
    });

    weeklyProgress.push({
      week,
      pillarsCompleted: weekCheckins.length,
      avgCompletion: daysInWeek > 0
        ? Math.round((weekCheckins.length / (daysInWeek * PILLARS.length)) * 100)
        : 0,
      moodAvg: weekMoods.length > 0
        ? Math.round((weekMoods.reduce((sum, m) => sum + m.moodScore, 0) / weekMoods.length) * 10) / 10
        : undefined,
    });
  }

  // Calculate unique days active
  const uniqueDays = new Set(
    completedCheckins.map((c) => new Date(c.checkinDate).toDateString())
  );

  // Calculate assessment progress
  const calculateOverallScore = (assessment: typeof baseline) => {
    if (!assessment) return 0;
    return Math.round(
      (assessment.energyLevel +
        assessment.sleepQuality +
        assessment.mentalClarity +
        (10 - assessment.stressLevel) +
        assessment.emotionalStability +
        assessment.spiritualConnection +
        assessment.lifeSatisfaction +
        assessment.physicalFitness) / 8
    );
  };

  const baselineScore = calculateOverallScore(baseline);
  const latestScore = calculateOverallScore(latest);

  // Identify top strengths (pillars with > 70% completion)
  const topStrengths = pillarBreakdown
    .filter((p) => p.completionRate >= 70)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3)
    .map((p) => p.name);

  // Identify areas for growth (pillars with < 50% completion)
  const areasForGrowth = pillarBreakdown
    .filter((p) => p.completionRate < 50 && p.completionRate > 0)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 3)
    .map((p) => p.name);

  return {
    user: {
      name: user.name || "Journey Traveler",
      email: user.email,
    },
    journey: {
      startDate: journey.startDate,
      currentDay,
      completionPercentage: Math.round((currentDay / TOTAL_JOURNEY_DAYS) * 100),
    },
    summary: {
      totalCheckins: completedCheckins.length,
      uniqueDaysActive: uniqueDays.size,
      totalKarma,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      badgesEarned: badges.length,
    },
    pillarBreakdown,
    weeklyProgress,
    assessmentProgress: {
      baseline: baseline
        ? { date: baseline.assessmentDate, overallScore: baselineScore }
        : null,
      latest: latest
        ? { date: latest.assessmentDate, overallScore: latestScore }
        : null,
      improvement: latestScore - baselineScore,
    },
    topStrengths,
    areasForGrowth,
    generatedAt: new Date(),
  };
}

// Generate CSV data
export function generateCSV(report: JourneyReport): string {
  const lines: string[] = [];

  // Header
  lines.push("10X Vedic Transformation - Journey Report");
  lines.push(`Generated: ${report.generatedAt.toLocaleDateString()}`);
  lines.push(`User: ${report.user.name}`);
  lines.push("");

  // Journey Summary
  lines.push("JOURNEY SUMMARY");
  lines.push(`Start Date,${report.journey.startDate.toLocaleDateString()}`);
  lines.push(`Current Day,${report.journey.currentDay}`);
  lines.push(`Completion,${report.journey.completionPercentage}%`);
  lines.push(`Total Karma,${report.summary.totalKarma}`);
  lines.push(`Current Streak,${report.summary.currentStreak} days`);
  lines.push(`Longest Streak,${report.summary.longestStreak} days`);
  lines.push(`Badges Earned,${report.summary.badgesEarned}`);
  lines.push("");

  // Pillar Breakdown
  lines.push("PILLAR BREAKDOWN");
  lines.push("Pillar,Category,Days Completed,Completion Rate,Total Minutes");
  report.pillarBreakdown.forEach((p) => {
    lines.push(`${p.name},${p.category},${p.completedDays},${p.completionRate}%,${p.totalMinutes}`);
  });
  lines.push("");

  // Weekly Progress
  lines.push("WEEKLY PROGRESS");
  lines.push("Week,Pillars Completed,Avg Completion,Mood Average");
  report.weeklyProgress.forEach((w) => {
    lines.push(`Week ${w.week},${w.pillarsCompleted},${w.avgCompletion}%,${w.moodAvg || "N/A"}`);
  });

  return lines.join("\n");
}
