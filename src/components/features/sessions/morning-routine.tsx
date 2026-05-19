"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Droplets,
  Wind,
  Eye,
  Heart,
  Target,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { SunriseIllustration } from "./sunrise-illustration";

const STEPS = [
  { name: "Wake Up",      icon: Sparkles, voice: "/audio/morning/wake.mp3" },
  { name: "Hydrate",      icon: Droplets, voice: "/audio/morning/hydrate.mp3" },
  { name: "Breathwork",   icon: Wind,     voice: "/audio/morning/breathwork.mp3" },
  { name: "Awareness",    icon: Eye,      voice: "/audio/morning/awareness.mp3" },
  { name: "Gratitude",    icon: Heart,    voice: "/audio/morning/gratitude.mp3" },
  { name: "Manifestation", icon: Target,  voice: "/audio/morning/manifestation.mp3" },
];

const COMPLETE_VOICE = "/audio/morning/complete.mp3";
const SESSION_PILLAR = "morning-initiation";

export function MorningRoutine() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Breathwork state
  const [breathworkActive, setBreathworkActive] = useState(false);
  const [breathworkElapsed, setBreathworkElapsed] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale");
  const breathworkDuration = 2 * 60; // 2 minutes

  // Awareness timer state
  const [awarenessActive, setAwarenessActive] = useState(false);
  const [awarenessElapsed, setAwarenessElapsed] = useState(0);
  const awarenessDuration = 60; // 1 minute

  // Manifestation timer state
  const [manifestActive, setManifestActive] = useState(false);
  const [manifestElapsed, setManifestElapsed] = useState(0);
  const [manifestationText, setManifestationText] = useState("");
  const manifestDuration = 2 * 60; // 2 minutes

  // Gratitude inputs
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [gratitudeSaving, setGratitudeSaving] = useState(false);

  // Hydrate check
  const [hydrated, setHydrated] = useState(false);

  // Audio for breathwork — same procedural tones as the standalone
  // Breathing tab so the in-routine experience matches.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const checkinFiredRef = useRef(false);

  const stopVoice = useCallback(() => {
    const a = voiceRef.current;
    if (a) {
      try { a.pause(); a.currentTime = 0; } catch {}
      voiceRef.current = null;
    }
  }, []);

  const playVoice = useCallback((src: string) => {
    stopVoice();
    const a = new Audio(src);
    a.volume = 0.9;
    a.play().catch(() => {});
    voiceRef.current = a;
  }, [stopVoice]);

  // Play the step's voice cue whenever the user lands on a new step.
  useEffect(() => {
    if (!soundEnabled || isComplete) return;
    const v = STEPS[currentStep]?.voice;
    if (v) playVoice(v);
  }, [currentStep, soundEnabled, isComplete, playVoice]);

  // Play the completion cue and stop on unmount/mute.
  useEffect(() => {
    if (isComplete && soundEnabled) playVoice(COMPLETE_VOICE);
  }, [isComplete, soundEnabled, playVoice]);

  useEffect(() => {
    if (!soundEnabled) stopVoice();
    return () => stopVoice();
  }, [soundEnabled, stopVoice]);

  const playBreathTone = useCallback(
    (kind: "inhale" | "exhale") => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const t = ctx.currentTime;
        const start = kind === "inhale" ? 220 : 440;
        const end = kind === "inhale" ? 440 : 220;
        osc.frequency.setValueAtTime(start, t);
        osc.frequency.exponentialRampToValueAtTime(end, t + 0.6);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.start(t);
        osc.stop(t + 0.7);
      } catch {}
    },
    [soundEnabled],
  );

  const markComplete = useCallback(
    (step: number) => {
      setCompletedSteps((prev) => new Set([...prev, step]));
    },
    []
  );

  // Breathwork timer
  useEffect(() => {
    if (!breathworkActive) return;
    // Play the first inhale tone immediately so the user doesn't wait 4s
    // wondering if it's broken.
    playBreathTone("inhale");

    const interval = setInterval(() => {
      setBreathworkElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= breathworkDuration) {
          setBreathworkActive(false);
          markComplete(2);
          return breathworkDuration;
        }
        const cyclePos = next % 10;
        const nextPhase: "inhale" | "exhale" = cyclePos < 4 ? "inhale" : "exhale";
        setBreathPhase((prevPhase) => {
          if (prevPhase !== nextPhase) playBreathTone(nextPhase);
          return nextPhase;
        });
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [breathworkActive, breathworkDuration, markComplete, playBreathTone]);

  // Awareness timer
  useEffect(() => {
    if (!awarenessActive) return;
    const interval = setInterval(() => {
      setAwarenessElapsed((prev) => {
        if (prev + 1 >= awarenessDuration) {
          setAwarenessActive(false);
          markComplete(3);
          return awarenessDuration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [awarenessActive, awarenessDuration, markComplete]);

  // Manifestation timer
  useEffect(() => {
    if (!manifestActive) return;
    const interval = setInterval(() => {
      setManifestElapsed((prev) => {
        if (prev + 1 >= manifestDuration) {
          setManifestActive(false);
          markComplete(5);
          return manifestDuration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [manifestActive, manifestDuration, markComplete]);

  // Persist + credit when the user finishes the entire routine. Fires once;
  // re-running today is deduped server-side.
  useEffect(() => {
    if (!isComplete || checkinFiredRef.current) return;
    checkinFiredRef.current = true;

    // 1) Persist gratitude (if anything was typed) and manifestation
    //    intention (if anything was typed). Best-effort — failures here
    //    must not block the karma check-in.
    const tasks: Promise<unknown>[] = [];
    if (gratitude.some((g) => g.trim())) {
      tasks.push(
        apiFetch("/data/journal", {
          method: "POST",
          body: JSON.stringify({
            type: "gratitude",
            gratitude1: gratitude[0] || null,
            gratitude2: gratitude[1] || null,
            gratitude3: gratitude[2] || null,
          }),
        }).catch(() => {}),
      );
    }
    if (manifestationText.trim()) {
      tasks.push(
        apiFetch("/data/journal", {
          method: "POST",
          body: JSON.stringify({
            type: "intention",
            intentionText: manifestationText.trim(),
          }),
        }).catch(() => {}),
      );
    }

    // 2) Record the check-in itself.
    tasks.push(
      apiFetch("/data/checkin", {
        method: "POST",
        body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
      })
        .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
        .catch(() => {}),
    );

    void Promise.allSettled(tasks);
  }, [isComplete, gratitude, manifestationText]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishRoutine = () => {
    markComplete(currentStep);
    setIsComplete(true);
  };

  const saveGratitude = async () => {
    setGratitudeSaving(true);
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          type: "gratitude",
          gratitude1: gratitude[0] || null,
          gratitude2: gratitude[1] || null,
          gratitude3: gratitude[2] || null,
        }),
      });
      markComplete(4);
    } catch {
      // Even on network failure mark the step done so the user can move on.
      // The final routine-complete effect will re-attempt the save.
      markComplete(4);
    } finally {
      setGratitudeSaving(false);
    }
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Morning Routine Complete!
        </h3>
        <p className="text-[var(--color-text-secondary)] text-center max-w-md">
          You have set a powerful intention for your day. Carry this energy with
          you in everything you do.
        </p>
        {karmaAwarded !== null && karmaAwarded > 0 && (
          <p className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            +{karmaAwarded} karma earned
          </p>
        )}
        {karmaAwarded === 0 && (
          <p className="text-xs text-gray-500">
            Already checked in today — your morning routine is recorded.
          </p>
        )}
        <Button
          size="lg"
          onClick={() => {
            setCurrentStep(0);
            setCompletedSteps(new Set());
            setIsComplete(false);
            setBreathworkElapsed(0);
            setAwarenessElapsed(0);
            setManifestElapsed(0);
            setGratitude(["", "", ""]);
            setManifestationText("");
            setHydrated(false);
            setKarmaAwarded(null);
            checkinFiredRef.current = false;
          }}
        >
          Start Again
        </Button>
      </div>
    );
  }

  const getBreathScale = () => {
    if (!breathworkActive) return 1;
    return breathPhase === "inhale" ? 1.3 : 1;
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const StepIcon = step.icon;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs",
                  completedSteps.has(i)
                    ? "bg-green-500 text-white"
                    : i === currentStep
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                      : "bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                )}
              >
                {completedSteps.has(i) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] hidden sm:block">
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="vedic-card p-8 min-h-[320px] flex flex-col items-center justify-center">
        {/* Step 1: Wake Up */}
        {currentStep === 0 && (
          <div className="text-center space-y-6">
            <SunriseIllustration className="w-full max-w-[260px] mx-auto h-[160px]" />
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Wake Up
            </h3>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 max-w-md border border-orange-100">
              <p className="text-lg italic text-orange-800 font-medium">
                &ldquo;I am awake and present.&rdquo;
              </p>
              <p className="text-sm text-orange-600 mt-2">
                Take a deep breath. Feel the gift of a new day.
              </p>
            </div>
            <Button
              onClick={() => {
                markComplete(0);
                goNext();
              }}
            >
              I Am Present
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Hydrate */}
        {currentStep === 1 && (
          <div className="text-center space-y-6">
            <div
              className={cn(
                "w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-xl transition-all duration-500",
                hydrated
                  ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30"
                  : "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-500/30"
              )}
            >
              {hydrated ? (
                <Check className="w-12 h-12 text-white" />
              ) : (
                <Droplets className="w-12 h-12 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Hydrate
            </h3>
            <p className="text-[var(--color-text-secondary)] max-w-md">
              Drink a full glass of water to rehydrate your body after sleep.
              This kickstarts your metabolism and clears your mind.
            </p>
            <Button
              variant={hydrated ? "outline" : "primary"}
              onClick={() => {
                setHydrated(true);
                markComplete(1);
              }}
            >
              {hydrated ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Done!
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4 mr-2" />
                  I Drank My Water
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 3: Breathwork */}
        {currentStep === 2 && (
          <div className="text-center space-y-6">
            <div className="relative flex items-center justify-center" style={{ height: 180 }}>
              <div
                className={cn(
                  "absolute rounded-full blur-xl transition-all duration-500",
                  breathworkActive
                    ? breathPhase === "inhale"
                      ? "bg-cyan-400/20"
                      : "bg-amber-400/20"
                    : "bg-gray-300/10"
                )}
                style={{
                  width: 160,
                  height: 160,
                  transform: `scale(${getBreathScale() * 1.2})`,
                }}
              />
              <div
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center transition-all bg-gradient-to-br shadow-xl",
                  breathworkActive
                    ? breathPhase === "inhale"
                      ? "from-cyan-400 to-cyan-600"
                      : "from-amber-400 to-amber-600"
                    : "from-gray-200 to-gray-300"
                )}
                style={{
                  transform: `scale(${getBreathScale()})`,
                  transitionDuration: breathPhase === "inhale" ? "4s" : "6s",
                }}
              >
                <span className="text-white font-bold text-lg">
                  {breathworkActive
                    ? breathPhase === "inhale"
                      ? "In"
                      : "Out"
                    : "4:6"}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Breathwork
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              {formatTime(breathworkDuration - breathworkElapsed)} remaining
            </p>
            {completedSteps.has(2) ? (
              <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Breathwork Complete
              </p>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => setBreathworkActive(!breathworkActive)}
                  className={cn(breathworkActive && "bg-red-500 hover:bg-red-600")}
                >
                  {breathworkActive ? "Stop" : "Start Breathing"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSoundEnabled((s) => !s)}
                  aria-label={soundEnabled ? "Mute breath tones" : "Unmute breath tones"}
                  title={soundEnabled ? "Audio on" : "Audio off"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Awareness */}
        {currentStep === 3 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Eye className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Awareness
            </h3>
            <p className="text-lg italic text-orange-700 font-medium">
              Be still. Be present.
            </p>
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {formatTime(awarenessDuration - awarenessElapsed)}
            </p>
            {completedSteps.has(3) ? (
              <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Awareness Complete
              </p>
            ) : (
              <Button
                onClick={() => setAwarenessActive(!awarenessActive)}
                className={cn(awarenessActive && "bg-red-500 hover:bg-red-600")}
              >
                {awarenessActive ? "Stop" : "Begin Silence"}
              </Button>
            )}
          </div>
        )}

        {/* Step 5: Gratitude */}
        {currentStep === 4 && (
          <div className="text-center space-y-6 w-full max-w-md">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Gratitude
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Write three things you are grateful for today. Saved to your
              journal when you finish the routine.
            </p>
            <div className="space-y-3">
              {gratitude.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const next = [...gratitude];
                    next[i] = e.target.value;
                    setGratitude(next);
                  }}
                  placeholder={`I am grateful for...`}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ))}
            </div>
            {gratitude.some((g) => g.trim()) && !completedSteps.has(4) && (
              <Button onClick={saveGratitude} isLoading={gratitudeSaving}>
                <Heart className="w-4 h-4 mr-2" />
                Save Gratitude
              </Button>
            )}
            {completedSteps.has(4) && (
              <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Gratitude Saved
              </p>
            )}
          </div>
        )}

        {/* Step 6: Manifestation */}
        {currentStep === 5 && (
          <div className="text-center space-y-6 w-full max-w-md">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Manifestation
            </h3>
            <p className="text-lg italic text-amber-700 font-medium">
              Visualize your goal. Feel it as already real.
            </p>
            <textarea
              value={manifestationText}
              onChange={(e) => setManifestationText(e.target.value)}
              placeholder="Today I intend to..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {formatTime(manifestDuration - manifestElapsed)}
            </p>
            {completedSteps.has(5) ? (
              <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Visualization Complete
              </p>
            ) : (
              <Button
                onClick={() => setManifestActive(!manifestActive)}
                className={cn(manifestActive && "bg-red-500 hover:bg-red-600")}
              >
                {manifestActive ? "Stop" : "Begin Visualization"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm text-[var(--color-text-secondary)]">
          Step {currentStep + 1} of {STEPS.length}
        </span>

        {currentStep === STEPS.length - 1 ? (
          <Button onClick={finishRoutine}>
            Complete
            <Check className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button variant="outline" onClick={goNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
