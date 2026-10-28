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

  "bento-grid": {
    id: "bento-grid",
    name: "Bento Modular",
    tagline: "Apple-Style Bento Grid & Glass Architecture",
    description:
      "High-density modular bento cells, tech logos, dynamic project spotlights, and sleek obsidian cards.",
    templateId: "bento-studio",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "blue",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      accentHex: "#3b82f6",
      backgroundColor: "#08080a",
      surfaceColor: "#111116",
      borderColor: "rgba(255,255,255,0.08)",
      textColor: "#f4f4f6",
      mutedTextColor: "#9ca3af",
      fontFamily: "sans",
      layoutDensity: "compact",
      cardStyle: "glass",
      headerLayout: "minimal",
    },
  },

  "editorial-literary": {
    id: "editorial-literary",
    name: "Editorial Literary",
    tagline: "Curated Print Typography & Warm Paper Tones",
    description:
      "Classic serif masthead, warm cream background, ample margins, and literary narrative focus.",
    templateId: "editorial-studio",
    fontFamily: "serif",
    colorScheme: "light",
    accentColor: "neutral",
    designTokens: {
      colorScheme: "light",
      accentColor: "neutral",
      accentHex: "#d97706",
      backgroundColor: "#FDFBF7",
      surfaceColor: "#F5F2EB",
      borderColor: "#E5E0D5",
      textColor: "#1a1918",
      mutedTextColor: "#6b7280",
      fontFamily: "serif",
      layoutDensity: "spacious",
      cardStyle: "flat",
      headerLayout: "editorial",
    },
  },

  "creative-interactive": {
    id: "creative-interactive",
    name: "Creative Motion",
    tagline: "Fluid Animations, Badges & Spotlight Cards",
    description:
      "Dynamic mouse-reactive spotlight cards, pulse status badges, and contemporary creative studio aesthetic.",
    templateId: "creative-motion",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "blue",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      accentHex: "#2563eb",
      backgroundColor: "#09090b",
      surfaceColor: "#121215",
      borderColor: "#27272a",
      textColor: "#f4f4f5",
      mutedTextColor: "#a1a1aa",
      fontFamily: "sans",
      layoutDensity: "spacious",
      cardStyle: "glass",
      headerLayout: "split",
    },
  },

  "product-specs": {
    id: "product-specs",
    name: "Product & Systems Spec",
    tagline: "Engineering Specifications & Architecture Hierarchy",
    description:
      "Technical specs, monospace indicators, live metrics, and engineering-first layout.",
    templateId: "product-engineer",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "slate",
    designTokens: {
      colorScheme: "dark",
      accentColor: "slate",
      accentHex: "#10b981",
      backgroundColor: "#0c0d0e",
      surfaceColor: "#16181b",
      borderColor: "#27272a",
      textColor: "#e4e4e7",
      mutedTextColor: "#71717a",
      fontFamily: "sans",
      layoutDensity: "compact",
      cardStyle: "bordered",
      headerLayout: "split",
    },
  },

  "kinetic-engineer": {
    id: "kinetic-engineer",
    name: "Kinetic Brutalist",
    tagline: "Kinetic Statement, Marquee & Numbered Technical Divisions",
    description:
      "Vibrant vermillion orange anchors, obsidian dark surface, infinite tech marquee ticker, and giant footer wordmark.",
    templateId: "kinetic-studio",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "blue",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      accentHex: "#ff5c1a",
      backgroundColor: "#0e0e0c",
      surfaceColor: "#1b1b18",
      borderColor: "rgba(237, 237, 230, 0.14)",
      textColor: "#edede6",
      mutedTextColor: "#8a8a82",
      fontFamily: "sans",
      layoutDensity: "balanced",
      cardStyle: "bordered",
      headerLayout: "editorial",
    },
  },

  "designer-craft": {
    id: "designer-craft",
    name: "Designer Craft",
    tagline: "Tactile Micro-Interactions, Floating Capsule & Product Craft",
    description:
      "Refined charcoal surfaces, electric royal blue accents, floating frosted capsule navbar, and playful tactile interactions inspired by Paris product studios.",
    templateId: "designer-craft",
    fontFamily: "sans",
    colorScheme: "dark",
    accentColor: "blue",
    designTokens: {
      colorScheme: "dark",
      accentColor: "blue",
      accentHex: "#0080ff",
      backgroundColor: "#131415",
      surfaceColor: "#1a1c1d",
      borderColor: "#272b2d",
      textColor: "#ffffff",
      mutedTextColor: "#9ba1a5",
      fontFamily: "sans",
      layoutDensity: "balanced",
      cardStyle: "bordered",
      headerLayout: "centered",
    },
  },
};

export function getAllRestylePresets(): RestylePresetDefinition[] {
  return Object.values(RESTYLE_PRESETS);
}

export function getRestylePreset(id: RestylePresetId): RestylePresetDefinition | undefined {
  return RESTYLE_PRESETS[id];
}
