export type EmbedProvider = "youtube" | "vimeo" | "loom" | "figma" | "codepen" | "custom";

export interface SanitizedEmbedResult {
  isValid: boolean;
  provider: EmbedProvider;
  embedUrl?: string;
  originalUrl: string;
  error?: string;
}

/**
 * Sanitizes and normalizes third-party embed URLs into safe, responsive embed targets.
 * Enforces strict origin matching to prevent arbitrary iframes or script execution.
 */
export function sanitizeEmbedUrl(rawUrl: string): SanitizedEmbedResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      isValid: false,
      provider: "custom",
      originalUrl: "",
      error: "Embed URL is required.",
    };
  }

  const trimmed = rawUrl.trim();

  // Reject unsafe schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return {
      isValid: false,
      provider: "custom",
      originalUrl: trimmed,
      error: "Unsafe protocol scheme detected.",
    };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // 1. YouTube
    if (
      host === "www.youtube.com" ||
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be"
    ) {
      let videoId = "";

      if (host === "youtu.be") {
        videoId = parsed.pathname.slice(1);
      } else if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "");
      }

      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return {
          isValid: true,
          provider: "youtube",
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
          originalUrl: trimmed,
        };
      }

      return {
        isValid: false,
        provider: "youtube",
        originalUrl: trimmed,
        error: "Invalid YouTube video ID.",
      };
    }

    // 2. Vimeo
    if (host === "vimeo.com" || host === "www.vimeo.com" || host === "player.vimeo.com") {
      let videoId = "";
      if (host === "player.vimeo.com" && parsed.pathname.startsWith("/video/")) {
        videoId = parsed.pathname.replace("/video/", "");
      } else {
        const match = parsed.pathname.match(/\/(\d+)/);
        if (match) videoId = match[1];
      }

      if (/^\d+$/.test(videoId)) {
        return {
          isValid: true,
          provider: "vimeo",
          embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
          originalUrl: trimmed,
        };
      }

      return {
        isValid: false,
        provider: "vimeo",
        originalUrl: trimmed,
        error: "Invalid Vimeo video URL or ID.",
      };
    }

    // 3. Loom
    if (host === "www.loom.com" || host === "loom.com") {
      const match = parsed.pathname.match(/\/(share|embed)\/([a-zA-Z0-9]+)/);
      if (match && match[2]) {
        return {
          isValid: true,
          provider: "loom",
          embedUrl: `https://www.loom.com/embed/${match[2]}`,
          originalUrl: trimmed,
        };
      }

      return {
        isValid: false,
        provider: "loom",
        originalUrl: trimmed,
        error: "Invalid Loom share URL.",
      };
    }

    // 4. Figma
    if (host === "www.figma.com" || host === "figma.com") {
      if (
        parsed.pathname.startsWith("/file/") ||
        parsed.pathname.startsWith("/proto/") ||
        parsed.pathname.startsWith("/design/")
      ) {
        const encoded = encodeURIComponent(trimmed);
        return {
          isValid: true,
          provider: "figma",
          embedUrl: `https://www.figma.com/embed?embed_host=portfolify&url=${encoded}`,
          originalUrl: trimmed,
        };
      }

      return {
        isValid: false,
        provider: "figma",
        originalUrl: trimmed,
        error: "Figma URL must point to a file, prototype, or design canvas.",
      };
    }

    // 5. CodePen
    if (host === "codepen.io" || host === "www.codepen.io") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      // e.g. /username/pen/id or /username/embed/id
      if (parts.length >= 3 && (parts[1] === "pen" || parts[1] === "embed")) {
        const user = parts[0];
        const penId = parts[2];
        return {
          isValid: true,
          provider: "codepen",
          embedUrl: `https://codepen.io/${user}/embed/${penId}?default-tab=result&theme-id=dark`,
          originalUrl: trimmed,
        };
      }

      return {
        isValid: false,
        provider: "codepen",
        originalUrl: trimmed,
        error: "Invalid CodePen URL structure.",
      };
    }

    return {
      isValid: false,
      provider: "custom",
      originalUrl: trimmed,
      error: `Unsupported embed host "${host}". Supported platforms: YouTube, Vimeo, Loom, Figma, CodePen.`,
    };
  } catch {
    return {
      isValid: false,
      provider: "custom",
      originalUrl: trimmed,
      error: "Malformed URL.",
    };
  }
}

export function getSupportedEmbedProviders(): { id: EmbedProvider; name: string; example: string }[] {
  return [
    { id: "youtube", name: "YouTube", example: "https://www.youtube.com/watch?v=..." },
    { id: "vimeo", name: "Vimeo", example: "https://vimeo.com/..." },
    { id: "loom", name: "Loom", example: "https://www.loom.com/share/..." },
    { id: "figma", name: "Figma", example: "https://www.figma.com/design/..." },
    { id: "codepen", name: "CodePen", example: "https://codepen.io/.../pen/..." },
  ];
}

