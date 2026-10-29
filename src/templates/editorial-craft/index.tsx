/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink } from "../shared";
import {
  ArrowDownRight,
  ExternalLink,
  Mail,
  FileText,
  Menu,
  X,
  Sparkles,
  Check,
  Search,
  Lightbulb,
} from "lucide-react";

// ── 3D Thinking Designer Illustration (Upper-Left) ───────────────────────────
function ThinkingDesignerIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      {/* Lightbulb Idea Bubble */}
      <div className="absolute -top-10 left-20 z-10 flex flex-col items-center animate-bounce duration-1000">
        <div className="relative p-2 rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
            <Lightbulb className="w-5 h-5 fill-amber-400 stroke-amber-600" />
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45" />
        </div>
      </div>

      {/* 3D Character Avatar SVG */}
      <svg
        viewBox="0 0 200 220"
        className="w-36 sm:w-44 md:w-52 h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="skinGlow" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="70%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#ea580c"/>
          </radialGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#27272a"/>
            <stop offset="50%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1c1917"/>
            <stop offset="100%" stop-color="#0c0a09"/>
          </linearGradient>
        </defs>

        {/* Curly Hair Backing */}
        <circle cx="75" cy="85" r="24" fill="url(#hairGrad)"/>
        <circle cx="95" cy="72" r="26" fill="url(#hairGrad)"/>
        <circle cx="120" cy="75" r="25" fill="url(#hairGrad)"/>
        <circle cx="138" cy="90" r="23" fill="url(#hairGrad)"/>
        <circle cx="70" cy="110" r="22" fill="url(#hairGrad)"/>
        <circle cx="142" cy="115" r="21" fill="url(#hairGrad)"/>

        {/* Face */}
        <ellipse cx="106" cy="115" rx="32" ry="34" fill="url(#skinGlow)"/>

        {/* Ears */}
        <circle cx="72" cy="118" r="9" fill="#f97316"/>
        <circle cx="73" cy="118" r="5" fill="#ea580c"/>

        {/* Curly Hair Front Tufts */}
        <circle cx="82" cy="78" r="16" fill="url(#hairGrad)"/>
        <circle cx="102" cy="70" r="18" fill="url(#hairGrad)"/>
        <circle cx="124" cy="72" r="17" fill="url(#hairGrad)"/>
        <circle cx="138" cy="82" r="15" fill="url(#hairGrad)"/>
        <circle cx="90" cy="88" r="12" fill="url(#hairGrad)"/>
        <circle cx="118" cy="85" r="14" fill="url(#hairGrad)"/>

        {/* Eyebrows */}
        <path d="M90 102 Q98 98 106 102" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        <path d="M116 102 Q124 98 132 102" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>

        {/* Eyes (Thoughtful Gaze upward) */}
        <ellipse cx="98" cy="112" rx="4.5" ry="5.5" fill="#09090b"/>
        <ellipse cx="124" cy="112" rx="4.5" ry="5.5" fill="#09090b"/>
        <circle cx="99.5" cy="110" r="1.5" fill="#ffffff"/>
        <circle cx="125.5" cy="110" r="1.5" fill="#ffffff"/>

        {/* Nose */}
        <path d="M112 112 Q115 122 110 124" stroke="#c2410c" stroke-width="2.5" stroke-linecap="round"/>

        {/* Mustache */}
        <path d="M102 129 Q111 127 120 129 Q111 133 102 129" fill="#1c1917"/>

        {/* Thoughtful Smile */}
        <path d="M106 135 Q112 138 118 135" stroke="#9a3412" stroke-width="2" stroke-linecap="round" fill="none"/>

        {/* Neck */}
        <rect x="98" y="142" width="20" height="18" rx="6" fill="#ea580c"/>

        {/* Hoodie Torso */}
        <path
          d="M50 220 Q55 162 90 156 L128 156 Q165 162 170 220 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hoodie Collar & Drawstrings */}
        <path d="M88 156 Q108 174 130 156" stroke="#3f3f46" stroke-width="3" fill="none"/>
        <line x1="102" y1="168" x2="102" y2="188" stroke="#71717a" stroke-width="2" stroke-linecap="round"/>
        <line x1="116" y1="168" x2="116" y2="188" stroke="#71717a" stroke-width="2" stroke-linecap="round"/>

        {/* Hand resting on chin */}
        <g transform="translate(118, 128)">
          <ellipse cx="6" cy="12" rx="8" ry="7" fill="#fb923c"/>
          <path d="M 0 14 Q 4 6 10 8" stroke="#ea580c" stroke-width="2" fill="none"/>
        </g>
      </svg>
    </div>
  );
}

