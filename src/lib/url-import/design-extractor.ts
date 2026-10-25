import {
  WebsiteDesignAnalysis,
  DetectedPalette,
  TypographyCharacteristics,
  LayoutCharacteristics,
  ExtractedContentSnippet,
} from "./types";

/**
 * Checks if a hex color or HSL value is within the purple/violet spectrum.
 * Global Portfolify rule: Zero purple or violet gradients/accents.
 */
function isPurpleOrViolet(hex: string): boolean {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isRgbPurple(r, g, b);
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isRgbPurple(r, g, b);
  }
  return false;
}

function isRgbPurple(r: number, g: number, b: number): boolean {
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  // In RGB, purple/violet has high Red and Blue, and significantly lower Green (hue 260-310)
  return b > 120 && r > 100 && g < Math.min(r, b) * 0.75;
}

/**
 * Calculates relative luminance of an RGB hex string.
 * Returns 0 (darkest black) to 1 (brightest white).
 */
function getHexLuminance(hex: string): number {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  if (clean.length !== 6) return 0.5;

  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Safely extracts tag text or attribute values from HTML using robust regexes.
 */
function getMetaContent(html: string, nameOrProp: string): string {
  const regex = new RegExp(
    `<meta\\s+[^>]*(?:name|property)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return match[1].trim();

  // Try inverse attribute order: content="..." name="..."
  const altRegex = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProp}["']`,
    "i"
  );
  const altMatch = html.match(altRegex);
  return altMatch ? altMatch[1].trim() : "";
}

/**
 * Analyzes HTML text content and extracts design characteristics, color palette,
 * typography mood, and page sections without executing code.
 */
export function extractDesignFromHtml(
  html: string,
  sourceUrl: string,
  resolvedHost: string
): WebsiteDesignAnalysis {
  // 1. Metadata Extraction
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const pageTitle = (
    titleMatch ? titleMatch[1] : getMetaContent(html, "og:title")
  )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

  const metaDescription = (
    getMetaContent(html, "description") ||
    getMetaContent(html, "og:description")
  ).trim();

  // 2. Color Palette Extraction
  const themeColor = getMetaContent(html, "theme-color");

  // Find all hex colors in styles or attributes
  const hexMatches = html.match(/#[0-9a-fA-F]{3,6}\b/g) || [];
  const validHexes: string[] = [];

  for (const rawHex of hexMatches) {
    const clean = rawHex.toLowerCase();
    if (clean.length === 4 || clean.length === 7) {
      // Disallow purple/violet colors per design system rules
      if (!isPurpleOrViolet(clean)) {
        validHexes.push(clean);
      }
    }
  }

  // Determine light vs dark background
  let isDark = false;
  let background = "#ffffff";
  let surface = "#f4f4f5";
  let text = "#09090b";
  let mutedText = "#71717a";
  let primary = "#18181b";
  let secondary = "#71717a";
  let accent = "#356ae6"; // Portfolify signature blue accent

  if (themeColor && /^#[0-9a-fA-F]{3,6}$/.test(themeColor) && !isPurpleOrViolet(themeColor)) {
    accent = themeColor;
  }

  // Count dark vs light appearances in document
  let darkVotes = 0;
  let lightVotes = 0;
  for (const h of validHexes.slice(0, 100)) {
    const lum = getHexLuminance(h);
    if (lum < 0.25) darkVotes++;
    if (lum > 0.75) lightVotes++;
  }

  // Also check if body/html background is explicitly dark in styles
  const bodyBgMatch = html.match(/(?:body|html|:root)\s*\{[^}]*background(?:-color)?:\s*(#[0-9a-fA-F]{3,6})/i);
  let explicitDarkBg = false;
  if (bodyBgMatch) {
    const lum = getHexLuminance(bodyBgMatch[1]);
    if (lum < 0.3) {
      explicitDarkBg = true;
      background = bodyBgMatch[1];
    }
  }

  if (explicitDarkBg || (darkVotes > lightVotes && darkVotes >= 2)) {
    isDark = true;
    if (!explicitDarkBg) {
      background = "#0e1015";
    }
    surface = "#181a20";
    text = "#f4f4f5";
    mutedText = "#a1a1aa";
    primary = "#ffffff";
    secondary = "#a1a1aa";
  }

  // Select an appropriate accent from valid hexes if found
  const coloredHexes = validHexes.filter((h) => {
    const lum = getHexLuminance(h);
    return lum > 0.15 && lum < 0.85; // Exclude pure black and pure white
  });

  if (coloredHexes.length > 0) {
    const candidate = coloredHexes[0];
    if (!isPurpleOrViolet(candidate)) {
      accent = candidate;
    }
  }

  const palette: DetectedPalette = {
    primary,
    secondary,
    accent,
    background,
    surface,
    text,
    mutedText,
    isDark,
  };

  // 3. Typography Extraction
  let detectedFont = "Inter, sans-serif";
  let mood: "editorial" | "technical" | "modern-sans" | "classical-serif" | "minimal" = "modern-sans";
  let fontFamily: "sans" | "serif" | "mono" = "sans";

  const lowerHtml = html.toLowerCase();

  if (
    lowerHtml.includes("serif") ||
    lowerHtml.includes("playfair") ||
    lowerHtml.includes("merriweather") ||
    lowerHtml.includes("georgia") ||
    lowerHtml.includes("garamond")
  ) {
    detectedFont = "Georgia, serif";
    fontFamily = "serif";
    mood = "editorial";
  } else if (
    lowerHtml.includes("mono") ||
    lowerHtml.includes("jetbrains") ||
    lowerHtml.includes("fira code") ||
    lowerHtml.includes("courier") ||
    lowerHtml.includes("terminal")
  ) {
    detectedFont = "JetBrains Mono, monospace";
    fontFamily = "mono";
    mood = "technical";
  } else if (
    lowerHtml.includes("minimal") ||
    lowerHtml.includes("geist") ||
    lowerHtml.includes("helvetica")
  ) {
    detectedFont = "Geist, sans-serif";
    fontFamily = "sans";
    mood = "minimal";
  }

  const typography: TypographyCharacteristics = {
    detectedFont,
    mood,
    headingStyle: mood === "editorial" ? "editorial" : mood === "technical" ? "technical" : "clean",
    fontFamily,
  };

  // 4. Layout Characteristics
  let density: "compact" | "balanced" | "spacious" = "balanced";
  if (lowerHtml.includes("compact") || lowerHtml.includes("dense") || mood === "technical") {
    density = "compact";
  } else if (lowerHtml.includes("spacious") || mood === "editorial") {
    density = "spacious";
  }

  let cardStyle: "bordered" | "flat" | "elevated" | "glass" = "bordered";
  if (lowerHtml.includes("shadow-") || lowerHtml.includes("box-shadow")) {
    cardStyle = "elevated";
  } else if (lowerHtml.includes("backdrop-blur") || lowerHtml.includes("glass")) {
    cardStyle = "glass";
  } else if (lowerHtml.includes("border") || lowerHtml.includes("rounded")) {
    cardStyle = "bordered";
  } else {
    cardStyle = "flat";
  }

  let headerLayout: "split" | "centered" | "editorial" | "minimal" = "split";
  if (mood === "editorial") headerLayout = "editorial";
  else if (mood === "minimal") headerLayout = "minimal";

  const layout: LayoutCharacteristics = {
    density,
    cardStyle,
    headerLayout,
    contentWidth: density === "spacious" ? "wide" : "standard",
  };

  // 5. Section & Content Extraction
  const detectedSections: string[] = ["profile"];

  if (/project|portfolio|work|case\s*stud/i.test(html)) {
    detectedSections.push("projects");
  }
  if (/experience|career|employment|timeline|history/i.test(html)) {
    detectedSections.push("experience");
  }
  if (/skill|stack|technolog|expert/i.test(html)) {
    detectedSections.push("skills");
  }
  if (/education|degree|universit|college/i.test(html)) {
    detectedSections.push("education");
  }
  if (/contact|email|reach|message/i.test(html)) {
    detectedSections.push("contact");
  }

  // Extract candidate headline from <h1>
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  let headline = h1Match ? h1Match[1].trim() : pageTitle;
  // Truncate headline to 150 chars max
  headline = headline.replace(/\s+/g, " ").slice(0, 150);

  // Extract bio snippet from first prominent <p>
  const pMatch = html.match(/<p[^>]*>([^<]{30,300})<\/p>/i);
  let bioSnippet = pMatch ? pMatch[1].trim() : metaDescription;
  bioSnippet = bioSnippet.replace(/\s+/g, " ").slice(0, 500);

  // Project highlights from <h3> or <h2>
  const projectHighlights: { title: string; description?: string }[] = [];
  const headingMatches = html.matchAll(/<h[23][^>]*>([^<]{4,60})<\/h[23]>/gi);
  let count = 0;
  for (const match of headingMatches) {
    const title = match[1].trim();
    if (
      title &&
      !/about|contact|skills|experience|navigation|menu|footer/i.test(title) &&
      count < 4
    ) {
      projectHighlights.push({ title });
      count++;
    }
  }

  const extractedContent: ExtractedContentSnippet = {
    headline,
    bioSnippet,
    detectedSections,
    projectHighlights,
  };

  return {
    sourceUrl,
    resolvedHost,
    timestamp: new Date().toISOString(),
    pageTitle: pageTitle.slice(0, 100),
    metaDescription: metaDescription.slice(0, 300),
    palette,
    typography,
    layout,
    extractedContent,
    limitations: [
      "Extracted from public static HTML markup only.",
      "Dynamic browser animations and client-side JavaScript states were not executed.",
      "Design inspiration applied as layout tokens; proprietary assets and images were not cloned.",
    ],
  };
}
