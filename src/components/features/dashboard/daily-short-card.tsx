"use client";

import { useState } from "react";
import { Play, Sparkles } from "lucide-react";
import {
  getShortForDay,
  shortEmbedUrl,
  shortThumb,
  shortUrl,
} from "@/data/journey-shorts";

/**
 * "Wisdom of the Day" — surfaces the 48-day journey scripture Short that
 * matches the user's current journey day. Pre-journey (day 0) it previews
 * Day 1 so new users still see the daily series. Lazy-loads the YouTube
 * embed on click, mirroring the landing-page YouTubeIntro pattern.
 */
export function DailyShortCard({ journeyDay }: { journeyDay: number }) {
  const [playing, setPlaying] = useState(false);
  const day = journeyDay >= 1 ? journeyDay : 1;
  const short = getShortForDay(day);
  if (!short) return null;

  return (
    <div className="vedic-card overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-6">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Wisdom of the Day
        </h2>
        <span className="ml-auto text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5">
          Day {short.day} of 48
        </span>
      </div>

      <div className="grid sm:grid-cols-[1.3fr_1fr] gap-5 p-6">
        {/* Player / thumbnail */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-900">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
              aria-label={`Play Day ${short.day} wisdom short`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shortThumb(short)}
                alt={`Day ${short.day} — ${short.verse}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`;
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
              src={`${shortEmbedUrl(short)}&autoplay=1`}
              title={`Day ${short.day} wisdom short`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>

        {/* Verse + link */}
        <div className="flex flex-col justify-center">
          <blockquote className="border-l-4 border-amber-400 pl-4 italic text-gray-700 leading-relaxed">
            &ldquo;{short.verse}&rdquo;
          </blockquote>
          <a
            href={shortUrl(short)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 self-start text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Watch on YouTube &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
