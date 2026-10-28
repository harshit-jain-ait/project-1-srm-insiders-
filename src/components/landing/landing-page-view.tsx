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
        <section id="templates" className="mt-12 sm:mt-16 md:mt-24 py-20 md:py-28 bg-[#f4f7fc] dark:bg-[#07090f] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative overflow-hidden">
          {/* Full-width Responsive Background Image with enhanced high-resolution rendering */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <img
              src="/images/landing/template-gallery-bg.png"
              alt="Template gallery background with notes, books and desk lamp"
              className="w-full h-full object-cover object-bottom opacity-100 dark:opacity-30 transition-opacity"
              style={{ imageRendering: "auto" }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
              <div className="space-y-3 max-w-xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 dark:bg-blue-950/80 border border-blue-200/70 dark:border-blue-800/50 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 shadow-xs">
                  <span>TEMPLATE GALLERY</span>
                </div>

                {/* Main Heading with hand-drawn blue underline accent on "style." */}
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  Beautiful templates for <br />
                  every{" "}
                  <span className="relative inline-block text-blue-600 dark:text-blue-400">
                    style.
                    {/* Hand-drawn blue underline accent */}
                    <svg
                      className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-4 text-blue-500 overflow-visible"
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

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Choose from professionally designed templates and make it yours with our visual editor.
                </p>
              </div>

              {/* Right: Handwritten annotation + View all templates Button */}
              <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                {/* Handwritten "Your idea. Our templates." annotation */}
                <div className="hidden md:flex items-center gap-2 select-none pointer-events-none text-blue-600 dark:text-blue-400 pr-4">
                  <div className="text-right">
                    <p className="font-serif italic text-xs sm:text-[13px] leading-tight">Your idea.</p>
                    <p className="font-serif italic text-xs sm:text-[13px] leading-tight">Our templates.</p>
                  </div>
                  {/* Curved arrow pointing down */}
                  <svg className="w-7 h-7 stroke-current -rotate-12 transform" fill="none" viewBox="0 0 24 24">
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
                    className="rounded-full bg-white dark:bg-[#0c0f18] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm px-6 py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2 group"
                  >
                    <span>View all templates</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* 4-Card Template Grid with Smooth Spring Hover Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTemplates.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0c0f18]/95 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_45px_rgba(59,130,246,0.14)] dark:hover:shadow-[0_22px_45px_rgba(59,130,246,0.2)] hover:border-blue-400/70 dark:hover:border-blue-500/50 transition-colors flex flex-col justify-between p-3.5 sm:p-4 group cursor-pointer"
                >
                  <div>
                    {/* Inner Thumbnail Preview Frame */}
                    <div className="relative aspect-[16/11] rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-100/80 dark:border-white/5">
                      <img
                        src={item.imageSrc}
                        alt={`${item.name} template preview`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge in top corner */}
                      {item.badge && (
                        <span
                          className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${
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
                    <div className="px-1.5 pt-4 pb-2 text-left space-y-1.5">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* 4 Dot indicators */}
                      <div className="flex items-center gap-1.5 pt-2">
                        <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 px-1 flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePreview(item.id)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200/90 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Preview</span>
                    </button>

                    <Link href={`/editor?template=${item.id}`} className="flex-1">
                      <button
                        type="button"
                        className="w-full py-2 px-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs hover:shadow-md text-center"
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
        <section id="features" className="py-20 bg-white dark:bg-[#090b11] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-1 rounded-md inline-block">
                  POWERFUL FEATURES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Everything you need to create <br />
                  an amazing portfolio.
                </h2>
              </div>

              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <span>Explore all features</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 6 Feature Grid Cards (2 rows x 3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Portfolio Generation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Turn your information into a polished portfolio with AI.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Template Library</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Choose from a growing collection of modern templates.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Custom Domains</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Use your own domain for a professional touch.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Visual Editor</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Edit your portfolio with a simple drag and drop interface.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">SEO &amp; Sharing</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Get discovered and share your work with the world.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Responsive Design</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Looks great on every device, from mobile to desktop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Dark CTA Banner ("Build your portfolio today.") */}
        <section className="py-20 bg-slate-50 dark:bg-[#07090e] transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-3xl bg-gradient-to-r from-[#0c0e14] via-[#11141c] to-[#0a0c10] border border-slate-800 p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    READY TO GET STARTED?
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Build your portfolio today.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-lg">
                    Join thousands of creators, designers and developers who trust Portfolify to showcase their work.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <Link href="/generate">
                      <button
                        type="button"
                        className="bg-[#2563eb] hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/30 text-sm transition-all cursor-pointer"
                      >
                        <span>Create Your Portfolio</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>

                    <Link href="/templates">
                      <button
                        type="button"
                        className="border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 px-5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                      >
                        Explore Templates
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Device Mockups */}
                <div className="lg:col-span-5 flex items-center justify-center relative">
                  <div className="w-full max-w-md">
                    <img
                      src="/images/landing/responsive-devices.svg"
                      alt="Portfolify Responsive Devices Preview"
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Contact Section ("Get in Touch") */}
        <section id="contact" className="py-20 bg-white dark:bg-[#090b11] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400 px-2.5 py-1 rounded-md inline-block">
                CONTACT & SUPPORT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Have questions? We are here to help.
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
                Need help building your portfolio, have custom template requests, or want to partner? Get in touch with our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Card 1: Email Support */}
              <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0e16] space-y-4 text-left transition-all hover:border-purple-300 dark:hover:border-purple-600">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Email Us Directly</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Drop us a message for general inquiries or dedicated support.
                  </p>
                </div>
                <a
                  href="mailto:support@portfolify.dev"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-1"
                >
                  <span>support@portfolify.dev</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card 2: Community Chat */}
              <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0e16] space-y-4 text-left transition-all hover:border-blue-300 dark:hover:border-blue-600">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Community & Discussions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Join our vibrant community of developers, designers, and creators.
                  </p>
                </div>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                >
                  <span>Join Community</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 3: Quick Start */}
              <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0e16] space-y-4 text-left transition-all hover:border-emerald-300 dark:hover:border-emerald-600">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Interactive Editor</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Ready to start right now? Jump directly into the live studio.
                  </p>
                </div>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                >
                  <span>Launch Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="bg-slate-100 dark:bg-[#090b0e] text-slate-600 dark:text-slate-400 py-14 border-t border-slate-200 dark:border-slate-800/80 text-xs select-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            {/* Brand */}
            <Link href="/" className="group">
              <Logo size="md" isDark={isDark} />
            </Link>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-8 font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Templates
              </Link>
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Features
              </a>
              <a href="#process" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Working
              </a>
              <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Contact
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <span>© 2026 Portfolify. All rights reserved.</span>
            <span>Create. Customize. Share.</span>
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
