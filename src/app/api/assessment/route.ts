import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

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

    // Get current journey for day calculation
    const journey = await db.journey.findFirst({
      where: { userId, isActive: true },
    });

    const dayNumber = journey
      ? Math.floor(
          (new Date().getTime() - new Date(journey.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

    // Create assessment
    const assessment = await db.selfAssessment.create({
      data: {
        userId,
        assessmentDate: new Date(),
        assessmentType: data.assessmentType || "weekly",
        dayNumber,
        stressLevel: data.stressLevel,
        sleepQuality: data.sleepQuality,
        energyLevel: data.energyLevel,
        mentalClarity: data.mentalClarity,
        physicalFitness: data.physicalFitness,
        emotionalStability: data.emotionalStability,
        spiritualConnection: data.spiritualConnection,
        lifeSatisfaction: data.lifeSatisfaction,
        focusLevel: data.focusLevel,
        overallWellbeing: data.overallWellbeing,
        biggestChallenge: data.biggestChallenge,
        biggestWin: data.biggestWin,
        oneWordFeeling: data.oneWordFeeling,
        notes: data.notes,
      },
    });

    return NextResponse.json({ success: true, assessment });
  } catch (error) {
    console.error("Assessment save error:", error);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}

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
    const type = searchParams.get("type");

    let where: any = { userId };
    if (type) {
      where.assessmentType = type;
    }

    const assessments = await db.selfAssessment.findMany({
      where,
      orderBy: { assessmentDate: "desc" },
    });

    // Get baseline and latest for comparison
    const baseline = await db.selfAssessment.findFirst({
      where: { userId, assessmentType: "baseline" },
      orderBy: { assessmentDate: "asc" },
    });

    const latest = await db.selfAssessment.findFirst({
      where: { userId },
      orderBy: { assessmentDate: "desc" },
    });

    return NextResponse.json({
      assessments,
      baseline,
      latest,
      hasBaseline: !!baseline,
    });
  } catch (error) {
    console.error("Assessment fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}
