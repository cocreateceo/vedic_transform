"use client";

// The chapter opening, in two forms.
//
// A returning reader gets a masthead: back link, one metadata line, the title.
// Three lines, then straight into the activity. That is the whole header — the
// spine below carries progress, so nothing here restates it.
//
// A reader who has not started the chapter gets the ceremony instead: the
// pre-dawn hero with its ambient loop and epigraph, ending in one button into
// the chapter. It is met once. After the first activity lands it is replaced
// by the masthead, and it returns only if progress is reset.

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { SERIF_CLASS } from "@/lib/fonts";
import { Mandala } from "../intro/mandala";
import { useChapterProgressContext } from "./chapter-progress-context";

export function ChapterOpening({
  chapterNumber,
  title,
  subtitle,
  readMinutes,
  movements,
  totalActivities,
  pillarName,
  sanskrit,
  translation,
  ambient,
  poster,
}: {
  chapterNumber: number;
  title: string;
  subtitle?: string;
  readMinutes: number;
  movements: number;
  totalActivities: number;
  pillarName?: string;
  sanskrit: string;
  translation: string;
  ambient: string;
  poster: string;
}) {
  const { loaded, completedCount } = useChapterProgressContext();
  const cinematic = loaded && completedCount === 0;

  if (cinematic) {
    return (
      <section className="relative -mx-4 overflow-hidden bg-[#0C0F22] text-center sm:-mx-6 lg:-mx-8">
        <video
          src={ambient}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0F22] via-[#0C0F22]/70 to-[#2A1B0E]/80" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(218,165,32,0.28),transparent_65%)]" />
        <Mandala className="absolute left-1/2 top-1/2 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 text-[#DAA520] opacity-[0.08]" />

        <Link
          href="/training"
          className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 text-sm font-medium text-amber-100/70 transition-colors hover:text-amber-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Training
        </Link>

        <div className="relative z-10 mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
            Chapter {chapterNumber} · {readMinutes} min read · {movements}{" "}
            movements · {totalActivities} activities
          </p>
          <p className={`${SERIF_CLASS} text-lg italic text-amber-100/60`}>
            {sanskrit} — {translation}
          </p>
          <h1
            className={`${SERIF_CLASS} text-4xl font-semibold leading-[1.08] text-amber-50 sm:text-5xl lg:text-6xl`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-base tracking-wide text-amber-100/80 sm:text-lg">
              {subtitle}
            </p>
          )}
          <a
            href="#chapter-panel"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition-shadow hover:shadow-xl"
          >
            Begin the chapter
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </section>
    );
  }

  return (
    <header className="border-b border-[#DAA520]/20 pb-6">
      <Link
        href="/training"
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#B8860B]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Training
      </Link>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
        Chapter {chapterNumber} · {readMinutes} min · {totalActivities}{" "}
        activities
        {pillarName ? ` · ${pillarName}` : ""}
      </p>
      <h1
        className={`${SERIF_CLASS} mt-3 max-w-3xl text-3xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-4xl`}
      >
        {title}
      </h1>
    </header>
  );
}
