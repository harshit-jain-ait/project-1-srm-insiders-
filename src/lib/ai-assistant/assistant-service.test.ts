import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiAssistantService, computeContentHash } from "./assistant-service";
import {
  ContentAssistRequestSchema,
  RestyleRequestSchema,
  RestyleResponseSchema,
  ContentAssistRequest,
  RestyleRequest,
} from "./types";
import { RESTYLE_PRESETS, getRestylePreset, getAllRestylePresets } from "./restyle-presets";
import { AppearanceSettingsSchema, AppearanceSettings } from "@/lib/schema/portfolio";
import { geminiProvider } from "@/lib/ai/gemini-provider";

describe("Part 11: AIAssistantService & Restyle System", () => {
  const originalEnv = process.env;

  const defaultAppearance: AppearanceSettings = {
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
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("A. Validation Schemas & Contracts", () => {
    it("validates a compliant ContentAssistRequest", () => {
      const payload: ContentAssistRequest = {
        operation: "improve_clarity",
        targetField: "bio",
        sourceText: "I build high scale distributed databases in Go and Rust.",
        tone: "professional",
        context: "10 years experience",
        sourceHash: "abc123hash",
      };

      const parsed = ContentAssistRequestSchema.parse(payload);
      expect(parsed.operation).toBe("improve_clarity");
      expect(parsed.targetField).toBe("bio");
      expect(parsed.tone).toBe("professional");
      expect(parsed.sourceHash).toBe("abc123hash");
    });

    it("rejects empty source text for content assistance", () => {
      expect(() =>
        ContentAssistRequestSchema.parse({
          operation: "fix_grammar",
          targetField: "headline",
          sourceText: "   ",
        })
      ).toThrow();
    });

    it("rejects excessive source text exceeding 3,000 chars", () => {
      expect(() =>
        ContentAssistRequestSchema.parse({
          operation: "improve_bio",
          targetField: "bio",
          sourceText: "a".repeat(3001),
        })
      ).toThrow();
    });

    it("validates a preset-based RestyleRequest", () => {
      const req: RestyleRequest = {
        currentAppearance: defaultAppearance,
        presetId: "technical-structured",
      };
      const parsed = RestyleRequestSchema.parse(req);
      expect(parsed.presetId).toBe("technical-structured");
    });

    it("validates a custom-prompt RestyleRequest", () => {
      const req: RestyleRequest = {
        currentAppearance: defaultAppearance,
        prompt: "Make it high contrast with monospace accents and dark slate backgrounds",
      };
      const parsed = RestyleRequestSchema.parse(req);
      expect(parsed.prompt).toContain("high contrast");
    });

    it("rejects invalid targetField", () => {
      expect(() =>
        ContentAssistRequestSchema.parse({
          operation: "improve_clarity",
          targetField: "unknown_target_field" as unknown,
          sourceText: "Valid text",
        })
      ).toThrow();
    });
  });

  describe("B. Content Hashing & Stale Suggestion Detection", () => {
    it("computes deterministic SHA-256 content hashes", () => {
      const text1 = "Senior Distributed Systems Engineer";
      const text2 = "Senior Distributed Systems Engineer";
      const hash1 = computeContentHash(text1);
      const hash2 = computeContentHash(text2);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(16);
    });

    it("trims whitespace before hashing for consistent comparison", () => {
      const text1 = "Full Stack Engineer  ";
      const text2 = "  Full Stack Engineer";
      expect(computeContentHash(text1)).toBe(computeContentHash(text2));
    });

    it("differentiates different text inputs", () => {
      const hash1 = computeContentHash("Version A");
      const hash2 = computeContentHash("Version B");
      expect(hash1).not.toBe(hash2);
    });

    it("flags suggestion as stale if sourceHash doesn't match current source text", async () => {
      const oldSource = "Original headline text";
      const newSource = "Updated headline text that user edited concurrently";
      const oldHash = computeContentHash(oldSource);

      const result = await aiAssistantService.improveContent({
        operation: "improve_headline",
        targetField: "headline",
        sourceText: newSource,
        sourceHash: oldHash, // Passing the stale hash from before the user edit
        tone: "professional",
      });

      expect(result.success).toBe(true);
      expect(result.data?.isStale).toBe(true);
      expect(result.data?.originalText).toBe(newSource);
    });

    it("flags suggestion as not stale if sourceHash matches current source text", async () => {
      const source = "Principal Systems Architect";
      const currentHash = computeContentHash(source);

      const result = await aiAssistantService.improveContent({
        operation: "improve_headline",
        targetField: "headline",
        sourceText: source,
        sourceHash: currentHash,
        tone: "professional",
      });

      expect(result.success).toBe(true);
      expect(result.data?.isStale).toBe(false);
    });
  });

  describe("C. Offline Deterministic Content Operations (Fallback Mode)", () => {
    it("improves clarity by cleaning double spaces and normalizing punctuation", async () => {
      const raw = "I   work on  backend systems  with    high throughput.";
      const res = await aiAssistantService.improveContent({
        operation: "improve_clarity",
        targetField: "bio",
        sourceText: raw,
        tone: "professional",
      });

      expect(res.success).toBe(true);
      expect(res.data?.suggestedText).toBe("I work on backend systems with high throughput.");
    });

    it("fixes grammar by capitalizing start and ensuring terminal punctuation", async () => {
      const raw = "engineered scalable cloud microservices";
      const res = await aiAssistantService.improveContent({
        operation: "fix_grammar",
        targetField: "bio",
        sourceText: raw,
        tone: "professional",
      });

      expect(res.success).toBe(true);
      expect(res.data?.suggestedText).toBe("Engineered scalable cloud microservices.");
    });

    it("shortens content by removing common filler words", async () => {
      const raw = "In order to basically optimize the API, we essentially utilized Redis.";
      const res = await aiAssistantService.improveContent({
        operation: "shorten",
        targetField: "project_description",
        sourceText: raw,
        tone: "concise",
      });

      expect(res.success).toBe(true);
      expect(res.data?.suggestedText).not.toContain("basically");
      expect(res.data?.suggestedText).not.toContain("essentially");
      expect(res.data?.suggestedText.length).toBeLessThan(raw.length);
    });

    it("improves bullet points without inventing unverified metrics", async () => {
      const raw = "worked on database indexing";
      const res = await aiAssistantService.improveContent({
        operation: "improve_bullet",
        targetField: "experience_highlight",
        sourceText: raw,
        tone: "professional",
      });

      expect(res.success).toBe(true);
      // Starts with strong verb
      expect(res.data?.suggestedText.charAt(0)).toBe(res.data?.suggestedText.charAt(0).toUpperCase());
      // Does not invent percentages or metrics
      expect(res.data?.suggestedText).not.toContain("%");
      expect(res.data?.suggestedText).not.toContain("$");
    });

    it("asks for clarification when expanding thin content rather than inventing details", async () => {
      const raw = "Built an app.";
      const res = await aiAssistantService.improveContent({
        operation: "expand_clarity",
        targetField: "project_description",
        sourceText: raw,
        tone: "professional",
      });

      expect(res.success).toBe(true);
      expect(res.data?.clarificationNeeded).toBeDefined();
      expect(res.data?.clarificationNeeded).toContain("Provide additional technical context");
    });

    it("adjusts tone cleanly", async () => {
      const raw = "I am a web dev who makes nice fast sites.";
      const res = await aiAssistantService.improveContent({
        operation: "adjust_tone",
        targetField: "bio",
        sourceText: raw,
        tone: "technical",
      });

      expect(res.success).toBe(true);
      expect(res.data?.suggestedText.length).toBeGreaterThan(0);
    });
  });

  describe("D. Restyle Presets & Appearance Schema Conformance", () => {
    it("provides curated, production-tested visual presets covering all registered templates", () => {
      const presets = getAllRestylePresets();
      expect(presets).toHaveLength(11);
      const ids = presets.map((p) => p.id);
      expect(ids).toContain("minimal-editorial");
      expect(ids).toContain("modern-professional");
      expect(ids).toContain("technical-structured");
      expect(ids).toContain("creative-expressive");
      expect(ids).toContain("bold-high-contrast");
      expect(ids).toContain("bento-grid");
      expect(ids).toContain("editorial-literary");
      expect(ids).toContain("creative-interactive");
      expect(ids).toContain("product-specs");
      expect(ids).toContain("kinetic-engineer");
      expect(ids).toContain("designer-craft");
    });

    it("ensures every preset satisfies the canonical AppearanceSettingsSchema", () => {
      for (const preset of Object.values(RESTYLE_PRESETS)) {
        const appearance: AppearanceSettings = {
          templateId: preset.templateId,
          colorScheme: preset.colorScheme,
          accentColor: preset.accentColor,
          fontFamily: preset.fontFamily,
          designTokens: preset.designTokens,
        };
        const validated = AppearanceSettingsSchema.safeParse(appearance);
        expect(validated.success).toBe(true);
      }
    });

    it("strictly adheres to the design system palette (no purple/violet gradients)", () => {
      for (const preset of Object.values(RESTYLE_PRESETS)) {
        const tokens = preset.designTokens;
        // Verify primary / accent hex avoids purple/violet
        if (tokens?.accentHex) {
          expect(tokens.accentHex.toLowerCase()).not.toContain("8a2be2");
          expect(tokens.accentHex.toLowerCase()).not.toContain("9333ea");
          expect(tokens.accentHex.toLowerCase()).not.toContain("7c3aed");
        }
      }
    });

    it("retrieves a specific preset by ID", () => {
      const preset = getRestylePreset("technical-structured");
      expect(preset).toBeDefined();
      expect(preset?.name).toBe("Technical Structured");
      expect(preset?.fontFamily).toBe("mono");
    });

    it("returns undefined for non-existent preset ID", () => {
      // @ts-expect-error Testing non-existent ID
      expect(getRestylePreset("non-existent-style")).toBeUndefined();
    });
  });

  describe("E. Restyling Application & Content Preservation", () => {
    it("applies preset restyle and returns valid RestyleResponse", async () => {
      const res = await aiAssistantService.generateRestyling({
        currentAppearance: defaultAppearance,
        presetId: "minimal-editorial",
      });

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.proposedAppearance.templateId).toBe("minimal-portfolio");
      expect(res.data?.proposedAppearance.fontFamily).toBe("serif");
      expect(res.data?.explanation).toContain("reading comfort");

      // Verify returned data passes RestyleResponseSchema
      const validated = RestyleResponseSchema.parse(res.data);
      expect(validated.presetId).toBe("minimal-editorial");
    });

    it("applies technical preset with dark scheme and monospace font", async () => {
      const res = await aiAssistantService.generateRestyling({
        currentAppearance: defaultAppearance,
        presetId: "technical-structured",
      });

      expect(res.success).toBe(true);
      expect(res.data?.proposedAppearance.templateId).toBe("developer-pro");
      expect(res.data?.proposedAppearance.fontFamily).toBe("mono");
      expect(res.data?.proposedAppearance.colorScheme).toBe("dark");
    });

    it("maps custom prompt to closest preset styling in offline fallback mode", async () => {
      const res = await aiAssistantService.generateRestyling({
        currentAppearance: defaultAppearance,
        prompt: "I want an ultra clean minimal editorial look with serif headings",
      });

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.presetId).toBe("minimal-editorial");
      expect(res.data?.proposedAppearance.fontFamily).toBe("serif");
    });

    it("maps developer code prompt to technical preset in offline fallback mode", async () => {
      const res = await aiAssistantService.generateRestyling({
        currentAppearance: defaultAppearance,
        prompt: "High density terminal engineering layout for backend software engineering with monospace fonts",
      });

      expect(res.success).toBe(true);
      expect(res.data?.presetId).toBe("technical-structured");
      expect(res.data?.proposedAppearance.fontFamily).toBe("mono");
    });

    it("maps tactile interaction design prompt to designer-craft preset in offline fallback mode", async () => {
      const res = await aiAssistantService.generateRestyling({
        currentAppearance: defaultAppearance,
        prompt: "Tactile micro-interaction design portfolio inspired by Jackie Hu with Paris aesthetic",
      });

      expect(res.success).toBe(true);
      expect(res.data?.presetId).toBe("designer-craft");
      expect(res.data?.proposedAppearance.templateId).toBe("designer-craft");
    });
  });

  describe("F. Provider Mocking & Error Recovery", () => {
    it("handles live Gemini provider response correctly when API key is present", async () => {
      process.env.GEMINI_API_KEY = "dummy-test-key";

      const mockExecute = vi.spyOn(geminiProvider, "executeStructuredPrompt").mockResolvedValue({
        success: true,
        data: {
          originalText: "I build websites.",
          suggestedText: "I design and develop responsive web applications with modern frontend architectures.",
          operation: "improve_clarity",
          explanation: "Enhanced specificity regarding development focus without inventing unsupported achievements.",
          clarificationNeeded: undefined,
        },
      });

      const res = await aiAssistantService.improveContent({
        operation: "improve_clarity",
        targetField: "headline",
        sourceText: "I build websites.",
        tone: "professional",
      });

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(res.success).toBe(true);
      expect(res.data?.suggestedText).toContain("responsive web applications");
      expect(res.data?.isStale).toBe(false);
    });

    it("falls back gracefully when Gemini provider encounters a rate limit", async () => {
      process.env.GEMINI_API_KEY = "dummy-test-key";

      vi.spyOn(geminiProvider, "executeStructuredPrompt").mockResolvedValue({
        success: false,
        error: "Resource exhausted (rate limit reached)",
        code: "RATE_LIMITED",
      });

      // Without local fallback (or testing fallback generation)
      const res = await aiAssistantService.improveContent({
        operation: "fix_grammar",
        targetField: "bio",
        sourceText: "developed fast api endpoints",
        tone: "professional",
      });

      // Because fallback generates valid response for fix_grammar, it recovers gracefully
      expect(res.success).toBe(true);
      expect(res.data?.suggestedText).toBe("Developed fast api endpoints.");
    });
  });
});
