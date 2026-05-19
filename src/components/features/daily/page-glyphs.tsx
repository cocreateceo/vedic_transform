"use client";

/**
 * Small animated SVG glyphs used as page-hero accents on the daily-use
 * surfaces (Journal, Goals, Mood, Insights). All share the saffron palette
 * and a subtle breath animation so the system feels cohesive.
 */
import { cn } from "@/lib/utils/cn";

const GRAD = (
  <defs>
    <linearGradient id="dg-warm" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"  stopColor="#FFD27A" />
      <stop offset="55%" stopColor="#FF9933" />
      <stop offset="100%" stopColor="#C2410C" />
    </linearGradient>
    <radialGradient id="dg-aura" cx="50%" cy="50%" r="55%">
      <stop offset="0%"  stopColor="#FFE08A" stopOpacity="0.55" />
      <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const baseClass = "pillar-breathe"; // reuse the keyframes defined in pillar-hero.tsx

function Wrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-16 h-16 md:w-20 md:h-20 flex-shrink-0", className)}>
      <svg viewBox="-100 -100 200 200" className={cn("w-full h-full", baseClass)}>
        {GRAD}
        <circle cx="0" cy="0" r="90" fill="url(#dg-aura)" />
        {children}
      </svg>
    </div>
  );
}

/** Quill pen for Journal */
export function QuillGlyph({ className }: { className?: string }) {
  return (
    <Wrap className={className}>
      {/* Quill feather */}
      <path d="M -45 45 Q -10 -10 40 -55 Q 55 -50 45 -25 Q 5 5 -30 50 Q -45 55 -45 45 Z" fill="url(#dg-warm)" />
      {/* Quill stem highlight */}
      <line x1="-30" y1="50" x2="40" y2="-40" stroke="#FFE08A" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Ink drop */}
      <circle cx="-55" cy="55" r="6" fill="#C2410C" />
    </Wrap>
  );
}

/** Target with arrow for Goals */
export function TargetGlyph({ className }: { className?: string }) {
  return (
    <Wrap className={className}>
      <circle cx="0" cy="0" r="55" fill="none" stroke="url(#dg-warm)" strokeWidth="6" />
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#dg-warm)" strokeWidth="5" />
      <circle cx="0" cy="0" r="14" fill="url(#dg-warm)" />
      {/* Arrow */}
      <line x1="-65" y1="-65" x2="-10" y2="-10" stroke="#C2410C" strokeWidth="6" strokeLinecap="round" />
      <polygon points="-10,-10 -25,0 -20,-20 -10,-10" fill="#C2410C" />
    </Wrap>
  );
}

/** Mood orb (heart with face) */
export function MoodGlyph({ className }: { className?: string }) {
  return (
    <Wrap className={className}>
      <circle cx="0" cy="0" r="55" fill="url(#dg-warm)" />
      {/* Eyes */}
      <circle cx="-18" cy="-10" r="5" fill="#7C2D12" />
      <circle cx="18" cy="-10" r="5" fill="#7C2D12" />
      {/* Soft smile */}
      <path d="M -20 18 Q 0 35 20 18" fill="none" stroke="#7C2D12" strokeWidth="4" strokeLinecap="round" />
    </Wrap>
  );
}

/** Laurel-wreath trophy for Achievements */
export function TrophyGlyph({ className }: { className?: string }) {
  return (
    <Wrap className={className}>
      {/* Laurel wreath sides */}
      <path d="M -55 30 Q -75 0 -55 -30 Q -35 -10 -35 30 Z" fill="url(#dg-warm)" opacity="0.85" />
      <path d="M 55 30 Q 75 0 55 -30 Q 35 -10 35 30 Z" fill="url(#dg-warm)" opacity="0.85" />
      {/* Trophy cup */}
      <path d="M -30 -25 Q -30 30 0 35 Q 30 30 30 -25 Z" fill="url(#dg-warm)" />
      {/* Trophy base */}
      <rect x="-12" y="35" width="24" height="8" rx="2" fill="#7C2D12" />
      <rect x="-18" y="45" width="36" height="8" rx="3" fill="#7C2D12" />
      {/* Star inside cup */}
      <path d="M 0 -15 L 5 -3 L 18 -1 L 8 7 L 11 20 L 0 13 L -11 20 L -8 7 L -18 -1 L -5 -3 Z" fill="#FFF7C2" />
    </Wrap>
  );
}

/** Lightbulb spark for Insights */
export function InsightGlyph({ className }: { className?: string }) {
  return (
    <Wrap className={className}>
      {/* Bulb */}
      <path d="M -25 -10 Q -35 -55 0 -65 Q 35 -55 25 -10 Q 15 15 0 20 Q -15 15 -25 -10 Z" fill="url(#dg-warm)" />
      {/* Filament glow */}
      <circle cx="0" cy="-30" r="10" fill="#FFF7C2" />
      {/* Base */}
      <rect x="-15" y="20" width="30" height="10" rx="3" fill="#7C2D12" />
      <rect x="-12" y="32" width="24" height="6" rx="2" fill="#7C2D12" />
      {/* Sparkles */}
      <circle cx="-55" cy="-40" r="3" fill="#FFE08A" />
      <circle cx="50" cy="-50" r="3" fill="#FFE08A" />
      <circle cx="-60" cy="0" r="2.5" fill="#FFE08A" />
      <circle cx="55" cy="-5" r="2.5" fill="#FFE08A" />
    </Wrap>
  );
}
