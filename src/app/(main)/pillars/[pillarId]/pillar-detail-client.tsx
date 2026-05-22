"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getPillarBySlug, PILLARS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathingVisualizer } from "@/components/features/pillars/breathing-visualizer";
import { PillarHero, PillarHeroStyles } from "@/components/features/pillars/pillar-hero";
import { PillarAnimation } from "@/components/features/pillars/pillar-animations";

// Slugs that have a custom animated scene in PillarAnimation (8 of 11). The
// remaining three — breathing-meditation, movement, healing-meditation —
// fall back to the existing PillarHero, which already has rich
// video/image backdrops tuned for those pillars.
const PILLARS_WITH_ANIMATION = new Set([
  "morning-initiation",
  "nutrition-fasting",
  "thoughts-intention",
  "gratitude",
  "sandhya-meditation",
  "brahman-connection",
  "divine-manifestation",
  "sleep-optimization",
]);
import { PillarContentPanel } from "@/components/features/pillars/pillar-content-panel";
import {
  YesNoReflection,
  type YesNoAnswer,
  type YesNoStep,
  type YesNoConfig,
} from "@/components/features/pillars/yesno-reflection";
import { PILLAR_REFLECTIONS_BY_SLUG } from "@/data/pillar-reflections";
import {
  Check,
  ArrowLeft,
  Clock,
  Sparkles,
  Download,
  FileText,
  Compass,
  RotateCcw,
} from "lucide-react";
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
  const [morningAnswers, setMorningAnswers] = useState<YesNoAnswer[]>(
    () => Array(MORNING_STEPS.length).fill(null) as YesNoAnswer[],
  );

  const nutritionKey = useMemo(
    () => `nutrition-reflection-${new Date().toISOString().split("T")[0]}`,
    [],
  );
  const [nutritionAnswers, setNutritionAnswers] = useState<YesNoAnswer[]>(
    () => Array(NUTRITION_STEPS.length).fill(null) as YesNoAnswer[],
  );

  const breathingKey = useMemo(
    () => `breathing-reflection-${new Date().toISOString().split("T")[0]}`,
    [],
  );
  const [breathingAnswers, setBreathingAnswers] = useState<YesNoAnswer[]>(
    () => Array(BREATHING_STEPS.length).fill(null) as YesNoAnswer[],
  );

  // Generic reflection state — used by the seven pillars that share a
  // pure yes/no reflection surface (no custom practice tool). Each
  // pillar slug has its own localStorage key so answers don't leak.
  const genericReflection = PILLAR_REFLECTIONS_BY_SLUG[pillarId];
  const genericReflectionKey = useMemo(
    () =>
      `pillar-reflection-${pillarId}-${new Date().toISOString().split("T")[0]}`,
    [pillarId],
  );
  const [genericReflectionAnswers, setGenericReflectionAnswers] = useState<
    YesNoAnswer[]
  >(() =>
    genericReflection
      ? (Array(genericReflection.steps.length).fill(null) as YesNoAnswer[])
      : [],
  );

  // Rehydrate today's morning answers from localStorage. Day-scoped key
  // means yesterday's progress doesn't leak in. The old shape was a
  // boolean[] (pre-2026-05-20) — convert true → "yes", false → null since
  // an unchecked box was not an explicit "no".
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(morningKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length !== MORNING_STEPS.length) return;
      const normalized: YesNoAnswer[] = parsed.map((v) => {
        if (v === "yes" || v === "no") return v;
        if (v === true) return "yes";
        return null;
      });
      setMorningAnswers(normalized);
    } catch {}
  }, [morningKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(morningKey, JSON.stringify(morningAnswers));
    } catch {}
  }, [morningAnswers, morningKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(nutritionKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length !== NUTRITION_STEPS.length) return;
      const normalized: YesNoAnswer[] = parsed.map((v) =>
        v === "yes" || v === "no" ? v : null,
      );
      setNutritionAnswers(normalized);
    } catch {}
  }, [nutritionKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(nutritionKey, JSON.stringify(nutritionAnswers));
    } catch {}
  }, [nutritionAnswers, nutritionKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(breathingKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length !== BREATHING_STEPS.length) return;
      const normalized: YesNoAnswer[] = parsed.map((v) =>
        v === "yes" || v === "no" ? v : null,
      );
      setBreathingAnswers(normalized);
    } catch {}
  }, [breathingKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(breathingKey, JSON.stringify(breathingAnswers));
    } catch {}
  }, [breathingAnswers, breathingKey]);

  useEffect(() => {
    if (!genericReflection || typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(genericReflectionKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (
        !Array.isArray(parsed) ||
        parsed.length !== genericReflection.steps.length
      )
        return;
      const normalized: YesNoAnswer[] = parsed.map((v) =>
        v === "yes" || v === "no" ? v : null,
      );
      setGenericReflectionAnswers(normalized);
    } catch {}
  }, [genericReflectionKey, genericReflection]);

  useEffect(() => {
    if (!genericReflection || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        genericReflectionKey,
        JSON.stringify(genericReflectionAnswers),
      );
    } catch {}
  }, [genericReflectionAnswers, genericReflectionKey, genericReflection]);

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
      {/* Custom animated scene for the 8 pillars that have one; the other
          three (breathing / movement / healing meditation) fall through to
          the existing PillarHero with its video/image backdrops. */}
      {PILLARS_WITH_ANIMATION.has(pillar.slug) ? (
        <div className="mb-8">
          <PillarAnimation slug={pillar.slug} />
        </div>
      ) : (
        <PillarHero
          slug={pillar.slug}
          title={pillar.name}
          sanskritName={pillar.sanskritName}
          className="mb-8"
        />
      )}

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
            <BreathingMeditationContent
              onAutoComplete={breathingAutoComplete}
              answers={breathingAnswers}
              setAnswers={setBreathingAnswers}
            />
          ) : pillarId === "morning-initiation" ? (
            <MorningInitiationContent
              answers={morningAnswers}
              setAnswers={setMorningAnswers}
            />
          ) : pillarId === "gratitude" ? (
            <GratitudeContent
              entries={gratitudeEntries}
              setEntries={setGratitudeEntries}
            />
          ) : pillarId === "nutrition-fasting" ? (
            <NutritionContent
              answers={nutritionAnswers}
              setAnswers={setNutritionAnswers}
            />
          ) : genericReflection ? (
            <GenericReflectionContent
              pillar={pillar}
              steps={genericReflection.steps}
              config={genericReflection.config}
              answers={genericReflectionAnswers}
              setAnswers={setGenericReflectionAnswers}
            />
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

const MORNING_STEPS: YesNoStep[] = [
  {
    title: "Wake Up Early",
    description:
      "Get out of bed calmly. Preferably 5 AM or 20 mins before your normal time.",
    question: "Did you wake up before 5 AM today?",
    successMessage:
      "Wonderful! Waking before 5 AM aligns you with Brahma Muhurta — the most sattvic and creative hours of the day. Keep this rhythm.",
    tryAgainMessage:
      "That's okay. Tonight, set an alarm for 4:50 AM and place your phone across the room. After 3-4 mornings your body clock resets and waking before 5 AM becomes natural.",
  },
  {
    title: "Hydrate",
    description: "Drink a glass of warm water within 10 minutes of waking.",
    question: "Did you drink warm water first thing?",
    successMessage:
      "Excellent. Warm water flushes overnight toxins and lights up your digestive fire (agni) for the day ahead.",
    tryAgainMessage:
      "No worries. Tonight, keep a glass of water on your nightstand — first sip in the morning, before checking your phone.",
  },
  {
    title: "Avoid Phone",
    description: "No phone use for the first 20-30 minutes after waking.",
    question: "Did you stay off your phone for the first 20 minutes?",
    successMessage:
      "Beautiful. Those first 20 minutes belong to you, not your inbox. Your nervous system thanks you.",
    tryAgainMessage:
      "Habit takes time. Try leaving your phone in another room overnight, or use the screen-time lock until 5:30 AM. Out of sight, out of reach.",
  },
  {
    title: "Center Your Breath",
    description:
      "2-5 minutes of slow breathing. Inhale 4 seconds, exhale 6 seconds. Try it now with the pacer below — three rounds takes 30 seconds.",
    practice: {
      kind: "breathing",
      pattern: { inhaleSeconds: 4, exhaleSeconds: 6, rounds: 3 },
      mandatory: true,
    },
    question: "Did you take a few minutes for slow breathing?",
    successMessage:
      "Wonderful. The 4-in / 6-out rhythm activates your parasympathetic system and sets a calm tone for the whole day.",
    tryAgainMessage:
      "Start small. Tomorrow, just five conscious breaths after you hydrate — that's all. Build up to 2 minutes over the next week.",
  },
  {
    title: "Connect to Awareness",
    description:
      "1-2 minutes of stillness. Sit quietly and feel your connection to something larger than yourself.",
    practice: {
      kind: "timer",
      totalSeconds: 60,
      label: "Silent stillness (60s)",
      guidance:
        "Sit comfortably. Eyes closed or softly lowered. Notice your breath without trying to change it. Notice that the awareness watching the breath is watching everything else too. Rest in that awareness.",
      mandatory: true,
    },
    question: "Did you sit in stillness today?",
    successMessage:
      "Beautiful. That stillness is the foundation of every other practice. You're building it daily.",
    tryAgainMessage:
      "Even 30 seconds of stillness counts. Set a timer tomorrow — 30 seconds today, 1 minute next week. The mind quiets with practice, not pressure.",
  },
  {
    title: "Gratitude & Intention",
    description:
      "Name 3 things you're grateful for. Set one clear intention for the day.",
    question: "Did you name 3 gratitudes and set your intention?",
    successMessage:
      "Wonderful. Naming 3 specific gratitudes rewires your brain toward abundance — and a daily intention keeps your day aligned with your 48-day goal.",
    tryAgainMessage:
      "Try this tomorrow: 3 gratitudes in your head, before you get out of bed. No journal needed to start. The intention can be one word — \"focus\", \"calm\", \"build\".",
  },
  {
    title: "Visualization",
    description:
      "2 minutes seeing yourself succeeding in your 48-day goal — in vivid detail.",
    practice: {
      kind: "timer",
      totalSeconds: 60,
      label: "Visualization (60s)",
      guidance:
        "Close your eyes. See yourself moving through today with focus, kindness, and energy. See the 48-day goal closer than yesterday. Feel it in the body as if it were already true.",
      mandatory: true,
    },
    question: "Did you visualize your goal today?",
    successMessage:
      "Beautiful. Seeing it daily makes the path real. Your subconscious starts working on it whether you're aware of it or not.",
    tryAgainMessage:
      "Try this tomorrow: close your eyes for 60 seconds and picture one specific moment of your 48-day goal already achieved. What do you see? Hear? Feel?",
  },
];

// Morning Initiation: a guided one-step-at-a-time reflection. Keeps the
// Brahma Muhurta guide download at the top, then delegates the actual
// step-by-step flow to the shared YesNoReflection component.
function MorningInitiationContent({
  answers,
  setAnswers,
}: {
  answers: YesNoAnswer[];
  setAnswers: (next: YesNoAnswer[]) => void;
}) {
  return (
    <div className="space-y-6">
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

      <YesNoReflection
        steps={MORNING_STEPS}
        answers={answers}
        setAnswers={setAnswers}
        config={{
          headerTitle: "Today's Morning Reflection",
          headerSubtitle:
            "One question at a time. Honest answers — there's no wrong one.",
          summaryTitle: "Today's Morning Reflection",
          summaryStatLabel: "habits",
          summaryClosingNote:
            "Reflection itself is progress. You showed up — that's what builds the 48-day rhythm. Mark this pillar complete below to record your karma for today.",
        }}
      />
    </div>
  );
}

type GratitudePrompt = {
  label: string;
  question: string;
  hint: string;
  placeholder: string;
  affirmation: string;
};

// Three differentiated prompts so users move past surface-level "family,
// health, food" toward specific, vivid gratitudes — which is what
// actually rewires the brain.
const GRATITUDE_PROMPTS: GratitudePrompt[] = [
  {
    label: "A person",
    question: "Who has helped, supported, or made you smile recently?",
    hint: "Be specific — a name, a face, even a stranger. What did they do, and how did it land for you?",
    placeholder: "I'm grateful for ___ because…",
    affirmation:
      "Beautiful. Holding someone in gratitude — even silently — strengthens that bond. If you can, tell them today.",
  },
  {
    label: "A moment",
    question: "What small moment from today brought you joy, ease, or surprise?",
    hint: "Not the big things — the small ones. A warm cup. Sunlight on a wall. A song. A laugh. The smaller, the better.",
    placeholder: "I'm grateful for the moment when…",
    affirmation:
      "Wonderful. Naming small moments trains your attention to find more of them. Your brain genuinely starts looking.",
  },
  {
    label: "Yourself",
    question:
      "What's something about yourself, your body, or your effort today that you appreciate?",
    hint: "This one is hardest, and the most important. A choice you made. A small win. Even just showing up.",
    placeholder: "I appreciate myself for…",
    affirmation:
      "This matters. Self-gratitude isn't ego — it's accurate accounting of your own effort. Keep doing this.",
  },
];

// Gratitude: a guided three-step reflection. Each step has its own
// prompt designed to take the user past generic gratitudes and toward
// specific, vivid ones. Entries persist through the parent so
// handleComplete still writes them to the journal on check-in.
function GratitudeContent({
  entries,
  setEntries,
}: {
  entries: [string, string, string];
  setEntries: (next: [string, string, string]) => void;
}) {
  const total = GRATITUDE_PROMPTS.length;
  const isFilled = (s: string) => s.trim().length >= 3;
  const firstUnfilled = entries.findIndex((e) => !isFilled(e));
  const initialStep = firstUnfilled === -1 ? total : firstUnfilled;
  const [activeStep, setActiveStep] = useState<number>(initialStep);
  const [phase, setPhase] = useState<"writing" | "affirmation">("writing");
  const [draft, setDraft] = useState<string>(() =>
    initialStep < total ? entries[initialStep] : "",
  );

  const update = (i: 0 | 1 | 2, value: string) => {
    const next: [string, string, string] = [...entries] as [
      string,
      string,
      string,
    ];
    next[i] = value;
    setEntries(next);
  };

  const filledCount = entries.filter(isFilled).length;
  const allFilled = filledCount === total;

  const saveAndAffirm = () => {
    const idx = activeStep as 0 | 1 | 2;
    update(idx, draft.trim());
    setPhase("affirmation");
  };

  const continueToNext = () => {
    if (activeStep + 1 >= total) {
      setActiveStep(total);
    } else {
      const next = activeStep + 1;
      setActiveStep(next);
      setDraft(entries[next] || "");
      setPhase("writing");
    }
  };

  const goToStep = (idx: number) => {
    setActiveStep(idx);
    setDraft(entries[idx] || "");
    setPhase(isFilled(entries[idx]) ? "affirmation" : "writing");
  };

  const restart = () => {
    setEntries(["", "", ""]);
    setActiveStep(0);
    setDraft("");
    setPhase("writing");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Today&apos;s Gratitude Reflection
          </h3>
          <span className="text-sm font-medium text-amber-600">
            {filledCount === 0
              ? `${total} reflections`
              : `${filledCount} / ${total} written`}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          One at a time. Be specific — the more vivid, the more it lands.
          Your entries are saved to your journal when you mark this pillar
          complete.
        </p>
        <div className="flex gap-1.5">
          {GRATITUDE_PROMPTS.map((p, i) => {
            const filled = isFilled(entries[i]);
            const isActive = i === activeStep;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goToStep(i)}
                title={`${i + 1}. ${p.label}`}
                aria-label={`Go to step ${i + 1}: ${p.label}`}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all",
                  filled ? "bg-green-500" : "bg-gray-200",
                  isActive && "ring-2 ring-offset-2 ring-amber-500",
                )}
              />
            );
          })}
        </div>
      </div>

      {!allFilled || activeStep < total ? (
        <GratitudeStepCard
          stepIndex={activeStep}
          prompt={GRATITUDE_PROMPTS[activeStep]}
          phase={phase}
          draft={draft}
          setDraft={setDraft}
          total={total}
          onSave={saveAndAffirm}
          onContinue={continueToNext}
          onEdit={() => {
            setDraft(entries[activeStep] || "");
            setPhase("writing");
          }}
        />
      ) : (
        <GratitudeSummaryCard
          entries={entries}
          onRestart={restart}
          onJumpToStep={goToStep}
        />
      )}
    </div>
  );
}

