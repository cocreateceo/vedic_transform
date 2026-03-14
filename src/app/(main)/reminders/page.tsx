import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { RemindersPageClient } from "./reminders-client";

export default async function RemindersPage() {
  const user = await requireAuth();
  const userId = user.id;

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

  return (
    <RemindersPageClient
      initialSettings={{
        morningEnabled: settings.morningEnabled,
        morningTime: settings.morningTime,
        eveningEnabled: settings.eveningEnabled,
        eveningTime: settings.eveningTime,
        sandhyaEnabled: settings.sandhyaEnabled,
        sandhyaMorningTime: settings.sandhyaMorningTime,
        sandhyaNoonTime: settings.sandhyaNoonTime,
        sandhyaEveningTime: settings.sandhyaEveningTime,
        streakWarningEnabled: settings.streakWarningEnabled,
        streakWarningTime: settings.streakWarningTime,
        dailyDigestEnabled: settings.dailyDigestEnabled,
        weeklyDigestEnabled: settings.weeklyDigestEnabled,
        weeklyDigestDay: settings.weeklyDigestDay,
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        timezone: settings.timezone,
      }}
    />
  );
}
