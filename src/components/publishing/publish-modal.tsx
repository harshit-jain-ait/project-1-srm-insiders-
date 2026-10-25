"use client";

import React, { useState } from "react";
import { PortfolioData, validatePublishReadiness, SeoSettings, CustomDomainConfig } from "@/lib/schema/portfolio";
import { Button } from "@/components/ui/button";
import { SeoForm } from "@/components/forms/seo-form";
import { CustomDomainForm } from "@/components/forms/custom-domain-form";
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Search,
  X,
  ShieldCheck,
} from "lucide-react";

export type PublishModalTab = "publish" | "seo" | "domain";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onUpdatePortfolio: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onPublishedChange?: (published: boolean, publishedAt: string | null) => void;
}

export function PublishModal({
  isOpen,
  onClose,
  portfolio,
  onUpdatePortfolio,
  onPublishedChange,
}: PublishModalProps) {
  const [activeTab, setActiveTab] = useState<PublishModalTab>("publish");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const appBaseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const publicUrl =
    portfolio.customDomain?.status === "active" && portfolio.customDomain?.domain
      ? `https://${portfolio.customDomain.domain}`
      : `${appBaseUrl}/p/${portfolio.slug}`;

  const readiness = validatePublishReadiness(portfolio);
  const isPublished = portfolio.published;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePublish = async () => {
    if (!readiness.isReady) {
      setFeedback({
        type: "error",
        message: readiness.errors[0] || "Resolve validation errors before publishing.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/portfolios/${portfolio.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({
          type: "error",
          message: data.error || "Failed to publish portfolio.",
        });
      } else {
        onUpdatePortfolio((prev) => ({
          ...prev,
          published: true,
          publishedAt: data.data.publishedAt,
        }));
        onPublishedChange?.(true, data.data.publishedAt);
        setFeedback({
          type: "success",
          message: `Portfolio is published live at ${data.data.publicUrl || publicUrl}!`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error occurred during publishing.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("Are you sure you want to unpublish your portfolio? Public visitors will no longer be able to access it.")) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/portfolios/${portfolio.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpublish" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({
          type: "error",
          message: data.error || "Failed to unpublish portfolio.",
        });
      } else {
        onUpdatePortfolio((prev) => ({
          ...prev,
          published: false,
          publishedAt: null,
        }));
        onPublishedChange?.(false, null);
        setFeedback({
          type: "success",
          message: "Portfolio has been unpublished. Public access removed.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error occurred during unpublish request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeoChange = (updatedSeo: SeoSettings) => {
    onUpdatePortfolio((prev) => ({
      ...prev,
      seo: updatedSeo,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDomainChange = (updatedDomain: CustomDomainConfig) => {
    onUpdatePortfolio((prev) => ({
      ...prev,
      customDomain: updatedDomain,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-950/60 border border-blue-900/60 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Publishing & Public Identity</h2>
              <p className="text-xs text-zinc-400">
                Manage publication status, public URLs, SEO settings, and custom domains.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-5 gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("publish")}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "publish"
                ? "border-[#356ae6] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Review & Publish</span>
            {isPublished ? (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                Live
              </span>
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                Draft
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "seo"
                ? "border-[#356ae6] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>SEO & Social</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("domain")}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "domain"
                ? "border-[#356ae6] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Custom Domain</span>
            {portfolio.customDomain?.status === "active" && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Review & Publish */}
          {activeTab === "publish" && (
            <div className="space-y-6">
              {/* Publication Status Card */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      isPublished
                        ? "bg-emerald-950/50 border border-emerald-800 text-emerald-400"
                        : "bg-zinc-800/80 border border-zinc-700 text-zinc-400"
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {isPublished ? "Portfolio is Published Live" : "Portfolio is in Draft Mode"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {isPublished
                        ? `Last published on ${new Date(portfolio.publishedAt || "").toLocaleDateString()}`
                        : "Only you can see this draft in the editor."}
                    </p>
                  </div>
                </div>

                {isPublished && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUnpublish}
                    isLoading={isSubmitting}
                    className="h-8 text-xs text-zinc-400 hover:text-red-400 border-zinc-800"
                  >
                    Unpublish
                  </Button>
                )}
              </div>

              {/* Public URL Card */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
                <span className="text-xs font-semibold text-zinc-400">Public Address:</span>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs">
                  <span className="text-zinc-200 truncate pr-2">{publicUrl}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {isPublished && (
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-zinc-400 hover:text-blue-400 rounded hover:bg-zinc-800 transition-colors"
                        title="Open live site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Pre-Publish Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-300">Pre-Publish Verification:</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-zinc-850 bg-zinc-900/40">
                    <span className="text-zinc-300">Full Name</span>
                    <span className="text-zinc-400 font-mono">
                      {portfolio.profile.fullName || <span className="text-red-400">Required</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-zinc-850 bg-zinc-900/40">
                    <span className="text-zinc-300">Portfolio Title</span>
                    <span className="text-zinc-400 font-mono">
                      {portfolio.title || <span className="text-red-400">Required</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-zinc-850 bg-zinc-900/40">
                    <span className="text-zinc-300">URL Slug</span>
                    <span className="text-zinc-400 font-mono">
                      {portfolio.slug || <span className="text-red-400">Required</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-zinc-850 bg-zinc-900/40">
                    <span className="text-zinc-300">Active Template</span>
                    <span className="text-zinc-400 font-mono">
                      {portfolio.appearance.templateId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validation Errors Notice */}
              {!readiness.isReady && (
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/60 text-xs text-red-200 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Complete the following before publishing:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-300 pl-1">
                    {readiness.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEO Settings */}
          {activeTab === "seo" && (
            <SeoForm
              seo={portfolio.seo}
              portfolioTitle={portfolio.title}
              fullName={portfolio.profile.fullName}
              headline={portfolio.profile.headline}
              slug={portfolio.slug}
              customDomain={portfolio.customDomain?.domain}
              onSeoChange={handleSeoChange}
            />
          )}

          {/* TAB 3: Custom Domain */}
          {activeTab === "domain" && (
            <CustomDomainForm
              portfolioId={portfolio.id}
              customDomain={portfolio.customDomain}
              onDomainChange={handleDomainChange}
            />
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-950/40 border border-emerald-800/60 text-emerald-200"
                  : "bg-red-950/40 border border-red-800/60 text-red-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          {activeTab === "publish" && (
            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={handlePublish}
              isLoading={isSubmitting}
              disabled={!readiness.isReady}
              className="gap-2 font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isPublished ? "Update Live Site" : "Publish Portfolio"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
