import { ImageResponse } from "next/og";
import { DOSHA_INFO, type DoshaName } from "@/lib/dosha";

// Branded 1200x630 share card for a public dosha-test result. Linked
// from /dosha-test/result/[id]'s OpenGraph + Twitter meta tags so
// pasted URLs unfurl with the user's actual dosha (not a generic image).

export const runtime = "nodejs";

interface AnonymousDoshaResult {
  primary: DoshaName;
  secondary: DoshaName;
  percentages: { vata: number; pitta: number; kapha: number };
}

async function fetchResult(id: string): Promise<AnonymousDoshaResult | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(
      `${apiUrl}/data/dosha-test/anonymous?id=${encodeURIComponent(id)}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as AnonymousDoshaResult;
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await fetchResult(id);

  // Generic fallback if the result is missing — still better than no image.
  const primaryName = result ? DOSHA_INFO[result.primary].name : "Your Dosha";
  const secondaryName = result ? DOSHA_INFO[result.secondary].name : "";
  const primaryColor = result ? DOSHA_INFO[result.primary].color : "#FF9933";
  const sanskrit = result ? DOSHA_INFO[result.primary].sanskrit : "वेद";
  const pct = result?.percentages;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f0d08 0%, #1a1508 60%, #2a1a08 100%)",
          color: "white",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
            }}
          />
          <div style={{ fontSize: 24, color: "#fbbf24", letterSpacing: 2 }}>
            10X VEDIC TRANSFORM
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 60 }}>
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}aa)`,
              fontSize: 140,
              fontWeight: 700,
              boxShadow: `0 20px 60px ${primaryColor}55`,
            }}
          >
            {sanskrit}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 36, color: "#fbbf24", letterSpacing: 1 }}>
              I&apos;m a
            </div>
            <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>
              {primaryName}
              {secondaryName && (
                <span style={{ color: "#fbbf24" }}>
                  -{secondaryName}
                </span>
              )}
            </div>
            {pct && (
              <div
                style={{ display: "flex", gap: 24, fontSize: 22, color: "#cbd5e1", marginTop: 8 }}
              >
                <div style={{ display: "flex" }}>Vata {pct.vata}%</div>
                <div style={{ display: "flex" }}>Pitta {pct.pitta}%</div>
                <div style={{ display: "flex" }}>Kapha {pct.kapha}%</div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#94a3b8",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex" }}>
            Take the free 2-minute Vedic dosha test
          </div>
          <div style={{ display: "flex", color: "#fbbf24", fontWeight: 600 }}>
            10xvedictransform.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
