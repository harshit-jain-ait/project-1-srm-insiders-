import { PortfolioData, PortfolioDataSchema } from "@/lib/schema/portfolio";
import { getDatabase } from "@/lib/db/database";
import { verifyClaimToken } from "@/lib/auth/auth-service";
import fs from "fs";
import path from "path";

export interface PortfolioOwnershipRecord {
  id: string;
  userId: string;
  claimTokenHash: string | null;
  published: boolean;
  revision: number;
  customDomain?: string | null;
}

export interface PortfolioRepository {
  getById(id: string): Promise<PortfolioData | null>;
  getBySlug(slug: string, options?: { onlyPublished?: boolean }): Promise<PortfolioData | null>;
  getByCustomDomain(domain: string): Promise<PortfolioData | null>;
  getOwnership(id: string): Promise<PortfolioOwnershipRecord | null>;
  publish(id: string, snapshot?: PortfolioData): Promise<PortfolioData | null>;
  unpublish(id: string): Promise<PortfolioData | null>;
  save(
    portfolio: PortfolioData,
    options?: { claimTokenHash?: string | null; expectedRevision?: number }
  ): Promise<{ portfolio: PortfolioData; isConflict?: boolean }>;
  delete(id: string): Promise<boolean>;
  listByUser(userId: string): Promise<PortfolioData[]>;
  listAllPublished(): Promise<PortfolioData[]>;
  isSlugAvailable(slug: string, excludeId?: string): Promise<boolean>;
  isDomainAvailable(domain: string, excludeId?: string): Promise<boolean>;
  claimDraft(id: string, claimToken: string, newUserId: string): Promise<boolean>;
}

interface PortfolioRow {
  id: string;
  user_id: string;
  claim_token_hash: string | null;
  title: string;
  slug: string;
  template_id: string;
  published: number;
  published_at: string | null;
  published_content_json?: string | null;
  custom_domain?: string | null;
  custom_domain_verified?: number;
  custom_domain_status?: string | null;
  custom_domain_token?: string | null;
  revision: number;
  schema_version: number;
  content_json: string;
  created_at: string;
  updated_at: string;
}

class SqlitePortfolioRepository implements PortfolioRepository {
  private hasMigratedLegacyJson = false;

  private migrateLegacyJsonIfPresent(): void {
    if (this.hasMigratedLegacyJson) return;
    this.hasMigratedLegacyJson = true;

    try {
      const legacyPath = path.resolve(process.cwd(), ".data", "portfolios.json");
      if (!fs.existsSync(legacyPath)) return;

      const db = getDatabase();
      const countRow = db.prepare("SELECT COUNT(*) as count FROM portfolios").get() as {
        count: number;
      };
      if (countRow && countRow.count > 0) {
        return; // Already populated
      }

      const content = fs.readFileSync(legacyPath, "utf-8");
      const items = JSON.parse(content);
      if (!Array.isArray(items) || items.length === 0) return;

      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO portfolios (
          id, user_id, claim_token_hash, title, slug, template_id, published,
          published_at, revision, schema_version, content_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        const parsed = PortfolioDataSchema.safeParse(item);
        if (parsed.success) {
          const p = parsed.data;
          insertStmt.run(
            p.id,
            p.userId || "anonymous",
            null,
            p.title,
            p.slug,
            p.appearance.templateId,
            p.published ? 1 : 0,
            p.publishedAt || null,
            p.revision || 1,
            p.version || 1,
            JSON.stringify(p),
            p.createdAt,
            p.updatedAt
          );
        }
      }
    } catch {
      // Legacy import failure is non-fatal
    }
  }

  private rowToPortfolio(row: PortfolioRow, preferPublishedSnapshot = false): PortfolioData | null {
    try {
      const sourceJson =
        preferPublishedSnapshot && row.published && row.published_content_json
          ? row.published_content_json
          : row.content_json;

      const parsedContent = JSON.parse(sourceJson);

      const customDomainConfig = parsedContent.customDomain || {
        domain: row.custom_domain || "",
        status: row.custom_domain_status || (row.custom_domain_verified ? "verified" : "none"),
        verificationToken: row.custom_domain_token || "",
        verifiedAt: row.custom_domain_verified ? row.updated_at : null,
        configuredAt: null,
        lastCheckedAt: null,
        errorMessage: "",
      };

      const validated = PortfolioDataSchema.safeParse({
        ...parsedContent,
        id: row.id,
        userId: row.user_id,
        title: preferPublishedSnapshot && parsedContent.title ? parsedContent.title : row.title,
        slug: preferPublishedSnapshot && parsedContent.slug ? parsedContent.slug : row.slug,
        published: Boolean(row.published),
        publishedAt: row.published_at,
        customDomain: customDomainConfig,
        revision: row.revision,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      return validated.success ? validated.data : null;
    } catch {
      return null;
    }
  }

  async getById(id: string): Promise<PortfolioData | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const row = db.prepare("SELECT * FROM portfolios WHERE id = ?").get(id) as
      | PortfolioRow
      | undefined;
    if (!row) return null;
    return this.rowToPortfolio(row, false);
  }

  async getBySlug(slug: string, options?: { onlyPublished?: boolean }): Promise<PortfolioData | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const normalizedSlug = slug.trim().toLowerCase();
    const query = options?.onlyPublished
      ? "SELECT * FROM portfolios WHERE LOWER(slug) = ? AND published = 1"
      : "SELECT * FROM portfolios WHERE LOWER(slug) = ?";
    const row = db.prepare(query).get(normalizedSlug) as
      | PortfolioRow
      | undefined;
    if (!row) return null;
    return this.rowToPortfolio(row, Boolean(options?.onlyPublished));
  }

