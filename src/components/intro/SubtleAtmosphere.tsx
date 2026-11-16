"use client";

import React from "react";

/**
 * SubtleAtmosphere — Section 02 Living Ambient Background
 *
 * Implements a pure-black (#000000) backdrop enhanced with an ultra-faint,
 * slow-drifting monochromatic ambient light glow and fine film grain texture.
 * Completely lightweight and GPU-composited, producing zero main-thread overhead.
 */
export function SubtleAtmosphere() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#000000] -z-10"
      aria-hidden="true"
    >
      {/* 1. Ultra-subtle living ambient light orb A (Monochromatic Cool Glow) */}
      <div
        className="absolute -top-[10%] left-[15%] w-[650px] h-[650px] rounded-full opacity-40 blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 50%, transparent 75%)",
          animation: "driftA 26s ease-in-out infinite alternate",
        }}
      />

      {/* 2. Ultra-subtle living ambient light orb B (Subtle Coral Ambient Whisper) */}
      <div
        className="absolute top-[40%] right-[10%] w-[550px] h-[550px] rounded-full opacity-30 blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(238,69,48,0.025) 0%, rgba(240,61,38,0.005) 50%, transparent 75%)",
          animation: "driftB 32s ease-in-out infinite alternate",
        }}
      />

      {/* 3. Ultra-fine Monochromatic SVG Micro-Grain Texture */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.032] mix-blend-overlay pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="adspire-intro-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#adspire-intro-grain)" />
      </svg>

      {/* Embedded CSS animations for 100% GPU composited drift */}
      <style jsx>{`
        @keyframes driftA {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(60px, 40px, 0) scale(1.08);
          }
          100% {
            transform: translate3d(-40px, 70px, 0) scale(0.95);
          }
        }
        @keyframes driftB {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-70px, -50px, 0) scale(1.12);
          }
          100% {
            transform: translate3d(40px, -30px, 0) scale(0.92);
          }
        }
      `}</style>
    </div>
  );
}

export default SubtleAtmosphere;
