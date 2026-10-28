/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV (Szenia Zadvornykh)
 * Illustrations by Pablo Stanley (Open Peeps, https://www.openpeeps.com/) — CC0 1.0 Universal License
 * Original component recreation by @gurvinder-singh02 (Skiper UI, https://gxuri.me, https://x.com/Gur__vi)
 *
 * Production Enhancements for Portfolify:
 * - Reactive dependency management on src / rows / cols updates
 * - Image load failure & dimension validation with graceful fallback
 * - Memory leak prevention & active timeline registry with strict unmount cleanup
 * - High-DPI crisp rendering via idempotent setTransform (no scale accumulation)
 * - Screen-aware responsive crowd density & character sizing (mobile / tablet / desktop)
 * - Native prefers-reduced-motion detection with non-animated static composition fallback
 * - IntersectionObserver & document.visibilityState pausing to conserve GPU/battery
 * - Zero click interference (pointer-events-none, aria-hidden for accessibility)
 */

"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";

export interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
  className?: string;
  speedMultiplier?: number;
  maxPeeps?: number;
  characterScale?: number;
  opacity?: number;
}

interface Peep {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  scale: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: [number, number, number, number], scale?: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export const CrowdCanvas = ({
  src = "/images/peeps/all-peeps.png",
  rows = 15,
  cols = 7,
  className = "absolute bottom-0 h-[60vh] sm:h-[70vh] md:h-[80vh] w-full pointer-events-none select-none",
  speedMultiplier = 1,
  maxPeeps,
  characterScale,
  opacity = 1,
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isMounted = true;
    const activeTimelines = new Set<gsap.core.Timeline>();

    // Check reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Helpers
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const removeRandomFromArray = <T,>(array: T[]): T | null => {
      if (!array || array.length === 0) return null;
      const idx = Math.floor(Math.random() * array.length);
      return array.splice(idx, 1)[0];
    };

    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    // Responsive scaling based on viewport width
    const getResponsiveScale = (canvasWidth: number): number => {
      if (typeof characterScale === "number" && characterScale > 0) {
        return characterScale;
      }
      if (canvasWidth < 640) return 0.35;
      if (canvasWidth < 1024) return 0.44;
      return 0.52;
    };

    // Responsive character limit
    const getCrowdLimit = (canvasWidth: number): number => {
      if (typeof maxPeeps === "number" && maxPeeps > 0) return maxPeeps;
      if (canvasWidth < 640) return 5;
      if (canvasWidth < 1024) return 9;
      return 15;
    };

    const createPeep = ({
      image,
      rect,
      scale,
    }: {
      image: HTMLImageElement;
      rect: [number, number, number, number];
      scale: number;
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [...rect],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        scale,
        walk: null,
        setRect: (newRect, newScale) => {
          peep.rect = [...newRect];
          if (typeof newScale === "number") {
            peep.scale = newScale;
          }
          peep.width = peep.rect[2] * peep.scale;
          peep.height = peep.rect[3] * peep.scale;
        },
        render: (renderCtx: CanvasRenderingContext2D) => {
          renderCtx.save();
          renderCtx.translate(peep.x, peep.y);
          renderCtx.scale(peep.scaleX * peep.scale, peep.scale);
          renderCtx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            peep.scaleX < 0 ? -peep.rect[2] : 0,
            0,
            peep.rect[2],
            peep.rect[3]
          );
          renderCtx.restore();
        },
      };

      peep.setRect(rect, scale);
      return peep;
    };

    const resetPeep = ({ peep }: { peep: Peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      // Gentle depth variation along the bottom ground line
      const verticalJitter = 24 - 48 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + verticalJitter;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width - 20;
        endX = stage.width + 20;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width + 20;
        endX = -peep.width - 20;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({
      peep,
      props,
    }: {
      peep: Peep;
      props: { startX: number; startY: number; endX: number };
    }) => {
      const { startX, startY, endX } = props;
      const distance = Math.abs(endX - startX);
      const baseDuration = Math.max(9, distance / 85);
      const xDuration = baseDuration / Math.max(0.2, speedMultiplier);
      const yDuration = 0.28;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.75, 1.25));

      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0
      );

      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: Math.floor(xDuration / yDuration),
          yoyo: true,
          y: startY - 7,
          ease: "power1.inOut",
        },
        0
      );

      return tl;
    };

    const addPeepToCrowd = (): Peep | null => {
      if (!isMounted) return null;
      const peep = removeRandomFromArray(availablePeeps);
      if (!peep) return null;

      const walk = normalWalk({
        peep,
        props: resetPeep({ peep }),
      });

      activeTimelines.add(walk);

      walk.eventCallback("onComplete", () => {
        activeTimelines.delete(walk);
        if (!isMounted) return;
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      const idx = crowd.indexOf(peep);
      if (idx !== -1) {
        crowd.splice(idx, 1);
      }
      availablePeeps.push(peep);
    };

    const createPeeps = (img: HTMLImageElement) => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (!width || !height || rows <= 0 || cols <= 0) {
        return;
      }

      const rectWidth = width / rows;
      const rectHeight = height / cols;

      if (rectWidth <= 0 || rectHeight <= 0) {
        return;
      }

      const total = rows * cols;
      const currentScale = getResponsiveScale(canvas.clientWidth || 1024);

      allPeeps.length = 0;
      for (let i = 0; i < total; i++) {
        const col = i % rows;
        const row = Math.floor(i / rows);
        allPeeps.push(
          createPeep({
            image: img,
            rect: [col * rectWidth, row * rectHeight, rectWidth, rectHeight],
            scale: currentScale,
          })
        );
      }
    };

    const initCrowd = () => {
      if (!isMounted) return;
      const limit = getCrowdLimit(stage.width);

      if (prefersReducedMotion) {
        // Place stationary characters cleanly across baseline without animation
        const staticCount = Math.min(limit, 7);
        const step = stage.width / (staticCount + 1);

        for (let i = 0; i < staticCount; i++) {
          const peep = removeRandomFromArray(availablePeeps);
          if (!peep) break;
          peep.x = step * (i + 1) - peep.width / 2;
          peep.y = stage.height - peep.height + (i % 2 === 0 ? 5 : -5);
          peep.scaleX = i % 2 === 0 ? 1 : -1;
          crowd.push(peep);
        }
        render();
        return;
      }

      // Populate walking crowd
      let count = 0;
      while (availablePeeps.length > 0 && count < limit) {
        const peep = addPeepToCrowd();
        if (peep && peep.walk) {
          peep.walk.progress(Math.random());
        }
        count++;
      }
    };

    const render = () => {
      if (!isMounted || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, stage.width, stage.height);

      ctx.globalAlpha = opacity;
      for (let i = 0; i < crowd.length; i++) {
        crowd[i].render(ctx);
      }

      ctx.restore();
    };

    const resize = () => {
      if (!isMounted || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;

      if (stage.width === 0 || stage.height === 0) return;

      canvas.width = Math.floor(stage.width * dpr);
      canvas.height = Math.floor(stage.height * dpr);

      // Kill active tweens
      activeTimelines.forEach((tl) => tl.kill());
      activeTimelines.clear();

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;

      // Update responsive scale for all characters
      const newScale = getResponsiveScale(stage.width);
      for (let i = 0; i < allPeeps.length; i++) {
        allPeeps[i].setRect(allPeeps[i].rect, newScale);
      }

      availablePeeps.push(...allPeeps);
      initCrowd();
    };

    // Load sprite sheet asset
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (!isMounted) return;
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        setLoadError(true);
        return;
      }
      setLoadError(false);
      createPeeps(img);
      resize();

      if (!prefersReducedMotion) {
        gsap.ticker.add(render);
      }
    };

    img.onerror = () => {
      if (!isMounted) return;
      setLoadError(true);
    };

    img.src = src;

    // Window resize observer
    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);

    // Performance: Pause ticker when tab is hidden or canvas is scrolled out of viewport
    let isVisible = true;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gsap.ticker.remove(render);
      } else if (isVisible && !prefersReducedMotion) {
        gsap.ticker.add(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden && !prefersReducedMotion) {
          gsap.ticker.add(render);
        } else {
          gsap.ticker.remove(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Cleanup on unmount or prop changes
    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      gsap.ticker.remove(render);

      activeTimelines.forEach((tl) => tl.kill());
      activeTimelines.clear();

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols, speedMultiplier, maxPeeps, characterScale, opacity]);

  // Graceful fallback if image load fails
  if (loadError) {
    return (
      <div
        className={`${className} flex items-end justify-center pb-8 opacity-25`}
        aria-hidden="true"
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
};

export const Skiper39 = () => {
  return (
    <div className="relative h-full w-full bg-[#101114] text-white overflow-hidden">
      <div className="pt-16 pb-8 text-center space-y-3 relative z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-wider">
          Crowd Canvas
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          A Vibrant Community of Builders
        </h2>
      </div>
      <div className="relative h-64 sm:h-80 md:h-96 w-full">
        <CrowdCanvas
          src="/images/peeps/all-peeps.png"
          rows={15}
          cols={7}
          className="absolute bottom-0 h-full w-full pointer-events-none select-none"
        />
      </div>
    </div>
  );
};

export default CrowdCanvas;
