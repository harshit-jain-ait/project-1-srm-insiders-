import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai/ai-service";
import { AIGenerationInput, AIGenerationInputSchema } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Backwards-compatibility with simple { facts: string } prompt string
    let input: AIGenerationInput;

    if (body.facts && !body.targetRole) {
      if (typeof body.facts !== "string" || body.facts.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Input facts cannot be empty." },
          { status: 400 }
        );
      }

      input = {
        fullName: "",
        targetRole: "Professional",
        background: body.facts.slice(0, 3000),
        rawSkills: "",
        rawExperience: "",
        rawProjects: "",
        rawEducation: "",
        links: [],
        preferences: {
          profession: "General Professional",
          tone: "professional",
          purpose: "showcase",
          contentLength: "concise",
          templateId: "minimal-portfolio",
        },
      };
    } else {
      // Validate full structured wizard input
      const validationResult = AIGenerationInputSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed for AI generation input.",
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }
      input = validationResult.data;
    }

    const result = await aiService.generatePortfolio(input);

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

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error: unknown) {
    console.error("[API/ai/generate] Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Internal error during portfolio generation.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
