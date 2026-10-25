import { NextRequest, NextResponse } from "next/server";
import { aiAssistantService } from "@/lib/ai-assistant/assistant-service";
import {
  ContentAssistRequestSchema,
  AssistantApiResponse,
  ContentAssistResponse,
} from "@/lib/ai-assistant/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = ContentAssistRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const response: AssistantApiResponse<never> = {
        success: false,
        code: "INVALID_SCHEMA",
        error: firstIssue ? firstIssue.message : "Invalid content assistant request.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await aiAssistantService.improveContent(parseResult.data);

    if (!result.success) {
      const status = result.code === "RATE_LIMITED" ? 429 : 502;
      return NextResponse.json(result, { status });
    }

    const response: AssistantApiResponse<ContentAssistResponse> = {
      success: true,
      data: result.data,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error during content assistance.";
    const response: AssistantApiResponse<never> = {
      success: false,
      code: "OPERATION_FAILED",
      error: errorMsg,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
