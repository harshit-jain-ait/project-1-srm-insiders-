# Portfolify — Part 9: Website URL Import & Exactly Two AI-Inspired Templates (Signature and Reimagined)

## 1. Architectural Overview

Part 9 introduces a genuine website URL import and design-inspiration workflow to Portfolify. Rather than cloning third-party markup or assets, Portfolify securely retrieves authorized public web documents, extracts high-level design characteristics (color palette, typography mood, layout density, section hierarchy), and synthesizes **EXACTLY TWO** distinct, accessible portfolio design directions:

1. **Signature**: Faithful visual harmony echoing the source site's identity.
2. **Reimagined**: A bold editorial reinterpretation featuring an asymmetrical layout and magazine-inspired typography.

Both directions integrate directly with the canonical portfolio schema (`src/lib/schema/portfolio.ts`), the central template registry (`src/templates/registry.ts`), the visual Studio Editor (`/editor`), and the durable SQLite persistence tier.

---

## 2. URL Input & Strict SSRF Defense

Website retrieval is executed server-side under strict network and resource constraints to prevent Server-Side Request Forgery (SSRF) and resource exhaustion attacks.

### Security Defenses (`src/lib/url-import/url-security.ts`)
1. **Protocol Restrictions**: Only `http:` and `https:` schemes are permitted. Dangerous pseudo-protocols (`file:`, `javascript:`, `data:`, `ftp:`) are rejected immediately.
2. **Allowed Ports**: Restricted strictly to standard web ports `80` and `443`. Requests targeting non-standard ports (e.g. 22, 3000, 5432, 6379, 8080) are blocked with `SSRF_BLOCKED`.
3. **Internal Hostname Blacklist**: Explicitly blocks `localhost`, `*.localhost`, `*.local`, `*.internal`, `*.lan`, `*.corp`, `metadata.google.internal`, and `instance-data`.
4. **All-Address DNS Verification**: Before connecting, the hostname is resolved via `node:dns/promises` (`dns.lookup(hostname, { all: true })`). If **any** resolved IPv4 or IPv6 address falls within a forbidden CIDR block, the request is rejected with `SSRF_BLOCKED`.
5. **Forbidden IP Address Ranges**:
   - `0.0.0.0/8` (Current network)
   - `10.0.0.0/8` (Private network RFC 1918)
   - `100.64.0.0/10` (Shared address space / CGNAT RFC 6598)
   - `127.0.0.0/8` (Loopback RFC 1122)
   - `169.254.0.0/16` (Link-local RFC 3927, including AWS/GCP/Azure metadata `169.254.169.254`)
   - `172.16.0.0/12` (Private network RFC 1918: 172.16.0.0–172.31.255.255)
   - `192.0.0.0/24`, `192.0.2.0/24`, `192.88.99.0/24`, `198.18.0.0/15`, `198.51.100.0/24`, `203.0.113.0/24`
   - `192.168.0.0/16` (Private network RFC 1918)
   - `224.0.0.0/4` (Multicast)
   - `240.0.0.0/4` (Reserved)
   - `255.255.255.255` (Broadcast)
   - IPv6: `::1` (Loopback), `::` (Unspecified), `fc00::/7` (Unique local), `fe80::/10` (Link-local), `ff00::/8` (Multicast), and IPv4-mapped IPv6 `::ffff:0:0/96`.

### Safe Fetch Execution (`src/lib/url-import/fetch-service.ts`)
- **Redirect Hop Revalidation**: Uses `redirect: "manual"` to inspect and re-validate every redirect target URL (protocol, port, DNS resolution, and IP range). Max redirect limit is 3.
- **Payload Size Threshold**: Streamed reading with a strict 512 KB (524,288 bytes) limit to prevent decompression bombs. Exceeding requests return `RESPONSE_TOO_LARGE`.
- **Request Timeout**: 10,000 ms using `AbortController`. Timed-out requests return `CONNECTION_TIMEOUT`.
- **Content-Type Filter**: Accept only `text/html`, `application/xhtml+xml`, and `text/plain`. Binaries and executables return `UNSUPPORTED_CONTENT_TYPE`.
- **Credential Stripping**: No internal authorization headers, cookies, or secrets are ever forwarded.

