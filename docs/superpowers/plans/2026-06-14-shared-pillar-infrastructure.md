# Shared Pillar Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three reusable building blocks every pillar dossier asked for — a sunrise/sunset solar scheduler, a shared guided-audio player, and a generalized animated breath pacer — as pure-logic modules behind thin React components.

**Architecture:** All non-trivial logic lives in pure, framework-free `.ts` modules under `src/lib/` (so it is unit-testable without a DOM). React components are thin wrappers that call those modules and reuse the codebase's existing patterns (`setInterval` tick loops, `useRef`-cached `HTMLAudioElement` cues, `BreathingLotus` SVG, `cn()`, `Card`/`Button` UI kit). The breath pacer and audio player **generalize code that already exists** (`src/components/features/pillars/breathing-visualizer.tsx`); the solar engine is new and wraps the well-tested `suncalc` library.

**Tech Stack:** Next.js 15 (App Router, RSC), React 18, TypeScript, Tailwind v4 (inline theme + CSS vars), `lucide-react`, `clsx`+`tailwind-merge` via `cn()`. New deps: `suncalc` (solar math), `vitest` (tests, none exist today).

**Scope note:** These are three **independent** subsystems (Parts A/B/C). They share only Task 1 (test setup) and can be executed in any order or by parallel workers after Task 1. Each part ends in working, shippable software. **Out of scope (explicitly):** server-side push-notification scheduling for solar events (the `PushSubscriptions` table + VAPID exist, but wiring an AWS cron is a separate plan). This plan delivers *client-side* computation, display, and in-app reminders only.

---

## File Structure

**New — Test setup**
- `vitest.config.ts` — Vitest config (node environment, no jsdom needed; all tests target pure modules).
- `package.json` — add `test` script + dev deps.

**New — Part A: Solar scheduler**
- `src/lib/solar/sun-times.ts` — thin `suncalc` wrapper: `getSunTimes(date, lat, lng)`.
- `src/lib/solar/windows.ts` — **pure** derivations of practice windows from a sunrise/sunset (brahma muhurta, sandhya junctions, eating window, wind-down). Unit-tested.
- `src/lib/solar/windows.test.ts` — tests for `windows.ts`.
- `src/lib/solar/use-solar-times.ts` — React hook: geolocation + localStorage cache + `getSunTimes`.
- `src/components/features/solar/sun-windows-card.tsx` — display card for today's windows.

**New — Part B: Guided audio player**
- `src/lib/audio/cue-engine.ts` — **pure** "which cues fire now" logic. Unit-tested.
- `src/lib/audio/cue-engine.test.ts` — tests for `cue-engine.ts`.
- `src/components/features/sessions/guided-audio-player.tsx` — reusable player (transport + cue firing + mute), built on the existing `HTMLAudioElement`/`useRef` pattern.

**New — Part C: Generalized breath pacer**
- `src/lib/breath/patterns.ts` — `BreathPattern` type + named presets (coherent 4-6, box, 4-7-8, bhramari). Pure data.
- `src/lib/breath/phase.ts` — **pure** `phaseAt(pattern, elapsedSec)` 4-phase state machine. Unit-tested.
- `src/lib/breath/phase.test.ts` — tests for `phase.ts`.

**Modified — Part C**
- `src/components/features/pillars/breathing-visualizer.tsx` — refactor to consume `phaseAt` + accept a `BreathPattern`, add a preset picker. Keeps existing audio cues + `BreathingLotus`.

---

## Task 1: Test infrastructure (Vitest)

The project has **no tests today**. Add Vitest so the pure-logic modules in Parts A/B/C are test-driven. Pure modules need no DOM, so we use the default `node` environment — keeping deps minimal.

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)
- Create: `src/lib/__smoke__/sanity.test.ts` (temporary, deleted at end of task)

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest@^2
```
Expected: `vitest` added to `devDependencies`, install completes without peer-dep errors. (If npm reports peer conflicts, re-run with `--legacy-peer-deps` — this repo uses it for EAS/mobile but it is safe here.)

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
  },
});
```

- [ ] **Step 3: Add the test script**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a smoke test to prove the harness runs**

Create `src/lib/__smoke__/sanity.test.ts`:
```ts
import { expect, test } from "vitest";

test("vitest harness runs with @ alias resolution", () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 5: Run it**

Run: `npm test`
Expected: PASS — 1 passed (1) for `sanity.test.ts`.

- [ ] **Step 6: Delete the smoke test and commit**

```bash
rm src/lib/__smoke__/sanity.test.ts
git add vitest.config.ts package.json package-lock.json
git commit -m "test: add Vitest harness for pure-logic modules"
```

---

# PART A — Sunrise/Sunset Solar Scheduler

Computes the user's local sun times and derives the practice windows the dossiers reference: Brahma Muhurta (Morning), the three Sandhya junctions (Sandhya), the circadian eating window (Nutrition), and an evening wind-down (Sleep). One engine feeds four pillars.

## Task 2: Add `suncalc` and the sun-times wrapper

**Files:**
- Modify: `package.json` (deps)
- Create: `src/lib/solar/sun-times.ts`

- [ ] **Step 1: Install suncalc + types**

Run:
```bash
npm install suncalc@^1.9.0
npm install -D @types/suncalc@^1.9.2
```
Expected: both added; `suncalc` in `dependencies`, `@types/suncalc` in `devDependencies`.

- [ ] **Step 2: Write the wrapper**

Create `src/lib/solar/sun-times.ts`:
```ts
import SunCalc from "suncalc";

