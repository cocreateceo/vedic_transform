"use client";

// A simple seated figure whose chest/belly expands on the inhale and settles
// on the exhale, driven by the same `openness` value as the lotus. A stock
// video can't sync to the user's chosen pattern, so this is drawn procedurally.

import { cn } from "@/lib/utils/cn";

export function BreathingFigure({
  openness,
  phase,
  className,
}: {
  /** 0 = fully exhaled, 1 = fully inhaled. */
  openness: number;
  phase: "in" | "hold" | "out" | "idle";
  className?: string;
}) {
  // Belly/chest radius grows from 18 → 30 across the breath.
  const r = 18 + openness * 12;
  const label = phase === "in" ? "Inhale" : phase === "out" ? "Exhale" : phase === "hold" ? "Hold" : "";
  const tint = phase === "in" ? "#22d3ee" : phase === "out" ? "#f59e0b" : phase === "hold" ? "#a855f7" : "#cbd5e1";

  return (
    <svg viewBox="0 0 140 120" className={cn("", className)} aria-label="Breathing guide figure">
      {/* head */}
      <circle cx="70" cy="22" r="11" fill="none" stroke={tint} strokeWidth="2.5" className="transition-colors duration-500" />
      {/* shoulders / arms resting on knees */}
      <path d="M70 33 C 48 40, 40 70, 44 92" fill="none" stroke={tint} strokeWidth="2.5" strokeLinecap="round" className="transition-colors duration-500" />
      <path d="M70 33 C 92 40, 100 70, 96 92" fill="none" stroke={tint} strokeWidth="2.5" strokeLinecap="round" className="transition-colors duration-500" />
      {/* crossed-leg base */}
      <path d="M40 96 Q 70 86 100 96 Q 70 110 40 96 Z" fill={tint} opacity="0.18" className="transition-colors duration-500" />
      {/* breathing belly — the part that animates */}
      <circle
        cx="70"
        cy="62"
        r={r}
        fill={tint}
        opacity="0.22"
        className="transition-colors duration-500"
        style={{ transition: "r 0.4s ease-out" }}
      />
      <circle
        cx="70"
        cy="62"
        r={r}
        fill="none"
        stroke={tint}
        strokeWidth="2"
        className="transition-colors duration-500"
        style={{ transition: "r 0.4s ease-out" }}
      />
      {label && (
        <text x="70" y="66" textAnchor="middle" fontSize="9" fontWeight="700" fill={tint} className="transition-colors duration-500">
          {label}
        </text>
      )}
    </svg>
  );
}
