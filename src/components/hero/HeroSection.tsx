"use client";

import React from "react";
import { HeroContent } from "./HeroContent";
import { PersistentBackground } from "./PersistentBackground";

export interface HeroSectionProps {
  /** Whether the entrance animation should trigger immediately or wait for signal */
  startEntrance?: boolean;
  /** Whether to render an embedded background canvas if used in standalone mode */
  embeddedBackground?: boolean;
}

/**
 * Adspire Homepage Hero Section — Minimal Editorial Layout
 *
 * Presents the iconic 3-line agency headline in the lower-left region
 * over the interactive 3D AcidSquares modular tile background.
 */
export function HeroSection({
  startEntrance = true,
  embeddedBackground = false,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative z-10 w-full min-h-screen h-[100dvh] flex flex-col justify-start overflow-hidden bg-transparent select-none"
      aria-label="Hero Section"
    >
      {embeddedBackground && <PersistentBackground />}

      {/* Lower-Left Minimal Hero Headline */}
      <HeroContent autoPlay={startEntrance} delay={0.15} />
    </section>
  );
}

export default HeroSection;
