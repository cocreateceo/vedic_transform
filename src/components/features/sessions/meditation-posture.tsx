"use client";

import { cn } from "@/lib/utils/cn";

interface MeditationPostureProps {
  /** When true, the figure breathes (gentle 8s in/out cycle). When false, holds still. */
  breathing?: boolean;
  className?: string;
}

/**
 * Stylized sukhasana (cross-legged) seated meditation posture.
 *
 * Pure inline SVG + CSS keyframes — no runtime cost, scales sharp at any size,
 * matches the orange/amber palette of the rest of the meditation surface.
 *
 * Breathing: the torso and surrounding aura inhale/exhale on an 8-second cycle
 * (4s in, 4s out — slow pranayama pace). The aura pulses in sync to give a
 * "presence" feel without the figure looking like it's moving wildly.
 */
export function MeditationPosture({ breathing = false, className }: MeditationPostureProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 240 200"
        className="w-full h-full max-h-[200px]"
        role="img"
        aria-label="Cross-legged seated meditation posture (sukhasana)"
      >
        <defs>
          {/* Warm saffron gradient for the figure */}
          <linearGradient id="postureFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFB873" />
            <stop offset="60%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          {/* Soft outer aura */}
          <radialGradient id="postureAura" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="#FFB873" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#FF9933" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Aura — pulses in sync with breath */}
        <ellipse
          cx="120"
          cy="110"
          rx="100"
          ry="85"
          fill="url(#postureAura)"
          className={breathing ? "posture-aura-breathe" : ""}
          style={{ transformOrigin: "120px 110px" }}
        />

        {/* Cross-legged base (two triangular knee shapes joining at the seat) */}
        <path
          d="M 60 175 Q 75 140 120 142 Q 165 140 180 175 Q 175 178 120 178 Q 65 178 60 175 Z"
          fill="url(#postureFill)"
          opacity="0.85"
        />
        {/* Subtle inner shadow on legs for depth */}
        <path
          d="M 95 168 Q 110 152 120 152 Q 130 152 145 168 Z"
          fill="#000"
          opacity="0.08"
        />

        {/* Torso group — scales gently to imply breathing */}
        <g
          className={breathing ? "posture-torso-breathe" : ""}
          style={{ transformOrigin: "120px 130px", transformBox: "fill-box" }}
        >
          {/* Torso (egg/teardrop shape, narrow at top) */}
          <path
            d="M 120 70 Q 95 78 92 110 Q 90 135 120 142 Q 150 135 148 110 Q 145 78 120 70 Z"
            fill="url(#postureFill)"
          />
          {/* Head */}
          <circle cx="120" cy="55" r="18" fill="url(#postureFill)" />
          {/* Neck (subtle) */}
          <rect x="115" y="69" width="10" height="6" fill="#D97706" opacity="0.55" />

          {/* Arms — curved from shoulders down to hands resting on knees */}
          <path
            d="M 98 92 Q 78 115 80 138 Q 82 144 92 142"
            stroke="url(#postureFill)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 142 92 Q 162 115 160 138 Q 158 144 148 142"
            stroke="url(#postureFill)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />

          {/* Chin-mudra hand dots (where thumbs meet index fingers, resting on knees) */}
          <circle cx="88" cy="142" r="4" fill="#D97706" opacity="0.7" />
          <circle cx="152" cy="142" r="4" fill="#D97706" opacity="0.7" />
        </g>
      </svg>

      <style jsx>{`
        :global(.posture-torso-breathe) {
          animation: postureTorsoBreathe 8s ease-in-out infinite;
        }
        :global(.posture-aura-breathe) {
          animation: postureAuraBreathe 8s ease-in-out infinite;
          transform-box: fill-box;
        }
        @keyframes postureTorsoBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes postureAuraBreathe {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.posture-torso-breathe),
          :global(.posture-aura-breathe) {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
