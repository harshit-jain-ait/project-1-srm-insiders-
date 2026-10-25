import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { DomainService } from "@/lib/domains/domain-service";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";
import { canUseCustomDomain } from "@/lib/billing/entitlements";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));
    const action = body.action || "verify";

    const ownership = await portfolioRepository.getOwnership(id);
    if (!ownership) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (!canModifyPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to configure domain for this portfolio" },
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

    // 1. Configure Domain
    if (action === "configure") {
      const effectiveUserId = auth.userId || ownership.userId || "anonymous";
      if (!canUseCustomDomain(effectiveUserId)) {
        return NextResponse.json(
          {
            success: false,
            error: "Custom domains require a Pro subscription.",
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }

      const rawDomain = body.domain;
      const validation = DomainService.validateDomain(rawDomain);
      if (!validation.isValid || !validation.normalizedDomain) {
        return NextResponse.json(
          { success: false, error: validation.error || "Invalid domain name" },
          { status: 400 }
        );
      }

      const domain = validation.normalizedDomain;

      // Check if domain is already claimed by another portfolio
      const isAvailable = await portfolioRepository.isDomainAvailable(domain, id);
      if (!isAvailable) {
        return NextResponse.json(
          {
            success: false,
            error: `Domain "${domain}" is already connected to another portfolio.`,
          },
          { status: 409 }
        );
      }

      const config = DomainService.initializeDomainConfig(domain);
      portfolio.customDomain = config;

      const { portfolio: updated } = await portfolioRepository.save(portfolio);

      return NextResponse.json({
        success: true,
        data: updated.customDomain,
        message: `Domain ${domain} configured. Add the DNS challenge records to complete verification.`,
      });
    }

    // 2. Verify Domain
    if (action === "verify") {
      if (!portfolio.customDomain?.domain || !portfolio.customDomain?.verificationToken) {
        return NextResponse.json(
          {
            success: false,
            error: "No custom domain configured for verification.",
          },
          { status: 400 }
        );
      }

      const verification = await DomainService.verifyDomainDns(
        portfolio.customDomain.domain,
        portfolio.customDomain.verificationToken
      );

      portfolio.customDomain.status = verification.status;
      portfolio.customDomain.lastCheckedAt = new Date().toISOString();
      if (verification.verified) {
        portfolio.customDomain.verifiedAt = verification.verifiedAt || new Date().toISOString();
        portfolio.customDomain.errorMessage = "";
      } else {
        portfolio.customDomain.errorMessage = verification.error || "";
      }

      const { portfolio: updated } = await portfolioRepository.save(portfolio);

      return NextResponse.json({
        success: verification.verified,
        data: updated.customDomain,
        explanation: verification.explanation,
        error: verification.error,
      });
    }

    // 3. Remove Domain
    if (action === "remove") {
      portfolio.customDomain = {
        domain: "",
        status: "none",
        verificationToken: "",
        verifiedAt: null,
        configuredAt: null,
        lastCheckedAt: null,
        errorMessage: "",
      };

      const { portfolio: updated } = await portfolioRepository.save(portfolio);

      return NextResponse.json({
        success: true,
        data: updated.customDomain,
        message: "Custom domain removed successfully.",
      });
    }

    return NextResponse.json(
      { success: false, error: `Unsupported domain action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[API/portfolios/[id]/domain] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal error processing custom domain request." },
      { status: 500 }
    );
  }
}
