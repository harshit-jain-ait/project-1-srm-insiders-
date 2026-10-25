import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { GET as listPortfolios, POST as createPortfolio } from "./route";
import {
  GET as getPortfolio,
  PUT as updatePortfolio,
  DELETE as deletePortfolio,
} from "./[id]/route";
import { POST as togglePublish } from "./[id]/publish/route";
import { POST as claimDraft } from "./[id]/claim/route";
import { getDatabase, runMigrations } from "@/lib/db/database";

describe("Portfolios REST API & Persistence Integration", () => {
  let createdPortfolioId: string;
  let createdClaimToken: string;
  let createdSlug: string;

  beforeAll(() => {
    const db = getDatabase();
    runMigrations(db);
  });

  it("POST /api/portfolios creates an anonymous draft and returns claimToken and secure cookie", async () => {
    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "API Integration Portfolio",
      }),
    });

    const res = await createPortfolio(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBeDefined();
    expect(data.data.title).toBe("API Integration Portfolio");
    expect(data.data.published).toBe(false);
    expect(data.data.revision).toBe(1);
    expect(data.claimToken).toBeDefined();

    createdPortfolioId = data.data.id;
    createdClaimToken = data.claimToken;
    createdSlug = data.data.slug;

    // Verify Set-Cookie header is set for claim token
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toContain(`portfolify_draft_claim_${createdPortfolioId}`);
  });

  it("GET /api/portfolios/[id] conceals private draft (404) from unauthorized callers", async () => {
    const unauthorizedReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`
    );
    const res = await getPortfolio(unauthorizedReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });

    // Expect 404 to conceal private draft existence
    expect(res.status).toBe(404);
  });

  it("GET /api/portfolios/[id] allows authorized access with claim token", async () => {
    const authorizedReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`,
      {
        headers: {
          "x-draft-claim-token": createdClaimToken,
        },
      }
    );
    const res = await getPortfolio(authorizedReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(createdPortfolioId);
  });

  it("PUT /api/portfolios/[id] rejects unauthorized writes with 403", async () => {
    const unauthorizedReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Malicious Overwrite",
        }),
      }
    );

    const res = await updatePortfolio(unauthorizedReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(res.status).toBe(403);
  });

  it("PUT /api/portfolios/[id] successfully updates draft with claim token and increments revision", async () => {
    const authorizedReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-draft-claim-token": createdClaimToken,
        },
        body: JSON.stringify({
          title: "Updated Title for API Test",
          slug: createdSlug,
          revision: 1,
          profile: {
            fullName: "Jordan Lee",
            headline: "Senior Cloud Engineer",
            bio: "Building resilient microservices.",
          },
        }),
      }
    );

    const res = await updatePortfolio(authorizedReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.title).toBe("Updated Title for API Test");
    expect(body.data.revision).toBe(2);
    expect(body.data.profile.fullName).toBe("Jordan Lee");
  });

  it("PUT /api/portfolios/[id] detects concurrency conflict (409) when revision is stale", async () => {
    const staleReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-draft-claim-token": createdClaimToken,
        },
        body: JSON.stringify({
          title: "Stale Overwrite Attempt",
          slug: createdSlug,
          revision: 1, // Stale! DB revision is now 2
        }),
      }
    );

    const res = await updatePortfolio(staleReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(res.status).toBe(409);

    const body = await res.json();
    expect(body.code).toBe("CONCURRENCY_CONFLICT");
    expect(body.currentRevision).toBe(2);
  });

  it("POST /api/portfolios/[id]/publish blocks publishing unready portfolios (422)", async () => {
    // Create an incomplete draft to verify 422 Unprocessable Entity response
    const emptyDraftReq = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Incomplete Draft" }),
    });
    const emptyRes = await createPortfolio(emptyDraftReq);
    const emptyData = await emptyRes.json();

    const publishReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${emptyData.data.id}/publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-draft-claim-token": emptyData.claimToken,
        },
        body: JSON.stringify({ action: "publish" }),
      }
    );

    const res = await togglePublish(publishReq, {
      params: Promise.resolve({ id: emptyData.data.id }),
    });
    expect(res.status).toBe(422);

    // Clean up empty draft
    await deletePortfolio(
      new NextRequest("http://localhost:3000", {
        headers: { "x-draft-claim-token": emptyData.claimToken },
      }),
      { params: Promise.resolve({ id: emptyData.data.id }) }
    );
  });

  it("POST /api/portfolios/[id]/publish publishes a fully prepared portfolio", async () => {
    const publishReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}/publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-draft-claim-token": createdClaimToken,
        },
        body: JSON.stringify({ action: "publish" }),
      }
    );

    const res = await togglePublish(publishReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.published).toBe(true);
    expect(body.data.publishedAt).toBeDefined();

    // Now that it's published, GET without credentials must succeed
    const publicReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`
    );
    const pubRes = await getPortfolio(publicReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(pubRes.status).toBe(200);
  });

  it("POST /api/portfolios/[id]/claim claims anonymous draft to authenticated user", async () => {
    const claimReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}/claim`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-verified-user-id": "user_prod_101",
        },
        body: JSON.stringify({
          claimToken: createdClaimToken,
        }),
      }
    );

    const res = await claimDraft(claimReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.userId).toBe("user_prod_101");
  });

  it("GET /api/portfolios lists portfolios belonging to verified user", async () => {
    const userReq = new NextRequest("http://localhost:3000/api/portfolios", {
      headers: {
        "x-verified-user-id": "user_prod_101",
      },
    });

    const res = await listPortfolios(userReq);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data.some((p: { id: string }) => p.id === createdPortfolioId)).toBe(true);
  });

  it("DELETE /api/portfolios/[id] deletes the portfolio when authorized", async () => {
    const deleteReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`,
      {
        method: "DELETE",
        headers: {
          "x-verified-user-id": "user_prod_101",
        },
      }
    );

    const res = await deletePortfolio(deleteReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(res.status).toBe(200);

    // Confirm it's gone
    const checkReq = new NextRequest(
      `http://localhost:3000/api/portfolios/${createdPortfolioId}`
    );
    const checkRes = await getPortfolio(checkReq, {
      params: Promise.resolve({ id: createdPortfolioId }),
    });
    expect(checkRes.status).toBe(404);
  });
});
