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

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (action === "unpublish") {
      const updated = await portfolioRepository.unpublish(id);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Failed to unpublish portfolio" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          published: false,
          publishedAt: null,
          slug: updated.slug,
          publicUrl: null,
          message: "Portfolio has been successfully unpublished. Public access removed.",
        },
      });
    }

    // Publish action:
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

    // Ensure slug is collision-free
    const isAvailable = await portfolioRepository.isSlugAvailable(portfolio.slug, id);
    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: `URL slug "${portfolio.slug}" is already in use by another portfolio. Choose a unique slug.`,
        },
        { status: 409 }
      );
    }

    const updated = await portfolioRepository.publish(id, portfolio);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to complete publishing operation" },
        { status: 500 }
      );
    }

    const publicUrl = updated.customDomain?.status === "active" && updated.customDomain?.domain
      ? `https://${updated.customDomain.domain}`
      : `${appBaseUrl}/p/${updated.slug}`;

    return NextResponse.json({
      success: true,
      data: {
        published: true,
        publishedAt: updated.publishedAt,
        slug: updated.slug,
        title: updated.title,
        publicUrl,
        customDomain: updated.customDomain,
        seo: updated.seo,
        message: `Portfolio published live! Accessible at ${publicUrl}`,
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
