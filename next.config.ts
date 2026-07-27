import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `output: "export"` — we run under SST's Nextjs construct (OpenNext on
  // CloudFront), which gives us SSR for public pages so the (public) route
  // group is actually crawlable. Auth-gated pages still effectively render
  // client-side because their layouts are "use client".
  images: {
    // next/image optimization runs as a Lambda. Keep external sources
    // explicit so they don't get blocked.
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" }, // library video thumbnails
    ],
  },
  // Preserve the existing URL shape so inbound links / external citations
  // don't 301-flip.
  trailingSlash: true,
  async redirects() {
    return [
      // /register previously client-redirected to the login signup tab,
      // which left crawlers and no-JS agents staring at an empty shell.
      // Redirect at the HTTP layer instead so the URL stays shareable.
      {
        source: "/register",
        destination: "/login/?tab=signup",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
