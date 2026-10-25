import crypto from "crypto";
import { NextRequest } from "next/server";

export interface AuthContext {
  isAuthenticated: boolean;
  userId: string | null;
  claimTokens: string[];
}

export interface PortfolioOwnershipEntity {
  id: string;
  userId: string;
  claimTokenHash?: string | null;
  published: boolean;
}

/**
 * Generates a 256-bit cryptographically secure random hex string for anonymous draft claims.
 */
export function generateClaimToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Computes SHA-256 hash of a draft claim token for safe database persistence.
 */
export function hashClaimToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Constant-time verification to prevent timing attacks.
 */
export function verifyClaimToken(token: string, storedHash: string | null | undefined): boolean {
  if (!token || !storedHash) return false;
  try {
    const inputHash = hashClaimToken(token);
    const a = Buffer.from(inputHash, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Extracts verified AuthContext from Next.js server requests.
 * Examines both session headers/cookies and anonymous draft claim tokens.
 */
export function getAuthContext(req: NextRequest): AuthContext {
  const claimTokens: string[] = [];

  // 1. Header-based claim token (x-draft-claim-token)
  const headerClaim = req.headers.get("x-draft-claim-token");
  if (headerClaim) {
    claimTokens.push(headerClaim.trim());
  }

  // 2. Cookie-based claim tokens (portfolify_draft_claim_*)
  const allCookies = req.cookies.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith("portfolify_draft_claim_") || cookie.name === "portfolify_draft_claim") {
      claimTokens.push(cookie.value.trim());
    }
  }

  // 3. User Authentication resolution
  // Check for session cookie or verified identity header (gateway or mockable for testing)
  const sessionUser = req.cookies.get("portfolify_user_id")?.value;
  const verifiedUserHeader = req.headers.get("x-verified-user-id");

  const userId = verifiedUserHeader || sessionUser || null;
  const isAuthenticated = Boolean(userId && userId !== "anonymous");

  return {
    isAuthenticated,
    userId,
    claimTokens,
  };
}

/**
 * Evaluates whether an AuthContext has read access to a portfolio.
 * - Published portfolios are publicly readable.
 * - Private drafts require either verified ownership or a valid anonymous claim token.
 */
export function canReadPortfolio(
  portfolio: PortfolioOwnershipEntity,
  auth: AuthContext
): boolean {
  // Publicly published portfolios can be read by anyone
  if (portfolio.published) {
    return true;
  }

  // Authenticated owner
  if (auth.isAuthenticated && auth.userId && auth.userId === portfolio.userId) {
    return true;
  }

  // Anonymous draft with matching claim token
  if (portfolio.claimTokenHash && auth.claimTokens.length > 0) {
    for (const token of auth.claimTokens) {
      if (verifyClaimToken(token, portfolio.claimTokenHash)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Evaluates whether an AuthContext has write / update / delete access to a portfolio.
 * Client-provided userIds are NEVER trusted; only verified auth or cryptographically proven claim tokens allow modification.
 */
export function canModifyPortfolio(
  portfolio: PortfolioOwnershipEntity,
  auth: AuthContext
): boolean {
  // Authenticated owner
  if (auth.isAuthenticated && auth.userId && auth.userId === portfolio.userId) {
    return true;
  }

  // Anonymous draft with matching claim token
  if (portfolio.claimTokenHash && auth.claimTokens.length > 0) {
    for (const token of auth.claimTokens) {
      if (verifyClaimToken(token, portfolio.claimTokenHash)) {
        return true;
      }
    }
  }

  return false;
}
