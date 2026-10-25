"use client";

import React from "react";

interface AnimatedBadgeProps {
  label: string;
  dotColor?: "emerald" | "blue" | "amber" | "neutral";
  className?: string;
}

export function AnimatedBadge({
  label,
  dotColor = "emerald",
  className = "",
}: AnimatedBadgeProps) {
  const colorStyles = {
    emerald: "bg-emerald-500 text-emerald-400 border-emerald-500/20 bg-emerald-950/40",
    blue: "bg-blue-500 text-blue-400 border-blue-500/20 bg-blue-950/40",
    amber: "bg-amber-500 text-amber-400 border-amber-500/20 bg-amber-950/40",
    neutral: "bg-zinc-400 text-zinc-300 border-zinc-700 bg-zinc-900/60",
  };

  const dotBg = {
    emerald: "bg-emerald-400",
    blue: "bg-blue-400",
    amber: "bg-amber-400",
    neutral: "bg-zinc-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${colorStyles[dotColor]} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotBg[dotColor]}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotBg[dotColor]}`} />
      </span>
      <span>{label}</span>
    </span>
  );
}
