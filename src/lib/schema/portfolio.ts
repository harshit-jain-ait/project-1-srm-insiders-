import { z } from "zod";

/**
 * Portfolify Canonical Portfolio Data Schema
 * Single source of truth for Editor, Templates, AI Services, and Persistence.
 */

export const SocialLinkSchema = z.object({
  id: z.string(),
  platform: z.enum([
    "github",
    "linkedin",
    "twitter",
    "dribbble",
    "behance",
    "website",
    "email",
    "other",
  ]),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL").or(z.string().email("Must be a valid email")),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  category: z.string().default("General"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ProjectCaseStudySchema = z.object({
  problem: z.string().default(""),
  solution: z.string().default(""),
  role: z.string().default(""),
  process: z.string().default(""),
  outcomes: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().url().or(z.literal("")).default(""),
  repoUrl: z.string().url().or(z.literal("")).default(""),
  mediaUrls: z.array(z.string()).default([]),
});

export type ProjectCaseStudy = z.infer<typeof ProjectCaseStudySchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  tagline: z.string().default(""),
  description: z.string().default(""),
  featured: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().url().or(z.literal("")).default(""),
  repoUrl: z.string().url().or(z.literal("")).default(""),
  coverImageUrl: z.string().default(""),
  caseStudy: ProjectCaseStudySchema.optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().default(""),
  fieldOfStudy: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  description: z.string().default(""),
});

export type Education = z.infer<typeof EducationSchema>;

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().default(""),
  credentialUrl: z.string().url().or(z.literal("")).default(""),
});

export type Certification = z.infer<typeof CertificationSchema>;

export const CustomSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().default(""),
  date: z.string().default(""),
  description: z.string().default(""),
});

export type CustomSectionItem = z.infer<typeof CustomSectionItemSchema>;

export const CustomSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Section title is required"),
  items: z.array(CustomSectionItemSchema).default([]),
});

export type CustomSection = z.infer<typeof CustomSectionSchema>;

export const SectionKeySchema = z.enum([
  "profile",
  "projects",
  "experience",
  "skills",
  "education",
  "certifications",
  "contact",
  "custom",
]);

export type SectionKey = z.infer<typeof SectionKeySchema>;

export const SectionConfigSchema = z.object({
  key: SectionKeySchema,
  label: z.string(),
  visible: z.boolean().default(true),
});

export type SectionConfig = z.infer<typeof SectionConfigSchema>;

export const TemplateIdSchema = z.enum([
  "minimal-portfolio",
  "developer-pro",
]);

export type TemplateId = z.infer<typeof TemplateIdSchema>;

export const AppearanceSettingsSchema = z.object({
  templateId: TemplateIdSchema.default("minimal-portfolio"),
  colorScheme: z.enum(["system", "light", "dark"]).default("system"),
  accentColor: z.enum(["blue", "neutral", "slate"]).default("neutral"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
});

export type AppearanceSettings = z.infer<typeof AppearanceSettingsSchema>;

export const ProfileSchema = z.object({
  fullName: z.string().default(""),
  headline: z.string().default(""),
  bio: z.string().default(""),
  location: z.string().default(""),
  email: z.string().email("Must be a valid email").or(z.literal("")).default(""),
  phone: z.string().default(""),
  avatarUrl: z.string().default(""),
  statusBadge: z.string().default(""),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const PortfolioDataSchema = z.object({
  id: z.string(),
  userId: z.string().default("anonymous"),
  title: z.string().default("Untitled Portfolio"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean().default(false),
  publishedAt: z.string().nullable().default(null),
  profile: ProfileSchema.default(() => ({
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    avatarUrl: "",
    statusBadge: "",
  })),
  socialLinks: z.array(SocialLinkSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
  sections: z.array(SectionConfigSchema).default([
    { key: "profile", label: "Profile & About", visible: true },
    { key: "projects", label: "Projects", visible: true },
    { key: "experience", label: "Work Experience", visible: true },
    { key: "skills", label: "Skills", visible: true },
    { key: "education", label: "Education", visible: true },
    { key: "certifications", label: "Certifications", visible: true },
    { key: "contact", label: "Contact", visible: true },
  ]),
  appearance: AppearanceSettingsSchema.default(() => ({
    templateId: "minimal-portfolio" as const,
    colorScheme: "system" as const,
    accentColor: "neutral" as const,
    fontFamily: "sans" as const,
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PortfolioData = z.infer<typeof PortfolioDataSchema>;

/**
 * Creates an empty, valid canonical portfolio with zero fabricated content.
 * Complies strictly with the No-Dummy-Data policy.
 */
export function createEmptyPortfolio(partial?: Partial<PortfolioData>): PortfolioData {
  const now = new Date().toISOString();
  const id = partial?.id || `portfolio_${Date.now()}`;
  const slug = partial?.slug || `portfolio-${Date.now().toString().slice(-6)}`;

  const defaultStructure: PortfolioData = {
    id,
    userId: partial?.userId || "anonymous",
    title: partial?.title || "New Portfolio",
    slug,
    published: false,
    publishedAt: null,
    profile: {
      fullName: "",
      headline: "",
      bio: "",
      location: "",
      email: "",
      phone: "",
      avatarUrl: "",
      statusBadge: "",
      ...partial?.profile,
    },
    socialLinks: partial?.socialLinks || [],
    skills: partial?.skills || [],
    projects: partial?.projects || [],
    experience: partial?.experience || [],
    education: partial?.education || [],
    certifications: partial?.certifications || [],
    customSections: partial?.customSections || [],
    sections: partial?.sections || [
      { key: "profile", label: "Profile & About", visible: true },
      { key: "projects", label: "Projects", visible: true },
      { key: "experience", label: "Work Experience", visible: true },
      { key: "skills", label: "Skills", visible: true },
      { key: "education", label: "Education", visible: true },
      { key: "certifications", label: "Certifications", visible: true },
      { key: "contact", label: "Contact", visible: true },
    ],
    appearance: {
      templateId: "minimal-portfolio",
      colorScheme: "system",
      accentColor: "neutral",
      fontFamily: "sans",
      ...partial?.appearance,
    },
    createdAt: partial?.createdAt || now,
    updatedAt: partial?.updatedAt || now,
  };

  return PortfolioDataSchema.parse(defaultStructure);
}
