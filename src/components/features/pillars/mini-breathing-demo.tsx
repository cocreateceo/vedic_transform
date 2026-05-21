"use client";

import { useEffect, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inline breathing pacer used inside a reflection step. When a step's
// description says "inhale 4 seconds, exhale 6 seconds", a static
// sentence isn't enough — the user needs to actually try the pattern
// before they can honestly say whether they did it today. This widget
// gives them that practice in place: a pulsing circle that grows on
// inhale, holds (optional), and shrinks on exhale, with a per-second
// countdown and a visible round counter.

export type BreathPattern = {
  inhaleSeconds: number;
  holdSeconds?: number;
  exhaleSeconds: number;
  rounds?: number;
};

type Phase = "idle" | "inhale" | "hold" | "exhale";

function phaseAt(
  t: number,
  p: BreathPattern,
): { phase: Phase; secondsLeft: number; round: number } {
  const cycle = p.inhaleSeconds + (p.holdSeconds ?? 0) + p.exhaleSeconds;
  const totalRounds = p.rounds ?? 3;
  if (t >= cycle * totalRounds) return { phase: "idle", secondsLeft: 0, round: 0 };
  const round = Math.floor(t / cycle) + 1;
  const within = t % cycle;
  if (within < p.inhaleSeconds)
    return { phase: "inhale", secondsLeft: p.inhaleSeconds - within, round };
  const ih = p.inhaleSeconds + (p.holdSeconds ?? 0);
  if (within < ih) return { phase: "hold", secondsLeft: ih - within, round };
  return { phase: "exhale", secondsLeft: cycle - within, round };
}

export function MiniBreathingDemo({ pattern }: { pattern: BreathPattern }) {
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const rounds = pattern.rounds ?? 3;
  const cycleSec =
    pattern.inhaleSeconds + (pattern.holdSeconds ?? 0) + pattern.exhaleSeconds;
  const totalSec = cycleSec * rounds;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= totalSec) {
          setActive(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, totalSec]);

  const { phase, secondsLeft, round } = active
    ? phaseAt(elapsed, pattern)
    : ({ phase: "idle" as Phase, secondsLeft: 0, round: 0 });

  const start = () => {
    setElapsed(0);
    setActive(true);
  };
  const stop = () => {
    setActive(false);
    setElapsed(0);
  };

  const scale =
    phase === "inhale" || phase === "hold"
      ? 1.3
      : phase === "exhale"
        ? 0.8
        : 1.0;
  const duration =
    phase === "inhale"
      ? pattern.inhaleSeconds
      : phase === "exhale"
        ? pattern.exhaleSeconds
        : 0.3;

  const patternLabel = pattern.holdSeconds
    ? `${pattern.inhaleSeconds} in · hold ${pattern.holdSeconds} · ${pattern.exhaleSeconds} out`
    : `${pattern.inhaleSeconds} in · ${pattern.exhaleSeconds} out`;
  const phaseLabel =
    phase === "idle"
      ? "Ready"
      : phase === "inhale"
        ? "Breathe in"
        : phase === "hold"
          ? "Hold"
          : "Breathe out";

  return (
    <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 p-4 my-5">
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <div
            className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md ease-in-out"
            style={{
              transform: `scale(${scale})`,
              transitionProperty: "transform",
              transitionDuration: `${duration}s`,
              transitionTimingFunction: "ease-in-out",
            }}
          />
          <span className="relative text-white font-bold text-2xl drop-shadow-sm">
            {active ? secondsLeft : ""}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-cyan-700 font-semibold">
            Try the pattern
          </p>
          <p className="text-sm font-semibold text-cyan-900 mt-0.5">
            {patternLabel}
          </p>
          <p className="text-sm text-cyan-800 mt-1">
            {active ? (
              <>
                <span className="font-semibold">{phaseLabel}</span> · round{" "}
                {round} of {rounds}
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
                className="border-cyan-300 text-cyan-800 hover:bg-cyan-100"
              >
                <Square className="w-4 h-4 mr-1.5" /> Stop
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={start}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
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
