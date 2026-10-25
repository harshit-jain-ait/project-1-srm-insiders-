"use client";

import React, { useState } from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import {
  ContentOperation,
  AssistantTone,
  ContentTargetField,
  ContentAssistResponse,
  AssistantApiResponse,
} from "@/lib/ai-assistant/types";
import { computeContentHash } from "@/lib/ai-assistant/assistant-service";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Check,
  Copy,
  RotateCcw,
  AlertTriangle,
  Loader2,
  HelpCircle,
  Pencil,
  ArrowRight,
} from "lucide-react";

interface ContentAssistantTabProps {
  portfolio: PortfolioData;
  initialTargetField?: ContentTargetField;
  initialSourceText?: string;
  initialTargetId?: string; // e.g. project ID or experience ID
  onApplyChange: (newText: string, targetField: ContentTargetField, targetId?: string) => void;
}

export function ContentAssistantTab({
  portfolio,
  initialTargetField = "bio",
  initialSourceText,
  initialTargetId,
  onApplyChange,
}: ContentAssistantTabProps) {
  const [targetField, setTargetField] = useState<ContentTargetField>(initialTargetField);
  const [targetId, setTargetId] = useState<string>(initialTargetId || "");
  const [operation, setOperation] = useState<ContentOperation>("improve_clarity");
  const [tone, setTone] = useState<AssistantTone>("professional");
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [copied, setCopied] = useState(false);

  // Derive source text based on selected targetField and targetId
  const getDerivedSourceText = (): string => {
    if (initialSourceText && targetField === initialTargetField) {
      return initialSourceText;
    }
    switch (targetField) {
      case "headline":
        return portfolio.profile.headline || "";
      case "bio":
        return portfolio.profile.bio || "";
      case "long_bio":
        return portfolio.profile.longBio || "";
      case "project_description": {
        const proj = portfolio.projects.find((p) => p.id === targetId) || portfolio.projects[0];
        return proj ? proj.description : "";
      }
      case "project_tagline": {
        const proj = portfolio.projects.find((p) => p.id === targetId) || portfolio.projects[0];
        return proj ? proj.tagline : "";
      }
      case "experience_description": {
        const exp = portfolio.experience.find((e) => e.id === targetId) || portfolio.experience[0];
        return exp ? exp.description : "";
      }
      case "experience_highlight": {
        const exp = portfolio.experience.find((e) => e.id === targetId) || portfolio.experience[0];
        return exp && exp.highlights.length > 0 ? exp.highlights[0] : "";
      }
      default:
        return "";
    }
  };

  const [sourceText, setSourceText] = useState<string>(getDerivedSourceText());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<ContentAssistResponse | null>(null);

  const handleFieldChange = (field: ContentTargetField) => {
    setTargetField(field);
    setSuggestion(null);
    setErrorMessage(null);
    setIsEditingSuggestion(false);

    // Update source text accordingly
    switch (field) {
      case "headline":
        setSourceText(portfolio.profile.headline || "");
        break;
      case "bio":
        setSourceText(portfolio.profile.bio || "");
        break;
      case "long_bio":
        setSourceText(portfolio.profile.longBio || "");
        break;
      case "project_description":
        setSourceText(portfolio.projects[0]?.description || "");
        setTargetId(portfolio.projects[0]?.id || "");
        break;
      case "experience_description":
        setSourceText(portfolio.experience[0]?.description || "");
        setTargetId(portfolio.experience[0]?.id || "");
        break;
      default:
        setSourceText("");
    }
  };

  const handleRunImprovement = async () => {
    if (!sourceText.trim()) {
      setErrorMessage("Please enter or select source text to improve.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsEditingSuggestion(false);

    const snapshotHash = computeContentHash(sourceText);

    try {
      const res = await fetch("/api/ai/content-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation,
          targetField,
          sourceText: sourceText.trim(),
          tone,
          sourceHash: snapshotHash,
          context: portfolio.profile.headline ? `Candidate role: ${portfolio.profile.headline}` : undefined,
        }),
      });

      const resData: AssistantApiResponse<ContentAssistResponse> = await res.json();

      if (!res.ok || !resData.success || !resData.data) {
        setIsLoading(false);
        setErrorMessage(resData.error || "Failed to generate content suggestion. Please try again.");
        return;
      }

      setSuggestion(resData.data);
      setEditedText(resData.data.suggestedText);
      setIsLoading(false);
    } catch (err) {
      console.error("[ContentAssistant] Request error:", err);
      setIsLoading(false);
      setErrorMessage("Network error connecting to AI Assistant. Please try again.");
    }
  };

  const handleApply = () => {
    const textToApply = isEditingSuggestion ? editedText : suggestion?.suggestedText;
    if (!textToApply) return;
    onApplyChange(textToApply, targetField, targetId);
  };

  const handleCopy = () => {
    const textToCopy = isEditingSuggestion ? editedText : suggestion?.suggestedText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Field Selector */}
        <div className="space-y-1.5">
          <label htmlFor="content-field-select" className="text-xs font-semibold text-zinc-300">
            Field to Improve
          </label>
          <select
            id="content-field-select"
            value={targetField}
            onChange={(e) => handleFieldChange(e.target.value as ContentTargetField)}
            className="w-full h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
          >
            <option value="headline">Profile Headline</option>
            <option value="bio">Biography Summary</option>
            <option value="long_bio">Long Bio / Story</option>
            {portfolio.projects.length > 0 && (
              <option value="project_description">Project Description</option>
            )}
            {portfolio.experience.length > 0 && (
              <option value="experience_description">Experience Description</option>
            )}
            <option value="custom_text">Custom Text (Any)</option>
          </select>
        </div>

        {/* Operation Selector */}
        <div className="space-y-1.5">
          <label htmlFor="content-operation-select" className="text-xs font-semibold text-zinc-300">
            Operation
          </label>
          <select
            id="content-operation-select"
            value={operation}
            onChange={(e) => setOperation(e.target.value as ContentOperation)}
            className="w-full h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
          >
            <option value="improve_clarity">Improve Clarity & Flow</option>
            <option value="fix_grammar">Fix Grammar & Punctuation</option>
            <option value="adjust_tone">Adjust Writing Tone</option>
            <option value="shorten">Make More Concise</option>
            <option value="expand_clarity">Expand with Context</option>
            {targetField === "headline" && <option value="improve_headline">Punchy Headline</option>}
            {targetField === "bio" && <option value="improve_bio">Polished Bio</option>}
            {targetField.includes("project") && (
              <option value="improve_project_description">Project Architecture</option>
            )}
            {targetField.includes("experience") && (
              <option value="improve_bullet">Action-Oriented Bullet</option>
            )}
          </select>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label htmlFor="content-tone-select" className="text-xs font-semibold text-zinc-300">
            Writing Tone
          </label>
          <select
            id="content-tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value as AssistantTone)}
            className="w-full h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
          >
            <option value="professional">Professional (Balanced)</option>
            <option value="concise">Concise (Direct, brief)</option>
            <option value="technical">Technical (Precise, systems)</option>
            <option value="friendly">Friendly (Approachable)</option>
            <option value="creative">Creative (Expressive)</option>
          </select>
        </div>
      </div>

      {/* Source Text Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="content-source-text" className="text-xs font-medium text-zinc-400">
            Source Text (Your verified facts)
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {sourceText.length} / 3000 chars
          </span>
        </div>
        <textarea
          id="content-source-text"
          rows={3}
          value={sourceText}
          onChange={(e) => {
            setSourceText(e.target.value);
            if (suggestion) {
              // Recalculate hash on live edit to show stale warning
              const newHash = computeContentHash(e.target.value);
              if (suggestion.sourceHash && suggestion.sourceHash !== newHash) {
                setSuggestion({ ...suggestion, isStale: true });
              }
            }
          }}
          placeholder="Enter or paste text you would like the AI assistant to refine..."
          className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 resize-y"
        />
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Factual Integrity: The AI will never invent employers, dates, or metrics.</span>
        </div>

        <Button
          variant="brand"
          size="sm"
          onClick={handleRunImprovement}
          disabled={isLoading || !sourceText.trim()}
          className="gap-1.5 text-xs font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Improving text...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Suggestion</span>
            </>
          )}
        </Button>
      </div>

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

      {/* Stale Warning Indicator */}
      {suggestion?.isStale && (
        <div
          role="status"
          className="p-2.5 rounded-lg border border-amber-900/50 bg-amber-950/20 text-amber-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Source text changed while suggestion was processing.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRunImprovement}
            className="h-6 text-[10px] text-amber-300 hover:text-white"
          >
            Regenerate for current text
          </Button>
        </div>
      )}

      {/* Clarification Request from Model */}
      {suggestion?.clarificationNeeded && (
        <div className="p-3 rounded-xl border border-blue-900/40 bg-blue-950/20 text-blue-200 text-xs space-y-1">
          <span className="font-semibold text-blue-300">More details needed to expand:</span>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            {suggestion.clarificationNeeded}
          </p>
        </div>
      )}

      {/* Before & After Review Panel */}
      {suggestion && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Suggested Improvement</span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                {suggestion.operation.replace(/_/g, " ")}
              </span>
            </div>

            <span className="text-[11px] text-emerald-400 font-medium">
              {suggestion.explanation}
            </span>
          </div>

          {/* Comparison Cards: Original vs Suggested */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Original Card */}
            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/50 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                Original Text
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {suggestion.originalText}
              </p>
            </div>

            {/* Proposed Card */}
            <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/10 space-y-1.5 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                  Proposed Version
                </span>

                <button
                  type="button"
                  onClick={() => setIsEditingSuggestion((prev) => !prev)}
                  className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>{isEditingSuggestion ? "Revert Edits" : "Edit Suggestion"}</span>
                </button>
              </div>

              {isEditingSuggestion ? (
                <textarea
                  rows={4}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-950 border border-emerald-600 text-xs text-white focus:outline-none"
                />
              ) : (
                <p className="text-xs text-emerald-200/90 leading-relaxed whitespace-pre-wrap">
                  {suggestion.suggestedText}
                </p>
              )}
            </div>
          </div>

          {/* Review Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 text-xs text-zinc-300 border-zinc-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRunImprovement}
                className="h-8 gap-1.5 text-xs text-zinc-300 border-zinc-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuggestion(null)}
                className="h-8 text-xs text-zinc-400 hover:text-white"
              >
                Discard
              </Button>

              <Button
                variant="brand"
                size="sm"
                onClick={handleApply}
                className="h-8 gap-1.5 text-xs font-semibold shadow-sm"
              >
                <span>Apply Suggestion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
