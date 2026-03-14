import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET - Fetch user's goals
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vedic-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const { searchParams } = new URL(request.url);
    const weekNumber = searchParams.get("week");

    // Get journey for week calculation
    const journey = await db.journey.findFirst({
      where: { userId, isActive: true },
    });

    const currentWeek = journey
      ? Math.ceil(
          (new Date().getTime() - new Date(journey.startDate).getTime()) /
            (1000 * 60 * 60 * 24 * 7)
        )
      : 1;

    // Get all goals for the user
    const goals = await db.goalTask.findMany({
      where: { userId },
    });

    // Filter by week if specified
    const filteredGoals = weekNumber
      ? goals.filter((g: any) => g.weekNumber === parseInt(weekNumber))
      : goals;

    // Sort manually (DynamoDB doesn't support multi-field orderBy)
    filteredGoals.sort((a: any, b: any) => {
      if (b.weekNumber !== a.weekNumber) return b.weekNumber - a.weekNumber;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Get focus pillars
    const focusPillars = await db.focusPillar.findMany({
      where: { userId },
    });

    // Sort focus pillars by priority
    focusPillars.sort((a: any, b: any) => a.priority - b.priority);

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

    const weeklyCompletion = Object.entries(weeklyStats)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([, s]) => (s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0));

    // Calculate streak (consecutive weeks with all goals completed)
    let streak = 0;
    for (let w = currentWeek; w >= 1; w--) {
      const weekData = weeklyStats[w];
      if (weekData && weekData.total > 0 && weekData.completed === weekData.total) {
        streak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      goals: filteredGoals,
      focusPillars,
      currentWeek,
      stats: {
        totalGoals,
        completedGoals,
        streak,
        weeklyCompletion,
      },
    });
  } catch (error) {
    console.error("Goals fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

// POST - Create a new goal
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vedic-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const data = await request.json();

    // Get current week
    const journey = await db.journey.findFirst({
      where: { userId, isActive: true },
    });

    const weekNumber = journey
      ? Math.ceil(
          (new Date().getTime() - new Date(journey.startDate).getTime()) /
            (1000 * 60 * 60 * 24 * 7)
        )
      : 1;

    const goal = await db.goalTask.create({
      data: {
        userId,
        weekNumber: data.weekNumber || weekNumber,
        title: data.title,
        description: data.description,
        pillarId: data.pillarId ? parseInt(data.pillarId) : null,
        isCompleted: false,
      },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Goal create error:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

// PATCH - Update goal (toggle completion, edit)
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vedic-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const data = await request.json();

    if (!data.goalId) {
      return NextResponse.json({ error: "Goal ID required" }, { status: 400 });
    }

    // Verify ownership
    const existingGoal = await db.goalTask.findUnique({
      where: { id: data.goalId },
    });

    if (!existingGoal || existingGoal.userId !== userId) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updateData: { isCompleted?: boolean; completedAt?: Date | null; title?: string } = {};

    if (typeof data.isCompleted === "boolean") {
      updateData.isCompleted = data.isCompleted;
      updateData.completedAt = data.isCompleted ? new Date() : null;
    }

    if (data.title) {
      updateData.title = data.title;
    }

    const goal = await db.goalTask.update({
      where: { id: data.goalId },
      data: updateData,
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Goal update error:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

// DELETE - Delete a goal
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vedic-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("id");

    if (!goalId) {
      return NextResponse.json({ error: "Goal ID required" }, { status: 400 });
    }

    // Verify ownership
    const existingGoal = await db.goalTask.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal || existingGoal.userId !== userId) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await db.goalTask.delete({
      where: { id: goalId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Goal delete error:", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
