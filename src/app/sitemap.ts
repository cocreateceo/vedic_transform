import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://10x.vedics.net";

  const staticPages = [
    "", "/about", "/how-it-works", "/pillars-overview",
    "/testimonials", "/blog", "/contact", "/faq", "/privacy", "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
