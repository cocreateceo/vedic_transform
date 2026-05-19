"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Per-dosha animated SVG glyphs ──────────────────────────────────────────

const GRAD = (
  <defs>
    <linearGradient id="dv-vata"  x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#7DD3FC" /><stop offset="100%" stopColor="#0369A1" />
    </linearGradient>
    <linearGradient id="dv-pitta" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FED7AA" /><stop offset="55%" stopColor="#F97316" /><stop offset="100%" stopColor="#9A3412" />
    </linearGradient>
    <linearGradient id="dv-kapha" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#86EFAC" /><stop offset="100%" stopColor="#15803D" />
    </linearGradient>
  </defs>
);

function GlyphWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={cn("w-full h-full pillar-breathe", className)}>
      {GRAD}
      {children}
    </svg>
  );
}

/** Vata — wind swirls */
export function VataGlyph({ className }: { className?: string }) {
  return (
    <GlyphWrap className={className}>
      <path d="M -70 -20 Q 0 -50 70 -20" fill="none" stroke="url(#dv-vata)" strokeWidth="8" strokeLinecap="round" />
      <path d="M -60 10 Q 0 -20 60 10"   fill="none" stroke="url(#dv-vata)" strokeWidth="8" strokeLinecap="round" />
      <path d="M -50 40 Q 0 10 50 40"    fill="none" stroke="url(#dv-vata)" strokeWidth="8" strokeLinecap="round" />
      {/* Small drifting circles */}
      <circle cx="-40" cy="-50" r="5" fill="#7DD3FC" opacity="0.8" />
      <circle cx="55" cy="-35" r="4" fill="#7DD3FC" opacity="0.7" />
      <circle cx="0" cy="65" r="6" fill="#7DD3FC" opacity="0.6" />
    </GlyphWrap>
  );
}

/** Pitta — flame */
export function PittaGlyph({ className }: { className?: string }) {
  return (
    <GlyphWrap className={className}>
      <path
        d="M 0 -70 Q 30 -30 25 10 Q 20 50 0 65 Q -20 50 -25 10 Q -30 -30 0 -70 Z"
        fill="url(#dv-pitta)"
      />
      {/* Inner brighter flame */}
      <path d="M 0 -45 Q 12 -20 10 5 Q 7 30 0 40 Q -7 30 -10 5 Q -12 -20 0 -45 Z" fill="#FFE08A" opacity="0.85" />
      {/* Core */}
      <ellipse cx="0" cy="20" rx="6" ry="14" fill="#FFF7C2" />
    </GlyphWrap>
  );
}

/** Kapha — water droplet */
export function KaphaGlyph({ className }: { className?: string }) {
  return (
    <GlyphWrap className={className}>
      <path d="M 0 -70 Q 35 -10 35 25 Q 35 65 0 65 Q -35 65 -35 25 Q -35 -10 0 -70 Z" fill="url(#dv-kapha)" />
      {/* Highlight */}
      <ellipse cx="-12" cy="-10" rx="8" ry="22" fill="#FFFFFF" opacity="0.35" />
      {/* Ripple */}
      <path d="M -55 70 Q 0 78 55 70" fill="none" stroke="#15803D" strokeWidth="2.5" opacity="0.5" />
    </GlyphWrap>
  );
}

// ─── "Listen" button used on the result page ────────────────────────────────

interface DoshaListenButtonProps {
  dosha: "vata" | "pitta" | "kapha";
}

export function DoshaListenButton({ dosha }: DoshaListenButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => () => {
    const a = audioRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch {} }
  }, []);

  const toggle = () => {
    if (isPlaying && audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.currentTime = 0; } catch {}
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    const a = new Audio(`/audio/dosha/result-${dosha}.mp3`);
    a.volume = 0.95;
    a.onended = () => setIsPlaying(false);
    a.onerror = () => setIsPlaying(false);
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    audioRef.current = a;
  };

  return (
    <Button onClick={toggle} variant="outline" className="inline-flex items-center gap-2">
      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      {isPlaying ? "Stop reading" : "Listen to your reading"}
      <Volume2 className="w-4 h-4 opacity-60" />
    </Button>
  );
}

// ─── Landing-page intro listen button ───────────────────────────────────────

export function DoshaIntroListenButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => () => {
    const a = audioRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch {} }
  }, []);

  const toggle = () => {
    if (isPlaying && audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.currentTime = 0; } catch {}
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    const a = new Audio("/audio/dosha/intro.mp3");
    a.volume = 0.95;
    a.onended = () => setIsPlaying(false);
    a.onerror = () => setIsPlaying(false);
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    audioRef.current = a;
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
    >
      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      <span className="text-sm font-medium">
        {isPlaying ? "Stop intro" : "Listen to introduction"}
      </span>
      <Volume2 className="w-4 h-4 opacity-70" />
    </button>
  );
}
