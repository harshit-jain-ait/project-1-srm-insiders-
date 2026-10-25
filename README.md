# Portfolify

> AI-Assisted Portfolio Website Builder for Professionals.

Built with Next.js 16 (App Router), React 19, strict TypeScript, Tailwind CSS, and Lucide icons.

## Features (Phase 1 Foundation)
- **Canonical Data Architecture:** Single source of truth Zod schema for profile, projects, experience, skills, and layout.
- **Strict No-Dummy-Data Policy:** Genuine zero-content start states, no fake testimonials or fabricated user metrics.
- **Two Distinct Templates:**
  - *Minimal Portfolio*: Editorial, typography-focused, generous whitespace.
  - *Developer Pro*: Structured, technical, charcoal/white with restrained blue accents.
- **Split Visual Studio:** Real-time editing with live desktop, tablet, and mobile device frames.
- **Publishing Engine:** Safe slug reservations and live public view routes at `/p/[slug]`.
- **Grounded AI Assistant:** Server-side Gemini AI extraction grounded solely in user-supplied facts, with preview diff before application.
- **Zero-Purple Design System:** High-contrast palette based on black, charcoal, neutral gray, and restrained blue accents.

## Getting Started

### 1. Prerequisites
- Node.js 20+ (Node.js 24 recommended)
- npm 10+

### 2. Setup
```bash
# Clone and install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Automated Tests & Type Checking
```bash
# Run unit & integration tests (Vitest)
npm test

# Run TypeScript type check
npx tsc --noEmit

# Production build check
npm run build
```

## Documentation
Refer to [docs/architecture.md](docs/architecture.md) for full architectural patterns, template contracts, and security rules.
