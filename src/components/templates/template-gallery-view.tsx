"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getAllTemplates } from "@/templates/registry";
import { RegisteredTemplate } from "@/templates/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { TemplatePreviewModal } from "./template-preview-modal";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Check,
  SlidersHorizontal,
} from "lucide-react";

interface TemplateGalleryViewProps {
  initialTemplates?: RegisteredTemplate[];
}

export function TemplateGalleryView({ initialTemplates }: TemplateGalleryViewProps) {
  const templates = useMemo(() => initialTemplates || getAllTemplates(), [initialTemplates]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc">("name-asc");
  const [previewTemplate, setPreviewTemplate] = useState<RegisteredTemplate | null>(null);

  // Dynamically extract unique categories from registered templates
  const categories = useMemo(() => {
    const cats = new Set<string>();
    templates.forEach((t) => {
      if (t.metadata.category) cats.add(t.metadata.category);
    });
    return ["All", ...Array.from(cats)];
  }, [templates]);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return templates
      .filter((tpl) => {
        // Category filter
        if (selectedCategory !== "All" && tpl.metadata.category !== selectedCategory) {
          return false;
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
    setSelectedCategory("All");
    setSortBy("name-asc");
  };

  return (
    <div className="min-h-screen bg-[#101114] text-[#F7F7F5] selection:bg-blue-600/30 selection:text-white font-sans">
      {/* Top Header */}
      <header className="border-b border-[#303238] bg-[#191B20]/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolify
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/editor">
              <Button variant="brand" size="sm" className="gap-1.5 shadow-sm text-xs">
                Open Studio Editor <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
        {/* Gallery Title & Intro */}
        <div className="max-w-2xl space-y-3">
          <Badge variant="blue" className="text-xs">
            Verified Template Registry
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Find your portfolio style
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every Portfolify design is built to consume the same canonical data model. Choose your aesthetic now—switch anytime without retyping your career history.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4">
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
              <div className="w-44">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name-asc" | "name-desc")}
                  aria-label="Sort templates"
                >
                  <option value="name-asc">Sort: Name (A–Z)</option>
                  <option value="name-desc">Sort: Name (Z–A)</option>
                </Select>
              </div>

              {(searchQuery || selectedCategory !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Reset filters
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter Pills & Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer select-none ${
                    selectedCategory === cat
                      ? "bg-[#356ae6] text-white shadow-sm"
                      : "bg-[#101114] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                  }`}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Showing {filteredTemplates.length} of {templates.length} templates
            </span>
          </div>
        </div>

        {/* Template Cards Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.metadata.id}
                className="rounded-xl border border-[#303238] bg-[#191B20]/50 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all duration-200 group shadow-sm"
              >
                {/* Card Header & Content */}
                <div className="p-6 pb-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                      {tpl.metadata.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      ID: {tpl.metadata.id}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {tpl.metadata.name}
                    </h2>
                    <p className="text-xs text-zinc-400 font-light mt-1">
                      {tpl.metadata.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {tpl.metadata.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tpl.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-zinc-400 bg-[#101114] border border-zinc-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Key Characteristics */}
                  <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                      Key Highlights
                    </p>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {tpl.metadata.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 bg-[#141519] border-t border-[#303238] flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate(tpl)}
                    className="gap-1.5 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Live Preview</span>
                  </Button>

                  <Link href={`/editor?template=${tpl.metadata.id}`}>
                    <Button variant="brand" size="sm" className="gap-1.5 text-xs shadow-sm">
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
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
      </main>

      {/* Interactive Live Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}
