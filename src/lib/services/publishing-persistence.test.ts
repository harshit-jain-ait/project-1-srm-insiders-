import { describe, it, expect, beforeAll } from "vitest";
import { portfolioRepository } from "./portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";
import { getDatabase, runMigrations } from "@/lib/db/database";

describe("Part 12 — Publishing Persistence & Snapshot Isolation", () => {
  const portfolioId = `pub_test_${Date.now()}`;
  const slug = `snapshot-user-${Date.now()}`;

  beforeAll(() => {
    const db = getDatabase();
    runMigrations(db);
  });

  it("persists initial draft without creating a published snapshot", async () => {
    const draft = createEmptyPortfolio({
      id: portfolioId,
      slug,
      title: "Initial Draft Title",
      profile: {
        fullName: "Original Name",
        headline: "Junior Engineer",
        bio: "Original bio text",
        email: "author@test.com",
        location: "Seattle, WA",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
    });

    const { portfolio: saved } = await portfolioRepository.save(draft);
    expect(saved.id).toBe(portfolioId);
    expect(saved.published).toBe(false);

    // Draft is not accessible via public onlyPublished lookup
    const publicLookup = await portfolioRepository.getBySlug(slug, { onlyPublished: true });
    expect(publicLookup).toBeNull();

    // Draft is accessible via internal lookup
    const internalLookup = await portfolioRepository.getById(portfolioId);
    expect(internalLookup).not.toBeNull();
    expect(internalLookup?.title).toBe("Initial Draft Title");
  });

  it("publishes portfolio snapshot atomically and enables public resolution", async () => {
    const current = await portfolioRepository.getById(portfolioId);
    expect(current).not.toBeNull();

    const published = await portfolioRepository.publish(portfolioId, current!);
    expect(published).not.toBeNull();
    expect(published?.published).toBe(true);
    expect(published?.publishedAt).not.toBeNull();

    // Now public resolution works
    const livePortfolio = await portfolioRepository.getBySlug(slug, { onlyPublished: true });
    expect(livePortfolio).not.toBeNull();
    expect(livePortfolio?.title).toBe("Initial Draft Title");
    expect(livePortfolio?.profile.fullName).toBe("Original Name");
    expect(livePortfolio?.published).toBe(true);
  });

  it("maintains strict snapshot isolation: draft updates do not leak to public live route", async () => {
    const currentDraft = await portfolioRepository.getById(portfolioId);
    expect(currentDraft).not.toBeNull();

    // User edits draft in editor without publishing
    const modifiedDraft = {
      ...currentDraft!,
      title: "UNPUBLISHED WORK-IN-PROGRESS DRAFT",
      profile: {
        ...currentDraft!.profile,
        fullName: "WIP Secret Name",
        bio: "This is a confidential draft revision.",
      },
    };

    // Save draft
    const { portfolio: savedDraft } = await portfolioRepository.save(modifiedDraft);
    expect(savedDraft.title).toBe("UNPUBLISHED WORK-IN-PROGRESS DRAFT");

    // Public onlyPublished lookup STILL returns the frozen published snapshot
    const publicPortfolio = await portfolioRepository.getBySlug(slug, { onlyPublished: true });
    expect(publicPortfolio).not.toBeNull();
    expect(publicPortfolio?.title).toBe("Initial Draft Title"); // Original title!
    expect(publicPortfolio?.profile.fullName).toBe("Original Name"); // Original name!
    expect(publicPortfolio?.profile.bio).toBe("Original bio text"); // Did NOT leak!

    // Internal editor lookup sees latest draft
    const internalLookup = await portfolioRepository.getById(portfolioId);
    expect(internalLookup?.title).toBe("UNPUBLISHED WORK-IN-PROGRESS DRAFT");
  });

  it("updates the public snapshot only when explicit publish is triggered", async () => {
    const latestDraft = await portfolioRepository.getById(portfolioId);
    expect(latestDraft).not.toBeNull();

    const updatedPublished = await portfolioRepository.publish(portfolioId, latestDraft!);
    expect(updatedPublished).not.toBeNull();
    expect(updatedPublished?.title).toBe("UNPUBLISHED WORK-IN-PROGRESS DRAFT");

    // Now public lookup receives the newly approved snapshot
    const publicPortfolio = await portfolioRepository.getBySlug(slug, { onlyPublished: true });
    expect(publicPortfolio?.title).toBe("UNPUBLISHED WORK-IN-PROGRESS DRAFT");
    expect(publicPortfolio?.profile.fullName).toBe("WIP Secret Name");
  });

  it("unpublishes portfolio: removes public access while keeping draft 100% intact", async () => {
    const unpublished = await portfolioRepository.unpublish(portfolioId);
    expect(unpublished).not.toBeNull();
    expect(unpublished?.published).toBe(false);

    // Public lookup now returns null (404 Not Found)
    const publicLookup = await portfolioRepository.getBySlug(slug, { onlyPublished: true });
    expect(publicLookup).toBeNull();

    // User's draft data is completely preserved
    const draftAfterUnpublish = await portfolioRepository.getById(portfolioId);
    expect(draftAfterUnpublish).not.toBeNull();
    expect(draftAfterUnpublish?.title).toBe("UNPUBLISHED WORK-IN-PROGRESS DRAFT");
    expect(draftAfterUnpublish?.profile.fullName).toBe("WIP Secret Name");
  });

  it("handles slug and custom domain uniqueness checks correctly", async () => {
    // Slug used by portfolioId
    const isAvailForOther = await portfolioRepository.isSlugAvailable(slug, "different_portfolio_id");
    expect(isAvailForOther).toBe(false);

    const isAvailForSelf = await portfolioRepository.isSlugAvailable(slug, portfolioId);
    expect(isAvailForSelf).toBe(true);

    const unusedSlug = `completely-unused-${Date.now()}`;
    const isUnusedAvail = await portfolioRepository.isSlugAvailable(unusedSlug);
    expect(isUnusedAvail).toBe(true);

    // Domain check
    const unusedDomain = `domain-${Date.now()}.com`;
    const isDomainAvail = await portfolioRepository.isDomainAvailable(unusedDomain);
    expect(isDomainAvail).toBe(true);
  });

  it("lists all published portfolios for sitemap generation", async () => {
    // Publish our portfolio again
    const draft = await portfolioRepository.getById(portfolioId);
    await portfolioRepository.publish(portfolioId, draft!);

    const allPublished = await portfolioRepository.listAllPublished();
    expect(allPublished.length).toBeGreaterThan(0);
    const found = allPublished.find((p) => p.slug === slug);
    expect(found).toBeDefined();
    expect(found?.published).toBe(true);
  });
});
