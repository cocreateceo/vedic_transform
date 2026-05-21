"use client";

// 48-segment mandala ring. One segment per day. Lit segments = days
// completed; current day pulses. The strongest visual metaphor for the
// 48-day arc — gives the journey shape at a glance.
//
// Renders as compact SVG (svgSize=120 by default). Pure presentational —
// caller supplies currentDay (1-based, clamped) and completedDays[] of
// 1-based day indices that have any check-in.

import { useId, useMemo } from "react";
import { getJourneyPhase } from "@/lib/journey-phases";

const TOTAL_SEGMENTS = 48;

interface MandalaProgressProps {
  /** 1..48 — the user's current journey day. 0 = not started. */
  currentDay: number;
  /** Sorted ascending; 1-based; days the user has at least one check-in. */
  completedDays: number[];
  /** Outer SVG square size in px. Default 120 (compact dashboard chip). */
  size?: number;
  /** Optional className applied to the wrapping <svg>. */
  className?: string;
  /** Pass false to suppress the inner day label (for tiny renderings). */
  showDayLabel?: boolean;
}

export function MandalaProgress({
  currentDay,
  completedDays,
  size = 120,
  className,
  showDayLabel = true,
}: MandalaProgressProps) {
  const id = useId();
  const completedSet = useMemo(() => new Set(completedDays), [completedDays]);
  const phase = getJourneyPhase(currentDay);

  // Geometry — concentric ring of 48 wedges
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;
  const innerR = outerR - Math.max(6, size * 0.09);
  const gap = (Math.PI * 2) / TOTAL_SEGMENTS * 0.12; // ~12% of arc as gap

  const segments = useMemo(() => {
    const out: { d: string; day: number; done: boolean; current: boolean }[] = [];
    const step = (Math.PI * 2) / TOTAL_SEGMENTS;
    // Start at top (12 o'clock) and go clockwise
    const startOffset = -Math.PI / 2;
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      const day = i + 1;
      const a0 = startOffset + i * step + gap / 2;
      const a1 = startOffset + (i + 1) * step - gap / 2;
      const x0o = cx + outerR * Math.cos(a0);
      const y0o = cy + outerR * Math.sin(a0);
      const x1o = cx + outerR * Math.cos(a1);
      const y1o = cy + outerR * Math.sin(a1);
      const x0i = cx + innerR * Math.cos(a1);
      const y0i = cy + innerR * Math.sin(a1);
      const x1i = cx + innerR * Math.cos(a0);
      const y1i = cy + innerR * Math.sin(a0);
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const d = [
        `M ${x0o} ${y0o}`,
        `A ${outerR} ${outerR} 0 ${large} 1 ${x1o} ${y1o}`,
        `L ${x0i} ${y0i}`,
        `A ${innerR} ${innerR} 0 ${large} 0 ${x1i} ${y1i}`,
        "Z",
      ].join(" ");
      out.push({
        d,
        day,
        done: completedSet.has(day),
        current: day === currentDay,
      });
    }
    return out;
  }, [cx, cy, outerR, innerR, gap, completedSet, currentDay]);

  const gradientId = `mandala-grad-${id}`;
  const currentGradientId = `mandala-current-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Mandala progress: Day ${currentDay} of ${TOTAL_SEGMENTS}, phase ${phase.name}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id={currentGradientId}>
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>

      {segments.map((s) => (
        <path
          key={s.day}
          d={s.d}
          fill={
            s.current
              ? `url(#${currentGradientId})`
              : s.done
                ? `url(#${gradientId})`
                : "var(--color-border, #E5E7EB)"
          }
          opacity={s.current ? 1 : s.done ? 0.95 : 0.35}
          className={s.current ? "mandala-current-pulse" : undefined}
        />
      ))}

      {showDayLabel && (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.18}
            fontWeight="700"
            fill="var(--color-text-primary, #111827)"
          >
            {Math.max(0, Math.min(TOTAL_SEGMENTS, currentDay))}
          </text>
          <text
            x={cx}
            y={cy + size * 0.13}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.08}
            fill="var(--color-text-secondary, #6B7280)"
          >
            of {TOTAL_SEGMENTS}
          </text>
        </>
      )}

      <style>{`
        .mandala-current-pulse {
          animation: mandala-pulse 2.4s ease-in-out infinite;
          transform-origin: ${cx}px ${cy}px;
        }
        @keyframes mandala-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </svg>
  );
}
