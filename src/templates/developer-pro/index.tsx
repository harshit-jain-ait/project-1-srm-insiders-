"use client";

import React, { useState } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, EmptySectionHint, SocialPlatformIcon } from "../shared";
import Link from "next/link";
import {
  Terminal,
  Code2,
  Briefcase,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Menu,
  X,
  Sparkles,
  FileText,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { PublicContactForm } from "@/components/contact/public-contact-form";

export function DeveloperProTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections, contactConfig } = portfolio;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter visible projects (hide hidden projects from public view)
  const visibleProjects = (projects || []).filter((p) => isLivePreview || p.visible !== false);

  const activeSections = sections.filter((s) => s.visible);

  const hasProjects = visibleProjects.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;
  const hasEducation = education.length > 0;
  const hasContact = Boolean(profile.email || socialLinks.length > 0 || contactConfig?.enabled);

  const navItems = activeSections
    .filter((sec) => {
      if (sec.key === "projects") return isLivePreview || hasProjects;
      if (sec.key === "experience") return isLivePreview || hasExperience;
      if (sec.key === "skills") return isLivePreview || hasSkills;
      if (sec.key === "education") return isLivePreview || hasEducation;
      if (sec.key === "contact") return isLivePreview || hasContact;
      return false;
    })
    .map((sec) => ({
      key: sec.key,
      label: sec.label || sec.key.charAt(0).toUpperCase() + sec.key.slice(1),
      href: `#section-${sec.key}`,
    }));

  const fontClass =
    portfolio.appearance?.fontFamily === "serif"
      ? "font-serif"
      : portfolio.appearance?.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  return (
    <article className={`min-h-screen bg-[#0A0B0E] text-[#ECECED] ${fontClass} selection:bg-blue-600/30 selection:text-white`}>
      {/* Top Technical Status & Nav Bar */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#0A0B0E]/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between text-xs">
          {/* Status badge & wordmark */}
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <a
              href="#top"
              className="font-mono text-zinc-300 font-medium hover:text-white transition-colors"
            >
              {profile.fullName
                ? `${profile.fullName.toLowerCase().replace(/\s+/g, "-")}.dev`
                : (isLivePreview ? "developer-profile.dev" : "system.live")}
            </a>
          </div>

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-5 font-mono text-[11px] text-zinc-400">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="hover:text-blue-400 transition-colors"
                >
                  <span className="text-zinc-600 mr-1">{"//"}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Status Pill or Mobile Toggle */}
          <div className="flex items-center gap-2">
            {profile.statusBadge && (
              <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-300 bg-zinc-900/90 border border-zinc-800 px-2.5 py-0.5 rounded">
                <span className="text-[#356ae6]">$</span>
                <span>{profile.statusBadge}</span>
              </div>
            )}

            {navItems.length > 0 && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && navItems.length > 0 && (
          <nav className="md:hidden border-b border-zinc-800 bg-[#0E1015] px-6 py-3 font-mono text-xs space-y-2">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-300 hover:text-blue-400 py-1"
              >
                <span className="text-zinc-600 mr-2">$</span>
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <div id="top" className="max-w-5xl mx-auto px-6 py-12 sm:py-16 space-y-20">
        {/* Profile / Hero Section */}
        <header className="border-b border-zinc-800/80 pb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#356ae6]/10 border border-[#356ae6]/30 text-[#356ae6] text-xs font-mono">
                <Terminal className="w-3.5 h-3.5" />
                <span>Engineer Profile</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                {profile.fullName || (isLivePreview ? "Alex Chen" : "")}
              </h1>

              {profile.headline && (
                <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed">
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                  {profile.bio}
                </p>
              )}

              {/* Extended narrative bio */}
              {profile.longBio && (
                <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light pt-1 space-y-2">
                  <p>{profile.longBio}</p>
                </div>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-3">
                {profile.location && (
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{profile.location}</span>
                  </span>
                )}

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{profile.email}</span>
                  </a>
                )}

                {socialLinks.map((link) => (
                  <SafeExternalLink
                    key={link.id}
                    href={link.url}
                    className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-blue-400 transition-colors"
                  >
                    <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{link.label}</span>
                  </SafeExternalLink>
                ))}
              </div>
            </div>

            {/* Profile Avatar if supplied */}
            {profile.avatarUrl && (
              <div className="shrink-0 pt-2 md:pt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName || "Engineer avatar"}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl border border-zinc-800 object-cover bg-zinc-900"
                />
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Section Ordering */}
        <main className="space-y-20">
          {activeSections.map((sec) => {
            // PROJECTS SECTION
            if (sec.key === "projects") {
              if (!hasProjects && !isLivePreview) return null;

              return (
                <section
                  key={sec.key}
                  id="section-projects"
                  className="space-y-6 scroll-mt-20"
                  aria-labelledby="heading-dev-projects"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#356ae6]" />
                      <h2
                        id="heading-dev-projects"
                        className="text-sm font-mono uppercase tracking-wider text-zinc-200"
                      >
                        {sec.label || "Engineered Projects"}
                      </h2>
                    </div>
                    {hasProjects && (
                      <span className="text-xs font-mono text-zinc-500">
                        {visibleProjects.length} systems
                      </span>
                    )}
                  </div>

                  {!hasProjects && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Projects"
                      actionHint="Add system case studies, services, or open source tools in the editor."
                      theme="dark"
                    />
                  )}

                  {hasProjects && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visibleProjects.map((proj) => {
                        const hasCaseStudy = Boolean(
                          (proj.caseStudy?.sections && proj.caseStudy.sections.length > 0) ||
                          proj.caseStudy?.overview
                        );

                        return (
                          <div
                            key={proj.id}
                            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all group space-y-4"
                          >
                            <div className="space-y-3">
                              {/* Optional Project Cover Image */}
                              {proj.coverImageUrl && (
                                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 max-h-48">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={proj.coverImageUrl}
                                    alt={proj.title || "Project cover"}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                                  />
                                </div>
                              )}

                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-base font-sans">
                                      {proj.liveUrl ? (
                                        <SafeExternalLink
                                          href={proj.liveUrl}
                                          className="inline-flex items-center gap-1.5"
                                          showIcon
                                        >
                                          {proj.title}
                                        </SafeExternalLink>
                                      ) : (
                                        proj.title
                                      )}
                                    </h3>
                                    {proj.featured && (
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.2 rounded">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        featured
                                      </span>
                                    )}
                                    {isLivePreview && proj.visible === false && (
                                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-800 px-1.5 py-0.2 rounded">
                                        hidden
                                      </span>
                                    )}
                                  </div>

                                  {proj.category && proj.category !== "software" && (
                                    <span className="inline-block text-[10px] font-mono uppercase text-zinc-500">
                                      {proj.category}
                                    </span>
                                  )}
                                </div>

                                {proj.repoUrl && (
                                  <SafeExternalLink
                                    href={proj.repoUrl}
                                    className="text-xs text-zinc-400 hover:text-white p-1 shrink-0"
                                    aria-label={`Repository for ${proj.title}`}
                                  >
                                    <GithubIcon className="w-4 h-4" />
                                  </SafeExternalLink>
                                )}
                              </div>

                              {proj.tagline && (
                                <p className="text-xs text-zinc-400 font-mono">
                                  {proj.tagline}
                                </p>
                              )}

                              {proj.description && (
                                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                                  {proj.description}
                                </p>
                              )}
                            </div>

                            <div className="space-y-3">
                              {proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-850 font-mono text-[11px]">
                                  {proj.technologies.map((tech, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Case Study Read Action */}
                              {hasCaseStudy && (
                                <div className="pt-2 border-t border-zinc-850/60">
                                  <Link
                                    href={`/p/${portfolio.slug}/projects/${proj.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#7aa2f7] hover:text-white transition-colors group/cs"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#356ae6]" />
                                    <span>Read Case Study →</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            }

            // EXPERIENCE SECTION
            if (sec.key === "experience") {
              if (!hasExperience && !isLivePreview) return null;

              return (
                <section
                  key={sec.key}
                  id="section-experience"
                  className="space-y-6 scroll-mt-20"
                  aria-labelledby="heading-dev-experience"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <Briefcase className="w-4 h-4 text-[#356ae6]" />
                    <h2
                      id="heading-dev-experience"
                      className="text-sm font-mono uppercase tracking-wider text-zinc-200"
                    >
                      {sec.label || "Experience & Tenures"}
                    </h2>
                  </div>

                  {!hasExperience && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Experience"
                      actionHint="Add your engineering, systems, or architecture positions in the editor."
                      theme="dark"
                    />
                  )}

                  {hasExperience && (
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div
                          key={exp.id}
                          className="rounded-xl border border-zinc-850 bg-zinc-900/30 p-5 space-y-2.5 hover:border-zinc-800 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h3 className="font-semibold text-white text-base">
                              {exp.role}{" "}
                              <span className="text-[#356ae6]">@ {exp.company}</span>
                            </h3>
                            <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                              {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? "—" : ""}{" "}
                              {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>

                          {exp.location && (
                            <div className="text-xs text-zinc-500 font-mono">
                              location: {exp.location}
                            </div>
                          )}

                          {exp.description && (
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light max-w-3xl">
                              {exp.description}
                            </p>
                          )}

                          {exp.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 pt-1 font-mono leading-relaxed">
                              {exp.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            }

            // SKILLS SECTION
            if (sec.key === "skills") {
              if (!hasSkills && !isLivePreview) return null;

              return (
                <section
                  key={sec.key}
                  id="section-skills"
                  className="space-y-5 scroll-mt-20"
                  aria-labelledby="heading-dev-skills"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <Layers className="w-4 h-4 text-[#356ae6]" />
                    <h2
                      id="heading-dev-skills"
                      className="text-sm font-mono uppercase tracking-wider text-zinc-200"
                    >
                      {sec.label || "Stack & Competencies"}
                    </h2>
                  </div>

                  {!hasSkills && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Skills"
                      actionHint="Add your technical languages, infra, and databases in the editor."
                      theme="dark"
                    />
                  )}

                  {hasSkills && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="font-mono text-xs text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded hover:border-blue-600/60 transition-colors"
                        >
                          <span className="text-zinc-500 mr-1.5">#</span>
                          <span>{skill.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              );
            }

            // EDUCATION SECTION
            if (sec.key === "education") {
              if (!hasEducation && !isLivePreview) return null;

              return (
                <section
                  key={sec.key}
                  id="section-education"
                  className="space-y-5 scroll-mt-20"
                  aria-labelledby="heading-dev-education"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <GraduationCap className="w-4 h-4 text-[#356ae6]" />
                    <h2
                      id="heading-dev-education"
                      className="text-sm font-mono uppercase tracking-wider text-zinc-200"
                    >
                      {sec.label || "Education & Background"}
                    </h2>
                  </div>

                  {!hasEducation && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Education"
                      actionHint="Add your degree or accredited studies in the editor."
                      theme="dark"
                    />
                  )}

                  {hasEducation && (
                    <div className="space-y-3">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 p-4 rounded-xl bg-zinc-900/30 border border-zinc-850"
                        >
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-medium text-white">{edu.institution}</h3>
                            <p className="text-xs text-zinc-400 font-mono">
                              {edu.degree}
                              {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                            </p>
                          </div>
                          {(edu.startDate || edu.endDate) && (
                            <span className="text-xs text-zinc-500 font-mono">
                              {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ""}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            }

            // CONTACT SECTION
            if (sec.key === "contact") {
              if (!hasContact && !isLivePreview) return null;

              return (
                <section
                  key={sec.key}
                  id="section-contact"
                  className="space-y-4 scroll-mt-20 pt-6 border-t border-zinc-850"
                  aria-labelledby="heading-dev-contact"
                >
                  <h2
                    id="heading-dev-contact"
                    className="text-xs font-mono uppercase tracking-wider text-zinc-400"
                  >
                    {"//"} {sec.label || "Communications"}
                  </h2>

                  <PublicContactForm
                    portfolioId={portfolio.id}
                    config={contactConfig}
                    isLivePreview={isLivePreview}
                  />

                  <div className="space-y-2 text-xs font-mono text-zinc-300">
                    {profile.email && (
                      <p>
                        contact_endpoint:{" "}
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-blue-400 hover:underline"
                        >
                          {profile.email}
                        </a>
                      </p>
                    )}
                  </div>
                </section>
              );
            }

            return null;
          })}
        </main>

        {/* Technical Footer */}
        <footer className="mt-20 pt-8 border-t border-zinc-850/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <span>{profile.fullName ? `${profile.fullName.toLowerCase().replace(/\s+/g, "-")}` : "system"}</span>
          <span>Powered by Portfolify Engine</span>
        </footer>
      </div>
    </article>
  );
}
