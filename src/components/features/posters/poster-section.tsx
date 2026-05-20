"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { Poster } from "@/data/posters";
import { PosterModal } from "./poster-modal";

interface PosterSectionProps {
  poster: Poster;
  /** Heading rendered above the poster card. */
  heading?: string;
}

export function PosterSection({ poster, heading }: PosterSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="vedic-card overflow-hidden">
      {heading && (
        <h2 className="text-lg font-semibold text-gray-800 px-6 pt-6">{heading}</h2>
      )}
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 p-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View full poster: ${poster.title}`}
          className="relative group rounded-xl overflow-hidden bg-gray-50 hover:ring-2 hover:ring-amber-400 transition"
        >
          <Image
            src={poster.image.src}
            alt={poster.image.alt}
            width={poster.image.width}
            height={poster.image.height}
            sizes="(max-width: 768px) 100vw, 40vw"
            className="w-full h-auto"
          />
          <span className="absolute top-2 right-2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
            <Maximize2 size={16} />
          </span>
        </button>

        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900">{poster.title}</h3>
          {poster.tagline && (
            <p className="text-sm text-gray-500 italic mt-1">{poster.tagline}</p>
          )}
          {poster.scripture[0] && (
            <blockquote className="mt-3 border-l-4 border-amber-400 pl-3 text-sm">
              {poster.scripture[0].sanskrit && (
                <p className="text-amber-900 font-medium">
                  {poster.scripture[0].sanskrit}
                </p>
              )}
              <p className="text-gray-700 mt-1">{poster.scripture[0].translation}</p>
              <p className="text-xs text-gray-400 mt-1">{poster.scripture[0].sutra}</p>
            </blockquote>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 self-start text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Open full poster &rarr;
          </button>
        </div>
      </div>

      {open && <PosterModal poster={poster} onClose={() => setOpen(false)} />}
    </section>
  );
}
