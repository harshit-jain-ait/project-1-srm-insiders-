import React from "react";
import { PlusCircle } from "lucide-react";

interface EmptySectionHintProps {
  isLivePreview?: boolean;
  sectionTitle: string;
  actionHint: string;
  theme?: "light" | "dark";
}

/**
 * Context-aware empty state hint.
 * STRICT POLICY:
 * - On public sites (isLivePreview=false), returns null to omit empty sections cleanly.
 * - In Studio live preview (isLivePreview=true), renders an intentional guide for the editor user.
 */
export function EmptySectionHint({
  isLivePreview,
  sectionTitle,
  actionHint,
  theme = "light",
}: EmptySectionHintProps) {
  if (!isLivePreview) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div
      className={`p-6 rounded-lg border border-dashed text-center space-y-2 my-4 select-none ${
        isDark
          ? "border-zinc-800 bg-zinc-900/30 text-zinc-400"
          : "border-zinc-200 bg-zinc-50/50 text-zinc-500"
      }`}
    >
      <div className="flex items-center justify-center gap-1.5 text-xs font-medium">
        <PlusCircle className="w-3.5 h-3.5 opacity-70" />
        <span>Empty {sectionTitle} Section</span>
      </div>
      <p className="text-[11px] leading-relaxed max-w-sm mx-auto opacity-80">
        {actionHint}
      </p>
    </div>
  );
}
