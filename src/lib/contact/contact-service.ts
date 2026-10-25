import { getDatabase } from "@/lib/db/database";
import { dispatchContactNotification, EmailDispatchResult } from "@/lib/email/email-service";
import { PortfolioData } from "@/lib/schema/portfolio";
import crypto from "crypto";

export interface ContactSubmissionInput {
  portfolioId: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  honeypot?: string;
  ip?: string;
}

export interface ContactSubmissionRecord {
  id: string;
  portfolioId: string;
  userId: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "unread" | "read" | "archived";
  ipHash: string;
  createdAt: string;
}

export interface SubmitContactResult {
  success: boolean;
  submissionId?: string;
  error?: string;
  notification?: EmailDispatchResult;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and records a visitor contact submission on a published portfolio.
 */
export async function submitContactMessage(
  input: ContactSubmissionInput
): Promise<SubmitContactResult> {
  // 1. Anti-spam honeypot verification
  if (input.honeypot && input.honeypot.trim() !== "") {
    // Silently reject bots without revealing honeypot detection
    return { success: false, error: "Submission rejected by spam filters." };
  }

  // 2. Validate fields
  const name = input.name?.trim() || "";
  if (name.length < 1 || name.length > 100) {
    return { success: false, error: "Name must be between 1 and 100 characters." };
  }

  const email = input.email?.trim().toLowerCase() || "";
  if (!EMAIL_REGEX.test(email) || email.length > 100) {
    return { success: false, error: "Please provide a valid email address." };
  }

  const subject = input.subject?.trim().slice(0, 150) || null;
  const message = input.message?.trim() || "";
  if (message.length < 5 || message.length > 3000) {
    return { success: false, error: "Message must be between 5 and 3,000 characters." };
  }

  const db = getDatabase();

  // 3. Verify portfolio exists and is currently published
  const row = db
    .prepare("SELECT user_id, title, published, content_json FROM portfolios WHERE id = ?")
    .get(input.portfolioId) as
    | {
        user_id: string;
        title: string;
        published: number;
        content_json: string;
      }
    | undefined;

  if (!row) {
    return { success: false, error: "Portfolio not found." };
  }

  if (!row.published) {
    return {
      success: false,
      error: "This portfolio is currently in draft mode and not accepting public messages.",
    };
  }

  let portfolioData: PortfolioData | null = null;
  try {
    portfolioData = JSON.parse(row.content_json);
  } catch {
    // Ignore JSON error
  }

  // Check if contact form is explicitly disabled in portfolio settings
  if (portfolioData?.contactConfig && !portfolioData.contactConfig.enabled) {
    return { success: false, error: "Contact submissions are currently disabled by the owner." };
  }

  // 4. Rate-limiting: max 5 messages per IP hash within 10 minutes
  const ip = input.ip || "127.0.0.1";
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 24);
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const countRow = db
    .prepare(
      "SELECT COUNT(*) as count FROM contact_submissions WHERE ip_hash = ? AND created_at >= ?"
    )
    .get(ipHash, tenMinutesAgo) as { count: number };

  if (countRow && countRow.count >= 5) {
    return {
      success: false,
      error: "Too many messages sent. Please wait a few minutes before trying again.",
    };
  }

  // 5. Persist submission
  const id = `sub_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO contact_submissions (
      id, portfolio_id, user_id, name, email, subject, message, status, ip_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'unread', ?, ?)
  `).run(
    id,
    input.portfolioId,
    row.user_id,
    name,
    email,
    subject,
    message,
    ipHash,
    now
  );

  // 6. Attempt email notification to owner if configured
  const recipientEmail =
    portfolioData?.contactConfig?.recipientEmail || portfolioData?.profile?.email || "";

  let notification: EmailDispatchResult = {
    dispatched: false,
    provider: "inbox_only",
    status: "stored_inbox_only",
  };

  if (recipientEmail) {
    notification = await dispatchContactNotification({
      toEmail: recipientEmail,
      senderName: name,
      senderEmail: email,
      subject: subject || undefined,
      message,
      portfolioTitle: row.title,
    });
  }

  return {
    success: true,
    submissionId: id,
    notification,
  };
}

/**
 * Retrieves all contact submissions for an authorized portfolio owner.
 */
export function listContactSubmissions(
  portfolioId: string,
  userId: string,
  statusFilter?: "unread" | "read" | "archived"
): ContactSubmissionRecord[] {
  const db = getDatabase();

  const port = db
    .prepare("SELECT user_id FROM portfolios WHERE id = ?")
    .get(portfolioId) as { user_id: string } | undefined;

  if (!port) {
    throw new Error("Portfolio not found");
  }

  if (port.user_id !== userId && port.user_id !== "anonymous") {
    throw new Error("Unauthorized access to contact submissions");
  }

  let query = "SELECT * FROM contact_submissions WHERE portfolio_id = ?";
  const params: string[] = [portfolioId];

  if (statusFilter) {
    query += " AND status = ?";
    params.push(statusFilter);
  }

  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all(...params) as unknown as {
    id: string;
    portfolio_id: string;
    user_id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    ip_hash: string;
    created_at: string;
  }[];

  return rows.map((r) => ({
    id: r.id,
    portfolioId: r.portfolio_id,
    userId: r.user_id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    status: r.status as "unread" | "read" | "archived",
    ipHash: r.ip_hash,
    createdAt: r.created_at,
  }));
}

/**
 * Updates the read/unread/archived status of a message.
 */
export function updateSubmissionStatus(
  submissionId: string,
  userId: string,
  status: "unread" | "read" | "archived"
): boolean {
  const db = getDatabase();

  const sub = db
    .prepare("SELECT user_id FROM contact_submissions WHERE id = ?")
    .get(submissionId) as { user_id: string } | undefined;

  if (!sub) return false;

  if (sub.user_id !== userId && sub.user_id !== "anonymous") {
    throw new Error("Unauthorized to modify this submission");
  }

  db.prepare("UPDATE contact_submissions SET status = ? WHERE id = ?").run(
    status,
    submissionId
  );

  return true;
}

/**
 * Deletes a submission from the inbox.
 */
export function deleteContactSubmission(submissionId: string, userId: string): boolean {
  const db = getDatabase();

  const sub = db
    .prepare("SELECT user_id FROM contact_submissions WHERE id = ?")
    .get(submissionId) as { user_id: string } | undefined;

  if (!sub) return false;

  if (sub.user_id !== userId && sub.user_id !== "anonymous") {
    throw new Error("Unauthorized to delete this submission");
  }

  db.prepare("DELETE FROM contact_submissions WHERE id = ?").run(submissionId);
  return true;
}
