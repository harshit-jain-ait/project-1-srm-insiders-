"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, Component, ErrorInfo, ReactNode } from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { PortfolioRenderer } from "@/templates/renderer";
import { DeviceMode } from "./editor-toolbar";
import {
  Minimize2,
  RefreshCw,
  AlertTriangle,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Layers,
} from "lucide-react";

// ── Preview Error Boundary ──────────────────────────────────────────────────
interface PreviewErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}
interface PreviewErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
class PreviewErrorBoundary extends Component<PreviewErrorBoundaryProps, PreviewErrorBoundaryState> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[EditorPreview] Render exception:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-[#070B14] border border-red-900/50 rounded-2xl text-slate-200">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-orbitron text-lg font-bold text-white mb-2 tracking-wide">
            PREVIEW RENDER ANOMALY
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed font-mono">
            {this.state.error?.message || "An unexpected error occurred while rendering the template preview."}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              this.props.onReset?.();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold font-mono transition-all cursor-pointer shadow-[0_0_15px_rgba(75,229,255,0.2)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Preview</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main EditorPreview Component ────────────────────────────────────────────
export interface EditorPreviewProps {
  portfolio: PortfolioData;
  deviceMode: DeviceMode;
  zoom?: number;
  isDistractionFree?: boolean;
  onExitDistractionFree?: () => void;
  isLoading?: boolean;
}

export function EditorPreview({
  portfolio,
  deviceMode,
  zoom = 1,
  isDistractionFree = false,
  onExitDistractionFree,
  isLoading = false,
}: EditorPreviewProps) {
  // References for independent scrolling & scroll percentage retention
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRatioRef = useRef<number>(0);
  const prevDeviceModeRef = useRef<DeviceMode>(deviceMode);

  // Responsive device frame scale factor (fit-to-height for tablet / mobile)
  const [frameScale, setFrameScale] = useState<number>(1);

  // Track scroll position percentage before device switch
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      scrollRatioRef.current = el.scrollTop / maxScroll;
    }
  };

  // Compute scale factor for Tablet / Mobile frames based on available container dimensions
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || deviceMode === "desktop") {
        setFrameScale(1);
        return;
      }

      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;

      // Desired frame heights: Tablet ~920px, Mobile ~840px
      const targetHeight = deviceMode === "tablet" ? 920 : 844;
      const targetWidth = deviceMode === "tablet" ? 768 : 390;

      // Available space with 40px margin
      const availHeight = Math.max(300, containerHeight - 64);
      const availWidth = Math.max(300, containerWidth - 32);

      const heightRatio = availHeight / targetHeight;
      const widthRatio = availWidth / targetWidth;

      // Fit within available container without distortion
      const computedScale = Math.min(1, heightRatio, widthRatio);
      setFrameScale(Math.max(0.45, computedScale));
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [deviceMode]);

  // Restore scroll position as a percentage of total height when switching modes
  useLayoutEffect(() => {
    if (prevDeviceModeRef.current !== deviceMode && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        el.scrollTop = scrollRatioRef.current * maxScroll;
      }
      prevDeviceModeRef.current = deviceMode;
    }
  }, [deviceMode]);

  // Check if portfolio is in empty state
  const isEmpty =
    !portfolio.profile?.fullName &&
    (!portfolio.projects || portfolio.projects.length === 0) &&
    (!portfolio.skills || portfolio.skills.length === 0);

  return (
    <section
      ref={containerRef}
      className={`relative flex-1 w-full h-full bg-[#07090e] flex flex-col items-center justify-start overflow-hidden select-text ${
        isDistractionFree ? "p-0" : "p-3 sm:p-5 lg:p-6"
      }`}
      aria-label="Live Portfolio Preview Panel"
    >
      {/* Outer ambient cosmic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Floating Exit Distraction-Free Bar */}
      {isDistractionFree && onExitDistractionFree && (
        <div className="fixed top-4 right-6 z-50 bg-[#0c1426]/90 border border-cyan-500/40 rounded-full px-4 py-2 shadow-[0_0_25px_rgba(75,229,255,0.25)] flex items-center gap-3 text-xs text-slate-200 backdrop-blur-md">
          <span className="font-orbitron text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
            FULL PREVIEW
          </span>
          <button
            type="button"
            onClick={onExitDistractionFree}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-white font-mono text-[11px] font-semibold border border-cyan-400/50 transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Show Editor</span>
          </button>
        </div>
      )}

      {/* Device Mode Subtitle Label */}
      {!isDistractionFree && deviceMode !== "desktop" && (
        <div className="shrink-0 mb-2.5 flex items-center gap-2 text-[11px] font-mono text-[#62748E] select-none">
          {deviceMode === "tablet" ? (
            <>
              <Tablet className="w-3.5 h-3.5 text-slate-400" />
              <span>Tablet · 768px</span>
              {frameScale < 1 && (
                <span className="text-[10px] text-slate-500">({Math.round(frameScale * 100)}% fit)</span>
              )}
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Mobile · 390px</span>
              {frameScale < 1 && (
                <span className="text-[10px] text-slate-500">({Math.round(frameScale * 100)}% fit)</span>
              )}
            </>
          )}
        </div>
      )}

      {/* Main Preview Frame Container */}
      <div
        className="w-full flex-1 flex items-center justify-center overflow-hidden transition-all duration-300 relative"
        style={{
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: "top center",
        }}
      >
        <PreviewErrorBoundary>
          {isLoading ? (
            /* Loading State */
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#090D16] border border-[#202C40] rounded-2xl text-slate-400 space-y-4">
              <div className="relative w-14 h-14">
                <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <p className="font-orbitron text-xs font-semibold text-slate-300 tracking-wider uppercase">
                Synchronizing Cosmic Preview...
              </p>
            </div>
          ) : isEmpty ? (
            /* Empty State */
            <div className="w-full max-w-xl p-10 bg-[#090D16] border border-[#202C40] rounded-2xl text-center space-y-4 my-auto shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto shadow-[0_0_20px_rgba(75,229,255,0.2)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron font-bold text-white text-base tracking-wide">
                ORBIT READY FOR DATA
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Start adding your profile, mission briefing, skills, or projects in the left editor panel to see your live portfolio transmission take shape.
              </p>
            </div>
          ) : (
            /* Rendered Device Frame */
            <>
              {/* DESKTOP MODE: Fluid width, fills panel, independent scroll container */}
              {deviceMode === "desktop" && (
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className={`w-full h-full transition-all duration-300 overflow-y-auto overflow-x-hidden ${
                    isDistractionFree
                      ? "bg-[#070B14] shadow-2xl"
                      : "rounded-2xl border border-[#202C40] bg-[#070B14] shadow-[0_15px_50px_rgba(0,0,0,0.7)]"
                  }`}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#202C40 transparent",
                  }}
                >
                  <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
                </div>
              )}

              {/* TABLET MODE: 768px simulated width, centered, scaled via CSS transform */}
              {deviceMode === "tablet" && (
                <div
                  className="flex flex-col items-center justify-center origin-top transition-transform duration-200"
                  style={{
                    transform: `scale(${frameScale})`,
                  }}
                >
                  <div
                    className="w-[768px] h-[920px] rounded-[32px] border-[10px] border-[#161f2e] bg-[#070B14] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-[#202C40] flex flex-col overflow-hidden relative"
                  >
                    {/* Tablet Top Bezel & Camera */}
                    <div className="h-5 bg-[#161f2e] shrink-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
                    </div>

                    {/* Tablet Scroll Viewport */}
                    <div
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#070B14]"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#202C40 transparent",
                      }}
                    >
                      <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
                    </div>
                  </div>
                </div>
              )}

              {/* MOBILE MODE: 390px simulated width, centered, scaled via CSS transform */}
              {deviceMode === "mobile" && (
                <div
                  className="flex flex-col items-center justify-center origin-top transition-transform duration-200"
                  style={{
                    transform: `scale(${frameScale})`,
                  }}
                >
                  <div
                    className="w-[390px] h-[844px] rounded-[44px] border-[10px] border-[#161f2e] bg-[#070B14] shadow-[0_25px_70px_rgba(0,0,0,0.9)] ring-1 ring-[#202C40] flex flex-col overflow-hidden relative"
                  >
                    {/* Dynamic Island / Speaker Notch */}
                    <div className="h-7 bg-[#161f2e] shrink-0 flex items-center justify-center relative">
                      <div className="w-24 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-end px-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-900/60" />
                      </div>
                    </div>

                    {/* Mobile Scroll Viewport */}
                    <div
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#070B14]"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#202C40 transparent",
                      }}
                    >
                      <PortfolioRenderer portfolio={portfolio} isLivePreview={true} />
                    </div>

                    {/* Mobile Home Bar Pill */}
                    <div className="h-4 bg-[#161f2e] shrink-0 flex items-center justify-center">
                      <div className="w-28 h-1 rounded-full bg-slate-700/80" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </PreviewErrorBoundary>
      </div>
    </section>
  );
}
