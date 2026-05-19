# Posters Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate ~11 curated Vedic teaching posters (chosen from the 74 source JPEGs in `Posters/Posters/`) into the website as flagship visuals on pillar pages, a browsable `/posters` gallery, and dosha-specific guidance on the dosha-assessment result page. OCR is done manually via Claude Code's vision-capable Read tool; output is committed as a typed data file.

**Architecture:** Static assets in `public/posters/` (WebP, three sizes per poster) + a typed `Poster` data model in `src/data/posters.ts`. Three rendering surfaces (pillar pages, new gallery route, dosha results) all consume the same data via helper functions. No backend, no runtime OCR.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind v4, `next/image`, `sharp` (build-time only, new devDep), `framer-motion` (existing), `lucide-react` (existing). No test framework added — verification is `tsc --noEmit`, `next lint`, and `next build` plus manual smoke tests in `next dev`.

**Spec:** `docs/superpowers/specs/2026-05-19-posters-integration-design.md`

---

## File Structure

**New files:**
- `scripts/build-poster-assets.mjs` — sharp-based converter, JPEG → WebP × 3 sizes
- `scripts/poster-manifest.json` — source filename → slug/concept/pillar/dosha mapping
- `scripts/verify-posters.mjs` — runtime check that `POSTERS[]` is internally consistent
- `public/posters/<slug>.webp`, `<slug>@2x.webp`, `<slug>.thumb.webp` (11 posters × 3 = 33 files)
- `src/data/posters.ts` — `Poster` type, `POSTERS[]` array, helper functions
- `src/components/features/posters/poster-section.tsx` — pillar/dosha-page embed
- `src/components/features/posters/poster-card.tsx` — gallery grid item
- `src/components/features/posters/poster-modal.tsx` — full-size modal w/ structured text
- `src/app/(main)/posters/page.tsx` — server component, gallery route
- `src/app/(main)/posters/posters-gallery.tsx` — client component, filter UI
- `docs/posters-ocr-log.md` — audit trail: source filename → final JSON snippet

**Modified files:**
- `package.json` — add `sharp` to `devDependencies`, add `build-poster-assets` and `verify-posters` scripts
- `.gitignore` — exclude `/Posters/`, `/Posters.zip`
- `src/components/layout/sidebar.tsx` — add "Posters" nav entry after "Library"
- `src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx` — mount `<PosterSection>` inside the detail layout
- `src/components/features/dosha/dosha-assessment.tsx` — mount dosha-specific posters in the result view
- `src/app/(public)/dosha-test/result/[id]/page.tsx` — mount dosha-specific posters in the public share view
- `src/lib/wisdom.ts` — extend rotation to optionally pull poster scriptures

---

# Phase 1 — Foundation

No user-visible change. Lands tooling, gitignore, dependencies, empty data file.

## Task 1: Add .gitignore rules for source posters

**Files:**
- Modify: `.gitignore` (end of file)

- [ ] **Step 1: Append entries**

Append to `.gitignore`:

```
# Source posters — raw JPEGs from WhatsApp drop. The curated subset lives
# in public/posters/*.webp; originals stay local-only.
/Posters/
/Posters.zip
```

- [ ] **Step 2: Verify**

Run: `git status --short Posters/ Posters.zip`
Expected: no output (files are now ignored). If they were previously tracked, run `git rm -r --cached Posters Posters.zip` first.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore(posters): gitignore raw Posters/ source drop"
```

---

## Task 2: Install sharp as a devDependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

Run: `npm install --save-dev sharp@^0.33.5`
Expected: sharp added to `devDependencies`; no peer-dep warnings.

- [ ] **Step 2: Add npm scripts**

Open `package.json`. In the `scripts` block, add (alongside the existing `generate-pillars` line):

```json
"build-poster-assets": "node scripts/build-poster-assets.mjs",
"verify-posters": "node scripts/verify-posters.mjs"
```

- [ ] **Step 3: Verify**

Run: `node -e "require('sharp')"`
Expected: silent success.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add sharp for poster asset build pipeline"
```

---

## Task 3: Create the poster manifest

**Files:**
- Create: `scripts/poster-manifest.json`

This is the curation list. Source filenames are mapped to slugs and metadata. The slugs become URL paths and `public/posters/` filenames; the suggested pillar/dosha guide the OCR-time classification but can be overridden in `posters.ts`.

- [ ] **Step 1: Write the manifest**

