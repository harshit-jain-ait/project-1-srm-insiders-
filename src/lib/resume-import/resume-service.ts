import { validateResumeUpload } from "./file-validator";
import { parsePdfBuffer } from "./pdf-parser";
import { parseDocxBuffer } from "./docx-parser";
import { normalizeResumeText, isSufficientContent } from "./text-normalizer";
import { segmentAndExtractResume } from "./resume-segmenter";
import {
  ExtractedResumeData,
  ResumeApiResponse,
} from "./types";
import {
  PortfolioData,
  createEmptyPortfolio,
  PortfolioDataSchema,
  TemplateId,
  SocialLink,
  Skill,
  Experience,
  Education,
  Project,
} from "@/lib/schema/portfolio";
import { geminiProvider } from "@/lib/ai/gemini-provider";

export class ResumeService {
  /**
   * Validates and parses an uploaded resume buffer into structured intermediate data.
   */
  async parseResumeFile(
    fileName: string,
    buffer: Buffer,
    mimeType?: string
  ): Promise<ResumeApiResponse<ExtractedResumeData>> {
    // 1. Validate file (size, extension, MIME, magic bytes)
    const validation = validateResumeUpload(fileName, buffer, mimeType);
    if (!validation.valid || !validation.format || !validation.sanitizedFileName) {
      return {
        success: false,
        code: validation.errorCode || "UNSUPPORTED_FORMAT",
        error: validation.errorMessage || "File validation failed.",
      };
    }

    const { format, sanitizedFileName } = validation;
    let extractedText = "";

    // 2. Parse based on document format
    if (format === "pdf") {
      const pdfResult = await parsePdfBuffer(buffer);
      if (!pdfResult.success || !pdfResult.text) {
        return {
          success: false,
          code: pdfResult.errorCode || "CORRUPT_DOCUMENT",
          error: pdfResult.errorMessage || "Failed to extract text from PDF document.",
        };
      }
      extractedText = pdfResult.text;
    } else if (format === "docx") {
      const docxResult = await parseDocxBuffer(buffer);
      if (!docxResult.success || !docxResult.text) {
        return {
          success: false,
          code: docxResult.errorCode || "CORRUPT_DOCUMENT",
          error: docxResult.errorMessage || "Failed to extract text from Word document.",
        };
      }
      extractedText = docxResult.text;
    } else if (format === "txt" || format === "md") {
      const raw = buffer.toString("utf-8");
      extractedText = normalizeResumeText(raw);
      if (!isSufficientContent(extractedText)) {
        return {
          success: false,
          code: "EMPTY_DOCUMENT",
          error: "Text document contains insufficient readable text.",
        };
      }
    }

    // 3. Segment and structure into ExtractedResumeData
    const data = segmentAndExtractResume(extractedText, sanitizedFileName, format, buffer.length);

    return {
      success: true,
      data,
    };
  }

  /**
   * Optional AI-assisted rewriting for a single section with strict anti-hallucination rules.
   */
  async rewriteSectionWithAi(
    sectionType: string,
    rawText: string,
    tone: string = "professional"
  ): Promise<ResumeApiResponse<{ rewrittenText: string; highlights?: string[] }>> {
    const prompt = `
You are Portfolify's Resume-to-Portfolio Rewriting Assistant.
Tone: ${tone}
Section: ${sectionType}

=== STRICT ANTI-HALLUCINATION RULES ===
1. Improve grammar, sentence clarity, and portfolio tone.
2. DO NOT invent employers, dates, degrees, metrics, technologies, or achievements.
3. Use ONLY facts directly provided in the source text below.
4. Output valid JSON with keys: "rewrittenText" (string) and optional "highlights" (array of strings).

=== SOURCE TEXT ===
${rawText}
`;

    try {
      const providerRes = await geminiProvider.executeStructuredPrompt<{
        rewrittenText?: string;
        highlights?: string[];
      }>({
        systemInstruction: "You are a professional portfolio writer. Never hallucinate facts.",
        userPrompt: prompt,
        temperature: 0.1,
      });

      if (!providerRes.success || !providerRes.data) {
        return {
          success: false,
          code: providerRes.code === "RATE_LIMITED" ? "RATE_LIMITED" : providerRes.code === "MISSING_API_KEY" ? "MISSING_API_KEY" : "EXTRACTION_FAILED",
          error: providerRes.error || "AI rewriting unavailable.",
        };
      }

      return {
        success: true,
        data: {
          rewrittenText: providerRes.data.rewrittenText || rawText,
          highlights: providerRes.data.highlights || [],
        },
      };
    } catch (err: unknown) {
      return {
        success: false,
        code: "EXTRACTION_FAILED",
        error: err instanceof Error ? err.message : "AI rewriting failed.",
      };
    }
  }

