import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { PortfolioDataSchema } from "@/lib/schema/portfolio";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const body = await req.json();

    const existing = await portfolioRepository.getById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Server-side strict schema validation
    const parsed = PortfolioDataSchema.parse({
      ...body,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    });

    const updated = await portfolioRepository.save(parsed);
    return NextResponse.json({ success: true, data: updated });
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
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
