"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800/80 bg-[#101114]/80 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded bg-[#356ae6] flex items-center justify-center text-white font-mono text-sm font-bold shadow-sm transition-transform group-hover:scale-105">
            P
          </div>
          <span className="font-semibold text-base tracking-tight text-white">
            Portfolify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/generate"
            className="text-zinc-400 hover:text-white transition-colors font-medium flex items-center gap-1.5"
          >
            <span className="text-blue-400">✨</span>
            <span>AI Builder</span>
          </Link>
          <Link
            href="/import-url"
            className="text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Import URL
          </Link>
          <Link
            href="/templates"
            className="text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Templates
          </Link>
          <a
            href="#features"
            className="text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-zinc-400 hover:text-white transition-colors font-medium"
          >
            How It Works
          </a>
          <Link
            href="/design-system"
            className="text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Design System
          </Link>
        </nav>

        {/* CTA and Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link href="/editor" className="hidden sm:inline-flex">
            <Button variant="brand" size="sm" className="gap-1.5 shadow-sm">
              Build your portfolio <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md text-zinc-400 hover:text-white md:hidden cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#141519] px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3 text-sm">
            <Link
              href="/import-url"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1 flex items-center justify-between"
            >
              <span>Import from Website URL</span>
              <span className="text-xs font-mono text-blue-400">New</span>
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Templates Gallery
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Product Capabilities
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              How It Works
            </a>
            <Link
              href="/design-system"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Design System Showcase
            </Link>
          </nav>
          <div className="pt-2 border-t border-zinc-800">
            <Link href="/editor" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="brand" size="sm" className="w-full justify-center gap-1.5">
                Build your portfolio <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
