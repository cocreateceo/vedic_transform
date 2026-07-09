import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ListChecks,
  MessageCircleQuestion,
  ScrollText,
} from "lucide-react";
import {
  getPublishedChapters,
  getTrainingChapterBySlug,
  trainingContentId,
} from "@/data/training-book";
import { PILLARS } from "@/constants/pillars";
import { ChapterActions } from "./chapter-actions";

// Only published chapters are routable; coming-soon slugs 404.
export function generateStaticParams() {
  return getPublishedChapters().map((c) => ({ slug: c.slug }));
}

// Slugs outside generateStaticParams (coming-soon chapters, junk) must be
// real 404s, not on-demand-rendered fallbacks cached with a 200.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter || chapter.status !== "published")
    return { title: "Chapter not found" };
  return {
    title: `${chapter.title} — 10x Vedic Training`,
    description: chapter.description,
  };
}

export default async function TrainingChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter || chapter.status !== "published") notFound();

  const published = getPublishedChapters();
  const idx = published.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? published[idx - 1] : undefined;
  const next = idx < published.length - 1 ? published[idx + 1] : undefined;
  const pillar = PILLARS.find((p) => p.slug === chapter.relatedPillarSlug);
  const chapterLabel =
    chapter.number === 0 ? "Introduction" : `Chapter ${chapter.number}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/training"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      <header className="vedic-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-[#FFF9F0] to-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border bg-amber-100 text-amber-700 border-amber-200">
            <BookOpen className="w-3 h-3" />
            {chapterLabel}
          </span>
          {pillar && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
              {pillar.name}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
            {chapter.subtitle}
          </p>
        )}
      </header>

      <article className="text-[17px] leading-[1.75] text-[var(--color-text-primary)] space-y-10">
        {chapter.sections?.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-4 text-2xl font-bold border-b-2 border-[#DAA520]/30 pb-2">
              {section.heading}
            </h2>
            <div className="space-y-6">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {chapter.exercises && chapter.exercises.length > 0 && (
        <section className="vedic-card p-6 sm:p-8 space-y-6 bg-gradient-to-br from-orange-50 to-amber-50">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
            <ListChecks className="w-5 h-5 text-[var(--color-primary)]" />
            Practical Exercises
          </h2>
          {chapter.exercises.map((ex) => (
            <div key={ex.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wide">
                {ex.title}
              </h3>
              <ul className="space-y-1.5">
                {ex.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-[var(--color-text-primary)]"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#DAA520] shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {chapter.reflectionQuestions && chapter.reflectionQuestions.length > 0 && (
        <section className="vedic-card p-6 sm:p-8 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
            <MessageCircleQuestion className="w-5 h-5 text-[var(--color-primary)]" />
            Reflection Questions
          </h2>
          <ol className="space-y-3">
            {chapter.reflectionQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed italic text-[var(--color-text-secondary)]">
                  {q}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-[var(--color-text-muted)]">
            Take these into your{" "}
            <Link href="/journal" className="text-[var(--color-primary)] underline">
              journal
            </Link>{" "}
            for deeper reflection.
          </p>
        </section>
      )}

      {chapter.summary && chapter.summary.length > 0 && (
        <section className="vedic-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#DAA520]">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
            <ScrollText className="w-5 h-5 text-[var(--color-primary)]" />
            Chapter Summary
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-text-primary)]">
            {chapter.summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {pillar && (
        <Link
          href={`/pillars/${pillar.slug}`}
          className="vedic-card p-4 flex items-center justify-between hover:border-[#DAA520] transition-colors group"
        >
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Deepen this chapter with daily practice
            </p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
              {pillar.name} pillar
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
        </Link>
      )}

      <ChapterActions
        contentId={trainingContentId(chapter.slug)}
        prevSlug={prev?.slug}
        prevTitle={prev?.title}
        nextSlug={next?.slug}
        nextTitle={next?.title}
      />
    </div>
  );
}
