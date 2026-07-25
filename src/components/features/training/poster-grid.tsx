// Teaching-poster grid shared by the Introduction and chapter experiences —
// dark tiles, caption bar, tap-to-open full size. Server component.

import Image from "next/image";
import { SERIF_CLASS } from "@/lib/fonts";
import { FadeUp, Stagger, StaggerItem } from "./intro/reveal";

/** Compact art strip woven inline after the prose it illustrates. */
export function InlineArt({
  items,
}: {
  items: { src: string; title: string }[];
}) {
  if (items.length === 0) return null;
  const colClass =
    items.length === 1
      ? "mx-auto max-w-2xl grid-cols-1"
      : items.length === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : items.length === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-2";
  return (
    <FadeUp className="mx-auto mt-10 max-w-4xl">
      <div className={`grid gap-4 ${colClass}`}>
        {items.map((it) => (
          <a
            key={it.src}
            href={it.src}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl border border-[#DAA520]/30 bg-[#0C0F22] transition-all hover:-translate-y-1 hover:border-[#DAA520] hover:shadow-[0_8px_30px_rgba(218,165,32,0.2)]"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={it.src}
                alt={it.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="px-4 py-2.5 text-center text-[13px] font-medium text-amber-100/90">
              {it.title}
            </p>
          </a>
        ))}
      </div>
    </FadeUp>
  );
}

export function PosterGrid({
  heading,
  subtitle,
  items,
  columns = 3,
}: {
  heading: string;
  subtitle?: string;
  items: { src: string; title: string }[];
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-16 sm:py-20">
      <FadeUp className="mx-auto max-w-[44rem] text-center">
        <h2
          className={`${SERIF_CLASS} text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl`}
        >
          {heading}
        </h2>
        {subtitle && (
          <p className="mt-4 text-[16px] text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
        )}
      </FadeUp>
      <Stagger className={`mt-10 grid gap-4 ${colClass}`}>
        {items.map((it) => (
          <StaggerItem key={it.src}>
            <a
              href={it.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-[#DAA520]/30 bg-[#0C0F22] transition-all hover:-translate-y-1 hover:border-[#DAA520] hover:shadow-[0_8px_30px_rgba(218,165,32,0.2)]"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={it.src}
                  alt={it.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="px-4 py-3 text-center text-[13px] font-medium text-amber-100/90">
                {it.title}
              </p>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
