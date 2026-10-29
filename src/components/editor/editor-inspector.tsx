/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PortfolioData,
  Profile,
  SocialLink,
  Project,
  Experience,
  Education,
  TemplateId,
} from "@/lib/schema/portfolio";
import { LeftNavSection } from "./editor-left-nav";
import { getAllTemplates } from "@/templates/registry";
import {
  ExperienceForm,
  EducationForm,
} from "@/components/forms";
import {
  HelpCircle,
  Download,
  ArrowLeft,
  LayoutTemplate,
  User,
  Briefcase,
  GraduationCap,
  Folder,
  Link2,
  Image as ImageIcon,
  Check,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ContentTargetField } from "@/lib/ai-assistant/types";
import { KineticProjectForm } from "./kinetic-project-form";
import { KineticSocialForm } from "./kinetic-social-form";

interface EditorInspectorProps {
  portfolio: PortfolioData;
  onChange: (updated: PortfolioData) => void;
  activeNavSection?: LeftNavSection;
  onSelectNavSection?: (section: LeftNavSection) => void;
  onTemplateChange?: (tpl: TemplateId) => void;
  onOpenAiAssist?: (field: ContentTargetField, sourceText?: string, targetId?: string) => void;
  onOpenRestyle?: () => void;
  className?: string;
}

const NAV_TABS: { id: LeftNavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "templates", label: "Template", icon: LayoutTemplate },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "assets_images", label: "Images", icon: ImageIcon },
];

