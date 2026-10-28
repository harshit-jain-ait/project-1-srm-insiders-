/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  LayoutGrid,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ArrowRight,
  Download,
  X,
  Settings,
  User,
  Info,
  Folder,
  Briefcase,
  GraduationCap,
  Link2,
  Palette,
  Type,
  Globe,
  Rocket,
  Save,
  Check,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

export type LayoutDensity = "default" | "compact" | "spacious";
export type DeviceView = "desktop" | "tablet" | "mobile";

const ACCENT_COLORS = [
  { id: "cyan", hex: "#06b6d4", label: "Cyan", class: "bg-cyan-500", glow: "rgba(6,182,212,0.3)" },
  { id: "blue", hex: "#3b82f6", label: "Sky Blue", class: "bg-blue-500", glow: "rgba(59,130,246,0.3)" },
  { id: "teal", hex: "#14b8a6", label: "Teal", class: "bg-teal-500", glow: "rgba(20,184,166,0.3)" },
  { id: "emerald", hex: "#10b981", label: "Emerald", class: "bg-emerald-500", glow: "rgba(16,185,129,0.3)" },
  { id: "pink", hex: "#ec4899", label: "Rose Pink", class: "bg-pink-500", glow: "rgba(236,72,153,0.3)" },
  { id: "violet", hex: "#8b5cf6", label: "Violet", class: "bg-purple-500", glow: "rgba(139,92,246,0.3)" },
];

const TEMPLATES = [
  { id: "bento-studio", name: "Bento Studio", preview: "/images/templates/bento-studio.svg" },
  { id: "minimal-portfolio", name: "Minimalist", preview: "/images/templates/minimal-portfolio.svg" },
  { id: "editorial-studio", name: "Editorial", preview: "/images/templates/editorial-studio.svg" },
  { id: "developer-pro", name: "Developer Pro", preview: "/images/templates/developer-pro.svg" },
];

