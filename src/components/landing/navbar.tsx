"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Menu, X } from "lucide-react";

interface LandingNavbarProps {
  variant?: "dark" | "light";
}

export function LandingNavbar({ variant = "dark" }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = variant === "dark";

  return (
    <header
      className={`border-b sticky top-0 z-40 select-none transition-all ${
        isDark
          ? "border-slate-800/80 bg-[#07090e]/95 text-slate-100 backdrop-blur-md"
          : "border-slate-200/80 bg-white/95 text-slate-900 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-mono text-base font-bold shadow-sm transition-transform group-hover:scale-105">
            P
          </div>
          <span
            className={`font-extrabold text-xl tracking-tight transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Portfolify
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/"
            className="text-blue-500 font-semibold relative py-6 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500"
          >
            Home
          </Link>
          <Link
            href="/templates"
            className={`transition-colors font-medium py-6 ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Templates
          </Link>
          <a
            href="#features"
            className={`transition-colors font-medium py-6 ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Features
          </a>
          <Link
            href="/pricing"
            className={`transition-colors font-medium py-6 ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pricing
          </Link>
          <a
            href="#process"
            className={`transition-colors font-medium py-6 ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Blog
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Toggle theme"
            title="Theme toggle"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Sign In Button */}
          <Link
            href="/editor"
            className={`hidden sm:inline-flex text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              isDark
                ? "text-slate-300 hover:text-white hover:bg-slate-800"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Sign In
          </Link>

          {/* Get Started Button */}
          <Link href="/generate">
            <button
              type="button"
              className="bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              Get Started
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`p-2 rounded-md md:hidden cursor-pointer ${
              isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150 ${
            isDark ? "bg-[#0b0e17] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-blue-500 font-semibold py-1"
            >
              Home
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-400 transition-colors py-1"
            >
              Templates
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-400 transition-colors py-1"
            >
              Features
            </a>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-400 transition-colors py-1"
            >
              Pricing
            </Link>
            <Link
              href="/editor"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-400 transition-colors py-1"
            >
              Studio Editor / Sign In
            </Link>
          </nav>
          <div className={`pt-2 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <Link href="/generate" onClick={() => setMobileMenuOpen(false)}>
              <button
                type="button"
                className="w-full bg-[#2563eb] text-white font-semibold py-2 rounded-lg text-sm shadow-sm"
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
