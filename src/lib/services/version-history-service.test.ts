import { describe, it, expect, beforeEach } from "vitest";
import { getDatabase, runMigrations } from "@/lib/db/database";
import {
  createPortfolioSnapshot,
  listPortfolioSnapshots,
  restorePortfolioSnapshot,
} from "./version-history-service";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";
import { setUserSubscription } from "@/lib/billing/entitlements";

describe("Part 15 — Portfolio Version History & Safe Restoration Service", () => {
  let testPortfolioId: string;
  const ownerUserId = "usr-version-owner-1";

  beforeEach(async () => {
    const db = getDatabase();
    runMigrations(db);

    testPortfolioId = `version_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const testSlug = `version-slug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Create an initial portfolio
    const initial = createEmptyPortfolio({
      id: testPortfolioId,
      userId: ownerUserId,
      title: "Maya Lin | Spatial Designer",
      slug: testSlug,
      published: false,
      profile: {
        fullName: "Maya Lin",
        headline: "Architectural & Spatial Computing",
        bio: "Designing immersive spatial environments.",
        email: "maya@spatial.design",
        location: "New York, NY",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
    });

    await portfolioRepository.save(initial);
    db.prepare("UPDATE portfolios SET user_id = ? WHERE id = ?").run(ownerUserId, testPortfolioId);
  });

  describe("Snapshot Creation & Deduplication", () => {
    it("creates a durable snapshot with metadata, revision, and timestamp", () => {
      const snap = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Initial Draft Setup");

      expect(snap).not.toBeNull();
      expect(snap?.portfolioId).toBe(testPortfolioId);
      expect(snap?.userId).toBe(ownerUserId);
      expect(snap?.label).toBe("Initial Draft Setup");
      expect(snap?.trigger).toBe("manual");
      expect(snap?.revision).toBe(1);
      expect(snap?.id).toMatch(/^snap_/);

      const list = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(snap?.id);
    });

    it("deduplicates consecutive identical snapshots to avoid redundant database entries", () => {
      const first = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "First Save");
      expect(first).not.toBeNull();

      // Content has not changed since first snapshot
      const duplicate = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Second Save");
      expect(duplicate).toBeNull();

      const list = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      expect(list).toHaveLength(1);
    });

    it("creates separate snapshots when content is meaningfully modified", async () => {
      createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Version 1");

      // Update portfolio content
      const current = await portfolioRepository.getById(testPortfolioId);
      expect(current).not.toBeNull();
      current!.profile.headline = "Principal Computational Architect";
      await portfolioRepository.save(current!);

      const second = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Version 2 — Updated Headline");
      expect(second).not.toBeNull();
      expect(second?.label).toBe("Version 2 — Updated Headline");

      const list = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      expect(list).toHaveLength(2);
    });
  });

  describe("Safe Rollback & Recovery Workflow", () => {
    it("automatically creates a pre-restore backup checkpoint before restoring earlier snapshot", async () => {
      // 1. Snapshot original state (headline: Spatial Computing)
      const v1 = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Baseline V1");
      expect(v1).not.toBeNull();

      // 2. Modify state (headline: Machine Learning Systems)
      const current = await portfolioRepository.getById(testPortfolioId);
      current!.profile.headline = "Machine Learning Systems Architect";
      await portfolioRepository.save(current!);

      // Snapshot new state
      const v2 = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Updated V2");
      expect(v2).not.toBeNull();

      // Verify 2 snapshots exist
      expect(listPortfolioSnapshots(testPortfolioId, ownerUserId)).toHaveLength(2);

      // 3. Restore V1
      const restored = restorePortfolioSnapshot(testPortfolioId, v1!.id, ownerUserId);

      // Current draft must now reflect V1
      expect(restored.profile.headline).toBe("Architectural & Spatial Computing");

      // An automatic pre-restore backup checkpoint must have been created
      const historyAfterRestore = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      // History should now have 3 snapshots (Baseline V1, Updated V2, and Auto pre-restore backup)
      expect(historyAfterRestore.length).toBeGreaterThanOrEqual(3);

      const preRestoreBackup = historyAfterRestore.find((s) => s.trigger === "pre_restore");
      expect(preRestoreBackup).toBeDefined();
      expect(preRestoreBackup?.label).toContain("Auto-backup before restoring");
    });

    it("does not inadvertently publish a private draft when restoring", async () => {
      // Ensure portfolio is unpublished
      await portfolioRepository.unpublish(testPortfolioId);
      const v1 = createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Unpublished Draft");

      const restored = restorePortfolioSnapshot(testPortfolioId, v1!.id, ownerUserId);
      expect(restored.published).toBe(false);

      const inDb = await portfolioRepository.getById(testPortfolioId);
      expect(inDb?.published).toBe(false);
    });
  });

  describe("Snapshot Authorization & Plan Retention Limits", () => {
    it("protects version history and restoration from unauthorized users", () => {
      createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", "Confidential Work");

      expect(() => {
        listPortfolioSnapshots(testPortfolioId, "unauthorized-user-999");
      }).toThrow("Unauthorized to access portfolio history");

      const list = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      expect(() => {
        restorePortfolioSnapshot(testPortfolioId, list[0].id, "unauthorized-user-999");
      }).toThrow("Unauthorized to restore this portfolio");
    });

    it("enforces plan limits and prunes oldest snapshots (Free: 3 max vs Pro: 30 max)", async () => {
      // Set user to Free plan (max 3 snapshots)
      setUserSubscription(ownerUserId, "free");

      // Create 5 successive modified snapshots
      for (let i = 1; i <= 5; i++) {
        const port = await portfolioRepository.getById(testPortfolioId);
        port!.profile.bio = `Bio iteration number ${i}`;
        await portfolioRepository.save(port!);
        createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", `Checkpoint ${i}`);
      }

      // Free user should be capped at 3 snapshots
      const freeHistory = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      expect(freeHistory).toHaveLength(3);
      // Oldest checkpoints (1 and 2) must have been pruned, leaving 3, 4, 5
      expect(freeHistory.some((s) => s.label === "Checkpoint 5")).toBe(true);
      expect(freeHistory.some((s) => s.label === "Checkpoint 4")).toBe(true);
      expect(freeHistory.some((s) => s.label === "Checkpoint 3")).toBe(true);
      expect(freeHistory.some((s) => s.label === "Checkpoint 1")).toBe(false);

      // Upgrade to Pro plan (max 30 snapshots)
      setUserSubscription(ownerUserId, "pro");

      // Create 2 more
      for (let i = 6; i <= 7; i++) {
        const port = await portfolioRepository.getById(testPortfolioId);
        port!.profile.bio = `Bio iteration number ${i}`;
        await portfolioRepository.save(port!);
        createPortfolioSnapshot(testPortfolioId, ownerUserId, "manual", `Checkpoint ${i}`);
      }

      const proHistory = listPortfolioSnapshots(testPortfolioId, ownerUserId);
      expect(proHistory).toHaveLength(5); // 3 existing + 2 new = 5, well within Pro 30 limit
    });
  });
});
