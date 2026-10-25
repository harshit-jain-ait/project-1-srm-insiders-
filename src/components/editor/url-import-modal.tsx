"use client";

import React from "react";
import { UrlImportWizard } from "@/components/url-import/url-import-wizard";
import { PortfolioData } from "@/lib/schema/portfolio";
import { DesignDirection } from "@/lib/url-import/types";
import { X } from "lucide-react";

interface UrlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPortfolio: PortfolioData;
  onApplyDirection: (direction: DesignDirection, updatedPortfolio?: Partial<PortfolioData>) => void;
}

export function UrlImportModal({
  isOpen,
  onClose,
  existingPortfolio,
  onApplyDirection,
}: UrlImportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-[#0E1015] border border-zinc-800 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <UrlImportWizard
            existingPortfolio={existingPortfolio}
            onSelectDirection={(direction, updatedDraft) => {
              onApplyDirection(direction, updatedDraft);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
