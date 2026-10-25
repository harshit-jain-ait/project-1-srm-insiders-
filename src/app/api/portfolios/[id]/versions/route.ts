import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";
import {
  listPortfolioSnapshots,
  createPortfolioSnapshot,
} from "@/lib/services/version-history-service";

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
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const snapshots = listPortfolioSnapshots(id, effectiveUserId);

    return NextResponse.json({
      success: true,
      data: snapshots,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load versions";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
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
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const label = body.label?.trim() || "Manual Snapshot";

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const snapshot = createPortfolioSnapshot(id, effectiveUserId, "manual", label);

    if (!snapshot) {
      return NextResponse.json({
        success: true,
        message: "No changes detected since last saved version.",
        snapshot: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: snapshot,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create version";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
