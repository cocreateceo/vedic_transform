"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sun,
  Timer,
  Wind,
  UtensilsCrossed,
  Dumbbell,
  SunMedium,
  Infinity as InfinityIcon,
  Sparkles,
  Moon,
  PersonStanding,
  Waves,
  Sunrise,
  Music2,
  Leaf,
  Flame,
} from "lucide-react";
import { MorningRoutine } from "@/components/features/sessions/morning-routine";
import { MeditationTimer } from "@/components/features/sessions/meditation-timer";
import { BreathingPatterns } from "@/components/features/sessions/breathing-patterns";
import { FastingTimer } from "@/components/features/sessions/fasting-timer";
import { MovementTimer } from "@/components/features/sessions/movement-timer";
import { SandhyaPractice } from "@/components/features/sessions/sandhya-practice";
import { BrahmanPractice } from "@/components/features/sessions/brahman-practice";
import { ManifestationPractice } from "@/components/features/sessions/manifestation-practice";
import { SleepPractice } from "@/components/features/sessions/sleep-practice";
import { YogaFlow } from "@/components/features/sessions/yoga-flow";
import { NidraPractice } from "@/components/features/sessions/nidra-practice";
import { DinacharyaPractice } from "@/components/features/sessions/dinacharya-practice";
import { MantraPractice } from "@/components/features/sessions/mantra-practice";
import { ManasicPractice } from "@/components/features/sessions/manasic-practice";
import { DoshaQuiz } from "@/components/features/sessions/dosha-quiz";
import { cn } from "@/lib/utils/cn";
import { sessionKeyToTabIndex } from "@/lib/practice-routes";

// Tab order MUST stay in lockstep with SESSION_KEYS in
// src/lib/practice-routes.ts. Order follows the pillar ID sequence so the
// daily ritual reads naturally top-to-bottom:
//   Morning (1) · Fasting (2) · Breathing (4) · Movement (5) ·
//   Meditation (6) · Sandhya (8) · Brahman (9) · Manifestation (10) · Sleep (11).
const tabs = [
  { name: "Morning Routine", icon: Sun, component: MorningRoutine },
  { name: "Fasting", icon: UtensilsCrossed, component: FastingTimer },
  { name: "Breathing", icon: Wind, component: BreathingPatterns },
  { name: "Movement", icon: Dumbbell, component: MovementTimer },
  { name: "Meditation", icon: Timer, component: MeditationTimer },
  { name: "Sandhya", icon: SunMedium, component: SandhyaPractice },
  { name: "Brahman", icon: InfinityIcon, component: BrahmanPractice },
  { name: "Manifest", icon: Sparkles, component: ManifestationPractice },
  { name: "Sleep", icon: Moon, component: SleepPractice },
  // New activities (appended after the 9 pillar tabs — keep these last so the
  // pillar deep-link indices in SESSION_KEYS stay valid).
  { name: "Yoga Flow", icon: PersonStanding, component: YogaFlow },
  { name: "Yoga Nidra", icon: Waves, component: NidraPractice },
  { name: "Dinacharya", icon: Sunrise, component: DinacharyaPractice },
  { name: "Mantra", icon: Music2, component: MantraPractice },
  { name: "Manasic Puja", icon: Flame, component: ManasicPractice },
  { name: "Dosha Quiz", icon: Leaf, component: DoshaQuiz },
];

export default function SessionsPage() {
  // Read ?practice=<key> so the dashboard's TodaysPractice CTA — and the
  // "Next" button on each completion view — can deep-link straight into
  // the right timer. Defaults to tab 0 when missing or unknown.
  const searchParams = useSearchParams();
  const desiredTab = sessionKeyToTabIndex(searchParams?.get("practice"));
  const [activeTab, setActiveTab] = useState(desiredTab);

  // Re-sync when the URL param changes (e.g. user clicks "Next: Breathing"
  // on the meditation completion view — without this the tab wouldn't
  // switch because useState's initializer only runs once).
  useEffect(() => {
    setActiveTab(desiredTab);
  }, [desiredTab]);

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Guided Sessions
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Interactive tools to support your daily practice and transformation.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === index
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                  : "bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:bg-orange-50 border border-[var(--color-border)]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active component */}
      <div className="vedic-card p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}