export interface SunTimes {
  /** Local Date of sunrise. */
  sunrise: Date;
  /** Local Date of sunset. */
  sunset: Date;
  /** Local Date of solar noon (sun highest). */
  solarNoon: Date;
}

/**
 * Raw astronomical sun times for a date + coordinates. Thin wrapper over
 * suncalc so the rest of the app never imports suncalc directly and so the
 * return shape is stable if we swap the math later.
 */
export function getSunTimes(date: Date, lat: number, lng: number): SunTimes {
  const t = SunCalc.getTimes(date, lat, lng);
  return { sunrise: t.sunrise, sunset: t.sunset, solarNoon: t.solarNoon };
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "solar/sun-times" || echo "clean"`
Expected: `clean`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/solar/sun-times.ts
git commit -m "feat(solar): add suncalc wrapper for raw sun times"
```

## Task 3: Pure practice-window derivations (TDD)

These functions take a `SunTimes` (or just a sunrise/sunset `Date`) and return labeled windows. They are pure and deterministic — the heart of the feature — so they are fully unit-tested.

**Files:**
- Create: `src/lib/solar/windows.ts`
- Test: `src/lib/solar/windows.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/solar/windows.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import {
  brahmaMuhurta,
  sandhyaJunctions,
  eatingWindow,
  windDown,
} from "./windows";

// Fixed reference day: sunrise 06:00, solar noon 12:00, sunset 18:00 local.
const sunrise = new Date("2026-06-14T06:00:00");
const solarNoon = new Date("2026-06-14T12:00:00");
const sunset = new Date("2026-06-14T18:00:00");
const sun = { sunrise, sunset, solarNoon };

const mins = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 60000);

describe("brahmaMuhurta", () => {
  test("opens 96 min before sunrise and lasts 48 min", () => {
    const w = brahmaMuhurta(sunrise);
    expect(mins(w.start, sunrise)).toBe(96); // start is 96 min before sunrise
    expect(mins(w.start, w.end)).toBe(48); // 48-minute window
    expect(w.end.getTime()).toBeLessThan(sunrise.getTime());
  });
});

describe("sandhyaJunctions", () => {
  test("returns sunrise, noon, and sunset junctions in order", () => {
    const j = sandhyaJunctions(sun);
    expect(j.map((x) => x.id)).toEqual(["sunrise", "noon", "sunset"]);
    expect(j[0].at).toEqual(sunrise);
    expect(j[1].at).toEqual(solarNoon);
    expect(j[2].at).toEqual(sunset);
  });
});

describe("eatingWindow", () => {
  test("opens ~1h after sunrise and lasts 10 hours by default", () => {
    const w = eatingWindow(sunrise);
    expect(mins(sunrise, w.start)).toBe(60);
    expect(mins(w.start, w.end)).toBe(600); // 10h = 600 min
  });

  test("respects a custom window length", () => {
    const w = eatingWindow(sunrise, 8);
    expect(mins(w.start, w.end)).toBe(480); // 8h
  });
});

describe("windDown", () => {
  test("suggests screens-off 2h after sunset and bed 3h after", () => {
    const w = windDown(sunset);
    expect(mins(sunset, w.screensOff)).toBe(120);
    expect(mins(sunset, w.bedtime)).toBe(180);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/solar/windows.test.ts`
Expected: FAIL — "Failed to resolve import './windows'" / functions not defined.

- [ ] **Step 3: Implement the windows module**

Create `src/lib/solar/windows.ts`:
```ts
import type { SunTimes } from "./sun-times";

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface Junction {
  id: "sunrise" | "noon" | "sunset";
  label: string;
  at: Date;
}

export interface WindDown {
  screensOff: Date;
  bedtime: Date;
}

const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

/**
 * Brahma Muhurta: the 48-minute window that OPENS ~96 minutes before sunrise
 * (the 14th of 15 night muhurtas). Matches the corrected Morning pillar copy.
 */
export function brahmaMuhurta(sunrise: Date): TimeWindow {
  const start = addMinutes(sunrise, -96);
  return { start, end: addMinutes(start, 48) };
}

/** The three sandhis (junctions) of the day, in chronological order. */
export function sandhyaJunctions(sun: SunTimes): Junction[] {
  return [
    { id: "sunrise", label: "Sunrise sandhya", at: sun.sunrise },
    { id: "noon", label: "Noon sandhya", at: sun.solarNoon },
    { id: "sunset", label: "Sunset sandhya", at: sun.sunset },
  ];
}

/**
 * Circadian eating window: open ~1h after sunrise, length `hours` (default 10
 * for 14:10; pass 8 for a tighter 16:8). Matches the Nutrition pillar.
 */
export function eatingWindow(sunrise: Date, hours = 10): TimeWindow {
  const start = addMinutes(sunrise, 60);
  return { start, end: addMinutes(start, hours * 60) };
}

/** Evening wind-down anchors relative to sunset (Sleep pillar). */
export function windDown(sunset: Date): WindDown {
  return {
    screensOff: addMinutes(sunset, 120),
    bedtime: addMinutes(sunset, 180),
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/solar/windows.test.ts`
Expected: PASS — all tests in 4 describe blocks pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/solar/windows.ts src/lib/solar/windows.test.ts
git commit -m "feat(solar): pure practice-window derivations with tests"
```

## Task 4: `useSolarTimes` hook (geolocation + cache)

Bridges the browser to the pure modules: gets coordinates via `navigator.geolocation`, caches them in `localStorage`, and returns today's `SunTimes`. Thin glue; verified by running the app (Task 6).

**Files:**
- Create: `src/lib/solar/use-solar-times.ts`

- [ ] **Step 1: Implement the hook**

Create `src/lib/solar/use-solar-times.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { getSunTimes, type SunTimes } from "./sun-times";

const COORDS_KEY = "vedic-coords-v1";

interface Coords {
  lat: number;
  lng: number;
}

export type SolarStatus = "idle" | "locating" | "ready" | "denied" | "unsupported";

export interface UseSolarTimes {
  status: SolarStatus;
  sunTimes: SunTimes | null;
  /** Re-request geolocation (e.g. from a "use my location" button). */
  request: () => void;
}

function readCachedCoords(): Coords | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COORDS_KEY);
    return raw ? (JSON.parse(raw) as Coords) : null;
  } catch {
    return null;
  }
}

