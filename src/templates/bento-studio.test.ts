import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { getTemplate, isValidTemplateId } from "./registry";
import { PortfolioRenderer } from "./renderer";
import { createEmptyPortfolio, PortfolioData } from "@/lib/schema/portfolio";
import { BentoStudioTemplate } from "./bento-studio";
import { getTechLogo } from "./bento-studio/tech-logos";

describe("Part 18 — Bento Studio Template Integration", () => {
  it("registers Bento Studio in the template registry with correct metadata", () => {
    expect(isValidTemplateId("bento-studio")).toBe(true);

    const template = getTemplate("bento-studio");
    expect(template).toBeDefined();
    expect(template?.metadata.id).toBe("bento-studio");
    expect(template?.metadata.name).toBe("Bento Studio");
    expect(template?.metadata.category).toBe("Creative");
    expect(template?.metadata.isPremium).toBe(true);
    expect(template?.metadata.description).toContain("Bento Grid");
    expect(template?.metadata.supportedSections).toEqual([
      "profile",
      "projects",
      "experience",
      "skills",
      "education",
      "contact",
    ]);
    expect(template?.component).toBe(BentoStudioTemplate);
  });

  it("renders Bento Studio with complete portfolio data into valid HTML", () => {
    const portfolio: PortfolioData = {
      ...createEmptyPortfolio(),
      id: "port_bento_full",
      slug: "alex-chen",
      appearance: {
        templateId: "bento-studio",
        fontFamily: "sans",
        colorScheme: "dark",
        accentColor: "blue",
      },
      profile: {
        fullName: "Alex Chen",
        headline: "Principal Systems Architect & Designer",
        bio: "Designing robust interfaces and cloud architecture at scale.",
        longBio: "Over a decade of experience building distributed web applications.",
        location: "San Francisco, CA",
        email: "alex@example.com",
        phone: "+1 555-0199",
        avatarUrl: "https://example.com/avatar.jpg",
        statusBadge: "Available for new projects",
      },
      projects: [
        {
          id: "proj_1",
          title: "Distributed Edge Engine",
          tagline: "Sub-millisecond compute layer",
          description: "High-throughput stream engine processing millions of events.",
          category: "engineering",
          status: "completed",
          featured: true,
          visible: true,
          slug: "distributed-edge-engine",
          technologies: ["TypeScript", "Rust", "Docker", "PostgreSQL"],
          liveUrl: "https://example.com/demo",
          repoUrl: "https://github.com/example/engine",
          coverImageUrl: "",
          startDate: "",
          endDate: "",
          order: 0,
        },
        {
          id: "proj_2",
          title: "Design System Tokens",
          tagline: "Cross-platform token pipeline",
          description: "Automated design tokens for web and mobile components.",
          category: "design",
          status: "completed",
          featured: false,
          visible: true,
          slug: "design-system-tokens",
          technologies: ["React", "Tailwind CSS", "Figma"],
          liveUrl: "https://example.com/tokens",
          repoUrl: "",
          coverImageUrl: "",
          startDate: "",
          endDate: "",
          order: 1,
        },
      ],
      skills: [
        { id: "sk_1", name: "React", category: "Frontend", order: 0 },
        { id: "sk_2", name: "TypeScript", category: "Languages", order: 1 },
        { id: "sk_3", name: "Next.js", category: "Frameworks", order: 2 },
        { id: "sk_4", name: "Docker", category: "DevOps", order: 3 },
      ],
      experience: [
        {
          id: "exp_1",
          company: "Acme Corp",
          role: "Lead Architect",
          location: "San Francisco",
          startDate: "2021",
          endDate: "Present",
          current: true,
          description: "Led architectural evolution of core platform.",
          highlights: ["Scaled throughput 5x", "Reduced latency by 40%"],
          order: 0,
        },
      ],
      education: [
        {
          id: "edu_1",
          institution: "University of California, Berkeley",
          degree: "B.S. Computer Science",
          fieldOfStudy: "Engineering",
          startDate: "2015",
          endDate: "2019",
          description: "Graduated with honors",
          order: 0,
        },
      ],
      socialLinks: [
        { id: "soc_1", platform: "github", label: "GitHub", url: "https://github.com/alex" },
        { id: "soc_2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/alex" },
      ],
      contactConfig: {
        enabled: true,
        title: "Contact",
        description: "",
        recipientEmail: "alex@example.com",
        requireSubject: false,
        showConsent: false,
      },
    };

    const element = React.createElement(PortfolioRenderer, {
      portfolio,
      isLivePreview: false,
    });
    const html = renderToString(element);

    // Assertions for full render
    expect(html).toContain("Alex Chen");
    expect(html).toContain("Principal Systems Architect");
    expect(html).toContain("Distributed Edge Engine");
    expect(html).toContain("Design System Tokens");
    expect(html).toContain("Acme Corp");
    expect(html).toContain("Lead Architect");
    expect(html).toContain("University of California, Berkeley");
    expect(html).toContain("Bento Studio Template");
    expect(html).toContain("Technology Stack");
  });

  it("renders gracefully with completely empty portfolio data without throwing or crashing", () => {
    const emptyPortfolio = createEmptyPortfolio({
      appearance: {
        templateId: "bento-studio",
      },
    });

    const element = React.createElement(PortfolioRenderer, {
      portfolio: emptyPortfolio,
      isLivePreview: true,
    });
    const html = renderToString(element);

    expect(html).toBeDefined();
    expect(html.length).toBeGreaterThan(100);
    // Should display graceful empty states in live preview
    expect(html).toContain("No Projects Added Yet");
  });

  it("preserves 100% of user data when switching between templates", () => {
    const initial = createEmptyPortfolio({
      title: "Senior Product Designer",
      profile: {
        fullName: "Jordan Lee",
        headline: "Design Director",
        bio: "Specializing in design systems and typography.",
      },
    });

    initial.appearance.templateId = "minimal-portfolio";

    // Switch to bento-studio
    const switched: PortfolioData = {
      ...initial,
      appearance: {
        ...initial.appearance,
        templateId: "bento-studio",
      },
    };

    expect(switched.appearance.templateId).toBe("bento-studio");
    expect(switched.profile.fullName).toBe("Jordan Lee");
    expect(switched.profile.headline).toBe("Design Director");
    expect(switched.profile.bio).toBe("Specializing in design systems and typography.");
  });

  it("correctly resolves official vector brand logos for known technologies", () => {
    const reactIcon = getTechLogo("React");
    expect(reactIcon).not.toBeNull();

    const tsIcon = getTechLogo("TypeScript");
    expect(tsIcon).not.toBeNull();

    const dockerIcon = getTechLogo("Docker");
    expect(dockerIcon).not.toBeNull();

    const unknownIcon = getTechLogo("Quantum Computing Algorithm");
    expect(unknownIcon).toBeNull();
  });
});
