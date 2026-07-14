"use client";

// The Eleven Gates — the chapter list rendered as an ascending path.
// Completion state comes from the same /data/content-progress records the
// chapter reader writes, so finished chapters light up here automatically.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { trainingContentId } from "@/data/training-book";
import { cn } from "@/lib/utils/cn";
import { FadeUp } from "./reveal";

export interface Gate {
  number: number;
  slug: string;
  title: string;
  /** Verbatim description text from the Introduction's chapter list. */
  body: string;
  published: boolean;
  /** Chapter hero image, reused as gate art for a cohesive visual language. */
  image?: string;
}

export function ElevenGates({ gates }: { gates: Gate[] }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setCompleted(
          new Set(records.filter((r) => r.completed).map((r) => r.contentId))
        );
      })
      .catch(() => {}); // the path renders fine without progress
  }, []);

  // The first published, not-yet-completed gate is where the journey stands.
  const currentSlug = gates.find(
    (g) => g.published && !completed.has(trainingContentId(g.slug))
  )?.slug;

  return (
    <div className="relative">
      {/* Ascending spine */}
      <div
        aria-hidden="true"
        className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#DAA520]/70 via-[#DAA520]/30 to-[var(--color-border)]"
      />
      <ol className="space-y-8 sm:space-y-4">
        {gates.map((gate, i) => {
          const done = completed.has(trainingContentId(gate.slug));
          const current = gate.slug === currentSlug;
          const side = i % 2 === 0 ? "sm:pr-[calc(50%+2.5rem)]" : "sm:pl-[calc(50%+2.5rem)]";

          const card = (
            <div
              className={cn(
                "rounded-2xl border p-5 transition-all",
                done && "border-[#DAA520]/60 bg-gradient-to-br from-amber-50/80 to-white/60 shadow-[0_0_18px_rgba(218,165,32,0.15)]",
                current && "border-[var(--color-primary)] bg-[var(--color-card-bg)] shadow-lg shadow-orange-500/10",
                !done && !current && gate.published && "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[#DAA520]",
                !gate.published && "border-[var(--color-border)] bg-transparent opacity-70"
              )}
            >
              {gate.image && (
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl">
                  <Image
                    src={gate.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 480px"
                    className={cn(
                      "object-cover",
                      !gate.published && "opacity-60 saturate-50"
                    )}
                  />
                </div>
              )}
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
                Chapter {gate.number}
                {done && " · Completed"}
                {current && !done && " · You are here"}
                {!gate.published && " · Upcoming"}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold text-[var(--color-text-primary)] leading-snug">
                {gate.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {gate.body}
              </p>
              {gate.published && (
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                  {done ? "Revisit chapter" : current ? "Continue here" : "Read chapter"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </div>
          );

          return (
            <li key={gate.slug} className="relative">
              {/* Gate node on the spine */}
              <span
                className={cn(
                  "absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                  done
                    ? "border-[#DAA520] bg-gradient-to-br from-amber-300 to-[#DAA520] text-white shadow-[0_0_16px_rgba(218,165,32,0.5)]"
                    : current
                    ? "border-[var(--color-primary)] bg-[var(--color-bg-surface)] text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/15"
                    : gate.published
                    ? "border-[#DAA520]/50 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]"
                )}
                aria-hidden="true"
              >
                {done ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : gate.published ? (
                  gate.number
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </span>

              <FadeUp className={cn("pl-16 sm:pl-0", side)}>
                {gate.published ? (
                  <Link href={`/training/${gate.slug}`} className="block group">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </FadeUp>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
