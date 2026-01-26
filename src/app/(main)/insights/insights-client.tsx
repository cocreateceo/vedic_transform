"use client";

import { useState } from "react";
import { InsightsFeed } from "@/components/features/insights";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Insight {
  id: string;
  type: "pattern" | "strength" | "weakness" | "recommendation" | "milestone";
  category?: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  isNew: boolean;
  createdAt: Date;
}

interface InsightsPageClientProps {
  initialInsights: Insight[];
  unreadCount: number;
}

export function InsightsPageClient({
  initialInsights,
  unreadCount: initialUnreadCount,
}: InsightsPageClientProps) {
  const [insights, setInsights] = useState(initialInsights);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Generate new insights
      await fetch("/api/insights", { method: "POST" });

      // Fetch updated insights
      const res = await fetch("/api/insights?refresh=false");
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
      }
    } catch (error) {
      console.error("Failed to refresh insights:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await fetch("/api/insights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insightId: id, dismiss: true }),
      });
      setInsights((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to dismiss insight:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/insights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setInsights((prev) => prev.map((i) => ({ ...i, isNew: false })));
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Insights</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Personalized recommendations based on your journey
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Analyzing..." : "Refresh"}
        </Button>
      </div>

      {/* Insights Feed */}
      <InsightsFeed
        insights={insights}
        onDismiss={handleDismiss}
        onMarkAllRead={handleMarkAllRead}
        showFilters={true}
      />
    </div>
  );
}
