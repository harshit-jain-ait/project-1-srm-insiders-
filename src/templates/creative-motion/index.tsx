"use client";

import React from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, SocialPlatformIcon, resolveTemplateTheme } from "../shared";
import { SpotlightCard } from "@/components/visual/spotlight-card";
import { AnimatedBadge } from "@/components/visual/animated-badge";
import { PublicContactForm } from "@/components/contact/public-contact-form";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2, Sparkles, MapPin, Mail, Layers } from "lucide-react";

export function CreativeMotionTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, socialLinks, sections, contactConfig } = portfolio;

  const theme = resolveTemplateTheme(portfolio.appearance, "creative-motion");

  const visibleProjects = (projects || []).filter((p) => isLivePreview || p.visible !== false);
  const activeSections = sections.filter((s) => s.visible);

  const hasProjects = visibleProjects.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;

  return (
    <article
      className={`min-h-screen ${theme.fontClass} selection:bg-blue-600 selection:text-white transition-colors duration-200`}
      style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
    >
      {/* Dynamic Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{
          backgroundColor: `${theme.bgColor}cc`,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-tight">
              {profile.fullName || "Creative Portfolio"}
            </span>
            {profile.statusBadge && (
              <AnimatedBadge label={profile.statusBadge} dotColor="emerald" />
            )}
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            {activeSections.map((sec) => (
              <a
                key={sec.key}
                href={`#section-${sec.key}`}
                className="hover:text-white transition-colors"
              >
                {sec.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile.headline || "Digital Product Designer & Creative Engineer"}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            {profile.bio || "Crafting fluid interactive experiences at the intersection of design and code."}
          </h1>

          {profile.longBio && (
            <p className="text-base text-zinc-400 leading-relaxed font-light">
              {profile.longBio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-zinc-400">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-zinc-500" />
                <a href={`mailto:${profile.email}`} className="text-zinc-300 hover:text-white">
                  {profile.email}
                </a>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                {socialLinks.map((link) => (
                  <SafeExternalLink
                    key={link.id}
                    href={link.url}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
                  >
                    <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
                  </SafeExternalLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        {activeSections.map((sec) => {
          // PROJECTS
          if (sec.key === "projects") {
            if (!hasProjects && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-projects" className="space-y-8 scroll-mt-24">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    {sec.label || "Interactive Projects"}
                  </h2>
                  <span className="text-xs text-zinc-500 font-mono">
                    {visibleProjects.length} Works
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleProjects.map((project) => (
                    <SpotlightCard key={project.id} className="flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {project.category}
                          </span>
                          <div className="flex items-center gap-2">
                            {project.liveUrl && (
                              <SafeExternalLink
                                href={project.liveUrl}
                                className="p-1 text-zinc-400 hover:text-white"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </SafeExternalLink>
                            )}
                            {project.repoUrl && (
                              <SafeExternalLink
                                href={project.repoUrl}
                                className="p-1 text-zinc-400 hover:text-white"
                              >
                                <Code2 className="w-4 h-4" />
                              </SafeExternalLink>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {project.title}
                        </h3>

                        {project.tagline && (
                          <p className="text-xs text-zinc-400 font-medium">{project.tagline}</p>
                        )}

                        {project.description && (
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-6 space-y-3">
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/80 text-zinc-400 border border-zinc-800/60"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {project.caseStudy && (
                          <Link
                            href={`/p/${portfolio.slug}/projects/${project.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-2"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Read Case Study &rarr;
                          </Link>
                        )}
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </section>
            );
          }

          // EXPERIENCE
          if (sec.key === "experience") {
            if (!hasExperience && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-experience" className="space-y-6 scroll-mt-24">
                <div className="border-b border-zinc-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {sec.label || "Experience"}
                  </h2>
                </div>

                <div className="space-y-4">
                  {experience.map((exp) => (
                    <SpotlightCard key={exp.id} className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="font-semibold text-sm text-white">
                          {exp.role} <span className="text-zinc-500 font-normal">at</span>{" "}
                          <span className="text-blue-400">{exp.company}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-500">
                          {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : "— Present"}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          {exp.description}
                        </p>
                      )}
                    </SpotlightCard>
                  ))}
                </div>
              </section>
            );
          }

          // SKILLS
          if (sec.key === "skills") {
            if (!hasSkills && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-skills" className="space-y-6 scroll-mt-24">
                <div className="border-b border-zinc-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {sec.label || "Core Competencies"}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-sm"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          // CONTACT
          if (sec.key === "contact") {
            return (
              <section key={sec.key} id="section-contact" className="space-y-8 scroll-mt-24 pt-12 border-t border-zinc-800/80">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {sec.label || "Initiate Collaboration"}
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Direct inbox communication for inquiries and prospective engagements.
                  </p>
                </div>

                <PublicContactForm
                  portfolioId={portfolio.id}
                  config={contactConfig}
                  isLivePreview={isLivePreview}
                />
              </section>
            );
          }

          return null;
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <span>{profile.fullName || "Creative Motion"}</span>
          <span className="font-mono text-[11px]">Portfolify Pro Template</span>
        </div>
      </footer>
    </article>
  );
}
