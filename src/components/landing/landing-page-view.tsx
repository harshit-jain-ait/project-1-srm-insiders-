/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal";
import { getAllTemplates } from "@/templates/registry";
import { RegisteredTemplate } from "@/templates/types";
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

  // The 4 spotlight templates matching Section 3 in the reference design
  const featuredTemplates = [
    {
      id: "minimal-portfolio",
      name: "Minimal Portfolio",
      description: "Clean, elegant and focused on your content.",
      badge: "Popular",
      badgeType: "popular" as const,
      imageSrc: "/images/templates/minimal-portfolio.svg",
    },
    {
      id: "developer-pro",
      name: "Developer Pro",
      description: "A modern template for developers and tech professionals.",
      badge: "Trending",
      badgeType: "trending" as const,
      imageSrc: "/images/templates/developer-pro.svg",
    },
    {
      id: "bento-studio",
      name: "Bento Studio",
      description: "A bold, modern portfolio with a dark theme and interactive showcases.",
      badge: "New",
      badgeType: "new" as const,
      imageSrc: "/images/templates/bento-studio.svg",
    },
    {
      id: "creative-motion",
      name: "Creative Flow",
      description: "A modern and artistic template for creatives, designers and storytellers.",
      badge: null,
      badgeType: null,
      imageSrc: "/images/templates/creative-motion.svg",
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
        <section id="process" className="py-20 bg-white dark:bg-[#090b11] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & Info */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-1 rounded-md inline-block">
                  SIMPLE PROCESS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  From idea to live portfolio <br />
                  in minutes.
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  Create a professional portfolio website without coding. Just follow a few simple steps and let AI handle the rest.
                </p>
                <div className="pt-2">
                  <Link href="/editor">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[10px]">
                        <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                      </span>
                      <span>See How It Works</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Column: 4-Step Chain */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all space-y-3 relative group text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add your details</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Share your background, skills, and goals.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all space-y-3 relative group text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Let AI create</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Get personalized content and design suggestions.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all space-y-3 relative group text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Customize &amp; refine</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Edit visually with our intuitive builder.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f121d] hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all space-y-3 relative group text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center">
                      4
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Publish &amp; share</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Go live and showcase your work to the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Template Gallery Section ("Beautiful templates for every style.") */}
        <section id="templates" className="py-20 bg-slate-50 dark:bg-[#07090e] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-1 rounded-md inline-block">
                  TEMPLATE GALLERY
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Beautiful templates for every style.
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose from professionally designed templates and make it yours with our visual editor.
                </p>
              </div>

              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <span>View all templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4-Card Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTemplates.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f121d] overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Preview Container */}
                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                      <img
                        src={item.imageSrc}
                        alt={`${item.name} template preview`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge in top corner */}
                      {item.badge && (
                        <span
                          className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${
                            item.badgeType === "popular"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : item.badgeType === "trending"
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 text-left space-y-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#2563eb] dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Dot indicators */}
                      <div className="flex items-center gap-1.5 pt-2">
                        <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-200" />
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePreview(item.id)}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-sm"
                    >
                      Preview
                    </button>

                    <Link href={`/editor?template=${item.id}`} className="flex-1">
                      <button
                        type="button"
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                      >
                        Select
                      </button>
                    </Link>
                  </div>
                </div>
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
