"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandSculpture3D } from "./BrandSculpture3D";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroContentProps {
  delay?: number;
  autoPlay?: boolean;
}

/**
 * HeroContent — Next-Gen High-Tech Agency Editorial Layout (Adspire Palette)
 *
 * Implements the reference composition strictly aligned with Adspire's Flame Vermilion (#EE4530) palette:
 * 1. Top-left stepped headline:
 *    THE
 *    DIGITAL GROWTH
 *          OPERATING
 *    SYSTEM
 * 2. Center floating target reticle box with 4 corner '+' marks in Flame Vermilion (#EE4530)
 * 3. Bottom-right bold anchor:
 *    FOR BRANDS,
 *    AI, AND SCALE.
 * 4. Bottom-left glowing Flame Vermilion (#EE4530) pill dock with dual capsule action buttons
 * 5. Bottom-right tech monospace paragraph
 */
export function HeroContent({ delay = 0.2, autoPlay = true }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineLeftRef = useRef<HTMLDivElement | null>(null);
  const headlineRightRef = useRef<HTMLDivElement | null>(null);
  const sculptureRef = useRef<HTMLDivElement | null>(null);
  const subtextRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!autoPlay && !hasAnimatedRef.current) {
      gsap.set(
        [
          headlineLeftRef.current,
          headlineRightRef.current,
          sculptureRef.current,
          subtextRef.current,
        ],
        { opacity: 0, y: 24 }
      );
      return;
    }

    if (!autoPlay || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          headlineLeftRef.current,
          headlineRightRef.current,
          sculptureRef.current,
          subtextRef.current,
        ],
        { opacity: 1, y: 0 }
      );
      return;
    }

    // GSAP Orchestrated Staggered Entrance
    const tl = gsap.timeline({ delay });

    tl.fromTo(
      headlineLeftRef.current,
      { opacity: 0, y: 28, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
    )
      .fromTo(
        sculptureRef.current,
        { opacity: 0, scale: 0.82 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        headlineRightRef.current,
        { opacity: 0, y: 28, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        "-=0.55"
      )
      .fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" },
        "-=0.4"
      );

    // Scroll Dissolve into Section 02
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "40% top",
      scrub: 0.25,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(container, {
          opacity: Math.max(0, 1 - p * 1.35),
          y: -p * 36,
        });
      },
    });

    return () => {
      tl.kill();
      scrollTrigger.kill();
    };
  }, [autoPlay, delay]);

  return (
    <div
      ref={containerRef}
      className="relative z-20 w-full min-h-[100dvh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16 lg:px-20 pointer-events-none select-none"
    >
      {/* --- TOP / MIDDLE REGION: ASYMMETRIC HEADLINE + FLOATING RETICLE --- */}
      <div className="relative w-full flex-1 flex flex-col justify-center my-auto">
        {/* Top-Left Stepped Headline */}
        <div ref={headlineLeftRef} className="max-w-[900px] text-left">
          <h1 className="text-[#E2E8F0] uppercase font-extrabold tracking-[-0.03em] leading-[0.93] text-[clamp(42px,7.5vw,96px)] sm:text-6xl md:text-7xl lg:text-[clamp(76px,6.8vw,102px)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            <span className="block">THE</span>
            <span className="block">DIGITAL GROWTH</span>
            {/* Stepped indentation on Line 3 mirroring reference */}
            <span className="block pl-16 sm:pl-28 md:pl-48 text-[#CBD5E1]">
              OPERATING
            </span>
            <span className="block">SYSTEM</span>
          </h1>
        </div>

        {/* Upper-Right Space: 3D Interactive Branding Agency Kinetic Sculpture */}
        <div
          ref={sculptureRef}
          className="absolute right-0 sm:right-4 md:right-8 lg:right-12 top-0 sm:-top-4 md:-top-8 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] pointer-events-auto z-10 hidden sm:block"
        >
          <BrandSculpture3D />
        </div>

        {/* Bottom-Right Anchor Headline */}
        <div
          ref={headlineRightRef}
          className="w-full flex justify-end mt-4 sm:mt-6 md:mt-2 text-right"
        >
          <div className="max-w-[720px]">
            <h2 className="text-[#E2E8F0] uppercase font-extrabold tracking-[-0.03em] leading-[0.93] text-[clamp(36px,6.6vw,84px)] sm:text-5xl md:text-6xl lg:text-[clamp(68px,6.0vw,90px)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              <span className="block">FOR BRANDS,</span>
              <span className="block text-[#CBD5E1]">
                AI, AND SCALE<span className="text-[#EE4530]">.</span>
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* --- BOTTOM REGION: MONOSPACE NARRATIVE (RIGHT) --- */}
      <div className="relative w-full flex justify-end pt-6 pointer-events-auto">
        {/* Right: Tech Monospace Description */}
        <div
          ref={subtextRef}
          className="max-w-[440px] text-left md:text-right"
        >
          <p className="font-mono text-[12px] sm:text-[13px] text-white/70 leading-[1.65] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Adspire provides the strategic intelligence layer for every dollar
            your brand, digital marketing, and AI infrastructure spends, with the
            automation to act on it continuously.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
