import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio, PortfolioDataSchema } from "@/lib/schema/portfolio";
import {
  getAuthContext,
  generateClaimToken,
  hashClaimToken,
  canModifyPortfolio,
} from "@/lib/auth/auth-service";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);

    // 1. Authenticated user: retrieve their portfolios
    if (auth.isAuthenticated && auth.userId) {
      const portfolios = await portfolioRepository.listByUser(auth.userId);
      return NextResponse.json({ success: true, data: portfolios });
    }

    // 2. Anonymous session with claim tokens: return only their claimed drafts
    if (auth.claimTokens.length > 0) {
      const anonymousPortfolios = await portfolioRepository.listByUser("anonymous");
      const matched = [];

      for (const p of anonymousPortfolios) {
        const ownership = await portfolioRepository.getOwnership(p.id);
        if (ownership && canModifyPortfolio(ownership, auth)) {
          matched.push(p);
        }
      }

      return NextResponse.json({ success: true, data: matched });
    }

    // 3. Unauthenticated without claims
    return NextResponse.json({ success: true, data: [] });
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
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    // Check if this is an update to an existing portfolio
    if (body.id) {
      const existingOwnership = await portfolioRepository.getOwnership(body.id);
      if (existingOwnership) {
        // Enforce ownership check on existing records
        if (!canModifyPortfolio(existingOwnership, auth)) {
          return NextResponse.json(
            { success: false, error: "Unauthorized to update this portfolio" },
            { status: 403 }
          );
        }

        // Validate schema
        const validated = PortfolioDataSchema.parse({
          ...body,
          id: body.id,
          userId: existingOwnership.userId,
        });

        const expectedRevision =
          typeof body.revision === "number" ? body.revision : existingOwnership.revision;
        const result = await portfolioRepository.save(validated, { expectedRevision });

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

        return NextResponse.json({ success: true, data: result.portfolio }, { status: 200 });
      }
    }

    // Creating a brand new portfolio
    let assignedUserId = "anonymous";
    let claimToken: string | null = null;
    let claimTokenHash: string | null = null;

    if (auth.isAuthenticated && auth.userId) {
      assignedUserId = auth.userId;
    } else {
      // Secure anonymous draft creation with cryptographic claim token
      claimToken = generateClaimToken();
      claimTokenHash = hashClaimToken(claimToken);
    }

    // Initialize clean validated portfolio structure
    const base = createEmptyPortfolio({
      ...body,
      userId: assignedUserId,
      published: false, // Initial creation is always a private draft
    });

    const result = await portfolioRepository.save(base, { claimTokenHash });

    const response = NextResponse.json(
      {
        success: true,
        data: result.portfolio,
        claimToken: claimToken || undefined,
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookie for anonymous draft claim
    if (claimToken) {
      response.cookies.set(`portfolify_draft_claim_${result.portfolio.id}`, claimToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error: unknown) {
    console.error("[API/portfolios] POST error:", error);
    const details = error instanceof Error ? error.message : "Validation error";
    return NextResponse.json(
      { success: false, error: "Invalid portfolio payload", details },
      { status: 400 }
    );
  }
}
