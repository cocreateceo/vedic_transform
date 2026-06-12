"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { getPillarVideo } from "@/data/pillar-videos";

/**
 * The pillar's teaching video on the detail page. Lazy-loads the YouTube
 * embed on click (channel videos now allow embedding). Falls back to a
 * "Watch on YouTube" link as well.
 */
export function PillarVideo({ slug }: { slug: string }) {
  const [playing, setPlaying] = useState(false);
  const video = getPillarVideo(slug);
  if (!video) return null;

  const watchUrl = `https://youtu.be/${video.videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${video.videoId}?rel=0&autoplay=1`;
  const thumb = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <section className="vedic-card overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-800 px-6 pt-6">
        Teaching Video
      </h2>
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 p-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play: ${video.title}`}
              className="absolute inset-0 w-full h-full group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-amber-600 ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          ) : (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900">{video.title}</h3>
          <p className="text-sm text-gray-500 mt-2">
            A short teaching from the Vedics Transform channel.
          </p>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 self-start inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Watch on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
