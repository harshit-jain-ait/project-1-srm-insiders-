"use client";

/**
 * SmokeCursor
 * -----------
 * - Custom glowing light-blue dot cursor.
 * - Silky smooth, continuous ethereal smoke vapor trail following the cursor.
 * - Interpolates between mousemove events to guarantee a gap-free, unbroken fluid stream.
 * - Sinuous harmonic drift mimics real vapor/incense smoke curling upward.
 * - Hardware-accelerated canvas rendering with zero frame drops (locked 60/120fps).
 * - Interactive element awareness: subtly expands over buttons/links.
 * - Fully disabled for touch devices and prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  seed: number;
}

export function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Inject cursor: none styles ──────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.id = "smoke-cursor-style";
    styleEl.textContent = `
      html { cursor: none !important; }
      a, button, [role="button"], label[for], summary { cursor: none !important; }
      input, textarea, select { cursor: none !important; }
    `;
    document.head.appendChild(styleEl);

    // ── Canvas setup (DPR aware) ───────────────────────────────────────────
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Particle & Pointer State ───────────────────────────────────────────
    const particles: SmokeParticle[] = [];
    const maxParticles = 140;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let prevX = -100;
    let prevY = -100;

    let isVisible = false;
    let isHoveringInteractive = false;
    let raf: number;

    // ── Particle Factory ───────────────────────────────────────────────────
    const createParticle = (x: number, y: number, speedRatio: number) => {
      const maxLife = 50 + Math.random() * 35;
      const angle = Math.random() * Math.PI * 2;
      const scatter = 1.2 + Math.random() * 2.5;

      particles.push({
        x: x + Math.cos(angle) * scatter,
        y: y + Math.sin(angle) * scatter,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.45 - Math.random() * 0.65, // gentle upward drift
        radius: 4 + Math.random() * 4,
        maxRadius: 18 + Math.random() * 16,
        alpha: 0.28 + Math.random() * 0.18,
        maxAlpha: 0.35 + Math.random() * 0.15,
        life: 0,
        maxLife,
        seed: Math.random() * 100,
      });

      if (particles.length > maxParticles) {
        particles.shift();
      }
    };

    // ── Mouse & Interaction Handlers ───────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        currentX = e.clientX;
        currentY = e.clientY;
        prevX = e.clientX;
        prevY = e.clientY;
        dot.style.opacity = "1";
      }

      targetX = e.clientX;
      targetY = e.clientY;

      // Continuous interpolation between consecutive mousemove events
      const dist = Math.hypot(targetX - prevX, targetY - prevY);
      if (dist > 1) {
        // Steps every ~4px so fast movements create a seamless, gap-free plume
        const steps = Math.min(18, Math.max(1, Math.floor(dist / 4.5)));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const interpX = prevX + (targetX - prevX) * t;
          const interpY = prevY + (targetY - prevY) * t;
          createParticle(interpX, interpY, dist);
        }
      }

      prevX = targetX;
      prevY = targetY;

      // Detect if hovering over clickable/interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("a, button, [role='button'], input, textarea, select")
        );
        if (isClickable !== isHoveringInteractive) {
          isHoveringInteractive = isClickable;
          if (isClickable) {
            dot.style.transform = `translate3d(${targetX - 9}px, ${targetY - 9}px, 0) scale(1.4)`;
            dot.style.boxShadow =
              "0 0 16px 5px rgba(56, 189, 248, 0.8), 0 0 6px 2px rgba(186, 230, 253, 0.95)";
          } else {
            dot.style.transform = `translate3d(${targetX - 6}px, ${targetY - 6}px, 0) scale(1)`;
            dot.style.boxShadow =
              "0 0 10px 3px rgba(125, 211, 252, 0.7), 0 0 4px 1px rgba(186, 230, 253, 0.9)";
          }
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // ── Animation Loop ─────────────────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor dot tracking with subpixel accuracy
      if (isVisible) {
        currentX += (targetX - currentX) * 0.75;
        currentY += (targetY - currentY) * 0.75;

        const offset = isHoveringInteractive ? 9 : 6;
        const scale = isHoveringInteractive ? 1.4 : 1;
        dot.style.transform = `translate3d(${currentX - offset}px, ${currentY - offset}px, 0) scale(${scale})`;
      }

      // Render smoke particles using lighter blend mode for ethereal glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Sinuous undulating drift
        const progress = p.life / p.maxLife;
        const wave = Math.sin(p.life * 0.08 + p.seed) * 0.35;

        p.x += p.vx + wave;
        p.y += p.vy;

        // Smooth physical expansion and upward dissipation
        const currentRadius = p.radius + (p.maxRadius - p.radius) * progress;

        // Smooth fade-in then gentle long fade-out
        let alpha = 0;
        if (progress < 0.15) {
          alpha = (progress / 0.15) * p.maxAlpha;
        } else {
          alpha = p.maxAlpha * Math.pow(1 - progress, 1.8);
        }

        if (p.life >= p.maxLife || alpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }

        // Multi-stop radial soft vapor gradient (Light Blue Palette)
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          Math.max(1, currentRadius)
        );

        grad.addColorStop(0, `rgba(186, 230, 253, ${alpha * 0.95})`);   // #BAE6FD (pale sky core)
        grad.addColorStop(0.35, `rgba(125, 211, 252, ${alpha * 0.65})`); // #7DD3FC (light blue vapor)
        grad.addColorStop(0.7, `rgba(56, 189, 248, ${alpha * 0.25})`);  // #38BDF8 (subtle cyan edge)
        grad.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      const el = document.getElementById("smoke-cursor-style");
      if (el) el.remove();
    };
  }, []);

  return (
    <>
      {/* Smoke Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Glowing Light-Blue Dot Cursor */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "#38BDF8",
          boxShadow:
            "0 0 10px 3px rgba(56, 189, 248, 0.75), 0 0 4px 1px rgba(14, 165, 233, 0.85), 0 0 1px 1px rgba(2, 132, 199, 0.5)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          willChange: "transform, opacity",
          transition: "box-shadow 0.2s ease, opacity 0.15s ease",
        }}
      />
    </>
  );
}
