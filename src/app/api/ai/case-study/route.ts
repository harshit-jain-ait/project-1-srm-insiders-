import { NextRequest, NextResponse } from "next/server";
import {
  generateCaseStudyOutline,
  improveCaseStudySection,
  evaluateCaseStudyQuality,
} from "@/lib/case-study/case-study-ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "generate_outline") {
      const { title, category, tagline, notes, technologies } = body;
      if (!title || typeof title !== "string") {
        return NextResponse.json(
          { success: false, error: "Project title is required." },
          { status: 400 }
        );
      }

      const result = await generateCaseStudyOutline({
        title,
        category: category || "software",
        tagline,
        notes,
        technologies,
      });

      return NextResponse.json({ success: true, data: result });
    }

    if (action === "improve_section") {
      const { sectionTitle, sectionType, sourceText, operation, projectContext } = body;
      if (!sourceText || typeof sourceText !== "string") {
        return NextResponse.json(
          { success: false, error: "Source text is required." },
          { status: 400 }
        );
      }

      const result = await improveCaseStudySection({
        sectionTitle: sectionTitle || "Section",
        sectionType: sectionType || "text",
        sourceText,
        operation: operation || "improve_clarity",
        projectContext,
      });

      return NextResponse.json({ success: true, data: result });
    }

    if (action === "quality_check") {
      const { sections, projectTitle, liveUrl, repoUrl } = body;
      const result = evaluateCaseStudyQuality(
        Array.isArray(sections) ? sections : [],
        projectTitle || "Project",
        liveUrl,
        repoUrl
      );

      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { success: false, error: `Unsupported case study action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[API/ai/case-study] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error processing case study AI request." },
      { status: 500 }
    );
  }
}
