"use client";

// The Introduction, read one section at a time.
//
// It was the tallest screen in the product: 9,563px on desktop and 12,842px on
// mobile — fifteen phone screens of continuous scroll, with the opening hero
// alone taking 92vh before a word of the essay. Every section rendered at once
// because it was written as one long page.
//
// It is now the same sectioning it always had — the opening, the 48-day
// journey, the profound shift, the five dimensions, who the book is for, the
// eleven gates, the closing — with one section on screen at a time and a rail
// that shows where you are. The prose is untouched, and every section is one
// tap away.
//
// Unlike a chapter, the Introduction has no tracked activities: it is a
// reading. So "progress" here means how far through you have read, held for
// the visit rather than persisted. Chapter-level completion is unchanged and
// still belongs to ChapterActions at the foot of the page.

import { useCallback, useEffect, useRef, useState } from "react";
import { PlayerSpine, PlayerStrip, type SpineItem } from "../player-spine";

export interface IntroSection {
  key: string;
  /** Rail label — short. The panel carries its own full heading. */
  label: string;
  panel: React.ReactNode;
  /** The closing: flagged in the rail rather than numbered. */
  terminal?: boolean;
}

export function IntroductionReader({ sections }: { sections: IntroSection[] }) {
  const keys = sections.map((s) => s.key);
  const [current, setCurrent] = useState(keys[0]);
  // Sections the reader has actually opened this visit. Seeded with the first
  // one because landing on it is reading it.
  const [seen, setSeen] = useState<Set<string>>(() => new Set([keys[0]]));
  const ready = useRef(false);

  // Honour a deep link (`#journey` has been the anchor for the 48-day section
  // since this page was written, and is linked from the opening CTA).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash.replace(/^#/, "");
    if (h && keys.includes(h)) {
      setCurrent(h);
      setSeen((prev) => new Set(prev).add(h));
    }
    ready.current = true;
    // Mount-time read of the URL; `keys` is derived from static chapter data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !ready.current) return;
    if (window.location.hash !== `#${current}`) {
      window.history.replaceState(null, "", `${window.location.pathname}#${current}`);
    }
  }, [current]);

  // In-panel anchors still work. The opening's "Begin the 48-Day Journey" is an
  // <a href="#journey"> and has been since this page was written; rather than
  // rewrite every such link into a callback, the reader listens for the hash it
  // produces. replaceState above never fires this event, so there is no loop.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (!h || !keys.includes(h)) return;
      setCurrent(h);
      setSeen((prev) => new Set(prev).add(h));
      document
        .getElementById("intro-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(",")]);

  const go = useCallback((key: string) => {
    setCurrent(key);
    setSeen((prev) => new Set(prev).add(key));
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document
          .getElementById("intro-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const index = keys.indexOf(current);
  const next = index >= 0 && index < keys.length - 1 ? keys[index + 1] : undefined;
  const items: SpineItem[] = sections.map((s) => ({
    key: s.key,
    label: s.label,
    // A section counts as read once it has been opened and left behind.
    done: seen.has(s.key) && s.key !== current,
    terminal: s.terminal,
  }));
  const completed = items.filter((i) => i.done).length;
  const percent = Math.round(((index + 1) / keys.length) * 100);

  return (
    <div className="mt-8">
      <PlayerStrip
        items={items}
        current={current}
        onGo={go}
        navLabel="Introduction sections"
        completed={completed}
        total={keys.length}
        percent={percent}
      />

      <div className="lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-12">
        <PlayerSpine
          items={items}
          current={current}
          onGo={go}
          navLabel="Introduction sections"
          percent={percent}
        />

        <div id="intro-panel" className="mt-6 min-w-0 scroll-mt-24 lg:mt-0">
          {/* key remounts per section so a section's own state never leaks. */}
          <div key={current}>{sections[index]?.panel}</div>

          {next && (
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#DAA520]/20 pt-6">
              <button
                onClick={() => go(next)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-[15px] font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02]"
              >
                Continue
                <span aria-hidden="true">→</span>
              </button>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                Next: {sections[index + 1].label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
