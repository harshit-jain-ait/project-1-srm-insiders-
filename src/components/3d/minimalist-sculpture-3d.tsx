"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface MinimalistSculpture3DProps {
  className?: string;
}

export function MinimalistSculpture3D({ className = "" }: MinimalistSculpture3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    let hasWebGL = false;
    try {
      const testCanvas = document.createElement("canvas");
      hasWebGL = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
      );
    } catch {
      hasWebGL = false;
    }

    if (!hasWebGL) {
      setIsReady(false);
      return;
    }

    let animationFrameId: number;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);
    camera.lookAt(0, 0, 0);

    // 2. Renderer with transparent background and high fidelity
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Setup matching Image 1
    // Soft warm ambient base
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.4);
    scene.add(ambientLight);

    // Warm main key light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Purple / Lavender backlight to produce the glowing glass edge
    const rimLight = new THREE.DirectionalLight(0x8a7aff, 3.2);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Fill light from lower front
    const fillLight = new THREE.DirectionalLight(0xe8e6f5, 1.2);
    fillLight.position.set(2, -4, 4);
    scene.add(fillLight);

    // Glowing internal point light inside the knot
    const innerLight = new THREE.PointLight(0xb4a4f8, 1.8, 8);
    innerLight.position.set(0.2, 0.3, 0);
    scene.add(innerLight);

    // 4. Materials
    // A. Translucent Violet-Blue Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x857fc8,
      emissive: 0x1a1236,
      emissiveIntensity: 0.15,
      roughness: 0.12,
      transmission: 0.88,
      thickness: 1.4,
      ior: 1.52,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });

    // B. Matte Satin Cream / Off-White Ribbon Material
    const creamMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5f0e6,
      roughness: 0.36,
      metalness: 0.04,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide,
    });

    // C. Secondary Soft Lavender Satin Ribbon Material
    const lavenderMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd8cee8,
      roughness: 0.28,
      metalness: 0.06,
      clearcoat: 0.4,
      side: THREE.DoubleSide,
    });

    // D. Frosted Glass Floating Card Material
    const frostedCardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.42,
      transmission: 0.94,
      thickness: 0.8,
      ior: 1.45,
      transparent: true,
      opacity: 0.82,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });

    const cardDetailMaterial = new THREE.MeshStandardMaterial({
      color: 0xd5d0db,
      roughness: 0.5,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
    });

    // 5. Geometry & Mesh Construction
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- Ribbon 1: Main Purple Glass Torus Knot ---
    const glassKnotGeom = new THREE.TorusKnotGeometry(1.5, 0.32, 200, 36, 2, 3);
    glassKnotGeom.scale(1.05, 1.0, 0.42); // Flatten into a twisting ribbon
    const glassRibbonMesh = new THREE.Mesh(glassKnotGeom, glassMaterial);
    glassRibbonMesh.rotation.set(0.4, 0.2, 0.5);
    mainGroup.add(glassRibbonMesh);

    // --- Ribbon 2: Entwined Cream Satin Ribbon ---
    const creamKnotGeom = new THREE.TorusKnotGeometry(1.55, 0.3, 200, 36, 2, 3);
    creamKnotGeom.scale(0.95, 1.05, 0.4); // Ribbon profile
    const creamRibbonMesh = new THREE.Mesh(creamKnotGeom, creamMaterial);
    creamRibbonMesh.rotation.set(-0.6, 1.1, -0.3);
    creamRibbonMesh.position.set(-0.1, 0.05, 0.1);
    mainGroup.add(creamRibbonMesh);

    // --- Ribbon 3: Lavender Inner Loop ---
    const innerKnotGeom = new THREE.TorusKnotGeometry(1.25, 0.22, 160, 28, 3, 4);
    innerKnotGeom.scale(1.1, 0.9, 0.4);
    const innerRibbonMesh = new THREE.Mesh(innerKnotGeom, lavenderMaterial);
    innerRibbonMesh.rotation.set(1.2, -0.4, 0.8);
    mainGroup.add(innerRibbonMesh);

    // --- Floating Frosted Glass Card Group ---
    const cardGroup = new THREE.Group();
    cardGroup.position.set(-0.85, 0.05, 1.85);
    cardGroup.rotation.set(0.04, 0.18, -0.05);

    // Card Body
    const cardGeom = new RoundedBoxGeometry(2.35, 1.45, 0.05, 6, 0.14);
    const cardMesh = new THREE.Mesh(cardGeom, frostedCardMaterial);
    cardGroup.add(cardMesh);

    // Card Detail 1: Left Top Dot
    const dotGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const dotLeft = new THREE.Mesh(dotGeom, cardDetailMaterial);
    dotLeft.position.set(-0.85, 0.42, 0.035);
    cardGroup.add(dotLeft);

    // Card Detail 2: Right Top Dot
    const dotRight = new THREE.Mesh(dotGeom, cardDetailMaterial);
    dotRight.position.set(0.85, 0.42, 0.035);
    cardGroup.add(dotRight);

    // Card Detail 3: Top Skeleton Pill Bar
    const bar1Geom = new RoundedBoxGeometry(1.5, 0.065, 0.02, 3, 0.03);
    const bar1 = new THREE.Mesh(bar1Geom, cardDetailMaterial);
    bar1.position.set(-0.1, 0.02, 0.035);
    cardGroup.add(bar1);

    // Card Detail 4: Bottom Skeleton Pill Bar
    const bar2Geom = new RoundedBoxGeometry(0.95, 0.065, 0.02, 3, 0.03);
    const bar2 = new THREE.Mesh(bar2Geom, cardDetailMaterial);
    bar2.position.set(-0.38, -0.16, 0.035);
    cardGroup.add(bar2);

    mainGroup.add(cardGroup);

    // 6. Interactive Smooth Pointer Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = Math.max(-1, Math.min(1, nx));
      targetMouseY = Math.max(-1, Math.min(1, ny));
      targetRotY = targetMouseX * 0.45;
      targetRotX = -targetMouseY * 0.35;
    };

    const handlePointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle idle rotation and breathing
      mainGroup.rotation.y += 0.0035;
      mainGroup.rotation.x += (targetRotX + Math.sin(elapsedTime * 0.6) * 0.06 - mainGroup.rotation.x) * 0.06;
      mainGroup.rotation.y += (targetRotY * 0.4) * 0.05;
      mainGroup.rotation.z = Math.cos(elapsedTime * 0.5) * 0.04;

      // Independent subtle floating for the ribbons
      glassRibbonMesh.rotation.y += 0.0015;
      creamRibbonMesh.rotation.x += 0.001;

      // Card organic floating & counter-bobbing
      cardGroup.position.y = 0.05 + Math.sin(elapsedTime * 1.8) * 0.07;
      cardGroup.rotation.z = -0.05 + Math.sin(elapsedTime * 1.2) * 0.025;
      cardGroup.rotation.y = 0.18 + (targetMouseX * 0.18);
      cardGroup.rotation.x = 0.04 - (targetMouseY * 0.12);

      // Light oscillation for realistic glint on glass curves
      innerLight.position.x = Math.sin(elapsedTime * 0.8) * 0.4;
      innerLight.position.y = Math.cos(elapsedTime * 0.9) * 0.3;

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      if (container) {
        container.removeEventListener("pointerleave", handlePointerLeave);
        resizeObserver.disconnect();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      // Dispose resources
      glassKnotGeom.dispose();
      creamKnotGeom.dispose();
      innerKnotGeom.dispose();
      cardGeom.dispose();
      dotGeom.dispose();
      bar1Geom.dispose();
      bar2Geom.dispose();

      glassMaterial.dispose();
      creamMaterial.dispose();
      lavenderMaterial.dispose();
      frostedCardMaterial.dispose();
      cardDetailMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] sm:h-[440px] lg:h-[490px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* Fallback image while Three.js initializes */}
      <img
        src="/images/landing/minimalist-sculpture-alpha.png"
        alt="3D Craft & Innovation Sculpture"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700 ease-out ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
