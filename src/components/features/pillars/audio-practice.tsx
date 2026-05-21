"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

// Inline audio practice — used for mantra recitation and CEO voice
// explanations. When `mandatory` is true the parent step's "Yes"
// stays locked until the audio plays through to its end event;
// otherwise `onComplete` fires immediately so the audio is just
// optional listening.

export function AudioPractice({
  src,
  title,
  guidance,
  attribution,
  mandatory,
  onComplete,
}: {
  src: string;
  title?: string;
  guidance?: string;
  attribution?: { name: string; url?: string; source?: string };
  mandatory?: boolean;
  onComplete: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!mandatory) onComplete();
  }, [mandatory, onComplete]);

  return (
    <div className="my-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4">
      {title && (
        <p className="text-sm font-semibold text-amber-900 mb-1">{title}</p>
      )}
      {guidance && (
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          {guidance}
        </p>
      )}
      <audio
        ref={audioRef}
        src={src}
        controls
        className="w-full"
        onEnded={() => {
          setPlayed(true);
          onComplete();
        }}
      />
      {mandatory && (
        <p className="text-xs mt-2 font-medium">
          {played ? (
            <span className="text-green-700 inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Listened through — Yes unlocked
            </span>
          ) : (
            <span className="text-amber-700">
              Play through to the end to unlock <strong>Yes</strong>.
            </span>
          )}
        </p>
      )}
      {attribution && (
        <p className="text-[10px] text-gray-400 mt-2 text-right">
          {attribution.url ? (
            <>
              {attribution.source ? `${attribution.source} by ` : "By "}
              <a
                href={attribution.url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {attribution.name}
              </a>
            </>
          ) : (
            <>
              {attribution.source ? `${attribution.source} by ` : "By "}
              {attribution.name}
            </>
          )}
        </p>
      )}
    </div>
  );
}
