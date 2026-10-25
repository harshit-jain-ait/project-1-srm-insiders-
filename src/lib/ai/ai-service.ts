import {
  AIGenerationPayload,
  AIGenerationInputSchema,
  AIRegenerateSectionPayload,
  AIRegenerateSectionInputSchema,
  AIServiceResponse,
} from "./types";
import { buildFullGenerationPrompt, buildSectionRegenerationPrompt } from "./prompt-builder";
import { geminiProvider } from "./gemini-provider";
import {
  PortfolioData,
  createEmptyPortfolio,
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  TemplateId,
} from "@/lib/schema/portfolio";

export interface GeneratedPortfolioResult {
  title: string;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  templateId: TemplateId;
}

interface RawGeminiOutput {
  profile?: Partial<Profile>;
  skills?: { name?: string; category?: string }[];
  projects?: {
    title?: string;
    tagline?: string;
    description?: string;
    technologies?: string[];
    liveUrl?: string;
    repoUrl?: string;
  }[];
  experience?: {
    company?: string;
    role?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    highlights?: string[];
  }[];
  education?: {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
}

export class AIService {
  async generatePortfolio(rawInput: AIGenerationPayload): Promise<AIServiceResponse<GeneratedPortfolioResult>> {
    const input = AIGenerationInputSchema.parse(rawInput);
    const { systemInstruction, userPrompt } = buildFullGenerationPrompt(input);

    const providerResult = await geminiProvider.executeStructuredPrompt<RawGeminiOutput>({
      systemInstruction,
      userPrompt,
      temperature: 0.2,
    });

    if (!providerResult.success || !providerResult.data) {
      return {
        success: false,
        code: providerResult.code,
        error: providerResult.error || "Failed to generate structured portfolio.",
      };
    }

    const raw = providerResult.data;
    const now = Date.now();

    // 1. Profile normalization
    const profile: Profile = {
      fullName: input.fullName || raw.profile?.fullName || "",
      headline: raw.profile?.headline || input.targetRole || "",
      bio: raw.profile?.bio || input.background || "",
      longBio: "",
      location: raw.profile?.location || "",
      email: raw.profile?.email || "",
      phone: "",
      avatarUrl: "",
      statusBadge: raw.profile?.statusBadge || "",
    };

    // 2. Skills normalization with stable IDs
    const skills: Skill[] = (raw.skills || []).map((s, idx) => ({
      id: `skill_${now}_${idx}`,
      name: s.name || "",
      category: s.category || "Core Competencies",
      order: idx,
    }));

    // 3. Projects normalization with stable IDs
    const projects: Project[] = (raw.projects || []).map((p, idx) => ({
      id: `proj_${now}_${idx}`,
      title: p.title || "Project Case Study",
      tagline: p.tagline || "",
      description: p.description || "",
      featured: idx === 0, // Mark first as featured by default
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      liveUrl: p.liveUrl || "",
      repoUrl: p.repoUrl || "",
      coverImageUrl: "",
      startDate: "",
      endDate: "",
      order: idx,
    }));

    // 4. Experience normalization with stable IDs
    const experience: Experience[] = (raw.experience || []).map((e, idx) => ({
      id: `exp_${now}_${idx}`,
      company: e.company || "",
      role: e.role || "",
      location: e.location || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
      current: Boolean(e.current),
      description: e.description || "",
      highlights: Array.isArray(e.highlights) ? e.highlights : [],
      order: idx,
    }));

    // 5. Education normalization with stable IDs
    const education: Education[] = (raw.education || []).map((ed, idx) => ({
      id: `edu_${now}_${idx}`,
      institution: ed.institution || "",
      degree: ed.degree || "",
      fieldOfStudy: ed.fieldOfStudy || "",
      startDate: ed.startDate || "",
      endDate: ed.endDate || "",
      description: ed.description || "",
      order: idx,
    }));

    // Computed title
    const title = profile.fullName
      ? `${profile.fullName} — ${profile.headline || "Portfolio"}`
      : `${input.targetRole} Portfolio`;

    return {
      success: true,
      data: {
        title,
        profile,
        skills,
        projects,
        experience,
        education,
        templateId: input.preferences.templateId,
      },
    };
  }

