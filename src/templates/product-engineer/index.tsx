"use client";

import React from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, SocialPlatformIcon, resolveTemplateTheme } from "../shared";
import { PublicContactForm } from "@/components/contact/public-contact-form";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  GitBranch,
  ArrowUpRight,
  BookOpen,
  Code2,
  CheckCircle2,
  HardDrive,
} from "lucide-react";

export function ProductEngineerTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, socialLinks, sections, contactConfig } = portfolio;

  const theme = resolveTemplateTheme(portfolio.appearance, "product-engineer");

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
      {/* Terminal Style Header Bar */}
      <header
        className="border-b backdrop-blur sticky top-0 z-30"
        style={{
          backgroundColor: `${theme.bgColor}e6`,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">
              {profile.fullName ? profile.fullName.toLowerCase().replace(/\s+/g, "-") : "engineer"}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">spec</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] text-zinc-400">
            {activeSections.map((sec) => (
              <a
                key={sec.key}
                href={`#section-${sec.key}`}
                className="hover:text-emerald-400 transition-colors"
              >
                .{sec.key}()
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Specs Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.headline || "Staff Product Engineer • Distributed Systems"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {profile.fullName || "Product Engineer"}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-light">
              {profile.bio || "Designing and architecting high-reliability full-stack systems and developer platforms."}
            </p>

            {profile.longBio && (
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                {"// "}{profile.longBio}
              </p>
            )}
          </div>

          {/* System Spec Box */}
          <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="text-[10px] uppercase text-zinc-500 font-semibold border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span>Host Architecture</span>
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {profile.location && (
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Region</span>
                <span>{profile.location}</span>
              </div>
            )}

            {profile.email && (
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Comms</span>
                <a href={`mailto:${profile.email}`} className="text-blue-400 hover:underline">
                  email
                </a>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="pt-2 border-t border-zinc-800 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <SafeExternalLink
                    key={link.id}
                    href={link.url}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
                  </SafeExternalLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-14 space-y-20">
        {activeSections.map((sec) => {
          // PROJECTS
          if (sec.key === "projects") {
            if (!hasProjects && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-projects" className="space-y-6 scroll-mt-20">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-mono">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>01. System Implementations & Projects</span>
                  </h2>
                  <span className="text-[11px] font-mono text-zinc-500">
                    [{visibleProjects.length} modules]
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {visibleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-850 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-emerald-400 font-semibold">{project.title}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400 uppercase text-[10px] px-1.5 py-0.5 rounded bg-zinc-800">
                              {project.category}
                            </span>
                            {project.status && (
                              <span className="text-[10px] text-zinc-500 font-mono">
                                status:{project.status}
                              </span>
                            )}
                          </div>
                          {project.tagline && (
                            <p className="text-xs text-zinc-400 font-medium">{project.tagline}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          {project.liveUrl && (
                            <SafeExternalLink
                              href={project.liveUrl}
                              className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                            >
                              Live <ArrowUpRight className="w-3 h-3" />
                            </SafeExternalLink>
                          )}
                          {project.repoUrl && (
                            <SafeExternalLink
                              href={project.repoUrl}
                              className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"
                            >
                              Repo <Code2 className="w-3 h-3" />
                            </SafeExternalLink>
                          )}
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-xs text-zinc-300 leading-relaxed font-light">
                          {project.description}
                        </p>
                      )}

                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.caseStudy && (
                        <div className="pt-2 border-t border-zinc-850">
                          <Link
                            href={`/p/${portfolio.slug}/projects/${project.id}`}
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 hover:underline"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Inspect Technical Case Study &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // EXPERIENCE
          if (sec.key === "experience") {
            if (!hasExperience && !isLivePreview) return null;

            return (
              <section key={sec.key} id="section-experience" className="space-y-6 scroll-mt-20">
                <div className="border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-bold text-white tracking-tight font-mono flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-400" />
                    <span>02. Engineering Tenures</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 font-mono">
                        <div className="text-xs font-semibold text-white">
                          {exp.role} <span className="text-zinc-500">@</span>{" "}
                          <span className="text-blue-400">{exp.company}</span>
                        </div>
                        <span className="text-[11px] text-zinc-500">
                          {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : "— Active"}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          {exp.description}
                        </p>
                      )}
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
              <section key={sec.key} id="section-skills" className="space-y-4 scroll-mt-20">
                <div className="border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-bold text-white tracking-tight font-mono">
                    03. Tech Stack & Systems
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="truncate">{s.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // CONTACT
          if (sec.key === "contact") {
            return (
              <section key={sec.key} id="section-contact" className="space-y-6 scroll-mt-20 pt-10 border-t border-zinc-800">
                <div className="text-center space-y-1 font-mono">
                  <h2 className="text-xl font-bold text-white">
                    04. Terminal Messaging Channel
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Direct RPC transmission to portfolio owner
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
      <footer className="border-t border-zinc-850 py-10 font-mono text-xs text-zinc-500 text-center">
        <span>{profile.fullName || "Product Engineer"} • Built with Portfolify Pro</span>
      </footer>
    </article>
  );
}
