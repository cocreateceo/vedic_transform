// The "you are here" chapter card, shared by the training landing and the
// dashboard's teaching card so both surfaces name the same chapter the same way.
//
// Every number comes from authored content in src/data/training-book.ts.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ListChecks, MessageCircleQuestion } from "lucide-react";
import {
  chapterReadMinutes,
  type TrainingChapter,
} from "@/data/training-book";
import { SERIF_CLASS } from "@/lib/fonts";

export function CurrentChapterCard({
  chapter,
  eyebrow,
  ctaLabel,
  href,
  compact = false,
}: {
  chapter: TrainingChapter;
  eyebrow: string;
  ctaLabel: string;
  href: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group grid overflow-hidden rounded-3xl border-2 border-[var(--color-primary)] bg-[var(--color-bg-surface)] shadow-lg shadow-orange-500/10 transition-shadow hover:shadow-xl ${
        compact ? "sm:grid-cols-[200px_1fr]" : "sm:grid-cols-[280px_1fr]"
      }`}
    >
      <div className="relative aspect-[16/9] sm:aspect-auto sm:min-h-full">
        <Image
          src={chapter.posterImage ?? chapter.image}
          alt=""
          fill
          sizes={
            compact
              ? "(max-width: 640px) 100vw, 200px"
              : "(max-width: 640px) 100vw, 280px"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={compact ? "space-y-2 p-5" : "space-y-2.5 p-5 sm:p-6"}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          {eyebrow}
        </p>
        <h3
          className={`${SERIF_CLASS} font-semibold leading-snug text-[var(--color-text-primary)] ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          {chapter.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {chapter.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {chapterReadMinutes(chapter)} min read
          </span>
          {chapter.exercises && chapter.exercises.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              {chapter.exercises.length} practices
            </span>
          )}
          {chapter.reflectionQuestions &&
            chapter.reflectionQuestions.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <MessageCircleQuestion className="h-3.5 w-3.5" />
                {chapter.reflectionQuestions.length} reflections
              </span>
            )}
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow shadow-orange-500/25">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
