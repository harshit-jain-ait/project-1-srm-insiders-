# Portfolify — Open Source Licensing & Visual Asset Attribution

Portfolify values open source software, artist rights, and intellectual property transparency. Below are the citations, licenses, and acknowledgments for third-party animation components and vector assets utilized across the product.

---

## 1. CrowdCanvas Animation (`Skiper39`)

- **Component Name**: Skiper 39 Canvas_Landing_004 (`CrowdCanvas`)
- **Author**: Gurvinder Singh ([@gurvinder-singh02](https://github.com/gurvinder-singh02))
- **Website**: [Skiper UI](https://skiper-ui.com) / [gxuri.me](https://gxuri.me) / [@Gur__vi on X](https://x.com/Gur__vi)
- **Component Source**: Adapted and refined from [Skiper UI Canvas Crowd](https://skiper-ui.com/components/skiper39) and [21st.dev](https://21st.dev/r/gurvinder-singh02/skiper39)
- **Conceptual Roots**: Inspired by the crowd walk-cycle experiment by Szenia Zadvornykh ([@zadvorsky](https://codepen.io/zadvorsky/pen/xxwbBQV))
- **License**: Free to use and modify in personal and commercial projects with attribution.
- **Portfolify Enhancements**:
  - React 19 / Next.js 16 integration with typed lifecycle hooks.
  - Active timeline garbage collection and strict memory leak guards.
  - Screen-aware responsive crowd density (mobile, tablet, desktop).
  - Dynamic high-DPI canvas scaling via idempotent transforms.
  - Automated `prefers-reduced-motion` detection with static visual fallback.
  - Viewport visibility and tab visibility pausing to conserve CPU and battery.

---

## 2. Character Sprite Artwork (Open Peeps)

- **Library**: Open Peeps Hand-Drawn Illustration System
- **Creator**: Pablo Stanley ([@pablostanley](https://x.com/pablostanley))
- **Website**: [https://www.openpeeps.com/](https://www.openpeeps.com/)
- **License**: **CC0 1.0 Universal (Public Domain Dedication)**
  - *Terms*: Free for commercial and personal use without copyright restrictions or required permission.
- **Asset Dimensions**: 3600 × 2268 px sprite sheet (15 columns × 7 rows, 105 distinct character poses, 240 × 324 px per frame).
- **Location**: `public/images/peeps/all-peeps.png`

---

## 3. Technology Brand Vectors (Bento Studio)

- **Vector Artwork**: Official brand marks for React, TypeScript, JavaScript, Next.js, Node.js, Tailwind CSS, Python, PostgreSQL, Docker, Figma, Git, and GraphQL.
- **Terms**: Used nominatively to represent user technical competencies according to each respective trademark policy.
- **Location**: `src/templates/bento-studio/tech-logos.tsx`

---

## 4. HoverExpand Template Spotlight (`Skiper52`)

- **Component Name**: Skiper 52 HoverExpand_001 (`HoverExpandTemplateGallery`)
- **Author**: Gurvinder Singh ([@gurvinder-singh02](https://github.com/gurvinder-singh02))
- **Website**: [Skiper UI](https://skiper-ui.com) / [@Gur__vi on X](https://x.com/Gur__vi)
- **Component Source**: Adapted and refined from [Skiper UI HoverExpand_001](https://skiper-ui.com) and [21st.dev](https://21st.dev/r/gurvinder-singh02/skiper52)
- **License**: Free to use and modify in personal and commercial projects with attribution.
- **Portfolify Enhancements**:
  - Direct integration with Portfolify's canonical template registry and data preservation guarantees.
  - Dual action buttons: "Preview" (opens modal) and "Select" (opens studio editor).
  - Keyboard accessibility (ArrowLeft, ArrowRight, Enter, Space) and visible focus rings.
  - Native `useReducedMotion` support to honor user accessibility preferences.
  - Responsive layout: desktop hover-expansion, mobile tap-expansion with horizontal swipe container.
