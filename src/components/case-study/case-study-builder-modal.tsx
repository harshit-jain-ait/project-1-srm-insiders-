"use client";

import React, { useState } from "react";
import {
  Project,
  ProjectCaseStudy,
  CaseStudySection,
  CaseStudySectionType,
  createEmptyCaseStudySection,
  createEmptyCaseStudy,
  reorderCaseStudySections,
  CaseStudyMetric,
  CaseStudyMediaItem,
} from "@/lib/schema/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CaseStudyRenderer } from "./case-study-renderer";
import { CaseStudyAiModal } from "./case-study-ai-modal";
import {
  X,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  UploadCloud,
  Check,
  FileText,
  Sliders,
} from "lucide-react";

interface CaseStudyBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (updated: Project) => void;
  authorName?: string;
}

function generateLocalId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function CaseStudyBuilderModal({
  isOpen,
  onClose,
  project,
  onUpdateProject,
  authorName,
}: CaseStudyBuilderModalProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    project.caseStudy?.sections && project.caseStudy.sections.length > 0
      ? project.caseStudy.sections[0].id
      : null
  );

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const caseStudy: ProjectCaseStudy = project.caseStudy
    ? createEmptyCaseStudy(project.caseStudy)
    : createEmptyCaseStudy();

  const sections = caseStudy.sections || [];
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  // Helper to mutate project case study
  const updateCaseStudy = (updates: Partial<ProjectCaseStudy>) => {
    onUpdateProject({
      ...project,
      caseStudy: {
        ...caseStudy,
        ...updates,
      },
    });
  };

  // Add Section
  const handleAddSection = (type: CaseStudySectionType) => {
    const newSection = createEmptyCaseStudySection(type, sections.length);
    updateCaseStudy({
      sections: [...sections, newSection],
    });
    setActiveSectionId(newSection.id);
  };

  // Update specific section
  const handleUpdateSection = (id: string, updates: Partial<CaseStudySection>) => {
    updateCaseStudy({
      sections: sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  // Delete section
  const handleDeleteSection = (id: string) => {
    const remaining = sections
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx }));
    updateCaseStudy({ sections: remaining });
    if (activeSectionId === id) {
      setActiveSectionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Reorder sections
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const reordered = reorderCaseStudySections(sections, index, direction);
    updateCaseStudy({ sections: reordered });
  };

  // Toggle section visibility
  const handleToggleSectionVisibility = (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    handleUpdateSection(id, { visible: !section.visible });
  };

  // Media File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSection) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setUploadError(data.error || "File upload failed.");
      } else {
        const newMediaItem: CaseStudyMediaItem = {
          id: generateLocalId("media"),
          url: data.data.url,
          caption: file.name,
          alt: file.name,
          aspectRatio: "auto",
        };
        handleUpdateSection(activeSection.id, {
          media: [...(activeSection.media || []), newMediaItem],
        });
      }
    } catch {
      setUploadError("Network error during file upload.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Apply AI Outline
  const handleApplyAiOutline = (newSections: CaseStudySection[], overview: string) => {
    updateCaseStudy({
      overview: overview || caseStudy.overview,
      sections: newSections,
    });
    if (newSections.length > 0) {
      setActiveSectionId(newSections[0].id);
    }
  };

  // Apply AI Section Text
  const handleApplySectionText = (sectionId: string, newText: string) => {
    handleUpdateSection(sectionId, { content: newText });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col h-[94vh] overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-950/60 border border-blue-900/60 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5 text-[#356ae6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Case Study Builder</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {project.title || "Untitled Project"}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Structure your engineering, design, or research narrative with flexible sections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAiModalOpen(true)}
              className="h-8 gap-1.5 border-zinc-700 text-zinc-200 hover:bg-zinc-900"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle: Edit vs Live Preview */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-5 gap-2 shrink-0 text-xs justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "editor"
                  ? "border-[#356ae6] text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Section Builder</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "border-[#356ae6] text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Case Study Preview</span>
            </button>
          </div>

          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            {sections.length} sections defined
          </span>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {activeTab === "preview" ? (
            /* PREVIEW TAB: Renders Full Case Study */
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-950">
              <CaseStudyRenderer project={project} authorName={authorName} theme="dark" />
            </div>
          ) : (
            /* EDITOR TAB: Section List Sidebar + Active Section Workspace */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Pane: Sections Navigation & Add Controls */}
              <div className="w-full md:w-72 lg:w-80 border-r border-zinc-800 bg-zinc-950/80 flex flex-col overflow-hidden shrink-0">
                {/* Meta details bar */}
                <div className="p-3 border-b border-zinc-800 bg-zinc-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-300">Case Study Meta</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Input
                      value={caseStudy.role || ""}
                      onChange={(e) => updateCaseStudy({ role: e.target.value })}
                      placeholder="Your Role"
                      className="h-7 text-[11px]"
                    />
                    <Input
                      value={caseStudy.timeline || ""}
                      onChange={(e) => updateCaseStudy({ timeline: e.target.value })}
                      placeholder="Timeline (e.g. 3 mos)"
                      className="h-7 text-[11px]"
                    />
                  </div>
                </div>

                {/* Section List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                    Story Sections
                  </div>

                  {sections.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500 space-y-2">
                      <p>No sections yet.</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSection("text")}
                        className="text-xs h-7 border-zinc-800"
                      >
                        Add Overview
                      </Button>
                    </div>
                  ) : (
                    sections.map((section, idx) => {
                      const isActive = section.id === activeSection?.id;
                      return (
                        <div
                          key={section.id}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer group ${
                            isActive
                              ? "bg-zinc-800/90 border-[#356ae6]/60 text-white"
                              : "bg-zinc-900/40 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900"
                          }`}
                          onClick={() => setActiveSectionId(section.id)}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-zinc-500">
                                {idx + 1}.
                              </span>
                              <span className="text-xs font-medium truncate">
                                {section.title || "Untitled Section"}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono opacity-50 block truncate">
                              {section.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleMoveSection(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move section up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSection(idx, "down")}
                              disabled={idx === sections.length - 1}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move section down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSectionVisibility(section.id)}
                              className="p-1 text-zinc-500 hover:text-white cursor-pointer"
                              title={section.visible ? "Hide section" : "Show section"}
                            >
                              {section.visible ? (
                                <Eye className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-zinc-600" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSection(section.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                              title="Delete section"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Section Dropdown Bar */}
                <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 shrink-0 space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                    + Add New Section
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("text")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Narrative Text
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("problem_solution")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Challenge/Solution
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("technical_architecture")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Architecture
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("metrics")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Key Metrics
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("gallery")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Image Gallery
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("video_embed")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Video Embed
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("timeline")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Timeline
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSection("links")}
                      className="h-7 text-[11px] border-zinc-800 justify-start"
                    >
                      + Resources
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Pane: Active Section Content Workspace */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-zinc-950">
                {!activeSection ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs space-y-2">
                    <p>No section selected. Add or select a section from the left panel.</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl">
                    {/* Section Header */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                          {activeSection.type.replace("_", " ")}
                        </span>
                        <Input
                          value={activeSection.title}
                          onChange={(e) =>
                            handleUpdateSection(activeSection.id, { title: e.target.value })
                          }
                          placeholder="Section Title"
                          className="text-base font-semibold text-white bg-transparent border-transparent hover:border-zinc-800 focus:border-blue-600 px-0 h-auto"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-400">Visible</label>
                        <Switch
                          checked={activeSection.visible}
                          onCheckedChange={(checked) =>
                            handleUpdateSection(activeSection.id, { visible: checked })
                          }
                        />
                      </div>
                    </div>

                    {/* Content Textarea */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300">
                          Section Narrative & Summary
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAiModalOpen(true)}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-[#356ae6]" />
                          <span>AI Polish</span>
                        </button>
                      </div>
                      <Textarea
                        value={activeSection.content}
                        onChange={(e) =>
                          handleUpdateSection(activeSection.id, { content: e.target.value })
                        }
                        placeholder="Write detailed background, context, technical decisions, or outcomes..."
                        rows={6}
                        className="text-xs leading-relaxed"
                      />
                    </div>

                    {/* SECTION TYPE SPECIFIC CONTROLS */}

                    {/* 1. METRICS BUILDER */}
                    {activeSection.type === "metrics" && (
                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-zinc-300">
                            Quantifiable Metrics & Verified Outcomes
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newMetric: CaseStudyMetric = {
                                id: generateLocalId("metric"),
                                label: "New Metric",
                                value: "100%",
                                baseline: "",
                                period: "",
                                context: "",
                                verifiedByUser: true,
                              };
                              handleUpdateSection(activeSection.id, {
                                metrics: [...(activeSection.metrics || []), newMetric],
                              });
                            }}
                            className="h-7 text-xs border-zinc-800"
                          >
                            + Add Metric
                          </Button>
                        </div>

                        {(!activeSection.metrics || activeSection.metrics.length === 0) ? (
                          <p className="text-xs text-zinc-500 italic">No metrics added yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {activeSection.metrics.map((m, mIdx) => (
                              <div
                                key={m.id || mIdx}
                                className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    value={m.value}
                                    onChange={(e) => {
                                      const updated = [...activeSection.metrics!];
                                      updated[mIdx] = { ...m, value: e.target.value };
                                      handleUpdateSection(activeSection.id, { metrics: updated });
                                    }}
                                    placeholder="Value (e.g. 1.2M, 40ms)"
                                    className="h-8 text-xs font-mono font-bold"
                                  />
                                  <Input
                                    value={m.label}
                                    onChange={(e) => {
                                      const updated = [...activeSection.metrics!];
                                      updated[mIdx] = { ...m, label: e.target.value };
                                      handleUpdateSection(activeSection.id, { metrics: updated });
                                    }}
                                    placeholder="Label (e.g. Daily Active Users)"
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    value={m.baseline || ""}
                                    onChange={(e) => {
                                      const updated = [...activeSection.metrics!];
                                      updated[mIdx] = { ...m, baseline: e.target.value };
                                      handleUpdateSection(activeSection.id, { metrics: updated });
                                    }}
                                    placeholder="Baseline (e.g. was 200ms)"
                                    className="h-7 text-[11px]"
                                  />
                                  <Input
                                    value={m.period || ""}
                                    onChange={(e) => {
                                      const updated = [...activeSection.metrics!];
                                      updated[mIdx] = { ...m, period: e.target.value };
                                      handleUpdateSection(activeSection.id, { metrics: updated });
                                    }}
                                    placeholder="Period (e.g. Q3 2026)"
                                    className="h-7 text-[11px]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. MEDIA / GALLERY BUILDER */}
                    {(activeSection.type === "gallery" || activeSection.type === "image_caption") && (
                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-zinc-300">
                            Visual Assets & Screenshots
                          </label>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                              onChange={handleFileUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200">
                              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                              <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                            </span>
                          </label>
                        </div>

                        {uploadError && (
                          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">
                            {uploadError}
                          </div>
                        )}

                        {(!activeSection.media || activeSection.media.length === 0) ? (
                          <p className="text-xs text-zinc-500 italic">No media items attached yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {activeSection.media.map((med, medIdx) => (
                              <div
                                key={med.id || medIdx}
                                className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-start gap-3"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={med.url}
                                  alt={med.alt}
                                  className="w-16 h-16 rounded-lg object-cover border border-zinc-800 shrink-0 bg-black"
                                />
                                <div className="flex-1 space-y-1.5">
                                  <Input
                                    value={med.caption}
                                    onChange={(e) => {
                                      const updated = [...activeSection.media!];
                                      updated[medIdx] = { ...med, caption: e.target.value };
                                      handleUpdateSection(activeSection.id, { media: updated });
                                    }}
                                    placeholder="Image Caption"
                                    className="h-7 text-xs"
                                  />
                                  <Input
                                    value={med.alt}
                                    onChange={(e) => {
                                      const updated = [...activeSection.media!];
                                      updated[medIdx] = { ...med, alt: e.target.value };
                                      handleUpdateSection(activeSection.id, { media: updated });
                                    }}
                                    placeholder="Accessible Alt Text"
                                    className="h-7 text-[11px]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateSection(activeSection.id, {
                                      media: activeSection.media!.filter((_, i) => i !== medIdx),
                                    });
                                  }}
                                  className="p-1 text-zinc-500 hover:text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. VIDEO & PROTOTYPE EMBED BUILDER */}
                    {(activeSection.type === "video_embed" || activeSection.type === "prototype_embed") && (
                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                        <label className="text-xs font-semibold text-zinc-300">
                          {activeSection.type === "video_embed"
                            ? "Video URL (YouTube, Vimeo, Loom)"
                            : "Interactive Prototype URL (Figma, CodePen)"}
                        </label>
                        <Input
                          value={activeSection.embedUrl || ""}
                          onChange={(e) =>
                            handleUpdateSection(activeSection.id, { embedUrl: e.target.value })
                          }
                          placeholder="https://..."
                          className="text-xs font-mono"
                        />
                        <p className="text-[11px] text-zinc-500">
                          Embeds are safely sandboxed with restricted iframe permissions.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Back to Editor
          </Button>

          <Button
            type="button"
            variant="brand"
            size="sm"
            onClick={onClose}
            className="font-semibold gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done Editing Case Study</span>
          </Button>
        </div>
      </div>

      {/* Grounded AI Assistant Modal */}
      <CaseStudyAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        project={project}
        activeSectionId={activeSectionId}
        onApplyOutline={handleApplyAiOutline}
        onApplySectionText={handleApplySectionText}
      />
    </div>
  );
}
