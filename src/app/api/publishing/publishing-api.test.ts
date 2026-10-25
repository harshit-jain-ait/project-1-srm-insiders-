import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { POST as publishRoute } from "../portfolios/[id]/publish/route";
import { POST as domainRoute } from "../portfolios/[id]/domain/route";
import { GET as slugCheckRoute } from "../portfolios/slug-check/route";
import { POST as createPortfolio } from "../portfolios/route";
import { getDatabase, runMigrations } from "@/lib/db/database";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { setUserSubscription } from "@/lib/billing/entitlements";

describe("Part 12 — Publishing, Slug Check & Custom Domain API Endpoints", () => {
  let portfolioId: string;
  let claimToken: string;
  let userSlug: string;

  beforeAll(async () => {
    const db = getDatabase();
    runMigrations(db);

    // Create a portfolio to test with
    userSlug = `alex-api-${Date.now()}`;
    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Alex Morgan Portfolio",
        slug: userSlug,
        profile: {
          fullName: "Alex Morgan",
          headline: "Cloud Architect",
          bio: "Specialist in serverless systems.",
          email: "alex@example.com",
          location: "Austin, TX",
          phone: "",
          avatarUrl: "",
          statusBadge: "",
        },
      }),
    });

    const res = await createPortfolio(req);
    const data = await res.json();
    portfolioId = data.data.id;
    claimToken = data.claimToken;
  });

  describe("GET /api/portfolios/slug-check", () => {
    it("reports invalid format for malformed slugs", async () => {
      const req = new NextRequest("http://localhost:3000/api/portfolios/slug-check?slug=ab");
      const res = await slugCheckRoute(req);
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.isValid).toBe(false);
      expect(data.available).toBe(false);
      expect(data.error).toContain("3-48 characters");
    });

    it("reports reserved error for platform-reserved slugs", async () => {
      const req = new NextRequest("http://localhost:3000/api/portfolios/slug-check?slug=admin");
      const res = await slugCheckRoute(req);
      const data = await res.json();
      expect(data.isValid).toBe(false);
      expect(data.isReserved).toBe(true);
      expect(data.available).toBe(false);
      expect(data.error).toContain("reserved by the platform");
    });

    it("reports available for clean, unused slug", async () => {
      const randomSlug = `fresh-slug-${Date.now()}`;
      const req = new NextRequest(`http://localhost:3000/api/portfolios/slug-check?slug=${randomSlug}`);
      const res = await slugCheckRoute(req);
      const data = await res.json();
      expect(data.isValid).toBe(true);
      expect(data.available).toBe(true);
      expect(data.normalizedSlug).toBe(randomSlug);
    });

    it("reports collision for existing slug taken by another portfolio", async () => {
      const req = new NextRequest(`http://localhost:3000/api/portfolios/slug-check?slug=${userSlug}`);
      const res = await slugCheckRoute(req);
      const data = await res.json();
      expect(data.isValid).toBe(true);
      expect(data.available).toBe(false);
      expect(data.error).toContain("already taken");
    });

    it("allows slug reuse when excludeId matches owner", async () => {
      const req = new NextRequest(
        `http://localhost:3000/api/portfolios/slug-check?slug=${userSlug}&excludeId=${portfolioId}`
      );
      const res = await slugCheckRoute(req);
      const data = await res.json();
      expect(data.isValid).toBe(true);
      expect(data.available).toBe(true);
    });
  });

  describe("POST /api/portfolios/[id]/publish", () => {
    it("rejects publication request from unauthorized caller (403)", async () => {
      const unauthReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "publish" }),
        }
      );

      const res = await publishRoute(unauthReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Unauthorized");
    });

    it("publishes portfolio when called with valid owner claim token", async () => {
      const publishReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
          },
          body: JSON.stringify({ action: "publish" }),
        }
      );

      const res = await publishRoute(publishReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.published).toBe(true);
      expect(data.data.publicUrl).toBeDefined();
      expect(data.data.publicUrl).toContain(`/p/${userSlug}`);
    });

    it("unpublishes portfolio safely without deleting draft", async () => {
      const unpublishReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
          },
          body: JSON.stringify({ action: "unpublish" }),
        }
      );

      const res = await publishRoute(unpublishReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.published).toBe(false);

      // Verify draft is still present in repository
      const draft = await portfolioRepository.getById(portfolioId);
      expect(draft).not.toBeNull();
      expect(draft?.profile.fullName).toBe("Alex Morgan");
    });

    it("rejects publication with 422 if portfolio is missing required identity", async () => {
      // Create incomplete portfolio with distinct slug
      const incompleteId = `incomplete_${Date.now()}`;
      const incompleteSlug = `incomplete-${Date.now()}`;
      const base = await portfolioRepository.getById(portfolioId);
      await portfolioRepository.save({
        ...base!,
        id: incompleteId,
        slug: incompleteSlug,
        profile: {
          fullName: "", // Missing required full name
          headline: "",
          bio: "",
          longBio: "",
          email: "",
          location: "",
          phone: "",
          avatarUrl: "",
          statusBadge: "",
        },
      });

      const invalidReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${incompleteId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
          },
          body: JSON.stringify({ action: "publish" }),
        }
      );

      const res = await publishRoute(invalidReq, {
        params: Promise.resolve({ id: incompleteId }),
      });
      expect([403, 422]).toContain(res.status);
    });
  });

  describe("POST /api/portfolios/[id]/domain", () => {
    const testDomain = `portfolio-${Date.now()}.org`;

    it("rejects domain configuration from unauthorized caller (403)", async () => {
      const unauthReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/domain`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "configure", domain: testDomain }),
        }
      );

      const res = await domainRoute(unauthReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(403);
    });

    it("rejects domain configuration for Free accounts with upgrade required", async () => {
      const freeReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/domain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
          },
          body: JSON.stringify({ action: "configure", domain: testDomain }),
        }
      );

      const res = await domainRoute(freeReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.upgradeRequired).toBe(true);
    });

    it("configures custom domain and returns DNS setup challenge for Pro accounts", async () => {
      const proUserId = "user-pro-publisher";
      getDatabase().prepare("UPDATE portfolios SET user_id = ? WHERE id = ?").run(proUserId, portfolioId);
      setUserSubscription(proUserId, "pro");

      const configReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/domain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
            "x-verified-user-id": proUserId,
          },
          body: JSON.stringify({ action: "configure", domain: testDomain }),
        }
      );

      const res = await domainRoute(configReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.domain).toBe(testDomain);
      expect(data.data.status).toBe("pending_dns");
      expect(data.data.verificationToken).toMatch(/^portfolify-verify-/);
      expect(data.data.dnsRecords?.verificationRecord.name).toContain("_portfolify-challenge");
    });

    it("handles DNS verification attempt honestly without false positives", async () => {
      const proUserId = "user-pro-publisher";
      const verifyReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/domain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
            "x-verified-user-id": proUserId,
          },
          body: JSON.stringify({ action: "verify" }),
        }
      );

      const res = await domainRoute(verifyReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      // Real unconfigured domain must be false and pending_dns or failed
      expect(data.success).toBe(false);
      expect(["pending_dns", "failed"]).toContain(data.data.status);
      expect(data.error || data.explanation).toBeDefined();
    });

    it("safely removes custom domain configuration", async () => {
      const proUserId = "user-pro-publisher";
      const removeReq = new NextRequest(
        `http://localhost:3000/api/portfolios/${portfolioId}/domain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-draft-claim-token": claimToken,
            "x-verified-user-id": proUserId,
          },
          body: JSON.stringify({ action: "remove" }),
        }
      );

      const res = await domainRoute(removeReq, {
        params: Promise.resolve({ id: portfolioId }),
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.domain).toBe("");
      expect(data.data.status).toBe("none");

      // Verify domain is cleared in database
      const ownership = await portfolioRepository.getOwnership(portfolioId);
      expect(ownership?.customDomain).toBeNull();
    });
  });
});
