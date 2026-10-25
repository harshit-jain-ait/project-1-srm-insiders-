"use client";

import React, { useState } from "react";
import { PortfolioData, AppearanceSettings } from "@/lib/schema/portfolio";
import { ContentTargetField } from "@/lib/ai-assistant/types";
import { ContentAssistantTab } from "./content-assistant-tab";
import { VisualRestylingTab } from "./visual-restyling-tab";
import { AiGeneratorWizard } from "@/components/ai/ai-generator-wizard";
import { X, Sparkles, Palette, FileText } from "lucide-react";

export type AssistantModalTab = "content" | "restyle" | "generate";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  initialTab?: AssistantModalTab;
  initialTargetField?: ContentTargetField;
  initialSourceText?: string;
  initialTargetId?: string;
  onApplyContentChange: (newText: string, targetField: ContentTargetField, targetId?: string) => void;
  onApplyAppearanceChange: (newAppearance: AppearanceSettings) => void;
  onApplyFullGeneration?: (generated: Partial<PortfolioData>) => void;
}

export function AiAssistantModal({
  isOpen,
  onClose,
  portfolio,
  initialTab = "content",
  initialTargetField = "bio",
  initialSourceText,
  initialTargetId,
  onApplyContentChange,
  onApplyAppearanceChange,
  onApplyFullGeneration,
}: AiAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<AssistantModalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-4xl my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Window Container */}
        <div className="bg-[#0E1015] border border-zinc-800 rounded-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl space-y-6">
          {/* Header Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#356ae6]" />
                Portfolify AI Studio Assistant
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Improve wording with verified facts, or restyle your visual theme with registered templates.
              </p>
            </div>

            {/* Tab Navigation Switcher */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "content"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Improve Content</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("restyle")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "restyle"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Visual Restyle</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("generate")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "generate"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Notes</span>
              </button>
            </div>
          </div>

          {/* TAB 1: CONTENT INTELLIGENCE */}
          {activeTab === "content" && (
            <ContentAssistantTab
              portfolio={portfolio}
              initialTargetField={initialTargetField}
              initialSourceText={initialSourceText}
              initialTargetId={initialTargetId}
              onApplyChange={(newText, field, targetId) => {
                onApplyContentChange(newText, field, targetId);
                onClose();
              }}
            />
          )}

          {/* TAB 2: VISUAL RESTYLING */}
          {activeTab === "restyle" && (
            <VisualRestylingTab
              portfolio={portfolio}
              onApplyAppearance={(newAppearance) => {
                onApplyAppearanceChange(newAppearance);
                onClose();
              }}
            />
          )}

          {/* TAB 3: GENERATE FROM RAW NOTES */}
          {activeTab === "generate" && (
            <div className="pt-2">
              <AiGeneratorWizard
                onApplyToExisting={(suggestions) => {
                  onApplyFullGeneration?.(suggestions);
                  onClose();
                }}
                onCloseModal={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
