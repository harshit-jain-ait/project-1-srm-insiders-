import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

let dbInstance: DatabaseSync | null = null;
let currentDbPath: string | null = null;

export function getDatabasePath(): string {
  if (process.env.PORTFOLIO_DB_PATH) {
    return process.env.PORTFOLIO_DB_PATH;
  }
  const dataDir = path.resolve(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "portfolify.db");
}

/**
 * Returns the singleton DatabaseSync instance.
 * Automatically runs pending migrations on initial connection.
 */
export function getDatabase(customPath?: string): DatabaseSync {
  const targetPath = customPath || getDatabasePath();

  if (dbInstance && currentDbPath === targetPath) {
    return dbInstance;
  }

  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // Ignore close errors during switch
    }
  }

  if (targetPath !== ":memory:") {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  dbInstance = new DatabaseSync(targetPath);
  currentDbPath = targetPath;

  // Initialize PRAGMA settings for data integrity and speed
  if (targetPath !== ":memory:") {
    dbInstance.exec("PRAGMA journal_mode = WAL;");
  }
  dbInstance.exec("PRAGMA foreign_keys = ON;");

  // Ensure migrations are executed
  runMigrations(dbInstance);

  return dbInstance;
}

/**
 * Embedded migrations list ensuring zero file-resolution issues in Next.js Turbopack / Vercel bundles.
 */
export const MIGRATIONS = [
  {
    version: "001_initial_schema",
    sql: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT UNIQUE NOT NULL,
        applied_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS portfolios (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        claim_token_hash TEXT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        template_id TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 0,
        published_at TEXT,
        revision INTEGER NOT NULL DEFAULT 1,
        schema_version INTEGER NOT NULL DEFAULT 1,
        content_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
      CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
      CREATE INDEX IF NOT EXISTS idx_portfolios_published ON portfolios(published);
      CREATE INDEX IF NOT EXISTS idx_portfolios_updated_at ON portfolios(updated_at);
    `,
  },
  {
    version: "002_publishing_and_custom_domains",
    sql: `
      ALTER TABLE portfolios ADD COLUMN published_content_json TEXT;
      ALTER TABLE portfolios ADD COLUMN custom_domain TEXT;
      ALTER TABLE portfolios ADD COLUMN custom_domain_verified INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE portfolios ADD COLUMN custom_domain_status TEXT DEFAULT 'none';
      ALTER TABLE portfolios ADD COLUMN custom_domain_token TEXT;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_custom_domain ON portfolios(custom_domain) WHERE custom_domain IS NOT NULL;

      UPDATE portfolios SET published_content_json = content_json WHERE published = 1 AND published_content_json IS NULL;
    `,
  },
  {
    version: "003_subscriptions_and_usage",
    sql: `
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        user_id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL DEFAULT 'free',
        status TEXT NOT NULL DEFAULT 'active',
        current_period_end TEXT,
        cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS usage_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        metric TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        period TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, metric, period)
      );

      CREATE INDEX IF NOT EXISTS idx_usage_user_period ON usage_records(user_id, period);
    `,
  },
  {
    version: "004_analytics_contact_and_versioning",
    sql: `
      CREATE TABLE IF NOT EXISTS portfolio_events (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        path TEXT NOT NULL DEFAULT '/',
        referrer_category TEXT NOT NULL DEFAULT 'direct',
        device_category TEXT NOT NULL DEFAULT 'desktop',
        visitor_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_portfolio_events_pid ON portfolio_events(portfolio_id);
      CREATE INDEX IF NOT EXISTS idx_portfolio_events_created ON portfolio_events(created_at);
      CREATE INDEX IF NOT EXISTS idx_portfolio_events_pid_created ON portfolio_events(portfolio_id, created_at);

      CREATE TABLE IF NOT EXISTS contact_submissions (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        ip_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_contact_submissions_pid ON contact_submissions(portfolio_id);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_uid ON contact_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at);

      CREATE TABLE IF NOT EXISTS portfolio_snapshots (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        revision INTEGER NOT NULL,
        label TEXT NOT NULL DEFAULT 'Manual Snapshot',
        trigger TEXT NOT NULL DEFAULT 'manual',
        schema_version INTEGER NOT NULL DEFAULT 1,
        template_id TEXT NOT NULL,
        content_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_pid ON portfolio_snapshots(portfolio_id);
      CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_pid_created ON portfolio_snapshots(portfolio_id, created_at);
    `,
  },
];

/**
 * Applies all pending database migrations in transaction.
 */
export function runMigrations(db: DatabaseSync): { applied: string[] } {
  // 1. Ensure schema_migrations table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT UNIQUE NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  // 2. Query already applied migrations
  const rows = db.prepare("SELECT version FROM schema_migrations").all() as unknown as {
    version: string;
  }[];
  const appliedVersions = new Set(rows.map((r) => r.version));

  const newlyApplied: string[] = [];

  // 3. Apply missing migrations sequentially
  for (const migration of MIGRATIONS) {
    if (!appliedVersions.has(migration.version)) {
      db.exec("BEGIN IMMEDIATE;");
      try {
        db.exec(migration.sql);
        const insert = db.prepare(
          "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)"
        );
        insert.run(migration.version, new Date().toISOString());
        db.exec("COMMIT;");
        newlyApplied.push(migration.version);
      } catch (err) {
        db.exec("ROLLBACK;");
        throw new Error(`Failed to apply migration ${migration.version}: ${err}`);
      }
    }
  }

  return { applied: newlyApplied };
}

/**
 * Explicitly closes the current database connection (useful for test tear-downs).
 */
export function closeDatabase(): void {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // Ignore
    }
    dbInstance = null;
    currentDbPath = null;
  }
}
