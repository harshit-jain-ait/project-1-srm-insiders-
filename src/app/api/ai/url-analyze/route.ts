import { NextRequest, NextResponse } from "next/server";
import { UrlImportRequestSchema, UrlImportApiResponse, WebsiteDesignAnalysis } from "@/lib/url-import/types";
import { safeFetchHtml } from "@/lib/url-import/fetch-service";
import { extractDesignFromHtml } from "@/lib/url-import/design-extractor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = UrlImportRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const message = firstIssue ? firstIssue.message : "Invalid URL request parameters.";
      const isPermissionErr = firstIssue?.path.includes("confirmPermission");

      const response: UrlImportApiResponse<never> = {
        success: false,
        code: isPermissionErr ? "PERMISSION_REQUIRED" : "INVALID_URL",
        error: message,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { url } = parseResult.data;

    // Secure website retrieval with SSRF and size safeguards
    const fetchResult = await safeFetchHtml(url);

    if (!fetchResult.success || !fetchResult.html || !fetchResult.finalUrl) {
      const statusMap: Record<string, number> = {
        INVALID_URL: 400,
        UNSUPPORTED_PROTOCOL: 400,
        SSRF_BLOCKED: 403,
        DNS_RESOLUTION_FAILED: 404,
        CONNECTION_TIMEOUT: 504,
        RESPONSE_TOO_LARGE: 413,
        UNSUPPORTED_CONTENT_TYPE: 415,
        REDIRECT_LIMIT_EXCEEDED: 400,
      };

      const httpStatus = statusMap[fetchResult.errorCode || ""] || 502;
      const response: UrlImportApiResponse<never> = {
        success: false,
        code: fetchResult.errorCode || "CONNECTION_FAILED",
        error: fetchResult.errorMessage || "Failed to retrieve public website.",
      };
      return NextResponse.json(response, { status: httpStatus });
    }

    const resolvedUrl = new URL(fetchResult.finalUrl);
    const analysis = extractDesignFromHtml(fetchResult.html, fetchResult.finalUrl, resolvedUrl.hostname);

    const response: UrlImportApiResponse<WebsiteDesignAnalysis> = {
      success: true,
      data: analysis,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error during URL analysis.";
    const response: UrlImportApiResponse<never> = {
      success: false,
      code: "ANALYSIS_FAILED",
      error: errorMsg,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
