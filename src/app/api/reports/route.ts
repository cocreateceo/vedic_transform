import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateJourneyReport, generateCSV } from "@/lib/reports/generator";

// GET - Generate and return report data
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vedic-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    // Generate the report
    const report = await generateJourneyReport(userId);

    if (!report) {
      return NextResponse.json(
        { error: "No journey found. Start your journey to generate reports." },
        { status: 404 }
      );
    }

    // Return based on format
    if (format === "csv") {
      const csv = generateCSV(report);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="vedic-journey-report-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
