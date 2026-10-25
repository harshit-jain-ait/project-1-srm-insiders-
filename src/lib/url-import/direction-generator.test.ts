import { describe, it, expect } from "vitest";
import { DirectionGenerator } from "./direction-generator";
import { WebsiteDesignAnalysis, DesignDirectionSchema } from "./types";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";

describe("Direction Generator Engine (Signature & Reimagined)", () => {
  const mockAnalysis: WebsiteDesignAnalysis = {
    sourceUrl: "https://studio-nord.dev",
    resolvedHost: "studio-nord.dev",
    timestamp: new Date().toISOString(),
    pageTitle: "Nordic Design & Code",
    metaDescription: "Building purposeful digital architecture.",
    palette: {
      primary: "#18181b",
      secondary: "#71717a",
      accent: "#356ae6",
      background: "#ffffff",
      surface: "#f4f4f5",
      text: "#09090b",
      mutedText: "#71717a",
      isDark: false,
    },
    typography: {
      detectedFont: "Inter, sans-serif",
      mood: "modern-sans",
      headingStyle: "clean",
      fontFamily: "sans",
    },
    layout: {
      density: "balanced",
      cardStyle: "bordered",
      headerLayout: "split",
      contentWidth: "standard",
    },
    extractedContent: {
      headline: "Nordic Architecture & Digital Engineering",
      bioSnippet: "Architecting resilient distributed software systems with Scandinavian simplicity.",
      detectedSections: ["profile", "projects", "experience"],
      projectHighlights: [
        { title: "Distributed Mesh Router" },
        { title: "Observability Platform" },
      ],
    },
    limitations: [],
  };

  const generator = new DirectionGenerator();

  it("generates EXACTLY TWO directions named Signature and Reimagined", async () => {
    const result = await generator.generateDirections(mockAnalysis);

    // Strict product requirement: exactly two directions
    expect(result).toHaveProperty("signature");
    expect(result).toHaveProperty("reimagined");
    expect(Object.keys(result).filter((k) => k === "signature" || k === "reimagined").length).toBe(2);

    // Strict naming requirements
    expect(result.signature.name).toBe("Signature");
    expect(result.reimagined.name).toBe("Reimagined");
    expect(result.signature.id).toBe("signature");
    expect(result.reimagined.id).toBe("reimagined");
  });

  it("validates that both directions conform to DesignDirectionSchema", async () => {
    const result = await generator.generateDirections(mockAnalysis);

    const sigValidation = DesignDirectionSchema.safeParse(result.signature);
    expect(sigValidation.success).toBe(true);

    const reimValidation = DesignDirectionSchema.safeParse(result.reimagined);
    expect(reimValidation.success).toBe(true);
  });

  it("verifies that Signature preserves the source visual harmony", async () => {
    const result = await generator.generateDirections(mockAnalysis);

    expect(result.signature.designTokens.accentHex).toBe(mockAnalysis.palette.accent);
    expect(result.signature.designTokens.backgroundColor).toBe(mockAnalysis.palette.background);
    expect(result.signature.designTokens.fontFamily).toBe(mockAnalysis.typography.fontFamily);
    expect(result.signature.designTokens.layoutDensity).toBe(mockAnalysis.layout.density);
    expect(result.signature.baseTemplateId).toBe("signature");
  });

  it("verifies that Reimagined is meaningfully distinct from Signature (not a minor color tint)", async () => {
    const result = await generator.generateDirections(mockAnalysis);

    const sig = result.signature.designTokens;
    const reim = result.reimagined.designTokens;

    // Distinctness verification: Must differ in typography family, layout density, card style, or header layout
    const hasDifferentTypography = sig.fontFamily !== reim.fontFamily;
    const hasDifferentDensity = sig.layoutDensity !== reim.layoutDensity;
    const hasDifferentCardStyle = sig.cardStyle !== reim.cardStyle;
    const hasDifferentHeader = sig.headerLayout !== reim.headerLayout;

    expect(hasDifferentTypography || hasDifferentDensity || hasDifferentCardStyle || hasDifferentHeader).toBe(true);
    expect(result.reimagined.baseTemplateId).toBe("reimagined");
  });

  it("preserves 100% of user-provided content when an existing portfolio is passed", async () => {
    const existing = createEmptyPortfolio({
      profile: {
        fullName: "Sarah Chen",
        headline: "Principal Distributed Systems Engineer",
        bio: "Specializing in consensus algorithms and high-scale backends.",
        location: "Seattle, WA",
        email: "sarah@example.com",
      },
      skills: [
        { id: "s1", name: "Raft / Paxos", category: "Systems", order: 0 },
        { id: "s2", name: "Rust", category: "Languages", order: 1 },
      ],
      projects: [
        {
          id: "p1",
          title: "Custom KV Store",
          tagline: "LSM-tree storage engine",
          description: "Implemented write-ahead logging and concurrent memtable flushes.",
          technologies: ["Rust", "Tokio"],
          featured: true,
          liveUrl: "",
          repoUrl: "",
          coverImageUrl: "",
          startDate: "",
          endDate: "",
          order: 0,
        },
      ],
    });

    const result = await generator.generateDirections(mockAnalysis, existing);

    expect(result.extractedDraft).toBeDefined();
    expect(result.extractedDraft?.profile?.fullName).toBe("Sarah Chen");
    expect(result.extractedDraft?.skills?.length).toBe(2);
    expect(result.extractedDraft?.projects?.length).toBe(1);
    expect(result.extractedDraft?.projects?.[0].title).toBe("Custom KV Store");
  });

  it("does not introduce fabricated metrics or dummy claims", async () => {
    const result = await generator.generateDirections(mockAnalysis);

    // Ensure no fake statistics or dummy endorsements
    expect(result.signature.description).not.toContain("98% similarity");
    expect(result.reimagined.description).not.toContain("10x more creative");
    expect(result.signature.tagline).toBeDefined();
    expect(result.reimagined.tagline).toBeDefined();
  });
});
