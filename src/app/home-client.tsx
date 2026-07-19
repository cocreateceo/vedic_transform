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
  Waves,
  Moon,
  Target,
  Sunrise,
  HeartHandshake,
  Gift,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { YouTubeIntro } from "@/components/features/landing/youtube-intro";
import { PILLARS } from "@/constants/pillars";
import { TESTIMONIALS } from "@/data/testimonials";
import { FAQ_DATA } from "@/data/faq";
import { TransformationFlow } from "@/components/features/landing/transformation-flow";
import { INTENTIONS } from "@/data/intentions";
import { MandalaBackdrop } from "@/components/features/onboarding/mandala-backdrop";
import { PexelsVideo } from "@/components/ui/pexels-video";
import { SERIF_CLASS } from "@/lib/fonts";

/* ─── Category colors for pillar badges ─── */
const categoryStyles: Record<string, { label: string; bg: string; text: string }> = {
  body: { label: "Body", bg: "bg-red-500/10", text: "text-red-600" },
  mind: { label: "Mind", bg: "bg-purple-500/10", text: "text-purple-600" },
  spirit: { label: "Spirit", bg: "bg-amber-500/10", text: "text-amber-600" },
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

/* ─── Intention card icons (keyed by intention.key) ─── */
const intentionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  calm: Waves,
  sleep: Moon,
  focus: Target,
  energy: Sunrise,
  healing: HeartHandshake,
  abundance: Gift,
};

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
  const avgRating =
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length;
  const completers = TESTIMONIALS.filter((t) => t.dayCompleted >= 48).length;

  return (
    <div className="min-h-screen bg-[#FFFEF5] text-[#1a1a1a]">
      {/* ═══ 1. Navbar ═══ */}
      <PublicNavbar />

      {/* ═══ 2. Hero Section ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
        {/* Looping ambient hero video — kept very dim so text stays legible */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <PexelsVideo slug="home-hero" showAttribution={false} className="w-full h-full" />
        </div>
        {/* Dark gradient overlay on top of the video for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/50 to-[#1E293B]/85 pointer-events-none" />
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        {/* Slow-rotating mandala behind the hero title */}
        <MandalaBackdrop className="mix-blend-screen" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            48-Day Vedic Transformation Program
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-semibold leading-tight ${SERIF_CLASS}`}>
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
      <section className="bg-[#0F172A] border-y border-amber-500/15">
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
      <section className="py-20 bg-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            How It <span className="text-[#E8860D]">Works</span>
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Four simple steps to begin your transformation journey
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm hover:border-orange-500/30 transition-colors group"
              >
                {/* Number circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg shadow-orange-500/20">
                  {step.num}
                </div>
                <step.icon className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{step.desc}</p>
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
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            The{" "}
            <span className="text-[#E8860D]">
              48-Day Path
            </span>
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Your daily transformation journey through 11 pillars
          </p>
          <TransformationFlow />
        </div>
      </section>

      {/* ═══ 5. 11 Pillars Grid ═══ */}
      <section className="py-20 bg-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            The <span className="text-[#E8860D]">11 Pillars</span> of Transformation
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            A comprehensive system addressing body, mind, and spirit
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const cat = categoryStyles[pillar.category];
              const IconComp = pillar.icon;
              return (
                <Link
                  key={pillar.id}
                  href="/pillars-overview"
                  className="group block"
                >
                  <div
                    className="p-6 rounded-2xl bg-white border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg h-full"
                    style={{
                      borderColor: `${pillar.color}20`,
                      boxShadow: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${pillar.color}50`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${pillar.color}15`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${pillar.color}20`;
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${pillar.color}15` }}
                      >
                        <IconComp className="w-7 h-7" style={{ color: pillar.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[#1a1a1a] font-bold text-base">{pillar.name}</h3>
                        </div>
                        <p className="text-xs font-medium mb-2" style={{ color: pillar.color }}>{pillar.sanskritName}</p>
                        <p className="text-sm text-[#64748b] leading-relaxed mb-3">{pillar.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} font-medium`}>
                            {cat.label}
                          </span>
                          {pillar.defaultDurationMinutes > 0 && (
                            <span className="text-xs text-[#64748b]">
                              {pillar.defaultDurationMinutes} min
                            </span>
                          )}
                          <span className="text-xs text-amber-600/80">
                            +{pillar.karmaPointsBase} karma
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#1a1a1a]/8 flex items-center justify-end">
                      <span className="text-xs text-[#E8860D] group-hover:text-[#FF9933] font-medium flex items-center gap-1 transition-colors">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 5.5 Begin with an Intention ═══ */}
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            Begin with an <span className="text-[#E8860D]">Intention</span>
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Not sure where to start? Start with what you need. Each intention
            maps to the pillars and wisdom that serve it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTENTIONS.map((intention) => {
              const Icon = intentionIcons[intention.key];
              return (
                <Link
                  key={intention.key}
                  href={`/blog?tag=${encodeURIComponent(intention.blogTag)}`}
                  className="group p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      {Icon && <Icon className="w-5 h-5 text-orange-400" />}
                    </span>
                    <h3 className="text-[#1a1a1a] font-semibold group-hover:text-[#E8860D] transition-colors">
                      {intention.label}
                    </h3>
                  </div>
                  <p className="text-sm text-[#64748b] leading-relaxed mb-4">
                    {intention.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {intention.pillars.map((pillar) => (
                      <span
                        key={pillar}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFF9F0] text-[#64748b] border border-[#FF9933]/15"
                      >
                        {pillar}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-[#E8860D] group-hover:text-[#FF9933] font-medium flex items-center gap-1 transition-colors">
                    Explore this path <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 6. Benefits Grid ═══ */}
      <section className="py-20 bg-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            What You&apos;ll <span className="text-[#E8860D]">Gain</span>
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Real outcomes from consistent daily practice
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm hover:border-orange-500/20 transition-colors"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <b.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-1">{b.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6b. Tools & Features ═══ */}
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            Powerful <span className="text-[#E8860D]">Tools</span> Inside
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Everything you need for a complete transformation journey
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dosha Assessment */}
            <Link href="/login?tab=signup" className="group">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#DAA520]/40 hover:border-[#DAA520]/60 transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1.5 0 2.8 1.3c1 1 1 2.5 1 2.5s-1.5 1.5-3.5 7.2A7 7 0 0 1 11 20"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg mb-2">Dosha Assessment</h3>
                <p className="text-sm text-[#64748b] leading-relaxed mb-3">
                  Discover your Ayurvedic constitution — Vata, Pitta, or Kapha. Get personalized diet, exercise, and pillar recommendations based on your body type.
                </p>
                <span className="text-xs text-[#E8860D] font-medium flex items-center gap-1">
                  Take the quiz <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Audio Meditations */}
            <Link href="/login?tab=signup" className="group">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#DAA520]/40 hover:border-[#DAA520]/60 transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg mb-2">Audio Meditations</h3>
                <p className="text-sm text-[#64748b] leading-relaxed mb-3">
                  9 in-app guided audio sessions — Om chanting, Pranayama, Yoga Nidra, chakra healing, and more. Play directly in your browser with a persistent mini-player.
                </p>
                <span className="text-xs text-[#E8860D] font-medium flex items-center gap-1">
                  Listen now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Personalized Onboarding */}
            <Link href="/login?tab=signup" className="group">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#DAA520]/40 hover:border-[#DAA520]/60 transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8h6.1l-4.9 3.6 1.9 5.8L12 14.6l-4.9 3.6 1.9-5.8L4 8.8h6.1z"/></svg>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg mb-2">Personalized Journey</h3>
                <p className="text-sm text-[#64748b] leading-relaxed mb-3">
                  Take a quick quiz to customize your 48-day plan. We match your goals, experience level, and available time to the perfect pillar combination.
                </p>
                <span className="text-xs text-[#E8860D] font-medium flex items-center gap-1">
                  Get started <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 7. Testimonials ═══ */}
      <section className="py-20 bg-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            Voices of <span className="text-[#E8860D]">Transformation</span>
          </h2>
          <p className="text-center text-[#64748b] mb-6 max-w-xl mx-auto">
            Hear from those who completed the 48-day Mandala
          </p>

          {/* Aggregate rating — computed from the stories below, not a claim */}
          <div className="flex items-center justify-center gap-2 mb-14 text-sm text-[#64748b]">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-[#e5dcc8]"}`}
                />
              ))}
            </span>
            <span className="text-[#1a1a1a] font-semibold">{avgRating.toFixed(1)}</span>
            <span>
              average from featured stories &middot; {completers} of {TESTIMONIALS.length} completed all 48 days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-[#e5dcc8]"}`}
                    />
                  ))}
                </div>
                <p className="text-[#64748b] text-sm leading-relaxed mb-4 line-clamp-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Pillars this practitioner leaned on */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {t.topPillars.slice(0, 2).map((slug) => (
                    <span
                      key={slug}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/10 text-[#E8860D] border border-orange-500/20 capitalize"
                    >
                      {slug.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[#1a1a1a] font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-[#64748b]">Day {t.dayCompleted} completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#1a1a1a] bg-white border border-[#FF9933]/30 hover:bg-[#FFF9F0] hover:border-[#FF9933]/60 transition-all"
            >
              Read all transformation stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 8. FAQ Preview ═══ */}
      <section className="py-20 bg-[#FFFEF5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-semibold text-center mb-4 text-[#1a1a1a] ${SERIF_CLASS}`}>
            Frequently Asked <span className="text-[#E8860D]">Questions</span>
          </h2>
          <p className="text-center text-[#64748b] mb-14 max-w-xl mx-auto">
            Everything you need to know before starting
          </p>

          <div className="space-y-3">
            {faqPreview.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-white border border-[#FF9933]/20 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
                  >
                    <span className="font-medium text-[#1a1a1a]">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#64748b] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#64748b] leading-relaxed">
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
              className="inline-flex items-center gap-2 text-[#E8860D] hover:text-[#FF9933] font-medium transition-colors"
            >
              View All FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA Section ═══ */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#FF9933] to-[#F59E0B]">
        {/* Ambient glow */}
        <div className="absolute -top-20 right-1/4 w-[500px] h-[300px] bg-[#FFD700]/25 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-5xl font-semibold text-white mb-6 ${SERIF_CLASS}`}>
            Ready to Transform?
          </h2>
          <p className="text-lg text-[#FFF9F0] mb-10 max-w-xl mx-auto">
            Start your 48-day Mandala journey today. Show up daily, stay consistent,
            and unlock your highest potential.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-lg bg-[#0F172A] hover:bg-[#1E293B] shadow-xl shadow-black/20 transition-colors"
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
