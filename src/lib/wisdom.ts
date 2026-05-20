import { DAILY_WISDOM, type WisdomEntry } from "@/data/daily-wisdom";
import { POSTERS, type Poster, type PosterScripture } from "@/data/posters";

// Day-of-year rotation index shared by the /wisdom page and the dashboard
// popup. Centralised so the two surfaces can't drift apart on what "today's
// wisdom" means.

export function getDayOfYear(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
}

export function getTodayIndex(): number {
  return getDayOfYear() % DAILY_WISDOM.length;
}

export function getTodaysWisdom(): WisdomEntry {
  return DAILY_WISDOM[getTodayIndex()];
}

export interface TodaysPosterScripture {
  poster: Poster;
  scripture: PosterScripture;
}

// Day-of-year rotation across every scripture verse extracted from a
// poster. Returns null when no posters carry any scripture entries —
// defensive so the helper can be used safely while POSTERS is still
// being populated.
export function getTodaysPosterScripture(): TodaysPosterScripture | null {
  const flat: TodaysPosterScripture[] = POSTERS.flatMap((p) =>
    p.scripture.map((s) => ({ poster: p, scripture: s })),
  );
  if (flat.length === 0) return null;
  const index = getDayOfYear() % flat.length;
  return flat[index];
}
