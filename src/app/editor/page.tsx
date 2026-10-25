"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PortfolioData, initializePortfolioWithTemplate, validatePublishReadiness, TemplateId } from "@/lib/schema/portfolio";
import { EditorToolbar, DeviceMode } from "@/components/editor/editor-toolbar";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorPreview } from "@/components/editor/editor-preview";
import { AiAssistModal } from "@/components/editor/ai-assist-modal";
import { Loader2 } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("id");
  const templateParam = searchParams.get("template") as TemplateId | null;

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Load existing portfolio or initialize new empty portfolio
  useEffect(() => {
    async function loadPortfolio() {
      if (portfolioId) {
        try {
          const res = await fetch(`/api/portfolios/${portfolioId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
              setPortfolio(data.data);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to fetch existing portfolio:", err);
        }
      }

      // Initialize fresh empty portfolio using verified template resolution
      const empty = initializePortfolioWithTemplate(templateParam || "minimal-portfolio");
      setPortfolio(empty);
    }

    loadPortfolio();
  }, [portfolioId, templateParam]);

  const handlePortfolioChange = (updated: PortfolioData) => {
    setPortfolio(updated);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!portfolio) return;
    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolio),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPortfolio(data.data);
        setHasUnsavedChanges(false);
        setFeedbackMessage("Portfolio saved successfully");
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        setFeedbackMessage(data.error || "Save failed");
      }
    } catch {
      setFeedbackMessage("Network error during save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!portfolio) return;

    const action = portfolio.published ? "unpublish" : "publish";

    // Validate readiness before publishing
    if (action === "publish") {
      const readiness = validatePublishReadiness(portfolio);
      if (!readiness.isReady) {
        setFeedbackMessage(`Cannot publish: ${readiness.errors[0]}`);
        setTimeout(() => setFeedbackMessage(null), 5000);
        return;
      }
    }

    setIsSaving(true);

    try {
      // First ensure draft is saved
      await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolio),
      });

      const res = await fetch(`/api/portfolios/${portfolio.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPortfolio({
          ...portfolio,
          published: data.data.published,
          publishedAt: data.data.publishedAt,
        });
        setHasUnsavedChanges(false);
        setFeedbackMessage(
          data.data.published
            ? `Portfolio is live at /p/${portfolio.slug}`
            : "Portfolio unpublished"
        );
        setTimeout(() => setFeedbackMessage(null), 4000);
      }
    } catch {
      setFeedbackMessage("Failed to update publishing state");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateChange = (tpl: TemplateId) => {
    if (!portfolio) return;
    handlePortfolioChange({
      ...portfolio,
      appearance: {
        ...portfolio.appearance,
        templateId: tpl,
      },
    });
  };

  const handleApplyAiSuggestions = (suggestions: Partial<PortfolioData>) => {
    if (!portfolio) return;

    handlePortfolioChange({
      ...portfolio,
      profile: {
        ...portfolio.profile,
        ...(suggestions.profile || {}),
      },
      skills: suggestions.skills ? [...portfolio.skills, ...suggestions.skills] : portfolio.skills,
      projects: suggestions.projects ? [...portfolio.projects, ...suggestions.projects] : portfolio.projects,
      experience: suggestions.experience ? [...portfolio.experience, ...suggestions.experience] : portfolio.experience,
    });
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
      {/* Top Action Bar */}
      <EditorToolbar
        portfolioTitle={portfolio.title}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        isPublished={portfolio.published}
        slug={portfolio.slug}
        activeTemplate={portfolio.appearance.templateId}
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        onTemplateChange={handleTemplateChange}
        onSave={handleSave}
        onTogglePublish={handleTogglePublish}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
      />

      {feedbackMessage && (
        <div className="bg-blue-950/80 border-b border-blue-800 text-blue-200 text-xs py-1.5 px-4 text-center">
          {feedbackMessage}
        </div>
      )}

      {/* Editor Main Canvas (Sidebar + Live Preview) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <EditorSidebar portfolio={portfolio} onChange={handlePortfolioChange} />
        <EditorPreview portfolio={portfolio} deviceMode={deviceMode} />
      </div>

      {/* AI Assistant Modal */}
      <AiAssistModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplySuggestions={handleApplyAiSuggestions}
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
