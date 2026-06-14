import { ImageResponse } from "next/og";

// Generalized branded 1200x630 share card, query-driven so any milestone can
// reuse it without a new route:
//   /api/og/share?big=21&label=Day+Streak&sub=10X+Vedic+Transform
//   /api/og/share?big=Day+30&label=of+48+complete
// Linked from the public /share landing page's OpenGraph meta so pasted
// links unfurl with a real image instead of a bare text link.

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const big = (searchParams.get("big") || "48").slice(0, 24);
  const label = (searchParams.get("label") || "Day Journey").slice(0, 48);
  const sub = (
    searchParams.get("sub") || "My 48-day Vedic transformation"
  ).slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f0d08 0%, #1a1508 55%, #2a1a08 100%)",
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

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", fontSize: 200, fontWeight: 800, lineHeight: 1, color: "#fbbf24" }}>
            {big}
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
            {label}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#cbd5e1", marginTop: 12 }}>
            {sub}
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
          <div style={{ display: "flex" }}>Begin your own 48-day journey</div>
          <div style={{ display: "flex", color: "#fbbf24", fontWeight: 600 }}>
            10x.vedics.net
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
