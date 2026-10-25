import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await req.json().catch(() => ({ action: "publish" }));

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
      portfolio.published = true;
      portfolio.publishedAt = new Date().toISOString();
    }

    const updated = await portfolioRepository.save(portfolio);
    return NextResponse.json({
      success: true,
      data: {
        published: updated.published,
        publishedAt: updated.publishedAt,
        slug: updated.slug,
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
