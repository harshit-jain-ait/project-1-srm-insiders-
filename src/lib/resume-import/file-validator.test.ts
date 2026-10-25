import { describe, it, expect } from "vitest";
import {
  validateResumeUpload,
  sanitizeFileName,
} from "./file-validator";
import { RESUME_UPLOAD_LIMITS } from "./types";

describe("Resume File Validator & Security Safeguards", () => {
  it("sanitizes filenames and prevents path traversal", () => {
    expect(sanitizeFileName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFileName("..\\..\\Windows\\System32\\cmd.exe")).toBe("cmd.exe");
    expect(sanitizeFileName("my resume (final) [2026].pdf")).toBe("my resume _final_ _2026_.pdf");
    expect(sanitizeFileName("   spaced name.docx   ")).toBe("spaced name.docx");
  });

  it("accepts valid PDF with %PDF magic bytes", () => {
    const validPdfBuffer = Buffer.from("%PDF-1.7\n1 0 obj\n<<\n>>\nendobj\ntrailer\n<<>>\n%%EOF");
    const result = validateResumeUpload("john_doe_resume.pdf", validPdfBuffer, "application/pdf");

    expect(result.valid).toBe(true);
    expect(result.format).toBe("pdf");
    expect(result.sanitizedFileName).toBe("john_doe_resume.pdf");
  });

  it("accepts valid DOCX with PK zip magic bytes", () => {
    // DOCX files are zip archives starting with PK\x03\x04
    const validDocxBuffer = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00]);
    const result = validateResumeUpload(
      "sarah_resume.docx",
      validDocxBuffer,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    expect(result.valid).toBe(true);
    expect(result.format).toBe("docx");
  });

  it("accepts valid plain text files", () => {
    const textBuffer = Buffer.from("Senior Software Engineer with 8 years of experience building APIs.");
    const result = validateResumeUpload("resume.txt", textBuffer, "text/plain");

    expect(result.valid).toBe(true);
    expect(result.format).toBe("txt");
  });

  it("rejects files exceeding maximum size limit (5MB)", () => {
    const oversizedBuffer = Buffer.alloc(RESUME_UPLOAD_LIMITS.maxSizeBytes + 1024);
    // Write PDF magic bytes so format passes but size fails
    oversizedBuffer.write("%PDF-");

    const result = validateResumeUpload("huge_resume.pdf", oversizedBuffer, "application/pdf");

    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("FILE_TOO_LARGE");
    expect(result.errorMessage).toContain("5.0 MB");
  });

  it("rejects unsupported extensions", () => {
    const exeBuffer = Buffer.from("MZ\x90\x00\x03\x00\x00\x00");
    const result = validateResumeUpload("malware.exe", exeBuffer, "application/octet-stream");

    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("UNSUPPORTED_FORMAT");
    expect(result.errorMessage).toContain("Unsupported file type");
  });

  it("rejects PDF with spoofed extension and invalid magic bytes", () => {
    const fakePdfBuffer = Buffer.from("This is not a real PDF document at all.");
    const result = validateResumeUpload("fake.pdf", fakePdfBuffer, "application/pdf");

    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("INVALID_MAGIC_BYTES");
    expect(result.errorMessage).toContain("signature for a valid .pdf document");
  });

  it("rejects DOCX with spoofed extension and invalid magic bytes", () => {
    const fakeDocxBuffer = Buffer.from("This is a plain text file renamed to docx.");
    const result = validateResumeUpload("fake.docx", fakeDocxBuffer);

    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("INVALID_MAGIC_BYTES");
    expect(result.errorMessage).toContain("signature for a valid .docx document");
  });

  it("rejects text files containing binary null bytes", () => {
    const binaryBuffer = Buffer.from("text\x00binary\x00payload");
    const result = validateResumeUpload("resume.txt", binaryBuffer, "text/plain");

    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("INVALID_MAGIC_BYTES");
    expect(result.errorMessage).toContain("signature for a valid .txt document");
  });
});
