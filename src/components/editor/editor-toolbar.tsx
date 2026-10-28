"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  Settings,
  Rocket,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Globe,
  Sparkles,
  History,
  BarChart3,
  ExternalLink,
  Eye,
  Pencil,
  CheckCheck,
} from "lucide-react";
import { TemplateId } from "@/lib/schema/portfolio";
import { getAllTemplates, getTemplate } from "@/templates/registry";
import { SaveStatus } from "./use-portfolio-editor";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface EditorToolbarProps {
  portfolioTitle: string;
  onTitleChange: (title: string) => void;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isPublished: boolean;
  slug: string;
  activeTemplate: TemplateId;
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isDistractionFree: boolean;
  onToggleDistractionFree: () => void;
  onTemplateChange: (tpl: TemplateId) => void;
  onSave: () => void;
  onTogglePublish: () => void;
  onOpenAiAssistant: () => void;
  onOpenUrlImport?: () => void;
  onOpenResumeImport?: () => void;
  onOpenVersionHistory?: () => void;
  onOpenAnalytics?: () => void;
}

export function EditorToolbar({
  portfolioTitle,
  onTitleChange,
  saveStatus,
  lastSavedAt,
  isPublished,
  slug,
  activeTemplate,
  deviceMode,
  onDeviceChange,
  isDistractionFree,
  onToggleDistractionFree,
  onTemplateChange,
  onSave,
  onTogglePublish,
  onOpenAiAssistant,
  onOpenUrlImport,
  onOpenResumeImport,
  onOpenVersionHistory,
  onOpenAnalytics,
}: EditorToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(portfolioTitle || "My Portfolio");
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  const registeredTemplates = getAllTemplates();
  const currentTemplate = getTemplate(activeTemplate);

  const handleTitleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = titleInput.trim();
    if (trimmed) {
      onTitleChange(trimmed);
    } else {
      setTitleInput(portfolioTitle || "My Portfolio");
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#080b12] px-4 sm:px-6 flex items-center justify-between gap-4 z-40 select-none text-xs text-slate-200">
      {/* 1. LEFT: Brand, Portfolio Selector & Saved Badge */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Portfolify Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="h-7 w-7 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-mono text-xs font-bold shadow-sm transition-transform group-hover:scale-105">
            P
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white hidden sm:inline">
            Portfolify
          </span>
        </Link>

        <div className="h-4 w-px bg-slate-800 shrink-0" />

        {/* Portfolio Name / Dropdown */}
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={() => handleTitleSubmit()}
              autoFocus
              className="h-7 px-2.5 rounded-lg bg-[#0c101a] border border-blue-500 text-white text-xs focus:outline-none w-36 sm:w-48 shadow-inner"
            />
            <button
              type="submit"
              className="p-1 text-emerald-400 hover:text-emerald-300"
              title="Save title"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTitleInput(portfolioTitle || "My Portfolio");
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors group cursor-pointer max-w-[140px] sm:max-w-[200px]"
            title="Click to rename portfolio"
          >
            <span className="font-semibold text-xs sm:text-sm truncate">
              {portfolioTitle || "My Portfolio"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 shrink-0" />
          </button>
        )}

        {/* Saved Status Indicator Badge */}
        <div className="flex items-center shrink-0">
          {saveStatus === "saving" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-medium text-blue-400">
              <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-400" />
              <span>Saving...</span>
            </span>
          ) : saveStatus === "unsaved" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-medium text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved</span>
            </span>
          ) : saveStatus === "error" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-medium text-red-400">
              <AlertCircle className="w-2.5 h-2.5 text-red-400" />
              <span>Save error</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Saved</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. CENTER: Template Switcher & Responsive Device Modes */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Template Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsTemplateMenuOpen((prev) => !prev);
              setIsSettingsMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c101a] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer shadow-sm"
            title="Switch Portfolio Template"
            aria-label="Switch template"
            aria-expanded={isTemplateMenuOpen}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold text-white max-w-[130px] sm:max-w-[160px] truncate">
              {currentTemplate?.metadata.name || "Template"}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Template Selection Dropdown Panel */}
          {isTemplateMenuOpen && (
            <>
              {/* Click-away backdrop overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsTemplateMenuOpen(false)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-11 w-72 bg-[#0c101a] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="px-2.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Template ({registeredTemplates.length})
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">100% Data Safe</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                  {registeredTemplates.map((tpl) => {
                    const isSelected = tpl.metadata.id === activeTemplate;
                    return (
                      <button
                        key={tpl.metadata.id}
                        type="button"
                        onClick={() => {
                          onTemplateChange(tpl.metadata.id);
                          setIsTemplateMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate text-white">{tpl.metadata.name}</span>
                            <span className="text-[9px] font-mono uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                              {tpl.metadata.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{tpl.metadata.tagline}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Device Modes Switcher in Pill Container */}
        <div className="flex items-center bg-[#0c101a] p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onDeviceChange("mobile")}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mobile View (375px)"
            aria-label="Mobile preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDeviceChange("tablet")}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              deviceMode === "tablet"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Tablet View (768px)"
            aria-label="Tablet preview"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDeviceChange("desktop")}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-slate-800 text-white shadow-sm font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Desktop View (Full Width)"
            aria-label="Desktop preview"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Desktop</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 3. RIGHT: Settings, Preview, Publish */}
      <div className="flex items-center gap-2.5 shrink-0 relative">
        {/* Settings Button with Dropdown Tools */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSettingsMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl border border-slate-800 bg-[#0c101a] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Studio Settings & Tools"
            aria-label="Studio settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Settings Menu Dropdown */}
          {isSettingsMenuOpen && (
            <div className="absolute right-0 top-12 w-52 bg-[#0c101a] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150 space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsMenuOpen(false);
                  onOpenAiAssistant();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Content Assistant</span>
              </button>

              {onOpenResumeImport && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    onOpenResumeImport();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Import Resume</span>
                </button>
              )}

              {onOpenUrlImport && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    onOpenUrlImport();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Import from URL</span>
                </button>
              )}

              {onOpenVersionHistory && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    onOpenVersionHistory();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Version History</span>
                </button>
              )}

              {onOpenAnalytics && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    onOpenAnalytics();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Analytics</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Preview Button */}
        <button
          type="button"
          onClick={onToggleDistractionFree}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            isDistractionFree
              ? "bg-blue-600 border-blue-500 text-white"
              : "border-slate-800 bg-[#0c101a] hover:bg-slate-800 text-slate-200"
          }`}
          title={isDistractionFree ? "Exit full preview" : "Preview mode"}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        {/* Publish Button */}
        <button
          type="button"
          onClick={onTogglePublish}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{isPublished ? "Unpublish" : "Publish"}</span>
        </button>

        {/* Live site link if published */}
        {isPublished && (
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-white"
            title="Open live site"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </header>
  );
}

export default EditorToolbar;
