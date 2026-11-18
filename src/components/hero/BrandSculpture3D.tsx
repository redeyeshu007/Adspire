"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface BrandSculpture3DProps {
  className?: string;
}

/**
 * BrandSculpture3D — 3D Floating Broadcast TV Screen Showing Brand Promotions
 *
 * Implements an interactive 3D TV monitor broadcasting Adspire agency campaigns:
 * - 3D floating television monitor with sleek dark chassis and chrome trim
 * - High-energy brand promotion broadcast feed cycling through campaign promotions:
 *     1. Performance Marketing & Scale (+340% Revenue Growth)
 *     2. Viral Social Media & Influencer (18.5M+ Impressions)
 *     3. Bespoke Brand Identity & Creative Direction
 *     4. Next-Gen Web, 3D & AI Technology
 * - Realistic broadcast elements: Blinking red REC indicator, live audio visualizer bars, channel tag, scanlines
 * - Interactive 3D mouse tracking (TV tilts toward user cursor with spring physics)
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

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // --- 2. LIGHTING SYSTEM ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const flameFillLight = new THREE.PointLight(0xee4530, 7.0, 14, 1.1);
    flameFillLight.position.set(-3.0, -2.0, 3.5);
    scene.add(flameFillLight);

    // --- 3. DYNAMIC BRAND PROMOTION SCREEN CANVAS (1024x640) ---
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 640;
    const sctx = screenCanvas.getContext("2d");

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    // Campaign promotions to cycle through
    const CAMPAIGNS = [
      {
        tag: "PERFORMANCE MARKETING",
        client: "E-COMMERCE & SAAS SCALE",
        stat: "+340% ROAS",
        headline: "SCALE BEYOND LIMITS",
        desc: "Precision ad targeting turning media spend into exponential revenue.",
        accent: "#EE4530",
      },
      {
        tag: "VIRAL SOCIAL MEDIA",
        client: "CULTURE & COMMUNITY",
        stat: "18.5M+ REACH",
        headline: "DOMINATE THE FEED",
        desc: "High-voltage content driving massive organic engagement and brand hype.",
        accent: "#FF6247",
      },
      {
        tag: "BRAND IDENTITY & DESIGN",
        client: "LUXURY & TECH REBRAND",
        stat: "BESPOKE SYSTEM",
        headline: "COMMAND ATTENTION",
        desc: "Visual identity, 3D motion, and typography crafted for category leaders.",
        accent: "#FFA07A",
      },
      {
        tag: "NEXT-GEN DIGITAL APPS",
        client: "WEB3 & AI PLATFORMS",
        stat: "60FPS DIGITAL OS",
        headline: "BUILT FOR TOMORROW",
        desc: "Cutting-edge interactive web experiences engineered to outshine competitors.",
        accent: "#EE4530",
      },
    ];

    let currentCampaignIdx = 0;
    let campaignTimer = 0;
    const CAMPAIGN_DURATION = 3.6; // seconds per promo show

    const renderScreen = (time: number) => {
      if (!sctx) return;
      const w = screenCanvas.width;
      const h = screenCanvas.height;

      // Update current promo index
      currentCampaignIdx = Math.floor(time / CAMPAIGN_DURATION) % CAMPAIGNS.length;
      const cur = CAMPAIGNS[currentCampaignIdx];
      const next = CAMPAIGNS[(currentCampaignIdx + 1) % CAMPAIGNS.length];
      const transitionProgress = (time % CAMPAIGN_DURATION) / CAMPAIGN_DURATION;

      // Deep dark futuristic broadcast backdrop
      const bgGrad = sctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, "#080403");
      bgGrad.addColorStop(0.5, "#140604");
      bgGrad.addColorStop(1, "#0a0201");
      sctx.fillStyle = bgGrad;
      sctx.fillRect(0, 0, w, h);

      // Atmospheric glowing radial ambient burst
      const radial = sctx.createRadialGradient(w * 0.7, h * 0.45, 10, w * 0.7, h * 0.45, 420);
      radial.addColorStop(0, "rgba(238, 69, 48, 0.45)");
      radial.addColorStop(0.5, "rgba(238, 69, 48, 0.12)");
      radial.addColorStop(1, "rgba(0, 0, 0, 0)");
      sctx.fillStyle = radial;
      sctx.fillRect(0, 0, w, h);

      // Subtle high-tech grid lines
      sctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      sctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < w; x += gridSize) {
        sctx.beginPath();
        sctx.moveTo(x, 0);
        sctx.lineTo(x, h);
        sctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        sctx.beginPath();
        sctx.moveTo(0, y);
        sctx.lineTo(w, y);
        sctx.stroke();
      }

      // --- TOP BROADCAST HEADER ---
      // Blinking REC Indicator
      const isBlinkOn = Math.floor(time * 2) % 2 === 0;
      sctx.fillStyle = isBlinkOn ? "#EE4530" : "rgba(238, 69, 48, 0.25)";
      sctx.beginPath();
      sctx.arc(44, 44, 8, 0, Math.PI * 2);
      sctx.fill();

      sctx.fillStyle = "#FFFFFF";
      sctx.font = "bold 16px 'Space Grotesk', monospace, sans-serif";
      sctx.fillText("REC", 62, 50);

      // Channel & Broadcast Tag
      sctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      sctx.font = "14px monospace";
      sctx.fillText("ADSPIRE TV // CH-04 • LIVE PROMO SHOW", 130, 50);

      // Live Audio Visualizer Bars
      const numBars = 16;
      const barStartX = w - 180;
      for (let b = 0; b < numBars; b++) {
        const barH = 6 + Math.abs(Math.sin(time * 6 + b * 0.8)) * 24;
        sctx.fillStyle = b > 12 ? "#EE4530" : "rgba(255, 255, 255, 0.75)";
        sctx.fillRect(barStartX + b * 9, 52 - barH, 5, barH);
      }

      // Divider line
      sctx.strokeStyle = "rgba(238, 69, 48, 0.4)";
      sctx.beginPath();
      sctx.moveTo(35, 74);
      sctx.lineTo(w - 35, 74);
      sctx.stroke();

      // --- CENTER PROMOTION CONTENT ---
      // Campaign Category Badge
      sctx.fillStyle = cur.accent;
      sctx.fillRect(44, 110, 8, 28);

      sctx.font = "bold 15px monospace";
      sctx.fillStyle = cur.accent;
      sctx.fillText(`PROMO SHOWCASE // ${cur.tag}`, 62, 128);

      // Main Bold Headline
      sctx.fillStyle = "#FFFFFF";
      sctx.font = "800 48px 'Plus Jakarta Sans', sans-serif";
      sctx.fillText(cur.headline, 44, 195);

      // Client Category Subtitle
      sctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      sctx.font = "bold 20px 'Space Grotesk', sans-serif";
      sctx.fillText(`CAMPAIGN SPOTLIGHT • ${cur.client}`, 44, 238);

      // Metric Card (The Big Stat)
      sctx.fillStyle = "rgba(238, 69, 48, 0.16)";
      sctx.strokeStyle = "rgba(238, 69, 48, 0.55)";
      sctx.lineWidth = 1.5;
      sctx.beginPath();
      sctx.roundRect(44, 275, 420, 140, 14);
      sctx.fill();
      sctx.stroke();

      sctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      sctx.font = "13px monospace";
      sctx.fillText("PROVEN PERFORMANCE RESULT", 66, 310);

      sctx.fillStyle = "#FFFFFF";
      sctx.font = "800 52px 'Plus Jakarta Sans', sans-serif";
      sctx.shadowColor = "#EE4530";
      sctx.shadowBlur = 18;
      sctx.fillText(cur.stat, 66, 375);
      sctx.shadowBlur = 0; // reset shadow

      // Right-side dynamic brand visual preview box
      const previewX = w - 460;
      const previewY = 160;
      const previewW = 415;
      const previewH = 260;

      sctx.fillStyle = "rgba(10, 4, 3, 0.85)";
      sctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      sctx.lineWidth = 1;
      sctx.beginPath();
      sctx.roundRect(previewX, previewY, previewW, previewH, 12);
      sctx.fill();
      sctx.stroke();

      // Animated energy wave inside preview box
      sctx.save();
      sctx.beginPath();
      sctx.roundRect(previewX, previewY, previewW, previewH, 12);
      sctx.clip();

      sctx.strokeStyle = cur.accent;
      sctx.lineWidth = 2.5;
      sctx.beginPath();
      for (let px = 0; px < previewW; px += 4) {
        const py =
          previewY +
          previewH / 2 +
          Math.sin(px * 0.04 + time * 4.5) * 45 * Math.sin(px * 0.015);
        if (px === 0) sctx.moveTo(previewX + px, py);
        else sctx.lineTo(previewX + px, py);
      }
      sctx.stroke();

      // Circular rotating brand glyph inside preview box
      sctx.save();
      sctx.translate(previewX + previewW / 2, previewY + previewH / 2);
      sctx.rotate(time * 0.8);
      sctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      sctx.lineWidth = 1.5;
      sctx.beginPath();
      sctx.arc(0, 0, 45, 0, Math.PI * 2);
      sctx.stroke();
      sctx.beginPath();
      sctx.arc(0, 0, 68, 0, Math.PI * 1.5);
      sctx.stroke();
      sctx.restore();

      // Brand Logo Watermark in Preview
      sctx.fillStyle = "#FFFFFF";
      sctx.font = "bold 20px 'Space Grotesk', sans-serif";
      sctx.fillText("ADSPIRE MEDIA", previewX + 24, previewY + previewH - 24);

      sctx.restore();

      // Explanatory Paragraph
      sctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      sctx.font = "17px 'Space Grotesk', sans-serif";
      sctx.fillText(cur.desc, 44, 465);

      // --- BOTTOM LIVE NEWS TICKER ---
      sctx.fillStyle = "#0c0403";
      sctx.fillRect(0, h - 68, w, 68);

      sctx.strokeStyle = "#EE4530";
      sctx.lineWidth = 2;
      sctx.beginPath();
      sctx.moveTo(0, h - 68);
      sctx.lineTo(w, h - 68);
      sctx.stroke();

      // Ticker Badge
      sctx.fillStyle = "#EE4530";
      sctx.fillRect(0, h - 68, 120, 68);
      sctx.fillStyle = "#FFFFFF";
      sctx.font = "bold 15px monospace";
      sctx.fillText("LIVE PROMO", 16, h - 28);

      // Continuous Scrolling Marquee Ticker
      const tickerText =
        "★ BRAND STRATEGY ★ PERFORMANCE MARKETING ★ 3D & CREATIVE TECH ★ VIRAL CONTENT REELS ★ DIGITAL COMMERCE ★ ROAS SCALE ★ PARTNER WITH ADSPIRE MEDIA ★ ";
      const tickerOffset = (time * 65) % 650;
      sctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      sctx.font = "bold 16px monospace";
      sctx.fillText(tickerText + tickerText, 140 - tickerOffset, h - 28);

      // Scanline overlay for realistic CRT / broadcast TV look
      sctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      for (let l = 0; l < h; l += 4) {
        sctx.fillRect(0, l, w, 2);
      }

      screenTexture.needsUpdate = true;
    };

    // --- 4. 3D RETRO-FUTURISTIC TV CHASSIS & SCREEN ASSEMBLY ---
    const tvGroup = new THREE.Group();
    scene.add(tvGroup);

    // A. Main TV Monitor Body (Matte Obsidian Metal)
    const bodyWidth = 3.6;
    const bodyHeight = 2.4;
    const bodyDepth = 0.55;
    const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.85,
      roughness: 0.35,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    tvGroup.add(bodyMesh);

    // Front Bezel Frame (Polished Titanium / Chrome Trim)
    const bezelGeo = new THREE.BoxGeometry(bodyWidth + 0.08, bodyHeight + 0.08, 0.08);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x22222a,
      metalness: 0.95,
      roughness: 0.2,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0, bodyDepth / 2 - 0.02);
    tvGroup.add(bezelMesh);

    // B. The Display Screen Plane (Displays the Live Brand Promotion Canvas Texture)
    const screenGeo = new THREE.PlaneGeometry(bodyWidth - 0.28, bodyHeight - 0.28);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, bodyDepth / 2 + 0.025);
    tvGroup.add(screenMesh);

    // Screen Glass Reflection Coat
    const glassGeo = new THREE.PlaneGeometry(bodyWidth - 0.28, bodyHeight - 0.28);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 0, bodyDepth / 2 + 0.035);
    tvGroup.add(glassMesh);

    // C. Realistic TV Hardware Details
    // Power Indicator LED Light (Glowing Flame Vermilion)
    const ledGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xee4530 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(bodyWidth / 2 - 0.18, -bodyHeight / 2 + 0.14, bodyDepth / 2 + 0.04);
    tvGroup.add(ledMesh);

    // Brand Badge on Bottom Bezel ("ADSPIRE")
    const badgeGeo = new THREE.PlaneGeometry(0.65, 0.1);
    const badgeCanvas = document.createElement("canvas");
    badgeCanvas.width = 256;
    badgeCanvas.height = 40;
    const bctx = badgeCanvas.getContext("2d");
    if (bctx) {
      bctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      bctx.font = "bold 20px monospace";
      bctx.textAlign = "center";
      bctx.textBaseline = "middle";
      bctx.fillText("ADSPIRE", 128, 20);
    }
    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    const badgeMat = new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, -bodyHeight / 2 + 0.12, bodyDepth / 2 + 0.04);
    tvGroup.add(badgeMesh);

    // D. Dual Angled Chrome Antennas
    const antennaGeo = new THREE.CylinderGeometry(0.015, 0.025, 1.4, 16);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.95,
      roughness: 0.1,
    });

    const ant1 = new THREE.Mesh(antennaGeo, antennaMat);
    ant1.position.set(-0.6, bodyHeight / 2 + 0.6, -0.05);
    ant1.rotation.z = 0.45;
    tvGroup.add(ant1);

    const ant2 = new THREE.Mesh(antennaGeo, antennaMat);
    ant2.position.set(0.6, bodyHeight / 2 + 0.6, -0.05);
    ant2.rotation.z = -0.45;
    tvGroup.add(ant2);

    // E. Floating Gyro Orbital Rings around the TV
    const gyroGroup = new THREE.Group();
    tvGroup.add(gyroGroup);

    const ring1Geo = new THREE.TorusGeometry(2.7, 0.016, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xee4530,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI * 0.4;
    gyroGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.95, 0.014, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff7255,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI * 0.45;
    ring2.rotation.z = Math.PI * 0.2;
    gyroGroup.add(ring2);

    // Initial slight angle for cinematic 3D perspective
    tvGroup.rotation.y = -0.22;
    tvGroup.rotation.x = 0.08;

    // --- 5. INTERACTIVE MOUSE TRACKING ---
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

    // --- 6. ANIMATION RAF LOOP ---
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

      // Render updated broadcast promo frame to screen canvas
      renderScreen(elapsedTime);

      // Smooth mouse spring physics
      const springRate = prefersReducedMotion ? 0.02 : 0.06;
      mouse.x += (mouse.targetX - mouse.x) * springRate;
      mouse.y += (mouse.targetY - mouse.y) * springRate;

      // TV Floating Levitation & Perspective Tracking
      const pace = prefersReducedMotion ? 0.3 : 1.0;
      tvGroup.position.y = Math.sin(elapsedTime * 1.5 * pace) * 0.12;

      // TV tilts its screen directly towards mouse cursor
      tvGroup.rotation.y = -0.22 + mouse.x * 0.35;
      tvGroup.rotation.x = 0.08 - mouse.y * 0.25;

      // Antenna gentle wobble
      ant1.rotation.z = 0.45 + Math.sin(elapsedTime * 3) * 0.04;
      ant2.rotation.z = -0.45 - Math.sin(elapsedTime * 3 + 1) * 0.04;

      // Gyro Rings Slow Rotation
      ring1.rotation.z = elapsedTime * 0.4 * pace;
      ring2.rotation.x = elapsedTime * 0.3 * pace;

      renderer.render(scene, camera);
    };

    animate();

    // --- 7. RESIZE LISTENER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // --- 8. CLEANUP ---
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      bodyGeo.dispose();
      bodyMat.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      ledGeo.dispose();
      ledMat.dispose();
      badgeGeo.dispose();
      badgeTex.dispose();
      antennaGeo.dispose();
      antennaMat.dispose();
      ring1Geo.dispose();
      ringMat1.dispose();
      ring2Geo.dispose();
      ringMat2.dispose();
      screenTexture.dispose();
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
