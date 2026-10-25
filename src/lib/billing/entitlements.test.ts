import { describe, it, expect, beforeEach } from "vitest";
import { getDatabase, runMigrations } from "@/lib/db/database";
import {
  getUserSubscription,
  setUserSubscription,
  canAccessTemplate,
  canUseCustomDomain,
  getAnalyticsRetentionDays,
  getMaxSnapshots,
  checkAndConsumeAiUsage,
} from "./entitlements";
import { PLANS } from "./plans";

describe("Part 14/15 — Centralized Billing & Entitlement Enforcement", () => {
  beforeEach(() => {
    const db = getDatabase();
    runMigrations(db);
  });

  describe("Subscription State Retrieval & Defaults", () => {
    it("defaults unauthenticated and unknown users honestly to the Free plan", () => {
      const anonSub = getUserSubscription("anonymous");
      expect(anonSub.planId).toBe("free");
      expect(anonSub.status).toBe("active");

      const unknownUser = getUserSubscription("usr-never-seen-before");
      expect(unknownUser.planId).toBe("free");
      expect(unknownUser.status).toBe("active");
    });

    it("retrieves active Pro subscriptions accurately from the database", () => {
      const proUser = `usr_pro_${Date.now()}`;
      setUserSubscription(proUser, "pro", { status: "active" });

      const sub = getUserSubscription(proUser);
      expect(sub.planId).toBe("pro");
      expect(sub.status).toBe("active");
    });

    it("falls back to Free entitlements if a Pro subscription is canceled or expired", () => {
      const canceledUser = `usr_canceled_${Date.now()}`;
      setUserSubscription(canceledUser, "pro", { status: "canceled" });

      const sub = getUserSubscription(canceledUser);
      // Inactive/canceled subscriptions lose paid entitlements
      expect(sub.planId).toBe("free");
    });
  });

  describe("Feature Entitlement Access Checks", () => {
    const freeUser = `usr_free_${Date.now()}`;
    const proUser = `usr_pro_${Date.now()}`;

    beforeEach(() => {
      setUserSubscription(freeUser, "free");
      setUserSubscription(proUser, "pro");
    });

    it("enforces custom domain gating (Free: forbidden, Pro: allowed)", () => {
      expect(canUseCustomDomain(freeUser)).toBe(false);
      expect(canUseCustomDomain(proUser)).toBe(true);
    });

    it("enforces template gating (Free: only free templates, Pro: all templates)", () => {
      // Free templates
      expect(canAccessTemplate(freeUser, "minimal-portfolio")).toBe(true);
      expect(canAccessTemplate(freeUser, "developer-pro")).toBe(true);

      // Premium templates denied on Free
      expect(canAccessTemplate(freeUser, "editorial-studio")).toBe(false);
      expect(canAccessTemplate(freeUser, "creative-motion")).toBe(false);
      expect(canAccessTemplate(freeUser, "product-engineer")).toBe(false);

      // Pro gets access to everything
      expect(canAccessTemplate(proUser, "minimal-portfolio")).toBe(true);
      expect(canAccessTemplate(proUser, "developer-pro")).toBe(true);
      expect(canAccessTemplate(proUser, "editorial-studio")).toBe(true);
      expect(canAccessTemplate(proUser, "creative-motion")).toBe(true);
      expect(canAccessTemplate(proUser, "product-engineer")).toBe(true);
    });

    it("returns correct plan-configured analytics retention and snapshot limits", () => {
      expect(getAnalyticsRetentionDays(freeUser)).toBe(7);
      expect(getAnalyticsRetentionDays(proUser)).toBe(365);

      expect(getMaxSnapshots(freeUser)).toBe(3);
      expect(getMaxSnapshots(proUser)).toBe(30);
    });
  });

  describe("Monthly AI Usage Accounting & Concurrency-Safe Enforcement", () => {
    it("tracks metered AI usage and rejects requests once monthly allowance is exhausted", () => {
      const meteredUser = `usr_metered_ai_${Date.now()}`;
      setUserSubscription(meteredUser, "free"); // Free allowance: 10 operations/month

      const freeAllowance = PLANS.free.entitlements.aiMonthlyAllowance; // 10

      // Consume up to the allowance
      for (let i = 1; i <= freeAllowance; i++) {
        const usage = checkAndConsumeAiUsage(meteredUser, "ai_operation");
        expect(usage.allowed).toBe(true);
        expect(usage.total).toBe(i);
        expect(usage.remaining).toBe(freeAllowance - i);
      }

      // Next request must be rejected
      const exhausted = checkAndConsumeAiUsage(meteredUser, "ai_operation");
      expect(exhausted.allowed).toBe(false);
      expect(exhausted.remaining).toBe(0);
      expect(exhausted.total).toBe(freeAllowance);

      // Upgrading to Pro expands allowance to 100
      setUserSubscription(meteredUser, "pro");
      const proUsage = checkAndConsumeAiUsage(meteredUser, "ai_operation");
      expect(proUsage.allowed).toBe(true);
      expect(proUsage.total).toBe(freeAllowance + 1);
      expect(proUsage.allowance).toBe(PLANS.pro.entitlements.aiMonthlyAllowance); // 100
    });
  });
});
