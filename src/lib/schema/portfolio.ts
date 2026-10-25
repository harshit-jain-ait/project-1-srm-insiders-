import { z } from "zod";

/**
 * Portfolify Canonical Portfolio Data Schema
 * Single source of truth for Editor, Templates, AI Services, and Persistence.
 */

/**
 * Validates that a string is either empty (allowed in drafts) or a valid HTTP/HTTPS URL.
 * Strictly disallows dangerous pseudo-protocols such as javascript:, data:, vbscript:.
 */
export function isSafeHttpUrl(urlString?: string): boolean {
  if (!urlString || urlString.trim() === "") return true;
  const trimmed = urlString.trim();
  // Quick pre-check for dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const SafeUrlSchema = z
  .string()
  .default("")
  .refine((val) => isSafeHttpUrl(val), {
    message: "Must be a valid HTTP or HTTPS address",
  });

export const SocialLinkPlatformSchema = z.enum([
  "github",
  "linkedin",
  "twitter",
  "dribbble",
  "behance",
  "website",
  "email",
  "other",
]);

export type SocialLinkPlatform = z.infer<typeof SocialLinkPlatformSchema>;

export const SocialLinkSchema = z.object({
  id: z.string(),
  platform: SocialLinkPlatformSchema,
  label: z.string().min(1, "Label is required"),
  url: z.string().refine(
    (val) => {
      if (!val || val.trim() === "") return false;
      const trimmed = val.trim();
      if (trimmed.startsWith("mailto:")) return true;
      if (isSafeHttpUrl(trimmed)) return true;
      // Allow pure email as fallback
      return z.string().email().safeParse(trimmed).success;
    },
    { message: "Must be a valid URL or email address" }
  ),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  category: z.string().default("General"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  order: z.number().optional().default(0),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ProjectCaseStudySchema = z.object({
  problem: z.string().default(""),
  solution: z.string().default(""),
  role: z.string().default(""),
  process: z.string().default(""),
  outcomes: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  liveUrl: SafeUrlSchema.default(""),
  repoUrl: SafeUrlSchema.default(""),
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
  liveUrl: SafeUrlSchema.default(""),
  repoUrl: SafeUrlSchema.default(""),
  coverImageUrl: SafeUrlSchema.default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  order: z.number().optional().default(0),
  caseStudy: ProjectCaseStudySchema.optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = z
  .object({
    id: z.string(),
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    location: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    current: z.boolean().default(false),
    description: z.string().default(""),
    highlights: z.array(z.string()).default([]),
    order: z.number().optional().default(0),
  })
  .refine(
    (data) => {
      if (data.current) return true;
      if (!data.startDate || !data.endDate) return true;
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      if (!isNaN(start) && !isNaN(end)) {
        return end >= start;
      }
      return true;
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    }
  );

export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().default(""),
  fieldOfStudy: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  description: z.string().default(""),
  order: z.number().optional().default(0),
});

export type Education = z.infer<typeof EducationSchema>;

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().default(""),
  credentialUrl: SafeUrlSchema.default(""),
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
  order: z.number().optional().default(0),
});

export type SectionConfig = z.infer<typeof SectionConfigSchema>;

export const TemplateIdSchema = z.enum([
  "minimal-portfolio",
  "developer-pro",
  "signature",
  "reimagined",
]);

export type TemplateId = z.infer<typeof TemplateIdSchema>;

export const DesignTokensSchema = z
  .object({
    colorScheme: z.enum(["dark", "light", "system"]).optional(),
    accentColor: z.enum(["blue", "neutral", "slate"]).optional(),
    accentHex: z.string().optional(),
    backgroundColor: z.string().optional(),
    surfaceColor: z.string().optional(),
    textColor: z.string().optional(),
    mutedTextColor: z.string().optional(),
    borderColor: z.string().optional(),
    fontFamily: z.enum(["sans", "serif", "mono"]).optional(),
    headingFont: z.string().optional(),
    layoutDensity: z.enum(["compact", "balanced", "spacious"]).optional(),
    cardStyle: z.enum(["bordered", "flat", "elevated", "glass"]).optional(),
    headerLayout: z.enum(["split", "centered", "editorial", "minimal"]).optional(),
  })
  .optional();

export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const AppearanceSettingsSchema = z.object({
  templateId: TemplateIdSchema.default("minimal-portfolio"),
  colorScheme: z.enum(["system", "light", "dark"]).default("system"),
  accentColor: z.enum(["blue", "neutral", "slate"]).default("neutral"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
  designTokens: DesignTokensSchema,
});

export type AppearanceSettings = z.infer<typeof AppearanceSettingsSchema>;

export const ProfileSchema = z.object({
  fullName: z.string().default(""),
  headline: z.string().default(""),
  bio: z.string().default(""),
  longBio: z.string().optional().default(""),
  location: z.string().default(""),
  email: z.string().email("Must be a valid email").or(z.literal("")).default(""),
  phone: z.string().default(""),
  avatarUrl: SafeUrlSchema.default(""),
  statusBadge: z.string().default(""),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const PortfolioDataSchema = z.object({
  version: z.number().optional().default(1),
  revision: z.number().optional().default(1),
  id: z.string(),
  userId: z.string().default("anonymous"),
  title: z.string().default("Untitled Portfolio"),
  tagline: z.string().optional().default(""),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean().default(false),
  publishedAt: z.string().nullable().default(null),
  profile: ProfileSchema.default(() => ({
    fullName: "",
    headline: "",
    bio: "",
    longBio: "",
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
    { key: "profile", label: "Profile & About", visible: true, order: 0 },
    { key: "projects", label: "Projects", visible: true, order: 1 },
    { key: "experience", label: "Work Experience", visible: true, order: 2 },
    { key: "skills", label: "Skills", visible: true, order: 3 },
    { key: "education", label: "Education", visible: true, order: 4 },
    { key: "certifications", label: "Certifications", visible: true, order: 5 },
    { key: "contact", label: "Contact", visible: true, order: 6 },
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

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

/**
 * Creates an empty, valid canonical portfolio with zero fabricated content.
 * Accepts optional DeepPartial overrides and ensures all array items receive valid defaults.
 * Complies strictly with the No-Dummy-Data policy.
 */
export function createEmptyPortfolio(partial?: DeepPartial<PortfolioData>): PortfolioData {
  const now = new Date().toISOString();
  const id = partial?.id || `portfolio_${Date.now()}`;
  const slug = partial?.slug || `portfolio-${Date.now().toString().slice(-6)}`;

  const defaultStructure = {
    version: partial?.version || 1,
    revision: partial?.revision || 1,
    id,
    userId: partial?.userId || "anonymous",
    title: partial?.title || "New Portfolio",
    tagline: partial?.tagline || "",
    slug,
    published: partial?.published || false,
    publishedAt: partial?.publishedAt || null,
    profile: {
      fullName: "",
      headline: "",
      bio: "",
      longBio: "",
      location: "",
      email: "",
      phone: "",
      avatarUrl: "",
      statusBadge: "",
      ...partial?.profile,
    },
    socialLinks: (partial?.socialLinks || []) as SocialLink[],
    skills: (partial?.skills || []).map((s, i) => ({
      category: "General",
      order: i,
      ...s,
    })) as Skill[],
    projects: (partial?.projects || []).map((p, i) => ({
      tagline: "",
      description: "",
      featured: false,
      technologies: [],
      liveUrl: "",
      repoUrl: "",
      coverImageUrl: "",
      startDate: "",
      endDate: "",
      order: i,
      ...p,
    })) as Project[],
    experience: (partial?.experience || []).map((e, i) => ({
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
      order: i,
      ...e,
    })) as Experience[],
    education: (partial?.education || []).map((ed, i) => ({
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
      order: i,
      ...ed,
    })) as Education[],
    certifications: (partial?.certifications || []) as Certification[],
    customSections: (partial?.customSections || []) as CustomSection[],
    sections: (partial?.sections || [
      { key: "profile", label: "Profile & About", visible: true, order: 0 },
      { key: "projects", label: "Projects", visible: true, order: 1 },
      { key: "experience", label: "Work Experience", visible: true, order: 2 },
      { key: "skills", label: "Skills", visible: true, order: 3 },
      { key: "education", label: "Education", visible: true, order: 4 },
      { key: "certifications", label: "Certifications", visible: true, order: 5 },
      { key: "contact", label: "Contact", visible: true, order: 6 },
    ]).map((sec, i) => ({ order: i, ...sec })) as SectionConfig[],
    appearance: {
      templateId: "minimal-portfolio" as const,
      colorScheme: "system" as const,
      accentColor: "neutral" as const,
      fontFamily: "sans" as const,
      ...partial?.appearance,
    },
    createdAt: partial?.createdAt || now,
    updatedAt: partial?.updatedAt || now,
  };

  return PortfolioDataSchema.parse(defaultStructure);
}

/**
 * Initializes a new portfolio tied to a verified registered template.
 * Validates template ID against supported templates, falling back to minimal-portfolio if unrecognized.
 * Starts all collections as empty to uphold the No-Dummy-Data policy.
 */
export function initializePortfolioWithTemplate(
  templateId: string,
  partial?: Partial<PortfolioData>
): PortfolioData {
  const parseResult = TemplateIdSchema.safeParse(templateId);
  const resolvedTemplate: TemplateId = parseResult.success
    ? parseResult.data
    : "minimal-portfolio";

  return createEmptyPortfolio({
    ...partial,
    appearance: {
      templateId: resolvedTemplate,
      colorScheme: "system",
      accentColor: "neutral",
      fontFamily: "sans",
      ...partial?.appearance,
    },
  });
}

/**
 * Validates date ranges for experiences or educations.
 * If both start and end date are present, ensures end is not before start.
 */
export function validateDateRange(
  startDate?: string,
  endDate?: string,
  current?: boolean
): { isValid: boolean; error?: string } {
  if (current) return { isValid: true };
  if (!startDate || !endDate) return { isValid: true };

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!isNaN(start) && !isNaN(end) && end < start) {
    return {
      isValid: false,
      error: "End date cannot be earlier than start date",
    };
  }
  return { isValid: true };
}

/**
 * Skill deduplication helper.
 */
export function normalizeSkillName(name: string): string {
  return name.trim();
}

export function isDuplicateSkill(
  existingSkills: Skill[],
  newName: string,
  excludeId?: string
): boolean {
  const normalized = newName.trim().toLowerCase();
  return existingSkills.some(
    (s) => s.id !== excludeId && s.name.trim().toLowerCase() === normalized
  );
}

/**
 * Section ordering helper. Reorders a section up or down in the sections array.
 */
export function reorderSection(
  sections: SectionConfig[],
  index: number,
  direction: "up" | "down"
): SectionConfig[] {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sections.length) return sections;

  const updated = [...sections];
  const [moved] = updated.splice(index, 1);
  updated.splice(targetIndex, 0, moved);

  return updated.map((sec, i) => ({ ...sec, order: i }));
}

/**
 * Publishing readiness validation.
 * Unlike draft validation which allows empty fields, publishing requires
 * minimum public identity and valid external links.
 */
export interface PublishValidationResult {
  isReady: boolean;
  errors: string[];
}

export function validatePublishReadiness(portfolio: PortfolioData): PublishValidationResult {
  const errors: string[] = [];

  if (!portfolio.title || portfolio.title.trim() === "") {
    errors.push("Portfolio title is required for publishing");
  }
  if (!portfolio.slug || portfolio.slug.trim() === "") {
    errors.push("Portfolio public URL slug is required");
  }
  if (!portfolio.profile.fullName || portfolio.profile.fullName.trim() === "") {
    errors.push("Full Name is required for a public portfolio");
  }
  if (portfolio.profile.avatarUrl && !isSafeHttpUrl(portfolio.profile.avatarUrl)) {
    errors.push("Profile image must be a valid HTTP or HTTPS address");
  }

  portfolio.projects.forEach((proj, idx) => {
    if (!proj.title.trim()) {
      errors.push(`Project #${idx + 1} requires a title`);
    }
    if (proj.liveUrl && !isSafeHttpUrl(proj.liveUrl)) {
      errors.push(`Project "${proj.title || idx + 1}" live URL is invalid`);
    }
    if (proj.repoUrl && !isSafeHttpUrl(proj.repoUrl)) {
      errors.push(`Project "${proj.title || idx + 1}" repository URL is invalid`);
    }
  });

  portfolio.socialLinks.forEach((link, idx) => {
    if (!link.label.trim()) {
      errors.push(`Social link #${idx + 1} requires a label`);
    }
    if (!link.url.trim()) {
      errors.push(`Social link #${idx + 1} (${link.label}) requires a URL`);
    }
  });

  return {
    isReady: errors.length === 0,
    errors,
  };
}
