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
