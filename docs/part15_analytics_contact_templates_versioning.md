# Part 15: Analytics, Contact Forms, Premium Templates, and Version History

## 1. Overview & Architecture

Part 15 integrates four core operational and design pillars into Portfolify without breaking or replacing existing architecture:
1. **Portfolio Analytics**: Privacy-first, real-event visitor telemetry, daily-salted visitor hashing, and server-side aggregation.
2. **Secure Visitor Contact Forms**: Public message submission, anti-spam honeypot, sliding-window rate limiting, pluggable email delivery, and authorized owner inbox.
3. **Premium Templates & Advanced Visual Experiences**: Three distinct premium templates (`editorial-studio`, `creative-motion`, `product-engineer`) with modern motion components and strict plan gating.
4. **Portfolio Version History & Restoration**: Durable database snapshot engine, automated recovery checkpoints (`pre_restore`), and transactional restoration.

---

## 2. Feature A — Portfolio Analytics

### 2.1 Event Collection Pipeline
- **Endpoint**: `POST /api/analytics/collect`
- **Guards & Criteria**:
  - Portfolio must exist and be in published status (`status === "published"`).
  - Editor draft previews and unauthenticated preview traffic are strictly excluded.
  - Bounded payloads: normalized path (`/` or `/projects/[id]`), referrer URL, and screen resolution.
  - Rate limiting & deduplication: Identical `(portfolio_id, visitor_hash, page_path)` events within a 5-minute sliding window are silently discarded.

### 2.2 Privacy & Unique Visitor Methodology
- **No Raw IP Storage**: IP addresses and raw user-agent strings are never written to `portfolio_events`.
- **Daily Salted Hash**: A deterministic SHA-256 hash is computed as:
  ```ts
  hash = sha256(ip + userAgent + YYYY-MM-DD + process.env.ANALYTICS_SALT)
  ```
  This allows unique visitor estimation across 24-hour periods without tracking visitors across days or building permanent profiling databases.
- **Referrer Classification**:
  - Direct: empty referrer or internal domain match.
  - Search: Google, Bing, DuckDuckGo, Yahoo, Baidu, Ecosia.
  - Social: Twitter/X (`t.co`, `twitter.com`), LinkedIn, GitHub, Reddit, Instagram, Facebook, Bluesky.
  - External: All other valid HTTPS referrers (query strings stripped for privacy).
- **Device Classification**: Categorized into `desktop`, `mobile`, or `tablet` using standard viewport and user-agent patterns.

### 2.3 Aggregation & Dashboard
- **Endpoint**: `GET /api/portfolios/[id]/analytics?range=7d|30d|90d`
- **Owner-Only Authorization**: Requires authenticated session matching `portfolio.userId`.
- **Metrics Computed from Real Events**:
  - Total Page Views.
  - Unique Visitors (distinct visitor hashes).
  - Views Timeseries (date-grouped view counts).
  - Top Pages (ranked by total visits).
  - Referrer Breakdown (direct, search, social, external).
  - Device Category Breakdown (desktop, mobile, tablet).
- **Honest Empty State**: Zero dummy data or synthetic baseline curves. New or unviewed portfolios display an informative empty state.
- **Entitlement Retention**:
  - Free Plan: Capped at 7 days of historical analytics.
  - Pro Plan: Up to 365 days of historical analytics.

---

## 3. Feature B — Secure Visitor Contact Forms

### 3.1 Editor Configuration
- Portfolio owners configure contact settings under the **Contact** sidebar tab in the editor:
  - `enabled`: Toggle whether the public form renders on the live portfolio.
  - `title`: Customizable heading (defaults to "Get in Touch").
  - `description`: Introductory instructions.
  - `recipientEmail`: Verified owner email address (falls back to account email).
  - `requireSubject`: Toggle subject field requirement.
  - `showConsent`: Toggle data processing consent checkbox.

### 3.2 Abuse Prevention & Security
- **Honeypot Field**: Hidden `website` / `hp_company` field. Automated bots filling this field receive a deceptive HTTP 200 without saving data.
- **Sliding-Window Rate Limiting**: Maximum 5 submissions per 10-minute window per IP address.
- **Payload Validation**: Strict Zod schema enforcing string lengths (name ≤ 100, email ≤ 255, subject ≤ 200, message ≤ 5,000 chars).
- **XSS Sanitization**: Message bodies and subjects are sanitized and stored safely; never executed as HTML.
- **Published Only**: Unpublished portfolios reject public contact messages with HTTP 403.

### 3.3 Email Notification & Pluggable Provider
- **Service**: `src/lib/email/email-service.ts`
- **Fallback Hierarchy**:
  1. `RESEND_API_KEY`: Sends via Resend REST API if configured.
  2. `SMTP_HOST`: Sends via SMTP transport if configured.
  3. Safe Inbox Fallback: If no provider is configured, the message is stored securely in the database with status `unread` and `notification_sent = 0`.
- Notification failures never drop or delete visitor messages.

### 3.4 Portfolio Owner Inbox
- **Endpoints**:
  - `GET /api/portfolios/[id]/contact`: List received submissions (requires portfolio ownership).
  - `PATCH /api/portfolios/[id]/contact/[messageId]`: Mark read/unread or archive.
  - `DELETE /api/portfolios/[id]/contact/[messageId]`: Permanently remove submission.
- **UI**: Accessible modal directly from the Portfolio Editor toolbar ("Messages" button with unread count badge).

---

## 4. Feature C — Premium Templates & Advanced Visuals

