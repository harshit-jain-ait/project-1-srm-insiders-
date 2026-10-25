import React from "react";
import { TemplateProps } from "../types";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function MinimalPortfolioTemplate({ portfolio, isLivePreview }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections } = portfolio;

  // Filter visible sections and sort according to section ordering
  const orderedSections = sections.filter((s) => s.visible);

  return (
    <article className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Profile Header */}
        <header className="mb-20">
          {profile.statusBadge && (
            <div className="inline-flex items-center text-xs font-medium tracking-wide uppercase text-zinc-500 mb-6 bg-zinc-100 px-2.5 py-1 rounded">
              {profile.statusBadge}
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 mb-4 font-serif">
            {profile.fullName || (isLivePreview ? "Your Name" : "")}
          </h1>

          {profile.headline && (
            <p className="text-xl sm:text-2xl font-light text-zinc-600 mb-6 leading-relaxed">
              {profile.headline}
            </p>
          )}

          {profile.bio && (
            <p className="text-base text-zinc-600 leading-relaxed max-w-2xl mb-8">
              {profile.bio}
            </p>
          )}

          {/* Contact & Social Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-600 pt-2 border-t border-zinc-200">
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 text-zinc-500">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </a>
            )}
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-zinc-950 transition-colors"
              >
                {link.platform === "github" && <GithubIcon className="w-3.5 h-3.5" />}
                {link.platform === "linkedin" && <LinkedinIcon className="w-3.5 h-3.5" />}
                {link.label}
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            ))}
          </div>
        </header>

        {/* Dynamic Sections Based on Configuration */}
        <main className="space-y-20">
          {orderedSections.map((sec) => {
            if (sec.key === "projects") {
              if (projects.length === 0) return null;
              return (
                <section key={sec.key} className="space-y-8" aria-labelledby="section-projects">
                  <div className="border-b border-zinc-200 pb-3">
                    <h2 id="section-projects" className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                      {sec.label || "Featured Projects"}
                    </h2>
                  </div>
                  <div className="space-y-12">
                    {projects.map((proj) => (
                      <div key={proj.id} className="group">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <h3 className="text-lg font-medium text-zinc-950 group-hover:text-blue-600 transition-colors">
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
                              className="text-xs text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1"
                            >
                              <GithubIcon className="w-3 h-3" /> Source
                            </a>
                          )}
                        </div>
                        {proj.tagline && (
                          <p className="text-sm text-zinc-500 mb-2 font-light">{proj.tagline}</p>
                        )}
                        {proj.description && (
                          <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                            {proj.description}
                          </p>
                        )}
                        {proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {proj.technologies.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded"
                              >
                                {t}
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
                <section key={sec.key} className="space-y-8" aria-labelledby="section-experience">
                  <div className="border-b border-zinc-200 pb-3">
                    <h2 id="section-experience" className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                      {sec.label || "Experience"}
                    </h2>
                  </div>
                  <div className="space-y-10">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h3 className="text-base font-medium text-zinc-900">
                            {exp.role} <span className="text-zinc-400 font-normal">at</span> {exp.company}
                          </h3>
                          <span className="text-xs text-zinc-500 font-mono">
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-zinc-600 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                        {exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-zinc-500 space-y-1 pl-1">
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
                <section key={sec.key} className="space-y-6" aria-labelledby="section-skills">
                  <div className="border-b border-zinc-200 pb-3">
                    <h2 id="section-skills" className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                      {sec.label || "Skills & Focus"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs font-medium text-zinc-700 bg-white border border-zinc-200 px-3 py-1 rounded"
                      >
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
                <section key={sec.key} className="space-y-6" aria-labelledby="section-education">
                  <div className="border-b border-zinc-200 pb-3">
                    <h2 id="section-education" className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                      {sec.label || "Education"}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-900">{edu.institution}</h3>
                          <p className="text-xs text-zinc-500">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</p>
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <span className="text-xs text-zinc-400 font-mono">
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
        <footer className="mt-28 pt-8 border-t border-zinc-200 text-xs text-zinc-400 flex justify-between items-center">
          <span>{profile.fullName || "Portfolio"}</span>
          <span>Built with Portfolify</span>
        </footer>
      </div>
    </article>
  );
}
