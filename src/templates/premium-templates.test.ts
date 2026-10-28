import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { getTemplate, getAllTemplates, isValidTemplateId } from "./registry";
import { TemplateIdSchema, TemplateId, createEmptyPortfolio } from "@/lib/schema/portfolio";
import { canAccessTemplate, setUserSubscription } from "@/lib/billing/entitlements";
import { isPremiumTemplate } from "@/lib/billing/plans";
import { getDatabase, runMigrations } from "@/lib/db/database";

describe("Part 15 — Premium Templates & Advanced Visual Experiences", () => {
  beforeEach(() => {
    const db = getDatabase();
    runMigrations(db);
  });

  describe("Template Registry & Metadata Integrity", () => {
    it("registers all templates in TemplateIdSchema and template registry", () => {
      const allIds = [
        "minimal-portfolio",
        "developer-pro",
        "signature",
        "reimagined",
        "editorial-studio",
        "creative-motion",
        "product-engineer",
        "bento-studio",
        "kinetic-studio",
        "designer-craft",
      ];

      for (const id of allIds) {
        expect(TemplateIdSchema.safeParse(id).success).toBe(true);
        expect(isValidTemplateId(id)).toBe(true);
        const tpl = getTemplate(id as TemplateId);
        expect(tpl).toBeDefined();
        expect(tpl?.metadata.id).toBe(id);
        expect(tpl?.component).toBeDefined();
      }

      const registered = getAllTemplates();
      expect(registered).toHaveLength(10);
    });

    it("correctly identifies free vs premium templates", () => {
      expect(isPremiumTemplate("minimal-portfolio")).toBe(false);
      expect(isPremiumTemplate("developer-pro")).toBe(false);

      expect(isPremiumTemplate("signature")).toBe(true);
      expect(isPremiumTemplate("reimagined")).toBe(true);
      expect(isPremiumTemplate("editorial-studio")).toBe(true);
      expect(isPremiumTemplate("creative-motion")).toBe(true);
      expect(isPremiumTemplate("product-engineer")).toBe(true);
      expect(isPremiumTemplate("bento-studio")).toBe(true);
      expect(isPremiumTemplate("kinetic-studio")).toBe(true);
      expect(isPremiumTemplate("designer-craft")).toBe(true);

      const editorial = getTemplate("editorial-studio");
      expect(editorial?.metadata.isPremium).toBe(true);
      const motion = getTemplate("creative-motion");
      expect(motion?.metadata.isPremium).toBe(true);
      const product = getTemplate("product-engineer");
      expect(product?.metadata.isPremium).toBe(true);
      const bento = getTemplate("bento-studio");
      expect(bento?.metadata.isPremium).toBe(true);
      const kinetic = getTemplate("kinetic-studio");
      expect(kinetic?.metadata.isPremium).toBe(true);
      const craft = getTemplate("designer-craft");
      expect(craft?.metadata.isPremium).toBe(true);
    });
  });

  describe("Server-Side Entitlement Enforcement", () => {
    const freeUserId = "usr-test-free-templates";
    const proUserId = "usr-test-pro-templates";

    it("permits free users to access all 2 free templates but denies premium templates", () => {
      setUserSubscription(freeUserId, "free");

      // Free templates allowed
      expect(canAccessTemplate(freeUserId, "minimal-portfolio")).toBe(true);
      expect(canAccessTemplate(freeUserId, "developer-pro")).toBe(true);

      // Premium templates rejected for Free users
      expect(canAccessTemplate(freeUserId, "signature")).toBe(false);
      expect(canAccessTemplate(freeUserId, "reimagined")).toBe(false);
      expect(canAccessTemplate(freeUserId, "editorial-studio")).toBe(false);
      expect(canAccessTemplate(freeUserId, "creative-motion")).toBe(false);
      expect(canAccessTemplate(freeUserId, "product-engineer")).toBe(false);
    });

    it("permits Pro subscribers to access all templates including premium", () => {
      setUserSubscription(proUserId, "pro");

      expect(canAccessTemplate(proUserId, "minimal-portfolio")).toBe(true);
      expect(canAccessTemplate(proUserId, "developer-pro")).toBe(true);
      expect(canAccessTemplate(proUserId, "editorial-studio")).toBe(true);
      expect(canAccessTemplate(proUserId, "creative-motion")).toBe(true);
      expect(canAccessTemplate(proUserId, "product-engineer")).toBe(true);
    });
  });

  describe("Template Server-Side Rendering & Content Resilience", () => {
    const mockFullPortfolio = createEmptyPortfolio({
      title: "Cassian Vance | Principal Architect",
      profile: {
        fullName: "Cassian Vance",
        headline: "Distributed Systems & Machine Learning",
        bio: "Specializing in high-throughput streaming architectures.",
        email: "cassian@vance.systems",
        location: "Zurich, Switzerland",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      },
      skills: [
        { id: "sk-1", name: "Rust", category: "Language", level: "expert" },
        { id: "sk-2", name: "Kubernetes", category: "Infra", level: "advanced" },
      ],
      projects: [
        {
          id: "proj-1",
          title: "Vortex Distributed Cache",
          tagline: "Sub-millisecond lock-free caching engine",
          description: "High-performance distributed key-value store built in Rust.",
          technologies: ["Rust", "Distributed Systems", "Networking"],
          visible: true,
          caseStudy: {
            overview: "Overview of high-concurrency memory layout.",
            role: "Systems Architect",
            team: "Core Platform",
            client: "Internal Infra",
            timeline: "6 months",
            sections: [],
            problem: "Zero-copy deserialization across network boundaries.",
            solution: "Memory-mapped lock-free ring buffers.",
            process: "Benchmarked memory access patterns.",
            outcomes: "Reduced p99 tail latency by 84%.",
            technologies: ["Rust", "eBPF"],
            liveUrl: "",
            repoUrl: "",
            mediaUrls: [],
          },
        },
      ],
      experience: [
        {
          id: "exp-1",
          company: "HyperScale Corp",
          role: "Staff Infrastructure Engineer",
          startDate: "2021",
          endDate: "Present",
          current: true,
          description: "Leading data pipeline reliability for petabyte-scale workloads.",
          highlights: ["Engineered multi-region replication fabric."],
        },
      ],
      contactConfig: {
        enabled: true,
        title: "Initiate Communication",
        description: "Direct transmission channel for professional inquiries.",
        recipientEmail: "cassian@vance.systems",
        requireSubject: true,
        showConsent: true,
      },
    });

    it("renders Editorial Studio template with full content and contact form", () => {
      const tpl = getTemplate("editorial-studio");
      expect(tpl).toBeDefined();

      const html = renderToString(React.createElement(tpl!.component, { portfolio: mockFullPortfolio }));
      expect(html).toContain("Cassian Vance");
      expect(html).toContain("Distributed Systems &amp; Machine Learning");
      expect(html).toContain("Vortex Distributed Cache");
      expect(html).toContain("Contact");
      expect(html).toContain("Send Message");
    });

    it("renders Editorial Studio template with empty portfolio without errors", () => {
      const empty = createEmptyPortfolio({ appearance: { templateId: "editorial-studio" } });
      const tpl = getTemplate("editorial-studio");

      const html = renderToString(React.createElement(tpl!.component, { portfolio: empty }));
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(100);
    });

    it("renders Creative Motion template with full content, spotlight elements, and contact form", () => {
      const tpl = getTemplate("creative-motion");
      expect(tpl).toBeDefined();

      const html = renderToString(React.createElement(tpl!.component, { portfolio: mockFullPortfolio }));
      expect(html).toContain("Cassian Vance");
      expect(html).toContain("Vortex Distributed Cache");
      expect(html).toContain("Contact");
      expect(html).toContain("Send Message");
    });

    it("renders Creative Motion template with empty portfolio safely", () => {
      const empty = createEmptyPortfolio({ appearance: { templateId: "creative-motion" } });
      const tpl = getTemplate("creative-motion");

      const html = renderToString(React.createElement(tpl!.component, { portfolio: empty }));
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(100);
    });

    it("renders Product Engineer template with terminal aesthetics and full content", () => {
      const tpl = getTemplate("product-engineer");
      expect(tpl).toBeDefined();

      const html = renderToString(React.createElement(tpl!.component, { portfolio: mockFullPortfolio }));
      expect(html).toContain("Cassian Vance");
      expect(html).toContain("Vortex Distributed Cache");
      expect(html).toContain("Host Architecture");
      expect(html).toContain("Terminal Messaging Channel");
      expect(html).toContain("Send Message");
    });

    it("renders Product Engineer template with empty portfolio without crashing", () => {
      const empty = createEmptyPortfolio({ appearance: { templateId: "product-engineer" } });
      const tpl = getTemplate("product-engineer");

      const html = renderToString(React.createElement(tpl!.component, { portfolio: empty }));
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(100);
    });

    it("renders Kinetic Studio template with kinetic statement, marquee, and full content", () => {
      const tpl = getTemplate("kinetic-studio");
      expect(tpl).toBeDefined();

      const html = renderToString(React.createElement(tpl!.component, { portfolio: mockFullPortfolio }));
      expect(html).toContain("Cassian Vance");
      expect(html).toContain("Vortex Distributed Cache");
      expect(html).toContain("01 — About");
      expect(html).toContain("02 — Work");
      expect(html).toContain("Let&#x27;s build something.");
      expect(html).toContain("Kinetic Engineering Studio");
    });

    it("renders Kinetic Studio template with empty portfolio safely", () => {
      const empty = createEmptyPortfolio({ appearance: { templateId: "kinetic-studio" } });
      const tpl = getTemplate("kinetic-studio");

      const html = renderToString(React.createElement(tpl!.component, { portfolio: empty }));
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(100);
    });

    it("renders Designer Craft template with floating capsule nav, AirDrop capsule, and full content", () => {
      const tpl = getTemplate("designer-craft");
      expect(tpl).toBeDefined();

      const html = renderToString(React.createElement(tpl!.component, { portfolio: mockFullPortfolio }));
      expect(html).toContain("Cassian Vance");
      expect(html).toContain("Recently Made");
      expect(html).toContain("Craft &amp; Principles");
      expect(html).toContain("AirDrop");
      expect(html).toContain("Vortex Distributed Cache");
    });

    it("renders Designer Craft template with empty portfolio safely", () => {
      const empty = createEmptyPortfolio({ appearance: { templateId: "designer-craft" } });
      const tpl = getTemplate("designer-craft");

      const html = renderToString(React.createElement(tpl!.component, { portfolio: empty }));
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(100);
    });
  });
});
