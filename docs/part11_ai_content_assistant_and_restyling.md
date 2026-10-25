# Portfolify — Part 11: AI Content Assistant and Portfolio Restyling

## 1. Overview & Architectural Scope

Part 11 implements production-grade **AI Content Intelligence** and **Visual Restyling** for Portfolify, extending Parts 1–10. The system decouples semantic text refinement from visual design transformations:

1. **Content Intelligence**: Refines wording, flow, conciseness, grammar, and tone of user-provided content without fabricating facts or altering underlying records.
2. **Visual Restyling**: Proposes and applies validated design configurations and registered template switches while preserving 100% of the user's content, section order, links, and item IDs.

---

## 2. Content Assistant Architecture & Guardrails

### 2.1 Supported Content Operations
The assistant supports 9 focused, typed operations:
- `improve_clarity`: Rewrites text for readability and natural flow while strictly preserving exact facts.
- `fix_grammar`: Corrects punctuation, capitalization, grammatical errors, and sentence structure.
- `adjust_tone`: Adjusts tone to `professional`, `concise`, `friendly`, `technical`, or `creative` without introducing unverified claims.
- `shorten`: Eliminates filler phrases (`basically`, `in order to`, `essentially`) while keeping all technical details.
- `expand_clarity`: Enhances explanations using only facts in the source text. If information is insufficient, issues a clarification request rather than inventing details.
- `improve_headline`: Refines professional headlines in title case without inflating seniority or unverified job titles.
- `improve_bio`: Structures professional summaries and biographies for clear web presentation.
- `improve_project_description`: Clarifies architecture, problems solved, and technologies used.
- `improve_bullet`: Polishes experience achievement bullets using strong action verbs without fabricating metrics or percentages.

### 2.2 Factual Integrity & Anti-Hallucination Controls
The AI system instructions enforce non-negotiable negative constraints:
- **Never invent**: Employers, job titles, employment dates, degrees, certifications, skills, technologies, projects, metrics, numbers, or achievements.
- **Never upgrade**: Tasks to unverified accomplishments, or participation into leadership.
- **Clarification requests**: When facts are sparse for expansion, the service populates `clarificationNeeded` rather than fabricating achievements.

### 2.3 Stale Result Protection via Content Hashing
- Each source text generates a fast, deterministic SHA-256 hash (`computeContentHash`).
- The in-flight request carries `sourceHash`.
- If the user modifies the text concurrently in the editor, the service detects `isStale: true` and warns the user with a conflict banner, preventing accidental overwrites.

---

## 3. Visual Restyling System

### 3.1 Registered Restyling Presets
Restyling maps exclusively to canonical `AppearanceSettingsSchema` values:
1. **Minimal Editorial**: Newsreader serif typography, spacious layout density, bordered card styles, quiet monochrome aesthetic.
2. **Modern Professional**: Inter sans-serif typography, balanced layout density, subtle elevated cards, restrained `#356ae6` blue accents.
3. **Technical Structured**: JetBrains Mono typography, compact layout density, dark theme (`#09090b`), slate accents, high information density.
4. **Creative Expressive**: Newsreader serif typography, light warmth, editorial centered headers, spacious grid.
5. **Bold High Contrast**: High-contrast dark surfaces, bold borders, minimal navigation, high visibility typography.

### 3.2 Dynamic Visual Preference Mapper
Users can also input natural language design descriptions (e.g., *"clean minimal dark layout with monospace accents"*). The service parses the request into approved design tokens and templates using strict JSON schema validation, with deterministic keyword fallback when the provider is offline.

### 3.3 Strict Content & Identity Preservation
- Restyling updates only `portfolio.appearance` and `designTokens`.
- Profile details, projects, experience, skills, social links, education, and section visibility remain 100% untouched.

---

## 4. UI Entry Points & Review Workflow

- **Global Assistant Modal**: Accessible via the editor top bar (`AI Assistant` button) and keyboard shortcuts.
- **Inline Field Quick-Actions**: Sparkle icon triggers beside:
  - Professional Headline
  - Summary / Bio
  - Extended Biography
  - Project Detailed Summary / Case Study
  - Experience Overview
  - Individual Experience Highlight Bullets
- **Theme Panel Banner**: Quick-launch banner in `AppearanceForm` to open visual restyling with live preview.
- **Interactive Review**:
  - Before vs. After comparison diff cards.
  - Editable suggestion textarea for manual refinement prior to application.
  - One-click copy, try again, and reject actions.
  - Explicit user approval required to apply changes into the editor state.
  - Live interactive preview powered by `PortfolioRenderer` (desktop and mobile viewports).

---

## 5. Security & Rate Limiting

- **Input Validation**: `ContentAssistRequestSchema` caps source text at 3,000 characters and enforces typed operations.
- **API Key Protection**: Server-side execution only; `GEMINI_API_KEY` is never exposed to the client.
- **Rate Limit Resilience**: HTTP 429 status returned when provider quotas are exceeded; user's manual edits and original text remain completely intact.
- **Zero Arbitrary Code**: Generated content is validated through Zod schemas before rendering; arbitrary HTML, CSS, or script execution is strictly forbidden.

---

## 6. Verification & Test Coverage

- **All Test Suites Passing**: 21 test files, 216 tests passing cleanly (`npm test -- --run`).
- **New Part 11 Tests**:
  - `src/lib/ai-assistant/assistant-service.test.ts` (28 tests): Schema boundaries, content hashing, offline deterministic operations, factual integrity, preset validation, and error recovery.
  - `src/app/api/ai/assistant-api.test.ts` (7 tests): `POST /api/ai/content-assist` and `POST /api/ai/restyle` route validation, rate limiting, and success flows.
- **Static Typing**: `npx tsc --noEmit` exits with 0 errors.
- **Linting**: `npm run lint` passes with 0 errors and 0 warnings.
- **Production Build**: `next build` compiles successfully in Turbopack across 19 static/dynamic routes.
