/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  PortfolioData,
  Profile,
  SocialLink,
  Project,
  Experience,
  Skill,
  Education,
  SectionConfig,
  AppearanceSettings,
  SeoSettings,
  CustomDomainConfig,
  TemplateId,
} from "@/lib/schema/portfolio";
import { LeftNavSection } from "./editor-left-nav";
import { getAllTemplates } from "@/templates/registry";
import {
  ProfileForm,
  ProjectForm,
  SkillsForm,
  ExperienceForm,
  EducationForm,
  SectionsForm,
  AppearanceForm,
  SeoForm,
  CustomDomainForm,
} from "@/components/forms";
import {
  HelpCircle,
  Download,
  ChevronDown,
  ChevronRight,
  FileText,
  Link2,
  Code2,
  Folder,
  Check,
} from "lucide-react";
import { ContentTargetField } from "@/lib/ai-assistant/types";

interface EditorInspectorProps {
  portfolio: PortfolioData;
  onChange: (updated: PortfolioData) => void;
  activeNavSection: LeftNavSection;
  onTemplateChange?: (tpl: TemplateId) => void;
  onOpenAiAssist?: (field: ContentTargetField, sourceText?: string, targetId?: string) => void;
  onOpenRestyle?: () => void;
  className?: string;
}

export function EditorInspector({
  portfolio,
  onChange,
  activeNavSection,
  onTemplateChange,
  onOpenAiAssist,
  onOpenRestyle,
  className = "",
}: EditorInspectorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "layout">("content");
  const [isHeroEnabled, setIsHeroEnabled] = useState(true);
  const [isStatusEnabled, setIsStatusEnabled] = useState(true);

  // Accordion open states
  const [isSocialAccordionOpen, setIsSocialAccordionOpen] = useState(false);
  const [isTechAccordionOpen, setIsTechAccordionOpen] = useState(false);
  const [isProjectsAccordionOpen, setIsProjectsAccordionOpen] = useState(false);

  // Updaters
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

  const handleProfileChange = (updatedProfile: Profile) => {
    onChange({
      ...portfolio,
      profile: updatedProfile,
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

  const handleSkillsChange = (updatedSkills: Skill[]) => {
    onChange({
      ...portfolio,
      skills: updatedSkills,
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

  const handleSectionsChange = (updatedSections: SectionConfig[]) => {
    onChange({
      ...portfolio,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAppearanceChange = (updatedAppearance: AppearanceSettings) => {
    onChange({
      ...portfolio,
      appearance: updatedAppearance,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSeoChange = (updatedSeo: SeoSettings) => {
    onChange({
      ...portfolio,
      seo: updatedSeo,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDomainChange = (updatedDomain: CustomDomainConfig) => {
    onChange({
      ...portfolio,
      customDomain: updatedDomain,
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

  return (
    <aside
      className={`w-80 lg:w-96 bg-[#080b12] border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none overflow-hidden text-xs text-slate-200 ${className}`}
    >
      {/* Top Tabs: Content | Layout */}
      <div className="h-12 border-b border-slate-800/80 flex items-center px-4 gap-6 shrink-0 bg-[#07090e]">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`h-full relative font-semibold text-xs flex items-center transition-colors cursor-pointer ${
            activeTab === "content"
              ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("layout")}
          className={`h-full relative font-semibold text-xs flex items-center transition-colors cursor-pointer ${
            activeTab === "layout"
              ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Layout
        </button>
      </div>

      {/* Main Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left">
        {activeTab === "layout" ? (
          /* Layout & Sections Manager */
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
              Section Visibility &amp; Order
            </h3>
            <SectionsForm sections={portfolio.sections} onSectionsChange={handleSectionsChange} />
          </div>
        ) : activeNavSection === "templates" ? (
          /* Dedicated Visual Template Gallery */
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Portfolio Templates
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Switch between 8 handcrafted templates anytime. Your content, projects, and personal data are 100% preserved.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {getAllTemplates().map((tpl) => {
                const isSelected = portfolio.appearance.templateId === tpl.metadata.id;
                return (
                  <div
                    key={tpl.metadata.id}
                    onClick={() => {
                      if (onTemplateChange) {
                        onTemplateChange(tpl.metadata.id);
                      } else {
                        handleAppearanceChange({
                          ...portfolio.appearance,
                          templateId: tpl.metadata.id,
                        });
                      }
                    }}
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

                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-semibold text-blue-400 shrink-0">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold border border-slate-700/80 shrink-0 transition-colors"
                        >
                          Select
                        </button>
                      )}
                    </div>

                    {tpl.metadata.features && tpl.metadata.features.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 gap-1 text-[10px] text-slate-400">
                        {tpl.metadata.features.slice(0, 2).map((feat, idx) => (
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
        ) : activeNavSection === "projects" ? (
          <ProjectForm
            projects={portfolio.projects}
            onProjectsChange={handleProjectsChange}
            onOpenAiAssist={(field, projectId) => {
              const proj = portfolio.projects.find((p) => p.id === projectId);
              const sourceText = field === "project_description" ? proj?.description : proj?.tagline;
              onOpenAiAssist?.(field, sourceText, projectId);
            }}
          />
        ) : activeNavSection === "experience" ? (
          <ExperienceForm
            experience={portfolio.experience}
            onExperienceChange={handleExperienceChange}
            onOpenAiAssist={(field, entryId, highlightText) => {
              const entry = portfolio.experience.find((e) => e.id === entryId);
              const sourceText = field === "experience_description" ? entry?.description : highlightText;
              onOpenAiAssist?.(field, sourceText, entryId);
            }}
          />
        ) : activeNavSection === "education" ? (
          <EducationForm education={portfolio.education} onEducationChange={handleEducationChange} />
        ) : activeNavSection === "about" ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
              About &amp; Biography
            </h3>
            <ProfileForm
              profile={portfolio.profile}
              socialLinks={portfolio.socialLinks}
              onProfileChange={handleProfileChange}
              onSocialLinksChange={handleSocialLinksChange}
              onOpenAiAssist={(field) => {
                if (field === "headline") onOpenAiAssist?.("headline", portfolio.profile.headline);
                if (field === "bio") onOpenAiAssist?.("bio", portfolio.profile.bio);
                if (field === "long_bio") onOpenAiAssist?.("long_bio", portfolio.profile.longBio);
              }}
            />
          </div>
        ) : activeNavSection === "social" ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
              Social Links &amp; Profiles
            </h3>
            <ProfileForm
              profile={portfolio.profile}
              socialLinks={portfolio.socialLinks}
              onProfileChange={handleProfileChange}
              onSocialLinksChange={handleSocialLinksChange}
            />
          </div>
        ) : activeNavSection === "settings" ? (
          <div className="space-y-6">
            <SeoForm
              seo={portfolio.seo}
              portfolioTitle={portfolio.title}
              fullName={portfolio.profile.fullName}
              headline={portfolio.profile.headline}
              slug={portfolio.slug}
              customDomain={portfolio.customDomain?.domain}
              onSeoChange={handleSeoChange}
            />
            <div className="border-t border-slate-800 pt-4">
              <CustomDomainForm
                portfolioId={portfolio.id}
                customDomain={portfolio.customDomain}
                onDomainChange={handleDomainChange}
              />
            </div>
          </div>
        ) : activeNavSection === "style" || activeNavSection === "colors" || activeNavSection === "typography" || activeNavSection === "background" ? (
          <AppearanceForm
            appearance={portfolio.appearance}
            onAppearanceChange={handleAppearanceChange}
            onOpenRestyle={onOpenRestyle}
          />
        ) : (
          /* DEFAULT: Exact Hero Section & Content Inspector from Reference Image */
          <div className="space-y-4">
            {/* Hero Section Header with Switch */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <h3 className="text-xs font-bold text-white">Hero Section</h3>
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
                value={portfolio.profile.fullName || "Alex Carter"}
                onChange={(e) => updateProfile({ fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                placeholder="Alex Carter"
              />
            </div>

            {/* Tagline Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Tagline</label>
              <input
                type="text"
                value={portfolio.profile.headline || "Product Designer • Developer"}
                onChange={(e) => updateProfile({ headline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                placeholder="Product Designer • Developer"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Description</label>
              <textarea
                rows={3}
                value={
                  portfolio.profile.bio ||
                  "I create modern, user-focused digital experiences that make a difference. Passionate about design, technology and building meaningful products."
                }
                onChange={(e) => updateProfile({ bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c101a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors leading-relaxed shadow-inner"
                placeholder="Brief professional summary..."
              />
            </div>

            {/* Profile Image */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Profile Image</label>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0c101a] border border-slate-800">
                <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                  <img
                    src={portfolio.profile.avatarUrl || "/images/studio/alex-carter.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAvatarChangePrompt}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Change Image
                </button>
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
                    value={portfolio.profile.statusBadge || "Available for new opportunities"}
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
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium truncate">resume.pdf</span>
                </div>
                <button
                  type="button"
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Download / preview resume"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Collapsible Accordion: Social Links */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0a0d16]">
              <button
                type="button"
                onClick={() => setIsSocialAccordionOpen((prev) => !prev)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <Link2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-xs">Social Links</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>{portfolio.socialLinks?.length || 5} links added</span>
                  {isSocialAccordionOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>
              {isSocialAccordionOpen && (
                <div className="p-3 border-t border-slate-800/80 bg-[#080b12]">
                  <ProfileForm
                    profile={portfolio.profile}
                    socialLinks={portfolio.socialLinks}
                    onProfileChange={handleProfileChange}
                    onSocialLinksChange={handleSocialLinksChange}
                  />
                </div>
              )}
            </div>

            {/* Collapsible Accordion: Technologies */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0a0d16]">
              <button
                type="button"
                onClick={() => setIsTechAccordionOpen((prev) => !prev)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-xs">Technologies</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>{portfolio.skills?.length || 8} technologies</span>
                  {isTechAccordionOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>
              {isTechAccordionOpen && (
                <div className="p-3 border-t border-slate-800/80 bg-[#080b12]">
                  <SkillsForm skills={portfolio.skills} onSkillsChange={handleSkillsChange} />
                </div>
              )}
            </div>

            {/* Collapsible Accordion: Projects */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0a0d16]">
              <button
                type="button"
                onClick={() => setIsProjectsAccordionOpen((prev) => !prev)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-xs">Projects</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>{portfolio.projects?.length || 3} projects</span>
                  {isProjectsAccordionOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>
              {isProjectsAccordionOpen && (
                <div className="p-3 border-t border-slate-800/80 bg-[#080b12]">
                  <ProjectForm
                    projects={portfolio.projects}
                    onProjectsChange={handleProjectsChange}
                  />
                </div>
              )}
            </div>

            {/* Bottom Help Card */}
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-2 mt-4 text-left">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Need help?</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Check out the template documentation for more customization options.
              </p>
              <button
                type="button"
                className="w-full py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
              >
                Open Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default EditorInspector;
