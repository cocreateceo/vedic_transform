# Training Media (Images + Ambient Video) — Design Spec

**Date:** 2026-07-09
**Status:** Approved (user: "run it all" — generate, curate, integrate, verify, deploy)
**Depends on:** 2026-07-09-training-course-design.md (shipped)

## Goal

Add brand-consistent imagery and ambient video to the Training course pages, generated with the existing in-house pipeline (`C:\Projects\shared_visual` `visual_assets.get_visual`, SDXL-Turbo local, `style="cinematic"`).

## Assets

- **12 chapter heroes** (one per chapter incl. coming-soon), generated 1920×1080 → served as WebP ≲150KB.
- **9 section-art images** (published chapters × Exercises/Reflections/Summary cards), card-sized WebP ≲60KB.
- **3 ambient MP4 loops** already in repo `assets/Videos/` (oil lamp ~2.7MB, copper vessel ×2 ~2.4–3MB) — copied as-is.
- Prompt style: saffron/gold Vedic palette, cinematic, no text in image, no other-faith imagery (per transform_youtube `docs/superpowers/specs/2026-05-29-image-sourcing-policy.md`).
- Curation gate: every generated image is visually reviewed; duds regenerated before integration.

## Placement

- Files: `public/training-media/` (NOT `public/training/` — CloudFront S3 route-collision rule). Names: `hero-<slug>.webp`, `<slug>-exercises.webp`, `<slug>-reflections.webp`, `<slug>-summary.webp`, `ambient-diya.mp4`, `ambient-copper-1.mp4`, `ambient-copper-2.mp4`.
- **Data:** `TrainingChapter` gains `image: string` (required for all 12) and `sectionArt?: { exercises?: string; reflections?: string; summary?: string }`. Integrity test updated: every chapter has `image`; published chapters have full `sectionArt`.
- **/training landing:** hero card gets a muted ambient video loop background (poster = Introduction hero, gradient overlay for legibility); each chapter card shows its hero thumbnail (coming-soon dimmed).
- **/training/[slug] reader:** hero banner below header with warm gradient overlay; section art on Exercises/Reflections/Summary cards; Introduction header also gets the diya ambient loop.
- **/10x-vedic public page:** hero thumbnails in the chapter outline.
- Images via `next/image`; videos `muted loop autoPlay playsInline preload="metadata"` + `poster`, no controls.

## Out of scope

Chapter videos (produced later by the transform_youtube pipeline), section art for coming-soon chapters, YouTube embeds.

## Verification

Vitest (updated data tests), `npm run build`, visual check of the three pages via dev server HTML + image URLs 200, deploy + live URL checks (same as course launch).
