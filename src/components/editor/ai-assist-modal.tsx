import React from "react";
import { AiGeneratorWizard } from "@/components/ai/ai-generator-wizard";
import { PortfolioData } from "@/lib/schema/portfolio";
import { X } from "lucide-react";

interface AiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestions: (extracted: Partial<PortfolioData>) => void;
}

export function AiAssistModal({ isOpen, onClose, onApplySuggestions }: AiAssistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <AiGeneratorWizard
          onApplyToExisting={onApplySuggestions}
          onCloseModal={onClose}
        />
      </div>
    </div>
  );
}
