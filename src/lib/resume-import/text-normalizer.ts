/**
 * Normalizes raw document text extracted from PDF, DOCX, or text files:
 * - Unifies Unicode ligatures (fi, fl, ffi, etc.)
 * - Standardizes bullet characters and hyphens
 * - Collapses excessive vertical and horizontal whitespace
 * - Preserves structural paragraphs and section headings
 */
export function normalizeResumeText(raw: string): string {
  if (!raw || raw.trim() === "") return "";

  let text = raw;

  // 1. Replace Unicode ligatures
  text = text
    .replace(/\uFB00/g, "ff")
    .replace(/\uFB01/g, "fi")
    .replace(/\uFB02/g, "fl")
    .replace(/\uFB03/g, "ffi")
    .replace(/\uFB04/g, "ffl")
    .replace(/\uFB05/g, "ft")
    .replace(/\uFB06/g, "st");

  // 2. Normalize smart quotes and dashes
  text = text
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-");

  // 3. Normalize various bullet symbols to standard dash
  text = text.replace(/^[ \t]*[•·◦▪►■\u2022\u25E6\u25AA\u25BA*]\s*/gm, "- ");

  // 4. Normalize CRLF and CR to LF
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 5. Trim trailing whitespace per line
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n");

  // 6. Collapse excessive blank lines (max 2 consecutive newlines)
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/**
 * Checks whether extracted text has sufficient readable content or represents
 * an empty/scanned document without an OCR layer.
 */
export function isSufficientContent(text: string): boolean {
  // Strip whitespace and symbols
  const alphanumericChars = text.replace(/[^a-zA-Z0-9]/g, "");
  // A meaningful resume needs at least 40 alphanumeric characters
  return alphanumericChars.length >= 40;
}
