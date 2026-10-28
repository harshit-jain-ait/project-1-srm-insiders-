/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, SocialPlatformIcon, EmptySectionHint, resolveTemplateTheme } from "../shared";
import { PublicContactForm } from "@/components/contact/public-contact-form";
import { getTechLogo } from "./tech-logos";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  MapPin,
  Mail,
  Briefcase,
  GraduationCap,
  Layers,
  Code2,
  Terminal,
  ArrowRight,
  ChevronUp,
} from "lucide-react";

export function BentoStudioTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections, contactConfig } = portfolio;

  const theme = resolveTemplateTheme(portfolio.appearance, "bento-studio");

  // Active sections defined by user
  const visibleProjects = (projects || []).filter((p) => isLivePreview || p.visible !== false);
  const isSectionVisible = (key: string) => {
    const sec = sections?.find((s) => s.key === key);
    return sec ? sec.visible !== false : true;
  };

  const hasProjects = visibleProjects.length > 0;
  const hasExperience = (experience || []).length > 0;
  const hasSkills = (skills || []).length > 0;
  const hasEducation = (education || []).length > 0;
  const hasContact = isSectionVisible("contact");

  const showProjects = isSectionVisible("projects") && (hasProjects || isLivePreview);
  const showExperience = isSectionVisible("experience") && hasExperience;
  const showEducation = isSectionVisible("education") && hasEducation;
  const showExperienceOrEdu = showExperience || showEducation;
  const showSkills = isSectionVisible("skills") && hasSkills;

  // Split projects into featured and supporting for Bento asymmetry
  const featuredProjects = visibleProjects.filter((p) => p.featured);
  const regularProjects = visibleProjects.filter((p) => !p.featured);

  // If no projects explicitly marked featured, treat the first 1-2 as prominent Bento cards
  const prominentList = featuredProjects.length > 0 ? featuredProjects : visibleProjects.slice(0, 1);
  const secondaryList = featuredProjects.length > 0 ? regularProjects : visibleProjects.slice(1);

  const displayName = profile.fullName?.trim() || "Creative Professional";
  const displayHeadline = profile.headline?.trim() || "Full-Stack Engineer & Product Architect";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BS";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <article
      className={`min-h-screen ${theme.fontClass} selection:bg-blue-600 selection:text-white transition-colors duration-200`}
      style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
    >
      {/* 1. COMPACT STICKY HEADER */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b transition-all"
        style={{
          backgroundColor: `${theme.bgColor}d9`,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Identity */}
          <Link
            href="#about"
            className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center font-mono text-xs text-blue-400 font-bold shadow-inner">
              {initials}
            </span>
            <span className="text-sm font-semibold">{displayName}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 border border-white/[0.06] text-xs font-medium text-zinc-400">
            <a href="#about" className="px-3 py-1 rounded-full hover:text-white hover:bg-zinc-800/60 transition-colors">
              About
            </a>
            {showProjects && (
              <a href="#projects" className="px-3 py-1 rounded-full hover:text-white hover:bg-zinc-800/60 transition-colors">
                Projects
              </a>
            )}
            {showExperience && (
              <a href="#experience" className="px-3 py-1 rounded-full hover:text-white hover:bg-zinc-800/60 transition-colors">
                Experience
              </a>
            )}
            {showEducation && !showExperience && (
              <a href="#education" className="px-3 py-1 rounded-full hover:text-white hover:bg-zinc-800/60 transition-colors">
                Education
              </a>
            )}
            {showSkills && (
              <a href="#skills" className="px-3 py-1 rounded-full hover:text-white hover:bg-zinc-800/60 transition-colors">
                Stack
              </a>
            )}
            {hasContact && (
              <a href="#contact" className="px-3 py-1 rounded-full hover:text-white hover:bg-zinc-800/60 transition-colors">
                Contact
              </a>
            )}
          </nav>

          {/* CTA Action */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN BENTO CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {/* HERO BENTO ROW (Asymmetric 4 / 8 Grid) */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
          {/* Card A: Personal Profile Bento (Col 1-4) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#111215] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              {/* Profile Avatar Frame */}
              <div className="relative inline-block">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/10 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border-2 border-white/10 flex items-center justify-center text-3xl font-bold font-mono text-zinc-300 shadow-lg">
                    {initials}
                  </div>
                )}
                {/* Status Dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#111215] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {displayName}
                </h1>
                <p className="text-xs sm:text-sm text-blue-400 font-medium mt-1 leading-snug">
                  {displayHeadline}
                </p>
              </div>

              {profile.location && (
                <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-light">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Social Pills */}
            <div className="pt-4 border-t border-white/[0.06] relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((link) => (
                    <SafeExternalLink
                      key={link.id}
                      href={link.url}
                      className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/[0.06] hover:border-blue-500/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all shadow-sm"
                      title={link.label}
                    >
                      <SocialPlatformIcon platform={link.platform} className="w-4 h-4" />
                    </SafeExternalLink>
                  ))
                ) : (
                  profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.06] text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{profile.email}</span>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Card B: Main Introduction Bento (Col 5-12) */}
          <div className="lg:col-span-8 rounded-3xl bg-[#111215] border border-white/[0.08] p-6 sm:p-10 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-5">
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-xs text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">
                    {profile.statusBadge || "Available for full-time & consulting"}
                  </span>
                </div>
                <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase">
                  Bento Studio Edition
                </span>
              </div>

              {/* Bold Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.15]">
                {profile.bio || "Crafting robust digital products, scalable systems, and intuitive user experiences with high precision."}
              </h2>

              {/* Extended narrative if present */}
              {profile.longBio && (
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
                  {profile.longBio}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Send Direct Email</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 3. TECHNOLOGY & SKILLS BENTO STRIP */}
        {hasSkills && (
          <section id="skills" className="rounded-3xl bg-[#111215] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Technology Stack & Core Competencies</span>
                </h3>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  Verified frameworks, languages, and development tooling.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {skills.length} Technical Skills
              </span>
            </div>

            {/* Logos & Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {skills.map((skill) => {
                const logo = getTechLogo(skill.name, "w-4 h-4");
                return (
                  <div
                    key={skill.id}
                    className="p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-blue-500/40 hover:bg-zinc-900 transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-black/50 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {logo || <Code2 className="w-3.5 h-3.5 text-zinc-400" />}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-semibold text-zinc-200 block truncate group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                      {skill.category && (
                        <span className="text-[10px] text-zinc-500 font-mono block truncate">
                          {skill.category}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. WORKS & PROJECTS BENTO SHOWCASE */}
        {showProjects && (
          <section id="projects" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-mono tracking-wider uppercase mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Selected Portfolio Works</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Works & Architecture Case Studies
                </h2>
              </div>
              <p className="text-xs text-zinc-400 max-w-md font-light">
                Meticulously crafted software, interactive systems, and product initiatives.
              </p>
            </div>

            {/* Empty state handling (only in live preview) */}
            {!hasProjects && isLivePreview && (
              <div className="rounded-3xl bg-[#111215] border border-white/[0.08] p-8 text-center space-y-3">
                <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Projects Added Yet</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Add your engineering projects, case studies, or design archives in the editor sidebar to showcase your work.
                </p>
                <EmptySectionHint
                  isLivePreview={isLivePreview}
                  sectionTitle="Projects"
                  actionHint="Add your first project in the editor to showcase your work."
                  theme="dark"
                />
              </div>
            )}

          {/* Asymmetric Bento Projects Grid */}
          {hasProjects && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Prominent / Featured Bento Cards (Span 2 cols on lg) */}
              {prominentList.map((project) => (
                <div
                  key={project.id}
                  className="lg:col-span-2 rounded-3xl bg-[#111215] border border-white/[0.08] hover:border-blue-500/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all shadow-xl group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Row: Category + Actions */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 font-semibold">
                        {project.category || "Featured Case Study"}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <SafeExternalLink
                            href={project.liveUrl}
                            className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                            title="Live Demo"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </SafeExternalLink>
                        )}
                        {project.repoUrl && (
                          <SafeExternalLink
                            href={project.repoUrl}
                            className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                            title="Source Code"
                          >
                            <Code2 className="w-4 h-4" />
                          </SafeExternalLink>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>
                      {project.tagline && (
                        <p className="text-xs text-zinc-400 font-medium mt-1">
                          {project.tagline}
                        </p>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-white/[0.06] text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Image Preview or Stylized Architecture Container */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-zinc-950 aspect-[16/9] flex items-center justify-center mt-4">
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full p-8 flex flex-col justify-between bg-gradient-to-br from-zinc-900/80 via-zinc-950 to-black">
                        <div className="flex justify-between items-center text-xs text-zinc-500 font-mono">
                          <span>SYSTEM ARCHITECTURE PREVIEW</span>
                          <span>ID: {project.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-center space-y-1">
                          <Layers className="w-8 h-8 text-blue-500/60 mx-auto" />
                          <span className="text-sm font-semibold text-zinc-300 block">
                            {project.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono text-right">
                          STATUS: VERIFIED
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Case Study Link if available */}
                  {project.caseStudy && (
                    <div className="pt-2">
                      <Link
                        href={`/p/${portfolio.slug}/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <span>Read Full Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              {/* Supporting Bento Cards (Span 1 col) */}
              {secondaryList.map((project) => (
                <div
                  key={project.id}
                  className="rounded-3xl bg-[#111215] border border-white/[0.08] hover:border-zinc-700 p-6 sm:p-7 flex flex-col justify-between space-y-4 transition-all shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
                        {project.category || "Project"}
                      </span>
                      {project.liveUrl && (
                        <SafeExternalLink
                          href={project.liveUrl}
                          className="w-7 h-7 rounded-full bg-zinc-900 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </SafeExternalLink>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h4>

                    <p className="text-xs text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Supporting Image or Tech Footer */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-2">
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.04]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 5. EXPERIENCE & EDUCATION BENTO ROW */}
      {showExperienceOrEdu && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
          {/* Experience Card */}
          {showExperience && (
            <div
              id="experience"
              className={`${
                showEducation ? "lg:col-span-7" : "lg:col-span-12"
              } rounded-3xl bg-[#111215] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl`}
            >
              <div className="border-b border-white/[0.06] pb-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>Career Tenure & Experience</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    Real professional leadership and employment history.
                  </p>
                </div>

                <div className="space-y-6">
                  {experience.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-zinc-900/50 border border-white/[0.04] space-y-2 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {item.role}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {item.startDate} {item.startDate && "–"} {item.current ? "Present" : item.endDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                        <span>{item.company}</span>
                        {item.location && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">{item.location}</span>
                          </>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-zinc-300 font-light leading-relaxed pt-1">
                          {item.description}
                        </p>
                      )}

                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="space-y-1 pt-1.5 text-xs text-zinc-400 font-light">
                          {item.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Card */}
            {showEducation && (
              <div
                id="education"
                className={`${
                  showExperience ? "lg:col-span-5" : "lg:col-span-12"
                } rounded-3xl bg-[#111215] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl`}
              >
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Education & Qualifications</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    Academic institutions, degrees, and certifications.
                  </p>
                </div>

                <div className="space-y-4">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-2xl bg-zinc-900/50 border border-white/[0.04] space-y-1.5 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {edu.degree}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {edu.endDate || edu.startDate}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">
                        {edu.institution}
                      </div>
                      {edu.fieldOfStudy && (
                        <div className="text-xs text-zinc-400 font-light">
                          {edu.fieldOfStudy}
                        </div>
                      )}
                      {edu.description && (
                        <p className="text-xs text-zinc-400 font-light pt-1 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 6. CONTACT & CALL TO ACTION BENTO CARD */}
        {hasContact && (
          <section id="contact" className="rounded-3xl bg-[#111215] border border-white/[0.08] p-6 sm:p-10 shadow-2xl relative overflow-hidden scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Let&apos;s Build Together</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Have a project or opportunity in mind?
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Reach out to discuss full-time engineering roles, technical architecture consulting, or bespoke product developments.
                </p>

                <div className="space-y-3 pt-2">
                  {profile.email && (
                    <div className="flex items-center gap-3 text-xs text-zinc-300">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Direct Email</span>
                        <a href={`mailto:${profile.email}`} className="text-zinc-200 hover:text-white transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-3 text-xs text-zinc-300">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Based in</span>
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Interactive Form Column */}
              <div className="lg:col-span-7">
                {contactConfig?.enabled !== false ? (
                  <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 sm:p-7 shadow-inner">
                    <h4 className="text-sm font-semibold text-white mb-4">
                      Send Direct Message
                    </h4>
                    <PublicContactForm portfolioId={portfolio.id} />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-zinc-900/40 border border-white/[0.06] p-6 text-center space-y-3">
                    <Mail className="w-6 h-6 text-zinc-500 mx-auto" />
                    <p className="text-xs text-zinc-400">
                      Contact form is currently in direct-email mode. Use the email above to connect.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 7. MINIMAL FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#08080a] py-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">{displayName}</span>
            <span>•</span>
            <span className="font-mono text-[11px]">Bento Studio Template</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </article>
  );
}
