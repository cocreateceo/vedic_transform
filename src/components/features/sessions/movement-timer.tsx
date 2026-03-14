"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Dumbbell, Trophy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function MovementTimer() {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<"idle" | "work" | "rest" | "complete">(
    "idle"
  );
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isActive, setIsActive] = useState(false);

  const phaseDuration = phase === "work" ? workTime : restTime;

  // SVG parameters
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress =
    phase === "idle" || phase === "complete"
      ? 0
      : (phaseDuration - timeRemaining) / phaseDuration;
  const strokeDashoffset = circumference * (1 - progress);

  const reset = useCallback(() => {
    setIsActive(false);
    setPhase("idle");
    setCurrentRound(1);
    setTimeRemaining(workTime);
  }, [workTime]);

  useEffect(() => {
    if (!isActive || phase === "idle" || phase === "complete") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (phase === "work") {
            if (currentRound >= totalRounds) {
              setPhase("complete");
              setIsActive(false);
              return 0;
            }
            setPhase("rest");
            return restTime;
          } else {
            // rest -> next work round
            setCurrentRound((r) => r + 1);
            setPhase("work");
            return workTime;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, currentRound, totalRounds, workTime, restTime]);

  const startTimer = () => {
    if (phase === "idle" || phase === "complete") {
      setPhase("work");
      setCurrentRound(1);
      setTimeRemaining(workTime);
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const adjustValue = (
    setter: (fn: (v: number) => number) => void,
    delta: number,
    min: number,
    max: number
  ) => {
    if (isActive) return;
    setter((v: number) => Math.max(min, Math.min(max, v + delta)));
  };

  if (phase === "complete") {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Workout Complete!
          </h3>
          <p className="text-[var(--color-text-secondary)] mt-2">
            You crushed {totalRounds} rounds. Stay consistent, stay strong.
          </p>
        </div>
        <Button size="lg" onClick={reset}>
          <RotateCcw className="w-5 h-5 mr-2" />
          New Workout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Configuration (only when idle) */}
      {phase === "idle" && (
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Work time */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Work (sec)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustValue(setWorkTime, -5, 10, 120)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--color-text-primary)] w-12 text-center tabular-nums">
                {workTime}
              </span>
              <button
                onClick={() => adjustValue(setWorkTime, 5, 10, 120)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Rest time */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Rest (sec)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustValue(setRestTime, -5, 5, 60)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--color-text-primary)] w-12 text-center tabular-nums">
                {restTime}
              </span>
              <button
                onClick={() => adjustValue(setRestTime, 5, 5, 60)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Rounds */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Rounds
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustValue(setTotalRounds, -1, 1, 20)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--color-text-primary)] w-12 text-center tabular-nums">
                {totalRounds}
              </span>
              <button
                onClick={() => adjustValue(setTotalRounds, 1, 1, 20)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main timer display */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
            phase === "work" ? "bg-orange-500/15" : phase === "rest" ? "bg-green-500/15" : "bg-gray-300/5"
          )}
          style={{ transform: "scale(1.3)" }}
        />

        <svg
          width="260"
          height="260"
          className="relative transform -rotate-90"
        >
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            opacity="0.3"
          />
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={
              phase === "work"
                ? "url(#workGradient)"
                : phase === "rest"
                  ? "url(#restGradient)"
                  : "var(--color-border)"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient
              id="workGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient
              id="restGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              phase === "work"
                ? "text-orange-600"
                : phase === "rest"
                  ? "text-green-600"
                  : "text-[var(--color-text-secondary)]"
            )}
          >
            {phase === "idle" ? "Ready" : phase === "work" ? "Work" : "Rest"}
          </span>
          <span className="text-5xl font-bold text-[var(--color-text-primary)] tabular-nums mt-1">
            {timeRemaining}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)] mt-2">
            {phase !== "idle"
              ? `Round ${currentRound} / ${totalRounds}`
              : `${totalRounds} rounds`}
          </span>
        </div>
      </div>

      {/* Round indicators */}
      {phase !== "idle" && (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i < currentRound - 1
                  ? "bg-orange-500"
                  : i === currentRound - 1
                    ? phase === "work"
                      ? "bg-orange-500 animate-pulse"
                      : "bg-green-500 animate-pulse"
                    : "bg-[var(--color-border)]"
              )}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {(phase === "work" || phase === "rest") && (
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
        <Button
          size="lg"
          onClick={isActive ? pauseTimer : startTimer}
          className={cn(
            "min-w-[140px]",
            isActive && phase === "work" && "bg-red-500 hover:bg-red-600"
          )}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {phase === "idle" ? "Start" : "Resume"}
            </>
          )}
        </Button>
      </div>

      {/* Info */}
      <p className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        High-intensity interval training. Push hard during work phases, recover
        during rest. Modify the intervals to match your fitness level.
      </p>
    </div>
  );
}
