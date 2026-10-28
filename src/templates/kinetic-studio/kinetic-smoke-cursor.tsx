"use client";

import React, { useEffect, useRef } from "react";

interface KineticSmokeCursorProps {
  containerRef: React.RefObject<HTMLElement | null>;
  accentColor?: string;
  isDark?: boolean;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  growthRate: number;
  life: number;
  maxLife: number;
  r: number;
  g: number;
  b: number;
}

export function KineticSmokeCursor({
  containerRef,
  accentColor = "#ff5c1a",
  isDark = true,
}: KineticSmokeCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (typeof window === "undefined") return;
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: SmokeParticle[] = [];
    let mouseX = -100;
    let mouseY = -100;
    let lastSpawnX = -100;
    let lastSpawnY = -100;
    let isInside = false;

    // Set canvas dimensions to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // RGB for smoke based on theme
    const smokeColor = isDark
      ? { r: 215, g: 215, b: 225 } // subtle misty light smoke
      : { r: 120, g: 120, b: 130 }; // subtle dark-grey wisp smoke

    const spawnSmokePuff = (x: number, y: number, count: number = 3) => {
      for (let i = 0; i < count; i++) {
        const maxLife = 38 + Math.floor(Math.random() * 24);
        const startRadius = 3 + Math.random() * 3.5;
        const maxRadius = 16 + Math.random() * 14;
        particles.push({
          x: x + (Math.random() - 0.5) * 5,
          y: y + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 0.75,
          // Upward gentle thermal buoyancy
          vy: -0.25 - Math.random() * 0.65,
          radius: startRadius,
          maxRadius,
          growthRate: (maxRadius - startRadius) / maxLife,
          life: maxLife,
          maxLife,
          r: smokeColor.r,
          g: smokeColor.g,
          b: smokeColor.b,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const inBounds =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inBounds) {
        isInside = true;
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Calculate distance moved since last puff
        const dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
        if (dist > 6) {
          spawnSmokePuff(mouseX, mouseY, 3);
          lastSpawnX = mouseX;
          lastSpawnY = mouseY;
        }
      } else {
        isInside = false;
      }
    };

    const handleMouseLeave = () => {
      isInside = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and update smoke particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growthRate;

        const progress = p.life / p.maxLife;
        // Soft opacity curve that rises quickly then fades out smoothly
        const alpha = Math.sin(progress * Math.PI) * 0.28;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`);
        grad.addColorStop(0.45, `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw small dot cursor
      if (isInside && mouseX >= 0 && mouseY >= 0) {
        // Outer soft glow
        ctx.save();
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Inner bright core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, accentColor, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] select-none"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}

export default KineticSmokeCursor;