// ── 3D Magnifying Glass Designer Illustration (Lower-Right) ──────────────────
function InspectingDesignerIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 200 220"
        className="w-36 sm:w-44 md:w-52 h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="skinGlow2" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="70%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#ea580c"/>
          </radialGradient>
          <linearGradient id="hoodieGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3f3f46"/>
            <stop offset="50%" stop-color="#27272a"/>
            <stop offset="100%" stop-color="#18181b"/>
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.2"/>
          </linearGradient>
        </defs>

        {/* Curly Hair Backing */}
        <circle cx="85" cy="85" r="24" fill="#1c1917"/>
        <circle cx="105" cy="72" r="26" fill="#1c1917"/>
        <circle cx="130" cy="75" r="25" fill="#1c1917"/>
        <circle cx="148" cy="90" r="23" fill="#1c1917"/>
        <circle cx="80" cy="110" r="22" fill="#1c1917"/>
        <circle cx="152" cy="115" r="21" fill="#1c1917"/>

        {/* Face */}
        <ellipse cx="116" cy="115" rx="32" ry="34" fill="url(#skinGlow2)"/>

        {/* Ears */}
        <circle cx="152" cy="118" r="9" fill="#f97316"/>
        <circle cx="151" cy="118" r="5" fill="#ea580c"/>

        {/* Curly Hair Front Tufts */}
        <circle cx="92" cy="78" r="16" fill="#1c1917"/>
        <circle cx="112" cy="70" r="18" fill="#1c1917"/>
        <circle cx="134" cy="72" r="17" fill="#1c1917"/>
        <circle cx="148" cy="82" r="15" fill="#1c1917"/>

        {/* Eyebrow Right */}
        <path d="M126 102 Q134 98 142 102" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>

        {/* Eye Right (Looking through magnifier) */}
        <ellipse cx="134" cy="112" rx="4.5" ry="5.5" fill="#09090b"/>
        <circle cx="135.5" cy="110" r="1.5" fill="#ffffff"/>

        {/* Nose */}
        <path d="M122 112 Q125 122 120 124" stroke="#c2410c" stroke-width="2.5" stroke-linecap="round"/>

        {/* Mustache */}
        <path d="M112 129 Q121 127 130 129 Q121 133 112 129" fill="#1c1917"/>

        {/* Neck */}
        <rect x="108" y="142" width="20" height="18" rx="6" fill="#ea580c"/>

        {/* Hoodie Body */}
        <path
          d="M60 220 Q65 162 100 156 L138 156 Q175 162 180 220 Z"
          fill="url(#hoodieGrad2)"
        />

        {/* Magnifying Glass (Over Left Eye) */}
        <g transform="translate(68, 88)">
          {/* Glass Rim */}
          <circle cx="28" cy="28" r="22" stroke="#334155" stroke-width="4.5" fill="url(#glassGrad)"/>
          {/* Glare line */}
          <path d="M16 20 A 18 18 0 0 1 36 12" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>
          {/* Magnified Eye Behind Lens */}
          <ellipse cx="28" cy="28" rx="6" ry="7.5" fill="#09090b"/>
          <circle cx="30" cy="26" r="2" fill="#ffffff"/>
          {/* Handle */}
          <line x1="12" y1="44" x2="-2" y2="58" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
        </g>
      </svg>
    </div>
  );
}

