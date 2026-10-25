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
}

export interface PortfolioRepository {
  getById(id: string): Promise<PortfolioData | null>;
  getBySlug(slug: string): Promise<PortfolioData | null>;
  getOwnership(id: string): Promise<PortfolioOwnershipRecord | null>;
  save(
    portfolio: PortfolioData,
    options?: { claimTokenHash?: string | null; expectedRevision?: number }
  ): Promise<{ portfolio: PortfolioData; isConflict?: boolean }>;
  delete(id: string): Promise<boolean>;
  listByUser(userId: string): Promise<PortfolioData[]>;
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

  private rowToPortfolio(row: PortfolioRow): PortfolioData | null {
    try {
      const parsedContent = JSON.parse(row.content_json);
      const validated = PortfolioDataSchema.safeParse({
        ...parsedContent,
        id: row.id,
        userId: row.user_id,
        title: row.title,
        slug: row.slug,
        published: Boolean(row.published),
        publishedAt: row.published_at,
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
    return this.rowToPortfolio(row);
  }

  async getBySlug(slug: string): Promise<PortfolioData | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const row = db.prepare("SELECT * FROM portfolios WHERE slug = ?").get(slug) as
      | PortfolioRow
      | undefined;
    if (!row) return null;
    return this.rowToPortfolio(row);
  }

  async getOwnership(id: string): Promise<PortfolioOwnershipRecord | null> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();
    const row = db
      .prepare(
        "SELECT id, user_id, claim_token_hash, published, revision FROM portfolios WHERE id = ?"
      )
      .get(id) as
      | {
          id: string;
          user_id: string;
          claim_token_hash: string | null;
          published: number;
          revision: number;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      claimTokenHash: row.claim_token_hash,
      published: Boolean(row.published),
      revision: row.revision,
    };
  }

  async save(
    portfolio: PortfolioData,
    options?: { claimTokenHash?: string | null; expectedRevision?: number }
  ): Promise<{ portfolio: PortfolioData; isConflict?: boolean }> {
    this.migrateLegacyJsonIfPresent();
    const db = getDatabase();

    // 1. Concurrency Check: If an expectedRevision was provided, ensure it matches current DB state
    const existing = db
      .prepare("SELECT revision, claim_token_hash FROM portfolios WHERE id = ?")
      .get(portfolio.id) as { revision: number; claim_token_hash: string | null } | undefined;

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

    const upsertStmt = db.prepare(`
      INSERT INTO portfolios (
        id, user_id, claim_token_hash, title, slug, template_id, published,
        published_at, revision, schema_version, content_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        user_id = excluded.user_id,
        claim_token_hash = COALESCE(excluded.claim_token_hash, portfolios.claim_token_hash),
        title = excluded.title,
        slug = excluded.slug,
        template_id = excluded.template_id,
        published = excluded.published,
        published_at = excluded.published_at,
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
