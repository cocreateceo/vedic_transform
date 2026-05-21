"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreathingLotus } from "@/components/features/sessions/breathing-lotus";

// Inline breathing pacer used inside a reflection step. Renders the same
// animated lotus the Sessions "Breathing" tab uses so the visual feels
// continuous across the app — but stays silent (no CEO voice cues, no
// tones) since reflection cards are scrolled past quickly and a stack of
// six audible breathing demos would be a lot. Sessions remains the
// "full immersive practice" surface with voice + ambient video; this is
// the "try this pattern" companion inside a reflection.

export type BreathPattern = {
  inhaleSeconds: number;
  holdSeconds?: number;
  exhaleSeconds: number;
  rounds?: number;
};

type Phase = "in" | "hold" | "out" | "idle";

interface PhaseState {
  phase: Phase;
  secondsLeft: number;
  round: number;
  /** 0 = closed bud (fully exhaled), 1 = fully open (fully inhaled). */
  openness: number;
}

function phaseAt(elapsedMs: number, p: BreathPattern): PhaseState {
  const cycleSec = p.inhaleSeconds + (p.holdSeconds ?? 0) + p.exhaleSeconds;
  const totalRounds = p.rounds ?? 3;
  const t = elapsedMs / 1000;
  if (t >= cycleSec * totalRounds) {
    return { phase: "idle", secondsLeft: 0, round: 0, openness: 0 };
  }
  const round = Math.floor(t / cycleSec) + 1;
  const within = t % cycleSec;
  if (within < p.inhaleSeconds) {
    const progress = within / p.inhaleSeconds;
    return {
      phase: "in",
      secondsLeft: Math.ceil(p.inhaleSeconds - within),
      round,
      openness: progress,
    };
  }
  const ihEnd = p.inhaleSeconds + (p.holdSeconds ?? 0);
  if (within < ihEnd) {
    return {
      phase: "hold",
      secondsLeft: Math.ceil(ihEnd - within),
      round,
      openness: 1,
    };
  }
  return {
    phase: "out",
    secondsLeft: Math.ceil(cycleSec - within),
    round,
    openness: 1 - (within - ihEnd) / p.exhaleSeconds,
  };
}

export function MiniBreathingDemo({
  pattern,
  onComplete,
}: {
  pattern: BreathPattern;
  /**
   * Fires once when the user finishes all rounds in a single uninterrupted
   * session. Used by gating reflection steps to unlock the "Yes" button —
   * abandoning early (via Stop) does NOT fire this callback.
   */
  onComplete?: () => void;
}) {
  const [active, setActive] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const rounds = pattern.rounds ?? 3;
  const cycleSec =
    pattern.inhaleSeconds + (pattern.holdSeconds ?? 0) + pattern.exhaleSeconds;
  const totalMs = cycleSec * rounds * 1000;
  const totalSec = cycleSec * rounds;

  // Stable callback ref so parent re-renders don't tear down the interval.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 100ms ticks match the Sessions BreathingPatterns cadence; the lotus
  // SVG's CSS transitions interpolate smoothly between samples.
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setElapsedMs((e) => {
        const next = e + 100;
        if (next >= totalMs) {
          setActive(false);
          if (onCompleteRef.current) onCompleteRef.current();
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [active, totalMs]);

  const state = active
    ? phaseAt(elapsedMs, pattern)
    : { phase: "idle" as Phase, secondsLeft: 0, round: 0, openness: 0 };

  const start = () => {
    setElapsedMs(0);
    setActive(true);
  };
  const stop = () => {
    setActive(false);
    setElapsedMs(0);
  };

  const patternLabel = pattern.holdSeconds
    ? `${pattern.inhaleSeconds} in · hold ${pattern.holdSeconds} · ${pattern.exhaleSeconds} out`
    : `${pattern.inhaleSeconds} in · ${pattern.exhaleSeconds} out`;
  const phaseLabel =
    state.phase === "idle"
      ? "Ready"
      : state.phase === "in"
        ? "Breathe In"
        : state.phase === "hold"
          ? "Hold"
          : "Breathe Out";

  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 my-5">
      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <BreathingLotus
            openness={state.openness}
            phase={state.phase}
            className="w-28 h-28"
          />
          {active && (
            <span className="absolute text-white font-bold text-2xl drop-shadow-md pointer-events-none">
              {state.secondsLeft}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">
            Try the pattern
          </p>
          <p className="text-sm font-semibold text-amber-900 mt-0.5">
            {patternLabel}
          </p>
          <p className="text-sm text-amber-800 mt-1">
            {active ? (
              <>
                <span className="font-semibold">{phaseLabel}</span> · round{" "}
                {state.round} of {rounds}
              </>
            ) : (
              <>
                {rounds} rounds · about {totalSec} seconds total
              </>
            )}
          </p>
          <div className="mt-3">
            {active ? (
              <Button
                size="sm"
                variant="outline"
                onClick={stop}
                className="border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                <Square className="w-4 h-4 mr-1.5" /> Stop
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={start}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Play className="w-4 h-4 mr-1.5" /> Try it now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
