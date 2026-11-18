"use client";

import React from "react";
import { Modern3DHeroCanvas } from "./Modern3DHeroCanvas";
import { HeroContent } from "./HeroContent";

export interface HeroSectionProps {
  /** Whether the entrance animation should trigger immediately or wait for signal */
  startEntrance?: boolean;
  /** Whether to render an embedded background canvas if used in standalone mode */
  embeddedBackground?: boolean;
}

/**
 * Adspire Homepage Hero Section
 *
 * Combines next-generation interactive 3D Three.js topological background
 * and 3D floating kinetic typography with editorial agency positioning.
 */
export function HeroSection({
  startEntrance = true,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative z-10 w-full min-h-screen h-[100dvh] flex flex-col justify-start overflow-hidden bg-black select-none"
      aria-label="Hero Section"
    >
      {/* 1. Next-Gen Modern 3D Three.js Topological Wave Surface & 3D Typography */}
      <Modern3DHeroCanvas />

      {/* 2. Editorial Content (Positioning Statement & Semantic SEO) */}
      <HeroContent autoPlay={startEntrance} delay={0.15} />
    </section>
  );
}

export default HeroSection;
