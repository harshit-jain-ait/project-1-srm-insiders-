"use client";

import React, { useState } from "react";
import { PortfolioData, Profile, SocialLink, Project, Experience, Skill, Education, SectionConfig, AppearanceSettings } from "@/lib/schema/portfolio";
import {
  ProfileForm,
  ProjectForm,
  SkillsForm,
  ExperienceForm,
  EducationForm,
  SectionsForm,
  AppearanceForm,
} from "@/components/forms";
import {
  User,
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  Palette,
  SlidersHorizontal,
} from "lucide-react";

export type TabKey = "profile" | "projects" | "experience" | "skills" | "education" | "sections" | "appearance";

interface EditorSidebarProps {
  portfolio: PortfolioData;
  onChange: (updated: PortfolioData) => void;
  className?: string;
  onActiveTabChange?: (tabKey: TabKey) => void;
}

export function EditorSidebar({ portfolio, onChange, className = "", onActiveTabChange }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const handleTabSelect = (key: TabKey) => {
    setActiveTab(key);
    onActiveTabChange?.(key);
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

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: "profile", label: "Profile", icon: User },
    { key: "projects", label: "Projects", icon: Code2, count: portfolio.projects.length },
    { key: "experience", label: "Experience", icon: Briefcase, count: portfolio.experience.length },
    { key: "skills", label: "Skills", icon: Layers, count: portfolio.skills.length },
    { key: "education", label: "Education", icon: GraduationCap, count: portfolio.education.length },
    { key: "sections", label: "Layout", icon: SlidersHorizontal },
    { key: "appearance", label: "Theme", icon: Palette },
  ];

  return (
    <aside className={`w-full md:w-[440px] lg:w-[480px] border-r border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-hidden text-zinc-100 shrink-0 ${className}`}>
      {/* Category Tabs Header */}
      <div className="flex border-b border-zinc-800 overflow-x-auto p-1.5 gap-1 shrink-0 bg-zinc-900/60 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabSelect(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className="text-[10px] font-mono bg-zinc-950 px-1.5 py-0.2 rounded text-zinc-400">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Form Panel */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "profile" && (
          <ProfileForm
            profile={portfolio.profile}
            socialLinks={portfolio.socialLinks}
            onProfileChange={handleProfileChange}
            onSocialLinksChange={handleSocialLinksChange}
          />
        )}

        {activeTab === "projects" && (
          <ProjectForm
            projects={portfolio.projects}
            onProjectsChange={handleProjectsChange}
          />
        )}

        {activeTab === "experience" && (
          <ExperienceForm
            experience={portfolio.experience}
            onExperienceChange={handleExperienceChange}
          />
        )}

        {activeTab === "skills" && (
          <SkillsForm
            skills={portfolio.skills}
            onSkillsChange={handleSkillsChange}
          />
        )}

        {activeTab === "education" && (
          <EducationForm
            education={portfolio.education}
            onEducationChange={handleEducationChange}
          />
        )}

        {activeTab === "sections" && (
          <SectionsForm
            sections={portfolio.sections}
            onSectionsChange={handleSectionsChange}
          />
        )}

        {activeTab === "appearance" && (
          <AppearanceForm
            appearance={portfolio.appearance}
            onAppearanceChange={handleAppearanceChange}
          />
        )}
      </div>
    </aside>
  );
}
