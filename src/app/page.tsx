import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Flame,
  Sunrise,
  Brain,
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  Apple,
  Dumbbell,
  Moon,
  Wind,
  Sun,
  Youtube,
} from "lucide-react";
import { YouTubeIntro } from "@/components/features/landing/youtube-intro";

const pillarsData = {
  body: {
    title: "Body",
    subtitle: "Physical transformation & vitality",
    color: "from-red-500 to-orange-500",
    pillars: [
      { icon: Sunrise, name: "5 AM Initiation", sanskrit: "Brahma Muhurta", desc: "Wake before sunrise to harness the sacred morning hours", color: "#FFD700" },
      { icon: Apple, name: "Mindful Nutrition", sanskrit: "Ahara", desc: "Practice conscious eating and intermittent fasting", color: "#FF6B35" },
      { icon: Dumbbell, name: "Sacred Movement", sanskrit: "Vyayama", desc: "30 minutes of physical exercise or yoga asanas", color: "#EF4444" },
      { icon: Moon, name: "Sleep Mastery", sanskrit: "Nidra", desc: "Optimize your sleep for physical and mental restoration", color: "#6366F1" },
    ],
  },
  mind: {
    title: "Mind",
    subtitle: "Mental clarity & emotional balance",
    color: "from-violet-500 to-purple-500",
    pillars: [
      { icon: Brain, name: "Thought Power", sanskrit: "Sankalpa", desc: "Set daily intentions and cultivate positive thought patterns", color: "#8B5CF6" },
      { icon: Wind, name: "Pranayama", sanskrit: "Prana Vidya", desc: "Practice breath control and meditation techniques", color: "#06B6D4" },
      { icon: Heart, name: "Healing Meditation", sanskrit: "Chikitsa Dhyana", desc: "Guided meditation for physical and emotional healing", color: "#EC4899" },
      { icon: Sparkles, name: "Gratitude Practice", sanskrit: "Kritajna", desc: "Express gratitude for three things each day", color: "#F59E0B" },
    ],
  },
  spirit: {
    title: "Spirit",
    subtitle: "Spiritual awakening & divine connection",
    color: "from-amber-500 to-yellow-500",
    pillars: [
      { icon: Sun, name: "Sandhya Meditation", sanskrit: "Sandhyavandana", desc: "Align body rhythms with nature (3x daily)", color: "#FFC107" },
      { icon: Sparkles, name: "Connection to Brahman", sanskrit: "Brahma Sambandha", desc: "Expand consciousness, connect with universal energy", color: "#673AB7" },
      { icon: Sparkles, name: "Divine Manifestation", sanskrit: "Sankalpa Shakti", desc: "Set intentions and manifest your highest goals", color: "#A855F7" },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />

        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpg"
                alt="10X Vedic Logo"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                10X Vedic
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@vedic-s"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
              >
                <Youtube className="w-5 h-5" />
                <span className="hidden sm:inline">YouTube</span>
              </a>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button>Start Free</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Banner with Face */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <a
            href="https://www.youtube.com/@vedic-s"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden shadow-2xl group"
          >
            <div className="relative aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[21/6] w-full max-h-[40vh]">
              <Image
                src="/images/banner.jpg"
                alt="10X Transformation"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* Text Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 md:px-16">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    10X
                    <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      Transformation
                    </span>
                  </h2>
                  <p className="mt-2 sm:mt-4 text-amber-200 text-sm sm:text-lg flex items-center gap-2">
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                    Watch on YouTube
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            48-Day Transformation Program
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Transform Your Life with
            <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Vedic Wisdom
            </span>
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            A scientific + spiritual journey to realign your body, mind &
            energy. Rewire your habits, strengthen mental focus, and build a
            powerful lifestyle.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="min-w-[200px]">
                Begin Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#pillars">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              30 min/day for mind
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              30 min/day for body
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Free to start
            </div>
          </div>

          {/* Introduction Video */}
          <YouTubeIntro className="mt-16" />
        </div>
      </header>

      {/* Features Section - 11 Pillars by Category */}
      <section id="pillars" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              11 Transformation Pillars
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive system addressing body, mind, and spirit for
              complete transformation
            </p>
          </div>

          {/* Body Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillarsData.body.color} flex items-center justify-center`}>
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{pillarsData.body.title}</h3>
                <p className="text-gray-600">{pillarsData.body.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillarsData.body.pillars.map((pillar, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: pillar.color }}>
                  <CardContent className="p-5">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${pillar.color}20` }}
                    >
                      <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <h4 className="font-semibold text-gray-900">{pillar.name}</h4>
                    <p className="text-xs text-amber-600 font-medium mb-2">{pillar.sanskrit}</p>
                    <p className="text-sm text-gray-600">{pillar.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mind Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillarsData.mind.color} flex items-center justify-center`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{pillarsData.mind.title}</h3>
                <p className="text-gray-600">{pillarsData.mind.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillarsData.mind.pillars.map((pillar, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: pillar.color }}>
                  <CardContent className="p-5">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${pillar.color}20` }}
                    >
                      <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <h4 className="font-semibold text-gray-900">{pillar.name}</h4>
                    <p className="text-xs text-amber-600 font-medium mb-2">{pillar.sanskrit}</p>
                    <p className="text-sm text-gray-600">{pillar.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Spirit Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillarsData.spirit.color} flex items-center justify-center`}>
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{pillarsData.spirit.title}</h3>
                <p className="text-gray-600">{pillarsData.spirit.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pillarsData.spirit.pillars.map((pillar, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: pillar.color }}>
                  <CardContent className="p-5">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${pillar.color}20` }}
                    >
                      <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <h4 className="font-semibold text-gray-900">{pillar.name}</h4>
                    <p className="text-xs text-amber-600 font-medium mb-2">{pillar.sanskrit}</p>
                    <p className="text-sm text-gray-600">{pillar.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/register">
              <Button size="lg">
                Start Your 48-Day Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              What You&apos;ll Gain
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Strong discipline",
              "High emotional stability",
              "Better digestion & metabolism",
              "Clear mind & sharp decisions",
              "Rapid spiritual growth",
              "Activated success energy",
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform?
          </h2>
          <p className="text-xl text-amber-100 mb-10">
            Start your 48-day journey today. Show up daily, stay consistent, and
            receive your transformation.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              Start Your Free Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.jpg"
                alt="10X Vedic Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-white">10X Vedic</span>
            </div>
            <a
              href="https://www.youtube.com/@vedic-s"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              <span>Subscribe on YouTube</span>
            </a>
            <p className="text-sm">
              © {new Date().getFullYear()} 10X Vedic Transformation. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
