"use client";

const THEME_KEY = "vedic-theme";

export type Theme = "light" | "dark" | "sattva";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as Theme) || "light";
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function shouldAutoSattva(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 5;
}
