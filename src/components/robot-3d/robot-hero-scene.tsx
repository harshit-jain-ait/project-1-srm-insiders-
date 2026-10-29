"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RobotCanvas } from "./robot-canvas";
import { Menu, X } from "lucide-react";

export function RobotHeroScene() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black text-[#e7e7e7] overflow-hidden selection:bg-purple-600/40 selection:text-white font-sans flex flex-col justify-between">
      {/* 1. Atmospheric Ambient Lighting & Glow Backdrops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft violet/white atmospheric beam at top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/25 via-fuchsia-500/15 to-transparent blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[18%] right-[10%] w-[380px] h-[380px] bg-white/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-[15%] w-[500px] h-[300px] bg-indigo-900/15 blur-[150px] rounded-full pointer-events-none" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* 2. Header Navbar */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-3xl font-light tracking-wider text-white group-hover:text-purple-300 transition-colors">
            MCODE
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm tracking-[0.1em] text-slate-300">
          <Link
            href="#company"
            className="hover:text-white transition-colors duration-200"
          >
            COMPANY
          </Link>
          <Link
            href="#features"
            className="hover:text-white transition-colors duration-200"
          >
            FEATURES
          </Link>
          <Link
            href="#resources"
            className="hover:text-white transition-colors duration-200"
          >
            RESOURCES
          </Link>
          <Link
            href="#docs"
            className="hover:text-white transition-colors duration-200"
          >
            DOCS
          </Link>
        </nav>

        {/* Sign In CTA Button */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            className="px-8 py-2.5 rounded-full bg-[#a7a7a7] hover:bg-white text-black font-medium text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
          >
            SIGN IN
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-40 bg-black/95 border-b border-white/10 px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-4 text-sm tracking-wider text-slate-300">
            <Link href="#company" onClick={() => setMobileMenuOpen(false)}>
              COMPANY
            </Link>
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>
              FEATURES
            </Link>
            <Link href="#resources" onClick={() => setMobileMenuOpen(false)}>
              RESOURCES
            </Link>
            <Link href="#docs" onClick={() => setMobileMenuOpen(false)}>
              DOCS
            </Link>
          </nav>
          <div className="pt-2">
            <button
              type="button"
              className="w-full py-2.5 rounded-full bg-[#a7a7a7] hover:bg-white text-black font-semibold text-sm transition-colors"
            >
              SIGN IN
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Hero Body (Left Text + Right 3D Interactive Scene) */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between py-8 lg:py-12 gap-8 lg:gap-4">
        {/* Left Column: Hero Content */}
        <div className="w-full lg:max-w-xl space-y-7 text-left shrink-0">
          {/* Animated Gradient Pill Tag */}
          <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-neutral-600 via-purple-600 via-violet-600 to-neutral-600 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] shadow-[0_0_20px_rgba(168,85,247,0.35)]">
            <div className="px-5 py-1.5 rounded-full bg-black/90 text-xs sm:text-sm font-semibold tracking-wider text-slate-200 hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1.5">
              <span>INTRODUCING</span>
              <span className="text-purple-400 font-bold">•</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.08] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            EMAIL FOR <br />
            DEVELOPERS
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-[#9ca3af] max-w-md leading-relaxed font-normal">
            The best way to reach humans instead of spam folders, deliver
            transactional and marketing emails at scale.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#docs"
              className="px-6 py-3 rounded-full border border-[#2a2a2a] hover:border-slate-600 bg-transparent hover:bg-white/5 text-white font-semibold text-sm sm:text-base tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 group"
            >
              <span>Documentation</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
                &gt;
              </span>
            </Link>

            <Link
              href="#get-started"
              className="px-8 py-3 rounded-full bg-[#d4d4d8] hover:bg-white text-black font-semibold text-sm sm:text-base tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <span className="text-black group-hover:translate-x-0.5 transition-transform">
                &gt;
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive 3D Robot Canvas */}
        <div className="w-full lg:flex-1 h-[480px] sm:h-[580px] lg:h-[680px] relative flex items-center justify-center">
          <RobotCanvas className="w-full h-full" />
        </div>
      </main>

      {/* Footer Info / Attribution */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between text-xs text-neutral-500 border-t border-white/5">
        <span>© 2026 MCODE. Procedural 3D Scene.</span>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default RobotHeroScene;
