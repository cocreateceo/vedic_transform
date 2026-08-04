"use client";

// The Sessions chooser.
//
// /sessions used to open straight onto tab 0 (Morning Routine) with a
// sixteen-button strip above it. The strip cost 142–148px and wrapped to three
// rows on a phone, and it stayed on screen in every state — including while a
// timer was running. It also meant "Sessions" never actually showed you the
// sessions; it showed you one of them, chosen for you.
//
// This is the index instead: every practice, its duration, and whether it is
// done today. Picking one navigates to ?practice=<key>, and the session itself
// carries a back link. One tap to switch, and no permanent chrome.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { PILLAR_TO_SESSION } from "@/lib/practice-routes";
import { SESSION_TABS } from "./session-tabs";

export function SessionsIndex() {
  // Which pillars are already checked in today, so the index can show what is
  // left rather than making the learner remember. Best-effort: a failed read
  // just means nothing is ticked.
  const [donePillars, setDonePillars] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    apiFetch("/data/checkin")
      .then((res) => {
        if (alive) setDonePillars(new Set<string>(res?.completedPillars ?? []));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // A session is "done today" when the pillar it checks in for is done.
  const sessionDone = (key?: string) => {
    if (!key) return false;
    const pillar = Object.keys(PILLAR_TO_SESSION).find(
      (p) => PILLAR_TO_SESSION[p] === key,
    );
    return pillar ? donePillars.has(pillar) : false;
  };

  const core = SESSION_TABS.filter((t) => t.key);
  const more = SESSION_TABS.filter((t) => !t.key);
  const doneCount = core.filter((t) => sessionDone(t.key)).length;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-[#DAA520]/20 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
          {SESSION_TABS.length} practices
          {doneCount > 0 ? ` · ${doneCount} done today` : ""}
        </p>
        <h1 className="mt-2.5 text-3xl font-bold text-[var(--color-text-primary)]">
          Sessions
        </h1>
        <p className="mt-1.5 max-w-2xl text-[var(--color-text-secondary)]">
          Practice, guided. Pick one and begin.
        </p>
      </header>

      <Group title="Daily practices" items={core} sessionDone={sessionDone} />
      <details className="group mt-8 border-t border-[#DAA520]/20 pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[13.5px] font-medium text-[var(--color-text-primary)]">
          <span>
            More practices
            <span className="text-[var(--color-text-muted)]"> · {more.length}</span>
          </span>
          <span className="text-[var(--color-text-muted)] transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <Group items={more} sessionDone={sessionDone} />
      </details>
    </div>
  );
}

function Group({
  title,
  items,
  sessionDone,
}: {
  title?: string;
  items: typeof SESSION_TABS;
  sessionDone: (key?: string) => boolean;
}) {
  return (
    <section className="mt-6">
      {title && (
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
          {title}
        </h2>
      )}
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {items.map((tab) => {
          const Icon = tab.icon;
          const done = sessionDone(tab.key);
          return (
            <Link
              key={tab.name}
              href={`/sessions?practice=${tab.key ?? tab.slug}`}
              className={cn(
                "group flex items-center gap-3 rounded-xl border p-4 transition-colors",
                done
                  ? "border-green-200 bg-green-50/50"
                  : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-[#DAA520]",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-green-500 text-white" : "bg-amber-50 text-[#B8860B]",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-[var(--color-text-primary)] group-hover:text-[#B8860B]">
                  {tab.name}
                </span>
                <span className="block text-[12px] text-[var(--color-text-muted)]">
                  {done ? "Done today" : tab.duration}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
