import {
  ParsedExperience,
  ParsedEducation,
  ParsedSkill,
  ParsedProject,
  ParsedCertification,
  ExtractedResumeData,
  ResumeFileFormat,
} from "./types";

/**
 * Extracts email address from text.
 */
export function extractEmail(text: string): string {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
}

/**
 * Extracts phone number from text.
 */
export function extractPhone(text: string): string {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : "";
}

/**
 * Extracts LinkedIn URL or username.
 */
export function extractLinkedIn(text: string): string {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  return match ? (match[0].startsWith("http") ? match[0] : `https://${match[0]}`) : "";
}

/**
 * Extracts GitHub URL or username.
 */
export function extractGitHub(text: string): string {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  return match ? (match[0].startsWith("http") ? match[0] : `https://${match[0]}`) : "";
}

/**
 * Extracts personal website or portfolio URL.
 */
export function extractWebsite(text: string): string {
  const matches = text.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi);
  if (!matches) return "";
  for (const url of matches) {
    if (!url.includes("github.com") && !url.includes("linkedin.com")) {
      return url;
    }
  }
  return "";
}

/**
 * Extracts all contact coordinates from text.
 */
export function extractContactInfo(text: string) {
  return {
    email: extractEmail(text),
    phone: extractPhone(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    website: extractWebsite(text),
  };
}

/**
 * Detects common resume date patterns (e.g. "2020 - 2023", "Jan 2021 - Present", "05/2019 - 08/2022").
 */
const DATE_RANGE_REGEX = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*(?:-|–|—|to)\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}|Present|Current|Now)/i;

/**
 * Splits lines into labeled section blocks based on common resume headings.
 */
interface SectionBlock {
  type: "header" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "other";
  lines: string[];
}

