import { describe, it, expect, vi, beforeEach } from "vitest";
import { resumeService } from "./resume-service";
import { ExtractedResumeData } from "./types";
import { createEmptyPortfolio, PortfolioData } from "@/lib/schema/portfolio";
import { geminiProvider } from "@/lib/ai/gemini-provider";

describe("Resume Service & Portfolio Mapping Pipeline", () => {
  const sampleExtractedData: ExtractedResumeData = {
    profile: {
      fullName: "Maya Lin",
      headline: "Senior Cloud Infrastructure Engineer",
      bio: "Specializing in multi-region Kubernetes deployments and automated observability.",
      email: "maya.lin@example.com",
      phone: "+1 206 555 0144",
      location: "Seattle, WA",
      website: "https://mayalin.dev",
      linkedin: "https://linkedin.com/in/mayalin",
      github: "https://github.com/mayalin",
    },
    skills: [
      { id: "s1", name: "Kubernetes", category: "Infrastructure", included: true },
      { id: "s2", name: "Terraform", category: "Infrastructure", included: true },
      { id: "s3", name: "Go", category: "Languages", included: true },
      { id: "s4", name: "ExcludedSkill", category: "Other", included: false }, // Excluded by user
    ],
    experience: [
      {
        id: "e1",
        company: "Starlight Cloud",
        role: "Senior Cloud Infrastructure Engineer",
        location: "Seattle, WA",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description: "Leading core platform reliability and container orchestration.",
        highlights: ["Architected multi-region failover", "Reduced MTTR by 45%"],
        included: true,
      },
      {
        id: "e2",
        company: "Old Corp",
        role: "Junior Admin",
        location: "",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "",
        highlights: [],
        included: false, // User unchecked this entry
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "University of Washington",
        degree: "B.S.",
        fieldOfStudy: "Computer Engineering",
        startDate: "2014",
        endDate: "2018",
        description: "",
        included: true,
      },
    ],
    projects: [
      {
        id: "p1",
        title: "KubeAudit Guard",
        tagline: "",
        description: "Open-source admission controller enforcing security policies.",
        technologies: ["Go", "Kubernetes", "OPA"],
        liveUrl: "",
        repoUrl: "https://github.com/mayalin/kubeaudit-guard",
        startDate: "",
        endDate: "",
        included: true,
      },
    ],
    certifications: [
      {
        id: "c1",
        name: "CKA: Certified Kubernetes Administrator",
        issuer: "CNCF",
        issueDate: "2023",
        included: true,
      },
    ],
    rawText: "Sample resume raw text",
    fileFormat: "pdf",
    fileName: "maya_lin_resume.pdf",
    fileSize: 15400,
    parsedAt: new Date().toISOString(),
    extractionConfidence: "high",
    limitations: [],
  };

  describe("New Portfolio Mapping", () => {
    it("maps extracted resume data to canonical PortfolioData schema", () => {
      const portfolio = resumeService.mapToPortfolioData(sampleExtractedData, undefined, "developer-pro");

      expect(portfolio.title).toBe("Maya Lin's Portfolio");
      expect(portfolio.profile.fullName).toBe("Maya Lin");
      expect(portfolio.profile.headline).toBe("Senior Cloud Infrastructure Engineer");
      expect(portfolio.profile.email).toBe("maya.lin@example.com");
      expect(portfolio.appearance.templateId).toBe("developer-pro");

      // Verify approved skills are included and excluded ones are omitted
      expect(portfolio.skills).toHaveLength(3);
      expect(portfolio.skills.map((s) => s.name)).toEqual(["Kubernetes", "Terraform", "Go"]);
      expect(portfolio.skills.some((s) => s.name === "ExcludedSkill")).toBe(false);

      // Verify approved experience
      expect(portfolio.experience).toHaveLength(1);
      expect(portfolio.experience[0].company).toBe("Starlight Cloud");
      expect(portfolio.experience[0].current).toBe(true);

      // Verify approved projects
      expect(portfolio.projects).toHaveLength(1);
      expect(portfolio.projects[0].title).toBe("KubeAudit Guard");
      expect(portfolio.projects[0].repoUrl).toBe("https://github.com/mayalin/kubeaudit-guard");

      // Verify social links created
      expect(portfolio.socialLinks.length).toBeGreaterThanOrEqual(2);
      expect(portfolio.socialLinks.some((l) => l.platform === "github")).toBe(true);
      expect(portfolio.socialLinks.some((l) => l.platform === "linkedin")).toBe(true);
    });
  });

  describe("Safe Existing Portfolio Merging", () => {
    let existing: PortfolioData;

    beforeEach(() => {
      existing = createEmptyPortfolio({
        title: "Existing Developer Portfolio",
        profile: {
          fullName: "Maya Lin",
          headline: "Software Engineer",
          bio: "Original bio text that user manually wrote.",
          email: "existing@example.com",
          location: "",
          statusBadge: "Available for contract",
        },
        skills: [
          { id: "ex_s1", name: "Python", category: "Languages", order: 0 },
          { id: "ex_s2", name: "Go", category: "Languages", order: 1 }, // Duplicate with resume Go
        ],
        experience: [
          {
            id: "ex_e1",
            company: "Prior Company",
            role: "Developer",
            startDate: "2019",
            endDate: "2021",
            current: false,
            description: "Manual entry",
            highlights: [],
            order: 0,
          },
        ],
        projects: [
          {
            id: "ex_p1",
            title: "Manual Project",
            tagline: "Custom built",
            description: "Existing project description",
            technologies: ["Python"],
            liveUrl: "https://existing.dev",
            repoUrl: "",
            coverImageUrl: "",
            startDate: "2020",
            endDate: "2021",
            featured: true,
            order: 0,
          },
        ],
      });
    });

    it("appends skills while skipping duplicate names case-insensitively", () => {
      const merged = resumeService.mergeWithPortfolio(existing, sampleExtractedData, {
        profileStrategy: "keep",
        skillsStrategy: "append",
        experienceStrategy: "keep",
        educationStrategy: "keep",
        projectsStrategy: "keep",
      });

      // Existing: Python, Go. Resume: Kubernetes, Terraform, Go.
      // Expected merged: Python, Go, Kubernetes, Terraform (Go is not duplicated)
      expect(merged.skills).toHaveLength(4);
      const names = merged.skills.map((s) => s.name);
      expect(names).toEqual(["Python", "Go", "Kubernetes", "Terraform"]);
    });

    it("replaces skills entirely when skillsStrategy is replace", () => {
      const merged = resumeService.mergeWithPortfolio(existing, sampleExtractedData, {
        profileStrategy: "keep",
        skillsStrategy: "replace",
        experienceStrategy: "keep",
        educationStrategy: "keep",
        projectsStrategy: "keep",
      });

      expect(merged.skills).toHaveLength(3);
      expect(merged.skills.map((s) => s.name)).toEqual(["Kubernetes", "Terraform", "Go"]);
    });

    it("keeps existing skills intact when skillsStrategy is keep", () => {
      const merged = resumeService.mergeWithPortfolio(existing, sampleExtractedData, {
        profileStrategy: "keep",
        skillsStrategy: "keep",
        experienceStrategy: "keep",
        educationStrategy: "keep",
        projectsStrategy: "keep",
      });

      expect(merged.skills).toHaveLength(2);
      expect(merged.skills.map((s) => s.name)).toEqual(["Python", "Go"]);
    });

    it("fills missing profile fields while preserving existing user entries", () => {
      const merged = resumeService.mergeWithPortfolio(existing, sampleExtractedData, {
        profileStrategy: "fill-missing",
        skillsStrategy: "keep",
        experienceStrategy: "keep",
        educationStrategy: "keep",
        projectsStrategy: "keep",
      });

      // Bio was already set; must NOT be overwritten
      expect(merged.profile.bio).toBe("Original bio text that user manually wrote.");
      // Email was already set; must NOT be overwritten
      expect(merged.profile.email).toBe("existing@example.com");
      // Location was empty; must be filled from resume
      expect(merged.profile.location).toBe("Seattle, WA");
      // Status badge preserved
      expect(merged.profile.statusBadge).toBe("Available for contract");
    });

    it("appends experience and projects without overwriting existing entries", () => {
      const merged = resumeService.mergeWithPortfolio(existing, sampleExtractedData, {
        profileStrategy: "keep",
        skillsStrategy: "keep",
        experienceStrategy: "append",
        educationStrategy: "append",
        projectsStrategy: "append",
      });

      // Experience: Prior Company (existing) + Starlight Cloud (new)
      expect(merged.experience).toHaveLength(2);
      expect(merged.experience[0].company).toBe("Prior Company");
      expect(merged.experience[1].company).toBe("Starlight Cloud");

      // Projects: Manual Project (existing) + KubeAudit Guard (new)
      expect(merged.projects).toHaveLength(2);
      expect(merged.projects[0].title).toBe("Manual Project");
      expect(merged.projects[1].title).toBe("KubeAudit Guard");

      // Education: was 0, now 1
      expect(merged.education).toHaveLength(1);
      expect(merged.education[0].institution).toBe("University of Washington");
    });
  });

  describe("File Parsing & Error Boundaries", () => {
    it("safely rejects corrupt or invalid files", async () => {
      const invalidBuffer = Buffer.from("Corrupt non-pdf document payload");
      const result = await resumeService.parseResumeFile("corrupt.pdf", invalidBuffer, "application/pdf");

      expect(result.success).toBe(false);
      expect(result.code).toBe("INVALID_MAGIC_BYTES");
    });

    it("parses valid text resume into ExtractedResumeData", async () => {
      const textBuffer = Buffer.from(`
Sarah Jenkins
Staff Reliability Engineer
sarah.jenkins@example.com | 555-0199 | Austin, TX
github.com/sarahjenkins

SKILLS
Python, Docker, Prometheus, Grafana

EXPERIENCE
Cloud Corp | SRE Lead
2020 - Present
* Scaled monitoring clusters across 6 AWS regions.
      `);

      const result = await resumeService.parseResumeFile("sarah_resume.txt", textBuffer, "text/plain");

      expect(result.success).toBe(true);
      expect(result.data?.profile.fullName).toBe("Sarah Jenkins");
      expect(result.data?.profile.headline).toBe("Staff Reliability Engineer");
      expect(result.data?.skills.length).toBeGreaterThanOrEqual(4);
      expect(result.data?.experience.length).toBe(1);
    });

    it("handles AI provider failure gracefully during section rewrite", async () => {
      vi.spyOn(geminiProvider, "executeStructuredPrompt").mockResolvedValueOnce({
        success: false,
        code: "MISSING_API_KEY",
        error: "Server missing API key",
      });

      const rewriteResult = await resumeService.rewriteSectionWithAi(
        "summary",
        "Raw summary from user's uploaded resume."
      );

      // AI failure returns error with graceful message without destroying user content
      expect(rewriteResult.success).toBe(false);
      expect(rewriteResult.code).toBe("MISSING_API_KEY");
    });
  });
});
