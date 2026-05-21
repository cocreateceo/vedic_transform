"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { GreetingPlayButton } from "@/components/features/dashboard/greeting-play-button";
import { StreakCounter } from "@/components/features/dashboard/streak-counter";
import { KarmaPoints } from "@/components/features/dashboard/karma-points";
import { PillarGrid } from "@/components/features/dashboard/pillar-grid";
import { TodaysPractice } from "@/components/features/dashboard/todays-practice";
import { StreakEventBanner } from "@/components/features/dashboard/streak-event-banner";
import { DailyBriefCard } from "@/components/features/dashboard/daily-brief-card";
import { MandalaProgress } from "@/components/features/dashboard/mandala-progress";
import { ReflectionCard } from "@/components/features/dashboard/reflection-card";
import { PILLARS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sunrise, Leaf, Headphones, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DailyWisdomPopup } from "@/components/features/dashboard/daily-wisdom-popup";
import { getJourneyPhase } from "@/lib/journey-phases";
import { cn } from "@/lib/utils/cn";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [journey, setJourney] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [completedPillars, setCompletedPillars] = useState<string[]>([]);
  const [focusPillarSlugs, setFocusPillarSlugs] = useState<string[]>([]);
  const [totalKarma, setTotalKarma] = useState(0);
  const [todayEarned, setTodayEarned] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [allCheckins, setAllCheckins] = useState<unknown[]>([]);
  const [moodLogs, setMoodLogs] = useState<unknown[]>([]);
  const [isStreakAtRisk, setIsStreakAtRisk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [journeyData, checkinData, karmaData, focusData, allCheckinsData, moodData] =
          await Promise.all([
            apiFetch("/data/journey"),
            apiFetch("/data/checkin"),
            apiFetch("/data/reports"),
            apiFetch("/data/focus-pillars"),
            // Full check-in history powers the mandala ring + reflection
            // card (one lit segment per day of practice).
            apiFetch("/data/checkin?all=true"),
            // Mood window — reflection card uses this for narrative
            // observations about mood trend across the phase.
            apiFetch("/data/mood?days=60"),
          ]);

        setAllCheckins(allCheckinsData?.checkins ?? []);
        setMoodLogs(moodData?.logs ?? moodData?.moodLogs ?? []);

        if (journeyData?.journey) {
          setJourney(journeyData.journey);

          const startMs = new Date(journeyData.journey.startDate).getTime();
          const day = Math.min(
            Math.floor((new Date().getTime() - startMs) / (1000 * 60 * 60 * 24)) + 1,
            48,
          );
          setCurrentDay(day);

          // Derive the set of day numbers (1..48) that have ANY check-in.
          // Each check-in row has a checkinDate (YYYY-MM-DD); convert that
          // to a day number relative to the journey start.
          const rows: { checkinDate?: string }[] = allCheckinsData?.checkins ?? [];
          const days = new Set<number>();
          for (const r of rows) {
            if (!r.checkinDate) continue;
            const t = new Date(r.checkinDate).getTime();
            if (!Number.isFinite(t)) continue;
            const d = Math.floor((t - startMs) / (1000 * 60 * 60 * 24)) + 1;
            if (d >= 1 && d <= 48) days.add(d);
          }
          setCompletedDays(Array.from(days).sort((a, b) => a - b));
        }

        // Streak (incl. shields) comes from /data/reports — /data/journey
        // doesn't return it.
        if (karmaData?.streak) {
          setStreak(karmaData.streak);
        }

        if (checkinData?.completedPillars) {
          setCompletedPillars(checkinData.completedPillars);
          setIsStreakAtRisk(
            checkinData.completedPillars.length === 0 && new Date().getHours() >= 12
          );
        }

        if (karmaData) {
          setTotalKarma(karmaData.totalKarma || 0);
          setTodayEarned(karmaData.todayEarned || 0);
        }

        if (focusData?.focusPillars?.length) {
          // FocusPillars store pillarId as a stringified numeric id (see
          // src/components/features/goals/focus-pillar-selector.tsx). Map back
          // to slugs sorted by user-chosen priority.
          const slugs = focusData.focusPillars
            .slice()
            .sort((a: any, b: any) => (a.priority ?? 99) - (b.priority ?? 99))
            .map((fp: any) => {
              const idNum = Number(fp.pillarId);
              return PILLARS.find((p) => p.id === idNum)?.slug;
            })
            .filter((s: string | undefined): s is string => Boolean(s));
          setFocusPillarSlugs(slugs);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleStartJourney = async () => {
    setStarting(true);
    try {
      await apiFetch("/data/journey", {
        method: "POST",
        body: JSON.stringify({ action: "start" }),
      });
      router.refresh();
      window.location.reload();
    } catch {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="vedic-card p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse h-32 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vedic-card p-6 animate-pulse h-40 rounded-2xl bg-gray-100" />
          <div className="vedic-card p-6 animate-pulse h-40 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25">
              <Sunrise className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Begin Your Transformation
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your 48-day Vedic journey to transform your body, mind, and
              spirit. Commit to 30 minutes for your mind and 30 minutes for your
              body each day.
            </p>
            <Button
              size="lg"
              onClick={handleStartJourney}
              isLoading={starting}
            >
              Start My 48-Day Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DailyWisdomPopup />
      {/* Welcome banner — left: phase + day narrative; right: mandala ring */}
      {(() => {
        const phase = getJourneyPhase(currentDay);
        const hour = new Date().getHours();
        const greet =
          hour < 5 ? "Pre-dawn blessings"
          : hour < 12 ? "Good morning"
          : hour < 17 ? "Good afternoon"
          : hour < 21 ? "Good evening"
          : "Good night";
        const firstName = user?.name?.split(/\s+/)[0];
        // Phase-tinted gradient — each phase owns a distinct elemental
        // palette. "Phase 2: Cleansing" now visually reads sky+cyan, not
        // the same amber as every other day. Phases stop being decorative.
        const gradientClasses = `bg-gradient-to-r ${phase.bannerGradient}`;
        return (
          <div className={cn("vedic-card p-6 text-white", gradientClasses)}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-amber-100 text-sm">
                  {firstName ? `${greet}, ${firstName}!` : `${greet}!`}
                </p>
                {phase.id !== "completed" && currentDay > 0 ? (
                  <>
                    <h1 className="text-2xl font-bold mt-1">
                      Phase {phase.ordinal}: {phase.name}
                    </h1>
                    <p className="text-amber-100/95 mt-1 text-sm">
                      Day {currentDay} of 48 · {phase.description}
                    </p>
                  </>
                ) : phase.id === "completed" ? (
                  <>
                    <h1 className="text-2xl font-bold mt-1">Mandala complete</h1>
                    <p className="text-amber-100 mt-2">
                      You walked all 48 days. Reflect or begin a new cycle.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mt-1">
                      Day {currentDay} of Your Journey
                    </h1>
                    <p className="text-amber-100 mt-2">
                      {48 - currentDay} days remaining in your transformation
                    </p>
                  </>
                )}
                <div className="mt-3">
                  <GreetingPlayButton />
                </div>
              </div>
              <div className={cn("shrink-0", "hidden sm:block")}>
                {/* The mandala ring — one segment per day. Replaces the
                    static calendar chip; gives the 48-day arc shape at a
                    glance. Hidden on xs so the banner doesn't crowd. */}
                <MandalaProgress
                  currentDay={currentDay}
                  completedDays={completedDays}
                  size={120}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Phase-transition reflection — fires on days 8, 15, 22, 31, 41, 49
          (with a 3-day show window each). Phase-toned card with a
          narrative summary of the phase just walked. Dismissible per phase. */}
      <ReflectionCard
        currentDay={currentDay}
        startDate={journey?.startDate}
        checkins={allCheckins}
        moodLogs={moodLogs}
      />

      {/* Daily Brief — lifecycle-aware one-liner powered by the User
          Context Pack. Sits above Today's Practice because it's the "why
          today matters" framing; Today's Practice is the "what to do". */}
      <DailyBriefCard />

      {/* Today's Practice — one canonical daily action (P0-2). */}
      <TodaysPractice
        journeyDay={currentDay}
        focusPillarSlugs={focusPillarSlugs}
        completedPillarSlugs={completedPillars}
        currentStreak={streak?.currentStreak || 0}
      />

      {/* One-shot streak event banner (shield used / shield granted) — set
          from pillar-detail-client on a successful check-in and cleared on view. */}
      <StreakEventBanner />

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCounter
          currentStreak={streak?.currentStreak || 0}
          longestStreak={streak?.longestStreak || 0}
          isAtRisk={isStreakAtRisk}
          shields={streak?.shields || 0}
          karmaBalance={totalKarma}
          onShieldsChanged={(shields, karmaBalance) => {
            setStreak((s: any) => (s ? { ...s, shields } : { shields }));
            setTotalKarma(karmaBalance);
          }}
        />
        <KarmaPoints totalKarma={totalKarma} todayEarned={todayEarned} />
      </div>

      {/* All 11 pillars — kept below the hero card for users who want the full grid. */}
      <PillarGrid completedPillars={completedPillars} />

      {/* Quick actions — driven by the user's chosen focus pillars (set in
          onboarding / Goals). Falls back to the original three when the user
          hasn't picked any yet. Always tacks Journal onto the end so the
          gratitude shortcut is reachable. */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {focusPillarSlugs.length > 0 ? "Your focus pillars" : "Quick actions"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(focusPillarSlugs.length > 0
            ? focusPillarSlugs.slice(0, 2)
            : ["morning-initiation", "breathing-meditation"]
          ).map((slug) => {
            const pillar = PILLARS.find((p) => p.slug === slug);
            if (!pillar) return null;
            const Icon = pillar.icon;
            const done = completedPillars.includes(slug);
            return (
              <Link key={slug} href={`/pillars/${slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${pillar.bgColor}`}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {pillar.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {done ? "✓ Done today" : pillar.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          <Link href="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Journal</h4>
                  <p className="text-sm text-gray-500">Record your gratitude</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Discover section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Discover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dosha-assessment">
            <Card variant="golden" className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20 group-hover:scale-105 transition-transform">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dosha Assessment</h4>
                  <p className="text-sm text-gray-500">Discover your Ayurvedic type</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/library">
            <Card variant="golden" className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Audio Meditations</h4>
                  <p className="text-sm text-gray-500">Play guided sessions in-app</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/insights">
            <Card variant="golden" className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Insights</h4>
                  <p className="text-sm text-gray-500">Personalized recommendations</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
