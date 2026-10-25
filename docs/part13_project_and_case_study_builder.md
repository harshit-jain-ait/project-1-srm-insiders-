# Part 13: Project and Case Study Builder

## Overview
Part 13 extends Portfolify with a complete, reusable Project and Case Study Builder that integrates seamlessly with the existing canonical portfolio model, visual editor, AI service, asset pipeline, and published portfolio architecture.

Users can create both **Quick Projects** (lightweight project cards with title, summary, technologies, and URLs) and **In-Depth Case Studies** (rich narrative sections explaining what the project was, why it mattered, role attribution, challenges, technical architecture, process, verified outcomes, media galleries, and sandboxed video/prototype embeds).

---

## 1. Canonical Schema Extensions (`src/lib/schema/portfolio.ts`)

- **Project Metadata**:
  - `category`: `"software" | "design" | "engineering" | "research" | "business" | "creative" | "writing" | "other"`
  - `status`: `"in_progress" | "completed" | "maintained" | "archived"`
  - `featured`: boolean (highlighted in templates)
  - `visible`: boolean (allows hiding projects without deleting them; hidden projects are strictly excluded from public routes and sitemaps)
  - `startDate`, `endDate`, `slug`, `order`
- **Case Study Section Types (12 safe types)**:
  - `text`: Rich paragraph text / context overview
  - `problem_solution`: Challenges faced and solutions designed
  - `technical_architecture`: Stack, system diagram, or engineering approach
  - `process`: Workflow, methodology, iterations
  - `metrics`: Quantifiable outcomes with baseline, measurement period, context, and explicit user verification flag (`verifiedByUser: true`)
  - `gallery`: Media gallery with captions, aspect ratios, and alt text
  - `image_caption`: Hero or featured visual with descriptive caption
  - `video_embed`: Sandboxed video embed from verified providers
  - `prototype_embed`: Sandboxed interactive prototype embed (Figma, CodePen)
  - `timeline`: Chronological project milestones with dates and descriptions
  - `quote`: Genuine client/user testimonial with author attribution and optional reference URL
  - `links`: Curated external resources, GitHub repos, live demos, and documentation
- **Backward Compatibility & Data Preservation**:
  - Preserves all legacy case study fields (`problem`, `solution`, `process`, `outcomes`, `technologies`, `liveUrl`, `repoUrl`, `mediaUrls`).
  - Helper functions `createEmptyCaseStudySection(...)`, `createEmptyCaseStudy(...)`, and `reorderCaseStudySections(...)`.

---

## 2. Secure Asset Upload & Serving Pipeline

- **Server-Side Magic Byte Validation (`src/lib/assets/asset-validator.ts`)**:
  - Inspects initial file header bytes: PNG (`89 50 4E 47`), JPEG (`FF D8 FF`), GIF (`47 49 46 38`), WebP (`RIFF...WEBP`).
  - Strict SVG verification parsing XML elements and rejecting `<script>`, `onload`, `onclick`, `onerror`, `javascript:`, and external entity exploits.
  - Enforces 5MB maximum file size.
  - Generates collision-resistant, safe filenames using UUIDs.
- **Path-Traversal Prevention & Serving (`src/app/api/assets/[filename]/route.ts`)**:
  - Sanitizes filename parameter via `path.basename`.
  - Sets safe headers: `X-Content-Type-Options: nosniff`, `Cache-Control: public, max-age=31536000, immutable`.
- **Safe Embed Sanitization (`src/lib/assets/embed-sanitizer.ts`)**:
  - Whitelists supported providers: YouTube, Vimeo, Loom, Figma, CodePen.
  - Converts user links into privacy-preserving embed endpoints (e.g. `youtube-nocookie.com/embed/...`, `loom.com/embed/...`, `figma.com/embed?...`).
  - Strictly rejects `javascript:`, `data:`, `vbscript:`, and unapproved domains.

---

## 3. Grounded AI Case Study Assistant (`src/lib/case-study/case-study-ai.ts`)

- **Strict Anti-Hallucination Guardrails**:
  - Outlines and rewrites are generated strictly from user-provided notes.
  - Never invents metrics, percentage increases, client names, team sizes, awards, or user research numbers.
  - If information is missing, the AI requests it or provides neutral guidance.
- **Capabilities**:
  - `generateCaseStudyOutline`: Generates 3–6 logical section recommendations tailored to the project category.
  - `improveCaseStudySection`: Refines clarity, conciseness, technical depth, or problem framing without introducing unsupported claims.
  - `evaluateCaseStudyQuality`: Checks completeness (overview, problem statement, approach, role attribution, verified metrics, links) with actionable suggestions; never produces fake rankings or artificial scores.
- **Review Workflow (`src/components/case-study/case-study-ai-modal.tsx`)**:
  - Displays side-by-side or diff preview of suggestions.
  - User can edit, accept, or reject suggestions. Original content is never overwritten silently.

---

## 4. Visual Editor & Builder UI

- **Quick Project vs Case Study Starting Points (`src/components/forms/project-form.tsx`)**:
  - "Quick Project" creates essential fields (title, summary, technologies, category, status, links, cover image).
  - "In-Depth Case Study" initializes case study sections and launches the Builder modal.
- **Case Study Builder Modal (`src/components/case-study/case-study-builder-modal.tsx`)**:
  - Section management: add, delete, reorder (accessible up/down controls), toggle visibility.
  - Live interactive preview tab using the real `CaseStudyRenderer`.
  - Dedicated editors for each section type (metrics, media upload, embed URLs, timelines, quotes, bullets).
  - Integrated AI assistant modal.

---

## 5. Template & Public Route Rendering

- **Template Integration**:
  - All 4 portfolio templates (`minimal-portfolio`, `developer-pro`, `signature`, `reimagined`) filter out `visible === false` projects.
  - Render cover image, category badge, status badge, technology chips, and "Read Case Study →" links pointing to `/p/[slug]/projects/[projectId]`.
- **Public Case Study Route (`src/app/p/[slug]/projects/[projectId]/page.tsx`)**:
  - Verifies portfolio publication status: unpublished portfolios return HTTP 404 (preventing private draft leaks).
  - Verifies project visibility: `visible === false` returns HTTP 404 (cannot be accessed via guessed URL).
  - Generates dynamic SEO metadata (`title`, `description`, `canonical`, OpenGraph tags).
  - Renders standalone case study header, role attribution, technology badges, live/repo buttons, and all visible sections via `CaseStudyRenderer`.
- **Sitemap Integration (`src/app/sitemap.ts`)**:
  - Only published portfolios and visible projects (`visible !== false`) are included in `sitemap.xml`.

---

## 6. Verification and Quality Checks

- **TypeScript**: `npx tsc --noEmit` passed with 0 errors.
- **ESLint**: `npm run lint` passed with 0 errors, 0 warnings.
- **Test Suite**: `vitest run --run` passed with **31 of 31 test files, 307 passed tests (100%)**.
- **Next.js Production Build**: `npm run build` compiled successfully in 2.1s with all dynamic and static routes generated.
