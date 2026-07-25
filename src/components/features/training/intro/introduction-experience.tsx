// The Introduction rendered as a ceremonial journey rather than an article.
// Visual arc: pre-dawn darkness (hero) → daylight (journey content) → a night
// interlude (quote) → golden sunrise (closing) — tamaso mā jyotir gamaya.
//
// All reader-facing prose comes verbatim from the chapter data in
// src/data/training-book.ts; this file only adds presentation and short
// structural labels. Chapters keep the standard reader in [slug]/page.tsx.

import Image from "next/image";
import Link from "next/link";
import { introSerif, SERIF_CLASS } from "@/lib/fonts";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ChevronDown,
  Compass,
  Crown,
  Eye,
  Flame,
  Hammer,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Palette,
  Rocket,
  Sparkles,
  Sun,
  Sunrise,
  Target,
  Users,
  Waves,
} from "lucide-react";
import {
  TRAINING_CHAPTERS,
  TrainingChapter,
  chapterReadMinutes,
  trainingContentId,
} from "@/data/training-book";
import { ChapterActions } from "@/app/(main)/training/[slug]/chapter-actions";
import { CinematicLesson } from "../cinematic-lesson";
import { InlineArt, PosterGrid } from "../poster-grid";
import { Mandala, LotusDivider } from "./mandala";
import { FadeUp, Stagger, StaggerItem, GrowLine } from "./reveal";
import { ElevenGates, type Gate } from "./eleven-gates";

const serif = introSerif;
const SERIF = SERIF_CLASS;

const MILESTONES = [
  { icon: Sunrise, label: "Day 1", note: "The journey begins" },
  { icon: Eye, label: "Awareness", note: "Observe the mind" },
  { icon: Compass, label: "Alignment", note: "Thought, energy, action" },
  { icon: Sparkles, label: "Transformation", note: "Old patterns dissolve" },
  { icon: Target, label: "Purpose", note: "Dharma comes into focus" },
  { icon: Waves, label: "Impact", note: "Creation ripples outward" },
  { icon: Sun, label: "Day 48", note: "Living in full alignment" },
];

const MODERN_CHALLENGES = [
  "AI reshaping industries",
  "Fragmented attention",
  "Rising stress & anxiety",
  "Loneliness",
  "Disconnection",
];

const VEDIC_RESPONSE = [
  "Meaning",
  "Consciousness",
  "Healing",
  "Purpose",
  "Inner alignment",
];

const DIMENSIONS = [
  { icon: Eye, title: "Consciousness", note: "Awaken awareness and observe the mind.", art: "/training-media/intro-dim-consciousness.webp" },
  { icon: HeartPulse, title: "Health & Energy", note: "Build vitality through body, breath, and rest.", art: "/training-media/intro-dim-health-energy.webp" },
  { icon: HeartHandshake, title: "Relationships & Service", note: "Grow through connection and giving.", art: "/training-media/intro-dim-relationships.webp" },
  { icon: Flame, title: "Leadership & Creation", note: "Lead and build from higher awareness.", art: "/training-media/intro-dim-leadership.webp" },
  { icon: Sunrise, title: "Wealth & Purpose", note: "Create abundance aligned with dharma.", art: "/training-media/intro-dim-wealth-purpose.webp" },
];

const JOURNEY_ELEMENTS = [
  "Energy, Gratitude, and Alignment",
  "Meditation and healing",
  "Energy and self awareness",
  "Infinite mindset, dharma-centered leadership",
  "Breath, rest, food, and exercise",
  "Conscious co-creation",
  "Evolution through action and awareness",
];

const AUDIENCES = [
  { icon: Crown, label: "Leaders" },
  { icon: Hammer, label: "Builders" },
  { icon: Heart, label: "Healers" },
  { icon: Briefcase, label: "Professionals" },
  { icon: Rocket, label: "Entrepreneurs" },
  { icon: Palette, label: "Creators" },
  { icon: Compass, label: "Seekers" },
  { icon: Home, label: "Families" },
  { icon: Users, label: "Communities" },
];

