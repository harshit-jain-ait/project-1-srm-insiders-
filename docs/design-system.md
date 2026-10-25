# Portfolify — Design System & UI Specification

## 1. Design Philosophy
Portfolify adheres to a disciplined editorial SaaS aesthetic:
- **Craftsmanship & Restraint:** Clean lines, strong typography, intentional whitespace.
- **Strict Color Policy:** Deep black, charcoal, white, neutral grays, and restrained blue accents. **Zero purple or violet gradients.**
- **Truthful States:** Zero fabricated testimonials, review counts, or false metrics.

---

## 2. Color System & Semantic Tokens

### Core Palette
| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--background` | `#101114` (dark) / `#F7F7F5` (light) | Primary page background |
| `--surface` | `#191B20` (dark) / `#FFFFFF` (light) | Standard card & component surface |
| `--surface-elevated`| `#22242B` (dark) / `#FFFFFF` (light) | Elevated dialogs, menus, and sheets |
| `--border` | `#303238` (dark) / `#E4E5E7` (light) | Structural component dividing borders |
| `--border-subtle` | `#24262C` (dark) / `#EBECEE` (light) | Minor dividers and table lines |
| `--brand-blue` | `#356AE6` (accent) / `#4F83F8` (dark) | Primary interactive accents and focus rings |
| `--brand-blue-hover`| `#2B57BF` | Interactive hover state for brand actions |
| `--brand-blue-active`| `#23469E` | Pressed active state |
| `--text-muted` | `#8E929C` (dark) / `#777B84` (light) | Supporting descriptions & secondary text |
| `--text-subtle` | `#666A73` (dark) / `#9A9DA4` (light) | Placeholder, helper text, and disabled labels |

### Status Tokens
- **Success:** `#22C55E` / Surface: `rgba(34, 197, 94, 0.1)` / Border: `rgba(34, 197, 94, 0.25)`
- **Warning:** `#F59E0B` / Surface: `rgba(245, 158, 11, 0.1)` / Border: `rgba(245, 158, 11, 0.25)`
- **Error:** `#EF4444` / Surface: `rgba(239, 68, 68, 0.1)` / Border: `rgba(239, 68, 68, 0.25)`
- **Info:** `#3B82F6` / Surface: `rgba(59, 130, 246, 0.1)` / Border: `rgba(59, 130, 246, 0.25)`

---

## 3. Typography Scale

| Level | Component / Utility | Desktop Size | Mobile Size | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `<DisplayHeading />` | 56px (`3.5rem`) | 36px (`2.25rem`) | 1.12 | `-0.025em` |
| **Page Heading** | `<PageHeading />` | 30px (`1.875rem`) | 24px (`1.5rem`) | 1.2 | `-0.02em` |
| **Section Heading** | `<SectionHeading />` | 20px (`1.25rem`) | 18px (`1.125rem`) | 1.25 | `-0.015em` |
| **Card Heading** | `<CardHeading />` | 16px (`1rem`) | 16px (`1rem`) | 1.35 | `-0.01em` |
| **Body** | `<Text />` | 14px (`0.875rem`) | 14px (`0.875rem`) | 1.6 | Normal |
| **Secondary** | `<MutedText />` | 13px (`0.8125rem`) | 13px (`0.8125rem`) | 1.5 | Normal |
| **Caption** | `<Caption />` | 11px (`0.6875rem`) | 11px (`0.6875rem`) | 1.4 | `+0.05em` (Mono) |
| **Code / Stack** | `<CodeText />` | 12px (`0.75rem`) | 12px (`0.75rem`) | 1.4 | Normal (Mono) |

---

## 4. Spacing, Layout & Corner Radius

### Radius Scale
- `sm`: `0.25rem` (4px) — Badges, small tags, tooltips
- `md`: `0.375rem` (6px) — Form inputs, buttons, menu items
- `lg`: `0.5rem` (8px) — Cards, panels, dropdowns
- `xl`: `0.75rem` (12px) — Dialog modals, side drawers

### Layout Containers
- `Narrow`: `max-w-3xl` (768px) — Long-form reading, Minimal Portfolio layout
- `Standard`: `max-w-5xl` (1024px) — Developer Pro template, landing sections
- `Wide`: `max-w-6xl` (1152px) — Main app navigation, template gallery grid

---

## 5. Component Standards & API Reference

### Buttons (`src/components/ui/button.tsx`)
- **Variants:** `default` / `primary`, `brand`, `secondary`, `outline`, `ghost`, `destructive`, `link`
- **Sizes:** `sm` (32px), `default` / `md` (36px), `lg` (44px), `icon` (36x36px)
- **States:** Default, `:hover`, `:active`, `:focus-visible`, `disabled`, `isLoading` (prevents layout shifting with inline spinner)

### Form Components
- `Input` & `Textarea`: Accessible inputs with `hasError` state and visible focus rings.
- `Select`: Native styled select with custom chevron and error state.
- `Checkbox`: Custom styled indicator with keyboard navigation.
- `Switch`: ARIA switch toggle with smooth 200ms translation.
- `SearchInput`: Integrated search icon and quick-clear action.
- `FileUpload`: Drag-and-drop zone with size validation (default 5MB) and file remove action.
- `FormLabel`, `FormHelperText`, `FormErrorMessage`: Accessible field labeling suite with `role="alert"`.

### Navigation & Overlays
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`: Full WAI-ARIA tab semantics.
- `DropdownMenu`: Outside-click and Escape key dismissal with focus restoration.
- `Breadcrumb`: Accessible semantic breadcrumb trail.
- `Dialog`: Backdrop blur, center modal, focus trapping, and Escape key listener.
- `Drawer`: Slide-in side drawer with overlay backdrop.
- `Tooltip`: Hover & focus tooltips with `role="tooltip"`.

### Feedback & Status
- `Alert`: Accessible announcement banner (`info`, `success`, `warning`, `error`).
- `Badge`: Status tags (`default`, `secondary`, `outline`, `blue`, `success`).
- `Skeleton`: Subtle pulse placeholder for actual loading states.
- `EmptyState`: Actionable empty view explaining next steps truthfully.

---

## 6. Accessibility & Motion Guidelines
- **Contrast:** Every text and interactive element satisfies WCAG 2.2 AA (minimum 4.5:1 for body, 3:1 for large text and controls).
- **Reduced Motion:** Handled centrally in `globals.css` with `@media (prefers-reduced-motion: reduce)` overriding animations to `0.01ms`.
- **Keyboard Navigation:** Every actionable element provides a visible focus ring (`ring-2 ring-offset-2 ring-[#356ae6]`).
