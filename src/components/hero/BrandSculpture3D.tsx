"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface BrandSculpture3DProps {
  className?: string;
}

/**
 * BrandSculpture3D — Interactive Kinetic 3D Branding Agency Core
 *
 * Sculptural 3D branding agency centerpiece:
 * - Polished metallic chrome infinite Mobius brand loop with vibrant Adspire Flame Vermilion (#EE4530) specular highlights
 * - Pulsing vermilion faceted energy core
 * - Dual gyro orbital rings with glowing satellite beacons
 * - Orbiting agency disciplines typography band: "• BRAND IDENTITY • DIGITAL STRATEGY • PERFORMANCE • CREATIVE TECH"
 * - Interactive mouse tracking, spring damping, and hover levitation
 */
export function BrandSculpture3D({ className = "" }: BrandSculpture3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;

    // --- 2. LIGHTING SYSTEM ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Front Specular Key Light (Crisp White)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(2, 4, 6);
    scene.add(keyLight);

    // Flame Vermilion Accent Light (#EE4530)
    const flameLight = new THREE.PointLight(0xee4530, 9.0, 16, 1.1);
    flameLight.position.set(-3.0, -2.0, 3.5);
    scene.add(flameLight);

    // Warm Coral Rim Light (#FF7255)
    const coralLight = new THREE.DirectionalLight(0xff7255, 2.2);
    coralLight.position.set(-4, 3, -2);
    scene.add(coralLight);

    // --- 3. MASTER SCULPTURE GROUP ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Central Polished Metallic Chrome Brand Loop (Infinite Mobius Knot)
    const coreGeometry = new THREE.TorusKnotGeometry(1.15, 0.32, 160, 32, 2, 3);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f7,
      metalness: 0.88,
      roughness: 0.16,
      emissive: 0x3a0c06,
      emissiveIntensity: 0.42,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    masterGroup.add(coreMesh);

    // B. Inner Faceted Flame Core (Octahedron)
    const innerGeometry = new THREE.OctahedronGeometry(0.55, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xee4530,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    masterGroup.add(innerMesh);

    // C. Dual Gyro Orbital Rings
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    const ring1Geo = new THREE.TorusGeometry(2.05, 0.016, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xee4530,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.3, 0.014, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff7255,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI * 0.42;
    ring2.rotation.z = Math.PI * 0.18;
    ringGroup.add(ring2);

    // Luminous beacon satellites
    const beaconGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beacon1 = new THREE.Mesh(beaconGeo, beaconMat);
    ring1.add(beacon1);
    beacon1.position.set(2.05, 0, 0);

    const beacon2 = new THREE.Mesh(beaconGeo, beaconMat);
    ring2.add(beacon2);
    beacon2.position.set(0, 2.3, 0);

    // D. Orbiting Circular Agency Disciplines Ribbon
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 1024;
    textCanvas.height = 128;
    const tctx = textCanvas.getContext("2d");
    if (tctx) {
      tctx.clearRect(0, 0, 1024, 128);
      tctx.fillStyle = "#FFFFFF";
      tctx.font = "bold 34px 'Space Grotesk', monospace, sans-serif";
      tctx.textBaseline = "middle";
      tctx.textAlign = "center";
      tctx.shadowColor = "#EE4530";
      tctx.shadowBlur = 12;
      tctx.fillText(
        "• BRAND IDENTITY • DIGITAL STRATEGY • PERFORMANCE • CREATIVE TECH ",
        512,
        64
      );
    }
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.wrapS = THREE.RepeatWrapping;
    textTexture.repeat.set(1, 1);

    const ribbonGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.38, 64, 1, true);
    const ribbonMat = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.rotation.x = Math.PI * 0.12;
    masterGroup.add(ribbonMesh);

    // --- 4. INTERACTIVE MOUSE TRACKING ---
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = Math.max(-1.5, Math.min(1.5, nx));
      mouse.targetY = Math.max(-1.5, Math.min(1.5, ny));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- 5. ANIMATION RAF LOOP ---
    let rafId = 0;
    let clock = new THREE.Clock();
    let isVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring physics
      const springRate = prefersReducedMotion ? 0.02 : 0.06;
      mouse.x += (mouse.targetX - mouse.x) * springRate;
      mouse.y += (mouse.targetY - mouse.y) * springRate;

      // Core Loop Rotation
      const pace = prefersReducedMotion ? 0.25 : 0.85;
      coreMesh.rotation.x = elapsedTime * 0.38 * pace + mouse.y * 0.35;
      coreMesh.rotation.y = elapsedTime * 0.52 * pace + mouse.x * 0.45;

      // Inner Core Counter-Rotation & Pulse
      innerMesh.rotation.x = -elapsedTime * 0.65 * pace;
      innerMesh.rotation.y = -elapsedTime * 0.45 * pace;
      const innerScale = 0.55 + Math.sin(elapsedTime * 2.8) * 0.05;
      innerMesh.scale.set(innerScale, innerScale, innerScale);

      // Orbital Gyro Rings
      ring1.rotation.z = elapsedTime * 0.65 * pace;
      ring2.rotation.x = elapsedTime * 0.5 * pace;

      // Typography Ribbon Rotation
      ribbonMesh.rotation.y = -elapsedTime * 0.28 * pace;

      // Master Group Organic Float & Parallax
      masterGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.1;
      masterGroup.rotation.y = mouse.x * 0.22;
      masterGroup.rotation.x = -mouse.y * 0.18;

      // Dynamic light tracking
      flameLight.position.x = -3.0 + mouse.x * 1.8;
      flameLight.position.y = -2.0 + mouse.y * 1.8;

      renderer.render(scene, camera);
    };

    animate();

    // --- 6. RESIZE LISTENER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // --- 7. CLEANUP ---
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geo.dispose();
      ringMat1.dispose();
      ring2Geo.dispose();
      ringMat2.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      textTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-auto select-none ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full outline-none" />
    </div>
  );
}

export default BrandSculpture3D;
