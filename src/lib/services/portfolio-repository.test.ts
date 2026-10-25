import { describe, it, expect, beforeEach } from "vitest";
import { portfolioRepository } from "./portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";

describe("Portfolio Persistence Repository", () => {
  const testId = `test_portfolio_${Date.now()}`;
  const testSlug = `test-slug-${Date.now()}`;

  it("saves and retrieves a portfolio cleanly", async () => {
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

    const saved = await portfolioRepository.save(fresh);
    expect(saved.id).toBe(testId);
    expect(saved.title).toBe("Test Portfolio");

    const fetched = await portfolioRepository.getById(testId);
    expect(fetched).not.toBeNull();
    expect(fetched?.profile.fullName).toBe("Test User");

    const fetchedBySlug = await portfolioRepository.getBySlug(testSlug);
    expect(fetchedBySlug).not.toBeNull();
    expect(fetchedBySlug?.id).toBe(testId);
  });

  it("deletes a saved portfolio", async () => {
    const deleted = await portfolioRepository.delete(testId);
    expect(deleted).toBe(true);

    const fetchedAfter = await portfolioRepository.getById(testId);
    expect(fetchedAfter).toBeNull();
  });
});
