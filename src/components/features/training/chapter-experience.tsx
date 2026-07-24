// Published numbered chapters rendered as the same ceremonial journey the
// Introduction opens with: pre-dawn darkness (ambient video hero) → daylight
// prose → a night interlude (pull-quote) → golden sunrise closing.
//
// All reader-facing prose comes verbatim from the chapter data in
// src/data/training-book.ts. Interlude quotes are verbatim lines pulled from
// the chapter's own sections; only short structural labels are authored here.

import Image from "next/image";
import Link from "next/link";
import { introSerif, SERIF_CLASS } from "@/lib/fonts";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  MessageCircleQuestion,
} from "lucide-react";
import {
  TrainingChapter,
  chapterReadMinutes,
  trainingContentId,
} from "@/data/training-book";
import { PILLARS } from "@/constants/pillars";
import { ChapterActions } from "@/app/(main)/training/[slug]/chapter-actions";
import { Mandala, LotusDivider } from "./intro/mandala";
import { FadeUp, Stagger, StaggerItem } from "./intro/reveal";
import { ChapterJourney } from "./chapter-journey";

const serif = introSerif;
const SERIF = SERIF_CLASS;

// Per-chapter ceremonial dressing: ambient loop, epigraph, and which verbatim
// line becomes the night-interlude pull-quote (and after which section).
const CEREMONY: Record<
  string,
  {
    ambient: string;
    sanskrit: string;
    translation: string;
    quote: string;
    quoteAfter: number; // section index the interlude follows
    featureLabel: string;
    closingLine: string;
  }
> = {
  "connect-to-the-universe": {
    ambient: "/training-media/ambient-copper-1.mp4",
    sanskrit: "तत् त्वम् असि",
    translation: "tat tvam asi — thou art That",
    quote:
      "Most people spend their lives trying to become something they already are.",
    quoteAfter: 4,
    featureLabel: "The way of connection",
    closingLine: "Remember who you are.",
  },
  "consciousness-and-self-awareness": {
    ambient: "/training-media/ambient-copper-2.mp4",
    sanskrit: "प्रज्ञानं ब्रह्म",
    translation: "prajñānam brahma — consciousness is Brahman",
    quote:
      "Self-awareness creates space between stimulus and response. Within that space lies wisdom.",
    quoteAfter: 5,
    featureLabel: "The way of awareness",
    closingLine: "Awareness is where it begins.",
  },
};

const DEFAULT_CEREMONY = {
  ambient: "/training-media/ambient-diya.mp4",
  sanskrit: "तमसो मा ज्योतिर्गमय",
  translation: "from darkness, lead me to light",
  quote: "",
  quoteAfter: -1,
  featureLabel: "In this chapter",
  closingLine: "Carry this chapter into your day.",
};

