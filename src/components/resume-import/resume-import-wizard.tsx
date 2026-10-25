"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExtractedResumeData,
  ResumeApiResponse,
  ResumeErrorCode,
} from "@/lib/resume-import/types";
import {
  PortfolioData,
  TemplateId,
} from "@/lib/schema/portfolio";
import { getAllTemplates, getTemplate } from "@/templates/registry";
import { PortfolioRenderer } from "@/templates/renderer";
import { resumeService, ResumeMergeOptions } from "@/lib/resume-import/resume-service";
import { ResumeUploadZone } from "./resume-upload-zone";
import { ResumeReviewEditor } from "./resume-review-editor";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
} from "lucide-react";

export interface ResumeImportWizardProps {
  existingPortfolio?: PortfolioData;
  onApply?: (portfolio: PortfolioData) => void;
  onCancel?: () => void;
}

type WizardStep = "upload" | "review" | "apply";

export function ResumeImportWizard({
  existingPortfolio,
  onApply,
  onCancel,
}: ResumeImportWizardProps) {
  const router = useRouter();

  // Wizard Navigation
  const [step, setStep] = useState<WizardStep>("upload");

  // Upload & Extraction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ResumeErrorCode | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);

  // New Portfolio Step 3: Template & Device Preview
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("minimal-portfolio");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Merge Mode Options (if existingPortfolio provided)
  const [mergeOptions, setMergeOptions] = useState<ResumeMergeOptions>({
    profileStrategy: "fill-missing",
    skillsStrategy: "append",
    experienceStrategy: "append",
    educationStrategy: "append",
    projectsStrategy: "append",
  });

  // Step 1: Upload File & Parse via API
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setErrorCode(null);
    setProcessingStatus("Validating file signature & structure...");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setTimeout(() => {
        setProcessingStatus("Extracting text and identifying resume sections in memory...");
      }, 600);

      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const resData: ResumeApiResponse<ExtractedResumeData> = await response.json();

      if (!response.ok || !resData.success || !resData.data) {
        setIsProcessing(false);
        setErrorCode(resData.code || "PARSING_ERROR");
        setErrorMessage(
          resData.error ||
            "Unable to extract readable information from this document. Please check the file and try again."
        );
        return;
      }

      setExtractedData(resData.data);
      setIsProcessing(false);
      setStep("review");
    } catch (err: unknown) {
      console.error("[ResumeImportWizard] Upload error:", err);
      setIsProcessing(false);
      setErrorCode("PARSING_ERROR");
      setErrorMessage("Network or server failure while parsing document. Please try again.");
    }
  };

  // Step 2 -> 3: User confirms reviewed data
  const handleReviewConfirm = () => {
    if (!extractedData) return;
    setStep("apply");
  };

  // Step 3: Complete & Apply
  const handleFinalApply = () => {
    if (!extractedData) return;

    if (existingPortfolio) {
      // Merge into existing portfolio
      const merged = resumeService.mergeWithPortfolio(existingPortfolio, extractedData, mergeOptions);
      if (onApply) {
        onApply(merged);
      } else {
        try {
          localStorage.setItem("portfolify_draft", JSON.stringify(merged));
        } catch (e) {
          console.error("Failed to store draft in localStorage", e);
        }
        router.push("/editor");
      }
    } else {
      // Create new portfolio
      const newPortfolio = resumeService.mapToPortfolioData(extractedData, undefined, selectedTemplate);
      if (onApply) {
        onApply(newPortfolio);
      } else {
        try {
          localStorage.setItem("portfolify_draft", JSON.stringify(newPortfolio));
        } catch (e) {
          console.error("Failed to store draft in localStorage", e);
        }
        router.push(`/editor?template=${selectedTemplate}`);
      }
    }
  };

  // Preview Portfolio Data constructed for Live Template Preview
  const previewPortfolio: PortfolioData | null = extractedData
    ? resumeService.mapToPortfolioData(extractedData, undefined, selectedTemplate)
    : null;

  const allTemplates = getAllTemplates();

  return (
    <div className="w-full flex flex-col space-y-6 font-sans">
      {/* Wizard Progress Stepper */}
      <nav aria-label="Progress" className="w-full">
        <ol className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <li className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === "upload"
                  ? "bg-[#356ae6] text-white ring-4 ring-[#356ae6]/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {step !== "upload" ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </div>
            <span
              className={`text-xs font-medium ${
                step === "upload" ? "text-white" : "text-zinc-400"
              }`}
            >
              Upload Document
            </span>
          </li>

          <div className="flex-1 h-px bg-zinc-800 mx-3" />

          <li className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === "review"
                  ? "bg-[#356ae6] text-white ring-4 ring-[#356ae6]/20"
                  : step === "apply"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-500"
              }`}
            >
              {step === "apply" ? <CheckCircle2 className="w-4 h-4" /> : "2"}
            </div>
            <span
              className={`text-xs font-medium ${
                step === "review" ? "text-white" : "text-zinc-400"
              }`}
            >
              Review & Polish
            </span>
          </li>

          <div className="flex-1 h-px bg-zinc-800 mx-3" />

          <li className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === "apply"
                  ? "bg-[#356ae6] text-white ring-4 ring-[#356ae6]/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-500"
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-medium ${
                step === "apply" ? "text-white" : "text-zinc-400"
              }`}
            >
              {existingPortfolio ? "Merge Options" : "Select Template"}
            </span>
          </li>

          {onCancel && (
            <li className="ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
            </li>
          )}
        </ol>
      </nav>

      {/* STEP 1: UPLOAD ZONE */}
      {step === "upload" && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Import Your Resume
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Upload your PDF, Word, or plain text resume. Portfolify extracts your experience,
              skills, and projects without fabricating any details.
            </p>
          </div>

          <ResumeUploadZone
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
            errorCode={errorCode}
            errorMessage={errorMessage}
          />

          {isProcessing && (
            <div className="p-4 rounded-xl border border-blue-900/40 bg-blue-950/20 text-center space-y-2 max-w-md mx-auto">
              <Loader2 className="w-5 h-5 animate-spin text-[#356ae6] mx-auto" />
              <p className="text-xs font-medium text-blue-200">{processingStatus}</p>
              <p className="text-[11px] text-zinc-500">
                Extraction runs purely in memory. No files are stored or uploaded to third parties.
              </p>
            </div>
          )}

          {/* Privacy & Limits note */}
          <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-medium text-white">Private In-Memory Parsing</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Documents are processed in server RAM and discarded immediately. No public URLs,
                  no disk storage, no tracking.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-medium text-white">Strict Factual Grounding</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Only facts explicitly stated in your resume are extracted. Missing dates or metrics
                  are never made up.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW & POLISH */}
      {step === "review" && extractedData && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#356ae6]" />
                Review Extracted Information
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Verify extracted sections from <span className="font-mono text-zinc-300">{extractedData.fileName}</span>.
                You can toggle items on or off, edit values, or polish descriptions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                {extractedData.skills.length} skills • {extractedData.experience.length} roles • {extractedData.projects.length} projects
              </span>
            </div>
          </div>

          <ResumeReviewEditor
            initialData={extractedData}
            onChange={(updated) => setExtractedData(updated)}
            onConfirm={handleReviewConfirm}
            onBack={() => setStep("upload")}
          />
        </div>
      )}

      {/* STEP 3: APPLY & PREVIEW */}
      {step === "apply" && extractedData && (
        <div className="space-y-6">
          {existingPortfolio ? (
            /* EXISTING PORTFOLIO MERGE CONTROLS */
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-1 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Merge into Current Portfolio
                </h3>
                <p className="text-xs text-zinc-400">
                  Choose how each extracted section is combined with your existing portfolio data.
                  Nothing is overwritten without your consent.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                {/* Profile Strategy */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div>
                    <span className="text-xs font-semibold text-white">Profile Details</span>
                    <p className="text-[11px] text-zinc-400">
                      Name, Headline, Bio, and Contact information.
                    </p>
                  </div>
                  <select
                    value={mergeOptions.profileStrategy}
                    onChange={(e) =>
                      setMergeOptions({
                        ...mergeOptions,
                        profileStrategy: e.target.value as ResumeMergeOptions["profileStrategy"],
                      })
                    }
                    className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="fill-missing">Fill missing fields only (Safe)</option>
                    <option value="replace">Overwrite with resume profile</option>
                    <option value="keep">Keep current profile untouched</option>
                  </select>
                </div>

                {/* Skills Strategy */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div>
                    <span className="text-xs font-semibold text-white">Skills</span>
                    <p className="text-[11px] text-zinc-400">
                      {extractedData.skills.filter((s) => s.included).length} approved skills to merge.
                    </p>
                  </div>
                  <select
                    value={mergeOptions.skillsStrategy}
                    onChange={(e) =>
                      setMergeOptions({
                        ...mergeOptions,
                        skillsStrategy: e.target.value as ResumeMergeOptions["skillsStrategy"],
                      })
                    }
                    className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="append">Append (Skip duplicates)</option>
                    <option value="replace">Replace all existing skills</option>
                    <option value="keep">Keep current skills untouched</option>
                  </select>
                </div>

                {/* Experience Strategy */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div>
                    <span className="text-xs font-semibold text-white">Work Experience</span>
                    <p className="text-[11px] text-zinc-400">
                      {extractedData.experience.filter((e) => e.included).length} approved experience entries.
                    </p>
                  </div>
                  <select
                    value={mergeOptions.experienceStrategy}
                    onChange={(e) =>
                      setMergeOptions({
                        ...mergeOptions,
                        experienceStrategy: e.target.value as ResumeMergeOptions["experienceStrategy"],
                      })
                    }
                    className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="append">Append new entries</option>
                    <option value="replace">Replace all existing experience</option>
                    <option value="keep">Keep current experience untouched</option>
                  </select>
                </div>

                {/* Education Strategy */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div>
                    <span className="text-xs font-semibold text-white">Education</span>
                    <p className="text-[11px] text-zinc-400">
                      {extractedData.education.filter((ed) => ed.included).length} approved degrees/institutions.
                    </p>
                  </div>
                  <select
                    value={mergeOptions.educationStrategy}
                    onChange={(e) =>
                      setMergeOptions({
                        ...mergeOptions,
                        educationStrategy: e.target.value as ResumeMergeOptions["educationStrategy"],
                      })
                    }
                    className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="append">Append new entries</option>
                    <option value="replace">Replace all existing education</option>
                    <option value="keep">Keep current education untouched</option>
                  </select>
                </div>

                {/* Projects Strategy */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-white">Projects</span>
                    <p className="text-[11px] text-zinc-400">
                      {extractedData.projects.filter((p) => p.included).length} approved projects.
                    </p>
                  </div>
                  <select
                    value={mergeOptions.projectsStrategy}
                    onChange={(e) =>
                      setMergeOptions({
                        ...mergeOptions,
                        projectsStrategy: e.target.value as ResumeMergeOptions["projectsStrategy"],
                      })
                    }
                    className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="append">Append new projects</option>
                    <option value="replace">Replace all existing projects</option>
                    <option value="keep">Keep current projects untouched</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("review")}
                  className="gap-1.5 border-zinc-700 text-zinc-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Review
                </Button>

                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleFinalApply}
                  className="gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Apply to Current Portfolio
                </Button>
              </div>
            </div>
          ) : (
            /* NEW PORTFOLIO TEMPLATE SELECTION & LIVE PREVIEW */
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Select Portfolio Template
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Preview your extracted resume data in any of Portfolify&apos;s registered templates.
                    You can switch anytime in Studio.
                  </p>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
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

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {allTemplates.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.metadata.id;
                  return (
                    <button
                      key={tpl.metadata.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tpl.metadata.id as TemplateId)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-zinc-900/90 border-[#356ae6] ring-1 ring-[#356ae6]/50 shadow-md shadow-blue-500/5"
                          : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{tpl.metadata.name}</span>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tpl.metadata.previewAccent || "#356ae6" }}
                          />
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {tpl.metadata.description}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500 font-mono">{tpl.metadata.category}</span>
                        {isSelected && (
                          <span className="text-[#356ae6] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Container */}
              <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl">
                <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="text-[11px] font-mono text-zinc-400 ml-2">
                      Live Preview &bull; {getTemplate(selectedTemplate)?.metadata.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500">
                    Real Template Engine Output
                  </span>
                </div>

                <div
                  className={`mx-auto transition-all duration-300 overflow-y-auto max-h-[550px] bg-background ${
                    previewDevice === "mobile" ? "max-w-[390px] border-x border-zinc-800" : "w-full"
                  }`}
                >
                  {previewPortfolio && (
                    <PortfolioRenderer portfolio={previewPortfolio} isLivePreview={true} />
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("review")}
                  className="gap-1.5 border-zinc-700 text-zinc-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Review
                </Button>

                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleFinalApply}
                  className="gap-1.5 shadow-md shadow-blue-500/10 text-xs font-semibold"
                >
                  <span>Open in Studio Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
