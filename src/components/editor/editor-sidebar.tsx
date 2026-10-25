import React, { useState } from "react";
import { PortfolioData, Project, Experience, Skill, Education } from "@/lib/schema/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import {
  User,
  Briefcase,
  Code,
  GraduationCap,
  Layers,
  Palette,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface EditorSidebarProps {
  portfolio: PortfolioData;
  onChange: (updated: PortfolioData) => void;
}

type TabKey = "profile" | "projects" | "experience" | "skills" | "education" | "sections" | "appearance";

export function EditorSidebar({ portfolio, onChange }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const updateProfile = (field: keyof typeof portfolio.profile, value: string) => {
    onChange({
      ...portfolio,
      profile: {
        ...portfolio.profile,
        [field]: value,
      },
    });
  };

  // Project handlers
  const addProject = () => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: "New Project",
      tagline: "",
      description: "",
      featured: false,
      technologies: [],
      liveUrl: "",
      repoUrl: "",
      coverImageUrl: "",
    };
    onChange({
      ...portfolio,
      projects: [...portfolio.projects, newProj],
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange({
      ...portfolio,
      projects: portfolio.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const deleteProject = (id: string) => {
    onChange({
      ...portfolio,
      projects: portfolio.projects.filter((p) => p.id !== id),
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      company: "Company Name",
      role: "Position / Role",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
    };
    onChange({
      ...portfolio,
      experience: [...portfolio.experience, newExp],
    });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange({
      ...portfolio,
      experience: portfolio.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...portfolio,
      experience: portfolio.experience.filter((e) => e.id !== id),
    });
  };

  // Skills handlers
  const [skillInput, setSkillInput] = useState("");
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name: skillInput.trim(),
      category: "General",
    };
    onChange({
      ...portfolio,
      skills: [...portfolio.skills, newSkill],
    });
    setSkillInput("");
  };

  const deleteSkill = (id: string) => {
    onChange({
      ...portfolio,
      skills: portfolio.skills.filter((s) => s.id !== id),
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: "Institution / University",
      degree: "Degree",
      fieldOfStudy: "Field of Study",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange({
      ...portfolio,
      education: [...portfolio.education, newEdu],
    });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange({
      ...portfolio,
      education: portfolio.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    });
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...portfolio,
      education: portfolio.education.filter((edu) => edu.id !== id),
    });
  };

  // Section visibility toggle
  const toggleSectionVisibility = (key: string) => {
    onChange({
      ...portfolio,
      sections: portfolio.sections.map((sec) =>
        sec.key === key ? { ...sec, visible: !sec.visible } : sec
      ),
    });
  };

  return (
    <aside className="w-full md:w-[420px] lg:w-[480px] border-r border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-hidden text-zinc-100">
      {/* Category Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto p-1.5 gap-1 shrink-0 bg-zinc-900/60 text-xs">
        {[
          { key: "profile", label: "Profile", icon: User },
          { key: "projects", label: "Projects", icon: Code },
          { key: "experience", label: "Experience", icon: Briefcase },
          { key: "skills", label: "Skills", icon: Layers },
          { key: "education", label: "Education", icon: GraduationCap },
          { key: "sections", label: "Layout", icon: Layers },
          { key: "appearance", label: "Theme", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Profile & Bio</h3>
              <p className="text-xs text-zinc-400">
                Core personal and professional identity information.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Full Name</label>
                <Input
                  value={portfolio.profile.fullName}
                  onChange={(e) => updateProfile("fullName", e.target.value)}
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Professional Headline</label>
                <Input
                  value={portfolio.profile.headline}
                  onChange={(e) => updateProfile("headline", e.target.value)}
                  placeholder="e.g. Senior Distributed Systems Engineer"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Biography / Summary</label>
                <Textarea
                  value={portfolio.profile.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                  placeholder="Brief overview of your background, architectural focus, and impact."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Email</label>
                  <Input
                    type="email"
                    value={portfolio.profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                    placeholder="you@domain.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Location</label>
                  <Input
                    value={portfolio.profile.location}
                    onChange={(e) => updateProfile("location", e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Status Badge (Optional)</label>
                <Input
                  value={portfolio.profile.statusBadge}
                  onChange={(e) => updateProfile("statusBadge", e.target.value)}
                  placeholder="e.g. Open to Q1 Advisory / Senior Roles"
                />
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Projects</h3>
                <p className="text-xs text-zinc-400">Showcase your verified engineering work.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addProject} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </Button>
            </div>

            {portfolio.projects.length === 0 ? (
              <EmptyState
                icon={Code}
                title="No projects added yet"
                description="Add your first project to highlight your code, products, or technical contributions."
                actionLabel="Add Project"
                onAction={addProject}
              />
            ) : (
              <div className="space-y-4">
                {portfolio.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">#{idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(proj.id)}
                        className="h-7 w-7 text-zinc-400 hover:text-red-400"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Title</label>
                      <Input
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder="Project Name"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Tagline</label>
                      <Input
                        value={proj.tagline}
                        onChange={(e) => updateProject(proj.id, { tagline: e.target.value })}
                        placeholder="Short summary of what it does"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Description</label>
                      <Textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        placeholder="Details on engineering challenges and outcomes"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Live URL</label>
                        <Input
                          value={proj.liveUrl}
                          onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Repo URL</label>
                        <Input
                          value={proj.repoUrl}
                          onChange={(e) => updateProject(proj.id, { repoUrl: e.target.value })}
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">
                        Technologies (comma separated)
                      </label>
                      <Input
                        value={proj.technologies.join(", ")}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            technologies: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="TypeScript, Next.js, PostgreSQL"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Work Experience</h3>
                <p className="text-xs text-zinc-400">Chronological employment and leadership roles.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Role
              </Button>
            </div>

            {portfolio.experience.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No work experience added"
                description="Add your current or previous roles to demonstrate your professional track record."
                actionLabel="Add Role"
                onAction={addExperience}
              />
            ) : (
              <div className="space-y-4">
                {portfolio.experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">Position</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExperience(exp.id)}
                        className="h-7 w-7 text-zinc-400 hover:text-red-400"
                        title="Remove role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Role</label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          placeholder="Staff Engineer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Start Date</label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          placeholder="e.g. 2021"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">End Date</label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          placeholder="e.g. 2024 (or leave blank if current)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Description</label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        placeholder="Scope of work and responsibilities"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Skills & Competencies</h3>
              <p className="text-xs text-zinc-400">Add technical and domain competencies.</p>
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. Rust, Distributed Systems, Next.js"
                className="text-xs"
              />
              <Button type="submit" variant="secondary" size="sm">
                Add
              </Button>
            </form>

            {portfolio.skills.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No skills added yet"
                description="Add specific technologies, tools, and methodologies you specialize in."
              />
            ) : (
              <div className="flex flex-wrap gap-2 pt-2">
                {portfolio.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => deleteSkill(skill.id)}
                      className="text-zinc-500 hover:text-red-400 cursor-pointer"
                      title="Remove skill"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Education</h3>
                <p className="text-xs text-zinc-400">Degrees, academic credentials, and programs.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addEducation} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Education
              </Button>
            </div>

            {portfolio.education.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No education added"
                description="Add your degree, university, or educational milestones."
                actionLabel="Add Education"
                onAction={addEducation}
              />
            ) : (
              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">Credential</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEducation(edu.id)}
                        className="h-7 w-7 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Institution</label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="University Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="B.S. / M.S."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-300 block mb-1">Field</label>
                        <Input
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Layout & Sections Visibility Tab */}
        {activeTab === "sections" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Section Visibility</h3>
              <p className="text-xs text-zinc-400">
                Toggle which sections appear in your public portfolio.
              </p>
            </div>

            <div className="space-y-2">
              {portfolio.sections.map((sec) => (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs"
                >
                  <span className="font-medium text-zinc-200">{sec.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.key)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs cursor-pointer ${
                      sec.visible
                        ? "bg-zinc-800 text-emerald-400 hover:bg-zinc-700"
                        : "bg-zinc-900 text-zinc-500 hover:bg-zinc-850"
                    }`}
                  >
                    {sec.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Hidden
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Template & Theme</h3>
              <p className="text-xs text-zinc-400">Configure visual style and styling rules.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Template</label>
              <select
                value={portfolio.appearance.templateId}
                onChange={(e) =>
                  onChange({
                    ...portfolio,
                    appearance: {
                      ...portfolio.appearance,
                      templateId: e.target.value as any,
                    },
                  })
                }
                className="w-full h-9 rounded-md bg-zinc-900 border border-zinc-800 px-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="minimal-portfolio">Minimal Portfolio (Editorial)</option>
                <option value="developer-pro">Developer Pro (Technical)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
