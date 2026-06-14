import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOSHA_INFO, type DoshaName } from "@/lib/dosha";

// Indexable, keyword-targeted landing page per dosha (vata / pitta / kapha).
// Each ranks for high-intent queries ("am I vata pitta or kapha", "vata
// dosha diet"), is shareable, and funnels into the free test + 48-day journey.

const DOSHAS: DoshaName[] = ["vata", "pitta", "kapha"];

export function generateStaticParams() {
  return DOSHAS.map((dosha) => ({ dosha }));
}

function resolve(dosha: string): DoshaName | null {
  return (DOSHAS as string[]).includes(dosha) ? (dosha as DoshaName) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dosha: string }>;
}): Promise<Metadata> {
  const { dosha } = await params;
  const key = resolve(dosha);
  if (!key) return { title: "Dosha — 10X Vedic Transform" };
  const info = DOSHA_INFO[key];
  const title = `${info.name} Dosha — Traits, Diet & Lifestyle | 10X Vedic`;
  const description = `${info.description} Discover ${info.name} (${info.element}) qualities, Ayurvedic diet and lifestyle recommendations, and take the free dosha test.`;
  return {
    title,
    description,
    alternates: { canonical: `/dosha-test/${key}` },
    openGraph: {
      title,
      description,
      url: `/dosha-test/${key}`,
      type: "article",
      images: [{ url: `/api/og/dosha/${key}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/dosha/${key}`],
    },
  };
}

export default async function DoshaPage({
  params,
}: {
  params: Promise<{ dosha: string }>;
}) {
  const { dosha } = await params;
  const key = resolve(dosha);
  if (!key) notFound();
  const info = DOSHA_INFO[key];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${info.name} Dosha — Traits, Diet & Lifestyle`,
    description: info.description,
    about: `${info.name} (${info.sanskrit}) Ayurvedic dosha`,
    publisher: { "@id": "https://10x.vedics.net/#org" },
    mainEntityOfPage: `https://10x.vedics.net/dosha-test/${key}`,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/dosha-test" className="hover:text-amber-600">
          Dosha Test
        </Link>{" "}
        / <span className="text-gray-700">{info.name}</span>
      </nav>

      <header className="mb-8">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: info.color }}
        >
          {info.element}
        </span>
        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          {info.name} Dosha{" "}
          <span className="text-2xl font-normal text-gray-400">
            {info.sanskrit}
          </span>
        </h1>
        <p className="mt-3 text-lg text-gray-600">{info.description}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {info.name} Personality Traits
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {info.qualities.map((q) => (
            <li
              key={q}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700"
            >
              {q}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {info.name} Diet & Lifestyle Recommendations
        </h2>
        <ul className="mt-4 space-y-3">
          {info.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: info.color }}
              >
                {i + 1}
              </span>
              <span className="text-gray-700">{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-6">
        <h2 className="text-xl font-bold text-gray-900">From the Classics</h2>
        <blockquote className="mt-3 border-l-4 border-amber-400 pl-4 italic text-gray-800">
          &ldquo;{info.classicalDefinition}&rdquo;
          <footer className="mt-2 text-xs font-semibold not-italic text-amber-700">
            — {info.classicalCitation}
          </footer>
        </blockquote>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Not sure if you&apos;re {info.name}?</h2>
        <p className="mt-2 text-amber-50">
          Take the free 2-minute dosha test to discover your unique Ayurvedic
          constitution — then start your personalized 48-day journey.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/dosha-test"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50"
          >
            Take the free dosha test
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            How the 48-day journey works
          </Link>
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
        {DOSHAS.filter((d) => d !== key).map((d) => (
          <Link
            key={d}
            href={`/dosha-test/${d}`}
            className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 hover:border-amber-300 hover:text-amber-700"
          >
            Explore {DOSHA_INFO[d].name} dosha →
          </Link>
        ))}
      </nav>
    </main>
  );
}
