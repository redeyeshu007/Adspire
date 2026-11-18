"use client";

import React from "react";
import Antigravity from "./Antigravity";
import { HeroContent } from "./HeroContent";

export interface HeroSectionProps {
  /** Whether the entrance animation should trigger immediately or wait for signal */
  startEntrance?: boolean;
}

/**
 * Adspire Master Homepage Hero Section
 *
 * Powered by Antigravity WebGL2 magnetic particle vortex background
 * and futuristic high-tech agency editorial content layout.
 */
export function HeroSection({
  startEntrance = true,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative z-10 w-full min-h-screen h-[100dvh] flex flex-col justify-start overflow-hidden bg-[#000000] select-none"
      aria-label="Hero Section"
    >
      {/* Interactive WebGL Antigravity Particle Field Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Antigravity
          colors={["#f97316", "#1a0c02", "#48250f", "#EE4530"]}
          count={1500}
          magnetRadius={9}
          ringRadius={7}
          particleSize={0.9}
          autoAnimate
          colorMode="conic"
          colorSpeed={0.05}
          particleShape="capsule"
          particleVariance={1}
          fieldStrength={10}
          waveAmplitude={1}
          waveCount={3}
          waveSpeed={0.4}
          rotationSpeed={0}
          pulseSpeed={3}
          depthFactor={1}
          ambient={0.25}
          lerpSpeed={0.05}
          interactive
          clickBurst
          intro
          lightMode={false}
          className="w-full h-full"
        />
      </div>

      {/* Editorial Content (Stepped Headline, Floating Reticle, Pill Dock) */}
      <HeroContent autoPlay={startEntrance} delay={0.15} />
    </section>
  );
}

export default HeroSection;
