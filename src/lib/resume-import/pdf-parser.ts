import { extractText } from "unpdf";
import { normalizeResumeText, isSufficientContent } from "./text-normalizer";
import { ResumeErrorCode } from "./types";

export interface ParsedDocumentResult {
  success: boolean;
  text?: string;
  totalPages?: number;
  errorCode?: ResumeErrorCode;
  errorMessage?: string;
}

const PARSE_TIMEOUT_MS = 15000; // 15 seconds

/**
 * In-memory, safe PDF text extraction using unpdf.
 * Does not execute shell commands or spawn child processes.
 */
export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedDocumentResult> {
  try {
    const parsePromise = (async () => {
      // unpdf accepts Uint8Array or ArrayBuffer
      const uint8 = new Uint8Array(buffer);
      const { text, totalPages } = await extractText(uint8);
      return { text: Array.isArray(text) ? text.join("\n") : text || "", totalPages };
    })();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("PDF_PARSE_TIMEOUT")), PARSE_TIMEOUT_MS)
    );

    const { text, totalPages } = await Promise.race([parsePromise, timeoutPromise]);

    const normalized = normalizeResumeText(text);

    if (!isSufficientContent(normalized)) {
      return {
        success: false,
        errorCode: "IMAGE_ONLY_DOCUMENT",
        errorMessage:
          "This PDF appears to be a scanned image or contains no readable text layer. Please upload a digital PDF with selectable text or a Word document (.docx).",
      };
    }

    return {
      success: true,
      text: normalized,
      totalPages,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "PDF_PARSE_TIMEOUT") {
      return {
        success: false,
        errorCode: "PARSE_TIMEOUT",
        errorMessage: "PDF processing timed out after 15 seconds.",
      };
    }

    const message = err instanceof Error ? err.message : "PDF extraction failed";
    return {
      success: false,
      errorCode: "CORRUPT_DOCUMENT",
      errorMessage: `Could not parse PDF document: ${message}`,
    };
  }
}
