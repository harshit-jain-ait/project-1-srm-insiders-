import { getDatabase } from "@/lib/db/database";
import { getAnalyticsRetentionDays } from "@/lib/billing/entitlements";
import crypto from "crypto";

export type ReferrerCategory = "direct" | "search" | "social" | "external";
export type DeviceCategory = "desktop" | "mobile" | "tablet" | "unknown";

export interface AnalyticsEventInput {
  portfolioId: string;
  eventType?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  isPreview?: boolean;
}

export interface DailyMetric {
  date: string;
  views: number;
  uniques: number;
}

export interface PathMetric {
  path: string;
  views: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface PortfolioAnalyticsResult {
  portfolioId: string;
  range: "7d" | "30d" | "90d";
  effectiveDays: number;
  retentionDays: number;
  upgradeRequiredForRange: boolean;
  totalViews: number;
  uniqueVisitors: number;
  timeSeries: DailyMetric[];
  topPages: PathMetric[];
  referrers: CategoryBreakdown[];
  devices: CategoryBreakdown[];
  hasData: boolean;
}

/**
 * Generates a privacy-conscious SHA-256 visitor hash using daily rotating salt.
 * Ensures identical IP and User-Agent are recognized as the same visitor within the same day,
 * without ever persisting raw IPs or creating cross-day persistent tracking profiles.
 */
export function generateVisitorHash(ip?: string, userAgent?: string, dateSalt?: string): string {
  const salt = dateSalt || new Date().toISOString().slice(0, 10);
  const rawVisitor = `${ip || "0.0.0.0"}:${userAgent || "ua"}:${salt}`;
  return crypto.createHash("sha256").update(rawVisitor).digest("hex");
}

/**
 * Classifies an incoming HTTP Referrer string into a standardized category.
 */
export function classifyReferrer(referrer?: string, currentHost?: string): ReferrerCategory {
  if (!referrer || referrer.trim() === "") return "direct";

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    if (currentHost && (host === currentHost || host.endsWith(`.${currentHost}`))) {
      return "direct";
    }

    // Search engines
    if (
      host.includes("google.") ||
      host.includes("bing.") ||
      host.includes("duckduckgo.") ||
      host.includes("yahoo.") ||
      host.includes("baidu.") ||
      host.includes("ecosia.")
    ) {
      return "search";
    }

    // Social media
    if (
      host === "t.co" ||
      host.endsWith(".t.co") ||
      host.includes("twitter.") ||
      host.includes("x.com") ||
      host.includes("linkedin.") ||
      host.includes("github.") ||
      host.includes("reddit.") ||
      host.includes("facebook.") ||
      host.includes("instagram.") ||
      host.includes("threads.net") ||
      host.includes("bluesky.") ||
      host.includes("bsky.app") ||
      host.includes("youtube.") ||
      host.includes("news.ycombinator.com")
    ) {
      return "social";
    }

    return "external";
  } catch {
    return "direct";
  }
}

/**
 * Classifies User-Agent string into desktop, mobile, tablet, or unknown.
 */
export function classifyDevice(userAgent?: string): DeviceCategory {
  if (!userAgent || userAgent.trim() === "") return "unknown";
  const ua = userAgent.toLowerCase();

  if (ua.includes("ipad") || ua.includes("tablet") || ua.includes("playbook") || ua.includes("silk")) {
    return "tablet";
  }
  if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("android") ||
    ua.includes("blackberry") ||
    ua.includes("webos")
  ) {
    return "mobile";
  }

  return "desktop";
}

/**
 * Records a page view or interaction event for an authorized published portfolio.
 * Rejects private editor previews, unpublished portfolios, and abusive floods.
 */
export function recordPortfolioEvent(
  input: AnalyticsEventInput
): { recorded: boolean; reason?: string; deduplicated?: boolean } {
  // 1. Never track editor previews
  if (input.isPreview) {
    return { recorded: false, reason: "preview_traffic_excluded", deduplicated: false };
  }

  if (!input.portfolioId) {
    return { recorded: false, reason: "missing_portfolio_id", deduplicated: false };
  }

  const db = getDatabase();

  // 2. Portfolio must exist and be published
  const portRow = db
    .prepare("SELECT published FROM portfolios WHERE id = ?")
    .get(input.portfolioId) as { published: number } | undefined;

  if (!portRow) {
    return { recorded: false, reason: "portfolio_not_found", deduplicated: false };
  }

  if (!portRow.published) {
    return { recorded: false, reason: "portfolio_not_published", deduplicated: false };
  }

  // 3. Privacy-preserving visitor hash (never store raw IP)
  const now = new Date();
  const visitorHash = generateVisitorHash(input.ip, input.userAgent).slice(0, 24);

  const cleanPath = input.path
    ? input.path.startsWith("/")
      ? input.path
      : `/${input.path}`
    : "/";

  // 4. Rate-limit / deduplicate: same visitor + same path within 5 minutes is counted once
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const recent = db
    .prepare(
      `SELECT id FROM portfolio_events
       WHERE portfolio_id = ? AND visitor_hash = ? AND path = ? AND created_at >= ?
       LIMIT 1`
    )
    .get(input.portfolioId, visitorHash, cleanPath, fiveMinAgo);

  if (recent) {
    return { recorded: false, reason: "deduplicated_window", deduplicated: true };
  }

  // 5. Categorize and insert
  const eventType = input.eventType || "page_view";
  const referrerCategory = classifyReferrer(input.referrer);
  const deviceCategory = classifyDevice(input.userAgent);
  const id = `evt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const createdAt = now.toISOString();

  db.prepare(`
    INSERT INTO portfolio_events (
      id, portfolio_id, event_type, path, referrer_category, device_category, visitor_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    input.portfolioId,
    eventType,
    cleanPath,
    referrerCategory,
    deviceCategory,
    visitorHash,
    createdAt
  );

  return { recorded: true, deduplicated: false };
}

