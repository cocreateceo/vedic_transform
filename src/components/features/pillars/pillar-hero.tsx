"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PexelsImage } from "@/components/ui/pexels-image";
import { PexelsVideo } from "@/components/ui/pexels-video";

// Pillar slugs that have a curated ambient video backdrop. Anything not in
// this map falls back to the still photo backdrop already wired below.
const PILLAR_VIDEO: Record<string, string> = {
  "morning-initiation":   "morning-ambient",
  "breathing-meditation": "breathing-ambient",
  "healing-meditation":   "meditation-ambient",
  "movement":             "movement-ambient",
  "brahman-connection":   "starry-night",
  "sleep-optimization":   "candle-flame",
};

/**
 * Per-pillar hero — thematic animated SVG plus a "Listen" button that plays
 * the CEO intro cue for this pillar.
 *
 * One component for all 11 pillars to keep the maintenance surface small.
 * Each pillar gets a distinctive symbol: the design language is consistent
 * (saffron palette, soft glow, gentle motion) so the system reads as one.
 */
interface PillarHeroProps {
  slug: string;
  title: string;
  sanskritName: string;
  className?: string;
}

export function PillarHero({ slug, title, sanskritName, className }: PillarHeroProps) {
  const audioSrc = `/audio/pillars/${slug}.mp3`;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop on unmount so the cue doesn't leak across navigation.
  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) { try { a.pause(); a.currentTime = 0; } catch {} }
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (isPlaying && a) {
      try { a.pause(); a.currentTime = 0; } catch {}
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(audioSrc);
    audio.volume = 0.9;
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    audioRef.current = audio;
  };

  return (
    <div className={cn(
      "relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100",
      "border border-orange-100 p-6 md:p-8",
      className,
    )}>
      {/* Backdrop — prefer the curated ambient video for this pillar; fall
          back to a still Pexels photo otherwise. Either way the SVG glyph
          stays the visual lead. */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        {PILLAR_VIDEO[slug] ? (
          <PexelsVideo slug={PILLAR_VIDEO[slug]} showAttribution={false} className="w-full h-full" />
        ) : (
          <PexelsImage
            slug={`pillar-${slug}`}
            className="[&_figcaption]:hidden w-full h-full"
          />
        )}
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-6">
        {/* SVG illustration */}
        <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
          <PillarSymbol slug={slug} />
        </div>

        {/* Title + intro listen */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm uppercase tracking-wider text-orange-600 font-semibold">
            {sanskritName}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mt-1">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-3 max-w-md mx-auto md:mx-0">
            Listen to a short introduction from your guide before you begin.
          </p>
          <Button
            onClick={toggle}
            size="sm"
            variant="outline"
            className="mt-4 inline-flex items-center gap-2"
          >
            {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Stop" : "Listen"}
            <Volume2 className="w-4 h-4 opacity-60" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Dispatch to a distinctive SVG glyph per pillar. Each glyph is small and
 * shares the saffron / amber palette so the set feels cohesive. All glyphs
 * use a soft "breathe" CSS animation defined at the bottom of this file.
 */
function PillarSymbol({ slug }: { slug: string }) {
  switch (slug) {
    case "morning-initiation":   return <GlyphSunrise />;
    case "nutrition-fasting":    return <GlyphBowl />;
    case "thoughts-intention":   return <GlyphMind />;
    case "breathing-meditation": return <GlyphLotus />;
    case "movement":             return <GlyphFigure />;
    case "healing-meditation":   return <GlyphHeartLotus />;
    case "gratitude":            return <GlyphHands />;
    case "sandhya-meditation":   return <GlyphTripleSun />;
    case "brahman-connection":   return <GlyphOm />;
    case "divine-manifestation": return <GlyphStar />;
    case "sleep-optimization":   return <GlyphMoon />;
    default:                     return <GlyphLotus />;
  }
}

// ─── Shared palette and base svg ────────────────────────────────────────────
function BaseGradient() {
  return (
    <defs>
      <linearGradient id="pg-warm" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor="#FFD27A" />
        <stop offset="55%" stopColor="#FF9933" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <radialGradient id="pg-aura" cx="50%" cy="50%" r="55%">
        <stop offset="0%"  stopColor="#FFE08A" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

const wrap = "w-full h-full pillar-breathe";

function GlyphSunrise() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <line key={a} x1={Math.cos(a*Math.PI/180)*-60} y1={Math.sin(a*Math.PI/180)*-60}
              x2={Math.cos(a*Math.PI/180)*60} y2={Math.sin(a*Math.PI/180)*60}
              stroke="#FFE08A" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round"
              transform="translate(0 30)" />
      ))}
      <path d="M -80 30 Q -40 -45 0 -45 Q 40 -45 80 30 Z" fill="url(#pg-warm)" />
      <line x1="-95" y1="30" x2="95" y2="30" stroke="#7C2D12" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

function GlyphBowl() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Bowl */}
      <path d="M -70 0 Q -70 60 0 60 Q 70 60 70 0 Z" fill="url(#pg-warm)" />
      {/* Fruits on top */}
      <circle cx="-30" cy="-5" r="18" fill="#F87171" />
      <circle cx="5" cy="-15" r="20" fill="#FBBF24" />
      <circle cx="35" cy="-5" r="16" fill="#22C55E" />
      {/* Steam */}
      <path d="M -20 -30 q 5 -10 10 0 q 5 10 -10 20" fill="none" stroke="#FFE08A" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M 15 -35 q 5 -10 10 0 q 5 10 -10 20" fill="none" stroke="#FFE08A" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function GlyphMind() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Mandala lines through brain */}
      <circle cx="0" cy="0" r="55" fill="none" stroke="url(#pg-warm)" strokeWidth="4" />
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#pg-warm)" strokeWidth="3" />
      <circle cx="0" cy="0" r="18" fill="url(#pg-warm)" />
      {[0, 45, 90, 135].map((a) => (
        <line key={a} x1={Math.cos(a*Math.PI/180)*-60} y1={Math.sin(a*Math.PI/180)*-60}
              x2={Math.cos(a*Math.PI/180)*60} y2={Math.sin(a*Math.PI/180)*60}
              stroke="#C2410C" strokeWidth="2" strokeOpacity="0.6" />
      ))}
    </svg>
  );
}