```json
{
  "posters": [
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.07 AM (5).jpeg",
      "slug": "morning-routine-5-step",
      "concept": "morning-routine",
      "suggestedPillarSlug": "morning-initiation",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "body"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.03 AM (14).jpeg",
      "slug": "morning-sandhya-meditation",
      "concept": "sandhya-meditation",
      "suggestedPillarSlug": "sandhya-meditation",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "spirit"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.02 AM.jpeg",
      "slug": "path-of-manifestation",
      "concept": "manifestation-6-steps",
      "suggestedPillarSlug": "divine-manifestation",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "spirit"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.03 AM.jpeg",
      "slug": "five-principles-of-manifestation",
      "concept": "manifestation-principles",
      "suggestedPillarSlug": "divine-manifestation",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "spirit"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.05 AM (5).jpeg",
      "slug": "manifestation-secrets-patanjali",
      "concept": "manifestation-secrets",
      "suggestedPillarSlug": "divine-manifestation",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "spirit"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.07 AM.jpeg",
      "slug": "step-by-step-healing",
      "concept": "healing",
      "suggestedPillarSlug": "healing-meditation",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "mind"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.03 AM (10).jpeg",
      "slug": "gratitude-way-of-life",
      "concept": "gratitude",
      "suggestedPillarSlug": "gratitude",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "mind"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.04 AM (10).jpeg",
      "slug": "ayurvedic-nutrition-fasting",
      "concept": "nutrition-fasting",
      "suggestedPillarSlug": "nutrition-fasting",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "body"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.06 AM (5).jpeg",
      "slug": "mind-purification-5-step",
      "concept": "mind-purification",
      "suggestedPillarSlug": "thoughts-intention",
      "suggestedDosha": null,
      "suggestedKind": "general",
      "category": "mind"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.04 AM (5).jpeg",
      "slug": "vata-balancing-yoga",
      "concept": "dosha-yoga",
      "suggestedPillarSlug": "movement",
      "suggestedDosha": "vata",
      "suggestedKind": "yoga",
      "category": "body"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.05 AM.jpeg",
      "slug": "pitta-balancing-yoga",
      "concept": "dosha-yoga",
      "suggestedPillarSlug": "movement",
      "suggestedDosha": "pitta",
      "suggestedKind": "yoga",
      "category": "body"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.06 AM (10).jpeg",
      "slug": "vata-pranayama",
      "concept": "dosha-pranayama",
      "suggestedPillarSlug": "breathing-meditation",
      "suggestedDosha": "vata",
      "suggestedKind": "pranayama",
      "category": "mind"
    },
    {
      "source": "WhatsApp Image 2026-05-19 at 7.39.06 AM.jpeg",
      "slug": "kapha-pranayama",
      "concept": "dosha-pranayama",
      "suggestedPillarSlug": "breathing-meditation",
      "suggestedDosha": "kapha",
      "suggestedKind": "pranayama",
      "category": "mind"
    }
  ]
}
```

Note: 13 entries (not 11). Three dosha-yoga variants would be ideal but only Vata + Pitta were observed in the sample; if a Kapha-yoga poster is found during curation, add a 14th entry. Likewise the Pitta-pranayama slot is left out until confirmed. The plan tolerates 11-14 finalists.

- [ ] **Step 2: Commit**

```bash
git add scripts/poster-manifest.json
git commit -m "feat(posters): seed curation manifest with 13 finalists"
```

---

## Task 4: Write the asset build script

**Files:**
- Create: `scripts/build-poster-assets.mjs`

- [ ] **Step 1: Write the script**

```js
// Reads scripts/poster-manifest.json and converts each source JPEG into
// three WebP sizes under public/posters/. Idempotent — skips files that
// already exist unless --force is passed.

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST = resolve(ROOT, "scripts/poster-manifest.json");
const SOURCE_DIR = resolve(ROOT, "Posters/Posters");
const OUT_DIR = resolve(ROOT, "public/posters");

const SIZES = [
  { suffix: "", maxWidth: 768, quality: 82 },
  { suffix: "@2x", maxWidth: 1536, quality: 82 },
  { suffix: ".thumb", maxWidth: 400, quality: 80 },
];

const force = process.argv.includes("--force");

async function exists(p) {
  try {
    await access(p, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function processOne(entry) {
  const sourcePath = join(SOURCE_DIR, entry.source);
  if (!(await exists(sourcePath))) {
    console.error(`  MISSING: ${sourcePath}`);
    return null;
  }
  const meta = { slug: entry.slug, sizes: {} };
  for (const { suffix, maxWidth, quality } of SIZES) {
    const outPath = join(OUT_DIR, `${entry.slug}${suffix}.webp`);
    if (!force && (await exists(outPath))) {
      const dims = await sharp(outPath).metadata();
      meta.sizes[suffix || "default"] = { width: dims.width, height: dims.height };
      continue;
    }
    const pipeline = sharp(sourcePath).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality });
    const buf = await pipeline.toBuffer();
    const dims = await sharp(buf).metadata();
    await writeFile(outPath, buf);
    meta.sizes[suffix || "default"] = { width: dims.width, height: dims.height };
    console.log(`  wrote ${outPath} (${dims.width}x${dims.height})`);
  }
  return meta;
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  await mkdir(OUT_DIR, { recursive: true });
  const results = [];
  for (const entry of manifest.posters) {
    console.log(`\n[${entry.slug}]`);
    const result = await processOne(entry);
    if (result) results.push(result);
  }
  const sidecarPath = join(OUT_DIR, "_dimensions.json");
  await writeFile(sidecarPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${sidecarPath} with ${results.length} entries.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Make output directory**

Run: `mkdir public/posters` (on Windows PowerShell: `New-Item -ItemType Directory public/posters -Force`)
Expected: directory created.

- [ ] **Step 3: Smoke-test on a single poster**

Run: `node scripts/build-poster-assets.mjs`
Expected: console logs `[<slug>]` lines for each manifest entry, writes 39 WebP files (13 × 3) + `_dimensions.json` into `public/posters/`. No errors.

If a source file is missing (filename mismatch from the manifest), the script logs `MISSING:` — fix the manifest entry and re-run with `--force`.

- [ ] **Step 4: Inspect**

Run: `ls public/posters/`
Expected: 13 × 3 = 39 WebP files plus `_dimensions.json`.

Open one in a browser or image viewer to confirm visual quality is acceptable.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-poster-assets.mjs public/posters/
git commit -m "feat(posters): asset build script + 13 WebP poster sets"
```

