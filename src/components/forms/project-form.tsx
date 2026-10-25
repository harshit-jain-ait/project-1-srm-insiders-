"use client";

import React, { useState } from "react";
import { Project, isSafeHttpUrl } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormLabel, FormHelperText, FormErrorMessage } from "@/components/ui/form-field";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Code2,
  X,
  Sparkles,
} from "lucide-react";

interface ProjectFormProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  onOpenAiAssist?: (field: "project_description" | "project_tagline", projectId: string) => void;
}

export function ProjectForm({ projects, onProjectsChange, onOpenAiAssist }: ProjectFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddProject = () => {
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProject: Project = {
      id: newId,
      title: "",
      tagline: "",
      description: "",
      featured: false,
      technologies: [],
      liveUrl: "",
      repoUrl: "",
      coverImageUrl: "",
      startDate: "",
      endDate: "",
      order: projects.length,
    };
    onProjectsChange([...projects, newProject]);
    setExpandedId(newId);
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    onProjectsChange(
      projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    onProjectsChange(
      projects
        .filter((p) => p.id !== id)
        .map((p, index) => ({ ...p, order: index }))
    );
    if (expandedId === id) {
      setExpandedId(null);
    }
    setDeleteConfirmId(null);
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const copy = [...projects];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    onProjectsChange(copy.map((p, i) => ({ ...p, order: i })));
  };

  // Technology Tag management
  const handleAddTechTag = (projectId: string) => {
    const val = (tagInputs[projectId] || "").trim();
    if (!val) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    if (!project.technologies.some((t) => t.toLowerCase() === val.toLowerCase())) {
      handleUpdateProject(projectId, {
        technologies: [...project.technologies, val],
      });
    }

    setTagInputs((prev) => ({ ...prev, [projectId]: "" }));
  };

  const handleRemoveTechTag = (projectId: string, tagToRemove: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    handleUpdateProject(projectId, {
      technologies: project.technologies.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Projects</h3>
          <p className="text-xs text-zinc-400">
            Showcase technical work, architectures, or production case studies.
          </p>
        </div>
        <Button
          type="button"
          variant="brand"
          size="sm"
          onClick={handleAddProject}
          className="h-8 text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center space-y-3">
          <Code2 className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-300">No projects added</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Add your key projects, open-source repositories, or system case studies to populate your portfolio.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProject}
            className="text-xs border-zinc-700 text-zinc-300"
          >
            Create first project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            const isLiveUrlInvalid =
              Boolean(project.liveUrl) && !isSafeHttpUrl(project.liveUrl);
            const isRepoUrlInvalid =
              Boolean(project.repoUrl) && !isSafeHttpUrl(project.repoUrl);

            return (
              <div
                key={project.id}
                className="rounded-xl border border-zinc-850 bg-zinc-900/50 overflow-hidden transition-all"
              >
                {/* Project Header Bar */}
                <div className="p-3.5 flex items-center justify-between bg-zinc-900/80 border-b border-zinc-850/80">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : project.id)}
                      className="flex items-center gap-2 text-left hover:text-white transition-colors cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-zinc-200 truncate">
                        {project.title.trim() || `Untitled Project #${index + 1}`}
                      </span>
                    </button>
                    {project.featured && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.2 rounded">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions: Reorder and Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveProject(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move up"
                      aria-label="Move project up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveProject(index, "down")}
                      disabled={index === projects.length - 1}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move down"
                      aria-label="Move project down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete project"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deletion Confirmation Banner */}
                {deleteConfirmId === project.id && (
                  <div className="p-3 bg-red-950/40 border-b border-red-800/60 flex items-center justify-between text-xs text-red-200">
                    <span>Delete this project entry?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(null)}
                        className="h-6 text-xs text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="h-6 text-xs"
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}

                {/* Collapsible Project Form Fields */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {/* Title & Featured Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <FormLabel htmlFor={`proj-title-${project.id}`} required>
                          Project Title
                        </FormLabel>
                        <Input
                          id={`proj-title-${project.id}`}
                          value={project.title}
                          onChange={(e) =>
                            handleUpdateProject(project.id, { title: e.target.value })
                          }
                          placeholder="e.g. Distributed Event Log"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1 sm:pt-4">
                        <Switch
                          id={`proj-feat-${project.id}`}
                          checked={project.featured}
                          onCheckedChange={(checked) =>
                            handleUpdateProject(project.id, { featured: checked })
                          }
                        />
                        <label
                          htmlFor={`proj-feat-${project.id}`}
                          className="text-xs text-zinc-300 font-medium cursor-pointer"
                        >
                          Highlight as Featured
                        </label>
                      </div>
                    </div>

                    {/* Tagline */}
                    <div>
                      <FormLabel htmlFor={`proj-tagline-${project.id}`}>
                        Short Tagline
                      </FormLabel>
                      <Input
                        id={`proj-tagline-${project.id}`}
                        value={project.tagline}
                        onChange={(e) =>
                          handleUpdateProject(project.id, { tagline: e.target.value })
                        }
                        placeholder="e.g. Sub-millisecond stream ingestion with zero dataloss"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor={`proj-desc-${project.id}`}>
                          Detailed Summary / Case Study
                        </FormLabel>
                        {onOpenAiAssist && (
                          <button
                            type="button"
                            onClick={() => onOpenAiAssist("project_description", project.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                            title="Improve project description with AI Content Assistant"
                          >
                            <Sparkles className="w-3 h-3 text-[#356ae6]" />
                            <span>AI Improve</span>
                          </button>
                        )}
                      </div>
                      <Textarea
                        id={`proj-desc-${project.id}`}
                        value={project.description}
                        onChange={(e) =>
                          handleUpdateProject(project.id, { description: e.target.value })
                        }
                        placeholder="Explain the architectural requirements, design trade-offs, and measurable impact."
                        rows={4}
                      />
                    </div>

                    {/* Technologies Tag Manager */}
                    <div className="space-y-2">
                      <FormLabel htmlFor={`proj-tech-input-${project.id}`}>
                        Technologies & Tools
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`proj-tech-input-${project.id}`}
                          value={tagInputs[project.id] || ""}
                          onChange={(e) =>
                            setTagInputs((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTechTag(project.id);
                            }
                          }}
                          placeholder="Type tech (e.g. Rust, ClickHouse, Docker) and press Enter"
                          className="h-8 text-xs font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTechTag(project.id)}
                          className="h-8 text-xs border-zinc-700"
                        >
                          Add
                        </Button>
                      </div>

                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-1 text-[11px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                            >
                              <span>{tech}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTechTag(project.id, tech)}
                                className="text-zinc-500 hover:text-red-400 cursor-pointer"
                                aria-label={`Remove ${tech}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <FormLabel htmlFor={`proj-live-${project.id}`}>
                          Live Project URL (Optional)
                        </FormLabel>
                        <div className="relative">
                          <ExternalLink className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
                          <Input
                            id={`proj-live-${project.id}`}
                            value={project.liveUrl}
                            onChange={(e) =>
                              handleUpdateProject(project.id, { liveUrl: e.target.value })
                            }
                            placeholder="https://app.example.com"
                            className="h-8 text-xs pl-8 font-mono"
                            hasError={isLiveUrlInvalid}
                          />
                        </div>
                        {isLiveUrlInvalid && (
                          <FormErrorMessage message="Must be a valid HTTP or HTTPS address" />
                        )}
                      </div>

                      <div>
                        <FormLabel htmlFor={`proj-repo-${project.id}`}>
                          Repository URL (Optional)
                        </FormLabel>
                        <div className="relative">
                          <Code2 className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
                          <Input
                            id={`proj-repo-${project.id}`}
                            value={project.repoUrl}
                            onChange={(e) =>
                              handleUpdateProject(project.id, { repoUrl: e.target.value })
                            }
                            placeholder="https://github.com/..."
                            className="h-8 text-xs pl-8 font-mono"
                            hasError={isRepoUrlInvalid}
                          />
                        </div>
                        {isRepoUrlInvalid && (
                          <FormErrorMessage message="Must be a valid HTTP or HTTPS address" />
                        )}
                      </div>
                    </div>

                    {/* Optional Cover Image */}
                    <div>
                      <FormLabel htmlFor={`proj-img-${project.id}`}>
                        Cover Image URL (Optional)
                      </FormLabel>
                      <Input
                        id={`proj-img-${project.id}`}
                        value={project.coverImageUrl}
                        onChange={(e) =>
                          handleUpdateProject(project.id, { coverImageUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="h-8 text-xs font-mono"
                      />
                      <FormHelperText>
                        Optional visual preview for card headers in publication templates.
                      </FormHelperText>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
