import Link from "next/link";
import { ArrowRight, Target, Eye, Sparkles } from "lucide-react";
import { TEAM } from "@/data/team";
import { PILLARS, getPillarsByCategory } from "@/constants/pillars";
import { pageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";

export const metadata = pageMetadata({
  title: "About Us — 10X Vedic Transform",
  description:
    "Our mission, the 11 pillars across body / mind / spirit, and the team behind the 48-day Vedic transformation program.",
  path: "/about",
});

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
    <div className="bg-[#FFFEF5] text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About 10X Vedic Transform",
            url: `${SITE_URL}/about`,
            mainEntity: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icons/icon-192.png`,
            },
          }),
        }}
      />
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <p className="text-[#FF9933] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Our Story
          </p>
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white ${SERIF_CLASS}`}>
            About 10X Vedic
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Bridging ancient Vedic wisdom with modern science to create a
            transformative 48-day journey for body, mind, and spirit.
          </p>
        </div>
      </section>

      {/* ═══ Mission & Vision ═══ */}
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Our Mission</h2>
              <p className="text-[#64748b] leading-relaxed">
                To make ancient Vedic wisdom accessible through modern technology.
                We believe that the timeless practices outlined in the Vedas can be
                structured, tracked, and integrated into daily life — empowering
                anyone to achieve lasting transformation.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Our Vision</h2>
              <p className="text-[#64748b] leading-relaxed">
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
      <section className="py-20 bg-[#FFF9F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            The <span className="text-[#E8860D]">Science</span> Behind 48 Days
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Why the Mandala cycle is the ideal framework for transformation
          </p>

          <div className="p-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm mb-10">
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              The 48-Day Mandala Cycle
            </h3>
            <p className="text-[#64748b] leading-relaxed mb-4">
              Modern neuroscience research shows that forming a lasting habit
              takes anywhere from 18 to 245 days, with the median around 66
              days. The Vedic tradition, however, has long recognized a powerful
              48-day cycle called a <em>Mandala</em> — a period of sustained
              practice that creates deep neurological rewiring.
            </p>
            <p className="text-[#64748b] leading-relaxed mb-4">
              At 48 days, you sit right in the sweet spot: long enough for the
              neurobiology of habit formation to take hold, yet short enough to
              maintain motivation and see tangible results. This duration allows
              the brain to build new neural pathways through consistent
              repetition while the body adapts to new routines at a cellular
              level.
            </p>
            <p className="text-[#64748b] leading-relaxed">
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
                color: "text-red-600",
                bg: "bg-red-500/15",
                border: "border-red-500/20",
              },
              {
                title: "Mind",
                count: mindPillars.length,
                pillars: mindPillars,
                color: "text-purple-600",
                bg: "bg-purple-500/15",
                border: "border-purple-500/20",
              },
              {
                title: "Spirit",
                count: spiritPillars.length,
                pillars: spiritPillars,
                color: "text-amber-600",
                bg: "bg-amber-500/15",
                border: "border-amber-500/20",
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className={`p-6 rounded-2xl bg-white shadow-sm border ${cat.border}`}
              >
                <h3 className={`text-lg font-bold ${cat.color} mb-1`}>
                  {cat.title}
                </h3>
                <p className="text-sm text-[#64748b] mb-4">
                  {cat.count} pillars
                </p>
                <ul className="space-y-2">
                  {cat.pillars.map((p) => (
                    <li key={p.id} className="text-sm text-[#64748b]">
                      <span className="text-[#1a1a1a] font-medium">{p.name}</span>{" "}
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
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-14 text-[#1a1a1a] ${SERIF_CLASS}`}>
            Meet the <span className="text-[#E8860D]">Founder</span>
          </h2>

          <div className="p-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-orange-500/20">
              {initials}
            </div>
            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">{founder.name}</h3>
              <p className="text-[#E8860D] font-medium mb-4">{founder.role}</p>
              <p className="text-[#64748b] leading-relaxed">{founder.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className={`text-3xl sm:text-5xl font-semibold text-white mb-6 ${SERIF_CLASS}`}>
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
