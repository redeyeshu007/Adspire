"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroContentProps {
  delay?: number;
  autoPlay?: boolean;
}

/**
 * HeroContent — Next-Gen High-Tech Agency Editorial Layout
 *
 * Implements the exact layout and composition from the reference image:
 * 1. Top-left stepped headline:
 *    THE
 *    FINANCIAL (or DIGITAL GROWTH)
 *          OPERATING
 *    SYSTEM
 * 2. Center floating target reticle box with 4 corner '+' marks
 * 3. Bottom-right bold anchor:
 *    FOR CLOUD, (or FOR BRANDS,)
 *    AI, AND DATA. (or AI, AND SCALE.)
 * 4. Bottom-left glowing lilac pill dock with two capsule buttons: "Free Trial" & "Book Demo"
 * 5. Bottom-right tech monospace paragraph
 */
export function HeroContent({ delay = 0.2, autoPlay = true }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineLeftRef = useRef<HTMLDivElement | null>(null);
  const headlineRightRef = useRef<HTMLDivElement | null>(null);
  const reticleRef = useRef<HTMLDivElement | null>(null);
  const pillDockRef = useRef<HTMLDivElement | null>(null);
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
          reticleRef.current,
          pillDockRef.current,
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
          reticleRef.current,
          pillDockRef.current,
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
        reticleRef.current,
        { opacity: 0, scale: 0.7, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.75, ease: "back.out(1.7)" },
        "-=0.6"
      )
      .fromTo(
        headlineRightRef.current,
        { opacity: 0, y: 28, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        "-=0.55"
      )
      .fromTo(
        [pillDockRef.current, subtextRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: "power2.out" },
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

        {/* Center Floating Crosshair Reticle Box */}
        <div
          ref={reticleRef}
          className="absolute left-[52%] top-[49%] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-14 h-14 pointer-events-auto group cursor-crosshair"
        >
          {/* Subtle dashed box */}
          <div className="absolute inset-0 border border-dashed border-[#C084FC]/50 group-hover:border-[#C084FC] transition-colors duration-300 shadow-[0_0_12px_rgba(192,132,252,0.25)]" />
          {/* 4 Corner Crosshairs (+) */}
          <span className="absolute -top-2 -left-2 text-[15px] leading-none font-mono text-[#C084FC] font-medium drop-shadow-[0_0_6px_#C084FC]">
            +
          </span>
          <span className="absolute -top-2 -right-2 text-[15px] leading-none font-mono text-[#C084FC] font-medium drop-shadow-[0_0_6px_#C084FC]">
            +
          </span>
          <span className="absolute -bottom-2 -left-2 text-[15px] leading-none font-mono text-[#C084FC] font-medium drop-shadow-[0_0_6px_#C084FC]">
            +
          </span>
          <span className="absolute -bottom-2 -right-2 text-[15px] leading-none font-mono text-[#C084FC] font-medium drop-shadow-[0_0_6px_#C084FC]">
            +
          </span>
          {/* Subtle glowing center pulse */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#C084FC] group-hover:scale-150 transition-transform duration-300 shadow-[0_0_8px_#C084FC]" />
        </div>

        {/* Bottom-Right Anchor Headline */}
        <div
          ref={headlineRightRef}
          className="w-full flex justify-end mt-4 sm:mt-6 md:mt-2 text-right"
        >
          <div className="max-w-[720px]">
            <h2 className="text-[#E2E8F0] uppercase font-extrabold tracking-[-0.03em] leading-[0.93] text-[clamp(36px,6.6vw,84px)] sm:text-5xl md:text-6xl lg:text-[clamp(68px,6.0vw,90px)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              <span className="block">FOR BRANDS,</span>
              <span className="block text-[#CBD5E1]">AI, AND SCALE.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* --- BOTTOM REGION: PILL DOCK (LEFT) & MONOSPACE NARRATIVE (RIGHT) --- */}
      <div className="relative w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-6 pointer-events-auto">
        {/* Left: Glowing Rounded Pill Dock with Dual Capsule Buttons */}
        <div
          ref={pillDockRef}
          className="inline-flex items-center p-1.5 sm:p-2 rounded-full bg-[#C084FC] shadow-[0_0_28px_rgba(192,132,252,0.55)] transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Pill Button 1 */}
            <a
              href="#contact"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#0D0D11] hover:bg-[#181822] text-[#D8B4FE] hover:text-white font-mono text-[13px] sm:text-[14px] font-medium tracking-tight transition-all duration-200 active:scale-95 shadow-inner"
            >
              Free Trial
            </a>

            {/* Pill Button 2 */}
            <a
              href="#contact"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#0D0D11] hover:bg-[#181822] text-[#D8B4FE] hover:text-white font-mono text-[13px] sm:text-[14px] font-medium tracking-tight transition-all duration-200 active:scale-95 shadow-inner"
            >
              Book Demo
            </a>
          </div>
        </div>

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
