"use client";

import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { PILLARS, type PillarCategory } from "@/constants/pillars";

type Filter = "all" | PillarCategory;

const filterTabs: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "body", label: "Body" },
  { key: "mind", label: "Mind" },
  { key: "spirit", label: "Spirit" },
];

const categoryStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
  body: { label: "Body", bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/30" },
  mind: { label: "Mind", bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30" },
  spirit: { label: "Spirit", bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/30" },
};

export function PillarsGrid() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered =
    activeFilter === "all"
      ? PILLARS
      : PILLARS.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* ═══ Filter Tabs ═══ */}
      <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === tab.key
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-white/[0.03] border border-white/[0.06] text-[#94a3b8] hover:border-orange-500/30 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Pillar Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pillar) => {
          const IconComp = pillar.icon;
          const cat = categoryStyles[pillar.category];
          const isExpanded = expandedId === pillar.id;

          return (
            <div
              key={pillar.id}
              className={`rounded-2xl bg-white/[0.03] backdrop-blur-sm border transition-all ${cat.border}`}
            >
              {/* Card Header — always visible */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : pillar.id)}
                className="w-full p-6 text-left cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${pillar.color}20` }}
                    >
                      <IconComp className="w-6 h-6" style={{ color: pillar.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{pillar.name}</h3>
                      <p className="text-xs text-amber-400/80 font-medium">
                        {pillar.sanskritName}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#94a3b8] shrink-0 transition-transform duration-200 mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Category badge + duration */}
                <div className="flex items-center gap-3 mt-4">
                  <span
                    className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} font-medium`}
                  >
                    {cat.label}
                  </span>
                  {pillar.defaultDurationMinutes > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#94a3b8]">
                      <Clock className="w-3 h-3" />
                      {pillar.defaultDurationMinutes} min
                    </span>
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-white/[0.06] pt-4">
                  <p className="text-sm text-[#94a3b8] leading-relaxed mb-3">
                    {pillar.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-orange-400">
                    <span className="font-medium">
                      +{pillar.karmaPointsBase} Karma Points per session
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
