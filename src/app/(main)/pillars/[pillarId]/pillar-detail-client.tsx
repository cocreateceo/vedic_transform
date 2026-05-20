"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getPillarBySlug, PILLARS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathingVisualizer } from "@/components/features/pillars/breathing-visualizer";
import { PillarHero, PillarHeroStyles } from "@/components/features/pillars/pillar-hero";
import { PillarContentPanel } from "@/components/features/pillars/pillar-content-panel";
import { Check, ArrowLeft, Clock, Sparkles, Download, FileText, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { setStreakEvent, type StreakEventType } from "@/lib/streak-events";
import { getPostersByPillar } from "@/data/posters";
import { PosterSection } from "@/components/features/posters/poster-section";

export function PillarDetailClient({ pillarId }: { pillarId: string }) {
  const pillar = getPillarBySlug(pillarId);
  const pillarPosters = getPostersByPillar(pillarId);
  const router = useRouter();

  const [isCompleted, setIsCompleted] = useState(false);
  const [hasJourney, setHasJourney] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [startingJourney, setStartingJourney] = useState(false);

  // Lifted state for pillar-specific interactive content. These live here so
  // handleComplete can persist them before recording the check-in.
  const [gratitudeEntries, setGratitudeEntries] = useState<[string, string, string]>(["", "", ""]);

  const morningKey = useMemo(
    () => `morning-checklist-${new Date().toISOString().split("T")[0]}`,
    [],
  );
  const [morningChecked, setMorningChecked] = useState<boolean[]>(() => Array(7).fill(false));

  // Rehydrate today's morning checklist from localStorage. Day-scoped key
  // means yesterday's progress doesn't leak in.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(morningKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 7) setMorningChecked(parsed);
      }
    } catch {}
  }, [morningKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(morningKey, JSON.stringify(morningChecked));
    } catch {}
  }, [morningChecked, morningKey]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [checkinData, journeyData] = await Promise.all([
          apiFetch(`/data/checkin?pillarId=${pillarId}`),
          apiFetch("/data/journey"),
        ]);
        setIsCompleted(checkinData?.isCompleted || false);
        setHasJourney(!!journeyData?.journey);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pillarId]);

  const handleComplete = useCallback(async () => {
    setCompleting(true);
    try {
      // P0-4: persist pillar-specific input before recording the check-in.
      // Best-effort — a journal write failure shouldn't block karma.
      if (pillarId === "gratitude") {
        const [g1, g2, g3] = gratitudeEntries;
        if (g1 || g2 || g3) {
          try {
            await apiFetch("/data/journal", {
              method: "POST",
              body: JSON.stringify({
                type: "gratitude",
                gratitude1: g1 || null,
                gratitude2: g2 || null,
                gratitude3: g3 || null,
              }),
            });
          } catch {}
        }
      }

      const res = await apiFetch("/data/checkin", {
        method: "POST",
        body: JSON.stringify({ pillarSlug: pillarId }),
      });
      // Forward shield-used / shield-granted events so the dashboard can show
      // a one-shot banner. Silently ignored if response shape is unexpected.
      if (res?.streakEvent && res?.streak) {
        setStreakEvent({
          type: res.streakEvent as StreakEventType,
          currentStreak: res.streak.currentStreak,
          shields: res.streak.shields,
        });
        router.push("/dashboard");
      } else {
        router.push("/pillars");
      }
    } catch {
      setCompleting(false);
    }
  }, [pillarId, gratitudeEntries, router]);

  const handleStartJourney = async () => {
    setStartingJourney(true);
    try {
      await apiFetch("/data/journey", {
        method: "POST",
        body: JSON.stringify({ action: "start" }),
      });
      setHasJourney(true);
    } catch {
    } finally {
      setStartingJourney(false);
    }
  };

  if (!pillar) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-500">Pillar not found.</p>
      </div>
    );
  }

  const Icon = pillar.icon;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-6" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Only auto-complete the breathing session if there's a journey to credit
  // it to and the user hasn't already checked in today.
  const breathingAutoComplete = !isCompleted && hasJourney ? handleComplete : undefined;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/pillars"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pillars
      </Link>

      <PillarHeroStyles />
      <PillarHero
        slug={pillar.slug}
        title={pillar.name}
        sanskritName={pillar.sanskritName}
        className="mb-8"
      />

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center",
            pillar.bgColor
          )}
        >
          <Icon className="w-10 h-10" style={{ color: pillar.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{pillar.name}</h1>
            {isCompleted && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <Check className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
          <p className="text-lg text-amber-600 mt-1">{pillar.sanskritName}</p>
          <p className="text-gray-600 mt-2">{pillar.description}</p>

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            {pillar.defaultDurationMinutes > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {pillar.defaultDurationMinutes} minutes
              </div>
            )}
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              +{pillar.karmaPointsBase} karma points
            </div>
          </div>

          <a
            href={`/guides/pillar-${pillar.id}-${pillar.slug}.pdf`}
            download
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download offline guide (PDF)
          </a>
        </div>
      </div>

      {pillarPosters.length > 0 && (
        <div className="space-y-6 mt-2 mb-8">
          {pillarPosters.map((p) => (
            <PosterSection key={p.slug} poster={p} heading="Teaching Poster" />
          ))}
        </div>
      )}

      {/* Long-form pillar content — was previously only in the PDF download */}
      <PillarContentPanel slug={pillar.slug} />
      <div className="h-8" />

      {/* No-journey CTA — previously the Mark Complete button just silently
          vanished, leaving the user on a dead-end page. */}
      {!hasJourney && !isCompleted && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  Start your 48-day journey first
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Check-ins, karma, and streaks only count once your transformation
                  journey has begun. It only takes a click.
                </p>
                <Button
                  className="mt-4"
                  onClick={handleStartJourney}
                  isLoading={startingJourney}
                >
                  Begin my 48-day journey
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pillar-specific content */}
      <Card className="mb-6">
        <CardContent className="py-8">
          {pillarId === "breathing-meditation" ? (
            <BreathingVisualizer
              inhaleDuration={4}
              exhaleDuration={6}
              totalDuration={5}
              onComplete={breathingAutoComplete}
            />
          ) : pillarId === "morning-initiation" ? (
            <MorningInitiationContent
              checked={morningChecked}
              setChecked={setMorningChecked}
            />
          ) : pillarId === "gratitude" ? (
            <GratitudeContent
              entries={gratitudeEntries}
              setEntries={setGratitudeEntries}
            />
          ) : pillarId === "nutrition-fasting" ? (
            <NutritionContent />
          ) : (
            <GenericPillarContent pillar={pillar} />
          )}
        </CardContent>
      </Card>

      {/* Complete button */}
      {!isCompleted && hasJourney && (
        <Button
          size="lg"
          className="w-full"
          onClick={handleComplete}
          isLoading={completing}
        >
          <Check className="w-5 h-5 mr-2" />
          Mark as Complete (+{pillar.karmaPointsBase} karma)
        </Button>
      )}

      {isCompleted && (
        <div className="vedic-card p-6 text-center bg-green-50 border-green-200">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-700">
            Great job! You&apos;ve completed this pillar today.
          </h3>
          <p className="text-green-600 mt-1">
            +{pillar.karmaPointsBase} karma earned
          </p>
        </div>
      )}
    </div>
  );
}

