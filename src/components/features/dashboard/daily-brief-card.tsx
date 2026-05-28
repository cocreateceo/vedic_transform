"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getJourneyPhase, isPhaseTransitionDay } from "@/lib/journey-phases";
import { POSTERS, getPostersByPillar } from "@/data/posters";

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

  // Poster-of-the-day — pick the first poster tagged to one of the current
  // phase's recommended pillars. Falls back to any poster if no match.
  // The bigger phase-transition celebration on day-1-of-phase happens
  // below via the dedicated banner.
  const posterOfTheDay = useMemo(() => {
    if (!phase) return null;
    for (const slug of phase.recommendedPillars || []) {
      const found = getPostersByPillar(slug)[0];
      if (found) return found;
    }
    return POSTERS[0] ?? null;
  }, [phase]);

  const isTransitionDay = contextPack?.journey?.day
    ? isPhaseTransitionDay(contextPack.journey.day)
    : false;

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

            {/* Phase-transition celebration — on the first day of a new phase
                we replace the small poster strip with a bigger anchor card
                so the threshold actually feels like one. */}
            {isTransitionDay && phase && posterOfTheDay && (
              <Link
                href={`/posters?open=${posterOfTheDay.slug}`}
                className="group mt-4 flex items-stretch gap-3 rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-3 hover:ring-2 hover:ring-amber-400 transition"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/60">
                  <Image
                    src={posterOfTheDay.image.thumb}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Welcome to Phase {phase.ordinal} · {phase.name}
                  </p>
                  <h4 className="text-sm font-bold text-amber-900 line-clamp-2 mt-0.5">
                    {posterOfTheDay.title}
                  </h4>
                  <p className="text-xs text-amber-800/80 mt-0.5 line-clamp-2">
                    {phase.description}
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-0.5">
                    Open teaching
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            )}

            {/* Poster-of-the-day — on regular days, render a small strip
                under the brief pointing at one phase-relevant poster. */}
            {!isTransitionDay && posterOfTheDay && (
              <Link
                href={`/posters?open=${posterOfTheDay.slug}`}
                className="group mt-4 flex items-center gap-3 rounded-lg border border-indigo-100 bg-white/60 p-2 hover:bg-white/90 transition"
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                  <Image
                    src={posterOfTheDay.image.thumb}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-indigo-600 font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Today's teaching
                  </p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {posterOfTheDay.title}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
