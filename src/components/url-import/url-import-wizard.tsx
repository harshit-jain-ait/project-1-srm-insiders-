"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  WebsiteDesignAnalysis,
  DesignDirection,
  GeneratedDirectionsResult,
  UrlAnalysisErrorCode,
} from "@/lib/url-import/types";
import { PortfolioData, createEmptyPortfolio, TemplateId } from "@/lib/schema/portfolio";
import { PortfolioRenderer } from "@/templates/renderer";
import { Button } from "@/components/ui/button";
import {
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Sparkles,
  Layers,
  Compass,
} from "lucide-react";

export interface UrlImportWizardProps {
  existingPortfolio?: PortfolioData;
  onSelectDirection?: (direction: DesignDirection, draft?: Partial<PortfolioData>) => void;
  onCancel?: () => void;
}

type WizardStep = "input" | "analyzing" | "summary" | "comparison";

export function UrlImportWizard({
  existingPortfolio,
  onSelectDirection,
  onCancel,
}: UrlImportWizardProps) {
  const router = useRouter();

  // Wizard Flow State
  const [step, setStep] = useState<WizardStep>("input");
  const [urlInput, setUrlInput] = useState("");
  const [confirmPermission, setConfirmPermission] = useState(false);
  const [clientUrlError, setClientUrlError] = useState("");

  // Loading & Operations State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingDirections, setIsGeneratingDirections] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<UrlAnalysisErrorCode | null>(null);

  // Extracted Results State
  const [analysisResult, setAnalysisResult] = useState<WebsiteDesignAnalysis | null>(null);
  const [directionsResult, setDirectionsResult] = useState<GeneratedDirectionsResult | null>(null);
  const [selectedDirectionId, setSelectedDirectionId] = useState<"signature" | "reimagined">("signature");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Client-side quick check
  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    setErrorMessage(null);
    if (!val.trim()) {
      setClientUrlError("");
      return;
    }
    const trimmed = val.trim();
    if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("file:")) {
      setClientUrlError("Unsupported protocol. Only HTTP and HTTPS are permitted.");
      return;
    }
    try {
      const parsed = new URL(trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setClientUrlError("Must be an HTTP or HTTPS URL.");
        return;
      }
      setClientUrlError("");
    } catch {
      setClientUrlError("Please enter a valid web address.");
    }
  };

  // Step 1: Submit URL for Analysis
  const handleAnalyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || clientUrlError) return;

    if (!confirmPermission) {
      setErrorMessage("You must confirm permission to use this website as design reference.");
      return;
    }

    setErrorMessage(null);
    setErrorCode(null);
    setIsAnalyzing(true);
    setStep("analyzing");

    setAnalysisProgress("Verifying URL security & SSRF boundaries...");

    try {
      // Simulate stepped progress indicator for honest UX
      setTimeout(() => {
        setAnalysisProgress("Retrieving public HTML document & headers...");
      }, 700);

      setTimeout(() => {
        setAnalysisProgress("Extracting color palette, typography & layout hierarchy...");
      }, 1500);

      const res = await fetch("/api/ai/url-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput.trim(),
          confirmPermission: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStep("input");
        setErrorCode(data.code || "ANALYSIS_FAILED");
        setErrorMessage(data.error || "Failed to analyze target website.");
        setIsAnalyzing(false);
        return;
      }

      setAnalysisResult(data.data);
      setStep("summary");
    } catch (err: unknown) {
      setStep("input");
      setErrorCode("CONNECTION_FAILED");
      setErrorMessage(err instanceof Error ? err.message : "Network error during website analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2 -> 3: Generate Exactly Two Directions (Signature & Reimagined)
  const handleGenerateDirections = async () => {
    if (!analysisResult) return;

    setIsGeneratingDirections(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ai/generate-directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis: analysisResult,
          confirmPermission: true,
          existingPortfolio: existingPortfolio || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to generate design directions.");
        setIsGeneratingDirections(false);
        return;
      }

      setDirectionsResult(data.data);
      setStep("comparison");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error generating directions.");
    } finally {
      setIsGeneratingDirections(false);
    }
  };

  // Step 4: Apply Chosen Direction
  const handleApplyDirection = (direction: DesignDirection) => {
    if (!directionsResult) return;

    // Build the updated portfolio draft
    const base = existingPortfolio || createEmptyPortfolio({
      title: analysisResult?.pageTitle || "My Portfolio",
      profile: {
        headline: analysisResult?.extractedContent.headline || "",
        bio: analysisResult?.extractedContent.bioSnippet || "",
      },
    });

    const updatedPortfolio: PortfolioData = {
      ...base,
      appearance: {
        ...base.appearance,
        templateId: direction.baseTemplateId as TemplateId,
        colorScheme: direction.designTokens.colorScheme,
        accentColor: direction.designTokens.accentColor,
        fontFamily: direction.designTokens.fontFamily,
        designTokens: direction.designTokens,
      },
      updatedAt: new Date().toISOString(),
    };

    if (onSelectDirection) {
      onSelectDirection(direction, updatedPortfolio);
    } else {
      // Store in localStorage for Studio Editor to pick up
      try {
        localStorage.setItem("portfolify_draft", JSON.stringify(updatedPortfolio));
      } catch (err) {
        console.error("Failed to store draft in localStorage", err);
      }
      router.push(`/editor?template=${direction.baseTemplateId}`);
    }
  };

  // Helper to construct portfolio for live comparison preview
  const getPreviewPortfolio = (direction: DesignDirection): PortfolioData => {
    if (existingPortfolio) {
      return {
        ...existingPortfolio,
        appearance: {
          ...existingPortfolio.appearance,
          templateId: direction.baseTemplateId as TemplateId,
          colorScheme: direction.designTokens.colorScheme,
          accentColor: direction.designTokens.accentColor,
          fontFamily: direction.designTokens.fontFamily,
          designTokens: direction.designTokens,
        },
      };
    }

    const base = createEmptyPortfolio({
      title: analysisResult?.pageTitle || "Portfolio Preview",
      profile: {
        fullName: "Alex Morgan",
        headline: analysisResult?.extractedContent.headline || "Staff Software Engineer",
        bio: analysisResult?.extractedContent.bioSnippet || "Building high-performance distributed systems, robust APIs, and accessible modern web applications.",
        location: "San Francisco, CA",
        email: "alex@example.com",
        statusBadge: "Available for new projects",
      },
      projects: [
        {
          id: "p1",
          title: "Distributed Pipeline Engine",
          tagline: "High-throughput stream processing framework",
          description: "Engineered scalable telemetry pipelines handling 2.5B events daily with sub-second latency.",
          technologies: ["TypeScript", "Node.js", "Kafka", "PostgreSQL"],
          featured: true,
          liveUrl: "https://example.com",
          repoUrl: "https://github.com/example/pipeline",
          coverImageUrl: "",
          startDate: "2023",
          endDate: "2024",
          order: 0,
        },
        {
          id: "p2",
          title: "Cloud Infrastructure Visualizer",
          tagline: "Real-time topology graphing tool",
          description: "Interactive graph rendering tool that visualizes multi-region VPC dependencies and security policies.",
          technologies: ["React", "WebGL", "TailwindCSS"],
          featured: false,
          liveUrl: "https://example.com",
          repoUrl: "https://github.com/example/visualizer",
          coverImageUrl: "",
          startDate: "2024",
          endDate: "2025",
          order: 1,
        },
      ],
      skills: [
        { id: "s1", name: "Distributed Systems", category: "Core", order: 0 },
        { id: "s2", name: "TypeScript / Node.js", category: "Languages", order: 1 },
        { id: "s3", name: "PostgreSQL & SQLite", category: "Databases", order: 2 },
        { id: "s4", name: "Cloud Architecture", category: "Infrastructure", order: 3 },
      ],
    });

    return {
      ...base,
      appearance: {
        ...base.appearance,
        templateId: direction.baseTemplateId as TemplateId,
        colorScheme: direction.designTokens.colorScheme,
        accentColor: direction.designTokens.accentColor,
        fontFamily: direction.designTokens.fontFamily,
        designTokens: direction.designTokens,
      },
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans text-zinc-100">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
            Design Inspiration Engine
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
            Start from Website URL
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className={`px-2 py-0.5 rounded ${step === "input" ? "bg-blue-600 text-white font-semibold" : "bg-zinc-800"}`}>
            1. URL
          </span>
          <span className="text-zinc-600">→</span>
          <span className={`px-2 py-0.5 rounded ${step === "summary" ? "bg-blue-600 text-white font-semibold" : "bg-zinc-800"}`}>
            2. Summary
          </span>
          <span className="text-zinc-600">→</span>
          <span className={`px-2 py-0.5 rounded ${step === "comparison" ? "bg-blue-600 text-white font-semibold" : "bg-zinc-800"}`}>
            3. Signature vs Reimagined
          </span>
        </div>
      </div>

      {/* STAGE 1: URL Input & Permission Confirmation */}
      {step === "input" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Enter Public Website URL</span>
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Portfolify analyzes the site&apos;s public layout hierarchy, typography rhythm, and broad color palette
                to synthesize two original portfolio directions.
              </p>
            </div>

            <form onSubmit={handleAnalyzeUrl} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="url-input" className="text-xs font-medium text-zinc-300">
                  Website URL
                </label>
                <div className="relative">
                  <input
                    id="url-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com or company.dev"
                    disabled={isAnalyzing}
                    className={`w-full bg-zinc-950 border ${
                      clientUrlError ? "border-red-500" : "border-zinc-800 focus:border-blue-500"
                    } rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors font-mono`}
                  />
                </div>
                {clientUrlError && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{clientUrlError}</span>
                  </p>
                )}
              </div>

              {/* Permission & Rights Acknowledgment Checkbox */}
              <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-lg p-4 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmPermission}
                    onChange={(e) => setConfirmPermission(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-white">Authorization & Rights Confirmation:</span> I confirm
                    that I own this website or have authorization to use its design characteristics as an inspirational
                    reference.
                  </div>
                </label>

                <div className="text-[11px] text-zinc-500 pl-7 leading-relaxed">
                  Portfolify generates original portfolio layouts using broad styling tokens. We do not clone
                  proprietary code, trademarks, or copyrighted imagery.
                </div>
              </div>

              {/* Error banner if previous attempt failed */}
              {errorMessage && (
                <div className="p-3 rounded-lg border border-red-900/80 bg-red-950/40 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{errorCode || "Error"}</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {onCancel ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/generate")}
                    className="text-zinc-400 hover:text-white text-xs"
                  >
                    Prefer guided notes instead?
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!urlInput.trim() || !confirmPermission || Boolean(clientUrlError) || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  <span>Analyze Website</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAGE 2: Secure Retrieval & Analysis Status */}
      {step === "analyzing" && (
        <div className="max-w-md mx-auto py-16 text-center space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin" />
            <Globe className="w-6 h-6 text-blue-400 absolute" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Analyzing Website Structure</h2>
            <p className="text-xs font-mono text-blue-400 animate-pulse">{analysisProgress}</p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 text-left space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Target: {urlInput}</span>
            </div>
            <div className="text-zinc-500">
              • SSRF Defense Active: Private IPs and metadata endpoints blocked
            </div>
            <div className="text-zinc-500">• Size Capped: 512KB payload threshold enforced</div>
          </div>
        </div>
      )}

      {/* STAGE 3: Extracted Design Summary */}
      {step === "summary" && analysisResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-400">Analysis Complete</span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {analysisResult.pageTitle || "Public Web Document"}
                </h2>
                <p className="text-xs font-mono text-zinc-400">{analysisResult.sourceUrl}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Safe</span>
              </span>
            </div>

            {/* Visual Characteristics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Color Palette */}
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-zinc-300">Extracted Palette</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded border border-zinc-700 shadow-sm"
                    style={{ backgroundColor: analysisResult.palette.accent }}
                    title={`Accent: ${analysisResult.palette.accent}`}
                  />
                  <div
                    className="w-7 h-7 rounded border border-zinc-700 shadow-sm"
                    style={{ backgroundColor: analysisResult.palette.primary }}
                    title={`Primary: ${analysisResult.palette.primary}`}
                  />
                  <div
                    className="w-7 h-7 rounded border border-zinc-700 shadow-sm"
                    style={{ backgroundColor: analysisResult.palette.background }}
                    title={`Background: ${analysisResult.palette.background}`}
                  />
                  <div
                    className="w-7 h-7 rounded border border-zinc-700 shadow-sm"
                    style={{ backgroundColor: analysisResult.palette.surface }}
                    title={`Surface: ${analysisResult.palette.surface}`}
                  />
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {analysisResult.palette.isDark ? "Dark theme base" : "Light theme base"}
                </p>
              </div>

              {/* Typography Mood */}
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-zinc-300">Typography Rhythm</span>
                <p className="text-sm font-medium text-white truncate">
                  {analysisResult.typography.detectedFont}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono capitalize">
                  Mood: {analysisResult.typography.mood}
                </p>
              </div>

              {/* Layout Characteristics */}
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-zinc-300">Layout Hierarchy</span>
                <p className="text-sm font-medium text-white capitalize">
                  {analysisResult.layout.density} density
                </p>
                <p className="text-[11px] text-zinc-500 font-mono capitalize">
                  Cards: {analysisResult.layout.cardStyle}
                </p>
              </div>
            </div>

            {/* Extracted Content Snippet Preview */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-300">Extracted Public Metadata</span>
              {analysisResult.extractedContent.headline && (
                <p className="text-xs text-zinc-200">
                  <span className="text-zinc-500">Headline:</span> {analysisResult.extractedContent.headline}
                </p>
              )}
              {analysisResult.extractedContent.bioSnippet && (
                <p className="text-xs text-zinc-400 line-clamp-2">
                  <span className="text-zinc-500">Bio:</span> {analysisResult.extractedContent.bioSnippet}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-zinc-500">Detected sections:</span>
                {analysisResult.extractedContent.detectedSections.map((sec) => (
                  <span key={sec} className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Safe Usage Disclaimer */}
            <div className="text-[11px] text-zinc-500 space-y-1">
              <p>• Portfolify will synthesize exactly two portfolio design directions: <strong>Signature</strong> and <strong>Reimagined</strong>.</p>
              <p>• Your personal and professional content remains completely under your control.</p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg border border-red-900/80 bg-red-950/40 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("input")}
                className="text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Try Different URL</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerateDirections}
                disabled={isGeneratingDirections}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
              >
                {isGeneratingDirections ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Synthesizing Directions...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Signature & Reimagined</span>
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: Two-Direction Comparison (Signature vs Reimagined) */}
      {step === "comparison" && directionsResult && (
        <div className="space-y-8">
          {/* Viewport & Instruction Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Compare Exactly Two Directions</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Both directions use validated design configurations rendered with the canonical portfolio engine.
              </p>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === "desktop"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === "mobile"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Side-by-side or Stacked Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* DIRECTION 1: SIGNATURE */}
            <div
              onClick={() => setSelectedDirectionId("signature")}
              className={`rounded-2xl border transition-all cursor-pointer ${
                selectedDirectionId === "signature"
                  ? "border-blue-500 shadow-lg shadow-blue-950/20 ring-1 ring-blue-500"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              } p-6 flex flex-col justify-between space-y-6`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h3 className="text-xl font-bold text-white">{directionsResult.signature.name}</h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Source-Harmonized
                  </span>
                </div>

                <p className="text-xs text-blue-400 font-medium">
                  {directionsResult.signature.tagline}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {directionsResult.signature.description}
                </p>

                {/* Key Distinct Features */}
                <ul className="text-xs text-zinc-400 space-y-1 pt-2">
                  {directionsResult.signature.distinctFeatures.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-blue-400">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real Live Rendered Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                  Live Portfolio Preview
                </span>
                <div
                  className={`border border-zinc-800 rounded-xl overflow-hidden bg-black/60 shadow-inner ${
                    previewDevice === "mobile" ? "max-w-[340px] mx-auto h-[480px]" : "w-full h-[480px]"
                  } overflow-y-auto`}
                >
                  <div className={previewDevice === "mobile" ? "w-[340px]" : "w-full"}>
                    <PortfolioRenderer
                      portfolio={getPreviewPortfolio(directionsResult.signature)}
                      isLivePreview={true}
                    />
                  </div>
                </div>
              </div>

              {/* Select Action */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleApplyDirection(directionsResult.signature)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  <span>Select Signature Direction</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* DIRECTION 2: REIMAGINED */}
            <div
              onClick={() => setSelectedDirectionId("reimagined")}
              className={`rounded-2xl border transition-all cursor-pointer ${
                selectedDirectionId === "reimagined"
                  ? "border-blue-500 shadow-lg shadow-blue-950/20 ring-1 ring-blue-500"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              } p-6 flex flex-col justify-between space-y-6`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-zinc-200" />
                    <h3 className="text-xl font-bold text-white">{directionsResult.reimagined.name}</h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Editorial Reinterpretation
                  </span>
                </div>

                <p className="text-xs text-blue-400 font-medium">
                  {directionsResult.reimagined.tagline}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {directionsResult.reimagined.description}
                </p>

                {/* Key Distinct Features */}
                <ul className="text-xs text-zinc-400 space-y-1 pt-2">
                  {directionsResult.reimagined.distinctFeatures.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-zinc-300">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real Live Rendered Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                  Live Portfolio Preview
                </span>
                <div
                  className={`border border-zinc-800 rounded-xl overflow-hidden bg-black/60 shadow-inner ${
                    previewDevice === "mobile" ? "max-w-[340px] mx-auto h-[480px]" : "w-full h-[480px]"
                  } overflow-y-auto`}
                >
                  <div className={previewDevice === "mobile" ? "w-[340px]" : "w-full"}>
                    <PortfolioRenderer
                      portfolio={getPreviewPortfolio(directionsResult.reimagined)}
                      isLivePreview={true}
                    />
                  </div>
                </div>
              </div>

              {/* Select Action */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleApplyDirection(directionsResult.reimagined)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium border border-zinc-700"
                >
                  <span>Select Reimagined Direction</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("summary")}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Summary</span>
            </Button>

            <span className="text-zinc-500 font-mono text-[11px]">
              Portfolify Engine • Canonical Schema Guaranteed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
