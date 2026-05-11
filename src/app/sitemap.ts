import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blog-posts";

// Public surface only — the (main) and (auth) groups are app-internal and
// explicitly disallowed in robots.ts.
const PUBLIC_PATHS = [
  "",
  "about",
  "blog",
  "contact",
  "faq",
  "how-it-works",
  "pillars-overview",
  "testimonials",
  "privacy",
  "terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://d1wkrhl40vhx82.cloudfront.net";

  const lastModified = new Date();

  const corePages = PUBLIC_PATHS.map((path) => ({
    url: path ? `${baseUrl}/${path}/` : `${baseUrl}/`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...corePages, ...blogPages];
}
