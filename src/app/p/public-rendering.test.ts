import { describe, it, expect, beforeAll } from "vitest";
import { generateMetadata } from "./[slug]/page";
import sitemap from "../sitemap";
import robots from "../robots";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";
import { getDatabase, runMigrations } from "@/lib/db/database";

describe("Part 12 — Public Portfolio Rendering, SEO Metadata & Discoverability", () => {
  const publishedId = `render_test_${Date.now()}`;
  const publishedSlug = `seo-pro-${Date.now()}`;

  const noIndexId = `noindex_test_${Date.now()}`;
  const noIndexSlug = `hidden-user-${Date.now()}`;

  const customDomainId = `domain_render_${Date.now()}`;
  const customDomainSlug = `custom-user-${Date.now()}`;
  const customDomainName = `custom-${Date.now()}.dev`;

  beforeAll(async () => {
    const db = getDatabase();
    runMigrations(db);

    // 1. Create and publish normal portfolio with custom SEO
    const p1 = createEmptyPortfolio({
      id: publishedId,
      slug: publishedSlug,
      title: "Jane Doe Portfolio",
      profile: {
        fullName: "Jane Doe",
        headline: "Principal Systems Engineer",
        bio: "Specializing in distributed storage engines and consensus algorithms.",
        email: "jane@example.com",
        location: "Seattle, WA",
        phone: "",
        avatarUrl: "https://example.com/avatar.jpg",
        statusBadge: "",
      },
      seo: {
        title: "Jane Doe — Principal Systems Engineer",
        description: "Explore distributed systems, raft consensus, and LSM-tree architecture.",
        canonicalUrl: "",
        ogImage: "https://example.com/og-card.png",
        noIndex: false,
        includeInSitemap: true,
        keywords: ["distributed systems", "database"],
      },
    });
    await portfolioRepository.save(p1);
    await portfolioRepository.publish(publishedId, p1);

    // 2. Create and publish noIndex portfolio
    const p2 = createEmptyPortfolio({
      id: noIndexId,
      slug: noIndexSlug,
      title: "Stealth Startup Portfolio",
      profile: {
        fullName: "Secret Founder",
        headline: "Founder",
        bio: "Stealth project",
        email: "secret@example.com",
        location: "NYC",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
      seo: {
        title: "Stealth Portfolio",
        description: "Confidential founder profile",
        canonicalUrl: "",
        ogImage: "",
        noIndex: true, // NOINDEX!
        includeInSitemap: false,
        keywords: [],
      },
    });
    await portfolioRepository.save(p2);
    await portfolioRepository.publish(noIndexId, p2);

    // 3. Create and publish portfolio with active custom domain
    const p3 = createEmptyPortfolio({
      id: customDomainId,
      slug: customDomainSlug,
      title: "Custom Domain Portfolio",
      profile: {
        fullName: "Domain Owner",
        headline: "Design Engineer",
        bio: "Bio on custom domain",
        email: `owner@${customDomainName}`,
        location: "London, UK",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
      customDomain: {
        domain: customDomainName,
        status: "active",
        verificationToken: "portfolify-verify-1234567890abcdef",
        verifiedAt: new Date().toISOString(),
        configuredAt: new Date().toISOString(),
        lastCheckedAt: new Date().toISOString(),
        errorMessage: "",
      },
    });
    await portfolioRepository.save(p3);
    await portfolioRepository.publish(customDomainId, p3);
  });

  describe("generateMetadata", () => {
    it("renders custom SEO title, description, and Open Graph card for published portfolio", async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: publishedSlug }),
      });

      expect(meta.title).toBe("Jane Doe — Principal Systems Engineer");
      expect(meta.description).toBe("Explore distributed systems, raft consensus, and LSM-tree architecture.");
      expect(meta.alternates?.canonical).toBe(`http://localhost:3000/p/${publishedSlug}`);
      expect((meta.openGraph as Record<string, unknown>)?.type).toBe("website");
      expect(meta.openGraph?.title).toBe("Jane Doe — Principal Systems Engineer");
      expect(meta.openGraph?.images).toEqual([
        { url: "https://example.com/og-card.png", alt: "Jane Doe — Principal Systems Engineer" },
      ]);
      expect(meta.robots).toEqual({
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      });
    });

    it("falls back to portfolio profile info when SEO fields are blank", async () => {
      // Draft with blank SEO
      const blankSeoSlug = `blank-seo-${Date.now()}`;
      const blankSeoId = `blank_${Date.now()}`;
      const p = createEmptyPortfolio({
        id: blankSeoId,
        slug: blankSeoSlug,
        title: "Alex Portfolio",
        profile: {
          fullName: "Alex Rivera",
          headline: "Rust Developer",
          bio: "Writing high-performance network proxies.",
          email: "alex@test.com",
          location: "Austin, TX",
          phone: "",
          avatarUrl: "",
          statusBadge: "",
        },
      });
      await portfolioRepository.save(p);
      await portfolioRepository.publish(blankSeoId, p);

      const meta = await generateMetadata({
        params: Promise.resolve({ slug: blankSeoSlug }),
      });

      expect(meta.title).toBe("Alex Rivera — Rust Developer");
      expect(meta.description).toBe("Writing high-performance network proxies.");
      expect(meta.alternates?.canonical).toBe(`http://localhost:3000/p/${blankSeoSlug}`);
    });

    it("respects noIndex: true by emitting index: false and follow: false", async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: noIndexSlug }),
      });

      expect(meta.robots).toEqual({
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      });
    });

    it("derives canonical URL from verified active custom domain", async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: customDomainSlug }),
      });

      expect(meta.alternates?.canonical).toBe(`https://${customDomainName}`);
      expect(meta.openGraph?.url).toBe(`https://${customDomainName}`);
    });

    it("returns 404 Not Found metadata with noindex for unpublished or nonexistent portfolios", async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: `nonexistent-${Date.now()}` }),
      });

      expect(meta.title).toBe("Portfolio Not Found | Portfolify");
      expect(meta.robots).toEqual({ index: false, follow: false });
    });
  });

  describe("Sitemap & Robots Integration", () => {
    it("sitemap generator includes eligible published portfolios", async () => {
      const entries = await sitemap();
      expect(entries.length).toBeGreaterThan(0);

      // Verify published portfolio is present
      const foundPublished = entries.find((e) => e.url.includes(publishedSlug));
      expect(foundPublished).toBeDefined();
      expect(foundPublished?.changeFrequency).toBe("weekly");
      expect(foundPublished?.priority).toBe(0.7);
    });

    it("sitemap generator excludes portfolios marked noIndex or opted out of sitemap", async () => {
      const entries = await sitemap();

      // noIndex portfolio must NOT be in the public sitemap
      const foundNoIndex = entries.find((e) => e.url.includes(noIndexSlug));
      expect(foundNoIndex).toBeUndefined();
    });

    it("robots.txt allows public portfolios and disallows private editor and API endpoints", () => {
      const config = robots();
      expect(config.sitemap).toContain("/sitemap.xml");
      expect(config.rules).toBeDefined();

      const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
      expect(rule?.allow).toContain("/p/*");
      expect(rule?.disallow).toContain("/api/*");
      expect(rule?.disallow).toContain("/editor*");
    });
  });
});