---

## Task 5: Create the typed `posters.ts` skeleton

**Files:**
- Create: `src/data/posters.ts`

- [ ] **Step 1: Write the skeleton**

```ts
// Curated Vedic teaching posters. Each entry is hand-OCR'd from
// public/posters/<slug>.webp during Phase 2 of the integration plan;
// pillar/dosha tags reuse the canonical slugs from constants/pillars.ts
// and lib/dosha.ts so lookups stay aligned across the app.

import type { DoshaName } from "@/lib/dosha";

export type DoshaTag = DoshaName;
export type PosterCategory = "body" | "mind" | "spirit";
export type PosterKind = "yoga" | "pranayama" | "general";

export interface PosterScripture {
  sutra: string;
  sanskrit?: string;
  translation: string;
}

export interface PosterSection {
  number?: number;
  title: string;
  body: string;
  bullets?: string[];
}

export interface PosterImage {
  src: string;       // /posters/<slug>.webp
  src2x: string;     // /posters/<slug>@2x.webp
  thumb: string;     // /posters/<slug>.thumb.webp
  width: number;     // intrinsic width of <slug>.webp
  height: number;    // intrinsic height of <slug>.webp
  alt: string;
}

export interface Poster {
  slug: string;
  title: string;
  concept: string;
  pillarSlug?: string;
  dosha?: DoshaTag;
  kind: PosterKind;
  category: PosterCategory;
  image: PosterImage;
  scripture: PosterScripture[];
  sections: PosterSection[];
  tagline?: string;
}

export const POSTERS: Poster[] = [
  // Populated in Phase 2 via manual OCR. Order is presentation order in
  // the gallery; pillar/dosha lookups use the helpers below regardless.
];

export function getPostersByPillar(slug: string): Poster[] {
  return POSTERS.filter((p) => p.pillarSlug === slug);
}

export function getPosterByDosha(
  dosha: DoshaTag,
  kind: PosterKind,
): Poster | undefined {
  return POSTERS.find((p) => p.dosha === dosha && p.kind === kind);
}

export function getPosterBySlug(slug: string): Poster | undefined {
  return POSTERS.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/posters.ts
git commit -m "feat(posters): typed Poster model + empty registry"
```

---

## Task 6: Create the verify-posters script

**Files:**
- Create: `scripts/verify-posters.mjs`

This is a lightweight runtime sanity check (no test framework). It loads `posters.ts` via a tiny `tsx`-less workaround: we read the file, eval-friendly assertions are kept simple by re-parsing the `POSTERS` array using TS-stripped regex. Alternative: convert to importing via a small runner. To keep deps minimal, we run it through `npx tsx`.

- [ ] **Step 1: Add tsx as a devDep (only if not already present)**

Run: `npm ls tsx`
If "empty" output, install: `npm install --save-dev tsx@^4.19.2`
Expected: tsx in devDependencies.

- [ ] **Step 2: Write the script**

