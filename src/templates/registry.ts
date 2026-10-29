import { TemplateId } from "@/lib/schema/portfolio";
import { RegisteredTemplate } from "./types";
import { KineticStudioTemplate } from "./kinetic-studio";
import { CosmicOrbitTemplate } from "./cosmic-orbit";
import { EditorialCraftTemplate } from "./editorial-craft";

const TEMPLATES: Partial<Record<TemplateId, RegisteredTemplate>> = {
  "editorial-craft": {
    metadata: {
      id: "editorial-craft",
      name: "Editorial Craft",
      description: "Clean, editorial product designer portfolio with high-craft typography, 3D character illustrations, and minimalist whitespace.",
      category: "Editorial",
      tagline: "Product Designer · Systems & Clarity",
      tags: ["Editorial", "Product Design", "Minimal", "Orange Accent", "3D Avatar", "Whitespace"],
      features: [
        "Full-viewport white hero with clean top navigation and active orange underline",
        "Large bold dual-tone name heading with vibrant orange first name",
        "3D thinking and magnifying glass designer illustrations with handwritten notes",
        "Subtle oversized circular geometry and pale green telemetry ray marker",
        "Editorial text link with diagonal arrow and tactile case study showcase",
      ],
      previewAccent: "#EF4B18",
      previewImageUrl: "/images/templates/editorial-craft.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: EditorialCraftTemplate,
  },
  "cosmic-orbit": {
    metadata: {
      id: "cosmic-orbit",
      name: "Cosmic Orbit",
      description: "An immersive space-themed portfolio template with stunning visuals, smooth animations and futuristic design.",
      category: "Creative",
      tagline: "Space · Creative · Developer",
      tags: ["Space", "Orbitron", "Sci-Fi", "Futuristic", "Astronaut", "Earth Arc"],
      features: [
        "A transmission from earth eyebrow with Orbitron glowing heading",
        "Floating astronaut and earth-like planet halo with customizable glow",
        "Deep nebula space background with starfield density controls",
        "Mission briefing about card with portrait and telemetry badges",
        "Explored planetary project worlds and orbital timeline",
      ],
      previewAccent: "#4BE5FF",
      previewImageUrl: "/images/templates/cosmic-orbit.svg",
      supportedSections: ["profile", "projects", "experience", "skills", "education", "contact"],
      isPremium: true,
    },
    component: CosmicOrbitTemplate,
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
};

export function getTemplate(id: TemplateId | string): RegisteredTemplate | undefined {
  return TEMPLATES[id as TemplateId];
}

export function getAllTemplates(): RegisteredTemplate[] {
  return Object.values(TEMPLATES) as RegisteredTemplate[];
}

export function isValidTemplateId(id: string): id is TemplateId {
  return id in TEMPLATES;
}

export function getDefaultTemplate(): RegisteredTemplate {
  return (TEMPLATES["cosmic-orbit"] || TEMPLATES["kinetic-studio"]) as RegisteredTemplate;
}
