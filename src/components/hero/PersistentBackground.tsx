"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AcidSquares } from "./AcidSquares";
import { CursorGrid } from "@/components/intro/CursorGrid";
import { PixelMorphTransition, PixelMorphTransitionRef } from "./PixelMorphTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PersistentBackground — Master Cinematic Pixel Morph Transition Controller
 *
 * Implements a continuous visual transformation connecting Section 01 and Section 02:
 * - STAGE 01: Original AcidSquares (0% progress)
 * - STAGE 02: Pixel Activation (0% -> 25%)
 * - STAGE 03: Pixel Disintegration & Controlled Dispersion (25% -> 55%)
 * - STAGE 04: Black Surface Emergence & Grid Alignment (55% -> 80%)
 * - STAGE 05: Pixel Reconstruction into 60px CursorGrid Lines (80% -> 95%)
 * - STAGE 06: CursorGrid Active with Spotlight & Pulse (100%)
 *
 * Fully reversible on upward scrolling.
 */
export function PersistentBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const acidWrapperRef = useRef<HTMLDivElement | null>(null);
  const morphWrapperRef = useRef<HTMLDivElement | null>(null);
  const cursorGridWrapperRef = useRef<HTMLDivElement | null>(null);
  const morphRef = useRef<PixelMorphTransitionRef | null>(null);
  const gridToBlackWrapperRef = useRef<HTMLDivElement | null>(null);
  const gridToBlackMorphRef = useRef<PixelMorphTransitionRef | null>(null);

  const [acidCanvas, setAcidCanvas] = useState<HTMLCanvasElement | null>(null);

  // Grab reference to AcidSquares canvas once mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = acidWrapperRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
      if (canvas) {
        setAcidCanvas(canvas);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const acidWrapper = acidWrapperRef.current;
    const morphWrapper = morphWrapperRef.current;
    const cursorGridWrapper = cursorGridWrapperRef.current;
    if (!container || !acidWrapper || !morphWrapper || !cursorGridWrapper) return;

    // Check accessibility reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Master ScrollTrigger scrubbing across the boundary between Section 01 and Section 02
    const trigger = ScrollTrigger.create({
      trigger: "#intro",
      start: "top bottom",
      end: "top top",
      scrub: prefersReducedMotion ? false : 0.35,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 at top of hero -> 1.0 at entrance of Section 02

        if (prefersReducedMotion) {
          // Simple clean crossfade for users who prefer reduced motion
          gsap.set(acidWrapper, { opacity: Math.max(0, 1 - p * 1.5) });
          gsap.set(cursorGridWrapper, { opacity: Math.min(1, p * 1.5) });
          gsap.set(morphWrapper, { opacity: 0 });
          container.style.pointerEvents = p > 0.5 ? "auto" : "auto";
          return;
        }

        // 1. Update shader progress on the WebGL Pixel Morph Transition
        morphRef.current?.setProgress(p);

        // Update live texture snapshot during the inception of the scroll
        if (p > 0.01 && p < 0.18) {
          morphRef.current?.updateSourceTexture();
        }

        // 2. STAGE MANAGEMENT & OPACITY HANDOFF
        // Stage 01: Pure AcidSquares (p <= 0.01)
        if (p <= 0.01) {
          gsap.set(acidWrapper, { opacity: 1, scale: 1.015 });
          gsap.set(morphWrapper, { opacity: 0 });
          gsap.set(cursorGridWrapper, { opacity: 0 });
          container.style.pointerEvents = "auto";
        }
        // Stage 02 - 05: Pixel Morph Transition (0.01 < p < 0.98)
        else if (p < 0.98) {
          // Transition canvas takes visual precedence
          gsap.set(morphWrapper, { opacity: 1 });

          // Fade out underlying AcidSquares as disintegration progresses
          const acidOpacity = Math.max(0, 1 - smoothstep(0.05, 0.40, p));
          gsap.set(acidWrapper, {
            opacity: acidOpacity,
            scale: 1.015 - p * 0.015,
          });

          // Pre-reveal CursorGrid as pixels settle into the grid
          const gridOpacity = smoothstep(0.70, 0.98, p);
          gsap.set(cursorGridWrapper, { opacity: gridOpacity });

          container.style.pointerEvents = "none";
        }
        // Stage 06: Pure CursorGrid Active (p >= 0.98)
        else {
          gsap.set(acidWrapper, { opacity: 0 });
          gsap.set(morphWrapper, { opacity: 0 });
          gsap.set(cursorGridWrapper, { opacity: 1 });
          container.style.pointerEvents = "auto";
        }
      },
    });

    // Master ScrollTrigger 2: Services -> Contact (CursorGrid -> Pixel Disintegration -> Pure Black)
    const gridToBlackWrapper = gridToBlackWrapperRef.current;
    const triggerContact = ScrollTrigger.create({
      trigger: "#contact",
      start: "top bottom",
      end: "top 35%",
      scrub: prefersReducedMotion ? false : 0.35,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 in Services -> 1.0 at entrance of Contact

        if (prefersReducedMotion) {
          gsap.set(cursorGridWrapper, { opacity: Math.max(0, 1 - p * 1.5) });
          if (gridToBlackWrapper) gsap.set(gridToBlackWrapper, { opacity: 0 });
          container.style.pointerEvents = p > 0.5 ? "none" : "auto";
          return;
        }

        gridToBlackMorphRef.current?.setProgress(p);

        // Stage A: Services Active (p <= 0.01)
        if (p <= 0.01) {
          gsap.set(cursorGridWrapper, { opacity: 1 });
          if (gridToBlackWrapper) gsap.set(gridToBlackWrapper, { opacity: 0 });
          container.style.pointerEvents = "auto";
        }
        // Stage B: Pixel Disintegration into Pure Black (0.01 < p < 0.98)
        else if (p < 0.98) {
          if (gridToBlackWrapper) gsap.set(gridToBlackWrapper, { opacity: 1 });
          // As disintegration begins, underlying grid lines fade out
          const gridFade = Math.max(0, 1 - smoothstep(0.02, 0.30, p));
          gsap.set(cursorGridWrapper, { opacity: gridFade });
          container.style.pointerEvents = "none";
        }
        // Stage C: Pure Black Active for Contact (p >= 0.98)
        else {
          gsap.set(cursorGridWrapper, { opacity: 0 });
          if (gridToBlackWrapper) gsap.set(gridToBlackWrapper, { opacity: 0 });
          container.style.pointerEvents = "none";
        }
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      trigger.kill();
      triggerContact.kill();
      clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto select-none"
      aria-hidden="true"
    >
      {/* 1. AcidSquares Interactive WebGL2 3D Modular Tile Canvas (Section 01 Background) */}
      <div
        ref={acidWrapperRef}
        className="absolute inset-0 w-full h-full [filter:blur(2px)] scale-[1.015] will-change-transform will-change-opacity pointer-events-auto z-10"
      >
        <AcidSquares
          color="#000000"
          accentColor="#671702"
          secondaryColor="#671702"
          tileSize={1}
          gap={0.1}
          roundness={0.08}
          rotation={35}
          waves={1}
          pulse={1}
          lighting="split"
          tilt={0.7}
          grain={0}
          intro
          mouseInteraction
          softness={0.15}
          bulge={0.3}
          gloss={0.65}
          waveScale={1}
          speed={0.6}
          shape="square"
          pulseSpeed={0.45}
          pulseSpacing={1}
          pulseWidth={1}
          pulseOrigin="center"
          brightness={0.88}
          zoom={1}
          depth={25}
          fade={0}
          opacity={1}
          hoverEffect="press"
          mouseStrength={1}
          mouseRadius={0.35}
          pulseOnClick
          detail="medium"
          dpr={1.5}
          lightMode={false}
        />
      </div>

      {/* 2. CursorGrid Interactive WebGL2 Background (Section 02 Background) */}
      <div
        ref={cursorGridWrapperRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-auto z-15"
      >
        <CursorGrid
          cellSize={60}
          color="#48250f"
          highlight="area"
          gridStyle="lines"
          radius={140}
          holdTime={260}
          fadeDuration={550}
          fillOpacity={0.06}
          gridOpacity={0.15}
          edgeFade={0}
          spotlight={0.6}
          clickPulse
          pulseSpeed={780}
          autoPulse={true}
          autoPulseInterval={1600}
          autoPulsePattern="double"
          autoPulseDoubleDelay={130}
          className="w-full h-full"
        />
      </div>

      {/* 3. Cinematic Pixel Morph WebGL2 Transition Layer (Section 01 -> Section 02) */}
      <div
        ref={morphWrapperRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-20 will-change-opacity"
      >
        <PixelMorphTransition
          ref={morphRef}
          sourceCanvas={acidCanvas}
          pixelSize={10}
          gridSize={60}
          gridColor="#48250f"
          copperColor="#671702"
          className="w-full h-full"
        />
      </div>

      {/* 4. Cinematic Pixel Disintegration WebGL2 Transition Layer (Section 03 -> Section 04: Grid to Black) */}
      <div
        ref={gridToBlackWrapperRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-22 will-change-opacity"
      >
        <PixelMorphTransition
          ref={gridToBlackMorphRef}
          mode="grid-to-black"
          pixelSize={10}
          gridSize={60}
          gridColor="#48250f"
          copperColor="#671702"
          className="w-full h-full"
        />
      </div>

      {/* 5. Delicate Atmospheric Ambient Shadow Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.12)_0%,rgba(8,8,8,0.40)_100%)]"
        aria-hidden="true"
      />
    </div>
  );
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export default PersistentBackground;
