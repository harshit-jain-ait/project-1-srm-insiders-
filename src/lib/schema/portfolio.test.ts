import { describe, it, expect } from "vitest";
import {
  PortfolioDataSchema,
  createEmptyPortfolio,
  ProfileSchema,
  ProjectSchema,
} from "./portfolio";

describe("Canonical Portfolio Data Schema", () => {
  it("creates an empty portfolio with valid structure and zero fabricated data", () => {
    const emptyPortfolio = createEmptyPortfolio();
    expect(emptyPortfolio.id).toBeDefined();
    expect(emptyPortfolio.slug).toBeDefined();
    expect(emptyPortfolio.published).toBe(false);

    // Strict No-Dummy-Data checks
    expect(emptyPortfolio.profile.fullName).toBe("");
    expect(emptyPortfolio.profile.headline).toBe("");
    expect(emptyPortfolio.profile.bio).toBe("");
    expect(emptyPortfolio.skills).toHaveLength(0);
    expect(emptyPortfolio.projects).toHaveLength(0);
    expect(emptyPortfolio.experience).toHaveLength(0);
    expect(emptyPortfolio.education).toHaveLength(0);
    expect(emptyPortfolio.certifications).toHaveLength(0);
    expect(emptyPortfolio.socialLinks).toHaveLength(0);

    // Section definitions should exist for structure
    expect(emptyPortfolio.sections.length).toBeGreaterThan(0);
    expect(emptyPortfolio.appearance.templateId).toBe("minimal-portfolio");

    // Must validate cleanly against PortfolioDataSchema
    const validated = PortfolioDataSchema.safeParse(emptyPortfolio);
    expect(validated.success).toBe(true);
  });

  it("validates profile with real data", () => {
    const profile = {
      fullName: "Jane Doe",
      headline: "Staff Software Engineer",
      bio: "10 years building distributed cloud systems.",
      location: "San Francisco, CA",
      email: "jane@example.com",
      phone: "+1 555-0199",
      avatarUrl: "https://example.com/avatar.jpg",
      statusBadge: "Available for Q1 advisory",
    };

    const parsed = ProfileSchema.safeParse(profile);
    expect(parsed.success).toBe(true);
  });

  it("validates project schema with case study", () => {
    const project = {
      id: "proj_1",
      title: "Realtime Analytics Engine",
      tagline: "Sub-second event pipeline",
      description: "Built high-throughput stream processing pipeline.",
      featured: true,
      technologies: ["TypeScript", "Next.js", "ClickHouse"],
      liveUrl: "https://example.com/analytics",
      repoUrl: "https://github.com/example/analytics",
      coverImageUrl: "https://example.com/cover.png",
      caseStudy: {
        problem: "Existing reporting queries took >45 seconds during market hours.",
        solution: "Engineered incremental materialized views with streaming ingestion.",
        role: "Lead Architect",
        process: "Profiled bottlenecks, introduced Kafka partition queues, migrated storage.",
        outcomes: "P99 query latency dropped from 45s to 380ms.",
        technologies: ["Kafka", "ClickHouse", "Go"],
        liveUrl: "",
        repoUrl: "",
        mediaUrls: [],
      },
    };

    const parsed = ProjectSchema.safeParse(project);
    expect(parsed.success).toBe(true);
  });
});