/**
 * Resolves the user's local sun times for *today*. Uses cached coordinates
 * immediately when present, and (re)requests geolocation on demand. Never
 * throws — surfaces failure via `status` so the UI can offer a manual path.
 */
export function useSolarTimes(): UseSolarTimes {
  const [status, setStatus] = useState<SolarStatus>("idle");
  const [coords, setCoords] = useState<Coords | null>(() => readCachedCoords());

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(next);
        try {
          window.localStorage.setItem(COORDS_KEY, JSON.stringify(next));
        } catch {}
        setStatus("ready");
      },
      () => setStatus("denied"),
      { maximumAge: 1000 * 60 * 60, timeout: 10000 },
    );
  };

  // If we have cached coords, we're immediately "ready"; otherwise stay idle
  // until the user triggers `request()` (geolocation must be user-initiated
  // to avoid a silent permission prompt on mount).
  useEffect(() => {
    if (coords && status === "idle") setStatus("ready");
  }, [coords, status]);

  const sunTimes = coords ? getSunTimes(new Date(), coords.lat, coords.lng) : null;

  return { status, sunTimes, request };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "use-solar-times" || echo "clean"`
Expected: `clean`

- [ ] **Step 3: Commit**

```bash
git add src/lib/solar/use-solar-times.ts
git commit -m "feat(solar): useSolarTimes hook with geolocation + cache"
```

## Task 5: `SunWindowsCard` display component

Renders today's windows. Reuses the `Card` UI kit, `cn()`, `lucide-react` icons, and the app's CSS variables. Accepts which windows to show so each pillar surfaces only the relevant one.

**Files:**
- Create: `src/components/features/solar/sun-windows-card.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/features/solar/sun-windows-card.tsx`:
```tsx
"use client";

import { Sunrise, Sun, Sunset, Moon, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSolarTimes } from "@/lib/solar/use-solar-times";
import {
  brahmaMuhurta,
  sandhyaJunctions,
  eatingWindow,
  windDown,
} from "@/lib/solar/windows";

type WindowKind = "brahma" | "sandhya" | "eating" | "winddown";

