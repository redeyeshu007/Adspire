"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AcidSquares } from "./AcidSquares";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PersistentBackground — Master Scroll-Driven Background Controller
 *
 * Keeps a single high-performance WebGL2 AcidSquares canvas mounted permanently
 * behind both Hero and Section 02.
 *
 * On scroll down:
 * - Smoothly dissolves the AcidSquares 3D modular tiles and copper lighting into pure black (#000000).
 * - Deactivates canvas pointer listeners once scrolled into Section 02.
 *
 * On scroll up (reverse):
 * - Seamlessly restores the AcidSquares background and interactive wave dynamics.
 */
export function PersistentBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const dissolveOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvasWrapper = canvasWrapperRef.current;
    const dissolveOverlay = dissolveOverlayRef.current;
    if (!container || !canvasWrapper || !dissolveOverlay) return;

    // Check accessibility reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ScrollTrigger: Tied directly to user's vertical scroll progress through Hero
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 0.85, 400)}`,
      scrub: prefersReducedMotion ? false : 0.4,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 at top of hero -> 1.0 at entrance of Section 02

        // 1. Dissolve background into pure black (#000000)
        gsap.set(dissolveOverlay, { opacity: p });

        // 2. Smoothly attenuate canvas scale & opacity
        gsap.set(canvasWrapper, {
          opacity: Math.max(0, 1 - p * 0.9),
          scale: 1.015 - p * 0.015,
        });

        // 3. Pointer events: enable in hero for waves, disable in Section 02 for text selection
        container.style.pointerEvents = p > 0.25 ? "none" : "auto";
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto select-none"
      aria-hidden="true"
    >
      {/* 1. AcidSquares Interactive WebGL2 Modular Tile Canvas with subtle depth blur */}
      <div
        ref={canvasWrapperRef}
        className="w-full h-full [filter:blur(2px)] scale-[1.015] will-change-transform will-change-opacity pointer-events-auto"
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

      {/* 2. Delicate Atmospheric Shadow Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.15)_0%,rgba(8,8,8,0.45)_100%)]"
        aria-hidden="true"
      />

      {/* 3. Scroll-Driven Pure Black Dissolve Layer */}
      <div
        ref={dissolveOverlayRef}
        className="absolute inset-0 bg-[#000000] pointer-events-none z-20 opacity-0 will-change-opacity"
        aria-hidden="true"
      />
    </div>
  );
}

export default PersistentBackground;
