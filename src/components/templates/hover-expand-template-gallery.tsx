/**
 * HoverExpandTemplateGallery — Interactive Spotlight Gallery for Portfolify
 * Adapted from Skiper 52 HoverExpand_001 using React + Framer Motion
 *
 * Enhancements:
 * - Direct integration with Portfolify's canonical template registry
 * - Desktop hover-expand & mobile tap-to-expand layout orchestration
 * - Dual explicit actions: "Live Preview" (opens modal) & "Use Template" (navigates to editor)
 * - Safe state management: hover expands visual focus only; selection requires explicit user action
 * - High-accessibility: keyboard navigation (ArrowLeft, ArrowRight, Enter, Space), visible focus rings
 * - Framer Motion with reduced-motion preference awareness
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RegisteredTemplate } from "@/templates/types";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoverExpandTemplateGalleryProps {
  templates: RegisteredTemplate[];
  onPreview: (template: RegisteredTemplate) => void;
  className?: string;
}

export function HoverExpandTemplateGallery({
  templates,
  onPreview,
  className,
}: HoverExpandTemplateGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  if (!templates || templates.length === 0) {
    return null;
  }

  // Derive safe index within range
  const safeIndex = activeIndex < templates.length ? activeIndex : 0;

  // Handle keyboard navigation across spotlight panels
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % templates.length;
      setActiveIndex(nextIndex);
      const nextEl = document.getElementById(`spotlight-panel-${templates[nextIndex].metadata.id}`);
      nextEl?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + templates.length) % templates.length;
      setActiveIndex(prevIndex);
      const prevEl = document.getElementById(`spotlight-panel-${templates[prevIndex].metadata.id}`);
      prevEl?.focus();
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header bar for the Spotlight Section */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
            Interactive Template Spotlight
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          Hover to expand • Click to select
        </span>
      </div>

      {/* Main Expandable Panels Container */}
      <div className="relative w-full rounded-2xl border border-[#303238] bg-[#121316]/70 p-3 sm:p-4 backdrop-blur-md overflow-hidden shadow-2xl">
        <div
          className="flex w-full items-center justify-start sm:justify-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none"
          role="region"
          aria-label="Interactive template gallery spotlight"
        >
          {templates.map((template, index) => {
            const isActive = safeIndex === index;
            const meta = template.metadata;
            const previewSrc = meta.previewImageUrl || `/images/templates/${meta.id}.svg`;

            return (
              <motion.div
                id={`spotlight-panel-${meta.id}`}
                key={meta.id}
                tabIndex={0}
                role="button"
                aria-label={`${meta.name} template spotlight panel`}
                aria-expanded={isActive}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => setActiveIndex(index)}
                onHoverStart={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setActiveIndex(index);
                  }
                }}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl border transition-colors shrink-0 select-none outline-none group",
                  isActive
                    ? "border-blue-500/70 shadow-lg shadow-blue-500/15"
                    : "border-white/[0.08] hover:border-white/20 bg-zinc-950/80",
                  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                )}
                initial={false}
                animate={{
                  width: isActive
                    ? typeof window !== "undefined" && window.innerWidth < 640
                      ? "18rem"
                      : "23rem"
                    : "4.75rem",
                  height: "22rem",
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Background Template Graphic */}
                <div className="absolute inset-0 w-full h-full bg-zinc-950">
                  <img
                    src={previewSrc}
                    alt={`${meta.name} design preview`}
                    className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback visual if preview fails
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />
                  {/* Subtle placeholder pattern if image is missing */}
                  <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-black text-center">
                    <Layers className="w-8 h-8 text-zinc-700 mb-2" />
                    <span className="text-xs font-semibold text-zinc-400">{meta.name}</span>
                  </div>
                </div>

                {/* Dark Vignette Overlay for Readability */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/75 to-transparent z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Collapsed State Spine Label (Visible when inactive on desktop) */}
                {!isActive && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-6 px-2 bg-black/40 group-hover:bg-black/20 transition-colors">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold writing-mode-vertical rotate-180">
                      {meta.category}
                    </span>
                    <span className="text-xs font-bold text-white/90 writing-mode-vertical rotate-180 truncate max-h-32">
                      {meta.name}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-blue-500/80" />
                  </div>
                )}

                {/* Expanded Details & Actions Panel */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25, delay: 0.05 }}
                      className="absolute inset-0 z-20 flex flex-col justify-between p-5 text-left"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/40 text-blue-400 font-semibold">
                            {meta.category}
                          </span>
                          {meta.isPremium && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 font-medium">
                              PRO
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          ID: {meta.id}
                        </span>
                      </div>

                      {/* Bottom Info & Action Buttons */}
                      <div className="space-y-3 pt-6">
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                            {meta.name}
                          </h3>
                          <p className="text-xs text-zinc-300 font-light line-clamp-2 mt-1">
                            {meta.description}
                          </p>
                        </div>

                        {/* Tag Pills */}
                        <div className="flex flex-wrap gap-1">
                          {meta.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/90 border border-white/[0.08] text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Dual Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreview(template);
                            }}
                            className="flex-1 text-xs h-8 border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 cursor-pointer shadow-sm gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Preview</span>
                          </Button>

                          <Link
                            href={`/editor?template=${meta.id}`}
                            className="flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              type="button"
                              variant="brand"
                              size="sm"
                              className="w-full text-xs h-8 gap-1.5 font-semibold cursor-pointer shadow-md shadow-blue-600/20"
                            >
                              <span>Select</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HoverExpandTemplateGallery;
