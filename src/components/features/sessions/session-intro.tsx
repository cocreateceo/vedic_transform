"use client";

// Reusable "Intro" front-end for guided sessions — the full why-and-how
// briefing a real teacher gives before a practice begins. Renders a hero
// (ambient video), the purpose, the benefits, what you'll feel, a setup
// checklist, a tradition note and any caution, then a Begin button that hands
// off to the session's Setup/Practice UI.
//
// Content lives in ./session-intros.ts so all nine briefings sit in one place.

import { Button } from "@/components/ui/button";
import { Play, Clock, Check, Sparkles, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PexelsVideo } from "@/components/ui/pexels-video";

export interface SessionIntroContent {
  /** Sanskrit / tradition eyebrow line, e.g. "Dhyana · ध्यान". */
  eyebrow?: string;
  title: string;
  /** Lead sentence(s): what this practice is and does. */
  why: string;
  /** Concrete benefits — shown as a checked list. */
  benefits: string[];
  /** "What you'll feel / experience" — a short highlighted callout. */
  feel?: string;
  /** Ordered "how to set up" cues (posture, gaze, breath, etc.). */
  setup: string[];
  /** Short note on the practice's roots in the tradition. */
  tradition?: string;
  /** Caution / contraindication, surfaced in an amber note. */
  caution?: string;
  /** Format/duration chip, e.g. "5–30 min · seated". */
  formatLabel?: string;
  /** Ambient video slug for the hero (PexelsVideo). */
  mediaSlug?: string;
  beginLabel?: string;
  /** Use light text for dark/gradient backgrounds. */
  light?: boolean;
}

export interface SessionIntroProps extends SessionIntroContent {
  onBegin: () => void;
}

export function SessionIntro({
  eyebrow,
  title,
  why,
  benefits,
  feel,
  setup,
  tradition,
  caution,
  formatLabel,
  mediaSlug,
  beginLabel = "Begin",
  onBegin,
  light = false,
}: SessionIntroProps) {
  const muted = light ? "text-white/70" : "text-[var(--color-text-secondary)]";
  const body = light ? "text-white/85" : "text-[var(--color-text-primary)]";

  return (
    <div className="flex flex-col items-center gap-6 py-6 w-full max-w-lg mx-auto">
      {/* Hero */}
      <div
        className={cn(
          "relative w-full h-44 rounded-2xl overflow-hidden flex items-end",
          light ? "bg-white/10" : "bg-orange-50",
        )}
      >
        {mediaSlug && (
          <PexelsVideo slug={mediaSlug} showAttribution={false} className="absolute inset-0 w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <div className="relative z-10 p-4">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/85">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-bold text-white drop-shadow">{title}</h2>
        </div>
      </div>

      {/* Why */}
      <p className={cn("text-base leading-relaxed text-center", light ? "text-white/85" : "text-[var(--color-text-secondary)]")}>
        {why}
      </p>

      {/* Benefits */}
      <div className="w-full">
        <p className={cn("text-xs font-semibold uppercase tracking-widest mb-2", muted)}>
          Why it helps
        </p>
        <ul className="space-y-1.5">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className={cn("w-4 h-4 mt-0.5 shrink-0", light ? "text-amber-300" : "text-orange-500")} />
              <span className={cn("text-sm leading-snug", body)}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What you'll feel */}
      {feel && (
        <div
          className={cn(
            "w-full rounded-xl px-4 py-3 flex items-start gap-2.5",
            light ? "bg-white/10 border border-white/20" : "bg-amber-50 border border-amber-100",
          )}
        >
          <Sparkles className={cn("w-4 h-4 mt-0.5 shrink-0", light ? "text-amber-300" : "text-amber-600")} />
          <p className={cn("text-sm leading-snug", body)}>
            <span className="font-semibold">What you&apos;ll feel — </span>
            {feel}
          </p>
        </div>
      )}

      {/* How / setup */}
      <div className="w-full">
        <p className={cn("text-xs font-semibold uppercase tracking-widest mb-2", muted)}>
          Before you begin
        </p>
        <ol className="space-y-2">
          {setup.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={cn(
                  "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  light ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700",
                )}
              >
                {i + 1}
              </span>
              <span className={cn("text-sm leading-snug", body)}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tradition note */}
      {tradition && (
        <div className="w-full flex items-start gap-2.5">
          <Info className={cn("w-4 h-4 mt-0.5 shrink-0", muted)} />
          <p className={cn("text-xs italic leading-snug", muted)}>{tradition}</p>
        </div>
      )}

      {/* Caution */}
      {caution && (
        <div
          className={cn(
            "w-full rounded-xl px-4 py-3 flex items-start gap-2.5",
            light ? "bg-amber-500/15 border border-amber-300/30" : "bg-amber-50 border border-amber-200",
          )}
        >
          <AlertTriangle className={cn("w-4 h-4 mt-0.5 shrink-0", light ? "text-amber-300" : "text-amber-600")} />
          <p className={cn("text-xs leading-snug", light ? "text-amber-100" : "text-amber-800")}>{caution}</p>
        </div>
      )}

      {formatLabel && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
            light ? "bg-white/15 text-white/85 border border-white/25" : "bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          {formatLabel}
        </span>
      )}

      <Button size="lg" onClick={onBegin} className="min-w-[200px]">
        <Play className="w-5 h-5 mr-2" />
        {beginLabel}
      </Button>
    </div>
  );
}
