"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";

const PILLARS = ["Strategy", "Creative", "Media", "Technology", "Growth"];

export function IntroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const helloRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLDivElement | null>(null);
  const pillarsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const hello = helloRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;
    const pillarsContainer = pillarsRef.current;

    if (!section || !content || !hello || !heading || !paragraph || !pillarsContainer) return;

    // Accessibility check: Reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const helloLetters = hello.querySelectorAll(".intro-hello-char");
    const headingLines = heading.querySelectorAll(".intro-heading-line");
    const paraLines = paragraph.querySelectorAll(".intro-para-line");
    const pillarItems = pillarsContainer.querySelectorAll(".intro-pillar");
    const pillarTail = pillarsContainer.querySelector(".intro-pillar-tail");

    if (prefersReducedMotion) {
      gsap.set(helloLetters, { opacity: 1, y: 0 });
      gsap.set(headingLines, { opacity: 1, y: "0%" });
      gsap.set(paraLines, { opacity: 1, y: 0 });
      gsap.set(pillarItems, { opacity: 1, y: 0, color: "rgba(255, 255, 255, 0.9)" });
      if (pillarTail) gsap.set(pillarTail, { opacity: 0.75, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial State for Content Reveal Animations
      gsap.set(helloLetters, { opacity: 0, y: 44 });
      gsap.set(headingLines, { y: "115%", opacity: 0 });
      gsap.set(paraLines, { opacity: 0, y: 22 });
      gsap.set(pillarItems, {
        opacity: 0,
        y: 28,
        color: "rgba(255, 255, 255, 0.35)",
      });
      if (pillarTail) {
        gsap.set(pillarTail, { opacity: 0, y: 16 });
      }

      // 2. Main Entrance Timeline: Hello (letter-by-letter) + Heading (line-by-line mask) + Paragraph
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // (1) Hello: Letter-by-letter reveal with subtle upward movement & smooth stagger
      entranceTl.to(helloLetters, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.05,
      });

      // (2) Main Heading: Line-by-line reveal with text clipping / overflow masking
      entranceTl.to(
        headingLines,
        {
          y: "0%",
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.45"
      );

      // (3) Supporting Paragraph: Subtle fade-up with line staggering
      entranceTl.to(
        paraLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.08,
        },
        "-=0.4"
      );

      // (4) Strategy / Creative / Media / Technology / Growth:
      // Progressive scroll reveal with staggered upward movement & active orange highlight
      const pillarsTl = gsap.timeline({
        scrollTrigger: {
          trigger: pillarsContainer,
          start: "top 85%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });

      // Step-by-step progressive reveal with active orange highlight
      pillarItems.forEach((item, index) => {
        // Step in: item reveals upward and lights up in signature coral/orange #EE4530
        pillarsTl.to(
          item,
          {
            opacity: 1,
            y: 0,
            color: "#EE4530",
            duration: 0.4,
            ease: "power2.out",
          },
          index * 0.4
        );

        // Once the next item activates, transition this item smoothly to high-contrast white
        if (index < pillarItems.length - 1) {
          pillarsTl.to(
            item,
            {
              color: "rgba(255, 255, 255, 0.9)",
              duration: 0.35,
              ease: "power1.inOut",
            },
            (index + 1) * 0.4
          );
        } else {
          // Last item gently settles to white after reaching peak orange highlight
          pillarsTl.to(
            item,
            {
              color: "rgba(255, 255, 255, 0.95)",
              duration: 0.3,
              ease: "power1.inOut",
            },
            (index + 1) * 0.4
          );
        }
      });

      // Tail phrase: "All working together." reveals smoothly after pillars
      if (pillarTail) {
        pillarsTl.to(
          pillarTail,
          {
            opacity: 0.75,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          pillarItems.length * 0.4
        );
      }

      // (5) Section Exit: Subtle content-only exit without touching background or next section
      gsap.to(content, {
        opacity: 0.3,
        y: -24,
        ease: "power1.in",
        scrollTrigger: {
          trigger: section,
          start: "bottom 45%",
          end: "bottom 5%",
          scrub: 0.5,
        },
      });
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
      <div
        id="about"
        className="absolute top-0 left-0 w-full h-0 pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
      />

      {/* Main Content Layout Container with Responsive Editorial Padding */}
      <div
        ref={contentRef}
        className="relative z-10 w-full flex flex-col pt-[125px] sm:pt-[145px] lg:pt-[165px] pb-24 sm:pb-32 lg:pb-36 pointer-events-auto will-change-transform"
        style={{
          paddingLeft: "clamp(24px, 8.8vw, 160px)",
          paddingRight: "clamp(24px, 8.8vw, 160px)",
        }}
      >
        {/* 1. UPPER LEFT: Introductory Word "Hello" with letter-by-letter reveal */}
        <div
          ref={helloRef}
          className="mb-7 sm:mb-9 lg:mb-12 select-none"
          aria-label="Hello"
        >
          <span
            className="inline-flex font-bold tracking-[-0.04em] leading-[0.88]"
            style={{
              fontSize: "clamp(80px, 10.5vw, 165px)",
            }}
          >
            {["H", "e", "l", "l", "o"].map((char, i) => (
              <span key={i} className="inline-block overflow-hidden py-1">
                <span className="intro-hello-char inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#F76B4A] via-[#EE4530] to-[#F26F53] will-change-transform">
                  {char}
                </span>
              </span>
            ))}
          </span>
        </div>

        {/* 2. MIDDLE LEFT: Main Editorial Heading with line-by-line clipping mask */}
        <div className="max-w-[1340px]">
          <h2
            ref={headingRef}
            className="text-white font-bold tracking-[-0.04em] leading-[1.04]"
          >
            {/* Heading Line 1 in overflow-hidden mask */}
            <div className="overflow-hidden mb-5 sm:mb-6 lg:mb-7">
              <span className="intro-heading-line block text-[clamp(24px,3.0vw,50px)] text-white/90 will-change-transform">
                More Than a Digital Marketing Agency.
              </span>
            </div>

            {/* Sub-heading Lines each in individual overflow-hidden masks */}
            <div className="text-[clamp(26px,3.3vw,54px)] leading-[1.14] tracking-[-0.035em] text-white">
              <div className="overflow-hidden">
                <span className="intro-heading-line block lg:whitespace-nowrap will-change-transform">
                  We bring creativity, marketing and technology
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="intro-heading-line block will-change-transform">
                  together to build digital experiences
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="intro-heading-line block will-change-transform">
                  that move businesses forward.
                </span>
              </div>
            </div>
          </h2>
        </div>

        {/* 3. LOWER LEFT: Supporting Paragraph & Progressive Pillars Reveal */}
        <div
          ref={paragraphRef}
          className="mt-14 sm:mt-18 lg:mt-20 max-w-[780px]"
        >
          <div className="text-white/70 font-normal leading-[1.7] text-[18px] sm:text-[21px] lg:text-[23px]">
            {/* Supporting paragraph text with subtle line-by-line fade-up */}
            <div className="overflow-hidden mb-1">
              <span className="intro-para-line block will-change-transform">
                Through performance marketing and building high-performing websites,
              </span>
            </div>
            <div className="overflow-hidden mb-5 sm:mb-7">
              <span className="intro-para-line block will-change-transform">
                we provide businesses with one integrated digital partner.
              </span>
            </div>

            {/* 4. Strategy / Creative / Media / Technology / Growth progressive scroll reveal */}
            <div
              ref={pillarsRef}
              className="flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 gap-y-1 text-white font-medium text-[20px] sm:text-[23px] lg:text-[26px] tracking-tight"
            >
              {PILLARS.map((item) => (
                <span key={item} className="overflow-hidden inline-block">
                  <span className="intro-pillar inline-block will-change-transform">
                    {item}.
                  </span>
                </span>
              ))}
              <span className="overflow-hidden inline-block">
                <span className="intro-pillar-tail inline-block text-white/50 font-normal text-[17px] sm:text-[19px] lg:text-[21px] will-change-transform">
                  All working together.
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generous intentional negative space reserved on the right */}
    </section>
  );
}

export default IntroSection;
