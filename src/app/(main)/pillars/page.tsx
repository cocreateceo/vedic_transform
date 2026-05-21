"use client";

// Pillars index — soft prioritization by lifecycle phase.
//
// Three visual tiers, all interactive:
//   1. Active today       — the user's chosen focus pillars
//   2. Recommended phase  — pillars surfaced by the current 48-day phase
//   3. Quietly present    — everything else, grouped by Body/Mind/Spirit
//
// Nothing is locked. Tier styling communicates emphasis without dictating
// what the user can do. Designed around the "all 11 visible, 3 active, 2
// recommended, rest quiet" principle.

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PILLARS, type Pillar } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Check, Play, PenLine, BookOpen, Sparkles } from "lucide-react";
import {
  practiceRouteForPillar,
  practiceTypeForPillar,
  type PracticeType,
} from "@/lib/practice-routes";
import {
  computePillarTiers,
  type PillarTier,
} from "@/lib/pillar-prioritization";

const PRACTICE_LABEL: Record<
  PracticeType,
  { icon: typeof Play; text: string; tone: string }
> = {
  timer: {
    icon: Play,
    text: "Timer",
    tone: "bg-orange-100 text-orange-700",
  },
  journal: {
    icon: PenLine,
    text: "Journal",
    tone: "bg-emerald-100 text-emerald-700",
  },
  detail: {
    icon: BookOpen,
    text: "Mark done",
    tone: "bg-gray-100 text-gray-600",
  },
};

const ALL_PILLAR_SLUGS = PILLARS.map((p) => p.slug);