  /**
   * Maps approved resume data into the canonical portfolio model.
   * - Supports creating a new portfolio or merging into an existing portfolio.
   * - Only included items are mapped.
   * - Strict validation against PortfolioDataSchema.
   */
  mapToPortfolioData(
    extracted: ExtractedResumeData,
    existingPortfolio?: PortfolioData,
    selectedTemplateId?: TemplateId
  ): PortfolioData {
    const now = Date.now();

    // 1. Filter only items approved by user (included === true)
    const approvedSkills: Skill[] = extracted.skills
      .filter((s) => s.included)
      .map((s, idx) => ({
        id: s.id || `skill_res_${now}_${idx}`,
        name: s.name,
        category: s.category || "General",
        order: idx,
      }));

    const approvedExperiences: Experience[] = extracted.experience
      .filter((e) => e.included)
      .map((e, idx) => ({
        id: e.id || `exp_res_${now}_${idx}`,
        company: e.company,
        role: e.role,
        location: e.location || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        current: e.current || false,
        description: e.description || "",
        highlights: e.highlights || [],
        order: idx,
      }));

    const approvedEducation: Education[] = extracted.education
      .filter((ed) => ed.included)
      .map((ed, idx) => ({
        id: ed.id || `edu_res_${now}_${idx}`,
        institution: ed.institution,
        degree: ed.degree || "",
        fieldOfStudy: ed.fieldOfStudy || "",
        startDate: ed.startDate || "",
        endDate: ed.endDate || "",
        description: ed.description || "",
        order: idx,
      }));

    const approvedProjects: Project[] = extracted.projects
      .filter((p) => p.included)
      .map((p, idx) => ({
        id: p.id || `proj_res_${now}_${idx}`,
        title: p.title,
        tagline: p.tagline || "",
        description: p.description || "",
        technologies: p.technologies || [],
        liveUrl: p.liveUrl || "",
        repoUrl: p.repoUrl || "",
        coverImageUrl: "",
        startDate: p.startDate || "",
        endDate: p.endDate || "",
        featured: idx === 0,
        order: idx,
      }));

    // Build social links from profile
    const socialLinks: SocialLink[] = [];
    if (extracted.profile.github) {
      socialLinks.push({
        id: `link_gh_${now}`,
        platform: "github",
        label: "GitHub",
        url: extracted.profile.github,
      });
    }
    if (extracted.profile.linkedin) {
      socialLinks.push({
        id: `link_li_${now}`,
        platform: "linkedin",
        label: "LinkedIn",
        url: extracted.profile.linkedin,
      });
    }
    if (extracted.profile.website) {
      socialLinks.push({
        id: `link_web_${now}`,
        platform: "website",
        label: "Website",
        url: extracted.profile.website,
      });
    }

    if (existingPortfolio) {
      // Default merge flow: preserve existing non-empty fields and append approved sections
      return this.mergeWithPortfolio(existingPortfolio, extracted, {
        profileStrategy: "fill-missing",
        skillsStrategy: "append",
        experienceStrategy: "append",
        educationStrategy: "append",
        projectsStrategy: "append",
      });
    }

    // NEW PORTFOLIO flow
    const defaultTemplate: TemplateId = selectedTemplateId || "minimal-portfolio";

    const newPortfolio = createEmptyPortfolio({
      title: `${extracted.profile.fullName ? `${extracted.profile.fullName}'s` : "My"} Portfolio`,
      profile: {
        fullName: extracted.profile.fullName || "",
        headline: extracted.profile.headline || "",
        bio: extracted.profile.bio || "",
        email: extracted.profile.email || "",
        phone: extracted.profile.phone || "",
        location: extracted.profile.location || "",
        statusBadge: "Available for new roles",
      },
      socialLinks,
      skills: approvedSkills,
      experience: approvedExperiences,
      education: approvedEducation,
      projects: approvedProjects,
      appearance: {
        templateId: defaultTemplate,
        colorScheme: "system",
        accentColor: "neutral",
        fontFamily: "sans",
      },
    });

    return PortfolioDataSchema.parse(newPortfolio);
  }

