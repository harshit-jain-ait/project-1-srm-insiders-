"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  Pencil,
  CheckCheck,
} from "lucide-react";
import { TemplateId } from "@/lib/schema/portfolio";
import { SaveStatus } from "./use-portfolio-editor";
import { getAllTemplates } from "@/templates/registry";

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
}

export function EditorToolbar({
  portfolioTitle,
  onTitleChange,
  saveStatus,
  lastSavedAt,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isPublished,
  slug,
  activeTemplate,
  deviceMode,
  onDeviceChange,
  zoom,
  onZoomChange,
  isDistractionFree,
  onToggleDistractionFree,
  onTemplateChange,
  onSave,
  onTogglePublish,
  onOpenAiAssistant,
}: EditorToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(portfolioTitle);
  const registeredTemplates = getAllTemplates();

  const handleTitleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = titleInput.trim();
    if (trimmed) {
      onTitleChange(trimmed);
    } else {
      setTitleInput(portfolioTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-[#0E1015] px-4 flex items-center justify-between gap-3 z-40 select-none text-xs">
      {/* Left: Navigation, Title & Save Status */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-zinc-400 hover:text-white"
            title="Return to home"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>

        <div className="h-4 w-px bg-zinc-800 shrink-0" />

        {/* Editable Title */}
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={() => handleTitleSubmit()}
              autoFocus
              className="h-7 px-2 rounded bg-zinc-950 border border-blue-600 text-white text-xs focus:outline-none w-36 sm:w-48"
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
              setTitleInput(portfolioTitle);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1.5 text-zinc-200 hover:text-white transition-colors group cursor-pointer max-w-[140px] sm:max-w-[200px]"
            title="Click to rename portfolio"
          >
            <span className="font-medium truncate">{portfolioTitle || "Untitled Portfolio"}</span>
            <Pencil className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 opacity-60 group-hover:opacity-100 shrink-0" />
          </button>
        )}

        {/* Save Status Indicator */}
        <div className="hidden lg:flex items-center">
          {saveStatus === "saving" && (
            <Badge variant="outline" className="text-zinc-400 border-zinc-800 bg-zinc-900/60 gap-1 text-[10px]">
              <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-400" />
              <span>Saving draft...</span>
            </Badge>
          )}

          {saveStatus === "saved" && (
            <Badge variant="outline" className="text-zinc-400 border-zinc-800/80 bg-zinc-900/40 gap-1 text-[10px]">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span>Saved{lastSavedAt ? ` ${lastSavedAt}` : ""}</span>
            </Badge>
          )}

          {saveStatus === "unsaved" && (
            <Badge variant="outline" className="text-amber-400 border-amber-900/40 bg-amber-950/20 gap-1 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved changes</span>
            </Badge>
          )}

          {saveStatus === "error" && (
            <Badge variant="outline" className="text-red-400 border-red-900/50 bg-red-950/30 gap-1 text-[10px]">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>Save failed</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Center: History, Viewport Modes & Zoom */}
      <div className="hidden md:flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-md p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            title="Undo (Cmd+Z)"
            aria-label="Undo edit"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            title="Redo (Cmd+Shift+Z)"
            aria-label="Redo edit"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport switchers */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => onDeviceChange("desktop")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              deviceMode === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Desktop canvas (Full)"
            aria-label="Desktop preview"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange("tablet")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              deviceMode === "tablet" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Tablet canvas (768px)"
            aria-label="Tablet preview"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange("mobile")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              deviceMode === "mobile" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Mobile canvas (375px)"
            aria-label="Mobile preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Selector */}
        <select
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="h-8 rounded-md bg-zinc-900 border border-zinc-800 px-2 text-[11px] font-mono text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          aria-label="Canvas Zoom"
        >
          <option value={1}>100%</option>
          <option value={0.85}>85%</option>
          <option value={0.75}>75%</option>
        </select>

        {/* Distraction-Free Toggle */}
        <button
          type="button"
          onClick={onToggleDistractionFree}
          className={`h-8 w-8 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
            isDistractionFree
              ? "bg-[#356ae6]/20 border-[#356ae6]/60 text-[#356ae6]"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
          }`}
          title={isDistractionFree ? "Exit full preview mode" : "Distraction-free preview"}
          aria-label={isDistractionFree ? "Exit full preview" : "Distraction-free preview"}
        >
          {isDistractionFree ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Template Selector */}
        <select
          value={activeTemplate}
          onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
          className="h-8 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          aria-label="Select Registered Template"
        >
          {registeredTemplates.map((tpl) => (
            <option key={tpl.metadata.id} value={tpl.metadata.id}>
              Template: {tpl.metadata.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAiAssistant}
          className="h-8 gap-1.5 border-zinc-700 text-zinc-200 hover:bg-zinc-900"
          title="Grounded AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">AI Assist</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          isLoading={saveStatus === "saving"}
          className="h-8 text-xs font-medium"
        >
          Save Draft
        </Button>

        <Button
          variant={isPublished ? "outline" : "brand"}
          size="sm"
          onClick={onTogglePublish}
          className="h-8 gap-1.5 text-xs font-semibold"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isPublished ? "Unpublish" : "Publish"}</span>
        </Button>

        {isPublished && (
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex"
            title="View public live site"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white"
              aria-label="Open public portfolio"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        )}
      </div>
    </header>
  );
}
