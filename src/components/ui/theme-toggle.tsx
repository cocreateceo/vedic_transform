"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sunset } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = getStoredTheme();
    setCurrentTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "sattva"];
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const next = themes[nextIndex];
    setTheme(next);
    setCurrentTheme(next);
  };

  const Icon = currentTheme === "dark" ? Moon : currentTheme === "sattva" ? Sunset : Sun;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-xl hover:bg-[var(--color-card-bg)] transition-colors"
      title={`Theme: ${currentTheme}`}
    >
      <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
    </button>
  );
}
