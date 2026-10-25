import { z } from "zod";
import { PortfolioData } from "@/lib/schema/portfolio";

export const UrlImportRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2048, "URL is too long")
    .refine(
      (val) => {
        const lower = val.toLowerCase();
        if (
          lower.startsWith("javascript:") ||
          lower.startsWith("data:") ||
          lower.startsWith("file:") ||
          lower.startsWith("ftp:")
        ) {
          return false;
        }
        try {
          const target = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(val) ? val : `https://${val}`;
          const parsed = new URL(target);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return false;
          }
          return (
            parsed.hostname.includes(".") &&
            !parsed.hostname.startsWith(".") &&
            !parsed.hostname.endsWith(".")
          );
        } catch {
          return false;
        }
      },
      { message: "Must be a valid HTTP or HTTPS address with a domain name (e.g. https://example.com)" }
    ),
  confirmPermission: z.boolean().refine((val) => val === true, {
    message: "You must confirm that you have permission or ownership to use this website as design reference",
  }),
});

export type UrlImportRequest = z.infer<typeof UrlImportRequestSchema>;

export const DetectedPaletteSchema = z.object({
  primary: z.string().default("#18181b"),
  secondary: z.string().default("#71717a"),
  accent: z.string().default("#356ae6"),
  background: z.string().default("#ffffff"),
  surface: z.string().default("#f4f4f5"),
  text: z.string().default("#09090b"),
  mutedText: z.string().default("#71717a"),
  isDark: z.boolean().default(false),
});

export type DetectedPalette = z.infer<typeof DetectedPaletteSchema>;

export const TypographyCharacteristicsSchema = z.object({
  detectedFont: z.string().default("Inter, sans-serif"),
  mood: z.enum(["editorial", "technical", "modern-sans", "classical-serif", "minimal"]).default("modern-sans"),
  headingStyle: z.enum(["bold", "editorial", "technical", "clean"]).default("clean"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
});

export type TypographyCharacteristics = z.infer<typeof TypographyCharacteristicsSchema>;

export const LayoutCharacteristicsSchema = z.object({
  density: z.enum(["compact", "balanced", "spacious"]).default("balanced"),
  cardStyle: z.enum(["bordered", "flat", "elevated", "glass"]).default("bordered"),
  headerLayout: z.enum(["split", "centered", "editorial", "minimal"]).default("split"),
  contentWidth: z.enum(["contained", "wide", "standard"]).default("standard"),
});

export type LayoutCharacteristics = z.infer<typeof LayoutCharacteristicsSchema>;

export const ExtractedContentSnippetSchema = z.object({
  headline: z.string().default(""),
  bioSnippet: z.string().default(""),
  detectedSections: z.array(z.string()).default([]),
  projectHighlights: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .default([]),
});

export type ExtractedContentSnippet = z.infer<typeof ExtractedContentSnippetSchema>;

export const WebsiteDesignAnalysisSchema = z.object({
  sourceUrl: z.string(),
  resolvedHost: z.string(),
  timestamp: z.string(),
  pageTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  palette: DetectedPaletteSchema,
  typography: TypographyCharacteristicsSchema,
  layout: LayoutCharacteristicsSchema,
  extractedContent: ExtractedContentSnippetSchema,
  limitations: z.array(z.string()).default([]),
});

export type WebsiteDesignAnalysis = z.infer<typeof WebsiteDesignAnalysisSchema>;

export const DirectionTokensSchema = z.object({
  colorScheme: z.enum(["dark", "light", "system"]).default("system"),
  accentColor: z.enum(["blue", "neutral", "slate"]).default("neutral"),
  accentHex: z.string().default("#356ae6"),
  backgroundColor: z.string().default("#ffffff"),
  surfaceColor: z.string().default("#f4f4f5"),
  textColor: z.string().default("#09090b"),
  mutedTextColor: z.string().default("#71717a"),
  borderColor: z.string().default("#e4e4e7"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
  headingFont: z.string().default("sans"),
  layoutDensity: z.enum(["compact", "balanced", "spacious"]).default("balanced"),
  cardStyle: z.enum(["bordered", "flat", "elevated", "glass"]).default("bordered"),
  headerLayout: z.enum(["split", "centered", "editorial", "minimal"]).default("split"),
});

export type DirectionTokens = z.infer<typeof DirectionTokensSchema>;

export const DesignDirectionSchema = z.object({
  id: z.enum(["signature", "reimagined"]),
  name: z.enum(["Signature", "Reimagined"]),
  tagline: z.string(),
  description: z.string(),
  baseTemplateId: z.enum(["signature", "reimagined"]),
  designTokens: DirectionTokensSchema,
  distinctFeatures: z.array(z.string()).default([]),
});

export type DesignDirection = z.infer<typeof DesignDirectionSchema>;

export interface GeneratedDirectionsResult {
  signature: DesignDirection;
  reimagined: DesignDirection;
  analysis: WebsiteDesignAnalysis;
  extractedDraft?: Partial<PortfolioData>;
}

export type UrlAnalysisErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_PROTOCOL"
  | "SSRF_BLOCKED"
  | "DNS_RESOLUTION_FAILED"
  | "CONNECTION_TIMEOUT"
  | "CONNECTION_FAILED"
  | "RESPONSE_TOO_LARGE"
  | "UNSUPPORTED_CONTENT_TYPE"
  | "REDIRECT_LIMIT_EXCEEDED"
  | "PERMISSION_REQUIRED"
  | "ANALYSIS_FAILED"
  | "RATE_LIMITED"
  | "MISSING_API_KEY";

export interface UrlImportApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: UrlAnalysisErrorCode;
}
