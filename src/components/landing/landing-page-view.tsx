/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal";
import { getAllTemplates } from "@/templates/registry";
import { RegisteredTemplate } from "@/templates/types";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Globe,
  Link2,
  Palette,
  Layout,
  Edit3,
  Share2,
  Smartphone,
  Play,
  Eye,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "@/components/theme-provider";

import { StudioShowcase } from "@/components/landing/studio-showcase";

export function LandingPageView() {
  const templates = getAllTemplates();
  const [previewTemplate, setPreviewTemplate] = useState<RegisteredTemplate | null>(null);
  const [activeContactCard, setActiveContactCard] = useState<number>(1);
  const { isDark } = useTheme();

  // The 4 spotlight templates matching Section 4 in the reference design
  const featuredTemplates = [
    {
      id: "minimal-portfolio",
      name: "Minimal Portfolio",
      description: "Clean, elegant and focused on your content.",
      badge: "POPULAR",
      badgeType: "popular" as const,
      imageSrc: "/images/templates/preview-minimal.png",
    },
    {
      id: "developer-pro",
      name: "Developer Pro",
      description: "A modern template for developers and tech professionals.",
      badge: "TRENDING",
      badgeType: "trending" as const,
      imageSrc: "/images/templates/preview-developer.png",
    },
    {
      id: "bento-studio",
      name: "Bento Studio",
      description: "A bold, modern portfolio with a dark theme and interactive showcases.",
      badge: "NEW",
      badgeType: "new" as const,
      imageSrc: "/images/templates/preview-bento.png",
    },
    {
      id: "creative-motion",
      name: "Creative Flow",
      description: "A modern and artistic template for creatives, designers and storytellers.",
      badge: "FEATURED",
      badgeType: "featured" as const,
      imageSrc: "/images/templates/preview-creative.png",
    },
  ];

  const handlePreview = (templateId: string) => {
    const found = templates.find((t) => t.metadata.id === templateId);
    if (found) {
      setPreviewTemplate(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-600/30 selection:text-blue-200 font-sans">
      {/* 1. Header / Navbar matching dark reference design */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Visual Studio & Interactive Showcase Hero (Matches Reference Design) */}
        <StudioShowcase />

        {/* 3. Simple Process Section ("From idea to live portfolio in minutes.") */}
        <section id="process" className="py-12 md:py-16 bg-[#fbfaf8] dark:bg-[#07090f] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative overflow-hidden">
          {/* Full-width Responsive Desk Background Image without quality degradation */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <img
              src="/images/landing/process-desk-banner.png"
              alt="Desk workspace with laptop, books, coffee and plant"
              className="w-full h-full object-cover object-bottom opacity-100 dark:opacity-30 transition-opacity"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading, Badge, Subtitle & CTA */}
              <div className="lg:col-span-5 space-y-5 text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 dark:bg-blue-950/80 border border-blue-200/70 dark:border-blue-800/50 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 shadow-xs">
                  <span>SIMPLE PROCESS</span>
                </div>

                {/* Main Heading with hand-drawn blue underline curve on "minutes." */}
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  From idea to live portfolio <br />
                  in{" "}
                  <span className="relative inline-block text-blue-600 dark:text-blue-400">
                    minutes.
                    {/* Hand-drawn blue underline accent */}
                    <svg
                      className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-4 text-blue-500 overflow-visible"
                      viewBox="0 0 120 14"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 10 C 35 2, 85 2, 118 10"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md font-normal">
                  Create a professional portfolio website without coding. Just follow a few simple steps and let AI handle the rest.
                </p>

                {/* See How It Works Button with enlarged width and height */}
                <div className="pt-2">
                  <Link href="/editor">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4 inline-flex items-center gap-3.5 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <span className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-slate-900" />
                      </span>
                      <span className="tracking-wide">See How It Works</span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Handwritten annotation + 4 Step Cards */}
              <div className="lg:col-span-7 relative">
                {/* Handwritten "Your story. Your website." annotation pointing to cards */}
                <div className="hidden lg:flex items-center justify-end gap-2.5 mb-3 pr-6 text-slate-400 select-none pointer-events-none">
                  <div className="text-right">
                    <p className="font-serif italic text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-tight">
                      Your story.
                    </p>
                    <p className="font-serif italic text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-tight">
                      Your website.
                    </p>
                  </div>
                  {/* Decorative sketch arrow */}
                  <svg
                    className="w-8 h-8 text-slate-400 stroke-current -rotate-12 transform shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4c4 8 10 12 16 12m0 0l-4-4m4 4l-4 4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Small spark ticks */}
                  <span className="text-[11px] font-mono text-slate-400 -mt-3">\ | /</span>
                </div>

                {/* 4 Step Cards Grid with Smooth Hover Spring Animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Step 1 */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.025 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                    className="group relative p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_45px_rgba(59,130,246,0.16)] dark:hover:shadow-[0_22px_45px_rgba(59,130,246,0.22)] hover:border-blue-400 dark:hover:border-blue-500/60 transition-colors text-left flex flex-col justify-between min-h-[210px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100/90 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
                        <Link2 className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-400 text-xs font-semibold flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                        Add your details
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Share your background, skills, and goals.
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.025 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                    className="group relative p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_45px_rgba(16,185,129,0.16)] dark:hover:shadow-[0_22px_45px_rgba(16,185,129,0.22)] hover:border-emerald-400 dark:hover:border-emerald-500/60 transition-colors text-left flex flex-col justify-between min-h-[210px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
                        <Sparkles className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-400 text-xs font-semibold flex items-center justify-center">
                        2
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                        Let AI create
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Get personalized content and design suggestions.
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.025 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                    className="group relative p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_45px_rgba(168,85,247,0.16)] dark:hover:shadow-[0_22px_45px_rgba(168,85,247,0.22)] hover:border-purple-400 dark:hover:border-purple-500/60 transition-colors text-left flex flex-col justify-between min-h-[210px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-purple-100/90 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
                        <Palette className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-400 text-xs font-semibold flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                        Customize &amp; refine
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Edit visually with our intuitive builder.
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 4 */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.025 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                    className="group relative p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_45px_rgba(245,158,11,0.16)] dark:hover:shadow-[0_22px_45px_rgba(245,158,11,0.22)] hover:border-amber-400 dark:hover:border-amber-500/60 transition-colors text-left flex flex-col justify-between min-h-[210px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100/90 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
                        <Globe className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-400 text-xs font-semibold flex items-center justify-center">
                        4
                      </span>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                        Publish &amp; share
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Go live and showcase your work to the world.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Template Gallery Section ("Beautiful templates for every style.") */}
        <section id="templates" className="mt-6 sm:mt-8 py-8 md:py-10 bg-[#f4f7fc] dark:bg-[#07090f] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative overflow-hidden">
          {/* Full-width Responsive Background Image with enhanced high-resolution rendering */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <img
              src="/images/landing/template-gallery-bg.png"
              alt="Template gallery background with notes, books and desk lamp"
              className="w-full h-full object-cover object-bottom opacity-100 dark:opacity-30 transition-opacity"
              style={{ imageRendering: "auto" }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-6 md:space-y-7">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
              <div className="space-y-2 max-w-xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100/90 dark:bg-blue-950/80 border border-blue-200/70 dark:border-blue-800/50 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 shadow-xs">
                  <span>TEMPLATE GALLERY</span>
                </div>

                {/* Main Heading with hand-drawn blue underline accent on "style." */}
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  Beautiful templates for <br />
                  every{" "}
                  <span className="relative inline-block text-blue-600 dark:text-blue-400">
                    style.
                    {/* Hand-drawn blue underline accent */}
                    <svg
                      className="absolute -bottom-1.5 left-0 w-full h-3 sm:h-3.5 text-blue-500 overflow-visible"
                      viewBox="0 0 100 14"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 10 C 30 2, 70 2, 98 10"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Choose from professionally designed templates and make it yours with our visual editor.
                </p>
              </div>

              {/* Right: Handwritten annotation + View all templates Button */}
              <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                {/* Handwritten "Your idea. Our templates." annotation */}
                <div className="hidden md:flex items-center gap-2 select-none pointer-events-none text-blue-600 dark:text-blue-400 pr-3">
                  <div className="text-right">
                    <p className="font-serif italic text-xs leading-tight">Your idea.</p>
                    <p className="font-serif italic text-xs leading-tight">Our templates.</p>
                  </div>
                  {/* Curved arrow pointing down */}
                  <svg className="w-6 h-6 stroke-current -rotate-12 transform" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 4c3 8 8 12 14 12m0 0l-4-4m4 4l-4 4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* View All Templates Capsule Button */}
                <Link href="/templates">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="rounded-full bg-white dark:bg-[#0c0f18] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold text-xs px-5 py-2 shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2 group"
                  >
                    <span>View all templates</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* 4-Card Template Grid with Smooth Spring Hover Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredTemplates.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0c0f18]/95 backdrop-blur-md overflow-hidden shadow-[0_6px_25px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_35px_rgba(59,130,246,0.14)] dark:hover:shadow-[0_18px_35px_rgba(59,130,246,0.2)] hover:border-blue-400/70 dark:hover:border-blue-500/50 transition-colors flex flex-col justify-between p-3 group cursor-pointer"
                >
                  <div>
                    {/* Inner Thumbnail Preview Frame */}
                    <div className="relative aspect-[16/10] rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-100/80 dark:border-white/5">
                      <img
                        src={item.imageSrc}
                        alt={`${item.name} template preview`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge in top corner */}
                      {item.badge && (
                        <span
                          className={`absolute top-2 left-2 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full shadow-xs ${
                            item.badgeType === "popular"
                              ? "bg-blue-100/95 text-blue-700 dark:bg-blue-950/90 dark:text-blue-300"
                              : item.badgeType === "trending"
                              ? "bg-emerald-100/95 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300"
                              : item.badgeType === "new"
                              ? "bg-purple-100/95 text-purple-800 dark:bg-purple-950/90 dark:text-purple-300"
                              : "bg-amber-100/95 text-amber-800 dark:bg-amber-950/90 dark:text-amber-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="px-1 pt-3 pb-1 text-left space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* 4 Dot indicators */}
                      <div className="flex items-center gap-1.5 pt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 px-0.5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handlePreview(item.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200/90 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                    >
                      <Eye className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span>Preview</span>
                    </button>

                    <Link href={`/editor?template=${item.id}`} className="flex-1">
                      <button
                        type="button"
                        className="w-full py-1.5 px-2.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs hover:shadow-md text-center"
                      >
                        Select
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Powerful Features Section ("Everything you need to create an amazing portfolio.") */}
        <section
          id="features"
          className="mt-6 sm:mt-8 py-5 sm:py-7 md:py-8 bg-[#f7fafe] dark:bg-[#090b11] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative overflow-hidden"
        >
          {/* Full-width Panoramic Studio Desk Background Image matching reference design */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <img
              src="/images/landing/features-desk-bg.png"
              alt="Powerful features studio desk background with plant, books, smiling mug and ambient lighting"
              className="w-full h-full object-cover object-bottom opacity-100 dark:opacity-30 transition-opacity"
              style={{ imageRendering: "auto" }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 space-y-5 sm:space-y-6 relative z-10">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 text-left">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-0.5 rounded-full inline-block border border-blue-100 dark:border-blue-900/50">
                  POWERFUL FEATURES
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  Everything you need to create <br />
                  an{" "}
                  <span className="relative inline-block text-blue-600 dark:text-blue-400">
                    amazing
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2 text-blue-500 overflow-visible"
                      viewBox="0 0 100 12"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 9C28 3 72 3 98 8"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  portfolio.
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal max-w-xl">
                  Professional tools, beautiful templates and complete control — all in one place.
                </p>
              </div>

              {/* Handwritten Note + Arrow */}
              <div className="hidden lg:flex flex-col items-end relative -top-1 select-none pr-4">
                <span
                  className="text-blue-500 font-semibold text-xs sm:text-sm leading-snug block rotate-[-3deg]"
                  style={{ fontFamily: "cursive, sans-serif" }}
                >
                  Build. Showcase.
                  <br />
                  Stand out.
                </span>
                <svg
                  className="w-8 h-8 text-blue-500 mt-0.5 mr-2 rotate-[-10deg]"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M32 4C24 14 16 26 6 34M6 34L4 24M6 34L16 36"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* 6 Feature Grid Cards (2 rows x 3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {[
                {
                  title: "AI Portfolio Generation",
                  description: "Turn your information into a polished portfolio with AI.",
                  icon: Sparkles,
                  iconColor: "text-blue-600 dark:text-blue-400",
                  iconBg: "bg-blue-50 dark:bg-blue-950/70 border-blue-100 dark:border-blue-800/40",
                  btnBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400",
                  image: "/images/features/feature-ai.png",
                },
                {
                  title: "Template Library",
                  description: "Choose from a growing collection of modern templates.",
                  icon: Layout,
                  iconColor: "text-purple-600 dark:text-purple-400",
                  iconBg: "bg-purple-50 dark:bg-purple-950/70 border-purple-100 dark:border-purple-800/40",
                  btnBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400",
                  image: "/images/features/feature-templates.png",
                },
                {
                  title: "Custom Domains",
                  description: "Use your own domain for a professional touch.",
                  icon: Globe,
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                  iconBg: "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-100 dark:border-emerald-800/40",
                  btnBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400",
                  image: "/images/features/feature-domains.png",
                },
                {
                  title: "Visual Editor",
                  description: "Edit your portfolio with a simple drag and drop interface.",
                  icon: Edit3,
                  iconColor: "text-amber-600 dark:text-amber-400",
                  iconBg: "bg-amber-50 dark:bg-amber-950/70 border-amber-100 dark:border-amber-800/40",
                  btnBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400",
                  image: "/images/features/feature-editor.png",
                },
                {
                  title: "SEO & Sharing",
                  description: "Get discovered and share your work with the world.",
                  icon: Share2,
                  iconColor: "text-sky-600 dark:text-sky-400",
                  iconBg: "bg-sky-50 dark:bg-sky-950/70 border-sky-100 dark:border-sky-800/40",
                  btnBg: "bg-sky-50 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400",
                  image: "/images/features/feature-seo.png",
                },
                {
                  title: "Responsive Design",
                  description: "Looks great on every device, from mobile to desktop.",
                  icon: Smartphone,
                  iconColor: "text-indigo-600 dark:text-indigo-400",
                  iconBg: "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-100 dark:border-indigo-800/40",
                  btnBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400",
                  image: "/images/features/feature-responsive.png",
                },
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
                    whileHover={{ y: -4, scale: 1.015 }}
                    className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#0f121d]/90 backdrop-blur-md shadow-[0_6px_20px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.13)] transition-all duration-300 relative overflow-hidden flex flex-row items-center justify-between gap-3 group text-left min-h-[135px] sm:min-h-[142px]"
                  >
                    {/* Left content: Icon, Title, Description, Button */}
                    <div className="flex-1 flex flex-col justify-between h-full min-w-0 pr-1 z-10">
                      <div>
                        <div
                          className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg border flex items-center justify-center ${feature.iconBg} ${feature.iconColor} shadow-xs`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-bold text-[13px] sm:text-sm text-slate-900 dark:text-white mt-1.5 leading-snug">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                          {feature.description}
                        </p>
                      </div>

                      <div className="mt-2">
                        <div
                          className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${feature.btnBg} transition-transform duration-200 group-hover:translate-x-1 shadow-xs`}
                        >
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Right content: Dedicated 3D Mockup Graphic */}
                    <div className="w-[95px] sm:w-[115px] shrink-0 flex items-center justify-center relative z-10">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto max-h-[85px] sm:max-h-[95px] object-contain transition-transform duration-500 ease-out group-hover:scale-105 select-none pointer-events-none drop-shadow-sm"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Clean Minimalist Showcase CTA ("Craft & Innovation • The art of thoughtful digital portfolios.") */}
        <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-[#07090e] transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-[3rem] sm:rounded-[3.75rem] lg:rounded-[4.5rem] bg-[#FAF8F5] dark:bg-[#0f1118] border border-[#ECE7DE] dark:border-white/10 p-10 sm:p-16 lg:p-20 relative overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
              {/* Subtle ambient glow in background matching royal blue theme */}
              <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-950/20 rounded-full blur-3xl pointer-events-none -mt-40" />
              <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-sky-100/35 dark:bg-sky-950/15 rounded-full blur-3xl pointer-events-none -mb-40" />

              <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#2563eb] dark:text-blue-400 block">
                  CRAFT &amp; INNOVATION
                </span>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight leading-[1.14]">
                  The art of thoughtful digital{" "}
                  <span className="text-[#2563eb] dark:text-blue-400">portfolios.</span>
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-xl mx-auto">
                  A minimalist, collaborative space for modern creators, designers, and developers to showcase their work.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                  <Link href="/generate">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-[#111111] hover:bg-[#2563eb] text-white dark:bg-[#2563eb] dark:hover:bg-blue-500 font-medium px-8 py-3.5 rounded-full text-sm shadow-sm transition-all cursor-pointer"
                    >
                      Get started
                    </motion.button>
                  </Link>

                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#2563eb] dark:hover:text-blue-400 transition-colors group cursor-pointer"
                  >
                    <span>Explore templates</span>
                    <span className="text-base leading-none text-[#2563eb] dark:text-blue-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Contact Section ("Have questions? We are here to help.") */}
        <section id="contact" className="py-20 bg-white dark:bg-[#090b11] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400 px-3.5 py-1 rounded-full inline-block border border-purple-100 dark:border-purple-900/50">
                CONTACT &amp; SUPPORT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Have questions? We are here to help.
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
                Need help building your portfolio, have custom template requests, or want to partner? Get in touch with our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Email Us Directly",
                  description: "Drop us a message for general inquiries or dedicated support.",
                  linkText: "support@portfolify.dev",
                  href: "mailto:support@portfolify.dev",
                  isExternal: true,
                  icon: Mail,
                  iconColor: "text-purple-600 dark:text-purple-400",
                  iconBg: "bg-purple-50 dark:bg-purple-950/70 border-purple-100 dark:border-purple-800/40",
                  linkColor: "text-purple-600 dark:text-purple-400",
                  activeBorder: "border-purple-400/90 dark:border-purple-500/80 shadow-[0_12px_36px_-6px_rgba(168,85,247,0.16)]",
                  orbColor: "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)]",
                },
                {
                  title: "Community & Discussions",
                  description: "Join our vibrant community of developers, designers, and creators.",
                  linkText: "Join Community",
                  href: "/templates",
                  isExternal: false,
                  icon: MessageSquare,
                  iconColor: "text-blue-600 dark:text-blue-400",
                  iconBg: "bg-blue-50 dark:bg-blue-950/70 border-blue-100 dark:border-blue-800/40",
                  linkColor: "text-blue-600 dark:text-blue-400",
                  activeBorder: "border-blue-400/90 dark:border-blue-500/80 shadow-[0_12px_36px_-6px_rgba(37,99,235,0.16)]",
                  orbColor: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.95)]",
                },
                {
                  title: "Interactive Editor",
                  description: "Ready to start right now? Jump directly into the live studio.",
                  linkText: "Launch Editor",
                  href: "/editor",
                  isExternal: false,
                  icon: Send,
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                  iconBg: "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-100 dark:border-emerald-800/40",
                  linkColor: "text-emerald-600 dark:text-emerald-400",
                  activeBorder: "border-emerald-400/90 dark:border-emerald-500/80 shadow-[0_12px_36px_-6px_rgba(16,185,129,0.16)]",
                  orbColor: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]",
                },
              ].map((card, idx) => {
                const IconComponent = card.icon;
                const isActive = activeContactCard === idx;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: idx * 0.1, ease: "easeOut" }}
                    whileHover={{ y: -8, scale: 1.018 }}
                    onMouseEnter={() => setActiveContactCard(idx)}
                    className={`group relative p-7 rounded-3xl bg-white dark:bg-[#0c0e16] border transition-all duration-300 text-left flex flex-col justify-between min-h-[220px] cursor-pointer ${
                      isActive
                        ? `${card.activeBorder} ring-1 ring-black/5 dark:ring-white/5`
                        : "border-slate-200/80 dark:border-slate-800/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Glowing Indicator Orb on Active Card matching reference image */}
                    {isActive && (
                      <motion.div
                        layoutId="active-contact-orb"
                        className={`absolute -top-1.25 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${card.orbColor} z-20`}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}

                    <div>
                      <div
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.iconBg} ${card.iconColor} shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-5 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-5">
                      {card.isExternal ? (
                        <a
                          href={card.href}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.linkColor} group-hover:gap-2.5 transition-all`}
                        >
                          <span>{card.linkText}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                      ) : (
                        <Link
                          href={card.href}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.linkColor} group-hover:gap-2.5 transition-all`}
                        >
                          <span>{card.linkText}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer - Clean, Smooth & Minimalist */}
      <footer className="bg-white/80 dark:bg-[#07090e]/90 text-slate-500 dark:text-slate-400 py-10 sm:py-12 border-t border-slate-100 dark:border-slate-800/60 text-xs select-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100 dark:border-slate-800/50">
            {/* Brand Logo */}
            <Link href="/" className="group opacity-95 hover:opacity-100 transition-opacity">
              <Logo size="md" isDark={isDark} />
            </Link>

            {/* Navigation Links with Smooth Minimalist Hover */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[13px] font-normal text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                Home
              </Link>
              <Link href="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                Templates
              </Link>
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                Features
              </a>
              <a href="#process" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                Working
              </a>
              <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                Contact
              </a>
            </div>

            {/* Minimalist Social Icons */}
            <div className="flex items-center gap-2 text-slate-400">
              {[
                { label: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
                { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
                { label: "GitHub", href: "https://github.com", icon: GithubIcon },
                { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
                    aria-label={item.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom Copyright & Slogan */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-400 tracking-wide">
            <span>© 2026 Portfolify. All rights reserved.</span>
            <span>Create. Customize. Stand out.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Live Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}

export default LandingPageView;
