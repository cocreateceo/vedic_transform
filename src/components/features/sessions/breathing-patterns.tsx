"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Volume2, VolumeX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";

const SESSION_PILLAR = "breathing-meditation";
// A "real session" threshold so accidentally hitting Start then Stop doesn't
// farm karma. Five complete cycles is roughly a minute of practice.
const MIN_CYCLES_FOR_CREDIT = 5;

// Phase-change cues: a rising glide for inhale, falling for exhale, and
// a short tick for hold. Played procedurally so no audio files needed.
const PHASE_TONES: Record<string, { startFreq: number; endFreq: number; duration: number }> = {
  "Breathe In": { startFreq: 220, endFreq: 440, duration: 0.6 },
  "Breathe Out": { startFreq: 440, endFreq: 220, duration: 0.6 },
  Hold: { startFreq: 330, endFreq: 330, duration: 0.15 },
};

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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const checkinFiredRef = useRef(false);

  const playPhaseTone = useCallback((phaseName: string) => {
    const tone = PHASE_TONES[phaseName];
    if (!tone) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        tone.endFreq,
        ctx.currentTime + tone.duration,
      );
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tone.duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + tone.duration);
    } catch {
      // Web Audio unavailable — fall through silently
    }
  }, []);

  const pattern = PATTERNS[selectedPattern];
  const currentPhase = pattern.phases[currentPhaseIndex];
  const phaseProgress = currentPhase
    ? phaseElapsed / currentPhase.duration
    : 0;

  // Circle scale: expand on inhale, contract on exhale, hold steady on hold
  const getScale = () => {
    if (!isActive) return 1;
    const phaseName = currentPhase.name;
    if (phaseName === "Breathe In") return 1 + phaseProgress * 0.4;
    if (phaseName === "Breathe Out") return 1.4 - phaseProgress * 0.4;
    return phaseName === "Hold" && currentPhaseIndex === 1 ? 1.4 : 1;
  };

  const getPhaseColor = () => {
    if (!isActive) return "from-gray-200 to-gray-300";
    const phaseName = currentPhase.name;
    if (phaseName === "Breathe In") return "from-cyan-400 to-cyan-600";
    if (phaseName === "Hold") return "from-orange-500 to-amber-500";
    return "from-amber-400 to-amber-600";
  };

  const getGlowColor = () => {
    if (!isActive) return "bg-gray-300/10";
    const phaseName = currentPhase.name;
    if (phaseName === "Breathe In") return "bg-cyan-400/20";
    if (phaseName === "Hold") return "bg-orange-500/20";
    return "bg-amber-400/20";
  };

  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
    setCycleCount(0);
    setKarmaAwarded(null);
    checkinFiredRef.current = false;
  }, []);

  // Credit a check-in when the user has practiced enough cycles. Fires once
  // per session — repeat sessions today are deduped by the server.
  const maybeCreditCheckin = useCallback(
    (cycles: number) => {
      if (checkinFiredRef.current) return;
      if (cycles < MIN_CYCLES_FOR_CREDIT) return;
      checkinFiredRef.current = true;
      apiFetch("/data/checkin", {
        method: "POST",
        body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
      })
        .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
        .catch(() => {});
    },
    [],
  );

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
          if (soundEnabled && nextPhase) playPhaseTone(nextPhase.name);
          if (wrapsCycle) {
            setCurrentPhaseIndex(0);
            setCycleCount((c) => {
              const next = c + 1;
              maybeCreditCheckin(next);
              return next;
            });
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
    playPhaseTone,
    soundEnabled,
    maybeCreditCheckin,
  ]);

  const toggleSession = () => {
    if (isActive) {
      reset();
    } else {
      setIsActive(true);
      setCurrentPhaseIndex(0);
      setPhaseElapsed(0);
      // Play the first phase tone immediately so the user hears the cue
      // for the inhale without waiting for the phase transition.
      if (soundEnabled) playPhaseTone(pattern.phases[0].name);
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

  return (
    <div className="flex flex-col items-center gap-8 py-8">
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

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
        {/* Outer glow */}
        <div
          className={cn(
            "absolute rounded-full blur-2xl transition-all",
            getGlowColor()
          )}
          style={{
            width: 260,
            height: 260,
            transform: `scale(${getScale() * 1.2})`,
            transitionDuration: "0.3s",
          }}
        />

        {/* Main circle */}
        <div
          className={cn(
            "relative w-56 h-56 rounded-full flex items-center justify-center bg-gradient-to-br transition-all shadow-2xl",
            getPhaseColor()
          )}
          style={{
            transform: `scale(${getScale()})`,
            transitionDuration: "0.3s",
          }}
        >
          <div className="text-center text-white">
            {isActive ? (
              <>
                <p className="text-2xl font-bold">{currentPhase.name}</p>
                <p className="text-5xl font-bold mt-2 tabular-nums">
                  {phaseTimeRemaining}
                </p>
              </>
            ) : (
              <span className="text-lg text-gray-500">Ready</span>
            )}
          </div>
        </div>

        {/* Decorative rings */}
        {isActive && (
          <>
            <div
              className={cn(
                "absolute rounded-full border-2 opacity-20 transition-all",
                currentPhase.name === "Breathe In"
                  ? "border-cyan-300"
                  : currentPhase.name === "Hold"
                    ? "border-orange-300"
                    : "border-amber-300"
              )}
              style={{
                width: 280,
                height: 280,
                transform: `scale(${getScale()})`,
                transitionDuration: "0.3s",
              }}
            />
          </>
        )}
      </div>

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
              Stop
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

      {/* Karma feedback once a real session has been credited. */}
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
  );
}
