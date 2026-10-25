import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  WebsiteDesignAnalysisSchema,
  UrlImportApiResponse,
  GeneratedDirectionsResult,
} from "@/lib/url-import/types";
import { directionGenerator } from "@/lib/url-import/direction-generator";

const GenerateDirectionsRequestSchema = z.object({
  analysis: WebsiteDesignAnalysisSchema,
  confirmPermission: z.boolean().refine((v) => v === true, {
    message: "Permission confirmation is required to generate design directions",
  }),
  existingPortfolio: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = GenerateDirectionsRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const message = firstIssue ? firstIssue.message : "Invalid direction generation request parameters.";
      const isPermissionErr = firstIssue?.path.includes("confirmPermission");

      const response: UrlImportApiResponse<never> = {
        success: false,
        code: isPermissionErr ? "PERMISSION_REQUIRED" : "INVALID_URL",
        error: message,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { analysis, existingPortfolio } = parseResult.data;

    const result = await directionGenerator.generateDirections(analysis, existingPortfolio);

    const response: UrlImportApiResponse<GeneratedDirectionsResult> = {
      success: true,
      data: result,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to synthesize design directions.";
    const response: UrlImportApiResponse<never> = {
      success: false,
      code: "ANALYSIS_FAILED",
      error: errorMsg,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