export function StudioShowcase() {
  // Live editable fields matching the right panel
  const [heading, setHeading] = useState("Hello, I'm Alex Carter");
  const [subheading, setSubheading] = useState("Product Designer • Developer");
  const [description, setDescription] = useState(
    "I create modern, user-focused digital experiences that make a difference. Passionate about design, technology and building meaningful products."
  );
  const [showViewWorkBtn, setShowViewWorkBtn] = useState(true);
  const [showResumeBtn, setShowResumeBtn] = useState(true);

  // Studio inspector & design state
  const [selectedTemplate, setSelectedTemplate] = useState("bento-studio");
  const [layoutStyle, setLayoutStyle] = useState<LayoutDensity>("default");
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [activeNavTab, setActiveNavTab] = useState("template");
  const [editPanelTab, setEditPanelTab] = useState<"content" | "style">("content");
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [isPublishToastOpen, setIsPublishToastOpen] = useState(false);

  const handleManualSave = () => {
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2400);
  };

  const handlePublishClick = () => {
    setIsPublishToastOpen(true);
    setTimeout(() => setIsPublishToastOpen(false), 3500);
  };

  return (
    <section className="relative w-full bg-[#07090e] text-slate-100 overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Ambient background glow & grid lines */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[35%] left-1/4 w-[500px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-1/4 w-[500px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full" />
        {/* Subtle dot matrix grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* 1. HERO TOP SECTION: Headline + 3 Value Props + Floating 3D Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle, Features */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Visual Editor Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-xs font-semibold text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Visual Editor</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Your portfolio, <br />
              your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                creative studio.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Edit, customize and bring your portfolio to life with our powerful visual editor. No code. No limits. Just
              your vision.
            </p>

            {/* 3 Value Props in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Real-time Preview</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">See changes instantly</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Drag &amp; Drop</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Build with ease</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Fully Customizable</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Make it yours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D/Tilted Cards (Alex Carter + Colors + Typography + Sections) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px]">
            {/* Playful script annotation at top right */}
            <div className="absolute -top-6 sm:-top-8 right-2 sm:right-6 z-30 pointer-events-none select-none text-right">
              <span className="font-serif italic text-xs sm:text-sm text-slate-300 block transform rotate-3">
                Edit. Preview. Publish.
              </span>
              <svg
                className="w-8 h-8 text-slate-400 inline-block transform translate-x-2 -translate-y-1"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M 28 6 C 25 18, 18 26, 8 28" />
                <path d="M 8 28 L 14 24" />
                <path d="M 8 28 L 12 33" />
              </svg>
            </div>

            {/* Main Floating Tilted Portfolio Card */}
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-[#0f1422]/90 border border-slate-700/70 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(37,99,235,0.25)] backdrop-blur-md transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Hello,</h3>
                  <h2 className="text-base font-extrabold text-white">I&apos;m Alex Carter</h2>
                  <p className="text-[11px] text-blue-400 font-medium">Product Designer • Developer</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Based in New York
                  </p>
                </div>
                {/* Avatar */}
                <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-slate-700 shadow-md shrink-0">
                  <img
                    src="/images/studio/alex-carter.jpg"
                    alt="Alex Carter"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-800 text-center">
                <div>
                  <div className="text-xs font-bold text-white">5+</div>
                  <div className="text-[9px] text-slate-400">Years Exp.</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">12+</div>
                  <div className="text-[9px] text-slate-400">Projects</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">8+</div>
                  <div className="text-[9px] text-slate-400">Tech Stack</div>
                </div>
              </div>

              {/* Action Button & Socials */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>View My Work</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-2 text-slate-400">
                  <GithubIcon className="w-3.5 h-3.5 hover:text-white transition-colors" />
                  <LinkedinIcon className="w-3.5 h-3.5 hover:text-white transition-colors" />
                  <TwitterIcon className="w-3.5 h-3.5 hover:text-white transition-colors" />
                </div>
              </div>
            </div>

            {/* Floating Mini Card 1: Colors (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:-left-8 bg-[#0b0f1a]/95 border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl backdrop-blur-md z-20 pointer-events-none transform -rotate-6">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">Colors</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-pink-500 shadow-sm" />
              </div>
            </div>

            {/* Floating Mini Card 2: Typography (Left Center) */}
            <div className="absolute bottom-6 -left-6 sm:-left-10 bg-[#0b0f1a]/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md z-20 pointer-events-none transform rotate-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold text-slate-400">Typography</span>
                <span className="text-[10px] font-bold text-white font-mono">Aa</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">Inter</div>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
                <span>Regular</span>
                <span>•</span>
                <span>Medium</span>
                <span>•</span>
                <span>Semibold</span>
              </div>
            </div>

            {/* Floating Mini Card 3: Sections Toggle List (Right Bottom) */}
            <div className="absolute -bottom-6 -right-2 sm:-right-8 bg-[#0b0f1a]/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md z-20 pointer-events-none transform rotate-6 w-36 hidden sm:block">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">Sections</span>
              <div className="space-y-1 text-[10px]">
                {["Hero", "About", "Skills", "Projects", "Experience", "Contact"].map((sec) => (
                  <div key={sec} className="flex items-center justify-between text-slate-300">
                    <span>{sec}</span>
                    <span className="w-4 h-2.5 rounded-full bg-blue-600 inline-flex items-center justify-end px-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN CENTERPIECE: The Full Interactive Bento Studio Workspace Showcase */}
        <div className="relative pt-4">
          {/* Outer glowing halo backlight */}
          <div className="absolute inset-0 -m-3 sm:-m-6 bg-gradient-to-r from-blue-600/25 via-cyan-500/20 to-indigo-600/25 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

          {/* Studio Window Shell */}
          <div className="relative rounded-2xl md:rounded-3xl border border-slate-800/90 bg-[#0b0e17] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(37,99,235,0.18)] overflow-hidden text-left flex flex-col">
            {/* STUDIO TOP BAR */}
            <div className="h-14 border-b border-slate-800 bg-[#0d111c] px-4 sm:px-6 flex items-center justify-between gap-3 text-xs select-none">
              {/* Left: Portfolify brand & active template with live indicator */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-[#2563eb] flex items-center justify-center text-white font-mono text-xs font-bold shadow-sm">
                    P
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white hidden sm:inline">
                    Portfolify
                  </span>
                </Link>

                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Back"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>

                <div className="h-4 w-px bg-slate-800" />

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs truncate">
                    {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Bento Studio"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Live Preview</span>
                  </span>
                </div>
              </div>

              {/* Center/Right: Viewport Devices + Save + Publish */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Device Selector */}
                <div className="flex items-center bg-[#07090e] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDeviceView("mobile")}
                    className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                      deviceView === "mobile" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView("tablet")}
                    className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                      deviceView === "tablet" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Tablet View"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView("desktop")}
                    className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                      deviceView === "desktop" ? "bg-slate-800 text-white shadow-sm font-medium" : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden md:inline text-[11px]">Desktop</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSavedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Saved</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>

                {/* Publish Button */}
                <button
                  type="button"
                  onClick={handlePublishClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </div>

            {/* Publish Toast / Feedback banner */}
            {isPublishToastOpen && (
              <div className="bg-emerald-950/90 border-b border-emerald-800/80 text-emerald-200 px-4 py-2 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Portfolio Ready!</strong> alexcarter.portfolify.dev is live and synchronized with our global CDN.
                  </span>
                </div>
                <Link
                  href="/editor"
                  className="underline font-semibold hover:text-white flex items-center gap-1 shrink-0"
                >
                  <span>Open Full Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* STUDIO WORKSPACE 4-COLUMN BODY */}
            <div className="flex flex-col lg:flex-row min-h-[640px] lg:min-h-[720px] divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 overflow-hidden">
              {/* COLUMN 1: Left Navigation Sidebar */}
              <div className="w-full lg:w-48 xl:w-52 bg-[#090c14] p-3.5 flex flex-col justify-between shrink-0 select-none">
                <div className="space-y-4">
                  {/* Home */}
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs font-medium transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>Home</span>
                  </Link>

                  {/* Section Group: Content */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                      Content
                    </span>
                    {[
                      { id: "personal", label: "Personal Info", icon: User },
                      { id: "about", label: "About", icon: Info },
                      { id: "skills", label: "Skills", icon: Zap },
                      { id: "projects", label: "Projects", icon: Folder },
                      { id: "experience", label: "Experience", icon: Briefcase },
                      { id: "education", label: "Education", icon: GraduationCap },
                      { id: "social", label: "Social Links", icon: Link2 },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeNavTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNavTab(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                            isActive
                              ? "bg-slate-800 text-white font-semibold"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Section Group: Design */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                      Design
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab("template")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                        activeNavTab === "template"
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                      <span>Template</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab("appearance")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                        activeNavTab === "appearance"
                          ? "bg-slate-800 text-white font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Appearance</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab("typography")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                        activeNavTab === "typography"
                          ? "bg-slate-800 text-white font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                      }`}
                    >
                      <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Typography</span>
                    </button>
                  </div>

                  {/* Section Group: Settings */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                      Settings
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab("seo")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                        activeNavTab === "seo"
                          ? "bg-slate-800 text-white font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>SEO &amp; Domain</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab("publish")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                        activeNavTab === "publish"
                          ? "bg-slate-800 text-white font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                      }`}
                    >
                      <Rocket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Publish</span>
                    </button>
                  </div>
                </div>

                {/* Bottom: Save Changes Button */}
                <div className="pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={handleManualSave}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border border-slate-700/50"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {/* COLUMN 2: Template Settings & Customizer Panel */}
              <div className="w-full lg:w-64 xl:w-72 bg-[#0c0f1a] p-4 space-y-5 shrink-0 overflow-y-auto">
                {/* Template Title & Change Button */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Template
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Bento Studio"}
                    </h3>
                  </div>
                  <Link href="/templates">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-750 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                    >
                      Change Template
                    </button>
                  </Link>
                </div>

                {/* 4 Template Thumbnails Row */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-300">Choose Template</span>
                  <div className="grid grid-cols-4 gap-2">
                    {TEMPLATES.map((tmpl) => {
                      const isSelected = selectedTemplate === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => setSelectedTemplate(tmpl.id)}
                          className={`relative aspect-[3/4] rounded-lg overflow-hidden border transition-all cursor-pointer bg-slate-900 group ${
                            isSelected
                              ? "border-cyan-400 ring-2 ring-cyan-400/40 shadow-md"
                              : "border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100"
                          }`}
                          title={tmpl.name}
                        >
                          <img
                            src={tmpl.preview}
                            alt={tmpl.name}
                            className="w-full h-full object-cover object-top"
                          />
                          {isSelected && (
                            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 flex items-center justify-center shadow-sm">
                              <Check className="w-2 h-2 text-black stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Template Settings: Layout Style */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-300 block">Layout Style</span>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#080b12] p-1 rounded-lg border border-slate-800">
                    {(["default", "compact", "spacious"] as LayoutDensity[]).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setLayoutStyle(style)}
                        className={`py-1 rounded text-[11px] font-medium capitalize transition-all cursor-pointer ${
                          layoutStyle === style
                            ? "bg-slate-800 text-white shadow-sm font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Swatches */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300">Accent Color</span>
                    <span className="text-[10px] text-slate-400 font-mono">{accentColor.label}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {ACCENT_COLORS.map((col) => {
                      const isSelected = accentColor.id === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setAccentColor(col)}
                          style={{ backgroundColor: col.hex }}
                          className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative ${
                            isSelected ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0c0f1a]" : "hover:scale-105 opacity-90 hover:opacity-100"
                          }`}
                          title={col.label}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="space-y-1 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-300 block">Dark Mode</span>
                      <span className="text-[10px] text-slate-400">Enable dark mode for your portfolio</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDarkMode((prev) => !prev)}
                      className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                        isDarkMode ? "bg-blue-600" : "bg-slate-700"
                      }`}
                      aria-label="Toggle dark mode"
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          isDarkMode ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Bottom Status Card */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2.5 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="font-semibold text-white block">Looks great!</span>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Your changes are saved automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: Live Preview Canvas (Center) */}
              <div
                className={`flex-1 flex flex-col items-center justify-start p-3 sm:p-5 lg:p-6 transition-all duration-300 overflow-y-auto ${
                  isDarkMode ? "bg-[#06080e]" : "bg-[#f4f4f7]"
                }`}
              >
                {/* Viewport Frame with device simulation width */}
                <div
                  className={`w-full transition-all duration-300 rounded-xl sm:rounded-2xl border shadow-2xl overflow-hidden flex flex-col text-left ${
                    deviceView === "mobile"
                      ? "max-w-[360px]"
                      : deviceView === "tablet"
                      ? "max-w-[620px]"
                      : "max-w-3xl"
                  } ${
                    isDarkMode
                      ? "bg-[#0b0f19] border-slate-800/90 text-white"
                      : "bg-white border-slate-200 text-slate-900 shadow-slate-300/50"
                  }`}
                  style={{
                    boxShadow: isDarkMode
                      ? `0 20px 60px rgba(0,0,0,0.8), 0 0 35px ${accentColor.glow}`
                      : `0 20px 40px rgba(0,0,0,0.08)`,
                  }}
                >
                  {/* Portfolio Navbar inside Live Canvas */}
                  <div
                    className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between text-xs transition-colors ${
                      isDarkMode ? "border-slate-850/80 bg-[#0d121f]" : "border-slate-100 bg-slate-50/80"
                    }`}
                  >
                    {/* Brand Monogram */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: accentColor.hex }}
                      >
                        AC
                      </div>
                      <span className="font-bold tracking-tight text-xs">Alex Carter</span>
                    </div>

                    {/* Nav Links */}
                    <div
                      className={`hidden sm:flex items-center gap-5 text-[11px] font-medium ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <span className="text-white font-semibold">Home</span>
                      <span className="hover:text-white transition-colors cursor-pointer">About</span>
                      <span className="hover:text-white transition-colors cursor-pointer">Projects</span>
                      <span className="hover:text-white transition-colors cursor-pointer">Experience</span>
                      <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
                    </div>

                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all"
                      style={{
                        borderColor: isDarkMode ? "#334155" : "#cbd5e1",
                        color: isDarkMode ? "#e2e8f0" : "#334155",
                      }}
                    >
                      Get in touch
                    </button>
                  </div>

                  {/* Portfolio Content Scroll Area */}
                  <div
                    className={`p-4 sm:p-6 lg:p-8 space-y-6 ${
                      layoutStyle === "compact"
                        ? "space-y-4 !p-4"
                        : layoutStyle === "spacious"
                        ? "space-y-8 !p-8"
                        : ""
                    }`}
                  >
                    {/* HERO SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      {/* Left: Text & Actions */}
                      <div className="sm:col-span-7 space-y-3">
                        <div className="space-y-1">
                          <span
                            className="text-xs sm:text-sm font-medium tracking-tight block"
                            style={{ color: accentColor.hex }}
                          >
                            Hello,
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                            {heading}
                          </h2>
                          <p
                            className="text-xs sm:text-sm font-semibold tracking-wide"
                            style={{ color: accentColor.hex }}
                          >
                            {subheading}
                          </p>
                        </div>

                        <p
                          className={`text-xs sm:text-[13px] leading-relaxed line-clamp-4 ${
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {description}
                        </p>

                        {/* Live Reactive Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                          {showViewWorkBtn && (
                            <button
                              type="button"
                              className="px-3.5 py-1.5 rounded-lg text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                              style={{ backgroundColor: accentColor.hex }}
                            >
                              <span>View My Work</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {showResumeBtn && (
                            <button
                              type="button"
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-colors flex items-center gap-1.5 ${
                                isDarkMode
                                  ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                                  : "border-slate-300 hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Resume</span>
                            </button>
                          )}
                        </div>

                        {/* Social Links */}
                        <div
                          className={`flex items-center gap-3 pt-2 text-xs ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          <GithubIcon className="w-4 h-4 hover:opacity-100 transition-opacity" />
                          <LinkedinIcon className="w-4 h-4 hover:opacity-100 transition-opacity" />
                          <TwitterIcon className="w-4 h-4 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Right: Profile Avatar with soft cyan/accent glow */}
                      <div className="sm:col-span-5 flex items-center justify-center">
                        <div className="relative group">
                          {/* Ambient soft glow */}
                          <div
                            className="absolute -inset-2 rounded-2xl blur-lg opacity-40 transition-opacity"
                            style={{ backgroundColor: accentColor.hex }}
                          />
                          <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
                            <img
                              src="/images/studio/alex-carter.jpg"
                              alt="Alex Carter Portrait"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div
                      className={`grid grid-cols-3 gap-3 p-3 rounded-xl border ${
                        isDarkMode
                          ? "bg-[#0d121f]/90 border-slate-800 text-slate-300"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm sm:text-base font-extrabold text-white">5+</div>
                        <div className="text-[10px] text-slate-400">Years Experience</div>
                      </div>
                      <div className="text-center border-x border-slate-700/40">
                        <div className="text-sm sm:text-base font-extrabold text-white">12+</div>
                        <div className="text-[10px] text-slate-400">Projects Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm sm:text-base font-extrabold text-white">8+</div>
                        <div className="text-[10px] text-slate-400">Technologies</div>
                      </div>
                    </div>

                    {/* FEATURED PROJECTS SECTION */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                          Featured Projects
                        </h3>
                        <span
                          className="text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          style={{ color: accentColor.hex }}
                        >
                          <span>View All</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Project 1 */}
                        <div
                          className={`rounded-xl border overflow-hidden transition-all group cursor-pointer ${
                            isDarkMode
                              ? "bg-[#0d121f] border-slate-800 hover:border-slate-700"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900">
                            <img
                              src="/images/studio/design-system.jpg"
                              alt="Design System Project"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                                Design System
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">UI/UX Design</p>
                            </div>
                            <span className="p-1 rounded-full bg-slate-800/80 text-slate-300 group-hover:text-white transition-colors">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        {/* Project 2 */}
                        <div
                          className={`rounded-xl border overflow-hidden transition-all group cursor-pointer ${
                            isDarkMode
                              ? "bg-[#0d121f] border-slate-800 hover:border-slate-700"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900">
                            <img
                              src="/images/studio/web-app.jpg"
                              alt="Web Application Project"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                                Web Application
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Full Stack</p>
                            </div>
                            <span className="p-1 rounded-full bg-slate-800/80 text-slate-300 group-hover:text-white transition-colors">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 4: Right Edit Section Panel */}
              <div className="w-full lg:w-64 xl:w-72 bg-[#0c0f1a] p-4 space-y-4 shrink-0 overflow-y-auto">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-bold text-white">Edit Section</h3>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content / Style Tabs */}
                <div className="grid grid-cols-2 gap-1 bg-[#080b12] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditPanelTab("content")}
                    className={`py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      editPanelTab === "content"
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPanelTab("style")}
                    className={`py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      editPanelTab === "style"
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Style
                  </button>
                </div>

                {editPanelTab === "content" ? (
                  <div className="space-y-3.5 text-left">
                    {/* Heading Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07090f] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                      />
                    </div>

                    {/* Subheading Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Subheading
                      </label>
                      <input
                        type="text"
                        value={subheading}
                        onChange={(e) => setSubheading(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07090f] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                      />
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07090f] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors leading-relaxed shadow-inner"
                      />
                    </div>

                    {/* Buttons Section with Toggles */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Buttons
                      </label>

                      {/* Toggle 1: View My Work */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#07090f] border border-slate-800">
                        <span className="text-xs text-slate-300 font-medium">View My Work</span>
                        <button
                          type="button"
                          onClick={() => setShowViewWorkBtn((prev) => !prev)}
                          className={`w-8 h-4 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                            showViewWorkBtn ? "bg-blue-600" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`block w-3 h-3 rounded-full bg-white transition-transform ${
                              showViewWorkBtn ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Toggle 2: Download Resume */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#07090f] border border-slate-800">
                        <span className="text-xs text-slate-300 font-medium">Download Resume</span>
                        <button
                          type="button"
                          onClick={() => setShowResumeBtn((prev) => !prev)}
                          className={`w-8 h-4 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                            showResumeBtn ? "bg-blue-600" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`block w-3 h-3 rounded-full bg-white transition-transform ${
                              showResumeBtn ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Style Tab */
                  <div className="space-y-3.5 text-left text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Card Corner Radius
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-[#07090f] p-1 rounded-lg border border-slate-800">
                        {["Small", "Medium", "Large"].map((r, i) => (
                          <button
                            key={r}
                            type="button"
                            className={`py-1 text-[11px] font-medium rounded ${
                              i === 1 ? "bg-slate-800 text-white font-semibold" : "text-slate-400"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Header Alignment
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-[#07090f] p-1 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          className="py-1 text-[11px] font-semibold bg-slate-800 text-white rounded"
                        >
                          Left Aligned
                        </button>
                        <button type="button" className="py-1 text-[11px] text-slate-400 rounded">
                          Centered
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Settings Link */}
                <div className="pt-3 border-t border-slate-800/80">
                  <Link
                    href="/editor"
                    className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white py-1 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      <span>Advanced Settings</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudioShowcase;
