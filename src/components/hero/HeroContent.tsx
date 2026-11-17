"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroContentProps {
  /** Optional delay before triggering the entrance animation */
  delay?: number;
  /** Whether to trigger entrance immediately or on signal from preloader */
  autoPlay?: boolean;
}

/**
 * Adspire Hero Content — Minimal Editorial Typography
 *
 * Exclusively presents the iconic 3-line Adspire agency headline
 * positioned in the lower-left region (43–47% viewport height) over the 3D surface.
 */
export function HeroContent({ delay = 0.1, autoPlay = true }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement | null>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement | null>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const lines = [
      headlineLine1Ref.current,
      headlineLine2Ref.current,
      headlineLine3Ref.current,
      subtextRef.current,
    ].filter(Boolean);

    // Initial hidden state if waiting for preloader
    if (!autoPlay && !hasAnimatedRef.current) {
      gsap.set(lines, { opacity: 0, y: 24 });
      return;
    }

    if (!autoPlay || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Check accessibility reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(lines, { opacity: 1, y: 0 });
      return;
    }

    // GSAP Orchestrated Staggered Entrance Sequence
    const tl = gsap.timeline({ delay });

    tl.fromTo(
      lines,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
      }
    );

    // Scroll-driven graceful fade out as user scrolls out of Hero into Section 2
    // Ensures headline never reaches or collides with the fixed navbar
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "35% top",
      scrub: prefersReducedMotion ? false : 0.3,
      onUpdate: (self) => {
        if (!containerRef.current) return;
        const p = self.progress;
        gsap.set(containerRef.current, {
          opacity: Math.max(0, 1 - p * 1.3),
          y: -p * 35,
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
      className="relative z-20 flex flex-col justify-end min-h-[100dvh] w-full pt-[36vh] sm:pt-[40vh] pb-16 sm:pb-20 lg:pb-24 pointer-events-none"
      style={{
        paddingLeft: "clamp(24px, 8.8vw, 160px)",
        paddingRight: "clamp(24px, 8.8vw, 160px)",
      }}
    >
      <div className="max-w-[920px] text-left pointer-events-auto">
        {/* Exactly 3 Intentional Lines — clamp(68px, 6vw, 100px) */}
        <h1 className="font-bold text-white tracking-[-0.05em] leading-[0.98] sm:leading-[0.96] select-none text-[38px] sm:text-6xl md:text-7xl lg:text-[clamp(68px,6vw,100px)] pl-0.5">
          <span ref={headlineLine1Ref} className="block">
            Build Better.
          </span>
          <span ref={headlineLine2Ref} className="block">
            Reach Further.
          </span>
          <span ref={headlineLine3Ref} className="block">
            Grow Smarter<span className="text-[#EE4530]">.</span>
          </span>
        </h1>

        {/* Agency Positioning Statement */}
        <p
          ref={subtextRef}
          className="mt-6 sm:mt-8 max-w-[680px] text-white/75 text-[15px] sm:text-[17px] md:text-[19px] leading-[1.65] font-normal"
        >
          Adspire Media is a dynamic digital growth agency combining strategy,
          creativity, performance marketing and technology to help businesses
          build stronger brands and grow in the digital world.
        </p>
      </div>
    </div>
  );
}

export default HeroContent;
