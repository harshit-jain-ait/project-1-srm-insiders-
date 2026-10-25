import dns from "node:dns/promises";
import net from "node:net";
import { UrlAnalysisErrorCode } from "./types";

export interface SecurityCheckResult {
  isSafe: boolean;
  normalizedUrl?: URL;
  resolvedIps?: string[];
  errorCode?: UrlAnalysisErrorCode;
  errorMessage?: string;
}

/**
 * Checks whether an IPv4 address string falls into private, loopback, link-local,
 * or cloud metadata IP ranges.
 */
export function isForbiddenIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IP treated as unsafe
  }

  const [a, b, c, d] = parts;
  const num = ((a << 24) >>> 0) + (b << 16) + (c << 8) + d;

  // Helper for CIDR range check: ipNum & mask === networkNum & mask
  const inCidr = (netA: number, netB: number, netC: number, netD: number, prefix: number) => {
    const netNum = ((netA << 24) >>> 0) + (netB << 16) + (netC << 8) + netD;
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    return (num & mask) === (netNum & mask);
  };

  // 0.0.0.0/8 (Current network)
  if (inCidr(0, 0, 0, 0, 8)) return true;
  // 10.0.0.0/8 (Private RFC 1918)
  if (inCidr(10, 0, 0, 0, 8)) return true;
  // 100.64.0.0/10 (CGNAT RFC 6598)
  if (inCidr(100, 64, 0, 0, 10)) return true;
  // 127.0.0.0/8 (Loopback RFC 1122)
  if (inCidr(127, 0, 0, 0, 8)) return true;
  // 169.254.0.0/16 (Link-local RFC 3927, includes AWS/GCP 169.254.169.254)
  if (inCidr(169, 254, 0, 0, 16)) return true;
  // 172.16.0.0/12 (Private RFC 1918: 172.16.0.0 - 172.31.255.255)
  if (inCidr(172, 16, 0, 0, 12)) return true;
  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (inCidr(192, 0, 0, 0, 24)) return true;
  // 192.0.2.0/24 (TEST-NET-1)
  if (inCidr(192, 0, 2, 0, 24)) return true;
  // 192.88.99.0/24 (6to4 Relay)
  if (inCidr(192, 88, 99, 0, 24)) return true;
  // 192.168.0.0/16 (Private RFC 1918)
  if (inCidr(192, 168, 0, 0, 16)) return true;
  // 198.18.0.0/15 (Network benchmark)
  if (inCidr(198, 18, 0, 0, 15)) return true;
  // 198.51.100.0/24 (TEST-NET-2)
  if (inCidr(198, 51, 100, 0, 24)) return true;
  // 203.0.113.0/24 (TEST-NET-3)
  if (inCidr(203, 0, 113, 0, 24)) return true;
  // 224.0.0.0/4 (Multicast)
  if (inCidr(224, 0, 0, 0, 4)) return true;
  // 240.0.0.0/4 (Reserved / Future Use)
  if (inCidr(240, 0, 0, 0, 4)) return true;
  // 255.255.255.255 (Broadcast)
  if (a === 255 && b === 255 && c === 255 && d === 255) return true;

  return false;
}

/**
 * Checks whether an IPv6 address string falls into loopback, unique-local,
 * link-local, or IPv4-mapped forbidden ranges.
 */
export function isForbiddenIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  // ::1 (Loopback)
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
  // :: (Unspecified)
  if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") return true;

  // Check for IPv4-mapped IPv6 address (::ffff:x.x.x.x)
  if (normalized.startsWith("::ffff:") || normalized.startsWith("0:0:0:0:0:ffff:")) {
    const mappedIpv4 = normalized.split(":").pop();
    if (mappedIpv4 && net.isIPv4(mappedIpv4)) {
      return isForbiddenIpv4(mappedIpv4);
    }
    return true;
  }

  // fc00::/7 (Unique Local Address)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  // fe80::/10 (Link-Local Unicast)
  if (
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true;
  }

  // ff00::/8 (Multicast)
  if (normalized.startsWith("ff")) return true;

  return false;
}

