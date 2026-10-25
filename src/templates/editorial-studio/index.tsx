"use client";

import React from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, SocialPlatformIcon } from "../shared";
import { PublicContactForm } from "@/components/contact/public-contact-form";
import Link from "next/link";
import { Mail, MapPin, ArrowUpRight, BookOpen, Code2 } from "lucide-react";

export function EditorialStudioTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, socialLinks, sections, contactConfig } = portfolio;

  const visibleProjects = (projects || []).filter((p) => isLivePreview || p.visible !== false);
  const activeSections = sections.filter((s) => s.visible);

  const hasProjects = visibleProjects.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;

  return (
    <article className="min-h-screen bg-[#FDFBF7] text-[#1a1918] font-serif selection:bg-amber-100 selection:text-black">
      {/* Top Banner / Masthead */}
      <header className="border-b border-zinc-200/80 bg-[#FDFBF7]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <div>
            <a href="#top" className="text-xl sm:text-2xl font-serif tracking-tight font-normal text-zinc-950">
              {profile.fullName || "Editorial Portfolio"}
            </a>
            {profile.headline && (
              <p className="text-[11px] font-sans text-zinc-500 uppercase tracking-widest mt-0.5 font-medium">
                {profile.headline}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs font-sans uppercase tracking-widest text-zinc-500">
            {activeSections.map((sec) => (
              <a
                key={sec.key}
                href={`#section-${sec.key}`}
                className="hover:text-zinc-950 transition-colors"
              >
                {sec.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-16 pb-20 border-b border-zinc-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-zinc-950 leading-[1.15]">
              {profile.bio || "Crafting narrative-driven digital work with intentional typography."}
            </h1>
            {profile.longBio && (
              <p className="text-base sm:text-lg font-light text-zinc-700 leading-relaxed max-w-2xl font-serif">
                {profile.longBio}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4 font-sans text-xs">
            {profile.location && (
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2 text-zinc-600">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  {profile.email}
                </a>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((link) => (
                  <SafeExternalLink
                    key={link.id}
                    href={link.url}
                    className="p-2 border border-zinc-200 rounded hover:border-zinc-400 transition-colors"
                  >
                    <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
                  </SafeExternalLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-24">
        {activeSections.map((sec) => {
          // PROJECTS ANTHOLOGY
          if (sec.key === "projects") {
            if (!hasProjects && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-projects" className="space-y-10 scroll-mt-24">
                <div className="flex items-baseline justify-between border-b border-zinc-200 pb-4">
                  <h2 className="text-2xl font-serif font-normal text-zinc-950">
                    {sec.label || "Selected Works"}
                  </h2>
                  <span className="text-xs font-sans uppercase tracking-widest text-zinc-400">
                    Anthology & Case Studies
                  </span>
                </div>

                <div className="space-y-16">
                  {visibleProjects.map((project, idx) => (
                    <article
                      key={project.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
                    >
                      <div className="md:col-span-2 font-sans text-xs text-zinc-400 font-mono">
                        {(idx + 1).toString().padStart(2, "0")} / {project.category}
                      </div>

                      <div className="md:col-span-10 space-y-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <h3 className="text-2xl font-serif font-medium text-zinc-950 group-hover:text-blue-900 transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-3 font-sans text-xs">
                            {project.liveUrl && (
                              <SafeExternalLink
                                href={project.liveUrl}
                                className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-950 underline underline-offset-4"
                              >
                                View Live <ArrowUpRight className="w-3 h-3" />
                              </SafeExternalLink>
                            )}
                            {project.repoUrl && (
                              <SafeExternalLink
                                href={project.repoUrl}
                                className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-950 underline underline-offset-4"
                              >
                                Code <Code2 className="w-3 h-3" />
                              </SafeExternalLink>
                            )}
                          </div>
                        </div>

                        {project.tagline && (
                          <p className="text-base font-serif italic text-zinc-600">
                            {project.tagline}
                          </p>
                        )}

                        {project.description && (
                          <p className="text-sm font-sans font-light text-zinc-700 leading-relaxed max-w-3xl">
                            {project.description}
                          </p>
                        )}

                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1 font-sans text-[11px] text-zinc-500">
                            {project.technologies.map((t) => (
                              <span key={t} className="border border-zinc-200 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {project.caseStudy && (
                          <div className="pt-2 font-sans">
                            <Link
                              href={`/p/${portfolio.slug}/projects/${project.id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-950 hover:underline"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Read Complete Case Study &rarr;
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          }

          // EXPERIENCE
          if (sec.key === "experience") {
            if (!hasExperience && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-experience" className="space-y-10 scroll-mt-24">
                <div className="border-b border-zinc-200 pb-4">
                  <h2 className="text-2xl font-serif font-normal text-zinc-950">
                    {sec.label || "Curated Experience"}
                  </h2>
                </div>

                <div className="space-y-10">
                  {experience.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-3 font-sans text-xs text-zinc-400 font-mono">
                        {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : "— Present"}
                      </div>
                      <div className="md:col-span-9 space-y-2">
                        <h3 className="text-lg font-serif font-medium text-zinc-950">
                          {exp.role} &mdash; <span className="font-normal italic">{exp.company}</span>
                        </h3>
                        {exp.description && (
                          <p className="text-sm font-sans font-light text-zinc-700 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
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
                <div className="border-b border-zinc-200 pb-4">
                  <h2 className="text-2xl font-serif font-normal text-zinc-950">
                    {sec.label || "Disciplines & Tools"}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2.5 font-sans">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs text-zinc-800 border border-zinc-300 px-3 py-1 rounded bg-white"
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
              <section key={sec.key} id="section-contact" className="space-y-8 scroll-mt-24 pt-10 border-t border-zinc-200">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-serif font-normal text-zinc-950">
                    {sec.label || "Inquiries & Correspondence"}
                  </h2>
                  <p className="text-xs font-sans text-zinc-500 uppercase tracking-widest">
                    Direct Contact
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
      <footer className="border-t border-zinc-200 bg-[#FDFBF7] py-12">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-zinc-500 gap-4">
          <span>{profile.fullName || "Editorial Studio Portfolio"}</span>
          <span className="font-mono text-[11px]">Published with Portfolify Pro</span>
        </div>
      </footer>
    </article>
  );
}
