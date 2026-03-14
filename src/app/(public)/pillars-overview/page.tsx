import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PillarsGrid } from "./pillars-grid";

export const metadata = { title: "11 Pillars of Transformation" };
export const dynamic = "force-dynamic";

export default function PillarsOverviewPage() {
  return (
    <div className="text-[var(--color-text-primary)]">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1e] to-[#1a1145]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              11 Pillars of Transformation
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Body &bull; Mind &bull; Spirit
          </p>
        </div>
      </section>

      {/* ═══ Filter + Grid (client component) ═══ */}
      <section className="py-20 bg-[#0f0a1e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PillarsGrid />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-[#1a1145] to-amber-900/40" />
        <div className="absolute inset-0 bg-[#0f0a1e]/40" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

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
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-xl shadow-purple-500/25 transition-all"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
