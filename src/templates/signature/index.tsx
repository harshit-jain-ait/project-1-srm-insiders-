"use client";

import React, { useState } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, EmptySectionHint, SocialPlatformIcon } from "../shared";
import { Mail, MapPin, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

export function SignatureTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections, appearance } = portfolio;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tokens = appearance.designTokens || {};
  const isDark =
    tokens.colorScheme === "dark" ||
    appearance.colorScheme === "dark" ||
    (tokens.backgroundColor && tokens.backgroundColor.startsWith("#0"));

  // Apply design tokens or fallback to clean harmonious palette
  const bgColor = tokens.backgroundColor || (isDark ? "#0e1015" : "#ffffff");
  const surfaceColor = tokens.surfaceColor || (isDark ? "#181a20" : "#f4f4f5");
  const textColor = tokens.textColor || (isDark ? "#f4f4f5" : "#09090b");
  const mutedTextColor = tokens.mutedTextColor || (isDark ? "#a1a1aa" : "#71717a");
  const borderColor = tokens.borderColor || (isDark ? "#27272a" : "#e4e4e7");
  const accentColor = tokens.accentHex || "#356ae6";

  const fontClass =
    appearance.fontFamily === "serif" || tokens.fontFamily === "serif"
      ? "font-serif"
      : appearance.fontFamily === "mono" || tokens.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  // Filter sections that are visible
  const activeSections = sections.filter((s) => s.visible);
  const hasProjects = projects.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;
  const hasEducation = education.length > 0;
  const hasContact = Boolean(profile.email || socialLinks.length > 0);

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

  return (
    <article
      className={`min-h-screen ${fontClass} transition-colors duration-200`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Top Source-Harmonized Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md transition-colors"
        style={{
          backgroundColor: `${bgColor}e6`,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <a
              href="#top"
              className="text-base font-semibold tracking-tight hover:opacity-80 transition-opacity"
            >
              {profile.fullName || (isLivePreview ? "Your Portfolio" : "Portfolio")}
            </a>
          </div>

          {/* Desktop Nav */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="hover:opacity-100 transition-opacity"
                  style={{ color: mutedTextColor }}
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
              className="md:hidden p-1.5 rounded"
              style={{ color: textColor }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && navItems.length > 0 && (
          <div
            className="md:hidden px-6 py-4 flex flex-col gap-3 text-sm font-medium border-b"
            style={{ backgroundColor: surfaceColor, borderColor }}
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1"
                style={{ color: mutedTextColor }}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* Profile / Hero Section */}
        {activeSections.some((s) => s.key === "profile") && (
          <section id="top" className="space-y-6">
            {profile.statusBadge && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor,
                  color: textColor,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>{profile.statusBadge}</span>
              </div>
            )}

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                {profile.fullName || (isLivePreview ? "Add Your Full Name" : "")}
              </h1>
              {profile.headline && (
                <p className="text-xl sm:text-2xl font-medium" style={{ color: accentColor }}>
                  {profile.headline}
                </p>
              )}
            </div>

            {profile.bio && (
              <p
                className="text-base sm:text-lg leading-relaxed max-w-3xl"
                style={{ color: mutedTextColor }}
              >
                {profile.bio}
              </p>
            )}

            {/* Location & Contact Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2" style={{ color: mutedTextColor }}>
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSections.some((s) => s.key === "projects") && (
          <section id="section-projects" className="space-y-8 scroll-mt-20">
            <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor }}>
              <h2 className="text-2xl font-bold tracking-tight">Selected Work</h2>
              <span className="text-xs uppercase tracking-widest font-mono" style={{ color: mutedTextColor }}>
                {projects.length} {projects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>

            {hasProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-xl border flex flex-col justify-between transition-all hover:translate-y-[-2px]"
                    style={{
                      backgroundColor: surfaceColor,
                      borderColor,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold tracking-tight">{proj.title}</h3>
                        {proj.liveUrl && (
                          <SafeExternalLink
                            href={proj.liveUrl}
                            className="p-1 rounded hover:opacity-80"
                            aria-label={`Open ${proj.title} live demo`}
                          >
                            <ArrowUpRight className="w-4 h-4" style={{ color: accentColor }} />
                          </SafeExternalLink>
                        )}
                      </div>

                      {proj.tagline && (
                        <p className="text-xs font-medium" style={{ color: accentColor }}>
                          {proj.tagline}
                        </p>
                      )}

                      {proj.description && (
                        <p className="text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                          {proj.description}
                        </p>
                      )}
                    </div>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t" style={{ borderColor }}>
                        {proj.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-mono px-2 py-0.5 rounded border"
                            style={{
                              backgroundColor: bgColor,
                              borderColor,
                              color: mutedTextColor,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Projects"
                actionHint="Add case studies and engineering projects in the editor to populate this list."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Experience Section */}
        {activeSections.some((s) => s.key === "experience") && (
          <section id="section-experience" className="space-y-8 scroll-mt-20">
            <div className="border-b pb-4" style={{ borderColor }}>
              <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
            </div>

            {hasExperience ? (
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-xl border space-y-3"
                    style={{ backgroundColor: surfaceColor, borderColor }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="text-base font-semibold">{exp.role}</h3>
                        <p className="text-sm font-medium" style={{ color: accentColor }}>
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                      </div>
                      <div className="text-xs font-mono" style={{ color: mutedTextColor }}>
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                        {exp.description}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-xs space-y-1 pt-1" style={{ color: mutedTextColor }}>
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
                actionHint="Add employment history and engineering responsibilities to populate this section."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Skills Section */}
        {activeSections.some((s) => s.key === "skills") && (
          <section id="section-skills" className="space-y-6 scroll-mt-20">
            <div className="border-b pb-4" style={{ borderColor }}>
              <h2 className="text-2xl font-bold tracking-tight">Capabilities & Stack</h2>
            </div>

            {hasSkills ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                    style={{
                      backgroundColor: surfaceColor,
                      borderColor,
                      color: textColor,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Skills"
                actionHint="Add technical competencies, languages, and tools in the editor."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Education Section */}
        {activeSections.some((s) => s.key === "education") && (
          <section id="section-education" className="space-y-6 scroll-mt-20">
            <div className="border-b pb-4" style={{ borderColor }}>
              <h2 className="text-2xl font-bold tracking-tight">Education</h2>
            </div>

            {hasEducation ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 rounded-xl border space-y-1.5"
                    style={{ backgroundColor: surfaceColor, borderColor }}
                  >
                    <h3 className="text-sm font-semibold">{edu.institution}</h3>
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
                actionHint="Add degree programs, certifications, or academic background."
                theme={isDark ? "dark" : "light"}
              />
            )}
          </section>
        )}

        {/* Contact Section */}
        {activeSections.some((s) => s.key === "contact") && (
          <section
            id="section-contact"
            className="p-8 rounded-2xl border space-y-4 text-center scroll-mt-20"
            style={{ backgroundColor: surfaceColor, borderColor }}
          >
            <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: mutedTextColor }}>
              Open to new engineering inquiries, collaborations, and discussions.
            </p>
            {profile.email && (
              <div className="pt-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </a>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                {socialLinks.map((link) => (
                  <SafeExternalLink
                    key={link.id}
                    href={link.url}
                    className="p-2 rounded-lg border hover:opacity-80 transition-all"
                    style={{ backgroundColor: bgColor, borderColor, color: textColor }}
                    aria-label={link.label}
                  >
                    <SocialPlatformIcon platform={link.platform} className="w-4 h-4" />
                  </SafeExternalLink>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        className="max-w-5xl mx-auto px-6 py-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs"
        style={{ borderColor, color: mutedTextColor }}
      >
        <span>
          © {new Date().getFullYear()} {profile.fullName || "Portfolio"}. All rights reserved.
        </span>
        <span className="font-mono text-[11px] mt-2 sm:mt-0">
          Built with Portfolify • Signature Direction
        </span>
      </footer>
    </article>
  );
}
