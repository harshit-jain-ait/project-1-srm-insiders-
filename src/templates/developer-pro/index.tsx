import React from "react";
import { TemplateProps } from "../types";
import { ExternalLink, Mail, MapPin, Terminal, Code2, Briefcase, GraduationCap } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function DeveloperProTemplate({ portfolio, isLivePreview }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections } = portfolio;
  const orderedSections = sections.filter((s) => s.visible);

  return (
    <article className="min-h-screen bg-[#0c0d0e] text-zinc-100 font-sans selection:bg-blue-600/30 selection:text-white">
      {/* Top Technical Status Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-zinc-300">
              {profile.fullName ? `${profile.fullName.toLowerCase().replace(/\s+/g, "-")}.dev` : (isLivePreview ? "portfolio.dev" : "system.ready")}
            </span>
          </div>
          {profile.statusBadge && (
            <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded">
              <span className="text-blue-400">$</span> {profile.statusBadge}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        {/* Profile / Hero Section */}
        <header className="mb-16 border-b border-zinc-800/80 pb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-800/60 text-blue-400 text-xs font-mono">
                <Terminal className="w-3.5 h-3.5" /> Engineer Profile
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                {profile.fullName || (isLivePreview ? "Alex Chen" : "")}
              </h1>

              {profile.headline && (
                <p className="text-lg sm:text-xl text-zinc-300 font-normal">
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                  {profile.bio}
                </p>
              )}

              {/* Meta information and links */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
                {profile.location && (
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    {profile.email}
                  </a>
                )}
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-blue-400 transition-colors"
                  >
                    {link.platform === "github" && <GithubIcon className="w-3.5 h-3.5" />}
                    {link.platform === "linkedin" && <LinkedinIcon className="w-3.5 h-3.5" />}
                    {link.label}
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Section Ordering */}
        <main className="space-y-16">
          {orderedSections.map((sec) => {
            if (sec.key === "projects") {
              if (projects.length === 0) return null;
              return (
                <section key={sec.key} className="space-y-6" aria-labelledby="dev-projects">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <h2 id="dev-projects" className="text-sm font-mono uppercase tracking-wider text-zinc-200">
                      {sec.label || "Engineered Projects"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all group"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-base">
                              {proj.liveUrl ? (
                                <a
                                  href={proj.liveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5"
                                >
                                  {proj.title}
                                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                                </a>
                              ) : (
                                proj.title
                              )}
                            </h3>
                            {proj.repoUrl && (
                              <a
                                href={proj.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-zinc-400 hover:text-white p-1"
                                aria-label="Repository Link"
                              >
                                <GithubIcon className="w-4 h-4" />
                              </a>
                            )}
                          </div>

                          {proj.tagline && (
                            <p className="text-xs text-zinc-400 font-mono">{proj.tagline}</p>
                          )}

                          {proj.description && (
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                              {proj.description}
                            </p>
                          )}
                        </div>

                        {proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-zinc-800/60 font-mono text-[11px]">
                            {proj.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="bg-zinc-800/70 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/50"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.key === "experience") {
              if (experience.length === 0) return null;
              return (
                <section key={sec.key} className="space-y-6" aria-labelledby="dev-experience">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <h2 id="dev-experience" className="text-sm font-mono uppercase tracking-wider text-zinc-200">
                      {sec.label || "Experience"}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="rounded-lg border border-zinc-850 bg-zinc-900/20 p-5 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-medium text-white text-base">
                            {exp.role} <span className="text-blue-400">@ {exp.company}</span>
                          </h3>
                          <span className="text-xs font-mono text-zinc-400">
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                            {exp.description}
                          </p>
                        )}
                        {exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 pt-1 font-mono">
                            {exp.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.key === "skills") {
              if (skills.length === 0) return null;
              return (
                <section key={sec.key} className="space-y-4" aria-labelledby="dev-skills">
                  <div className="border-b border-zinc-800/80 pb-3">
                    <h2 id="dev-skills" className="text-sm font-mono uppercase tracking-wider text-zinc-200">
                      {sec.label || "Stack & Competencies"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="font-mono text-xs text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded hover:border-blue-700/60 transition-colors"
                      >
                        <span className="text-zinc-500 mr-1.5">#</span>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.key === "education") {
              if (education.length === 0) return null;
              return (
                <section key={sec.key} className="space-y-4" aria-labelledby="dev-education">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <h2 id="dev-education" className="text-sm font-mono uppercase tracking-wider text-zinc-200">
                      {sec.label || "Education"}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline p-4 rounded bg-zinc-900/30 border border-zinc-850">
                        <div>
                          <h3 className="text-sm font-medium text-white">{edu.institution}</h3>
                          <p className="text-xs text-zinc-400">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</p>
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <span className="text-xs text-zinc-500 font-mono">
                            {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ""}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            return null;
          })}
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-zinc-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <span>{profile.fullName || "portfolio"}</span>
          <span>Powered by Portfolify Engine</span>
        </footer>
      </div>
    </article>
  );
}
