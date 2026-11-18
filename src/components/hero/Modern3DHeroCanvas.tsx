"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Modern3DHeroCanvasProps {
  className?: string;
  onLoaded?: () => void;
}

/**
 * Modern3DHeroCanvas — Next-Gen Interactive 3D Three.js Hero Experience
 *
 * Exclusively enhances the Hero section with:
 * 1. Modern 3D Topological Kinetic Wave Surface in Adspire brand colors (#EE4530 / #FF7255 / #050505)
 * 2. Luminous 3D Floating Typography ("Build Better.", "Reach Further.", "Grow Smarter.") with dynamic specular glints
 * 3. Interactive Cursor Physics: 3D flame point light following cursor, interactive wave ripples, camera parallax tilt
 * 4. Micro-ember particle physics rising through 3D atmospheric fog
 * 5. Automatic sleep when out of viewport for peak 60fps performance
 */
export function Modern3DHeroCanvas({ className = "", onLoaded }: Modern3DHeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Accessibility check: reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // --- 2. LIGHTING SYSTEM ---
    // Ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Primary Overhead Key Light (Crisp White for typography brilliance)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(0, 5, 8);
    scene.add(keyLight);

    // Dynamic 3D Cursor Point Light (Flame Vermilion #EE4530)
    const cursorLight = new THREE.PointLight(0xee4530, 12.0, 22, 1.2);
    cursorLight.position.set(0, 0, 4.5);
    scene.add(cursorLight);

    // Secondary Accent Rim Light (Warm Coral)
    const rimLight = new THREE.DirectionalLight(0xff7255, 1.8);
    rimLight.position.set(-6, 6, 4);
    scene.add(rimLight);

    // Fill Light (Soft White)
    const softFillLight = new THREE.PointLight(0xffffff, 1.8, 16);
    softFillLight.position.set(5, -4, 4);
    scene.add(softFillLight);

    // --- 3. MODERN 3D BACKGROUND: TOPOLOGICAL KINETIC PARTICLES ---
    const gridCols = 90;
    const gridRows = 65;
    const numParticles = gridCols * gridRows;
    const particlePositions = new Float32Array(numParticles * 3);
    const particleColors = new Float32Array(numParticles * 3);
    const basePositions = new Float32Array(numParticles * 3);

    const colorDark = new THREE.Color(0x0e0302);
    const colorDeepFlame = new THREE.Color(0x9e1e0e);
    const colorFlame = new THREE.Color(0xee4530);
    const colorCoral = new THREE.Color(0xff8a65);
    const colorGlowWhite = new THREE.Color(0xffffff);

    let idx = 0;
    const widthSpan = 30;
    const heightSpan = 22;

    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridCols; j++) {
        const u = j / (gridCols - 1);
        const v = i / (gridRows - 1);

        const x = (u - 0.5) * widthSpan;
        const y = (v - 0.5) * heightSpan - 0.8;
        const z = -2.6 - Math.sin(u * Math.PI) * 1.9;

        particlePositions[idx * 3] = x;
        particlePositions[idx * 3 + 1] = y;
        particlePositions[idx * 3 + 2] = z;

        basePositions[idx * 3] = x;
        basePositions[idx * 3 + 1] = y;
        basePositions[idx * 3 + 2] = z;

        // Radial color mix towards flame accent center
        const distFromCenter = Math.sqrt(x * x + (y + 1.2) * (y + 1.2)) / 11;
        const mixColor = new THREE.Color().copy(colorDark).lerp(colorDeepFlame, Math.max(0, 1 - distFromCenter * 0.75));
        if (distFromCenter < 0.65) {
          mixColor.lerp(colorFlame, 0.55);
        }
        if (Math.random() > 0.88) {
          mixColor.lerp(colorCoral, 0.7);
        }
        if (Math.random() > 0.985) {
          mixColor.lerp(colorGlowWhite, 0.85);
        }

        particleColors[idx * 3] = mixColor.r;
        particleColors[idx * 3 + 1] = mixColor.g;
        particleColors[idx * 3 + 2] = mixColor.b;

        idx++;
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite texture (soft circular glow with flame core)
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pctx = particleCanvas.getContext("2d");
    if (pctx) {
      const grad = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.28, "rgba(238, 69, 48, 0.95)");
      grad.addColorStop(0.65, "rgba(238, 69, 48, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      pctx.fillStyle = grad;
      pctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating Cyber-Embers (90 sparks)
    const emberCount = 95;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities: Array<{ x: number; y: number; z: number }> = [];

    for (let e = 0; e < emberCount; e++) {
      emberPositions[e * 3] = (Math.random() - 0.5) * 20;
      emberPositions[e * 3 + 1] = (Math.random() - 0.5) * 15;
      emberPositions[e * 3 + 2] = (Math.random() - 0.5) * 8 + 1.2;
      emberVelocities.push({
        x: (Math.random() - 0.5) * 0.0035,
        y: Math.random() * 0.0055 + 0.0035,
        z: (Math.random() - 0.5) * 0.0035,
      });
    }

    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      size: 0.14,
      color: 0xff7255,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
      depthWrite: false,
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    scene.add(emberPoints);

    // --- 4. 3D FLOATING TYPOGRAPHY SYSTEM ---
    const textGroup = new THREE.Group();
    scene.add(textGroup);

    interface TextLineConfig {
      text: string;
      fontVar: string;
      fallbackFont: string;
      fontStyle?: string;
      fontWeight: string;
      color: string;
      accentPeriod?: boolean;
      yRatio: number; // Vertical offset relative to 3D view height
      zOffset: number; // 3D depth layer
      meshWidth: number;
      meshHeight: number;
    }

    const LINES_CONFIG: TextLineConfig[] = [
      {
        text: "Build Better.",
        fontVar: "--font-hero-1",
        fallbackFont: "'Plus Jakarta Sans', sans-serif",
        fontStyle: "normal",
        fontWeight: "800",
        color: "#FFFFFF",
        yRatio: 0.13,
        zOffset: 0.15,
        meshWidth: 8.5,
        meshHeight: 1.45,
      },
      {
        text: "Reach Further.",
        fontVar: "--font-hero-2",
        fallbackFont: "'Instrument Serif', Georgia, serif",
        fontStyle: "italic",
        fontWeight: "400",
        color: "#FFFFFF",
        yRatio: -0.005,
        zOffset: 0.4,
        meshWidth: 8.5,
        meshHeight: 1.45,
      },
      {
        text: "Grow Smarter",
        fontVar: "--font-hero-3",
        fallbackFont: "'Space Grotesk', sans-serif",
        fontStyle: "normal",
        fontWeight: "700",
        color: "#FFFFFF",
        accentPeriod: true,
        yRatio: -0.14,
        zOffset: 0.65,
        meshWidth: 8.5,
        meshHeight: 1.45,
      },
    ];

    const textMeshes: THREE.Mesh[] = [];
    const textTextures: THREE.CanvasTexture[] = [];

    const renderTextToCanvas = (cfg: TextLineConfig, c: HTMLCanvasElement) => {
      c.width = 2048;
      c.height = 360;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, c.width, c.height);

      // Determine computed font family
      let resolvedFont = cfg.fallbackFont;
      if (typeof window !== "undefined") {
        const computed = getComputedStyle(document.body).getPropertyValue(cfg.fontVar).trim();
        if (computed) {
          resolvedFont = `${computed}, ${cfg.fallbackFont}`;
        }
      }

      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.font = `${cfg.fontStyle || "normal"} ${cfg.fontWeight} 150px ${resolvedFont}`;

      // Subtle atmospheric edge glow
      ctx.shadowColor = "rgba(238, 69, 48, 0.45)";
      ctx.shadowBlur = 24;

      ctx.fillStyle = cfg.color;
      const startX = 35;
      const centerY = c.height / 2;
      ctx.fillText(cfg.text, startX, centerY);

      // Dedicated flame accent period on Line 3
      if (cfg.accentPeriod) {
        const textWidth = ctx.measureText(cfg.text).width;
        ctx.shadowColor = "#EE4530";
        ctx.shadowBlur = 36;
        ctx.fillStyle = "#EE4530";
        ctx.fillText(".", startX + textWidth - 8, centerY);
      }
    };

    LINES_CONFIG.forEach((cfg) => {
      const c = document.createElement("canvas");
      renderTextToCanvas(cfg, c);

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      textTextures.push(tex);

      const geom = new THREE.PlaneGeometry(cfg.meshWidth, cfg.meshHeight);
      // Luminous high-contrast material that catches lights beautifully
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        roughness: 0.15,
        metalness: 0.4,
        emissive: 0x2a0b06,
        emissiveIntensity: 0.45,
        depthTest: true,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0, 0, cfg.zOffset);
      textGroup.add(mesh);
      textMeshes.push(mesh);
    });

    // Re-render textures once web fonts have fully loaded
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        textMeshes.forEach((mesh, idx) => {
          const cfg = LINES_CONFIG[idx];
          const tex = textTextures[idx];
          if (tex && tex.image) {
            renderTextToCanvas(cfg, tex.image as HTMLCanvasElement);
            tex.needsUpdate = true;
          }
        });
      });
    }

    if (onLoaded) onLoaded();

    // --- 5. INTERACTION & MOUSE PHYSICS ---
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // --- 6. SCROLL DISSOLVE TRIGGER ---
    let scrollProgress = 0;
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: prefersReducedMotion ? false : 0.25,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    // --- 7. ANIMATION RAF LOOP ---
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
      if (!isVisible && scrollProgress >= 0.99) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring physics
      const springRate = prefersReducedMotion ? 0.02 : 0.06;
      mouse.x += (mouse.targetX - mouse.x) * springRate;
      mouse.y += (mouse.targetY - mouse.y) * springRate;

      // Dynamic 3D Cursor Light Position
      cursorLight.position.x = mouse.x * 6.5;
      cursorLight.position.y = mouse.y * 4.5;
      cursorLight.position.z = 4.2 + Math.sin(elapsedTime * 1.5) * 0.4;

      // Subtle 3D Camera Tilt
      camera.position.x = mouse.x * 0.45;
      camera.position.y = mouse.y * 0.35;
      camera.lookAt(0, 0, 0);

      // 3D Typography Interactive Parallax & Float
      textGroup.rotation.y = mouse.x * 0.08;
      textGroup.rotation.x = -mouse.y * 0.06;

      // Floating gentle wave on each 3D text line
      textMeshes.forEach((mesh, mIdx) => {
        const floatWave = Math.sin(elapsedTime * 1.3 + mIdx * 0.75) * 0.04;
        mesh.position.y = mesh.userData.baseY + floatWave;
        // Parallax depth amplification across Z layers
        mesh.position.x = mesh.userData.baseX + mouse.x * (0.09 + mIdx * 0.07);
      });

      // Scroll Dissolve: Move 3D text upward and fade out as user scrolls into Section 02
      if (scrollProgress > 0) {
        textGroup.position.y = scrollProgress * 4.2;
        textGroup.position.z = scrollProgress * 2.2;
        const textOpacity = Math.max(0, 1 - scrollProgress * 1.35);
        textMeshes.forEach((mesh) => {
          (mesh.material as THREE.MeshStandardMaterial).opacity = textOpacity;
        });

        // Background particles dissolve into depth
        particles.position.z = -scrollProgress * 5.5;
        particleMaterial.opacity = Math.max(0, 1 - scrollProgress * 1.15);
      } else {
        textGroup.position.y = 0;
        textGroup.position.z = 0;
        textMeshes.forEach((mesh) => {
          (mesh.material as THREE.MeshStandardMaterial).opacity = 1;
        });
        particles.position.z = 0;
        particleMaterial.opacity = 1;
      }

      // Update 3D Background Wave Geometry
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      let pIdx = 0;
      const waveSpeed = prefersReducedMotion ? 0.2 : 0.85;

      for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
          const u = j / (gridCols - 1);
          const v = i / (gridRows - 1);

          const bx = basePositions[pIdx * 3];
          const by = basePositions[pIdx * 3 + 1];
          const bz = basePositions[pIdx * 3 + 2];

          // Kinetic wave interference
          const wave1 = Math.sin(u * 7.5 + elapsedTime * waveSpeed) * 0.52;
          const wave2 = Math.cos(v * 6.0 + elapsedTime * waveSpeed * 0.8) * 0.38;
          const wave3 = Math.sin((u + v) * 5.2 - elapsedTime * waveSpeed * 0.6) * 0.28;

          // Interactive Cursor Repulsion / Ripple
          const dx = bx - mouse.x * 6;
          const dy = by - mouse.y * 4;
          const distSq = dx * dx + dy * dy;
          const mouseRipple = Math.exp(-distSq / 14) * 1.25;

          posArray[pIdx * 3 + 2] = bz + wave1 + wave2 + wave3 + mouseRipple;

          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      // Floating Ember Physics
      const emberPosAttr = emberGeo.attributes.position as THREE.BufferAttribute;
      const emberPosArray = emberPosAttr.array as Float32Array;

      for (let e = 0; e < emberCount; e++) {
        const vel = emberVelocities[e];
        emberPosArray[e * 3 + 1] += vel.y;
        emberPosArray[e * 3] += vel.x + Math.sin(elapsedTime + e) * 0.002;

        if (emberPosArray[e * 3 + 1] > 7.5) {
          emberPosArray[e * 3 + 1] = -7.5;
          emberPosArray[e * 3] = (Math.random() - 0.5) * 20;
        }
      }
      emberPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- 8. RESPONSIVE POSITIONING & RESIZE LISTENER ---
    const updateLayout = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;

      // Calculate camera visible bounds in 3D world units at text depth (z ~ 0.4)
      const targetZ = 0.4;
      const vFOV = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * (camera.position.z - targetZ);
      const visibleWidth = visibleHeight * camera.aspect;

      // Responsive scale factors
      let scale = 1.0;
      if (w < 640) {
        scale = 0.52;
      } else if (w < 768) {
        scale = 0.64;
      } else if (w < 1024) {
        scale = 0.78;
      } else if (w < 1440) {
        scale = 0.92;
      }

      // Responsive left margin matching editorial grid (clamp 24px - 160px)
      const marginPx = Math.min(Math.max(w * 0.088, 24), 160);
      const marginRatio = marginPx / w;
      const leftEdgeX = -visibleWidth / 2;
      const targetStartX = leftEdgeX + visibleWidth * marginRatio;

      textMeshes.forEach((mesh, mIdx) => {
        const cfg = LINES_CONFIG[mIdx];
        mesh.scale.set(scale, scale, 1);

        // Position mesh so the left edge of the text aligns with targetStartX
        const effectiveWidth = cfg.meshWidth * scale;
        const textOffsetInMesh = effectiveWidth * (35 / 2048);
        const meshCenterX = targetStartX - textOffsetInMesh + effectiveWidth / 2;

        const meshCenterY = visibleHeight * cfg.yRatio;

        mesh.userData.baseX = meshCenterX;
        mesh.userData.baseY = meshCenterY;
        mesh.position.set(meshCenterX, meshCenterY, cfg.zOffset);
      });

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout, { passive: true });

    // --- 9. CLEANUP ---
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      scrollTrigger.kill();
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", updateLayout);

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();

      emberGeo.dispose();
      emberMat.dispose();

      textMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });

      renderer.dispose();
    };
  }, [onLoaded]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full outline-none" />
    </div>
  );
}

export default Modern3DHeroCanvas;
