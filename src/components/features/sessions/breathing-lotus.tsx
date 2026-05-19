"use client";

import { cn } from "@/lib/utils/cn";

interface BreathingLotusProps {
  /**
   * 0 = closed bud (fully exhaled), 1 = fully open (fully inhaled).
   * Smoothly interpolated by the parent based on breath progress.
   */
  openness: number;
  /** Tints petals based on phase: in (cyan), hold (orange), out (amber). */
  phase: "in" | "hold" | "out" | "idle";
  className?: string;
}

/**
 * Animated lotus that opens on inhale, holds at full bloom, and closes on
 * exhale. Pure inline SVG — no external assets, no animation library. The
 * parent drives `openness` and `phase` so the lotus stays perfectly in sync
 * with the breathing pattern timer rather than running an independent CSS
 * loop.
 */
export function BreathingLotus({ openness, phase, className }: BreathingLotusProps) {
  // Petal rotation outward (in degrees). 0 = closed bud, ~22 = fully open.
  const petalSpread = 22 * openness;
  // Petal scale: opens slightly bigger at full bloom.
  const petalScale = 0.85 + 0.25 * openness;
  // Center glow intensity.
  const glowOpacity = 0.4 + 0.5 * openness;

  const palette = (() => {
    switch (phase) {
      case "in":   return { core: "#22d3ee", edge: "#0891b2", aura: "rgba(34,211,238,0.35)" };
      case "hold": return { core: "#fb923c", edge: "#c2410c", aura: "rgba(251,146,60,0.30)" };
      case "out":  return { core: "#fbbf24", edge: "#b45309", aura: "rgba(251,191,36,0.30)" };
      default:     return { core: "#d1d5db", edge: "#6b7280", aura: "rgba(156,163,175,0.20)" };
    }
  })();

  // 8 outer petals, 8 inner petals (rotated 22.5°).
  const outerAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const innerAngles = outerAngles.map((a) => a + 22.5);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="-150 -150 300 300"
        className="w-full h-full"
        role="img"
        aria-label={`Lotus, ${phase === "idle" ? "resting" : phase}`}
      >
        <defs>
          <radialGradient id="lotusPetal" cx="50%" cy="35%" r="70%">
            <stop offset="0%"   stopColor={palette.core} stopOpacity="0.95" />
            <stop offset="65%"  stopColor={palette.core} stopOpacity="0.85" />
            <stop offset="100%" stopColor={palette.edge} stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id="lotusAura" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor={palette.aura} />
            <stop offset="70%"  stopColor={palette.aura.replace(/,[\d.]+\)$/, ",0.1)")} />
            <stop offset="100%" stopColor={palette.aura.replace(/,[\d.]+\)$/, ",0)")} />
          </radialGradient>
        </defs>

        {/* Outer aura — pulses with breath */}
        <circle cx="0" cy="0" r="135" fill="url(#lotusAura)" style={{ transition: "opacity 0.3s" }} opacity={glowOpacity} />

        {/* Outer ring of 8 petals */}
        {outerAngles.map((angle) => (
          <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
            <path
              d="M 0 -10 Q -28 -60 0 -120 Q 28 -60 0 -10 Z"
              fill="url(#lotusPetal)"
              stroke={palette.edge}
              strokeWidth="1"
              opacity="0.9"
              style={{
                transform: `rotate(${-petalSpread}deg) scale(${petalScale})`,
                transformOrigin: "0 0",
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </g>
        ))}

        {/* Inner ring of 8 petals (offset 22.5°, slightly smaller) */}
        {innerAngles.map((angle) => (
          <g key={`inner-${angle}`} transform={`rotate(${angle})`}>
            <path
              d="M 0 -8 Q -18 -40 0 -85 Q 18 -40 0 -8 Z"
              fill="url(#lotusPetal)"
              stroke={palette.edge}
              strokeWidth="1"
              opacity="0.95"
              style={{
                transform: `rotate(${-petalSpread * 0.6}deg) scale(${petalScale})`,
                transformOrigin: "0 0",
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </g>
        ))}

        {/* Center bud — grows brighter at full bloom */}
        <circle cx="0" cy="0" r={14 + 8 * openness} fill={palette.core} />
        <circle cx="0" cy="0" r={6 + 4 * openness} fill="#fff" opacity={0.4 + 0.4 * openness} />
      </svg>
    </div>
  );
}
