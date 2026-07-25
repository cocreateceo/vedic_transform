"use client";

// The chapter's teaching sections as progressive-disclosure accordions.
// Every paragraph and its related artwork stays intact — just revealed
// per-section. The first movement opens by default, collapsed rows show a
// one-line preview so no content ever feels missing, an Expand-all toggle
// restores the full article flow, and each open panel ends with a
// "Continue" step to the next movement — a guided reading path.

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";

export interface AccordionSection {
  heading: string;
  paragraphs: string[];
  art: { src: string; title: string }[];
}

function previewOf(section: AccordionSection): string {
  const first = section.paragraphs[0] ?? "";
  const stop = first.indexOf(". ");
  return stop > 0 && stop < 140
    ? first.slice(0, stop + 1)
    : first.slice(0, 120) + (first.length > 120 ? "…" : "");
}

export function ChapterAccordion({
  sections,
}: {
  sections: AccordionSection[];
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [expandAll, setExpandAll] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const isOpen = (i: number) => expandAll || open.has(i);
  const allOpen = expandAll || open.size === sections.length;

  const toggle = (i: number) => {
    if (expandAll) {
      // Leaving expand-all: keep everything open except the one being closed.
      setExpandAll(false);
      setOpen(new Set(sections.map((_, j) => j).filter((j) => j !== i)));
      return;
    }
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const continueTo = (i: number) => {
    setOpen((prev) => new Set(prev).add(i));
    // Let the panel mount before scrolling to it.
    setTimeout(() => {
      refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            if (allOpen) {
              setExpandAll(false);
              setOpen(new Set([0]));
            } else {
              setExpandAll(true);
            }
          }}
          className="text-sm font-semibold text-[#B8860B] underline underline-offset-4 transition-colors hover:text-[#DAA520]"
        >
          {allOpen ? "Collapse all" : "Expand all — read as one article"}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => {
          const opened = isOpen(i);
          return (
            <div
              key={section.heading}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn(
                "scroll-mt-24 overflow-hidden rounded-2xl border bg-[var(--color-bg-surface)] transition-colors",
                opened
                  ? "border-[#DAA520]/60 shadow-[0_4px_24px_rgba(218,165,32,0.1)]"
                  : "border-[#DAA520]/25 hover:border-[#DAA520]/60",
              )}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-7"
                aria-expanded={opened}
              >
                <span
                  className={`${SERIF_CLASS} w-8 shrink-0 text-xl font-semibold ${opened ? "text-[#B8860B]" : "text-[#DAA520]/60"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`${SERIF_CLASS} block text-lg font-semibold text-[var(--color-text-primary)] sm:text-xl`}
                  >
                    {section.heading}
                  </span>
                  {!opened && (
                    <span className="mt-1 block truncate text-[13px] text-[var(--color-text-muted)]">
                      {previewOf(section)}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform",
                    opened && "rotate-180",
                  )}
                />
              </button>

              {opened && (
                <div className="border-t border-[var(--color-border)] px-5 pb-7 pt-5 sm:px-7">
                  <div className="mx-auto max-w-[42rem] space-y-4 text-[16px] leading-[1.75] text-[var(--color-text-primary)]">
                    {section.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  {section.art.length > 0 && (
                    <div
                      className={cn(
                        "mx-auto mt-6 grid max-w-3xl gap-3",
                        section.art.length === 1
                          ? "max-w-xl grid-cols-1"
                          : section.art.length === 3
                            ? "grid-cols-1 sm:grid-cols-3"
                            : "grid-cols-2",
                      )}
                    >
                      {section.art.map((a) => (
                        <a
                          key={a.src}
                          href={a.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block overflow-hidden rounded-xl border border-[#DAA520]/30 bg-[#0C0F22]"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={a.src}
                              alt={a.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <p className="px-3 py-2 text-center text-xs font-medium text-amber-100/90">
                            {a.title}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                  {!expandAll && i < sections.length - 1 && (
                    <div className="mx-auto mt-7 max-w-[42rem]">
                      <button
                        onClick={() => continueTo(i + 1)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#DAA520]/50 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-2.5 text-sm font-semibold text-[#B8860B] transition-colors hover:border-[#DAA520]"
                      >
                        Continue — {sections[i + 1].heading}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
