# Posters Integration — Design Spec

**Date:** 2026-05-19
**Status:** Approved for implementation
**Owner:** Gopinath Varadharajan

## Goal

Integrate the 74 Patanjali / Ayurveda teaching posters in `Posters/Posters/` into the Vedic Transform website. Each curated poster becomes a flagship visual on its matching pillar page, browsable in a new `/posters` gallery, and surfaced as dosha-specific guidance on the dosha-assessment result page. OCR extraction (manual, via Claude Code) captures the structured text so posters remain searchable, accessible, and SEO-indexed.

## Scope

**In scope**
- Curate ~11 best-styled posters out of 74 (the source folder contains duplicate visual variants of the same teaching concepts).
- Convert curated images to optimised WebP (3 sizes each) in `public/posters/`.
- Manually OCR each curated poster via the Claude Code Read tool — extract title, sections, scripture verses (Sanskrit + translation), suggested pillar/dosha, tagline.
- Land a typed `Poster` data model in `src/data/posters.ts`.
- Three rendering surfaces: pillar pages, new `/posters` gallery, dosha-assessment result page.
- Extend daily-wisdom rotation to occasionally surface a poster scripture verse.

**Out of scope**
- Backend storage (no DynamoDB table, no API route, no S3 — everything is static assets + typed data).
- Progress tracking against posters (no `content-progress` records).
- User-uploaded posters or an admin authoring UI.
- Importing all 74 files — duplicate visual variants are intentionally pruned during curation.
- Migrating posters into the existing `CONTENT_LIBRARY` type — they live in a separate `POSTERS` array to keep semantics clean.

## Source material

Folder: `C:\Projects\Vedic_transform\Posters\Posters` — 74 JPEGs (~21 MB), exported from WhatsApp 2026-05-19.

Distinct teaching concepts identified during exploration (each appears in 2-4 visual styles):

| Concept | Notes | Suggested pillar / dosha |
|---|---|---|
| Morning Sandhya / 5-step Morning Routine | Wake Early → Breath → Awareness → Gratitude → Manifestation | morning-initiation, sandhya-meditation |
| Path of Manifestation (6 steps) | Clarity → Visualize → Align → Action → Surrender → Gratitude | divine-manifestation |
| 5 Principles of Manifestation | Stillness, Sankalpa, Dharana, Non-attachment, Samskara | divine-manifestation |
| Manifestation Secrets by Patanjali | 8-section deep dive | divine-manifestation |
| Step-by-Step Healing / Get Rid of Disease | Multi-section healing guide | healing-meditation |
| Gratitude (multiple variants) | Yogic Way / Path / Way of Life | gratitude |
| Nutrition & Fasting | Sun's window, 80% rule, Sattvic food | nutrition-fasting |
| Vata Balancing Yoga | 10 asanas | dosha=vata |
| Pitta Balancing Yoga | 5 asanas | dosha=pitta |
| Pranayama for Vata / Pitta / Kapha | One per dosha | dosha=vata/pitta/kapha |
| Mind Purification | 5 steps: positive inputs, mental nutrition, avoid tamasic, boundaries, high-vibration | thoughts-intention |

Final curated count: approximately 11 posters. Exact list confirmed during Phase 1.

## Architecture

### Pipeline

```
Posters/Posters (74 raw JPEGs, outside git)
   │
   ▼
[1] Curate (manual) ──► 11 finalists chosen, one per concept
   │
   ▼
[2] Asset build script ─► scripts/build-poster-assets.mjs
   │                       sharp() → WebP, 3 sizes per poster
   ▼
public/posters/<slug>.webp
public/posters/<slug>@2x.webp
public/posters/<slug>.thumb.webp
   │
   ▼
[3] Manual OCR via Claude Code Read tool
   │                       extract title, sections, scripture, dosha, pillar
   ▼
[4] src/data/posters.ts (typed, hand-cleaned)
docs/posters-ocr-log.md (audit trail: filename → extracted JSON)
   │
   ▼
[5] Rendering surfaces:
       (a) /pillars/[pillarId]
       (b) /posters (new gallery)
       (c) /dosha-assessment + /dosha-test result pages
```

### Data model

`src/data/posters.ts`:

```ts
export type DoshaTag = "vata" | "pitta" | "kapha";
export type PosterCategory = "body" | "mind" | "spirit";
export type PosterKind = "yoga" | "pranayama" | "general";

export interface PosterScripture {
  sutra: string;          // e.g. "Yoga Sutra 2.42"
  sanskrit?: string;      // Devanagari or IAST
  translation: string;
}

export interface PosterSection {
  number?: number;
  title: string;
  body: string;
  bullets?: string[];
}

export interface Poster {
  slug: string;                 // url-safe, unique
  title: string;
  concept: string;              // short concept tag for grouping
  pillarSlug?: string;          // matches src/constants/pillars.ts
  dosha?: DoshaTag;             // set only for dosha-specific posters
  kind: PosterKind;             // "yoga" / "pranayama" for dosha posters, "general" otherwise
  category: PosterCategory;
  image: { src: string; width: number; height: number; alt: string };
  scripture: PosterScripture[];
  sections: PosterSection[];
  tagline?: string;
}

export const POSTERS: Poster[];
export function getPostersByPillar(slug: string): Poster[];
export function getPosterByDosha(dosha: DoshaTag, kind: PosterKind): Poster | undefined;
```

