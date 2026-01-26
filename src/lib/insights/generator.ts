import { prisma } from "@/lib/db";

export type InsightType = "pattern" | "strength" | "weakness" | "recommendation" | "milestone";

export interface GeneratedInsight {
  type: InsightType;
  category: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  priority: number;
}

interface UserData {
  userId: string;
  currentDay: number;
  currentWeek: number;
  checkins: Array<{
    pillarId: number;
    checkinDate: Date;
    completed: boolean;
  }>;
  pillarStats: Array<{
    pillarId: number;
    pillarName: string;
    completedCount: number;
    completionRate: number;
  }>;
  streak: number;
  moodLogs?: Array<{
    logDate: Date;
    moodScore: number;
    energy?: number;
  }>;
  assessments?: Array<{
    assessmentDate: Date;
    overallWellbeing?: number;
    energyLevel: number;
    stressLevel: number;
  }>;
}

export async function generateUserInsights(userId: string): Promise<GeneratedInsight[]> {
  const insights: GeneratedInsight[] = [];

  // Get user's journey
  const journey = await prisma.journey.findFirst({
    where: { userId, isActive: true },
  });

  if (!journey) return insights;

  const currentDay = Math.min(
    Math.floor(
      (new Date().getTime() - new Date(journey.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1,
    48
  );
  const currentWeek = Math.ceil(currentDay / 7);

  // Get check-ins
  const checkins = await prisma.dailyCheckin.findMany({
    where: { userId },
    include: { pillar: { select: { id: true, name: true } } },
    orderBy: { checkinDate: "desc" },
  });

  // Get streak
  const streak = await prisma.streak.findFirst({
    where: { userId, journeyId: journey.id },
  });

  // Get mood logs
  const moodLogs = await prisma.moodLog.findMany({
    where: { userId },
    orderBy: { logDate: "desc" },
    take: 14,
  });

  // Get assessments
  const assessments = await prisma.selfAssessment.findMany({
    where: { userId },
    orderBy: { assessmentDate: "desc" },
    take: 4,
  });

  // Calculate pillar stats
  const pillarMap = new Map<number, { name: string; completed: number; total: number }>();
  checkins.forEach((c) => {
    if (!pillarMap.has(c.pillarId)) {
      pillarMap.set(c.pillarId, { name: c.pillar.name, completed: 0, total: 0 });
    }
    const stat = pillarMap.get(c.pillarId)!;
    stat.total++;
    if (c.completed) stat.completed++;
  });

  const pillarStats = Array.from(pillarMap.entries()).map(([id, stat]) => ({
    pillarId: id,
    pillarName: stat.name,
    completedCount: stat.completed,
    completionRate: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0,
  }));

  // Generate insights based on patterns

  // 1. Streak insights
  if (streak && streak.currentStreak >= 7) {
    insights.push({
      type: "milestone",
      category: "streak",
      title: `${streak.currentStreak} Day Streak!`,
      description: `You've maintained consistency for ${streak.currentStreak} days straight. This is building powerful neural pathways for lasting change.`,
      priority: 10,
    });
  } else if (streak && streak.currentStreak >= 3) {
    insights.push({
      type: "pattern",
      category: "streak",
      title: `${streak.currentStreak} Day Streak Building`,
      description: "You're building momentum. Just 4 more days to reach a week-long streak!",
      priority: 5,
    });
  }

  // 2. Strongest pillar insight
  const strongestPillar = pillarStats.reduce(
    (max, p) => (p.completionRate > max.completionRate ? p : max),
    { pillarId: 0, pillarName: "", completedCount: 0, completionRate: 0 }
  );

  if (strongestPillar.completionRate >= 70) {
    insights.push({
      type: "strength",
      category: "pillar",
      title: `${strongestPillar.pillarName} is Your Strength`,
      description: `With ${strongestPillar.completionRate}% consistency, this pillar is becoming a core habit. Consider mentoring others!`,
      priority: 8,
    });
  }

  // 3. Weakest pillar insight
  const weakestPillar = pillarStats.reduce(
    (min, p) => (p.completionRate < min.completionRate && p.completionRate > 0 ? p : min),
    { pillarId: 0, pillarName: "", completedCount: 0, completionRate: 100 }
  );

  if (weakestPillar.completionRate < 40 && weakestPillar.completionRate > 0) {
    insights.push({
      type: "weakness",
      category: "pillar",
      title: `${weakestPillar.pillarName} Needs Attention`,
      description: `Only ${weakestPillar.completionRate}% completion. Try linking this to an existing habit or set a specific time for it.`,
      priority: 7,
    });
  }

  // 4. Day-specific pattern insights
  const dayOfWeek = new Date().getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[dayOfWeek];

  // Check if user typically struggles on this day
  const todayCheckins = checkins.filter((c) => {
    const date = new Date(c.checkinDate);
    return date.getDay() === dayOfWeek;
  });

  const todayCompletionRate = todayCheckins.length > 0
    ? Math.round((todayCheckins.filter((c) => c.completed).length / todayCheckins.length) * 100)
    : 50;

  if (todayCompletionRate < 50 && todayCheckins.length >= 2) {
    insights.push({
      type: "pattern",
      category: "timing",
      title: `${todayName}s Are Challenging`,
      description: `Your completion rate on ${todayName}s is ${todayCompletionRate}%. Try adjusting your routine or setting extra reminders.`,
      priority: 6,
    });
  }

  // 5. Mood correlation insight (if mood data exists)
  if (moodLogs.length >= 5) {
    const avgMood = moodLogs.reduce((sum, m) => sum + m.moodScore, 0) / moodLogs.length;

    if (avgMood >= 4) {
      insights.push({
        type: "pattern",
        category: "mood",
        title: "Positive Mood Trend",
        description: `Your average mood score is ${avgMood.toFixed(1)}/5. Your practices are having a positive impact!`,
        priority: 4,
      });
    } else if (avgMood <= 2.5) {
      insights.push({
        type: "recommendation",
        category: "mood",
        title: "Focus on Stress Relief",
        description: "Your mood scores suggest increased stress. Consider prioritizing meditation and breathwork today.",
        priority: 9,
      });
    }
  }

  // 6. Journey milestone insights
  if (currentDay === 7 || currentDay === 14 || currentDay === 21 || currentDay === 28 || currentDay === 42) {
    insights.push({
      type: "milestone",
      category: "journey",
      title: `Day ${currentDay} Milestone!`,
      description: currentDay === 21
        ? "21 days - habits are forming! The neural pathways for these behaviors are strengthening."
        : currentDay === 42
        ? "42 days - you're in the final stretch! Your transformation is nearly complete."
        : `You've completed ${currentDay} days of your transformation journey.`,
      priority: 10,
    });
  }

  // 7. Weekly assessment reminder
  if (currentDay % 7 === 0) {
    const hasWeeklyAssessment = assessments.some((a) => {
      const dayDiff = Math.floor(
        (new Date().getTime() - new Date(a.assessmentDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return dayDiff <= 7 && a.assessmentType !== "baseline";
    });

    if (!hasWeeklyAssessment) {
      insights.push({
        type: "recommendation",
        category: "assessment",
        title: "Weekly Check-in Due",
        description: "Take 2 minutes to complete your weekly assessment and track your transformation progress.",
        priority: 8,
      });
    }
  }

  // 8. Improvement insight based on assessments
  if (assessments.length >= 2) {
    const latest = assessments[0];
    const previous = assessments[1];

    const latestScore = (latest.energyLevel + (10 - latest.stressLevel) + (latest.overallWellbeing || 5)) / 3;
    const previousScore = (previous.energyLevel + (10 - previous.stressLevel) + (previous.overallWellbeing || 5)) / 3;

    const improvement = latestScore - previousScore;

    if (improvement >= 1) {
      insights.push({
        type: "pattern",
        category: "progress",
        title: "Measurable Improvement!",
        description: `Your wellbeing scores have improved by ${(improvement * 10).toFixed(0)}% since your last assessment. Keep going!`,
        data: { chartData: [previousScore * 10, latestScore * 10] },
        priority: 9,
      });
    }
  }

  // Sort by priority (highest first)
  insights.sort((a, b) => b.priority - a.priority);

  // Return top 5 insights
  return insights.slice(0, 5);
}

// Save generated insights to database
export async function saveInsights(userId: string, insights: GeneratedInsight[]) {
  // Get existing active insights to avoid duplicates
  const existingInsights = await prisma.userInsight.findMany({
    where: {
      userId,
      isDismissed: false,
      expiresAt: { gt: new Date() },
    },
    select: { title: true },
  });

  const existingTitles = new Set(existingInsights.map((i) => i.title));

  // Filter out duplicates
  const newInsights = insights.filter((i) => !existingTitles.has(i.title));

  // Set expiration (24 hours for most, 7 days for milestones)
  const now = new Date();

  const savedInsights = await Promise.all(
    newInsights.map((insight) =>
      prisma.userInsight.create({
        data: {
          userId,
          insightType: insight.type,
          category: insight.category,
          title: insight.title,
          description: insight.description,
          data: insight.data ? JSON.stringify(insight.data) : null,
          priority: insight.priority,
          expiresAt: new Date(
            now.getTime() + (insight.type === "milestone" ? 7 : 1) * 24 * 60 * 60 * 1000
          ),
        },
      })
    )
  );

  return savedInsights;
}
