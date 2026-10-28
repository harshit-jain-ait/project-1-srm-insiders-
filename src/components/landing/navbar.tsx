"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "@/components/theme-provider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "#features" },
  { label: "Working", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none pt-4 px-4 sm:px-6 pointer-events-none">
      {/* Floating Capsule Navbar */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.div
          layout
          className={`relative rounded-full border transition-colors duration-300 ${
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

            {/* Center: Desktop Navigation with Animated Pill Indicator */}
            <nav
              onMouseLeave={() => setHoveredNav(null)}
              className="hidden lg:flex items-center gap-1.5 text-sm font-medium relative"
            >
              {NAV_LINKS.map((link) => {
                const isHovered = hoveredNav === link.href;
                const isActive = pathname === link.href;

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setHoveredNav(link.href)}
                  >
                    {/* Smooth Sliding Pill Indicator */}
                    {isHovered && (
                      <motion.div
                        layoutId="navHoverPill"
                        className={`absolute inset-0 rounded-full ${
                          isDark
                            ? "bg-white/10 shadow-[0_0_15px_rgba(139,92,246,0.18)] border border-white/10"
                            : "bg-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/80"
                        }`}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}

                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`relative z-10 px-4 py-2 rounded-full font-medium transition-colors duration-200 block cursor-pointer ${
                        isActive
                          ? isDark
                            ? "text-white font-semibold"
                            : "text-slate-900 font-semibold"
                          : isHovered
                          ? isDark
                            ? "text-white"
                            : "text-slate-900"
                          : isDark
                          ? "text-slate-300 hover:text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </a>
                  </div>
                );
              })}
            </nav>

            {/* Right: Actions & Pill Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Animated Theme Toggle Button */}
              <motion.button
                type="button"
                onClick={(e) => toggleTheme(e)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isDark
                    ? "text-slate-300 hover:text-amber-300 hover:bg-white/10"
                    : "text-slate-600 hover:text-amber-500 hover:bg-slate-100"
                }`}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-amber-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-slate-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Launch Editor Studio Link with Spring Interaction */}
              <Link href="/editor" className="hidden md:inline-flex">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-white/10"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Launch Editor Studio
                </motion.span>
              </Link>

              {/* Get Started Pill Button with Spring Glow */}
              <Link href="/generate" className="shrink-0">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(139,92,246,0.65)" }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-2.5 shadow-[0_0_20px_rgba(139,92,246,0.45)] transition-all cursor-pointer"
                >
                  Get Started
                </motion.button>
              </Link>

              {/* Mobile Menu Toggle */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
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
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Smooth Mobile Dropdown Card */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`lg:hidden mt-2 p-5 rounded-3xl border backdrop-blur-xl shadow-2xl ${
                isDark
                  ? "border-white/10 bg-[#090a0f]/95 text-slate-200"
                  : "border-slate-200 bg-white/95 text-slate-800"
              }`}
            >
              <nav className="flex flex-col space-y-2 text-sm font-medium">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      handleLinkClick(e, link.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                      isDark
                        ? "text-slate-300 hover:text-white hover:bg-white/10"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/editor"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-xl transition-all ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                  onClick={(e) => toggleTheme(e)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
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
                    className="w-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1] text-white font-semibold py-2.5 text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default LandingNavbar;
