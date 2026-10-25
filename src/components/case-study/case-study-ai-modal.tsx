"use client";

import React, { useState } from "react";
import { Project, CaseStudySection, ProjectCategory } from "@/lib/schema/portfolio";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ListOrdered,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";

interface CaseStudyAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onApplyOutline: (newSections: CaseStudySection[], overview: string) => void;
  onApplySectionText: (sectionId: string, newText: string) => void;
  activeSectionId?: string | null;
}

export function CaseStudyAiModal({
  isOpen,
  onClose,
  project,
  onApplyOutline,
  onApplySectionText,
  activeSectionId,
}: CaseStudyAiModalProps) {
  const [activeTab, setActiveTab] = useState<"outline" | "refine" | "quality">("outline");
  const [notesInput, setNotesInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>(project.category || "software");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Outline generation state
  const [generatedOutline, setGeneratedOutline] = useState<{
    overview: string;
    sections: CaseStudySection[];
    explanation: string;
  } | null>(null);

  // Section refinement state
  const currentSection = (project.caseStudy?.sections || []).find((s) => s.id === activeSectionId);
  const [refineOperation, setRefineOperation] = useState<
    "improve_clarity" | "technical_refine" | "shorten" | "expand_details"
  >("improve_clarity");
  const [refinedSuggestion, setRefinedSuggestion] = useState<{
    suggestedText: string;
    explanation: string;
  } | null>(null);

  // Quality check state
  const [qualityResults, setQualityResults] = useState<{
    hasOverview: boolean;
    hasProblemStatement: boolean;
    hasApproach: boolean;
    hasOutcomes: boolean;
    hasLinksOrDemo: boolean;
    recommendations: string[];
    missingElements: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerateOutline = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedOutline(null);

    try {
      const res = await fetch("/api/ai/case-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_outline",
          title: project.title,
          category: selectedCategory,
          tagline: project.tagline,
          notes: notesInput || project.description,
          technologies: project.technologies,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to generate outline.");
      } else {
        setGeneratedOutline({
          overview: data.data.overview,
          sections: data.data.suggestedSections,
          explanation: data.data.explanation,
        });
      }
    } catch {
      setErrorMsg("Network error communicating with AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineSection = async () => {
    if (!currentSection || !currentSection.content.trim()) {
      setErrorMsg("Select a section with content to refine.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setRefinedSuggestion(null);

    try {
      const res = await fetch("/api/ai/case-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "improve_section",
          sectionTitle: currentSection.title,
          sectionType: currentSection.type,
          sourceText: currentSection.content,
          operation: refineOperation,
          projectContext: `${project.title}: ${project.tagline || project.description}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to refine text.");
      } else {
        setRefinedSuggestion(data.data);
      }
    } catch {
      setErrorMsg("Network error communicating with AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQualityCheck = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/case-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quality_check",
          sections: project.caseStudy?.sections || [],
          projectTitle: project.title,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to run quality check.");
      } else {
        setQualityResults(data.data);
      }
    } catch {
      setErrorMsg("Network error running quality check.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-zinc-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-950/60 border border-blue-900/60 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5 text-[#356ae6]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Case Study AI Assistant</h2>
              <p className="text-xs text-zinc-400">
                Generate structured outlines, polish section narrative, and review completeness.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-5 gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("outline")}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "outline"
                ? "border-[#356ae6] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Generate Outline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("refine")}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "refine"
                ? "border-[#356ae6] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Refine Section</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("quality");
              if (!qualityResults) handleRunQualityCheck();
            }}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "quality"
                ? "border-[#356ae6] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Completeness Check</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OUTLINE GENERATION */}
          {activeTab === "outline" && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs space-y-1">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Anti-Hallucination Guardrails
                </span>
                <p className="text-zinc-400 font-light text-[11px]">
                  Portfolify will never invent fake metrics, client names, team sizes, or awards. Outlines are built strictly around your actual provided notes.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Project Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ProjectCategory)}
                  className="w-full h-8 rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="software">Software & Web Development</option>
                  <option value="design">UI/UX & Product Design</option>
                  <option value="engineering">Hardware & Systems Engineering</option>
                  <option value="research">Scientific & Academic Research</option>
                  <option value="business">Business & Entrepreneurship</option>
                  <option value="creative">Creative & Visual Arts</option>
                  <option value="writing">Technical Writing & Documentation</option>
                  <option value="other">General Project</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Your Rough Notes & Context (Optional)
                </label>
                <Textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Paste rough notes, architectural constraints, key problems solved, or technologies used..."
                  rows={4}
                  className="text-xs"
                />
              </div>

              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={handleGenerateOutline}
                isLoading={isLoading}
                className="w-full gap-2 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Case Study Outline</span>
              </Button>

              {generatedOutline && (
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">
                      Suggested Outline ({generatedOutline.sections.length} Sections):
                    </span>
                    <Button
                      type="button"
                      variant="brand"
                      size="sm"
                      onClick={() => {
                        onApplyOutline(generatedOutline.sections, generatedOutline.overview);
                        onClose();
                      }}
                      className="h-7 text-xs font-semibold gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Outline to Project</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {generatedOutline.sections.map((sec, i) => (
                      <div
                        key={sec.id || i}
                        className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{sec.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                            {sec.type}
                          </span>
                        </div>
                        {sec.content && (
                          <p className="text-zinc-400 font-light text-[11px] line-clamp-2">
                            {sec.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SECTION REFINEMENT */}
          {activeTab === "refine" && (
            <div className="space-y-5">
              {!currentSection ? (
                <div className="p-8 text-center text-xs text-zinc-500 space-y-2">
                  <HelpCircle className="w-6 h-6 mx-auto opacity-50" />
                  <p>Open a section in the Case Study Builder first to refine its text.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-zinc-400">Target Section:</span>{" "}
                      <span className="font-semibold text-white">{currentSection.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{currentSection.type}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Refinement Goal</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: "improve_clarity", label: "Improve Clarity & Flow" },
                        { id: "technical_refine", label: "Make More Technical" },
                        { id: "shorten", label: "Condense & Shorten" },
                        { id: "expand_details", label: "Expand with Guidance" },
                      ].map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setRefineOperation(op.id as typeof refineOperation)}
                          className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                            refineOperation === op.id
                              ? "bg-blue-950/40 border-blue-800 text-white"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="brand"
                    size="sm"
                    onClick={handleRefineSection}
                    isLoading={isLoading}
                    className="w-full gap-2 font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Refinement</span>
                  </Button>

                  {refinedSuggestion && (
                    <div className="pt-4 border-t border-zinc-800 space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-zinc-300">Original Text:</span>
                        <div className="p-3 rounded-xl border border-zinc-850 bg-zinc-900/40 text-xs text-zinc-400">
                          {currentSection.content}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-emerald-400">
                          Proposed Revision:
                        </span>
                        <div className="p-3 rounded-xl border border-emerald-900/60 bg-emerald-950/20 text-xs text-zinc-200 leading-relaxed">
                          {refinedSuggestion.suggestedText}
                        </div>
                        <p className="text-[11px] text-zinc-400 italic">
                          {refinedSuggestion.explanation}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setRefinedSuggestion(null)}
                        >
                          Reject
                        </Button>
                        <Button
                          type="button"
                          variant="brand"
                          size="sm"
                          onClick={() => {
                            onApplySectionText(currentSection.id, refinedSuggestion.suggestedText);
                            onClose();
                          }}
                          className="gap-1.5 font-semibold"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Apply</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QUALITY & COMPLETENESS REVIEW */}
          {activeTab === "quality" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">Completeness Evaluation</h3>
                  <p className="text-[11px] text-zinc-400">
                    Objective checklist to verify that essential case study sections are present.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRunQualityCheck}
                  isLoading={isLoading}
                  className="h-7 text-xs border-zinc-800"
                >
                  Re-check
                </Button>
              </div>

              {qualityResults && (
                <div className="space-y-4">
                  {/* Checklist */}
                  <div className="space-y-2">
                    {[
                      { label: "High-Level Overview", present: qualityResults.hasOverview },
                      { label: "Problem / Challenge Statement", present: qualityResults.hasProblemStatement },
                      { label: "Approach / Architecture", present: qualityResults.hasApproach },
                      { label: "Measurable Outcomes / Results", present: qualityResults.hasOutcomes },
                      { label: "Live Demo or Repository Links", present: qualityResults.hasLinksOrDemo },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                          item.present
                            ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.present ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Present
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-medium">
                            Optional / Missing
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  {qualityResults.recommendations.length > 0 && (
                    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                      <span className="text-xs font-semibold text-zinc-200">
                        Actionable Recommendations:
                      </span>
                      <ul className="list-disc list-inside space-y-1.5 text-[11px] text-zinc-400">
                        {qualityResults.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Feedback & Error Display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-end shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
