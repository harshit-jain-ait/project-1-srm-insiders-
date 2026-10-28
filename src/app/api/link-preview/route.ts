import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/link-preview?url=<encoded-url>
 *
 * Returns a JSON payload with:
 *   { imageUrl: string }
 *
 * Strategy:
 * 1. Try to fetch the target URL and extract the og:image meta tag.
 * 2. If og:image is found, return it.
 * 3. Fallback: return a WordPress mshots screenshot URL which captures
 *    a full-page screenshot of any public website for free.
 */
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let targetUrl = urlParam.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  // WordPress mshots is a reliable zero-auth screenshot service
  const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1200&h=800`;

  try {
    // Attempt to fetch the page and extract og:image
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Portfolify-Preview/1.0; +https://portfolify.app)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      // Not an HTML page — return mshots fallback
      return NextResponse.json({ imageUrl: mshotsUrl });
    }

    const html = await response.text();

    // Extract og:image
    const ogImageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );

    if (ogImageMatch && ogImageMatch[1]) {
      let ogImage = ogImageMatch[1].trim();
      // Make relative URLs absolute
      if (ogImage.startsWith("/")) {
        const parsed = new URL(targetUrl);
        ogImage = `${parsed.origin}${ogImage}`;
      }
      return NextResponse.json({ imageUrl: ogImage });
    }

    // Try twitter:image as a fallback
    const twitterImageMatch = html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
    );

    if (twitterImageMatch && twitterImageMatch[1]) {
      let twitterImage = twitterImageMatch[1].trim();
      if (twitterImage.startsWith("/")) {
        const parsed = new URL(targetUrl);
        twitterImage = `${parsed.origin}${twitterImage}`;
      }
      return NextResponse.json({ imageUrl: twitterImage });
    }

    // No OG or twitter image found — fall back to mshots
    return NextResponse.json({ imageUrl: mshotsUrl });
  } catch {
    // Network error / timeout / DNS failure — use mshots screenshot
    return NextResponse.json({ imageUrl: mshotsUrl });
  }
}
