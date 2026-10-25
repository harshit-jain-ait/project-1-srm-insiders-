"use client";

import React from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, EmptySectionHint } from "../shared";
import Link from "next/link";
import { Mail, ArrowUpRight, Compass, FileText, Sparkles } from "lucide-react";
import { PublicContactForm } from "@/components/contact/public-contact-form";

export function ReimaginedTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections, appearance, contactConfig } = portfolio;

  // Filter visible projects (hide hidden projects from public view)
  const visibleProjects = (projects || []).filter((p) => isLivePreview || p.visible !== false);

  const tokens = appearance.designTokens || {};
  const isDark =
    tokens.colorScheme === "dark" ||
    appearance.colorScheme === "dark" ||
    (tokens.backgroundColor && tokens.backgroundColor.startsWith("#0"));

  // Reimagined uses high-whitespace editorial styling
  const bgColor = tokens.backgroundColor || (isDark ? "#09090b" : "#fafaf9");
  const surfaceColor = tokens.surfaceColor || (isDark ? "#141518" : "#f4f4f2");
  const textColor = tokens.textColor || (isDark ? "#ffffff" : "#18181b");
  const mutedTextColor = tokens.mutedTextColor || (isDark ? "#a1a1aa" : "#71717a");
  const borderColor = tokens.borderColor || (isDark ? "#2d2e33" : "#e2e2e0");
  const accentColor = tokens.accentHex || "#356ae6";

  const fontClass =
    tokens.fontFamily === "sans"
      ? "font-sans"
      : tokens.fontFamily === "mono"
      ? "font-mono"
      : "font-serif";

  const activeSections = sections.filter((s) => s.visible);
  const hasProjects = visibleProjects.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;
  const hasEducation = education.length > 0;

  return (
    <article
      className={`min-h-screen ${fontClass} transition-colors duration-200 selection:bg-zinc-800 selection:text-white`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Editorial Floating Masthead */}
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between border-b" style={{ borderColor }}>
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5" style={{ color: accentColor }} />
          <span className="text-xs uppercase tracking-[0.25em] font-mono" style={{ color: mutedTextColor }}>
            {profile.fullName || (isLivePreview ? "PORTFOLIO" : "PORTFOLIO")} {"//"} REIMAGINED
          </span>
        </div>

        {profile.statusBadge && (
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border"
            style={{ backgroundColor: surfaceColor, borderColor, color: textColor }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span>{profile.statusBadge}</span>
          </div>
        )}
      </header>

      {/* Main Container: Editorial Asymmetrical Layout */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-20 md:space-y-32">
        {/* Editorial Split Hero Section */}
        {activeSections.some((s) => s.key === "profile") && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-baseline">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
                — Selected Profile & Direction
              </span>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08]">
                {profile.fullName || (isLivePreview ? "Your Name" : "")}
              </h1>

              {profile.headline && (
                <p className="text-xl sm:text-3xl font-light leading-snug" style={{ color: mutedTextColor }}>
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p className="text-base sm:text-lg leading-relaxed max-w-2xl pt-4 font-sans" style={{ color: mutedTextColor }}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Right Column: Quick Contact & Metadata */}
            <div className="lg:col-span-4 p-8 rounded-2xl border space-y-6" style={{ backgroundColor: surfaceColor, borderColor }}>
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: mutedTextColor }}>
                  Direct Inquiries
                </span>
                {profile.email ? (
                  <p className="text-sm font-medium font-mono truncate">{profile.email}</p>
                ) : (
                  <p className="text-xs italic" style={{ color: mutedTextColor }}>Email not specified</p>
                )}
              </div>

              {profile.location && (
                <div className="space-y-1 pt-2 border-t" style={{ borderColor }}>
                  <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: mutedTextColor }}>
                    Location
                  </span>
                  <p className="text-sm font-medium">{profile.location}</p>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="space-y-2 pt-2 border-t" style={{ borderColor }}>
                  <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: mutedTextColor }}>
                    External Network
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {socialLinks.map((link) => (
                      <SafeExternalLink
                        key={link.id}
                        href={link.url}
                        className="px-2.5 py-1 rounded text-xs border font-mono hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: bgColor, borderColor, color: textColor }}
                      >
                        {link.label}
                      </SafeExternalLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Selected Work: Magazine Editorial Grid */}
        {activeSections.some((s) => s.key === "projects") && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-6 gap-4" style={{ borderColor }}>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
                  01 / Works
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Project Anthology</h2>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: mutedTextColor }}>
                {visibleProjects.length} Works Catalogued
              </span>
            </div>

            {hasProjects ? (
              <div className="space-y-12">
                {visibleProjects.map((proj, idx) => {
                  const hasCaseStudy = Boolean(
                    (proj.caseStudy?.sections && proj.caseStudy.sections.length > 0) ||
                    proj.caseStudy?.overview
                  );

                  return (
                    <div
                      key={proj.id}
                      className="p-8 sm:p-10 rounded-2xl border transition-all hover:shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
                      style={{ backgroundColor: surfaceColor, borderColor }}
                    >
                      <div className="md:col-span-3 space-y-4">
                        <span className="text-4xl font-mono font-light opacity-30">
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        {proj.coverImageUrl && (
                          <div
                            className="overflow-hidden rounded-xl border max-h-40"
                            style={{ borderColor }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={proj.coverImageUrl}
                              alt={proj.title || "Project cover"}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-9 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{proj.title}</h3>
                            {proj.featured && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded-full border"
                                style={{
                                  backgroundColor: bgColor,
                                  borderColor: accentColor,
                                  color: accentColor,
                                }}
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                Featured
                              </span>
                            )}
                          </div>
                          {proj.liveUrl && (
                            <SafeExternalLink
                              href={proj.liveUrl}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border hover:opacity-80"
                              style={{ backgroundColor: bgColor, borderColor, color: textColor }}
                            >
                              <span>Live View</span>
                              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: accentColor }} />
                            </SafeExternalLink>
                          )}
                        </div>

                        {proj.tagline && (
                          <p className="text-sm font-medium" style={{ color: accentColor }}>
                            {proj.tagline}
                          </p>
                        )}

                        {proj.description && (
                          <p className="text-base leading-relaxed font-sans" style={{ color: mutedTextColor }}>
                            {proj.description}
                          </p>
                        )}

                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {proj.technologies.map((t) => (
                              <span
                                key={t}
                                className="text-xs font-mono px-2.5 py-1 rounded-md border"
                                style={{ backgroundColor: bgColor, borderColor, color: mutedTextColor }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {hasCaseStudy && (
                          <div className="pt-4 border-t" style={{ borderColor }}>
                            <Link
                              href={`/p/${portfolio.slug}/projects/${proj.id}`}
                              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider hover:opacity-80 transition-opacity"
                              style={{ color: accentColor }}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Explore In-Depth Case Study →</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Projects"
                actionHint="Add project titles, architecture summaries, and live demo links."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Experience Timeline */}
        {activeSections.some((s) => s.key === "experience") && (
          <section className="space-y-10">
            <div className="border-b pb-6" style={{ borderColor }}>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
                02 / Chronology
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Professional History</h2>
            </div>

            {hasExperience ? (
              <div className="relative border-l ml-3 sm:ml-4 space-y-10 pl-6 sm:pl-8" style={{ borderColor }}>
                {experience.map((exp) => (
                  <div key={exp.id} className="relative space-y-2">
                    <div
                      className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: bgColor, borderColor: accentColor }}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-lg font-bold">{exp.role}</h3>
                      <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                      </span>
                    </div>

                    <p className="text-sm font-medium" style={{ color: accentColor }}>
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>

                    {exp.description && (
                      <p className="text-sm leading-relaxed max-w-3xl font-sans" style={{ color: mutedTextColor }}>
                        {exp.description}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-xs space-y-1 pt-1 font-sans" style={{ color: mutedTextColor }}>
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Experience"
                actionHint="Add employment tenure and key technical responsibilities."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Skills & Capabilities */}
        {activeSections.some((s) => s.key === "skills") && (
          <section className="space-y-8">
            <div className="border-b pb-6" style={{ borderColor }}>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
                03 / Competencies
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Tools & Frameworks</h2>
            </div>

            {hasSkills ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl border flex flex-col justify-between gap-2"
                    style={{ backgroundColor: surfaceColor, borderColor }}
                  >
                    <span className="text-xs font-mono uppercase tracking-wider" style={{ color: mutedTextColor }}>
                      {s.category || "Skill"}
                    </span>
                    <span className="text-sm font-semibold">{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Skills"
                actionHint="Add frameworks, languages, and competencies."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Education */}
        {activeSections.some((s) => s.key === "education") && (
          <section className="space-y-8">
            <div className="border-b pb-6" style={{ borderColor }}>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
                04 / Academics
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Education & Credentials</h2>
            </div>

            {hasEducation ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {education.map((edu) => (
                  <div key={edu.id} className="p-6 rounded-xl border space-y-2" style={{ backgroundColor: surfaceColor, borderColor }}>
                    <h3 className="text-base font-bold">{edu.institution}</h3>
                    <p className="text-xs" style={{ color: accentColor }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </p>
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-[11px] font-mono" style={{ color: mutedTextColor }}>
                        {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Education"
                actionHint="Add academic training and degree milestones."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Contact Banner */}
        {activeSections.some((s) => s.key === "contact") && (
          <section
            className="p-10 sm:p-16 rounded-3xl border text-center space-y-6"
            style={{ backgroundColor: surfaceColor, borderColor }}
          >
            <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: accentColor }}>
              Connect & Collaborate
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Let&apos;s Build Together</h2>
            <p className="text-base max-w-lg mx-auto font-sans" style={{ color: mutedTextColor }}>
              Available for ambitious engineering initiatives, architectural reviews, and consulting engagements.
            </p>

            <PublicContactForm
              portfolioId={portfolio.id}
              config={contactConfig}
              isLivePreview={isLivePreview}
            />

            {profile.email && (
              <div className="pt-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </a>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t flex flex-col sm:flex-row items-center justify-between text-xs font-mono" style={{ borderColor, color: mutedTextColor }}>
        <span>© {new Date().getFullYear()} {profile.fullName || "Portfolio"}.</span>
        <span className="mt-2 sm:mt-0">Portfolify • Reimagined Direction</span>
      </footer>
    </article>
  );
}
