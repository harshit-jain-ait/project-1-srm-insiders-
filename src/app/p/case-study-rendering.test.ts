import { describe, it, expect, beforeAll } from "vitest";
import { generateMetadata } from "./[slug]/projects/[projectId]/page";
import PublicProjectDetailPage from "./[slug]/projects/[projectId]/page";
import sitemap from "../sitemap";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio, createEmptyCaseStudy } from "@/lib/schema/portfolio";
import { getDatabase, runMigrations } from "@/lib/db/database";

describe("Part 13 — Public Case Study Rendering & SEO", () => {
  const publishedId = `cs_test_pub_${Date.now()}`;
  const publishedSlug = `lead-dev-${Date.now()}`;
  const visibleProjectId = "proj_visible_1";
  const hiddenProjectId = "proj_hidden_2";

  const unpublishedId = `cs_test_unpub_${Date.now()}`;
  const unpublishedSlug = `draft-dev-${Date.now()}`;

  beforeAll(async () => {
    const db = getDatabase();
    runMigrations(db);

    // Create published portfolio with 1 visible case study and 1 hidden case study
    const pub = createEmptyPortfolio({
      id: publishedId,
      slug: publishedSlug,
      title: "Marcus Vance Portfolio",
      profile: {
        fullName: "Marcus Vance",
        headline: "Distributed Systems Lead",
        bio: "Specializing in high throughput log replication.",
        email: "marcus@example.com",
        location: "San Francisco, CA",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
      projects: [
        {
          id: visibleProjectId,
          title: "Distributed Raft Engine",
          tagline: "Sub-millisecond log replication with strict linearizability",
          description: "Engineered a distributed replication engine in Go.",
          category: "software",
          status: "completed",
          featured: true,
          visible: true,
          slug: "distributed-raft-engine",
          technologies: ["Go", "Raft", "gRPC"],
          liveUrl: "https://raft.example.com",
          repoUrl: "https://github.com/example/raft",
          coverImageUrl: "https://example.com/raft-cover.png",
          startDate: "2023-01",
          endDate: "2023-08",
          order: 0,
          caseStudy: createEmptyCaseStudy({
            overview: "A custom linearizable state machine replication protocol.",
            role: "Lead Engineer",
            sections: [
              {
                id: "sec_1",
                type: "problem_solution",
                title: "Core Challenge",
                visible: true,
                order: 0,
                content: "Existing broker stalled during leader re-election. Implemented pre-vote phase and lease reads.",
                bullets: [],
                metrics: [],
                media: [],
                links: [],
                timeline: [],
                embedUrl: "",
                embedProvider: "custom",
              },
            ],
          }),
        },
        {
          id: hiddenProjectId,
          title: "Unreleased Stealth Product",
          tagline: "Classified enterprise platform",
          description: "Proprietary internal system.",
          category: "software",
          status: "in_progress",
          featured: false,
          visible: false, // HIDDEN
          slug: "stealth-product",
          technologies: ["Rust"],
          liveUrl: "",
          repoUrl: "",
          coverImageUrl: "",
          startDate: "2024-01",
          endDate: "",
          order: 1,
          caseStudy: createEmptyCaseStudy({
            overview: "Private internal overview.",
            role: "Confidential",
            sections: [],
          }),
        },
      ],
    });

    await portfolioRepository.save(pub);
    await portfolioRepository.publish(publishedId, pub);

    // Create unpublished draft portfolio
    const unpub = createEmptyPortfolio({
      id: unpublishedId,
      slug: unpublishedSlug,
      title: "Draft User Portfolio",
      projects: [
        {
          id: "proj_draft_1",
          title: "Draft Project",
          tagline: "Still in draft mode",
          description: "Drafting",
          category: "software",
          status: "concept",
          featured: false,
          visible: true,
          slug: "draft-proj",
          technologies: [],
          liveUrl: "",
          repoUrl: "",
          coverImageUrl: "",
          startDate: "",
          endDate: "",
          order: 0,
        },
      ],
    });
    await portfolioRepository.save(unpub);
  });

  it("generates correct metadata for a visible, published case study", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: publishedSlug, projectId: visibleProjectId }),
    });

    expect(meta.title).toContain("Distributed Raft Engine");
    expect(meta.title).toContain("Marcus Vance");
    expect(meta.description).toContain("Sub-millisecond log replication");
    expect(meta.alternates?.canonical).toContain(`/p/${publishedSlug}/projects/${visibleProjectId}`);
    expect(meta.robots).toEqual(
      expect.objectContaining({
        index: true,
        follow: true,
      })
    );
  });

  it("returns 404 / noindex metadata when accessing a hidden project", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: publishedSlug, projectId: hiddenProjectId }),
    });

    expect(meta.title).toContain("Project Not Found");
    expect(meta.robots).toEqual(
      expect.objectContaining({
        index: false,
        follow: false,
      })
    );
  });

  it("returns 404 / noindex metadata when accessing an unpublished portfolio", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: unpublishedSlug, projectId: "proj_draft_1" }),
    });

    expect(meta.title).toContain("Portfolio Unavailable");
    expect(meta.robots).toEqual(
      expect.objectContaining({
        index: false,
        follow: false,
      })
    );
  });

  it("renders the case study page successfully for a published, visible project", async () => {
    const page = await PublicProjectDetailPage({
      params: Promise.resolve({ slug: publishedSlug, projectId: visibleProjectId }),
    });

    expect(page).toBeDefined();
  });

  it("renders a 404 screen when trying to access a hidden project", async () => {
    const page = await PublicProjectDetailPage({
      params: Promise.resolve({ slug: publishedSlug, projectId: hiddenProjectId }),
    });

    expect(page).toBeDefined();
  });

  it("includes published visible case studies in sitemap, and excludes hidden projects", async () => {
    const sitemapEntries = await sitemap();

    const visibleUrl = `/p/${publishedSlug}/projects/${visibleProjectId}`;
    const hiddenUrl = `/p/${publishedSlug}/projects/${hiddenProjectId}`;

    const hasVisible = sitemapEntries.some((e) => e.url.includes(visibleUrl));
    const hasHidden = sitemapEntries.some((e) => e.url.includes(hiddenUrl));

    expect(hasVisible).toBe(true);
    expect(hasHidden).toBe(false);
  });
});
