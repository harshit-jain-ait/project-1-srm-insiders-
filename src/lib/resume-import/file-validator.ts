import { RESUME_UPLOAD_LIMITS, ResumeFileFormat, ResumeErrorCode } from "./types";

export interface FileValidationResult {
  valid: boolean;
  format?: ResumeFileFormat;
  sanitizedFileName?: string;
  errorCode?: ResumeErrorCode;
  errorMessage?: string;
}

/**
 * Sanitizes user-provided filenames to prevent path traversal, null-byte injection,
 * or control-character exploit vectors.
 */
export function sanitizeFileName(rawName: string): string {
  // Remove directory paths and path traversal sequences
  const baseName = rawName.replace(/^.*[\\/]/, "").replace(/\0/g, "");
  // Remove dangerous control characters while preserving unicode letters and numbers
  const cleaned = baseName.replace(/[^\w\s.-]/g, "_").trim();
  return cleaned.slice(0, 100) || "resume_upload";
}

/**
 * Checks magic byte signatures:
 * - PDF: %PDF- (0x25 0x50 0x44 0x46 0x2D)
 * - DOCX: PK\x03\x04 (0x50 0x4B 0x03 0x04)
 */
export function verifyMagicBytes(buffer: Buffer, format: ResumeFileFormat): boolean {
  if (buffer.length < 4) return false;

  if (format === "pdf") {
    // Check %PDF (0x25, 0x50, 0x44, 0x46)
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  if (format === "docx") {
    // Standard ZIP local file header PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    );
  }

  if (format === "txt" || format === "md") {
    // Text documents must not contain raw null bytes or binary executable headers
    // Check first 1KB for null bytes
    const checkLength = Math.min(buffer.length, 1024);
    for (let i = 0; i < checkLength; i++) {
      if (buffer[i] === 0x00) return false;
    }
    // Reject Windows PE executable header "MZ" (0x4D 0x5A)
    if (buffer[0] === 0x4d && buffer[1] === 0x5a) return false;
    // Reject Linux ELF header (0x7F 'E' 'L' 'F')
    if (buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Validates file upload buffer, size limits, extension, MIME type, and magic bytes.
 */
export function validateResumeUpload(
  fileName: string,
  buffer: Buffer,
  mimeType?: string
): FileValidationResult {
  const sanitized = sanitizeFileName(fileName);

  // 1. Size Validation
  if (buffer.length === 0) {
    return {
      valid: false,
      sanitizedFileName: sanitized,
      errorCode: "EMPTY_DOCUMENT",
      errorMessage: "The uploaded file is empty (0 bytes).",
    };
  }

  if (buffer.length > RESUME_UPLOAD_LIMITS.maxSizeBytes) {
    return {
      valid: false,
      sanitizedFileName: sanitized,
      errorCode: "FILE_TOO_LARGE",
      errorMessage: `File size (${(buffer.length / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum limit of ${RESUME_UPLOAD_LIMITS.maxSizeFormatted}.`,
    };
  }

  // 2. Extension Detection
  const lowerName = sanitized.toLowerCase();
  let format: ResumeFileFormat | null = null;

  if (lowerName.endsWith(".pdf")) format = "pdf";
  else if (lowerName.endsWith(".docx")) format = "docx";
  else if (lowerName.endsWith(".txt")) format = "txt";
  else if (lowerName.endsWith(".md")) format = "md";

  if (!format) {
    return {
      valid: false,
      sanitizedFileName: sanitized,
      errorCode: "UNSUPPORTED_FORMAT",
      errorMessage: `Unsupported file type. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt, .md).`,
    };
  }

  // 3. MIME Type Verification (if provided)
  if (mimeType) {
    const lowerMime = mimeType.toLowerCase();
    const isMimeAllowed = RESUME_UPLOAD_LIMITS.allowedMimeTypes.some((allowed) =>
      lowerMime.includes(allowed)
    );
    // Allow octet-stream as fallback only if magic bytes pass
    if (!isMimeAllowed && !lowerMime.includes("application/octet-stream")) {
      return {
        valid: false,
        sanitizedFileName: sanitized,
        errorCode: "UNSUPPORTED_FORMAT",
        errorMessage: `MIME type "${mimeType}" does not match allowed resume document types.`,
      };
    }
  }

  // 4. Magic Byte Verification
  if (!verifyMagicBytes(buffer, format)) {
    return {
      valid: false,
      sanitizedFileName: sanitized,
      errorCode: "INVALID_MAGIC_BYTES",
      errorMessage: `File contents do not match the expected signature for a valid .${format} document.`,
    };
  }

  return {
    valid: true,
    format,
    sanitizedFileName: sanitized,
  };
}
