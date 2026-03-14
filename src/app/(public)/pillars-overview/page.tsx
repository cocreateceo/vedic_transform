import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PillarsGrid } from "./pillars-grid";

export const metadata = { title: "11 Pillars of Transformation" };

export default function PillarsOverviewPage() {
  return (
    <div className="text-[#e2e8f0]">
      {/* ═══ Hero Banner ═══ */}
      <section className="bg-[#0f0d08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <img
            src="/images/vedic-banner.png"
            alt="10X Yourself — Vedic Transformation in 48 Days — Working on Mind, Body, Spirit"
            className="w-full rounded-2xl shadow-2xl shadow-orange-900/30"
            style={{ border: "3px solid rgba(255,153,51,0.35)" }}
          />
        </div>
      </section>

      {/* ═══ Filter + Grid (client component) ═══ */}
      <section className="py-10 bg-[#0f0d08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PillarsGrid />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-[#1a1508] to-amber-900/40" />
        <div className="absolute inset-0 bg-[#0f0d08]/40" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
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
