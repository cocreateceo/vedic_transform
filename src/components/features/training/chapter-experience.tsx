// Published numbered chapters as a player, not a document.
//
// The ceremony is unchanged — pre-dawn darkness (ambient video hero) → the
// teaching → a night interlude (pull-quote) → golden sunrise closing. What
// changed is that the eight activities are no longer stacked into one page.
//
// The chapter measured 8,784px on desktop and 10,339px on mobile — twelve
// screens of scrolling — because every activity rendered at once. Each panel
// below is still built here, on the server, with the same components and the
// same prose; ChapterPlayer mounts one of them at a time. The height of a
// chapter is now the height of its largest single activity.
//
// Content that used to sit between activities keeps a home: the night
// interlude belongs to the reading it quotes, and the chapter gallery to the
// takeaways it illustrates. Nothing authored was dropped in the move.
//
// All reader-facing prose still comes verbatim from the chapter data in
// src/data/training-book.ts. Interlude quotes are verbatim lines pulled from
// the chapter's own sections; only short structural labels are authored here.

import Image from "next/image";
import Link from "next/link";
import { introSerif, SERIF_CLASS } from "@/lib/fonts";
import { ArrowRight } from "lucide-react";
import { TrainingChapter, chapterReadMinutes } from "@/data/training-book";
import {
  CLOSING_ANCHOR_ID,
  chapterSteps,
  type StepKey,
} from "@/lib/training-steps";
import { linkForChapter } from "@/lib/learning-map";
import { sessionHrefForStep } from "@/lib/training-return-context";
import { journalHrefForReflection } from "@/lib/journal-context";
import { ChapterNav } from "@/app/(main)/training/[slug]/chapter-actions";
import { Mandala } from "./intro/mandala";
import { FadeUp } from "./intro/reveal";
import { PosterGrid } from "./poster-grid";
import { ChapterPlayer } from "./chapter-player";
import { ChapterProgressProvider } from "./steps/chapter-progress-context";
import { FirstVisitOnly } from "./steps/first-visit-only";
import { ProgressSaveError } from "./steps/step-shell";
import { ChapterOpening } from "./steps/chapter-opening";
import { ChapterSeal } from "./steps/chapter-seal";
import { WatchStep } from "./steps/watch-step";
import { ReadStep } from "./steps/read-step";
import { TakeawaysStep } from "./steps/takeaways-step";
import { PracticeStep } from "./steps/practice-step";
import { MeditateStep } from "./steps/meditate-step";
import { ReflectStep } from "./steps/reflect-step";
import { QuizStep } from "./steps/quiz-step";
import { ChallengeStep } from "./steps/challenge-step";

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
    featureLabel: "The way of connection",
    closingLine: "Remember who you are.",
  },
  "consciousness-and-self-awareness": {
    ambient: "/training-media/ambient-copper-2.mp4",
    sanskrit: "प्रज्ञानं ब्रह्म",
    translation: "prajñānam brahma — consciousness is Brahman",
    quote:
      "Self-awareness creates space between stimulus and response. Within that space lies wisdom.",
    featureLabel: "The way of awareness",
    closingLine: "Awareness is where it begins.",
  },
};

