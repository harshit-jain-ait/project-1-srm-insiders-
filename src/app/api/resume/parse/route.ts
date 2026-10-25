import { NextRequest, NextResponse } from "next/server";
import { resumeService } from "@/lib/resume-import/resume-service";
import { ResumeApiResponse, ExtractedResumeData } from "@/lib/resume-import/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") || formData.get("file");

    if (!file || typeof file === "string") {
      const response: ResumeApiResponse<never> = {
        success: false,
        code: "UNSUPPORTED_FORMAT",
        error: "No file was uploaded. Please select a resume file (.pdf, .docx, .txt).",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const blob = file as Blob;
    const fileName = (file as File).name || "resume_upload";
    const mimeType = blob.type || undefined;

    // Convert to Node.js Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await resumeService.parseResumeFile(fileName, buffer, mimeType);

    if (!result.success || !result.data) {
      const statusMap: Record<string, number> = {
        FILE_TOO_LARGE: 413,
        UNSUPPORTED_FORMAT: 415,
        INVALID_MAGIC_BYTES: 400,
        EMPTY_DOCUMENT: 400,
        IMAGE_ONLY_DOCUMENT: 422,
        PARSE_TIMEOUT: 504,
        CORRUPT_DOCUMENT: 422,
      };

      const status = statusMap[result.code || ""] || 400;
      return NextResponse.json(result, { status });
    }

    const response: ResumeApiResponse<ExtractedResumeData> = {
      success: true,
      data: result.data,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error parsing resume document.";
    const response: ResumeApiResponse<never> = {
      success: false,
      code: "EXTRACTION_FAILED",
      error: errorMsg,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
