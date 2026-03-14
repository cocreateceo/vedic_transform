import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/pillars", "/progress", "/journal", "/goals", "/insights", "/reports", "/reminders", "/settings", "/library", "/sessions", "/wisdom", "/mood", "/achievements"],
    },
    sitemap: "https://10x.vedics.net/sitemap.xml",
  };
}
