import crypto from "crypto";
import { geminiProvider } from "@/lib/ai/gemini-provider";
import {
  ContentAssistRequest,
  ContentAssistResponse,
  ContentAssistResponseSchema,
  RestyleRequest,
  RestyleResponse,
  AssistantApiResponse,
} from "./types";
import {
  AppearanceSettingsSchema,
  AppearanceSettings,
} from "@/lib/schema/portfolio";
import { getRestylePreset } from "./restyle-presets";

/**
 * Computes a fast deterministic SHA-256 hash of a string for stale-edit detection.
 */
export function computeContentHash(text: string): string {
  return crypto.createHash("sha256").update(text.trim()).digest("hex").slice(0, 16);
}

export class AIAssistantService {
  /**
   * Improves portfolio text content while strictly preserving source facts.
   */
  async improveContent(
    req: ContentAssistRequest
  ): Promise<AssistantApiResponse<ContentAssistResponse>> {
    const currentHash = computeContentHash(req.sourceText);
    const isStale = Boolean(req.sourceHash && req.sourceHash !== currentHash);

    // Prompt with strict factual integrity and anti-hallucination guardrails
    const systemInstruction = `
You are Portfolify's AI Content Assistant.
Your task is to improve the user's portfolio text strictly adhering to the requested operation.

CRITICAL FACTUAL INTEGRITY RULES:
1. NEVER invent employers, job titles, employment dates, degrees, certifications, skills, technologies, projects, metrics, numbers, or achievements.
2. The user's input is the ONLY source of truth. You may improve grammar, phrasing, tone, and flow, but NEVER change the underlying facts.
3. DO NOT turn tasks into unverified accomplishments.
4. DO NOT turn general participation into leadership.
5. If the user asks to "expand" but the source text lacks sufficient facts, explain what is missing in the "clarificationNeeded" field instead of making up facts.
6. Output MUST be valid JSON adhering strictly to the requested schema.
7. NEVER include arbitrary HTML, JavaScript, CSS, or markdown code blocks in the output.
`;

    const userPrompt = `
Operation: ${req.operation}
Target Field: ${req.targetField}
Tone: ${req.tone}
Context: ${req.context || "None provided"}

SOURCE TEXT TO IMPROVE:
"""
${req.sourceText}
"""

Instructions based on operation:
- improve_clarity: Rewrite for maximum readability and natural flow while preserving exact meaning.
- fix_grammar: Correct grammatical errors, spelling mistakes, awkward syntax, and punctuation.
- adjust_tone: Rewrite in a ${req.tone} tone without adding or removing facts.
- shorten: Eliminate wordiness and fluff while preserving every concrete detail.
- expand_clarity: Provide a better explanation using only the stated facts. If more info is needed, specify in clarificationNeeded.
- improve_headline: Create a punchy, credible professional headline without inflating seniority or titles.
- improve_bio: Refine personal bio flow for a portfolio audience.
- improve_project_description: Clarify problem, implementation, and technologies.
- improve_bullet: Polish action verb and impact without fabricating statistics.

Respond with valid JSON with this exact structure:
{
  "originalText": "${req.sourceText.replace(/"/g, '\\"')}",
  "suggestedText": "Your improved text here",
  "operation": "${req.operation}",
  "explanation": "Brief 1-sentence note on what was improved.",
  "clarificationNeeded": ""
}
`;

    const providerResult = await geminiProvider.executeStructuredPrompt<{
      originalText?: string;
      suggestedText?: string;
      operation?: string;
      explanation?: string;
      clarificationNeeded?: string;
    }>({
      systemInstruction,
      userPrompt,
      temperature: 0.1,
    });

    if (!providerResult.success || !providerResult.data || !providerResult.data.suggestedText) {
      // Deterministic Local Fallback if AI provider is unconfigured or unavailable
      const fallback = this.generateLocalFallback(req);
      if (fallback) {
        return {
          success: true,
          data: {
            ...fallback,
            sourceHash: currentHash,
            isStale,
          },
        };
      }

      return {
        success: false,
        code: providerResult.code || "PROVIDER_ERROR",
        error: providerResult.error || "Content assistance service is currently unavailable.",
      };
    }

    const validatedResponse = ContentAssistResponseSchema.parse({
      originalText: req.sourceText,
      suggestedText: providerResult.data.suggestedText.trim(),
      operation: req.operation,
      explanation: providerResult.data.explanation || `Applied ${req.operation.replace(/_/g, " ")}.`,
      clarificationNeeded: providerResult.data.clarificationNeeded || undefined,
      sourceHash: currentHash,
      isStale,
    });

    return {
      success: true,
      data: validatedResponse,
    };
  }

