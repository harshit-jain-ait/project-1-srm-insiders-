import { TemplateId } from "@/lib/schema/portfolio";

export type PlanId = "free" | "pro";

export interface PlanEntitlements {
  maxPortfolios: number;
  allowedTemplates: TemplateId[];
  customDomains: boolean;
  analyticsRetentionDays: number;
  maxSnapshots: number;
  maxContactSubmissionsMonthly: number;
  aiMonthlyAllowance: number;
  advancedAnimations: boolean;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  currency: string;
  features: string[];
  entitlements: PlanEntitlements;
}

export const FREE_TEMPLATES: TemplateId[] = [
  "minimal-portfolio",
  "developer-pro",
];

export const PREMIUM_TEMPLATES: TemplateId[] = [
  "signature",
  "reimagined",
  "editorial-studio",
  "creative-motion",
  "product-engineer",
];

export const ALL_TEMPLATES: TemplateId[] = [
  ...FREE_TEMPLATES,
  ...PREMIUM_TEMPLATES,
];

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Essential tools to build and publish a credible portfolio",
    priceMonthly: 0,
    currency: "USD",
    features: [
      "Up to 2 active portfolios",
      "Essential templates (Minimal Portfolio, Developer Pro)",
      "Standard project & case study builder",
      "Basic portfolio publishing on portfolify.dev",
      "7-day visitor analytics",
      "Up to 3 version history snapshots",
      "Secure visitor contact form (up to 50/mo)",
      "10 AI generation & assistance operations / month",
    ],
    entitlements: {
      maxPortfolios: 2,
      allowedTemplates: FREE_TEMPLATES,
      customDomains: false,
      analyticsRetentionDays: 7,
      maxSnapshots: 3,
      maxContactSubmissionsMonthly: 50,
      aiMonthlyAllowance: 10,
      advancedAnimations: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For ambitious engineers & creators who demand distinctive presentation",
    priceMonthly: 19,
    currency: "USD",
    features: [
      "Up to 25 active portfolios",
      "All templates including Editorial Studio, Creative Motion & Product Engineer",
      "URL-inspired Signature & Reimagined AI design systems",
      "Custom apex & subdomain DNS connection with SSL",
      "Full 365-day visitor analytics & traffic sources",
      "Up to 30 version history snapshots with 1-click restore",
      "Unlimited visitor contact messages & notifications",
      "150 AI generation & content refinement operations / month",
      "Advanced motion tokens and spotlight interactions",
    ],
    entitlements: {
      maxPortfolios: 25,
      allowedTemplates: ALL_TEMPLATES,
      customDomains: true,
      analyticsRetentionDays: 365,
      maxSnapshots: 30,
      maxContactSubmissionsMonthly: 10000,
      aiMonthlyAllowance: 150,
      advancedAnimations: true,
    },
  },
};

export function getPlanConfig(planId: PlanId | string): PlanConfig {
  return PLANS[planId as PlanId] || PLANS.free;
}

export function isPremiumTemplate(templateId: TemplateId | string): boolean {
  return PREMIUM_TEMPLATES.includes(templateId as TemplateId);
}
