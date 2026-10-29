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
      className="flex-1 bg-[#06080e] flex flex-col items-center justify-start overflow-y-auto p-3 sm:p-5 lg:p-7 select-text relative transition-all duration-300"
      aria-label="Live Portfolio Preview Canvas"
    >
      {/* Outer ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Floating Exit Distraction-Free Bar */}
      {isDistractionFree && onExitDistractionFree && (
        <div className="sticky top-2 z-50 mb-3 bg-zinc-900/90 border border-zinc-700/80 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 text-xs text-zinc-300 backdrop-blur">
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
        className="w-full flex justify-center transition-all duration-200 z-10"
        style={{
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: "top center",
        }}
      >
        {deviceMode === "desktop" && (
          <div
            className={`w-full transition-all duration-300 ${
              isDistractionFree
                ? "min-h-screen bg-zinc-950 shadow-2xl relative border-x border-zinc-850/80"
                : "max-w-6xl xl:max-w-7xl w-full rounded-2xl md:rounded-3xl border border-slate-800/90 bg-[#090d16] text-white shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-left"
            }`}
          >
            <PortfolioRenderer portfolio={portfolio} isLivePreview={true} deviceMode="desktop" />
          </div>
        )}

        {deviceMode === "tablet" && (
          <div className="w-[768px] max-w-full my-4 rounded-2xl border-4 border-slate-800 bg-[#090d16] shadow-2xl overflow-hidden flex flex-col">
            {/* Tablet Frame Header */}
            <div className="h-6 bg-slate-900 flex items-center justify-center border-b border-slate-800">
              <div className="h-1.5 w-12 rounded-full bg-slate-700" />
            </div>
            <div className="overflow-y-auto max-h-[860px] overflow-x-hidden">
              <PortfolioRenderer portfolio={portfolio} isLivePreview={true} deviceMode="tablet" />
            </div>
          </div>
        )}

        {deviceMode === "mobile" && (
          <div className="w-[375px] max-w-full my-4 rounded-3xl border-4 border-slate-800 bg-[#090d16] shadow-2xl overflow-hidden flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="h-7 bg-slate-900 flex items-center justify-center border-b border-slate-800">
              <div className="h-2 w-20 rounded-full bg-slate-700" />
            </div>
            <div className="overflow-y-auto max-h-[720px] overflow-x-hidden">
              <PortfolioRenderer portfolio={portfolio} isLivePreview={true} deviceMode="mobile" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
