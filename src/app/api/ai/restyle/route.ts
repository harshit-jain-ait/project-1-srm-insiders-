import { NextRequest, NextResponse } from "next/server";
import { aiAssistantService } from "@/lib/ai-assistant/assistant-service";
import {
  RestyleRequestSchema,
  AssistantApiResponse,
  RestyleResponse,
} from "@/lib/ai-assistant/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = RestyleRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const response: AssistantApiResponse<never> = {
        success: false,
        code: "INVALID_SCHEMA",
        error: firstIssue ? firstIssue.message : "Invalid restyling request.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await aiAssistantService.generateRestyling(parseResult.data);

    if (!result.success) {
      const status = result.code === "RATE_LIMITED" ? 429 : 502;
      return NextResponse.json(result, { status });
    }

    const response: AssistantApiResponse<RestyleResponse> = {
      success: true,
      data: result.data,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error during visual restyling.";
    const response: AssistantApiResponse<never> = {
      success: false,
      code: "OPERATION_FAILED",
      error: errorMsg,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
