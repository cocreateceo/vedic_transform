"use client";

import type { Mantra } from "@/data/mantras";

interface MantraCardProps {
  mantra: Mantra;
  onOpen: (mantra: Mantra) => void;
}

// Category → accent colour. Keeps the library visually scannable while the
// yantra visuals are being produced.
const CATEGORY_ACCENT: Record<string, string> = {
  foundational: "from-amber-400 to-orange-500",
  solar: "from-yellow-400 to-orange-500",
  healing: "from-violet-400 to-indigo-500",
  "invocation-devata": "from-rose-400 to-pink-500",
  vishnu: "from-blue-400 to-cyan-500",
  knowledge: "from-sky-300 to-slate-400",
  abundance: "from-pink-300 to-rose-400",
  protection: "from-red-500 to-orange-600",
  courage: "from-orange-500 to-red-500",
  "universal-peace": "from-emerald-300 to-teal-400",
  "daily-ritual": "from-amber-300 to-yellow-500",
  brahman: "from-violet-500 to-indigo-700",
};

export function MantraCard({ mantra, onOpen }: MantraCardProps) {
  const gradient = CATEGORY_ACCENT[mantra.category] ?? "from-amber-400 to-orange-500";
  return (
    <button
      type="button"
      onClick={() => onOpen(mantra)}
      className="group text-left vedic-card overflow-hidden hover:ring-2 hover:ring-amber-400 transition flex flex-col"
      aria-label={`Open mantra: ${mantra.title}`}
    >
      {/* Yantra placeholder block — gradient hero with Devanagari on top */}
      <div
        className={`relative aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center p-6`}
      >
        <p
          className="text-white text-3xl md:text-4xl font-bold text-center leading-tight drop-shadow-md"
          style={{ textShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
        >
          {mantra.text.devanagari}
        </p>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
          {mantra.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">{mantra.meaningOneLine}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] capitalize">
            {mantra.category.replace(/-/g, " ")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px]">
            {mantra.video.videoTargetSec}s
          </span>
        </div>
      </div>
    </button>
  );
}
