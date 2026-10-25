"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AIGenerationInput,
  ToneOption,
  PurposeOption,
} from "@/lib/ai/types";
import { GeneratedPortfolioResult } from "@/lib/ai/ai-service";
import { PortfolioData, TemplateId } from "@/lib/schema/portfolio";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  KeyRound,
  RotateCw,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface AiGeneratorWizardProps {
  initialTemplate?: TemplateId;
  onApplyToExisting?: (portfolioData: Partial<PortfolioData>) => void;
  onCloseModal?: () => void;
}

type WizardStage = "details" | "preferences" | "review_input" | "generating" | "review_output";

export function AiGeneratorWizard({
  initialTemplate = "minimal-portfolio",
  onApplyToExisting,
  onCloseModal,
}: AiGeneratorWizardProps) {
  const router = useRouter();

  // Wizard Navigation State
  const [stage, setStage] = useState<WizardStage>("details");

  // Form State
  const [formData, setFormData] = useState<AIGenerationInput>({
    fullName: "",
    targetRole: "",
    background: "",
    rawSkills: "",
    rawExperience: "",
    rawProjects: "",
    rawEducation: "",
    links: [],
    preferences: {
      profession: "Software Engineering",
      tone: "professional",
      purpose: "job_search",
      contentLength: "concise",
      templateId: initialTemplate,
    },
  });

  // Loading & Error States
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMissingKey, setIsMissingKey] = useState(false);

  // Generated Output State (Editable in Stage E)
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedPortfolioResult | null>(null);
  const [excludedSections, setExcludedSections] = useState<Record<string, boolean>>({});

  // 1. Submit Full Generation Request
  const handleGenerate = async () => {
    setIsGenerating(true);
    setStage("generating");
    setError(null);
    setIsMissingKey(false);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.code === "MISSING_API_KEY") {
          setIsMissingKey(true);
          setError("Server is missing GEMINI_API_KEY. Configure it in .env.local to enable real generation.");
        } else {
          setError(json.error || "Generation request failed.");
        }
        setStage("review_input");
        return;
      }

      setGeneratedOutput(json.data);
      setStage("review_output");
    } catch {
      setError("Network or server failure. Please check if the development server is active.");
      setStage("review_input");
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Targeted Section Regeneration
  const handleRegenerateSection = async (
    section: "profile" | "projects" | "skills" | "experience" | "education",
    sourceContext: string
  ) => {
    if (!sourceContext.trim() || regeneratingSection) return;
    setRegeneratingSection(section);
    setError(null);

    try {
      const res = await fetch("/api/ai/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          sourceContext,
          tone: formData.preferences.tone,
          profession: formData.preferences.profession,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || `Failed to regenerate ${section} section.`);
        return;
      }

      // Merge regenerated section into state
      setGeneratedOutput((prev) => {
        if (!prev) return prev;
        if (section === "profile") {
          return {
            ...prev,
            profile: { ...prev.profile, ...(json.data.data || {}) },
          };
        }
        return {
          ...prev,
          [section]: json.data.data,
        };
      });
    } catch {
      setError(`Failed to regenerate ${section}.`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // 3. Apply Approved Content to Visual Studio Editor
  const handleApply = async () => {
    if (!generatedOutput) return;

    // Filter out excluded sections
    const approvedProfile = generatedOutput.profile;
    const approvedSkills = excludedSections.skills ? [] : generatedOutput.skills;
    const approvedProjects = excludedSections.projects ? [] : generatedOutput.projects;
    const approvedExperience = excludedSections.experience ? [] : generatedOutput.experience;
    const approvedEducation = excludedSections.education ? [] : generatedOutput.education;

    // A. If used as an embedded modal inside the existing editor
    if (onApplyToExisting) {
      onApplyToExisting({
        title: generatedOutput.title,
        profile: approvedProfile,
        skills: approvedSkills,
        projects: approvedProjects,
        experience: approvedExperience,
        education: approvedEducation,
        appearance: {
          templateId: generatedOutput.templateId,
          colorScheme: "system",
          accentColor: "neutral",
          fontFamily: generatedOutput.templateId === "developer-pro" ? "mono" : "sans",
        },
      });
      onCloseModal?.();
      return;
    }

    // B. Standalone flow from /generate: Persist draft to backend and redirect
    try {
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedOutput.title,
          profile: approvedProfile,
          skills: approvedSkills,
          projects: approvedProjects,
          experience: approvedExperience,
          education: approvedEducation,
          appearance: {
            templateId: generatedOutput.templateId,
            colorScheme: "system",
            accentColor: "neutral",
            fontFamily: generatedOutput.templateId === "developer-pro" ? "mono" : "sans",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        if (data.claimToken) {
          localStorage.setItem(`portfolify_claim_${data.data.id}`, data.claimToken);
        }
        router.push(`/editor?id=${data.data.id}`);
      } else {
        router.push(`/editor?template=${generatedOutput.templateId}`);
      }
    } catch {
      router.push(`/editor?template=${generatedOutput.templateId}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-zinc-100 font-sans">
      {/* Wizard Progress Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Portfolio Builder</h2>
            <p className="text-xs text-zinc-400">
              Grounded strictly in your verified notes and achievements. Zero hallucinations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
          <span className={stage === "details" ? "text-blue-400 font-semibold" : ""}>1. Facts</span>
          <span>→</span>
          <span className={stage === "preferences" ? "text-blue-400 font-semibold" : ""}>2. Style</span>
          <span>→</span>
          <span className={stage === "review_input" ? "text-blue-400 font-semibold" : ""}>3. Review</span>
          <span>→</span>
          <span className={stage === "review_output" ? "text-blue-400 font-semibold" : ""}>4. Result</span>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 text-xs text-amber-300 flex items-start gap-3">
          {isMissingKey ? (
            <KeyRound className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-medium">{error}</p>
            {isMissingKey && (
              <p className="text-zinc-400 text-[11px]">
                Add <code className="text-zinc-200">GEMINI_API_KEY=&quot;your_key&quot;</code> to your{" "}
                <code className="text-zinc-200">.env.local</code> file and restart the server.
              </p>
            )}
          </div>
        </div>
      )}

      {/* STAGE A: Personal & Professional Details */}
      {stage === "details" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                Full Name <span className="text-zinc-500 text-[11px] font-normal">(Optional)</span>
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Alex Chen"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                Target Role / Headline <span className="text-blue-400">*</span>
              </label>
              <Input
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="e.g. Senior Distributed Systems Engineer"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Career Background & Biography Notes
            </label>
            <Textarea
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              placeholder="e.g. 8 years building cloud infrastructure and high-throughput microservices. Passionate about Raft consensus and observability."
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Technical or Core Skills <span className="text-zinc-500 text-[11px] font-normal">(Comma or newline separated)</span>
            </label>
            <Input
              value={formData.rawSkills}
              onChange={(e) => setFormData({ ...formData, rawSkills: e.target.value })}
              placeholder="e.g. Go, Rust, Kubernetes, gRPC, Kafka, AWS, Prometheus"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Projects & Case Studies Notes
            </label>
            <Textarea
              value={formData.rawProjects}
              onChange={(e) => setFormData({ ...formData, rawProjects: e.target.value })}
              placeholder="e.g. Built an open-source distributed event log in Rust handling 50k events/sec. Repo: github.com/user/event-log."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                Work Experience Notes
              </label>
              <Textarea
                value={formData.rawExperience}
                onChange={(e) => setFormData({ ...formData, rawExperience: e.target.value })}
                placeholder="e.g. Staff Engineer @ Stripe (2021-Present): led streaming team. Senior SWE @ Datadog (2018-2021)."
                rows={2}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                Education & Training
              </label>
              <Textarea
                value={formData.rawEducation}
                onChange={(e) => setFormData({ ...formData, rawEducation: e.target.value })}
                placeholder="e.g. BS in Computer Engineering, University of Washington (2014-2018)."
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-[11px] text-zinc-500">Step 1 of 4: Fact Collection</span>
            <Button
              variant="brand"
              size="sm"
              disabled={!formData.targetRole.trim()}
              onClick={() => setStage("preferences")}
              className="gap-1.5"
            >
              <span>Next: Style & Tone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE B: Preferences & Tone */}
      {stage === "preferences" && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Target Profession / Domain
            </label>
            <Input
              value={formData.preferences.profession}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, profession: e.target.value },
                })
              }
              placeholder="e.g. Software Engineering, UI/UX Design, Data Science, Product Management"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2">
              Writing Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: "professional", label: "Professional", desc: "Balanced, authoritative" },
                { key: "technical", label: "Technical", desc: "Rigorous, engineering-focused" },
                { key: "editorial", label: "Editorial", desc: "Narrative, refined" },
                { key: "minimal", label: "Minimal", desc: "Direct, high signal" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, tone: t.key as ToneOption },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    formData.preferences.tone === t.key
                      ? "border-blue-500 bg-blue-950/20 text-white shadow-sm"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="block text-xs font-semibold mb-0.5">{t.label}</span>
                  <span className="block text-[10px] text-zinc-500 leading-tight">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Purpose Selector */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2">
              Portfolio Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: "job_search", label: "Job Search", desc: "Recruiter-ready" },
                { key: "freelance", label: "Freelance", desc: "Client & project pitch" },
                { key: "showcase", label: "Showcase", desc: "General public profile" },
                { key: "academic", label: "Academic", desc: "Research & publications" },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, purpose: p.key as PurposeOption },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    formData.preferences.purpose === p.key
                      ? "border-blue-500 bg-blue-950/20 text-white shadow-sm"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="block text-xs font-semibold mb-0.5">{p.label}</span>
                  <span className="block text-[10px] text-zinc-500 leading-tight">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Template Choice */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2">
              Initial Portfolio Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "minimal-portfolio",
                  name: "Minimal Portfolio",
                  desc: "Clean editorial layout, typography-focused, elegant reading experience.",
                },
                {
                  id: "developer-pro",
                  name: "Developer Pro",
                  desc: "Technical engineering portfolio with monospaced accents and architecture badges.",
                },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, templateId: tpl.id as TemplateId },
                    })
                  }
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    formData.preferences.templateId === tpl.id
                      ? "border-blue-500 bg-blue-950/20 text-white shadow-sm"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="block text-xs font-semibold mb-1 text-zinc-100">{tpl.name}</span>
                  <span className="block text-[11px] text-zinc-400 leading-relaxed font-light">
                    {tpl.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setStage("details")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </Button>
            <Button variant="brand" size="sm" onClick={() => setStage("review_input")}>
              <span>Review Input</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE C: Review Input Facts Before Calling AI */}
      {stage === "review_input" && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-blue-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            <p>
              Please review the factual notes you provided. Portfolify will polish and structure this
              exact data without inventing employers, degrees, or unprovided metrics.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 text-xs divide-y divide-zinc-800/60 font-mono text-zinc-300">
            <div className="pb-2">
              <span className="text-zinc-500 block mb-0.5 font-sans">Role / Title:</span>
              <span className="text-white font-semibold">{formData.targetRole}</span>
              {formData.fullName && <span className="text-zinc-400"> ({formData.fullName})</span>}
            </div>

            {formData.background && (
              <div className="pt-2 pb-2">
                <span className="text-zinc-500 block mb-0.5 font-sans">Background:</span>
                <p className="line-clamp-2">{formData.background}</p>
              </div>
            )}

            {formData.rawSkills && (
              <div className="pt-2 pb-2">
                <span className="text-zinc-500 block mb-0.5 font-sans">Skills:</span>
                <p>{formData.rawSkills}</p>
              </div>
            )}

            {formData.rawProjects && (
              <div className="pt-2 pb-2">
                <span className="text-zinc-500 block mb-0.5 font-sans">Projects:</span>
                <p className="line-clamp-2">{formData.rawProjects}</p>
              </div>
            )}

            {formData.rawExperience && (
              <div className="pt-2 pb-2">
                <span className="text-zinc-500 block mb-0.5 font-sans">Experience:</span>
                <p className="line-clamp-2">{formData.rawExperience}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
              <span>Tone: <strong>{formData.preferences.tone}</strong></span>
              <span>Template: <strong>{formData.preferences.templateId}</strong></span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setStage("preferences")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Edit Input</span>
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleGenerate}
              isLoading={isGenerating}
              className="gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Structured Portfolio</span>
            </Button>
          </div>
        </div>
      )}

      {/* STAGE D: Loading / Generating State */}
      {stage === "generating" && (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-blue-950/60 border border-blue-600/50 flex items-center justify-center text-blue-400 animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Structuring Your Portfolio</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Refining biographies, organizing technical competencies, and formatting project case studies based strictly on your source facts...
            </p>
          </div>
        </div>
      )}

      {/* STAGE E: Editable Review & Section Regeneration */}
      {stage === "review_output" && generatedOutput && (
        <div className="space-y-6">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Portfolio content generated successfully. Review and edit before applying.</span>
            </div>
            <Badge variant="outline" className="border-emerald-700/60 text-emerald-300 text-[10px]">
              Ready for Studio
            </Badge>
          </div>

          {/* Section: Profile */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                Profile & Headline
              </span>
              <button
                type="button"
                onClick={() =>
                  handleRegenerateSection("profile", `${formData.targetRole}\n${formData.background}`)
                }
                disabled={regeneratingSection === "profile"}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <RotateCw className={`w-3 h-3 ${regeneratingSection === "profile" ? "animate-spin" : ""}`} />
                <span>Regenerate Headline/Bio</span>
              </button>
            </div>
            <Input
              value={generatedOutput.profile.headline}
              onChange={(e) =>
                setGeneratedOutput({
                  ...generatedOutput,
                  profile: { ...generatedOutput.profile, headline: e.target.value },
                })
              }
              placeholder="Headline"
              className="text-xs font-medium"
            />
            <Textarea
              value={generatedOutput.profile.bio}
              onChange={(e) =>
                setGeneratedOutput({
                  ...generatedOutput,
                  profile: { ...generatedOutput.profile, bio: e.target.value },
                })
              }
              rows={3}
              placeholder="Biography"
              className="text-xs"
            />
          </div>

          {/* Section: Skills */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                  Skills ({generatedOutput.skills.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setExcludedSections({
                      ...excludedSections,
                      skills: !excludedSections.skills,
                    })
                  }
                  className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                    excludedSections.skills
                      ? "bg-amber-950/60 text-amber-400 border border-amber-900/40"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {excludedSections.skills ? "Excluded from portfolio" : "Included"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("skills", formData.rawSkills)}
                disabled={regeneratingSection === "skills"}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <RotateCw className={`w-3 h-3 ${regeneratingSection === "skills" ? "animate-spin" : ""}`} />
                <span>Regenerate Skills</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {generatedOutput.skills.map((skill, idx) => (
                <span
                  key={skill.id || idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono"
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setGeneratedOutput({
                        ...generatedOutput,
                        skills: generatedOutput.skills.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section: Projects */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                  Projects ({generatedOutput.projects.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setExcludedSections({
                      ...excludedSections,
                      projects: !excludedSections.projects,
                    })
                  }
                  className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                    excludedSections.projects
                      ? "bg-amber-950/60 text-amber-400 border border-amber-900/40"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {excludedSections.projects ? "Excluded" : "Included"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("projects", formData.rawProjects)}
                disabled={regeneratingSection === "projects"}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <RotateCw className={`w-3 h-3 ${regeneratingSection === "projects" ? "animate-spin" : ""}`} />
                <span>Regenerate Projects</span>
              </button>
            </div>
            <div className="space-y-3">
              {generatedOutput.projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Input
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...generatedOutput.projects];
                        updated[idx].title = e.target.value;
                        setGeneratedOutput({ ...generatedOutput, projects: updated });
                      }}
                      className="text-xs font-semibold h-7"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = generatedOutput.projects.filter((_, i) => i !== idx);
                        setGeneratedOutput({ ...generatedOutput, projects: updated });
                      }}
                      className="text-zinc-500 hover:text-red-400 ml-2 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Textarea
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...generatedOutput.projects];
                      updated[idx].description = e.target.value;
                      setGeneratedOutput({ ...generatedOutput, projects: updated });
                    }}
                    rows={2}
                    className="text-xs"
                  />
                  <div className="text-[11px] font-mono text-zinc-400">
                    Tech: {proj.technologies.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setStage("review_input")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Input</span>
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleApply}
              className="gap-1.5 font-semibold"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Launch in Studio Editor</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
