import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resumeService } from "@/lib/resume-import/resume-service";
import { ResumeApiResponse } from "@/lib/resume-import/types";

const RewriteRequestSchema = z.object({
  sectionType: z.string().min(1, "Section type is required"),
  rawText: z.string().trim().min(1, "Raw text is required").max(3000, "Text exceeds 3000 characters limit"),
  tone: z.string().optional().default("professional"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = RewriteRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const response: ResumeApiResponse<never> = {
        success: false,
        code: "INVALID_SCHEMA",
        error: firstIssue ? firstIssue.message : "Invalid rewriting parameters.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { sectionType, rawText, tone } = parseResult.data;

    const result = await resumeService.rewriteSectionWithAi(sectionType, rawText, tone);

    if (!result.success) {
      const status = result.code === "RATE_LIMITED" ? 429 : 502;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error during resume text rewriting.";
    const response: ResumeApiResponse<never> = {
      success: false,
      code: "EXTRACTION_FAILED",
      error: errorMsg,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