const fmt = (d: Date) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function SunWindowsCard({ show }: { show: WindowKind[] }) {
  const { status, sunTimes, request } = useSolarTimes();

  if (status !== "ready" || !sunTimes) {
    return (
      <Card>
        <CardContent className="py-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            {status === "denied"
              ? "Location blocked — enable it to see your local sun windows."
              : status === "unsupported"
                ? "Location isn't available on this device."
                : "See today's practice windows for your location."}
          </p>
          <Button size="sm" onClick={request} disabled={status === "locating"}>
            <MapPin className="w-4 h-4 mr-2" />
            {status === "locating" ? "Locating…" : "Use my location"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const rows: { icon: typeof Sun; label: string; value: string }[] = [];
  if (show.includes("brahma")) {
    const w = brahmaMuhurta(sunTimes.sunrise);
    rows.push({ icon: Sunrise, label: "Brahma Muhurta", value: `${fmt(w.start)} – ${fmt(w.end)}` });
  }
  if (show.includes("sandhya")) {
    for (const j of sandhyaJunctions(sunTimes)) {
      const Icon = j.id === "sunrise" ? Sunrise : j.id === "noon" ? Sun : Sunset;
      rows.push({ icon: Icon, label: j.label, value: fmt(j.at) });
    }
  }
  if (show.includes("eating")) {
    const w = eatingWindow(sunTimes.sunrise);
    rows.push({ icon: Sun, label: "Eating window", value: `${fmt(w.start)} – ${fmt(w.end)}` });
  }
  if (show.includes("winddown")) {
    const w = windDown(sunTimes.sunset);
    rows.push({ icon: Moon, label: "Screens off", value: fmt(w.screensOff) });
    rows.push({ icon: Moon, label: "In bed by", value: fmt(w.bedtime) });
  }

  return (
    <Card>
      <CardContent className="py-5 space-y-3">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Icon className="w-4 h-4 text-amber-500" />
                {r.label}
              </span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {r.value}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "sun-windows-card" || echo "clean"`
Expected: `clean`

- [ ] **Step 3: Commit**

```bash
git add src/components/features/solar/sun-windows-card.tsx
git commit -m "feat(solar): SunWindowsCard display component"
```

## Task 6: Wire `SunWindowsCard` into the four relevant pillars

Surface the right window on each pillar's detail page. Add one card per pillar in `src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx`.

**Files:**
- Modify: `src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx`

- [ ] **Step 1: Import the card**

Near the other imports at the top of `pillar-detail-client.tsx`, add:
```tsx
import { SunWindowsCard } from "@/components/features/solar/sun-windows-card";
```

- [ ] **Step 2: Render per-pillar**

Find where pillar-specific content is rendered by `pillarId` (the switch/conditional block around the practice area, ~lines 425–459 per exploration). Add, before the pillar's existing practice content:
```tsx
{pillarId === "morning-initiation" && <SunWindowsCard show={["brahma"]} />}
{pillarId === "sandhya-meditation" && <SunWindowsCard show={["sandhya"]} />}
{pillarId === "nutrition-fasting" && <SunWindowsCard show={["eating"]} />}
{pillarId === "sleep-optimization" && <SunWindowsCard show={["winddown"]} />}
```
(If the block uses a ternary chain rather than `&&` guards, insert these as sibling elements wrapped in a fragment so they render above the existing content for those four slugs.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "pillar-detail-client" || echo "clean"`
Expected: `clean`

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open `/pillars/morning-initiation`. Expected: a card with "Use my location"; after granting, it shows a Brahma Muhurta time range. Repeat `/pillars/sandhya-meditation` (3 junctions), `/pillars/nutrition-fasting` (eating window), `/pillars/sleep-optimization` (screens-off + bed). Denying location shows the "Location blocked" message, not a crash.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx"
git commit -m "feat(solar): surface sun windows on morning/sandhya/nutrition/sleep pillars"
```

---

# PART B — Guided Audio Player

A reusable transport that plays a primary track and fires timed voice/bell cues, extracting the `useRef`-cached `HTMLAudioElement` + "fire once on threshold" pattern already used in the session timers into one component. Cue selection is pure and tested.

## Task 7: Pure cue-engine (TDD)

**Files:**
- Create: `src/lib/audio/cue-engine.ts`
- Test: `src/lib/audio/cue-engine.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/audio/cue-engine.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { cuesToFire, type Cue } from "./cue-engine";

const cues: Cue[] = [
  { id: "start", atSeconds: 0, src: "/audio/a/start.mp3" },
  { id: "mid", atSeconds: 150, src: "/audio/a/mid.mp3" },
  { id: "end", atSeconds: 300, src: "/audio/a/end.mp3" },
];

describe("cuesToFire", () => {
  test("fires a cue once its time has been reached", () => {
    const fired = new Set<string>();
    expect(cuesToFire(cues, 0, fired).map((c) => c.id)).toEqual(["start"]);
  });

  test("does not refire cues already in the fired set", () => {
    const fired = new Set<string>(["start"]);
    expect(cuesToFire(cues, 1, fired)).toEqual([]);
  });

  test("fires every newly-passed cue when time jumps", () => {
    const fired = new Set<string>(["start"]);
    expect(cuesToFire(cues, 151, fired).map((c) => c.id)).toEqual(["mid"]);
  });

  test("never fires a cue whose time is still in the future", () => {
    const fired = new Set<string>();
    expect(cuesToFire(cues, 149, fired).map((c) => c.id)).toEqual(["start"]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/audio/cue-engine.test.ts`
Expected: FAIL — cannot resolve `./cue-engine`.

- [ ] **Step 3: Implement the engine**

Create `src/lib/audio/cue-engine.ts`:
```ts
export interface Cue {
  /** Stable id, used to ensure a cue fires at most once per session. */
  id: string;
  /** When to fire, in seconds of elapsed session time. */
  atSeconds: number;
  /** Audio file to play. */
  src: string;
}

/**
 * Given all cues, the current elapsed seconds, and the set of ids already
 * fired, return the cues that should fire NOW (reached their time and not yet
 * fired). Pure: the caller is responsible for actually playing them and
 * adding their ids to `firedIds`.
 */
export function cuesToFire(
  cues: Cue[],
  elapsedSeconds: number,
  firedIds: ReadonlySet<string>,
): Cue[] {
  return cues.filter(
    (c) => elapsedSeconds >= c.atSeconds && !firedIds.has(c.id),
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/audio/cue-engine.test.ts`
Expected: PASS — 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/audio/cue-engine.ts src/lib/audio/cue-engine.test.ts
git commit -m "feat(audio): pure cue-engine with tests"
```

## Task 8: `GuidedAudioPlayer` component

**Files:**
- Create: `src/components/features/sessions/guided-audio-player.tsx`

- [ ] **Step 1: Implement the player**

Create `src/components/features/sessions/guided-audio-player.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cuesToFire, type Cue } from "@/lib/audio/cue-engine";

interface GuidedAudioPlayerProps {
  /** Optional continuous background track (e.g. ambient drone or narration). */
  trackSrc?: string;
  /** Timed voice/bell cues fired against elapsed time. */
  cues?: Cue[];
  /** Session length in seconds (drives the progress bar + completion). */
  durationSeconds: number;
  onComplete?: () => void;
  title?: string;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

export function GuidedAudioPlayer({
  trackSrc,
  cues = [],
  durationSeconds,
  onComplete,
  title = "Guided practice",
}: GuidedAudioPlayerProps) {
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);

  // Cache audio elements once (iOS-safe plain <audio>, matching the existing
  // BreathingVisualizer pattern). Track + one element per distinct cue src.
  const trackRef = useRef<HTMLAudioElement | null>(null);
  const cueAudio = useRef<Map<string, HTMLAudioElement>>(new Map());
  const firedRef = useRef<Set<string>>(new Set());
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (trackSrc) {
      trackRef.current = new Audio(trackSrc);
      trackRef.current.preload = "auto";
      trackRef.current.loop = true;
    }
    for (const c of cues) {
      if (!cueAudio.current.has(c.src)) {
        const a = new Audio(c.src);
        a.preload = "auto";
        cueAudio.current.set(c.src, a);
      }
    }
    const cueMap = cueAudio.current;
    return () => {
      trackRef.current?.pause();
      cueMap.forEach((a) => a.pause());
    };
    // Intentionally run once; trackSrc/cues are treated as fixed per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mute applies to everything immediately.
  useEffect(() => {
    if (trackRef.current) trackRef.current.muted = muted;
    cueAudio.current.forEach((a) => (a.muted = muted));
  }, [muted]);

  const reset = () => {
    setIsActive(false);
    setElapsed(0);
    firedRef.current.clear();
    if (trackRef.current) {
      trackRef.current.pause();
      trackRef.current.currentTime = 0;
    }
  };

  const toggle = () => {
    if (elapsed >= durationSeconds) reset();
    const next = !isActive;
    setIsActive(next);
    if (next && trackRef.current && !muted) void trackRef.current.play().catch(() => {});
    else trackRef.current?.pause();
  };

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        const t = prev + 0.25;
        // Fire any cues that came due.
        for (const c of cuesToFire(cues, t, firedRef.current)) {
          firedRef.current.add(c.id);
          if (!muted) {
            const a = cueAudio.current.get(c.src);
            if (a) {
              try {
                a.currentTime = 0;
                void a.play().catch(() => {});
              } catch {}
            }
          }
        }
        if (t >= durationSeconds) {
          setIsActive(false);
          trackRef.current?.pause();
          onCompleteRef.current?.();
          return durationSeconds;
        }
        return t;
      });
    }, 250);
    return () => clearInterval(id);
  }, [isActive, cues, durationSeconds, muted]);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
      <p className="text-4xl font-bold text-gray-900">{fmt(elapsed)}</p>
      <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-200"
          style={{ width: `${(elapsed / durationSeconds) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="lg" onClick={reset} disabled={elapsed === 0} aria-label="Reset">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button size="lg" onClick={toggle} className="min-w-[140px]">
          {isActive ? <><Pause className="w-5 h-5 mr-2" />Pause</> : <><Play className="w-5 h-5 mr-2" />{elapsed > 0 ? "Resume" : "Start"}</>}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "guided-audio-player" || echo "clean"`
Expected: `clean`

- [ ] **Step 3: Manual verification (temporary harness)**

In any pillar without an interactive practice (e.g. `healing-meditation`) temporarily render:
```tsx
<GuidedAudioPlayer
  durationSeconds={60}
  cues={[{ id: "bowl", atSeconds: 2, src: "/audio/singing-bowl.mp3" }]}
  title="Test"
/>
```
Run `npm run dev`, open that pillar. Expected: Start → timer runs, the singing-bowl plays ~2s in, progress fills, completes at 60s; mute silences it; reset zeroes it. Then **remove the temporary render**.

- [ ] **Step 4: Commit**

```bash
git add src/components/features/sessions/guided-audio-player.tsx
git commit -m "feat(audio): reusable GuidedAudioPlayer built on cue-engine"
```

## Task 9: Adopt `GuidedAudioPlayer` for Healing Meditation

Give the Healing Meditation pillar a guided body-scan player (it currently has none). Uses existing meditation audio cues as placeholders; real narration can be dropped into `/public/audio/healing/` later without code changes.

**Files:**
- Modify: `src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx`

- [ ] **Step 1: Import + render for healing-meditation**

Add import:
```tsx
import { GuidedAudioPlayer } from "@/components/features/sessions/guided-audio-player";
```
In the per-pillar block, add:
```tsx
{pillarId === "healing-meditation" && (
  <GuidedAudioPlayer
    title="Guided body scan"
    durationSeconds={300}
    cues={[
      { id: "start", atSeconds: 1, src: "/audio/meditation/start.mp3" },
      { id: "mid", atSeconds: 150, src: "/audio/meditation/midway.mp3" },
      { id: "close", atSeconds: 290, src: "/audio/meditation/closing.mp3" },
    ]}
  />
)}
```
(These files exist per the audio archive: `/audio/meditation/{start,midway,closing}.mp3`.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "pillar-detail-client" || echo "clean"`
Expected: `clean`

- [ ] **Step 3: Manual verification**

`npm run dev` → `/pillars/healing-meditation`. Expected: a "Guided body scan" player; start plays the meditation cues at 1s/150s/290s and finishes at 5:00.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx"
git commit -m "feat(audio): guided body-scan player on Healing Meditation pillar"
```

---

# PART C — Generalized Animated Breath Pacer

Today `BreathingVisualizer` hardcodes a 2-phase (in/out) 4:6 pattern. Generalize it to a 4-phase state machine (inhale, hold-in, exhale, hold-out) driven by named presets, so Pitta-cooling, box breathing, 4-7-8, and bhramari are all selectable — the dossiers' competitive gap. The state machine is pure and tested; the component keeps the existing lotus + audio cues.

## Task 10: Breath pattern presets + pure phase machine (TDD)

**Files:**
- Create: `src/lib/breath/patterns.ts`
- Create: `src/lib/breath/phase.ts`
- Test: `src/lib/breath/phase.test.ts`

- [ ] **Step 1: Create the patterns module**

Create `src/lib/breath/patterns.ts`:
```ts
export interface BreathPattern {
  id: string;
  label: string;
  /** Seconds for each phase. holdIn/holdOut may be 0. */
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  /** Short rationale shown under the pacer. */
  note: string;
}

export const BREATH_PRESETS: BreathPattern[] = [
  {
    id: "coherent-4-6",
    label: "Calm 4:6",
    inhale: 4, holdIn: 0, exhale: 6, holdOut: 0,
    note: "Longer exhale than inhale — shifts you toward parasympathetic calm.",
  },
  {
    id: "box-4-4-4-4",
    label: "Box 4-4-4-4",
    inhale: 4, holdIn: 4, exhale: 4, holdOut: 4,
    note: "Equal four-count box breathing — steadies focus under stress.",
  },
  {
    id: "relax-4-7-8",
    label: "4-7-8",
    inhale: 4, holdIn: 7, exhale: 8, holdOut: 0,
    note: "Extended hold + long exhale — a strong wind-down before sleep.",
  },
  {
    id: "bhramari-4-8",
    label: "Bhramari 4:8",
    inhale: 4, holdIn: 0, exhale: 8, holdOut: 0,
    note: "Slow humming exhale (Bhramari) — soothing; good for Pitta and evenings.",
  },
];

export const DEFAULT_PRESET = BREATH_PRESETS[0];

export const cycleLength = (p: BreathPattern) =>
  p.inhale + p.holdIn + p.exhale + p.holdOut;
```

- [ ] **Step 2: Write the failing tests for the phase machine**

Create `src/lib/breath/phase.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { phaseAt } from "./phase";
import type { BreathPattern } from "./patterns";

const box: BreathPattern = {
  id: "box", label: "Box", inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, note: "",
};
const calm: BreathPattern = {
  id: "calm", label: "Calm", inhale: 4, holdIn: 0, exhale: 6, holdOut: 0, note: "",
};

describe("phaseAt", () => {
  test("start of cycle is inhale at progress 0", () => {
    const s = phaseAt(box, 0);
    expect(s.phase).toBe("inhale");
    expect(s.progress).toBeCloseTo(0, 5);
    expect(s.cycle).toBe(0);
  });

  test("box: each 4s segment maps to the right phase", () => {
    expect(phaseAt(box, 2).phase).toBe("inhale");
    expect(phaseAt(box, 5).phase).toBe("holdIn");
    expect(phaseAt(box, 9).phase).toBe("exhale");
    expect(phaseAt(box, 13).phase).toBe("holdOut");
  });

  test("box: progress is fractional position within the phase", () => {
    expect(phaseAt(box, 6).progress).toBeCloseTo(0.5, 5); // 2s into holdIn(4s)
  });

  test("cycle index increments after a full cycle", () => {
    expect(phaseAt(box, 16).cycle).toBe(1); // 16s = one 16s box cycle
    expect(phaseAt(box, 16).phase).toBe("inhale");
  });

  test("calm pattern skips zero-length holds", () => {
    expect(phaseAt(calm, 0).phase).toBe("inhale");
    expect(phaseAt(calm, 5).phase).toBe("exhale"); // 1s into exhale (no holdIn)
  });

  test("openness: 0 fully exhaled, 1 fully inhaled", () => {
    expect(phaseAt(box, 0).openness).toBeCloseTo(0, 5); // start of inhale
    expect(phaseAt(box, 4).openness).toBeCloseTo(1, 1); // end of inhale
    expect(phaseAt(box, 6).openness).toBeCloseTo(1, 5); // holdIn = stays open
    expect(phaseAt(box, 14).openness).toBeCloseTo(0, 5); // holdOut = stays closed
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx vitest run src/lib/breath/phase.test.ts`
Expected: FAIL — cannot resolve `./phase`.

- [ ] **Step 4: Implement the phase machine**

Create `src/lib/breath/phase.ts`:
```ts
import { cycleLength, type BreathPattern } from "./patterns";

export type BreathPhase = "inhale" | "holdIn" | "exhale" | "holdOut";

export interface BreathState {
  phase: BreathPhase;
  /** 0..1 position within the current phase. */
  progress: number;
  /** Completed-cycle index (0 during the first cycle). */
  cycle: number;
  /** 0 = fully exhaled (closed), 1 = fully inhaled (open). Drives the lotus. */
  openness: number;
}

/**
 * Pure mapping from elapsed seconds → breath state for a pattern. Zero-length
 * holds are skipped. `openness` rises over inhale, stays 1 during holdIn,
 * falls over exhale, stays 0 during holdOut.
 */
export function phaseAt(pattern: BreathPattern, elapsedSeconds: number): BreathState {
  const len = cycleLength(pattern);
  const cycle = Math.floor(elapsedSeconds / len);
  let pos = elapsedSeconds - cycle * len;

  const segments: { phase: BreathPhase; dur: number }[] = [
    { phase: "inhale", dur: pattern.inhale },
    { phase: "holdIn", dur: pattern.holdIn },
    { phase: "exhale", dur: pattern.exhale },
    { phase: "holdOut", dur: pattern.holdOut },
  ];

  for (const seg of segments) {
    if (seg.dur <= 0) continue;
    if (pos < seg.dur) {
      const progress = seg.dur === 0 ? 0 : pos / seg.dur;
      const openness =
        seg.phase === "inhale"
          ? progress
          : seg.phase === "holdIn"
            ? 1
            : seg.phase === "exhale"
              ? 1 - progress
              : 0;
      return { phase: seg.phase, progress, cycle, openness };
    }
    pos -= seg.dur;
  }

  // Fallback (only reachable on floating-point edge at the exact cycle end).
  return { phase: "inhale", progress: 0, cycle: cycle + 1, openness: 0 };
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run src/lib/breath/phase.test.ts`
Expected: PASS — all assertions pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/breath/patterns.ts src/lib/breath/phase.ts src/lib/breath/phase.test.ts
git commit -m "feat(breath): pattern presets + pure phase state machine with tests"
```

## Task 11: Refactor `BreathingVisualizer` to use the pattern machine + preset picker

Replace the inline in/out math with `phaseAt`, accept a `BreathPattern`, and add a preset selector. Preserve the existing lotus, audio cues, transport, and `onComplete`.

**Files:**
- Modify: `src/components/features/pillars/breathing-visualizer.tsx`

- [ ] **Step 1: Update imports and props**

At the top of `breathing-visualizer.tsx`, add:
```tsx
import { BREATH_PRESETS, DEFAULT_PRESET, cycleLength, type BreathPattern } from "@/lib/breath/patterns";
import { phaseAt, type BreathPhase } from "@/lib/breath/phase";
```
Replace the `BreathingVisualizerProps` interface and the local `type BreathPhase = ...` with:
```tsx
interface BreathingVisualizerProps {
  /** Initial pattern; user can switch via the picker. */
  initialPattern?: BreathPattern;
  totalDuration?: number; // minutes
  onComplete?: () => void;
}
```
(Remove the old `inhaleDuration`/`exhaleDuration` props and the local `BreathPhase` type — both now come from the lib.)

- [ ] **Step 2: Replace state + tick logic**

Replace the body state and the `setInterval` effect so the pattern drives everything. Set initial state:
```tsx
const [pattern, setPattern] = useState<BreathPattern>(initialPattern ?? DEFAULT_PRESET);
const [isActive, setIsActive] = useState(false);
const [elapsedTime, setElapsedTime] = useState(0);
const [muted, setMuted] = useState(false);

const totalSeconds = totalDuration * 60;
const state = phaseAt(pattern, elapsedTime);
// "idle" before start: show closed lotus + "Ready".
const started = isActive || elapsedTime > 0;
const phase: BreathPhase | "idle" = started ? state.phase : "idle";
const openness = started ? state.openness : 0;
const cycleCount = started ? state.cycle : 0;
const totalCycles = Math.floor(totalSeconds / cycleLength(pattern));
```
Replace the tick effect with:
```tsx
useEffect(() => {
  if (!isActive) return;
  const id = setInterval(() => {
    setElapsedTime((prev) => {
      const next = prev + 0.1;
      if (next >= totalSeconds) {
        setIsActive(false);
        if (onCompleteRef.current) onCompleteRef.current();
        return totalSeconds;
      }
      return next;
    });
  }, 100);
  return () => clearInterval(id);
}, [isActive, totalSeconds]);
```

- [ ] **Step 3: Drive audio cues from the lib phase**

Replace the inhale/exhale-only cue guard. Keep the two existing voice files but trigger on phase transitions, playing inhale on `inhale` and exhale on `exhale` (holds are silent):
```tsx
const lastPhaseRef = useRef<BreathPhase | "idle">("idle");
useEffect(() => {
  if (phase === lastPhaseRef.current) return;
  lastPhaseRef.current = phase;
  if (muted || phase === "idle") return;
  const a = phase === "inhale" ? inhaleAudio.current : phase === "exhale" ? exhaleAudio.current : null;
  if (!a) return;
  try {
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {}
}, [phase, muted]);
```
Update the label text block to map `"inhale" → "Breathe In"`, `"exhale" → "Breathe Out"`, `"holdIn"/"holdOut" → "Hold"`.

- [ ] **Step 4: Add the preset picker UI**

Above the lotus, add a row of preset buttons:
```tsx
<div className="flex flex-wrap justify-center gap-2">
  {BREATH_PRESETS.map((p) => (
    <button
      key={p.id}
      onClick={() => {
        setPattern(p);
        setIsActive(false);
        setElapsedTime(0);
        lastPhaseRef.current = "idle";
      }}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm border transition-colors",
        p.id === pattern.id
          ? "bg-amber-500 text-white border-amber-500"
          : "border-gray-200 text-gray-600 hover:border-amber-300",
      )}
    >
      {p.label}
    </button>
  ))}
</div>
```
Replace the hardcoded "Pranayama Breathing Pattern / 4:6 ratio…" footer with `{pattern.note}`.

- [ ] **Step 5: Update `resetSession` and `toggleSession`**

```tsx
const resetSession = useCallback(() => {
  setIsActive(false);
  setElapsedTime(0);
  lastPhaseRef.current = "idle";
}, []);

const toggleSession = () => {
  if (elapsedTime >= totalSeconds) resetSession();
  setIsActive((a) => !a);
};
```
(Remove references to the deleted `phaseProgress`/`setCycleCount`/`setPhase` state — `phase`, `openness`, and `cycleCount` are now derived above.)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "breathing-visualizer" || echo "clean"`
Expected: `clean` (resolve any references to removed props/state until clean).

- [ ] **Step 7: Check callers compile**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -iE "BreathingVisualizer|inhaleDuration|exhaleDuration" || echo "clean"`
Expected: `clean`. If a caller passed `inhaleDuration`/`exhaleDuration`, switch it to `initialPattern={DEFAULT_PRESET}` (or an appropriate preset) — fix each reported caller.

- [ ] **Step 8: Manual verification**

`npm run dev` → `/pillars/breathing-meditation`. Expected: preset chips (Calm 4:6, Box, 4-7-8, Bhramari); selecting one resets and re-paces the lotus; "Hold" appears for box/4-7-8; inhale/exhale voice cues still fire; the session still auto-completes and checks in.

- [ ] **Step 9: Commit**

```bash
git add src/components/features/pillars/breathing-visualizer.tsx
git commit -m "feat(breath): generalize BreathingVisualizer to preset patterns + holds"
```

---

## Final verification

- [ ] **Run the full test suite**

Run: `npm test`
Expected: PASS — `windows.test.ts`, `cue-engine.test.ts`, `phase.test.ts` all green.

- [ ] **Full typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Lint**

Run: `npm run lint`
Expected: no new errors in the created/modified files.

- [ ] **Build**

Run: `npm run build`
Expected: Next.js build succeeds.

---

## Notes for the implementer

- **No `Date.now()` in pure modules' tests** — tests use fixed `Date` fixtures so they're deterministic across timezones. (`use-solar-times.ts` uses `new Date()` at runtime, which is correct; it is not unit-tested.)
- **Geolocation must be user-initiated** — `useSolarTimes` only prompts on `request()` (button click), never on mount, to avoid a silent permission prompt.
- **Audio files** — the player references existing files under `/public/audio/`. New narration can be added there later with no code change (just new `Cue.src` paths).
- **Follow-on (separate plan):** server-side push reminders for sun windows (cron + `PushSubscriptions` + VAPID), per-dosha default pattern selection, and measurable self-tests (HRV, Sitting-Rising Test) called out in the dossiers.
```
