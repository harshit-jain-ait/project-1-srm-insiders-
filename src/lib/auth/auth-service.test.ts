import { describe, it, expect } from "vitest";
import {
  generateClaimToken,
  hashClaimToken,
  verifyClaimToken,
  canReadPortfolio,
  canModifyPortfolio,
  AuthContext,
  PortfolioOwnershipEntity,
} from "./auth-service";

describe("Authentication & Ownership Security Service", () => {
  describe("Cryptographic Claim Token Management", () => {
    it("generates a 256-bit (64 hex characters) claim token", () => {
      const token1 = generateClaimToken();
      const token2 = generateClaimToken();

      expect(token1).toHaveLength(64);
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);
    });

    it("hashes and verifies claim tokens with constant-time equality", () => {
      const rawToken = generateClaimToken();
      const hash = hashClaimToken(rawToken);

      expect(hash).toHaveLength(64);
      expect(verifyClaimToken(rawToken, hash)).toBe(true);
      expect(verifyClaimToken("wrong-token", hash)).toBe(false);
      expect(verifyClaimToken("", hash)).toBe(false);
      expect(verifyClaimToken(rawToken, null)).toBe(false);
    });
  });

  describe("Portfolio Read Authorization", () => {
    const publishedPortfolio: PortfolioOwnershipEntity = {
      id: "p-pub",
      userId: "user_owner",
      published: true,
      claimTokenHash: null,
    };

    const privateDraft: PortfolioOwnershipEntity = {
      id: "p-priv",
      userId: "user_owner",
      published: false,
      claimTokenHash: null,
    };

    const rawClaim = generateClaimToken();
    const anonymousDraft: PortfolioOwnershipEntity = {
      id: "p-anon",
      userId: "anonymous",
      published: false,
      claimTokenHash: hashClaimToken(rawClaim),
    };

    it("allows anyone to read published portfolios", () => {
      const anonymousAuth: AuthContext = {
        isAuthenticated: false,
        userId: null,
        claimTokens: [],
      };
      expect(canReadPortfolio(publishedPortfolio, anonymousAuth)).toBe(true);
    });

    it("prohibits unauthenticated requests from reading private drafts", () => {
      const strangerAuth: AuthContext = {
        isAuthenticated: false,
        userId: null,
        claimTokens: [],
      };
      expect(canReadPortfolio(privateDraft, strangerAuth)).toBe(false);
    });

    it("prohibits unrelated authenticated users from reading another user's private draft", () => {
      const otherUserAuth: AuthContext = {
        isAuthenticated: true,
        userId: "user_intruder",
        claimTokens: [],
      };
      expect(canReadPortfolio(privateDraft, otherUserAuth)).toBe(false);
    });

    it("allows authenticated owner to read their own private draft", () => {
      const ownerAuth: AuthContext = {
        isAuthenticated: true,
        userId: "user_owner",
        claimTokens: [],
      };
      expect(canReadPortfolio(privateDraft, ownerAuth)).toBe(true);
    });

    it("allows anonymous draft creator with matching claim token to read their draft", () => {
      const validClaimAuth: AuthContext = {
        isAuthenticated: false,
        userId: null,
        claimTokens: [rawClaim],
      };
      expect(canReadPortfolio(anonymousDraft, validClaimAuth)).toBe(true);
    });

    it("rejects anonymous draft reading if claim token is missing or invalid", () => {
      const invalidClaimAuth: AuthContext = {
        isAuthenticated: false,
        userId: null,
        claimTokens: ["invalid-claim-token"],
      };
      expect(canReadPortfolio(anonymousDraft, invalidClaimAuth)).toBe(false);
    });
  });

  describe("Portfolio Modification Authorization", () => {
    const rawClaim = generateClaimToken();
    const anonymousDraft: PortfolioOwnershipEntity = {
      id: "p-anon",
      userId: "anonymous",
      published: false,
      claimTokenHash: hashClaimToken(rawClaim),
    };

    const userPortfolio: PortfolioOwnershipEntity = {
      id: "p-user",
      userId: "verified_user_99",
      published: true,
      claimTokenHash: null,
    };

    it("allows authenticated owner to modify their portfolio", () => {
      const ownerAuth: AuthContext = {
        isAuthenticated: true,
        userId: "verified_user_99",
        claimTokens: [],
      };
      expect(canModifyPortfolio(userPortfolio, ownerAuth)).toBe(true);
    });

    it("strictly blocks unauthorized users from modifying another user's portfolio", () => {
      const intruderAuth: AuthContext = {
        isAuthenticated: true,
        userId: "hacker_42",
        claimTokens: [],
      };
      expect(canModifyPortfolio(userPortfolio, intruderAuth)).toBe(false);
    });

    it("allows anonymous draft creator with valid claim token to modify their draft", () => {
      const draftCreatorAuth: AuthContext = {
        isAuthenticated: false,
        userId: null,
        claimTokens: [rawClaim],
      };
      expect(canModifyPortfolio(anonymousDraft, draftCreatorAuth)).toBe(true);
    });

    it("blocks anonymous visitors without matching claim token from modifying draft", () => {
      const strangerAuth: AuthContext = {
        isAuthenticated: false,
        userId: null,
        claimTokens: [],
      };
      expect(canModifyPortfolio(anonymousDraft, strangerAuth)).toBe(false);
    });
  });
});
