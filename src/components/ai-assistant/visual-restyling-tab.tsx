"use client";

import React, { useState } from "react";
import { PortfolioData, AppearanceSettings } from "@/lib/schema/portfolio";
import { getAllRestylePresets } from "@/lib/ai-assistant/restyle-presets";
import { RestylePresetId, RestyleResponse, AssistantApiResponse } from "@/lib/ai-assistant/types";
import { PortfolioRenderer } from "@/templates/renderer";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Monitor,
  Smartphone,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface VisualRestylingTabProps {
  portfolio: PortfolioData;
  onApplyAppearance: (newAppearance: AppearanceSettings) => void;
}

export function VisualRestylingTab({
  portfolio,
  onApplyAppearance,
}: VisualRestylingTabProps) {
  const presets = getAllRestylePresets();

  // Active / Proposed Appearance State
  const [proposedAppearance, setProposedAppearance] = useState<AppearanceSettings>(
    portfolio.appearance
  );
  const [selectedPresetId, setSelectedPresetId] = useState<RestylePresetId | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [styleName, setStyleName] = useState<string>("Current Visual Style");
  const [styleExplanation, setStyleExplanation] = useState<string>(
    "Select a design preset or enter a visual description to preview new aesthetics."
  );

  // Preview Device Mode
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Select Preset Directly
  const handleSelectPreset = (presetId: RestylePresetId) => {
    setSelectedPresetId(presetId);
    setErrorMessage(null);

    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    const newAppearance: AppearanceSettings = {
      templateId: preset.templateId,
      fontFamily: preset.fontFamily,
      colorScheme: preset.colorScheme,
      accentColor: preset.accentColor,
      designTokens: preset.designTokens,
    };

    setProposedAppearance(newAppearance);
    setStyleName(preset.name);
    setStyleExplanation(preset.description);
  };

  // 2. Submit Custom Style Prompt to API
  const handleGenerateCustomStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ai/restyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt.trim(),
          currentAppearance: portfolio.appearance,
        }),
      });

      const resData: AssistantApiResponse<RestyleResponse> = await res.json();

      if (!res.ok || !resData.success || !resData.data) {
        setIsLoading(false);
        setErrorMessage(resData.error || "Failed to generate restyling. Please try another description.");
        return;
      }

      setProposedAppearance(resData.data.proposedAppearance);
      setSelectedPresetId(resData.data.presetId || null);
      setStyleName(resData.data.styleName);
      setStyleExplanation(resData.data.explanation);
      setIsLoading(false);
    } catch (err) {
      console.error("[VisualRestyling] API error:", err);
      setIsLoading(false);
      setErrorMessage("Network error generating custom style. Please try again.");
    }
  };

  const handleRevert = () => {
    setProposedAppearance(portfolio.appearance);
    setSelectedPresetId(null);
    setStyleName("Current Visual Style");
    setStyleExplanation("Reverted to current portfolio appearance.");
    setCustomPrompt("");
  };

  const handleApply = () => {
    onApplyAppearance(proposedAppearance);
  };

  // Construct preview portfolio with 100% of user data intact, applying proposed appearance
  const previewPortfolio: PortfolioData = {
    ...portfolio,
    appearance: proposedAppearance,
  };

  const hasChanges = JSON.stringify(portfolio.appearance) !== JSON.stringify(proposedAppearance);

  return (
    <div className="space-y-6 font-sans">
      {/* Visual Direction Presets Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span>Supported Visual Directions</span>
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            Zero content changes &bull; 100% preserved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
          {presets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-900 border-[#356ae6] ring-1 ring-[#356ae6]/50 shadow-sm"
                    : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#356ae6] shrink-0" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.tagline}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                  <span className="capitalize">{preset.fontFamily}</span>
                  <span className="capitalize">{preset.colorScheme}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Natural Language Style Prompt */}
      <form onSubmit={handleGenerateCustomStyle} className="space-y-2">
        <label htmlFor="custom-style-prompt" className="text-xs font-medium text-zinc-400">
          Or Describe Your Desired Aesthetic
        </label>
        <div className="flex items-center gap-2">
          <input
            id="custom-style-prompt"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Minimalist Swiss architecture poster with clean dark mode and monospace accents..."
            className="flex-1 h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={isLoading || !customPrompt.trim()}
            className="h-9 gap-1.5 border-zinc-700 text-xs shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>Generate Style</span>
          </Button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-red-900/50 bg-red-950/20 text-red-200 text-xs flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Comparison & Active Status Bar */}
      <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{styleName}</span>
            {hasChanges && (
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                Previewing Changes
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{styleExplanation}</p>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setPreviewDevice("desktop")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              previewDevice === "desktop"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("mobile")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              previewDevice === "mobile"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Template Preview */}
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl">
        <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="text-[11px] font-mono text-zinc-400 ml-2">
              Live Preview &bull; {proposedAppearance.templateId} &bull; {proposedAppearance.fontFamily}
            </span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500">
            Real Template Engine Output
          </span>
        </div>

        <div
          className={`mx-auto transition-all duration-300 overflow-y-auto max-h-[460px] ${
            previewDevice === "mobile" ? "max-w-[390px] border-x border-zinc-800" : "w-full"
          }`}
          style={{
            backgroundColor:
              proposedAppearance.designTokens?.backgroundColor ||
              (proposedAppearance.colorScheme === "dark" ? "#0A0B0E" : "#fafaf9"),
          }}
        >
          <PortfolioRenderer
            key={`${proposedAppearance.templateId}-${proposedAppearance.colorScheme}-${proposedAppearance.fontFamily}-${proposedAppearance.accentColor}-${proposedAppearance.designTokens?.backgroundColor || ""}-${proposedAppearance.designTokens?.accentHex || ""}`}
            portfolio={previewPortfolio}
            isLivePreview={true}
          />
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRevert}
          disabled={!hasChanges}
          className="gap-1.5 text-xs text-zinc-300 border-zinc-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert to Current</span>
        </Button>

        <Button
          variant="brand"
          size="sm"
          onClick={handleApply}
          className="gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
        >
          <span>{hasChanges ? "Use This Style & Apply to Studio" : "Apply Current Style to Studio"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
