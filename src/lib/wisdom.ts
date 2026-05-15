import { DAILY_WISDOM, type WisdomEntry } from "@/data/daily-wisdom";

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
