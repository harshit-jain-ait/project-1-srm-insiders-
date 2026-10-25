# Portfolify — Architecture & Engineering Specification

## 1. Overview
Portfolify is a production-grade, AI-assisted portfolio website builder for modern professionals. It is engineered with a strict canonical data architecture, zero fabricated production data, and a restrained, premium visual design system.

## 2. Technical Stack
- **Framework:** Next.js 16 (App Router, Server Components & Route Handlers)
- **Language:** TypeScript 5 (Strict mode enabled)
- **Styling:** Tailwind CSS v4 with custom design tokens in `src/app/globals.css`
- **Iconography:** Lucide React
- **Validation & Schemas:** Zod
- **Testing Engine:** Vitest (automated unit and integration testing)
- **Persistence:** Local atomic file repository (`src/lib/services/portfolio-repository.ts`), prepared for relational ORM / Supabase migration

## 3. Directory Layout
```
/src
  /app                     # Next.js App Router routes
    /api                   # Secure server-side route handlers
      /ai/generate         # Grounded Gemini AI extraction
      /portfolios          # CRUD repository endpoints
        /[id]/publish      # Publish / unpublish state machine
    /editor                # Visual split-screen studio workspace
    /p/[slug]              # Dynamic public portfolio route with SEO metadata
    /templates             # Browsable template gallery
    globals.css            # Design tokens, variables, reduced-motion rules
    layout.tsx             # Root layout with typography and metadata
    page.tsx               # Marketing landing page
  /components
    /editor                # Visual editor toolbar, sidebar, preview canvas, AI modal
    /ui                    # Accessible UI primitives (Button, Card, Badge, Input, EmptyState)
  /lib
    /schema                # Canonical Zod schema & TypeScript definitions (portfolio.ts)
    /services              # Server-side repositories & persistence abstraction
    utils.ts               # Classname merge utility (clsx + tailwind-merge)
  /templates
    /minimal-portfolio     # Editorial typography-focused template
    /developer-pro         # Technical, charcoal-first developer template
    registry.ts            # Central registry and lookup engine
    renderer.tsx           # Unified template renderer component
    types.ts               # Template contracts and metadata definitions
```

## 4. Canonical Data Model
All templates, editors, AI tools, and persistence engines consume a single schema defined in `src/lib/schema/portfolio.ts`:
- **Profile:** `fullName`, `headline`, `bio`, `location`, `email`, `phone`, `statusBadge`
- **Projects:** Title, tagline, description, tech stack, `liveUrl`, `repoUrl`, `caseStudy`
- **Experience:** Company, role, location, start/end dates, description, bullet highlights
- **Skills:** Categorized skills with optional proficiency
- **Education & Certifications:** Structured academic & professional credentials
- **Section Ordering & Visibility:** `sections` array controlling display order and toggle state
- **Appearance:** Selected template ID, color scheme, accent color, and typography

### No-Dummy-Data Compliance
The `createEmptyPortfolio()` factory ensures new portfolios start genuinely empty, with zero fake testimonials, zero fabricated work histories, and zero mock analytics.

## 5. Template Engine
Templates are modular and registered in `src/templates/registry.ts`.
To add a new template:
1. Create a new directory under `src/templates/<template-slug>/index.tsx`.
2. Implement the component satisfying `TemplateProps` (`portfolio: PortfolioData`, `isLivePreview?: boolean`).
3. Add registration in `src/templates/registry.ts` with metadata, tags, and category.
4. Add unit test in `src/templates/registry.test.ts`.

## 6. AI Assistant Security & Grounding
- Runs exclusively on the server (`/api/ai/generate`).
- The API key (`GEMINI_API_KEY`) is never exposed to the client.
- Strict system prompt instructs the model to only extract facts explicitly supplied by the user.
- If `GEMINI_API_KEY` is unset, the application honestly informs the user via the UI rather than faking an AI response.
- All extracted suggestions must be previewed and confirmed by the user before being applied to their portfolio.

## 7. Testing Procedures
Run all automated test suites:
```bash
npm test
```
Run in watch mode:
```bash
npm run test:watch
```
Typecheck:
```bash
npx tsc --noEmit
```
Build verification:
```bash
npm run build
```
