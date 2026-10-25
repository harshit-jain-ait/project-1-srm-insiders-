"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PortfolioData, TemplateId, AppearanceSettings } from "@/lib/schema/portfolio";
import { EditorToolbar, DeviceMode } from "@/components/editor/editor-toolbar";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorPreview } from "@/components/editor/editor-preview";
import { AiAssistModal } from "@/components/editor/ai-assist-modal";
import { UrlImportModal } from "@/components/editor/url-import-modal";
import { ResumeImportModal } from "@/components/editor/resume-import-modal";
import { PublishModal } from "@/components/publishing/publish-modal";
import { usePortfolioEditor } from "@/components/editor/use-portfolio-editor";
import { DesignDirection } from "@/lib/url-import/types";
import { ContentTargetField } from "@/lib/ai-assistant/types";
import { AssistantModalTab } from "@/components/ai-assistant/ai-assistant-modal";
import { Loader2, Sliders, Eye } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("id");
  const templateParam = searchParams.get("template") as TemplateId | null;

  // Viewport & Studio UI state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [zoom, setZoom] = useState<number>(1);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<AssistantModalTab>("content");
  const [aiModalTargetField, setAiModalTargetField] = useState<ContentTargetField>("bio");
  const [aiModalSourceText, setAiModalSourceText] = useState<string>("");
  const [aiModalTargetId, setAiModalTargetId] = useState<string>("");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Canonical Editor State & Persistence Layer
  const {
    portfolio,
    updatePortfolio,
    saveStatus,
    lastSavedAt,
    manualSave,
    feedbackMessage,
    setFeedbackMessage,
    canUndo,
    canRedo,
    undo,
    redo,
  } = usePortfolioEditor({ portfolioId, templateParam });

  // Handle Title Editing
  const handleTitleChange = (newTitle: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle Registered Template Switch (Preserves all content)
  const handleTemplateChange = (tpl: TemplateId) => {
    updatePortfolio((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        templateId: tpl,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Grounded AI Suggestions Application
  const handleApplyAiSuggestions = (suggestions: Partial<PortfolioData>) => {
    updatePortfolio((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...(suggestions.profile || {}),
      },
      skills: suggestions.skills ? [...prev.skills, ...suggestions.skills] : prev.skills,
      projects: suggestions.projects ? [...prev.projects, ...suggestions.projects] : prev.projects,
      experience: suggestions.experience ? [...prev.experience, ...suggestions.experience] : prev.experience,
      updatedAt: new Date().toISOString(),
    }));
  };

  // URL-Inspired Design Direction Application
  const handleApplyUrlDirection = (direction: DesignDirection, updatedDraft?: Partial<PortfolioData>) => {
    updatePortfolio((prev) => ({
      ...prev,
      ...(updatedDraft?.profile ? { profile: { ...prev.profile, ...updatedDraft.profile } } : {}),
      appearance: {
        ...prev.appearance,
        templateId: direction.baseTemplateId,
        colorScheme: direction.designTokens.colorScheme,
        accentColor: direction.designTokens.accentColor,
        fontFamily: direction.designTokens.fontFamily,
        designTokens: direction.designTokens,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Resume Content Merge Application
  const handleApplyResumeMerged = (mergedPortfolio: PortfolioData) => {
    updatePortfolio(() => mergedPortfolio);
  };

  // Helper to open AI Assistant targeted to a specific tab/field
  const handleOpenAiAssistant = (
    tab: AssistantModalTab = "content",
    field?: ContentTargetField,
    sourceText?: string,
    targetId?: string
  ) => {
    setAiModalTab(tab);
    if (field) setAiModalTargetField(field);
    if (sourceText) setAiModalSourceText(sourceText);
    if (targetId) setAiModalTargetId(targetId);
    setIsAiModalOpen(true);
  };

  // Content Intelligence: Updates single field in portfolio state without touching anything else
  const handleApplyContentChange = (newText: string, targetField: ContentTargetField, targetId?: string) => {
    updatePortfolio((prev) => {
      if (targetField === "headline") {
        return { ...prev, profile: { ...prev.profile, headline: newText }, updatedAt: new Date().toISOString() };
      }
      if (targetField === "bio") {
        return { ...prev, profile: { ...prev.profile, bio: newText }, updatedAt: new Date().toISOString() };
      }
      if (targetField === "long_bio") {
        return { ...prev, profile: { ...prev.profile, longBio: newText }, updatedAt: new Date().toISOString() };
      }
      if (targetField === "project_description" && targetId) {
        return {
          ...prev,
          projects: prev.projects.map((p) => (p.id === targetId ? { ...p, description: newText } : p)),
          updatedAt: new Date().toISOString(),
        };
      }
      if (targetField === "project_tagline" && targetId) {
        return {
          ...prev,
          projects: prev.projects.map((p) => (p.id === targetId ? { ...p, tagline: newText } : p)),
          updatedAt: new Date().toISOString(),
        };
      }
      if (targetField === "experience_description" && targetId) {
        return {
          ...prev,
          experience: prev.experience.map((e) => (e.id === targetId ? { ...e, description: newText } : e)),
          updatedAt: new Date().toISOString(),
        };
      }
      if (targetField === "experience_highlight" && targetId) {
        return {
          ...prev,
          experience: prev.experience.map((e) =>
            e.id === targetId ? { ...e, highlights: [newText, ...e.highlights.slice(1)] } : e
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return prev;
    });
  };

  // Visual Restyling: Updates appearance without touching any portfolio content
  const handleApplyAppearanceChange = (newAppearance: AppearanceSettings) => {
    updatePortfolio((prev) => ({
      ...prev,
      appearance: newAppearance,
      updatedAt: new Date().toISOString(),
    }));
  };

  if (!portfolio) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-sm font-mono">Initializing Studio Workspace...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden font-sans">
      {/* Top Action & Persistence Toolbar */}
      <EditorToolbar
        portfolioTitle={portfolio.title}
        onTitleChange={handleTitleChange}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        isPublished={portfolio.published}
        slug={portfolio.slug}
        activeTemplate={portfolio.appearance.templateId}
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        zoom={zoom}
        onZoomChange={setZoom}
        isDistractionFree={isDistractionFree}
        onToggleDistractionFree={() => setIsDistractionFree((prev) => !prev)}
        onTemplateChange={handleTemplateChange}
        onSave={manualSave}
        onTogglePublish={() => setIsPublishModalOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant("content")}
        onOpenUrlImport={() => setIsUrlModalOpen(true)}
        onOpenResumeImport={() => setIsResumeModalOpen(true)}
      />

      {/* Honest Operational Notification Bar */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="bg-blue-950/90 border-b border-blue-800 text-blue-200 text-xs py-1.5 px-4 text-center font-medium transition-all"
        >
          {feedbackMessage}
        </div>
      )}

      {/* Mobile Mode Switcher (< md screens) */}
      {!isDistractionFree && (
        <div className="md:hidden flex items-center justify-center p-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
          <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800 text-xs w-full max-w-xs">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                mobileView === "edit"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Edit Content</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                mobileView === "preview"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Canvas: Form Panels + Live Synchronized Preview */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Editor Sidebar: hidden if distraction-free, or on mobile when viewing preview */}
        {!isDistractionFree && (
          <EditorSidebar
            portfolio={portfolio}
            onChange={updatePortfolio}
            onOpenAiAssist={(field, sourceText, targetId) =>
              handleOpenAiAssistant("content", field, sourceText, targetId)
            }
            onOpenRestyle={() => handleOpenAiAssistant("restyle")}
            className={mobileView === "preview" ? "hidden md:flex" : "flex"}
          />
        )}

        {/* Live Preview Canvas: hidden on mobile when viewing edit form */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            !isDistractionFree && mobileView === "edit" ? "hidden md:flex" : "flex"
          }`}
        >
          <EditorPreview
            portfolio={portfolio}
            deviceMode={deviceMode}
            zoom={zoom}
            isDistractionFree={isDistractionFree}
            onExitDistractionFree={() => setIsDistractionFree(false)}
          />
        </div>
      </div>

      {/* Grounded AI Assistant Modal */}
      <AiAssistModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        portfolio={portfolio}
        initialTab={aiModalTab}
        initialTargetField={aiModalTargetField}
        initialSourceText={aiModalSourceText}
        initialTargetId={aiModalTargetId}
        onApplyContentChange={handleApplyContentChange}
        onApplyAppearanceChange={handleApplyAppearanceChange}
        onApplySuggestions={handleApplyAiSuggestions}
      />

      {/* Website URL Import Modal */}
      <UrlImportModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        existingPortfolio={portfolio}
        onApplyDirection={handleApplyUrlDirection}
      />

      {/* Resume Import Modal */}
      <ResumeImportModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        existingPortfolio={portfolio}
        onApplyMerged={handleApplyResumeMerged}
      />

      {/* Publishing, SEO & Custom Domain Review Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        portfolio={portfolio}
        onUpdatePortfolio={updatePortfolio}
        onPublishedChange={(isPub) => {
          setFeedbackMessage(
            isPub ? `Portfolio published live at /p/${portfolio.slug}` : "Portfolio unpublished"
          );
          setTimeout(() => setFeedbackMessage(null), 4000);
        }}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
