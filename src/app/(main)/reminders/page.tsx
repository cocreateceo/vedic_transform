"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { RemindersPageClient } from "./reminders-client";

const DEFAULT_SETTINGS = {
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
};

export default function RemindersPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/data/reminders")
      .then((res) => {
        setSettings(res?.settings || DEFAULT_SETTINGS);
      })
      .catch(() => {
        setSettings(DEFAULT_SETTINGS);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return <RemindersPageClient initialSettings={settings} />;
}
