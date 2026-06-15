"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Volume2, VolumeX, Sparkles, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { BreathingLotus } from "./breathing-lotus";
import { BreathingFigure } from "./breathing-figure";
import { PexelsVideo } from "@/components/ui/pexels-video";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";

const SESSION_PILLAR = "breathing-meditation";
// A "real session" threshold so accidentally hitting Start then Stop doesn't
// farm karma. Five complete cycles is roughly a minute of practice.
const MIN_CYCLES_FOR_CREDIT = 5;

// Phase voice cues — short CEO clips, one per phase. Centralized so the
// component can pre-warm them and so we have a single place to swap voices.
const PHASE_VOICE: Record<string, string> = {
  "Breathe In":  "/audio/breathing/inhale.mp3",
  "Breathe Out": "/audio/breathing/exhale.mp3",
  Hold:          "/audio/breathing/hold.mp3",
};
const INTRO_VOICE = "/audio/breathing/intro.mp3";

interface BreathingPattern {
  name: string;
  label: string;
  phases: { name: string; duration: number }[];
}

const PATTERNS: BreathingPattern[] = [
  {
    name: "basic",
    label: "4:6 Basic",
    phases: [
      { name: "Breathe In", duration: 4 },
      { name: "Breathe Out", duration: 6 },
    ],
  },
  {
    name: "relaxing",
    label: "4:7:8 Relaxing",
    phases: [
      { name: "Breathe In", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Breathe Out", duration: 8 },
    ],
  },
  {
    name: "box",
    label: "4:4:4:4 Box",
    phases: [
      { name: "Breathe In", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Breathe Out", duration: 4 },
      { name: "Hold", duration: 4 },
    ],
  },
];

export function BreathingPatterns() {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const checkinFiredRef = useRef(false);

  // Stop any in-flight phrase before queueing the next one so we never overlap.
  const playVoice = useCallback((src: string) => {
    const prev = voiceRef.current;
    if (prev) {
      try { prev.pause(); prev.currentTime = 0; } catch {}
    }
    const a = new Audio(src);
    a.volume = 0.9;
    a.play().catch(() => {});
    voiceRef.current = a;
  }, []);

  const playPhaseVoice = useCallback((phaseName: string) => {
    const src = PHASE_VOICE[phaseName];
    if (src) playVoice(src);
  }, [playVoice]);

  const pattern = PATTERNS[selectedPattern];
  const currentPhase = pattern.phases[currentPhaseIndex];
  const phaseProgress = currentPhase
    ? phaseElapsed / currentPhase.duration
    : 0;

  // Lotus openness: 0 = closed bud (fully exhaled), 1 = fully bloomed (fully inhaled).
  // Drives the SVG petals so they breathe in sync with the timer.
  const getOpenness = (): number => {
    if (!isActive || !currentPhase) return 0;
    const name = currentPhase.name;
    if (name === "Breathe In")  return phaseProgress;
    if (name === "Breathe Out") return 1 - phaseProgress;
    // "Hold" — stay at whatever level the previous phase ended at. Hold-after-
    // inhale (index 1 in 4:7:8 and box) holds bloomed; hold-after-exhale (box,
    // index 3) holds closed.
    return currentPhaseIndex === 1 ? 1 : 0;
  };

  const lotusPhase: "in" | "hold" | "out" | "idle" = (() => {
    if (!isActive || !currentPhase) return "idle";
    if (currentPhase.name === "Breathe In") return "in";
    if (currentPhase.name === "Hold") return "hold";
    return "out";
  })();

  const stopVoice = useCallback(() => {
    const a = voiceRef.current;
    if (a) {
      try { a.pause(); a.currentTime = 0; } catch {}
      voiceRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
    setCycleCount(0);
    setKarmaAwarded(null);
    setReflecting(false);
    setSealed(false);
    setMoodAfter(null);
    checkinFiredRef.current = false;
    stopVoice();
  }, [stopVoice]);

  // Make sure voice doesn't leak across unmount or mute.
  useEffect(() => {
    if (!soundEnabled) stopVoice();
    return () => stopVoice();
  }, [soundEnabled, stopVoice]);

  // Credit fires when the user finishes + seals in the Reflect step, carrying
  // before/after mood. Server dedupes same-day re-runs.
  const sealSession = useCallback(() => {
    if (checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    setSealed(true);
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [moodBefore, moodAfter]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhaseElapsed((prev) => {
        const newElapsed = prev + 0.1;
        if (newElapsed >= currentPhase.duration) {
          // Move to next phase + play its phase-start tone.
          const nextIndex = currentPhaseIndex + 1;
          const wrapsCycle = nextIndex >= pattern.phases.length;
          const nextPhase = wrapsCycle
            ? pattern.phases[0]
            : pattern.phases[nextIndex];
          if (soundEnabled && nextPhase) playPhaseVoice(nextPhase.name);
          if (wrapsCycle) {
            setCurrentPhaseIndex(0);
            setCycleCount((c) => c + 1);
          } else {
            setCurrentPhaseIndex(nextIndex);
          }
          return 0;
        }
        return newElapsed;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    isActive,
    currentPhase,
    currentPhaseIndex,
    pattern.phases,
    playPhaseVoice,
    soundEnabled,
  ]);

  const finishSession = () => {
    setIsActive(false);
    stopVoice();
    if (cycleCount >= MIN_CYCLES_FOR_CREDIT) {
      setReflecting(true);
    } else {
      // Not enough practice to credit — return to ready without a check-in.
      reset();
    }
  };

  const toggleSession = () => {
    if (isActive) {
      finishSession();
    } else {
      setIsActive(true);
      setCurrentPhaseIndex(0);
      setPhaseElapsed(0);
      if (soundEnabled) {
        // Opening teacher cue, then the first phase cue follows in the
        // phase-tick effect on the next iteration.
        playVoice(INTRO_VOICE);
        // Queue the first-phase cue ~2.5s after the intro so they don't overlap.
        setTimeout(() => {
          if (PHASE_VOICE[pattern.phases[0].name]) playPhaseVoice(pattern.phases[0].name);
        }, 2500);
      }
    }
  };

  const selectPattern = (index: number) => {
    if (isActive) return;
    setSelectedPattern(index);
    reset();
  };

  const phaseTimeRemaining = currentPhase
    ? Math.ceil(currentPhase.duration - phaseElapsed)
    : 0;

  if (!started) {
    return <SessionIntro {...SESSION_INTROS.breathing} onBegin={() => setStarted(true)} />;
  }

  // Reflect / reward screen — after a credited session is finished.
  if (reflecting) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <div className="text-center text-white">
              <Check className="w-10 h-10 mx-auto mb-2" />
              <p className="text-xl font-bold">{cycleCount} cycles</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Well Done!</h3>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Your breath is slower and your mind more settled.
          </p>
        </div>

        {!sealed ? (
          <div className="flex flex-col items-center gap-5">
            <MoodCheck
              value={moodAfter}
              onChange={setMoodAfter}
              prompt="How do you feel now?"
            />
            <Button size="lg" onClick={sealSession} className="min-w-[200px]">
              <Sparkles className="w-4 h-4 mr-2" />
              Seal this session
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {moodBefore && moodAfter && (
              <p className="text-[var(--color-text-secondary)]">
                You moved from{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">{moodLabel(moodBefore)}</span>{" "}
                to{" "}
                <span className="font-semibold text-amber-600">{moodLabel(moodAfter)}</span>.
              </p>
            )}
            {karmaAwarded !== null && karmaAwarded > 0 && (
              <p className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                +{karmaAwarded} karma earned
              </p>
            )}
            {karmaAwarded === 0 && (
              <p className="text-xs text-gray-500">
                Already checked in today — this session is recorded.
              </p>
            )}
            <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Breathe again
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-8 py-8 rounded-3xl overflow-hidden">
      {/* Ambient cloud-time-lapse backdrop. Stronger when actively breathing. */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-1000",
          isActive ? "opacity-30" : "opacity-12",
        )}
      >
        <PexelsVideo slug="breathing-ambient" showAttribution={false} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/35 to-white/75 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">

      {/* Pattern selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PATTERNS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => selectPattern(i)}
            disabled={isActive}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              selectedPattern === i
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:bg-orange-50 border border-[var(--color-border)]",
              isActive && "opacity-50 cursor-not-allowed"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Breathing lotus — petals open on inhale, hold at bloom, close on exhale */}
      <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
        <BreathingLotus
          openness={getOpenness()}
          phase={lotusPhase}
          className="w-full h-full"
        />

        {/* Phase label + countdown overlaid in the center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-[var(--color-text-primary)] drop-shadow-sm">
            {isActive && currentPhase ? (
              <>
                <p className="text-xl font-semibold tracking-wide">
                  {currentPhase.name}
                </p>
                <p className="text-4xl font-bold mt-1 tabular-nums">
                  {phaseTimeRemaining}
                </p>
              </>
            ) : (
              <span className="text-base text-[var(--color-text-secondary)]">Ready</span>
            )}
          </div>
        </div>
      </div>

      {/* Breathing figure — belly expands on inhale, settles on exhale */}
      <BreathingFigure openness={getOpenness()} phase={lotusPhase} className="w-28 h-24" />

      {/* Stats */}
      <div className="flex items-center gap-8 text-center">
        <div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {cycleCount}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">Cycles</p>
        </div>
        <div className="w-px h-12 bg-[var(--color-border)]" />
        <div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {pattern.phases.map((p) => p.duration).join(":")}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">Pattern</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={toggleSession}
          className={cn("min-w-[160px]", isActive && "bg-red-500 hover:bg-red-600")}
        >
          {isActive ? (
            <>
              <Square className="w-5 h-5 mr-2" />
              Finish
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setSoundEnabled((s) => !s)}
          aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
          title={soundEnabled ? "Audio cues on" : "Audio cues off"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Before-mood — captured once, before the first start */}
      {!isActive && cycleCount === 0 && (
        <MoodCheck
          value={moodBefore}
          onChange={setMoodBefore}
          prompt="Before you begin — how do you feel?"
        />
      )}

      {/* Hint to keep going until the credit threshold */}
      {isActive && cycleCount < MIN_CYCLES_FOR_CREDIT && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          Practice at least {MIN_CYCLES_FOR_CREDIT} cycles, then tap Finish.
        </p>
      )}

      {/* Pattern description */}
      <p className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        {pattern.name === "basic" &&
          "The 4:6 pattern activates your parasympathetic nervous system, promoting calm and focus."}
        {pattern.name === "relaxing" &&
          "The 4:7:8 pattern is deeply relaxing. Inhale through the nose, hold, then exhale through the mouth."}
        {pattern.name === "box" &&
          "Box breathing is used by Navy SEALs for stress relief. Equal phases create balance and clarity."}
      </p>

      </div>
    </div>
  );
}
