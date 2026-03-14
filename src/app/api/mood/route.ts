import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get("days") || "48");

  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await db.moodLog.findMany({
    where: { userId: user.id, logDate: { gte: since } },
    orderBy: { logDate: "desc" },
  });

  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { moodScore, energy, stress, sleepQuality, notes } = await request.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await db.moodLog.upsert({
    where: { userId_logDate: { userId: user.id, logDate: today } },
    update: { moodScore, energy, stress, sleepQuality, notes },
    create: { userId: user.id, logDate: today, moodScore, energy, stress, sleepQuality, notes },
  });

  return NextResponse.json(log);
}
