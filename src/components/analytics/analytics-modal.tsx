"use client";

import React from "react";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  isPublished: boolean;
  slug?: string;
  onUpgradeClick?: () => void;
}

export function AnalyticsModal({
  isOpen,
  onClose,
  portfolioId,
  isPublished,
  slug,
  onUpgradeClick,
}: AnalyticsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#0E1015]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="analytics-modal-title" className="text-sm font-semibold text-white">
                Portfolio Analytics & Discoverability
              </h2>
              <p className="text-xs text-zinc-400">
                Privacy-conscious, real-event visitor telemetry for your published portfolio.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
            aria-label="Close analytics modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-70px)]">
          <AnalyticsDashboard
            portfolioId={portfolioId}
            isPublished={isPublished}
            slug={slug}
            onUpgradeClick={onUpgradeClick}
          />
        </div>
      </div>
    </div>
  );
}
