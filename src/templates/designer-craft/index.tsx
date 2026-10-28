/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink, SocialPlatformIcon, EmptySectionHint, resolveTemplateTheme } from "../shared";
import { PublicContactForm } from "@/components/contact/public-contact-form";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  MapPin,
  Mail,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Heart,
  Smile,
  Compass,
  Briefcase,
  GraduationCap,
  Layers,
  Code2,
} from "lucide-react";

export function DesignerCraftTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const { profile, projects, experience, skills, education, socialLinks, sections, contactConfig } = portfolio;

  // Resolve base theme tokens
  const baseTheme = resolveTemplateTheme(portfolio.appearance, "designer-craft");

  // Local interactive states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [airdropAccepted, setAirdropAccepted] = useState(false);
  const [airdropDismissed, setAirdropDismissed] = useState(false);
  const [activeCraftTab, setActiveCraftTab] = useState<number>(0);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<any | null>(null);
  const [smilesCount, setSmilesCount] = useState<number>(42);
  const [hasSmiled, setHasSmiled] = useState(false);

  // Appearance & tokens
  const bgColor = portfolio.appearance.designTokens?.backgroundColor || "#131415";
  const surfaceColor = portfolio.appearance.designTokens?.surfaceColor || "#1a1c1d";
  const innerSurfaceColor = "#222426";
  const textColor = portfolio.appearance.designTokens?.textColor || "#ffffff";
  const mutedTextColor = portfolio.appearance.designTokens?.mutedTextColor || "#9ba1a5";
  const borderColor = portfolio.appearance.designTokens?.borderColor || "#272b2d";
  const accentColor = portfolio.appearance.designTokens?.accentHex || "#0080ff";

  const fontClass =
    portfolio.appearance?.fontFamily === "mono"
      ? "font-mono"
      : portfolio.appearance?.fontFamily === "serif"
      ? "font-serif"
      : "font-sans";

  // Section visibility check
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

  const displayName = profile.fullName?.trim() || "Jackie Hu";
  const displayLocation = profile.location?.trim() || "Paris, France";
  const displayHeadline =
    profile.headline?.trim() || "Product Designer crafting intuitive digital products & high-craft design systems.";
  const displayBio =
    profile.bio?.trim() ||
    "A thoughtful process of crafting experiences that engage people, shape clarity, and spark delights.";
  const displayLongBio =
    profile.longBio?.trim() ||
    "I'm a product designer who loves crafting meaningful interactions and bringing tactile digital ideas to life. While I value the aesthetic and emotional aspects of design, my work centers on leveraging design psychology to achieve measurable user clarity and joy. I design to make people smile ☺︎.";

  const emailToCopy = profile.email?.trim() || "jackiehu.design@gmail.com";

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(emailToCopy);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const handleSmileClick = () => {
    if (!hasSmiled) {
      setSmilesCount((prev) => prev + 1);
      setHasSmiled(true);
    }
  };

  // Craft & Philosophy Pillars
  const craftPillars = [
    {
      num: "01",
      title: "Systems & Architecture",
      icon: "⌘",
      tagline: "Scalable component rhythm & design tokens",
      description:
        "Building unified design languages that bridge high-fidelity Figma components with strict TypeScript token systems. Consistency enables speed, clarity, and rock-solid brand cohesion.",
      details: ["Design token schema & semantic variables", "Cross-platform responsive components", "Rigorous accessibility (WCAG AAA)"],
    },
    {
      num: "02",
      title: "Tactile Micro-Interactions",
      icon: "▶",
      tagline: "Physics-based springs, haptics, and spatial micro-motion",
      description:
        "Digital interfaces should feel tangible and alive. Every cursor hover, swipe gesture, and modal transition is calibrated with realistic deceleration and spring tension to delight the user.",
      details: ["Spring dynamics & magnetic cursor tracking", "Direct state feedback & responsive latency", "Micro-gestures that spark joy"],
    },
    {
      num: "03",
      title: "Product Psychology & Outcomes",
      icon: "⁕",
      tagline: "Cognitive load reduction & intuitive decision funnels",
      description:
        "Balancing emotional craft with measurable user outcomes. Simplifying complex financial, data, or AI workflows into frictionless, human-friendly steps that respect people's attention.",
      details: ["User mental models & cognitive ergonomics", "Progressive disclosure of complex data", "Retention & conversion optimization"],
    },
    {
      num: "04",
      title: "Prototyping & Code Craft",
      icon: "☺︎",
      tagline: "Designing with real production fidelity",
      description:
        "Prototypes aren't static mockups—they are interactive sandboxes built with React, Framer Motion, and Tailwind to stress-test real-world performance before writing a single spec.",
      details: ["High-fidelity interactive code prototypes", "Edge-case stress testing with real datasets", "Zero-friction designer-engineer collaboration"],
    },
  ];

  return (
    <div
      className={`min-h-screen text-white selection:bg-[#0080ff] selection:text-white ${fontClass}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* =========================================================================
          FLOATING FROSTED CAPSULE NAVIGATION BAR
      ========================================================================= */}
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300"
          style={{
            backgroundColor: `${surfaceColor}E6`,
            borderColor: borderColor,
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7), 0 0 1px 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Identity & Status */}
          <Link
            href="#hero"
            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-6 h-6 rounded-full object-cover border"
                style={{ borderColor: accentColor }}
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {displayName.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-white whitespace-nowrap">{displayName}</span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: innerSurfaceColor, color: mutedTextColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline">Available</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1 text-xs font-medium">
            {hasProjects && (
              <a
                href="#work"
                className="px-3 py-1.5 rounded-full hover:text-white transition-colors flex items-center gap-1"
                style={{ color: mutedTextColor }}
              >
                Work <span style={{ color: accentColor }}>▶</span>
              </a>
            )}
            <a
              href="#about"
              className="px-3 py-1.5 rounded-full hover:text-white transition-colors flex items-center gap-1"
              style={{ color: mutedTextColor }}
            >
              About <span>⌘</span>
            </a>
            <a
              href="#craft"
              className="px-3 py-1.5 rounded-full hover:text-white transition-colors flex items-center gap-1"
              style={{ color: mutedTextColor }}
            >
              Craft <span>⁕</span>
            </a>
            {hasExperience && (
              <a
                href="#experience"
                className="px-3 py-1.5 rounded-full hover:text-white transition-colors"
                style={{ color: mutedTextColor }}
              >
                Experience
              </a>
            )}
          </div>

          {/* Quick Email Pill with Copy micro-interaction */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95"
            style={{
              backgroundColor: copiedEmail ? "#0080ff" : innerSurfaceColor,
              borderColor: copiedEmail ? "#0080ff" : borderColor,
              color: copiedEmail ? "#ffffff" : textColor,
            }}
            title="Click to copy email address"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="hidden sm:inline text-[11px] font-medium">Contact</span>
                <span className="sm:hidden text-[11px] font-medium">Mail</span>
              </>
            )}
          </button>
        </nav>
      </header>

      {/* =========================================================================
          TOP FLOATING WIDGETS (AirDrop Card & Ambient Music Player)
      ========================================================================= */}
      <div className="pt-24 px-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Ambient Track Player Pill */}
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full border shadow-lg transition-all"
          style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
        >
          <button
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
            style={{ backgroundColor: innerSurfaceColor, color: accentColor }}
            title={isPlayingMusic ? "Pause ambient sound" : "Play ambient sound"}
          >
            {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-[11px] flex items-center gap-1.5">
              Jazz et thé vert
              {isPlayingMusic && (
                <span className="inline-flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-[#0080ff] animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#0080ff] animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-[#0080ff] animate-pulse delay-150" />
                </span>
              )}
            </span>
            <span className="text-[10px]" style={{ color: mutedTextColor }}>
              Souleance • 1:10 / 3:32
            </span>
          </div>
        </div>

        {/* AirDrop Notification Pill (Signature Jackie Hu Interaction) */}
        {!airdropDismissed && (
          <div
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-full border shadow-lg animate-in fade-in slide-in-from-top-2 duration-500"
            style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: innerSurfaceColor }}
            >
              <Radio className="w-3.5 h-3.5" style={{ color: accentColor }} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white text-[11px]">AirDrop: {displayName}</span>
              <span className="text-[10px]" style={{ color: mutedTextColor }}>
                {airdropAccepted ? "Photo shared ☺︎" : "would like to share a photo"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              {!airdropAccepted ? (
                <>
                  <button
                    onClick={() => setAirdropDismissed(true)}
                    className="px-2 py-0.5 rounded-full text-[10px] hover:text-white transition-colors"
                    style={{ color: mutedTextColor }}
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setAirdropAccepted(true)}
                    className="px-3 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm transition-transform active:scale-95"
                    style={{ backgroundColor: accentColor }}
                  >
                    Accept
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAirdropAccepted(false)}
                  className="px-2.5 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1"
                  style={{ backgroundColor: innerSurfaceColor }}
                >
                  <Smile className="w-3 h-3 text-emerald-400" /> Viewed
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Popover / Modal when AirDrop is Accepted */}
      {airdropAccepted && (
        <div className="max-w-md mx-auto px-4 mt-3">
          <div
            className="p-4 rounded-2xl border shadow-2xl relative animate-in zoom-in-95 duration-300"
            style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
          >
            <button
              onClick={() => setAirdropAccepted(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-zinc-400 hover:text-white"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: accentColor }}>
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct from {displayName}&apos;s Studio</h4>
                <p className="text-xs" style={{ color: mutedTextColor }}>
                  {displayLocation} • Today at 10:42 AM
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-3 text-zinc-200">
              &ldquo;Thanks for dropping by! I design tactile digital products that make people smile ☺︎. Always open
              to select product collabs and design system architecture.&rdquo;
            </p>
            <div className="flex items-center justify-between text-[11px] pt-2 border-t" style={{ borderColor }}>
              <span style={{ color: mutedTextColor }}>AirDrop transfer complete</span>
              <button
                onClick={handleSmileClick}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: hasSmiled ? "#0080ff" : innerSurfaceColor,
                  color: hasSmiled ? "#ffffff" : textColor,
                }}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>{hasSmiled ? "Smiled!" : "Send a smile"}</span>
                <span className="text-[10px] opacity-80">({smilesCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HERO SECTION
      ========================================================================= */}
      <section id="hero" className="pt-16 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Location & Status Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
            style={{ backgroundColor: surfaceColor, borderColor: borderColor, color: mutedTextColor }}
          >
            <MapPin className="w-3 h-3" style={{ color: accentColor }} />
            <span>{displayLocation}</span>
            <span>•</span>
            <span className="text-zinc-300">Product &amp; Interaction</span>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
            style={{ backgroundColor: surfaceColor, borderColor: borderColor, color: mutedTextColor }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-200">Open for select projects</span>
          </div>
        </div>

        {/* Big Bold Confident Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-white max-w-4xl">
          {displayHeadline}
        </h1>

        {/* Subtitle / Philosophy */}
        <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mb-8" style={{ color: mutedTextColor }}>
          {displayBio}
        </p>

        {/* Playful "Currently cooking ☺︎" Status Card */}
        <div
          className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:border-[#0080ff]/50 group"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold shrink-0 tracking-wide"
                style={{ backgroundColor: innerSurfaceColor, color: accentColor }}
              >
                Currently cooking ☺︎
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-snug">
                Designing something new called <strong className="text-white">The Little Things</strong> — a playful
                app that helps people self-introspect with guided questions &amp; personal AI insights.
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 sm:shrink-0 self-start sm:self-center px-2.5 py-1 rounded-full border border-emerald-500/20"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.08)" }}
            >
              TestFlight ✈️
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WORK SHOWCASE: "Recently Made ▶"
      ========================================================================= */}
      {isSectionVisible("projects") && (
        <section id="work" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Recently Made</h2>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                ▶
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
              {visibleProjects.length} Selected Projects
            </span>
          </div>

          {!hasProjects ? (
            <EmptySectionHint
              isLivePreview={isLivePreview}
              sectionTitle="Projects"
              actionHint="Add your product case studies and interaction design projects in the editor."
              theme="dark"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleProjects.map((project, idx) => {
                const projectTags =
                  (project.technologies || []).length > 0
                    ? project.technologies.slice(0, 3)
                    : [project.category || "Design"];
                const projectYear = project.endDate || project.startDate;
                return (
                  <div
                    key={project.id || idx}
                    className="group flex flex-col justify-between rounded-3xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{
                      backgroundColor: surfaceColor,
                      borderColor: borderColor,
                    }}
                  >
                    {/* Project Media or Decorative Mockup Frame */}
                    <div
                      className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 border relative flex items-center justify-center transition-all group-hover:border-[#0080ff]/40"
                      style={{ backgroundColor: innerSurfaceColor, borderColor }}
                    >
                      {project.coverImageUrl ? (
                        <img
                          src={project.coverImageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                          {/* Geometric studio pattern */}
                          <div
                            className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-xl"
                            style={{ backgroundColor: accentColor }}
                          />
                          <div className="relative z-10">
                            <div
                              className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center border shadow-inner"
                              style={{ backgroundColor: surfaceColor, borderColor }}
                            >
                              <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                            </div>
                            <span className="text-sm font-semibold text-white tracking-tight block">
                              {project.title}
                            </span>
                            <span className="text-[11px] font-mono mt-1 block" style={{ color: mutedTextColor }}>
                              Interaction Prototype
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md border border-white/10 text-white">
                          ★ Featured
                        </div>
                      )}
                    </div>

                    {/* Metadata: Category Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {projectTags.map((tag: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border"
                          style={{
                            backgroundColor: innerSurfaceColor,
                            borderColor,
                            color: tIdx === 0 ? accentColor : mutedTextColor,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {projectYear && (
                        <span className="text-[10px] font-mono ml-auto" style={{ color: mutedTextColor }}>
                          {projectYear}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#0080ff] transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0080ff]" />
                    </h3>

                    <p className="text-xs sm:text-sm leading-relaxed mb-5 flex-1" style={{ color: mutedTextColor }}>
                      {project.description || "Thoughtfully designed digital product system crafted for clarity and scale."}
                    </p>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor }}>
                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:bg-white hover:text-black hover:border-white"
                        style={{ backgroundColor: innerSurfaceColor, borderColor, color: textColor }}
                      >
                        Case Study ⌘
                      </button>

                      {project.liveUrl && (
                        <SafeExternalLink
                          href={project.liveUrl}
                          className="p-1.5 rounded-full border hover:text-white transition-colors"
                          style={{ backgroundColor: innerSurfaceColor, borderColor, color: mutedTextColor }}
                          title="Open Live Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </SafeExternalLink>
                      )}

                      {project.repoUrl && (
                        <SafeExternalLink
                          href={project.repoUrl}
                          className="p-1.5 rounded-full border hover:text-white transition-colors"
                          style={{ backgroundColor: innerSurfaceColor, borderColor, color: mutedTextColor }}
                          title="View Repository"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                        </SafeExternalLink>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          CRAFT & DESIGN PHILOSOPHY SECTION (Jackie Hu Style)
      ========================================================================= */}
      <section id="craft" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Craft &amp; Principles</h2>
            <span className="text-lg font-bold" style={{ color: accentColor }}>
              ⁕
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
            4 Studio Standards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {craftPillars.map((pillar, idx) => {
            const isActive = activeCraftTab === idx;
            return (
              <div
                key={pillar.num}
                onClick={() => setActiveCraftTab(idx)}
                className="cursor-pointer p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: isActive ? accentColor : borderColor,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#0080ff]">{pillar.num}</span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border"
                    style={{ backgroundColor: innerSurfaceColor, borderColor }}
                  >
                    {pillar.icon}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#0080ff] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-medium mb-3" style={{ color: accentColor }}>
                  {pillar.tagline}
                </p>

                <p className="text-xs leading-relaxed mb-4" style={{ color: mutedTextColor }}>
                  {pillar.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor }}>
                  {pillar.details.map((detail, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border"
                      style={{ backgroundColor: innerSurfaceColor, borderColor, color: mutedTextColor }}
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          ABOUT & PERSONAL NARRATIVE (Jackie Hu Style)
      ========================================================================= */}
      <section id="about" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">About</h2>
            <span className="text-lg font-bold" style={{ color: accentColor }}>
              ⌘
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
            Designer Story
          </span>
        </div>

        <div
          className="p-6 sm:p-10 rounded-3xl border relative overflow-hidden"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          {/* Subtle background blur accent */}
          <div
            className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative z-10 max-w-3xl">
            <p className="text-base sm:text-xl font-normal leading-relaxed text-zinc-100 mb-6">
              {displayLongBio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t" style={{ borderColor }}>
              {/* Interactive Smile Counter */}
              <button
                onClick={handleSmileClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all active:scale-95"
                style={{
                  backgroundColor: hasSmiled ? "#0080ff" : innerSurfaceColor,
                  borderColor: hasSmiled ? "#0080ff" : borderColor,
                  color: hasSmiled ? "#ffffff" : textColor,
                }}
              >
                <Smile className="w-4 h-4" />
                <span>{hasSmiled ? "Thanks for the smile! ☺︎" : "Tap to send a smile"}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                  {smilesCount}
                </span>
              </button>

              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all active:scale-95 hover:border-[#0080ff]"
                style={{ backgroundColor: innerSurfaceColor, borderColor, color: textColor }}
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#0080ff]" />}
                <span>{copiedEmail ? "Email Copied!" : "Copy E-mail"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SKILLS & DESIGN TOOLS LEDGER
      ========================================================================= */}
      {isSectionVisible("skills") && hasSkills && (
        <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Stack &amp; Tooling</h2>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                ⁕
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
              {skills.length} Competencies
            </span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {skills.map((skill, idx) => (
              <div
                key={skill.id || idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all hover:border-[#0080ff] hover:text-white"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor,
                  color: mutedTextColor,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="text-white font-medium">{skill.name}</span>
                {skill.category && skill.category !== "General" && (
                  <span className="text-[10px] opacity-60">({skill.category})</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          EXPERIENCE & TENURE LEDGER
      ========================================================================= */}
      {isSectionVisible("experience") && hasExperience && (
        <section id="experience" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Experience</h2>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                ⌘
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
              Ledger
            </span>
          </div>

          <div className="divide-y border-y" style={{ borderColor }}>
            {experience.map((exp, idx) => {
              const startDate = exp.startDate || "";
              const endDate = exp.current ? "Present" : exp.endDate || "";
              const dateRange = startDate && endDate ? `${startDate} — ${endDate}` : startDate || endDate;

              return (
                <div
                  key={exp.id || idx}
                  className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group transition-colors hover:bg-white/[0.02]"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#0080ff] transition-colors">
                        {exp.company}
                      </h3>
                      {exp.current && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: accentColor }}>
                      {exp.role}
                    </p>
                    {exp.description && (
                      <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: mutedTextColor }}>
                        {exp.description}
                      </p>
                    )}
                  </div>

                  <div className="text-xs font-mono shrink-0 sm:text-right" style={{ color: mutedTextColor }}>
                    <div>{dateRange}</div>
                    {exp.location && <div className="text-[11px] opacity-75">{exp.location}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          EDUCATION & CREDENTIALS
      ========================================================================= */}
      {isSectionVisible("education") && hasEducation && (
        <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Education</h2>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                ⁕
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
              Degrees &amp; Research
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {education.map((edu, idx) => (
              <div
                key={edu.id || idx}
                className="p-5 rounded-2xl border"
                style={{ backgroundColor: surfaceColor, borderColor }}
              >
                <div className="flex items-center gap-2 text-xs font-mono mb-2" style={{ color: accentColor }}>
                  <GraduationCap className="w-4 h-4" />
                  <span>{edu.endDate || edu.startDate || "Alum"}</span>
                </div>
                <h3 className="text-base font-bold text-white">{edu.institution}</h3>
                <p className="text-xs font-medium text-zinc-300 mt-1">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                </p>
                {edu.description && (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: mutedTextColor }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          CONTACT & DIRECT TRANSMISSION CAPSULE
      ========================================================================= */}
      {hasContact && (
        <section id="contact" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Let&apos;s Connect</h2>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                ▶
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: mutedTextColor }}>
              Direct Transmission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Left Column: Direct Copy Email Box & Socials */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                  Have an ambitious product in mind?
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: mutedTextColor }}>
                  Whether you are shaping a 0→1 product, overhauling a multi-platform design system, or designing tactile
                  interactions, let&apos;s craft something memorable.
                </p>

                {/* Direct Email Copy Capsule */}
                <div
                  onClick={handleCopyEmail}
                  className="cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:border-[#0080ff] group mb-6"
                  style={{ backgroundColor: surfaceColor, borderColor }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono block uppercase tracking-wider" style={{ color: mutedTextColor }}>
                        Email Direct
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-medium text-white group-hover:text-[#0080ff] transition-colors">
                        {emailToCopy}
                      </span>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border transition-all group-hover:scale-105"
                      style={{
                        backgroundColor: copiedEmail ? "#0080ff" : innerSurfaceColor,
                        borderColor: copiedEmail ? "#0080ff" : borderColor,
                      }}
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>

                {/* Social Pills */}
                {socialLinks && socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <SafeExternalLink
                        key={link.id}
                        href={link.url}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono hover:text-white hover:border-[#0080ff] transition-all"
                        style={{ backgroundColor: surfaceColor, borderColor, color: mutedTextColor }}
                      >
                        <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
                        <span>{link.label}</span>
                      </SafeExternalLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Status footer inside left col */}
              <div className="mt-8 pt-4 border-t text-[11px] font-mono" style={{ borderColor, color: mutedTextColor }}>
                📍 Based in {displayLocation} • UTC+1
              </div>
            </div>

            {/* Right Column: Public Contact Form */}
            <div
              className="md:col-span-3 p-6 sm:p-8 rounded-3xl border shadow-xl"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <h4 className="text-base font-bold text-white mb-1">Send a Message</h4>
              <p className="text-xs mb-6" style={{ color: mutedTextColor }}>
                Directly forwarded to {displayName}&apos;s studio inbox.
              </p>

              <PublicContactForm
                portfolioId={portfolio.id}
                config={contactConfig}
                isLivePreview={isLivePreview}
              />
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CASE STUDY MODAL (Interactive Project Deep Dive)
      ========================================================================= */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl relative"
            style={{ backgroundColor: surfaceColor, borderColor }}
          >
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full border text-zinc-400 hover:text-white transition-colors"
              style={{ backgroundColor: innerSurfaceColor, borderColor }}
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {((activeModalProject.technologies || []).length > 0
                ? activeModalProject.technologies
                : [activeModalProject.category || "Design"]
              ).map((tag: string, tIdx: number) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border"
                  style={{ backgroundColor: innerSurfaceColor, borderColor, color: accentColor }}
                >
                  {tag}
                </span>
              ))}
              {(activeModalProject.endDate || activeModalProject.startDate) && (
                <span className="text-[11px] font-mono" style={{ color: mutedTextColor }}>
                  {activeModalProject.endDate || activeModalProject.startDate}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{activeModalProject.title}</h3>

            {activeModalProject.coverImageUrl && (
              <div className="rounded-2xl overflow-hidden border mb-6" style={{ borderColor }}>
                <img
                  src={activeModalProject.coverImageUrl}
                  alt={activeModalProject.title}
                  className="w-full max-h-72 object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed" style={{ color: mutedTextColor }}>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Overview &amp; Impact</h4>
                <p>{activeModalProject.description || "Interactive product design and system engineering."}</p>
              </div>

              {(activeModalProject.caseStudy?.problem || activeModalProject.tagline) && (
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Design Challenge</h4>
                  <p>{activeModalProject.caseStudy?.problem || activeModalProject.tagline}</p>
                </div>
              )}

              {activeModalProject.caseStudy?.solution && (
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Craft &amp; Solution</h4>
                  <p>{activeModalProject.caseStudy?.solution}</p>
                </div>
              )}

              {activeModalProject.caseStudy?.role && (
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Role</h4>
                  <p className="text-zinc-200">{activeModalProject.caseStudy?.role}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-8 pt-4 border-t" style={{ borderColor }}>
              {activeModalProject.liveUrl && (
                <SafeExternalLink
                  href={activeModalProject.liveUrl}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 transition-transform active:scale-95"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>Launch Live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </SafeExternalLink>
              )}
              {activeModalProject.repoUrl && (
                <SafeExternalLink
                  href={activeModalProject.repoUrl}
                  className="px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 text-zinc-200 hover:text-white"
                  style={{ backgroundColor: innerSurfaceColor, borderColor }}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </SafeExternalLink>
              )}
              <button
                onClick={() => setActiveModalProject(null)}
                className="ml-auto text-xs font-medium hover:text-white transition-colors"
                style={{ color: mutedTextColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MINIMAL STUDIO FOOTER
      ========================================================================= */}
      <footer className="py-12 px-4 border-t text-center text-xs font-mono" style={{ borderColor, color: mutedTextColor }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {displayName}</span>
            <span>•</span>
            <span>Crafted with Portfolify</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-white transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
