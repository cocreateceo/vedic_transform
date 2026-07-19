import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PillarsGrid } from "./pillars-grid";
import { PILLARS } from "@/constants/pillars";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";

export const metadata = pageMetadata({
  title: "The 11 Pillars of Vedic Transformation — 10X Vedic Transform",
  description:
    "Explore the 11 daily practices grouped by Body, Mind, and Spirit — from Brahma Muhurta and Pranayama to Sandhya Meditation, gratitude, and sleep optimization.",
  path: "/pillars-overview",
});

export default function PillarsOverviewPage() {
  return (
    <div className="text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "The 11 Pillars of Vedic Transformation",
            url: `${SITE_URL}/pillars-overview`,
            itemListElement: PILLARS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${p.name} (${p.sanskritName})`,
            })),
          }),
        }}
      />
      {/* ═══ Hero Banner ═══ */}
      <section className="bg-[#FFFEF5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <img
            src="/images/vedic-banner.png"
            alt="10X Yourself — Vedic Transformation in 48 Days — Working on Mind, Body, Spirit"
            className="w-full rounded-2xl shadow-lg shadow-orange-900/10"
            style={{ border: "3px solid rgba(255,153,51,0.35)" }}
          />
        </div>
      </section>

      {/* ═══ Filter + Grid (client component) ═══ */}
      <section className="py-10 bg-[#FFFEF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PillarsGrid />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 overflow-hidden bg-[#0F172A]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-5xl font-semibold text-white mb-6 ${SERIF_CLASS}`}>
            Begin Your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-xl mx-auto">
            Experience all 11 pillars in a structured 48-day Mandala cycle.
            Start transforming today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 transition-all"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
