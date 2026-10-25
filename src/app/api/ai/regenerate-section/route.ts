import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai/ai-service";
import { AIRegenerateSectionInputSchema } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const validationResult = AIRegenerateSectionInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid section regeneration parameters.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await aiService.regenerateSection(validationResult.data);

    if (!result.success) {
      const status =
        result.code === "MISSING_API_KEY"
          ? 400
          : result.code === "RATE_LIMITED"
          ? 429
          : result.code === "TIMEOUT"
          ? 504
          : result.code === "PROVIDER_ERROR"
          ? 502
          : 500;

      return NextResponse.json(
        {
          success: false,
          code: result.code,
          error: result.error,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API/ai/regenerate-section] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to regenerate section";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
