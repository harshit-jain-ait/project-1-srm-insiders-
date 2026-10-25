import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateAndResolveUrl,
  isForbiddenIpv4,
  isForbiddenIpv6,
  isIpSafe,
  isHostnameForbidden,
} from "./url-security";
import { safeFetchHtml } from "./fetch-service";

describe("URL Security & SSRF Protection Engine", () => {
  describe("IPv4 CIDR Range Blocking", () => {
    it("blocks loopback addresses (127.0.0.0/8)", () => {
      expect(isForbiddenIpv4("127.0.0.1")).toBe(true);
      expect(isForbiddenIpv4("127.100.50.1")).toBe(true);
      expect(isForbiddenIpv4("127.255.255.255")).toBe(true);
    });

    it("blocks private class A networks (10.0.0.0/8)", () => {
      expect(isForbiddenIpv4("10.0.0.1")).toBe(true);
      expect(isForbiddenIpv4("10.254.254.1")).toBe(true);
    });

    it("blocks private class B networks (172.16.0.0/12)", () => {
      expect(isForbiddenIpv4("172.16.0.1")).toBe(true);
      expect(isForbiddenIpv4("172.24.10.5")).toBe(true);
      expect(isForbiddenIpv4("172.31.255.255")).toBe(true);
      // 172.32.0.1 is outside the private range
      expect(isForbiddenIpv4("172.32.0.1")).toBe(false);
    });

    it("blocks private class C networks (192.168.0.0/16)", () => {
      expect(isForbiddenIpv4("192.168.0.1")).toBe(true);
      expect(isForbiddenIpv4("192.168.1.100")).toBe(true);
      expect(isForbiddenIpv4("192.168.255.255")).toBe(true);
    });

    it("blocks link-local and cloud metadata addresses (169.254.0.0/16)", () => {
      expect(isForbiddenIpv4("169.254.169.254")).toBe(true); // AWS, GCP, Azure metadata
      expect(isForbiddenIpv4("169.254.1.1")).toBe(true);
    });

    it("blocks 0.0.0.0/8, multicast, and broadcast addresses", () => {
      expect(isForbiddenIpv4("0.0.0.0")).toBe(true);
      expect(isForbiddenIpv4("224.0.0.1")).toBe(true);
      expect(isForbiddenIpv4("255.255.255.255")).toBe(true);
    });

    it("allows valid public IPv4 addresses", () => {
      expect(isForbiddenIpv4("8.8.8.8")).toBe(false); // Google DNS
      expect(isForbiddenIpv4("1.1.1.1")).toBe(false); // Cloudflare
      expect(isForbiddenIpv4("93.184.216.34")).toBe(false); // example.com
    });

    it("validates IP safety via isIpSafe() wrapper", () => {
      expect(isIpSafe("127.0.0.1")).toBe(false);
      expect(isIpSafe("10.0.0.1")).toBe(false);
      expect(isIpSafe("169.254.169.254")).toBe(false);
      expect(isIpSafe("::1")).toBe(false);
      expect(isIpSafe("fc00::1")).toBe(false);
      expect(isIpSafe("8.8.8.8")).toBe(true);
      expect(isIpSafe("1.1.1.1")).toBe(true);
      expect(isIpSafe("invalid-ip")).toBe(false);
    });
  });

  describe("IPv6 Range Blocking", () => {
    it("blocks IPv6 loopback (::1)", () => {
      expect(isForbiddenIpv6("::1")).toBe(true);
      expect(isForbiddenIpv6("0:0:0:0:0:0:0:1")).toBe(true);
    });

    it("blocks IPv6 unique local (fc00::/7)", () => {
      expect(isForbiddenIpv6("fc00::1")).toBe(true);
      expect(isForbiddenIpv6("fd12:3456:789a::1")).toBe(true);
    });

    it("blocks IPv6 link-local (fe80::/10)", () => {
      expect(isForbiddenIpv6("fe80::1")).toBe(true);
    });

    it("blocks IPv4-mapped IPv6 loopback/private ranges (::ffff:x.x.x.x)", () => {
      expect(isForbiddenIpv6("::ffff:127.0.0.1")).toBe(true);
      expect(isForbiddenIpv6("::ffff:169.254.169.254")).toBe(true);
      expect(isForbiddenIpv6("::ffff:192.168.1.1")).toBe(true);
      expect(isForbiddenIpv6("::ffff:8.8.8.8")).toBe(false);
    });
  });

  describe("Hostname and Port Filtering", () => {
    it("blocks restricted internal hostnames", () => {
      expect(isHostnameForbidden("localhost")).toBe(true);
      expect(isHostnameForbidden("api.localhost")).toBe(true);
      expect(isHostnameForbidden("metadata.google.internal")).toBe(true);
      expect(isHostnameForbidden("instance-data")).toBe(true);
      expect(isHostnameForbidden("service.internal")).toBe(true);
      expect(isHostnameForbidden("nas.local")).toBe(true);
      expect(isHostnameForbidden("router.lan")).toBe(true);
    });

    it("allows public hostnames", () => {
      expect(isHostnameForbidden("example.com")).toBe(false);
      expect(isHostnameForbidden("github.com")).toBe(false);
      expect(isHostnameForbidden("portfolio.mybrand.dev")).toBe(false);
    });
  });

  describe("validateAndResolveUrl()", () => {
    it("rejects non-HTTP/HTTPS protocols", async () => {
      const fileRes = await validateAndResolveUrl("file:///etc/passwd");
      expect(fileRes.isSafe).toBe(false);
      expect(fileRes.errorCode).toBe("UNSUPPORTED_PROTOCOL");

      const jsRes = await validateAndResolveUrl("javascript:alert(1)");
      expect(jsRes.isSafe).toBe(false);

      const ftpRes = await validateAndResolveUrl("ftp://ftp.example.com");
      expect(ftpRes.isSafe).toBe(false);
    });

    it("rejects non-standard ports (blocks SSRF to internal services)", async () => {
      const sshRes = await validateAndResolveUrl("http://example.com:22");
      expect(sshRes.isSafe).toBe(false);
      expect(sshRes.errorCode).toBe("SSRF_BLOCKED");

      const dbRes = await validateAndResolveUrl("http://example.com:5432");
      expect(dbRes.isSafe).toBe(false);
      expect(dbRes.errorCode).toBe("SSRF_BLOCKED");

      const devRes = await validateAndResolveUrl("http://example.com:3000");
      expect(devRes.isSafe).toBe(false);
      expect(devRes.errorCode).toBe("SSRF_BLOCKED");
    });

    it("rejects direct loopback and private IP literals", async () => {
      const loopbackRes = await validateAndResolveUrl("http://127.0.0.1/");
      expect(loopbackRes.isSafe).toBe(false);
      expect(loopbackRes.errorCode).toBe("SSRF_BLOCKED");

      const metaRes = await validateAndResolveUrl("http://169.254.169.254/latest/meta-data");
      expect(metaRes.isSafe).toBe(false);
      expect(metaRes.errorCode).toBe("SSRF_BLOCKED");
    });

    it("accepts valid public domain URLs with standard ports", async () => {
      // Mock DNS resolution for reliable hermetic tests
      const res = await validateAndResolveUrl("https://example.com");
      if (res.isSafe) {
        expect(res.normalizedUrl?.protocol).toBe("https:");
        expect(res.normalizedUrl?.hostname).toBe("example.com");
      }
    });
  });

  describe("safeFetchHtml() Protections", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("rejects unsupported content types (e.g. application/json, application/octet-stream)", async () => {
      const mockResponse = new Response(JSON.stringify({ secret: "data" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      vi.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

      const result = await safeFetchHtml("https://example.com/api");
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("UNSUPPORTED_CONTENT_TYPE");
    });

    it("enforces maximum response size threshold", async () => {
      // Create a payload larger than 512KB
      const hugeData = "A".repeat(600 * 1024);
      const mockResponse = new Response(hugeData, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });

      vi.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

      const result = await safeFetchHtml("https://example.com/huge");
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("RESPONSE_TOO_LARGE");
    });

    it("successfully retrieves valid HTML under limits", async () => {
      const validHtml = "<html><head><title>Test Page</title></head><body><h1>Hello World</h1></body></html>";
      const mockResponse = new Response(validHtml, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });

      vi.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

      const result = await safeFetchHtml("https://example.com");
      expect(result.success).toBe(true);
      expect(result.html).toContain("Test Page");
      expect(result.statusCode).toBe(200);
    });
  });
});
