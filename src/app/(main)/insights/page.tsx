import { db } from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth";
import { InsightsPageClient } from "./insights-client";

export default async function InsightsPage() {
  const user = await requireAuth();
  const userId = user.id;

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

  // Parse JSON data field and format for client
  const formattedInsights = insights.map((i) => ({
    id: i.id,
    type: i.insightType as "pattern" | "strength" | "weakness" | "recommendation" | "milestone",
    category: i.category || undefined,
    title: i.title,
    description: i.description,
    data: i.data ? JSON.parse(i.data) : undefined,
    isNew: !i.isRead,
    createdAt: i.createdAt,
  }));

  return (
    <InsightsPageClient
      initialInsights={formattedInsights}
      unreadCount={insights.filter((i) => !i.isRead).length}
    />
  );
}
