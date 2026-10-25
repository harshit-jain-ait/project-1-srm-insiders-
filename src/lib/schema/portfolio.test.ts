import { describe, it, expect } from "vitest";
import {
  PortfolioDataSchema,
  createEmptyPortfolio,
  initializePortfolioWithTemplate,
  ProfileSchema,
  ProjectSchema,
  ExperienceSchema,
  isSafeHttpUrl,
  validateDateRange,
  isDuplicateSkill,
  reorderSection,
  validatePublishReadiness,
  SocialLinkSchema,
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
    expect(emptyPortfolio.profile.longBio).toBe("");
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

  it("validates profile with real data and extended bio", () => {
    const profile = {
      fullName: "Jane Doe",
      headline: "Staff Software Engineer",
      bio: "10 years building distributed cloud systems.",
      longBio: "Extended narrative detailing career trajectory from kernel development to cloud infrastructure.",
      location: "San Francisco, CA",
      email: "jane@example.com",
      phone: "+1 555-0199",
      avatarUrl: "https://example.com/avatar.jpg",
      statusBadge: "Available for Q1 advisory",
    };

    const parsed = ProfileSchema.safeParse(profile);
    expect(parsed.success).toBe(true);
  });

  it("enforces safe URL validation and strictly rejects dangerous protocols", () => {
    // Valid HTTP/HTTPS
    expect(isSafeHttpUrl("https://example.com")).toBe(true);
    expect(isSafeHttpUrl("http://localhost:3000")).toBe(true);
    expect(isSafeHttpUrl("https://github.com/org/repo")).toBe(true);

    // Empty strings allowed in drafts
    expect(isSafeHttpUrl("")).toBe(true);
    expect(isSafeHttpUrl(undefined)).toBe(true);

    // Malformed strings
    expect(isSafeHttpUrl("not-a-valid-url")).toBe(false);
    expect(isSafeHttpUrl("ftp://files.example.com")).toBe(false);

    // Dangerous protocols rejected
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeHttpUrl("vbscript:msgbox(1)")).toBe(false);
  });

  it("validates social link schemas correctly", () => {
    const validGithub = {
      id: "sl1",
      platform: "github",
      label: "GitHub",
      url: "https://github.com/developer",
    };
    expect(SocialLinkSchema.safeParse(validGithub).success).toBe(true);

    const validMailto = {
      id: "sl2",
      platform: "email",
      label: "Email",
      url: "mailto:alex@example.com",
    };
    expect(SocialLinkSchema.safeParse(validMailto).success).toBe(true);

    const dangerousLink = {
      id: "sl3",
      platform: "website",
      label: "Personal",
      url: "javascript:evil()",
    };
    expect(SocialLinkSchema.safeParse(dangerousLink).success).toBe(false);
  });

  it("validates project schema with case study and separate safe URLs", () => {
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
      startDate: "2023",
      endDate: "2024",
      order: 0,
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

    // Dangerous URL in liveUrl must fail
    const invalidLiveUrl = { ...project, liveUrl: "javascript:void(0)" };
    expect(ProjectSchema.safeParse(invalidLiveUrl).success).toBe(false);
  });

  it("validates work experience timelines and coherent date ranges", () => {
    // Valid ongoing position
    const currentExp = {
      id: "exp_1",
      company: "Acme Corp",
      role: "Staff Engineer",
      location: "Remote",
      startDate: "2022-01-01",
      endDate: "",
      current: true,
      description: "Leading distributed storage team.",
      highlights: ["Achieved 99.999% SLA"],
    };
    expect(ExperienceSchema.safeParse(currentExp).success).toBe(true);

    // Valid past position (end >= start)
    const pastExp = {
      ...currentExp,
      id: "exp_2",
      endDate: "2023-01-01",
      current: false,
    };
    expect(ExperienceSchema.safeParse(pastExp).success).toBe(true);

    // Invalid timeline (end date precedes start date)
    const invalidDates = {
      ...currentExp,
      id: "exp_3",
      startDate: "2023-01-01",
      endDate: "2021-01-01",
      current: false,
    };
    const invalidResult = ExperienceSchema.safeParse(invalidDates);
    expect(invalidResult.success).toBe(false);

    // Direct helper check
    expect(validateDateRange("2023-01-01", "2021-01-01", false).isValid).toBe(false);
    expect(validateDateRange("2021-01-01", "2023-01-01", false).isValid).toBe(true);
    expect(validateDateRange("2023-01-01", "", true).isValid).toBe(true);
  });

  it("detects and prevents duplicate skills using case-insensitive normalization", () => {
    const skills = [
      { id: "s1", name: "Distributed Systems", category: "Backend", order: 0 },
      { id: "s2", name: "Rust", category: "Languages", order: 1 },
    ];

    // Same skill name with different casing
    expect(isDuplicateSkill(skills, "rust")).toBe(true);
    expect(isDuplicateSkill(skills, "RUST ")).toBe(true);
    expect(isDuplicateSkill(skills, "Distributed Systems")).toBe(true);

    // Non-duplicate skill
    expect(isDuplicateSkill(skills, "Go")).toBe(false);
    expect(isDuplicateSkill(skills, "PostgreSQL")).toBe(false);

    // Preserves self when editing
    expect(isDuplicateSkill(skills, "Rust", "s2")).toBe(false);
  });

  it("reorders sections explicitly while respecting boundary conditions", () => {
    const sections = [
      { key: "profile" as const, label: "Profile", visible: true, order: 0 },
      { key: "projects" as const, label: "Projects", visible: true, order: 1 },
      { key: "experience" as const, label: "Experience", visible: true, order: 2 },
    ];

    // Move second item up -> should become first
    const movedUp = reorderSection(sections, 1, "up");
    expect(movedUp[0].key).toBe("projects");
    expect(movedUp[1].key).toBe("profile");
    expect(movedUp[0].order).toBe(0);
    expect(movedUp[1].order).toBe(1);

    // Boundary condition: cannot move first item up
    const noopUp = reorderSection(sections, 0, "up");
    expect(noopUp[0].key).toBe("profile");

    // Boundary condition: cannot move last item down
    const noopDown = reorderSection(sections, 2, "down");
    expect(noopDown[2].key).toBe("experience");
  });

  it("initializes portfolio with verified registered template and empty collections", () => {
    const initialized = initializePortfolioWithTemplate("developer-pro");
    expect(initialized.appearance.templateId).toBe("developer-pro");
    expect(initialized.projects).toHaveLength(0);
    expect(initialized.skills).toHaveLength(0);
    expect(initialized.experience).toHaveLength(0);
    expect(initialized.published).toBe(false);

    // Unrecognized template ID falls back to default minimal-portfolio
    const fallback = initializePortfolioWithTemplate("unrecognized-id");
    expect(fallback.appearance.templateId).toBe("minimal-portfolio");
  });

  it("validates publishing readiness distinctly from draft saving", () => {
    const draft = createEmptyPortfolio();
    // Draft saves are structurally valid
    expect(PortfolioDataSchema.safeParse(draft).success).toBe(true);

    // But draft is NOT ready to be publicly published
    const publishCheck = validatePublishReadiness(draft);
    expect(publishCheck.isReady).toBe(false);
    expect(publishCheck.errors.length).toBeGreaterThan(0);
    expect(publishCheck.errors).toContain("Full Name is required for a public portfolio");

    // Populated portfolio satisfies publishing readiness
    const ready = createEmptyPortfolio({
      title: "Alex Rivera Portfolio",
      slug: "alex-rivera",
      profile: {
        fullName: "Alex Rivera",
        headline: "Staff Cloud Architect",
        bio: "Specializing in distributed systems.",
        avatarUrl: "https://example.com/alex.jpg",
      },
      projects: [
        {
          id: "p1",
          title: "Stream Engine",
          liveUrl: "https://stream.example.com",
        },
      ],
    });

    const readyCheck = validatePublishReadiness(ready);
    expect(readyCheck.isReady).toBe(true);
    expect(readyCheck.errors).toHaveLength(0);
  });
});
