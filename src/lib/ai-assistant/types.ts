import { z } from "zod";
import {
  TemplateIdSchema,
  DesignTokensSchema,
  AppearanceSettingsSchema,
} from "@/lib/schema/portfolio";

// ==========================================
// A. Content Intelligence Types & Schemas
// ==========================================

export const ContentOperationSchema = z.enum([
  "improve_clarity",
  "fix_grammar",
  "adjust_tone",
  "shorten",
  "expand_clarity",
  "improve_headline",
  "improve_bio",
  "improve_project_description",
  "improve_bullet",
]);

export type ContentOperation = z.infer<typeof ContentOperationSchema>;

export const AssistantToneSchema = z.enum([
  "professional",
  "concise",
  "friendly",
  "technical",
  "creative",
]);

export type AssistantTone = z.infer<typeof AssistantToneSchema>;

export const ContentTargetFieldSchema = z.enum([
  "headline",
  "bio",
  "long_bio",
  "project_description",
  "project_tagline",
  "experience_description",
  "experience_highlight",
  "education_description",
  "custom_text",
]);

export type ContentTargetField = z.infer<typeof ContentTargetFieldSchema>;

export const ContentAssistRequestSchema = z.object({
  operation: ContentOperationSchema,
  targetField: ContentTargetFieldSchema,
  sourceText: z
    .string()
    .trim()
    .min(1, "Source text is required")
    .max(3000, "Source text exceeds 3,000 characters limit"),
  context: z.string().trim().max(1000).optional(),
  tone: AssistantToneSchema.default("professional"),
  sourceHash: z.string().optional(),
});

export type ContentAssistRequest = z.infer<typeof ContentAssistRequestSchema>;

export const ContentAssistResponseSchema = z.object({
  originalText: z.string(),
  suggestedText: z.string(),
  operation: ContentOperationSchema,
  explanation: z.string(),
  clarificationNeeded: z.string().optional(),
  sourceHash: z.string().optional(),
  isStale: z.boolean().default(false),
});

export type ContentAssistResponse = z.infer<typeof ContentAssistResponseSchema>;

// ==========================================
// B. Visual Restyling Types & Schemas
// ==========================================

export const RestylePresetIdSchema = z.enum([
  "minimal-editorial",
  "modern-professional",
  "technical-structured",
  "creative-expressive",
  "bold-high-contrast",
  "bento-grid",
  "editorial-literary",
  "creative-interactive",
  "product-specs",
  "kinetic-engineer",
  "designer-craft",
]);

export type RestylePresetId = z.infer<typeof RestylePresetIdSchema>;

export interface RestylePresetDefinition {
  id: RestylePresetId;
  name: string;
  tagline: string;
  description: string;
  templateId: z.infer<typeof TemplateIdSchema>;
  fontFamily: "sans" | "serif" | "mono";
  colorScheme: "dark" | "light" | "system";
  accentColor: "blue" | "neutral" | "slate";
  designTokens: z.infer<typeof DesignTokensSchema>;
}

export const RestyleRequestSchema = z.object({
  presetId: RestylePresetIdSchema.optional(),
  prompt: z
    .string()
    .trim()
    .max(500, "Style description must be 500 characters or fewer")
    .optional(),
  currentAppearance: AppearanceSettingsSchema,
});

export type RestyleRequest = z.infer<typeof RestyleRequestSchema>;

export const RestyleResponseSchema = z.object({
  proposedAppearance: AppearanceSettingsSchema,
  presetId: RestylePresetIdSchema.optional(),
  styleName: z.string(),
  explanation: z.string(),
  tokenHighlights: z.array(z.string()).default([]),
});

export type RestyleResponse = z.infer<typeof RestyleResponseSchema>;

// Generic API response structure
export interface AssistantApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?:
    | "MISSING_API_KEY"
    | "RATE_LIMITED"
    | "INVALID_SCHEMA"
    | "INVALID_OUTPUT"
    | "STALE_SOURCE"
    | "PROVIDER_ERROR"
    | "TIMEOUT"
    | "OPERATION_FAILED";
}
