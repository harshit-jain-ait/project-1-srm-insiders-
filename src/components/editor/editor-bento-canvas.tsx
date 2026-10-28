/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { DeviceMode } from "./editor-toolbar";
import {
  ArrowRight,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Code2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

interface EditorBentoCanvasProps {
  portfolio: PortfolioData;
  deviceMode: DeviceMode;
  className?: string;
}

export function EditorBentoCanvas({
  portfolio,
  deviceMode,
  className = "",
}: EditorBentoCanvasProps) {
  const profile = portfolio.profile;
  const fullName = profile.fullName || "Alex Carter";
  const headline = profile.headline || "Product Designer • Developer";
  const bio =
    profile.bio ||
    "I create modern, user-focused digital experiences that make a difference. Passionate about design, technology and building meaningful products.";
  const statusBadge = profile.statusBadge || "Available for new opportunities";
  const avatarUrl = profile.avatarUrl || "/images/studio/alex-carter.jpg";
  const location = profile.location || "New Delhi, India";

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AC";

  // Tech stack items
  const defaultTechStack = [
    { name: "Next.js", icon: "N" },
    { name: "React", icon: "⚛" },
    { name: "TypeScript", icon: "TS" },
    { name: "Tailwind CSS", icon: "🌊" },
    { name: "Framer", icon: "▲" },
    { name: "Figma", icon: "❖" },
  ];

  return (
    <div
      className={`flex-1 bg-[#06080e] flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 lg:p-8 select-text relative transition-all duration-300 ${className}`}
    >
      {/* Outer ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Device Mode Sizing Container */}
      <div
        className={`w-full transition-all duration-300 rounded-2xl md:rounded-3xl border border-slate-800/90 bg-[#090d16] text-white shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-left ${
          deviceMode === "mobile"
            ? "max-w-[375px]"
            : deviceMode === "tablet"
            ? "max-w-[768px]"
            : "max-w-4xl xl:max-w-5xl"
        }`}
      >
        {/* 1. PORTFOLIO TOP NAVBAR */}
        <div className="px-5 sm:px-8 py-3.5 border-b border-slate-800/80 bg-[#0b0f1a] flex items-center justify-between text-xs">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-mono text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <span className="font-bold text-sm tracking-tight text-white">{fullName}</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="text-white font-semibold">Home</span>
            <span className="hover:text-white transition-colors cursor-pointer">About</span>
            <span className="hover:text-white transition-colors cursor-pointer">Projects</span>
            <span className="hover:text-white transition-colors cursor-pointer">Experience</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
          </div>

          {/* Get in Touch Button */}
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-xl border border-slate-700/80 hover:border-slate-500 bg-slate-800/40 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            Get in Touch
          </button>
        </div>

        {/* 2. PORTFOLIO SCROLLABLE BODY */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* HERO BENTO ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Text & Actions (Col 1-7) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Availability Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{statusBadge}</span>
              </div>

              {/* Big Headline */}
              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15]">
                  Hello, <br />
                  I&apos;m{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                    {fullName}
                  </span>
                </h2>
                <p className="text-sm sm:text-base font-semibold text-blue-400 pt-0.5">{headline}</p>
              </div>

              {/* Bio Narrative */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">{bio}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>View My Work</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2 text-slate-400">
                <LinkedinIcon className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <GithubIcon className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <TwitterIcon className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <span className="text-xs hover:text-white transition-colors cursor-pointer font-bold">
                  📷
                </span>
              </div>
            </div>

            {/* Right: Portrait Photo with Layered Backing & Script Annotation (Col 8-12) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Hand-drawn Playful Annotation */}
              <div className="absolute -top-6 -right-2 sm:-right-4 z-20 pointer-events-none select-none text-right">
                <span className="font-serif italic text-xs sm:text-sm text-slate-300 block transform rotate-3">
                  Turning ideas
                </span>
                <span className="font-serif italic text-xs sm:text-sm text-slate-300 block transform rotate-3">
                  into digital
                </span>
                <span className="font-serif italic text-xs sm:text-sm text-slate-300 block transform rotate-3">
                  experiences
                </span>
                <svg
                  className="w-7 h-7 text-slate-400 inline-block transform translate-x-2 -translate-y-1"
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

              {/* Layered Backdrop Cards + Photo Frame */}
              <div className="relative w-48 h-60 sm:w-56 sm:h-72">
                {/* Backing card 1 */}
                <div className="absolute inset-0 bg-blue-900/30 rounded-3xl transform rotate-6 border border-blue-500/20 blur-[1px]" />
                {/* Backing card 2 */}
                <div className="absolute inset-0 bg-slate-800/40 rounded-3xl transform -rotate-3 border border-slate-700/40" />

                {/* Main Photo Card */}
                <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 group">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle soft gradient fade at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. TECH STACK RIBBON */}
          <div className="p-3 rounded-2xl bg-[#0c101a] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-semibold px-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Tech Stack</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
              {defaultTechStack.map((tech) => (
                <div key={tech.name} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="text-[11px] font-mono text-blue-400">{tech.icon}</span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. ASYMMETRIC BENTO ROW: Featured Project + About Me */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Bento Card 1: Featured Project (Col 1-7) */}
            <div className="lg:col-span-7 rounded-2xl bg-[#0c101a] border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-colors">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src="/images/studio/design-system.jpg"
                  alt="Design System"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white">
                  Featured Project
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    Design System
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    A modern design system for building scalable and consistent web applications.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center -space-x-1.5">
                    <span className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800 text-[9px] font-bold text-white flex items-center justify-center">
                      JD
                    </span>
                    <span className="w-6 h-6 rounded-full bg-blue-700 border border-slate-800 text-[9px] font-bold text-white flex items-center justify-center">
                      AC
                    </span>
                    <span className="w-6 h-6 rounded-full bg-slate-850 border border-slate-800 text-[9px] font-medium text-slate-400 flex items-center justify-center">
                      +2
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: About Me (Col 8-12) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0c101a] border border-slate-800 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white tracking-tight">About Me</h3>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I&apos;m a passionate designer and developer who loves creating clean, functional and beautiful
                  digital experiences. I enjoy solving problems and turning ideas into products that people love.
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-850 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Location</span>
                  </div>
                  <span className="text-slate-200 font-medium">{location}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>Experience</span>
                  </div>
                  <span className="text-slate-200 font-medium">2+ years</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>Education</span>
                  </div>
                  <span className="text-slate-200 font-medium">B.Tech in Computer Science</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. FEATURED PROJECTS GALLERY ROW */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Featured Projects</h3>
              <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors">
                <span>View All Projects</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: "Dark Minimal UI", img: "/images/studio/web-app.jpg" },
                { title: "Mobile Wallet", img: "/images/templates/bento-studio.svg" },
                { title: "Cloud Engine", img: "/images/studio/design-system.jpg" },
                { title: "Brand Identity", img: "/images/templates/editorial-studio.svg" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-[#0c101a] overflow-hidden aspect-[4/3] group cursor-pointer hover:border-slate-700 transition-all"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorBentoCanvas;
