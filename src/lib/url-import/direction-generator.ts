import {
  WebsiteDesignAnalysis,
  DesignDirection,
  GeneratedDirectionsResult,
  DirectionTokens,
} from "./types";
import { PortfolioData } from "@/lib/schema/portfolio";

/**
 * Ensures two directions differ meaningfully across layout density, typography,
 * card treatment, and header composition.
 */
function verifyAndEnforceDistinctness(
  signatureTokens: DirectionTokens,
  reimaginedTokens: DirectionTokens
): DirectionTokens {
  const distinct = { ...reimaginedTokens };

  // 1. Force different typography family
  if (distinct.fontFamily === signatureTokens.fontFamily) {
    distinct.fontFamily = signatureTokens.fontFamily === "serif" ? "sans" : "serif";
    distinct.headingFont = distinct.fontFamily === "serif" ? "Georgia, serif" : "Inter, sans-serif";
  }

  // 2. Force different layout density
  if (distinct.layoutDensity === signatureTokens.layoutDensity) {
    distinct.layoutDensity = signatureTokens.layoutDensity === "spacious" ? "compact" : "spacious";
  }

  // 3. Force different card treatment
  if (distinct.cardStyle === signatureTokens.cardStyle) {
    distinct.cardStyle = signatureTokens.cardStyle === "bordered" ? "elevated" : "bordered";
  }

  // 4. Force different header layout
  if (distinct.headerLayout === signatureTokens.headerLayout) {
    distinct.headerLayout = signatureTokens.headerLayout === "split" ? "editorial" : "split";
  }

  return distinct;
}

export class DirectionGenerator {
  /**
   * Generates EXACTLY TWO portfolio directions:
   * 1. Signature: Preserves source website's core visual harmony.
   * 2. Reimagined: Uses source characteristics as a departure point for an editorial composition.
   */
  async generateDirections(
    analysis: WebsiteDesignAnalysis,
    existingPortfolio?: Partial<PortfolioData>
  ): Promise<GeneratedDirectionsResult> {
    const { palette, typography, layout, extractedContent } = analysis;

    // 1. Synthesize Direction A: Signature
    const signatureTokens: DirectionTokens = {
      colorScheme: palette.isDark ? "dark" : "light",
      accentColor: "blue",
      accentHex: palette.accent,
      backgroundColor: palette.background,
      surfaceColor: palette.surface,
      textColor: palette.text,
      mutedTextColor: palette.mutedText,
      borderColor: palette.isDark ? "#27272a" : "#e4e4e7",
      fontFamily: typography.fontFamily,
      headingFont: typography.detectedFont,
      layoutDensity: layout.density,
      cardStyle: layout.cardStyle,
      headerLayout: layout.headerLayout,
    };

    const signature: DesignDirection = {
      id: "signature",
      name: "Signature",
      tagline: "Faithful visual harmony echoing the source site's identity",
      description:
        "Preserves the source website's color hierarchy, card treatment, and structural rhythm adapted into an accessible, responsive portfolio layout.",
      baseTemplateId: "signature",
      designTokens: signatureTokens,
      distinctFeatures: [
        "Faithful reflection of the source site's color palette and tone",
        "Balanced structural grid matching the original density rhythm",
        "Clean, structured case-study presentation for projects",
        "Accessible contrast and native responsive reflow",
      ],
    };

    // 2. Synthesize Direction B: Reimagined
    const rawReimaginedTokens: DirectionTokens = {
      colorScheme: palette.isDark ? "dark" : "system",
      accentColor: "neutral",
      accentHex: palette.accent,
      backgroundColor: palette.isDark ? "#09090b" : "#fafaf9",
      surfaceColor: palette.isDark ? "#141518" : "#f4f4f2",
      textColor: palette.isDark ? "#ffffff" : "#18181b",
      mutedTextColor: palette.isDark ? "#a1a1aa" : "#71717a",
      borderColor: palette.isDark ? "#3f3f46" : "#d4d4d8",
      fontFamily: typography.fontFamily === "serif" ? "sans" : "serif",
      headingFont: typography.fontFamily === "serif" ? "Inter, sans-serif" : "Georgia, serif",
      layoutDensity: "spacious",
      cardStyle: layout.cardStyle === "elevated" ? "flat" : "glass",
      headerLayout: "editorial",
    };

    // Strictly enforce distinctness across all design tokens
    const reimagedTokens = verifyAndEnforceDistinctness(signatureTokens, rawReimaginedTokens);

    const reimagined: DesignDirection = {
      id: "reimagined",
      name: "Reimagined",
      tagline: "Bold editorial reinterpretation with elevated composition",
      description:
        "Reinterprets the source aesthetic with an editorial composition, expansive whitespace, high-contrast typography, and a magazine-inspired project showcase.",
      baseTemplateId: "reimagined",
      designTokens: reimagedTokens,
      distinctFeatures: [
        "Contrasting editorial typographic hierarchy with dramatic scale",
        "Expansive, high-whitespace composition with generous margins",
        "Asymmetrical hero layout with floating identity badge",
        "Magazine-inspired visual showcase with restrained borders",
      ],
    };

    // 3. Check if Gemini AI can provide optional content refinement
    let extractedDraft: Partial<PortfolioData> | undefined = undefined;

    // If existing portfolio has content, we preserve it 100%
    if (existingPortfolio) {
      extractedDraft = {
        ...existingPortfolio,
        appearance: {
          templateId: "signature",
          colorScheme: signatureTokens.colorScheme,
          accentColor: signatureTokens.accentColor,
          fontFamily: signatureTokens.fontFamily,
          designTokens: signatureTokens,
        },
      };
    } else {
      // Build draft from extracted content snippets if available
      extractedDraft = {
        title: analysis.pageTitle || "Portfolio",
        profile: {
          fullName: "",
          headline: extractedContent.headline || "",
          bio: extractedContent.bioSnippet || "",
          longBio: "",
          location: "",
          email: "",
          phone: "",
          avatarUrl: "",
          statusBadge: "Available for new projects",
        },
        projects: extractedContent.projectHighlights.map((p, idx) => ({
          id: `proj_import_${Date.now()}_${idx}`,
          title: p.title,
          tagline: "",
          description: p.description || "",
          category: "software",
          status: "completed",
          featured: idx === 0,
          visible: true,
          slug: "",
          technologies: [],
          liveUrl: "",
          repoUrl: "",
          coverImageUrl: "",
          startDate: "",
          endDate: "",
          order: idx,
        })),
        appearance: {
          templateId: "signature",
          colorScheme: signatureTokens.colorScheme,
          accentColor: signatureTokens.accentColor,
          fontFamily: signatureTokens.fontFamily,
          designTokens: signatureTokens,
        },
      };
    }

    // Return the verified exactly two directions
    return {
      signature,
      reimagined,
      analysis,
      extractedDraft,
    };
  }
}

export const directionGenerator = new DirectionGenerator();
