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

  const categories = [
    {
      title: "Content",
      items: [
        { key: "profile" as TabKey, label: "Personal Info", icon: User },
        { key: "projects" as TabKey, label: "Projects", icon: Code2, count: portfolio.projects.length },
        { key: "experience" as TabKey, label: "Experience", icon: Briefcase, count: portfolio.experience.length },
        { key: "skills" as TabKey, label: "Skills", icon: Layers, count: portfolio.skills.length },
        { key: "education" as TabKey, label: "Education", icon: GraduationCap, count: portfolio.education.length },
        { key: "contact" as TabKey, label: "Contact", icon: Mail },
      ],
    },
    {
      title: "Design",
      items: [
        { key: "appearance" as TabKey, label: "Appearance", icon: Palette },
        { key: "sections" as TabKey, label: "Layout", icon: SlidersHorizontal },
      ],
    },
    {
      title: "Settings",
      items: [
        { key: "seo" as TabKey, label: "SEO & Domain", icon: Globe },
      ],
    },
  ];

  return (
    <aside className={`w-full md:w-[500px] lg:w-[560px] border-r border-zinc-800 bg-[#0c0f18] flex flex-col md:flex-row h-full overflow-hidden text-zinc-100 shrink-0 ${className}`}>
      {/* Studio Categorized Navigation Rail */}
      <div className="w-full md:w-44 lg:w-48 bg-[#080b12] border-b md:border-b-0 md:border-r border-zinc-850 p-2.5 flex md:flex-col justify-between shrink-0 select-none overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
        <div className="flex md:flex-col gap-3 md:gap-4 w-full">
          {categories.map((cat) => (
            <div key={cat.title} className="space-y-1 shrink-0">
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5">
                {cat.title}
              </span>
              <div className="flex md:flex-col gap-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleTabSelect(item.key)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left whitespace-nowrap ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === "number" && item.count > 0 && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isActive ? "bg-blue-700 text-white" : "bg-zinc-900 text-zinc-400"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
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
