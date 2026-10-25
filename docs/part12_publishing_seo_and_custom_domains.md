# Portfolify — Part 12: Custom Domains, SEO, and Portfolio Publishing

## Architecture and System Overview

Portfolify Part 12 implements a production-minded publishing platform that transforms portfolio drafts into live, accessible, and indexable public sites. The architecture separates editable draft data from immutable published snapshots, enforces strict slug validation and reserved-route protections, renders dynamic SEO tags and social Open Graph cards, automates sitemap and robots discovery, and provides a server-verified custom-domain pipeline.

---

## 1. Public URL Formats

Portfolify supports two public URL routing formats:

1. **Default Platform Route:**
   ```
   https://<app-domain>/p/<slug>
   ```
   - Example: `https://portfolify.com/p/alex-morgan` (or `http://localhost:3000/p/alex-morgan` in local development).
   - Resolved dynamically in Next.js App Router via `src/app/p/[slug]/page.tsx`.

2. **Custom Domain Route:**
   ```
   https://<custom-domain>
   ```
   - Example: `https://alexmorgan.dev`.
   - Host-header routing inspected in `src/app/page.tsx` and middleware/reverse-proxy boundaries. When an incoming request arrives from a verified custom domain, Portfolify resolves the mapped portfolio directly at the root URL.

---

## 2. Server-Controlled Publishing State Model

The publishing lifecycle follows a strict server-controlled state machine:

```
 [ Draft ]
    │
    ▼ (validatePublishReadiness)
 [ Review & Pre-Publish Checklist ]
    │
    ├─► Valid: User confirms ──► [ Published Snapshot ] ──► Live at /p/[slug] or Custom Domain
    │                                  │
    │                                  ├─► User edits draft ──► Draft updated in content_json
    │                                  │                        (Live site stays on snapshot)
    │                                  ├─► "Update Live Site" ─► Atomic snapshot replacement
    │                                  │
    │                                  └─► "Unpublish" ────────► Status: unpublished
    │                                                           (Public access revoked, draft intact)
    │
    └─► Invalid: Returns 422 with actionable errors ──► Preserves draft
```

- **`draft` (`published: 0`):** Editable user content saved in `content_json`. Inaccessible to unauthenticated public visitors (returns HTTP 404).
- **`published` (`published: 1`):** Frozen, validated snapshot stored in `published_content_json`. Resolves through `/p/[slug]` and verified custom domains.
- **`unpublished` (`published: 0`):** Reverts public visibility without deleting user work. The draft remains fully intact and re-publishable at any time.

---

## 3. Draft vs. Published Version Snapshot Isolation

A critical security and user-experience principle in Portfolify is **snapshot isolation**:
- Standard autosave and manual save operations update the draft (`content_json` and `revision`).
- The public route (`/p/[slug]` and custom domain host resolver) queries `published_content_json`.
- Unfinished edits, experimental restyling, or draft revisions never leak to public visitors until the user explicitly reviews and clicks **"Update Live Site"** in the publishing dialog.
- Unpublishing immediately sets `published = 0`, cutting off public access, while preserving 100% of the draft data in SQLite.

---

## 4. Slug Rules & Security Protections

Slugs identify public portfolios and must satisfy strict RFC standards:
- **Format:** 3–48 characters of lowercase letters (`a-z`), digits (`0-9`), and single non-consecutive hyphens (`-`). No leading or trailing hyphens.
- **Impersonation Prevention:** System routes and high-value keywords are reserved in `RESERVED_SLUGS`:
  - `api`, `editor`, `templates`, `generate`, `p`, `admin`, `settings`, `dashboard`, `auth`, `login`, `register`, `sitemap`, `sitemap.xml`, `robots`, `robots.txt`, `favicon.ico`, `privacy`, `terms`, `help`, `pricing`.
- **Database Uniqueness:** Enforced via SQLite unique constraint on the `slug` column.
- **Real-Time Validation Endpoint:** `GET /api/portfolios/slug-check?slug=<candidate>&excludeId=<currentId>` provides instant feedback in the UI before form submission.

---

## 5. SEO Settings & Metadata Behavior

Portfolify generates dynamic, framework-native SEO metadata in `src/app/p/[slug]/page.tsx` via Next.js `generateMetadata`:

- **Title Tag:** Uses custom `seo.title` if provided, falling back to `<Full Name> — <Headline>` or `<Full Name> | Portfolify`.
- **Meta Description:** Uses custom `seo.description`, falling back to `profile.bio` or a clean default summary.
- **Canonical Alternates:** Derives canonical links from verified active custom domains (`https://<custom-domain>`) or trusted canonical app URLs (`https://<app-domain>/p/<slug>`). Untrusted forwarded host headers are never trusted blindly.
- **Open Graph & Twitter Cards:** Renders standard `og:title`, `og:description`, `og:url`, `og:type: "website"`, and `og:image`. Falls back to the user's avatar image if no dedicated share card is configured.
- **Robots Directives:** If `seo.noIndex` is enabled, Portfolify renders:
  ```html
  <meta name="robots" content="noindex, nofollow" />
  ```
  Draft and unpublished portfolios automatically return 404 Not Found with `noindex, nofollow` headers.

