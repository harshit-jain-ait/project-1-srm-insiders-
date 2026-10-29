import { TemplateId } from "@/lib/schema/portfolio";
import { RegisteredTemplate } from "./types";
import { KineticStudioTemplate } from "./kinetic-studio";

const TEMPLATES: Partial<Record<TemplateId, RegisteredTemplate>> = {
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
  return TEMPLATES["kinetic-studio"] as RegisteredTemplate;
}
