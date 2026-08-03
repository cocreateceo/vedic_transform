"use client";

// The briefing every guided session opens with.
//
// It used to render the whole teacher's briefing before the Begin button —
// hero, purpose, benefits, what you'll feel, setup checklist, tradition note,
// caution, duration chip, and only then the button. Measured, that put Start
// 1,256px down on desktop and 1,536px down on mobile: you scrolled nearly two
// phone screens before you could start a five-minute practice.
//
// Same content, reordered around the decision. What you need to choose to
// start — what this is, how long, and the safety note — is above the button.
// The rest is one tap away, with its size stated so nothing feels hidden.
//
// Fourteen of the fifteen sessions render through here, so this shape is the
// Sessions experience.
//
// Content lives in ./session-intros.ts so all the briefings sit in one place.

import { Button } from "@/components/ui/button";
import { Play, Check, Sparkles, Info, AlertTriangle, ChevronDown } from "lucide-react";
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

/**
 * A collapsed section of the briefing.
 *
 * `count` is the point: a summary that states its own size reads as "four more
 * things, when you want them", not as content that has gone missing.
 */
function Disclosure({
  label,
  count,
  light,
  children,
}: {
  label: string;
  count?: number;
  light: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-t border-current/10 py-3">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 text-[13.5px] font-medium",
          light ? "text-white/85" : "text-[var(--color-text-primary)]",
        )}
      >
        <span>
          {label}
          {count !== undefined && (
            <span className={light ? "text-white/50" : "text-[var(--color-text-muted)]"}>
              {" · "}
              {count}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
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
  const muted = light ? "text-white/60" : "text-[var(--color-text-muted)]";
  const body = light ? "text-white/85" : "text-[var(--color-text-primary)]";

  return (
    <div className={cn("mx-auto w-full max-w-xl", light && "text-white")}>
      {/* Ambient identity, kept to a band — and dropped entirely on phones,
          which is exactly where the scroll-to-start problem was worst. */}
      {mediaSlug && (
        <div className="relative mb-6 hidden h-24 w-full overflow-hidden rounded-xl sm:block">
          <PexelsVideo
            slug={mediaSlug}
            showAttribution={false}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Masthead: what this is, and how long it takes. */}
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.22em]",
          light ? "text-amber-200/85" : "text-[#B8860B]",
        )}
      >
        {eyebrow}
        {eyebrow && formatLabel ? " · " : ""}
        {formatLabel}
      </p>
      <h2
        className={cn(
          "mt-2.5 text-2xl font-bold leading-tight sm:text-3xl",
          light ? "text-white" : "text-[var(--color-text-primary)]",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-3 text-[15px] leading-relaxed",
          light ? "text-white/80" : "text-[var(--color-text-secondary)]",
        )}
      >
        {why}
      </p>

      {/* The decision. Nothing optional sits above it. */}
      <Button size="lg" onClick={onBegin} className="mt-6 w-full sm:w-auto sm:min-w-[220px]">
        <Play className="w-5 h-5 mr-2" />
        {beginLabel}
      </Button>

      {/* Safety never collapses. */}
      {caution && (
        <div
          className={cn(
            "mt-5 flex items-start gap-2.5 rounded-xl px-4 py-3",
            light
              ? "border border-amber-300/30 bg-amber-500/15"
              : "border border-amber-200 bg-amber-50",
          )}
        >
          <AlertTriangle
            className={cn("mt-0.5 h-4 w-4 shrink-0", light ? "text-amber-300" : "text-amber-600")}
          />
          <p className={cn("text-xs leading-snug", light ? "text-amber-100" : "text-amber-800")}>
            {caution}
          </p>
        </div>
      )}

      {/* Everything a teacher would still say, one tap away. */}
      <div className="mt-6">
        <Disclosure label="Why it helps" count={benefits.length} light={light}>
          <ul className="space-y-1.5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    light ? "text-amber-300" : "text-orange-500",
                  )}
                />
                <span className={cn("text-sm leading-snug", body)}>{b}</span>
              </li>
            ))}
          </ul>
        </Disclosure>

        <Disclosure label="Before you begin" count={setup.length} light={light}>
          <ol className="space-y-2">
            {setup.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    light ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700",
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn("text-sm leading-snug", body)}>{s}</span>
              </li>
            ))}
          </ol>
        </Disclosure>

        {feel && (
          <Disclosure label="What you'll feel" light={light}>
            <div className="flex items-start gap-2.5">
              <Sparkles
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  light ? "text-amber-300" : "text-amber-600",
                )}
              />
              <p className={cn("text-sm leading-snug", body)}>{feel}</p>
            </div>
          </Disclosure>
        )}

        {tradition && (
          <Disclosure label="In the tradition" light={light}>
            <div className="flex items-start gap-2.5">
              <Info className={cn("mt-0.5 h-4 w-4 shrink-0", muted)} />
              <p className={cn("text-xs italic leading-snug", muted)}>{tradition}</p>
            </div>
          </Disclosure>
        )}
      </div>
    </div>
  );
}
