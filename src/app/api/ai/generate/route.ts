import { NextRequest, NextResponse } from "next/server";

interface RawSkill {
  id?: string;
  name?: string;
  category?: string;
}

interface RawProject {
  id?: string;
  title?: string;
  tagline?: string;
  description?: string;
  technologies?: string[];
  liveUrl?: string;
  repoUrl?: string;
}

interface RawExperience {
  id?: string;
  company?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          code: "MISSING_API_KEY",
          error: "GEMINI_API_KEY is not configured on the server.",
        },
        { status: 400 }
      );
    }

    const { facts } = await req.json();
    if (!facts || typeof facts !== "string" || facts.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Facts prompt cannot be empty" },
        { status: 400 }
      );
    }

    const systemInstruction = `
You are the Portfolify AI Extraction and Structuring Engine.
Strict Rules:
1. ONLY extract information that is explicitly stated or directly implied in the user's input.
2. DO NOT invent employers, degrees, GPA, certifications, customer logos, testimonials, or metrics.
3. If an email, location, or link is not mentioned, leave it empty.
4. Output MUST be valid JSON adhering to this exact structure:
{
  "profile": {
    "fullName": string,
    "headline": string,
    "bio": string,
    "location": string,
    "email": string,
    "statusBadge": string
  },
  "skills": [
    { "id": string, "name": string, "category": string }
  ],
  "projects": [
    {
      "id": string,
      "title": string,
      "tagline": string,
      "description": string,
      "technologies": string[],
      "liveUrl": string,
      "repoUrl": string
    }
  ],
  "experience": [
    {
      "id": string,
      "company": string,
      "role": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "description": string,
      "highlights": string[]
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\nUser Input Facts:\n${facts}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Gemini API error]", errText);
      return NextResponse.json(
        { success: false, error: "AI provider request failed." },
        { status: 502 }
      );
    }

    const result = await response.json();
    const rawContent = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json(
        { success: false, error: "No structured response received from model." },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(rawContent);

    // Ensure IDs exist for extracted items
    if (Array.isArray(parsedData.skills)) {
      parsedData.skills = parsedData.skills.map((s: RawSkill, i: number) => ({
        id: s.id || `skill_${Date.now()}_${i}`,
        name: s.name || "",
        category: s.category || "General",
      }));
    }

    if (Array.isArray(parsedData.projects)) {
      parsedData.projects = parsedData.projects.map((p: RawProject, i: number) => ({
        id: p.id || `proj_${Date.now()}_${i}`,
        title: p.title || "Untitled Project",
        tagline: p.tagline || "",
        description: p.description || "",
        featured: false,
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        liveUrl: p.liveUrl || "",
        repoUrl: p.repoUrl || "",
        coverImageUrl: "",
      }));
    }

    if (Array.isArray(parsedData.experience)) {
      parsedData.experience = parsedData.experience.map((e: RawExperience, i: number) => ({
        id: e.id || `exp_${Date.now()}_${i}`,
        company: e.company || "",
        role: e.role || "",
        location: e.location || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        current: !!e.current,
        description: e.description || "",
        highlights: Array.isArray(e.highlights) ? e.highlights : [],
      }));
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate structured portfolio";
    console.error("[API/ai/generate] error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
