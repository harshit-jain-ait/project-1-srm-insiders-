import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { PortfolioDataSchema } from "@/lib/schema/portfolio";
import { getAuthContext, canReadPortfolio, canModifyPortfolio } from "@/lib/auth/auth-service";

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

    // Conceal private drafts from unauthorized callers
    if (!canReadPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const portfolio = await portfolioRepository.getById(id);
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("[API/portfolios/[id]] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthContext(req);
    const body = await req.json();

    const ownership = await portfolioRepository.getOwnership(id);
    if (!ownership) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Enforce server-side ownership authorization
    if (!canModifyPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to edit this portfolio" },
        { status: 403 }
      );
    }

    const existing = await portfolioRepository.getById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Server-side strict schema validation
    const parsed = PortfolioDataSchema.parse({
      ...existing,
      ...body,
      id,
      userId: ownership.userId, // Prevent client spoofing of owner
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    // Check revision for optimistic concurrency control
    const expectedRevision =
      typeof body.revision === "number" ? body.revision : ownership.revision;

    const result = await portfolioRepository.save(parsed, { expectedRevision });

    if (result.isConflict) {
      return NextResponse.json(
        {
          success: false,
          error: "Conflict: This portfolio was modified elsewhere.",
          code: "CONCURRENCY_CONFLICT",
          currentRevision: result.portfolio.revision,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, data: result.portfolio });
  } catch (error: unknown) {
    console.error("[API/portfolios/[id]] PUT error:", error);
    const details = error instanceof Error ? error.message : "Validation failed";
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
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

    // Enforce deletion authorization
    if (!canModifyPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this portfolio" },
        { status: 403 }
      );
    }

    const deleted = await portfolioRepository.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Portfolio deleted" });
  } catch (error) {
    console.error("[API/portfolios/[id]] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