---

## 6. Sitemap & Robots.txt Discovery Policies

- **Sitemap (`/sitemap.xml`):**
  - Generated dynamically in `src/app/sitemap.ts`.
  - Includes core platform discovery routes (`/`, `/templates`, `/design-system`, `/generate`).
  - Queries `portfolioRepository.listAllPublished()`.
  - Automatically filters out portfolios with `noIndex: true` or `includeInSitemap: false`.
  - Uses absolute canonical URLs.
- **Robots (`/robots.txt`):**
  - Generated dynamically in `src/app/robots.ts`.
  - Allows search engines to index public platform pages and `/p/*`.
  - Disallows private administrative surfaces (`/api/*`, `/editor*`, `/*?*claimToken*`, `/import-resume*`).
  - References the canonical dynamic sitemap endpoint.

---

## 7. Custom Domain Architecture & DNS Verification

### Domain Normalization & Validation
- Standardizes hostnames to lowercase, strips trailing periods.
- Rejects protocol schemes (`http://`, `https://`), URL paths, query parameters, port numbers, and authentication credentials.
- Enforces RFC 1035 label constraints (1–63 chars per label, 253 chars total, letters/numbers/hyphens).
- Prohibits wildcards (`*.domain.com`), raw IP addresses (`127.0.0.1`), and platform-owned domains (`portfolify.com`, `vercel.app`).

### Cryptographic Verification Challenge
When a user connects a domain (e.g., `alexsmith.dev`):
1. Portfolify generates a cryptographically secure token using Node.js `crypto.randomBytes(16)`:
   ```
   portfolify-verify-3f8a1b2c4d5e6f7a8b9c0d1e2f3a4b5c
   ```
2. Portfolify provides precise DNS instructions:
   | Record Type | Host / Name | Target / Value |
   | :--- | :--- | :--- |
   | **TXT** | `_portfolify-challenge.alexsmith.dev` | `portfolify-verify-3f8a1b2c4d5e6f7a...` |
   | **CNAME** | `alexsmith.dev` | `cname.portfolify.com` |

### Live DNS Resolution
- When the user clicks **"Check DNS Records"**, the server queries `node:dns/promises` for TXT records at `_portfolify-challenge.<domain>`.
- **Honest Status Reporting:** If the TXT record matches, the status transitions to `active`. If records are missing or mismatched, the UI clearly displays `pending_dns` or `failed` with diagnostic guidance. Portfolify **never** simulates false success.

---

## 8. SSL / TLS & Hosting Infrastructure Integration

- **Managed Platform SSL:** In production hosting environments (e.g. Vercel, Cloudflare, AWS CloudFront), SSL certificates are provisioned automatically via Let's Encrypt / DigiCert once DNS CNAME points to the platform proxy.
- **Zero Insecure Manual Certificates:** Portfolify delegates TLS certificate management to the edge routing infrastructure, enforcing HTTPS on all custom domains.
- **Disconnection & Cleanup:** Calling `action: "remove"` safely purges domain mappings from the database, preventing orphaned routes.

---

## 9. Environment Variables

Configure the following variables in `.env.local` or production container environments:

```bash
# Canonical Platform URL (used for sitemap, canonical links, and social metadata)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Target CNAME for Custom Domains (provided to users during DNS configuration)
NEXT_PUBLIC_APP_CNAME="cname.portfolify.com"

# SQLite Database Storage Location
SQLITE_DB_PATH=".data/portfolify.db"

# Gemini AI Provider (Used in AI Assistant, Restyling, and URL Analysis)
GEMINI_API_KEY="<your-gemini-api-key>"
GEMINI_MODEL="gemini-3.5-flash-lite"
```

---

## 10. Operational Guidelines & Known Limitations

1. **DNS Propagation:** External DNS providers can take from a few minutes up to 48 hours to propagate TXT and CNAME changes depending on registrar TTL settings. Portfolify explicitly documents this in the custom domain panel.
2. **Search Engine Re-Indexing:** Search engine crawlers (Googlebot, Bingbot) crawl on their own schedule. Removing or unpublishing a portfolio revokes immediate HTTP access, but third-party search engine cache updates take time.
3. **Draft Safety:** Unpublishing does not delete any user data. All sections, projects, and custom styling remain stored and ready to be republished.
