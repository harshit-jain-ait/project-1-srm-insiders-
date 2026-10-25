"use client";

import React, { useState } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, EmptySectionHint, SocialPlatformIcon } from "../shared";
import { Mail, MapPin, Menu, X, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export function MinimalPortfolioTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections } = portfolio;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter sections that are enabled
  const activeSections = sections.filter((s) => s.visible);

  // Check which sections actually have content
  const hasProjects = projects.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;
  const hasEducation = education.length > 0;
  const hasContact = Boolean(profile.email || socialLinks.length > 0);

  // Determine which navigation links to render (only those with content, or all active in preview)
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
    <article className={`min-h-screen bg-[#FAFAF8] text-[#191919] ${fontClass} selection:bg-zinc-200 selection:text-black`}>
      {/* Editorial Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FAFAF8]/90 backdrop-blur border-b border-zinc-200/80">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#top"
            className="font-serif text-lg tracking-tight font-medium text-zinc-950 hover:opacity-80 transition-opacity"
          >
            {profile.fullName || (isLivePreview ? "Your Portfolio" : "Portfolio")}
          </a>

          {/* Desktop Nav */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Mobile Menu Toggle */}
          {navItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-zinc-600 hover:text-zinc-950"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && navItems.length > 0 && (
          <nav className="md:hidden border-b border-zinc-200 bg-[#FAFAF8] px-6 py-4 space-y-3 text-sm">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-600 hover:text-zinc-950 font-medium tracking-wide py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main Container */}
      <div id="top" className="max-w-4xl mx-auto px-6 py-16 sm:py-24 space-y-24">
        {/* Hero & About Header */}
        <section className="space-y-8">
          {profile.statusBadge && (
            <div className="inline-flex items-center text-[11px] font-mono tracking-wider uppercase text-zinc-500 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
              {profile.statusBadge}
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-950 font-serif leading-[1.15]">
              {profile.fullName || (isLivePreview ? "Alex Rivera" : "")}
            </h1>

            {profile.headline && (
              <p className="text-xl sm:text-2xl font-light text-zinc-600 leading-relaxed max-w-2xl">
                {profile.headline}
              </p>
            )}
          </div>

          {profile.bio && (
            <p className="text-base sm:text-lg text-zinc-700 font-light leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Extended Bio (if present) */}
          {profile.longBio && (
            <div className="pt-2 text-sm text-zinc-600 leading-relaxed max-w-2xl space-y-3 font-light">
              <p>{profile.longBio}</p>
            </div>
          )}

          {/* Contact Details & Social Links Bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-zinc-200 text-sm text-zinc-600">
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 text-zinc-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {profile.location}
              </span>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors text-xs"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                {profile.email}
              </a>
            )}

            {socialLinks.map((link) => (
              <SafeExternalLink
                key={link.id}
                href={link.url}
                className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors text-xs"
              >
                <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5 text-zinc-500" />
                <span>{link.label}</span>
              </SafeExternalLink>
            ))}
          </div>
        </section>

        {/* Dynamic Section Ordering */}
        <main className="space-y-24">
          {activeSections.map((sec) => {
            // PROJECTS SECTION
            if (sec.key === "projects") {
              if (!hasProjects && !isLivePreview) return null;

              return (
                <section
                  key={sec.key}
                  id="section-projects"
                  className="space-y-10 scroll-mt-24"
                  aria-labelledby="heading-projects"
                >
                  <div className="border-b border-zinc-200 pb-3 flex items-baseline justify-between">
                    <h2
                      id="heading-projects"
                      className="text-xs font-semibold tracking-widest uppercase text-zinc-400 font-mono"
                    >
                      {sec.label || "Featured Work"}
                    </h2>
                    {hasProjects && (
                      <span className="text-xs font-mono text-zinc-400">
                        ({projects.length})
                      </span>
                    )}
                  </div>

                  {!hasProjects && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Projects"
                      actionHint="Add case studies and engineering projects in the editor to populate this list."
                      theme="light"
                    />
                  )}

                  {hasProjects && (
                    <div className="space-y-16">
                      {projects.map((proj) => (
                        <div key={proj.id} className="group space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                            <h3 className="text-xl sm:text-2xl font-serif font-normal text-zinc-950">
                              {proj.liveUrl ? (
                                <SafeExternalLink
                                  href={proj.liveUrl}
                                  className="inline-flex items-center gap-1.5 hover:text-blue-700 transition-colors"
                                >
                                  <span>{proj.title}</span>
                                  <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </SafeExternalLink>
                              ) : (
                                proj.title
                              )}
                            </h3>

                            {proj.repoUrl && (
                              <SafeExternalLink
                                href={proj.repoUrl}
                                className="text-xs font-mono text-zinc-500 hover:text-zinc-950 inline-flex items-center gap-1.5"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                                <span>Source Code</span>
                              </SafeExternalLink>
                            )}
                          </div>

                          {proj.tagline && (
                            <p className="text-sm font-light text-zinc-500 leading-normal">
                              {proj.tagline}
                            </p>
                          )}

                          {proj.description && (
                            <p className="text-sm text-zinc-700 leading-relaxed font-light max-w-2xl">
                              {proj.description}
                            </p>
                          )}

                          {proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {proj.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-mono text-zinc-600 bg-white border border-zinc-200/90 px-2 py-0.5 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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
                  className="space-y-10 scroll-mt-24"
                  aria-labelledby="heading-experience"
                >
                  <div className="border-b border-zinc-200 pb-3 flex items-baseline justify-between">
                    <h2
                      id="heading-experience"
                      className="text-xs font-semibold tracking-widest uppercase text-zinc-400 font-mono"
                    >
                      {sec.label || "Experience"}
                    </h2>
                  </div>

                  {!hasExperience && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Experience"
                      actionHint="Add your positions and career tenures in the editor."
                      theme="light"
                    />
                  )}

                  {hasExperience && (
                    <div className="space-y-12">
                      {experience.map((exp) => (
                        <div key={exp.id} className="space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <h3 className="text-base font-medium text-zinc-950 font-serif">
                              {exp.role}{" "}
                              <span className="text-zinc-400 font-normal font-sans">at</span>{" "}
                              {exp.company}
                            </h3>
                            <span className="text-xs font-mono text-zinc-500">
                              {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? "—" : ""}{" "}
                              {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>

                          {exp.location && (
                            <div className="text-xs text-zinc-400 font-light">
                              {exp.location}
                            </div>
                          )}

                          {exp.description && (
                            <p className="text-sm text-zinc-700 leading-relaxed font-light max-w-2xl">
                              {exp.description}
                            </p>
                          )}

                          {exp.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-zinc-600 space-y-1 pl-1 leading-relaxed">
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
                  className="space-y-8 scroll-mt-24"
                  aria-labelledby="heading-skills"
                >
                  <div className="border-b border-zinc-200 pb-3">
                    <h2
                      id="heading-skills"
                      className="text-xs font-semibold tracking-widest uppercase text-zinc-400 font-mono"
                    >
                      {sec.label || "Skills & Focus"}
                    </h2>
                  </div>

                  {!hasSkills && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Skills"
                      actionHint="Add your technical languages, frameworks, and proficiencies in the editor."
                      theme="light"
                    />
                  )}

                  {hasSkills && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="text-xs font-medium text-zinc-800 bg-white border border-zinc-200/90 px-3 py-1 rounded shadow-2xs"
                        >
                          {skill.name}
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
                  className="space-y-8 scroll-mt-24"
                  aria-labelledby="heading-education"
                >
                  <div className="border-b border-zinc-200 pb-3">
                    <h2
                      id="heading-education"
                      className="text-xs font-semibold tracking-widest uppercase text-zinc-400 font-mono"
                    >
                      {sec.label || "Education"}
                    </h2>
                  </div>

                  {!hasEducation && (
                    <EmptySectionHint
                      isLivePreview={isLivePreview}
                      sectionTitle="Education"
                      actionHint="Add your academic degrees or certified programs in the editor."
                      theme="light"
                    />
                  )}

                  {hasEducation && (
                    <div className="space-y-6">
                      {education.map((edu) => (
                        <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-medium text-zinc-950 font-serif">
                              {edu.institution}
                            </h3>
                            <p className="text-xs text-zinc-600 font-light">
                              {edu.degree}
                              {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                            </p>
                          </div>
                          {(edu.startDate || edu.endDate) && (
                            <span className="text-xs text-zinc-400 font-mono">
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
                  className="space-y-6 scroll-mt-24 pt-4 border-t border-zinc-200"
                  aria-labelledby="heading-contact"
                >
                  <h2
                    id="heading-contact"
                    className="text-xs font-semibold tracking-widest uppercase text-zinc-400 font-mono"
                  >
                    {sec.label || "Get in Touch"}
                  </h2>

                  <div className="space-y-3 text-sm text-zinc-700 font-light">
                    {profile.email && (
                      <p>
                        Email:{" "}
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-zinc-950 hover:underline font-normal"
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

        {/* Minimal Footer */}
        <footer className="mt-28 pt-8 border-t border-zinc-200 text-xs text-zinc-400 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>{profile.fullName || "Portfolio"}</span>
          <span className="font-mono text-[11px] text-zinc-400">
            Powered by Portfolify
          </span>
        </footer>
      </div>
    </article>
  );
}
