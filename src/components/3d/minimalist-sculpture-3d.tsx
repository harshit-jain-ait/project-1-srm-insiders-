"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);
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
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 3. Studio Lighting tuned to the brand's Royal Blue & Clean Modern Theme
    const ambientLight = new THREE.AmbientLight(0xf0f7ff, 1.4);
    scene.add(ambientLight);

    // Crisp white key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    // Signature Royal Blue backlight for luminous rim glow on the glass
    const rimLight = new THREE.DirectionalLight(0x2563eb, 4.0);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Soft sky-blue fill light from bottom-front
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.3);
    fillLight.position.set(2, -4, 4);
    scene.add(fillLight);

    // Internal radiant cobalt-blue point light inside the cylindrical core
    const innerLight = new THREE.PointLight(0x3b82f6, 2.5, 9);
    innerLight.position.set(0, 0.2, 0);
    scene.add(innerLight);

    // 4. Materials matching Theme (Royal Sapphire Blue, Pearl White, & Ice Sky Blue)
    // A. Translucent Royal Sapphire Blue Glass (Cylindrical Tube)
    const sapphireGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      emissive: 0x0f2b6e,
      emissiveIntensity: 0.22,
      roughness: 0.08,
      transmission: 0.9,
      thickness: 1.8,
      ior: 1.52,
      specularIntensity: 1.0,
      specularColor: 0x93c5fd,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.93,
      side: THREE.DoubleSide,
    });

    // B. Pearl White Satin Ceramic Cylinder
    const pearlCylinderMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.06,
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.55,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide,
    });

    // C. Ethereal Ice Sky-Blue Glass Orbiting Cylinder Ring
    const skyGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.18,
      roughness: 0.1,
      transmission: 0.88,
      thickness: 1.2,
      ior: 1.48,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });

    // 5. Cylindrical 3D Geometries (Ultra-Slim, Refined Cylindrical Tubes)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Cylinder 1: Main Sapphire Blue Cylindrical Torus Knot (radius 1.15, tube 0.085)
    const sapphireCylinderGeom = new THREE.TorusKnotGeometry(1.15, 0.085, 240, 48, 2, 3);
    const sapphireCylinderMesh = new THREE.Mesh(sapphireCylinderGeom, sapphireGlassMaterial);
    sapphireCylinderMesh.rotation.set(0.35, 0.15, 0.45);
    mainGroup.add(sapphireCylinderMesh);

    // Cylinder 2: Entwined Pearl White Cylindrical Torus Knot (radius 1.18, tube 0.08)
    const pearlCylinderGeom = new THREE.TorusKnotGeometry(1.18, 0.08, 240, 48, 2, 3);
    const pearlCylinderMesh = new THREE.Mesh(pearlCylinderGeom, pearlCylinderMaterial);
    pearlCylinderMesh.rotation.set(-0.55, 1.15, -0.25);
    pearlCylinderMesh.position.set(-0.04, 0.04, 0.04);
    mainGroup.add(pearlCylinderMesh);

    // Cylinder 3: Delicate Orbiting Cylindrical Ring around the sculpture (radius 1.65, tube 0.032)
    const ringCylinderGeom = new THREE.TorusGeometry(1.65, 0.032, 32, 180);
    const ringCylinderMesh = new THREE.Mesh(ringCylinderGeom, skyGlassMaterial);
    ringCylinderMesh.rotation.set(1.1, 0.3, 0.6);
    mainGroup.add(ringCylinderMesh);

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
      targetRotY = targetMouseX * 0.55;
      targetRotX = -targetMouseY * 0.45;
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
      mainGroup.rotation.y += 0.004;
      mainGroup.rotation.x += (targetRotX + Math.sin(elapsedTime * 0.6) * 0.07 - mainGroup.rotation.x) * 0.06;
      mainGroup.rotation.y += (targetRotY * 0.4) * 0.05;
      mainGroup.rotation.z = Math.cos(elapsedTime * 0.5) * 0.04;

      // Independent rotational breathing for the entwined cylinders
      sapphireCylinderMesh.rotation.y += 0.002;
      pearlCylinderMesh.rotation.x += 0.0015;

      // Orbiting ring counter-spin
      ringCylinderMesh.rotation.z += 0.006;
      ringCylinderMesh.rotation.x = 1.1 + Math.sin(elapsedTime * 0.8) * 0.12;

      // Subtle light refraction pulse inside the cylindrical glass
      innerLight.position.x = Math.sin(elapsedTime * 0.9) * 0.45;
      innerLight.position.y = Math.cos(elapsedTime * 1.1) * 0.35;
      innerLight.intensity = 2.4 + Math.sin(elapsedTime * 1.5) * 0.4;

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
      sapphireCylinderGeom.dispose();
      pearlCylinderGeom.dispose();
      ringCylinderGeom.dispose();

      sapphireGlassMaterial.dispose();
      pearlCylinderMaterial.dispose();
      skyGlassMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[280px] sm:h-[340px] lg:h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* Subtle loader shimmer before WebGL starts */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
