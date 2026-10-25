import React from "react";
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
} from "lucide-react";
import { TemplateId } from "@/lib/schema/portfolio";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface EditorToolbarProps {
  portfolioTitle: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isPublished: boolean;
  slug: string;
  activeTemplate: TemplateId;
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  onTemplateChange: (tpl: TemplateId) => void;
  onSave: () => void;
  onTogglePublish: () => void;
  onOpenAiAssistant: () => void;
}

export function EditorToolbar({
  portfolioTitle,
  isSaving,
  hasUnsavedChanges,
  isPublished,
  slug,
  activeTemplate,
  deviceMode,
  onDeviceChange,
  onTemplateChange,
  onSave,
  onTogglePublish,
  onOpenAiAssistant,
}: EditorToolbarProps) {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between gap-4 z-40 select-none">
      {/* Left: Navigation and Portfolio Status */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="h-4 w-px bg-zinc-800" />
        <span className="text-sm font-medium text-white truncate max-w-[160px] sm:max-w-[220px]">
          {portfolioTitle || "Untitled Portfolio"}
        </span>
        {hasUnsavedChanges ? (
          <Badge variant="outline" className="text-amber-400 border-amber-900/50 bg-amber-950/20 text-[10px] hidden sm:inline-flex">
            Unsaved changes
          </Badge>
        ) : (
          <Badge variant="outline" className="text-zinc-400 border-zinc-800 text-[10px] hidden sm:inline-flex">
            <Check className="w-2.5 h-2.5 mr-1 text-emerald-400" /> Saved
          </Badge>
        )}
      </div>

      {/* Center: Device Preview Modes & Template Switcher */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => onDeviceChange("desktop")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              deviceMode === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Desktop view"
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
            title="Tablet view"
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
            title="Mobile view"
            aria-label="Mobile preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Template Selector */}
        <select
          value={activeTemplate}
          onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
          className="h-8 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          aria-label="Select Template"
        >
          <option value="minimal-portfolio">Template: Minimal Portfolio</option>
          <option value="developer-pro">Template: Developer Pro</option>
        </select>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAiAssistant}
          className="h-8 gap-1.5 border-zinc-700 text-zinc-200 hover:bg-zinc-900"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          className="h-8"
        >
          Save
        </Button>

        <Button
          variant={isPublished ? "outline" : "brand"}
          size="sm"
          onClick={onTogglePublish}
          className="h-8 gap-1.5"
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
            title="View live portfolio"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        )}
      </div>
    </header>
  );
}
