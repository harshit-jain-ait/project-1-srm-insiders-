import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { validatePublishReadiness } from "@/lib/schema/portfolio";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthContext(req);
    const { action } = await req.json().catch(() => ({ action: "publish" }));

    const ownership = await portfolioRepository.getOwnership(id);
    if (!ownership) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Enforce publication authorization
    if (!canModifyPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to change publication status" },
        { status: 403 }
      );
    }

    const portfolio = await portfolioRepository.getById(id);
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (action === "unpublish") {
      portfolio.published = false;
      portfolio.publishedAt = null;
    } else {
      const readiness = validatePublishReadiness(portfolio);
      if (!readiness.isReady) {
        return NextResponse.json(
          {
            success: false,
            error: readiness.errors[0] || "Portfolio is not ready for publication",
            details: readiness.errors,
          },
          { status: 422 }
        );
      }
      portfolio.published = true;
      portfolio.publishedAt = new Date().toISOString();
    }

    const { portfolio: updated } = await portfolioRepository.save(portfolio);
    return NextResponse.json({
      success: true,
      data: {
        published: updated.published,
        publishedAt: updated.publishedAt,
        slug: updated.slug,
        revision: updated.revision,
      },
    });
  } catch (error) {
    console.error("[API/portfolios/[id]/publish] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update publishing state" },
      { status: 500 }
    );
  }
}
