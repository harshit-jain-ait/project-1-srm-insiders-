import { describe, it, expect } from "vitest";
import {
  reorderSection,
  isDuplicateSkill,
  normalizeSkillName,
  validateDateRange,
  isSafeHttpUrl,
  createEmptyPortfolio,
  SectionConfig,
} from "@/lib/schema/portfolio";
import * as FormExports from "./index";

describe("Content Forms Architecture & Logic", () => {
  it("exports all required content forms", () => {
    expect(FormExports.ProfileForm).toBeDefined();
    expect(FormExports.ProjectForm).toBeDefined();
    expect(FormExports.SkillsForm).toBeDefined();
    expect(FormExports.ExperienceForm).toBeDefined();
    expect(FormExports.EducationForm).toBeDefined();
    expect(FormExports.SectionsForm).toBeDefined();
    expect(FormExports.AppearanceForm).toBeDefined();
  });

  describe("Section Order & Layout Operations", () => {
    const initialSections: SectionConfig[] = [
      { key: "profile", label: "Profile", visible: true, order: 0 },
      { key: "projects", label: "Projects", visible: true, order: 1 },
      { key: "experience", label: "Experience", visible: true, order: 2 },
      { key: "skills", label: "Skills", visible: false, order: 3 },
    ];

    it("moves section up and updates sequential order", () => {
      const result = reorderSection(initialSections, 2, "up");
      expect(result[1].key).toBe("experience");
      expect(result[2].key).toBe("projects");
      expect(result[1].order).toBe(1);
      expect(result[2].order).toBe(2);
    });

    it("moves section down and updates sequential order", () => {
      const result = reorderSection(initialSections, 0, "down");
      expect(result[0].key).toBe("projects");
      expect(result[1].key).toBe("profile");
      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
    });

    it("safely handles boundary cases (top cannot move up, bottom cannot move down)", () => {
      const topNoop = reorderSection(initialSections, 0, "up");
      expect(topNoop).toEqual(initialSections);

      const bottomNoop = reorderSection(initialSections, 3, "down");
      expect(bottomNoop).toEqual(initialSections);
    });
  });

  describe("Skill Normalization and Duplicate Detection", () => {
    const existing = [
      { id: "s1", name: "Kubernetes", category: "Infra", order: 0 },
      { id: "s2", name: "Golang", category: "Language", order: 1 },
    ];

    it("normalizes whitespace and trims skill names", () => {
      expect(normalizeSkillName("  React.js  ")).toBe("React.js");
    });

    it("detects exact and case-insensitive duplicates", () => {
      expect(isDuplicateSkill(existing, "Kubernetes")).toBe(true);
      expect(isDuplicateSkill(existing, "kubernetes")).toBe(true);
      expect(isDuplicateSkill(existing, "  KUBERNETES ")).toBe(true);
      expect(isDuplicateSkill(existing, "golang")).toBe(true);
      expect(isDuplicateSkill(existing, "TypeScript")).toBe(false);
    });

    it("allows existing skill to keep its name when updating other attributes", () => {
      expect(isDuplicateSkill(existing, "Kubernetes", "s1")).toBe(false);
    });
  });

  describe("Date Validation Coherency", () => {
    it("permits current roles without end date", () => {
      expect(validateDateRange("2023-01", "", true).isValid).toBe(true);
      expect(validateDateRange("", "", true).isValid).toBe(true);
    });

    it("permits incomplete draft dates", () => {
      expect(validateDateRange("2023", "", false).isValid).toBe(true);
      expect(validateDateRange("", "2024", false).isValid).toBe(true);
    });

    it("validates that end date cannot be earlier than start date", () => {
      expect(validateDateRange("2023-05", "2024-01", false).isValid).toBe(true);
      const invalid = validateDateRange("2024-05", "2023-01", false);
      expect(invalid.isValid).toBe(false);
      expect(invalid.error).toBe("End date cannot be earlier than start date");
    });
  });

  describe("Safe URL Validation", () => {
    it("accepts safe http and https URLs", () => {
      expect(isSafeHttpUrl("https://example.com/project")).toBe(true);
      expect(isSafeHttpUrl("http://localhost:3000")).toBe(true);
    });

    it("rejects malicious script URLs", () => {
      expect(isSafeHttpUrl("javascript:void(0)")).toBe(false);
      expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeHttpUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    });
  });

  describe("Empty Portfolio Data Model Integrity", () => {
    it("ensures new portfolios have zero dummy data and preserve custom fields", () => {
      const fresh = createEmptyPortfolio({
        title: "Staff Engineer Portfolio",
        profile: {
          fullName: "Jane Architect",
        },
      });

      expect(fresh.title).toBe("Staff Engineer Portfolio");
      expect(fresh.profile.fullName).toBe("Jane Architect");
      // All other collections strictly empty
      expect(fresh.projects).toHaveLength(0);
      expect(fresh.experience).toHaveLength(0);
      expect(fresh.skills).toHaveLength(0);
      expect(fresh.education).toHaveLength(0);
      expect(fresh.socialLinks).toHaveLength(0);
    });
  });
});
