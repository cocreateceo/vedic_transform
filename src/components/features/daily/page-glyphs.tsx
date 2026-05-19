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

/** Per-badge category glyphs used in the achievements grid.
 *  Each one is sized to fit inside the existing 14x14 (h-14 w-14) badge
 *  tile and uses a single-colour fill so the earned / locked styling
 *  (color + opacity) is controlled by the parent.
 */
function MiniWrap({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full" style={{ color }}>
      <g fill="currentColor" stroke="currentColor">{children}</g>
    </svg>
  );
}

/** Streak — flame */
export function StreakBadgeGlyph({ color = "currentColor" }: { color?: string }) {
  return (
    <MiniWrap color={color}>
      <path
        d="M 0 -40 Q 18 -16 14 8 Q 12 28 0 36 Q -12 28 -14 8 Q -18 -16 0 -40 Z"
        strokeWidth="2"
      />
      <ellipse cx="0" cy="14" rx="5" ry="11" fill="white" opacity="0.55" stroke="none" />
    </MiniWrap>
  );
}

/** Milestone — target with rising sun */
export function MilestoneBadgeGlyph({ color = "currentColor" }: { color?: string }) {
  return (
    <MiniWrap color={color}>
      <circle cx="0" cy="0" r="30" fill="none" strokeWidth="3" />
      <circle cx="0" cy="0" r="18" fill="none" strokeWidth="3" />
      <circle cx="0" cy="0" r="7" stroke="none" />
      <path d="M -38 -36 L -14 -12" strokeWidth="4" strokeLinecap="round" />
      <polygon points="-14,-12 -22,-7 -19,-19" stroke="none" />
    </MiniWrap>
  );
}

/** Mastery — lotus star (4 petals + center) */
export function MasteryBadgeGlyph({ color = "currentColor" }: { color?: string }) {
  return (
    <MiniWrap color={color}>
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 -8 Q -14 -25 0 -42 Q 14 -25 0 -8 Z" stroke="none" />
        </g>
      ))}
      {[45, 135, 225, 315].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 -6 Q -10 -20 0 -34 Q 10 -20 0 -6 Z" stroke="none" opacity="0.7" />
        </g>
      ))}
      <circle cx="0" cy="0" r="8" stroke="none" />
      <circle cx="0" cy="0" r="4" fill="white" stroke="none" />
    </MiniWrap>
  );
}

/** Special — sparkle burst */
export function SpecialBadgeGlyph({ color = "currentColor" }: { color?: string }) {
  return (
    <MiniWrap color={color}>
      <path d="M 0 -42 L 6 -8 L 42 0 L 6 8 L 0 42 L -6 8 L -42 0 L -6 -8 Z" stroke="none" />
      <circle cx="0" cy="0" r="6" fill="white" stroke="none" />
      <circle cx="-30" cy="-22" r="2" stroke="none" />
      <circle cx="28" cy="24" r="2.5" stroke="none" />
      <circle cx="-26" cy="22" r="1.5" stroke="none" />
      <circle cx="30" cy="-20" r="2" stroke="none" />
    </MiniWrap>
  );
}

/** Dispatch helper — pick the right glyph by category. */
export function BadgeGlyphForCategory({ category, color }: { category: string; color?: string }) {
  switch (category) {
    case "streak":    return <StreakBadgeGlyph color={color} />;
    case "milestone": return <MilestoneBadgeGlyph color={color} />;
    case "mastery":   return <MasteryBadgeGlyph color={color} />;
    default:          return <SpecialBadgeGlyph color={color} />;
  }
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