// ── Main Editorial Craft Template Component ──────────────────────────────────
export function EditorialCraftTemplate({ portfolio }: TemplateProps) {
  const { profile, projects, sections } = portfolio;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Split name for dual-color display (First name orange #EF4B18, remaining black #000)
  const fullName = profile.fullName?.trim() || "Sai Tharun";
  const { firstName, remainingName } = useMemo(() => {
    const parts = fullName.split(" ");
    if (parts.length > 1) {
      return {
        firstName: parts[0],
        remainingName: parts.slice(1).join(" "),
      };
    }
    return {
      firstName: fullName,
      remainingName: "",
    };
  }, [fullName]);

  const roleLabel =
    profile.headline?.trim() || "SENIOR PRODUCT DESIGNER AT LICIOUS";

  const positioningStatement =
    profile.bio?.trim() ||
    "Simplifying complex products into clear, useful experiences.";

  const resumeLink = portfolio.socialLinks?.find(
    (s) => s.platform.toLowerCase().includes("resume") || s.platform.toLowerCase().includes("cv")
  );
  const resumeUrl = resumeLink?.url || "#resume";

  const isSectionVisible = (key: string) => {
    const sec = sections?.find((s) => s.key === key);
    return sec ? sec.visible !== false : true;
  };

  const visibleProjects = (projects || []).filter((p) => p.visible !== false);

  return (
    <article
      id="editorial-craft-root"
      className="min-h-screen bg-white text-[#0a0a0a] font-sans selection:bg-[#EF4B18]/15 selection:text-[#EF4B18] antialiased overflow-x-hidden relative"
      style={{
        ["--craft-accent" as string]: "#EF4B18",
        ["--craft-green" as string]: "#71A85B",
      }}
    >
      {/* Scoped Caveat font for playful handwritten designer notes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .font-handwritten {
          font-family: 'Caveat', cursive, -apple-system, sans-serif;
        }
      `}</style>

      {/* ── 1. CLEAN TOP NAVIGATION BAR ───────────────────────────────────────── */}
      <header className="w-full border-t border-[#eaeaea] border-b border-[#f0f0f0] bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Bold black wordmark */}
          <a
            href="#home"
            className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 hover:text-[#EF4B18] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4B18] rounded-md"
          >
            {fullName}
          </a>

          {/* Right: Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-700">
            {/* Active "Home" link with short orange underline */}
            <a
              href="#home"
              className="relative text-slate-900 font-semibold py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4B18] rounded-sm"
            >
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#EF4B18] rounded-full" />
            </a>

            <a
              href="#about"
              className="text-slate-600 hover:text-slate-900 transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4B18] rounded-sm"
            >
              About me
            </a>

            <a
              href={resumeUrl}
              target={resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel={resumeUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-slate-600 hover:text-slate-900 transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4B18] rounded-sm"
            >
              Resume
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4B18]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-[#EF4B18] text-sm"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 text-sm hover:text-slate-900"
            >
              About me
            </a>
            <a
              href={resumeUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 text-sm hover:text-slate-900"
            >
              Resume
            </a>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION (Full-viewport editorial composition) ─────────────── */}
      <section
        id="home"
        className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-6 sm:px-12 py-12 md:py-20 overflow-hidden text-center"
      >
        {/* Subtle oversized circular outline behind central copy */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] lg:w-[720px] lg:h-[720px] rounded-full border border-slate-200/50 pointer-events-none select-none z-0"
          aria-hidden="true"
        />

        {/* Thin pale green diagonal line with small green circular marker and soft glow */}
        <div
          className="absolute left-[8%] sm:left-[15%] md:left-[22%] bottom-[24%] sm:bottom-[28%] pointer-events-none select-none z-0 hidden sm:block"
          aria-hidden="true"
        >
          {/* Diagonal Ray Line (Lower-left pointing toward center) */}
          <div className="relative w-44 sm:w-60 h-28">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 240 110"
              fill="none"
            >
              <line
                x1="0"
                y1="100"
                x2="230"
                y2="10"
                stroke="#71A85B"
                strokeWidth="1.2"
                strokeOpacity="0.45"
              />
              {/* Soft Green Line Gradient Wash */}
              <polygon
                points="0,100 230,10 240,60 0,110"
                fill="url(#greenFade)"
                opacity="0.06"
              />
              <defs>
                <linearGradient id="greenFade" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#71A85B" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#71A85B" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Circular Marker Node */}
            <div className="absolute -left-1.5 bottom-1 flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#71A85B] ring-4 ring-[#71A85B]/20 shadow-[0_0_14px_rgba(113,168,91,0.7)]" />
            </div>
          </div>
        </div>

        {/* Character Illustration 1 (Upper-Left) with handwritten callout */}
        <div className="absolute top-10 sm:top-14 md:top-20 left-4 sm:left-10 lg:left-24 z-10 hidden sm:flex flex-col items-center">
          <ThinkingDesignerIllustration />
          {/* Handwritten callout with purple underline */}
          <div className="mt-2 text-center transform -rotate-3 select-none">
            <span className="font-handwritten text-base sm:text-lg md:text-xl text-slate-700 tracking-wide font-bold">
              “okay... but why?”
            </span>
            <svg className="w-16 h-2 text-indigo-400 mx-auto mt-0.5" viewBox="0 0 60 8" fill="none">
              <path d="M2 5 Q30 1 58 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Character Illustration 2 (Lower-Right) with handwritten callout */}
        <div className="absolute bottom-6 sm:bottom-10 md:bottom-16 right-4 sm:right-10 lg:right-24 z-10 hidden md:flex flex-col items-center">
          <InspectingDesignerIllustration />
          {/* Handwritten callout with purple underline */}
          <div className="mt-2 text-center transform rotate-2 select-none">
            <span className="font-handwritten text-base sm:text-lg md:text-xl text-slate-700 tracking-wide font-bold">
              “2px. I can see it.”
            </span>
            <svg className="w-20 h-2 text-indigo-400 mx-auto mt-0.5" viewBox="0 0 80 8" fill="none">
              <path d="M2 5 Q40 1 78 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Center Main Editorial Copy */}
        <div className="relative z-20 max-w-2xl mx-auto space-y-4 sm:space-y-5 my-auto">
          {/* Uppercase Role Label */}
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-500 select-none">
            {roleLabel}
          </p>

          {/* Very Large Bold Name Heading */}
          <h1 className="font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.08] text-slate-900">
            <span className="text-[#EF4B18] mr-2 sm:mr-3 drop-shadow-[0_4px_16px_rgba(239,75,24,0.12)]">
              {firstName}
            </span>
            {remainingName && <span>{remainingName}</span>}
          </h1>

          {/* Muted Gray Positioning Statement */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-lg mx-auto pt-1">
            {positioningStatement}
          </p>

          {/* Editorial CTA Link: "View selected work ↘" */}
          <div className="pt-4 sm:pt-6">
            <a
              href="#work"
              className="group inline-flex items-center gap-1.5 font-bold text-sm sm:text-base text-slate-900 hover:text-[#EF4B18] transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4B18] rounded-sm"
            >
              <span>View selected work</span>
              <span className="text-base sm:text-lg transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform font-mono">
                ↘
              </span>
              {/* Thin orange underline */}
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#EF4B18] rounded-full group-hover:h-[2.5px] transition-all" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 3. SELECTED WORK SECTION (Matching reference 2 & 3) ───────────────── */}
      <section id="work" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-10 border-t border-slate-100 scroll-mt-20">
        <div className="text-center mb-16 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#EF4B18]">
            SELECTED WORK
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            The 2.0s of Craft &amp; Systems
          </h2>
          <svg className="w-24 h-2 text-indigo-400 mx-auto mt-2" viewBox="0 0 100 8" fill="none">
            <path d="M2 5 Q50 1 98 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Selected Project Case Showcase */}
        {visibleProjects.length > 0 ? (
          <div className="space-y-20">
            {visibleProjects.map((proj, idx) => (
              <div
                key={proj.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left: Case Description */}
                <div className={`lg:col-span-5 space-y-4 text-left ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                  <h3 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight flex items-baseline gap-1.5">
                    <span>{proj.title}</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {proj.description || "Bringing tactile product design, clarity, and metrics into one unified experience."}
                  </p>

                  {/* Case Study Link */}
                  <div className="pt-2">
                    {proj.liveUrl || proj.repoUrl ? (
                      <SafeExternalLink
                        href={proj.liveUrl || proj.repoUrl}
                        className="group inline-flex items-center gap-1.5 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors relative py-1"
                      >
                        <span>View case study</span>
                        <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform font-mono text-xs">
                          ↗
                        </span>
                        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
                      </SafeExternalLink>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 font-medium">
                        <span>Case study documentation coming soon</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Phone Showcase Card */}
                <div className={`lg:col-span-7 flex justify-center ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col items-center group hover:shadow-[0_25px_60px_rgba(239,75,24,0.1)] transition-all duration-300">
                    {/* Floating Handwritten Micro-Annotation */}
                    <div className="absolute -top-3 -right-3 sm:-right-6 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm transform rotate-6 select-none hidden sm:block">
                      <span className="font-handwritten text-sm text-slate-700 font-bold">
                        good choices, brighter days
                      </span>
                    </div>

                    {/* Mockup Frame */}
                    <div className="w-64 sm:w-72 rounded-[36px] border-[6px] border-slate-900 bg-white shadow-2xl overflow-hidden aspect-[9/16] relative flex flex-col">
                      {/* Dynamic Island */}
                      <div className="h-6 bg-slate-900 flex items-center justify-center">
                        <div className="w-16 h-3 rounded-full bg-slate-950" />
                      </div>

                      {/* Mockup Screen Content */}
                      {proj.coverImageUrl ? (
                        <img
                          src={proj.coverImageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-sky-50/50 to-white text-left">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                              PROTOTYPE 2.0
                            </span>
                            <div className="font-bold text-sm text-slate-900">
                              {proj.title}
                            </div>
                            <div className="h-2 w-3/4 rounded bg-slate-200" />
                            <div className="h-2 w-1/2 rounded bg-slate-200" />
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-800">
                              Verified Experience
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              99.4% Design Clarity Score
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Default Demo Showcase matching Reference Image */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <h3 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight flex items-baseline gap-1.5">
                <span>FnS 2.0</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Bringing fish size, cut, and price into one buying experience.
              </p>

              <div className="pt-2">
                <a
                  href="#home"
                  className="group inline-flex items-center gap-1.5 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors relative py-1"
                >
                  <span>View case study</span>
                  <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform font-mono text-xs">
                    ↗
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col items-center">
                <div className="absolute -top-3 -right-3 sm:-right-6 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm transform rotate-6 select-none hidden sm:block">
                  <span className="font-handwritten text-sm text-slate-700 font-bold">
                    good food choices, brighter days
                  </span>
                </div>

                <div className="w-64 sm:w-72 rounded-[36px] border-[6px] border-slate-900 bg-white shadow-2xl overflow-hidden aspect-[9/16] relative flex flex-col">
                  <div className="h-6 bg-slate-900 flex items-center justify-center">
                    <div className="w-16 h-3 rounded-full bg-slate-950" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-sky-50/50 to-white text-left">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                        FnS BUYING EXPERIENCE
                      </span>
                      <div className="font-bold text-sm text-slate-900">
                        Selected Cuts &amp; Weights
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-2">
                        <div className="p-2 rounded-lg border border-slate-200 text-center text-[10px] font-bold">Small</div>
                        <div className="p-2 rounded-lg border border-slate-200 text-center text-[10px] font-bold">Medium</div>
                        <div className="p-2 rounded-lg border border-amber-400 bg-amber-50 text-center text-[10px] font-bold text-amber-900">Large</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs text-center text-xs font-semibold text-slate-800">
                      Choose Size to Select cut
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 4. MINIMAL FOOTER ─────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-slate-800">
            {fullName} · Portfolio
          </div>
          <div>
            Crafted with thoughtful minimalism. © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </article>
  );
}

export default EditorialCraftTemplate;
