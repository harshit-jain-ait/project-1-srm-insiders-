"use client";

import React from "react";
import { AppearanceSettings, TemplateId } from "@/lib/schema/portfolio";
import { getAllTemplates } from "@/templates/registry";
import { Select } from "@/components/ui/select";
import { FormLabel, FormHelperText } from "@/components/ui/form-field";
import { Check } from "lucide-react";

interface AppearanceFormProps {
  appearance: AppearanceSettings;
  onAppearanceChange: (appearance: AppearanceSettings) => void;
}

export function AppearanceForm({
  appearance,
  onAppearanceChange,
}: AppearanceFormProps) {
  const registeredTemplates = getAllTemplates();

  const handleTemplateSelect = (templateId: TemplateId) => {
    onAppearanceChange({
      ...appearance,
      templateId,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Appearance & Theme</h3>
        <p className="text-xs text-zinc-400">
          Switch portfolio templates and typographic presentation settings.
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <FormLabel>Selected Template</FormLabel>
        <div className="grid grid-cols-1 gap-2.5">
          {registeredTemplates.map((tpl) => {
            const isSelected = appearance.templateId === tpl.metadata.id;
            return (
              <button
                key={tpl.metadata.id}
                type="button"
                onClick={() => handleTemplateSelect(tpl.metadata.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? "bg-zinc-900 border-[#356ae6] ring-1 ring-[#356ae6]/50 shadow-sm"
                    : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {tpl.metadata.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#356ae6] bg-[#356ae6]/10 px-1.5 py-0.2 rounded">
                      {tpl.metadata.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    {tpl.metadata.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="h-5 w-5 rounded-full bg-[#356ae6] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <FormHelperText>
          Templates consume the identical canonical portfolio model with zero data re-entry.
        </FormHelperText>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <FormLabel htmlFor="appearance-font">Typography Pairing</FormLabel>
        <Select
          id="appearance-font"
          value={appearance.fontFamily}
          onChange={(e) =>
            onAppearanceChange({
              ...appearance,
              fontFamily: e.target.value as "sans" | "serif" | "mono",
            })
          }
          options={[
            { value: "sans", label: "Modern Sans-Serif (Clean, contemporary)" },
            { value: "serif", label: "Editorial Serif (Literary, understated)" },
            { value: "mono", label: "Technical Monospace (Terminal, dense)" },
          ]}
          className="h-9 text-xs bg-zinc-950"
        />
      </div>

      {/* Accent Palette */}
      <div className="space-y-2">
        <FormLabel htmlFor="appearance-accent">Accent Color</FormLabel>
        <Select
          id="appearance-accent"
          value={appearance.accentColor}
          onChange={(e) =>
            onAppearanceChange({
              ...appearance,
              accentColor: e.target.value as "blue" | "neutral" | "slate",
            })
          }
          options={[
            { value: "neutral", label: "Neutral Monochrome (Zinc & Graphite)" },
            { value: "blue", label: "Restrained Blue (#356AE6)" },
            { value: "slate", label: "Slate Blue (Technical Subtle)" },
          ]}
          className="h-9 text-xs bg-zinc-950"
        />
        <FormHelperText>
          Adheres strictly to the restrained design tokens (zero purple/neon).
        </FormHelperText>
      </div>
    </div>
  );
}
