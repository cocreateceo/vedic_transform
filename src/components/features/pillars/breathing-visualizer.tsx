"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BreathingVisualizerProps {
  inhaleDuration?: number; // seconds
  exhaleDuration?: number; // seconds
  totalDuration?: number; // minutes
  onComplete?: () => void;
}

type BreathPhase = "idle" | "inhale" | "exhale";

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

  // Lazy-init audio so we don't burn an AudioContext on every page render
  // and to satisfy iOS Safari's "first audio after user gesture" rule —
  // first tone fires from Start, which is a click.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playTone = useCallback((kind: "in" | "out") => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Singing-bowl-ish: A4 rising note for inhale, lower E4 falling note for exhale.
      osc.frequency.value = kind === "in" ? 440 : 330;
      osc.type = "sine";
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
      gain.gain.linearRampToValueAtTime(0, t + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.7);
    } catch {}
  }, [muted]);

  // Fire a tone whenever the breath phase transitions. setPhase to the same
  // value is a React no-op, so this effect runs once per inhale↔exhale flip.
  useEffect(() => {
    if (phase === "inhale") playTone("in");
    else if (phase === "exhale") playTone("out");
  }, [phase, playTone]);

  const cycleDuration = inhaleDuration + exhaleDuration;
  const totalSeconds = totalDuration * 60;
  const totalCycles = Math.floor(totalSeconds / cycleDuration);

  const resetSession = useCallback(() => {
    setIsActive(false);
    setPhase("idle");
    setCycleCount(0);
    setElapsedTime(0);
    setPhaseProgress(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 0.1;

        if (newTime >= totalSeconds) {
          setIsActive(false);
          setPhase("idle");
          onComplete?.();
          return totalSeconds;
        }

        // Calculate current position in cycle
        const cyclePosition = newTime % cycleDuration;

        if (cyclePosition < inhaleDuration) {
          setPhase("inhale");
          setPhaseProgress(cyclePosition / inhaleDuration);
        } else {
          setPhase("exhale");
          setPhaseProgress((cyclePosition - inhaleDuration) / exhaleDuration);
        }

        // Track cycle count
        const newCycleCount = Math.floor(newTime / cycleDuration);
        if (newCycleCount > cycleCount) {
          setCycleCount(newCycleCount);
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    isActive,
    inhaleDuration,
    exhaleDuration,
    cycleDuration,
    totalSeconds,
    cycleCount,
    onComplete,
  ]);

  const toggleSession = () => {
    if (elapsedTime >= totalSeconds) {
      resetSession();
    }
    setIsActive(!isActive);
    if (!isActive && phase === "idle") {
      setPhase("inhale");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate circle scale based on phase
  const getScale = () => {
    if (phase === "idle") return 1;
    if (phase === "inhale") return 1 + phaseProgress * 0.3;
    return 1.3 - phaseProgress * 0.3;
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Breathing circle visualization */}
      <div className="relative">
        {/* Outer glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            phase === "inhale" && "bg-cyan-400/20 blur-xl",
            phase === "exhale" && "bg-amber-400/20 blur-xl"
          )}
          style={{
            transform: `scale(${getScale() * 1.2})`,
          }}
        />

        {/* Main circle */}
        <div
          className={cn(
            "relative w-64 h-64 rounded-full flex items-center justify-center transition-all",
            phase === "idle" && "bg-gradient-to-br from-gray-100 to-gray-200",
            phase === "inhale" && "bg-gradient-to-br from-cyan-400 to-blue-500",
            phase === "exhale" && "bg-gradient-to-br from-amber-400 to-orange-500"
          )}
          style={{
            transform: `scale(${getScale()})`,
            transitionDuration: phase === "inhale" ? `${inhaleDuration}s` : `${exhaleDuration}s`,
          }}
        >
          {/* Inner circle content */}
          <div className="text-center text-white">
            {phase === "idle" ? (
              <span className="text-gray-500 text-lg">Ready</span>
            ) : (
              <>
                <p className="text-3xl font-bold capitalize">{phase}</p>
                <p className="text-sm opacity-80 mt-1">
                  {phase === "inhale"
                    ? `${inhaleDuration} seconds`
                    : `${exhaleDuration} seconds`}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Lotus petals decoration */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-8 h-16 rounded-full opacity-30 transition-all duration-1000",
              phase === "inhale" && "bg-cyan-300",
              phase === "exhale" && "bg-amber-300",
              phase === "idle" && "bg-gray-300"
            )}
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateY(-140px) scale(${getScale()})`,
              transformOrigin: "center center",
            }}
          />
        ))}
      </div>

      {/* Stats */}
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

      {/* Progress bar */}
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

      {/* Controls */}
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
            isActive && "bg-red-500 hover:bg-red-600"
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
          aria-label={muted ? "Unmute breath tones" : "Mute breath tones"}
          title={muted ? "Unmute breath tones" : "Mute breath tones"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Instructions */}
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
