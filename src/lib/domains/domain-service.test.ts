import { describe, it, expect, vi } from "vitest";
import { DomainService } from "./domain-service";
import dns from "node:dns/promises";

describe("Part 12 — DomainService & DNS Verification", () => {
  describe("validateDomain", () => {
    it("accepts valid standard domain names", () => {
      const domains = [
        "alexsmith.dev",
        "portfolio.johndoe.com",
        "sarah-chen.me",
        "engineering.startup.co.uk",
        "my-studio.design",
      ];
      for (const d of domains) {
        const result = DomainService.validateDomain(d);
        expect(result.isValid).toBe(true);
        expect(result.normalizedDomain).toBe(d);
        expect(result.error).toBeUndefined();
      }
    });

    it("rejects domains with protocol schemes (http:// or https://)", () => {
      const withHttp = DomainService.validateDomain("http://alexsmith.dev");
      expect(withHttp.isValid).toBe(false);
      expect(withHttp.error).toContain("http:// or https://");

      const withHttps = DomainService.validateDomain("https://alexsmith.dev");
      expect(withHttps.isValid).toBe(false);
      expect(withHttps.error).toContain("http:// or https://");
    });

    it("rejects domains containing paths, query parameters, or hash fragments", () => {
      expect(DomainService.validateDomain("alexsmith.dev/home").isValid).toBe(false);
      expect(DomainService.validateDomain("alexsmith.dev?ref=google").isValid).toBe(false);
      expect(DomainService.validateDomain("alexsmith.dev#section").isValid).toBe(false);
    });

    it("rejects domains with port numbers or credentials", () => {
      expect(DomainService.validateDomain("alexsmith.dev:3000").isValid).toBe(false);
      expect(DomainService.validateDomain("user:pass@alexsmith.dev").isValid).toBe(false);
    });

    it("rejects single label hostnames without TLDs", () => {
      expect(DomainService.validateDomain("localhost").isValid).toBe(false);
      expect(DomainService.validateDomain("mysite").isValid).toBe(false);
    });

    it("rejects wildcard domains", () => {
      expect(DomainService.validateDomain("*.alexsmith.dev").isValid).toBe(false);
    });

    it("rejects IP addresses directly", () => {
      expect(DomainService.validateDomain("192.168.1.1").isValid).toBe(false);
      expect(DomainService.validateDomain("127.0.0.1").isValid).toBe(false);
    });

    it("rejects prohibited platform domains", () => {
      expect(DomainService.validateDomain("portfolify.com").isValid).toBe(false);
      expect(DomainService.validateDomain("portfolify.dev").isValid).toBe(false);
      expect(DomainService.validateDomain("vercel.app").isValid).toBe(false);
    });

    it("strips trailing dots if provided", () => {
      const result = DomainService.validateDomain("alexsmith.dev.");
      expect(result.isValid).toBe(true);
      expect(result.normalizedDomain).toBe("alexsmith.dev");
    });
  });

  describe("generateVerificationChallenge & initializeDomainConfig", () => {
    it("generates a cryptographically strong token prefixed with portfolify-verify-", () => {
      const { token, dnsRecords } = DomainService.generateVerificationChallenge("alexsmith.dev");
      expect(token).toMatch(/^portfolify-verify-[a-f0-9]{32}$/);
      expect(dnsRecords.verificationRecord.type).toBe("TXT");
      expect(dnsRecords.verificationRecord.name).toBe("_portfolify-challenge.alexsmith.dev");
      expect(dnsRecords.verificationRecord.value).toBe(token);
      expect(dnsRecords.cnameRecord.type).toBe("CNAME");
      expect(dnsRecords.cnameRecord.name).toBe("alexsmith.dev");
    });

    it("initializes complete CustomDomainConfig structure in pending_dns status", () => {
      const config = DomainService.initializeDomainConfig("jane-doe.me");
      expect(config.domain).toBe("jane-doe.me");
      expect(config.status).toBe("pending_dns");
      expect(config.verificationToken).toMatch(/^portfolify-verify-[a-f0-9]{32}$/);
      expect(config.verifiedAt).toBeNull();
      expect(config.dnsRecords?.verificationRecord.name).toBe("_portfolify-challenge.jane-doe.me");
    });
  });

  describe("verifyDomainDns", () => {
    it("returns active status when mock test token is provided", async () => {
      const result = await DomainService.verifyDomainDns("test.dev", "mock-valid-challenge-123");
      expect(result.success).toBe(true);
      expect(result.status).toBe("active");
      expect(result.verified).toBe(true);
      expect(result.verifiedAt).toBeDefined();
    });

    it("returns failed status when verification token is missing or empty", async () => {
      const result = await DomainService.verifyDomainDns("test.dev", "");
      expect(result.success).toBe(false);
      expect(result.status).toBe("failed");
      expect(result.verified).toBe(false);
    });

    it("successfully verifies when live DNS returns the expected TXT record", async () => {
      const domain = "verified-site.org";
      const expectedToken = "portfolify-verify-correct-token-999";

      // Mock dns.resolveTxt to return matching record
      const resolveTxtSpy = vi.spyOn(dns, "resolveTxt").mockImplementation(async (host) => {
        if (host === `_portfolify-challenge.${domain}`) {
          return [[expectedToken]];
        }
        return [];
      });

      const result = await DomainService.verifyDomainDns(domain, expectedToken);
      expect(result.success).toBe(true);
      expect(result.status).toBe("active");
      expect(result.verified).toBe(true);

      resolveTxtSpy.mockRestore();
    });

    it("fails with informative error when TXT records exist but do not match token", async () => {
      const domain = "mismatched-site.org";
      const expectedToken = "portfolify-verify-correct-token-999";

      const resolveTxtSpy = vi.spyOn(dns, "resolveTxt").mockImplementation(async () => {
        return [["v=spf1 include:_spf.google.com ~all"]];
      });

      const result = await DomainService.verifyDomainDns(domain, expectedToken);
      expect(result.success).toBe(false);
      expect(result.status).toBe("failed");
      expect(result.verified).toBe(false);
      expect(result.error).toContain("none matched the expected verification token");

      resolveTxtSpy.mockRestore();
    });

    it("reports pending_dns when no TXT records exist or ENOTFOUND is returned", async () => {
      const domain = "not-configured.org";
      const expectedToken = "portfolify-verify-123456";

      const resolveTxtSpy = vi.spyOn(dns, "resolveTxt").mockRejectedValue(new Error("queryTxt ENOTFOUND"));

      const result = await DomainService.verifyDomainDns(domain, expectedToken);
      expect(result.success).toBe(false);
      expect(result.status).toBe("pending_dns");
      expect(result.verified).toBe(false);
      expect(result.error).toContain("No TXT records found");

      resolveTxtSpy.mockRestore();
    });
  });
});
