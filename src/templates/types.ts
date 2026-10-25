import React from "react";
import { PortfolioData, TemplateId, SectionKey } from "@/lib/schema/portfolio";

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  category: "Editorial" | "Engineering" | "Executive" | "Creative";
  tagline: string;
  tags: string[];
  features: string[];
  previewAccent: string;
  supportedSections: SectionKey[];
}

export interface TemplateProps {
  portfolio: PortfolioData;
  isLivePreview?: boolean;
}

export type TemplateComponent = React.ComponentType<TemplateProps>;

export interface RegisteredTemplate {
  metadata: TemplateMetadata;
  component: TemplateComponent;
}
