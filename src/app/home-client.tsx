"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  ChevronDown,
  Shield,
  Heart,
  Flame,
  Brain,
  Zap,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { YouTubeIntro } from "@/components/features/landing/youtube-intro";
import { PILLARS } from "@/constants/pillars";
import { TESTIMONIALS } from "@/data/testimonials";
import { FAQ_DATA } from "@/data/faq";
import { TransformationFlow } from "@/components/features/landing/transformation-flow";

/* ─── Category colors for pillar badges ─── */
const categoryStyles: Record<string, { label: string; bg: string; text: string }> = {
  body: { label: "Body", bg: "bg-red-500/20", text: "text-red-300" },
  mind: { label: "Mind", bg: "bg-purple-500/20", text: "text-purple-300" },
  spirit: { label: "Spirit", bg: "bg-amber-500/20", text: "text-amber-300" },
};

/* ─── Benefits data ─── */
const benefits = [
  { icon: Shield, title: "Strong Discipline", desc: "Build unshakable daily routines that compound over 48 days" },
  { icon: Heart, title: "Emotional Stability", desc: "Develop inner calm through meditation and gratitude practices" },
  { icon: Flame, title: "Better Metabolism", desc: "Optimize digestion with Vedic nutrition and movement" },
  { icon: Brain, title: "Clear Mind", desc: "Sharpen focus and decision-making with thought-reset techniques" },
  { icon: TrendingUp, title: "Rapid Growth", desc: "Accelerate personal evolution through spiritual alignment" },
  { icon: Zap, title: "Success Energy", desc: "Activate manifestation power and abundance mindset" },
];

/* ─── How It Works steps ─── */
const steps = [
  { num: 1, icon: UserPlus, title: "Sign Up", desc: "Create your free account and set your transformation intention" },
  { num: 2, icon: CalendarCheck, title: "Practice Daily", desc: "Engage with the 11 pillars for ~60 minutes each day" },
  { num: 3, icon: BarChart3, title: "Track Progress", desc: "Earn Karma Points, maintain streaks, and watch yourself grow" },
  { num: 4, icon: Sparkles, title: "Transform", desc: "Complete 48 days and emerge as your highest self" },
];

export function HomePageClient() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const faqPreview = FAQ_DATA.slice(0, 4);
  const testimonialPreview = TESTIMONIALS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f0d08] text-[#e2e8f0]">
      {/* ═══ 1. Navbar ═══ */}
      <PublicNavbar />

      {/* ═══ 2. Hero Section ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            48-Day Vedic Transformation Program
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Transform Yourself
            </span>
            <br />
            <span className="text-white">in 48 Days</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            A scientific + spiritual journey to realign your body, mind &amp; energy
            through 11 Vedic transformation pillars.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#video"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border border-[#94a3b8]/30 text-[#e2e8f0] hover:bg-white/5 transition-colors"
            >
              <span className="text-lg">&#9654;</span>
              Watch Intro
            </a>
          </div>

          {/* YouTube Video */}
          <div id="video" className="mt-16">
            <YouTubeIntro />
          </div>
        </div>
      </section>

      {/* ═══ 3. Stats Bar ═══ */}
      <section className="bg-[#1a1510]/80 border-y border-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "48", label: "Days" },
              { value: "11", label: "Pillars" },
              { value: "60", label: "Min/Day" },
              { value: "1000+", label: "Transformations" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#94a3b8] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. How It Works ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How It <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Four simple steps to begin your transformation journey
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/30 transition-colors group"
              >
                {/* Number circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg shadow-orange-500/20">
                  {step.num}
                </div>
                <step.icon className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{step.desc}</p>
                {/* Connector arrow (not on last) */}
                {step.num < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-orange-500/40">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4.5 Transformation Flow ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              48-Day Path
            </span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Your daily transformation journey through 11 pillars
          </p>
          <TransformationFlow />
        </div>
      </section>

      {/* ═══ 5. 11 Pillars Grid ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">11 Pillars</span> of Transformation
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            A comprehensive system addressing body, mind, and spirit
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((pillar) => {
              const cat = categoryStyles[pillar.category];
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/30 transition-all hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${pillar.color}20` }}
                  >
                    <IconComp className="w-6 h-6" style={{ color: pillar.color }} />
                  </div>
                  <h3 className="text-white font-semibold">{pillar.name}</h3>
                  <p className="text-xs text-amber-400/80 font-medium mb-2">{pillar.sanskritName}</p>
                  <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} font-medium`}>
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/pillars-overview"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              View All Pillars
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 6. Benefits Grid ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            What You&apos;ll <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Gain</span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Real outcomes from consistent daily practice
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/20 transition-colors"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <b.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{b.title}</h3>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. Testimonials ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Voices of <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Transformation</span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Hear from those who completed the 48-day Mandala
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialPreview.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-6 line-clamp-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
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

      {/* ═══ 8. FAQ Preview ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Everything you need to know before starting
          </p>

          <div className="space-y-3">
            {faqPreview.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#94a3b8] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#94a3b8] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              View All FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA Section ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-[#1a1508] to-amber-900/40" />
        <div className="absolute inset-0 bg-[#0f0d08]/40" />
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Transform?
            </span>
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-xl mx-auto">
            Start your 48-day Mandala journey today. Show up daily, stay consistent,
            and unlock your highest potential.
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

      {/* ═══ 10. Footer ═══ */}
      <PublicFooter />
    </div>
  );
}
