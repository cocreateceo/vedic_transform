"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, UtensilsCrossed, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FASTING_HOURS = 16;
const EATING_HOURS = 8;
const TOTAL_CYCLE_SECONDS = 24 * 60 * 60;

export function FastingTimer() {
  const [isFasting, setIsFasting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const targetSeconds = isFasting
    ? FASTING_HOURS * 3600
    : EATING_HOURS * 3600;
  const progress = targetSeconds > 0 ? Math.min(elapsedSeconds / targetSeconds, 1) : 0;

  // SVG parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const startSession = useCallback(
    (fasting: boolean) => {
      setIsFasting(fasting);
      setStartTime(Date.now());
      setElapsedSeconds(0);
      setIsRunning(true);
    },
    []
  );

  const stopSession = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
  }, []);

  const formatDuration = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatClockTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const remaining = Math.max(0, targetSeconds - elapsedSeconds);
  const endTime = startTime ? startTime + targetSeconds * 1000 : null;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Mode toggle (only when not running) */}
      {!isRunning && (
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={() => startSession(true)}
            className="min-w-[160px]"
          >
            <Moon className="w-5 h-5 mr-2" />
            Start Fasting
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => startSession(false)}
            className="min-w-[160px]"
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            Start Eating
          </Button>
        </div>
      )}

      {/* Circular progress */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-1000",
            isRunning
              ? isFasting
                ? "bg-orange-500/15"
                : "bg-green-500/15"
              : "bg-gray-300/5"
          )}
          style={{ transform: "scale(1.3)" }}
        />

        <svg
          width="280"
          height="280"
          className="relative transform -rotate-90"
        >
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            opacity="0.3"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={isFasting ? "url(#fastingGradient)" : "url(#eatingGradient)"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient
              id="fastingGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#E8860D" />
            </linearGradient>
            <linearGradient
              id="eatingGradient"
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
          {isRunning ? (
            <>
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  isFasting
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                )}
              >
                {isFasting ? (
                  <Moon className="w-6 h-6" />
                ) : (
                  <UtensilsCrossed className="w-6 h-6" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider",
                  isFasting ? "text-orange-600" : "text-green-600"
                )}
              >
                {isFasting ? "Fasting" : "Eating Window"}
              </span>
              <span className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums mt-1">
                {formatDuration(elapsedSeconds)}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg text-[var(--color-text-secondary)]">
                16:8 Protocol
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] mt-1">
                Tap to begin
              </span>
            </>
          )}
        </div>
      </div>

      {/* Time details */}
      {isRunning && (
        <div className="grid grid-cols-3 gap-6 text-center w-full max-w-md">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Started
            </p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {startTime ? formatClockTime(startTime) : "--"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Remaining
            </p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)] tabular-nums">
              {formatDuration(remaining)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              End Time
            </p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {endTime ? formatClockTime(endTime) : "--"}
            </p>
          </div>
        </div>
      )}

      {/* Stop button */}
      {isRunning && (
        <Button
          variant="outline"
          size="lg"
          onClick={stopSession}
          className="min-w-[160px]"
        >
          <Square className="w-5 h-5 mr-2" />
          Stop Timer
        </Button>
      )}

      {/* Info */}
      <div className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        <p className="font-medium mb-1">16:8 Intermittent Fasting</p>
        <p>
          Fast for 16 hours, eat within an 8-hour window. This pattern supports
          cellular repair, mental clarity, and metabolic health.
        </p>
      </div>
    </div>
  );
}
