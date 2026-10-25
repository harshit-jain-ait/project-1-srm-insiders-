import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as handleUrlAnalyze } from "./url-analyze/route";
import { POST as handleGenerateDirections } from "./generate-directions/route";
import { NextRequest } from "next/server";
import { WebsiteDesignAnalysis } from "@/lib/url-import/types";

describe("URL Import & Direction Synthesis API Endpoints", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("POST /api/ai/url-analyze", () => {
    it("returns 400 when URL is missing or malformed", async () => {
      const req = new NextRequest("http://localhost:3000/api/ai/url-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "not-a-valid-url", confirmPermission: true }),
      });

      const res = await handleUrlAnalyze(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.code).toBe("INVALID_URL");
    });

    it("returns 400 with PERMISSION_REQUIRED when confirmPermission is false", async () => {
      const req = new NextRequest("http://localhost:3000/api/ai/url-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://example.com", confirmPermission: false }),
      });

      const res = await handleUrlAnalyze(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.code).toBe("PERMISSION_REQUIRED");
      expect(data.error).toContain("permission or ownership");
    });

    it("returns 403 with SSRF_BLOCKED when target is a loopback or private network destination", async () => {
      const req = new NextRequest("http://localhost:3000/api/ai/url-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "http://127.0.0.1:80", confirmPermission: true }),
      });

      const res = await handleUrlAnalyze(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.code).toBe("SSRF_BLOCKED");
      expect(data.error).toContain("blocked");
    });

    it("returns 200 with extracted design analysis on safe, valid HTML response", async () => {
      const sampleHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Alex River — Creative Technologist</title>
            <meta name="description" content="Exploring generative algorithms and typography." />
            <meta name="theme-color" content="#2563eb" />
          </head>
          <body>
            <h1>Creative Technology Studio</h1>
            <p>Developing interactive experiences and design systems.</p>
          </body>
        </html>
      `;

      vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response(sampleHtml, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        })
      );

      const req = new NextRequest("http://localhost:3000/api/ai/url-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://example.com", confirmPermission: true }),
      });

      const res = await handleUrlAnalyze(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.pageTitle).toBe("Alex River — Creative Technologist");
      expect(data.data.palette.accent).toBe("#2563eb");
      expect(data.data.typography.fontFamily).toBe("sans");
    });
  });

  describe("POST /api/ai/generate-directions", () => {
    const mockAnalysis: WebsiteDesignAnalysis = {
      sourceUrl: "https://example.com",
      resolvedHost: "example.com",
      timestamp: new Date().toISOString(),
      pageTitle: "Example Portfolio",
      metaDescription: "Test description",
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
        headline: "Software Engineer",
        bioSnippet: "Building modern web platforms.",
        detectedSections: ["profile", "projects"],
        projectHighlights: [],
      },
      limitations: [],
    };

    it("returns 400 if confirmPermission is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/ai/generate-directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: mockAnalysis, confirmPermission: false }),
      });

      const res = await handleGenerateDirections(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.code).toBe("PERMISSION_REQUIRED");
    });

    it("returns 200 with exactly Signature and Reimagined directions", async () => {
      const req = new NextRequest("http://localhost:3000/api/ai/generate-directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: mockAnalysis, confirmPermission: true }),
      });

      const res = await handleGenerateDirections(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.signature).toBeDefined();
      expect(data.data.reimagined).toBeDefined();
      expect(data.data.signature.name).toBe("Signature");
      expect(data.data.reimagined.name).toBe("Reimagined");
      expect(data.data.signature.baseTemplateId).toBe("signature");
      expect(data.data.reimagined.baseTemplateId).toBe("reimagined");
    });
  });
});
