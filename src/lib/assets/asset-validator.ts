import crypto from "crypto";
import path from "path";

export interface AssetValidationResult {
  isValid: boolean;
  valid: boolean; // Alias for test ergonomics
  error?: string;
  mimeType?: string;
  detectedMime?: string; // Alias
  extension?: string;
  safeFileName?: string;
  sanitizedFilename?: string; // Alias
}

export const ASSET_UPLOAD_LIMITS = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  maxSizeFormatted: "5 MB",
  allowedExtensions: [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
  allowedMimeTypes: [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
};

export function generateSafeAssetFilename(originalName: string): string {
  const base = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
  const extMatch = base.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : ".bin";
  const nameWithoutExt = base.replace(/\.[^/.]+$/, "").slice(0, 40) || "asset";
  const uniqueId = crypto.randomUUID();
  return `${nameWithoutExt}_${uniqueId}${ext}`;
}

/**
 * Validates magic bytes for binary image formats to prevent extension spoofing.
 */
function verifyMagicBytes(buffer: Buffer, mimeType: string): { valid: boolean; reason?: string } {
  if (buffer.length < 8) {
    return { valid: false, reason: "Invalid or unrecognized image binary signature." };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
    return isPng
      ? { valid: true }
      : { valid: false, reason: "Invalid or unrecognized image binary signature." };
  }

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg") {
    const isJpeg =
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;
    return isJpeg
      ? { valid: true }
      : { valid: false, reason: "Invalid or unrecognized image binary signature." };
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (mimeType === "image/gif") {
    const isGif =
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38;
    return isGif
      ? { valid: true }
      : { valid: false, reason: "Invalid or unrecognized image binary signature." };
  }

  // WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  if (mimeType === "image/webp") {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp
      ? { valid: true }
      : { valid: false, reason: "Invalid or unrecognized image binary signature." };
  }

  // SVG: Check for valid text, svg tag, and reject scripts/event handlers
  if (mimeType === "image/svg+xml") {
    const text = buffer.toString("utf-8");
    const hasSvgTag = text.toLowerCase().includes("<svg");
    const hasScriptTag = /<script\b[^>]*>/i.test(text) || /javascript:/i.test(text);
    const hasEventHandler = /\bon[a-z]+\s*=/i.test(text);

    if (!hasSvgTag) {
      return { valid: false, reason: "Invalid SVG format." };
    }
    if (hasScriptTag || hasEventHandler) {
      return { valid: false, reason: "Malicious executable content detected in SVG." };
    }
    return { valid: true };
  }

  return { valid: false, reason: "Unsupported media format signature." };
}

export function validateAssetUpload(
  arg1: string | Buffer,
  arg2: Buffer | string,
  providedMimeType?: string
): AssetValidationResult {
  const fileName = typeof arg1 === "string" ? arg1 : (arg2 as string);
  const buffer = Buffer.isBuffer(arg1) ? arg1 : (arg2 as Buffer);

  if (!fileName || typeof fileName !== "string") {
    return { isValid: false, valid: false, error: "File name is required." };
  }

  if (!buffer || buffer.length === 0) {
    return { isValid: false, valid: false, error: "Uploaded file is empty (0 bytes)." };
  }

  if (buffer.length > ASSET_UPLOAD_LIMITS.maxSizeBytes) {
    return {
      isValid: false,
      valid: false,
      error: `File exceeds maximum allowed size of ${ASSET_UPLOAD_LIMITS.maxSizeFormatted}.`,
    };
  }

  const lowerName = fileName.toLowerCase();
  const extMatch = lowerName.match(/\.([a-z0-9]+)$/i);
  if (!extMatch) {
    return { isValid: false, valid: false, error: "File must have an extension." };
  }

  const extension = `.${extMatch[1]}`;
  if (!ASSET_UPLOAD_LIMITS.allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      valid: false,
      error: `Unsupported format. Allowed formats: PNG, JPG, WebP, GIF, SVG.`,
    };
  }

  // Derive canonical MIME
  let mimeType = providedMimeType || "";
  if (extension === ".png") mimeType = "image/png";
  else if (extension === ".jpg" || extension === ".jpeg") mimeType = "image/jpeg";
  else if (extension === ".webp") mimeType = "image/webp";
  else if (extension === ".gif") mimeType = "image/gif";
  else if (extension === ".svg") mimeType = "image/svg+xml";

  if (!ASSET_UPLOAD_LIMITS.allowedMimeTypes.includes(mimeType)) {
    return { isValid: false, valid: false, error: `Invalid MIME type: ${mimeType}` };
  }

  // Validate magic bytes
  const magicCheck = verifyMagicBytes(buffer, mimeType);
  if (!magicCheck.valid) {
    return {
      isValid: false,
      valid: false,
      error: magicCheck.reason || "Invalid or unrecognized image binary signature.",
    };
  }

  // Generate safe filename
  const safeFileName = generateSafeAssetFilename(fileName);

  return {
    isValid: true,
    valid: true,
    mimeType,
    detectedMime: mimeType,
    extension,
    safeFileName,
    sanitizedFilename: safeFileName,
  };
}
