"use client";

// The chapter's teaching sections as progressive-disclosure accordions.
// Every paragraph and its related artwork stays intact — just revealed
// per-section instead of stacked into an endless scroll. All sections
// start collapsed so the chapter reads as a guided lesson, not a document.

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";

export interface AccordionSection {
  heading: string;
  paragraphs: string[];
  art: { src: string; title: string }[];
}

export function ChapterAccordion({
  sections,
}: {
  sections: AccordionSection[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {sections.map((section, i) => {
        const isOpen = open === i;
        return (
          <div
            key={section.heading}
            className={cn(
              "overflow-hidden rounded-2xl border bg-[var(--color-bg-surface)] transition-colors",
              isOpen
                ? "border-[#DAA520]/60 shadow-[0_4px_24px_rgba(218,165,32,0.1)]"
                : "border-[#DAA520]/25 hover:border-[#DAA520]/60",
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-7"
              aria-expanded={isOpen}
            >
              <span
                className={`${SERIF_CLASS} w-8 shrink-0 text-xl font-semibold ${isOpen ? "text-[#B8860B]" : "text-[#DAA520]/60"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`${SERIF_CLASS} min-w-0 flex-1 text-lg font-semibold text-[var(--color-text-primary)] sm:text-xl`}
              >
                {section.heading}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
