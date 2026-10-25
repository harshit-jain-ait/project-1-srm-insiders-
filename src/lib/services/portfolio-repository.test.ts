import { describe, it, expect, beforeAll } from "vitest";
import { portfolioRepository } from "./portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";
import { getDatabase, runMigrations } from "@/lib/db/database";
import { generateClaimToken, hashClaimToken } from "@/lib/auth/auth-service";

describe("Durable Portfolio Persistence & Database Repository", () => {
  const testId = `test_portfolio_${Date.now()}`;
  const testSlug = `test-slug-${Date.now()}`;

  beforeAll(() => {
    // Ensure migrations are initialized
    const db = getDatabase();
    runMigrations(db);
  });

  it("saves and retrieves a portfolio with revision tracking", async () => {
    const fresh = createEmptyPortfolio({
      id: testId,
      slug: testSlug,
      title: "Test Portfolio",
      profile: {
        fullName: "Test User",
        headline: "Test Headline",
        bio: "Test Bio",
        email: "test@example.com",
        location: "NYC",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
    });

    const { portfolio: saved, isConflict } = await portfolioRepository.save(fresh);
    expect(isConflict).toBe(false);
    expect(saved.id).toBe(testId);
    expect(saved.title).toBe("Test Portfolio");
    expect(saved.revision).toBe(1);

    const fetched = await portfolioRepository.getById(testId);
    expect(fetched).not.toBeNull();
    expect(fetched?.profile.fullName).toBe("Test User");
    expect(fetched?.revision).toBe(1);

    const fetchedBySlug = await portfolioRepository.getBySlug(testSlug);
    expect(fetchedBySlug).not.toBeNull();
    expect(fetchedBySlug?.id).toBe(testId);
  });

  it("retrieves lean ownership metadata without serializing full JSON", async () => {
    const ownership = await portfolioRepository.getOwnership(testId);
    expect(ownership).not.toBeNull();
    expect(ownership?.id).toBe(testId);
    expect(ownership?.userId).toBe("anonymous");
    expect(ownership?.revision).toBe(1);
    expect(ownership?.published).toBe(false);
  });

  it("increments revision upon sequential updates", async () => {
    const current = await portfolioRepository.getById(testId);
    expect(current).not.toBeNull();

    const updated = {
      ...current!,
      title: "Updated Title Revision 2",
    };

    const { portfolio: saved, isConflict } = await portfolioRepository.save(updated);
    expect(isConflict).toBe(false);
    expect(saved.title).toBe("Updated Title Revision 2");
    expect(saved.revision).toBe(2);

    const fetched = await portfolioRepository.getById(testId);
    expect(fetched?.revision).toBe(2);
  });

  it("detects optimistic concurrency conflict when expectedRevision is stale", async () => {
    const current = await portfolioRepository.getById(testId);
    expect(current?.revision).toBe(2);

    // Simulate another tab sending an update with stale revision 1
    const staleEdit = {
      ...current!,
      title: "Stale Concurrent Update",
    };

    const { isConflict } = await portfolioRepository.save(staleEdit, {
      expectedRevision: 1, // Stale! Current DB revision is 2
    });

    expect(isConflict).toBe(true);

    // Verify DB was NOT overwritten with stale edit
    const fetched = await portfolioRepository.getById(testId);
    expect(fetched?.title).toBe("Updated Title Revision 2");
    expect(fetched?.revision).toBe(2);
  });

  it("supports anonymous draft claims with cryptographic claim token", async () => {
    const draftId = `draft_${Date.now()}`;
    const claimToken = generateClaimToken();
    const claimHash = hashClaimToken(claimToken);

    const draft = createEmptyPortfolio({
      id: draftId,
      slug: `draft-slug-${Date.now()}`,
      userId: "anonymous",
    });

    await portfolioRepository.save(draft, { claimTokenHash: claimHash });

    // 1. Verify invalid token fails claim
    const badClaim = await portfolioRepository.claimDraft(draftId, "invalid-token", "user_123");
    expect(badClaim).toBe(false);

    // 2. Verify valid token successfully transfers ownership
    const goodClaim = await portfolioRepository.claimDraft(draftId, claimToken, "user_123");
    expect(goodClaim).toBe(true);

    // 3. Verify user_id is updated and claimTokenHash is cleared
    const ownership = await portfolioRepository.getOwnership(draftId);
    expect(ownership?.userId).toBe("user_123");
    expect(ownership?.claimTokenHash).toBeNull();

    // Clean up
    await portfolioRepository.delete(draftId);
  });

  it("deletes a saved portfolio", async () => {
    const deleted = await portfolioRepository.delete(testId);
    expect(deleted).toBe(true);

    const fetchedAfter = await portfolioRepository.getById(testId);
    expect(fetchedAfter).toBeNull();
  });
});
