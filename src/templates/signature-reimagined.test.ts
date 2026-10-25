import { describe, it, expect } from "vitest";
import { getTemplate, isValidTemplateId } from "./registry";
import { TemplateIdSchema, createEmptyPortfolio } from "@/lib/schema/portfolio";
import React from "react";
import { renderToString } from "react-dom/server";
import { PortfolioRenderer } from "./renderer";

describe("Signature & Reimagined Template Engine Integration", () => {
  it("registers both 'signature' and 'reimagined' in TemplateIdSchema", () => {
    expect(TemplateIdSchema.safeParse("signature").success).toBe(true);
    expect(TemplateIdSchema.safeParse("reimagined").success).toBe(true);
    expect(isValidTemplateId("signature")).toBe(true);
    expect(isValidTemplateId("reimagined")).toBe(true);
  });

  it("retrieves valid registered template metadata for Signature", () => {
    const tpl = getTemplate("signature");
    expect(tpl).toBeDefined();
    expect(tpl?.metadata.id).toBe("signature");
    expect(tpl?.metadata.name).toBe("Signature");
    expect(tpl?.component).toBeDefined();
    expect(tpl?.metadata.supportedSections).toContain("profile");
    expect(tpl?.metadata.supportedSections).toContain("projects");
  });

  it("retrieves valid registered template metadata for Reimagined", () => {
    const tpl = getTemplate("reimagined");
    expect(tpl).toBeDefined();
    expect(tpl?.metadata.id).toBe("reimagined");
    expect(tpl?.metadata.name).toBe("Reimagined");
    expect(tpl?.component).toBeDefined();
    expect(tpl?.metadata.supportedSections).toContain("profile");
    expect(tpl?.metadata.supportedSections).toContain("projects");
  });

  it("renders SignatureTemplate server-side without crashing", () => {
    const portfolio = createEmptyPortfolio({
      profile: {
        fullName: "Jordan Lee",
        headline: "Principal Systems Engineer",
        bio: "Designing scalable backend architectures.",
      },
      appearance: {
        templateId: "signature",
        colorScheme: "dark",
        accentColor: "blue",
        fontFamily: "sans",
        designTokens: {
          colorScheme: "dark",
          accentColor: "blue",
          accentHex: "#356ae6",
          backgroundColor: "#0e1015",
          surfaceColor: "#181a20",
          textColor: "#f4f4f5",
          mutedTextColor: "#a1a1aa",
          borderColor: "#27272a",
          fontFamily: "sans",
          headingFont: "Inter, sans-serif",
          layoutDensity: "balanced",
          cardStyle: "bordered",
          headerLayout: "split",
        },
      },
    });

    const html = renderToString(React.createElement(PortfolioRenderer, { portfolio, isLivePreview: true }));
    expect(html).toContain("Jordan Lee");
    expect(html).toContain("Principal Systems Engineer");
    expect(html).toContain("Signature Direction");
  });

  it("renders ReimaginedTemplate server-side without crashing", () => {
    const portfolio = createEmptyPortfolio({
      profile: {
        fullName: "Morgan Taylor",
        headline: "Lead UX & Design Systems",
        bio: "Editorial design and human-centric software.",
      },
      appearance: {
        templateId: "reimagined",
        colorScheme: "system",
        accentColor: "neutral",
        fontFamily: "serif",
        designTokens: {
          colorScheme: "system",
          accentColor: "neutral",
          accentHex: "#18181b",
          backgroundColor: "#fafaf9",
          surfaceColor: "#f4f4f2",
          textColor: "#18181b",
          mutedTextColor: "#71717a",
          borderColor: "#e2e2e0",
          fontFamily: "serif",
          headingFont: "Georgia, serif",
          layoutDensity: "spacious",
          cardStyle: "flat",
          headerLayout: "editorial",
        },
      },
    });

    const html = renderToString(React.createElement(PortfolioRenderer, { portfolio, isLivePreview: true }));
    expect(html).toContain("Morgan Taylor");
    expect(html).toContain("Lead UX &amp; Design Systems");
    expect(html).toContain("Reimagined Direction");
  });

  it("handles zero-content states gracefully without inventing dummy production data", () => {
    const emptyPortfolio = createEmptyPortfolio({
      appearance: {
        templateId: "signature",
      },
    });

    const html = renderToString(React.createElement(PortfolioRenderer, { portfolio: emptyPortfolio, isLivePreview: false }));
    // Zero dummy data policy: Should NOT render fake achievements, fake companies, or fake testimonials
    expect(html).not.toContain("Acme Corp");
    expect(html).not.toContain("Invented Metric");
    expect(html).not.toContain("99.99% reliability");
  });
});
