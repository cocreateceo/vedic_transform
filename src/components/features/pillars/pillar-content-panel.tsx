"use client";

import { PexelsImage } from "@/components/ui/pexels-image";
import { Quote, Sparkles } from "lucide-react";
import { PILLAR_CONTENT, type PillarContent } from "@/data/pillar-content";

/**
 * Surfaces the long-form pillar content (tagline, overview, why-it-works,
 * scripture, obstacles, closing) on the pillar detail page. Previously this
 * content only lived in the offline PDF download, so users on the web
 * never saw it. Inline Pexels imagery breaks up the text walls.
 */
export function PillarContentPanel({ slug }: { slug: string }) {
  const content: PillarContent | undefined = PILLAR_CONTENT[slug];
  if (!content) return null;

  return (
    <section className="space-y-8">
      {/* Tagline — large pull-quote with decorative icon */}
      <div className="relative rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 md:p-8">
        <Quote className="absolute top-4 right-4 w-12 h-12 text-orange-200" />
        <p className="text-lg md:text-xl italic text-gray-800 leading-relaxed max-w-3xl">
          {content.tagline}
        </p>
      </div>

      {/* Overview with Pexels image floating right */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">About this Practice</h2>
          {content.overview.map((p, i) => (
            <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
          ))}
        </div>
        <div className="md:col-span-1">
          <PexelsImage
            slug={`pillar-${slug}`}
            fallbackSlug="blog-default"
            className="rounded-2xl overflow-hidden shadow-lg [&_figcaption]:text-gray-500 [&_figcaption]:pt-2"
          />
        </div>
      </div>

      {/* Why It Works — sits in its own callout */}
      {content.whyItWorks.length > 0 && (
        <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            Why It Works
          </h2>
          <div className="space-y-3">
            {content.whyItWorks.map((p, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* Daily Practice — numbered list */}
      {content.dailyPractice.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Daily Practice</h2>
          <ol className="space-y-3">
            {content.dailyPractice.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-semibold flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Scripture — sits in a parchment-styled card */}
      {content.scripture.length > 0 && (
        <div className="rounded-2xl bg-amber-50/40 border border-amber-200/60 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">From the Scriptures</h2>
          <div className="space-y-5">
            {content.scripture.map((s, i) => (
              <blockquote
                key={i}
                className="border-l-4 border-amber-400 pl-4 py-1 italic text-gray-800"
              >
                <p className="leading-relaxed">&ldquo;{s.text}&rdquo;</p>
                <footer className="mt-2 text-xs not-italic font-semibold text-amber-700">
                  — {s.verse}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Obstacles & Remedies */}
      {content.obstacles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Common Obstacles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.obstacles.map((o, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <p className="font-semibold text-gray-900 mb-2">{o.obstacle}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{o.remedy}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closing note */}
      {content.closing && (
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-6 italic text-gray-800 leading-relaxed">
          {content.closing}
        </div>
      )}
    </section>
  );
}
