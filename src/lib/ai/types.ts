import { z } from "zod";
import { TemplateIdSchema } from "@/lib/schema/portfolio";

export const ToneOptionSchema = z.enum(["professional", "technical", "editorial", "minimal"]);
export type ToneOption = z.infer<typeof ToneOptionSchema>;

export const PurposeOptionSchema = z.enum(["job_search", "freelance", "academic", "showcase"]);
export type PurposeOption = z.infer<typeof PurposeOptionSchema>;

export const ContentLengthSchema = z.enum(["concise", "detailed"]);
export type ContentLength = z.infer<typeof ContentLengthSchema>;

export const AIGenerationInputSchema = z.object({
  fullName: z.string().trim().max(100).default(""),
  targetRole: z.string().trim().max(150).min(1, "Target role or headline is required"),
  background: z.string().trim().max(2000).default(""),
  rawSkills: z.string().trim().max(1000).default(""),
  rawExperience: z.string().trim().max(3000).default(""),
  rawProjects: z.string().trim().max(3000).default(""),
  rawEducation: z.string().trim().max(1000).default(""),
  links: z
    .array(
      z.object({
        label: z.string().max(50),
        url: z.string().url("Must be a valid URL").or(z.literal("")),
      })
    )
    .optional()
    .default([]),
  preferences: z
    .object({
      profession: z.string().trim().max(100).default("Software Engineering"),
      tone: ToneOptionSchema.default("professional"),
      purpose: PurposeOptionSchema.default("job_search"),
      contentLength: ContentLengthSchema.default("concise"),
      templateId: TemplateIdSchema.default("minimal-portfolio"),
    })
    .default({
      profession: "Software Engineering",
      tone: "professional",
      purpose: "job_search",
      contentLength: "concise",
      templateId: "minimal-portfolio",
    }),
});

export type AIGenerationInput = z.infer<typeof AIGenerationInputSchema>;
export type AIGenerationPayload = z.input<typeof AIGenerationInputSchema>;

export const SectionTypeSchema = z.enum(["profile", "projects", "skills", "experience", "education"]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

export const AIRegenerateSectionInputSchema = z.object({
  section: SectionTypeSchema,
  sourceContext: z.string().trim().min(1, "Source facts are required for regeneration"),
  tone: ToneOptionSchema.optional().default("professional"),
  profession: z.string().trim().optional().default("General"),
});

export type AIRegenerateSectionInput = z.infer<typeof AIRegenerateSectionInputSchema>;
export type AIRegenerateSectionPayload = z.input<typeof AIRegenerateSectionInputSchema>;

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: "MISSING_API_KEY" | "RATE_LIMITED" | "INVALID_OUTPUT" | "TIMEOUT" | "PROVIDER_ERROR";
}
