import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "anonymous";
    const portfolios = await portfolioRepository.listByUser(userId);
    return NextResponse.json({ success: true, data: portfolios });
  } catch (error) {
    console.error("[API/portfolios] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve portfolios" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Create clean portfolio instance
    const base = createEmptyPortfolio(body);
    const saved = await portfolioRepository.save(base);

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error("[API/portfolios] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid portfolio payload or server error" },
      { status: 400 }
    );
  }
}
