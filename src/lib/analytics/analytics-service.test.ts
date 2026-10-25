import { describe, it, expect, beforeEach } from "vitest";
import { getDatabase, runMigrations } from "@/lib/db/database";
import {
  recordPortfolioEvent,
  getPortfolioAnalytics,
  generateVisitorHash,
  classifyReferrer,
  classifyDevice,
} from "./analytics-service";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";
import { setUserSubscription } from "@/lib/billing/entitlements";

describe("Part 15 — Portfolio Analytics Service & Telemetry Engine", () => {
  let testPortfolioId: string;
  const ownerUserId = "usr-analytics-owner-1";

  beforeEach(async () => {
    const db = getDatabase();
    runMigrations(db);

    testPortfolioId = `elena_analytics_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const testSlug = `elena-slug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Create a published portfolio for analytics testing
    const empty = createEmptyPortfolio({
      id: testPortfolioId,
      title: "Elena Rostova | Principal Architect",
      slug: testSlug,
      published: true,
      profile: {
        fullName: "Elena Rostova",
        headline: "Distributed Systems & Cloud Architecture",
        bio: "Designing resilient event-driven systems.",
        email: "elena@example.com",
        location: "Seattle, WA",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
    });

    await portfolioRepository.save(empty);
    // Set ownership
    db.prepare("UPDATE portfolios SET user_id = ? WHERE id = ?").run(ownerUserId, testPortfolioId);
  });

  describe("Privacy-Conscious Visitor Identification & Classification", () => {
    it("generates deterministic SHA-256 hash for identical IP and User-Agent on same day", () => {
      const ip = "198.51.100.42";
      const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
      const hash1 = generateVisitorHash(ip, userAgent);
      const hash2 = generateVisitorHash(ip, userAgent);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex string
      // Raw IP must never appear in the hash
      expect(hash1).not.toContain(ip);
    });

    it("generates different hashes for different IP addresses", () => {
      const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
      const hashA = generateVisitorHash("198.51.100.1", userAgent);
      const hashB = generateVisitorHash("198.51.100.2", userAgent);

      expect(hashA).not.toBe(hashB);
    });

    it("correctly classifies referrer sources without exposing full private query strings", () => {
      expect(classifyReferrer("https://www.google.com/search?q=elena+rostova")).toBe("search");
      expect(classifyReferrer("https://duckduckgo.com/?q=distributed+systems")).toBe("search");
      expect(classifyReferrer("https://t.co/xyz12345")).toBe("social");
      expect(classifyReferrer("https://www.linkedin.com/feed/")).toBe("social");
      expect(classifyReferrer("https://github.com/elena")).toBe("social");
      expect(classifyReferrer("https://techblog.example.org/article")).toBe("external");
      expect(classifyReferrer("")).toBe("direct");
      expect(classifyReferrer(undefined)).toBe("direct");
    });

    it("correctly classifies device categories from user agents", () => {
      expect(classifyDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("mobile");
      expect(classifyDevice("Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X)")).toBe("tablet");
      expect(classifyDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("desktop");
      expect(classifyDevice("")).toBe("unknown");
    });
  });

  describe("Event Recording Safeguards", () => {
    it("records eligible pageview events for published portfolios", async () => {
      const result = await recordPortfolioEvent({
        portfolioId: testPortfolioId,
        path: "/",
        ip: "198.51.100.10",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        referrer: "https://news.ycombinator.com",
      });

      expect(result.recorded).toBe(true);
      expect(result.deduplicated).toBe(false);
    });

    it("rejects event collection for unpublished or non-existent portfolios", async () => {
      // Unpublish the portfolio
      await portfolioRepository.unpublish(testPortfolioId);

      const result = await recordPortfolioEvent({
        portfolioId: testPortfolioId,
        path: "/",
        ip: "198.51.100.11",
        userAgent: "Mozilla/5.0",
      });

      expect(result.recorded).toBe(false);
      expect(result.reason).toBe("portfolio_not_published");

      // Non-existent portfolio
      const fakeResult = await recordPortfolioEvent({
        portfolioId: "non-existent-portfolio-id-9999",
        path: "/",
        ip: "198.51.100.11",
        userAgent: "Mozilla/5.0",
      });

      expect(fakeResult.recorded).toBe(false);
      expect(fakeResult.reason).toBe("portfolio_not_found");
    });

    it("excludes internal editor preview traffic from public telemetry", async () => {
      const result = await recordPortfolioEvent({
        portfolioId: testPortfolioId,
        path: "/",
        ip: "198.51.100.12",
        userAgent: "Mozilla/5.0",
        isPreview: true,
      });

      expect(result.recorded).toBe(false);
      expect(result.reason).toBe("preview_traffic_excluded");
    });

    it("deduplicates repeated events from same visitor on same path within 5 minutes", async () => {
      const payload = {
        portfolioId: testPortfolioId,
        path: "/projects/distributed-raft",
        ip: "198.51.100.50",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      };

      const first = await recordPortfolioEvent(payload);
      expect(first.recorded).toBe(true);
      expect(first.deduplicated).toBe(false);

      // Immediate second event
      const second = await recordPortfolioEvent(payload);
      expect(second.recorded).toBe(false);
      expect(second.deduplicated).toBe(true);
      expect(second.reason).toBe("deduplicated_window");
    });
  });

  describe("Real Event Aggregation & Honest Empty States", () => {
    it("returns honest empty metrics and zero counts for portfolios with no traffic", async () => {
      const analytics = await getPortfolioAnalytics(testPortfolioId, {
        range: "7d",
        userId: ownerUserId,
      });

      expect(analytics.totalViews).toBe(0);
      expect(analytics.uniqueVisitors).toBe(0);
      expect(analytics.timeSeries).toHaveLength(7);
      // All days must honestly report 0 views
      expect(analytics.timeSeries.every((d) => d.views === 0)).toBe(true);
      expect(analytics.topPages).toHaveLength(0);
      expect(analytics.referrers).toHaveLength(0);
      expect(analytics.devices).toHaveLength(0);
    });

    it("accurately aggregates real collected page views, unique visitors, and top pages", async () => {
      // Record 3 events across 2 different visitors and 2 pages
      await recordPortfolioEvent({
        portfolioId: testPortfolioId,
        path: "/",
        ip: "203.0.113.1",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
        referrer: "https://www.google.com/search?q=elena",
      });

      await recordPortfolioEvent({
        portfolioId: testPortfolioId,
        path: "/projects/raft-consensus",
        ip: "203.0.113.1",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
      });

      await recordPortfolioEvent({
        portfolioId: testPortfolioId,
        path: "/",
        ip: "203.0.113.2",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
        referrer: "https://t.co/abc",
      });

      const analytics = await getPortfolioAnalytics(testPortfolioId, {
        range: "7d",
        userId: ownerUserId,
      });

      expect(analytics.totalViews).toBe(3);
      expect(analytics.uniqueVisitors).toBe(2);

      // Top pages
      expect(analytics.topPages).toHaveLength(2);
      const homePage = analytics.topPages.find((p) => p.path === "/");
      expect(homePage?.views).toBe(2);
      const projectPage = analytics.topPages.find((p) => p.path === "/projects/raft-consensus");
      expect(projectPage?.views).toBe(1);

      // Referrer channels
      expect(analytics.referrers.some((r) => r.category === "search")).toBe(true);
      expect(analytics.referrers.some((r) => r.category === "social")).toBe(true);

      // Devices
      expect(analytics.devices.some((d) => d.category === "desktop")).toBe(true);
      expect(analytics.devices.some((d) => d.category === "mobile")).toBe(true);
    });

    it("enforces plan-based retention boundaries (Free: 7 days vs Pro: 365 days)", async () => {
      // Owner is on Free plan
      setUserSubscription(ownerUserId, "free");

      const freeAnalytics = await getPortfolioAnalytics(testPortfolioId, {
        range: "90d",
        userId: ownerUserId,
      });

      // Free plan retention is clamped to 7 days
      expect(freeAnalytics.retentionDays).toBe(7);
      expect(freeAnalytics.upgradeRequiredForRange).toBe(true);

      // Upgrade to Pro plan
      setUserSubscription(ownerUserId, "pro");

      const proAnalytics = await getPortfolioAnalytics(testPortfolioId, {
        range: "90d",
        userId: ownerUserId,
      });

      expect(proAnalytics.retentionDays).toBe(365);
      expect(proAnalytics.upgradeRequiredForRange).toBe(false);
    });
  });
});
