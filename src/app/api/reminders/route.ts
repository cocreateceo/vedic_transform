import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET - Fetch user's reminder settings
export async function GET() {
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

    // Get or create reminder settings
    let settings = await db.reminderSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Create default settings
      settings = await db.reminderSettings.create({
        data: {
          userId,
          morningEnabled: true,
          morningTime: "05:00",
          eveningEnabled: true,
          eveningTime: "21:00",
          sandhyaEnabled: false,
          sandhyaMorningTime: "06:00",
          sandhyaNoonTime: "12:00",
          sandhyaEveningTime: "18:00",
          streakWarningEnabled: true,
          streakWarningTime: "20:00",
          dailyDigestEnabled: false,
          weeklyDigestEnabled: true,
          weeklyDigestDay: "sunday",
          emailNotifications: true,
          pushNotifications: false,
          timezone: "UTC",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Reminder settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminder settings" },
      { status: 500 }
    );
  }
}

// PUT - Update reminder settings
export async function PUT(request: Request) {
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

    // Upsert settings
    const settings = await db.reminderSettings.upsert({
      where: { userId },
      update: {
        morningEnabled: data.morningEnabled,
        morningTime: data.morningTime,
        eveningEnabled: data.eveningEnabled,
        eveningTime: data.eveningTime,
        sandhyaEnabled: data.sandhyaEnabled,
        sandhyaMorningTime: data.sandhyaMorningTime,
        sandhyaNoonTime: data.sandhyaNoonTime,
        sandhyaEveningTime: data.sandhyaEveningTime,
        streakWarningEnabled: data.streakWarningEnabled,
        streakWarningTime: data.streakWarningTime,
        dailyDigestEnabled: data.dailyDigestEnabled,
        weeklyDigestEnabled: data.weeklyDigestEnabled,
        weeklyDigestDay: data.weeklyDigestDay,
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        timezone: data.timezone || "UTC",
      },
      create: {
        userId,
        morningEnabled: data.morningEnabled ?? true,
        morningTime: data.morningTime ?? "05:00",
        eveningEnabled: data.eveningEnabled ?? true,
        eveningTime: data.eveningTime ?? "21:00",
        sandhyaEnabled: data.sandhyaEnabled ?? false,
        sandhyaMorningTime: data.sandhyaMorningTime ?? "06:00",
        sandhyaNoonTime: data.sandhyaNoonTime ?? "12:00",
        sandhyaEveningTime: data.sandhyaEveningTime ?? "18:00",
        streakWarningEnabled: data.streakWarningEnabled ?? true,
        streakWarningTime: data.streakWarningTime ?? "20:00",
        dailyDigestEnabled: data.dailyDigestEnabled ?? false,
        weeklyDigestEnabled: data.weeklyDigestEnabled ?? true,
        weeklyDigestDay: data.weeklyDigestDay ?? "sunday",
        emailNotifications: data.emailNotifications ?? true,
        pushNotifications: data.pushNotifications ?? false,
        timezone: data.timezone ?? "UTC",
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Reminder settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update reminder settings" },
      { status: 500 }
    );
  }
}
