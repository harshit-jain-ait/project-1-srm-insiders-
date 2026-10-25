import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";
import { getPortfolioAnalytics } from "@/lib/analytics/analytics-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthContext(req);

    const ownership = await portfolioRepository.getOwnership(id);
    if (!ownership) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (!canModifyPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to access portfolio analytics" },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const rawRange = searchParams.get("range") || "7d";
    const range: "7d" | "30d" | "90d" =
      rawRange === "90d" ? "90d" : rawRange === "30d" ? "30d" : "7d";

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const analytics = getPortfolioAnalytics(id, effectiveUserId, range);

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load analytics";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
