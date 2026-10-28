/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, SocialPlatformIcon, EmptySectionHint, resolveTemplateTheme } from "../shared";
import { PublicContactForm } from "@/components/contact/public-contact-form";
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
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

export function KineticStudioTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections, contactConfig } = portfolio;

  // Resolve base theme tokens
  const baseTheme = resolveTemplateTheme(portfolio.appearance, "kinetic-studio");

  // Local theme toggle (allows visitor to flip day/night view smoothly like reference site)
  const [isDayMode, setIsDayMode] = useState<boolean>(!baseTheme.isDark);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);

  // Active theme computed based on local mode or default
  const isDark = !isDayMode;
  const bgColor = isDark ? (portfolio.appearance.designTokens?.backgroundColor || "#0e0e0c") : "#e9e9e4";
  const surfaceColor = isDark ? (portfolio.appearance.designTokens?.surfaceColor || "#1b1b18") : "#dededa";
  const textColor = isDark ? (portfolio.appearance.designTokens?.textColor || "#edede6") : "#101010";
  const mutedTextColor = isDark ? (portfolio.appearance.designTokens?.mutedTextColor || "#8a8a82") : "#63635e";
  const borderColor = isDark ? (portfolio.appearance.designTokens?.borderColor || "rgba(237, 237, 230, 0.14)") : "rgba(16, 16, 16, 0.14)";
  const accentColor = portfolio.appearance.designTokens?.accentHex || "#ff5c1a";

  const fontClass =
    portfolio.appearance?.fontFamily === "mono"
      ? "font-mono"
      : portfolio.appearance?.fontFamily === "serif"
      ? "font-serif"
      : "font-sans";

  // Visible sections
  const isSectionVisible = (key: string) => {
    const sec = sections?.find((s) => s.key === key);
    return sec ? sec.visible !== false : true;
  };

  const visibleProjects = (projects || []).filter((p) => isLivePreview || p.visible !== false);
  const hasProjects = visibleProjects.length > 0;
  const hasExperience = (experience || []).length > 0;
  const hasSkills = (skills || []).length > 0;
  const hasEducation = (education || []).length > 0;
  const hasContact = isSectionVisible("contact");

  const displayName = profile.fullName?.trim() || "Shreyas";
  const displayHeadline = profile.headline?.trim() || "AI & Full-Stack Engineer";
  const displayBio = profile.bio?.trim() || "I build AI systems that live in the real world — agentic AI, RAG systems, and full-stack engineering.";
  const displayLongBio = profile.longBio?.trim() || "I build autonomous agentic workflows and robust RAG pipelines, then integrate them into high-performance web products. Whether architecting cloud-deployed civic-tech platforms or engineering WebGL experiences, the focus is the same: clean, scalable software that ships.";

  // Technology Marquee items
  const marqueeItems = hasSkills
    ? skills.map((s) => s.name)
    : [
        "React",
        "Next.js",
        "Three.js",
        "FastAPI",
        "LangGraph",
        "MCP",
        "RAG",
        "Python",
        "PostgreSQL",
        "AWS",
        "Groq",
        "WebGL",
        "Node.js",
        "Tailwind CSS",
        "Vercel",
      ];

  // Group skills into 3 engineering pillars
  const pillar1Skills = (skills || []).slice(0, Math.ceil(skills.length / 3));
  const pillar2Skills = (skills || []).slice(Math.ceil(skills.length / 3), Math.ceil((skills.length * 2) / 3));
  const pillar3Skills = (skills || []).slice(Math.ceil((skills.length * 2) / 3));

  const fallbackPillar1 = ["Agentic AI", "LangGraph", "RAG Systems", "MCP Protocols", "LLM Fine-Tuning", "Vector Search"];
  const fallbackPillar2 = ["React 19", "Next.js", "TypeScript", "Three.js / WebGL", "Tailwind CSS", "Motion Graphics"];
  const fallbackPillar3 = ["FastAPI", "Python", "PostgreSQL", "AWS Infrastructure", "Docker", "Render / Vercel"];

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <article
      className={`min-h-screen ${fontClass} selection:bg-[#ff5c1a] selection:text-white transition-colors duration-500`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Dynamic Keyframes for Marquee & Kinetic Pulse */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kineticMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes kineticScrollLine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes kineticDotPulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 92, 26, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 92, 26, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 92, 26, 0); }
        }
        .kinetic-marquee-track {
          display: flex;
          width: max-content;
          animation: kineticMarquee 28s linear infinite;
        }
        .kinetic-marquee-track:hover {
          animation-play-state: paused;
        }
        .kinetic-scroll-anim {
          animation: kineticScrollLine 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        .kinetic-pulse-dot {
          animation: kineticDotPulse 2.4s ease-out infinite;
        }
      `}} />

      {/* 1. STICKY NAV BAR */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md transition-all duration-300 border-b"
        style={{
          backgroundColor: isDark ? "rgba(14, 14, 12, 0.88)" : "rgba(233, 233, 228, 0.88)",
          borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo with registered symbol in accent */}
          <a
            href="#hero"
            className="flex items-center gap-1 font-bold tracking-tight text-lg uppercase transition-opacity hover:opacity-80"
          >
            <span>{displayName}</span>
            <sup style={{ color: accentColor }} className="text-xs font-mono font-bold">
              ®
            </sup>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.1em]">
            {isSectionVisible("projects") && (
              <a
                href="#work"
                className="transition-colors hover:text-[#ff5c1a] relative group py-1"
                style={{ color: mutedTextColor }}
              >
                Work
                <span
                  className="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  style={{ backgroundColor: accentColor }}
                />
              </a>
            )}
            {isSectionVisible("skills") && (
              <a
                href="#stack"
                className="transition-colors hover:text-[#ff5c1a] relative group py-1"
                style={{ color: mutedTextColor }}
              >
                Stack
                <span
                  className="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  style={{ backgroundColor: accentColor }}
                />
              </a>
            )}
            {(hasExperience || hasEducation) && (
              <a
                href="#journey"
                className="transition-colors hover:text-[#ff5c1a] relative group py-1"
                style={{ color: mutedTextColor }}
              >
                Journey
                <span
                  className="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  style={{ backgroundColor: accentColor }}
                />
              </a>
            )}
            <a
              href="#freelance"
              className="transition-colors hover:text-[#ff5c1a] relative group py-1"
              style={{ color: mutedTextColor }}
            >
              Freelance
              <span
                className="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                style={{ backgroundColor: accentColor }}
              />
            </a>
            {hasContact && (
              <a
                href="#contact"
                className="transition-colors hover:text-[#ff5c1a] relative group py-1 font-semibold"
                style={{ color: textColor }}
              >
                Contact
                <span
                  className="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  style={{ backgroundColor: accentColor }}
                />
              </a>
            )}
          </nav>

          {/* Action buttons (Command Key, Theme Toggle, Mobile Burger) */}
          <div className="flex items-center gap-3">
            {/* Command Menu Pill Indicator */}
            <div
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-mono"
              style={{ borderColor, color: mutedTextColor }}
            >
              <span>⌘</span>
              <span>K</span>
            </div>

            {/* Day / Night Theme Switcher */}
            <button
              type="button"
              onClick={() => setIsDayMode(!isDayMode)}
              aria-label="Toggle theme mode"
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              style={{ borderColor, color: textColor }}
            >
              {isDayMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer"
              style={{ borderColor, color: textColor }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-6 py-6 border-b font-mono text-sm uppercase tracking-wider space-y-4"
            style={{ backgroundColor: bgColor, borderColor }}
          >
            {isSectionVisible("projects") && (
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#ff5c1a]"
              >
                Work
              </a>
            )}
            {isSectionVisible("skills") && (
              <a
                href="#stack"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#ff5c1a]"
              >
                Stack
              </a>
            )}
            {(hasExperience || hasEducation) && (
              <a
                href="#journey"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#ff5c1a]"
              >
                Journey
              </a>
            )}
            <a
              href="#freelance"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#ff5c1a]"
            >
              Freelance
            </a>
            {hasContact && (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#ff5c1a]"
              >
                Contact
              </a>
            )}
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative min-h-[85vh] flex flex-col justify-between pt-16 pb-12 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, rgba(110,86,207,0.3) 50%, transparent 80%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center">
          {/* Top Status Pill */}
          {profile.statusBadge && (
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-wider uppercase backdrop-blur-sm"
                style={{
                  borderColor,
                  backgroundColor: isDark ? "rgba(255,92,26,0.06)" : "rgba(255,92,26,0.08)",
                  color: textColor,
                }}
              >
                <span className="w-2 h-2 rounded-full kinetic-pulse-dot" style={{ backgroundColor: accentColor }} />
                <span>{profile.statusBadge}</span>
              </div>
            </div>
          )}

          {/* Kinetic Statement Title */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.98]">
                <span className="block">I&apos;m {displayName} —</span>
                <span className="block">I build {displayHeadline.split("•")[0].split("&")[0].trim()}</span>
                <span className="block" style={{ color: mutedTextColor }}>
                  that live in
                </span>
                <span className="block" style={{ color: mutedTextColor }}>
                  the real world.
                </span>
              </h1>
            </div>

            {/* Aside Tagline */}
            <div className="lg:col-span-4 lg:text-right space-y-2">
              <p className="font-mono uppercase text-xs sm:text-sm tracking-wider leading-relaxed" style={{ color: mutedTextColor }}>
                Crafting {displayHeadline}
              </p>
              <p className="font-mono text-xs uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
                &amp; High-Performance Systems
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="max-w-7xl mx-auto px-6 w-full pt-10 flex items-center gap-4 text-xs font-mono uppercase tracking-[0.15em]" style={{ color: mutedTextColor }}>
          <span>Scroll</span>
          <div className="w-16 h-[1px] relative overflow-hidden" style={{ backgroundColor: borderColor }}>
            <div className="absolute inset-0 kinetic-scroll-anim" style={{ backgroundColor: accentColor }} />
          </div>
        </div>
      </section>

      {/* 3. INFINITE TECHNOLOGY MARQUEE */}
      <div className="border-y overflow-hidden py-4 select-none" style={{ borderColor, backgroundColor: surfaceColor }}>
        <div className="kinetic-marquee-track flex items-center gap-8">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((tech, idx) => (
            <div key={`${tech}-${idx}`} className="flex items-center gap-8 text-sm sm:text-base font-mono uppercase tracking-wider font-semibold" style={{ color: mutedTextColor }}>
              <span>{tech}</span>
              <span style={{ color: accentColor }} className="text-xs">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION 01 — ABOUT */}
      <section id="about" className="py-24 border-b" style={{ borderColor }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header with Numbered Index & Rule */}
          <div className="flex items-center gap-6 mb-16">
            <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase shrink-0" style={{ color: accentColor }}>
              01 — About
            </h2>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
          </div>

          <div className="max-w-4xl ml-auto space-y-8">
            <p className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-snug">
              {displayBio}
            </p>

            <p className="text-base sm:text-lg leading-relaxed font-light" style={{ color: mutedTextColor }}>
              {displayLongBio}
            </p>

            <p className="font-mono text-xs uppercase tracking-widest font-semibold" style={{ color: mutedTextColor }}>
              {displayHeadline} &bull; {profile.location || "Available Globally"}
            </p>

            {/* Focus Competencies */}
            <ul className="pt-6 border-t space-y-3" style={{ borderColor }}>
              <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b" style={{ borderColor }}>
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                  01 &bull; Autonomous AI &amp; Agents
                </span>
                <span className="text-sm" style={{ color: mutedTextColor }}>
                  LangGraph &bull; RAG Architectures &bull; Tool Calling &bull; Context Routing
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b" style={{ borderColor }}>
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                  02 &bull; Interactive Web Applications
                </span>
                <span className="text-sm" style={{ color: mutedTextColor }}>
                  React 19 &bull; Next.js App Router &bull; Three.js / WebGL &bull; High-FPS UI
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b" style={{ borderColor }}>
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                  03 &bull; Scalable Cloud &amp; Deployments
                </span>
                <span className="text-sm" style={{ color: mutedTextColor }}>
                  AWS &bull; FastAPI &bull; PostgreSQL &bull; Docker &bull; Edge Delivery
                </span>
              </li>
            </ul>
          </div>

          {/* 4-Column Stats Grid */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 border-t" style={{ borderColor }}>
            <div className="p-6 sm:p-8 border-r border-b lg:border-b-0" style={{ borderColor }}>
              <span className="block text-4xl sm:text-5xl font-black font-sans tracking-tight">
                1<span className="text-xl align-super" style={{ color: accentColor }}>st</span>
              </span>
              <span className="block mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: mutedTextColor }}>
                Top Hackathon Placements
              </span>
            </div>

            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r" style={{ borderColor }}>
              <span className="block text-4xl sm:text-5xl font-black font-sans tracking-tight">
                {String(visibleProjects.length || 5).padStart(2, "0")}
              </span>
              <span className="block mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: mutedTextColor }}>
                Projects Shipped
              </span>
            </div>

            <div className="p-6 sm:p-8 border-r border-b sm:border-b-0" style={{ borderColor }}>
              <span className="block text-4xl sm:text-5xl font-black font-sans tracking-tight">
                {String(experience.length || 4).padStart(2, "0")}
              </span>
              <span className="block mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: mutedTextColor }}>
                Professional Tenures
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <span className="block text-4xl sm:text-5xl font-black font-sans tracking-tight">
                {String(skills.length || 16).padStart(2, "0")}+
              </span>
              <span className="block mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: mutedTextColor }}>
                Verified Technologies
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 02 — WORK */}
      {isSectionVisible("projects") && (
        <section id="work" className="py-24 border-b" style={{ borderColor }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase shrink-0" style={{ color: accentColor }}>
                02 — Work
              </h2>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
            </div>

            {!hasProjects ? (
              <EmptySectionHint
                isLivePreview={isLivePreview}
                sectionTitle="Projects"
                actionHint="Add your engineered systems or case studies in the editor."
                theme={isDark ? "dark" : "light"}
              />
            ) : (
              <div className="divide-y border-y" style={{ borderColor }}>
                {visibleProjects.map((project, idx) => {
                  const isExpanded = expandedProjectIndex === idx;
                  const projectIndex = String(idx + 1).padStart(2, "0");
                  const techList = project.technologies || [];

                  return (
                    <div
                      key={project.id || idx}
                      className="py-12 group transition-colors duration-200"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Index Indicator */}
                        <div className="lg:col-span-1 font-mono text-base font-bold" style={{ color: accentColor }}>
                          {projectIndex}
                        </div>

                        {/* Title & Core Details */}
                        <div className="lg:col-span-6 space-y-4">
                          <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight group-hover:translate-x-1.5 transition-transform duration-300">
                            {project.title}
                          </h3>

                          {project.tagline && (
                            <p className="text-base font-medium" style={{ color: textColor }}>
                              {project.tagline}
                            </p>
                          )}

                          <p className="text-sm leading-relaxed max-w-xl" style={{ color: mutedTextColor }}>
                            {project.description}
                          </p>

                          {/* Tech Pills */}
                          {techList.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {techList.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border"
                                  style={{ borderColor, color: mutedTextColor }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Links */}
                          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-mono uppercase tracking-wider">
                            {project.caseStudy?.overview && (
                              <Link
                                href={`/p/case-study/${project.id}`}
                                className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-[#ff5c1a] transition-colors"
                                style={{ color: accentColor }}
                              >
                                <span>Read Case Study</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                            {project.liveUrl && (
                              <SafeExternalLink
                                href={project.liveUrl}
                                className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#ff5c1a] transition-colors"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </SafeExternalLink>
                            )}
                            {project.repoUrl && (
                              <SafeExternalLink
                                href={project.repoUrl}
                                className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#ff5c1a] transition-colors"
                              >
                                <span>GitHub Source</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </SafeExternalLink>
                            )}

                            {/* Expandable Technical Notes Accordion */}
                            {(project.caseStudy?.problem || project.caseStudy?.solution) && (
                              <button
                                type="button"
                                onClick={() => setExpandedProjectIndex(isExpanded ? null : idx)}
                                className="inline-flex items-center gap-1 text-[11px] underline underline-offset-4 cursor-pointer hover:text-[#ff5c1a] transition-colors"
                                style={{ color: mutedTextColor }}
                              >
                                <span>{isExpanded ? "Hide Details" : "Key Highlights"}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            )}
                          </div>

                          {/* Accordion Content */}
                          {isExpanded && (
                            <div className="mt-4 p-4 rounded-xl border text-xs space-y-2 font-mono" style={{ backgroundColor: surfaceColor, borderColor }}>
                              {project.caseStudy?.problem && (
                                <p style={{ color: mutedTextColor }}>
                                  <strong className="text-white">Challenge:</strong> {project.caseStudy.problem}
                                </p>
                              )}
                              {project.caseStudy?.solution && (
                                <p style={{ color: mutedTextColor }}>
                                  <strong className="text-white">Solution:</strong> {project.caseStudy.solution}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Media Preview Frame */}
                        <div className="lg:col-span-5">
                          {project.coverImageUrl ? (
                            <div
                              className="relative aspect-[4/3] rounded-2xl overflow-hidden border group-hover:border-zinc-500 transition-colors"
                              style={{ borderColor, backgroundColor: surfaceColor }}
                            >
                              <img
                                src={project.coverImageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div
                              className="aspect-[4/3] rounded-2xl border flex flex-col items-center justify-center p-6 text-center font-mono"
                              style={{ borderColor, backgroundColor: surfaceColor }}
                            >
                              <Terminal className="w-8 h-8 mb-2 opacity-50" style={{ color: accentColor }} />
                              <span className="text-xs uppercase tracking-wider font-semibold">{project.title}</span>
                              <span className="text-[10px] mt-1" style={{ color: mutedTextColor }}>
                                Verified Production Artifact
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. SECTION 03 — STACK */}
      {isSectionVisible("skills") && (
        <section id="stack" className="py-24 border-b" style={{ borderColor }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase shrink-0" style={{ color: accentColor }}>
                03 — Stack
              </h2>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
            </div>

            <div className="divide-y border-y" style={{ borderColor }}>
              {/* Pillar 01 */}
              <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-1 font-mono text-sm font-bold" style={{ color: accentColor }}>
                  01
                </div>
                <div className="lg:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">AI &amp; Agent Systems</h3>
                  <p className="mt-2 text-xs font-mono uppercase tracking-wider" style={{ color: mutedTextColor }}>
                    Autonomous execution &bull; RAG pipelines &bull; Cognitive tool use
                  </p>
                </div>
                <div className="lg:col-span-7 flex flex-wrap gap-2.5">
                  {(pillar1Skills.length > 0 ? pillar1Skills.map((s) => s.name) : fallbackPillar1).map((skillName) => (
                    <div
                      key={skillName}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5"
                      style={{ borderColor, backgroundColor: surfaceColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      <span>{skillName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 02 */}
              <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-1 font-mono text-sm font-bold" style={{ color: accentColor }}>
                  02
                </div>
                <div className="lg:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">Frontend &amp; Visuals</h3>
                  <p className="mt-2 text-xs font-mono uppercase tracking-wider" style={{ color: mutedTextColor }}>
                    High-FPS graphics &bull; Responsive layouts &bull; Next.js App Router
                  </p>
                </div>
                <div className="lg:col-span-7 flex flex-wrap gap-2.5">
                  {(pillar2Skills.length > 0 ? pillar2Skills.map((s) => s.name) : fallbackPillar2).map((skillName) => (
                    <div
                      key={skillName}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5"
                      style={{ borderColor, backgroundColor: surfaceColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      <span>{skillName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 03 */}
              <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-1 font-mono text-sm font-bold" style={{ color: accentColor }}>
                  03
                </div>
                <div className="lg:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">Backend &amp; Cloud</h3>
                  <p className="mt-2 text-xs font-mono uppercase tracking-wider" style={{ color: mutedTextColor }}>
                    High-throughput microservices &bull; AWS &bull; Relational Data
                  </p>
                </div>
                <div className="lg:col-span-7 flex flex-wrap gap-2.5">
                  {(pillar3Skills.length > 0 ? pillar3Skills.map((s) => s.name) : fallbackPillar3).map((skillName) => (
                    <div
                      key={skillName}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5"
                      style={{ borderColor, backgroundColor: surfaceColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      <span>{skillName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. SECTION 04 — JOURNEY */}
      {(hasExperience || hasEducation) && (
        <section id="journey" className="py-24 border-b" style={{ borderColor }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase shrink-0" style={{ color: accentColor }}>
                04 — Journey
              </h2>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Column: Professional Experience */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest pb-4 border-b mb-8 font-bold" style={{ borderColor, color: mutedTextColor }}>
                  Professional Experience
                </h3>

                <div className="relative pl-6 border-l space-y-12" style={{ borderColor }}>
                  {experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="relative">
                      {/* Timeline Glowing Dot */}
                      <span
                        className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2"
                        style={{
                          backgroundColor: accentColor,
                          borderColor: bgColor,
                        }}
                      />

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xl font-bold uppercase tracking-tight">{exp.role}</h4>
                          {idx === 0 && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold border"
                              style={{ borderColor: accentColor, color: accentColor }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <span className="block font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: accentColor }}>
                          {exp.company}
                        </span>
                        <span className="block font-mono text-xs" style={{ color: mutedTextColor }}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? "—" : ""} {exp.current ? "Present" : exp.endDate} {exp.location && `&bull; ${exp.location}`}
                        </span>
                        {exp.description && (
                          <p className="pt-2 text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                            {exp.description}
                          </p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="pt-2 space-y-1 text-xs font-mono" style={{ color: mutedTextColor }}>
                            {exp.highlights.map((item, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-1.5">
                                <span style={{ color: accentColor }}>&gt;</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Education & Qualifications */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest pb-4 border-b mb-8 font-bold" style={{ borderColor, color: mutedTextColor }}>
                  Education &amp; Background
                </h3>

                <div className="relative pl-6 border-l space-y-12" style={{ borderColor }}>
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className="relative">
                      <span
                        className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2"
                        style={{
                          backgroundColor: surfaceColor,
                          borderColor: accentColor,
                        }}
                      />
                      <div className="space-y-1.5">
                        <h4 className="text-xl font-bold uppercase tracking-tight">
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                        </h4>
                        <span className="block font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: accentColor }}>
                          {edu.institution}
                        </span>
                        <span className="block font-mono text-xs" style={{ color: mutedTextColor }}>
                          {edu.startDate} {edu.startDate && edu.endDate ? "—" : ""} {edu.endDate}
                        </span>
                        {edu.description && (
                          <p className="pt-2 text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. SECTION 05 — FREELANCE / SERVICES */}
      <section id="freelance" className="py-24 border-b" style={{ borderColor }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase shrink-0" style={{ color: accentColor }}>
              05 — Freelance &amp; Consulting
            </h2>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
          </div>

          <p className="text-2xl sm:text-3xl font-medium max-w-3xl leading-snug mb-16">
            Open for freelance engineering — from a bespoke landing page to a full AI product, designed, built and deployed. Or agentic systems that actually ship.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service A */}
            <div
              className="p-8 sm:p-10 rounded-2xl border transition-all hover:border-[#ff5c1a] group"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <div className="flex items-center justify-between font-mono text-sm font-bold pb-6 border-b" style={{ borderColor }}>
                <span style={{ color: accentColor }}>SERVICE A</span>
                <span style={{ color: mutedTextColor }}>END-TO-END</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-6">
                Websites &amp; Platforms, End to End
              </h3>

              <p className="mt-4 text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                Full-fledged, deployable websites — design-forward front ends in React/Next.js with WebGL visuals, FastAPI backends, live on Vercel or AWS with your domain wired up.
              </p>

              <ul className="mt-6 space-y-2 text-xs font-mono uppercase tracking-wider" style={{ color: textColor }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> Portfolio &amp; Launch Landing Pages
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> SaaS Web Apps &amp; Real-time Dashboards
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> 3D WebGL Canvas &amp; Kinetic Experiences
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> Custom Domains, Security &amp; Ongoing Upkeep
                </li>
              </ul>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 mt-8 font-mono text-xs uppercase tracking-wider font-bold underline underline-offset-4 hover:text-[#ff5c1a] transition-colors"
                style={{ color: accentColor }}
              >
                <span>Start a project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service B */}
            <div
              className="p-8 sm:p-10 rounded-2xl border transition-all hover:border-[#ff5c1a] group"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <div className="flex items-center justify-between font-mono text-sm font-bold pb-6 border-b" style={{ borderColor }}>
                <span style={{ color: accentColor }}>SERVICE B</span>
                <span style={{ color: mutedTextColor }}>INTELLIGENCE</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-6">
                AI Systems &amp; Agents
              </h3>

              <p className="mt-4 text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                Production-grade AI built into real products — agentic assistants, source-grounded RAG over your proprietary knowledge, tool calling pipelines, and vision models.
              </p>

              <ul className="mt-6 space-y-2 text-xs font-mono uppercase tracking-wider" style={{ color: textColor }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> Multi-Agent Workflows (LangGraph / MCP)
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> Source-Grounded RAG Knowledge Bases
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> Vision Pipelines &amp; Autonomous Automation
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>✦</span> LLM Integration into Existing Production Apps
                </li>
              </ul>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 mt-8 font-mono text-xs uppercase tracking-wider font-bold underline underline-offset-4 hover:text-[#ff5c1a] transition-colors"
                style={{ color: accentColor }}
              >
                <span>Start an AI project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION 06 — CONTACT */}
      {hasContact && (
        <section id="contact" className="py-24 border-b" style={{ borderColor }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase shrink-0" style={{ color: accentColor }}>
                06 — Contact
              </h2>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
            </div>

            {/* Availability Pill */}
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-wider uppercase"
                style={{ borderColor, color: mutedTextColor }}
              >
                <span className="w-2 h-2 rounded-full kinetic-pulse-dot" style={{ backgroundColor: accentColor }} />
                <span>Open to internships &bull; freelance &bull; collaborations</span>
              </div>
            </div>

            {/* Massive Heading */}
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]">
              Let&apos;s build something.
            </h3>

            <p className="mt-6 text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: mutedTextColor }}>
              A website, an AI agent, or something in between — if it&apos;s ambitious, I want to hear about it. One email is all it takes.
            </p>

            {/* Contact Form */}
            <div className="mt-12 max-w-2xl">
              <PublicContactForm
                portfolioId={portfolio.id || "preview"}
                config={contactConfig}
                isLivePreview={isLivePreview}
              />
            </div>

            {/* Direct Action Pills */}
            <div className="mt-12 flex flex-wrap items-center gap-3">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: accentColor, color: "#ffffff" }}
                >
                  Direct Email ↗
                </a>
              )}

              {socialLinks && socialLinks.length > 0 && socialLinks.map((link) => (
                <SafeExternalLink
                  key={link.id}
                  href={link.url}
                  className="px-4 py-2.5 rounded-full border font-mono text-xs uppercase tracking-wider transition-all hover:border-[#ff5c1a]"
                  style={{ borderColor, color: textColor }}
                >
                  {link.label} ↗
                </SafeExternalLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. GIANT CLOSING WORDMARK */}
      <section className="pt-20 pb-8 overflow-hidden select-none" aria-hidden="true">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span
            className="block text-[14vw] sm:text-[16vw] font-black uppercase tracking-tighter leading-none"
            style={{
              backgroundImage: isDark
                ? "linear-gradient(to bottom, rgba(237,237,230,0.2) 20%, rgba(237,237,230,0.02) 100%)"
                : "linear-gradient(to bottom, rgba(16,16,16,0.2) 20%, rgba(16,16,16,0.02) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {displayName}
          </span>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-8 border-t font-mono text-xs uppercase tracking-wider" style={{ borderColor }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ color: mutedTextColor }}>
          <div>
            &copy; {new Date().getFullYear()} {displayName} &bull; Kinetic Engineering Studio
          </div>

          <div className="flex items-center gap-6">
            <span>{profile.location || "Global / Remote"}</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-[#ff5c1a] transition-colors cursor-pointer font-bold"
              style={{ color: textColor }}
            >
              Back to top &uarr;
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
