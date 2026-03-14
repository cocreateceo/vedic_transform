import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Transformation Stories",
};

function formatPillarName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function TestimonialsPage() {
  return (
    <div className="text-[#e2e8f0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1e] to-[#1a1145] py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Transformation
            </span>{" "}
            Stories
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            Real experiences from practitioners who completed the 48-day Mandala journey
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-[#0f0a1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/20 transition-colors flex flex-col"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < t.rating ? "text-amber-400" : "text-gray-600"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-6 italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Pillar Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {t.topPillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="text-xs px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20"
                    >
                      {formatPillarName(pillar)}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-[#94a3b8]">Day {t.dayCompleted} completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-[#1a1145] to-amber-900/40" />
        <div className="absolute inset-0 bg-[#0f0a1e]/40" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Write Your Own{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Story
            </span>
          </h2>
          <p className="text-[#94a3b8] mb-8 max-w-xl mx-auto">
            Join thousands who have transformed their lives through the 48-day Mandala journey.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
