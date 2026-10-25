"use client";

import React, { useState } from "react";
import {
  ExtractedResumeData,
  ParsedProfile,
  ParsedExperience,
  ParsedEducation,
  ParsedSkill,
  ParsedProject,
} from "@/lib/resume-import/types";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Sparkles,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ResumeReviewEditorProps {
  initialData: ExtractedResumeData;
  onChange: (updated: ExtractedResumeData) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function ResumeReviewEditor({
  initialData,
  onChange,
  onConfirm,
  onBack,
}: ResumeReviewEditorProps) {
  const [data, setData] = useState<ExtractedResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "projects" | "skills" | "education">("profile");

  // State for AI rewriting helper
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState("");

  const updateProfile = (field: keyof ParsedProfile, val: string) => {
    const updated = {
      ...data,
      profile: {
        ...data.profile,
        [field]: val,
      },
    };
    setData(updated);
    onChange(updated);
  };

  const updateExperience = (id: string, updates: Partial<ParsedExperience>) => {
    const updated = {
      ...data,
      experience: data.experience.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    };
    setData(updated);
    onChange(updated);
  };

  const deleteExperience = (id: string) => {
    const updated = {
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    };
    setData(updated);
    onChange(updated);
  };

  const updateProject = (id: string, updates: Partial<ParsedProject>) => {
    const updated = {
      ...data,
      projects: data.projects.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)),
    };
    setData(updated);
    onChange(updated);
  };

  const deleteProject = (id: string) => {
    const updated = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    };
    setData(updated);
    onChange(updated);
  };

  const updateEducation = (id: string, updates: Partial<ParsedEducation>) => {
    const updated = {
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    };
    setData(updated);
    onChange(updated);
  };

  const deleteEducation = (id: string) => {
    const updated = {
      ...data,
      education: data.education.filter((ed) => ed.id !== id),
    };
    setData(updated);
    onChange(updated);
  };

  const removeSkill = (id: string) => {
    const updated = {
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    };
    setData(updated);
    onChange(updated);
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;

    const newSkill: ParsedSkill = {
      id: `skill_user_${Date.now()}`,
      name: newSkillInput.trim(),
      category: "Core Competencies",
      included: true,
    };

    const updated = {
      ...data,
      skills: [...data.skills, newSkill],
    };
    setData(updated);
    onChange(updated);
    setNewSkillInput("");
  };

  // Optional AI Rewriting Request
  const handleRewriteExperience = async (exp: ParsedExperience) => {
    setRewritingId(exp.id);
    setAiError(null);

    const sourceText = [exp.description, ...exp.highlights].filter(Boolean).join("\n- ");
    if (!sourceText.trim()) {
      setRewritingId(null);
      return;
    }

    try {
      const res = await fetch("/api/resume/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "experience",
          rawText: sourceText,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        setAiError(resData.error || "AI rewriting unavailable.");
        return;
      }

      updateExperience(exp.id, {
        description: resData.data.rewrittenText,
        highlights: resData.data.highlights?.length ? resData.data.highlights : exp.highlights,
      });
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : "Error contacting AI service.");
    } finally {
      setRewritingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-sans text-zinc-100">
      {/* Top Review Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-blue-400">Step 2 of 3 • Review & Edit</span>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Review Extracted Information
          </h2>
          <p className="text-xs text-zinc-400">
            Source: <span className="font-mono text-zinc-300">{data.fileName}</span> (
            {(data.fileSize / 1024).toFixed(0)} KB)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-white">
            Upload Another
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm"
          >
            <span>Proceed to Apply</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-800 overflow-x-auto pb-px text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "border-blue-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & About</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "experience"
              ? "border-blue-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Experience ({data.experience.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "projects"
              ? "border-blue-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({data.projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "skills"
              ? "border-blue-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Skills ({data.skills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "education"
              ? "border-blue-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education ({data.education.length})</span>
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Full Name</label>
              <input
                type="text"
                value={data.profile.fullName}
                onChange={(e) => updateProfile("fullName", e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Professional Headline</label>
              <input
                type="text"
                value={data.profile.headline}
                onChange={(e) => updateProfile("headline", e.target.value)}
                placeholder="Senior Distributed Systems Architect"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Professional Bio / Summary</label>
            <textarea
              rows={3}
              value={data.profile.bio}
              onChange={(e) => updateProfile("bio", e.target.value)}
              placeholder="Brief professional background derived from your resume..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Email Address</label>
              <input
                type="text"
                value={data.profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Phone</label>
              <input
                type="text"
                value={data.profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Location</label>
              <input
                type="text"
                value={data.profile.location}
                onChange={(e) => updateProfile("location", e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">LinkedIn URL</label>
              <input
                type="text"
                value={data.profile.linkedin}
                onChange={(e) => updateProfile("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">GitHub URL</label>
              <input
                type="text"
                value={data.profile.github}
                onChange={(e) => updateProfile("github", e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPERIENCE */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {aiError && (
            <div className="p-3 rounded-lg border border-red-900 bg-red-950/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{aiError}</span>
            </div>
          )}

          {data.experience.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800 text-zinc-400 text-xs">
              No work experience entries detected in the uploaded resume.
            </div>
          ) : (
            data.experience.map((exp) => (
              <div
                key={exp.id}
                className={`p-5 rounded-xl border transition-all ${
                  exp.included
                    ? "bg-zinc-900/50 border-zinc-800"
                    : "bg-zinc-950/40 border-zinc-900 opacity-50"
                } space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`inc-${exp.id}`}
                      checked={exp.included}
                      onChange={(e) => updateExperience(exp.id, { included: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-900 text-blue-600 h-4 w-4"
                    />
                    <label htmlFor={`inc-${exp.id}`} className="text-xs font-medium text-zinc-300 cursor-pointer">
                      Include in portfolio
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRewriteExperience(exp)}
                      disabled={rewritingId === exp.id}
                      className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                      title="Polish with AI using source facts"
                    >
                      {rewritingId === exp.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                      )}
                      <span>Polish Wording</span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove entry"
                      aria-label="Remove role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Role / Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="e.g. 2021"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">End Date</label>
                    <input
                      type="text"
                      value={exp.current ? "Present" : exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-900 text-blue-600 h-3.5 w-3.5"
                      />
                      <span>Current Role</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Description / Responsibilities</label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {data.projects.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800 text-zinc-400 text-xs">
              No distinct projects section detected in the resume. You can add projects in the Studio Editor.
            </div>
          ) : (
            data.projects.map((proj) => (
              <div
                key={proj.id}
                className={`p-5 rounded-xl border transition-all ${
                  proj.included ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-950/40 border-zinc-900 opacity-50"
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-200">
                    <input
                      type="checkbox"
                      checked={proj.included}
                      onChange={(e) => updateProject(proj.id, { included: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-900 text-blue-600 h-4 w-4"
                    />
                    <span>Include in portfolio</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteProject(proj.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                    aria-label="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Description</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SKILLS */}
      {activeTab === "skills" && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Extracted Skills</h3>
            <p className="text-xs text-zinc-400">
              Derived directly from skills and tools listed in your resume. Click the &times; on any item to remove it.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-200"
              >
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-zinc-500 hover:text-white ml-0.5"
                  aria-label={`Remove ${skill.name}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Add skill form */}
          <form onSubmit={addSkill} className="flex items-center gap-2 pt-3 border-t border-zinc-800">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add additional skill..."
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-56"
            />
            <Button type="submit" variant="secondary" size="sm" className="h-8 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </form>
        </div>
      )}

      {/* TAB 5: EDUCATION */}
      {activeTab === "education" && (
        <div className="space-y-4">
          {data.education.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800 text-zinc-400 text-xs">
              No education entries detected in the uploaded resume.
            </div>
          ) : (
            data.education.map((edu) => (
              <div
                key={edu.id}
                className={`p-5 rounded-xl border transition-all ${
                  edu.included ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-950/40 border-zinc-900 opacity-50"
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                    <input
                      type="checkbox"
                      checked={edu.included}
                      onChange={(e) => updateEducation(edu.id, { included: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-900 text-blue-600 h-4 w-4"
                    />
                    <span>Include in portfolio</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteEducation(edu.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                    aria-label="Remove education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Degree / Qualification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
