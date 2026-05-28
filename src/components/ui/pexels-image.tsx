import Image from "next/image";
import manifest from "@/../public/images/pexels/manifest.json";

type PexelsEntry = {
  query: string;
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  pexels_url: string;
  alt: string;
};

const KNOWN: Record<string, PexelsEntry> = manifest as Record<string, PexelsEntry>;

interface PexelsImageProps {
  /** Slug from scripts/pexels-manifest.json */
  slug: string;
  /** Fallback slug (or another Pexels slug) if this one is missing */
  fallbackSlug?: string;
  /** Override the alt text */
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  /**
   * Omit the attribution figcaption entirely. Use only when the image sits
   * inside an outer <a>/Link (nested anchors are invalid HTML and break
   * hydration) AND attribution is provided elsewhere on the page to satisfy
   * Pexels TOS.
   */
  noAttribution?: boolean;
}

/**
 * Renders a Pexels-sourced image that was pre-downloaded into
 * public/images/pexels/ by scripts/pexels-fetch.mjs. Adds the required
 * photographer attribution as a small caption.
 *
 * Falls back gracefully if the slug is missing from the manifest — useful
 * during development before the fetch script has been run.
 */
export function PexelsImage({
  slug,
  fallbackSlug,
  alt,
  className = "",
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  width,
  height,
  noAttribution = false,
}: PexelsImageProps) {
  const entry = KNOWN[slug] ?? (fallbackSlug ? KNOWN[fallbackSlug] : undefined);
  if (!entry) {
    // Manifest entry missing — render a soft placeholder so layout doesn't
    // collapse. Devs see the slug so they know what to add to the manifest.
    return (
      <div className={`bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center text-xs text-orange-700 ${className}`}>
        Missing image: {slug}
      </div>
    );
  }
  const resolvedSlug = KNOWN[slug] ? slug : fallbackSlug!;
  const img = (
    <Image
      src={`/images/pexels/${resolvedSlug}.jpg`}
      alt={alt ?? entry.alt}
      width={width ?? entry.width}
      height={height ?? entry.height}
      sizes={sizes}
      priority={priority}
      className="w-full h-full object-cover rounded-xl"
    />
  );
  if (noAttribution) {
    return <div className={className}>{img}</div>;
  }
  return (
    <figure className={className}>
      {img}
      <figcaption className="text-[10px] text-gray-400 mt-1 text-right">
        Photo by{" "}
        <a href={entry.photographer_url} target="_blank" rel="noreferrer" className="underline">
          {entry.photographer}
        </a>{" "}
        on{" "}
        <a href={entry.pexels_url} target="_blank" rel="noreferrer" className="underline">
          Pexels
        </a>
      </figcaption>
    </figure>
  );
}
