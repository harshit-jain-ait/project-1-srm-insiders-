"use client";

import React from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { PortfolioRenderer } from "@/templates/renderer";
import { DeviceMode } from "./editor-toolbar";
import { Minimize2 } from "lucide-react";

interface EditorPreviewProps {
  portfolio: PortfolioData;
  deviceMode: DeviceMode;
  zoom?: number;
  isDistractionFree?: boolean;
  onExitDistractionFree?: () => void;
}

export function EditorPreview({
  portfolio,
  deviceMode,
  zoom = 1,
  isDistractionFree = false,
  onExitDistractionFree,
}: EditorPreviewProps) {
  return (
    <main
      className="flex-1 bg-[#090A0D] flex flex-col items-center justify-start overflow-auto p-0 md:p-6 select-text relative"
      aria-label="Live Portfolio Preview Canvas"
    >
      {/* Floating Exit Distraction-Free Bar */}
      {isDistractionFree && onExitDistractionFree && (
        <div className="sticky top-2 z-40 mb-3 bg-zinc-900/90 border border-zinc-700/80 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 text-xs text-zinc-300 backdrop-blur">
          <span>Full Preview Mode</span>
          <button
            type="button"
            onClick={onExitDistractionFree}
            className="flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 ml-2 cursor-pointer"
          >
            <Minimize2 className="w-3 h-3" />
            <span>Show Editor</span>
          </button>
        </div>
      )}

      {/* Frame Wrapper with Zoom Scale */}
      <div
        className="w-full flex justify-center transition-all duration-200"
        style={{
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: "top center",
        }}
      >
        {deviceMode === "desktop" && (
          <div className="w-full min-h-screen bg-zinc-950 shadow-2xl relative border-x border-zinc-850/80">
            <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
          </div>
        )}

        {deviceMode === "tablet" && (
          <div className="w-[768px] max-w-full my-4 rounded-2xl border-4 border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Tablet Frame Header */}
            <div className="h-6 bg-zinc-900 flex items-center justify-center border-b border-zinc-800">
              <div className="h-1.5 w-12 rounded-full bg-zinc-700" />
            </div>
            <div className="overflow-y-auto max-h-[860px]">
              <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
            </div>
          </div>
        )}

        {deviceMode === "mobile" && (
          <div className="w-[375px] max-w-full my-4 rounded-3xl border-4 border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="h-7 bg-zinc-900 flex items-center justify-center border-b border-zinc-850">
              <div className="h-2 w-20 rounded-full bg-zinc-800" />
            </div>
            <div className="overflow-y-auto max-h-[720px]">
              <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
