import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Wind, Flame, Droplet } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Dosha Test — Discover Your Ayurvedic Constitution",
  description:
    "Take the free 2-minute Vedic dosha test to find out if you're Vata, Pitta, or Kapha — and get personalized recommendations for body, mind, and spirit.",
  openGraph: {
    title: "Free Vedic Dosha Test",
    description:
      "Discover your Ayurvedic dosha in 2 minutes. Vata, Pitta, or Kapha — find out which body-mind type you are.",
    type: "website",
  },
};

const doshas = [
  {
    name: "Vata",
    sanskrit: "वात",
    element: "Air + Space",
    color: "from-cyan-500 to-blue-500",
    icon: Wind,
    trait: "Creative, quick, light",
  },
  {
    name: "Pitta",
    sanskrit: "पित्त",
    element: "Fire + Water",
    color: "from-orange-500 to-red-500",
    icon: Flame,
    trait: "Focused, intense, driven",
  },
  {
    name: "Kapha",
    sanskrit: "कफ",
    element: "Earth + Water",
    color: "from-green-500 to-emerald-500",
    icon: Droplet,
    trait: "Steady, grounded, calm",
  },
];

export default function DoshaTestLandingPage() {
  return (
    <div className="text-[#e2e8f0]">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0d08] to-[#1a1508] py-16 sm:py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs uppercase tracking-wider text-orange-300 mb-4">
            Free · 2 minutes · No signup
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            What is your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Vedic Dosha?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto">
            12 quick questions reveal your Ayurvedic constitution — Vata, Pitta, or Kapha — and
            the body, mind, and spirit practices most aligned with you.
          </p>
          <Link
            href="/dosha-test/quiz"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Start the test
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-[#0f0d08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            The three Doshas
          </h2>
          <p className="text-center text-[#94a3b8] mb-10 max-w-2xl mx-auto">
            Ayurveda holds that every person is a unique combination of three doshas. Knowing yours
            shapes what you eat, when you sleep, and how you practice.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doshas.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-orange-300 mb-1">{d.element}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{d.name}</h3>
                    <span className="text-amber-300 text-lg">{d.sanskrit}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{d.trait}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            After the test
          </h2>
          <p className="text-[#94a3b8] mb-6 max-w-xl mx-auto">
            You&apos;ll get a shareable result with personalized recommendations and the option to
            start the full 48-day Vedic transformation.
          </p>
          <Link
            href="/dosha-test/quiz"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Begin
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
