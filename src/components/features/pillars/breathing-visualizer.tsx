"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BreathingLotus } from "@/components/features/sessions/breathing-lotus";

// The full 5-minute breathing practice that sits at the top of the
// Breathing & Meditation pillar. Visually + sonically aligned with the
// Sessions "Breathing" tab: same animated lotus (BreathingLotus) and the
// same CEO voice cue MP3s under /audio/breathing/. The Sessions surface
// remains the pattern picker (4:6, 4:7:8, box); this surface is the
// duration-locked daily practice with pause/resume/reset controls and
// an onComplete hook for auto check-in.

interface BreathingVisualizerProps {
  inhaleDuration?: number; // seconds
  exhaleDuration?: number; // seconds
  totalDuration?: number; // minutes
  onComplete?: () => void;
}

type BreathPhase = "idle" | "in" | "out";

const VOICE_INHALE = "/audio/breathing/inhale.mp3";
const VOICE_EXHALE = "/audio/breathing/exhale.mp3";

export function BreathingVisualizer({
  inhaleDuration = 4,
  exhaleDuration = 6,
  totalDuration = 5,
  onComplete,
}: BreathingVisualizerProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [muted, setMuted] = useState(false);

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
  const lastPhaseRef = useRef<BreathPhase>("idle");
  useEffect(() => {
    if (phase === lastPhaseRef.current) return;
    lastPhaseRef.current = phase;
    if (muted) return;
    const a = phase === "in" ? inhaleAudio.current : phase === "out" ? exhaleAudio.current : null;
    if (!a) return;
    try {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {}
  }, [phase, muted]);

  const cycleDuration = inhaleDuration + exhaleDuration;
  const totalSeconds = totalDuration * 60;
  const totalCycles = Math.floor(totalSeconds / cycleDuration);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const resetSession = useCallback(() => {
    setIsActive(false);
    setPhase("idle");
    setCycleCount(0);
    setElapsedTime(0);
    setPhaseProgress(0);
    lastPhaseRef.current = "idle";
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 0.1;
        if (newTime >= totalSeconds) {
          setIsActive(false);
          setPhase("idle");
          if (onCompleteRef.current) onCompleteRef.current();
          return totalSeconds;
        }
        const cyclePosition = newTime % cycleDuration;
        if (cyclePosition < inhaleDuration) {
          setPhase("in");
          setPhaseProgress(cyclePosition / inhaleDuration);
        } else {
          setPhase("out");
          setPhaseProgress((cyclePosition - inhaleDuration) / exhaleDuration);
        }
        const newCycleCount = Math.floor(newTime / cycleDuration);
        if (newCycleCount > cycleCount) setCycleCount(newCycleCount);
        return newTime;
      });
    }, 100);
    return () => clearInterval(id);
  }, [
    isActive,
    inhaleDuration,
    exhaleDuration,
    cycleDuration,
    totalSeconds,
    cycleCount,
  ]);

  const toggleSession = () => {
    if (elapsedTime >= totalSeconds) resetSession();
    setIsActive(!isActive);
    if (!isActive && phase === "idle") setPhase("in");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 0 = closed bud (fully exhaled), 1 = fully open (fully inhaled).
  const openness =
    phase === "idle"
      ? 0
      : phase === "in"
        ? phaseProgress
        : 1 - phaseProgress;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <BreathingLotus
          openness={openness}
          phase={phase}
          className="w-64 h-64"
        />
        {phase === "idle" && (
          <span className="absolute text-gray-600 text-lg font-medium pointer-events-none">
            Ready
          </span>
        )}
        {phase !== "idle" && (
          <span className="absolute text-white text-2xl font-bold drop-shadow-md pointer-events-none">
            {phase === "in" ? "Breathe In" : "Breathe Out"}
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
        <p>
          Inhale slowly for {inhaleDuration} seconds, then exhale gently for{" "}
          {exhaleDuration} seconds. This 4:6 ratio activates your
          parasympathetic nervous system, promoting calm and focus.
        </p>
      </div>
    </div>
  );
}