/**
 * Aggregates real portfolio analytics for authorized dashboard inspection.
 * Enforces server-side subscription retention limits.
 */
export function getPortfolioAnalytics(
  portfolioId: string,
  userIdOrOptions: string | { range?: "7d" | "30d" | "90d"; userId: string },
  rangeParam: "7d" | "30d" | "90d" = "7d"
): PortfolioAnalyticsResult {
  const userId = typeof userIdOrOptions === "string" ? userIdOrOptions : userIdOrOptions.userId;
  const requestedRange =
    typeof userIdOrOptions === "object" && userIdOrOptions.range
      ? userIdOrOptions.range
      : rangeParam;

  const db = getDatabase();

  // 1. Verify portfolio ownership
  const portfolio = db
    .prepare("SELECT user_id FROM portfolios WHERE id = ?")
    .get(portfolioId) as { user_id: string } | undefined;

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  if (portfolio.user_id !== userId && portfolio.user_id !== "anonymous") {
    throw new Error("Unauthorized to access analytics for this portfolio");
  }

  // 2. Enforce subscription retention limits
  const maxRetentionDays = getAnalyticsRetentionDays(userId);
  const requestedDays = requestedRange === "90d" ? 90 : requestedRange === "30d" ? 30 : 7;
  const effectiveDays = Math.min(requestedDays, maxRetentionDays);

  const now = new Date();
  const cutoff = new Date(now.getTime() - effectiveDays * 24 * 60 * 60 * 1000).toISOString();

  // 3. Query metrics
  const totalRow = db
    .prepare(
      "SELECT COUNT(*) as total FROM portfolio_events WHERE portfolio_id = ? AND created_at >= ?"
    )
    .get(portfolioId, cutoff) as { total: number };
  const totalViews = totalRow ? totalRow.total : 0;

  const uniqueRow = db
    .prepare(
      "SELECT COUNT(DISTINCT visitor_hash) as uniques FROM portfolio_events WHERE portfolio_id = ? AND created_at >= ?"
    )
    .get(portfolioId, cutoff) as { uniques: number };
  const uniqueVisitors = uniqueRow ? uniqueRow.uniques : 0;

  // 4. Daily time series
  const seriesRows = db
    .prepare(`
      SELECT SUBSTR(created_at, 1, 10) as date,
             COUNT(*) as views,
             COUNT(DISTINCT visitor_hash) as uniques
      FROM portfolio_events
      WHERE portfolio_id = ? AND created_at >= ?
      GROUP BY SUBSTR(created_at, 1, 10)
      ORDER BY date ASC
    `)
    .all(portfolioId, cutoff) as unknown as { date: string; views: number; uniques: number }[];

  // Fill in zero days for complete timeline
  const timeSeriesMap = new Map<string, { views: number; uniques: number }>();
  for (let i = effectiveDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    timeSeriesMap.set(d, { views: 0, uniques: 0 });
  }
  for (const row of seriesRows) {
    if (timeSeriesMap.has(row.date)) {
      timeSeriesMap.set(row.date, { views: row.views, uniques: row.uniques });
    }
  }

  const timeSeries: DailyMetric[] = Array.from(timeSeriesMap.entries()).map(([date, counts]) => ({
    date,
    views: counts.views,
    uniques: counts.uniques,
  }));

  // 5. Top pages
  const topPageRows = db
    .prepare(`
      SELECT path, COUNT(*) as views
      FROM portfolio_events
      WHERE portfolio_id = ? AND created_at >= ?
      GROUP BY path
      ORDER BY views DESC
      LIMIT 8
    `)
    .all(portfolioId, cutoff) as unknown as { path: string; views: number }[];

  // 6. Referrers
  const referrerRows = db
    .prepare(`
      SELECT referrer_category as category, COUNT(*) as count
      FROM portfolio_events
      WHERE portfolio_id = ? AND created_at >= ?
      GROUP BY referrer_category
      ORDER BY count DESC
    `)
    .all(portfolioId, cutoff) as unknown as { category: string; count: number }[];

  const referrers: CategoryBreakdown[] = referrerRows.map((r) => ({
    category: r.category,
    count: r.count,
    percentage: totalViews > 0 ? Math.round((r.count / totalViews) * 100) : 0,
  }));

  // 7. Devices
  const deviceRows = db
    .prepare(`
      SELECT device_category as category, COUNT(*) as count
      FROM portfolio_events
      WHERE portfolio_id = ? AND created_at >= ?
      GROUP BY device_category
      ORDER BY count DESC
    `)
    .all(portfolioId, cutoff) as unknown as { category: string; count: number }[];

  const devices: CategoryBreakdown[] = deviceRows.map((r) => ({
    category: r.category,
    count: r.count,
    percentage: totalViews > 0 ? Math.round((r.count / totalViews) * 100) : 0,
  }));

  return {
    portfolioId,
    range: requestedRange,
    effectiveDays,
    retentionDays: maxRetentionDays,
    upgradeRequiredForRange: requestedDays > maxRetentionDays,
    totalViews,
    uniqueVisitors,
    timeSeries,
    topPages: topPageRows,
    referrers,
    devices,
    hasData: totalViews > 0,
  };
}
