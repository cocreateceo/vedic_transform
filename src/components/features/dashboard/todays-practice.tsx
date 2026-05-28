"use client";

import Link from "next/link";
import { PILLARS, getPillarBySlug, TOTAL_JOURNEY_DAYS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Trophy,
  BookOpen,
  Heart,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { practiceRouteForPillar } from "@/lib/practice-routes";
import { getJourneyPhase } from "@/lib/journey-phases";

interface TodaysPracticeProps {
  journeyDay: number;
  focusPillarSlugs: string[];
  completedPillarSlugs: string[];
  currentStreak: number;
}

const ALL_PILLAR_SLUGS = PILLARS.map((p) => p.slug);

// Deterministic — same journeyDay always returns the same pillar for the
// same focus pool. Spec §3 in docs/superpowers/specs/2026-05-09-p0-bundle-design.md.
function getPillarOfDay(journeyDay: number, focusPillarSlugs: string[]): string {
  const pool = focusPillarSlugs.length > 0 ? focusPillarSlugs : ALL_PILLAR_SLUGS;
  const index = ((journeyDay - 1) % pool.length + pool.length) % pool.length;
  return pool[index];
}

export function TodaysPractice({
  journeyDay,
  focusPillarSlugs,
  completedPillarSlugs,
  currentStreak,
}: TodaysPracticeProps) {
  // Post-completion state — Day 49+. Spec §3 edge case.
  if (journeyDay > TOTAL_JOURNEY_DAYS) {
    return <JourneyCompleteCard />;
  }

  const allCompletedToday = completedPillarSlugs.length >= PILLARS.length;
  if (allCompletedToday) {
    return <MasterDayCard journeyDay={journeyDay} />;
  }

  // Gentler-but-still-celebratory state: the user completed every focus
  // pillar they committed to (the common 1–3 daily target), but not all 11.
  // This is the moment that needed an emotional climax and didn't have one.
  const focusDoneTodayCount = focusPillarSlugs.filter((s) =>
    completedPillarSlugs.includes(s),
  ).length;
  const allFocusDone =
    focusPillarSlugs.length > 0 &&
    focusDoneTodayCount >= focusPillarSlugs.length;
  if (allFocusDone) {
    return (
      <FocusCompleteCard
        journeyDay={journeyDay}
        focusCount={focusPillarSlugs.length}
        currentStreak={currentStreak}
      />
    );
  }

  const pillarSlug = getPillarOfDay(journeyDay, focusPillarSlugs);
  const pillar = getPillarBySlug(pillarSlug);

  if (!pillar) {
    // Defensive — focus slugs could include a renamed pillar after a deploy.
    return null;
  }

  const isCompleted = completedPillarSlugs.includes(pillar.slug);

  if (isCompleted) {
    return (
      <CompletedPracticeCard
        pillarName={pillar.name}
        sanskritName={pillar.sanskritName}
        karma={pillar.karmaPointsBase}
        journeyDay={journeyDay}
        currentStreak={currentStreak}
      />
    );
  }

  return (
    <PendingPracticeCard
      pillarSlug={pillar.slug}
      pillarName={pillar.name}
      sanskritName={pillar.sanskritName}
      description={pillar.description}
      color={pillar.color}
      bgColor={pillar.bgColor}
      icon={pillar.icon}
      karma={pillar.karmaPointsBase}
      durationMinutes={pillar.defaultDurationMinutes}
      journeyDay={journeyDay}
      currentStreak={currentStreak}
      showShortFallback={pillar.defaultDurationMinutes >= 10 && pillar.slug !== "breathing-meditation"}
    />
  );
}

// ─── Pending state ──────────────────────────────────────────────────────────

function PendingPracticeCard({
  pillarSlug,
  pillarName,
  sanskritName,
  description,
  color,
  bgColor,
  icon: Icon,
  karma,
  durationMinutes,
  journeyDay,
  currentStreak,
  showShortFallback,
}: {
  pillarSlug: string;
  pillarName: string;
  sanskritName: string;
  description: string;
  color: string;
  bgColor: string;
  icon: typeof Sparkles;
  karma: number;
  durationMinutes: number;
  journeyDay: number;
  currentStreak: number;
  showShortFallback: boolean;
}) {
  const sessionDurationText =
    durationMinutes > 0 ? `Begin ${durationMinutes}-min session` : "Begin practice";

  return (
    <Card variant="elevated" className="overflow-hidden border-amber-200 !p-0">
      <CardContent>
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-amber-700">
            Day {journeyDay} of {TOTAL_JOURNEY_DAYS}
          </div>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-orange-700">
              <Flame className="w-4 h-4" />
              {currentStreak}-day streak
            </div>
          )}
        </div>

        <div className="px-6 pt-3 pb-6">
          <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold">
            Today&apos;s Practice
          </p>

          <div className="mt-3 flex items-start gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                bgColor,
              )}
            >
              <Icon className="w-7 h-7" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{pillarName}</h2>
              <p className="text-sm text-amber-600 mt-0.5">{sanskritName}</p>
              <p className="text-sm text-gray-600 mt-2">{description}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link href={practiceRouteForPillar(pillarSlug)} className="flex-1">
              <Button size="lg" className="w-full">
                {sessionDurationText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
              <Sparkles className="w-4 h-4" />
              +{karma} karma
            </div>
          </div>

          {showShortFallback && (
            <div className="mt-3 text-center">
              <Link
                href={practiceRouteForPillar("breathing-meditation")}
                className="text-xs text-gray-500 hover:text-amber-600 inline-flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Too busy? Try the 3-minute breath instead
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Completed state ────────────────────────────────────────────────────────

function CompletedPracticeCard({
  pillarName,
  sanskritName,
  karma,
  journeyDay,
  currentStreak,
}: {
  pillarName: string;
  sanskritName: string;
  karma: number;
  journeyDay: number;
  currentStreak: number;
}) {
  return (
    <Card variant="elevated" className="overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-emerald-700">
            Day {journeyDay} of {TOTAL_JOURNEY_DAYS}
          </div>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-orange-700">
              <Flame className="w-4 h-4" />
              {currentStreak}-day streak
            </div>
          )}
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-green-900">
              Today&apos;s practice complete
            </h2>
            <p className="text-sm text-green-700 mt-1">
              {pillarName} <span className="text-emerald-600">· {sanskritName}</span>
            </p>
            <p className="text-sm text-emerald-700 mt-1 font-medium">
              +{karma} karma earned
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Keep building today:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Link
              href="/journal"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 hover:border-green-300 transition-colors text-sm text-gray-700"
            >
              <BookOpen className="w-4 h-4 text-green-600" />
              Journal entry
            </Link>
            <Link
              href="/mood"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 hover:border-green-300 transition-colors text-sm text-gray-700"
            >
              <Heart className="w-4 h-4 text-pink-500" />
              Log your mood
            </Link>
            <Link
              href="/pillars"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 hover:border-green-300 transition-colors text-sm text-gray-700"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              More pillars
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Focus-complete state (all focus pillars done today) ───────────────────
//
// Sits between "1 pillar done" and "all 11 done" — the common climactic
// moment the daily ritual was missing. Pulls phase copy so the line reads
// "Phase 2: Cleansing — breath cleared" instead of generic praise.

function FocusCompleteCard({
  journeyDay,
  focusCount,
  currentStreak,
}: {
  journeyDay: number;
  focusCount: number;
  currentStreak: number;
}) {
  const phase = getJourneyPhase(journeyDay);
  const phraseText = phase.completionPhrase;

  return (
    <Card
      variant="elevated"
      className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50"
    >
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
          {/* Lotus motif — sacred reward without being loud. */}
          <span className="text-2xl" aria-hidden>🪷</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          {phase.id === "completed"
            ? "Journey complete"
            : `Phase ${phase.ordinal} · ${phase.name}`}
        </p>
        <h2 className="text-xl font-bold text-amber-900 mt-1">
          Today&apos;s mandala is complete.
        </h2>
        <p className="text-sm text-amber-800/90 mt-2 max-w-md mx-auto">
          You honored all {focusCount} focus practice{focusCount === 1 ? "" : "s"}.
          {" "}{phraseText}
        </p>

        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-amber-700">
          {currentStreak > 0 && (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Flame className="w-4 h-4" />
              {currentStreak}-day streak
            </span>
          )}
          <span className="text-amber-600">Day {journeyDay} of {TOTAL_JOURNEY_DAYS}</span>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/journal">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Capture a reflection
            </Button>
          </Link>
          <Link href="/pillars">
            <Button variant="ghost" size="sm">
              Explore another pillar
            </Button>
          </Link>
        </div>

        <p className="text-xs text-amber-700/80 mt-4">
          See you tomorrow at sunrise.
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Master-day state (all 11 done) ─────────────────────────────────────────

function MasterDayCard({ journeyDay }: { journeyDay: number }) {
  return (
    <Card variant="elevated" className="overflow-hidden border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-amber-900">Master Day</h2>
        <p className="text-sm text-amber-700 mt-1">
          Day {journeyDay} — all 11 pillars complete
        </p>
        <p className="text-sm text-amber-700/80 mt-2 max-w-md mx-auto">
          You honored every dimension of the practice today. Rest in this, then return
          tomorrow.
        </p>
        <div className="mt-4">
          <Link href="/journal">
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Capture today&apos;s reflection
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Journey-complete state (Day 49+) ───────────────────────────────────────

function JourneyCompleteCard() {
  return (
    <Card variant="elevated" className="overflow-hidden border-purple-200 bg-gradient-to-br from-violet-50 to-purple-50">
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-purple-900">Journey Complete</h2>
        <p className="text-sm text-purple-700 mt-2 max-w-md mx-auto">
          You walked the 48-day path. Review what shifted, then begin a new cycle when
          you&apos;re ready.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/reports">
            <Button variant="outline">View your journey report</Button>
          </Link>
          <Link href="/achievements">
            <Button>See achievements</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
