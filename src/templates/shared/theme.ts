import { AppearanceSettings, TemplateId } from "@/lib/schema/portfolio";

export interface ResolvedTemplateTheme {
  isDark: boolean;
  fontClass: string;
  bgColor: string;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
  accentColor: string;
  mutedTextColor: string;
}

export function isDarkHex(hex?: string): boolean {
  if (!hex || typeof hex !== "string") return false;
  const clean = hex.replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return false;
  const r = clean.length === 3 ? parseInt(clean[0] + clean[0], 16) : parseInt(clean.slice(0, 2), 16);
  const g = clean.length === 3 ? parseInt(clean[1] + clean[1], 16) : parseInt(clean.slice(2, 4), 16);
  const b = clean.length === 3 ? parseInt(clean[2] + clean[2], 16) : parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
}

const TEMPLATE_DEFAULT_THEMES: Record<
  TemplateId,
  { isDark: boolean; fontClass: string; bg: string; text: string; surface: string; border: string; accent: string }
> = {
  "minimal-portfolio": {
    isDark: false,
    fontClass: "font-serif",
    bg: "#FAFAF8",
    text: "#191919",
    surface: "#ffffff",
    border: "#e5e5e5",
    accent: "#191919",
  },
  "developer-pro": {
    isDark: true,
    fontClass: "font-mono",
    bg: "#0A0B0E",
    text: "#ECECED",
    surface: "#111318",
    border: "#27272a",
    accent: "#2563eb",
  },
  signature: {
    isDark: true,
    fontClass: "font-sans",
    bg: "#09090b",
    text: "#f4f4f5",
    surface: "#121215",
    border: "#27272a",
    accent: "#356ae6",
  },
  reimagined: {
    isDark: true,
    fontClass: "font-sans",
    bg: "#09090b",
    text: "#f4f4f5",
    surface: "#18181b",
    border: "#27272a",
    accent: "#356ae6",
  },
  "editorial-studio": {
    isDark: false,
    fontClass: "font-serif",
    bg: "#FDFBF7",
    text: "#1a1918",
    surface: "#ffffff",
    border: "#e5e2dc",
    accent: "#b45309",
  },
  "creative-motion": {
    isDark: true,
    fontClass: "font-sans",
    bg: "#09090b",
    text: "#f4f4f5",
    surface: "#111215",
    border: "rgba(255,255,255,0.08)",
    accent: "#3b82f6",
  },
  "product-engineer": {
    isDark: true,
    fontClass: "font-mono",
    bg: "#0c0d0e",
    text: "#e4e4e7",
    surface: "#141619",
    border: "#27272a",
    accent: "#10b981",
  },
  "bento-studio": {
    isDark: true,
    fontClass: "font-sans",
    bg: "#08080a",
    text: "#f4f4f6",
    surface: "#111215",
    border: "rgba(255,255,255,0.08)",
    accent: "#3b82f6",
  },
  "kinetic-studio": {
    isDark: true,
    fontClass: "font-sans",
    bg: "#0e0e0c",
    text: "#edede6",
    surface: "#1b1b18",
    border: "rgba(237, 237, 230, 0.14)",
    accent: "#ff5c1a",
  },
  "designer-craft": {
    isDark: true,
    fontClass: "font-sans",
    bg: "#131415",
    text: "#ffffff",
    surface: "#1a1c1d",
    border: "#272b2d",
    accent: "#0080ff",
  },
};

export function resolveTemplateTheme(
  appearance?: AppearanceSettings,
  templateId?: TemplateId
): ResolvedTemplateTheme {
  const currentTpl = templateId || appearance?.templateId || "minimal-portfolio";
  const def = TEMPLATE_DEFAULT_THEMES[currentTpl] || TEMPLATE_DEFAULT_THEMES["minimal-portfolio"];
  const tokens = appearance?.designTokens;

  // Resolve Dark / Light
  let isDark = def.isDark;
  if (appearance?.colorScheme === "dark" || tokens?.colorScheme === "dark") {
    isDark = true;
  } else if (appearance?.colorScheme === "light" || tokens?.colorScheme === "light") {
    isDark = false;
  } else if (tokens?.backgroundColor) {
    isDark = isDarkHex(tokens.backgroundColor);
  }

  // Resolve Font Class
  const fontFamily = appearance?.fontFamily || tokens?.fontFamily;
  let fontClass = def.fontClass;
  if (fontFamily === "serif") fontClass = "font-serif";
  else if (fontFamily === "mono") fontClass = "font-mono";
  else if (fontFamily === "sans") fontClass = "font-sans";

  // Resolve Accent Color
  let accentColor = tokens?.accentHex;
  if (!accentColor) {
    if (appearance?.accentColor === "slate") accentColor = "#64748b";
    else if (appearance?.accentColor === "neutral") accentColor = isDark ? "#d4d4d8" : "#71717a";
    else if (appearance?.accentColor === "blue") accentColor = "#356ae6";
    else accentColor = def.accent;
  }

  // Resolve Background Color
  let bgColor = tokens?.backgroundColor;
  if (!bgColor) {
    if (isDark) {
      bgColor = def.isDark ? def.bg : "#09090b";
    } else {
      bgColor = !def.isDark ? def.bg : "#FAFAF8";
    }
  }

  // Resolve Text Color
  let textColor = tokens?.textColor;
  if (!textColor) {
    if (isDark) {
      textColor = def.isDark ? def.text : "#f4f4f5";
    } else {
      textColor = !def.isDark ? def.text : "#18181b";
    }
  }

  // Resolve Surface Color
  let surfaceColor = tokens?.surfaceColor;
  if (!surfaceColor) {
    if (isDark) {
      surfaceColor = def.isDark ? def.surface : "#121215";
    } else {
      surfaceColor = !def.isDark ? def.surface : "#ffffff";
    }
  }

  // Resolve Border Color
  let borderColor = tokens?.borderColor;
  if (!borderColor) {
    if (isDark) {
      borderColor = def.isDark ? def.border : "#27272a";
    } else {
      borderColor = !def.isDark ? def.border : "#e5e7eb";
    }
  }

  const mutedTextColor = tokens?.mutedTextColor || (isDark ? "#a1a1aa" : "#71717a");

  return {
    isDark,
    fontClass,
    bgColor,
    textColor,
    surfaceColor,
    borderColor,
    accentColor,
    mutedTextColor,
  };
}
