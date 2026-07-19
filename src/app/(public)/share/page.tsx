import type { Metadata } from "next";
import Link from "next/link";
import { SERIF_CLASS } from "@/lib/fonts";

// Public, crawlable landing for a shared milestone. The ShareButton points
// here (e.g. /share?big=21&label=Day+Streak) so the link unfurls with a real
// OG image and gives visitors a "start your own journey" CTA — closing the
// organic-acquisition loop.

type SP = { big?: string; label?: string; sub?: string };

function ogUrl(sp: SP): string {
  const p = new URLSearchParams();
  if (sp.big) p.set("big", sp.big);
  if (sp.label) p.set("label", sp.label);
  if (sp.sub) p.set("sub", sp.sub);
  return `/api/og/share?${p.toString()}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const big = sp.big || "48";
  const label = sp.label || "Day Journey";
  const title = `${big} ${label} — 10X Vedic Transform`;
  const description =
    sp.sub || "A 48-day Vedic transformation for body, mind, and spirit.";
  const image = ogUrl(sp);
  return {
    title,
    description,
    alternates: { canonical: "/share" },
    openGraph: {
      title,
      description,
      url: "/share",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const big = sp.big || "48";
  const label = sp.label || "Day Journey";
  const sub = sp.sub || "A 48-day Vedic transformation";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8860D]">
        10X VEDIC TRANSFORM
      </div>
      <div className={`mt-6 text-7xl font-semibold text-[#E8860D] sm:text-8xl ${SERIF_CLASS}`}>
        {big}
      </div>
      <div className="mt-1 text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
        {label}
      </div>
      <p className="mt-3 text-[#64748b]">{sub}</p>

      <div className="mt-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-8">
        <h1 className={`text-2xl font-semibold text-[#1a1a1a] ${SERIF_CLASS}`}>
          Begin your own 48-day journey
        </h1>
        <p className="mt-2 text-[#64748b]">
          11 Vedic pillars for body, mind &amp; spirit. Free to start — discover
          your dosha and take day one today.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-amber-600 hover:to-orange-600"
          >
            Start free
          </Link>
          <Link
            href="/dosha-test"
            className="rounded-xl border border-[#FF9933]/40 px-6 py-3 font-semibold text-[#E8860D] transition hover:bg-[#FFF9F0] hover:text-[#FF9933]"
          >
            Take the free dosha test
          </Link>
        </div>
      </div>
    </main>
  );
}
