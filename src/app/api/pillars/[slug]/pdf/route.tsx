import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { getPillarBySlug } from "@/constants/pillars";
import { PILLAR_CONTENT } from "@/data/pillar-content";
import { PillarPDFDocument } from "@/components/features/pillars/pillar-pdf-document";

// Streams a branded multi-page PDF for a single pillar. Cached at the
// CDN edge for a day — content changes ship via redeploy.

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  const content = PILLAR_CONTENT[slug];

  if (!pillar || !content) {
    return new NextResponse("Pillar not found", { status: 404 });
  }

  const buffer = await renderToBuffer(
    <PillarPDFDocument pillar={pillar} content={content} />,
  );

  // Build a clean filename: pillar-1-morning-initiation.pdf
  const filename = `pillar-${pillar.id}-${pillar.slug}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
