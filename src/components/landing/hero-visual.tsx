"use client";

import React, { useState } from "react";
import { PortfolioData, createEmptyPortfolio, TemplateId } from "@/lib/schema/portfolio";
import { PortfolioRenderer } from "@/templates/renderer";
import { Button } from "@/components/ui/button";
import { Laptop, Smartphone } from "lucide-react";
import Link from "next/link";

const DEMO_PREVIEW_PORTFOLIO: PortfolioData = createEmptyPortfolio({
  id: "hero_demo_portfolio",
  userId: "demo",
  title: "Engineering Portfolio",
  slug: "demo-showcase",
  published: true,
  publishedAt: "2026-10-25T12:00:00Z",
  profile: {
    fullName: "Alex Rivera",
    headline: "Staff Cloud Systems Architect",
    bio: "Over 8 years designing fault-tolerant distributed backends and low-latency API pipelines. Dedicated to predictable latency and simple operational models.",
    location: "San Francisco, CA",
    email: "alex.rivera@example.com",
    phone: "",
    avatarUrl: "",
    statusBadge: "Available for Q1 Advisory",
  },
  socialLinks: [
    { id: "1", platform: "github", label: "GitHub", url: "https://github.com" },
    { id: "2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
  ],
  skills: [
    { id: "s1", name: "Distributed Systems", category: "Backend" },
    { id: "s2", name: "Rust", category: "Language" },
    { id: "s3", name: "Go", category: "Language" },
    { id: "s4", name: "Kubernetes", category: "Infra" },
  ],
  projects: [
    {
      id: "p1",
      title: "StreamScale Engine",
      tagline: "Sub-second event streaming pipeline handling 100k events/sec.",
      description: "Re-architected real-time ingestion pipeline using incremental materialized views.",
      featured: true,
      technologies: ["Rust", "ClickHouse", "Kafka"],
      liveUrl: "https://github.com",
      repoUrl: "https://github.com",
      coverImageUrl: "",
    },
  ],
  experience: [
    {
      id: "e1",
      company: "Apex Cloud Infrastructure",
      role: "Lead Systems Architect",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Directing multi-region database migration and edge caching strategy.",
      highlights: ["P99 latency decreased from 450ms to 42ms."],
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "UC Berkeley",
      degree: "B.S.",
      fieldOfStudy: "Computer Science",
      startDate: "2014",
      endDate: "2018",
      description: "",
    },
  ],
  certifications: [],
  customSections: [],
  sections: [
    { key: "profile", label: "Profile", visible: true },
    { key: "projects", label: "Projects", visible: true },
    { key: "experience", label: "Experience", visible: true },
    { key: "skills", label: "Skills", visible: true },
  ],
  appearance: {
    templateId: "developer-pro",
    colorScheme: "dark",
    accentColor: "neutral",
    fontFamily: "sans",
  },
  createdAt: "2026-10-25T12:00:00Z",
  updatedAt: "2026-10-25T12:00:00Z",
});

export function HeroVisual() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("developer-pro");
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");

  const portfolioWithTemplate: PortfolioData = {
    ...DEMO_PREVIEW_PORTFOLIO,
    appearance: {
      ...DEMO_PREVIEW_PORTFOLIO.appearance,
      templateId: selectedTemplate,
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border border-zinc-800 bg-[#121316] shadow-2xl overflow-hidden text-left">
      {/* Studio Top Bar */}
      <div className="h-11 border-b border-zinc-800 bg-[#17181c] px-4 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="text-zinc-500 font-mono text-[11px] ml-2 hidden sm:inline">
            portfolify.dev/editor
          </span>
        </div>

        {/* Live Template Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#101114] p-0.5 rounded-md border border-zinc-800">
          <button
            type="button"
            onClick={() => setSelectedTemplate("developer-pro")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              selectedTemplate === "developer-pro"
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Developer Pro
          </button>
          <button
            type="button"
            onClick={() => setSelectedTemplate("minimal-portfolio")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              selectedTemplate === "minimal-portfolio"
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Minimal Portfolio
          </button>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#101114] p-0.5 rounded border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`p-1 rounded text-xs cursor-pointer ${
                viewportMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Desktop View"
              aria-label="Desktop preview"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`p-1 rounded text-xs cursor-pointer ${
                viewportMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Mobile View"
              aria-label="Mobile preview"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
          <Link href="/editor">
            <Button variant="brand" size="sm" className="h-7 text-xs px-2.5">
              Launch Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* Frame Canvas */}
      <div className="h-[480px] sm:h-[540px] bg-zinc-950 flex items-center justify-center p-0 md:p-4 overflow-hidden relative">
        <div
          className={`h-full overflow-y-auto transition-all duration-300 relative border border-zinc-800/80 bg-zinc-950 shadow-inner ${
            viewportMode === "desktop" ? "w-full rounded-md" : "w-[360px] max-w-full rounded-2xl my-2 border-2"
          }`}
        >
          <PortfolioRenderer portfolio={portfolioWithTemplate} isLivePreview={true} />
        </div>
      </div>

      {/* Frame Status Sub-Bar */}
      <div className="px-4 py-2.5 bg-[#141519] border-t border-zinc-850 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Real-time Canonical Synchronization Active</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Grounded Extraction</span>
          <span>Zero Hallucinations</span>
        </div>
      </div>
    </div>
  );
}
