"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LivingIdentityGridProps {
  className?: string;
}

/**
 * Living Identity Grid — Cinematic 3D Modular Tile Environment
 *
 * Rebuilt architectural surface constructed from raised rectangular graphite panels.
 * Features:
 * - Medium-sized rectangular tiles (1.50w x 0.24h x 2.00d) with narrow 0.10 gaps
 * - Real 0.24 physical thickness revealing illuminated top surfaces and shaded side faces
 * - Coherent modular grid (38 cols x 32 rows = 1216 panels) with subtle architectural height variations
 * - Balanced elevated camera perspective (40° FOV, 36° downward pitch)
 * - Multi-source cinematic lighting: hemisphere ambient, key directional sweep, fill, and subtle red reflections
 * - Continuous, smooth travelling wave displacement (0.04 - 0.12 units) resembling a living mechanical landscape
 * - Subtle inertia-damped mouse parallax that smoothly recenters
 */
export function LivingIdentityGrid({ className = "" }: LivingIdentityGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId: number;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // --- SCENE & FOG ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);
    // Linear fog keeps the foreground and midground crisp while fading distant horizon into #080808
    scene.fog = new THREE.Fog(0x080808, isMobile ? 18 : 22, isMobile ? 46 : 56);

    // --- CAMERA ---
    // Balanced elevated perspective: shows top surfaces, visible side bevels, and deep infinite grid
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const baseCamY = isMobile ? 13.0 : 10.5;
    const baseCamZ = isMobile ? 16.5 : 14.2;
    camera.position.set(0, baseCamY, baseCamZ);
    camera.lookAt(0, isMobile ? -0.8 : -0.6, isMobile ? -1.2 : -1.5);

    // --- RENDERER ---
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      const canvas = renderer.domElement;
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.pointerEvents = "none";
      container.appendChild(canvas);
    } catch (err) {
      console.error("WebGL initialization failed for LivingIdentityGrid:", err);
      return;
    }

    // --- LIGHTING SYSTEM ---
    // 1. Soft Hemisphere Ambient: prevents solid black voids in crevices while keeping side faces darker
    const hemiLight = new THREE.HemisphereLight(0x383838, 0x141414, 2.6);
    scene.add(hemiLight);

    // 2. Large Directional Key Light: soft grey/white illumination across top faces and block edges
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
    keyLight.position.set(16, 24, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    // 3. Cool Secondary Fill Light: softens shadows and defines opposite vertical side faces
    const fillLight = new THREE.DirectionalLight(0x5a5a5a, 2.0);
    fillLight.position.set(-18, 16, -10);
    scene.add(fillLight);

    // 4. Subtle Cinematic Red Light Reflections: inspired by Encoder's signature aesthetic
    const redLight = new THREE.DirectionalLight(0xff3333, 1.4);
    redLight.position.set(22, 10, -4);
    scene.add(redLight);

    const redPoint = new THREE.PointLight(0xff2222, 2.8, 30, 1.4);
    redPoint.position.set(12, 4, 1);
    scene.add(redPoint);

    // 5. Restrained Vibrant Coral Rim: subtle brand glint on the far left horizon
    const coralAccent = new THREE.DirectionalLight(0xee4530, 0.45);
    coralAccent.position.set(-18, 12, 8);
    scene.add(coralAccent);

    // --- TILE GEOMETRY & MODULAR GRID ---
    // Desktop: 38 cols x 32 rows = 1216 panels
    // Mobile: 24 cols x 22 rows = 528 panels
    const cols = isMobile ? 24 : 38;
    const rows = isMobile ? 22 : 32;
    const count = cols * rows;

    // Correct Medium-Sized Rectangular Dimensions
    const panelW = 1.50; // Rectangular width
    const panelH = 0.24; // Physical thickness (top surface + side faces clearly visible)
    const panelD = 2.00; // Rectangular depth

    const gapX = 0.10; // Narrow, clean, consistent gap
    const gapZ = 0.10;

    const spacingX = panelW + gapX; // 1.60
    const spacingZ = panelD + gapZ; // 2.10

    const boxGeometry = new THREE.BoxGeometry(panelW, panelH, panelD);

    // Matte graphite material with refined roughness and subtle metallic sheen
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Tinted per-instance via instanceColor
      roughness: 0.38,
      metalness: 0.28,
      flatShading: false,
    });

    const instancedMesh = new THREE.InstancedMesh(boxGeometry, panelMaterial, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    // Per-panel static properties
    interface PanelData {
      x: number;
      z: number;
      baseOffset: number;
      stability: number;
    }

    const panels: PanelData[] = [];
    const dummy = new THREE.Object3D();

    const startX = -((cols - 1) * spacingX) / 2;
    const startZ = -((rows - 1) * spacingZ) / 2;

    // Architectural Palette:
    // Primary panel: #191919, Secondary: #202020, Raised: #252525, Highlight: #2d2d2d
    const colorBase = new THREE.Color(0x191919);
    const colorSec = new THREE.Color(0x202020);
    const colorRaised = new THREE.Color(0x252525);
    const colorHighlight = new THREE.Color(0x2d2d2d);
    const instanceColor = new THREE.Color();

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const z = startZ + r * spacingZ;

        // Controlled architectural base height variations (gentle plateaus of raised panels)
        const baseOffset =
          Math.sin(c * 0.45) * Math.cos(r * 0.40) * 0.08 +
          Math.sin(c * 0.90 + r * 0.60) * 0.04;

        // Stability factor so certain panels stay anchored while others breathe
        const stability = 0.65 + 0.35 * Math.sin(c * 0.55 + r * 0.75);

        panels.push({ x, z, baseOffset, stability });

        // Coherent procedural color grading matching the architectural plateaus
        const tColor = (Math.sin(c * 0.45) * Math.cos(r * 0.40) + 1) * 0.5;
        if (tColor > 0.72) {
          instanceColor.copy(colorHighlight);
        } else if (tColor > 0.48) {
          instanceColor.copy(colorRaised);
        } else if (tColor > 0.25) {
          instanceColor.copy(colorSec);
        } else {
          instanceColor.copy(colorBase);
        }
        instancedMesh.setColorAt(idx, instanceColor);

        dummy.position.set(x, baseOffset, z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(idx, dummy.matrix);

        idx++;
      }
    }

    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);

    // --- MOUSE PARALLAX (DESKTOP ONLY) ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouseX = (e.clientX - halfW) / halfW; // [-1, 1]
      targetMouseY = (e.clientY - halfH) / halfH; // [-1, 1]
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // --- RESIZE OBSERVER ---
    const handleResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== "undefined" && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    // --- ANIMATION LOOP: CONTINUOUS LIVING SURFACE ---
    let lastTime = performance.now();
    let totalTime = 0;

    const animate = (now: number) => {
      if (isDisposed || !renderer) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      totalTime += delta * 0.55; // Slow, mechanical breathing pace
      const time = totalTime;

      // Smooth inertia-damped mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;

      camera.position.x = currentMouseX * 1.5;
      camera.position.y = baseCamY + currentMouseY * 0.8;
      camera.lookAt(currentMouseX * 0.25, isMobile ? -0.8 : -0.6, isMobile ? -1.2 : -1.5);

      // Subtle travelling light sweep creating dynamic edge highlights
      keyLight.position.x = 16 + Math.cos(time * 0.16) * 4;
      keyLight.position.z = 14 + Math.sin(time * 0.16) * 4;

      // Update travelling wave displacement for each panel (0.04 - 0.12 units)
      for (let i = 0; i < count; i++) {
        const p = panels[i];

        // Multi-frequency harmonic wave: diagonal sweep + counter crest + subtle center pulse
        const wave1 = Math.sin(p.x * 0.16 + p.z * 0.14 - time) * 0.06;
        const wave2 = Math.cos(p.x * 0.10 - p.z * 0.18 + time * 0.65) * 0.04;
        const dist = Math.sqrt(p.x * p.x + p.z * p.z);
        const wave3 = Math.sin(dist * 0.12 - time * 0.40) * 0.03;

        const dynamicY = p.baseOffset + (wave1 + wave2 + wave3) * p.stability;

        dummy.position.set(p.x, dynamicY, p.z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // --- CLEANUP & DISPOSAL ---
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }

      scene.remove(instancedMesh);
      boxGeometry.dispose();
      panelMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

export default LivingIdentityGrid;
