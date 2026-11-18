"use client";

import React from "react";
import ShapeWaves from "./ShapeWaves";
import { Button } from "@/components/ui/button";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { motion } from "motion/react";

export interface HeroSectionProps {
  /** Whether the entrance animation should trigger immediately or wait for signal */
  startEntrance?: boolean;
}

/**
 * Adspire Master Homepage Hero Section
 *
 * Powered by React Bits ShapeWaves interactive WebGPU/WebGL canvas background
 * featuring dynamic rolling geometric wave fields and interactive mouse splash physics.
 */
export function HeroSection({}: HeroSectionProps) {
  const { scrollTo } = useSmoothScroll();

  return (
    <section
      id="hero"
      className="relative z-10 w-full min-h-screen h-[100dvh] flex flex-col justify-end items-center overflow-hidden bg-[#000000] select-none pb-12 sm:pb-16 lg:pb-20"
      aria-label="Hero Section"
    >
      {/* Interactive ShapeWaves Canvas Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <ShapeWaves
          text="adspire"
          fontFamily='Geist, "Geist Sans", system-ui, sans-serif'
          fontWeight={500}
          textSize={0.6}
          shapes="mixed"
          cellSize={10}
          dotSize={0.75}
          color="#EE4530"
          hoverColor="#FFA293"
          backgroundColor="#000000"
          speed={1}
          scale={1}
          contrast={1}
          brightness={0.45}
          flow={0}
          direction={0}
          fade={0.25}
          interactive={true}
          splashRadius={40}
          splashStrength={0.4}
          glow={0.5}
          intro={true}
          introDuration={1.6}
          paused={false}
          className="w-full h-full"
        />
      </div>

      {/* Atmospheric Top & Bottom Fade Vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-transparent" />

      {/* Hero Editorial Layer (Positioned comfortably at lower third) */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-3xl mx-auto pointer-events-auto">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide max-w-xl mx-auto leading-relaxed mb-6"
        >
          Engineering high-velocity brand narratives, algorithmic acquisition systems, and next-generation creative intelligence.
        </motion.p>

        {/* CTA Button in Adspire Flame Vermilion Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.1,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
          className="inline-block group"
        >
          <div className="relative p-[1.5px] bg-gradient-to-r from-[#EE4530] via-[#FF6247] to-[#FFA293] rounded-2xl group-hover:from-[#FF6247] group-hover:via-[#FFA293] group-hover:to-[#EE4530] transition-all duration-500 shadow-[0_0_25px_rgba(238,69,48,0.35)] group-hover:shadow-[0_0_40px_rgba(238,69,48,0.6)]">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                if (scrollTo) {
                  scrollTo("#services", { offset: -50, duration: 1.3 });
                } else {
                  const target = document.querySelector("#services");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="relative rounded-[14.5px] px-8 sm:px-12 py-5 sm:py-6 text-sm sm:text-base font-semibold bg-black/90 hover:bg-black/70 text-white transition-all duration-300 group-hover:-translate-y-0.5 border-0 backdrop-blur-md cursor-pointer"
            >
              <motion.span
                className="flex items-center gap-3 text-white"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative">
                  Explore Capabilities
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#EE4530] to-[#FFA293] group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl text-[#FF6247]"
                >
                  →
                </motion.span>
              </motion.span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
