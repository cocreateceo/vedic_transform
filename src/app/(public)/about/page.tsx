import Link from "next/link";
import { ArrowRight, Target, Eye, Sparkles } from "lucide-react";
import { TEAM } from "@/data/team";
import { PILLARS, getPillarsByCategory } from "@/constants/pillars";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  const bodyPillars = getPillarsByCategory("body");
  const mindPillars = getPillarsByCategory("mind");
  const spiritPillars = getPillarsByCategory("spirit");
  const founder = TEAM[0];
  const initials = founder.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="text-[var(--color-text-primary)]">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              About 10X Vedic
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Bridging ancient Vedic wisdom with modern science to create a
            transformative 48-day journey for body, mind, and spirit.
          </p>
        </div>
      </section>

      {/* ═══ Mission & Vision ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-[#94a3b8] leading-relaxed">
                To make ancient Vedic wisdom accessible through modern technology.
                We believe that the timeless practices outlined in the Vedas can be
                structured, tracked, and integrated into daily life — empowering
                anyone to achieve lasting transformation.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-[#94a3b8] leading-relaxed">
                A world where everyone has tools for daily transformation. We
                envision a global community united by disciplined practice,
                spiritual growth, and the scientific validation of ancient
                techniques that have guided seekers for millennia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ The Science ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Science
            </span>{" "}
            Behind 48 Days
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Why the Mandala cycle is the ideal framework for transformation
          </p>

          <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">
              The 48-Day Mandala Cycle
            </h3>
            <p className="text-[#94a3b8] leading-relaxed mb-4">
              Modern neuroscience research shows that forming a lasting habit
              takes anywhere from 18 to 245 days, with the median around 66
              days. The Vedic tradition, however, has long recognized a powerful
              48-day cycle called a <em>Mandala</em> — a period of sustained
              practice that creates deep neurological rewiring.
            </p>
            <p className="text-[#94a3b8] leading-relaxed mb-4">
              At 48 days, you sit right in the sweet spot: long enough for the
              neurobiology of habit formation to take hold, yet short enough to
              maintain motivation and see tangible results. This duration allows
              the brain to build new neural pathways through consistent
              repetition while the body adapts to new routines at a cellular
              level.
            </p>
            <p className="text-[#94a3b8] leading-relaxed">
              The 10X Vedic program structures these 48 days around 11
              transformation pillars organized into three interconnected
              categories:
            </p>
          </div>

          {/* Three categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Body",
                count: bodyPillars.length,
                pillars: bodyPillars,
                color: "text-red-400",
                bg: "bg-red-500/15",
                border: "border-red-500/20",
              },
              {
                title: "Mind",
                count: mindPillars.length,
                pillars: mindPillars,
                color: "text-purple-400",
                bg: "bg-purple-500/15",
                border: "border-purple-500/20",
              },
              {
                title: "Spirit",
                count: spiritPillars.length,
                pillars: spiritPillars,
                color: "text-amber-400",
                bg: "bg-amber-500/15",
                border: "border-amber-500/20",
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className={`p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border ${cat.border}`}
              >
                <h3 className={`text-lg font-bold ${cat.color} mb-1`}>
                  {cat.title}
                </h3>
                <p className="text-sm text-[#94a3b8] mb-4">
                  {cat.count} pillars
                </p>
                <ul className="space-y-2">
                  {cat.pillars.map((p) => (
                    <li key={p.id} className="text-sm text-[#94a3b8]">
                      <span className="text-white font-medium">{p.name}</span>{" "}
                      — {p.sanskritName}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Founder / Team ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">
            Meet the{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Founder
            </span>
          </h2>

          <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-orange-500/20">
              {initials}
            </div>
            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-white">{founder.name}</h3>
              <p className="text-orange-400 font-medium mb-4">{founder.role}</p>
              <p className="text-[#94a3b8] leading-relaxed">{founder.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-[#1a1508] to-amber-900/40" />
        <div className="absolute inset-0 bg-[#0f0d08]/40" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Start Your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-xl mx-auto">
            Join thousands who have transformed their lives through the power of
            ancient Vedic wisdom, structured into a proven 48-day program.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 transition-all"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