  async getByCustomDomain(domain: string): Promise<PortfolioData | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const normalizedDomain = domain.trim().toLowerCase();
    const row = db
      .prepare(
        "SELECT * FROM portfolios WHERE LOWER(custom_domain) = ? AND custom_domain_verified = 1 AND published = 1"
      )
      .get(normalizedDomain) as PortfolioRow | undefined;
    if (!row) return null;
    return this.rowToPortfolio(row, true);
  }

  async getOwnership(id: string): Promise<PortfolioOwnershipRecord | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const row = db
      .prepare(
        "SELECT id, user_id, claim_token_hash, published, revision, custom_domain FROM portfolios WHERE id = ?"
      )
      .get(id) as
      | {
          id: string;
          user_id: string;
          claim_token_hash: string | null;
          published: number;
          revision: number;
          custom_domain: string | null;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      claimTokenHash: row.claim_token_hash,
      published: Boolean(row.published),
      revision: row.revision,
      customDomain: row.custom_domain,
    };
  }

  async publish(id: string, snapshot?: PortfolioData): Promise<PortfolioData | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const current = await this.getById(id);
    if (!current) return null;

    const dataToPublish = snapshot
      ? { ...snapshot, id: current.id, userId: current.userId }
      : current;
    const now = new Date().toISOString();
    dataToPublish.published = true;
    dataToPublish.publishedAt = now;
    dataToPublish.updatedAt = now;

    const validated = PortfolioDataSchema.parse(dataToPublish);
    const publishedJson = JSON.stringify(validated);

    db.prepare(`
      UPDATE portfolios SET
        published = 1,
        published_at = ?,
        published_content_json = ?,
        content_json = ?,
        title = ?,
        slug = ?,
        template_id = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      now,
      publishedJson,
      publishedJson,
      validated.title,
      validated.slug,
      validated.appearance.templateId,
      now,
      id
    );

    return validated;
  }

  async unpublish(id: string): Promise<PortfolioData | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const current = await this.getById(id);
    if (!current) return null;

    current.published = false;
    current.publishedAt = null;
    const now = new Date().toISOString();
    current.updatedAt = now;

    db.prepare(`
      UPDATE portfolios SET
        published = 0,
        published_at = NULL,
        updated_at = ?
      WHERE id = ?
    `).run(now, id);

    return current;
  }

  async listAllPublished(): Promise<PortfolioData[]> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const rows = db
      .prepare("SELECT * FROM portfolios WHERE published = 1 ORDER BY published_at DESC")
      .all() as unknown as PortfolioRow[];

    return rows
      .map((r) => this.rowToPortfolio(r, true))
      .filter((p): p is PortfolioData => p !== null);
  }

  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const normalized = slug.trim().toLowerCase();
    const row = excludeId
      ? db
          .prepare("SELECT id FROM portfolios WHERE LOWER(slug) = ? AND id != ?")
          .get(normalized, excludeId)
      : db.prepare("SELECT id FROM portfolios WHERE LOWER(slug) = ?").get(normalized);
    return !row;
  }

  async isDomainAvailable(domain: string, excludeId?: string): Promise<boolean> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const normalized = domain.trim().toLowerCase();
    const row = excludeId
      ? db
          .prepare("SELECT id FROM portfolios WHERE LOWER(custom_domain) = ? AND id != ?")
          .get(normalized, excludeId)
      : db.prepare("SELECT id FROM portfolios WHERE LOWER(custom_domain) = ?").get(normalized);
    return !row;
  }

  async save(
    portfolio: PortfolioData,
    options?: { claimTokenHash?: string | null; expectedRevision?: number }
  ): Promise<{ portfolio: PortfolioData; isConflict?: boolean }> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();

    // 1. Concurrency Check: If an expectedRevision was provided, ensure it matches current DB state
    const existing = db
      .prepare(
        "SELECT revision, claim_token_hash, published_content_json FROM portfolios WHERE id = ?"
      )
      .get(portfolio.id) as
      | {
          revision: number;
          claim_token_hash: string | null;
          published_content_json: string | null;
        }
      | undefined;

    if (existing && typeof options?.expectedRevision === "number") {
      if (existing.revision !== options.expectedRevision) {
        // Concurrency conflict detected!
        return {
          portfolio: (await this.getById(portfolio.id)) || portfolio,
          isConflict: true,
        };
      }
    }

    // 2. Increment revision on update, or start at 1
    const nextRevision = existing ? existing.revision + 1 : portfolio.revision || 1;
    const now = new Date().toISOString();

    const normalizedData: PortfolioData = {
      ...portfolio,
      revision: nextRevision,
      updatedAt: now,
    };

    // Strict schema parse before writing
    const validated = PortfolioDataSchema.parse(normalizedData);

    const claimTokenHash = options?.claimTokenHash ?? existing?.claim_token_hash ?? null;
    const customDomain = validated.customDomain?.domain ? validated.customDomain.domain.toLowerCase() : null;
    const customDomainVerified =
      validated.customDomain?.status === "verified" || validated.customDomain?.status === "active"
        ? 1
        : 0;
    const customDomainStatus = validated.customDomain?.status || "none";
    const customDomainToken = validated.customDomain?.verificationToken || null;

    // Retain existing published snapshot on regular save; publish() explicitly updates it
    const publishedContentJson = existing?.published_content_json ?? (validated.published ? JSON.stringify(validated) : null);

    const upsertStmt = db.prepare(`
      INSERT INTO portfolios (
        id, user_id, claim_token_hash, title, slug, template_id, published,
        published_at, published_content_json, custom_domain, custom_domain_verified,
        custom_domain_status, custom_domain_token, revision, schema_version,
        content_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        user_id = excluded.user_id,
        claim_token_hash = COALESCE(excluded.claim_token_hash, portfolios.claim_token_hash),
        title = excluded.title,
        slug = excluded.slug,
        template_id = excluded.template_id,
        published = excluded.published,
        published_at = excluded.published_at,
        published_content_json = COALESCE(portfolios.published_content_json, excluded.published_content_json),
        custom_domain = excluded.custom_domain,
        custom_domain_verified = excluded.custom_domain_verified,
        custom_domain_status = excluded.custom_domain_status,
        custom_domain_token = excluded.custom_domain_token,
        revision = excluded.revision,
        schema_version = excluded.schema_version,
        content_json = excluded.content_json,
        updated_at = excluded.updated_at
    `);

    upsertStmt.run(
      validated.id,
      validated.userId,
      claimTokenHash,
      validated.title,
      validated.slug,
      validated.appearance.templateId,
      validated.published ? 1 : 0,
      validated.publishedAt,
      publishedContentJson,
      customDomain,
      customDomainVerified,
      customDomainStatus,
      customDomainToken,
      validated.revision,
      validated.version || 1,
      JSON.stringify(validated),
      validated.createdAt || now,
      validated.updatedAt
    );

    return { portfolio: validated, isConflict: false };
  }

  async delete(id: string): Promise<boolean> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const result = db.prepare("DELETE FROM portfolios WHERE id = ?").run(id);
    return result.changes > 0;
  }

  async listByUser(userId: string): Promise<PortfolioData[]> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const rows = db
      .prepare("SELECT * FROM portfolios WHERE user_id = ? ORDER BY updated_at DESC")
      .all(userId) as unknown as PortfolioRow[];

    return rows
      .map((r) => this.rowToPortfolio(r))
      .filter((p): p is PortfolioData => p !== null);
  }

  async claimDraft(id: string, claimToken: string, newUserId: string): Promise<boolean> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const row = db
      .prepare("SELECT user_id, claim_token_hash FROM portfolios WHERE id = ?")
      .get(id) as { user_id: string; claim_token_hash: string | null } | undefined;

    if (!row || !row.claim_token_hash) {
      return false;
    }

    if (!verifyClaimToken(claimToken, row.claim_token_hash)) {
      return false;
    }

    const update = db.prepare(`
      UPDATE portfolios
      SET user_id = ?, claim_token_hash = NULL, updated_at = ?
      WHERE id = ?
    `);

    const result = update.run(newUserId, new Date().toISOString(), id);
    return result.changes > 0;
  }
}

export const portfolioRepository: PortfolioRepository = new SqlitePortfolioRepository();
