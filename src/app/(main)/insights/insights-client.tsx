"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { InsightsFeed } from "@/components/features/insights";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { InsightGlyph } from "@/components/features/daily/page-glyphs";

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

// Insights are computed live on the server, so dismissals + "seen" state
// have to live somewhere on the client. localStorage is the simplest fit —
// cross-device sync is a polish item, not a launch blocker.
const SEEN_KEY = "vedic-insights-seen";
const DISMISS_KEY = "vedic-insights-dismissed";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function readDismissed(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeDismissed(map: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISS_KEY, JSON.stringify(map));
  } catch {}
}

function readSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function writeSeen(seen: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)));
  } catch {}
}

function filterVisible(all: Insight[]): Insight[] {
  const dismissed = readDismissed();
  const now = Date.now();
  return all.filter((i) => {
    const ts = dismissed[i.id];
    if (!ts) return true;
    // Dismissal expires after the TTL so seasonal insights can resurface.
    return now - ts > DISMISS_TTL_MS;
  });
}

function applySeenState(all: Insight[]): Insight[] {
  const seen = readSeen();
  return all.map((i) => ({ ...i, isNew: !seen.has(i.id) }));
}

export function InsightsPageClient({
  initialInsights,
  unreadCount: _unreadCount,
}: InsightsPageClientProps) {
  const [insights, setInsights] = useState<Insight[]>(() =>
    filterVisible(applySeenState(initialInsights)),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mark all currently-visible insight IDs as "seen" on mount so the next
  // visit shows them without the "new" badge.
  useEffect(() => {
    const seen = readSeen();
    let changed = false;
    for (const i of insights) {
      if (!seen.has(i.id)) {
        seen.add(i.id);
        changed = true;
      }
    }
    if (changed) writeSeen(seen);
    // Run once per render of the component instance; intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiFetch("/data/insights");
      const fresh: Insight[] = (data?.insights || []).map((i: any) => ({
        id: i.id,
        type: i.insightType,
        category: i.category || undefined,
        title: i.title,
        description: i.description,
        data: i.data
          ? typeof i.data === "string"
            ? JSON.parse(i.data)
            : i.data
          : undefined,
        isNew: false,
        createdAt: i.createdAt,
      }));
      setInsights(filterVisible(applySeenState(fresh)));
    } catch (error) {
      console.error("Failed to refresh insights:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismiss = (id: string) => {
    const dismissed = readDismissed();
    dismissed[id] = Date.now();
    writeDismissed(dismissed);
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  const handleMarkAllRead = () => {
    const seen = readSeen();
    for (const i of insights) seen.add(i.id);
    writeSeen(seen);
    setInsights((prev) => prev.map((i) => ({ ...i, isNew: false })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <InsightGlyph />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Insights</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Personalized recommendations based on your journey
            </p>
          </div>
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

      <InsightsFeed
        insights={insights}
        onDismiss={handleDismiss}
        onMarkAllRead={handleMarkAllRead}
        showFilters={true}
      />
    </div>
  );
}
