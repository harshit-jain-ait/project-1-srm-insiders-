import { NextRequest, NextResponse } from "next/server";
import { recordPortfolioEvent } from "@/lib/analytics/analytics-service";

export async function POST(req: NextRequest) {
  try {
    const isPreview =
      req.headers.get("x-portfolify-preview") === "true" ||
      req.headers.get("x-preview") === "true";

    const body = await req.json().catch(() => ({}));
    const portfolioId = body.portfolioId;
    const path = body.path || "/";
    const eventType = body.eventType || "page_view";
    const referrer = body.referrer || req.headers.get("referer") || "";

    const userAgent = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!portfolioId) {
      return NextResponse.json(
        { success: false, error: "Missing portfolioId" },
        { status: 400 }
      );
    }

    const result = recordPortfolioEvent({
      portfolioId,
      path,
      eventType,
      referrer,
      userAgent,
      ip,
      isPreview,
    });

    return NextResponse.json({
      success: true,
      recorded: result.recorded,
      reason: result.reason,
    });
  } catch (err) {
    console.error("[Analytics Collect Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal analytics error" },
      { status: 500 }
    );
  }
}
