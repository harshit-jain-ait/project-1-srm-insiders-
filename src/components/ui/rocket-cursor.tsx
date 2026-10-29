"use client";

import { useEffect, useRef } from "react";

interface ExhaustParticle {
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
  colorType: "fire" | "smoke" | "spark";
}

export function RocketCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketRef = useRef<HTMLDivElement | null>(null);
  const flameRef = useRef<SVGPathElement | null>(null);
  const flameCoreRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const rocket = rocketRef.current;
    const flame = flameRef.current;
    const flameCore = flameCoreRef.current;
    if (!canvas || !rocket) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Hide default cursor ────────────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.id = "rocket-cursor-style";
    styleEl.textContent = `
      * { cursor: none !important; }
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

    // ── Movement & State ───────────────────────────────────────────────────
    const particles: ExhaustParticle[] = [];
    const maxParticles = 90;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let lastX = -100;
    let lastY = -100;

    // Default angle: pointing slightly top-left like a cursor arrow (-35 degrees)
    const IDLE_ANGLE = -0.55;
    let targetAngle = IDLE_ANGLE;
    let currentAngle = IDLE_ANGLE;

    let isVisible = false;
    let isHoveringInteractive = false;
    let isMouseDown = false;
    let currentSpeed = 0;
    let idleCounter = 0;
    let raf: number;

    // ── Particle Generator ─────────────────────────────────────────────────
    const spawnParticle = (
      x: number,
      y: number,
      angle: number,
      speedMultiplier: number,
      type: "fire" | "smoke" | "spark"
    ) => {
      if (particles.length >= maxParticles) {
        particles.shift();
      }

      // Exhaust shoots out opposite to the rocket's heading
      const exhaustAngle = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.45;
      const baseVelocity = (type === "spark" ? 4.5 : type === "fire" ? 3.0 : 1.8) * speedMultiplier;
      const pSpeed = baseVelocity * (0.8 + Math.random() * 0.6);

      const vx = Math.cos(exhaustAngle) * pSpeed;
      const vy = Math.sin(exhaustAngle) * pSpeed;

      const maxLife = type === "spark" ? 18 + Math.random() * 12 : type === "fire" ? 22 + Math.random() * 15 : 45 + Math.random() * 25;
      const radius = type === "spark" ? 1.5 + Math.random() * 1.5 : type === "fire" ? 3.5 + Math.random() * 2.5 : 4 + Math.random() * 3;
      const maxRadius = type === "smoke" ? radius * (2.8 + Math.random() * 1.5) : radius * 1.2;

      particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx,
        vy,
        radius,
        maxRadius,
        alpha: 1,
        maxAlpha: type === "spark" ? 0.95 : type === "fire" ? 0.85 : 0.4,
        life: 0,
        maxLife,
        colorType: type,
      });
    };

    // ── Event Handlers ─────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = targetX;
        currentY = targetY;
        rocket.style.opacity = "1";
      }

      // Check if hovering clickable / interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("a, button, [role='button'], input, textarea, select, .cursor-pointer")
        );
        isHoveringInteractive = isClickable;
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      rocket.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      rocket.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // ── Angle Interpolation (shortest arc) ─────────────────────────────────
    const normalizeAngle = (a: number) => {
      while (a > Math.PI) a -= Math.PI * 2;
      while (a < -Math.PI) a += Math.PI * 2;
      return a;
    };

    // ── Animation Loop ─────────────────────────────────────────────────────
    let time = 0;

    const render = () => {
      time += 0.05;

      // Calculate velocity & speed
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentSpeed = Math.sqrt(dx * dx + dy * dy);

      // Smooth position interpolation
      currentX += dx * 0.72;
      currentY += dy * 0.72;

      const vx = currentX - lastX;
      const vy = currentY - lastY;
      lastX = currentX;
      lastY = currentY;
      const moveDistance = Math.sqrt(vx * vx + vy * vy);

      // Determine rocket heading
      if (moveDistance > 1.8) {
        // Point toward movement direction
        targetAngle = Math.atan2(vy, vx) + Math.PI / 2;
        idleCounter = 0;
      } else {
        idleCounter++;
        // Smoothly return toward idle angle after stopping
        if (idleCounter > 15) {
          const breathing = Math.sin(time * 1.5) * 0.08;
          targetAngle = IDLE_ANGLE + breathing;
        }
      }

      // Smooth rotation with shortest-path lerp
      let diff = normalizeAngle(targetAngle - currentAngle);
      currentAngle += diff * 0.22;

      // Rocket dimensions
      const rocketLength = 26; // Distance from tip to thruster nozzle
      // Calculate nozzle position in canvas world coordinates
      const nozzleX = currentX - Math.sin(currentAngle) * rocketLength;
      const nozzleY = currentY + Math.cos(currentAngle) * rocketLength;

      // Spawn exhaust particles
      if (isVisible) {
        const speedBoost = isHoveringInteractive ? 1.4 : isMouseDown ? 1.6 : 1.0;
        const spawnCount = moveDistance > 2 ? Math.min(3, Math.ceil(moveDistance / 3.5)) : 1;

        for (let i = 0; i < spawnCount; i++) {
          if (moveDistance > 1.2 || isHoveringInteractive) {
            spawnParticle(nozzleX, nozzleY, currentAngle, speedBoost, "fire");
            if (Math.random() < 0.45) {
              spawnParticle(nozzleX, nozzleY, currentAngle, speedBoost, "spark");
            }
          }
          if (Math.random() < 0.6) {
            spawnParticle(nozzleX, nozzleY, currentAngle, speedBoost * 0.8, "smoke");
          }
        }
      }

      // Update Rocket Element Transform
      if (isVisible) {
        const baseScale = isMouseDown ? 0.9 : isHoveringInteractive ? 1.2 : 1.0;
        // Tip of rocket is at (14px, 0px) in the 28x36 SVG box
        rocket.style.transform = `translate3d(${currentX - 14}px, ${currentY}px, 0) rotate(${currentAngle}rad) scale(${baseScale})`;

        // Animate Dynamic Thruster Flame
        if (flame && flameCore) {
          const flameLength = 10 + Math.min(18, currentSpeed * 0.7) + (isHoveringInteractive ? 8 : 0) + Math.sin(time * 12) * 2;
          const coreLength = flameLength * 0.55;

          flame.setAttribute(
            "d",
            `M 11 26 Q 14 ${26 + flameLength} 14 ${26 + flameLength} Q 14 ${26 + flameLength} 17 26 Z`
          );
          flameCore.setAttribute(
            "d",
            `M 12 26 Q 14 ${26 + coreLength} 14 ${26 + coreLength} Q 14 ${26 + coreLength} 16 26 Z`
          );
        }
      }

      // ── Render Particles on Canvas ───────────────────────────────────────
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        p.x += p.vx;
        p.y += p.vy;

        // Decelerate particles gently
        p.vx *= 0.94;
        p.vy *= 0.94;

        const progress = p.life / p.maxLife;
        const currentRadius = p.radius + (p.maxRadius - p.radius) * progress;

        let alpha = p.maxAlpha * (1 - progress);

        if (p.life >= p.maxLife || alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);

        if (p.colorType === "spark") {
          // Bright cyan / golden spark
          ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`;
        } else if (p.colorType === "fire") {
          // Fiery electric cyan / sapphire plume
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
          grad.addColorStop(0, `rgba(186, 230, 253, ${alpha * 0.95})`);
          grad.addColorStop(0.4, `rgba(56, 189, 248, ${alpha * 0.7})`);
          grad.addColorStop(1, `rgba(37, 99, 235, 0)`);
          ctx.fillStyle = grad;
        } else {
          // Ethereal expanding smoke vapor
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
          grad.addColorStop(0, `rgba(224, 242, 254, ${alpha * 0.5})`);
          grad.addColorStop(0.6, `rgba(147, 197, 253, ${alpha * 0.25})`);
          grad.addColorStop(1, `rgba(96, 165, 250, 0)`);
          ctx.fillStyle = grad;
        }

        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      const el = document.getElementById("rocket-cursor-style");
      if (el) el.remove();
    };
  }, []);

  return (
    <>
      {/* Exhaust Smoke & Particles Canvas */}
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

      {/* Aerodynamic Rocket Cursor Vessel */}
      <div
        ref={rocketRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 38,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transformOrigin: "14px 0px", // Tip of rocket is the precise click point
          willChange: "transform, opacity",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
          transition: "opacity 0.15s ease",
        }}
      >
        <svg
          width="28"
          height="38"
          viewBox="0 0 28 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Fuselage gradient */}
            <linearGradient id="rocketBodyGrad" x1="8" y1="0" x2="20" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Nosecone brand blue gradient */}
            <linearGradient id="rocketNoseGrad" x1="14" y1="0" x2="14" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Fin gradient */}
            <linearGradient id="rocketFinGrad" x1="14" y1="14" x2="14" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Thruster flame gradient */}
            <linearGradient id="rocketFlameGrad" x1="14" y1="26" x2="14" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="35%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>

            {/* Inner flame core gradient */}
            <linearGradient id="rocketCoreGrad" x1="14" y1="26" x2="14" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Dynamic Thruster Flame (Outer) */}
          <path
            ref={flameRef}
            d="M 11 26 Q 14 36 14 36 Q 14 36 17 26 Z"
            fill="url(#rocketFlameGrad)"
            style={{ filter: "drop-shadow(0 0 5px rgba(249,115,22,0.85))" }}
          />

          {/* Dynamic Thruster Flame Core (Inner) */}
          <path
            ref={flameCoreRef}
            d="M 12 26 Q 14 32 14 32 Q 14 32 16 26 Z"
            fill="url(#rocketCoreGrad)"
          />

          {/* Left Fin */}
          <path
            d="M 10 15 C 6 18 3 23 4 25 C 6 25 10 24 10 23 Z"
            fill="url(#rocketFinGrad)"
          />

          {/* Right Fin */}
          <path
            d="M 18 15 C 22 18 25 23 24 25 C 22 25 18 24 18 23 Z"
            fill="url(#rocketFinGrad)"
          />

          {/* Center Nozzle */}
          <path
            d="M 11 24 L 17 24 L 16 26 L 12 26 Z"
            fill="#334155"
          />

          {/* Main Fuselage Body */}
          <path
            d="M 14 0 C 10 6 9 14 10 24 C 12 25 16 25 18 24 C 19 14 18 6 14 0 Z"
            fill="url(#rocketBodyGrad)"
            stroke="#94A3B8"
            strokeWidth="0.5"
          />

          {/* Nose Cone Accent */}
          <path
            d="M 14 0 C 12.2 3.5 11.2 6.5 11 9 C 12.8 9.5 15.2 9.5 17 9 C 16.8 6.5 15.8 3.5 14 0 Z"
            fill="url(#rocketNoseGrad)"
          />

          {/* Cockpit Window Porthole */}
          <circle cx="14" cy="14" r="2.8" fill="#0F172A" />
          <circle cx="14" cy="14" r="2.2" fill="#38BDF8" />
          <circle cx="14.6" cy="13.4" r="0.8" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>
    </>
  );
}
