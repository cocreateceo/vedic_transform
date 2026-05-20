"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Poster } from "@/data/posters";

interface PosterModalProps {
  poster: Poster;
  onClose: () => void;
}

export function PosterModal({ poster, onClose }: PosterModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={poster.title}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-5xl w-full grid md:grid-cols-2 gap-0 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gray-50">
            <Image
              src={poster.image.src2x}
              alt={poster.image.alt}
              width={poster.image.width * 2}
              height={poster.image.height * 2}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <button
              onClick={onClose}
              aria-label="Close poster"
              className="float-right text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{poster.title}</h2>
            {poster.tagline && (
              <p className="text-sm text-gray-500 italic mb-4">{poster.tagline}</p>
            )}

            {poster.scripture.length > 0 && (
              <div className="mb-6 space-y-3">
                {poster.scripture.map((s, i) => (
                  <blockquote
                    key={i}
                    className="border-l-4 border-amber-400 pl-4 py-1 bg-amber-50/40 rounded-r"
                  >
                    {s.sanskrit && (
                      <p className="text-sm text-amber-900 font-medium">{s.sanskrit}</p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">{s.translation}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.sutra}</p>
                  </blockquote>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {poster.sections.map((sec, i) => (
                <section key={i}>
                  <h3 className="font-semibold text-gray-800">
                    {sec.number !== undefined && (
                      <span className="text-amber-500 mr-2">{sec.number}.</span>
                    )}
                    {sec.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{sec.body}</p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-0.5">
                      {sec.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
