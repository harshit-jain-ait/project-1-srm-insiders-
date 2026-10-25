import { describe, it, expect } from "vitest";
import {
  normalizeResumeText,
  isSufficientContent,
} from "./text-normalizer";
import {
  segmentAndExtractResume,
  extractContactInfo,
} from "./resume-segmenter";

describe("Resume Normalizer & Deterministic Segmentation", () => {
  describe("Text Normalizer", () => {
    it("normalizes typographic quotes, dashes, ligatures, and bullets", () => {
      const raw = `\uFB01nancial “analyst” \u2014 • Senior Developer`;
      const normalized = normalizeResumeText(raw);

      expect(normalized).toContain('financial "analyst" - • Senior Developer');
    });

    it("collapses excessive empty newlines", () => {
      const raw = "Line 1\n\n\n\n\n\nLine 2";
      const normalized = normalizeResumeText(raw);

      expect(normalized).toBe("Line 1\n\nLine 2");
    });

    it("correctly identifies image-only or empty documents (< 40 chars)", () => {
      expect(isSufficientContent("   ")).toBe(false);
      expect(isSufficientContent("Short text")).toBe(false);
      expect(
        isSufficientContent(
          "Jane Doe - Senior Staff Software Engineer with 10+ years architecting distributed systems."
        )
      ).toBe(true);
    });
  });

  describe("Contact & Profile Extraction", () => {
    it("extracts email, phone, github, linkedin, and website from header text", () => {
      const text = `
John Doe
Senior Cloud Architect
San Francisco, CA
john.doe@example.com | (555) 234-5678
https://github.com/johndoe
https://linkedin.com/in/johndoe
https://johndoe.dev
      `;

      const contact = extractContactInfo(text);

      expect(contact.email).toBe("john.doe@example.com");
      expect(contact.phone).toBe("(555) 234-5678");
      expect(contact.github).toBe("https://github.com/johndoe");
      expect(contact.linkedin).toBe("https://linkedin.com/in/johndoe");
      expect(contact.website).toBe("https://johndoe.dev");
    });
  });

  describe("Full Structured Segmentation", () => {
    const controlledResume = `
Alex Mercer
Staff Platform Engineer
alex.mercer@example.com | +1 415 555 0199 | Seattle, WA
github.com/alexmercer | linkedin.com/in/alexmercer

SUMMARY
Platform engineer with 9 years of experience designing fault-tolerant cloud infrastructure and developer tooling.

SKILLS
TypeScript, Go, Rust, Kubernetes, Docker, Terraform, PostgreSQL, Redis, GraphQL, Next.js, Kafka

EXPERIENCE
Acme Cloud Systems | Staff Platform Engineer
January 2022 - Present | Seattle, WA
* Led migration of 140 microservices to Kubernetes clusters.
* Reduced infrastructure monthly spend by 32% through node optimization.
* Authored company-wide CI/CD standards and automated deployment gates.

Global FinTech Inc | Senior Systems Engineer
June 2018 - December 2021 | San Francisco, CA
* Engineered high-throughput settlement pipeline processing $4B daily.
* Designed fault detection telemetry alerting on latency spikes under 50ms.

PROJECTS
OpenCluster CLI
Modern command-line tool for multi-region Kubernetes cluster fleet management.
Technologies: Go, Kubernetes Client-Go, Cobra
https://github.com/alexmercer/opencluster

TelemetryStream
Real-time distributed log visualization engine built on WebSockets.
Technologies: TypeScript, React, Kafka, Redis
https://github.com/alexmercer/telemetry-stream

EDUCATION
University of Washington
Bachelor of Science in Computer Science
2014 - 2018 | Seattle, WA

CERTIFICATIONS
AWS Certified Solutions Architect - Professional
      `;

    it("accurately segments all sections into intermediate representation", () => {
      const extracted = segmentAndExtractResume(
        controlledResume,
        "alex_mercer_resume.pdf",
        "pdf",
        10240
      );

      // 1. Profile Verification
      expect(extracted.profile.fullName).toBe("Alex Mercer");
      expect(extracted.profile.headline).toBe("Staff Platform Engineer");
      expect(extracted.profile.email).toBe("alex.mercer@example.com");
      expect(extracted.profile.phone).toBe("+1 415 555 0199");
      expect(extracted.profile.github).toBe("https://github.com/alexmercer");
      expect(extracted.profile.linkedin).toBe("https://linkedin.com/in/alexmercer");
      expect(extracted.profile.bio).toContain("Platform engineer with 9 years of experience");

      // 2. Skills Verification (No fabricated additions)
      expect(extracted.skills.length).toBeGreaterThanOrEqual(10);
      const skillNames = extracted.skills.map((s) => s.name);
      expect(skillNames).toContain("TypeScript");
      expect(skillNames).toContain("Go");
      expect(skillNames).toContain("Kubernetes");
      expect(skillNames).toContain("PostgreSQL");
      expect(skillNames).not.toContain("COBOL"); // Must not fabricate unrelated skills

      // 3. Experience Verification
      expect(extracted.experience.length).toBe(2);
      const firstExp = extracted.experience[0];
      expect(firstExp.company).toBe("Acme Cloud Systems");
      expect(firstExp.role).toBe("Staff Platform Engineer");
      expect(firstExp.startDate).toBe("January 2022");
      expect(firstExp.endDate).toBe("Present");
      expect(firstExp.current).toBe(true);
      expect(firstExp.highlights.length).toBe(3);
      expect(firstExp.highlights[0]).toContain("migration of 140 microservices");

      const secondExp = extracted.experience[1];
      expect(secondExp.company).toBe("Global FinTech Inc");
      expect(secondExp.role).toBe("Senior Systems Engineer");
      expect(secondExp.startDate).toBe("June 2018");
      expect(secondExp.endDate).toBe("December 2021");
      expect(secondExp.current).toBe(false);

      // 4. Projects Verification
      expect(extracted.projects.length).toBe(2);
      const proj1 = extracted.projects[0];
      expect(proj1.title).toBe("OpenCluster CLI");
      expect(proj1.description).toContain("multi-region Kubernetes cluster fleet management");
      expect(proj1.technologies).toContain("Go");
      expect(proj1.technologies).toContain("Kubernetes Client-Go");
      expect(proj1.repoUrl).toBe("https://github.com/alexmercer/opencluster");

      // 5. Education Verification
      expect(extracted.education.length).toBe(1);
      const edu = extracted.education[0];
      expect(edu.institution).toBe("University of Washington");
      expect(edu.degree).toBe("Bachelor of Science");
      expect(edu.fieldOfStudy).toBe("Computer Science");
      expect(edu.startDate).toBe("2014");
      expect(edu.endDate).toBe("2018");

      // 6. Certifications Verification
      expect(extracted.certifications.length).toBe(1);
      expect(extracted.certifications[0].name).toContain("AWS Certified Solutions Architect");

      // 7. Metadata Verification
      expect(extracted.fileName).toBe("alex_mercer_resume.pdf");
      expect(extracted.fileFormat).toBe("pdf");
      expect(extracted.fileSize).toBe(10240);
    });

    it("preserves missing fields honestly without inventing placeholder facts", () => {
      const minimalResume = `
David Lee
david@example.com

SKILLS
Python, SQL

EXPERIENCE
Beta Startup | Software Engineer
2023 - Present
Worked on analytics backend.
      `;

      const extracted = segmentAndExtractResume(
        minimalResume,
        "david_minimal.txt",
        "txt",
        200
      );

      expect(extracted.profile.fullName).toBe("David Lee");
      expect(extracted.profile.email).toBe("david@example.com");
      // Missing fields should remain empty strings or empty arrays
      expect(extracted.profile.phone).toBe("");
      expect(extracted.profile.linkedin).toBe("");
      expect(extracted.profile.github).toBe("");
      expect(extracted.education).toHaveLength(0); // Zero education invented
      expect(extracted.projects).toHaveLength(0); // Zero projects invented
      expect(extracted.certifications).toHaveLength(0);
    });
  });
});
