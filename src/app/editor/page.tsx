"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PortfolioData, TemplateId, AppearanceSettings } from "@/lib/schema/portfolio";
import { EditorToolbar, DeviceMode } from "@/components/editor/editor-toolbar";
import { EditorLeftNav, LeftNavSection } from "@/components/editor/editor-left-nav";
import { EditorInspector } from "@/components/editor/editor-inspector";
import { EditorPreview } from "@/components/editor/editor-preview";
import { getTemplate } from "@/templates/registry";
import { AiAssistModal } from "@/components/editor/ai-assist-modal";
import { UrlImportModal } from "@/components/editor/url-import-modal";
import { ResumeImportModal } from "@/components/editor/resume-import-modal";
import { PublishModal } from "@/components/publishing/publish-modal";
import { VersionHistoryPanel } from "@/components/editor/version-history-panel";
import { AnalyticsModal } from "@/components/analytics/analytics-modal";
import { usePortfolioEditor } from "@/components/editor/use-portfolio-editor";
import { DesignDirection } from "@/lib/url-import/types";
import { ContentTargetField } from "@/lib/ai-assistant/types";
import { AssistantModalTab } from "@/components/ai-assistant/ai-assistant-modal";
import { Loader2, Sliders, Eye } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("id");
  const templateParam = (searchParams.get("template") as TemplateId | null) || "bento-studio";

  // Viewport & Studio UI state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [zoom, setZoom] = useState<number>(1);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [activeLeftNavSection, setActiveLeftNavSection] = useState<LeftNavSection>("sections");

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<AssistantModalTab>("content");
  const [aiModalTargetField, setAiModalTargetField] = useState<ContentTargetField>("bio");
  const [aiModalSourceText, setAiModalSourceText] = useState<string>("");
  const [aiModalTargetId, setAiModalTargetId] = useState<string>("");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

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

  // Content Intelligence
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

  // Visual Restyling
  const handleApplyAppearanceChange = (newAppearance: AppearanceSettings) => {
    updatePortfolio((prev) => ({
      ...prev,
      appearance: newAppearance,
      updatedAt: new Date().toISOString(),
    }));
    setFeedbackMessage("Visual style and theme applied successfully.");
  };

  if (!portfolio) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#07090e] text-slate-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-sm font-mono">Initializing Studio Workspace...</span>
      </div>
    );
  }

  // Ensure default demo text if opening a fresh blank portfolio
  const effectivePortfolio: PortfolioData = {
    ...portfolio,
    title: portfolio.title || "My Portfolio",
    profile: {
      ...portfolio.profile,
      fullName: portfolio.profile.fullName || "Alex Carter",
      headline: portfolio.profile.headline || "Product Designer • Developer",
      bio:
        portfolio.profile.bio ||
        "I create modern, user-focused digital experiences that make a difference. Passionate about design, technology and building meaningful products.",
      statusBadge: portfolio.profile.statusBadge || "Available for new opportunities",
      avatarUrl: portfolio.profile.avatarUrl || "/images/studio/alex-carter.jpg",
      location: portfolio.profile.location || "New Delhi, India",
    },
    projects:
      portfolio.projects && portfolio.projects.length > 0
        ? portfolio.projects
        : [
            {
              id: "proj-1",
              title: "Design System",
              tagline: "Component architecture & tokens",
              description:
                "A modern design system for building scalable and consistent web applications across multiple product suites.",
              category: "design",
              status: "completed",
              featured: true,
              visible: true,
              slug: "design-system",
              technologies: ["React", "TypeScript", "Tailwind CSS", "Figma"],
              coverImageUrl: "/images/studio/design-system.jpg",
              liveUrl: "https://example.com/design-system",
              repoUrl: "https://github.com/example/design-system",
              startDate: "",
              endDate: "",
              order: 0,
            },
            {
              id: "proj-2",
              title: "Web Application Platform",
              tagline: "Cloud analytics & performance dashboard",
              description:
                "High-performance cloud dashboard monitoring microservice reliability, request throughput, and real-time events.",
              category: "software",
              status: "completed",
              featured: false,
              visible: true,
              slug: "web-application",
              technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
              coverImageUrl: "/images/studio/web-app.jpg",
              liveUrl: "https://example.com/web-app",
              repoUrl: "https://github.com/example/web-app",
              startDate: "",
              endDate: "",
              order: 1,
            },
          ],
    skills:
      portfolio.skills && portfolio.skills.length > 0
        ? portfolio.skills
        : [
            { id: "s-1", name: "Next.js", category: "Framework", level: "expert", order: 0 },
            { id: "s-2", name: "React", category: "Frontend", level: "expert", order: 1 },
            { id: "s-3", name: "TypeScript", category: "Language", level: "expert", order: 2 },
            { id: "s-4", name: "Tailwind CSS", category: "Styling", level: "advanced", order: 3 },
            { id: "s-5", name: "Figma", category: "Design", level: "advanced", order: 4 },
            { id: "s-6", name: "Node.js", category: "Backend", level: "advanced", order: 5 },
          ],
    experience:
      portfolio.experience && portfolio.experience.length > 0
        ? portfolio.experience
        : [
            {
              id: "exp-1",
              company: "Design & Tech Studio",
              role: "Lead Product Designer",
              location: "Remote",
              startDate: "2023-01",
              endDate: "Present",
              current: true,
              description:
                "Leading digital product design, component systems, and frontend architectural development for international clients.",
              highlights: [
                "Architected cross-platform design systems used by over 50k active users.",
                "Reduced user task completion latency by 38% through focused interaction modeling.",
              ],
              order: 0,
            },
          ],
  };

  const activeTemplateMeta = getTemplate(effectivePortfolio.appearance.templateId);
  const activeTemplateName = activeTemplateMeta?.metadata.name || "Bento Studio";

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. TOP BAR: Portfolify, My Portfolio, Saved Badge, Device Switchers, Settings, Preview, Publish */}
      <EditorToolbar
        portfolioTitle={effectivePortfolio.title}
        onTitleChange={handleTitleChange}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        isPublished={effectivePortfolio.published}
        slug={effectivePortfolio.slug}
        activeTemplate={effectivePortfolio.appearance.templateId}
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
        onOpenVersionHistory={() => setIsHistoryModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
      />

      {/* Operational Notification Feedback Bar */}
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
        <div className="md:hidden flex items-center justify-center p-2 bg-[#0c101a] border-b border-slate-800 shrink-0">
          <div className="inline-flex rounded-xl bg-[#080b12] p-1 border border-slate-800 text-xs w-full max-w-xs">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                mobileView === "edit"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
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
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN 3-PANEL STUDIO CANVAS: Left Nav Rail + Center Live Preview + Right Inspector */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Panel 1: Left Navigation Sidebar */}
        {!isDistractionFree && (
          <EditorLeftNav
            activeSection={activeLeftNavSection}
            onSelectSection={setActiveLeftNavSection}
            templateName={activeTemplateName}
            className={mobileView === "preview" ? "hidden md:flex" : "hidden md:flex"}
          />
        )}

        {/* Panel 2: Center Live Synchronized Studio Canvas */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            !isDistractionFree && mobileView === "edit" ? "hidden md:flex" : "flex"
          }`}
        >
          <EditorPreview
            portfolio={effectivePortfolio}
            deviceMode={deviceMode}
            zoom={zoom}
            isDistractionFree={isDistractionFree}
            onExitDistractionFree={() => setIsDistractionFree(false)}
          />
        </div>

        {/* Panel 3: Right Inspector Panel */}
        {!isDistractionFree && (
          <EditorInspector
            portfolio={effectivePortfolio}
            onChange={updatePortfolio}
            activeNavSection={activeLeftNavSection}
            onTemplateChange={handleTemplateChange}
            onOpenAiAssist={(field, sourceText, targetId) =>
              handleOpenAiAssistant("content", field, sourceText, targetId)
            }
            onOpenRestyle={() => handleOpenAiAssistant("restyle")}
            className={mobileView === "preview" ? "hidden md:flex" : "flex"}
          />
        )}
      </div>

      {/* Grounded AI Assistant Modal */}
      <AiAssistModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        portfolio={effectivePortfolio}
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
        existingPortfolio={effectivePortfolio}
        onApplyDirection={handleApplyUrlDirection}
      />

      {/* Resume Import Modal */}
      <ResumeImportModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        existingPortfolio={effectivePortfolio}
        onApplyMerged={handleApplyResumeMerged}
      />

      {/* Publishing, SEO & Custom Domain Review Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        portfolio={effectivePortfolio}
        onUpdatePortfolio={updatePortfolio}
        onPublishedChange={(isPub) => {
          setFeedbackMessage(
            isPub ? `Portfolio published live at /p/${effectivePortfolio.slug}` : "Portfolio unpublished"
          );
          setTimeout(() => setFeedbackMessage(null), 4000);
        }}
      />

      {/* Version History & Recovery Panel */}
      <VersionHistoryPanel
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        portfolioId={effectivePortfolio.id}
        onRestore={(restored) => {
          updatePortfolio(() => restored);
          setFeedbackMessage("Snapshot successfully restored to editor draft.");
          setTimeout(() => setFeedbackMessage(null), 5000);
        }}
        onUpgradeClick={() => {
          window.open("/templates", "_blank");
        }}
      />

      {/* Portfolio Analytics & Telemetry Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        portfolioId={effectivePortfolio.id}
        isPublished={effectivePortfolio.published}
        slug={effectivePortfolio.slug}
        onUpgradeClick={() => {
          window.open("/templates", "_blank");
        }}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-[#07090e] text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
