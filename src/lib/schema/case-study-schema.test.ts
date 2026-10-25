import { describe, it, expect } from "vitest";
import {
  ProjectSchema,
  CaseStudySectionSchema,
  createEmptyCaseStudySection,
  reorderCaseStudySections,
  CaseStudySection,
} from "./portfolio";

describe("ProjectSchema & Case Study Schemas", () => {
  it("validates a standard project with default category, status, and visibility", () => {
    const valid = {
      id: "proj_123",
      title: "Real-time Telemetry Service",
      tagline: "High-throughput stream processing",
      description: "Implemented a distributed telemetry ingestion pipeline.",
      category: "software",
      status: "completed",
      featured: true,
      visible: true,
      slug: "real-time-telemetry",
      technologies: ["Rust", "Kafka", "ClickHouse"],
      liveUrl: "https://telemetry.example.com",
      repoUrl: "https://github.com/example/telemetry",
      coverImageUrl: "https://example.com/cover.png",
      startDate: "2023-01",
      endDate: "2023-06",
      order: 0,
    };

    const parsed = ProjectSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.category).toBe("software");
      expect(parsed.data.status).toBe("completed");
      expect(parsed.data.featured).toBe(true);
      expect(parsed.data.visible).toBe(true);
    }
  });

  it("validates all supported project categories and statuses", () => {
    const categories = [
      "software",
      "design",
      "engineering",
      "research",
      "business",
      "creative",
      "writing",
      "other",
    ] as const;

    const statuses = [
      "completed",
      "in_progress",
      "maintained",
      "concept",
      "archived",
    ] as const;

    for (const cat of categories) {
      const parsed = ProjectSchema.safeParse({
        id: `proj_${cat}`,
        title: `Test ${cat}`,
        category: cat,
      });
      expect(parsed.success).toBe(true);
    }

    for (const st of statuses) {
      const parsed = ProjectSchema.safeParse({
        id: `proj_${st}`,
        title: `Test ${st}`,
        status: st,
      });
      expect(parsed.success).toBe(true);
    }
  });

  it("validates a detailed case study section with metrics", () => {
    const section: CaseStudySection = {
      id: "sec_metrics_1",
      type: "metrics",
      title: "Performance Outcomes",
      visible: true,
      order: 0,
      content: "System throughput and benchmark outcomes",
      bullets: [],
      metrics: [
        {
          id: "m1",
          label: "p99 Query Latency",
          value: "14ms",
          baseline: "240ms",
          period: "Q3 2023",
          context: "Measured under 50k sustained writes/sec",
          verifiedByUser: true,
        },
      ],
      media: [],
      links: [],
      timeline: [],
      embedUrl: "",
      embedProvider: "custom",
    };

    const parsed = CaseStudySectionSchema.safeParse(section);
    expect(parsed.success).toBe(true);
  });

  it("rejects an unsupported case study section type", () => {
    const invalidSection = {
      id: "sec_invalid",
      type: "arbitrary_executable_code",
      title: "Exploit Section",
      visible: true,
      order: 0,
      content: "",
    };

    const parsed = CaseStudySectionSchema.safeParse(invalidSection);
    expect(parsed.success).toBe(false);
  });

  it("createEmptyCaseStudySection creates properly formatted sections", () => {
    const textSec = createEmptyCaseStudySection("text", 0);
    expect(textSec.id).toBeDefined();
    expect(textSec.type).toBe("text");
    expect(textSec.visible).toBe(true);
    expect(textSec.order).toBe(0);
    expect(textSec.content).toBe("");

    const metricsSec = createEmptyCaseStudySection("metrics", 1);
    expect(metricsSec.type).toBe("metrics");
    expect(Array.isArray(metricsSec.metrics)).toBe(true);

    const embedSec = createEmptyCaseStudySection("video_embed", 2);
    expect(embedSec.type).toBe("video_embed");
    expect(embedSec.embedUrl).toBe("");
  });

  it("reorderCaseStudySections swaps section positions and recalculates orders", () => {
    const sec1 = createEmptyCaseStudySection("text", 0);
    sec1.title = "First";
    const sec2 = createEmptyCaseStudySection("problem_solution", 1);
    sec2.title = "Second";
    const sec3 = createEmptyCaseStudySection("metrics", 2);
    sec3.title = "Third";

    const list = [sec1, sec2, sec3];

    // Move sec2 up
    const movedUp = reorderCaseStudySections(list, 1, "up");
    expect(movedUp[0].title).toBe("Second");
    expect(movedUp[0].order).toBe(0);
    expect(movedUp[1].title).toBe("First");
    expect(movedUp[1].order).toBe(1);
    expect(movedUp[2].title).toBe("Third");
    expect(movedUp[2].order).toBe(2);

    // Boundary check: cannot move top element up
    const noop = reorderCaseStudySections(list, 0, "up");
    expect(noop).toEqual(list);
  });
});
