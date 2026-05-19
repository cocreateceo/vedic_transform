"use client";

import { cn } from "@/lib/utils/cn";

interface SunriseIllustrationProps {
  className?: string;
}

/**
 * Sunrise rising over a distant horizon with radiating rays — the visual
 * anchor for Brahma Muhurta / Wake Up. Pure inline SVG + CSS keyframes,
 * subtle so it can sit behind text.
 */
export function SunriseIllustration({ className }: SunriseIllustrationProps) {
  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 240 160" className="w-full h-full" role="img" aria-label="Sun rising over the horizon">
        <defs>
          {/* Sky wash */}
          <linearGradient id="sunriseSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFE4B5" />
            <stop offset="40%"  stopColor="#FFB07A" />
            <stop offset="80%"  stopColor="#FF8A4C" />
            <stop offset="100%" stopColor="#FF6F2E" />
          </linearGradient>
          {/* Sun core */}
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFF7C2" />
            <stop offset="55%"  stopColor="#FFD166" />
            <stop offset="100%" stopColor="#F4A431" />
          </radialGradient>
          {/* Halo */}
          <radialGradient id="sunHalo" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="#FFE08A" stopOpacity="0.55" />
            <stop offset="60%"  stopColor="#FFB347" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky background */}
        <rect x="0" y="0" width="240" height="120" fill="url(#sunriseSky)" rx="14" />

        {/* Distant horizon hills */}
        <path d="M 0 120 Q 60 90 120 105 Q 180 120 240 95 L 240 120 Z" fill="#8B5A2B" opacity="0.45" />
        <path d="M 0 120 Q 50 100 110 115 Q 170 130 240 110 L 240 120 Z" fill="#3E2A14" opacity="0.55" />

        {/* Sun rays — gently rotating */}
        <g className="sunrise-rays" style={{ transformOrigin: "120px 120px" }}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <line
              key={a}
              x1="120" y1="120"
              x2={120 + Math.cos((a - 90) * Math.PI / 180) * 70}
              y2={120 + Math.sin((a - 90) * Math.PI / 180) * 70}
              stroke="#FFE08A"
              strokeWidth="2"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Sun halo + core — rising slightly with a slow drift */}
        <g className="sunrise-rise">
          <circle cx="120" cy="125" r="55" fill="url(#sunHalo)" />
          <circle cx="120" cy="125" r="28" fill="url(#sunCore)" />
        </g>

        {/* Subtle ground line */}
        <line x1="0" y1="120" x2="240" y2="120" stroke="#3E2A14" strokeWidth="1" opacity="0.4" />

        {/* Faint birds in flight */}
        <path d="M 50 50 q 6 -5 12 0 q 6 -5 12 0" fill="none" stroke="#3E2A14" strokeWidth="1.5" opacity="0.45" />
        <path d="M 170 38 q 5 -4 10 0 q 5 -4 10 0" fill="none" stroke="#3E2A14" strokeWidth="1.5" opacity="0.4" />
      </svg>

      <style jsx>{`
        :global(.sunrise-rays) {
          animation: sunRayRotate 60s linear infinite;
        }
        :global(.sunrise-rise) {
          animation: sunRise 6s ease-in-out infinite alternate;
        }
        @keyframes sunRayRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sunRise {
          0%   { transform: translateY(2px); }
          100% { transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.sunrise-rays), :global(.sunrise-rise) { animation: none; }
        }
      `}</style>
    </div>
  );
}
