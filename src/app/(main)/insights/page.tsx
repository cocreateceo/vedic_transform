"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { InsightsPageClient } from "./insights-client";

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/data/insights")
      .then((res) => {
        const insights = res?.insights || [];
        const formattedInsights = insights.map((i: any) => ({
          id: i.id,
          type: i.insightType as "pattern" | "strength" | "weakness" | "recommendation" | "milestone",
          category: i.category || undefined,
          title: i.title,
          description: i.description,
          data: i.data ? (typeof i.data === "string" ? JSON.parse(i.data) : i.data) : undefined,
          isNew: !i.isRead,
          createdAt: i.createdAt,
        }));
        setData({
          insights: formattedInsights,
          unreadCount: insights.filter((i: any) => !i.isRead).length,
        });
      })
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
    <InsightsPageClient
      initialInsights={data.insights}
      unreadCount={data.unreadCount}
    />
  );
}
