"use client";

import { useEffect, useState } from "react";
import { Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// A simple countdown timer used by reflection steps that don't have a
// breath-based pace — silent sitting, healing visualization, metta,
// daily vision, etc. The component shows a guidance script above a
// circular progress ring; when the user presses Start the ring fills
// over `totalSeconds` and `onComplete` fires at zero. Mandatory mode
// is the contract that gates the parent step's "Yes" button.

export function TimerPractice({
  totalSeconds,
  label,
  guidance,
  mandatory,
  onComplete,
}: {
  totalSeconds: number;
  label?: string;
  guidance?: string;
  mandatory?: boolean;
  onComplete: () => void;
}) {
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [done, setDone] = useState(false);

  // Reference-only timers unlock immediately so the parent's Yes
  // doesn't stay disabled forever.
  useEffect(() => {
    if (!mandatory) onComplete();
  }, [mandatory, onComplete]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setActive(false);
          setDone(true);
          onComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, onComplete]);

  const elapsed = totalSeconds - secondsLeft;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  // SVG ring: radius 36, stroke 4 → circumference ~226 (2π·36)
  const R = 36;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress);

  const phaseLabel = !active && !done
    ? "Ready"
    : active
      ? "Practicing"
      : "Complete";

  return (
    <div className="my-5 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-5">
      {guidance && (
        <p className="text-sm text-violet-900 leading-relaxed mb-4">
          {guidance}
        </p>
      )}
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg
            viewBox="0 0 80 80"
            className="absolute inset-0 -rotate-90"
            aria-hidden
          >
            <circle cx="40" cy="40" r={R} className="fill-none stroke-violet-100" strokeWidth="4" />
            <circle
              cx="40"
              cy="40"
              r={R}
              className="fill-none stroke-violet-500 transition-all"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                strokeDasharray: C,
                strokeDashoffset: dashOffset,
                transitionDuration: "1s",
                transitionTimingFunction: "linear",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-violet-900 font-bold text-xl">
            {active || done ? secondsLeft : totalSeconds}
            <span className="text-xs text-violet-600 ml-0.5">s</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-violet-700 font-semibold">
            {phaseLabel}
          </p>
          <p className="text-sm font-semibold text-violet-900 mt-0.5">
            {label ?? `Sit for ${totalSeconds} seconds`}
          </p>
          <div className="mt-3">
            {!active && !done && (
              <Button
                size="sm"
                onClick={() => {
                  setSecondsLeft(totalSeconds);
                  setActive(true);
                }}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white"
              >
                <Play className="w-4 h-4 mr-1.5" /> Start practice
              </Button>
            )}
            {active && (
              <p className="text-sm font-semibold text-violet-800">
                Settle in… <span className="font-mono">{secondsLeft}s</span>
              </p>
            )}
            {done && (
              <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Practice complete
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
