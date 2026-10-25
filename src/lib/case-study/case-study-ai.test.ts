import { describe, it, expect } from "vitest";
import {
  generateCaseStudyOutline,
  improveCaseStudySection,
  evaluateCaseStudyQuality,
} from "./case-study-ai";

describe("Case Study AI Assistant", () => {
  it("generates a structured outline tailored to software engineering", async () => {
    const result = await generateCaseStudyOutline({
      title: "Real-time Distributed Event Broker",
      category: "software",
      projectNotes: "Built a fault-tolerant message broker in Go using Raft consensus.",
    });

    expect(result.sections.length).toBeGreaterThanOrEqual(4);
    expect(result.sections.some((s) => s.type === "problem_solution")).toBe(true);
    expect(result.sections.some((s) => s.type === "technical_architecture")).toBe(true);
    expect(result.sections.some((s) => s.type === "metrics")).toBe(true);
  });

  it("generates a structured outline tailored to product design", async () => {
    const result = await generateCaseStudyOutline({
      title: "Enterprise Mobile Navigation Redesign",
      category: "design",
      projectNotes: "Redesigned mobile IA for warehouse managers.",
    });

    expect(result.sections.length).toBeGreaterThanOrEqual(4);
    expect(result.sections.some((s) => s.type === "process")).toBe(true);
    expect(result.sections.some((s) => s.type === "prototype_embed")).toBe(true);
  });

  it("improves section content while preserving factual honesty", async () => {
    const originalText =
      "I had to make sure the API stayed up when nodes crashed. We added Raft heartbeats.";
    const result = await improveCaseStudySection({
      sectionType: "technical_architecture",
      currentText: originalText,
      mode: "clarity",
    });

    expect(result.improvedText).toBeDefined();
    expect(result.improvedText.length).toBeGreaterThan(10);
    expect(result.explanation).toBeDefined();
    // Verify anti-hallucination note or preservation
    expect(result.antiHallucinationNote).toContain("No numbers, metrics, or client names were invented");
  });

  it("evaluates case study completeness with an objective checklist", () => {
    const incompleteProject = {
      title: "Sample Project",
      tagline: "",
      description: "",
      technologies: [],
      liveUrl: "",
      repoUrl: "",
    };

    const review = evaluateCaseStudyQuality(incompleteProject);
    expect(review.completenessPercentage).toBeLessThan(50);
    expect(review.checklist.length).toBeGreaterThanOrEqual(6);
    expect(review.checklist.find((c) => c.item === "Live URL or Repository")?.passed).toBe(false);
    expect(review.recommendations.length).toBeGreaterThan(0);

    const completeProject = {
      title: "Complete System",
      tagline: "Ultra low latency indexer",
      description: "A distributed inverted index service.",
      category: "software" as const,
      status: "completed" as const,
      technologies: ["Rust", "gRPC"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/example/repo",
      coverImageUrl: "https://example.com/cover.png",
      caseStudy: {
        overview: "Detailed overview of the indexing engine.",
        role: "Principal Architect",
        sections: [
          {
            id: "s1",
            type: "problem_solution" as const,
            title: "Problem & Solution",
            visible: true,
            order: 0,
            content: "Index build took 8 hours. Pipelined parallel partition generation.",
          },
        ],
      },
    };

    const goodReview = evaluateCaseStudyQuality(completeProject);
    expect(goodReview.completenessPercentage).toBeGreaterThanOrEqual(80);
    expect(goodReview.checklist.find((c) => c.item === "Role Attribution")?.passed).toBe(true);
  });
});