Notes:
- `pillarSlug` reuses canonical slugs from `src/constants/pillars.ts`. No new vocabulary.
- `dosha` is set only on the Vata/Pitta/Kapha yoga & pranayama posters — the dosha-result page filters on it.
- `sections` captures structured OCR so the gallery modal can render selectable, accessible HTML alongside the image.
- `image.alt` holds a one-sentence description so screen readers get more than the filename.

### Asset pipeline

`scripts/build-poster-assets.mjs`:

- Inputs: a manifest at `scripts/poster-manifest.json` mapping `source-filename → { slug, concept, suggestedPillarSlug, suggestedDosha, suggestedKind }`.
- For each entry, uses `sharp` to produce:
  - `<slug>.webp` — max-width 768, quality 82
  - `<slug>@2x.webp` — max-width 1536, quality 82
  - `<slug>.thumb.webp` — max-width 400, quality 80
- Writes a sidecar `<slug>.json` containing `{ width, height }` for the schema.
- Idempotent — re-runs skip files that already exist unless `--force` is passed.

`sharp` added as a `devDependency` only (build-time tool, not shipped).

Originals (`Posters/Posters/*.jpeg`) remain in the working tree but are excluded via `.gitignore`. The `Posters.zip` archive is also gitignored.

### Manual OCR flow

For each curated poster:

1. Claude Code reads the image via the Read tool (vision-capable).
2. Extracts structured data into a JSON object matching the `Poster` schema.
3. Appends the object to `POSTERS[]` in `src/data/posters.ts` (typed, hand-cleaned).
4. Records the extraction in `docs/posters-ocr-log.md` (source filename → final JSON).
5. Done in batches of 3-4 posters per turn so user can spot-check before continuing.

No API key, no script, no API costs. Pillar/dosha classification is settled in conversation, not by a model guess.

### Rendering surfaces

**a) Pillar pages (`src/app/(main)/pillars/[pillarId]/page.tsx`)**
- New `<PosterSection>` component rendered below the existing pillar hero, above the daily-practice list.
- Reads `getPostersByPillar(slug)`. Typically 1, occasionally 2.
- Renders: `next/image` thumbnail, headline title, scripture quote block, "Open full poster" button → modal showing `@2x` image.
- Pillars covered in v1: morning-initiation, sandhya-meditation, nutrition-fasting, thoughts-intention, breathing-meditation, healing-meditation, gratitude, divine-manifestation.

**b) Gallery (`src/app/(main)/posters/`)**
- New route: `page.tsx` (server) + `posters-gallery.tsx` (client).
- Filter pattern lifted directly from `library-client.tsx`: category tabs (all / body / mind / spirit) + search input matching title + section bodies + scripture text.
- Grid of `poster-card.tsx` thumbnails. Click opens `poster-modal.tsx` with the `@2x` image and structured sections rendered as native HTML beside it (selectable text, screen-reader accessible, indexed).
- Sidebar nav entry added alongside Library + Wisdom.

**c) Dosha results (`src/app/(main)/dosha-assessment/` + `src/app/(public)/dosha-test/`)**
- After scoring, the result page calls `getPosterByDosha(dominant, "yoga")` and `getPosterByDosha(dominant, "pranayama")`.
- Renders two poster cards under the existing result block: "Your dosha's balancing yoga" and "Your dosha's pranayama". Same `<PosterSection>` component as the pillar pages.

**d) Daily-wisdom extension (`src/lib/wisdom.ts`)**
- New function `getTodaysPosterScripture()`: pulls one `PosterScripture` from a deterministic day-of-year rotation across all `POSTERS[].scripture` entries.
- Dashboard wisdom popup gets a "View full poster" link when today's scripture is sourced from a poster.

### Components introduced

- `src/components/features/posters/poster-section.tsx` — surfaces a + c.
- `src/components/features/posters/poster-card.tsx` — gallery grid item.
- `src/components/features/posters/poster-modal.tsx` — full-size view with structured text.

No changes to existing components other than adding `<PosterSection>` mounts in the two host pages and one nav entry.

## Build sequence

| Phase | Scope | User-visible change |
|---|---|---|
| 1 | sharp dep, asset script, curation list, empty `posters.ts` + helpers, `.gitignore` rule, audit log file | None |
| 2 | Manual OCR fills `POSTERS[]` | None |
| 3 | Pillar surface: `<PosterSection>` + modal wired into `pillars/[pillarId]` | Pillar pages gain a flagship visual + scripture |
| 4 | Gallery: `/posters` route + filter UI + nav entry | New gallery route live |
| 5 | Dosha result injection + wisdom rotation extension | Dosha result page shows dosha-matched posters; wisdom popup occasionally surfaces a poster verse |

Each phase ships as its own PR and reverts cleanly.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Manual OCR introduces transcription errors | Audit log records source → output; spot-check after each batch; sections are hand-cleaned before commit |
| Sanskrit transliteration inconsistent | Standardise on IAST (already the convention in `daily-wisdom.ts`); Devanagari preserved verbatim when present |
| Image weight slows pillar pages | `next/image` + WebP at 3 sizes; thumbnail used by gallery grid; full size only on modal open |
| Curated set misses a concept the user wanted | Curation list reviewed in Phase 1 before any OCR; trivial to add a 12th poster later |
| `public/` grows over time if posters expand | Acceptable up to ~50 posters / 25 MB. Migration path to S3 documented but not built |

## Non-goals (explicit)

- No backend persistence — posters are static content baked into the build.
- No "favourite poster" / "share poster" / "download as PDF" features in v1.
- No automated re-OCR pipeline. If posters are updated, a developer re-runs the manual OCR flow.
- No mobile-app integration in v1 (the `mobile/` Expo app is unchanged).
