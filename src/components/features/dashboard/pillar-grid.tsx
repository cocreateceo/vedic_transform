"use client";

import Link from "next/link";
import { PILLARS, getPillarsByCategory, type Pillar } from "@/constants/pillars";
import { Check, Dumbbell, Brain, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PillarGridProps {
  completedPillars: string[];
}

const categoryConfig = {
  body: {
    title: "Body",
    subtitle: "Physical transformation",
    icon: Dumbbell,
    gradient: "from-orange-500 to-red-500",
    lightBg: "bg-orange-50",
    borderColor: "border-orange-200",
    progressBg: "bg-orange-500",
  },
  mind: {
    title: "Mind",
    subtitle: "Mental clarity",
    icon: Brain,
    gradient: "from-violet-500 to-purple-500",
    lightBg: "bg-violet-50",
    borderColor: "border-violet-200",
    progressBg: "bg-violet-500",
  },
  spirit: {
    title: "Spirit",
    subtitle: "Spiritual growth",
    icon: Sparkles,
    gradient: "from-amber-500 to-yellow-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    progressBg: "bg-amber-500",
  },
};

export function PillarGrid({ completedPillars }: PillarGridProps) {
  const totalPillars = PILLARS.length;
  const completedCount = completedPillars.length;
  const progressPercent = Math.round((completedCount / totalPillars) * 100);

  const bodyPillars = getPillarsByCategory("body");
  const mindPillars = getPillarsByCategory("mind");
  const spiritPillars = getPillarsByCategory("spirit");

  const getCompletedInCategory = (pillars: Pillar[]) =>
    pillars.filter((p) => completedPillars.includes(p.slug)).length;

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Progress</h3>
            <p className="text-sm text-gray-500">
              {completedCount} of {totalPillars} pillars completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Category mini stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {(["body", "mind", "spirit"] as const).map((cat) => {
            const config = categoryConfig[cat];
            const pillars = cat === "body" ? bodyPillars : cat === "mind" ? mindPillars : spiritPillars;
            const completed = getCompletedInCategory(pillars);
            return (
              <div
                key={cat}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  config.lightBg
                )}
              >
                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", config.gradient)}>
                  <config.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{config.title}</p>
                  <p className="font-semibold text-gray-900">
                    {completed}/{pillars.length}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Sections */}
      <CategorySection
        category="body"
        pillars={bodyPillars}
        completedPillars={completedPillars}
        config={categoryConfig.body}
      />
      <CategorySection
        category="mind"
        pillars={mindPillars}
        completedPillars={completedPillars}
        config={categoryConfig.mind}
      />
      <CategorySection
        category="spirit"
        pillars={spiritPillars}
        completedPillars={completedPillars}
        config={categoryConfig.spirit}
      />
    </div>
  );
}

interface CategorySectionProps {
  category: "body" | "mind" | "spirit";
  pillars: Pillar[];
  completedPillars: string[];
  config: (typeof categoryConfig)["body"];
}

function CategorySection({ pillars, completedPillars, config }: CategorySectionProps) {
  const completedCount = pillars.filter((p) => completedPillars.includes(p.slug)).length;
  const progressPercent = Math.round((completedCount / pillars.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={cn("p-4 border-b", config.lightBg, config.borderColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", config.gradient)}>
              <config.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{config.title}</h3>
              <p className="text-xs text-gray-500">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{completedCount}</span>
              <span className="text-gray-400">/{pillars.length}</span>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", config.progressBg)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pillar cards */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pillars.map((pillar) => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              isCompleted={completedPillars.includes(pillar.slug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PillarCardProps {
  pillar: Pillar;
  isCompleted: boolean;
}

function PillarCard({ pillar, isCompleted }: PillarCardProps) {
  const Icon = pillar.icon;

  return (
    <Link
      href={`/pillars/${pillar.slug}`}
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
        isCompleted
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
          : "bg-white border-gray-100 hover:border-amber-200 hover:shadow-md hover:scale-[1.02]"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
          pillar.bgColor
        )}
      >
        <Icon className="w-6 h-6" style={{ color: pillar.color }} />
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "font-medium truncate",
            isCompleted ? "text-green-700" : "text-gray-900"
          )}
        >
          {pillar.name}
        </h4>
        <p className="text-xs text-gray-500 truncate">{pillar.sanskritName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {isCompleted ? "✓ " : "+"}
            {pillar.karmaPointsBase} karma
          </span>
          {pillar.defaultDurationMinutes > 0 && (
            <span className="text-xs text-gray-400">
              {pillar.defaultDurationMinutes} min
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        className={cn(
          "w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1",
          isCompleted ? "text-green-400" : "text-gray-300"
        )}
      />
    </Link>
  );
}