function GratitudeStepCard({
  stepIndex,
  prompt,
  phase,
  draft,
  setDraft,
  total,
  onSave,
  onContinue,
  onEdit,
}: {
  stepIndex: number;
  prompt: GratitudePrompt;
  phase: "writing" | "affirmation";
  draft: string;
  setDraft: (s: string) => void;
  total: number;
  onSave: () => void;
  onContinue: () => void;
  onEdit: () => void;
}) {
  const isLast = stepIndex === total - 1;
  const canSave = draft.trim().length >= 3;

  return (
    <div className="rounded-2xl bg-white border-2 border-amber-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold flex items-center justify-center shadow-sm">
          {stepIndex + 1}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-600 font-medium">
            Step {stepIndex + 1} of {total} · {prompt.label}
          </p>
          <h4 className="text-xl font-semibold text-gray-900">
            {prompt.question}
          </h4>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-5">{prompt.hint}</p>

      {phase === "writing" ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
            rows={3}
            placeholder={prompt.placeholder}
            autoFocus
          />
          <div className="mt-4">
            <Button
              size="lg"
              onClick={onSave}
              disabled={!canSave}
              className="w-full sm:w-auto"
            >
              <Check className="w-5 h-5 mr-2" />
              Save reflection
            </Button>
            {!canSave && (
              <p className="text-xs text-gray-500 mt-2">
                Write at least a few words to continue.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-green-50 border border-green-200 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-800 mb-1">Saved.</p>
              <p className="text-sm text-green-700 leading-relaxed mb-3">
                {prompt.affirmation}
              </p>
              <p className="text-sm text-gray-700 italic border-l-4 border-green-300 pl-3 py-1">
                &ldquo;{draft.trim()}&rdquo;
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onContinue} className="flex-1 sm:flex-initial">
              {isLast ? "See today's reflection" : "Next reflection →"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-gray-600"
            >
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function GratitudeSummaryCard({
  entries,
  onRestart,
  onJumpToStep,
}: {
  entries: [string, string, string];
  onRestart: () => void;
  onJumpToStep: (idx: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="text-2xl font-bold text-gray-900">
            Today&apos;s Three Gratitudes
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            These will save to your journal when you mark this pillar
            complete.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="text-gray-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start over
        </Button>
      </div>

      <div className="space-y-3">
        {GRATITUDE_PROMPTS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onJumpToStep(i)}
            className="w-full text-left rounded-xl bg-white/70 border border-amber-200 p-4 hover:border-amber-300 transition-colors"
          >
            <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold mb-1">
              {i + 1}. {p.label}
            </p>
            <p className="text-gray-800 leading-relaxed">{entries[i]}</p>
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600 italic">
        Three specific gratitudes — a person, a moment, yourself. This is
        the daily practice that, over weeks, genuinely rewires how your
        brain looks at the world.
      </p>
    </div>
  );
}

const NUTRITION_STEPS: YesNoStep[] = [
  {
    title: "Sattvic Foods",
    description:
      "Fresh fruits, vegetables, whole grains, legumes, nuts, seeds — foods that are alive and carry prana.",
    question: "Did you eat fresh fruits or vegetables today?",
    successMessage:
      "Wonderful. Sattvic foods are alive — they carry prana (life force) into your body directly. Keep this rhythm.",
    tryAgainMessage:
      "No worries. For tomorrow, add just one fresh fruit or a small salad to one meal. Small additions compound fast.",
  },
  {
    title: "Avoid Processed & Fried",
    description:
      "Tamasic foods — processed, fried, packaged, stale — dull the mind and slow agni (digestive fire).",
    question: "Did you avoid processed, fried, or packaged food today?",
    successMessage:
      "Excellent. By skipping tamasic food today you kept agni bright and your mind clear. You'll feel it tomorrow too.",
    tryAgainMessage:
      "It happens. For tomorrow, swap one fried or packaged item for something fresh or steamed. Notice how different you feel by evening.",
  },
  {
    title: "Eat by Sunset",
    description:
      "Your digestive fire (agni) is strongest at midday and weakest after sunset. Finishing dinner early dramatically improves sleep.",
    question:
      "Did you finish your last meal by sunset, or at least 3 hours before bed?",
    successMessage:
      "Beautiful. Eating earlier aligns with your body's digestive cycle. You'll sleep deeper and wake up sharper.",
    tryAgainMessage:
      "Try this tomorrow: move dinner just 30 minutes earlier than usual. Each week, shift it 30 more minutes — until you finish by sunset.",
  },
  {
    title: "Intermittent Fasting (16:8)",
    description:
      "Eating within an 8-hour window gives your body 16 hours to repair, rather than digest constantly.",
    question: "Did you keep your eating within an 8-hour window?",
    successMessage:
      "Wonderful. The 16-hour fast gives your body time for cellular cleanup — autophagy. This is where the real transformation happens.",
    tryAgainMessage:
      "Start small. Tomorrow, just push breakfast 30 minutes later — that's all. Each week extend the gap by an hour until you reach 16:8.",
  },
  {
    title: "Mindful Eating",
    description:
      "Eating with attention activates parasympathetic digestion — you absorb more, eat less, and feel more satisfied.",
    question: "Did you eat at least one meal without screens or your phone?",
    successMessage:
      "Beautiful. When you eat with attention, your nervous system actually digests — instead of bracing against whatever's on the screen.",
    tryAgainMessage:
      "Try this tomorrow: just one meal. Put the phone in another room. Notice the taste, the texture, and when you actually feel full.",
  },
  {
    title: "Hydration",
    description:
      "Sip warm water and herbal teas between meals — but avoid large amounts during meals, which dilutes agni.",
    question: "Did you drink enough water and herbal tea today?",
    successMessage:
      "Excellent. Warm water between meals supports agni without putting it out during digestion. Your skin and digestion both thank you.",
    tryAgainMessage:
      "Try this tomorrow: keep a copper or steel bottle nearby and sip warm water every 30-45 minutes. Avoid drinking large amounts with meals.",
  },
];

// Nutrition: keeps the Sattvic / Tamasic / 16:8 reference cards at the
// top, then delegates to the shared YesNoReflection for the guided
// six-step debrief.
function NutritionContent({
  answers,
  setAnswers,
}: {
  answers: YesNoAnswer[];
  setAnswers: (next: YesNoAnswer[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Sattvic Foods</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>- Fresh fruits and vegetables</li>
            <li>- Whole grains and legumes</li>
            <li>- Nuts, seeds, and honey</li>
            <li>- Herbal teas and warm water</li>
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
          your circadian rhythm and gives your body time to repair.
        </p>
      </div>

      <YesNoReflection
        steps={NUTRITION_STEPS}
        answers={answers}
        setAnswers={setAnswers}
        config={{
          headerTitle: "Today's Nutrition Reflection",
          headerSubtitle:
            "One question at a time. Honest answers — there's no wrong one.",
          summaryTitle: "Today's Nutrition Reflection",
          summaryStatLabel: "habits",
          summaryStatVerb: "honored",
          summaryClosingNote:
            "Food is the most repeated decision of your day. Small, honest shifts compound faster than any single perfect meal. Mark this pillar complete to record your karma for today.",
        }}
      />
    </div>
  );
}

const BREATHING_STEPS: YesNoStep[] = [
  {
    title: "Daily Practice",
    description:
      "Even five minutes of formal breathing or meditation, done daily, rewires your stress response over weeks. The pacer below runs 5 rounds of 4-in / 6-out — about 50 seconds — as a daily starter.",
    practice: {
      kind: "breathing",
      pattern: { inhaleSeconds: 4, exhaleSeconds: 6, rounds: 5 },
      mandatory: true,
    },
    question:
      "Did you do a formal breathing or meditation practice today (5+ minutes)?",
    successMessage:
      "Wonderful. Five minutes daily is the practice. The compounding is invisible day-to-day and unmistakable over weeks.",
    tryAgainMessage:
      "Use this moment. The visualizer above is exactly five minutes — start it now. The hardest breath is always the first.",
  },
  {
    title: "Conscious Breathing",
    description:
      "Awareness during stress is more powerful than any practice you do alone — you're rewiring in real time. The pacer below is the rescue pattern: 4 in, 6 out.",
    practice: {
      kind: "breathing",
      pattern: { inhaleSeconds: 4, exhaleSeconds: 6, rounds: 3 },
      mandatory: true,
    },
    question:
      "Did you catch yourself holding your breath or breathing shallow today, and consciously deepen it?",
    successMessage:
      "Beautiful. That mid-stress awareness is the actual point of the practice. You're applying it where it matters most.",
    tryAgainMessage:
      "Tomorrow, set 3 silent reminders on your phone. At each one, take just 3 slow breaths. That's the practice.",
  },
  {
    title: "Pranayama Technique",
    description:
      "Different techniques work on different systems — calming (4-7-8), balancing (alternate nostril), energizing (kapalabhati), focusing (box). The pacer below runs 4-7-8 — the most universally calming pattern.",
    practice: {
      kind: "breathing",
      pattern: {
        inhaleSeconds: 4,
        holdSeconds: 7,
        exhaleSeconds: 8,
        rounds: 3,
      },
      mandatory: true,
    },
    question:
      "Did you try a structured technique today — alternate nostril, box, or 4-7-8?",
    successMessage:
      "Excellent. Each technique is a different tool. You're building a real toolkit for whatever the day throws at you.",
    tryAgainMessage:
      "Try alternate nostril (anulom vilom) tomorrow: close right nostril, inhale left, switch, exhale right, inhale right, switch, exhale left. Three rounds — that's all.",
  },
  {
    title: "Stillness",
    description:
      "Stillness is where the nervous system finally lets go. Your body knows what to do — it just needs permission.",
    practice: {
      kind: "timer",
      totalSeconds: 90,
      label: "Sit in silence (90s)",
      guidance:
        "Just sit. Don't try to meditate. Don't follow your breath. Don't fix your posture. Just sit. The mind will quiet on its own — let it.",
      mandatory: true,
    },
    question:
      "Did you spend at least 5 quiet minutes today with no input — no podcast, music, or screen?",
    successMessage:
      "Beautiful. Modern life is constant input. Those five quiet minutes are an act of nervous-system protection.",
    tryAgainMessage:
      "Try this tomorrow: one walk, one meal, or one cup of tea — phone away, no audio. Just notice. That's meditation in motion.",
  },
  {
    title: "Breath Between Tasks",
    description:
      "Micro-pauses between meetings, tasks, or screens prevent tension from compounding through the day. The pacer below runs exactly 3 conscious breaths — about 30 seconds.",
    practice: {
      kind: "breathing",
      pattern: { inhaleSeconds: 4, exhaleSeconds: 6, rounds: 3 },
      mandatory: true,
    },
    question:
      "Did you pause for 3 conscious breaths between meetings, tasks, or screens today?",
    successMessage:
      "Wonderful. Those micro-pauses are how you keep the day from compounding. You're protecting your nervous system in real time.",
    tryAgainMessage:
      "Tomorrow, set one rule: before opening any new tab or app, three slow breaths first. It only takes 10 seconds.",
  },
  {
    title: "Evening Wind-Down",
    description:
      "Slow exhales tell your nervous system the day is done. One of the highest-leverage habits for sleep quality. The pacer below runs the classic 4-7-8 — most people are asleep before the third round.",
    practice: {
      kind: "breathing",
      pattern: {
        inhaleSeconds: 4,
        holdSeconds: 7,
        exhaleSeconds: 8,
        rounds: 3,
      },
      mandatory: true,
    },
    question: "Did you do any slow breathing in the hour before bed last night?",
    successMessage:
      "Excellent. Slow exhales tell your nervous system the day is done. Your sleep quality is going to thank you.",
    tryAgainMessage:
      "Tonight, try 4-7-8 in bed — inhale 4, hold 7, exhale 8. Three rounds, and most people are asleep before the third.",
  },
];

// Breathing & Meditation: the interactive visualizer is the named
// practice and stays at the top. Below it we run the same guided
// six-step reflection as the other pillars — debriefing the user's
// broader breathing & meditation habits beyond this five-minute
// session.
function BreathingMeditationContent({
  onAutoComplete,
  answers,
  setAnswers,
}: {
  onAutoComplete?: () => void;
  answers: YesNoAnswer[];
  setAnswers: (next: YesNoAnswer[]) => void;
}) {
  return (
    <div className="space-y-10">
      <BreathingVisualizer
        inhaleDuration={4}
        exhaleDuration={6}
        totalDuration={5}
        onComplete={onAutoComplete}
      />

      <div className="border-t border-gray-200" />

      <YesNoReflection
        steps={BREATHING_STEPS}
        answers={answers}
        setAnswers={setAnswers}
        config={{
          headerTitle: "Today's Breathing & Meditation Reflection",
          headerSubtitle:
            "Beyond the five-minute practice above — how was the rest of your day with your breath?",
          summaryTitle: "Today's Breathing & Meditation Reflection",
          summaryStatLabel: "habits",
          summaryClosingNote:
            "Your breath is the one thing you carry everywhere. The more often you remember it during the day, the more it remembers you when you need it. Mark this pillar complete to record your karma for today.",
        }}
      />
    </div>
  );
}

// Generic guided reflection used by the seven pillars that don't have
// their own custom practice surface — thoughts, movement, healing,
// sandhya, brahman, manifestation, sleep. A small intro card frames
// the pillar, then the shared YesNoReflection runs the questions.
function GenericReflectionContent({
  pillar,
  steps,
  config,
  answers,
  setAnswers,
}: {
  pillar: (typeof PILLARS)[number];
  steps: YesNoStep[];
  config: YesNoConfig;
  answers: YesNoAnswer[];
  setAnswers: (next: YesNoAnswer[]) => void;
}) {
  const Icon = pillar.icon;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${pillar.color}22` }}
        >
          <Icon className="w-7 h-7" style={{ color: pillar.color }} />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-amber-700 font-medium">
            {pillar.sanskritName}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-0.5">
            {pillar.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{pillar.description}</p>
        </div>
      </div>

      <YesNoReflection
        steps={steps}
        answers={answers}
        setAnswers={setAnswers}
        config={config}
      />
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
