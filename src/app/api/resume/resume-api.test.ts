import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as handleResumeParse } from "./parse/route";
import { POST as handleResumeRewrite } from "./rewrite/route";
import { NextRequest } from "next/server";
import { resumeService } from "@/lib/resume-import/resume-service";

describe("Resume Import & AI Rewriting API Endpoints", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("POST /api/resume/parse", () => {
    it("returns 400 when no file is uploaded", async () => {
      const formData = new FormData();
      // Empty form data
      const req = new NextRequest("http://localhost:3000/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const res = await handleResumeParse(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("No file was uploaded");
    });

    it("returns 400 when uploaded file has invalid magic bytes", async () => {
      const formData = new FormData();
      const fakePdf = new File(["This is plain text with a fake pdf extension."], "fake.pdf", {
        type: "application/pdf",
      });
      formData.append("resume", fakePdf);

      const req = new NextRequest("http://localhost:3000/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const res = await handleResumeParse(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("INVALID_MAGIC_BYTES");
    });

    it("returns 200 with structured ExtractedResumeData for valid text resume", async () => {
      const validText = `
Alex Morgan
Staff Engineer
alex@example.com | 555-0100

SKILLS
TypeScript, React, Next.js, Node.js

EXPERIENCE
Acme Corp | Staff Engineer
2022 - Present
Built scalable micro-frontends.
      `;

      const formData = new FormData();
      const textFile = new File([validText], "resume.txt", { type: "text/plain" });
      formData.append("resume", textFile);

      const req = new NextRequest("http://localhost:3000/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const res = await handleResumeParse(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.profile.fullName).toBe("Alex Morgan");
      expect(json.data.profile.headline).toBe("Staff Engineer");
      expect(json.data.skills.length).toBeGreaterThanOrEqual(4);
      expect(json.data.experience.length).toBe(1);
    });
  });

  describe("POST /api/resume/rewrite", () => {
    it("returns 400 when request body fails schema validation", async () => {
      const req = new NextRequest("http://localhost:3000/api/resume/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "" }), // missing rawText and invalid sectionType
      });

      const res = await handleResumeRewrite(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("INVALID_SCHEMA");
    });

    it("returns 200 with polished text when AI rewrite succeeds", async () => {
      vi.spyOn(resumeService, "rewriteSectionWithAi").mockResolvedValueOnce({
        success: true,
        data: {
          rewrittenText: "Architected resilient distributed systems and led cloud initiatives.",
          highlights: ["Multi-region failover", "Optimized cloud costs"],
        },
      });

      const req = new NextRequest("http://localhost:3000/api/resume/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "experience",
          rawText: "Worked on distributed systems and cloud stuff.",
          tone: "professional",
        }),
      });

      const res = await handleResumeRewrite(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.rewrittenText).toContain("Architected resilient distributed systems");
    });
  });
});
