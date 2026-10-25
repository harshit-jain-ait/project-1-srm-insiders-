import mammoth from "mammoth";
import { normalizeResumeText, isSufficientContent } from "./text-normalizer";
import { ParsedDocumentResult } from "./pdf-parser";

const PARSE_TIMEOUT_MS = 15000;
const MAX_UNCOMPRESSED_CHARS = 10 * 1024 * 1024; // 10 million characters (~10MB text)

/**
 * In-memory, safe DOCX text extraction using mammoth.
 * Strictly checks uncompressed character thresholds to avoid decompression bombs.
 */
export async function parseDocxBuffer(buffer: Buffer): Promise<ParsedDocumentResult> {
  try {
    const parsePromise = (async () => {
      const result = await mammoth.extractRawText({ buffer });
      const rawText = result.value || "";
      if (rawText.length > MAX_UNCOMPRESSED_CHARS) {
        throw new Error("DECOMPRESSION_BOMB_THRESHOLD_EXCEEDED");
      }
      return rawText;
    })();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DOCX_PARSE_TIMEOUT")), PARSE_TIMEOUT_MS)
    );

    const rawText = await Promise.race([parsePromise, timeoutPromise]);
    const normalized = normalizeResumeText(rawText);

    if (!isSufficientContent(normalized)) {
      return {
        success: false,
        errorCode: "EMPTY_DOCUMENT",
        errorMessage: "This Word document contains no readable text.",
      };
    }

    return {
      success: true,
      text: normalized,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "DOCX_PARSE_TIMEOUT") {
        return {
          success: false,
          errorCode: "PARSE_TIMEOUT",
          errorMessage: "Word document processing timed out after 15 seconds.",
        };
      }
      if (err.message === "DECOMPRESSION_BOMB_THRESHOLD_EXCEEDED") {
        return {
          success: false,
          errorCode: "FILE_TOO_LARGE",
          errorMessage: "Decompressed document content exceeded maximum safety threshold.",
        };
      }
    }

    const message = err instanceof Error ? err.message : "DOCX parsing failed";
    return {
      success: false,
      errorCode: "CORRUPT_DOCUMENT",
      errorMessage: `Could not parse Word document: ${message}`,
    };
  }
}
