import { RestylePresetDefinition, RestylePresetId } from "./types";

export const RESTYLE_PRESETS: Record<RestylePresetId, RestylePresetDefinition> = {
  "minimal-editorial": {
    id: "minimal-editorial",
    name: "Minimal Editorial",
    tagline: "Literary Understatement & Generous Whitespace",
    description:
      "Serif typography hierarchy, ample margins, and quiet monochrome tones designed for clarity and reading comfort.",
    templateId: "minimal-portfolio",
    fontFamily: "serif",
    colorScheme: "light",
    accentColor: "neutral",
    designTokens: {
      colorScheme: "light",
      accentColor: "neutral",
      fontFamily: "serif",
      layoutDensity: "spacious",
      cardStyle: "bordered",
      headerLayout: "editorial",
    },
  },

  "modern-professional": {
    id: "modern-professional",
    name: "Modern Professional",
    tagline: "Contemporary Balanced Product Showcase",
    description:
      "Clean sans-serif typography, subtle card elevations, and restrained Portfolify blue accents for modern professionals.",
    templateId: "signature",
    fontFamily: "sans",
    colorScheme: "system",
    accentColor: "blue",
    designTokens: {
      colorScheme: "system",
      accentColor: "blue",
      accentHex: "#356ae6",
      fontFamily: "sans",
      layoutDensity: "balanced",
      cardStyle: "elevated",
      headerLayout: "centered",
    },
  },

  "technical-structured": {
    id: "technical-structured",
    name: "Technical Structured",
    tagline: "High-Density Terminal & Engineering Layout",
    description:
      "Deep charcoal surfaces, monospace typography accents, and compact timeline cards optimized for software engineers and systems architects.",
    templateId: "developer-pro",
    fontFamily: "mono",
    colorScheme: "dark",
    accentColor: "slate",
    designTokens: {
      colorScheme: "dark",
      accentColor: "slate",
      accentHex: "#2563eb",
      fontFamily: "mono",
      layoutDensity: "compact",
      cardStyle: "bordered",
      headerLayout: "split",
    },
  },

  "creative-expressive": {
    id: "creative-expressive",
    name: "Creative Expressive",
    tagline: "Asymmetrical Hero & Magazine Composition",
    description:
      "High-whitespace split layout, glassmorphic card framing, and an editorial project anthology.",
    templateId: "reimagined",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "blue",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      accentHex: "#356ae6",
      fontFamily: "sans",
      layoutDensity: "spacious",
      cardStyle: "glass",
      headerLayout: "split",
    },
  },

  "bold-high-contrast": {
    id: "bold-high-contrast",
    name: "Bold High-Contrast",
    tagline: "Monochrome Precision with Electric Blue Anchors",
    description:
      "Pitch black background, dark zinc card surfaces, razor-sharp borders, and high-visibility interactive elements.",
    templateId: "signature",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "blue",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      accentHex: "#356ae6",
      backgroundColor: "#09090b",
      surfaceColor: "#121215",
      borderColor: "#27272a",
      textColor: "#f4f4f5",
      mutedTextColor: "#a1a1aa",
      fontFamily: "sans",
      layoutDensity: "compact",
      cardStyle: "bordered",
      headerLayout: "minimal",
    },
  },
};

export function getAllRestylePresets(): RestylePresetDefinition[] {
  return Object.values(RESTYLE_PRESETS);
}

export function getRestylePreset(id: RestylePresetId): RestylePresetDefinition | undefined {
  return RESTYLE_PRESETS[id];
}
