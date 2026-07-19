import { Suspense } from "react";
import { BlogPageClient } from "./blog-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog — Vedic Wisdom & Insights",
  description:
    "Articles on the 48-day Vedic transformation: pillars, dosha types, breathwork, meditation, gratitude, sleep, and the science behind ancient practices.",
  path: "/blog",
});

export default function BlogPage() {
  // Suspense boundary required: BlogPageClient reads useSearchParams()
  // for /blog?tag=... deep links from the intention cards.
  return (
    <Suspense>
      <BlogPageClient />
    </Suspense>
  );
}
