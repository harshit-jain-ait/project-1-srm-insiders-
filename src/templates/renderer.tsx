"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { getTemplate, getDefaultTemplate } from "./registry";
import { AlertCircle } from "lucide-react";

interface PortfolioRendererProps {
  portfolio: PortfolioData;
  isLivePreview?: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTemplateId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class TemplateErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[TemplateEngine] Render failure in template:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-lg mx-auto my-12 rounded-xl border border-red-800/80 bg-red-950/40 text-red-200 text-center space-y-3 font-sans">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Template Rendering Notice</h3>
          <p className="text-xs text-red-300/80 leading-relaxed">
            The selected template encountered an issue while rendering. Your portfolio content is safe and intact.
          </p>
          <div className="text-[11px] font-mono bg-black/40 p-2 rounded text-zinc-400 overflow-x-auto text-left">
            {this.state.error?.message || "Unknown rendering exception"}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Central Portfolio Template Engine Renderer.
 * Resolves registered templates by stable ID, provides graceful fallback on unrecognized IDs,
 * preserves 100% of portfolio data, and prevents rendering errors from breaking the page.
 */
export function PortfolioRenderer({
  portfolio,
  isLivePreview = false,
}: PortfolioRendererProps) {
  const requestedId = portfolio.appearance.templateId;
  const registered = getTemplate(requestedId);
  const isUnregistered = !registered;
  const activeTemplate = registered || getDefaultTemplate();
  const TemplateComponent = activeTemplate.component;

  return (
    <TemplateErrorBoundary fallbackTemplateId={requestedId}>
      {isUnregistered && isLivePreview && (
        <div className="bg-amber-950/80 border-b border-amber-800 text-amber-200 text-xs py-2 px-4 flex items-center justify-between font-mono">
          <span>Notice: Template &quot;{requestedId}&quot; not found in registry. Displaying default &quot;{activeTemplate.metadata.name}&quot;.</span>
        </div>
      )}
      <TemplateComponent portfolio={portfolio} isLivePreview={isLivePreview} />
    </TemplateErrorBoundary>
  );
}
