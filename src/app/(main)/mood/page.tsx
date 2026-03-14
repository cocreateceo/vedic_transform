import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MoodPageClient } from "./mood-client";

export default async function MoodPage() {
  const user = await requireAuth();

  const recentLogs = await db.moodLog.findMany({
    where: { userId: user.id },
    orderBy: { logDate: "desc" },
    take: 48,
  });

  return <MoodPageClient initialLogs={recentLogs} />;
}
