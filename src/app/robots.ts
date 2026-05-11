import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://d1wkrhl40vhx82.cloudfront.net";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // App-internal route groups. They aren't linked publicly, but
        // guard against speculative crawlers and prevent indexing of
        // login / dashboard shells.
        disallow: [
          "/dashboard",
          "/pillars",
          "/journal",
          "/goals",
          "/progress",
          "/reports",
          "/mood",
          "/insights",
          "/library",
          "/sessions",
          "/reminders",
          "/settings",
          "/achievements",
          "/wisdom",
          "/dosha-assessment",
          "/login",
          "/register",
          "/onboarding",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