  /**
   * Performs a safe, user-controlled merge of extracted resume data into an existing portfolio.
   * Never silently overwrites user data; applies explicit section-by-section strategies.
   */
  mergeWithPortfolio(
    existingPortfolio: PortfolioData,
    extracted: ExtractedResumeData,
    options: ResumeMergeOptions
  ): PortfolioData {
    const now = Date.now();

    // 1. Process Approved Skills
    const approvedSkills: Skill[] = extracted.skills
      .filter((s) => s.included)
      .map((s, idx) => ({
        id: s.id || `skill_res_${now}_${idx}`,
        name: s.name,
        category: s.category || "General",
        order: existingPortfolio.skills.length + idx,
      }));

    let mergedSkills: Skill[] = [...existingPortfolio.skills];
    if (options.skillsStrategy === "replace") {
      mergedSkills = approvedSkills;
    } else if (options.skillsStrategy === "append") {
      // Avoid exact name duplicates
      const existingNames = new Set(existingPortfolio.skills.map((s) => s.name.toLowerCase().trim()));
      const uniqueNewSkills = approvedSkills.filter((s) => !existingNames.has(s.name.toLowerCase().trim()));
      mergedSkills = [...existingPortfolio.skills, ...uniqueNewSkills];
    }

    // 2. Process Approved Experience
    const approvedExperiences: Experience[] = extracted.experience
      .filter((e) => e.included)
      .map((e, idx) => ({
        id: e.id || `exp_res_${now}_${idx}`,
        company: e.company,
        role: e.role,
        location: e.location || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        current: e.current || false,
        description: e.description || "",
        highlights: e.highlights || [],
        order: existingPortfolio.experience.length + idx,
      }));

    let mergedExperience: Experience[] = [...existingPortfolio.experience];
    if (options.experienceStrategy === "replace") {
      mergedExperience = approvedExperiences;
    } else if (options.experienceStrategy === "append") {
      // Check for exact duplicate company + role
      const existingKeys = new Set(
        existingPortfolio.experience.map((e) => `${e.company.toLowerCase()}|${e.role.toLowerCase()}`)
      );
      const uniqueNewExp = approvedExperiences.filter(
        (e) => !existingKeys.has(`${e.company.toLowerCase()}|${e.role.toLowerCase()}`)
      );
      mergedExperience = [...existingPortfolio.experience, ...uniqueNewExp];
    }

    // 3. Process Approved Education
    const approvedEducation: Education[] = extracted.education
      .filter((ed) => ed.included)
      .map((ed, idx) => ({
        id: ed.id || `edu_res_${now}_${idx}`,
        institution: ed.institution,
        degree: ed.degree || "",
        fieldOfStudy: ed.fieldOfStudy || "",
        startDate: ed.startDate || "",
        endDate: ed.endDate || "",
        description: ed.description || "",
        order: existingPortfolio.education.length + idx,
      }));

    let mergedEducation: Education[] = [...existingPortfolio.education];
    if (options.educationStrategy === "replace") {
      mergedEducation = approvedEducation;
    } else if (options.educationStrategy === "append") {
      const existingKeys = new Set(
        existingPortfolio.education.map((ed) => `${ed.institution.toLowerCase()}|${(ed.degree || "").toLowerCase()}`)
      );
      const uniqueNewEdu = approvedEducation.filter(
        (ed) => !existingKeys.has(`${ed.institution.toLowerCase()}|${(ed.degree || "").toLowerCase()}`)
      );
      mergedEducation = [...existingPortfolio.education, ...uniqueNewEdu];
    }

    // 4. Process Approved Projects
    const approvedProjects: Project[] = extracted.projects
      .filter((p) => p.included)
      .map((p, idx) => ({
        id: p.id || `proj_res_${now}_${idx}`,
        title: p.title,
        tagline: p.tagline || "",
        description: p.description || "",
        technologies: p.technologies || [],
        liveUrl: p.liveUrl || "",
        repoUrl: p.repoUrl || "",
        coverImageUrl: "",
        startDate: p.startDate || "",
        endDate: p.endDate || "",
        featured: existingPortfolio.projects.length === 0 && idx === 0,
        order: existingPortfolio.projects.length + idx,
      }));

    let mergedProjects: Project[] = [...existingPortfolio.projects];
    if (options.projectsStrategy === "replace") {
      mergedProjects = approvedProjects;
    } else if (options.projectsStrategy === "append") {
      const existingTitles = new Set(existingPortfolio.projects.map((p) => p.title.toLowerCase().trim()));
      const uniqueNewProj = approvedProjects.filter((p) => !existingTitles.has(p.title.toLowerCase().trim()));
      mergedProjects = [...existingPortfolio.projects, ...uniqueNewProj];
    }

    // 5. Process Profile
    let mergedProfile = { ...existingPortfolio.profile };
    if (options.profileStrategy === "replace") {
      mergedProfile = {
        ...existingPortfolio.profile,
        fullName: extracted.profile.fullName || existingPortfolio.profile.fullName,
        headline: extracted.profile.headline || existingPortfolio.profile.headline,
        bio: extracted.profile.bio || existingPortfolio.profile.bio,
        email: extracted.profile.email || existingPortfolio.profile.email,
        phone: extracted.profile.phone || existingPortfolio.profile.phone,
        location: extracted.profile.location || existingPortfolio.profile.location,
      };
    } else if (options.profileStrategy === "fill-missing") {
      mergedProfile = {
        ...existingPortfolio.profile,
        fullName: existingPortfolio.profile.fullName || extracted.profile.fullName || "",
        headline: existingPortfolio.profile.headline || extracted.profile.headline || "",
        bio: existingPortfolio.profile.bio || extracted.profile.bio || "",
        email: existingPortfolio.profile.email || extracted.profile.email || "",
        phone: existingPortfolio.profile.phone || extracted.profile.phone || "",
        location: existingPortfolio.profile.location || extracted.profile.location || "",
      };
    }

    // 6. Assemble social links
    const socialLinks = [...existingPortfolio.socialLinks];
    if (extracted.profile.github && !socialLinks.some((l) => l.platform === "github")) {
      socialLinks.push({
        id: `link_gh_${now}`,
        platform: "github",
        label: "GitHub",
        url: extracted.profile.github,
      });
    }
    if (extracted.profile.linkedin && !socialLinks.some((l) => l.platform === "linkedin")) {
      socialLinks.push({
        id: `link_li_${now}`,
        platform: "linkedin",
        label: "LinkedIn",
        url: extracted.profile.linkedin,
      });
    }
    if (extracted.profile.website && !socialLinks.some((l) => l.platform === "website")) {
      socialLinks.push({
        id: `link_web_${now}`,
        platform: "website",
        label: "Website",
        url: extracted.profile.website,
      });
    }

    const mergedPortfolio: PortfolioData = {
      ...existingPortfolio,
      title: existingPortfolio.title || `${mergedProfile.fullName || "My"} Portfolio`,
      profile: mergedProfile,
      socialLinks,
      skills: mergedSkills,
      experience: mergedExperience,
      education: mergedEducation,
      projects: mergedProjects,
      updatedAt: new Date().toISOString(),
    };

    return PortfolioDataSchema.parse(mergedPortfolio);
  }
}

export interface ResumeMergeOptions {
  profileStrategy: "replace" | "fill-missing" | "keep";
  skillsStrategy: "append" | "replace" | "keep";
  experienceStrategy: "append" | "replace" | "keep";
  educationStrategy: "append" | "replace" | "keep";
  projectsStrategy: "append" | "replace" | "keep";
}

export const resumeService = new ResumeService();