```js
// Loads src/data/posters.ts via tsx and asserts internal consistency:
//  - slugs are unique
//  - pillarSlug (when present) matches a known pillar
//  - dosha posters have kind set to yoga or pranayama
//  - referenced image files exist under public/posters/
//
// Run via: npm run verify-posters

import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const { POSTERS } = await import(resolve(ROOT, "src/data/posters.ts"));
const { PILLARS } = await import(resolve(ROOT, "src/constants/pillars.ts"));

const knownSlugs = new Set(PILLARS.map((p) => p.slug));
const errors = [];

const seen = new Set();
for (const p of POSTERS) {
  if (seen.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`);
  seen.add(p.slug);
  if (p.pillarSlug && !knownSlugs.has(p.pillarSlug)) {
    errors.push(`${p.slug}: unknown pillarSlug "${p.pillarSlug}"`);
  }
  if (p.dosha && p.kind === "general") {
    errors.push(`${p.slug}: dosha set but kind is "general" — expected yoga/pranayama`);
  }
  for (const key of ["src", "src2x", "thumb"]) {
    const path = resolve(ROOT, "public" + p.image[key]);
    if (!existsSync(path)) errors.push(`${p.slug}: missing image ${p.image[key]}`);
  }
}

if (errors.length) {
  console.error("FAIL:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`OK: ${POSTERS.length} posters verified.`);
```

Note: this uses `await import()` on a `.ts` path which Node 22+ supports with `--experimental-strip-types`. If the Node version in this repo doesn't support that, change the npm script to: `tsx scripts/verify-posters.mjs` and ensure tsx is installed.

- [ ] **Step 3: Update package.json**

Confirm the `verify-posters` script in `package.json` (added in Task 2) is set to: `"verify-posters": "tsx scripts/verify-posters.mjs"`.

- [ ] **Step 4: Run with empty POSTERS**

Run: `npm run verify-posters`
Expected: `OK: 0 posters verified.`

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-posters.mjs package.json package-lock.json
git commit -m "feat(posters): verify-posters consistency check script"
```

---

## Task 7: Initialize the OCR audit log

**Files:**
- Create: `docs/posters-ocr-log.md`

- [ ] **Step 1: Write the header**

```markdown
# Posters OCR Audit Log

Each entry maps a source file in `Posters/Posters/` to the curated slug,
the WebP outputs in `public/posters/`, and the OCR-extracted JSON that
was appended to `src/data/posters.ts`.

Format per entry:

```
## <slug>
Source: <filename>
Outputs: /posters/<slug>.webp, @2x.webp, .thumb.webp
Extracted at: YYYY-MM-DD HH:MM by Claude Code

<json snippet>
```

Phase 2 fills this file in batches of 3-4 posters.
```

(Note: the inner triple-backtick `code fence` is escaped/illustrative — when writing the file, drop one level so it renders as a fenced code block. The Write tool handles this directly.)

- [ ] **Step 2: Commit**

```bash
git add docs/posters-ocr-log.md
git commit -m "docs(posters): initialize OCR audit log"
```

---

# Phase 2 — OCR data

Manual OCR via Claude Code's Read tool. Each finalist becomes one entry in `POSTERS[]`. No automated step here — Claude reads the image, drafts the JSON, hand-corrects pillar/dosha tags, appends to `posters.ts`, logs to `posters-ocr-log.md`.

## Task 8: OCR posters and populate `POSTERS[]`

**Files:**
- Modify: `src/data/posters.ts` (replace empty `POSTERS = []` with the populated array)
- Modify: `docs/posters-ocr-log.md` (one entry per poster)

- [ ] **Step 1: Workflow (run once per poster, in batches of 3-4)**

For each entry in `scripts/poster-manifest.json`:

1. Open the source poster via the Read tool: `Read({ file_path: "Posters/Posters/<source>" })`.
2. Look at the image. Identify:
   - Headline title (becomes `title`)
   - Numbered or named sections — each becomes a `PosterSection` with `number` (if numbered), `title`, `body` (1-3 sentences in your words, condensed from the poster), `bullets` (if the section has a sub-list).
   - Sanskrit/Devanagari verses with their citation — each becomes a `PosterScripture` (`sutra: "Yoga Sutra 2.42"`, `sanskrit: "<IAST or Devanagari verbatim>"`, `translation: "<English>"`).
   - Tagline (the closing one-liner often at the bottom — becomes `tagline`).
   - One-sentence alt-text description for screen readers (becomes `image.alt`).
3. Read the matching entry in `public/posters/_dimensions.json` to get `width`/`height` for `image.src`.
4. Build the `Poster` object:

```ts
{
  slug: "<manifest slug>",
  title: "<headline>",
  concept: "<manifest concept>",
  pillarSlug: "<manifest suggestedPillarSlug, override if obviously wrong>",
  dosha: "<manifest suggestedDosha>",  // omit if null
  kind: "<manifest suggestedKind>",
  category: "<manifest category>",
  image: {
    src: "/posters/<slug>.webp",
    src2x: "/posters/<slug>@2x.webp",
    thumb: "/posters/<slug>.thumb.webp",
    width: <from _dimensions.json>,
    height: <from _dimensions.json>,
    alt: "<one-sentence description>",
  },
  scripture: [ /* one or more PosterScripture */ ],
  sections: [ /* one or more PosterSection */ ],
  tagline: "<closing line>",
}
```

5. Append the object to `POSTERS[]` in `src/data/posters.ts`. Maintain manifest order for now (gallery sort order can be tuned later).
6. Append to `docs/posters-ocr-log.md`:

```
## <slug>
Source: <source filename>
Outputs: /posters/<slug>.webp, @2x.webp, .thumb.webp
Extracted at: 2026-05-19 <HH:MM> by Claude Code

<JSON-stringified Poster object>
```

- [ ] **Step 2: Run verify after each batch**

Run: `npm run verify-posters`
Expected: `OK: N posters verified.` where N matches the number of entries added so far. Fix any errors before continuing.

- [ ] **Step 3: Typecheck after each batch**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 4: Commit per batch**

```bash
git add src/data/posters.ts docs/posters-ocr-log.md
git commit -m "feat(posters): OCR batch <N> — <slug-list>"
```

- [ ] **Step 5: After all batches, run final verification**

Run: `npm run verify-posters && npx tsc --noEmit`
Expected: `OK: 13 posters verified.` (or however many finalists shipped) and zero TS errors.

---

# Phase 3 — Pillar surface

Embed posters in `/pillars/[pillarId]`. First user-visible change.

## Task 9: Build the `PosterModal` component

**Files:**
- Create: `src/components/features/posters/poster-modal.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/features/posters/poster-modal.tsx
git commit -m "feat(posters): PosterModal — full-size image + structured text"
```

---

## Task 10: Build the `PosterSection` component

**Files:**
- Create: `src/components/features/posters/poster-section.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { Poster } from "@/data/posters";
import { PosterModal } from "./poster-modal";

interface PosterSectionProps {
  poster: Poster;
  /** Heading rendered above the poster card. */
  heading?: string;
}

export function PosterSection({ poster, heading }: PosterSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="vedic-card overflow-hidden">
      {heading && (
        <h2 className="text-lg font-semibold text-gray-800 px-6 pt-6">{heading}</h2>
      )}
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 p-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View full poster: ${poster.title}`}
          className="relative group rounded-xl overflow-hidden bg-gray-50 hover:ring-2 hover:ring-amber-400 transition"
        >
          <Image
            src={poster.image.src}
            alt={poster.image.alt}
            width={poster.image.width}
            height={poster.image.height}
            sizes="(max-width: 768px) 100vw, 40vw"
            className="w-full h-auto"
          />
          <span className="absolute top-2 right-2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
            <Maximize2 size={16} />
          </span>
        </button>

        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900">{poster.title}</h3>
          {poster.tagline && (
            <p className="text-sm text-gray-500 italic mt-1">{poster.tagline}</p>
          )}
          {poster.scripture[0] && (
            <blockquote className="mt-3 border-l-4 border-amber-400 pl-3 text-sm">
              {poster.scripture[0].sanskrit && (
                <p className="text-amber-900 font-medium">
                  {poster.scripture[0].sanskrit}
                </p>
              )}
              <p className="text-gray-700 mt-1">{poster.scripture[0].translation}</p>
              <p className="text-xs text-gray-400 mt-1">{poster.scripture[0].sutra}</p>
            </blockquote>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 self-start text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Open full poster &rarr;
          </button>
        </div>
      </div>

      {open && <PosterModal poster={poster} onClose={() => setOpen(false)} />}
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/features/posters/poster-section.tsx
git commit -m "feat(posters): PosterSection — embeddable poster card"
```

---

## Task 11: Wire `PosterSection` into the pillar detail page

**Files:**
- Modify: `src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx`

- [ ] **Step 1: Import the helper and component**

At the top of the imports block in `pillar-detail-client.tsx`, add:

```ts
import { getPostersByPillar } from "@/data/posters";
import { PosterSection } from "@/components/features/posters/poster-section";
```

- [ ] **Step 2: Compute the posters list once**

Inside the `PillarDetailClient` function, after the existing `const pillar = getPillarBySlug(pillarId);` line, add:

```ts
const pillarPosters = getPostersByPillar(pillarId);
```

- [ ] **Step 3: Render the posters**

Find the spot in the JSX between the existing pillar hero and the daily-practice content (search the file for `<PillarHero` to locate the hero; the posters should render directly after it). Insert:

```tsx
{pillarPosters.length > 0 && (
  <div className="space-y-6 mt-6">
    {pillarPosters.map((p) => (
      <PosterSection key={p.slug} poster={p} heading="Teaching Poster" />
    ))}
  </div>
)}
```

If the exact insertion site is unclear, prefer placing it immediately after the pillar hero block and before the first content `Card`.

- [ ] **Step 4: Run dev server and verify**

Run: `npm run dev`
Open: `http://localhost:3000/pillars/gratitude` (a pillar with a poster).
Expected: a "Teaching Poster" card appears with the gratitude poster thumbnail and the first scripture verse. Clicking the thumbnail or "Open full poster" opens the modal at @2x size with all sections rendered as text.
Open a pillar with no matching poster (e.g., `/pillars/sleep-optimization`) — no poster section should render.

- [ ] **Step 5: Typecheck + lint + build**

Run: `npx tsc --noEmit && npx next lint && npm run build`
Expected: all three succeed.

- [ ] **Step 6: Commit**

```bash
git add src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx
git commit -m "feat(posters): embed poster section in pillar detail page"
```

---

# Phase 4 — Gallery

New `/posters` route. Independent of Phase 3.

## Task 12: Build the `PosterCard` grid component

**Files:**
- Create: `src/components/features/posters/poster-card.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Image from "next/image";
import type { Poster } from "@/data/posters";

interface PosterCardProps {
  poster: Poster;
  onOpen: (poster: Poster) => void;
}

export function PosterCard({ poster, onOpen }: PosterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(poster)}
      className="group text-left vedic-card overflow-hidden hover:ring-2 hover:ring-amber-400 transition"
      aria-label={`View poster: ${poster.title}`}
    >
      <div className="relative bg-gray-50">
        <Image
          src={poster.image.thumb}
          alt={poster.image.alt}
          width={400}
          height={Math.round((400 * poster.image.height) / poster.image.width)}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="w-full h-auto"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{poster.title}</h3>
        {poster.tagline && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{poster.tagline}</p>
        )}
        <div className="flex gap-2 mt-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
            {poster.category}
          </span>
          {poster.dosha && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 capitalize">
              {poster.dosha}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/features/posters/poster-card.tsx
git commit -m "feat(posters): PosterCard for gallery grid"
```

---

## Task 13: Build the gallery client component

**Files:**
- Create: `src/app/(main)/posters/posters-gallery.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { POSTERS, type Poster, type PosterCategory } from "@/data/posters";
import { PosterCard } from "@/components/features/posters/poster-card";
import { PosterModal } from "@/components/features/posters/poster-modal";

type CategoryFilter = "all" | PosterCategory;

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "body", label: "Body" },
  { value: "mind", label: "Mind" },
  { value: "spirit", label: "Spirit" },
];

function matchesQuery(poster: Poster, q: string): boolean {
  if (!q) return true;
  const haystack = [
    poster.title,
    poster.concept,
    poster.tagline ?? "",
    ...poster.sections.flatMap((s) => [s.title, s.body, ...(s.bullets ?? [])]),
    ...poster.scripture.flatMap((s) => [s.sutra, s.translation, s.sanskrit ?? ""]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export function PostersGallery() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Poster | null>(null);

  const filtered = useMemo(() => {
    return POSTERS.filter((p) => (category === "all" || p.category === category) && matchesQuery(p, query));
  }, [category, query]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Teaching Posters</h1>
        <p className="text-gray-500 mt-1">
          Vedic infographics rooted in Patanjali&apos;s Yoga Sutras and Ayurveda.
        </p>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setCategory(tab.value)}
              className={
                category === tab.value
                  ? "px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posters by topic, sutra, or concept"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No posters match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PosterCard key={p.slug} poster={p} onOpen={setOpen} />
          ))}
        </div>
      )}

      {open && <PosterModal poster={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/(main)/posters/posters-gallery.tsx
git commit -m "feat(posters): /posters gallery client with filter + search"
```

---

## Task 14: Add the gallery route entry point

**Files:**
- Create: `src/app/(main)/posters/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import { PostersGallery } from "./posters-gallery";

export const metadata = {
  title: "Teaching Posters — Vedic Transform",
  description:
    "Browsable archive of Vedic teaching posters rooted in Patanjali's Yoga Sutras and Ayurvedic principles.",
};

export default function PostersPage() {
  return <PostersGallery />;
}
```

- [ ] **Step 2: Verify the route**

Run: `npm run dev`
Open: `http://localhost:3000/posters`
Expected: gallery renders with all curated posters as a grid. Category tabs filter the grid. Search input filters by title/sutra. Clicking any card opens the modal.

- [ ] **Step 3: Commit**

```bash
git add src/app/(main)/posters/page.tsx
git commit -m "feat(posters): /posters route entry"
```

---

## Task 15: Add the sidebar nav entry

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

- [ ] **Step 1: Add a `Posters` entry to the nav list**

Find the line in `sidebar.tsx` that reads:

```ts
{ name: "Library", href: "/library", icon: BookMarked },
```

Insert immediately after it:

```ts
{ name: "Posters", href: "/posters", icon: Image },
```

Update the top-of-file `lucide-react` import to include `Image` if not already imported.

- [ ] **Step 2: Mirror the change in mobile-nav if applicable**

Open `src/components/layout/mobile-nav.tsx`. If it also enumerates nav items, add the same `Posters` entry. If it imports from `sidebar.tsx` instead, no change needed.

- [ ] **Step 3: Verify in dev**

Run: `npm run dev`
Expected: "Posters" appears in the sidebar under Library. Clicking it navigates to `/posters`.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/sidebar.tsx src/components/layout/mobile-nav.tsx
git commit -m "feat(posters): sidebar nav entry"
```

---

# Phase 5 — Dosha results + wisdom rotation

Two small surfaces. Wisdom extension is independent of dosha.

## Task 16: Inject dosha posters into the authenticated dosha-assessment result

**Files:**
- Modify: `src/components/features/dosha/dosha-assessment.tsx`

- [ ] **Step 1: Add imports**

At the top of `dosha-assessment.tsx`, add:

```ts
import { getPosterByDosha } from "@/data/posters";
import { PosterSection } from "@/components/features/posters/poster-section";
```

- [ ] **Step 2: Render dosha posters in the result view**

Locate the result-view JSX. After the existing "Recommendations" block (the `<div>` containing `Personalized Recommendations for {primary.name}`), and before the "Actions" buttons row, insert:

```tsx
{(() => {
  const yogaPoster = getPosterByDosha(result.primary, "yoga");
  const pranayamaPoster = getPosterByDosha(result.primary, "pranayama");
  if (!yogaPoster && !pranayamaPoster) return null;
  return (
    <div className="space-y-4">
      {yogaPoster && (
        <PosterSection
          poster={yogaPoster}
          heading={`${primary.name} Balancing Yoga`}
        />
      )}
      {pranayamaPoster && (
        <PosterSection
          poster={pranayamaPoster}
          heading={`Pranayama for ${primary.name}`}
        />
      )}
    </div>
  );
})()}
```

- [ ] **Step 3: Verify in dev**

Run: `npm run dev`
Open: `http://localhost:3000/dosha-assessment` and complete the quiz so a result renders.
Expected: when primary dosha is Vata, both the Vata Yoga and Vata Pranayama posters render below the recommendations. When primary is Pitta, only the Pitta Yoga poster renders (until a Pitta-pranayama poster is added). When primary is Kapha, only Kapha Pranayama renders. Clicking a poster opens the modal.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add src/components/features/dosha/dosha-assessment.tsx
git commit -m "feat(posters): show dosha-matched posters in /dosha-assessment result"
```

---

## Task 17: Inject dosha posters into the public dosha-test result share page

**Files:**
- Modify: `src/app/(public)/dosha-test/result/[id]/page.tsx`

- [ ] **Step 1: Add imports**

At the top of the file, add:

```ts
import { getPosterByDosha } from "@/data/posters";
import { PosterSection } from "@/components/features/posters/poster-section";
```

- [ ] **Step 2: Render posters in the JSX**

This is a server component, but `PosterSection` is a client component, so it can simply be mounted inside the returned tree without any extra wrapper. Find the JSX returned by the default export (after the `result` is fetched and validated by `notFound()` short-circuit) and insert, after the score-bars / recommendations section:

```tsx
{(() => {
  const yogaPoster = getPosterByDosha(result.primary, "yoga");
  const pranayamaPoster = getPosterByDosha(result.primary, "pranayama");
  if (!yogaPoster && !pranayamaPoster) return null;
  return (
    <section className="space-y-4 mt-6">
      {yogaPoster && (
        <PosterSection poster={yogaPoster} heading={`${info.name} Balancing Yoga`} />
      )}
      {pranayamaPoster && (
        <PosterSection poster={pranayamaPoster} heading={`Pranayama for ${info.name}`} />
      )}
    </section>
  );
})()}
```

Note: `info` is the local `DOSHA_INFO[result.primary]` already in scope in this file (see the existing `generateMetadata` and page body).

- [ ] **Step 3: Verify in dev**

Run: `npm run dev`
Trigger an anonymous quiz from `/dosha-test`, capture the redirect URL (something like `/dosha-test/result/<id>`), and visit it.
Expected: the same dosha-matched posters render as on the authenticated page.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add src/app/(public)/dosha-test/result/[id]/page.tsx
git commit -m "feat(posters): show dosha-matched posters in /dosha-test/result share page"
```

---

## Task 18: Extend the daily-wisdom rotation with poster scriptures

**Files:**
- Modify: `src/lib/wisdom.ts`

- [ ] **Step 1: Add a helper**

Append to `src/lib/wisdom.ts`:

```ts
import { POSTERS, type Poster, type PosterScripture } from "@/data/posters";

export interface TodaysPosterScripture {
  poster: Poster;
  scripture: PosterScripture;
}

/**
 * Returns one poster scripture chosen by day-of-year rotation across the
 * full `POSTERS[].scripture` set. Returns null if no posters have any
 * scripture entries (defensive — POSTERS may be empty in early phases).
 */
export function getTodaysPosterScripture(): TodaysPosterScripture | null {
  const flat: TodaysPosterScripture[] = POSTERS.flatMap((p) =>
    p.scripture.map((s) => ({ poster: p, scripture: s })),
  );
  if (flat.length === 0) return null;
  const index = getDayOfYear() % flat.length;
  return flat[index];
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Identify the wisdom popup consumer**

Run: `Grep({ pattern: "getTodaysWisdom", path: "src" })` to find the file(s) that surface the daily wisdom popup. Common location: a dashboard widget or a `wisdom-read-aloud.tsx` consumer.

- [ ] **Step 4: Update one consumer to optionally feature a poster scripture**

In the file identified in Step 3, import the new helper and, when `getTodaysPosterScripture()` returns non-null on alternating days (or on every Sunday — pick one rule), render the poster scripture instead of the standard wisdom entry, with a "View full poster" link to `/posters` filtered to that slug. Concretely:

```tsx
import { getTodaysPosterScripture } from "@/lib/wisdom";

// inside the component body:
const posterPick = getTodaysPosterScripture();
const usePoster = posterPick !== null && new Date().getDay() === 0; // Sunday only

if (usePoster) {
  return (
    <div>
      <blockquote>
        {posterPick.scripture.sanskrit && <p>{posterPick.scripture.sanskrit}</p>}
        <p>{posterPick.scripture.translation}</p>
        <cite>{posterPick.scripture.sutra}</cite>
      </blockquote>
      <a href={`/posters#${posterPick.poster.slug}`}>View full poster</a>
    </div>
  );
}
// otherwise: existing daily-wisdom render path
```

If the consumer's existing wisdom rendering is highly structured, keep the override minimal — only swap the quote text + citation, preserving the surrounding card UI.

- [ ] **Step 5: Verify**

Run: `npm run dev`
Visit the dashboard.
Expected (Sunday): wisdom card shows a poster scripture + "View full poster" link.
Expected (other days): unchanged behaviour.

For non-Sunday verification, temporarily change the rule to `true` to confirm the rendering, then revert.

- [ ] **Step 6: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 7: Commit**

```bash
git add src/lib/wisdom.ts <consumer-file-from-step-3>
git commit -m "feat(posters): rotate poster scriptures into Sunday wisdom popup"
```

---

# Final verification

## Task 19: End-to-end verification

- [ ] **Step 1: Full check**

Run: `npm run verify-posters && npx tsc --noEmit && npx next lint && npm run build`
Expected: all pass.

- [ ] **Step 2: Manual smoke**

Run: `npm run dev`
Visit each of the following and confirm rendering:
- `/posters` — grid + filters + search + modal
- `/pillars/gratitude`, `/pillars/divine-manifestation`, `/pillars/nutrition-fasting` — flagship poster card present
- `/dosha-assessment` — complete quiz, confirm dosha-matched poster(s) on result
- `/dosha-test` → anonymous result page — same poster(s) render on share view
- Dashboard wisdom popup — poster scripture appears at least once when forced

- [ ] **Step 3: Confirm posters are accessible**

Open any pillar page in a browser, tab through the page using only the keyboard. Expected: posters are focusable; Enter opens modal; Escape closes; aria-label is read by screen readers (verify with browser devtools accessibility tab if available).

- [ ] **Step 4: Final commit if anything was tweaked**

```bash
git status
# if anything modified during smoke testing, stage and commit
```

---

# Self-review notes

**Spec coverage:**
- Scope section covered by Tasks 1-19; out-of-scope items are not implemented (no backend, no progress tracking, no mobile-app integration).
- Source-material concept table → seeded in `scripts/poster-manifest.json` (Task 3).
- Architecture pipeline diagram → realised in Tasks 1-8.
- Data model → Task 5 (skeleton) + Task 8 (data fill).
- Asset pipeline → Task 4.
- Manual OCR flow → Task 8.
- Rendering surfaces (a) pillar / (b) gallery / (c) dosha → Tasks 11, 14, 16+17.
- Daily-wisdom extension → Task 18.
- Build sequence phases 1-5 map to Tasks 1-7, 8, 9-11, 12-15, 16-18 respectively.

**Placeholder scan:** No TBDs / TODOs. All steps include exact code or exact commands.

**Type consistency:**
- `Poster.kind` is `PosterKind` everywhere; `getPosterByDosha` signature matches the spec edit.
- `PosterImage` adds `src2x` and `thumb` properties not in the spec's narrative — these are necessary to drive `next/image` for the three asset sizes; the spec data model is amended implicitly. (Acceptable refinement during planning.)
- Helper names: `getPostersByPillar`, `getPosterByDosha`, `getPosterBySlug`, `getTodaysPosterScripture` — all used consistently.
