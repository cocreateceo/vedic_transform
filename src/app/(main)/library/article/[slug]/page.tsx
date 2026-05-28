import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, FileText } from "lucide-react";
import {
  LIBRARY_ARTICLES,
  getLibraryArticleBySlug,
} from "@/data/library-articles";
import { PILLARS } from "@/constants/pillars";

// All article slugs are known at build time, so prerender them.
export function generateStaticParams() {
  return LIBRARY_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getLibraryArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: `${article.title} — Vedic Transform`,
    description: article.excerpt,
  };
}

const CATEGORY_PILL: Record<string, string> = {
  body: "bg-orange-100 text-orange-700 border-orange-200",
  mind: "bg-cyan-100 text-cyan-700 border-cyan-200",
  spirit: "bg-amber-100 text-amber-700 border-amber-200",
};

export default async function LibraryArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getLibraryArticleBySlug(slug);

  if (!article) notFound();

  const pillar = PILLARS.find((p) => p.slug === article.pillarSlug);
  const pillBadge =
    CATEGORY_PILL[article.category] || CATEGORY_PILL.mind;
  const KindIcon = article.kind === "guide" ? BookOpen : FileText;
  const related = LIBRARY_ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <header className="vedic-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-[#FFF9F0] to-white">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${pillBadge}`}
          >
            <KindIcon className="w-3 h-3" />
            {article.kind === "guide" ? "Guide" : "Article"}
          </span>
          {pillar && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
              {pillar.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
          {article.title}
        </h1>

        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* Tailwind v4's descendant-arbitrary syntax lets us style the
          dangerouslySetInnerHTML output without pulling in
          @tailwindcss/typography. Sanskrit terms come through as <em>; we
          render them in the saffron brand color, upright (not italic) per
          the design system guidance. */}
      <article
        className="text-[17px] leading-[1.75] text-[var(--color-text-primary)]
          [&_p]:mb-6
          [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--color-text-primary)] [&_h2]:border-b-2 [&_h2]:border-[#DAA520]/30 [&_h2]:pb-2
          [&_em]:not-italic [&_em]:font-medium [&_em]:text-[var(--color-primary)]
          [&_strong]:font-semibold [&_strong]:text-[var(--color-text-primary)]"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {related.length > 0 && (
        <section className="pt-8 border-t border-[var(--color-border)] space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            More from the Library
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => {
              const RIcon = r.kind === "guide" ? BookOpen : FileText;
              const rPill = CATEGORY_PILL[r.category] || CATEGORY_PILL.mind;
              return (
                <Link
                  key={r.slug}
                  href={`/library/article/${r.slug}`}
                  className="vedic-card p-4 hover:border-[#DAA520] transition-colors block group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${rPill}`}
                    >
                      <RIcon className="w-3 h-3" />
                      {r.kind === "guide" ? "Guide" : "Article"}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {r.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                    {r.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
