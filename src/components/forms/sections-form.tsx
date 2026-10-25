"use client";

import React from "react";
import { SectionConfig, reorderSection } from "@/lib/schema/portfolio";
import { Switch } from "@/components/ui/switch";
import { ArrowUp, ArrowDown, Eye, EyeOff, Info } from "lucide-react";

interface SectionsFormProps {
  sections: SectionConfig[];
  onSectionsChange: (sections: SectionConfig[]) => void;
}

export function SectionsForm({ sections, onSectionsChange }: SectionsFormProps) {
  const handleToggle = (key: string) => {
    onSectionsChange(
      sections.map((sec) =>
        sec.key === key ? { ...sec, visible: !sec.visible } : sec
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const updated = reorderSection(sections, index, direction);
    onSectionsChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Section Management & Layout</h3>
        <p className="text-xs text-zinc-400">
          Control section visibility and vertical presentation sequence.
        </p>
      </div>

      <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg flex items-start gap-2.5 text-xs text-blue-200/90 leading-relaxed">
        <Info className="w-4 h-4 text-[#356ae6] shrink-0 mt-0.5" />
        <span>
          <strong>Data Preservation:</strong> Hiding a section omits it from public view while preserving all entered projects, roles, and skills safely in your draft data model.
        </span>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => {
          return (
            <div
              key={section.key}
              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                section.visible
                  ? "bg-zinc-900/70 border-zinc-800"
                  : "bg-zinc-950/40 border-zinc-850/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[11px] font-mono text-zinc-500 w-4 shrink-0">
                  {index + 1}.
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">
                      {section.label}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      [{section.key}]
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {section.visible ? "Visible in template" : "Hidden from layout"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Reorder buttons */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move up"
                    aria-label={`Move ${section.label} up`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move down"
                    aria-label={`Move ${section.label} down`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800">
                  {section.visible ? (
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-zinc-600" />
                  )}
                  <Switch
                    checked={section.visible}
                    onCheckedChange={() => handleToggle(section.key)}
                    aria-label={`Toggle visibility for ${section.label}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
