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
 * Modern3DHeroCanvas — High-End 3D Ribbed Kinetic Ribbon Wave (Adspire Brand Palette)
 *
 * Implements the dark sculptural 3D ribbed contour topography in Adspire's signature palette:
 * - Flame Vermilion (#EE4530) & Radiant Coral (#FF7255) edge luminescence
 * - Dense horizontal scanline ribs over deep obsidian shadows
 * - Dynamic 3D Flame Vermilion point light tracking mouse cursor
 * - Interactive mouse spring physics (smooth rotation, curvature distortion, depth parallax)
 * - Auto-sleep on scroll for 60fps performance
 */
export function Modern3DHeroCanvas({ className = "", onLoaded }: Modern3DHeroCanvasProps) {
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
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // --- 2. CUSTOM SHADER FOR RIBBED 3D SURFACE IN ADSPIRE BRAND PALETTE ---
    const ribbonVertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Dynamic undulating fluid wave deformation
        float wave1 = sin(pos.x * 0.55 + uTime * 0.4) * cos(pos.y * 0.45 + uTime * 0.3);
        float wave2 = sin((pos.x * 0.7 - pos.y * 0.5) * 0.45 - uTime * 0.25) * 0.5;
        pos.z += (wave1 + wave2) * 0.95;

        // Interactive mouse gravity pull
        float distToMouse = length(pos.xy - uMouse * 4.5);
        pos.z += exp(-distToMouse * 0.3) * 0.8;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const ribbonFragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        // High-density procedural horizontal scanline ribs
        float ribFrequency = 58.0;
        float ribCoord = (vPosition.y * 2.0 + sin(vPosition.x * 0.75) * 0.4) * ribFrequency;

        float rib = sin(ribCoord);
        // Anti-aliased stripe profile
        float stripe = smoothstep(-0.1, 0.45, rib);

        // Lighting model
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.4);

        vec3 lightDir1 = normalize(vec3(0.5, 0.9, 1.1));
        float diff1 = max(dot(vNormal, lightDir1), 0.0);
        float spec1 = pow(max(dot(reflect(-lightDir1, vNormal), viewDir), 0.0), 22.0);

        // Dynamic 3D flame mouse light contribution
        vec3 mouseLightPos = vec3(uMouse.x * 6.0, uMouse.y * 4.0, 3.5);
        vec3 mouseLightDir = normalize(mouseLightPos - vPosition);
        float mouseDist = length(mouseLightPos - vPosition);
        float mouseDiff = max(dot(vNormal, mouseLightDir), 0.0) * exp(-mouseDist * 0.16);

        // Adspire Color Palette:
        // Flame Vermilion: #EE4530 -> rgb(0.933, 0.271, 0.188)
        // Warm Radiant Coral: #FF7255 -> rgb(1.0, 0.447, 0.333)
        // Silver Metallic: rgb(0.85, 0.88, 0.92)
        vec3 colFlame = vec3(0.933, 0.271, 0.188);
        vec3 colCoral = vec3(1.0, 0.447, 0.333);
        vec3 colSilver = vec3(0.82, 0.84, 0.88);

        // Edge chromatic dispersion with warm flame fringe
        float ribR = smoothstep(-0.18, 0.4, sin(ribCoord - 0.2));
        float ribG = smoothstep(-0.08, 0.48, sin(ribCoord));

        // Blend silver core with flame vermilion & coral rims
        vec3 ribColor = mix(colSilver * 0.75, colFlame, fresnel * 0.85 + mouseDiff * 0.9);
        ribColor = mix(ribColor, colCoral, ribR * 0.35);

        // Deep dark base tone with subtle ember warmth in shadows
        vec3 darkBase = vec3(0.01, 0.004, 0.003);
        vec3 highlightColor = ribColor * (diff1 * 0.85 + spec1 * 1.35 + fresnel * 0.8 + mouseDiff * 0.9);

        vec3 finalColor = mix(darkBase, highlightColor, stripe);

        // Text readability zone: soften ribs in the central area for extreme typography punch
        float centerDist = length(vPosition.xy - vec2(-0.5, 0.0));
        float centerSoftness = smoothstep(1.5, 6.0, centerDist);
        finalColor *= mix(0.44, 1.0, centerSoftness);

        // Outer radial vignette to blend seamlessly into pure black (#000000)
        float edgeFade = smoothstep(14.5, 2.5, length(vPosition.xy));
        finalColor *= edgeFade;

        gl_FragColor = vec4(finalColor, 0.95);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const ribbonMaterial = new THREE.ShaderMaterial({
      vertexShader: ribbonVertexShader,
      fragmentShader: ribbonFragmentShader,
      uniforms,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // --- 3. SCULPTED RIBBON GEOMETRIES (LEFT & RIGHT SWEEPS) ---
    const ribbonGroup = new THREE.Group();
    scene.add(ribbonGroup);

    // Left sweeping curved ribbon surface
    const leftGeometry = new THREE.PlaneGeometry(17, 20, 130, 130);
    const leftMesh = new THREE.Mesh(leftGeometry, ribbonMaterial);
    leftMesh.position.set(-6.5, 0.8, -2.8);
    leftMesh.rotation.set(0.25, 0.75, -0.2);
    ribbonGroup.add(leftMesh);

    // Right sweeping curved ribbon surface
    const rightGeometry = new THREE.PlaneGeometry(16, 19, 130, 130);
    const rightMesh = new THREE.Mesh(rightGeometry, ribbonMaterial);
    rightMesh.position.set(7.0, -0.6, -3.2);
    rightMesh.rotation.set(-0.25, -0.75, 0.28);
    ribbonGroup.add(rightMesh);

    // Background depth ribbon creating tunnel / layered horizon
    const bgGeometry = new THREE.PlaneGeometry(26, 20, 110, 110);
    const bgMesh = new THREE.Mesh(bgGeometry, ribbonMaterial);
    bgMesh.position.set(0, 3.2, -7.0);
    bgMesh.rotation.set(0.35, 0, 0.08);
    ribbonGroup.add(bgMesh);

    if (onLoaded) onLoaded();

    // --- 4. MOUSE & PARALLAX TRACKING ---
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

    // --- 5. SCROLL DISSOLVE TRIGGER ---
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
      if (!isVisible && scrollProgress >= 0.99) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring physics
      const springRate = prefersReducedMotion ? 0.02 : 0.055;
      mouse.x += (mouse.targetX - mouse.x) * springRate;
      mouse.y += (mouse.targetY - mouse.y) * springRate;

      // Update shader uniforms
      uniforms.uTime.value = elapsedTime;
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Camera parallax depth tilt
      camera.position.x = mouse.x * 0.6;
      camera.position.y = mouse.y * 0.4;
      camera.lookAt(0, 0, 0);

      // Ribbon group organic rotation
      ribbonGroup.rotation.y = mouse.x * 0.07 + Math.sin(elapsedTime * 0.2) * 0.03;
      ribbonGroup.rotation.x = -mouse.y * 0.05;

      // Scroll Dissolve
      if (scrollProgress > 0) {
        ribbonGroup.position.y = scrollProgress * 3.5;
        ribbonGroup.position.z = -scrollProgress * 6.0;
        renderer.toneMappingExposure = Math.max(0, 1.3 * (1 - scrollProgress * 1.25));
      } else {
        ribbonGroup.position.y = 0;
        ribbonGroup.position.z = 0;
        renderer.toneMappingExposure = 1.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 7. RESIZE LISTENER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;

      if (w < 768) {
        camera.position.z = 12.0;
        leftMesh.position.set(-4.5, 1.2, -3.2);
        rightMesh.position.set(4.8, -1.5, -3.8);
      } else {
        camera.position.z = 9.5;
        leftMesh.position.set(-6.5, 0.8, -2.8);
        rightMesh.position.set(7.0, -0.6, -3.2);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // --- 8. CLEANUP ---
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      scrollTrigger.kill();
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      leftGeometry.dispose();
      rightGeometry.dispose();
      bgGeometry.dispose();
      ribbonMaterial.dispose();
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
