import { TemplateId } from "@/lib/schema/portfolio";
import { RegisteredTemplate } from "./types";
import { MinimalPortfolioTemplate } from "./minimal-portfolio";
import { DeveloperProTemplate } from "./developer-pro";
import { SignatureTemplate } from "./signature";
import { ReimaginedTemplate } from "./reimagined";
import { EditorialStudioTemplate } from "./editorial-studio";
import { CreativeMotionTemplate } from "./creative-motion";
import { ProductEngineerTemplate } from "./product-engineer";
import { BentoStudioTemplate } from "./bento-studio";
import { KineticStudioTemplate } from "./kinetic-studio";
import { DesignerCraftTemplate } from "./designer-craft";

const TEMPLATES: Record<TemplateId, RegisteredTemplate> = {
  "minimal-portfolio": {
    metadata: {
      id: "minimal-portfolio",
      name: "Minimal Portfolio",
      description: "Editorial, typography-focused layout with intentional whitespace and elegant hierarchy.",
      category: "Editorial",
      tagline: "Understated elegance for discerning professionals",
      tags: ["Editorial", "Typography", "Clean", "Lightweight"],
      features: [
        "Typographic hierarchy inspired by modern publications",
        "Seamless mobile reading experience",
        "Case-study ready project presentation",
        "Graceful handling of zero-content states",
      ],
      previewAccent: "#09090b",
      previewImageUrl: "/images/templates/minimal-portfolio.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: false,
    },
    component: MinimalPortfolioTemplate,
  },
  "developer-pro": {
    metadata: {
      id: "developer-pro",
      name: "Developer Pro",
      description: "Technical, structured portfolio using charcoal surfaces and restrained blue accents.",
      category: "Engineering",
      tagline: "High-density technical portfolio for engineers & architects",
      tags: ["Technical", "Engineering", "Charcoal", "Monospace"],
      features: [
        "Monospace accents and system status indicators",
        "Repository links and stack tag breakdowns",
        "High-contrast dark-mode first design",
        "Focused timeline for complex engineering tenures",
      ],
      previewAccent: "#2563eb",
      previewImageUrl: "/images/templates/developer-pro.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: false,
    },
    component: DeveloperProTemplate,
  },
  signature: {
    metadata: {
      id: "signature",
      name: "Signature",
      description: "Faithful visual harmony echoing a source website's core color palette, typography, and card rhythm.",
      category: "Creative",
      tagline: "URL-inspired design preserving the source site's structural harmony",
      tags: ["AI-Inspired", "URL Import", "Adaptive", "Harmonious"],
      features: [
        "Adapts dynamically to extracted source color palette & token rhythm",
        "Balanced case study presentation with responsive card framing",
        "Accessible contrast and native mobile reflow",
        "Grounded factual representation using canonical portfolio schema",
      ],
      previewAccent: "#356ae6",
      previewImageUrl: "/images/templates/signature.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: SignatureTemplate,
  },
  reimagined: {
    metadata: {
      id: "reimagined",
      name: "Reimagined",
      description: "Alternative editorial composition reinterpreting source design characteristics with generous whitespace and magazine scale.",
      category: "Editorial",
      tagline: "Bold editorial reinterpretation with elevated magazine composition",
      tags: ["AI-Inspired", "Editorial", "Asymmetrical", "Dynamic"],
      features: [
        "Asymmetrical split hero with floating status badge",
        "Magazine-inspired project anthology showcase",
        "Elevated serif/sans composition with dramatic visual hierarchy",
        "High-whitespace layout with distinct visual personality",
      ],
      previewAccent: "#18181b",
      previewImageUrl: "/images/templates/reimagined.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: ReimaginedTemplate,
  },
  "editorial-studio": {
    metadata: {
      id: "editorial-studio",
      name: "Editorial Studio",
      description: "Expressive literary layout with dramatic serif typography, generous margins, and publication anthology presentation.",
      category: "Editorial",
      tagline: "Literary publication layout for authors, designers, and creative leaders",
      tags: ["Editorial", "Serif", "Anthology", "Publication"],
      features: [
        "Warm paper texture background with dramatic serif headlines",
        "Chapter-indexed project anthology and case studies",
        "Curated career tenures with high-contrast pull quotes",
        "Built-in visitor correspondence form",
      ],
      previewAccent: "#1a1918",
      previewImageUrl: "/images/templates/editorial-studio.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: EditorialStudioTemplate,
  },
  "creative-motion": {
    metadata: {
      id: "creative-motion",
      name: "Creative Motion",
      description: "Visual and interactive layout with cursor spotlight tracking, animated status indicators, and responsive card grids.",
      category: "Creative",
      tagline: "Fluid interactive portfolio for visual designers and creative technologists",
      tags: ["Motion", "Interactive", "Spotlight", "Dark Mode"],
      features: [
        "Smooth cursor-following spotlight reflection effects",
        "Dynamic live availability and engineering status badges",
        "Perspective 3D project cards with reduced-motion support",
        "Integrated direct visitor contact form",
      ],
      previewAccent: "#3b82f6",
      previewImageUrl: "/images/templates/creative-motion.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: CreativeMotionTemplate,
  },
  "product-engineer": {
    metadata: {
      id: "product-engineer",
      name: "Product Engineer",
      description: "High-density engineering portfolio with terminal aesthetics, system specs ribbon, and architecture cards.",
      category: "Engineering",
      tagline: "Architectural and system-level presentation for staff engineers",
      tags: ["Engineering", "Terminal", "Architecture", "Systems"],
      features: [
        "Host architecture and system specifications panel",
        "Code module index and verified case study links",
        "Technical stack competencies with verification indicators",
        "Integrated direct transmission terminal contact form",
      ],
      previewAccent: "#10b981",
      previewImageUrl: "/images/templates/product-engineer.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: ProductEngineerTemplate,
  },
  "bento-studio": {
    metadata: {
      id: "bento-studio",
      name: "Bento Studio",
      description: "A bold, modern portfolio with an editorial dark theme, asymmetric Bento Grid cards, interactive project showcases, and a refined personal introduction.",
      category: "Creative",
      tagline: "Asymmetric Bento Grid presentation with dark editorial elegance",
      tags: ["Bento Grid", "Editorial", "Dark Mode", "Showcase"],
      features: [
        "Asymmetric Bento Grid with responsive auto-reflow across viewports",
        "Interactive project cards with diagonal action indicators and case study links",
        "Official vector technology logos mapped directly to user skills",
        "Built-in visitor correspondence form and verified social pills",
      ],
      previewAccent: "#3b82f6",
      previewImageUrl: "/images/templates/bento-studio.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: BentoStudioTemplate,
  },
  "kinetic-studio": {
    metadata: {
      id: "kinetic-studio",
      name: "Kinetic Studio",
      description: "High-contrast brutalist engineering portfolio with kinetic typography, infinite tech marquee, tabular stats, and expandable project rows.",
      category: "Engineering",
      tagline: "Kinetic typography and brutalist engineering presentation for AI & systems builders",
      tags: ["Brutalist", "Kinetic", "Space Mono", "AI Systems", "High-Contrast"],
      features: [
        "Massive uppercase kinetic statement with italic subtitle aside",
        "Infinite horizontal technology marquee with interactive pause",
        "Numbered section dividers (01 About, 02 Work, 03 Stack, 04 Journey)",
        "Tabular 4-column metric numbers with orange superscripts",
        "Pillar stack chips, expandable technical notes, and giant closing wordmark",
      ],
      previewAccent: "#ff5c1a",
      previewImageUrl: "/images/templates/kinetic-studio.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: KineticStudioTemplate,
  },
  "designer-craft": {
    metadata: {
      id: "designer-craft",
      name: "Designer Craft",
      description: "Tactile interaction design & playful product craft inspired by Paris studios, featuring floating capsule nav, AirDrop sharing, and ambient tracks.",
      category: "Creative",
      tagline: "Tactile micro-interactions & playful product design for interaction designers",
      tags: ["Interaction Design", "Tactile", "Dark Mode", "Playful", "Product Systems"],
      features: [
        "Floating frosted capsule navbar with active status and quick email copy",
        "Interactive AirDrop sharing pill and ambient audio player",
        "Large rounded project cards with subtle hover elevation & tags",
        "Interactive 4-pillar craft philosophy breakdown and smile counter",
        "Integrated case study modal and direct transmission contact form",
      ],
      previewAccent: "#0080ff",
      previewImageUrl: "/images/templates/designer-craft.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: DesignerCraftTemplate,
  },
};

export function getTemplate(id: TemplateId | string): RegisteredTemplate | undefined {
  return TEMPLATES[id as TemplateId];
}

export function getAllTemplates(): RegisteredTemplate[] {
  return Object.values(TEMPLATES);
}

export function isValidTemplateId(id: string): id is TemplateId {
  return id in TEMPLATES;
}

export function getDefaultTemplate(): RegisteredTemplate {
  return TEMPLATES["minimal-portfolio"];
}
