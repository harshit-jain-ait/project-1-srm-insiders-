"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "@/components/theme-provider";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full select-none pt-4 px-4 sm:px-6 pointer-events-none">
      {/* Floating Capsule Navbar */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <div
          className={`relative rounded-full border transition-all duration-300 ${
            isDark
              ? "border-white/10 bg-[#090a0f]/90 text-white backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(139,92,246,0.12)]"
              : "border-slate-200/90 bg-white/95 text-slate-900 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.08),0_0_20px_rgba(139,92,246,0.06)]"
          }`}
        >
          <div className="px-5 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Logo */}
            <Link href="/" className="group flex items-center shrink-0">
              <Logo size="md" isDark={isDark} />
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
              <Link
                href="/"
                className={`font-semibold transition-colors py-2 ${
                  isDark ? "text-white hover:text-blue-400" : "text-slate-900 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                href="/templates"
                className={`transition-colors py-2 ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Templates
              </Link>
              <a
                href="#features"
                className={`transition-colors py-2 ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Features
              </a>
              <a
                href="#process"
                className={`transition-colors py-2 ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Working
              </a>
            </nav>

            {/* Right: Actions & Pill Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button (Light/Dark Mode) */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isDark
                    ? "text-slate-300 hover:text-amber-300 hover:bg-white/10 active:scale-95"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95"
                }`}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-300 transition-transform rotate-0 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
                )}
              </button>


              {/* Launch Editor Studio Link */}
              <Link
                href="/editor"
                className={`hidden md:inline-flex text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Launch Editor Studio
              </Link>

              {/* Get Started Pill Button with Purple/Indigo Glow Gradient */}
              <Link href="/generate" className="shrink-0">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1] hover:from-[#6d28d9] hover:via-[#7c3aed] hover:to-[#4f46e5] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-2.5 shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:shadow-[0_0_25px_rgba(139,92,246,0.65)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Get Started
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={`p-2 rounded-full lg:hidden cursor-pointer transition-colors ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Card */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-2 p-5 rounded-3xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-2 duration-150 ${
              isDark
                ? "border-white/10 bg-[#090a0f]/95 text-slate-200"
                : "border-slate-200 bg-white/95 text-slate-800"
            }`}
          >
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors font-semibold ${
                  isDark ? "text-white hover:text-blue-400" : "text-slate-900 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Templates
              </Link>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Features
              </a>
              <a
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Working
              </a>
              <Link
                href="/editor"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Launch Editor Studio
              </Link>
            </nav>

            <div
              className={`pt-4 mt-3 border-t flex items-center justify-between gap-3 ${
                isDark ? "border-white/10" : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  isDark
                    ? "bg-white/10 text-slate-200 hover:bg-white/15"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-300" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <Link
                href="/generate"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1"
              >
                <button
                  type="button"
                  className="w-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1] text-white font-semibold py-2.5 text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                >
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default LandingNavbar;
