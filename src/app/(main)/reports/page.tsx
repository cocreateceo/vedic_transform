"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { ReportsPageClient } from "./reports-client";

export default function ReportsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/data/reports")
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <ReportsPageClient
      hasJourney={!!data.journey}
      currentDay={data.currentDay || 0}
      currentWeek={data.currentWeek || 1}
      stats={{
        totalCheckins: data.totalCheckins || 0,
        totalKarma: data.totalKarma || 0,
        currentStreak: data.streak?.currentStreak || 0,
        badgesEarned: data.badgesEarned || 0,
        completionRate: data.completionRate || 0,
      }}
      journeyStartDate={data.journeyStartDate || new Date().toISOString()}
      userName={user?.name || "Journey Traveler"}
    />
  );
}
