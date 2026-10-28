import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl = urlParam.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    const targetParsed = new URL(targetUrl);
    const origin = targetParsed.origin;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type") || "text/html";

    if (!contentType.includes("text/html")) {
      // If non-HTML (e.g. image, pdf), stream directly
      const blob = await response.blob();
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    let html = await response.text();

    // Inject <base href="..."> into <head> so relative assets load directly from the origin
    const baseTag = `<base href="${origin}/" target="_blank" />`;
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>\n  ${baseTag}`);
    } else if (html.includes("<HEAD>")) {
      html = html.replace("<HEAD>", `<HEAD>\n  ${baseTag}`);
    } else {
      html = `${baseTag}\n${html}`;
    }

    // Strip frame-busting scripts and meta CSP frame-ancestors
    html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "");
    html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, "");

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Crucial: Omit X-Frame-Options and CSP frame-ancestors so iframe embedding is allowed!
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[proxy-embed] Error fetching target:", error);
    // Fallback HTML with visual snapshot and direct link
    const snapshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1200&h=800`;
    const fallbackHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Live Preview</title>
      <style>
        body { margin: 0; padding: 0; background: #0c101a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
        .card { max-width: 90%; background: #111927; border: 1px solid #233044; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; }
        .img-wrap { width: 100%; max-height: 480px; overflow: hidden; background: #070a12; }
        img { width: 100%; height: auto; display: block; object-fit: cover; }
        .info { padding: 20px; }
        a.btn { display: inline-block; padding: 10px 20px; background: #ff5c1a; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="img-wrap">
          <img src="${snapshotUrl}" alt="Live Preview Snapshot" onerror="this.src='/images/studio/design-system.jpg'" />
        </div>
        <div class="info">
          <h3>Live Preview Snapshot</h3>
          <p style="color:#8a99ad;font-size:13px;">${targetUrl}</p>
          <a class="btn" href="${targetUrl}" target="_blank" rel="noopener noreferrer">Open Website in New Tab ↗</a>
        </div>
      </div>
    </body>
    </html>`;

    return new NextResponse(fallbackHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

