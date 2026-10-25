import { describe, it, expect, beforeEach } from "vitest";
import { getDatabase, runMigrations } from "@/lib/db/database";
import {
  submitContactMessage,
  listContactSubmissions,
  updateSubmissionStatus,
  deleteContactSubmission,
} from "./contact-service";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { createEmptyPortfolio } from "@/lib/schema/portfolio";

describe("Part 15 — Secure Visitor Contact Form & Inbox Service", () => {
  let testPortfolioId: string;
  const ownerUserId = "usr-contact-owner-1";

  beforeEach(async () => {
    const db = getDatabase();
    runMigrations(db);

    testPortfolioId = `contact_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const testSlug = `contact-slug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Create a published portfolio with contact enabled
    const empty = createEmptyPortfolio({
      id: testPortfolioId,
      title: "Liam Chen | Creative Technologist",
      slug: testSlug,
      published: true,
      profile: {
        fullName: "Liam Chen",
        headline: "Creative Technologist",
        bio: "Interactive digital experiences.",
        email: "liam@example.com",
        location: "San Francisco, CA",
        phone: "",
        avatarUrl: "",
        statusBadge: "",
      },
      contactConfig: {
        enabled: true,
        title: "Contact Liam",
        description: "Send a note about collaborations or projects.",
        recipientEmail: "liam@example.com",
        requireSubject: true,
        showConsent: true,
      },
    });

    await portfolioRepository.save(empty);
    db.prepare("UPDATE portfolios SET user_id = ? WHERE id = ?").run(ownerUserId, testPortfolioId);
  });

  describe("Visitor Message Validation & Spam Defense", () => {
    it("successfully validates, persists, and stores genuine visitor messages", async () => {
      const result = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Sarah Miller",
        email: "sarah.m@company.org",
        subject: "Freelance Project Inquiry",
        message: "Hi Liam, I would love to discuss a potential UI engineering project for our new product.",
        ip: "203.0.113.19",
      });

      expect(result.success).toBe(true);
      expect(result.submissionId).toMatch(/^sub_/);
      expect(result.notification).toBeDefined();

      // Retrieve submission in owner inbox
      const inbox = listContactSubmissions(testPortfolioId, ownerUserId);
      expect(inbox).toHaveLength(1);
      expect(inbox[0].id).toBe(result.submissionId);
      expect(inbox[0].name).toBe("Sarah Miller");
      expect(inbox[0].email).toBe("sarah.m@company.org");
      expect(inbox[0].subject).toBe("Freelance Project Inquiry");
      expect(inbox[0].status).toBe("unread");
      // Raw IP must NOT be stored
      expect(inbox[0].ipHash).toHaveLength(24);
    });

    it("silently rejects spam submissions that populate the honeypot field", async () => {
      const result = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Bot Spammer",
        email: "spammer@botnet.xyz",
        message: "Buy cheap backlinks now at our website!",
        honeypot: "automated-crawler-filled-this",
        ip: "203.0.113.88",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("spam filters");

      // Spammer must not be in inbox
      const inbox = listContactSubmissions(testPortfolioId, ownerUserId);
      expect(inbox).toHaveLength(0);
    });

    it("validates input lengths and email format strictly", async () => {
      // Invalid email
      const invalidEmail = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Test User",
        email: "not-an-email-address",
        message: "Hello world!",
      });
      expect(invalidEmail.success).toBe(false);
      expect(invalidEmail.error).toContain("valid email");

      // Message too short (< 5 chars)
      const shortMsg = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Test User",
        email: "user@example.com",
        message: "Hi",
      });
      expect(shortMsg.success).toBe(false);
      expect(shortMsg.error).toContain("between 5 and 3,000 characters");

      // Empty name
      const emptyName = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "   ",
        email: "user@example.com",
        message: "Valid message content here.",
      });
      expect(emptyName.success).toBe(false);
      expect(emptyName.error).toContain("Name must be");
    });

    it("rejects messages when contact form is explicitly disabled by owner", async () => {
      const disabledData = createEmptyPortfolio({
        id: testPortfolioId,
        title: "Liam Chen",
        slug: `disabled-slug-${Date.now()}`,
        published: true,
        contactConfig: {
          enabled: false,
          title: "Contact",
          description: "Closed",
          recipientEmail: "",
          requireSubject: false,
          showConsent: false,
        },
      });

      await portfolioRepository.save(disabledData);

      const result = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Alice",
        email: "alice@example.com",
        message: "Are you available for consulting?",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("disabled");
    });

    it("rejects messages targeting unpublished portfolios", async () => {
      await portfolioRepository.unpublish(testPortfolioId);

      const result = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Alice",
        email: "alice@example.com",
        message: "Hello from unpublished portfolio test.",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("draft mode");
    });

    it("enforces rate limits (maximum 5 submissions per 10 minutes per IP)", async () => {
      const fixedIp = `198.51.100.${Math.floor(Math.random() * 200 + 10)}`;

      // Submit 5 valid messages
      for (let i = 0; i < 5; i++) {
        const res = await submitContactMessage({
          portfolioId: testPortfolioId,
          name: `Visitor ${i}`,
          email: `visitor${i}@example.com`,
          message: `Valid message iteration number ${i}.`,
          ip: fixedIp,
        });
        expect(res.success).toBe(true);
      }

      // 6th message from same IP must be rate limited
      const rateLimited = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Visitor 6",
        email: "visitor6@example.com",
        message: "This message should be rejected due to rate limits.",
        ip: fixedIp,
      });

      expect(rateLimited.success).toBe(false);
      expect(rateLimited.error).toContain("Too many messages");
    });
  });

  describe("Owner Inbox Authorization & Operations", () => {
    it("protects inbox from unauthorized users", async () => {
      // Create a submission
      await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Confidential Contact",
        email: "client@stealth.com",
        message: "We have an offer for you.",
      });

      // Legitimate owner can list
      const ownerInbox = listContactSubmissions(testPortfolioId, ownerUserId);
      expect(ownerInbox).toHaveLength(1);

      // Unauthorized user must throw
      expect(() => {
        listContactSubmissions(testPortfolioId, "unauthorized-intruder-id");
      }).toThrow("Unauthorized access to contact submissions");
    });

    it("allows updating submission status (mark read, archive) and deleting messages", async () => {
      const sub = await submitContactMessage({
        portfolioId: testPortfolioId,
        name: "Hiring Manager",
        email: "hiring@techcorp.com",
        subject: "Full-Time Position",
        message: "We came across your portfolio and would love to chat.",
      });

      const submissionId = sub.submissionId!;

      // Mark as read
      const readUpdated = updateSubmissionStatus(submissionId, ownerUserId, "read");
      expect(readUpdated).toBe(true);

      const readMessages = listContactSubmissions(testPortfolioId, ownerUserId, "read");
      expect(readMessages).toHaveLength(1);
      expect(readMessages[0].status).toBe("read");

      // Mark as archived
      updateSubmissionStatus(submissionId, ownerUserId, "archived");
      const archived = listContactSubmissions(testPortfolioId, ownerUserId, "archived");
      expect(archived).toHaveLength(1);
      expect(archived[0].status).toBe("archived");

      // Delete message
      const deleted = deleteContactSubmission(submissionId, ownerUserId);
      expect(deleted).toBe(true);

      const finalInbox = listContactSubmissions(testPortfolioId, ownerUserId);
      expect(finalInbox).toHaveLength(0);
    });
  });
});
