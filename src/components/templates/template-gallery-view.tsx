/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getAllTemplates } from "@/templates/registry";
import { RegisteredTemplate } from "@/templates/types";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { TemplatePreviewModal } from "./template-preview-modal";
import { HoverExpandTemplateGallery } from "./hover-expand-template-gallery";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Check,
  SlidersHorizontal,
  Layers,
  Smartphone,
  Sparkles,
} from "lucide-react";

interface TemplateGalleryViewProps {
  initialTemplates?: RegisteredTemplate[];
}

export function TemplateGalleryView({ initialTemplates }: TemplateGalleryViewProps) {
  const templates = useMemo(() => initialTemplates || getAllTemplates(), [initialTemplates]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Templates");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc">("name-asc");
  const [previewTemplate, setPreviewTemplate] = useState<RegisteredTemplate | null>(null);

  // Standard category tabs matching Part 21 design reference
  const categoryFilters = [
    "All Templates",
    "Personal",
    "Creative",
    "Business",
    "Technology",
    "Design",
    "Editorial",
    "Engineering",
  ];

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return templates
      .filter((tpl) => {
        // Category filter matching
        if (selectedCategory !== "All Templates" && selectedCategory !== "All") {
          const cat = tpl.metadata.category.toLowerCase();
          const tags = tpl.metadata.tags.map((t) => t.toLowerCase());
          const sel = selectedCategory.toLowerCase();

          const matchesCat = cat.includes(sel);
          const matchesTags = tags.some((t) => t.includes(sel));
          const matchesMeta =
            (sel === "personal" && (cat === "editorial" || tags.includes("clean") || tags.includes("typography"))) ||
            (sel === "technology" && (cat === "engineering" || tags.includes("terminal") || tags.includes("systems"))) ||
            (sel === "business" && (cat === "executive" || tags.includes("leadership") || tags.includes("architecture"))) ||
            (sel === "design" && (cat === "creative" || tags.includes("editorial") || tags.includes("showcase")));

          if (!matchesCat && !matchesTags && !matchesMeta) {
            return false;
          }
        }

        // Search query matching
        if (!query) return true;

        const matchesName = tpl.metadata.name.toLowerCase().includes(query);
        const matchesDesc = tpl.metadata.description.toLowerCase().includes(query);
        const matchesTagline = tpl.metadata.tagline.toLowerCase().includes(query);
        const matchesTags = tpl.metadata.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesFeatures = tpl.metadata.features.some((feat) => feat.toLowerCase().includes(query));

        return matchesName || matchesDesc || matchesTagline || matchesTags || matchesFeatures;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.metadata.name.localeCompare(b.metadata.name);
        } else {
          return b.metadata.name.localeCompare(a.metadata.name);
        }
      });
  }, [templates, searchQuery, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Templates");
    setSortBy("name-asc");
  };

  return (
    <div className="min-h-screen bg-[#101114] text-[#F7F7F5] selection:bg-blue-600/30 selection:text-white font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-[#303238] bg-[#191B20]/80 backdrop-blur-md sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolify
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/editor">
              <Button variant="brand" size="sm" className="gap-1.5 shadow-sm text-xs font-semibold cursor-pointer">
                <span>Studio Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
        {/* 1. Hero Title & 3D Card Fan Section */}
        <div className="relative rounded-3xl border border-[#303238] bg-gradient-to-br from-[#16171b] via-[#121316] to-[#0d0e11] p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/40 text-xs font-medium text-blue-400 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ TEMPLATES</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Choose a template that fits{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">
                  your style
                </span>
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base max-w-xl font-light leading-relaxed">
                Start with a professionally designed template and make it your own. No coding required — just your creativity and verified experience.
              </p>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-zinc-400">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.06]">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>8+ Verified Templates</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.06]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Fully Customizable</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.06]">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mobile Responsive</span>
                </div>
              </div>
            </div>

            {/* Right Decorative 3D-Tilted Card Fan */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative perspective-1000 select-none pointer-events-none">
              <div className="relative w-80 h-64 flex items-center justify-center">
                {/* Back card 1 */}
                <div className="absolute w-48 h-60 rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl transform -rotate-12 -translate-x-14 translate-y-3 overflow-hidden opacity-60">
                  <img
                    src="/images/templates/developer-pro.svg"
                    alt="Developer Pro Preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Back card 2 */}
                <div className="absolute w-48 h-60 rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl transform rotate-12 translate-x-14 translate-y-3 overflow-hidden opacity-60">
                  <img
                    src="/images/templates/creative-motion.svg"
                    alt="Creative Motion Preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Center front card */}
                <div className="absolute w-52 h-64 rounded-2xl border border-blue-500/50 bg-[#08080a] shadow-2xl transform hover:scale-105 transition-transform overflow-hidden z-20 ring-1 ring-blue-500/20">
                  <img
                    src="/images/templates/bento-studio.svg"
                    alt="Bento Studio Featured Preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-between text-[11px] text-white font-semibold">
                    <span>Bento Studio</span>
                    <span className="text-blue-400 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/40">New</span>
                  </div>
                </div>
              </div>

              {/* Hand-drawn style decorative cue */}
              <div className="absolute -top-4 right-2 text-right">
                <span className="font-serif italic text-xs text-blue-300 block transform rotate-6">
                  Explore Templates ↗
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Skiper 52 Interactive Hover-Expand Spotlight Gallery */}
        <section aria-label="Template Spotlight">
          <HoverExpandTemplateGallery
            templates={templates}
            onPreview={(t) => setPreviewTemplate(t)}
          />
        </section>

        {/* 3. Search and Category Filter Bar */}
        <div id="all-templates" className="p-4 sm:p-5 rounded-2xl border border-[#303238] bg-[#141519]/70 backdrop-blur space-y-4 shadow-sm scroll-mt-24">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search templates by role, style, or stack..."
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-48">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name-asc" | "name-desc")}
                  aria-label="Sort templates"
                >
                  <option value="name-asc">Sort: Name (A–Z)</option>
                  <option value="name-desc">Sort: Name (Z–A)</option>
                </Select>
              </div>

              {(searchQuery || (selectedCategory !== "All Templates" && selectedCategory !== "All")) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Reset filters
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter Pills & Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter templates by category">
              {categoryFilters.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-[#356ae6] text-white shadow-sm font-semibold"
                        : "bg-[#101114] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Showing {filteredTemplates.length} of {templates.length} templates
            </span>
          </div>
        </div>

        {/* 4. Complete Template Cards Grid (with realistic preview cards) */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((tpl) => {
              const meta = tpl.metadata;
              const previewSrc = meta.previewImageUrl || `/images/templates/${meta.id}.svg`;

              return (
                <div
                  key={meta.id}
                  className="rounded-2xl border border-[#303238] bg-[#141519]/70 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group shadow-sm relative"
                >
                  <div>
                    {/* Realistic Preview Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 border-b border-[#303238] group/thumb">
                      <img
                        src={previewSrc}
                        alt={`${meta.name} template preview`}
                        className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {/* Badge in top corner */}
                      {meta.id === "bento-studio" ? (
                        <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-md">
                          New
                        </span>
                      ) : meta.isPremium ? (
                        <span className="absolute top-3 left-3 text-[10px] font-mono font-medium tracking-wider px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/40 text-amber-300 shadow-md">
                          Pro
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 text-[10px] font-mono font-medium tracking-wider px-2 py-0.5 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-300 shadow-md">
                          Free
                        </span>
                      )}
                    </div>

                    {/* Card Body & Info */}
                    <div className="p-5 sm:p-6 space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                          {meta.category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          ID: {meta.id}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {meta.name}
                        </h2>
                        <p className="text-xs text-zinc-400 font-light mt-1">
                          {meta.tagline}
                        </p>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-3">
                        {meta.description}
                      </p>

                      {/* Tag Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {meta.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-zinc-400 bg-[#101114] border border-zinc-800 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Key Highlights Checklist */}
                      <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
                          Key Highlights
                        </p>
                        <ul className="space-y-1.5 text-xs text-zinc-400">
                          {meta.features.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span className="text-xs line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Dual Card Actions */}
                  <div className="p-4 sm:p-5 bg-[#121316] border-t border-[#303238] flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="flex-1 gap-1.5 text-xs h-9 border-zinc-700 hover:bg-zinc-800 text-zinc-200 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Preview</span>
                    </Button>

                    <Link href={`/editor?template=${meta.id}`} className="flex-1">
                      <Button
                        variant="brand"
                        size="sm"
                        className="w-full gap-1.5 text-xs h-9 font-semibold cursor-pointer shadow-md shadow-blue-600/20"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={SlidersHorizontal}
            title="No templates match your filters"
            description={`No registered templates found matching "${searchQuery || selectedCategory}". Reset filters to see all available templates.`}
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        )}

        {/* 5. Bottom Conversion Banner */}
        <section className="rounded-3xl border border-[#303238] bg-gradient-to-r from-blue-950/40 via-[#141519] to-zinc-950/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-left max-w-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Ready to build your portfolio?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Choose a template, customize it in real time, and bring your work to life in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/generate">
              <Button variant="brand" size="sm" className="gap-2 shadow-md shadow-blue-600/20 font-semibold cursor-pointer h-10 px-5 text-xs">
                <span>Create Your Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <a href="#all-templates">
              <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800 text-zinc-200 cursor-pointer h-10 px-4 text-xs">
                Explore All Templates
              </Button>
            </a>
          </div>
        </section>
      </main>

      {/* 6. Interactive Live Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}

export default TemplateGalleryView;