function GlyphLotus() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 -10 Q -22 -45 0 -75 Q 22 -45 0 -10 Z" fill="url(#pg-warm)" opacity="0.9" />
        </g>
      ))}
      <circle cx="0" cy="0" r="14" fill="#FFF7C2" />
      <circle cx="0" cy="0" r="7" fill="#FFB347" />
    </svg>
  );
}

function GlyphFigure() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Surya Namaskar pose silhouette */}
      <circle cx="0" cy="-55" r="14" fill="url(#pg-warm)" />
      {/* Torso */}
      <path d="M -10 -40 Q -15 0 -5 30 L 5 30 Q 15 0 10 -40 Z" fill="url(#pg-warm)" />
      {/* Arms raised */}
      <path d="M -8 -38 Q -45 -55 -50 -85" stroke="url(#pg-warm)" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M 8 -38 Q 45 -55 50 -85" stroke="url(#pg-warm)" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <path d="M -5 30 L -25 75" stroke="url(#pg-warm)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 5 30 L 25 75" stroke="url(#pg-warm)" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

function GlyphHeartLotus() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Heart shape */}
      <path d="M 0 50 C -50 10, -70 -25, -40 -45 C -20 -55, -5 -45, 0 -25 C 5 -45, 20 -55, 40 -45 C 70 -25, 50 10, 0 50 Z"
        fill="url(#pg-warm)" />
      {/* Lotus petals coming out */}
      <path d="M 0 -25 Q -10 -55 0 -75 Q 10 -55 0 -25 Z" fill="#FFE08A" />
      <circle cx="0" cy="-25" r="6" fill="#FFF7C2" />
    </svg>
  );
}

