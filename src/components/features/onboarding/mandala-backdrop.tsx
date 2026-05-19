"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Slow-rotating decorative mandala behind onboarding/dosha quiz steps.
 * Lives behind the content (negative z-index, low opacity) so it adds
 * atmosphere without competing with form inputs.
 */
export function MandalaBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden", className)}>
      <svg
        viewBox="-200 -200 400 400"
        className="w-[120%] max-w-[700px] aspect-square opacity-25 mandala-rotate"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="md-warm" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#FFB347" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>

        {/* Concentric circles */}
        {[180, 150, 120, 90, 60, 30].map((r) => (
          <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="url(#md-warm)" strokeWidth="1.2" opacity="0.55" />
        ))}

        {/* 16 petals, rotated */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (360 / 16) * i;
          return (
            <g key={i} transform={`rotate(${angle})`}>
              <path d="M 0 -30 Q -18 -90 0 -160 Q 18 -90 0 -30 Z" fill="none" stroke="url(#md-warm)" strokeWidth="1.4" />
            </g>
          );
        })}

        {/* 8 inner radial lines */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((a) => (
          <line key={a} x1="0" y1="-180" x2="0" y2="180"
                stroke="url(#md-warm)" strokeWidth="0.8" opacity="0.4"
                transform={`rotate(${a})`} />
        ))}

        {/* Center */}
        <circle cx="0" cy="0" r="20" fill="url(#md-warm)" opacity="0.5" />
      </svg>

      <style jsx>{`
        :global(.mandala-rotate) {
          animation: mandalaSlowSpin 90s linear infinite;
          transform-origin: center;
        }
        @keyframes mandalaSlowSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.mandala-rotate) { animation: none; }
        }
      `}</style>
    </div>
  );
}
