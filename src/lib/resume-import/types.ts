import { z } from "zod";

export type ResumeFileFormat = "pdf" | "docx" | "txt" | "md";

export const RESUME_UPLOAD_LIMITS = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  maxSizeFormatted: "5 MB",
  allowedExtensions: [".pdf", ".docx", ".txt", ".md"] as const,
  allowedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
  ] as const,
};

export const ParsedProfileSchema = z.object({
  fullName: z.string().default(""),
  headline: z.string().default(""),
  bio: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  website: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
});

export type ParsedProfile = z.infer<typeof ParsedProfileSchema>;

export const ParsedExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role title is required"),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
  included: z.boolean().default(true),
});

export type ParsedExperience = z.infer<typeof ParsedExperienceSchema>;

export const ParsedEducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().default(""),
  fieldOfStudy: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  description: z.string().default(""),
  included: z.boolean().default(true),
});

export type ParsedEducation = z.infer<typeof ParsedEducationSchema>;

export const ParsedSkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  category: z.string().default("Core Competencies"),
  included: z.boolean().default(true),
});

export type ParsedSkill = z.infer<typeof ParsedSkillSchema>;

export const ParsedProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  tagline: z.string().default(""),
  description: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().default(""),
  repoUrl: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  included: z.boolean().default(true),
});

export type ParsedProject = z.infer<typeof ParsedProjectSchema>;

export const ParsedCertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().default(""),
  issueDate: z.string().default(""),
  included: z.boolean().default(true),
});

export type ParsedCertification = z.infer<typeof ParsedCertificationSchema>;

export const ExtractedResumeDataSchema = z.object({
  profile: ParsedProfileSchema,
  experience: z.array(ParsedExperienceSchema).default([]),
  education: z.array(ParsedEducationSchema).default([]),
  skills: z.array(ParsedSkillSchema).default([]),
  projects: z.array(ParsedProjectSchema).default([]),
  certifications: z.array(ParsedCertificationSchema).default([]),
  rawText: z.string(),
  fileFormat: z.enum(["pdf", "docx", "txt", "md"]),
  fileName: z.string(),
  fileSize: z.number(),
  parsedAt: z.string(),
  extractionConfidence: z.enum(["high", "medium", "low"]).default("medium"),
  limitations: z.array(z.string()).default([]),
});

export type ExtractedResumeData = z.infer<typeof ExtractedResumeDataSchema>;

export type ResumeErrorCode =
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FORMAT"
  | "INVALID_MAGIC_BYTES"
  | "CORRUPT_DOCUMENT"
  | "EMPTY_DOCUMENT"
  | "IMAGE_ONLY_DOCUMENT"
  | "PARSE_TIMEOUT"
  | "EXTRACTION_FAILED"
  | "RATE_LIMITED"
  | "INVALID_SCHEMA"
  | "MISSING_API_KEY"
  | "PARSING_ERROR"
  | "PROVIDER_ERROR";

export interface ResumeApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: ResumeErrorCode;
}