### 4.1 New Registered Templates
Three distinct premium templates were added to `src/templates/registry.ts`, expanding the suite to 7 templates:

1. **`editorial-studio`** (`isPremium: true`):
   - Typography: Serif-led (`font-serif`, warm parchment neutral palette `#faf9f5`).
   - Layout: Editorial magazine anthology layout, prominent pull quotes, expansive two-column case studies, and reading-time indicators.
2. **`creative-motion`** (`isPremium: true`):
   - Typography: Clean geometric sans-serif (`font-sans`, dark obsidian palette `#090a0f`).
   - Layout: Spotlight cards with interactive cursor gradients, pulsing animated availability badges, and 3D perspective hover cards.
3. **`product-engineer`** (`isPremium: true`):
   - Typography: Monospace and technical sans (`font-mono`, matrix graphite palette `#0d1117`).
   - Layout: Terminal-inspired system status banners, architecture spec tables, benchmark metrics, and clean code highlights.

### 4.2 Interactive Visual Components
- **`SpotlightCard`**: Tracks mouse coordinates across card surface using radial CSS gradients. Automatically disables mouse-following transitions when `prefers-reduced-motion: reduce` is detected.
- **`AnimatedBadge`**: Subtle pinging status dot with accessible text.
- **`Interactive3DCard`**: Subtle 3D perspective tilt (`rotateX`, `rotateY`) on pointer hover with smooth easing and reduced-motion static fallback.

### 4.3 Entitlement Gating & Safe Downgrades
- Gated via `canAccessTemplate(userId, templateId)` from `src/lib/billing/entitlements.ts`.
- Free users can preview all templates in the Template Gallery.
- Applying a premium template requires an active Pro subscription; unauthorized API requests return HTTP 403 with `UPGRADE_REQUIRED`.
- Downgrading to Free preserves existing published portfolios intact; content and templates are never deleted on subscription expiration.

---

## 5. Feature D — Version History & Safe Restoration

### 5.1 Snapshot Boundaries & Triggers
Snapshots are recorded in the `portfolio_snapshots` table:
- `manual_save`: Explicit user checkpoint.
- `pre_ai`: Automatically taken prior to running AI content generation or restyling.
- `template_switch`: Automatically taken before changing template families.
- `publish`: Automatically taken when publishing draft changes.
- `pre_restore`: **Mandatory safety checkpoint** taken immediately before restoring a historical snapshot.

### 5.2 Content Deduplication
- A SHA-256 hash of canonical portfolio JSON data is computed.
- If content has not meaningfully changed since the last revision, duplicate snapshots are skipped.
- **Exception**: `pre_restore` snapshots are always created regardless of hash to guarantee a safe rollback anchor.

### 5.3 Safe Rollback Workflow
1. User clicks "History" in Editor toolbar and selects a version.
2. The system loads and validates the snapshot against `PortfolioDataSchema`.
3. Confirmation dialog warns user that draft state will be updated.
4. On confirmation, server validates portfolio ownership.
5. System takes an automatic `pre_restore` snapshot of current draft.
6. Target snapshot data is restored into draft storage.
7. Editor state reloads seamlessly from the newly restored draft.

### 5.4 Plan Retention Limits
- **Free Plan**: Up to 3 snapshots retained per portfolio.
- **Pro Plan**: Up to 30 snapshots retained per portfolio.
- Oldest non-recovery snapshots are pruned when limits are reached.

---

## 6. Database Schema Migrations

Two migrations were applied to `.data/portfolify.db`:
- `003_subscriptions_and_usage`: Added `user_subscriptions` and `usage_records` tables.
- `004_analytics_contact_and_versioning`:
  - `portfolio_events`: ID, portfolio_id, event_type, page_path, visitor_hash, referrer_type, referrer_domain, device_type, created_at.
  - `contact_submissions`: ID, portfolio_id, visitor_name, visitor_email, subject, message_body, consent_given, status, notification_sent, created_at.
  - `portfolio_snapshots`: ID, portfolio_id, user_id, revision_number, label, trigger, content_hash, portfolio_data, created_at.

---

## 7. Configuration & Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `ANALYTICS_SALT` | Optional | `portfolify_salt` | Secret salt for daily visitor hash calculation. |
| `RESEND_API_KEY` | Optional | `""` | API key for transactional email notifications via Resend. |
| `SMTP_HOST` | Optional | `""` | Host for SMTP email delivery fallback. |
| `SMTP_PORT` | Optional | `587` | Port for SMTP. |
| `SMTP_USER` | Optional | `""` | SMTP username. |
| `SMTP_PASS` | Optional | `""` | SMTP password. |
| `EMAIL_FROM` | Optional | `noreply@portfolify.dev` | Sender address for outgoing contact notifications. |

---

## 8. Verification & Test Coverage

- **TypeScript Compilation**: `npx tsc --noEmit` -> 0 errors.
- **ESLint**: `npm run lint` -> 0 errors, 0 warnings.
- **Next.js Production Build**: `npm run build` -> 23 static/dynamic routes compiled and optimized cleanly.
- **Vitest Test Suite**: 36 test files, 351 unit and integration tests passing:
  - `src/lib/analytics/analytics-service.test.ts` (11 tests)
  - `src/lib/contact/contact-service.test.ts` (8 tests)
  - `src/templates/premium-templates.test.ts` (10 tests)
  - `src/lib/services/version-history-service.test.ts` (7 tests)
  - `src/lib/billing/entitlements.test.ts` (7 tests)
