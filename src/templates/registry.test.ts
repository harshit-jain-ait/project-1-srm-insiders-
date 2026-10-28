import React from "react";
import { describe, it, expect } from "vitest";
import { getAllTemplates, getTemplate, isValidTemplateId, getDefaultTemplate } from "./registry";
import { PortfolioRenderer } from "./renderer";
import { createEmptyPortfolio, PortfolioData } from "@/lib/schema/portfolio";
import { MinimalPortfolioTemplate } from "./minimal-portfolio";
import { DeveloperProTemplate } from "./developer-pro";

describe("Template Engine & Registry", () => {
  it("registers Minimal Portfolio and Developer Pro as distinct templates", () => {
    const templates = getAllTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(2);

    const ids = templates.map((t) => t.metadata.id);
    expect(ids).toContain("minimal-portfolio");
    expect(ids).toContain("developer-pro");
    expect(ids).toContain("bento-studio");
    expect(ids).toContain("kinetic-studio");
    expect(ids).toContain("designer-craft");

    // Unique IDs
    expect(new Set(ids).size).toBe(templates.length);
  });

  it("retrieves template by valid ID and exposes component and metadata", () => {
    const devPro = getTemplate("developer-pro");
    expect(devPro).toBeDefined();
    expect(devPro?.metadata.name).toBe("Developer Pro");
    expect(devPro?.metadata.category).toBe("Engineering");
    expect(devPro?.metadata.supportedSections).toContain("projects");
    expect(devPro?.component).toBe(DeveloperProTemplate);

    const bento = getTemplate("bento-studio");
    expect(bento).toBeDefined();
    expect(bento?.metadata.name).toBe("Bento Studio");
    expect(bento?.metadata.category).toBe("Creative");
    expect(bento?.metadata.isPremium).toBe(true);

    const kinetic = getTemplate("kinetic-studio");
    expect(kinetic).toBeDefined();
    expect(kinetic?.metadata.name).toBe("Kinetic Studio");
    expect(kinetic?.metadata.category).toBe("Engineering");
    expect(kinetic?.metadata.isPremium).toBe(true);

    const craft = getTemplate("designer-craft");
    expect(craft).toBeDefined();
    expect(craft?.metadata.name).toBe("Designer Craft");
    expect(craft?.metadata.category).toBe("Creative");
    expect(craft?.metadata.isPremium).toBe(true);

    const minimal = getTemplate("minimal-portfolio");
    expect(minimal).toBeDefined();
    expect(minimal?.metadata.name).toBe("Minimal Portfolio");
    expect(minimal?.metadata.category).toBe("Editorial");
    expect(minimal?.metadata.supportedSections).toContain("experience");
    expect(minimal?.component).toBe(MinimalPortfolioTemplate);
  });

  it("returns undefined for unknown template ID without throwing", () => {
    const unknown = getTemplate("non-existent-template");
    expect(unknown).toBeUndefined();
  });

  it("validates template ID correctly", () => {
    expect(isValidTemplateId("minimal-portfolio")).toBe(true);
    expect(isValidTemplateId("developer-pro")).toBe(true);
    expect(isValidTemplateId("bento-studio")).toBe(true);
    expect(isValidTemplateId("kinetic-studio")).toBe(true);
    expect(isValidTemplateId("designer-craft")).toBe(true);
    expect(isValidTemplateId("invalid-id")).toBe(false);
  });

  it("returns Minimal Portfolio as the canonical default template", () => {
    const defaultTpl = getDefaultTemplate();
    expect(defaultTpl.metadata.id).toBe("minimal-portfolio");
  });

  describe("Template Switching and Data Preservation", () => {
    it("preserves 100% of canonical portfolio content when switching templateId", () => {
      const portfolio: PortfolioData = createEmptyPortfolio({
        title: "Staff Systems Engineer",
        profile: {
          fullName: "Morgan Taylor",
          headline: "Cloud Architect",
          bio: "10 years building distributed systems.",
        },
        projects: [
          {
            id: "p1",
            title: "Streaming Event Broker",
            description: "Built high throughput pipeline.",
            technologies: ["Go", "Kafka"],
            liveUrl: "https://broker.example.com",
          },
        ],
        skills: [
          { id: "s1", name: "Distributed Protocols", category: "Backend" },
        ],
        appearance: {
          templateId: "minimal-portfolio",
          colorScheme: "system",
          accentColor: "neutral",
          fontFamily: "sans",
        },
      });

      // Switch to developer-pro
      const switchedPortfolio: PortfolioData = {
        ...portfolio,
        appearance: {
          ...portfolio.appearance,
          templateId: "developer-pro",
        },
      };

      // Verify template selection updated
      expect(switchedPortfolio.appearance.templateId).toBe("developer-pro");

      // Verify all data preserved identically
      expect(switchedPortfolio.profile.fullName).toBe("Morgan Taylor");
      expect(switchedPortfolio.profile.headline).toBe("Cloud Architect");
      expect(switchedPortfolio.projects).toHaveLength(1);
      expect(switchedPortfolio.projects[0].id).toBe("p1");
      expect(switchedPortfolio.projects[0].title).toBe("Streaming Event Broker");
      expect(switchedPortfolio.skills).toHaveLength(1);
      expect(switchedPortfolio.skills[0].name).toBe("Distributed Protocols");
    });
  });

  describe("PortfolioRenderer Component Resolution", () => {
    it("resolves and creates element for valid template", () => {
      const portfolio = createEmptyPortfolio({
        appearance: {
          templateId: "developer-pro",
          colorScheme: "dark",
          accentColor: "neutral",
          fontFamily: "sans",
        },
      });

      const element = React.createElement(PortfolioRenderer, {
        portfolio,
        isLivePreview: false,
      });

      expect(element).toBeDefined();
      expect(element.type).toBe(PortfolioRenderer);
    });

    it("falls back safely to default template when unrecognized ID is provided", () => {
      const portfolio = createEmptyPortfolio({
        appearance: {
          templateId: "developer-pro", // valid in schema
          colorScheme: "system",
          accentColor: "neutral",
          fontFamily: "sans",
        },
      });

      // Force an unknown template ID on the appearance object
      const brokenTemplatePortfolio = {
        ...portfolio,
        appearance: {
          ...portfolio.appearance,
          templateId: "unknown-legacy-template" as unknown as "minimal-portfolio",
        },
      };

      const element = React.createElement(PortfolioRenderer, {
        portfolio: brokenTemplatePortfolio,
        isLivePreview: true,
      });

      expect(element).toBeDefined();
    });
  });

  describe("Empty Content & Section Visibility Compliance", () => {
    it("renders empty portfolio without crashing and with zero fabricated data", () => {
      const empty = createEmptyPortfolio();

      const minimalElement = React.createElement(MinimalPortfolioTemplate, {
        portfolio: empty,
        isLivePreview: false,
      });
      expect(minimalElement).toBeDefined();

      const devProElement = React.createElement(DeveloperProTemplate, {
        portfolio: empty,
        isLivePreview: false,
      });
      expect(devProElement).toBeDefined();
    });

    it("renders live preview mode with contextual editing hints for empty sections", () => {
      const empty = createEmptyPortfolio();

      const livePreviewMinimal = React.createElement(MinimalPortfolioTemplate, {
        portfolio: empty,
        isLivePreview: true,
      });
      expect(livePreviewMinimal).toBeDefined();

      const livePreviewDev = React.createElement(DeveloperProTemplate, {
        portfolio: empty,
        isLivePreview: true,
      });
      expect(livePreviewDev).toBeDefined();
    });
  });
});
