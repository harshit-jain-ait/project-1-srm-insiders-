"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Menu, X, Globe } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface LandingNavbarProps {
  variant?: "dark" | "light";
}

export function LandingNavbar({ variant = "dark" }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = variant === "dark";

  return (
    <header className="sticky top-0 z-50 w-full select-none pt-4 px-4 sm:px-6 pointer-events-none">
      {/* Floating Capsule Navbar */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <div
          className={`relative rounded-full border transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(139,92,246,0.12)] ${
            isDark
              ? "border-white/10 bg-[#090a0f]/90 text-white backdrop-blur-xl"
              : "border-slate-300/80 bg-white/95 text-slate-900 backdrop-blur-xl shadow-lg"
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
                className="text-white font-semibold transition-colors hover:text-blue-400 py-2"
              >
                Home
              </Link>
              <Link
                href="/templates"
                className="text-slate-300 hover:text-white transition-colors py-2"
              >
                Templates
              </Link>
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#process"
                className="text-slate-300 hover:text-white transition-colors py-2"
              >
                Working
              </a>
            </nav>

            {/* Right: Actions & Pill Button */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Theme / Globe Action Icon */}
              <button
                type="button"
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Toggle language or region"
                title="Region / Language"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:inline-flex"
                aria-label="Toggle theme"
                title="Theme toggle"
              >
                <Sun className="w-4 h-4" />
              </button>

              {/* Launch Editor Studio Link */}
              <Link
                href="/editor"
                className="hidden md:inline-flex text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
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
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
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
          <div className="lg:hidden mt-2 p-5 rounded-3xl border border-white/10 bg-[#090a0f]/95 text-slate-200 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white font-semibold py-1.5 hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors py-1.5"
              >
                Templates
              </Link>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors py-1.5"
              >
                Features
              </a>
              <a
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors py-1.5"
              >
                Working
              </a>
              <Link
                href="/editor"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors py-1.5"
              >
                Launch Editor Studio
              </Link>
            </nav>

            <div className="pt-4 mt-3 border-t border-white/10">
              <Link href="/generate" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1] text-white font-semibold py-2.5 text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)]"
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
