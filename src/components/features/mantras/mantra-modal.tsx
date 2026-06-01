"use client";

import { useEffect } from "react";
import { Clock, Sparkles, X } from "lucide-react";
import type { Mantra } from "@/data/mantras";

interface MantraModalProps {
  mantra: Mantra;
  onClose: () => void;
}

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

export function MantraModal({ mantra, onClose }: MantraModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const gradient = CATEGORY_ACCENT[mantra.category] ?? "from-amber-400 to-orange-500";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mantra.title}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — Devanagari over gradient (yantra slot) */}
          <div
            className={`relative bg-gradient-to-br ${gradient} px-8 py-10 text-white`}
          >
            <button
              onClick={onClose}
              aria-label="Close mantra"
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            <p className="text-xs uppercase tracking-wider text-white/80 mb-3">
              {mantra.sanskritName} · {mantra.devata}
            </p>
            <p
              className="text-3xl md:text-5xl font-bold leading-snug text-center mb-4"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
            >
              {mantra.text.devanagari}
            </p>
            <p className="text-center text-sm md:text-base italic text-white/90 leading-relaxed max-w-xl mx-auto">
              {mantra.text.iast}
            </p>
            <p className="text-center text-sm text-white/95 mt-3 max-w-xl mx-auto">
              {mantra.text.english}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900">{mantra.title}</h2>

            <section>
              <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                What it means
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">{mantra.meaningOneLine}</p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                Context
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{mantra.context}</p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                When to chant
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">{mantra.whenToChant}</p>
            </section>

            <section className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Yantra
              </p>
              <p className="text-sm font-semibold text-gray-800">{mantra.yantra.name}</p>
              <p className="text-xs text-gray-600 mt-1">{mantra.yantra.visualBrief}</p>
            </section>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs capitalize">
                {mantra.category.replace(/-/g, " ")}
              </span>
              {mantra.pillarSlug && (
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs">
                  Pillar · {mantra.pillarSlug.replace(/-/g, " ")}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                {mantra.video.repetitions}× · {mantra.video.videoTargetSec}s short
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
