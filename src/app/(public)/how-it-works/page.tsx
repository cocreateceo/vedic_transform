import Link from "next/link";
import {
  ArrowRight,
  UserPlus,
  CalendarCheck,
  Clock,
  BarChart3,
  Award,
  Sunrise,
  Wind,
  Brain,
  PersonStanding,
  Moon,
  Sparkles,
} from "lucide-react";
import { getPillarsByCategory } from "@/constants/pillars";

export const metadata = {
  title: "How It Works — 10X Vedic Transform",
  description:
    "See how the 48-day Vedic transformation works: account setup, dosha assessment, daily check-ins across 11 pillars, streak tracking, and your personal Vedic Guide.",
};

const timelineSteps = [
  {
    num: 1,
    icon: UserPlus,
    title: "Create Account & Take Assessment",
    description:
      "Sign up for free and complete a brief self-assessment. This helps personalize your journey and sets your baseline for tracking transformation over the next 48 days.",
  },
  {
    num: 2,
    icon: CalendarCheck,
    title: "Start Your 48-Day Journey",
    description:
      "Your Mandala cycle begins. Each day is structured around the 11 transformation pillars — a balanced blend of body, mind, and spirit practices designed to create lasting change.",
  },
  {
    num: 3,
    icon: Clock,
    title: "Daily Practice: 30 min Mind + 30 min Body",
    description:
      "Dedicate roughly 60 minutes each day — 30 minutes for mind practices (meditation, breathwork, gratitude) and 30 minutes for body practices (movement, nutrition awareness, sleep optimization).",
  },
  {
    num: 4,
    icon: BarChart3,
    title: "Track Progress, Earn Karma, Build Streaks",
    description:
      "Log each completed pillar to earn Karma Points. Build daily streaks that compound your commitment. Watch your transformation unfold through visual progress dashboards.",
  },
  {
    num: 5,
    icon: Award,
    title: "Complete Mandala & Receive Certificate",
    description:
      "After 48 days of consistent practice, complete your Mandala cycle. Receive a digital certificate of completion and unlock the option to begin your next transformation cycle.",
  },
];

const dailyRoutine = [
  { time: "5:00 AM", activity: "Wake Up", icon: Sunrise, desc: "Rise during Brahma Muhurta for peak clarity" },
  { time: "5:15 AM", activity: "Breathwork", icon: Wind, desc: "Pranayama to oxygenate and energize" },
  { time: "5:30 AM", activity: "Meditation", icon: Brain, desc: "Healing meditation and intention setting" },
  { time: "6:00 AM", activity: "Movement", icon: PersonStanding, desc: "Yoga, walking, or strength training" },
  { time: "Evening", activity: "Reflection", icon: Sparkles, desc: "Gratitude practice and journaling" },
  { time: "9:30 PM", activity: "Sleep", icon: Moon, desc: "Wind down for deep restorative rest" },
];

export default function HowItWorksPage() {
  const bodyPillars = getPillarsByCategory("body");
  const mindPillars = getPillarsByCategory("mind");
  const spiritPillars = getPillarsByCategory("spirit");
  return (
    <div className="text-[#e2e8f0]">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Your Transformation Path
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            A clear, step-by-step guide to your 48-day Mandala journey — from
            sign-up to certification.
          </p>
        </div>
      </section>

      {/* ═══ 5-Step Timeline ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              5 Steps
            </span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Your roadmap from day one to transformation complete
          </p>

          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-orange-500/60 via-orange-500/30 to-amber-500/60 hidden sm:block" />

            <div className="space-y-8">
              {timelineSteps.map((step) => {
                const IconComp = step.icon;
                return (
                  <div key={step.num} className="relative flex gap-6 items-start">
                    {/* Number circle */}
                    <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                      {step.num}
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                      <div className="flex items-center gap-3 mb-3">
                        <IconComp className="w-5 h-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Daily Routine ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            A Day in Your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            A typical day of Vedic transformation practice
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dailyRoutine.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.activity}
                  className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-amber-400 text-sm font-medium">
                        {item.time}
                      </p>
                      <p className="text-white font-semibold">{item.activity}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Pillar Categories ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Three Dimensions
            </span>
          </h2>
          <p className="text-center text-[#94a3b8] mb-14 max-w-xl mx-auto">
            Body, Mind, and Spirit — the pillars of holistic transformation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Body",
                pillars: bodyPillars,
                color: "text-red-400",
                border: "border-red-500/20",
                iconBg: "bg-red-500/15",
              },
              {
                title: "Mind",
                pillars: mindPillars,
                color: "text-orange-400",
                border: "border-orange-500/20",
                iconBg: "bg-orange-500/15",
              },
              {
                title: "Spirit",
                pillars: spiritPillars,
                color: "text-amber-400",
                border: "border-amber-500/20",
                iconBg: "bg-amber-500/15",
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className={`p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border ${cat.border}`}
              >
                <h3 className={`text-xl font-bold ${cat.color} mb-4`}>
                  {cat.title}
                </h3>
                <ul className="space-y-3">
                  {cat.pillars.map((p) => {
                    const PillarIcon = p.icon;
                    return (
                      <li key={p.id} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${p.color}20` }}
                        >
                          <PillarIcon
                            className="w-4 h-4"
                            style={{ color: p.color }}
                          />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#94a3b8]">
                            {p.sanskritName}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Requirements ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What You{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Need
            </span>
          </h2>
          <p className="text-[#94a3b8] mb-10 max-w-xl mx-auto">
            The journey is simple. The commitment is what matters.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
            {[
              { value: "60 min/day", label: "Daily Time" },
              { value: "Open Mind", label: "Mindset" },
              { value: "Consistency", label: "Commitment" },
            ].map((req) => (
              <div key={req.label} className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  {req.value}
                </p>
                <p className="text-sm text-[#94a3b8] mt-1">{req.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-[#1a1508] to-amber-900/40" />
        <div className="absolute inset-0 bg-[#0f0d08]/40" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Begin?
            </span>
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-xl mx-auto">
            Your 48-day transformation is just one step away. Create your
            account and start the journey today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 transition-all"
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
