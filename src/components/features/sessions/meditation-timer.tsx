"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const DURATION_OPTIONS = [5, 10, 15, 20, 30];

export function MeditationTimer() {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const totalSeconds = selectedDuration * 60;
  const elapsed = totalSeconds - timeRemaining;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;

  // SVG circle parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const playChime = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2);
    } catch {
      // Web Audio not supported
    }
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setIsComplete(false);
    setTimeRemaining(selectedDuration * 60);
  }, [selectedDuration]);

  const selectDuration = useCallback(
    (mins: number) => {
      if (isActive) return;
      setSelectedDuration(mins);
      setTimeRemaining(mins * 60);
      setIsComplete(false);
    },
    [isActive]
  );

  useEffect(() => {
    if (!isActive || isComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setIsComplete(true);
          playChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isComplete, playChime]);

  const toggleTimer = () => {
    if (isComplete) {
      reset();
      return;
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <div className="text-center text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-3" />
              <p className="text-2xl font-bold">Namaste</p>
              <p className="text-amber-100 text-sm mt-1">Session Complete</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Well Done!
          </h3>
          <p className="text-[var(--color-text-secondary)] mt-2">
            You meditated for {selectedDuration} minutes. Your mind is clearer
            and more focused.
          </p>
        </div>
        <Button size="lg" onClick={reset}>
          <RotateCcw className="w-5 h-5 mr-2" />
          New Session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Duration selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {DURATION_OPTIONS.map((mins) => (
          <button
            key={mins}
            onClick={() => selectDuration(mins)}
            disabled={isActive}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              selectedDuration === mins
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25"
                : "bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:bg-purple-50 border border-[var(--color-border)]",
              isActive && "opacity-50 cursor-not-allowed"
            )}
          >
            {mins} min
          </button>
        ))}
      </div>

      {/* Circular progress ring */}
      <div className="relative">
        {/* Ambient glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-1000",
            isActive ? "bg-purple-500/15" : "bg-purple-500/5"
          )}
          style={{ transform: "scale(1.3)" }}
        />

        <svg
          width="280"
          height="280"
          className="relative transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-[var(--color-text-primary)] tabular-nums">
            {formatTime(timeRemaining)}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)] mt-2">
            {isActive ? "Meditating..." : "Ready"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          disabled={elapsed === 0}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          size="lg"
          onClick={toggleTimer}
          className={cn("min-w-[140px]", isActive && "bg-red-500 hover:bg-red-600")}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {elapsed > 0 ? "Resume" : "Start"}
            </>
          )}
        </Button>
      </div>

      {/* Guidance text */}
      <p className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        Find a comfortable position. Close your eyes and focus on your breath.
        Let thoughts pass without judgment.
      </p>
    </div>
  );
}
