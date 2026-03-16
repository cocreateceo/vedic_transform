"use client";

import { useState, useEffect } from "react";
import { DAILY_WISDOM, WisdomEntry } from "@/data/daily-wisdom";
import { X, Share2 } from "lucide-react";

function getTodaysWisdom(): WisdomEntry {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_WISDOM.length;
  return DAILY_WISDOM[index];
}

function getTodayKey(): string {
  const today = new Date();
  return `vedic-wisdom-shown-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

export function DailyWisdomPopup() {
  const [visible, setVisible] = useState(false);
  const [wisdom, setWisdom] = useState<WisdomEntry | null>(null);

  useEffect(() => {
    const key = getTodayKey();
    if (localStorage.getItem(key)) return;

    setWisdom(getTodaysWisdom());
    // Small delay so the dashboard renders first, then the popup fades in
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(getTodayKey(), "true");
  };

  const handleShare = async () => {
    if (!wisdom) return;
    const text = `"${wisdom.text}"\n— ${wisdom.source}${wisdom.sanskrit ? `\n\n${wisdom.sanskrit}` : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Daily Wisdom", text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Wisdom copied to clipboard!");
    }
  };

  if (!visible || !wisdom) return null;

  const categoryLabel =
    wisdom.category === "vedic"
      ? "Vedic Wisdom"
      : wisdom.category === "philosophical"
        ? "Philosophical Wisdom"
        : "Modern Wisdom";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-500"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#FFFEF5] border-2 border-[#DAA520] rounded-2xl shadow-2xl shadow-amber-900/20 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Om watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] leading-none font-serif text-amber-100/40 pointer-events-none select-none">
          ॐ
        </div>

        {/* Top decorative bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-[#DAA520] to-orange-500" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">🪷</span>
            <div>
              <h2 className="text-lg font-bold text-amber-900">
                Daily Wisdom
              </h2>
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                {categoryLabel}
              </span>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
            <span className="text-amber-400 text-sm">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
          </div>

          {/* Quote */}
          <blockquote className="text-gray-800 text-lg sm:text-xl leading-relaxed font-serif italic mb-4">
            &ldquo;{wisdom.text}&rdquo;
          </blockquote>

          {/* Sanskrit */}
          {wisdom.sanskrit && (
            <p className="text-amber-700/80 text-sm font-medium italic mb-4 pl-4 border-l-2 border-[#DAA520]/40">
              {wisdom.sanskrit}
            </p>
          )}

          {/* Source */}
          <p className="text-amber-900 font-semibold text-sm">
            — {wisdom.source}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mt-6 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
            <span className="text-amber-400 text-sm">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DAA520]/50 text-amber-800 hover:bg-amber-50 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all text-sm font-medium shadow-md shadow-amber-500/25"
            >
              Begin Your Day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