export default function PillarsPage() {
  const [completedPillars, setCompletedPillars] = useState<string[]>([]);
  const [focusPillarSlugs, setFocusPillarSlugs] = useState<string[]>([]);
  const [journeyDay, setJourneyDay] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/data/checkin"),
      apiFetch("/data/focus-pillars"),
      apiFetch("/data/journey"),
    ])
      .then(([checkin, focus, journey]) => {
        setCompletedPillars(checkin?.completedPillars || []);

        const slugs: string[] = (focus?.focusPillars ?? [])
          .slice()
          .sort(
            (a: { priority?: number }, b: { priority?: number }) =>
              (a.priority ?? 99) - (b.priority ?? 99),
          )
          .map((fp: { pillarId: string | number }) => {
            const idNum = Number(fp.pillarId);
            return PILLARS.find((p) => p.id === idNum)?.slug;
          })
          .filter((s: string | undefined): s is string => Boolean(s));
        setFocusPillarSlugs(slugs);

        const j = journey?.journey;
        if (j?.startDate) {
          const day = Math.min(
            Math.floor(
              (Date.now() - new Date(j.startDate).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1,
            48,
          );
          setJourneyDay(day);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tiers = computePillarTiers({
    allPillarSlugs: ALL_PILLAR_SLUGS,
    focusPillarSlugs,
    journeyDay,
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const activePillars = focusPillarSlugs
    .map((slug) => PILLARS.find((p) => p.slug === slug))
    .filter((p): p is Pillar => Boolean(p));
  const recommendedPillars = PILLARS.filter((p) => tiers.recommended.has(p.slug));
  const quietPillars = PILLARS.filter((p) => tiers.quiet.has(p.slug));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            11 Transformation Pillars
          </h1>
          <p className="text-gray-600 mt-2">
            All practices are always available. Today&apos;s emphasis follows your
            phase.
          </p>
        </div>
        {journeyDay > 0 && tiers.phase.id !== "completed" && (
          <span
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border",
              tiers.phase.tone,
            )}
            title={tiers.phase.description}
          >
            Phase {tiers.phase.ordinal} · {tiers.phase.name} · Day {journeyDay} of 48
          </span>
        )}
      </div>

      {/* Today's progress */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Today&apos;s Progress</h3>
              <p className="text-sm text-gray-500">
                {completedPillars.length} of {PILLARS.length} pillars completed
              </p>
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {Math.round((completedPillars.length / PILLARS.length) * 100)}%
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{
                width: `${(completedPillars.length / PILLARS.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tier 1 — Active today (focus pillars) */}
      {activePillars.length > 0 && (
        <TierSection
          eyebrow="Active today"
          title="Your focus pillars"
          subtitle="The 1–3 pillars you committed to for this journey."
          accent="active"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                tier="active"
                isCompleted={completedPillars.includes(pillar.slug)}
              />
            ))}
          </div>
        </TierSection>
      )}

      {/* Tier 2 — Recommended this phase */}
      {recommendedPillars.length > 0 && (
        <TierSection
          eyebrow={`Recommended for ${tiers.phase.name}`}
          title="Phase suggestions"
          subtitle={tiers.phase.description}
          accent="recommended"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                tier="recommended"
                isCompleted={completedPillars.includes(pillar.slug)}
              />
            ))}
          </div>
        </TierSection>
      )}

      {/* Tier 3 — Quietly present */}
      {quietPillars.length > 0 && (
        <TierSection
          eyebrow="Quietly present"
          title="The rest of the mandala"
          subtitle="Always available — explore when ready."
          accent="quiet"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quietPillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                tier="quiet"
                isCompleted={completedPillars.includes(pillar.slug)}
              />
            ))}
          </div>
        </TierSection>
      )}
    </div>
  );
}

function TierSection({
  eyebrow,
  title,
  subtitle,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: PillarTier;
  children: React.ReactNode;
}) {
  const accentColor =
    accent === "active"
      ? "text-amber-700"
      : accent === "recommended"
        ? "text-indigo-700"
        : "text-gray-500";
  const accentIcon =
    accent === "active" ? (
      <Sparkles className={cn("w-3.5 h-3.5", accentColor)} />
    ) : null;
  return (
    <section>
      <div className="mb-4">
        <div className={cn("flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider", accentColor)}>
          {accentIcon}
          {eyebrow}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mt-1">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function PillarCard({
  pillar,
  tier,
  isCompleted,
}: {
  pillar: Pillar;
  tier: PillarTier;
  isCompleted: boolean;
}) {
  const Icon = pillar.icon;
  const label = PRACTICE_LABEL[practiceTypeForPillar(pillar.slug)];
  const LabelIcon = label.icon;

  // Tier-driven visual emphasis.
  //   Active      = amber ring + shadow (prominent).
  //   Recommended = normal weight + hover lift.
  //   Quiet       = lighter border + no shadow until hover. NOT opacity,
  //                 because reduced opacity reads as "disabled" — every
  //                 pillar is fully tappable, just visually de-emphasized.
  const tierClasses =
    tier === "active"
      ? "ring-2 ring-amber-300 shadow-md hover:shadow-lg"
      : tier === "recommended"
        ? "hover:shadow-lg"
        : "border-gray-100 hover:shadow-md hover:border-gray-200";

  return (
    <Link href={practiceRouteForPillar(pillar.slug)}>
      <Card
        className={cn(
          "transition-all cursor-pointer h-full",
          tierClasses,
          isCompleted && "ring-2 ring-green-500 bg-green-50",
        )}
      >
        <CardContent className="p-5 relative">
          {isCompleted && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
              pillar.bgColor,
            )}
          >
            <Icon className="w-6 h-6" style={{ color: pillar.color }} />
          </div>
          <h3 className="font-semibold text-gray-900">{pillar.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{pillar.sanskritName}</p>
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
            {pillar.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                label.tone,
              )}
            >
              <LabelIcon className="w-3 h-3" />
              {label.text}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600 font-medium">
                +{pillar.karmaPointsBase}
              </span>
              {pillar.defaultDurationMinutes > 0 && (
                <span className="text-xs text-gray-400">
                  {pillar.defaultDurationMinutes}m
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