---

## 3. Design & Content Extraction (`src/lib/url-import/design-extractor.ts`)

Extracts design traits from public HTML without executing untrusted client scripts:
- **Metadata**: `<title>`, `<meta name="description">`, Open Graph tags (`og:title`, `og:description`).
- **Color Extraction & Safety**: Scans `<meta name="theme-color">` and CSS hex values. Enforces Portfolify's **Zero Purple / Violet Gradient Rule** (hues between 260°–310° are mapped to neutral `#18181b` or brand `#356ae6`).
- **Typography**: Detects serif, sans, or mono font families and assigns a typographic mood (`editorial`, `technical`, `modern-sans`, `minimal`).
- **Layout & Density**: Detects box-shadows, borders, density markers (`compact`, `balanced`, `spacious`), and card styles (`bordered`, `flat`, `elevated`, `glass`).
- **Section Hierarchy**: Detects publicly available sections (`profile`, `projects`, `experience`, `skills`, `education`, `contact`).

---

## 4. Exactly Two Design Directions: Signature & Reimagined

Per product requirements, every successful generation produces **EXACTLY TWO** primary options:

| Property | Direction 1: Signature | Direction 2: Reimagined |
| :--- | :--- | :--- |
| **Name** | `Signature` | `Reimagined` |
| **Base Template** | `signature` | `reimagined` |
| **Tagline** | Faithful visual harmony echoing the source site's identity | Bold editorial reinterpretation with elevated composition |
| **Composition** | Balanced structural grid matching original density rhythm | Asymmetrical split hero with floating status badge |
| **Typography** | Matches detected font family & mood | Contrasting editorial typographic scale |
| **Card Style** | Framed case study cards matching source treatment | Magazine-inspired anthology showcase with expansive whitespace |

### Distinctness Verification
`verifyAndEnforceDistinctness()` ensures the two directions differ meaningfully across:
- `fontFamily` (`sans` vs `serif` vs `mono`)
- `layoutDensity` (`compact` vs `spacious`)
- `cardStyle` (`bordered` vs `elevated` vs `flat`)
- `headerLayout` (`split` vs `editorial`)

---

## 5. Template Engine & Editor Integration

1. **Registered Templates**:
   - `signature` (`SignatureTemplate` in `src/templates/signature/index.tsx`)
   - `reimagined` (`ReimaginedTemplate` in `src/templates/reimagined/index.tsx`)
   - Both registered in `src/templates/registry.ts` and `TemplateIdSchema` in `src/lib/schema/portfolio.ts`.
2. **Canonical Schema Integration**:
   - `AppearanceSettingsSchema` now supports `designTokens: DesignTokensSchema`.
   - `designTokens` stores `accentHex`, `backgroundColor`, `surfaceColor`, `textColor`, `fontFamily`, `layoutDensity`, and `cardStyle`.
3. **Studio Editor Integration**:
   - Dedicated "Import URL" action in `EditorToolbar`.
   - `UrlImportModal` component allows importing design inspiration directly into an active portfolio session.
   - Live preview synchronizes instantly upon selecting a direction.
   - User content (profile, projects, skills, experience) is preserved 100%.

---

## 6. Endpoints

- `POST /api/ai/url-analyze`
  - Input: `{ url: string, confirmPermission: boolean }`
  - Output: `{ success: true, data: WebsiteDesignAnalysis }`
- `POST /api/ai/generate-directions`
  - Input: `{ analysis: WebsiteDesignAnalysis, confirmPermission: boolean, existingPortfolio?: Partial<PortfolioData> }`
  - Output: `{ success: true, data: { signature: DesignDirection, reimagined: DesignDirection, extractedDraft } }`

---

## 7. Verification Results

- **TypeScript Compilation**: `npx tsc --noEmit` passed with 0 errors.
- **ESLint**: `npm run lint` passed with 0 errors and 0 warnings.
- **Automated Tests**: `npm test` — **152 passed out of 152 tests** across 15 test suites.
- **Production Build**: `npm run build` compiled all 14 routes cleanly.