function GlyphHands() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Two open palms forming a bowl */}
      <path d="M -75 -10 Q -55 50 -10 55 Q 5 30 -10 5 Q -25 -5 -45 -15 Q -65 -25 -75 -10 Z" fill="url(#pg-warm)" />
      <path d="M 75 -10 Q 55 50 10 55 Q -5 30 10 5 Q 25 -5 45 -15 Q 65 -25 75 -10 Z" fill="url(#pg-warm)" />
      {/* Light rising from palms */}
      <circle cx="0" cy="20" r="14" fill="#FFF7C2" opacity="0.95" />
      <circle cx="0" cy="-10" r="22" fill="#FFE08A" opacity="0.55" />
    </svg>
  );
}

function GlyphTripleSun() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Three suns: dawn (low-left), noon (top), dusk (low-right) */}
      <circle cx="-55" cy="30" r="18" fill="url(#pg-warm)" />
      <circle cx="0" cy="-40" r="22" fill="url(#pg-warm)" />
      <circle cx="55" cy="30" r="18" fill="url(#pg-warm)" />
      {/* Connecting horizon arc */}
      <path d="M -75 35 Q 0 -70 75 35" fill="none" stroke="url(#pg-warm)" strokeWidth="3" opacity="0.65" />
    </svg>
  );
}

function GlyphOm() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Stylized Om-like figure: large 3 shape with crescent and dot */}
      <path
        d="M -30 -25 Q -55 -25 -55 5 Q -55 35 -25 35 Q -5 35 5 20 Q 10 30 30 30 Q 55 30 55 5 Q 55 -25 25 -25 Q 10 -25 5 -10 Q 0 -25 -30 -25 Z"
        fill="url(#pg-warm)"
      />
      {/* Crescent above */}
      <path d="M -10 -45 Q 0 -60 10 -45" fill="none" stroke="url(#pg-warm)" strokeWidth="5" strokeLinecap="round" />
      {/* Bindu dot */}
      <circle cx="0" cy="-65" r="6" fill="url(#pg-warm)" />
    </svg>
  );
}

function GlyphStar() {
  // 8-pointed sparkle star
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      <path d="M 0 -75 L 15 -15 L 75 0 L 15 15 L 0 75 L -15 15 L -75 0 L -15 -15 Z"
            fill="url(#pg-warm)" />
      <circle cx="0" cy="0" r="14" fill="#FFF7C2" />
    </svg>
  );
}

function GlyphMoon() {
  return (
    <svg viewBox="-100 -100 200 200" className={wrap}>
      <BaseGradient />
      <circle cx="0" cy="0" r="90" fill="url(#pg-aura)" />
      {/* Crescent moon */}
      <path d="M 25 -55 a 55 55 0 1 0 0 110 a 40 40 0 1 1 0 -110 Z" fill="url(#pg-warm)" />
      {/* Stars */}
      <circle cx="-45" cy="-40" r="3" fill="#FFE08A" />
      <circle cx="-30" cy="20" r="2" fill="#FFE08A" />
      <circle cx="-55" cy="5" r="2.5" fill="#FFE08A" />
      <circle cx="-65" cy="-15" r="1.8" fill="#FFE08A" />
    </svg>
  );
}

// Shared subtle breathe animation. Imported here so the styled-jsx scope
// lives next to the component using it.
export function PillarHeroStyles() {
  return (
    <style jsx global>{`
      .pillar-breathe {
        animation: pillarBreathe 6s ease-in-out infinite;
        transform-origin: center;
      }
      @keyframes pillarBreathe {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.04); }
      }
      @media (prefers-reduced-motion: reduce) {
        .pillar-breathe { animation: none; }
      }
    `}</style>
  );
}