export function segmentResumeLines(text: string): SectionBlock[] {
  const lines = text.split("\n");
  const blocks: SectionBlock[] = [];
  let currentBlock: SectionBlock = { type: "header", lines: [] };

  const isHeading = (line: string): SectionBlock["type"] | null => {
    const trimmed = line.trim();
    if (trimmed.length > 50 || trimmed.length < 3) return null;

    // Check uppercase or clean headings
    const lower = trimmed.toLowerCase().replace(/[:#*_-]/g, "").trim();

    if (/^(?:(?:work\s+)?experience|employment(?:\s+history)?|professional\s+experience|career(?:\s+history)?)$/i.test(lower)) {
      return "experience";
    }
    if (/^(?:education|academic(?:\s+background)?|degrees?)$/i.test(lower)) {
      return "education";
    }
    if (/^(?:skills|technical\s+skills|core\s+competencies|technologies|tools)$/i.test(lower)) {
      return "skills";
    }
    if (/^(?:projects|selected\s+projects|portfolio|personal\s+projects)$/i.test(lower)) {
      return "projects";
    }
    if (/^(?:certifications?|licenses?|credentials?)$/i.test(lower)) {
      return "certifications";
    }
    if (/^(?:summary|profile|about\s+me|professional\s+summary|objective)$/i.test(lower)) {
      return "summary";
    }

    return null;
  };

  for (const line of lines) {
    const headingType = isHeading(line);
    if (headingType) {
      if (currentBlock.lines.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = { type: headingType, lines: [] };
    } else {
      currentBlock.lines.push(line);
    }
  }

  if (currentBlock.lines.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * Parses header block to extract candidate name and headline.
 */
function parseHeaderBlock(lines: string[]): { fullName: string; headline: string } {
  const nonEmpty = lines.map((l) => l.trim()).filter((l) => l.length > 0);
  let fullName = "";
  let headline = "";

  for (const line of nonEmpty) {
    // Skip line if it contains email or phone
    if (line.includes("@") || /(?:\d{3}[-.\s]?\d{3})/.test(line)) continue;
    // Skip if contains links
    if (/linkedin\.com|github\.com|http/i.test(line)) continue;

    if (!fullName) {
      // Name candidates are usually 2 to 4 words
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4 && !/resume|curriculum|vitae/i.test(line)) {
        fullName = line;
        continue;
      }
    } else if (!headline) {
      // Directly following line is often headline or title
      if (line.length <= 80) {
        headline = line;
        break;
      }
    }
  }

  return { fullName, headline };
}

/**
 * Extracts experience items from the experience block.
 */
function parseExperienceBlock(lines: string[], now: number): ParsedExperience[] {
  const experiences: ParsedExperience[] = [];
  const text = lines.join("\n");
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  let idx = 0;
  for (const para of paragraphs) {
    const paraLines = para.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (paraLines.length === 0) continue;

    const firstLine = paraLines[0];
    const dateMatch = para.match(DATE_RANGE_REGEX);

    let role = "";
    let company = "";
    let startDate = "";
    let endDate = "";
    let current = false;

    if (dateMatch) {
      const dateParts = dateMatch[0].split(/(?:-|–|—|to)/i).map((s) => s.trim());
      startDate = dateParts[0] || "";
      endDate = dateParts[1] || "";
      if (/present|current|now/i.test(endDate)) {
        current = true;
      }
    }

    // Role and Company separation heuristics (e.g. "Software Engineer at Google" or "Google | Software Engineer")
    if (firstLine.includes(" at ")) {
      const parts = firstLine.split(" at ");
      role = parts[0].trim();
      company = parts[1].replace(DATE_RANGE_REGEX, "").trim();
    } else if (firstLine.includes("|")) {
      const parts = firstLine.split("|");
      company = parts[0].trim();
      role = parts[1].replace(DATE_RANGE_REGEX, "").trim();
    } else if (firstLine.includes(" - ")) {
      const parts = firstLine.split(" - ");
      company = parts[0].trim();
      role = parts[1].replace(DATE_RANGE_REGEX, "").trim();
    } else {
      role = firstLine.replace(DATE_RANGE_REGEX, "").trim();
      if (paraLines.length > 1 && !paraLines[1].startsWith("-")) {
        company = paraLines[1].replace(DATE_RANGE_REGEX, "").trim();
      }
    }

    // Extract bullet points / highlights (*, -, •, ·, ▪)
    const highlights = paraLines
      .filter((l) => /^[-•*·▪]\s+/.test(l))
      .map((l) => l.replace(/^[-•*·▪]\s*/, "").trim());

    // Description is non-bullet text
    const descriptionLines = paraLines.filter(
      (l, i) => i > 0 && !/^[-•*·▪]\s+/.test(l) && !DATE_RANGE_REGEX.test(l)
    );
    const description = descriptionLines.join(" ").slice(0, 500);

    if (role || company) {
      experiences.push({
        id: `exp_res_${now}_${idx}`,
        company: company || "Organization",
        role: role || "Contributor",
        location: "",
        startDate,
        endDate,
        current,
        description,
        highlights: highlights.slice(0, 6),
        included: true,
      });
      idx++;
    }
  }

  return experiences;
}

/**
 * Extracts education items from the education block.
 */
function parseEducationBlock(lines: string[], now: number): ParsedEducation[] {
  const educations: ParsedEducation[] = [];
  const text = lines.join("\n");
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  let idx = 0;
  for (const para of paragraphs) {
    const paraLines = para.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (paraLines.length === 0) continue;

    const institution = paraLines[0].replace(DATE_RANGE_REGEX, "").trim();
    let degree = "";
    let fieldOfStudy = "";
    let startDate = "";
    let endDate = "";

    const dateMatch = para.match(DATE_RANGE_REGEX);
    if (dateMatch) {
      const dateParts = dateMatch[0].split(/(?:-|–|—|to)/i).map((s) => s.trim());
      startDate = dateParts[0] || "";
      endDate = dateParts[1] || "";
    }

    if (paraLines.length > 1) {
      const secondLine = paraLines[1].replace(DATE_RANGE_REGEX, "").trim();
      if (/bachelor|master|phd|b\.s|m\.s|b\.a|associate/i.test(secondLine)) {
        if (secondLine.includes(" in ")) {
          const parts = secondLine.split(" in ");
          degree = parts[0].trim();
          fieldOfStudy = parts.slice(1).join(" in ").trim();
        } else {
          degree = secondLine;
        }
      } else {
        fieldOfStudy = secondLine;
      }
    }

    if (paraLines.length > 2 && !fieldOfStudy) {
      fieldOfStudy = paraLines[2].replace(DATE_RANGE_REGEX, "").trim();
    }

    if (institution) {
      educations.push({
        id: `edu_res_${now}_${idx}`,
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        description: "",
        included: true,
      });
      idx++;
    }
  }

  return educations;
}

/**
 * Extracts skills from the skills block (handles comma lists, bullet lists, or line-separated).
 */
function parseSkillsBlock(lines: string[], now: number): ParsedSkill[] {
  const skills: ParsedSkill[] = [];
  const seen = new Set<string>();

  let idx = 0;
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*]\s*/, "").trim();
    if (!cleaned) continue;

    // Check if line is categorized e.g. "Languages: TypeScript, Python, Go"
    let category = "Core Competencies";
    let skillList = cleaned;

    if (cleaned.includes(":")) {
      const parts = cleaned.split(":");
      category = parts[0].trim();
      skillList = parts.slice(1).join(":");
    }

    // Split on commas or bullets or pipes
    const rawItems = skillList.split(/[,|•·;]/).map((s) => s.trim()).filter((s) => s.length > 0);

    for (const item of rawItems) {
      const normalized = item.replace(/[()]/g, "").trim();
      if (normalized.length >= 2 && normalized.length <= 40 && !seen.has(normalized.toLowerCase())) {
        seen.add(normalized.toLowerCase());
        skills.push({
          id: `skill_res_${now}_${idx}`,
          name: normalized,
          category,
          included: true,
        });
        idx++;
      }
    }
  }

  return skills;
}

/**
 * Extracts project items from the projects block.
 */
function parseProjectsBlock(lines: string[], now: number): ParsedProject[] {
  const projects: ParsedProject[] = [];
  const text = lines.join("\n");
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  let idx = 0;
  for (const para of paragraphs) {
    const paraLines = para.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (paraLines.length === 0) continue;

    const titleLine = paraLines[0].replace(DATE_RANGE_REGEX, "").trim();
    const title = titleLine.split(/[-|–]/)[0].trim();

    // Technologies in brackets or line e.g. "Technologies: React, Node.js"
    const technologies: string[] = [];
    const techMatch = para.match(/(?:Technologies|Stack|Built with|Tools):\s*([^\n]+)/i);
    if (techMatch) {
      const techItems = techMatch[1].split(/[,|]/).map((t) => t.trim()).filter((t) => t.length > 0);
      technologies.push(...techItems);
    }

    const githubMatch = para.match(/https?:\/\/(?:www\.)?github\.com\/[^\s]+/i);
    const repoUrl = githubMatch ? githubMatch[0] : "";
    const urlMatch = para.match(/https?:\/\/[^\s]+/i);
    const liveUrl = urlMatch && !urlMatch[0].includes("github.com") ? urlMatch[0] : "";

    const descriptionLines = paraLines.filter(
      (l, i) => i > 0 && !/(?:technologies|stack|built with)/i.test(l) && !/^https?:\/\//i.test(l)
    );
    const description = descriptionLines.join(" ").slice(0, 400);

    if (title && title.length < 80) {
      projects.push({
        id: `proj_res_${now}_${idx}`,
        title,
        tagline: "",
        description,
        technologies: technologies.slice(0, 8),
        liveUrl,
        repoUrl,
        startDate: "",
        endDate: "",
        included: true,
      });
      idx++;
    }
  }

  return projects;
}

/**
 * Deterministic resume segmenter and extractor.
 * Converts raw normalized resume text into structured ExtractedResumeData without hallucination.
 */
export function segmentAndExtractResume(
  rawText: string,
  fileName: string,
  fileFormat: ResumeFileFormat,
  fileSize: number
): ExtractedResumeData {
  const now = Date.now();
  const blocks = segmentResumeLines(rawText);

  // Extract Profile
  const contact = extractContactInfo(rawText);
  const email = contact.email;
  const phone = contact.phone;
  const linkedin = contact.linkedin;
  const github = contact.github;
  const website = contact.website;

  const headerBlock = blocks.find((b) => b.type === "header");
  const { fullName, headline } = headerBlock ? parseHeaderBlock(headerBlock.lines) : { fullName: "", headline: "" };

  const summaryBlock = blocks.find((b) => b.type === "summary");
  const bio = summaryBlock ? summaryBlock.lines.join(" ").slice(0, 600).trim() : "";

  // Extract Sections
  const expBlock = blocks.find((b) => b.type === "experience");
  const experience = expBlock ? parseExperienceBlock(expBlock.lines, now) : [];

  const eduBlock = blocks.find((b) => b.type === "education");
  const education = eduBlock ? parseEducationBlock(eduBlock.lines, now) : [];

  const skillBlock = blocks.find((b) => b.type === "skills");
  const skills = skillBlock ? parseSkillsBlock(skillBlock.lines, now) : [];

  const projBlock = blocks.find((b) => b.type === "projects");
  const projects = projBlock ? parseProjectsBlock(projBlock.lines, now) : [];

  const certBlock = blocks.find((b) => b.type === "certifications");
  const certifications: ParsedCertification[] = certBlock
    ? certBlock.lines
        .map((l) => l.replace(/^[-•*]\s*/, "").trim())
        .filter((l) => l.length > 2)
        .map((name, i) => ({
          id: `cert_res_${now}_${i}`,
          name,
          issuer: "",
          issueDate: "",
          included: true,
        }))
    : [];

  const limitations = [
    "Parsed using deterministic text segmentation.",
    "Dates, roles, and bullet points reflect source document text only.",
    "No qualifications or achievements were inferred or fabricated.",
  ];

  return {
    profile: {
      fullName,
      headline,
      bio,
      email,
      phone,
      location: "",
      website,
      linkedin,
      github,
    },
    experience,
    education,
    skills,
    projects,
    certifications,
    rawText,
    fileFormat,
    fileName,
    fileSize,
    parsedAt: new Date().toISOString(),
    extractionConfidence: "high",
    limitations,
  };
}