const MORNING_STEPS = [
  {
    title: "Wake Up Early",
    description:
      "Get out of bed calmly. Preferably 5 AM or 20 mins before normal time.",
  },
  {
    title: "Hydrate",
    description: "Drink a glass of warm water.",
  },
  {
    title: "Avoid Phone",
    description: "No phone use for the first 20-30 minutes.",
  },
  {
    title: "Center Your Breath",
    description:
      "2-5 minutes of slow breathing. Inhale 4 seconds, exhale 6 seconds.",
  },
  {
    title: "Connect to Awareness",
    description:
      "1-2 minutes of stillness. Feel connection to universal energy.",
  },
  {
    title: "Gratitude & Intention",
    description: "List 3 things you're grateful for. Set one intention.",
  },
  {
    title: "Visualization",
    description:
      "2 minutes seeing yourself succeeding in your 48-day goal.",
  },
];

// Morning Initiation specific content
function MorningInitiationContent({
  checked,
  setChecked,
}: {
  checked: boolean[];
  setChecked: (next: boolean[]) => void;
}) {
  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };
  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Download Guide Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Complete 5 AM Morning Routine Guide
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Download our detailed step-by-step guide to master the Brahma Muhurta practice.
              Includes preparation tips, breathing exercises, meditation techniques, and a daily checklist.
            </p>
            <a
              href="/guides/5am-morning-routine-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download Guide
            </a>
            <p className="text-xs text-gray-500 mt-3">
              Tip: Open the guide and use Ctrl+P (or Cmd+P on Mac) to save as PDF
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Quick Morning Checklist
        </h3>
        <span className="text-sm font-medium text-amber-600">
          {doneCount} / {MORNING_STEPS.length} done today
        </span>
      </div>
      <div className="space-y-3">
        {MORNING_STEPS.map((step, i) => {
          const isChecked = !!checked[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-xl text-left transition-colors",
                isChecked
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-transparent hover:bg-gray-100",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 transition-colors",
                  isChecked
                    ? "bg-green-500 text-white"
                    : "bg-amber-500 text-white",
                )}
              >
                {isChecked ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <div className="flex-1">
                <h4
                  className={cn(
                    "font-medium",
                    isChecked ? "text-green-800 line-through" : "text-gray-900",
                  )}
                >
                  {step.title}
                </h4>
                <p
                  className={cn(
                    "text-sm mt-1",
                    isChecked ? "text-green-700/80" : "text-gray-600",
                  )}
                >
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Gratitude specific content
function GratitudeContent({
  entries,
  setEntries,
}: {
  entries: [string, string, string];
  setEntries: (next: [string, string, string]) => void;
}) {
  const update = (i: 0 | 1 | 2, value: string) => {
    const next: [string, string, string] = [...entries] as [string, string, string];
    next[i] = value;
    setEntries(next);
  };
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Today&apos;s Gratitude
      </h3>
      <p className="text-gray-600">
        Take a moment to reflect on three things you&apos;re grateful for today.
        Your entries are saved to your journal when you mark this pillar complete.
      </p>
      <div className="space-y-4">
        {([0, 1, 2] as const).map((idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gratitude #{idx + 1}
            </label>
            <textarea
              value={entries[idx]}
              onChange={(e) => update(idx, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
              rows={2}
              placeholder="I am grateful for..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Nutrition specific content
function NutritionContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Vedic Nutrition Guidelines
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Sattvic Foods</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>- Fresh fruits and vegetables</li>
            <li>- Whole grains and legumes</li>
            <li>- Nuts, seeds, and honey</li>
            <li>- Herbal teas and water</li>
            <li>- Light, easily digestible meals</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Avoid (Tamasic)</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>- Processed and fried foods</li>
            <li>- Excessive caffeine</li>
            <li>- Heavy meals after sunset</li>
            <li>- Stale or reheated food</li>
            <li>- Overeating</li>
          </ul>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">
          Intermittent Fasting (16:8)
        </h4>
        <p className="text-sm text-amber-700">
          Fast for 16 hours and eat within an 8-hour window. This aligns with
          circadian rhythm and promotes natural fat loss and high energy.
        </p>
      </div>
    </div>
  );
}

// Generic pillar content
function GenericPillarContent({
  pillar,
}: {
  pillar: (typeof PILLARS)[number];
}) {
  return (
    <div className="text-center py-8">
      <pillar.icon
        className="w-16 h-16 mx-auto mb-4"
        style={{ color: pillar.color }}
      />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{pillar.name}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{pillar.description}</p>
      {pillar.defaultDurationMinutes > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Recommended duration: {pillar.defaultDurationMinutes} minutes
        </p>
      )}
    </div>
  );
}
