import type { Metadata } from "next";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  title: "10X Vedic Transform — 48-Day Journey for Body, Mind & Spirit",
  description:
    "Transform in 48 days with 11 daily Vedic pillars — Brahma Muhurta, Pranayama, Sandhya Meditation, gratitude, sleep, and more. Free dosha assessment. Personal AI Vedic Guide.",
  openGraph: {
    title: "10X Vedic Transform — 48-Day Journey",
    description:
      "A 48-day transformation program combining ancient Vedic practices with modern habit-tracking.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
