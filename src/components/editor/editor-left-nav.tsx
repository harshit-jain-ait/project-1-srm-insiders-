"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Folder,
  User,
  Briefcase,
  GraduationCap,
  Link2,
  Image as ImageIcon,
  LayoutTemplate,
  ChevronDown,
} from "lucide-react";

export type LeftNavSection =
  | "templates"
  | "about"
  | "experience"
  | "education"
  | "projects"
  | "social"
  | "assets_images";

interface EditorLeftNavProps {
  activeSection: LeftNavSection;
  onSelectSection: (section: LeftNavSection) => void;
  templateName?: string;
  className?: string;
}

export function EditorLeftNav({
  activeSection,
  onSelectSection,
  templateName = "Kinetic Studio",
  className = "",
}: EditorLeftNavProps) {
  const mainNavItems: { id: LeftNavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "about", label: "About", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "social", label: "Social Links", icon: Link2 },
  ];

  const assetItems: { id: LeftNavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "assets_images", label: "Images", icon: ImageIcon },
  ];

  return (
    <aside
      className={`w-52 lg:w-56 bg-[#080b12] border-r border-slate-800/80 flex flex-col justify-between h-full select-none shrink-0 overflow-y-auto text-xs text-slate-300 ${className}`}
    >
      <div className="p-3.5 space-y-4">
        {/* Back to templates link */}
        <Link
          href="/templates"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group font-medium text-[11px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Templates</span>
        </Link>

        {/* Template Header with Live Badge */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onSelectSection("templates")}
            className="flex items-center gap-1.5 hover:text-blue-400 transition-colors text-left group min-w-0"
            title="Switch template"
          >
            <h2 className="text-sm font-bold text-white group-hover:text-blue-400 tracking-tight transition-colors truncate">
              {templateName}
            </h2>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
          </button>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Live</span>
          </span>
        </div>

        {/* Main Navigation List */}
        <nav className="space-y-0.5 pt-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[#13233d] border border-blue-500/40 text-blue-400 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Assets Section */}
        <div className="pt-2 border-t border-slate-850/80 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
            Assets
          </span>
          {assetItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[#13233d] border border-blue-500/40 text-blue-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default EditorLeftNav;
