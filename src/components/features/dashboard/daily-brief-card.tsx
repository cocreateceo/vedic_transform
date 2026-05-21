"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getJourneyPhase } from "@/lib/journey-phases";

type DailyBrief = {
  greeting: string;
  headline: string;
  body: string;
  cta?: { label: string; href: string };
  source: "template" | "ai";
  generatedAt: string;
};

interface ContextPackLite {
  journey?: { day?: number };
}

export function DailyBriefCard() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [contextPack, setContextPack] = useState<ContextPackLite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    apiFetch("/data/daily-brief")
      .then((res) => {
        if (!alive) return;
        setBrief(res?.brief ?? null);
        setContextPack(res?.contextPack ?? null);
      })
      .catch(() => {
        // Brief is an enhancement, not a requirement — fail silent so a 5xx
        // here can never block the rest of the dashboard from rendering.
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const phase = contextPack?.journey?.day
    ? getJourneyPhase(contextPack.journey.day)
    : null;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-indigo-200/70 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-indigo-200/70 rounded" />
              <div className="h-4 w-3/4 bg-indigo-200/70 rounded" />
              <div className="h-3 w-full bg-indigo-200/50 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!brief) return null;

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-medium text-indigo-700/80">
                {brief.greeting}
              </p>
              {phase && phase.id !== "completed" && (
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                    phase.tone,
                  )}
                  title={phase.description}
                >
                  Phase {phase.ordinal} · {phase.name}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mt-1">
              {brief.headline}
            </h3>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {brief.body}
            </p>
            {brief.cta && (
              <div className="mt-3">
                <Link href={brief.cta.href}>
                  <Button size="sm" variant="outline" className="gap-1">
                    {brief.cta.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