  async regenerateSection(
    rawInput: AIRegenerateSectionPayload
  ): Promise<AIServiceResponse<{ section: string; data: unknown }>> {
    const input = AIRegenerateSectionInputSchema.parse(rawInput);
    const { systemInstruction, userPrompt } = buildSectionRegenerationPrompt(input);

    const providerResult = await geminiProvider.executeStructuredPrompt<Record<string, unknown>>({
      systemInstruction,
      userPrompt,
      temperature: 0.3,
    });

    if (!providerResult.success || !providerResult.data) {
      return {
        success: false,
        code: providerResult.code,
        error: providerResult.error || `Failed to regenerate ${input.section} section.`,
      };
    }

    const sectionData = providerResult.data[input.section];
    if (sectionData === undefined) {
      return {
        success: false,
        code: "INVALID_OUTPUT",
        error: `Model response did not contain expected "${input.section}" key.`,
      };
    }

    const now = Date.now();

    // Assign IDs if regenerating collections
    if (input.section === "projects" && Array.isArray(sectionData)) {
      const normalizedProjects = sectionData.map((p, i) => ({
        id: `proj_regen_${now}_${i}`,
        title: p.title || "Project",
        tagline: p.tagline || "",
        description: p.description || "",
        featured: false,
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        liveUrl: p.liveUrl || "",
        repoUrl: p.repoUrl || "",
        coverImageUrl: "",
        startDate: "",
        endDate: "",
        order: i,
      }));
      return { success: true, data: { section: input.section, data: normalizedProjects } };
    }

    if (input.section === "skills" && Array.isArray(sectionData)) {
      const normalizedSkills = sectionData.map((s, i) => ({
        id: `skill_regen_${now}_${i}`,
        name: s.name || "",
        category: s.category || "General",
        order: i,
      }));
      return { success: true, data: { section: input.section, data: normalizedSkills } };
    }

    if (input.section === "experience" && Array.isArray(sectionData)) {
      const normalizedExp = sectionData.map((e, i) => ({
        id: `exp_regen_${now}_${i}`,
        company: e.company || "",
        role: e.role || "",
        location: e.location || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        current: Boolean(e.current),
        description: e.description || "",
        highlights: Array.isArray(e.highlights) ? e.highlights : [],
        order: i,
      }));
      return { success: true, data: { section: input.section, data: normalizedExp } };
    }

    if (input.section === "education" && Array.isArray(sectionData)) {
      const normalizedEdu = sectionData.map((ed, i) => ({
        id: `edu_regen_${now}_${i}`,
        institution: ed.institution || "",
        degree: ed.degree || "",
        fieldOfStudy: ed.fieldOfStudy || "",
        startDate: ed.startDate || "",
        endDate: ed.endDate || "",
        description: ed.description || "",
        order: i,
      }));
      return { success: true, data: { section: input.section, data: normalizedEdu } };
    }

    return {
      success: true,
      data: {
        section: input.section,
        data: sectionData,
      },
    };
  }

  /**
   * Helper to merge generated result into a complete, canonical PortfolioData object.
   */
  createPortfolioFromGenerated(generated: GeneratedPortfolioResult): PortfolioData {
    return createEmptyPortfolio({
      title: generated.title,
      profile: generated.profile,
      skills: generated.skills,
      projects: generated.projects,
      experience: generated.experience,
      education: generated.education,
      appearance: {
        templateId: generated.templateId,
        colorScheme: "system",
        accentColor: "neutral",
        fontFamily: generated.templateId === "developer-pro" ? "mono" : "sans",
      },
    });
  }
}

export const aiService = new AIService();
