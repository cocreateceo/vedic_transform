"use client";

import { useState } from "react";
import { Sun, Timer, Wind, UtensilsCrossed, Dumbbell } from "lucide-react";
import { MorningRoutine } from "@/components/features/sessions/morning-routine";
import { MeditationTimer } from "@/components/features/sessions/meditation-timer";
import { BreathingPatterns } from "@/components/features/sessions/breathing-patterns";
import { FastingTimer } from "@/components/features/sessions/fasting-timer";
import { MovementTimer } from "@/components/features/sessions/movement-timer";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { name: "Morning Routine", icon: Sun, component: MorningRoutine },
  { name: "Meditation", icon: Timer, component: MeditationTimer },
  { name: "Breathing", icon: Wind, component: BreathingPatterns },
  { name: "Fasting", icon: UtensilsCrossed, component: FastingTimer },
  { name: "Movement", icon: Dumbbell, component: MovementTimer },
];

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState(0);
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