const DEFAULT_CEREMONY = {
  ambient: "/training-media/ambient-diya.mp4",
  sanskrit: "तमसो मा ज्योतिर्गमय",
  translation: "from darkness, lead me to light",
  quote: "",
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
  const sections = chapter.sections ?? [];

  // Story artwork stays with its section — inside that section's accordion
  // panel. Study cards group into one compact Chapter Gallery, except the
  // overview card, which anchors the snapshot.
  const storyArtFor = (h: string) =>
    (chapter.gallery ?? []).filter((m) => m.section === h);
  const sectionMinutes = (sec: { paragraphs: string[] }) =>
    Math.max(1, Math.round(sec.paragraphs.join(" ").split(/\s+/).length / 200));
  const accordionSections = sections.map((sec) => ({
    heading: sec.heading,
    paragraphs: sec.paragraphs,
    art: storyArtFor(sec.heading),
    minutes: sectionMinutes(sec),
  }));
  const snapshotCard = (chapter.studyCards ?? []).find(
    (c) => c.section === "@lesson",
  );
  const galleryCards = (chapter.studyCards ?? []).filter(
    (c) => c.section !== "@lesson",
  );

  // The learning cycle, derived once. A step exists only where the chapter
  // authors the content for it.
  const steps = chapterSteps(chapter);
  const stepKeys: StepKey[] = steps.map((s) => s.key);
  const step = (key: StepKey) => steps.find((s) => s.key === key);

  // Where this chapter's practice actually happens — pillar → session tab or
  // journal, resolved through the shared learning map.
  // One interpretation of the chapter↔pillar relationship, shared with the
  // Pillar surfaces, so the round trip can't disagree.
  const link = linkForChapter(chapter.slug);
  const pillar = link?.pillar;
  const journalHref = journalHrefForReflection(chapter.slug);

  const watchStep = step("watch");
  const readStep = step("read");
  const takeawaysStep = step("takeaways");
  const practiceStep = step("practice");
  const meditationStep = step("meditation");
  const reflectionStep = step("reflection");
  const quizStep = step("quiz");
  const challengeStep = step("challenge");

  // One panel per activity, built on the server. ChapterPlayer mounts exactly
  // one of them at a time — that is what took the chapter from twelve screens
  // to one activity's worth of height.
  const panels: Partial<Record<StepKey, React.ReactNode>> = {};

  if (watchStep && chapter.lessonVideoId) {
    panels.watch = (
      <WatchStep
        step={watchStep}
        videoId={chapter.lessonVideoId}
        title={chapter.title}
      />
    );
  }

  if (readStep) {
    panels.read = (
      <>
        <ReadStep step={readStep} sections={accordionSections} />
        {/* Night interlude: the chapter's own words held up to the dark. It
            quotes a line from the reading, so it belongs to the reading. */}
        {ceremony.quote && (
          <section className="relative mt-10 overflow-hidden rounded-3xl bg-[#0C0F22] px-6 py-14 text-center">
            <Mandala className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 text-[#DAA520] opacity-[0.07]" />
            <FadeUp className="relative z-10 mx-auto max-w-2xl">
              <p
                className={`${SERIF} text-2xl italic leading-snug text-amber-50 sm:text-3xl`}
              >
                “{ceremony.quote}”
              </p>
            </FadeUp>
          </section>
        )}
      </>
    );
  }

  if (takeawaysStep && chapter.keyTakeaways) {
    panels.takeaways = (
      <>
        <TakeawaysStep step={takeawaysStep} takeaways={chapter.keyTakeaways} />
        {/* The gallery frames these same teachings — it travels with them. */}
        {galleryCards.length > 0 && (
          <PosterGrid
            heading="Chapter Gallery"
            subtitle="The teachings as frames — browse the set, tap any card to study it full size."
            items={galleryCards}
            columns={4}
            compact
          />
        )}
      </>
    );
  }

  if (practiceStep && chapter.exercises) {
    panels.practice = (
      <PracticeStep
        step={practiceStep}
        exercises={chapter.exercises}
        // Session links carry the activity explicitly — Practice and
        // Meditation can share one session, so the destination must never
        // infer which of them sent the learner.
        practiceHref={
          link?.sessionKey
            ? sessionHrefForStep(chapter.slug, "practice")
            : link?.practiceHref
        }
        practiceLabel={link?.practiceLabel}
        art={chapter.sectionArt?.exercises}
      />
    );
  }

  // A session link ONLY when the chapter's pillar maps to a real Sessions
  // practice — otherwise the sit runs here, because dropping the reader on a
  // generic /sessions with fifteen unrelated tabs is worse than keeping them
  // in the chapter.
  if (meditationStep && chapter.meditationMinutes) {
    panels.meditation = (
      <MeditateStep
        step={meditationStep}
        minutes={chapter.meditationMinutes}
        sessionHref={sessionHrefForStep(chapter.slug, "meditation")}
        sessionLabel={link?.sessionKey ? link.practiceLabel : undefined}
      />
    );
  }

  if (reflectionStep && chapter.reflectionQuestions) {
    panels.reflection = (
      <ReflectStep
        step={reflectionStep}
        questions={chapter.reflectionQuestions}
        journalHref={journalHref}
        art={chapter.sectionArt?.reflections}
      />
    );
  }

  if (quizStep && chapter.quiz) {
    panels.quiz = <QuizStep step={quizStep} quiz={chapter.quiz} />;
  }

  if (challengeStep && chapter.dailyChallenge) {
    panels.challenge = (
      <ChallengeStep step={challengeStep} challenge={chapter.dailyChallenge} />
    );
  }

  // The closing is a position in the player, not a section below it: it is
  // where the last Continue lands and where a finished chapter opens.
  const closing = (
    <section
      id={CLOSING_ANCHOR_ID}
      className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:py-16"
    >
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
      <Mandala className="absolute bottom-[-40vmin] left-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 text-[#8B6914] opacity-[0.1]" />
      <FadeUp className="relative z-10 mx-auto max-w-2xl space-y-6">
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
        <ChapterSeal nextSlug={nextSlug} nextTitle={nextTitle} />
      </FadeUp>
    </section>
  );

  return (
    <ChapterProgressProvider slug={chapter.slug} stepKeys={stepKeys}>
      <div className={`${serif.variable} mx-auto max-w-6xl`}>
        {/* Opening: a three-line masthead, or the ceremony on a first visit. */}
        <ChapterOpening
          chapterNumber={chapter.number}
          title={chapter.title}
          subtitle={chapter.subtitle}
          readMinutes={readMinutes}
          movements={sections.length}
          totalActivities={steps.length}
          pillarName={pillar?.name}
          sanskrit={ceremony.sanskrit}
          translation={ceremony.translation}
          ambient={ceremony.ambient}
          poster={chapter.image}
        />

        <div className="relative">
          <div className="relative">
            {/* Chapter snapshot: orientation before immersion, and only then.
                A reader already underway has answered "what is this?" and gets
                straight to their activity instead. */}
            <FirstVisitOnly>
              <section id="opening" className="scroll-mt-8 pt-8">
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
                      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-semibold text-[#B8860B]">
                        <span>{readMinutes} min read</span>
                        <span>· {sections.length} movements</span>
                        {(chapter.gallery?.length ?? 0) +
                          (chapter.studyCards?.length ?? 0) >
                          0 && (
                          <span>
                            ·{" "}
                            {(chapter.gallery?.length ?? 0) +
                              (chapter.studyCards?.length ?? 0)}{" "}
                            artworks
                          </span>
                        )}
                        <span>· {steps.length} activities</span>
                      </div>
                      {pillar && (
                        <p className="mt-4 text-[13px] text-[var(--color-text-secondary)]">
                          {ceremony.featureLabel} — practiced as{" "}
                          <Link
                            href={`/pillars/${pillar.slug}`}
                            className="font-semibold text-[#B8860B] underline underline-offset-2"
                          >
                            {pillar.name}
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </FadeUp>
              </section>
            </FirstVisitOnly>

            <ChapterPlayer
              steps={stepKeys}
              panels={panels}
              // These three render their own filled CTA (open the session,
              // start the sit, write the reflection), so Continue defers.
              stepsWithOwnAction={["practice", "meditation", "reflection"]}
              closing={closing}
            />

            <ProgressSaveError />
          </div>
        </div>

        {/* Pillar link + prev/next, consistent with the rest of the book */}
        <div className="pb-4">
          <div className="space-y-4 pt-8">
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
            <ChapterNav
              prevSlug={prevSlug}
              prevTitle={prevTitle}
              nextSlug={nextSlug}
              nextTitle={nextTitle}
            />
          </div>
        </div>
      </div>
    </ChapterProgressProvider>
  );
}
