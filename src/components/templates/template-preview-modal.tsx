"use client";

import React, { useState } from "react";
import { RegisteredTemplate } from "@/templates/types";
import { PortfolioData } from "@/lib/schema/portfolio";
import { PortfolioRenderer } from "@/templates/renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TemplatePreviewModalProps {
  template: RegisteredTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_DATA: PortfolioData = {
  id: "preview_portfolio",
  userId: "preview_user",
  title: "Preview Portfolio",
  slug: "preview-portfolio",
  published: true,
  publishedAt: "2026-10-25T12:00:00Z",
  profile: {
    fullName: "Morgan Taylor",
    headline: "Principal Systems Engineer & Architect",
    bio: "Specializing in high-throughput cloud runtimes, compiler optimizations, and robust engineering leadership. Passionate about transparent distributed protocols.",
    location: "Seattle, WA",
    email: "morgan.taylor@example.com",
    phone: "",
    avatarUrl: "",
    statusBadge: "Available for Consulting",
  },
  socialLinks: [
    { id: "sl1", platform: "github", label: "GitHub", url: "https://github.com" },
    { id: "sl2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
  ],
  skills: [
    { id: "sk1", name: "Distributed Systems", category: "Backend" },
    { id: "sk2", name: "Rust", category: "Language" },
    { id: "sk3", name: "TypeScript", category: "Language" },
    { id: "sk4", name: "ClickHouse", category: "Data" },
  ],
  projects: [
    {
      id: "pr1",
      title: "QueryFlow Runtime",
      tagline: "Sub-millisecond analytical query engine for log streams.",
      description: "Engineered incremental stream joins handling 250,000 requests/sec with low memory footprint.",
      featured: true,
      technologies: ["Rust", "WASM", "Tokio"],
      liveUrl: "https://github.com",
      repoUrl: "https://github.com",
      coverImageUrl: "",
    },
    {
      id: "pr2",
      title: "TelemetryMesh",
      tagline: "Lightweight decentralized tracing daemon.",
      description: "Implemented custom eBPF probes for zero-overhead kernel network metric capture.",
      featured: false,
      technologies: ["eBPF", "Go", "OTel"],
      liveUrl: "",
      repoUrl: "https://github.com",
      coverImageUrl: "",
    },
  ],
  experience: [
    {
      id: "ex1",
      company: "Stratosphere Cloud",
      role: "Principal Infrastructure Architect",
      location: "Seattle, WA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Overseeing platform reliability, zero-trust authorization, and fleet telemetry.",
      highlights: [
        "Reduced cluster infrastructure spend by 38% through optimized scheduling.",
      ],
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "University of Washington",
      degree: "B.S.",
      fieldOfStudy: "Computer Engineering",
      startDate: "2013",
      endDate: "2017",
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
    { key: "education", label: "Education", visible: true },
  ],
  appearance: {
    templateId: "minimal-portfolio",
    colorScheme: "system",
    accentColor: "neutral",
    fontFamily: "sans",
  },
  createdAt: "2026-10-25T12:00:00Z",
  updatedAt: "2026-10-25T12:00:00Z",
};

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const previewPortfolio: PortfolioData = {
    ...PREVIEW_DATA,
    appearance: {
      ...PREVIEW_DATA.appearance,
      templateId: template.metadata.id,
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
    >
      {/* Top Action Bar */}
      <div className="h-14 border-b border-zinc-800 bg-[#121316] px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="template-preview-title" className="text-sm font-semibold text-white">
                {template.metadata.name}
              </h2>
              <Badge variant="blue" className="text-[10px]">
                {template.metadata.category}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {template.metadata.tagline}
            </p>
          </div>
        </div>

        {/* Center Device Mode Toggles */}
        <div className="flex items-center gap-1 bg-[#18191e] p-0.5 rounded-md border border-zinc-800">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              deviceMode === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Desktop Viewport"
            aria-label="Desktop preview"
          >
            <Laptop className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              deviceMode === "mobile" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Mobile Viewport"
            aria-label="Mobile preview"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right Use Template Action */}
        <div className="flex items-center gap-3">
          <Link href={`/editor?template=${template.metadata.id}`}>
            <Button variant="brand" size="sm" className="gap-1.5">
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Frame Canvas */}
      <div className="flex-1 overflow-auto bg-zinc-950 p-2 sm:p-6 flex items-center justify-center">
        <div
          className={`h-full overflow-y-auto bg-white dark:bg-zinc-950 transition-all duration-200 relative border border-zinc-800 shadow-2xl ${
            deviceMode === "desktop"
              ? "w-full max-w-5xl rounded-lg"
              : "w-[375px] max-w-full rounded-2xl border-4 border-zinc-800"
          }`}
        >
          <PortfolioRenderer portfolio={previewPortfolio} isLivePreview={true} />
        </div>
      </div>
    </div>
  );
}
