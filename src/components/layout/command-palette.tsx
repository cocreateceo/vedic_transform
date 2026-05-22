"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Timer,
  Target,
  TrendingUp,
  BookOpen,
  Headphones,
  ImageIcon,
  Leaf,
  Quote,
  SmilePlus,
  Trophy,
  Sparkles,
  FileText,
  Bell,
  Settings,
  Wind,
  PersonStanding,
  Heart,
  SunMedium,
  Infinity as InfinityIcon,
  Moon,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CommandItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  kbd?: string;
  group: "Navigate" | "Sessions" | "Settings";
};

const COMMANDS: CommandItem[] = [
  { id: "dashboard",   label: "Dashboard",                href: "/dashboard",        icon: LayoutDashboard, kbd: "D", group: "Navigate" },
  { id: "pillars",     label: "All 11 Pillars",           href: "/pillars",          icon: Layers,          kbd: "P", group: "Navigate" },
  { id: "sessions",    label: "Guided Sessions",          href: "/sessions",         icon: Timer,           kbd: "S", group: "Navigate" },
  { id: "goals",       label: "Weekly Goals",             href: "/goals",            icon: Target,                    group: "Navigate" },
  { id: "progress",    label: "Your Progress",            href: "/progress",         icon: TrendingUp,                group: "Navigate" },
  { id: "journal",     label: "Journal · gratitude / intention", href: "/journal",   icon: BookOpen,                  group: "Navigate" },

  { id: "s-morning",     label: "Morning Routine — Brahma Muhurta", href: "/sessions?practice=morning-routine", icon: SunMedium,       group: "Sessions" },
  { id: "s-fasting",     label: "Fasting — eating window",          href: "/sessions?practice=fasting",         icon: Timer,           group: "Sessions" },
  { id: "s-breathing",   label: "Breathing — Pranayama lotus",      href: "/sessions?practice=breathing",       icon: Wind,            group: "Sessions" },
  { id: "s-movement",    label: "Movement — Yoga library",          href: "/sessions?practice=movement",        icon: PersonStanding,  group: "Sessions" },
  { id: "s-meditation",  label: "Meditation timer",                 href: "/sessions?practice=meditation",      icon: Heart,           group: "Sessions" },
  { id: "s-sandhya",     label: "Sandhya — three-times prayer",     href: "/sessions?practice=sandhya",         icon: SunMedium,       group: "Sessions" },
  { id: "s-brahman",     label: "Brahman connection",               href: "/sessions?practice=brahman",         icon: InfinityIcon,    group: "Sessions" },
  { id: "s-manifest",    label: "Divine manifestation",             href: "/sessions?practice=manifestation",   icon: Sparkles,        group: "Sessions" },
  { id: "s-sleep",       label: "Sleep optimization",               href: "/sessions?practice=sleep",           icon: Moon,            group: "Sessions" },

  { id: "library",      label: "Audio Library",   href: "/library",          icon: Headphones,                group: "Settings" },
  { id: "posters",      label: "Teaching Posters",href: "/posters",          icon: ImageIcon,                 group: "Settings" },
  { id: "dosha",        label: "Dosha Quiz",      href: "/dosha-assessment", icon: Leaf,                      group: "Settings" },
  { id: "wisdom",       label: "Daily Wisdom",    href: "/wisdom",           icon: Quote,                     group: "Settings" },
  { id: "mood",         label: "Mood Log",        href: "/mood",             icon: SmilePlus,                 group: "Settings" },
  { id: "achievements", label: "Achievements",    href: "/achievements",     icon: Trophy,                    group: "Settings" },
  { id: "insights",     label: "AI Insights",     href: "/insights",         icon: Sparkles,                  group: "Settings" },
  { id: "reports",      label: "Reports",         href: "/reports",          icon: FileText,                  group: "Settings" },
  { id: "reminders",    label: "Reminders",       href: "/reminders",        icon: Bell,                      group: "Settings" },
  { id: "settings",     label: "Settings",        href: "/settings",         icon: Settings,                  group: "Settings" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Cmd+K / Ctrl+K toggle. Ignored when focused inside text inputs
  // unless the user really pressed the chord (modifier is required).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset query + focus the input on open.
  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!q.trim()) return COMMANDS;
    const needle = q.toLowerCase();
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(needle));
  }, [q]);

  // Group filtered items into sections for display while keeping a flat
  // ordering so arrow-keys cross group boundaries.
  const grouped = useMemo(() => {
    const groups: { name: CommandItem["group"]; items: CommandItem[] }[] = [];
    for (const item of filtered) {
      let g = groups.find((x) => x.name === item.group);
      if (!g) {
        g = { name: item.group, items: [] };
        groups.push(g);
      }
      g.items.push(item);
    }
    return groups;
  }, [filtered]);

  const pick = (item: CommandItem) => {
    setOpen(false);
    router.push(item.href);
  };

  // Keep the selected row in view when navigating with arrows.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-cmd-index="${sel}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [sel, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[var(--color-bg-surface)] border-2 border-[#DAA520] shadow-2xl shadow-orange-500/10 overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSel((s) => Math.min(filtered.length - 1, s + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSel((s) => Math.max(0, s - 1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const target = filtered[sel];
            if (target) pick(target);
          }
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            placeholder="Jump to a page or session..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-gray-400 outline-none"
          />
          <kbd className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Nothing matches &ldquo;{q}&rdquo;
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.name} className="px-2 pb-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {group.name}
                </p>
                {group.items.map((it) => {
                  const flatIndex = filtered.indexOf(it);
                  const active = flatIndex === sel;
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.id}
                      data-cmd-index={flatIndex}
                      onMouseEnter={() => setSel(flatIndex)}
                      onClick={() => pick(it)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                        active
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)]",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          active ? "text-white" : "text-gray-400",
                        )}
                      />
                      <span className="flex-1 truncate">{it.label}</span>
                      {it.kbd && (
                        <kbd
                          className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                            active
                              ? "bg-white/20 text-white border-white/30"
                              : "bg-gray-50 text-gray-500 border-gray-200",
                          )}
                        >
                          {it.kbd}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--color-border)] text-[11px] text-gray-500 bg-[var(--color-card-bg)]/50">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white border border-gray-200">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white border border-gray-200">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <kbd className="px-1 py-0.5 rounded bg-white border border-gray-200">⌘K</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
