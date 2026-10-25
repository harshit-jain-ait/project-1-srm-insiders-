import React from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { getTemplate, getDefaultTemplate } from "./registry";

interface PortfolioRendererProps {
  portfolio: PortfolioData;
  isLivePreview?: boolean;
}

export function PortfolioRenderer({ portfolio, isLivePreview = false }: PortfolioRendererProps) {
  const registered = getTemplate(portfolio.appearance.templateId) || getDefaultTemplate();
  const Component = registered.component;

  return <Component portfolio={portfolio} isLivePreview={isLivePreview} />;
}
