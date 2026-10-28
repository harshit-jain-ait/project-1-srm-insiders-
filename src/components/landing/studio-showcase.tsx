"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Star,
  Monitor,
  Rocket,
  ArrowRight,
  Sparkle,
} from "lucide-react";
import { RobotCanvas } from "@/components/robot-3d";

const VALUE_HIGHLIGHTS = [
  { label: "For Creatives", icon: Users },
  { label: "4.5 Trustpilot", icon: Star },
  { label: "Easiest Builder", icon: Sparkles },
  { label: "All in Browser", icon: Monitor },
  { label: "Start Free", icon: Rocket },
];

export function StudioShowcase() {
  return (
    <section className="relative w-full bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 selection:bg-purple-500/30 selection:text-purple-200 transition-colors duration-300">
      {/* Ambient background glow & grid lines */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[35%] left-1/4 w-[500px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-1/4 w-[500px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full" />
        {/* Subtle dot matrix grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 1. Centered Headline + Subtitle + 5 Value Highlights */}
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Visual Editor Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold text-purple-600 dark:text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span>Visual Editor</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            The portfolio website builder <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
              your work deserves
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            A portfolio website that makes your creative work the center of attention. No learning curve. No downloads. Just the easiest way to go from{" "}
            <em className="italic font-normal text-slate-800 dark:text-slate-200">I need a site</em>{" "}
            to{" "}
            <em className="italic font-normal text-slate-800 dark:text-slate-200">this is exactly what I wanted.</em>
          </p>

          {/* 5 Value Highlights in a Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2">
            {VALUE_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center gap-2.5 group w-20 sm:w-24"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/90 dark:bg-[#12141c] border border-slate-200/90 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-[#c084fc] shadow-xs dark:shadow-md transition-all duration-200 group-hover:scale-105 group-hover:border-purple-400/50">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/generate">
              <button
                type="button"
                className="rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1] text-white font-semibold text-sm sm:text-base px-7 py-3 shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(139,92,246,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Launch Studio Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/templates">
              <button
                type="button"
                className="rounded-full border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base px-6 py-3 transition-all cursor-pointer shadow-xs"
              >
                Explore Templates
              </button>
            </Link>
          </div>
        </div>

        {/* 2. Interactive 3D Robot Centerpiece Showcase */}
        <div className="relative max-w-6xl mx-auto pt-4">
          {/* Outer glowing halo */}
          <div className="absolute inset-0 -m-3 sm:-m-6 bg-gradient-to-r from-purple-600/20 via-fuchsia-500/15 to-indigo-600/20 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

          {/* 3D Showcase Frame */}
          <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-[#06050c] shadow-[0_25px_90px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_90px_rgba(139,92,246,0.22)] overflow-hidden text-left flex flex-col transition-colors duration-300">
            {/* Top Bar with Live Indicator & Helper Pill */}
            <div className="h-12 border-b border-white/10 bg-white/[0.03] px-4 sm:px-6 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white tracking-wide">
                  Procedural 3D Robot Canvas
                </span>
                <span className="hidden sm:inline text-slate-500">•</span>
                <span className="hidden sm:inline text-slate-400 text-[11px]">
                  Real-time Three.js WebGL
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-medium text-purple-300">
                <Sparkle className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>Move cursor to interact</span>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="w-full h-[460px] sm:h-[560px] lg:h-[640px] relative">
              <RobotCanvas className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudioShowcase;
