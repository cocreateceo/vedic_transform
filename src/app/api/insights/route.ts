import { NextResponse } from "next/server";
import { db } from "@/lib/dynamodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateUserInsights, saveInsights } from "@/lib/insights/generator";

// GET - Fetch user's insights
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
    const refresh = searchParams.get("refresh") === "true";

    // If refresh requested, generate new insights
    if (refresh) {
      const newInsights = await generateUserInsights(userId);
      await saveInsights(userId, newInsights);
    }

    // Fetch active insights
    const insights = await db.userInsight.findMany({
      where: {
        userId,
        isDismissed: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: [
        { isRead: "asc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Parse JSON data field
    const formattedInsights = insights.map((i) => ({
      ...i,
      data: i.data ? JSON.parse(i.data) : null,
      isNew: !i.isRead,
    }));

    return NextResponse.json({
      insights: formattedInsights,
      unreadCount: insights.filter((i) => !i.isRead).length,
    });
  } catch (error) {
    console.error("Insights fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}

// POST - Generate new insights
export async function POST() {
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

    // Generate and save insights
    const newInsights = await generateUserInsights(userId);
    const saved = await saveInsights(userId, newInsights);

    return NextResponse.json({
      success: true,
      generated: newInsights.length,
      saved: saved.length,
    });
  } catch (error) {
    console.error("Insights generation error:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}

// PATCH - Mark insights as read/dismissed
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

    if (data.markAllRead) {
      // Mark all as read
      await db.userInsight.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, action: "markAllRead" });
    }

    if (data.insightId) {
      // Verify ownership
      const insight = await db.userInsight.findFirst({
        where: { id: data.insightId, userId },
      });

      if (!insight) {
        return NextResponse.json({ error: "Insight not found" }, { status: 404 });
      }

      const updateData: { isRead?: boolean; isDismissed?: boolean } = {};

      if (data.markRead) {
        updateData.isRead = true;
      }

      if (data.dismiss) {
        updateData.isDismissed = true;
      }

      await db.userInsight.update({
        where: { id: data.insightId },
        data: updateData,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Insight update error:", error);
    return NextResponse.json({ error: "Failed to update insight" }, { status: 500 });
  }
}
