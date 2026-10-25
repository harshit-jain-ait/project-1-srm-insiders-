import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as contentAssistHandler } from "@/app/api/ai/content-assist/route";
import { POST as restyleHandler } from "@/app/api/ai/restyle/route";
import { aiAssistantService } from "@/lib/ai-assistant/assistant-service";
import { AppearanceSettings } from "@/lib/schema/portfolio";

import { getDatabase } from "@/lib/db/database";

describe("Part 11: AI Assistant & Restyling API Endpoints", () => {
  const originalEnv = process.env;

  const validAppearance: AppearanceSettings = {
    templateId: "minimal-portfolio",
    colorScheme: "dark",
    accentColor: "blue",
    fontFamily: "sans",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      fontFamily: "sans",
      layoutDensity: "balanced",
      cardStyle: "bordered",
      headerLayout: "split",
    },
  };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API_KEY;
    try {
      getDatabase().prepare("DELETE FROM usage_records WHERE user_id = 'anonymous'").run();
    } catch {
      // Ignore if table not yet created
    }
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("POST /api/ai/content-assist", () => {
    it("returns 400 when request payload fails schema validation", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/content-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "improve_clarity",
          targetField: "headline",
          sourceText: "   ", // Invalid empty text
        }),
      });

      const response = await contentAssistHandler(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("INVALID_SCHEMA");
    });

    it("returns 200 and structured suggestion for valid content assist request", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/content-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "fix_grammar",
          targetField: "bio",
          sourceText: "architected distributed streaming pipeline",
          tone: "professional",
        }),
      });

      const response = await contentAssistHandler(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(json.data.originalText).toBe("architected distributed streaming pipeline");
      expect(json.data.suggestedText).toBe("Architected distributed streaming pipeline.");
      expect(json.data.operation).toBe("fix_grammar");
      expect(json.data.isStale).toBe(false);
    });

    it("returns 429 when AI provider reports RATE_LIMITED", async () => {
      vi.spyOn(aiAssistantService, "improveContent").mockResolvedValueOnce({
        success: false,
        code: "RATE_LIMITED",
        error: "Rate limit reached. Please wait a moment before trying again.",
      });

      const request = new NextRequest("http://localhost:3000/api/ai/content-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "shorten",
          targetField: "bio",
          sourceText: "In order to streamline the application, we removed boilerplate.",
        }),
      });

      const response = await contentAssistHandler(request);
      expect(response.status).toBe(429);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("RATE_LIMITED");
    });
  });

  describe("POST /api/ai/restyle", () => {
    it("returns 400 when currentAppearance is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/restyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presetId: "minimal-editorial",
        }),
      });

      const response = await restyleHandler(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("INVALID_SCHEMA");
    });

    it("returns 200 with valid proposedAppearance for preset restyle", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/restyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAppearance: validAppearance,
          presetId: "technical-structured",
        }),
      });

      const response = await restyleHandler(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.presetId).toBe("technical-structured");
      expect(json.data.proposedAppearance.templateId).toBe("developer-pro");
      expect(json.data.proposedAppearance.fontFamily).toBe("mono");
    });

    it("returns 200 with valid proposedAppearance for natural language prompt", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/restyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAppearance: validAppearance,
          prompt: "High contrast monochrome design with compact layouts",
        }),
      });

      const response = await restyleHandler(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.proposedAppearance).toBeDefined();
      expect(json.data.styleName).toBeDefined();
    });

    it("returns 429 when restyling reports RATE_LIMITED", async () => {
      vi.spyOn(aiAssistantService, "generateRestyling").mockResolvedValueOnce({
        success: false,
        code: "RATE_LIMITED",
        error: "Rate limit reached. Please wait a moment before trying again.",
      });

      const request = new NextRequest("http://localhost:3000/api/ai/restyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAppearance: validAppearance,
          prompt: "Futuristic layout",
        }),
      });

      const response = await restyleHandler(request);
      expect(response.status).toBe(429);
      const json = await response.json();
      expect(json.code).toBe("RATE_LIMITED");
    });
  });
});
