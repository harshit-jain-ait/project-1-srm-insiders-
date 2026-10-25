import { describe, it, expect } from "vitest";
import { extractDesignFromHtml } from "./design-extractor";

describe("Design & Content Extractor Engine", () => {
  it("extracts page title, description, and metadata from standard HTML", () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Jane Doe — Senior Product Designer</title>
          <meta name="description" content="Designing thoughtful digital systems and accessible design tools." />
          <meta name="theme-color" content="#1e40af" />
        </head>
        <body>
          <h1>Designing digital products with craft and purpose</h1>
          <p>Over eight years leading product design for infrastructure and developer tooling.</p>
        </body>
      </html>
    `;

    const result = extractDesignFromHtml(html, "https://janedoe.design", "janedoe.design");

    expect(result.pageTitle).toBe("Jane Doe — Senior Product Designer");
    expect(result.metaDescription).toBe("Designing thoughtful digital systems and accessible design tools.");
    expect(result.extractedContent.headline).toContain("Designing digital products with craft");
    expect(result.extractedContent.bioSnippet).toContain("Over eight years leading product design");
    expect(result.palette.accent).toBe("#1e40af");
  });

  it("extracts OpenGraph tags when standard meta tags are absent", () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Devon Vance — Systems Architect" />
          <meta property="og:description" content="Distributed database engineering and high-scale backends." />
        </head>
        <body>
          <main>
            <h1>High-throughput distributed systems</h1>
          </main>
        </body>
      </html>
    `;

    const result = extractDesignFromHtml(html, "https://devonvance.dev", "devonvance.dev");
    expect(result.pageTitle).toBe("Devon Vance — Systems Architect");
    expect(result.metaDescription).toBe("Distributed database engineering and high-scale backends.");
  });

  it("strictly enforces Portfolify color rule: filters out purple/violet colors", () => {
    // Purple accent (#8b5cf6, #9333ea, #7c3aed)
    const htmlWithPurple = `
      <html>
        <head>
          <meta name="theme-color" content="#8b5cf6" />
          <style>
            .brand { color: #9333ea; background-color: #ffffff; }
          </style>
        </head>
        <body>
          <h1>Violet Studios</h1>
        </body>
      </html>
    `;

    const result = extractDesignFromHtml(htmlWithPurple, "https://violet.studio", "violet.studio");

    // The accent must NOT be purple/violet; should fall back to Portfolify standard blue/neutral
    expect(result.palette.accent).not.toBe("#8b5cf6");
    expect(result.palette.accent).not.toBe("#9333ea");
    expect(result.palette.accent).toBe("#356ae6");
  });

  it("detects dark mode vs light mode theme base accurately", () => {
    const darkHtml = `
      <html>
        <head>
          <style>
            body { background: #0e1015; color: #f4f4f5; }
            .card { background: #181a20; border: 1px solid #27272a; }
            .footer { background: #000000; color: #a1a1aa; }
          </style>
        </head>
        <body><h1>Dark Mode Engineering</h1></body>
      </html>
    `;

    const darkResult = extractDesignFromHtml(darkHtml, "https://dark.dev", "dark.dev");
    expect(darkResult.palette.isDark).toBe(true);
    expect(darkResult.palette.background).toBe("#0e1015");

    const lightHtml = `
      <html>
        <head>
          <style>
            body { background: #ffffff; color: #18181b; }
            .card { background: #f8f8f8; border: 1px solid #e4e4e7; }
          </style>
        </head>
        <body><h1>Light Mode Editorial</h1></body>
      </html>
    `;

    const lightResult = extractDesignFromHtml(lightHtml, "https://light.com", "light.com");
    expect(lightResult.palette.isDark).toBe(false);
  });

  it("identifies typography characteristics and mood correctly", () => {
    const serifHtml = `
      <html>
        <head><style>body { font-family: "Playfair Display", Georgia, serif; }</style></head>
        <body><h1>Literary Journal</h1></body>
      </html>
    `;
    const serifResult = extractDesignFromHtml(serifHtml, "https://journal.org", "journal.org");
    expect(serifResult.typography.fontFamily).toBe("serif");
    expect(serifResult.typography.mood).toBe("editorial");

    const monoHtml = `
      <html>
        <head><style>body { font-family: "JetBrains Mono", monospace; }</style></head>
        <body><h1>CLI Tool Documentation</h1></body>
      </html>
    `;
    const monoResult = extractDesignFromHtml(monoHtml, "https://cli.tech", "cli.tech");
    expect(monoResult.typography.fontFamily).toBe("mono");
    expect(monoResult.typography.mood).toBe("technical");
  });

  it("detects page sections from content markup", () => {
    const multiSectionHtml = `
      <html>
        <body>
          <nav><a>About</a><a>Projects</a><a>Experience</a><a>Contact</a></nav>
          <section id="work"><h2>Case Studies and Projects</h2></section>
          <section id="career"><h2>Employment & Experience Timeline</h2></section>
          <section id="skills"><h2>Technical Stack & Languages</h2></section>
          <section id="contact"><h2>Get in Touch via Email</h2></section>
        </body>
      </html>
    `;

    const result = extractDesignFromHtml(multiSectionHtml, "https://engineer.com", "engineer.com");
    expect(result.extractedContent.detectedSections).toContain("projects");
    expect(result.extractedContent.detectedSections).toContain("experience");
    expect(result.extractedContent.detectedSections).toContain("skills");
    expect(result.extractedContent.detectedSections).toContain("contact");
  });

  it("gracefully handles empty HTML or missing tags without crashing", () => {
    const emptyResult = extractDesignFromHtml("", "https://blank.site", "blank.site");
    expect(emptyResult.pageTitle).toBe("");
    expect(emptyResult.metaDescription).toBe("");
    expect(emptyResult.palette).toBeDefined();
    expect(emptyResult.typography).toBeDefined();
    expect(emptyResult.layout).toBeDefined();
    expect(emptyResult.limitations.length).toBeGreaterThan(0);
  });
});
