/**
 * Skiper 52 HoverExpand_001 — React + Framer Motion
 * Reference Component for Interactive Hover-Expand Layouts
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface HoverExpandImageItem {
  src: string;
  alt: string;
  code?: string;
  title?: string;
}

export const HoverExpand_001 = ({
  images,
  className,
}: {
  images: HoverExpandImageItem[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
      className={cn("relative w-full max-w-6xl px-4", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {images.map((image, index) => {
            const isActive = activeImage === index;
            return (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shrink-0"
                initial={{ width: "4rem", height: "20rem" }}
                animate={{
                  width: isActive ? "22rem" : "4.5rem",
                  height: "22rem",
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                onClick={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveImage(index);
                  }
                }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute inset-0 flex flex-col justify-end p-5 z-20"
                    >
                      {image.title && (
                        <h4 className="text-sm font-bold text-white mb-1">
                          {image.title}
                        </h4>
                      )}
                      <p className="text-left text-xs text-white/70 font-mono">
                        {image.code || `#0${index + 1}`}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <img
                  src={image.src}
                  className="size-full object-cover"
                  alt={image.alt}
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Skiper52 = () => {
  const images: HoverExpandImageItem[] = [
    {
      src: "/images/templates/bento-studio.svg",
      alt: "Bento Studio Template",
      code: "BENTO-01",
      title: "Bento Studio",
    },
    {
      src: "/images/templates/developer-pro.svg",
      alt: "Developer Pro Template",
      code: "DEV-02",
      title: "Developer Pro",
    },
    {
      src: "/images/templates/minimal-portfolio.svg",
      alt: "Minimal Portfolio Template",
      code: "MIN-03",
      title: "Minimal Portfolio",
    },
    {
      src: "/images/templates/creative-motion.svg",
      alt: "Creative Motion Template",
      code: "CREATIVE-04",
      title: "Creative Motion",
    },
    {
      src: "/images/templates/signature.svg",
      alt: "Signature Template",
      code: "SIGN-05",
      title: "Signature",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#101114] py-8 text-white">
      <HoverExpand_001 images={images} />
    </div>
  );
};

export default Skiper52;
