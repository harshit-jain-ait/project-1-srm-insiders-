import { describe, it, expect } from "vitest";
import { validateAssetUpload, generateSafeAssetFilename } from "./asset-validator";
import { sanitizeEmbedUrl, getSupportedEmbedProviders } from "./embed-sanitizer";

describe("Asset Validator", () => {
  it("accepts a valid PNG with correct magic bytes", () => {
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const result = validateAssetUpload(pngBuffer, "architecture.png", "image/png");

    expect(result.valid).toBe(true);
    expect(result.detectedMime).toBe("image/png");
    expect(result.sanitizedFilename).toMatch(/^architecture_[a-f0-9-]+\.png$/);
  });

  it("accepts a valid JPEG with correct magic bytes", () => {
    // JPEG magic bytes: FF D8 FF
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const result = validateAssetUpload(jpegBuffer, "screenshot.jpg", "image/jpeg");

    expect(result.valid).toBe(true);
    expect(result.detectedMime).toBe("image/jpeg");
    expect(result.sanitizedFilename).toMatch(/\.jpg$/);
  });

  it("accepts a valid WebP image", () => {
    // WebP: RIFF ... WEBP
    const webpHeader = Buffer.from("RIFF....WEBP", "ascii");
    const result = validateAssetUpload(webpHeader, "preview.webp", "image/webp");

    expect(result.valid).toBe(true);
    expect(result.detectedMime).toBe("image/webp");
  });

  it("accepts a clean, safe SVG", () => {
    const cleanSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>',
      "utf-8"
    );
    const result = validateAssetUpload(cleanSvg, "diagram.svg", "image/svg+xml");

    expect(result.valid).toBe(true);
    expect(result.detectedMime).toBe("image/svg+xml");
  });

  it("rejects malicious SVG containing <script> tag", () => {
    const maliciousSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle cx="5" cy="5" r="5"/></svg>',
      "utf-8"
    );
    const result = validateAssetUpload(maliciousSvg, "exploit.svg", "image/svg+xml");

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Malicious executable content detected");
  });

  it("rejects malicious SVG containing event handlers like onerror or onload", () => {
    const maliciousSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg"><image href="x" onerror="alert(1)"/></svg>',
      "utf-8"
    );
    const result = validateAssetUpload(maliciousSvg, "onerror.svg", "image/svg+xml");

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Malicious executable content detected");
  });

  it("rejects files exceeding the 5MB size limit", () => {
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 10);
    const result = validateAssetUpload(oversized, "huge.png", "image/png");

    expect(result.valid).toBe(false);
    expect(result.error).toContain("File exceeds maximum allowed size");
  });

  it("rejects mismatched magic bytes (e.g. text file renamed to .png)", () => {
    const fakePng = Buffer.from("This is just plain text, not a PNG file", "utf-8");
    const result = validateAssetUpload(fakePng, "fake.png", "image/png");

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid or unrecognized image binary signature");
  });

  it("generateSafeAssetFilename prevents directory traversal and preserves extension", () => {
    const safeName = generateSafeAssetFilename("../../../etc/passwd.png");
    expect(safeName).not.toContain("..");
    expect(safeName).not.toContain("/");
    expect(safeName).toMatch(/^passwd_[a-f0-9-]+\.png$/);
  });
});

describe("Embed Sanitizer", () => {
  it("sanitizes standard YouTube and youtu.be links into privacy-enhanced embed URLs", () => {
    const standard = sanitizeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(standard.isValid).toBe(true);
    expect(standard.provider).toBe("youtube");
    expect(standard.embedUrl).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");

    const short = sanitizeEmbedUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(short.isValid).toBe(true);
    expect(short.embedUrl).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("sanitizes Vimeo video links", () => {
    const vimeo = sanitizeEmbedUrl("https://vimeo.com/76979871");
    expect(vimeo.isValid).toBe(true);
    expect(vimeo.provider).toBe("vimeo");
    expect(vimeo.embedUrl).toContain("https://player.vimeo.com/video/76979871");
  });

  it("sanitizes Loom video links", () => {
    const loom = sanitizeEmbedUrl("https://www.loom.com/share/abc123456789");
    expect(loom.isValid).toBe(true);
    expect(loom.provider).toBe("loom");
    expect(loom.embedUrl).toBe("https://www.loom.com/embed/abc123456789");
  });

  it("sanitizes Figma design and prototype links", () => {
    const figma = sanitizeEmbedUrl("https://www.figma.com/design/abcdef123/Project-Mockups?node-id=0-1");
    expect(figma.isValid).toBe(true);
    expect(figma.provider).toBe("figma");
    expect(figma.embedUrl).toContain("https://www.figma.com/embed?embed_host=portfolify");
  });

  it("sanitizes CodePen interactive demo links", () => {
    const codepen = sanitizeEmbedUrl("https://codepen.io/author/pen/mdabcde");
    expect(codepen.isValid).toBe(true);
    expect(codepen.provider).toBe("codepen");
    expect(codepen.embedUrl).toContain("https://codepen.io/author/embed/mdabcde");
  });

  it("rejects malicious or unsupported protocols and arbitrary domains", () => {
    const jsUrl = sanitizeEmbedUrl("javascript:alert(1)");
    expect(jsUrl.isValid).toBe(false);

    const arbitrary = sanitizeEmbedUrl("https://untrusted-arbitrary-domain.com/malicious-iframe");
    expect(arbitrary.isValid).toBe(false);
    expect(arbitrary.error).toContain("Unsupported embed host");
  });

  it("lists supported embed providers", () => {
    const providers = getSupportedEmbedProviders();
    expect(providers.length).toBeGreaterThanOrEqual(5);
  });
});
