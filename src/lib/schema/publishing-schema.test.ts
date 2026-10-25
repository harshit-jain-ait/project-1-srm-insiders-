import { describe, it, expect } from "vitest";
import {
  isValidSlugFormat,
  normalizeSlug,
  isReservedSlug,
  validatePublishReadiness,
  createEmptyPortfolio,
  SeoSettingsSchema,
  CustomDomainConfigSchema,
} from "./portfolio";

describe("Part 12 — Publishing, Slug & SEO Schema Validation", () => {
  describe("Slug Normalization and Validation", () => {
    it("normalizes mixed-case strings and spaces to clean hyphens", () => {
      expect(normalizeSlug("Jane Doe 2026")).toBe("jane-doe-2026");
      expect(normalizeSlug("  Alex---Smith  ")).toBe("alex-smith");
      expect(normalizeSlug("Software_Engineer")).toBe("software-engineer");
      expect(normalizeSlug("John.Doe#Dev!")).toBe("john-doe-dev");
    });

    it("accepts valid slugs adhering to RFC standards", () => {
      expect(isValidSlugFormat("john-doe")).toBe(true);
      expect(isValidSlugFormat("jane-123")).toBe(true);
      expect(isValidSlugFormat("dev-pro-2026")).toBe(true);
      expect(isValidSlugFormat("abc")).toBe(true); // min 3 chars
    });

    it("rejects invalid slugs (too short, too long, special characters, leading/trailing hyphens)", () => {
      expect(isValidSlugFormat("ab")).toBe(false); // under 3 chars
      expect(isValidSlugFormat("-leading-hyphen")).toBe(false);
      expect(isValidSlugFormat("trailing-hyphen-")).toBe(false);
      expect(isValidSlugFormat("consecutive--hyphens")).toBe(false);
      expect(isValidSlugFormat("has space")).toBe(false);
      expect(isValidSlugFormat("has_underscore")).toBe(false);
      expect(isValidSlugFormat("UPPERCASE")).toBe(false);
      expect(isValidSlugFormat("a".repeat(49))).toBe(false); // over 48 chars
    });

    it("protects system routes and reserved names from impersonation", () => {
      expect(isReservedSlug("api")).toBe(true);
      expect(isReservedSlug("editor")).toBe(true);
      expect(isReservedSlug("templates")).toBe(true);
      expect(isReservedSlug("p")).toBe(true);
      expect(isReservedSlug("sitemap")).toBe(true);
      expect(isReservedSlug("robots")).toBe(true);
      expect(isReservedSlug("sitemap.xml")).toBe(true);
      expect(isReservedSlug("robots.txt")).toBe(true);
      expect(isReservedSlug("admin")).toBe(true);
      expect(isReservedSlug("settings")).toBe(true);
      expect(isReservedSlug("dashboard")).toBe(true);

      // Normal user slugs are not reserved
      expect(isReservedSlug("john-doe")).toBe(false);
      expect(isReservedSlug("sarah-chen")).toBe(false);
    });
  });

  describe("SEO Settings Schema", () => {
    it("provides safe defaults for empty SEO settings", () => {
      const defaultSeo = SeoSettingsSchema.parse({});
      expect(defaultSeo.title).toBe("");
      expect(defaultSeo.description).toBe("");
      expect(defaultSeo.canonicalUrl).toBe("");
      expect(defaultSeo.noIndex).toBe(false);
      expect(defaultSeo.includeInSitemap).toBe(true);
      expect(defaultSeo.ogImage).toBe("");
    });

    it("validates canonical URLs and ogImage URLs if provided", () => {
      const valid = SeoSettingsSchema.safeParse({
        title: "Jane Doe | Senior Systems Architect",
        description: "Specializing in distributed databases and high-throughput systems.",
        canonicalUrl: "https://janedoe.com",
        ogImage: "https://janedoe.com/og.png",
        noIndex: false,
        includeInSitemap: true,
      });
      expect(valid.success).toBe(true);

      const invalidUrl = SeoSettingsSchema.safeParse({
        canonicalUrl: "not-a-valid-url",
      });
      expect(invalidUrl.success).toBe(false);

      const invalidImage = SeoSettingsSchema.safeParse({
        ogImage: "ftp://invalid-image",
      });
      expect(invalidImage.success).toBe(false);
    });
  });

  describe("Custom Domain Config Schema", () => {
    it("provides safe defaults for custom domain config", () => {
      const defaultDomain = CustomDomainConfigSchema.parse({});
      expect(defaultDomain.domain).toBe("");
      expect(defaultDomain.status).toBe("none");
      expect(defaultDomain.verificationToken).toBe("");
      expect(defaultDomain.verifiedAt).toBeNull();
      expect(defaultDomain.errorMessage).toBe("");
    });

    it("parses valid domain configuration structures", () => {
      const config = CustomDomainConfigSchema.safeParse({
        domain: "alexsmith.dev",
        status: "pending_dns",
        verificationToken: "portfolify-verify-1234567890abcdef",
        dnsRecords: {
          verificationRecord: {
            type: "TXT",
            name: "_portfolify-challenge.alexsmith.dev",
            value: "portfolify-verify-1234567890abcdef",
          },
          cnameRecord: {
            type: "CNAME",
            name: "alexsmith.dev",
            value: "sites.portfolify.dev",
          },
        },
      });
      expect(config.success).toBe(true);
    });
  });

  describe("Pre-Publish Readiness Validation", () => {
    it("approves a complete, valid portfolio for publication", () => {
      const portfolio = createEmptyPortfolio({
        title: "Alex Morgan Portfolio",
        slug: "alex-morgan",
        profile: {
          fullName: "Alex Morgan",
          headline: "Staff Cloud Engineer",
          bio: "Building resilient distributed systems.",
          email: "alex@example.com",
          location: "San Francisco, CA",
          phone: "",
          avatarUrl: "",
          statusBadge: "",
        },
      });

      const readiness = validatePublishReadiness(portfolio);
      expect(readiness.isReady).toBe(true);
      expect(readiness.errors).toHaveLength(0);
    });

    it("rejects publication if required fields are missing", () => {
      const incomplete = createEmptyPortfolio();
      incomplete.title = "";
      incomplete.slug = "";
      incomplete.profile.fullName = "";

      const readiness = validatePublishReadiness(incomplete);
      expect(readiness.isReady).toBe(false);
      expect(readiness.errors).toContain("Full Name is required for a public portfolio");
      expect(readiness.errors).toContain("Portfolio title is required for publishing");
      expect(readiness.errors).toContain("Portfolio public URL slug is required");
    });

    it("rejects publication if slug is reserved or malformed", () => {
      const reserved = createEmptyPortfolio({
        title: "My Portfolio",
        slug: "api",
        profile: {
          fullName: "Dev User",
          headline: "Dev",
          bio: "Bio",
          email: "dev@example.com",
          location: "NYC",
          phone: "",
          avatarUrl: "",
          statusBadge: "",
        },
      });

      const readinessReserved = validatePublishReadiness(reserved);
      expect(readinessReserved.isReady).toBe(false);
      expect(readinessReserved.errors.some((e) => e.includes("reserved by the platform"))).toBe(true);

      const malformed = createEmptyPortfolio({
        title: "My Portfolio",
        slug: "invalid--slug-!",
        profile: {
          fullName: "Dev User",
          headline: "Dev",
          bio: "Bio",
          email: "dev@example.com",
          location: "NYC",
          phone: "",
          avatarUrl: "",
          statusBadge: "",
        },
      });

      const readinessMalformed = validatePublishReadiness(malformed);
      expect(readinessMalformed.isReady).toBe(false);
      expect(readinessMalformed.errors.some((e) => e.includes("3-48 characters"))).toBe(true);
    });
  });
});
