import { getDatabase } from "@/lib/db/database";
import { getPlanConfig, PlanEntitlements, PlanId, isPremiumTemplate } from "./plans";
import { TemplateId } from "@/lib/schema/portfolio";

export interface UserSubscription {
  userId: string;
  planId: PlanId;
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

/**
 * Retrieves the authoritative server-side subscription state for a user.
 * Defaults to "free" if no active paid subscription exists.
 */
export function getUserSubscription(userId: string): UserSubscription {
  if (!userId || userId === "anonymous") {
    return {
      userId: userId || "anonymous",
      planId: "free",
      status: "active",
      cancelAtPeriodEnd: false,
    };
  }

  const db = getDatabase();
  const row = db
    .prepare(
      "SELECT user_id, plan_id, status, current_period_end, cancel_at_period_end, stripe_customer_id, stripe_subscription_id FROM user_subscriptions WHERE user_id = ?"
    )
    .get(userId) as
    | {
        user_id: string;
        plan_id: string;
        status: string;
        current_period_end: string | null;
        cancel_at_period_end: number;
        stripe_customer_id: string | null;
        stripe_subscription_id: string | null;
      }
    | undefined;

  if (!row) {
    return {
      userId,
      planId: "free",
      status: "active",
      cancelAtPeriodEnd: false,
    };
  }

  const planId: PlanId = row.plan_id === "pro" ? "pro" : "free";
  const isActive = row.status === "active" || row.status === "trialing";

  return {
    userId: row.user_id,
    planId: isActive ? planId : "free",
    status: row.status as UserSubscription["status"],
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
  };
}

/**
 * Sets or updates a user's subscription record (used by billing webhooks and admin/testing).
 */
export function setUserSubscription(
  userId: string,
  planId: PlanId,
  options: {
    status?: UserSubscription["status"];
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  } = {}
): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  const status = options.status || "active";
  const cancelAtPeriodEnd = options.cancelAtPeriodEnd ? 1 : 0;

  db.prepare(`
    INSERT INTO user_subscriptions (
      user_id, plan_id, status, current_period_end, cancel_at_period_end,
      stripe_customer_id, stripe_subscription_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      plan_id = excluded.plan_id,
      status = excluded.status,
      current_period_end = excluded.current_period_end,
      cancel_at_period_end = excluded.cancel_at_period_end,
      stripe_customer_id = COALESCE(excluded.stripe_customer_id, user_subscriptions.stripe_customer_id),
      stripe_subscription_id = COALESCE(excluded.stripe_subscription_id, user_subscriptions.stripe_subscription_id),
      updated_at = excluded.updated_at
  `).run(
    userId,
    planId,
    status,
    options.currentPeriodEnd || null,
    cancelAtPeriodEnd,
    options.stripeCustomerId || null,
    options.stripeSubscriptionId || null,
    now,
    now
  );
}

/**
 * Returns the effective feature entitlements for an account.
 */
export function getUserEntitlements(userId: string): PlanEntitlements {
  const sub = getUserSubscription(userId);
  const plan = getPlanConfig(sub.planId);
  return plan.entitlements;
}

/**
 * Validates whether a user is entitled to use or publish with a specific template.
 */
export function canAccessTemplate(userId: string, templateId: TemplateId | string): boolean {
  if (!isPremiumTemplate(templateId)) {
    return true; // Free templates accessible to all
  }
  const entitlements = getUserEntitlements(userId);
  return entitlements.allowedTemplates.includes(templateId as TemplateId);
}

/**
 * Validates whether a user is entitled to connect custom apex/subdomains.
 */
export function canUseCustomDomain(userId: string): boolean {
  return getUserEntitlements(userId).customDomains;
}

/**
 * Returns the analytics retention horizon in days for the user.
 */
export function getAnalyticsRetentionDays(userId: string): number {
  return getUserEntitlements(userId).analyticsRetentionDays;
}

/**
 * Returns maximum allowed historical snapshots for the user.
 */
export function getMaxSnapshots(userId: string): number {
  return getUserEntitlements(userId).maxSnapshots;
}

/**
 * Validates and records an AI metered usage event in a concurrency-safe transaction.
 */
export function checkAndConsumeAiUsage(
  userId: string,
  metric: string = "ai_operation"
): { allowed: boolean; remaining: number; total: number; allowance: number } {
  const entitlements = getUserEntitlements(userId);
  const allowance = entitlements.aiMonthlyAllowance;

  const db = getDatabase();
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  db.exec("BEGIN IMMEDIATE;");
  try {
    const existing = db
      .prepare("SELECT count FROM usage_records WHERE user_id = ? AND metric = ? AND period = ?")
      .get(userId, metric, period) as { count: number } | undefined;

    const currentCount = existing ? existing.count : 0;

    if (currentCount >= allowance) {
      db.exec("COMMIT;");
      return {
        allowed: false,
        remaining: 0,
        total: currentCount,
        allowance,
      };
    }

    const newCount = currentCount + 1;
    const timestamp = now.toISOString();

    db.prepare(`
      INSERT INTO usage_records (id, user_id, metric, count, period, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, metric, period) DO UPDATE SET
        count = excluded.count,
        updated_at = excluded.updated_at
    `).run(
      `usage_${userId}_${metric}_${period}`,
      userId,
      metric,
      newCount,
      period,
      timestamp,
      timestamp
    );

    db.exec("COMMIT;");
    return {
      allowed: true,
      remaining: allowance - newCount,
      total: newCount,
      allowance,
    };
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
