import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { getAuthContext } from "@/lib/auth/auth-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthContext(req);

    if (!auth.isAuthenticated || !auth.userId) {
      return NextResponse.json(
        { success: false, error: "Must be signed in to claim a draft portfolio" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const claimToken = body.claimToken || req.headers.get("x-draft-claim-token");

    if (!claimToken) {
      return NextResponse.json(
        { success: false, error: "Claim token is required" },
        { status: 400 }
      );
    }

    const claimed = await portfolioRepository.claimDraft(id, claimToken, auth.userId);

    if (!claimed) {
      return NextResponse.json(
        { success: false, error: "Invalid claim token or portfolio cannot be claimed" },
        { status: 403 }
      );
    }

    const updated = await portfolioRepository.getById(id);

    return NextResponse.json({
      success: true,
      message: "Portfolio successfully claimed and bound to your account",
      data: updated,
    });
  } catch (error) {
    console.error("[API/portfolios/[id]/claim] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during draft claim" },
      { status: 500 }
    );
  }
}
