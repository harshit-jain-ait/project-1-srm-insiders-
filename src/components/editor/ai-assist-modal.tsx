"use client";

import React from "react";
import { PortfolioData, AppearanceSettings } from "@/lib/schema/portfolio";
import { ContentTargetField } from "@/lib/ai-assistant/types";
import { AiAssistantModal, AssistantModalTab } from "@/components/ai-assistant/ai-assistant-modal";

interface AiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio?: PortfolioData;
  initialTab?: AssistantModalTab;
  initialTargetField?: ContentTargetField;
  initialSourceText?: string;
  initialTargetId?: string;
  onApplySuggestions?: (extracted: Partial<PortfolioData>) => void;
  onApplyContentChange?: (newText: string, targetField: ContentTargetField, targetId?: string) => void;
  onApplyAppearanceChange?: (newAppearance: AppearanceSettings) => void;
}

export function AiAssistModal({
  isOpen,
  onClose,
  portfolio,
  initialTab = "content",
  initialTargetField = "bio",
  initialSourceText,
  initialTargetId,
  onApplySuggestions,
  onApplyContentChange,
  onApplyAppearanceChange,
}: AiAssistModalProps) {
  if (!isOpen || !portfolio) return null;

  return (
    <AiAssistantModal
      isOpen={isOpen}
      onClose={onClose}
      portfolio={portfolio}
      initialTab={initialTab}
      initialTargetField={initialTargetField}
      initialSourceText={initialSourceText}
      initialTargetId={initialTargetId}
      onApplyContentChange={(newText, targetField, targetId) => {
        onApplyContentChange?.(newText, targetField, targetId);
      }}
      onApplyAppearanceChange={(newAppearance) => {
        onApplyAppearanceChange?.(newAppearance);
      }}
      onApplyFullGeneration={(extracted) => {
        onApplySuggestions?.(extracted);
      }}
    />
  );
}
