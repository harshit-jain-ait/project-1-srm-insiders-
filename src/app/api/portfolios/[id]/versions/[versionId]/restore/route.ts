import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";
import { restorePortfolioSnapshot } from "@/lib/services/version-history-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await params;
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
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const restored = restorePortfolioSnapshot(id, versionId, effectiveUserId);

    return NextResponse.json({
      success: true,
      message: `Successfully restored portfolio to revision ${restored.revision}.`,
      data: restored,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to restore version";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