// Section headings as they appear in the chapter data. Renamed headings fall
// through to the generic prose block below so no content ever disappears.
const H = {
  journey: "A 48-Day Journey Into Conscious Living",
  shift: "A Profound Shift",
  dimensions: "Five Dimensions of Evolution",
  audience: "Who This Book Is For",
  chapters: "The 11 Chapters of 10x Vedic",
};

export function IntroductionExperience({
  chapter,
  nextSlug,
  nextTitle,
}: {
  chapter: TrainingChapter;
  nextSlug?: string;
  nextTitle?: string;
}) {
  const consumed = new Set<string>(Object.values(H));
  const sec = (heading: string) =>
    chapter.sections?.find((s) => s.heading === heading);
  const leftovers =
    chapter.sections?.filter((s) => !consumed.has(s.heading)) ?? [];

  const journey = sec(H.journey);
  const shift = sec(H.shift);
  const dimensions = sec(H.dimensions);
  const audience = sec(H.audience);
  const chapterList = sec(H.chapters);

  const gates: Gate[] = (chapterList?.paragraphs ?? []).map((p, i) => {
    const meta = TRAINING_CHAPTERS.find((c) => c.number === i + 1);
    const firstStop = p.indexOf(". ");
    return {
      number: i + 1,
      slug: meta?.slug ?? "",
      title: meta?.title ?? (firstStop > 0 ? p.slice(0, firstStop) : p),
      body: firstStop > 0 ? p.slice(firstStop + 2) : p,
      published: meta?.status === "published",
      image: meta?.posterImage ?? meta?.image,
    };
  });

  const readMinutes = chapterReadMinutes(chapter);

  // Study cards woven inline beside the sections they teach; leftovers
  // (no section key) collect in the Study Cards grid near the end.
  const cards = chapter.studyCards ?? [];
  const mediaFor = (key: string) => cards.filter((m) => m.section === key);
  const leftoverCards = cards.filter((m) => !m.section);

  const subtitleLines = (chapter.subtitle ?? "")
    .split(". ")
    .map((line) => (line.endsWith(".") ? line : `${line}.`))
    .filter((line) => line.length > 1);

  return (
    <div
      className={`${serif.variable} -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 overflow-hidden`}
    >
      {/* ————— Opening: pre-dawn ————— */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#0C0F22] px-6 py-20 text-center">
        <video
          src="/training-media/ambient-diya.mp4"
          poster={chapter.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        {/* Night sky settling over the flame; dawn glow rising at the horizon */}
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
              Introduction · {readMinutes} min read
            </p>
            <p className={`${SERIF} mt-4 text-lg italic text-amber-100/60`}>
              तमसो मा ज्योतिर्गमय — from darkness, lead me to light
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <h1
              className={`${SERIF} text-5xl font-semibold leading-[1.05] text-amber-50 sm:text-6xl lg:text-7xl`}
            >
              {chapter.title}
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="space-y-1">
              {subtitleLines.map((line) => (
                <p
                  key={line}
                  className="text-base tracking-wide text-amber-100/80 sm:text-lg"
                >
                  {line}
                </p>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.45}>
            <a
              href="#journey"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition-shadow hover:shadow-xl hover:shadow-orange-900/50"
            >
              Begin the 48-Day Journey
              <ArrowRight className="h-4 w-4" />
            </a>
          </FadeUp>
        </div>

        <a
          href="#journey"
          aria-label="Scroll to the 48-day journey"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-amber-200/60 transition-colors hover:text-amber-200 motion-safe:animate-bounce"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* ————— The cinematic lesson ————— */}
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

      {/* ————— Daylight body (dawn glow over the theme background) ————— */}
      <div className="relative bg-[var(--color-bg-primary)] px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(218,165,32,0.14),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-5xl">
          {/* 48-Day Journey */}
          {journey && (
            <section id="journey" className="scroll-mt-8 py-20 sm:py-28">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  {journey.heading}
                </h2>
                <div className="mt-6 space-y-5 text-left text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
                  {journey.paragraphs.slice(0, 2).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </FadeUp>

              <div className="relative mx-auto mt-16 max-w-md">
                <GrowLine className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#DAA520] via-[#DAA520]/40 to-[#DAA520]" />
                <Stagger className="space-y-10">
                  {MILESTONES.map(({ icon: Icon, label, note }) => (
                    <StaggerItem key={label} className="relative flex items-center gap-5 pl-0">
                      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DAA520]/60 bg-[var(--color-bg-surface)] text-[#B8860B] shadow-[0_0_14px_rgba(218,165,32,0.2)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className={`${SERIF} block text-xl font-semibold text-[var(--color-text-primary)]`}>
                          {label}
                        </span>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {note}
                        </span>
                      </span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              {journey.paragraphs[2] && (
                <FadeUp className="mx-auto mt-16 max-w-[40rem] text-center">
                  <p
                    className={`${SERIF} text-2xl italic leading-relaxed text-[#8B6914] sm:text-[1.65rem]`}
                  >
                    {journey.paragraphs[2]}
                  </p>
                </FadeUp>
              )}
            </section>
          )}

          {/* The Journey at a Glance — concept posters */}
          {chapter.gallery && chapter.gallery.length > 0 && (
            <>
              <LotusDivider />
              <PosterGrid
                heading="The Journey at a Glance"
                subtitle="Five frames that hold the whole path — tap any poster to view it full size."
                items={chapter.gallery}
                columns={3}
              />
            </>
          )}

          <LotusDivider />

          {/* A Profound Shift — the modern world and the Vedic response */}
          {shift && (
            <section className="py-20 sm:py-28">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  {shift.heading}
                </h2>
              </FadeUp>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <FadeUp>
                  <div className="h-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-7 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      The modern world
                    </p>
                    {shift.paragraphs[0] && (
                      <p className="mt-4 text-[16px] leading-[1.8] text-[var(--color-text-primary)]">
                        {shift.paragraphs[0]}
                      </p>
                    )}
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {MODERN_CHALLENGES.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-slate-400/40 bg-slate-500/5 px-3.5 py-1.5 text-sm text-[var(--color-text-secondary)]"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
                <FadeUp delay={0.12}>
                  <div className="h-full rounded-3xl border border-[#DAA520]/50 bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-7 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                      The search returning
                    </p>
                    {shift.paragraphs[1] && (
                      <p className="mt-4 text-[16px] leading-[1.8] text-[#3d3223]">
                        {shift.paragraphs[1]}
                      </p>
                    )}
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {VEDIC_RESPONSE.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-[#DAA520]/40 bg-white/70 px-3.5 py-1.5 text-sm text-[#8B6914]"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              </div>

              {/* Two worlds converging */}
              {shift.paragraphs[2] && (
                <FadeUp className="mt-14 text-center">
                  <p className="mx-auto max-w-[42rem] text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
                    {shift.paragraphs[2]}
                  </p>
                  <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-0">
                    <span className={`${SERIF} flex-1 text-lg font-semibold text-[var(--color-text-primary)] sm:text-right`}>
                      Timeless Vedic wisdom
                    </span>
                    <span className="mx-6 hidden h-px w-16 bg-gradient-to-r from-[var(--color-text-muted)] to-[#DAA520] sm:block" />
                    <span className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.35),transparent_70%)]" />
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#DAA520] bg-[var(--color-bg-surface)] text-xs font-bold tracking-wide text-[#B8860B]">
                        10x
                      </span>
                    </span>
                    <span className="mx-6 hidden h-px w-16 bg-gradient-to-l from-[var(--color-text-muted)] to-[#DAA520] sm:block" />
                    <span className={`${SERIF} flex-1 text-lg font-semibold text-[var(--color-text-primary)] sm:text-left`}>
                      Science-enabled measurable transformation
                    </span>
                  </div>
                </FadeUp>
              )}
              <InlineArt items={mediaFor("A Profound Shift")} />
            </section>
          )}
        </div>
      </div>

      {/* ————— Night interlude: the quote ————— */}
      {shift?.paragraphs[3] && (
        <section className="relative overflow-hidden bg-[#0C0F22] px-6 py-28 text-center sm:py-36">
          <Mandala className="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 text-[#DAA520] opacity-[0.07]" />
          <FadeUp className="relative z-10 mx-auto max-w-3xl">
            <p
              className={`${SERIF} text-3xl italic leading-snug text-amber-50 sm:text-4xl lg:text-[2.75rem]`}
            >
              “{shift.paragraphs[3]}”
            </p>
          </FadeUp>
        </section>
      )}

      {/* ————— Return to daylight ————— */}
      <div className="bg-[var(--color-bg-primary)] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Remaining Profound Shift prose */}
          {shift && shift.paragraphs.length > 4 && (
            <section className="mx-auto max-w-[44rem] py-20 sm:py-24">
              <FadeUp className="space-y-6 text-[17px] leading-[1.85] text-[var(--color-text-primary)]">
                {shift.paragraphs[4] && <p>{shift.paragraphs[4]}</p>}
                {shift.paragraphs[5] && (
                  <p className="border-l-2 border-[#DAA520] pl-5 text-[var(--color-text-primary)]">
                    {shift.paragraphs[5]}
                  </p>
                )}
                {shift.paragraphs.slice(6).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </FadeUp>
            </section>
          )}

          <LotusDivider />

          {/* Five Dimensions of Evolution */}
          {dimensions && (
            <section className="py-20 sm:py-28">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  {dimensions.heading}
                </h2>
                {dimensions.paragraphs[0] && (
                  <p className="mt-5 text-[17px] leading-[1.8] text-[var(--color-text-secondary)]">
                    {dimensions.paragraphs[0].split(":")[0]}:
                  </p>
                )}
              </FadeUp>

              <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {DIMENSIONS.map(({ icon: Icon, title, note, art }) => (
                  <StaggerItem key={title}>
                    <div className="group h-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-center transition-all hover:-translate-y-1 hover:border-[#DAA520] hover:shadow-[0_8px_30px_rgba(218,165,32,0.15)]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={art}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 pt-0">
                        <span className="relative mx-auto -mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#DAA520]/40 bg-gradient-to-br from-amber-100 to-orange-100 text-[#B8860B] shadow-md transition-transform group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className={`${SERIF} mt-3 text-lg font-semibold leading-tight text-[var(--color-text-primary)]`}>
                          {title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                          {note}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* What the journey combines */}
              {dimensions.paragraphs[1] && (
                <FadeUp className="mx-auto mt-16 max-w-3xl text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                    This Vedic journey combines
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
                    {JOURNEY_ELEMENTS.map((el, i) => (
                      <span key={el} className="flex items-center gap-2">
                        <span className="rounded-full border border-[#DAA520]/40 bg-[var(--color-card-bg)] px-4 py-1.5 text-sm text-[var(--color-text-primary)]">
                          {el}
                        </span>
                        {i < JOURNEY_ELEMENTS.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-[#DAA520]" />
                        )}
                      </span>
                    ))}
                  </div>
                </FadeUp>
              )}

              {dimensions.paragraphs[2] && (
                <FadeUp className="mx-auto mt-16 max-w-[38rem] text-center">
                  <p className={`${SERIF} text-2xl italic leading-relaxed text-[#8B6914] sm:text-3xl`}>
                    {dimensions.paragraphs[2]}
                  </p>
                </FadeUp>
              )}

              {/* Alignment feature card */}
              {dimensions.paragraphs[3] && (
                <FadeUp className="mt-16">
                  <div className="grid overflow-hidden rounded-3xl border border-[#DAA520]/50 bg-gradient-to-br from-[#FFF9F0] via-amber-50/60 to-orange-50/40 md:grid-cols-[2fr_3fr]">
                    <div className="relative min-h-64 md:min-h-full">
                      <Image
                        src="/training-media/intro-alignment.webp"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative overflow-hidden p-8 sm:p-12">
                      <Mandala className="absolute -right-24 -top-24 h-96 w-96 text-[#DAA520] opacity-[0.1]" />
                      <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                        The way of alignment
                      </p>
                      <p className="relative mt-4 max-w-[42rem] text-xl leading-[1.7] text-[#3d3223] sm:text-2xl">
                        {dimensions.paragraphs[3]}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              )}

              {dimensions.paragraphs.slice(4).map((p, i) => (
                <FadeUp key={i} className="mx-auto mt-10 max-w-[44rem]">
                  <p className="text-[17px] leading-[1.8] text-[var(--color-text-primary)]">{p}</p>
                </FadeUp>
              ))}
              <InlineArt items={mediaFor("Five Dimensions of Evolution")} />
            </section>
          )}

          <LotusDivider />

          {/* Who This Book Is For */}
          {audience && (
            <section className="py-20 sm:py-28">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  {audience.heading}
                </h2>
                <p className="mt-5 text-[17px] text-[var(--color-text-secondary)]">
                  This book is written for:
                </p>
              </FadeUp>

              <Stagger className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
                {AUDIENCES.map(({ icon: Icon, label }) => (
                  <StaggerItem key={label}>
                    <div className="flex h-full flex-col items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-5 text-center transition-all hover:border-[#DAA520] hover:shadow-[0_6px_24px_rgba(218,165,32,0.12)]">
                      <Icon className="h-5 w-5 text-[#B8860B]" />
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {label}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <FadeUp className="mx-auto mt-8 max-w-2xl text-center">
                <p className={`${SERIF} text-xl italic text-[#8B6914]`}>
                  Anyone seeking a deeper meaningful connection with themselves
                  and the universe.
                </p>
              </FadeUp>

              {audience.paragraphs[1] && (
                <FadeUp className="mx-auto mt-12 max-w-[44rem] text-center">
                  <p className="text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
                    {audience.paragraphs[1]}
                  </p>
                </FadeUp>
              )}
              <InlineArt items={mediaFor("Who This Book Is For")} />
            </section>
          )}

          {/* Study cards — learn from the frames */}
          {leftoverCards.length > 0 && (
            <>
              <LotusDivider />
              <PosterGrid
                heading="Study Cards"
                subtitle="The Introduction's teachings, one frame at a time — tap any card to study it full size."
                items={leftoverCards}
                columns={4}
              />
            </>
          )}

          <LotusDivider />

          {/* The Eleven Gates */}
          {chapterList && (
            <section className="py-20 sm:py-28">
              <FadeUp className="mx-auto max-w-[44rem] text-center">
                <h2
                  className={`${SERIF} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
                >
                  {chapterList.heading}
                </h2>
                <p className="mt-4 text-[16px] text-[var(--color-text-secondary)]">
                  Eleven gates on one ascending path. Each chapter you complete
                  lights the way to the next.
                </p>
              </FadeUp>
              <div className="mt-14">
                <ElevenGates gates={gates} />
              </div>
            </section>
          )}

          {/* Any renamed/new sections fall through here untouched */}
          {leftovers.length > 0 && (
            <section className="mx-auto max-w-[44rem] space-y-10 py-16">
              {leftovers.map((s) => (
                <FadeUp key={s.heading}>
                  <h2 className={`${SERIF} mb-4 text-2xl font-semibold text-[var(--color-text-primary)]`}>
                    {s.heading}
                  </h2>
                  <div className="space-y-5 text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </FadeUp>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* ————— Sunrise closing ————— */}
      <section className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
        <Image
          src="/training-media/intro-closing-sunrise.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[#FDEBC8]/80 to-[#F5C063]/55" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(ellipse_at_bottom,rgba(255,153,51,0.4),transparent_70%)]" />
        <Mandala className="absolute left-1/2 bottom-[-40vmin] h-[100vmin] w-[100vmin] -translate-x-1/2 text-[#8B6914] opacity-[0.1]" />
        <FadeUp className="relative z-10 mx-auto max-w-2xl space-y-8">
          {chapter.summary && (
            <div className="space-y-5 text-[17px] leading-[1.8] text-[#3d3223]">
              {chapter.summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          <h2
            className={`${SERIF} text-4xl font-semibold leading-tight text-[#2A1B0E] sm:text-5xl`}
          >
            Your transformation begins today.
          </h2>
          {nextSlug && (
            <Link
              href={`/training/${nextSlug}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-800/30 transition-shadow hover:shadow-xl"
            >
              Continue to Chapter 1
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </FadeUp>
      </section>

      {/* Progress + chapter navigation, consistent with the rest of the book */}
      <div className="bg-[var(--color-bg-primary)] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <ChapterActions
            contentId={trainingContentId(chapter.slug)}
            nextSlug={nextSlug}
            nextTitle={nextTitle}
          />
        </div>
      </div>
    </div>
  );
}
