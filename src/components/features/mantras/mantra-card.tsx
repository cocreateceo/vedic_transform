"use client";

import Image from "next/image";
import type { Mantra } from "@/data/mantras";
import { SERIF_CLASS } from "@/lib/fonts";

interface MantraCardProps {
  mantra: Mantra;
  onOpen: (mantra: Mantra) => void;
}

export function MantraCard({ mantra, onOpen }: MantraCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(mantra)}
      className="group text-left vedic-card overflow-hidden hover:ring-2 hover:ring-amber-400 transition flex flex-col"
      aria-label={`Open mantra: ${mantra.title}`}
    >
      {/* Category artwork with the mantra in Devanagari and roman letters */}
      <div className="relative aspect-square flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-[#2A1B0E] to-[#0C0F22]">
        <Image
          src={`/library-media/mantra-cat-${mantra.category}.webp`}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/25" />
        <p
          className="relative text-white text-2xl md:text-3xl font-bold text-center leading-tight"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.55)" }}
        >
          {mantra.text.devanagari}
        </p>
        <p
          className={`${SERIF_CLASS} relative text-amber-100/95 text-sm md:text-base italic text-center leading-snug line-clamp-3`}
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
        >
          {mantra.text.iast}
        </p>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-[var(--color-text-primary)] text-sm line-clamp-2">
          {mantra.title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
          {mantra.meaningOneLine}
        </p>
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