/**
 * Validates that an IP address (v4 or v6) is safe for external public requests.
 */
export function isIpSafe(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) {
    return !isForbiddenIpv4(ip);
  }
  if (version === 6) {
    return !isForbiddenIpv6(ip);
  }
  return false; // Unknown format
}

/**
 * Known internal or cloud-metadata hostnames.
 */
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "instance-data",
  "169.254.169.254",
]);

/**
 * Checks whether a hostname is inherently restricted or private.
 */
export function isHostnameForbidden(hostname: string): boolean {
  const lower = hostname.toLowerCase().trim();

  if (BLOCKED_HOSTNAMES.has(lower)) return true;

  // Hostname suffixes that target internal domains
  if (
    lower.endsWith(".localhost") ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower.endsWith(".lan") ||
    lower.endsWith(".corp") ||
    lower.endsWith(".home")
  ) {
    return true;
  }

  return false;
}

/**
 * Comprehensive SSRF and URL validation:
 * 1. Checks protocol (http/https only)
 * 2. Checks allowed port (80, 443, or empty default)
 * 3. Checks hostname against internal blacklist
 * 4. Resolves hostname via DNS and checks EVERY IP against private/metadata CIDR blocks.
 */
export async function validateAndResolveUrl(rawUrl: string): Promise<SecurityCheckResult> {
  let urlStr = rawUrl.trim();
  // Only prepend https:// if no explicit URI scheme is specified
  const hasExplicitScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlStr);
  if (!hasExplicitScheme) {
    urlStr = `https://${urlStr}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return {
      isSafe: false,
      errorCode: "INVALID_URL",
      errorMessage: "The provided URL is malformed or invalid.",
    };
  }

  // 1. Protocol validation
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isSafe: false,
      errorCode: "UNSUPPORTED_PROTOCOL",
      errorMessage: `Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`,
    };
  }

  // 2. Port validation: restrict to standard web ports only
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    return {
      isSafe: false,
      errorCode: "SSRF_BLOCKED",
      errorMessage: `Port ${parsed.port} is not permitted. Only standard web ports (80, 443) are supported.`,
    };
  }

  const hostname = parsed.hostname;

  // 3. Hostname blacklist check
  if (isHostnameForbidden(hostname)) {
    return {
      isSafe: false,
      errorCode: "SSRF_BLOCKED",
      errorMessage: `The host "${hostname}" is an internal or restricted destination.`,
    };
  }

  // 4. If hostname is already a raw IP, test it directly
  if (net.isIP(hostname)) {
    if (!isIpSafe(hostname)) {
      return {
        isSafe: false,
        errorCode: "SSRF_BLOCKED",
        errorMessage: `Access to private or loopback IP address "${hostname}" is strictly blocked.`,
      };
    }
    return {
      isSafe: true,
      normalizedUrl: parsed,
      resolvedIps: [hostname],
    };
  }

  // 5. DNS Resolution & All-IP validation
  try {
    const lookupResults = await dns.lookup(hostname, { all: true });

    if (!lookupResults || lookupResults.length === 0) {
      return {
        isSafe: false,
        errorCode: "DNS_RESOLUTION_FAILED",
        errorMessage: `Could not resolve hostname "${hostname}". Please verify the domain.`,
      };
    }

    const resolvedIps = lookupResults.map((r) => r.address);

    for (const ip of resolvedIps) {
      if (!isIpSafe(ip)) {
        return {
          isSafe: false,
          errorCode: "SSRF_BLOCKED",
          errorMessage: `Hostname "${hostname}" resolves to restricted IP "${ip}". Access is blocked for security.`,
        };
      }
    }

    return {
      isSafe: true,
      normalizedUrl: parsed,
      resolvedIps,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "DNS resolution failure";
    return {
      isSafe: false,
      errorCode: "DNS_RESOLUTION_FAILED",
      errorMessage: `DNS resolution failed for "${hostname}": ${message}`,
    };
  }
}
