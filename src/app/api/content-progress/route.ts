import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const progress = await db.contentProgress.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contentId, completed, progress } = await request.json();

  const result = await db.contentProgress.upsert({
    where: {
      userId_contentId: { userId: user.id, contentId },
    },
    update: { completed, progress, lastAccessedAt: new Date() },
    create: { userId: user.id, contentId, completed: completed || false, progress: progress || 0 },
  });

  return NextResponse.json(result);
}