export function EditorInspector({
  portfolio,
  onChange,
  activeNavSection: controlledNavSection,
  onSelectNavSection,
  onTemplateChange,
  onOpenAiAssist,
  className = "",
}: EditorInspectorProps) {
  const [internalSection, setInternalSection] = useState<LeftNavSection>("about");
  const currentSection = controlledNavSection ?? internalSection;

  const setSection = (sec: LeftNavSection) => {
    if (onSelectNavSection) {
      onSelectNavSection(sec);
    }
    setInternalSection(sec);
  };

  const [isHeroEnabled, setIsHeroEnabled] = useState(true);
  const [isStatusEnabled, setIsStatusEnabled] = useState(true);

  // Updaters (safe without falsy resets)
  const updateProfile = (patch: Partial<Profile>) => {
    onChange({
      ...portfolio,
      profile: {
        ...portfolio.profile,
        ...patch,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSocialLinksChange = (updatedSocialLinks: SocialLink[]) => {
    onChange({
      ...portfolio,
      socialLinks: updatedSocialLinks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleProjectsChange = (updatedProjects: Project[]) => {
    onChange({
      ...portfolio,
      projects: updatedProjects,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleExperienceChange = (updatedExperience: Experience[]) => {
    onChange({
      ...portfolio,
      experience: updatedExperience,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEducationChange = (updatedEducation: Education[]) => {
    onChange({
      ...portfolio,
      education: updatedEducation,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAvatarChangePrompt = () => {
    const current = portfolio.profile.avatarUrl || "/images/studio/alex-carter.jpg";
    const newUrl = window.prompt("Enter image URL for profile portrait:", current);
    if (newUrl !== null) {
      updateProfile({ avatarUrl: newUrl.trim() });
    }
  };

  const handleClearAllInfo = () => {
    if (
      window.confirm(
        "Clear all pre-written info? All personal details, projects, skills, and experience will be emptied so only what you type will be visible."
      )
    ) {
      onChange({
        ...portfolio,
        title: "",
        profile: {
          fullName: "",
          headline: "",
          bio: "",
          longBio: "",
          statusBadge: "",
          avatarUrl: "",
          location: "",
          email: "",
          phone: "",
        },
        projects: [],
        skills: [],
        experience: [],
        education: [],
        socialLinks: [],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <aside
      className={`w-full md:w-96 lg:w-[420px] bg-[#090d16] border-r border-slate-800 flex flex-col h-full shrink-0 overflow-hidden text-xs text-slate-200 ${className}`}
    >
      {/* 1. UNIFIED HEADER: Back to Templates + Clear All Info Button + Live Badge */}
      <div className="h-13 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 bg-[#070a12] gap-2">
        <Link
          href="/templates"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer group shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium hidden sm:inline">Templates</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Clear All Info Button */}
          <button
            type="button"
            onClick={handleClearAllInfo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[11px] font-semibold transition-colors cursor-pointer shadow-sm"
            title="Clear all pre-written information"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All Info</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-semibold text-emerald-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS (Clean 2-row wrap layout without any horizontal sliding or slide bars) */}
      <div className="border-b border-slate-800 bg-[#080c14] p-3 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold ring-1 ring-blue-400/40"
                    : "bg-[#0c101a] border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SCROLLABLE CONTENT BODY (Slide bar completely removed while smooth scrolling is preserved) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {currentSection === "templates" ? (
          /* TEMPLATES (Only Kinetic Studio) */
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Active Template
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kinetic Studio is your active template with kinetic typography, particle smoke cursor, and high-contrast brutalist styling.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {getAllTemplates().map((tpl) => {
                const isSelected = portfolio.appearance.templateId === tpl.metadata.id;
                return (
                  <div
                    key={tpl.metadata.id}
                    onClick={() => onTemplateChange?.(tpl.metadata.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? "bg-[#111927] border-blue-500 ring-1 ring-blue-500/40 shadow-lg"
                        : "bg-[#0c101a] border-slate-800 hover:border-slate-700 hover:bg-[#0f1422]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                            {tpl.metadata.name}
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
                            {tpl.metadata.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium leading-snug">
                          {tpl.metadata.tagline}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
                          {tpl.metadata.description}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-semibold text-blue-400 shrink-0">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </div>

                    {tpl.metadata.features && tpl.metadata.features.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 gap-1 text-[10px] text-slate-400">
                        {tpl.metadata.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentSection === "about" ? (
          /* ABOUT SECTION: Full typing enabled without fallbacks snapping back */
          <div className="space-y-4">
            {/* Hero Section Header with Switch */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">
                About &amp; Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setIsHeroEnabled((prev) => !prev)}
                className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  isHeroEnabled ? "bg-blue-600" : "bg-slate-700"
                }`}
                aria-label="Toggle Hero Section"
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    isHeroEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Name</label>
              <input
                type="text"
                value={portfolio.profile.fullName ?? ""}
                onChange={(e) => updateProfile({ fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                placeholder="Alex Carter"
              />
            </div>

            {/* Tagline Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 block">Tagline</label>
                {onOpenAiAssist && (
                  <button
                    type="button"
                    onClick={() => onOpenAiAssist("headline", portfolio.profile.headline)}
                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>AI Polish</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={portfolio.profile.headline ?? ""}
                onChange={(e) => updateProfile({ headline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                placeholder="Product Designer • Developer"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 block">Description / Bio</label>
                {onOpenAiAssist && (
                  <button
                    type="button"
                    onClick={() => onOpenAiAssist("bio", portfolio.profile.bio)}
                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>AI Polish</span>
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={portfolio.profile.bio ?? ""}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors leading-relaxed shadow-inner resize-y"
                placeholder="I create modern, user-focused digital experiences that make a difference..."
              />
            </div>

            {/* Location & Email Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">Location</label>
                <input
                  type="text"
                  value={portfolio.profile.location ?? ""}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                  placeholder="New Delhi, India"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">Email</label>
                <input
                  type="email"
                  value={portfolio.profile.email ?? ""}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Profile Portrait</label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c101a] border border-slate-800">
                <div className="w-14 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                  <img
                    src={portfolio.profile.avatarUrl || "/images/studio/alex-carter.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={portfolio.profile.avatarUrl ?? ""}
                    onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
                    placeholder="https://example.com/portrait.jpg"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Image URL or local path</span>
                    <button
                      type="button"
                      onClick={handleAvatarChangePrompt}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      Quick Prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 block">Availability Status</label>
                <button
                  type="button"
                  onClick={() => setIsStatusEnabled((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    isStatusEnabled ? "bg-blue-600" : "bg-slate-700"
                  }`}
                  aria-label="Toggle availability status"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isStatusEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {isStatusEnabled && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c101a] border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <input
                    type="text"
                    value={portfolio.profile.statusBadge ?? ""}
                    onChange={(e) => updateProfile({ statusBadge: e.target.value })}
                    className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-full"
                    placeholder="Available for new opportunities"
                  />
                </div>
              )}
            </div>

            {/* Resume File */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Resume</label>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c101a] border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium truncate">Generated CV Available</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">PDF Export</span>
              </div>
            </div>

            {/* Help Card */}
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-2 mt-4 text-left">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Need help?</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Use the navigation tabs above to edit your Experience, Education, Projects, and Social Links.
              </p>
            </div>
          </div>
        ) : currentSection === "experience" ? (
          /* EXPERIENCE */
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Work Experience
              </h3>
              <p className="text-xs text-slate-400">
                Add your career history, roles, companies, and key achievements.
              </p>
            </div>
            <ExperienceForm
              experience={portfolio.experience}
              onExperienceChange={handleExperienceChange}
              onOpenAiAssist={(field, entryId, highlightText) => {
                const entry = portfolio.experience.find((e) => e.id === entryId);
                const sourceText = field === "experience_description" ? entry?.description : highlightText;
                onOpenAiAssist?.(field, sourceText, entryId);
              }}
            />
          </div>
        ) : currentSection === "education" ? (
          /* EDUCATION */
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Education &amp; Credentials
              </h3>
              <p className="text-xs text-slate-400">
                Add your academic background, degrees, certifications, and fields of study.
              </p>
            </div>
            <EducationForm
              education={portfolio.education}
              onEducationChange={handleEducationChange}
            />
          </div>
        ) : currentSection === "projects" ? (
          /* PROJECTS (KineticProjectForm with Live Demo website preview) */
          <KineticProjectForm
            projects={portfolio.projects}
            onProjectsChange={handleProjectsChange}
          />
        ) : currentSection === "social" ? (
          /* SOCIAL LINKS (KineticSocialForm: GitHub, LinkedIn, Instagram, optional other) */
          <KineticSocialForm
            socialLinks={portfolio.socialLinks}
            onSocialLinksChange={handleSocialLinksChange}
          />
        ) : currentSection === "assets_images" ? (
          /* ASSETS: IMAGES (Profile avatar and project cover images) */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Image Assets
              </h3>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Media
              </span>
            </div>

            {/* Profile Avatar Image */}
            <div className="space-y-2 p-3 rounded-xl bg-[#0c101a] border border-slate-800">
              <label className="text-[11px] font-semibold text-slate-300 block">Profile Portrait</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                  <img
                    src={portfolio.profile.avatarUrl || "/images/studio/alex-carter.jpg"}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={portfolio.profile.avatarUrl ?? ""}
                    onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAvatarChangePrompt}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Change Image URL
                  </button>
                </div>
              </div>
            </div>

            {/* Project Images Gallery */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Project Images ({portfolio.projects?.length || 0})
              </h4>
              <div className="space-y-2.5">
                {(portfolio.projects || []).map((project, idx) => (
                  <div
                    key={project.id || idx}
                    className="p-2.5 rounded-xl bg-[#0c101a] border border-slate-800 space-y-2"
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                      {project.coverImageUrl ? (
                        <img
                          src={project.coverImageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                          No Image Uploaded
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-300 truncate">
                      {project.title || `Project #${idx + 1}`}
                    </p>
                    <input
                      type="text"
                      value={project.coverImageUrl ?? ""}
                      onChange={(e) => {
                        const updated = [...(portfolio.projects || [])];
                        updated[idx] = { ...updated[idx], coverImageUrl: e.target.value };
                        handleProjectsChange(updated);
                      }}
                      placeholder="Image URL"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export default EditorInspector;
