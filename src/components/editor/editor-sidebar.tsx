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
  ContactConfig,
} from "@/lib/schema/portfolio";
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
  ContactConfigForm,
} from "@/components/forms";
import {
  User,
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  Palette,
  SlidersHorizontal,
  Globe,
  Mail,
} from "lucide-react";
import { ContentTargetField } from "@/lib/ai-assistant/types";

export type TabKey =
  | "profile"
  | "projects"
  | "experience"
  | "skills"
  | "education"
  | "sections"
  | "appearance"
  | "seo"
  | "contact";

interface EditorSidebarProps {
  portfolio: PortfolioData;
  onChange: (updated: PortfolioData) => void;
  className?: string;
  onActiveTabChange?: (tabKey: TabKey) => void;
  onOpenAiAssist?: (field: ContentTargetField, sourceText?: string, targetId?: string) => void;
  onOpenRestyle?: () => void;
}

export function EditorSidebar({
  portfolio,
  onChange,
  className = "",
  onActiveTabChange,
  onOpenAiAssist,
  onOpenRestyle,
}: EditorSidebarProps) {
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

  const handleContactConfigChange = (updatedContact: ContactConfig) => {
    onChange({
      ...portfolio,
      contactConfig: updatedContact,
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
    { key: "seo", label: "SEO & Domain", icon: Globe },
    { key: "contact", label: "Contact", icon: Mail },
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
            onOpenAiAssist={(field) => {
              if (field === "headline") {
                onOpenAiAssist?.("headline", portfolio.profile.headline);
              } else if (field === "bio") {
                onOpenAiAssist?.("bio", portfolio.profile.bio);
              } else if (field === "long_bio") {
                onOpenAiAssist?.("long_bio", portfolio.profile.longBio);
              }
            }}
          />
        )}

        {activeTab === "projects" && (
          <ProjectForm
            projects={portfolio.projects}
            onProjectsChange={handleProjectsChange}
            onOpenAiAssist={(field, projectId) => {
              const proj = portfolio.projects.find((p) => p.id === projectId);
              const sourceText = field === "project_description" ? proj?.description : proj?.tagline;
              onOpenAiAssist?.(field, sourceText, projectId);
            }}
          />
        )}

        {activeTab === "experience" && (
          <ExperienceForm
            experience={portfolio.experience}
            onExperienceChange={handleExperienceChange}
            onOpenAiAssist={(field, entryId, highlightText) => {
              const entry = portfolio.experience.find((e) => e.id === entryId);
              const sourceText = field === "experience_description" ? entry?.description : highlightText;
              onOpenAiAssist?.(field, sourceText, entryId);
            }}
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
            onOpenRestyle={onOpenRestyle}
          />
        )}

        {activeTab === "seo" && (
          <div className="space-y-8">
            <SeoForm
              seo={portfolio.seo}
              portfolioTitle={portfolio.title}
              fullName={portfolio.profile.fullName}
              headline={portfolio.profile.headline}
              slug={portfolio.slug}
              customDomain={portfolio.customDomain?.domain}
              onSeoChange={handleSeoChange}
            />
            <div className="border-t border-zinc-800 pt-6">
              <CustomDomainForm
                portfolioId={portfolio.id}
                customDomain={portfolio.customDomain}
                onDomainChange={handleDomainChange}
              />
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <ContactConfigForm
            portfolioId={portfolio.id}
            config={
              portfolio.contactConfig || {
                enabled: true,
                title: "Get in Touch",
                description: "Feel free to reach out with project inquiries, opportunities, or questions.",
                recipientEmail: portfolio.profile.email || "",
                fields: {
                  name: true,
                  email: true,
                  subject: true,
                  message: true,
                  consent: true,
                },
              }
            }
            onChange={handleContactConfigChange}
            defaultEmail={portfolio.profile.email}
          />
        )}
      </div>
    </aside>
  );
}
