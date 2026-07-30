import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Lock, Sparkles } from "lucide-react";
import { TRAINING_CHAPTERS } from "@/data/training-book";
import { pageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";

export const metadata = pageMetadata({
  title: "10x Vedic Training Course — Free Online Course",
  description:
    "Ancient Wisdom. Conscious Leadership. Science-Powered Transformation. A free 11-chapter, 48-day training course on living and leading from higher awareness.",
  path: "/10x-vedic",
});

const FIVE_DIMENSIONS = [
  "Consciousness",
  "Health & Energy",
  "Relationships & Service",
  "Leadership & Creation",
  "Wealth & Purpose",
];

export default function TenXVedicPage() {
  return (
    <div className="text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "10x Vedic Training Course",
            description:
              "An 11-chapter, 48-day training course combining timeless Vedic wisdom with science-enabled measurable transformation — consciousness, health, relationships, leadership, and wealth.",
            isAccessibleForFree: true,
            provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          }),
        }}
      />

      {/* ═══ Hero (cinematic dark band — navy) ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <GraduationCap className="w-3.5 h-3.5" />
            Free training course
          </span>
          <h1 className={`mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white ${SERIF_CLASS}`}>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              10x Vedic
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Ancient Wisdom. Conscious Leadership. Science-Powered
            Transformation. A 48-day practical framework for living, leading,
            healing, creating, and scaling life from higher awareness.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/10x-vedic/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
            >
              Join the live cohort <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/15 text-white hover:bg-white/5 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#94a3b8]">
            Live cohort starts Monday, August 17, 2026 — $399, discounts
            available through service exchange. Or start the free{" "}
            <Link href="/register" className="underline hover:text-white">
              self-paced course
            </Link>{" "}
            anytime.
          </p>
        </div>
      </section>

      {/* ═══ Five Dimensions ═══ */}
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-semibold mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            Evolve in <span className="text-[#E8860D]">Five Dimensions</span>
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto mb-10">
            The course is a roadmap toward conscious living and purposeful
            impact — aligned expansion, not working ten times harder.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {FIVE_DIMENSIONS.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF9933]/15 bg-[#FFF9F0] text-sm text-[#64748b]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8860D]" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Chapter Outline ═══ */}
      <section className="py-20 bg-[#FFF9F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-10 text-[#1a1a1a] ${SERIF_CLASS}`}>
            The <span className="text-[#E8860D]">11 Chapters</span>
          </h2>
          <div className="space-y-3">
            {TRAINING_CHAPTERS.map((chapter) => (
              <div
                key={chapter.slug}
                className="rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0 w-20 h-[45px] rounded-lg overflow-hidden">
                    <Image
                      src={chapter.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1 left-1 w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-center backdrop-blur-sm">
                      {chapter.number === 0 ? "In" : chapter.number}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-[#1a1a1a]">
                        {chapter.title}
                      </h3>
                      {chapter.status === "coming-soon" && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-[#1a1a1a]/15 text-[#64748b]">
                          <Lock className="w-2.5 h-2.5" /> Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748b] mt-1 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Closing CTA (navy band) ═══ */}
      <section className="py-20 bg-[#0F172A] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <p className={`text-xl sm:text-2xl font-semibold leading-relaxed text-white ${SERIF_CLASS}`}>
            &ldquo;The future belongs to the{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              most conscious
            </span>
            .&rdquo;
          </p>
          <Link
            href="/10x-vedic/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
          >
            Join the live cohort <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
