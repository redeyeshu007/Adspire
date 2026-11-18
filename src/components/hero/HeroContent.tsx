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
 * Adspire Hero Content — Agency Positioning & Narrative
 *
 * Semantic headline for SEO/accessibility, with agency narrative statement
 * positioned in the lower-left editorial grid beneath the 3D Three.js typography.
 */
export function HeroContent({ delay = 0.2, autoPlay = true }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = subtextRef.current;
    if (!el) return;

    if (!autoPlay && !hasAnimatedRef.current) {
      gsap.set(el, { opacity: 0, y: 20 });
      return;
    }

    if (!autoPlay || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    // GSAP Entrance
    const tl = gsap.timeline({ delay });
    tl.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      }
    );

    // Scroll fade-out
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "35% top",
      scrub: 0.25,
      onUpdate: (self) => {
        if (!containerRef.current) return;
        const p = self.progress;
        gsap.set(containerRef.current, {
          opacity: Math.max(0, 1 - p * 1.4),
          y: -p * 30,
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
      className="relative z-20 flex flex-col justify-end min-h-[100dvh] w-full pb-12 sm:pb-16 lg:pb-20 pointer-events-none"
      style={{
        paddingLeft: "clamp(24px, 8.8vw, 160px)",
        paddingRight: "clamp(24px, 8.8vw, 160px)",
      }}
    >
      <div className="max-w-[760px] text-left pointer-events-auto">
        {/* Semantic H1 for SEO & Screen Readers (Visually represented in 3D by Three.js) */}
        <h1 className="sr-only">
          Build Better. Reach Further. Grow Smarter.
        </h1>

        {/* Agency Positioning Statement */}
        <p
          ref={subtextRef}
          className="text-white/75 text-[15px] sm:text-[17px] md:text-[19px] leading-[1.65] font-normal"
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
