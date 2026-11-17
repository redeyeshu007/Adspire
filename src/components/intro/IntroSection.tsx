"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function IntroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const helloRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const hello = helloRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;

    if (!section || !hello || !heading || !paragraph) return;

    // Accessibility check: Reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([hello, heading, paragraph], { opacity: 1, y: 0 });
      return;
    }

    // Initial hidden state before scroll reveal
    gsap.set(hello, { opacity: 0, y: 32 });
    gsap.set(heading, { opacity: 0, y: 38 });
    gsap.set(paragraph, { opacity: 0, y: 24 });

    // GSAP ScrollTrigger Sequence — Smooth Restrained Editorial Entrance
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(hello, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
      })
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .to(
          paragraph,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.5"
        );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      aria-label="Brand Introduction"
      className="relative z-10 w-full min-h-[100dvh] flex flex-col justify-between bg-transparent text-white selection:bg-[#EE4530] selection:text-white overflow-hidden pointer-events-none"
    >
      {/* Anchor for navigation */}
      <div id="about" className="absolute top-0 left-0 w-full h-0 pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]" />
      {/* Main Content Layout Container with Responsive Editorial Padding */}
      <div
        className="relative z-10 w-full flex flex-col pt-[125px] sm:pt-[145px] lg:pt-[165px] pb-24 sm:pb-32 lg:pb-36 pointer-events-auto"
        style={{
          paddingLeft: "clamp(24px, 8.8vw, 160px)",
          paddingRight: "clamp(24px, 8.8vw, 160px)",
        }}
      >
        {/* 1. UPPER LEFT: Introductory Word "Hello" in Swatch Coral-Red Gradient */}
        <div
          ref={helloRef}
          className="mb-7 sm:mb-9 lg:mb-12 select-none will-change-transform"
        >
          <span
            className="block font-bold tracking-[-0.04em] leading-[0.88] bg-clip-text text-transparent bg-gradient-to-r from-[#F76B4A] via-[#EE4530] to-[#F26F53]"
            style={{
              fontSize: "clamp(80px, 10.5vw, 165px)",
            }}
          >
            Hello
          </span>
        </div>

        {/* 2. MIDDLE LEFT: Main Editorial Heading with refined scale and spacing */}
        <div className="max-w-[1340px] will-change-transform">
          <h2
            ref={headingRef}
            className="text-white font-bold tracking-[-0.04em] leading-[1.04]"
          >
            <span className="block mb-5 sm:mb-6 lg:mb-7 text-[clamp(24px,3.0vw,50px)] text-white/90">
              More Than a Digital Marketing Agency.
            </span>
            <span className="block text-[clamp(26px,3.3vw,54px)] leading-[1.14] tracking-[-0.035em] text-white">
              <span className="block lg:whitespace-nowrap">
                We bring creativity, marketing and technology
              </span>
              <span className="block">
                together to build digital experiences
              </span>
              <span className="block">
                that move businesses forward.
              </span>
            </span>
          </h2>
        </div>

        {/* 3. LOWER LEFT: Supporting Paragraph with increased size and spacing */}
        <div className="mt-14 sm:mt-18 lg:mt-20 max-w-[680px] will-change-transform">
          <p
            ref={paragraphRef}
            className="text-white/70 font-normal leading-[1.7] text-[18px] sm:text-[21px] lg:text-[23px]"
          >
            We bring strategy, creativity and design together to shape meaningful
            brands. From defining a brand&apos;s purpose to creating its visual identity
            and digital presence, we turn ideas into identities that stand apart.
          </p>
        </div>
      </div>

      {/* Generous intentional negative space reserved on the right */}
    </section>
  );
}

export default IntroSection;
