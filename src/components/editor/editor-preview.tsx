import React from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { PortfolioRenderer } from "@/templates/renderer";
import { DeviceMode } from "./editor-toolbar";

interface EditorPreviewProps {
  portfolio: PortfolioData;
  deviceMode: DeviceMode;
}

export function EditorPreview({ portfolio, deviceMode }: EditorPreviewProps) {
  const containerClasses = {
    desktop: "w-full h-full",
    tablet: "w-[768px] max-w-full my-6 rounded-xl border border-zinc-700 shadow-2xl h-[calc(100%-3rem)]",
    mobile: "w-[375px] max-w-full my-6 rounded-2xl border border-zinc-700 shadow-2xl h-[calc(100%-3rem)]",
  };

  return (
    <main
      className="flex-1 bg-zinc-900/60 flex items-center justify-center overflow-auto p-0 md:p-4 select-text"
      aria-label="Live Portfolio Preview Canvas"
    >
      <div
        className={`bg-white dark:bg-zinc-950 overflow-y-auto transition-all duration-200 relative ${containerClasses[deviceMode]}`}
      >
        <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
      </div>
    </main>
  );
}
