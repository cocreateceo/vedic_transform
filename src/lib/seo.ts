import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://10x.vedics.net";
export const SITE_NAME = "10X Vedic Transform";

interface PageMetaInput {
  title: string;
  description: string;
  /** Canonical path beginning with "/", e.g. "/about". */
  path: string;
  /** Optional override for the social-card title (defaults to `title`). */
  ogTitle?: string;
  /** Optional absolute/relative OG image URL (defaults to the branded card). */
  ogImage?: string;
}

/** Branded dynamic OG card, reusing the proven /api/og/share route. */
function brandedOgImage(description: string): string {
  const sub = description.slice(0, 80);
  return (
    `${SITE_URL}/api/og/share?big=${encodeURIComponent("10X")}` +
    `&label=${encodeURIComponent("Vedic Transform")}` +
    `&sub=${encodeURIComponent(sub)}`
  );
}

/**
 * Builds a complete Next.js Metadata object for a public marketing page:
 * canonical URL, OpenGraph, and a Twitter summary_large_image card. Centralizes
 * AQ2 so each page is a one-liner and every pasted link unfurls with a real
 * image instead of a bare text link. Canonical is relative — Next resolves it
 * against `metadataBase` (set in the root layout).
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogImage,
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const image = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : brandedOgImage(description);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: ogTitle ?? title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description,
      images: [image],
    },
  };
}

/** schema.org Article JSON-LD for a single blog post. */
export function articleLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icons/icon-192.png`,
      },
    },
    image: [`${SITE_URL}/images/pexels/blog-${post.category}.jpg`],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}/`,
    },
  };
}
