"use client";

import React, { useState } from "react";
import { Project } from "@/lib/schema/portfolio";
import { Plus, Trash2, Globe, ExternalLink, ChevronDown, ChevronUp, Monitor } from "lucide-react";

interface KineticProjectFormProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}

export function KineticProjectForm({ projects, onProjectsChange }: KineticProjectFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [previewProjectId, setPreviewProjectId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddProject = () => {
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProject: Project = {
      id: newId,
      title: "",
      tagline: "",
      description: "",
      category: "software",
      status: "completed",
      featured: false,
      visible: true,
      slug: "",
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

  const handleUpdate = (id: string, updates: Partial<Project>) => {
    onProjectsChange(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleDelete = (id: string) => {
    onProjectsChange(
      projects.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i }))
    );
    if (expandedId === id) setExpandedId(null);
    if (previewProjectId === id) setPreviewProjectId(null);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Projects</h3>
        <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
          {projects.length} added
        </span>
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <p className="text-xs text-slate-400">No projects yet</p>
          <p className="text-[11px] text-slate-500">Add your first project below</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-slate-800 overflow-hidden bg-[#0a0d16]">
              {/* Header Row */}
              <div className="flex items-center gap-2 p-2.5">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                  className="flex-1 flex items-center gap-2 text-left cursor-pointer min-w-0"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#ff5c1a]/15 border border-[#ff5c1a]/30 flex items-center justify-center shrink-0 text-[10px] font-bold text-[#ff5c1a]">
                    {(project.order ?? 0) + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {project.title || "Untitled Project"}
                    </p>
                    {project.liveUrl && (
                      <p className="text-[10px] text-[#ff5c1a] truncate">{project.liveUrl}</p>
                    )}
                  </div>
                  {expandedId === project.id ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Live Demo Preview Toggle */}
                {project.liveUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewProjectId(previewProjectId === project.id ? null : project.id)
                    }
                    title="Toggle live demo preview"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      previewProjectId === project.id
                        ? "bg-[#ff5c1a] text-white"
                        : "text-[#ff5c1a] hover:bg-[#ff5c1a]/15"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete */}
                {deleteConfirmId === project.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-600 text-white cursor-pointer hover:bg-red-500 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Edit Form */}
              {expandedId === project.id && (
                <div className="p-3 pt-0 space-y-3 border-t border-slate-800/60">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 block">Project Name *</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleUpdate(project.id, { title: e.target.value })}
                      placeholder="e.g. My Portfolio Website"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#ff5c1a]/60 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 block">Short Description</label>
                    <textarea
                      rows={2}
                      value={project.description}
                      onChange={(e) => handleUpdate(project.id, { description: e.target.value })}
                      placeholder="What does this project do?"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#ff5c1a]/60 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Live Demo URL */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#ff5c1a]" />
                      Live Demo URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={project.liveUrl}
                        onChange={(e) => handleUpdate(project.id, { liveUrl: e.target.value })}
                        placeholder="https://your-website.com"
                        className="w-full pl-2.5 pr-8 py-1.5 rounded-lg bg-[#080b12] border border-[#ff5c1a]/30 text-xs text-white focus:outline-none focus:border-[#ff5c1a] transition-colors"
                      />
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff5c1a] hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">Enter the URL of your live project website</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 block">Cover Image URL</label>
                    <input
                      type="url"
                      value={project.coverImageUrl}
                      onChange={(e) => handleUpdate(project.id, { coverImageUrl: e.target.value })}
                      placeholder="https://example.com/screenshot.jpg"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#ff5c1a]/60 transition-colors"
                    />
                  </div>

                  {project.liveUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewProjectId(previewProjectId === project.id ? null : project.id)
                      }
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#ff5c1a]/40 bg-[#ff5c1a]/10 text-[#ff5c1a] text-xs font-semibold hover:bg-[#ff5c1a]/20 transition-colors cursor-pointer"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      {previewProjectId === project.id ? "Hide Live Demo" : "Preview Live Demo"}
                    </button>
                  )}
                </div>
              )}

              {/* Live Website iframe */}
              {previewProjectId === project.id && project.liveUrl && (
                <div className="border-t border-slate-800/60">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#080b12]">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <div className="w-2 h-2 rounded-full bg-[#ff5c1a] animate-pulse" />
                      <span className="truncate max-w-[160px]">{project.liveUrl}</span>
                    </div>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#ff5c1a] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      Open <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="relative bg-slate-950" style={{ height: "220px" }}>
                    <iframe
                      src={project.liveUrl}
                      title={`Live demo: ${project.title}`}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Project */}
      <button
        type="button"
        onClick={handleAddProject}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#ff5c1a]/30 text-[#ff5c1a] text-xs font-semibold hover:border-[#ff5c1a]/60 hover:bg-[#ff5c1a]/5 transition-all cursor-pointer group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Add Project
      </button>
    </div>
  );
}

export default KineticProjectForm;

