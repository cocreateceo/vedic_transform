import { Cormorant_Garamond } from "next/font/google";

// Ceremonial display serif for the 10x Vedic training experience.
// Import `introSerif.variable` onto a section root, then apply SERIF_CLASS
// to any heading inside it.
export const introSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-intro-serif",
  display: "swap",
});

// Tailwind arbitrary-property class (no spaces — Tailwind requirement).
export const SERIF_CLASS = "[font-family:var(--font-intro-serif),Georgia,serif]";
