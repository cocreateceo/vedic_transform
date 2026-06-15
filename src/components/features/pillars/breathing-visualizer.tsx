"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BreathingLotus } from "@/components/features/sessions/breathing-lotus";
import { type BreathPattern, BREATH_PRESETS, DEFAULT_PRESET, cycleLength } from "@/lib/breath/patterns";
import { type BreathPhase, phaseAt } from "@/lib/breath/phase";

// The full 5-minute breathing practice that sits at the top of the
// Breathing & Meditation pillar. Visually + sonically aligned with the
// Sessions "Breathing" tab: same animated lotus (BreathingLotus) and the
// same CEO voice cue MP3s under /audio/breathing/. The Sessions surface
// remains the pattern picker (4:6, 4:7:8, box); this surface is the
// duration-locked daily practice with pause/resume/reset controls and
// an onComplete hook for auto check-in.

interface BreathingVisualizerProps {
  initialPattern?: BreathPattern;
  totalDuration?: number; // minutes
  onComplete?: () => void;
}

const VOICE_INHALE = "/audio/breathing/inhale.mp3";
const VOICE_EXHALE = "/audio/breathing/exhale.mp3";

/** Map the 4-phase BreathPhase (or idle) → BreathingLotus phase prop. */
function toLotusPhase(phase: BreathPhase | "idle"): "in" | "hold" | "out" | "idle" {
  if (phase === "idle") return "idle";
  if (phase === "inhale") return "in";
  if (phase === "exhale") return "out";
  return "hold"; // holdIn | holdOut
}

/** Map phase → display label. */
function phaseLabel(phase: BreathPhase | "idle"): string | null {
  if (phase === "idle") return null;
  if (phase === "inhale") return "Breathe In";
  if (phase === "exhale") return "Breathe Out";
  return "Hold";
}

export function BreathingVisualizer({
  initialPattern,
  totalDuration = 5,
  onComplete,
}: BreathingVisualizerProps) {
  const [pattern, setPattern] = useState<BreathPattern>(initialPattern ?? DEFAULT_PRESET);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [muted, setMuted] = useState(false);

  // Derived breath state from the pure state machine
  const isIdle = !isActive && elapsedTime === 0;
  const breathState = isIdle ? null : phaseAt(pattern, elapsedTime);
  const phase: BreathPhase | "idle" = breathState ? breathState.phase : "idle";
  const openness = breathState ? breathState.openness : 0;
  const cycleCount = breathState ? breathState.cycle : 0;

  const totalSeconds = totalDuration * 60;
  const totalCycles = Math.floor(totalSeconds / cycleLength(pattern));

  // Pre-load the CEO voice cues once so the first phase tone is instant
  // and replays don't re-fetch. Plain <audio> elements (not AudioContext)
  // so iOS Safari is happy without unlock gymnastics.
  const inhaleAudio = useRef<HTMLAudioElement | null>(null);
  const exhaleAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    inhaleAudio.current = new Audio(VOICE_INHALE);
    inhaleAudio.current.preload = "auto";
    exhaleAudio.current = new Audio(VOICE_EXHALE);
    exhaleAudio.current.preload = "auto";
    return () => {
      inhaleAudio.current?.pause();
      exhaleAudio.current?.pause();
    };
  }, []);

  // Only fire on phase TRANSITION, not on every re-render. Without this
  // ref guard, toggling mute mid-phase would replay the cue immediately.
  // Holds are silent — only inhale and exhale get cues.
  const lastPhaseRef = useRef<BreathPhase | "idle">("idle");
  useEffect(() => {
    if (phase === lastPhaseRef.current) return;
    lastPhaseRef.current = phase;
    if (muted) return;
    const a =
      phase === "inhale" ? inhaleAudio.current :
      phase === "exhale" ? exhaleAudio.current :
      null;
    if (!a) return;
    try {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {}
  }, [phase, muted]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const resetSession = useCallback(() => {
    setIsActive(false);
    setElapsedTime(0);
    lastPhaseRef.current = "idle";
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 0.1;
        if (newTime >= totalSeconds) {
          setIsActive(false);
          if (onCompleteRef.current) onCompleteRef.current();
          return totalSeconds;
        }
        return newTime;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isActive, totalSeconds]);

  const toggleSession = () => {
    if (elapsedTime >= totalSeconds) resetSession();
    setIsActive((prev) => !prev);
  };

  const handlePresetChange = (preset: BreathPattern) => {
    setPattern(preset);
    setIsActive(false);
    setElapsedTime(0);
    lastPhaseRef.current = "idle";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const label = phaseLabel(phase);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Preset picker */}
      <div className="flex flex-wrap justify-center gap-2">
        {BREATH_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={pattern.id === preset.id ? "primary" : "outline"}
            size="sm"
            onClick={() => handlePresetChange(preset)}
            className={cn(
              pattern.id === preset.id && "ring-2 ring-cyan-500 ring-offset-1",
            )}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <BreathingLotus
          openness={openness}
          phase={toLotusPhase(phase)}
          className="w-64 h-64"
        />
        {phase === "idle" && (
          <span className="absolute text-gray-600 text-lg font-medium pointer-events-none">
            Ready
          </span>
        )}
        {label && (
          <span className="absolute text-white text-2xl font-bold drop-shadow-md pointer-events-none">
            {label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-8 text-center">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {formatTime(elapsedTime)}
          </p>
          <p className="text-sm text-gray-500">Elapsed</p>
        </div>
        <div className="w-px h-12 bg-gray-200" />
        <div>
          <p className="text-3xl font-bold text-gray-900">{cycleCount}</p>
          <p className="text-sm text-gray-500">Cycles</p>
        </div>
        <div className="w-px h-12 bg-gray-200" />
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {formatTime(totalSeconds - elapsedTime)}
          </p>
          <p className="text-sm text-gray-500">Remaining</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full transition-all duration-100"
            style={{ width: `${(elapsedTime / totalSeconds) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          {totalDuration} minute session ({totalCycles} cycles)
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={resetSession}
          disabled={elapsedTime === 0}
          aria-label="Reset session"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          size="lg"
          onClick={toggleSession}
          className={cn(
            "min-w-[140px]",
            isActive && "bg-red-500 hover:bg-red-600",
          )}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : elapsedTime >= totalSeconds ? (
            <>
              <RotateCcw className="w-5 h-5 mr-2" />
              Restart
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {elapsedTime > 0 ? "Resume" : "Start"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute breath cues" : "Mute breath cues"}
          title={muted ? "Unmute breath cues" : "Mute breath cues"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600 max-w-md">
        <p className="font-medium mb-2">Pranayama Breathing Pattern</p>
        <p>{pattern.note}</p>
      </div>
    </div>
  );
}
