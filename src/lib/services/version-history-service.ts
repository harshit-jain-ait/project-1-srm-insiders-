import { getDatabase } from "@/lib/db/database";
import { PortfolioData, PortfolioDataSchema } from "@/lib/schema/portfolio";
import { getMaxSnapshots } from "@/lib/billing/entitlements";
import crypto from "crypto";

export interface SnapshotMetadata {
  id: string;
  portfolioId: string;
  userId: string;
  revision: number;
  label: string;
  trigger: "manual" | "pre_ai" | "template_switch" | "pre_restore" | "publish";
  schemaVersion: number;
  templateId: string;
  createdAt: string;
}

export interface FullSnapshot extends SnapshotMetadata {
  content: PortfolioData;
}

/**
 * Creates a durable snapshot of the current portfolio state.
 * Deduplicates consecutive unchanged snapshots and prunes according to plan limits.
 */
export function createPortfolioSnapshot(
  portfolioId: string,
  userId: string,
  trigger: SnapshotMetadata["trigger"] = "manual",
  customLabel?: string
): SnapshotMetadata | null {
  const db = getDatabase();

  // 1. Fetch current portfolio
  const port = db
    .prepare("SELECT user_id, revision, template_id, content_json FROM portfolios WHERE id = ?")
    .get(portfolioId) as
    | {
        user_id: string;
        revision: number;
        template_id: string;
        content_json: string;
      }
    | undefined;

  if (!port) {
    throw new Error("Portfolio not found");
  }

  if (port.user_id !== userId && port.user_id !== "anonymous") {
    throw new Error("Unauthorized to snapshot this portfolio");
  }

  // 2. Deduplication check: check most recent snapshot (exempt pre_restore to guarantee safety checkpoint)
  if (trigger !== "pre_restore") {
    const latest = db
      .prepare(
        "SELECT content_json FROM portfolio_snapshots WHERE portfolio_id = ? ORDER BY revision DESC, created_at DESC LIMIT 1"
      )
      .get(portfolioId) as { content_json: string } | undefined;

    if (latest && latest.content_json === port.content_json) {
      // Content has not changed since last snapshot, avoid duplicate noise
      return null;
    }
  }

  const defaultLabels: Record<SnapshotMetadata["trigger"], string> = {
    manual: "Manual Checkpoint",
    pre_ai: "Pre-AI Generation Backup",
    template_switch: "Pre-Template Switch Backup",
    pre_restore: "Pre-Restore Recovery Point",
    publish: "Published Milestone",
  };

  const label = customLabel || defaultLabels[trigger] || "Version Checkpoint";
  const id = `snap_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE;");
  try {
    // 3. Insert snapshot
    db.prepare(`
      INSERT INTO portfolio_snapshots (
        id, portfolio_id, user_id, revision, label, trigger, schema_version,
        template_id, content_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `).run(
      id,
      portfolioId,
      port.user_id,
      port.revision,
      label,
      trigger,
      port.template_id,
      port.content_json,
      now
    );

    // 4. Prune snapshots exceeding plan quota
    const maxAllowed = getMaxSnapshots(userId);
    db.prepare(`
      DELETE FROM portfolio_snapshots
      WHERE portfolio_id = ? AND id NOT IN (
        SELECT id FROM portfolio_snapshots
        WHERE portfolio_id = ?
        ORDER BY revision DESC, created_at DESC
        LIMIT ?
      )
    `).run(portfolioId, portfolioId, maxAllowed);

    db.exec("COMMIT;");

    return {
      id,
      portfolioId,
      userId: port.user_id,
      revision: port.revision,
      label,
      trigger,
      schemaVersion: 1,
      templateId: port.template_id,
      createdAt: now,
    };
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}

/**
 * Lists all available historical snapshots for a portfolio.
 */
export function listPortfolioSnapshots(
  portfolioId: string,
  userId: string
): SnapshotMetadata[] {
  const db = getDatabase();

  const port = db
    .prepare("SELECT user_id FROM portfolios WHERE id = ?")
    .get(portfolioId) as { user_id: string } | undefined;

  if (!port) {
    throw new Error("Portfolio not found");
  }

  if (port.user_id !== userId && port.user_id !== "anonymous") {
    throw new Error("Unauthorized to access portfolio history");
  }

  const rows = db
    .prepare(`
      SELECT id, portfolio_id, user_id, revision, label, trigger, schema_version,
             template_id, created_at
      FROM portfolio_snapshots
      WHERE portfolio_id = ?
      ORDER BY revision DESC, created_at DESC
    `)
    .all(portfolioId) as unknown as {
    id: string;
    portfolio_id: string;
    user_id: string;
    revision: number;
    label: string;
    trigger: string;
    schema_version: number;
    template_id: string;
    created_at: string;
  }[];

  return rows.map((r) => ({
    id: r.id,
    portfolioId: r.portfolio_id,
    userId: r.user_id,
    revision: r.revision,
    label: r.label,
    trigger: r.trigger as SnapshotMetadata["trigger"],
    schemaVersion: r.schema_version,
    templateId: r.template_id,
    createdAt: r.created_at,
  }));
}

/**
 * Retrieves a single snapshot including full parsed content for preview or comparison.
 */
export function getPortfolioSnapshot(
  portfolioId: string,
  snapshotId: string,
  userId: string
): FullSnapshot {
  const db = getDatabase();

  const snap = db
    .prepare("SELECT * FROM portfolio_snapshots WHERE id = ? AND portfolio_id = ?")
    .get(snapshotId, portfolioId) as
    | {
        id: string;
        portfolio_id: string;
        user_id: string;
        revision: number;
        label: string;
        trigger: string;
        schema_version: number;
        template_id: string;
        content_json: string;
        created_at: string;
      }
    | undefined;

  if (!snap) {
    throw new Error("Snapshot not found");
  }

  if (snap.user_id !== userId && snap.user_id !== "anonymous") {
    throw new Error("Unauthorized to access this snapshot");
  }

  const parsed = JSON.parse(snap.content_json);
  const validated = PortfolioDataSchema.parse(parsed);

  return {
    id: snap.id,
    portfolioId: snap.portfolio_id,
    userId: snap.user_id,
    revision: snap.revision,
    label: snap.label,
    trigger: snap.trigger as SnapshotMetadata["trigger"],
    schemaVersion: snap.schema_version,
    templateId: snap.template_id,
    createdAt: snap.created_at,
    content: validated,
  };
}

/**
 * Safely restores a historical snapshot.
 * Preserves an automatic recovery checkpoint of the current draft before replacing.
 */
export function restorePortfolioSnapshot(
  portfolioId: string,
  snapshotId: string,
  userId: string
): PortfolioData {
  const db = getDatabase();

  // 1. Fetch current portfolio
  const current = db
    .prepare("SELECT user_id, revision, template_id, content_json, published FROM portfolios WHERE id = ?")
    .get(portfolioId) as
    | {
        user_id: string;
        revision: number;
        template_id: string;
        content_json: string;
        published: number;
      }
    | undefined;

  if (!current) {
    throw new Error("Portfolio not found");
  }

  if (current.user_id !== userId && current.user_id !== "anonymous") {
    throw new Error("Unauthorized to restore this portfolio");
  }

  // 2. Fetch and validate target snapshot
  const target = getPortfolioSnapshot(portfolioId, snapshotId, userId);

  // 3. Create pre-restore recovery checkpoint of current state
  createPortfolioSnapshot(
    portfolioId,
    userId,
    "pre_restore",
    `Auto-backup before restoring revision ${target.revision}`
  );

  // 4. Construct restored portfolio data
  const nextRevision = current.revision + 1;
  const now = new Date().toISOString();

  const restoredPortfolio: PortfolioData = {
    ...target.content,
    id: portfolioId,
    userId: current.user_id,
    revision: nextRevision,
    published: Boolean(current.published), // Do NOT accidentally publish draft on restore
    updatedAt: now,
  };

  const validated = PortfolioDataSchema.parse(restoredPortfolio);
  const updatedJson = JSON.stringify(validated);

  db.exec("BEGIN IMMEDIATE;");
  try {
    // 5. Update portfolio row transactionally
    db.prepare(`
      UPDATE portfolios SET
        title = ?,
        slug = ?,
        template_id = ?,
        revision = ?,
        content_json = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      validated.title,
      validated.slug,
      validated.appearance.templateId,
      nextRevision,
      updatedJson,
      now,
      portfolioId
    );

    // 6. Record a post-restore checkpoint
    const postRestoreId = `snap_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    db.prepare(`
      INSERT INTO portfolio_snapshots (
        id, portfolio_id, user_id, revision, label, trigger, schema_version,
        template_id, content_json, created_at
      ) VALUES (?, ?, ?, ?, ?, 'manual', 1, ?, ?, ?)
    `).run(
      postRestoreId,
      portfolioId,
      current.user_id,
      nextRevision,
      `Restored from revision ${target.revision} (${target.label})`,
      validated.appearance.templateId,
      updatedJson,
      now
    );

    db.exec("COMMIT;");
    return validated;
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
