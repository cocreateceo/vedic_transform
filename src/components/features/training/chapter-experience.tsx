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
import { FadeUp } from "./intro/reveal";
import { ChapterJourney } from "./chapter-journey";
import { ChapterAccordion } from "./chapter-accordion";
import { CinematicLesson } from "./cinematic-lesson";
import { CyclePill } from "./cycle-pill";
import { PosterGrid } from "./poster-grid";
import { PracticeCards } from "./practice-cards";

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
  // Story artwork stays with its section — inside that section's accordion
  // panel. Study cards group into one compact Chapter Gallery, except the
  // overview card, which anchors the snapshot.
  const storyArtFor = (h: string) =>
    (chapter.gallery ?? []).filter((m) => m.section === h);
  const accordionSections = sections.map((sec) => ({
    heading: sec.heading,
    paragraphs: sec.paragraphs,
    art: storyArtFor(sec.heading),
  }));
  const snapshotCard = (chapter.studyCards ?? []).find(
    (c) => c.section === "@lesson",
  );
  const galleryCards = (chapter.studyCards ?? []).filter(
    (c) => c.section !== "@lesson",
  );
  const cycleStepKeys = [
    "read",
    ...(chapter.lessonVideoId ? ["watch"] : []),
    ...(chapter.keyTakeaways?.length ? ["takeaways"] : []),
    ...(chapter.exercises?.length ? ["practice"] : []),
    ...(chapter.meditationMinutes ? ["meditation"] : []),
    ...(chapter.reflectionQuestions?.length ? ["reflection"] : []),
    ...(chapter.quiz?.length ? ["quiz"] : []),
    ...(chapter.dailyChallenge ? ["challenge"] : []),
  ];

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

      {/* ————— The cinematic lesson: night gives way to the teaching ————— */}
      {chapter.lessonVideoId && (
        <section className="relative bg-gradient-to-b from-[#0C0F22] to-[var(--color-bg-primary)] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <FadeUp>
              <p className="pt-8 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200/80">
                The cinematic lesson
              </p>
              <div className="mt-6">
                <CinematicLesson
                  videoId={chapter.lessonVideoId}
                  title={chapter.title}
                />
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ————— Daylight body: snapshot → teaching → gallery → practice ————— */}
      <div className="relative bg-[var(--color-bg-primary)] px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(218,165,32,0.14),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-5xl">
          {/* Chapter snapshot: the whole chapter at a glance */}
          <section id="opening" className="scroll-mt-8 pt-10 sm:pt-14">
            <FadeUp>
              <div className="grid overflow-hidden rounded-3xl border border-[#DAA520]/40 bg-[var(--color-bg-surface)] md:grid-cols-[2fr_3fr]">
                <a
                  href={snapshotCard?.src ?? chapter.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block min-h-56 bg-[#0C0F22] md:min-h-full"
                >
                  <Image
                    src={snapshotCard?.src ?? chapter.image}
                    alt={snapshotCard?.title ?? chapter.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
                <div className="p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                    Chapter snapshot
                  </p>
                  <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-text-primary)]">
                    {chapter.description}
                  </p>
                  {chapter.keyTakeaways && chapter.keyTakeaways.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {chapter.keyTakeaways.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-[14px] leading-snug text-[var(--color-text-secondary)]"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DAA520]" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-[#B8860B]">
                    <span>{readMinutes} min read</span>
                    {chapter.lessonVideoId && <span>· Cinematic lesson</span>}
                    <a href="#cycle" className="underline underline-offset-2">
                      · {cycleStepKeys.length}-step learning cycle ↓
                    </a>
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>

          {/* The teaching — every section intact, revealed one at a time */}
          <section className="pt-12 sm:pt-16">
            <FadeUp className="mx-auto max-w-[44rem] text-center">
              <h2
                className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
              >
                The Teaching
              </h2>
              <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
                {sections.length} movements — open each one when you are ready
                for it. The stories&apos; artwork lives inside.
              </p>
            </FadeUp>
            <div className="mt-8">
              <ChapterAccordion sections={accordionSections} />
            </div>
          </section>

          {/* Night interlude: the chapter's own words, held up to the dark */}
          {ceremony.quote && (
            <div className="-mx-4 pt-12 sm:-mx-6 sm:pt-16 lg:-mx-8">
              <section className="relative overflow-hidden bg-[#0C0F22] px-6 py-16 text-center sm:py-20">
                <Mandala className="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 text-[#DAA520] opacity-[0.07]" />
                <FadeUp className="relative z-10 mx-auto max-w-3xl">
                  <p
                    className={`${SERIF} text-2xl italic leading-snug text-amber-50 sm:text-3xl`}
                  >
                    “{ceremony.quote}”
                  </p>
                </FadeUp>
              </section>
            </div>
          )}

          {/* Chapter gallery — every study frame in one place */}
          {galleryCards.length > 0 && (
            <PosterGrid
              heading="Chapter Gallery"
              subtitle="The teachings as frames — browse the set, tap any card to study it full size."
              items={galleryCards}
              columns={4}
              compact
            />
          )}

          {/* Daily Practices — compact, expandable */}
          {chapter.exercises && chapter.exercises.length > 0 && (
            <section className="pb-4 pt-8 sm:pt-10">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  Daily Practices
                </h2>
                <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
                  Small daily acts that carry this chapter into your life — tap
                  a practice to open its steps.
                </p>
              </FadeUp>
              <div className="mx-auto mt-8 max-w-3xl">
                <PracticeCards exercises={chapter.exercises} />
              </div>
            </section>
          )}

          {/* Reflection — image beside the questions */}
          {chapter.reflectionQuestions &&
            chapter.reflectionQuestions.length > 0 && (
              <section className="pt-10 sm:pt-12">
                <FadeUp>
                  <div className="grid overflow-hidden rounded-3xl border border-[#DAA520]/40 bg-[var(--color-bg-surface)] md:grid-cols-[2fr_3fr]">
                    {chapter.sectionArt?.reflections && (
                      <div className="relative min-h-48 md:min-h-full">
                        <Image
                          src={chapter.sectionArt.reflections}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    )}
                    <div className="p-6 sm:p-8">
                      <h2
                        className={`${SERIF} flex items-center gap-3 text-2xl font-semibold text-[var(--color-text-primary)]`}
                      >
                        <MessageCircleQuestion className="h-6 w-6 text-[#B8860B]" />
                        Sit With These Questions
                      </h2>
                      <ol className="mt-5 space-y-3">
                        {chapter.reflectionQuestions.map((q, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                              {i + 1}
                            </span>
                            <span
                              className={`${SERIF} text-[17px] italic leading-relaxed text-[var(--color-text-primary)]`}
                            >
                              {q}
                            </span>
                          </li>
                        ))}
                      </ol>
                      <Link
                        href="/journal"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        Write in your journal
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              </section>
            )}

          <LotusDivider />

          {/* The learning cycle: practice, reflect, validate, transform */}
          <div id="cycle" className="scroll-mt-8">
            <ChapterJourney
              chapter={chapter}
              nextSlug={nextSlug}
              nextTitle={nextTitle}
            />
          </div>
        </div>
      </div>

      {/* ————— Sunrise closing ————— */}
      <section className="relative overflow-hidden px-6 py-16 text-center sm:py-24">
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
