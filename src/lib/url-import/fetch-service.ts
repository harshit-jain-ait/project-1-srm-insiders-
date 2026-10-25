import { validateAndResolveUrl } from "./url-security";
import { UrlAnalysisErrorCode } from "./types";

export interface SafeFetchResult {
  success: boolean;
  html?: string;
  finalUrl?: string;
  statusCode?: number;
  errorCode?: UrlAnalysisErrorCode;
  errorMessage?: string;
}

const MAX_RESPONSE_BYTES = 512 * 1024; // 512 KB limit to prevent resource exhaustion
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds
const MAX_REDIRECTS = 3;

/**
 * Safely fetches an external URL:
 * - Strictly revalidates redirect targets against SSRF rules at every hop
 * - Enforces content-type allowlisting (HTML/text only)
 * - Limits response payload size to 512KB
 * - Enforces 10-second timeout
 */
export async function safeFetchHtml(initialUrl: string): Promise<SafeFetchResult> {
  let currentUrl = initialUrl;
  let redirectCount = 0;

  while (redirectCount <= MAX_REDIRECTS) {
    // 1. SSRF & URL security validation on the current hop
    const securityCheck = await validateAndResolveUrl(currentUrl);
    if (!securityCheck.isSafe || !securityCheck.normalizedUrl) {
      return {
        success: false,
        errorCode: securityCheck.errorCode || "SSRF_BLOCKED",
        errorMessage: securityCheck.errorMessage || "Destination failed security verification.",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(securityCheck.normalizedUrl.toString(), {
        method: "GET",
        headers: {
          Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.1",
          "User-Agent": "Mozilla/5.0 (compatible; Portfolify-DesignBot/1.0; +https://portfolify.dev)",
          "Cache-Control": "no-cache",
        },
        redirect: "manual", // Handle redirects manually to inspect and re-validate every destination
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP redirects (301, 302, 303, 307, 308)
      if (
        response.status === 301 ||
        response.status === 302 ||
        response.status === 303 ||
        response.status === 307 ||
        response.status === 308
      ) {
        const locationHeader = response.headers.get("location");
        if (!locationHeader) {
          return {
            success: false,
            statusCode: response.status,
            errorCode: "CONNECTION_FAILED",
            errorMessage: "Redirect received without a Location header.",
          };
        }

        redirectCount++;
        if (redirectCount > MAX_REDIRECTS) {
          return {
            success: false,
            errorCode: "REDIRECT_LIMIT_EXCEEDED",
            errorMessage: `Too many redirects (exceeded maximum of ${MAX_REDIRECTS}).`,
          };
        }

        // Resolve relative redirect URLs against the current URL
        try {
          const nextUrl = new URL(locationHeader, securityCheck.normalizedUrl).toString();
          currentUrl = nextUrl;
          continue; // Loop to validate next hop
        } catch {
          return {
            success: false,
            errorCode: "INVALID_URL",
            errorMessage: "Redirect location is malformed.",
          };
        }
      }

      // Check HTTP Status
      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          errorCode: "CONNECTION_FAILED",
          errorMessage: `Target website responded with HTTP status ${response.status}.`,
        };
      }

      // 2. Validate Content-Type
      const contentType = response.headers.get("content-type") || "";
      const isHtmlOrText =
        contentType.includes("text/html") ||
        contentType.includes("application/xhtml+xml") ||
        contentType.includes("text/plain");

      if (!isHtmlOrText) {
        return {
          success: false,
          errorCode: "UNSUPPORTED_CONTENT_TYPE",
          errorMessage: `Unsupported content type "${contentType}". Only public HTML web pages can be analyzed.`,
        };
      }

      // 3. Stream & byte length limiting
      if (!response.body) {
        const text = await response.text();
        return {
          success: true,
          html: text,
          finalUrl: securityCheck.normalizedUrl.toString(),
          statusCode: response.status,
        };
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          totalBytes += value.length;
          if (totalBytes > MAX_RESPONSE_BYTES) {
            reader.cancel();
            return {
              success: false,
              errorCode: "RESPONSE_TOO_LARGE",
              errorMessage: `Webpage exceeded maximum size limit of ${MAX_RESPONSE_BYTES / 1024} KB.`,
            };
          }
          chunks.push(value);
        }
      }

      // Combine chunks into string
      const decoder = new TextDecoder("utf-8");
      let fullHtml = "";
      for (const chunk of chunks) {
        fullHtml += decoder.decode(chunk, { stream: true });
      }
      fullHtml += decoder.decode();

      return {
        success: true,
        html: fullHtml,
        finalUrl: securityCheck.normalizedUrl.toString(),
        statusCode: response.status,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === "AbortError") {
        return {
          success: false,
          errorCode: "CONNECTION_TIMEOUT",
          errorMessage: `Connection timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
        };
      }

      const message = err instanceof Error ? err.message : "Failed to fetch website";
      return {
        success: false,
        errorCode: "CONNECTION_FAILED",
        errorMessage: `Could not retrieve website: ${message}`,
      };
    }
  }

  return {
    success: false,
    errorCode: "REDIRECT_LIMIT_EXCEEDED",
    errorMessage: `Exceeded maximum redirect limit of ${MAX_REDIRECTS}.`,
  };
}
