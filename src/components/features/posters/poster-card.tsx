"use client";

import Image from "next/image";
import type { Poster } from "@/data/posters";

interface PosterCardProps {
  poster: Poster;
  onOpen: (poster: Poster) => void;
}

export function PosterCard({ poster, onOpen }: PosterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(poster)}
      className="group text-left vedic-card overflow-hidden hover:ring-2 hover:ring-amber-400 transition"
      aria-label={`View poster: ${poster.title}`}
    >
      <div className="relative bg-gray-50">
        <Image
          src={poster.image.thumb}
          alt={poster.image.alt}
          width={400}
          height={Math.round((400 * poster.image.height) / poster.image.width)}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="w-full h-auto"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{poster.title}</h3>
        {poster.tagline && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{poster.tagline}</p>
        )}
        <div className="flex gap-2 mt-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
            {poster.category}
          </span>
          {poster.dosha && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 capitalize">
              {poster.dosha}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
