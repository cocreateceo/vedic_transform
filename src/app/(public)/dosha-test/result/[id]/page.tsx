import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { DOSHA_INFO, type DoshaName, type DoshaScores } from "@/lib/dosha";
import {
  DoshaListenButton,
  VataGlyph,
  PittaGlyph,
  KaphaGlyph,
} from "@/components/features/dosha/dosha-visuals";

interface AnonymousDoshaResult {
  id: string;
  primary: DoshaName;
  secondary: DoshaName;
  scores: DoshaScores;
  percentages: DoshaScores;
  createdAt: string;
}

async function fetchResult(id: string): Promise<AnonymousDoshaResult | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/data/dosha-test/anonymous?id=${encodeURIComponent(id)}`, {
      // Stable result; cache aggressively. The 90-day TTL on the row in
      // DynamoDB is the real lifecycle bound; CDN caching just stops us
      // from hammering Lambda for the same share link.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return (await res.json()) as AnonymousDoshaResult;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchResult(id);
  if (!result) {
    return { title: "Result not found — Vedic Dosha Test" };
  }
  const info = DOSHA_INFO[result.primary];
  const title = `I'm a ${info.name} — Vedic Dosha Test`;
  const description = `${info.description} Take the free Vedic dosha test in 2 minutes.`;
  const ogImage = `/api/og/dosha/${id}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DoshaResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchResult(id);
  if (!result) notFound();

  const primary = DOSHA_INFO[result.primary];
  const secondary = DOSHA_INFO[result.secondary];

  return (
    <div className="min-h-screen text-[#e2e8f0] bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs uppercase tracking-wider text-orange-300 mb-3">
              Your Vedic Dosha
            </span>
            <div className="w-32 h-32 mx-auto mb-4">
              {(() => {
                const Glyph =
                  result.primary === "vata" ? VataGlyph
                  : result.primary === "pitta" ? PittaGlyph
                  : KaphaGlyph;
                return <Glyph />;
              })()}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              {primary.name}
              <span className="text-amber-300">-</span>
              {secondary.name}
            </h1>
            <p className="text-[#94a3b8] mt-2">
              Primary: {primary.element} · Secondary: {secondary.element}
            </p>
            <div className="mt-5 flex justify-center">
              <DoshaListenButton dosha={result.primary as "vata" | "pitta" | "kapha"} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-lg text-[#c4c9d4] leading-relaxed">{primary.description}</p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20">
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <h2 className="font-semibold text-white">Classical definition</h2>
              <span className="text-xs uppercase tracking-wider text-amber-300/80">
                Primary source
              </span>
            </div>
            <blockquote className="text-[#c4c9d4] italic leading-relaxed border-l-2 border-amber-500/40 pl-4">
              {primary.classicalDefinition}
            </blockquote>
            <p className="text-xs text-[#94a3b8] mt-3">— {primary.classicalCitation}</p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h2 className="font-semibold text-white mb-4">Your dosha breakdown</h2>
            <div className="space-y-3">
              {(["vata", "pitta", "kapha"] as const).map((dosha) => {
                const info = DOSHA_INFO[dosha];
                const pct = result.percentages[dosha];
                return (
                  <div key={dosha} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#cbd5e1] w-16">{info.name}</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: info.color }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#cbd5e1] w-12 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h2 className="font-semibold text-white mb-4">Natural strengths</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {primary.qualities.map((q) => (
                <div
                  key={q}
                  className="flex items-center gap-2 text-sm text-[#cbd5e1] bg-amber-500/5 rounded-lg px-3 py-2 border border-amber-500/20"
                >
                  <span className="text-amber-400">✓</span>
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h2 className="font-semibold text-white mb-4">
              Personalized recommendations for {primary.name}
            </h2>
            <div className="space-y-3">
              {primary.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#c4c9d4]">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {rec}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-amber-500/30 text-center">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Start your 48-day journey
            </h2>
            <p className="text-[#cbd5e1] mb-5 max-w-md mx-auto">
              Your dosha will be attached to your profile automatically when you sign up — start
              practicing tomorrow morning.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              Create your account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/dosha-test"
              className="text-sm text-[#94a3b8] hover:text-amber-300 transition-colors"
            >
              Retake the test
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
