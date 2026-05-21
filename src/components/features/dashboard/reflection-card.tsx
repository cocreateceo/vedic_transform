"use client";

// Phase-transition reflection card. Fires on days 8, 15, 22, 31, 41, 49
// (+2 day window each), shows a narrative summary of the phase just
// walked. Inherits the entering phase's tone so it visually anchors to
// where the user is, not where they were.

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  computeWeeklyReflection,
  type PhaseReflection,
} from "@/lib/weekly-reflection";

interface ReflectionCardProps {
  currentDay: number;
  startDate: string | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkins: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moodLogs: any[];
}

export function ReflectionCard({
  currentDay,
  startDate,
  checkins,
  moodLogs,
}: ReflectionCardProps) {
  const [reflection, setReflection] = useState<PhaseReflection | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const r = computeWeeklyReflection({
      currentDay,
      startDate,
      checkins,
      moodLogs,
    });
    if (!r) {
      setReflection(null);
      return;
    }
    try {
      if (typeof window !== "undefined" && localStorage.getItem(r.dismissKey)) {
        setDismissed(true);
      } else {
        setDismissed(false);
      }
    } catch {
      // localStorage unavailable — show by default rather than swallow.
      setDismissed(false);
    }
    setReflection(r);
  }, [currentDay, startDate, checkins, moodLogs]);

  if (!reflection || dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(reflection.dismissKey, "1");
    } catch {
      // Best-effort; if localStorage fails we just hide for this session.
    }
    setDismissed(true);
  };

  const { phaseEnded, currentPhase, observations } = reflection;

  return (
    <Card
      className={cn(
        "border-2 overflow-hidden",
        currentPhase.tone,
      )}
    >
      <CardContent className="p-5 relative">
        <button
          onClick={handleDismiss}
          aria-label="Hide reflection"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/60 hover:bg-white text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
          Phase complete · {phaseEnded.name}
        </p>

        <h3 className="text-lg font-semibold mt-1 leading-snug">
          A look back at the past phase
        </h3>

        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
          {observations.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="opacity-50 select-none">·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {currentPhase.id !== "completed" ? (
          <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
            <ArrowRight className="w-4 h-4" />
            <span>
              Continuing into{" "}
              <span className="font-semibold">{currentPhase.name}</span> —{" "}
              {currentPhase.description}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-sm opacity-90">
            The mandala is complete. Reflect, rest, and consider what comes next.
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            Continue to today
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
