"use client";

import React from "react";
import ModernBackgroundPaths from "@/components/ui/modern-background-paths";

export interface HeroSectionProps {
  /** Whether the entrance animation should trigger immediately or wait for signal */
  startEntrance?: boolean;
}

/**
 * Adspire Master Homepage Hero Section
 *
 * Powered by Enhanced Modern Background Paths with dynamic interactive SVG pattern engines
 * (Neural, Organic Flow, Geometric Grid, Spiral) styled exclusively in Adspire's Flame Vermilion
 * color palette and brand positioning.
 */
export function HeroSection({}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative z-10 w-full min-h-screen flex flex-col justify-start overflow-hidden bg-[#000000] select-none"
      aria-label="Hero Section"
    >
      <ModernBackgroundPaths
        title="ARCHITECTING DIGITAL ASCENT"
        subtitle="Engineering high-velocity brand narratives, algorithmic acquisition systems, and next-generation creative intelligence for iconic enterprises."
        ctaText="Explore Capabilities"
        ctaHref="#services"
      />
    </section>
  );
}

export default HeroSection;
