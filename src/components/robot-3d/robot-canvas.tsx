"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

interface RobotCanvasProps {
  className?: string;
  enableMouseInteraction?: boolean;
}

export function RobotCanvas({
  className = "",
  enableMouseInteraction = true,
}: RobotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGL] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const testCanvas = document.createElement("canvas");
      return !!(
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasWebGL) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07060f, 0.04);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 9.2);
    camera.lookAt(0, 0.35, 0);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup matching reference screenshot
    // Deep atmospheric ambient
    const ambientLight = new THREE.AmbientLight(0x281c44, 2.6);
    scene.add(ambientLight);

    // Key Light: Intense neon violet/magenta rim light from upper right
    const keyRimLight = new THREE.DirectionalLight(0xd946ef, 5.2);
    keyRimLight.position.set(6.5, 7.5, 4.0);
    scene.add(keyRimLight);

    // Fill Light: Cool cyan/blue light from left
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    fillLight.position.set(-6.5, 5.0, 3.5);
    scene.add(fillLight);

    // Top Chamfer Accent Light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.6);
    topLight.position.set(0, 9.0, 2.0);
    scene.add(topLight);

    // Underside Pedestal Glow
    const underGlow = new THREE.PointLight(0xa855f7, 4.5, 14);
    underGlow.position.set(0, -3.2, 0.5);
    scene.add(underGlow);

    // 4. Materials Setup
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x18112c,
      emissive: 0x1f0d38,
      emissiveIntensity: 0.2,
      metalness: 0.88,
      roughness: 0.2,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
    });

    const stepMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x150f28,
      emissive: 0x1b0c33,
      emissiveIntensity: 0.18,
      metalness: 0.86,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x070512,
      metalness: 0.9,
      roughness: 0.12,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.96,
      roughness: 0.12,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3868,
      emissive: 0xff2558,
      emissiveIntensity: 3.2,
      roughness: 0.12,
      metalness: 0.15,
    });

    const textFrontMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8d8e5,
      metalness: 0.94,
      roughness: 0.16,
    });

    const textEndMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.9,
      metalness: 0.65,
      roughness: 0.24,
    });

    // 5. Build Robot Structure
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Initial slight isometric perspective tilt
    rootGroup.rotation.x = 0.08;
    rootGroup.rotation.y = -0.05;

    // --- Floating Pedestal Assembly ---
    const pedestalGroup = new THREE.Group();
    rootGroup.add(pedestalGroup);

    // Tier 1: Wide main beveled slab
    const tier1Geo = new RoundedBoxGeometry(4.8, 1.05, 3.8, 14, 0.25);
    const tier1Mesh = new THREE.Mesh(tier1Geo, bodyMaterial);
    tier1Mesh.position.y = -0.78;
    pedestalGroup.add(tier1Mesh);

    // Tier 2: Middle beveled step
    const tier2Geo = new RoundedBoxGeometry(3.3, 0.52, 2.6, 12, 0.16);
    const tier2Mesh = new THREE.Mesh(tier2Geo, stepMaterial);
    tier2Mesh.position.y = -0.12;
    pedestalGroup.add(tier2Mesh);

    // Tier 3: Top neck anchor collar
    const tier3Geo = new RoundedBoxGeometry(1.65, 0.36, 1.35, 10, 0.12);
    const tier3Mesh = new THREE.Mesh(tier3Geo, stepMaterial);
    tier3Mesh.position.y = 0.24;
    pedestalGroup.add(tier3Mesh);

    // Underside inverted stepped pyramid
    const under1Geo = new RoundedBoxGeometry(3.7, 0.32, 2.9, 8, 0.12);
    const under1Mesh = new THREE.Mesh(under1Geo, bodyMaterial);
    under1Mesh.position.y = -1.35;
    pedestalGroup.add(under1Mesh);

    const under2Geo = new RoundedBoxGeometry(2.5, 0.26, 2.0, 8, 0.08);
    const under2Mesh = new THREE.Mesh(under2Geo, bodyMaterial);
    under2Mesh.position.y = -1.6;
    pedestalGroup.add(under2Mesh);

    const under3Geo = new RoundedBoxGeometry(1.4, 0.2, 1.1, 6, 0.06);
    const under3Mesh = new THREE.Mesh(under3Geo, bodyMaterial);
    under3Mesh.position.y = -1.8;
    pedestalGroup.add(under3Mesh);

    // --- Neck Assembly ---
    const neckGroup = new THREE.Group();
    pedestalGroup.add(neckGroup);

    // Twin vertical chrome posts
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 24);
    const leftPost = new THREE.Mesh(postGeo, chromeMaterial);
    leftPost.position.set(-0.24, 0.68, 0);
    neckGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, chromeMaterial);
    rightPost.position.set(0.24, 0.68, 0);
    neckGroup.add(rightPost);

    // Swivel collar joint connecting to head
    const lowerCollarGeo = new THREE.CylinderGeometry(0.52, 0.38, 0.26, 32);
    const lowerCollar = new THREE.Mesh(lowerCollarGeo, bodyMaterial);
    lowerCollar.position.y = 0.95;
    neckGroup.add(lowerCollar);

    const trimRingGeo = new THREE.TorusGeometry(0.5, 0.04, 16, 32);
    const trimRing = new THREE.Mesh(trimRingGeo, chromeMaterial);
    trimRing.rotation.x = Math.PI / 2;
    trimRing.position.y = 0.92;
    neckGroup.add(trimRing);

    const upperCollarGeo = new THREE.CylinderGeometry(0.42, 0.52, 0.35, 32);
    const upperCollar = new THREE.Mesh(upperCollarGeo, bodyMaterial);
    upperCollar.position.y = 1.22;
    neckGroup.add(upperCollar);

    // --- Robot Head Assembly (Pivoting with pointer) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.35, 0);
    pedestalGroup.add(headGroup);

    // Outer rounded monitor head casing
    const headOuterGeo = new RoundedBoxGeometry(2.25, 1.48, 1.05, 16, 0.26);
    const headOuterMesh = new THREE.Mesh(headOuterGeo, bodyMaterial);
    headOuterMesh.position.set(0, 0.88, 0);
    headGroup.add(headOuterMesh);

    // Inset front screen / visor panel
    const screenGeo = new RoundedBoxGeometry(1.92, 1.18, 0.1, 14, 0.14);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, 0.88, 0.52);
    headGroup.add(screenMesh);

    // Left and Right Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.18, 32, 32);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEye.position.set(-0.44, 0.9, 0.58);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    rightEye.position.set(0.44, 0.9, 0.58);
    headGroup.add(rightEye);

    // Eye Point Lights for forward surface cast glow
    const leftEyeLight = new THREE.PointLight(0xff3868, 1.8, 3.5);
    leftEyeLight.position.set(-0.44, 0.9, 0.9);
    headGroup.add(leftEyeLight);

    const rightEyeLight = new THREE.PointLight(0xff3868, 1.8, 3.5);
    rightEyeLight.position.set(0.44, 0.9, 0.9);
    headGroup.add(rightEyeLight);

    // --- Floating 3D Text: "Front" & "End" ---
    let frontTextMesh: THREE.Mesh | null = null;
    let endTextMesh: THREE.Mesh | null = null;
    const fontLoader = new FontLoader();

    fontLoader.load(
      "/fonts/helvetiker_bold.typeface.json",
      (font) => {
        // "Front" Text (Top-Left)
        const frontGeo = new TextGeometry("Front", {
          font,
          size: 0.95,
          depth: 0.26,
          curveSegments: 10,
          bevelEnabled: true,
          bevelThickness: 0.035,
          bevelSize: 0.02,
          bevelSegments: 4,
        });
        frontGeo.computeBoundingBox();
        frontTextMesh = new THREE.Mesh(frontGeo, textFrontMaterial);
        frontTextMesh.position.set(-4.0, 2.25, 0.2);
        frontTextMesh.rotation.set(0.08, 0.2, -0.04);
        scene.add(frontTextMesh);

        // "End" Text (Right)
        const endGeo = new TextGeometry("End", {
          font,
          size: 1.05,
          depth: 0.26,
          curveSegments: 10,
          bevelEnabled: true,
          bevelThickness: 0.035,
          bevelSize: 0.02,
          bevelSegments: 4,
        });
        endGeo.computeBoundingBox();
        endTextMesh = new THREE.Mesh(endGeo, textEndMaterial);
        endTextMesh.position.set(2.4, 0.3, 0.4);
        endTextMesh.rotation.set(0.05, -0.16, 0.03);
        scene.add(endTextMesh);

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn("Font loading fallback:", err);
        setIsLoaded(true);
      }
    );

    // --- Background Perspective Grid ---
    const gridPlaneGeo = new THREE.PlaneGeometry(40, 40, 24, 24);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x1f1738,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const gridMesh = new THREE.Mesh(gridPlaneGeo, gridMat);
    gridMesh.position.set(0, -2.5, -4.5);
    gridMesh.rotation.x = -Math.PI / 2.3;
    scene.add(gridMesh);

    // 6. Interactive Cursor Tracking & Animation Loop
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onPointerMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width) * 2 - 1;
      mouse.targetY = -(clientY / rect.height) * 2 + 1;
    };

    window.addEventListener("pointermove", onPointerMove);

    // Window Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // Animation variables
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth pointer lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      if (!prefersReducedMotion) {
        // Floating sinusoidal levitation for the entire robot
        const floatY = Math.sin(elapsed * 1.7) * 0.16;
        const floatRotZ = Math.sin(elapsed * 1.1) * 0.025;
        const floatRotX = Math.cos(elapsed * 1.3) * 0.015;

        pedestalGroup.position.y = floatY;
        pedestalGroup.rotation.z = floatRotZ + mouse.x * 0.08;
        pedestalGroup.rotation.x = floatRotX - mouse.y * 0.06;
        pedestalGroup.rotation.y = -0.05 + mouse.x * 0.12;

        // Head tracking pointer smoothly (yaw & pitch)
        const targetHeadRotY = mouse.x * 0.52;
        const targetHeadRotX = -mouse.y * 0.35;
        headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.08;
        headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;

        // Periodic eye blink logic
        blinkTimer += delta;
        if (blinkTimer > 4.2) {
          isBlinking = true;
          blinkTimer = 0;
          blinkProgress = 0;
        }

        if (isBlinking) {
          blinkProgress += delta * 8.5; // fast blink in ~180ms
          const blinkScale = 1.0 - Math.sin(blinkProgress * Math.PI) * 0.85;
          leftEye.scale.y = Math.max(0.12, blinkScale);
          rightEye.scale.y = Math.max(0.12, blinkScale);
          if (blinkProgress >= 1.0) {
            isBlinking = false;
            leftEye.scale.y = 1.0;
            rightEye.scale.y = 1.0;
          }
        }

        // Floating 3D Text Parallax and subtle independent bobbing
        if (frontTextMesh) {
          frontTextMesh.position.y =
            2.25 + Math.sin(elapsed * 2.0 + 0.4) * 0.08 - mouse.y * 0.14;
          frontTextMesh.position.x = -4.0 - mouse.x * 0.12;
        }

        if (endTextMesh) {
          endTextMesh.position.y =
            0.3 + Math.sin(elapsed * 1.8 + 1.2) * 0.08 - mouse.y * 0.14;
          endTextMesh.position.x = 2.4 - mouse.x * 0.12;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup & Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);

      // Recursive disposal of geometries and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [enableMouseInteraction, hasWebGL]);

  if (!hasWebGL) {
    return (
      <div
        className={`flex items-center justify-center p-8 text-center text-slate-400 bg-[#080612] rounded-3xl border border-purple-500/20 ${className}`}
      >
        <p>WebGL is not supported or enabled on this device.</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
