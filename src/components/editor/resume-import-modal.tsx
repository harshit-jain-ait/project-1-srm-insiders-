"use client";

import React from "react";
import { ResumeImportWizard } from "@/components/resume-import/resume-import-wizard";
import { PortfolioData } from "@/lib/schema/portfolio";
import { X } from "lucide-react";

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPortfolio: PortfolioData;
  onApplyMerged: (mergedPortfolio: PortfolioData) => void;
}

export function ResumeImportModal({
  isOpen,
  onClose,
  existingPortfolio,
  onApplyMerged,
}: ResumeImportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-150 font-sans">
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
          <ResumeImportWizard
            existingPortfolio={existingPortfolio}
            onApply={(merged) => {
              onApplyMerged(merged);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
