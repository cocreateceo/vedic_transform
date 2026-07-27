import { CalendarDays, GraduationCap, Users, Sparkles } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";
import { RegistrationForm } from "./registration-form";

export const metadata = pageMetadata({
  title: "Register — 10x Vedic Live Cohort",
  description:
    "Register free for the 10x Vedic live cohort — a guided 48-day, 11-chapter training starting Monday, August 17, 2026.",
  path: "/10x-vedic/register",
});

const HIGHLIGHTS = [
  {
    icon: CalendarDays,
    title: "48 days, live",
    text: "Monday, August 17 — October 3, 2026. A guided cohort, not a solo course.",
  },
  {
    icon: GraduationCap,
    title: "11 chapters",
    text: "The full 10x Vedic framework — consciousness, health, relationships, leadership, wealth.",
  },
  {
    icon: Users,
    title: "Community",
    text: "Walk the 48 days with fellow seekers and live Q&A along the way.",
  },
] as const;

export default function CohortRegisterPage() {
  return (
    <div className="text-[#1a1a1a]">
      {/* ═══ Hero (navy band, matches /10x-vedic) ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Free live cohort — starts Monday, August 17, 2026
          </span>
          <h1 className={`mt-6 text-4xl sm:text-5xl font-semibold leading-tight text-white ${SERIF_CLASS}`}>
            Register for the{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              10x Vedic
            </span>{" "}
            Live Cohort
          </h1>
          <p className="mt-4 text-lg text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
            A guided 48-day, 11-chapter training on living and leading from
            higher awareness. Free — all you need is an email address.
          </p>
        </div>
      </section>

      {/* ═══ What you get ═══ */}
      <section className="py-14 bg-[#FFFEF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-5"
            >
              <Icon className="w-6 h-6 text-[#E8860D]" />
              <h2 className="mt-3 text-lg font-semibold">{title}</h2>
              <p className="mt-1.5 text-[15px] text-[#64748b] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Registration form ═══ */}
      <section className="py-16 bg-[#FFF9F0]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-3 ${SERIF_CLASS}`}>
            Reserve your <span className="text-[#E8860D]">seat</span>
          </h2>
          <p className="text-base text-[#64748b] text-center mb-8">
            We&rsquo;ll email you joining details before the cohort begins.
          </p>
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