  /**
   * Deterministic local fallback for content editing when AI provider is offline or missing API key.
   */
  private generateLocalFallback(req: ContentAssistRequest): ContentAssistResponse | null {
    let suggested = req.sourceText.trim();
    let explanation = "Refined locally.";
    let clarificationNeeded: string | undefined = undefined;

    if (req.operation === "improve_clarity" || req.operation === "fix_grammar") {
      // Clean duplicate whitespace, fix basic capitalization and punctuation
      suggested = suggested
        .replace(/\s+/g, " ")
        .replace(/\bi\b/g, "I")
        .replace(/([.!?])\s*([a-z])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`);
      if (suggested.length > 0) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }
      if (!/[.!?]$/.test(suggested) && req.targetField !== "headline") {
        suggested += ".";
      }
      explanation = "Standardized capitalization, spacing, and sentence punctuation.";
    } else if (req.operation === "shorten") {
      // Strip common redundant filler phrases
      suggested = suggested
        .replace(/\bbasically\s*/gi, "")
        .replace(/\bessentially\s*/gi, "")
        .replace(/\bin order to\b/gi, "to")
        .replace(/\bwith the aim of\b/gi, "to")
        .replace(/\bdue to the fact that\b/gi, "because")
        .replace(/\bat the present time\b/gi, "currently")
        .replace(/\bfor the purpose of\b/gi, "for")
        .replace(/\bvery\s+/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      if (suggested.length > 0) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }
      explanation = "Removed redundant filler phrasing while preserving original meaning.";
    } else if (req.operation === "expand_clarity") {
      suggested = suggested.replace(/\s+/g, " ").trim();
      if (suggested.length > 0) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }
      if (suggested.split(/\s+/).length < 8) {
        clarificationNeeded =
          "Provide additional technical context, implementation challenges, or technologies used to expand safely.";
        explanation =
          "Preserved source facts. Additional technical details are required before safely expanding this section.";
      } else {
        explanation = "Clarified description based strictly on provided facts.";
      }
    } else if (req.operation === "improve_bullet") {
      suggested = suggested.replace(/\s+/g, " ").trim();
      if (suggested.length > 0) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }
      explanation =
        "Formatted bullet point with strong active voice without fabricating unverified metrics.";
    } else if (req.operation === "improve_headline") {
      suggested = suggested.replace(/\s+/g, " ").trim();
      suggested = suggested.replace(/\b\w/g, (c) => c.toUpperCase());
      explanation = "Formatted professional headline into title case.";
    } else if (req.operation === "adjust_tone" && req.tone === "concise") {
      suggested = suggested
        .replace(/\bin order to\b/gi, "to")
        .replace(/\s+/g, " ")
        .trim();
      if (suggested.length > 0) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }
      explanation = "Streamlined phrasing for a concise portfolio presentation.";
    } else {
      // General cleanup
      suggested = suggested.replace(/\s+/g, " ").trim();
      if (suggested.length > 0) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }
      explanation = `Cleaned phrasing for ${req.operation.replace(/_/g, " ")}.`;
    }

    return {
      originalText: req.sourceText,
      suggestedText: suggested,
      operation: req.operation,
      explanation,
      clarificationNeeded,
      isStale: false,
    };
  }

  /**
   * Proposes a validated visual restyling configuration based on a preset or natural language prompt.
   */
  async generateRestyling(req: RestyleRequest): Promise<AssistantApiResponse<RestyleResponse>> {
    // 1. If preset ID is provided, load verified preset directly
    if (req.presetId) {
      const preset = getRestylePreset(req.presetId);
      if (!preset) {
        return {
          success: false,
          code: "INVALID_SCHEMA",
          error: `Unknown restyling preset: ${req.presetId}`,
        };
      }

      const proposedAppearance: AppearanceSettings = {
        templateId: preset.templateId,
        colorScheme: preset.colorScheme,
        accentColor: preset.accentColor,
        fontFamily: preset.fontFamily,
        designTokens: preset.designTokens,
      };

      // Validate against canonical AppearanceSettings schema
      const validated = AppearanceSettingsSchema.parse(proposedAppearance);

      return {
        success: true,
        data: {
          proposedAppearance: validated,
          presetId: preset.id,
          styleName: preset.name,
          explanation: preset.description,
          tokenHighlights: [
            `Template: ${preset.templateId}`,
            `Typography: ${preset.fontFamily}`,
            `Scheme: ${preset.colorScheme}`,
            `Density: ${preset.designTokens?.layoutDensity || "balanced"}`,
          ],
        },
      };
    }

    // 2. If prompt is provided, evaluate via Gemini or smart heuristic mapper
    const promptText = req.prompt || "";
    if (promptText) {
      const systemInstruction = `
You are Portfolify's Visual Restyling Architect.
Map the user's style description to a supported Portfolify appearance configuration.

SUPPORTED CONSTRAINTS:
- templateId: "minimal-portfolio" | "developer-pro" | "signature" | "reimagined"
- fontFamily: "sans" | "serif" | "mono"
- colorScheme: "dark" | "light" | "system"
- accentColor: "blue" | "neutral" | "slate"
- designTokens:
  - layoutDensity: "compact" | "balanced" | "spacious"
  - cardStyle: "bordered" | "flat" | "elevated" | "glass"
  - headerLayout: "split" | "centered" | "editorial" | "minimal"
  - accentHex: optional hex string (e.g. "#356ae6", "#2563eb", "#71717a")
  - backgroundColor: optional dark hex (e.g. "#09090b", "#0e1015")
  - surfaceColor: optional dark hex (e.g. "#121215", "#181a20")

RULES:
- NEVER introduce purple or violet colors.
- Output MUST be valid JSON adhering to the AppearanceSettings schema.
`;

      const userPrompt = `
Current Template: ${req.currentAppearance.templateId}
Current Scheme: ${req.currentAppearance.colorScheme}
User Visual Preference:
"${promptText}"

Respond with JSON:
{
  "templateId": "one of the 4 supported templates",
  "fontFamily": "sans | serif | mono",
  "colorScheme": "dark | light | system",
  "accentColor": "blue | neutral | slate",
  "designTokens": {
    "layoutDensity": "compact | balanced | spacious",
    "cardStyle": "bordered | flat | elevated | glass",
    "headerLayout": "split | centered | editorial | minimal"
  },
  "styleName": "Creative name for this style",
  "explanation": "Why this configuration matches the user's request."
}
`;

      const providerResult = await geminiProvider.executeStructuredPrompt<{
        templateId?: string;
        fontFamily?: string;
        colorScheme?: string;
        accentColor?: string;
        designTokens?: Record<string, unknown>;
        styleName?: string;
        explanation?: string;
      }>({
        systemInstruction,
        userPrompt,
        temperature: 0.1,
      });

      if (providerResult.success && providerResult.data && providerResult.data.templateId) {
        try {
          const raw = providerResult.data;
          const proposed = AppearanceSettingsSchema.parse({
            templateId: raw.templateId,
            fontFamily: raw.fontFamily || "sans",
            colorScheme: raw.colorScheme || "system",
            accentColor: raw.accentColor || "blue",
            designTokens: raw.designTokens || {},
          });

          return {
            success: true,
            data: {
              proposedAppearance: proposed,
              styleName: raw.styleName || "AI Tailored Direction",
              explanation: raw.explanation || `Custom styling configured to match "${promptText}".`,
              tokenHighlights: [
                `Template: ${proposed.templateId}`,
                `Typography: ${proposed.fontFamily}`,
                `Scheme: ${proposed.colorScheme}`,
                `Density: ${proposed.designTokens?.layoutDensity || "balanced"}`,
              ],
            },
          };
        } catch {
          // Fall through to heuristic matcher
        }
      }

      // Intelligent Heuristic Fallback
      return this.heuristicRestyleFallback(promptText, req.currentAppearance);
    }

    return {
      success: false,
      code: "INVALID_SCHEMA",
      error: "Either presetId or prompt must be provided for restyling.",
    };
  }

  /**
   * Heuristic restyling mapper that resolves natural language phrases to valid presets.
   */
  private heuristicRestyleFallback(
    prompt: string,
    fallbackAppearance: AppearanceSettings
  ): AssistantApiResponse<RestyleResponse> {
    const lower = prompt.toLowerCase();

    let matchedPresetId: "minimal-editorial" | "modern-professional" | "technical-structured" | "creative-expressive" | "bold-high-contrast" = "modern-professional";

    if (lower.includes("minimal") || lower.includes("editorial") || lower.includes("book") || lower.includes("serif") || lower.includes("clean white")) {
      matchedPresetId = "minimal-editorial";
    } else if (lower.includes("terminal") || lower.includes("code") || lower.includes("tech") || lower.includes("mono") || lower.includes("engineer")) {
      matchedPresetId = "technical-structured";
    } else if (lower.includes("magazine") || lower.includes("creative") || lower.includes("bold editorial") || lower.includes("asymmetric")) {
      matchedPresetId = "creative-expressive";
    } else if (lower.includes("dark") || lower.includes("contrast") || lower.includes("black") || lower.includes("monochrome")) {
      matchedPresetId = "bold-high-contrast";
    }

    const preset = getRestylePreset(matchedPresetId);
    if (!preset) {
      return {
        success: true,
        data: {
          proposedAppearance: fallbackAppearance,
          styleName: "Current Style",
          explanation: "Preserving current appearance.",
          tokenHighlights: [`Template: ${fallbackAppearance.templateId}`],
        },
      };
    }

    const proposed: AppearanceSettings = {
      templateId: preset.templateId,
      fontFamily: preset.fontFamily,
      colorScheme: preset.colorScheme,
      accentColor: preset.accentColor,
      designTokens: preset.designTokens,
    };

    return {
      success: true,
      data: {
        proposedAppearance: proposed,
        presetId: preset.id,
        styleName: preset.name,
        explanation: `Mapped to ${preset.name} based on your keywords (${preset.tagline}).`,
        tokenHighlights: [
          `Template: ${preset.templateId}`,
          `Typography: ${preset.fontFamily}`,
          `Scheme: ${preset.colorScheme}`,
          `Density: ${preset.designTokens?.layoutDensity || "balanced"}`,
        ],
      },
    };
  }
}

export const aiAssistantService = new AIAssistantService();
