import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  isDark?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  isDark = true,
  className = "",
}: LogoProps) {
  const iconDimensions = {
    sm: { width: 22, height: 26, containerClass: "h-6 w-6" },
    md: { width: 28, height: 33, containerClass: "h-8 w-8" },
    lg: { width: 34, height: 40, containerClass: "h-10 w-10" },
  }[size];

  const textClass = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative ${iconDimensions.containerClass} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <Image
          src="/images/logo/logo-icon.png"
          alt="Portfolify Icon"
          width={iconDimensions.width}
          height={iconDimensions.height}
          priority
          className="object-contain drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)]"
        />
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight transition-colors ${textClass} ${
            isDark ? "text-white" : "text-slate-900"
          }`}
          style={{ letterSpacing: "-0.03em" }}
        >
          Portfolify
        </span>
      )}
    </div>
  );
}

