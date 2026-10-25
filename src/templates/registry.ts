import { TemplateId } from "@/lib/schema/portfolio";
import { RegisteredTemplate } from "./types";
import { MinimalPortfolioTemplate } from "./minimal-portfolio";
import { DeveloperProTemplate } from "./developer-pro";

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
    },
    component: DeveloperProTemplate,
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