export function ChapterExperience({
  chapter,
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
}: {
  chapter: TrainingChapter;
  prevSlug?: string;
  prevTitle?: string;
  nextSlug?: string;
  nextTitle?: string;
}) {
  const ceremony = CEREMONY[chapter.slug] ?? DEFAULT_CEREMONY;
  const readMinutes = chapterReadMinutes(chapter);
  const pillar = PILLARS.find((p) => p.slug === chapter.relatedPillarSlug);
  const sections = chapter.sections ?? [];

  return (
    <div
      className={`${serif.variable} -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 overflow-hidden`}
    >
      {/* ————— Opening: pre-dawn ————— */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#0C0F22] px-6 py-20 text-center">
        <video
          src={ceremony.ambient}
          poster={chapter.image}
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
          className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 text-sm font-medium text-amber-100/70 transition-colors hover:text-amber-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Training
        </Link>

        <div className="relative z-10 max-w-3xl space-y-8">
          <FadeUp>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
              Chapter {chapter.number} · {readMinutes} min read
            </p>
            <p className={`${SERIF} mt-4 text-lg italic text-amber-100/60`}>
              {ceremony.sanskrit} — {ceremony.translation}
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <h1
              className={`${SERIF} text-4xl font-semibold leading-[1.08] text-amber-50 sm:text-6xl lg:text-[4.25rem]`}
            >
              {chapter.title}
            </h1>
          </FadeUp>
          {chapter.subtitle && (
            <FadeUp delay={0.3}>
              <p className="text-base tracking-wide text-amber-100/80 sm:text-lg">
                {chapter.subtitle}
              </p>
            </FadeUp>
          )}
          <FadeUp delay={0.45}>
            <a
              href="#opening"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition-shadow hover:shadow-xl hover:shadow-orange-900/50"
            >
              Enter the Chapter
              <ArrowRight className="h-4 w-4" />
            </a>
          </FadeUp>
        </div>

        <a
          href="#opening"
          aria-label="Scroll to the chapter"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-amber-200/60 transition-colors hover:text-amber-200 motion-safe:animate-bounce"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* ————— Daylight body ————— */}
      <div className="relative bg-[var(--color-bg-primary)] px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(218,165,32,0.14),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-5xl">
          {sections.map((section, i) => (
            <div key={section.heading}>
              <section
                id={i === 0 ? "opening" : undefined}
                className={`scroll-mt-8 ${i === 0 ? "pt-20 sm:pt-28" : "pt-14 sm:pt-16"} pb-4`}
              >
                <FadeUp className="mx-auto max-w-[44rem]">
                  <h2
                    className={`${SERIF} text-center text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                  >
                    {section.heading}
                  </h2>
                  <div className="mt-8 space-y-5 text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
                    {section.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </FadeUp>
              </section>

              {/* Feature card after the second section: chapter art + framing */}
              {i === 1 && (
                <FadeUp className="pt-12">
                  <div className="grid overflow-hidden rounded-3xl border border-[#DAA520]/50 bg-gradient-to-br from-[#FFF9F0] via-amber-50/60 to-orange-50/40 md:grid-cols-[2fr_3fr]">
                    <div className="relative min-h-64 md:min-h-full">
                      <Image
                        src={chapter.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative overflow-hidden p-8 sm:p-12">
                      <Mandala className="absolute -right-24 -top-24 h-96 w-96 text-[#DAA520] opacity-[0.1]" />
                      <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                        {ceremony.featureLabel}
                      </p>
                      <p className="relative mt-4 max-w-[42rem] text-xl leading-[1.7] text-[#3d3223] sm:text-2xl">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              )}

              {/* Lotus breath between narrative movements */}
              {i > 0 && i < sections.length - 1 && (i + 1) % 3 === 0 && i !== ceremony.quoteAfter && (
                <LotusDivider />
              )}

              {/* Night interlude: the chapter's own words, held up to the dark */}
              {i === ceremony.quoteAfter && ceremony.quote && (
                <div className="-mx-4 pt-16 sm:-mx-6 lg:-mx-8">
                  <section className="relative overflow-hidden bg-[#0C0F22] px-6 py-24 text-center sm:py-32">
                    <Mandala className="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 text-[#DAA520] opacity-[0.07]" />
                    <FadeUp className="relative z-10 mx-auto max-w-3xl">
                      <p
                        className={`${SERIF} text-2xl italic leading-snug text-amber-50 sm:text-3xl lg:text-4xl`}
                      >
                        “{ceremony.quote}”
                      </p>
                    </FadeUp>
                  </section>
                </div>
              )}
            </div>
          ))}

          <LotusDivider />

          {/* Daily Practices */}
          {chapter.exercises && chapter.exercises.length > 0 && (
            <section className="py-16 sm:py-20">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  Daily Practices
                </h2>
                <p className="mt-4 text-[16px] text-[var(--color-text-secondary)]">
                  Small daily acts that carry this chapter into your life.
                </p>
              </FadeUp>

              {chapter.sectionArt?.exercises && (
                <FadeUp className="mt-10">
                  <div className="relative h-44 overflow-hidden rounded-3xl sm:h-56">
                    <Image
                      src={chapter.sectionArt.exercises}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 960px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B0E]/50 to-transparent" />
                  </div>
                </FadeUp>
              )}

              <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {chapter.exercises.map((ex, i) => (
                  <StaggerItem key={ex.title}>
                    <div className="h-full rounded-3xl border border-[#DAA520]/35 bg-[var(--color-bg-surface)] p-6 transition-all hover:-translate-y-1 hover:border-[#DAA520] hover:shadow-[0_8px_30px_rgba(218,165,32,0.15)]">
                      <span
                        className={`${SERIF} flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-lg font-semibold text-[#B8860B]`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`${SERIF} mt-4 text-xl font-semibold text-[var(--color-text-primary)]`}
                      >
                        {ex.title}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {ex.steps.map((step, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-[15px] leading-relaxed text-[var(--color-text-primary)]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DAA520]" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          )}

          <LotusDivider />

          {/* Reflections */}
          {chapter.reflectionQuestions &&
            chapter.reflectionQuestions.length > 0 && (
              <section className="py-16 sm:py-20">
                <FadeUp>
                  <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#DAA520]/40 bg-[var(--color-bg-surface)]">
                    {chapter.sectionArt?.reflections && (
                      <div className="relative h-40 sm:h-48">
                        <Image
                          src={chapter.sectionArt.reflections}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="p-7 sm:p-10">
                      <h2
                        className={`${SERIF} flex items-center gap-3 text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl`}
                      >
                        <MessageCircleQuestion className="h-6 w-6 text-[#B8860B]" />
                        Sit With These Questions
                      </h2>
                      <ol className="mt-6 space-y-4">
                        {chapter.reflectionQuestions.map((q, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                              {i + 1}
                            </span>
                            <span
                              className={`${SERIF} text-lg italic leading-relaxed text-[var(--color-text-primary)]`}
                            >
                              {q}
                            </span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-6 text-sm text-[var(--color-text-muted)]">
                        Take these into your{" "}
                        <Link
                          href="/journal"
                          className="text-[var(--color-primary)] underline"
                        >
                          journal
                        </Link>{" "}
                        for deeper reflection.
                      </p>
                    </div>
                  </div>
                </FadeUp>
              </section>
            )}

          <LotusDivider />

          {/* The learning cycle: practice, reflect, validate, transform */}
          <ChapterJourney
            chapter={chapter}
            nextSlug={nextSlug}
            nextTitle={nextTitle}
          />
        </div>
      </div>

      {/* ————— Sunrise closing ————— */}
      <section className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
        {chapter.sectionArt?.summary && (
          <Image
            src={chapter.sectionArt.summary}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[#FDEBC8]/80 to-[#F5C063]/55" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(ellipse_at_bottom,rgba(255,153,51,0.4),transparent_70%)]" />
        <Mandala className="absolute left-1/2 bottom-[-40vmin] h-[100vmin] w-[100vmin] -translate-x-1/2 text-[#8B6914] opacity-[0.1]" />
        <FadeUp className="relative z-10 mx-auto max-w-2xl space-y-8">
          {chapter.summary && (
            <div className="space-y-5 text-left text-[17px] leading-[1.8] text-[#3d3223] sm:text-center">
              {chapter.summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          <h2
            className={`${SERIF} text-4xl font-semibold leading-tight text-[#2A1B0E] sm:text-5xl`}
          >
            {ceremony.closingLine}
          </h2>
          {nextSlug ? (
            <Link
              href={`/training/${nextSlug}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
            >
              Continue to {nextTitle ?? "the next chapter"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/training"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
            >
              Back to Training
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </FadeUp>
      </section>

      {/* Pillar link + progress, consistent with the rest of the book */}
      <div className="bg-[var(--color-bg-primary)] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 pt-6">
          {pillar && (
            <Link
              href={`/pillars/${pillar.slug}`}
              className="vedic-card group flex items-center justify-between p-4 transition-colors hover:border-[#DAA520]"
            >
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Deepen this chapter with daily practice
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                  {pillar.name} pillar
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
            </Link>
          )}
          <ChapterActions
            contentId={trainingContentId(chapter.slug)}
            prevSlug={prevSlug}
            prevTitle={prevTitle}
            nextSlug={nextSlug}
            nextTitle={nextTitle}
          />
        </div>
      </div>
    </div>
  );
}
