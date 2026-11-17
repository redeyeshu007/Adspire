"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  itemsLabel: string;
  capabilities: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "performance-marketing",
    title: "Performance Marketing",
    tagline: "Turn advertising budgets into business opportunities.",
    description:
      "Our performance marketing solutions are focused on reaching the right audience, generating quality enquiries and continuously improving campaign performance.",
    itemsLabel: "Services",
    capabilities: [
      "Google Ads",
      "Meta Ads",
      "Lead Generation Campaigns",
      "Campaign Strategy",
      "Audience Targeting",
      "Remarketing",
      "Campaign Optimisation",
      "Performance Reporting",
    ],
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    tagline: "Build a digital presence people remember.",
    description:
      "We develop social media strategies and creative content that help brands stay relevant, communicate consistently and build stronger relationships with their audiences.",
    itemsLabel: "Services",
    capabilities: [
      "Social Media Strategy",
      "Instagram Management",
      "Facebook Management",
      "LinkedIn Management",
      "Content Planning",
      "Monthly Content Calendars",
      "Post & Reel Creatives",
      "Campaign Planning",
      "Social Media Advertising",
    ],
  },
  {
    id: "branding-creative",
    title: "Branding & Creative",
    tagline: "Make Your Brand Impossible to Ignore.",
    description:
      "We create strong visual identities and marketing creatives that help businesses communicate professionally and consistently.",
    itemsLabel: "Services",
    capabilities: [
      "Logo Design",
      "Brand Identity",
      "Brand Guidelines",
      "Marketing Creatives",
      "Social Media Designs",
      "Advertisement Creatives",
      "Brochures",
      "Company Profiles",
      "Packaging Design",
      "Print Designs",
      "Campaign Creatives",
    ],
  },
  {
    id: "website-technology",
    title: "Website & Technology",
    tagline: "Your Digital Presence Should Work as Good as It Looks.",
    description:
      "We design and develop modern, responsive and business-focused digital experiences. Whether you need a company website, landing page or customised digital solution, we combine design and technology to create experiences built around your business goals.",
    itemsLabel: "Services",
    capabilities: [
      "Business Websites",
      "Corporate Websites",
      "Landing Pages",
      "E-commerce Websites",
      "UI/UX Design",
      "Custom Web Development",
      "Website Redesign",
      "Website Maintenance",
      "Hosting Support",
      "Business Automation Solutions",
    ],
  },
  {
    id: "seo-local-growth",
    title: "SEO & Local Growth",
    tagline: "Be Found When Your Customers Are Searching.",
    description:
      "We help businesses strengthen their visibility across search engines and local search.",
    itemsLabel: "Services",
    capabilities: [
      "Search Engine Optimisation",
      "Local SEO",
      "Google Business Profile Optimisation",
      "Keyword Strategy",
      "On-page SEO",
      "Technical SEO",
      "Content Optimisation",
      "Website Performance Monitoring",
    ],
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    tagline: "Work Smarter. Respond Faster. Scale Better.",
    description:
      "We help businesses explore practical automation solutions that reduce repetitive work and improve digital workflows.",
    itemsLabel: "Solutions",
    capabilities: [
      "Business Workflow Automation",
      "Lead Management Automation",
      "WhatsApp Integration",
      "AI-assisted Content Workflows",
      "Customer Enquiry Automation",
      "Internal Process Automation",
      "Custom Digital Solutions",
    ],
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subheadingRef = useRef<HTMLParagraphElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  // Per-row refs for cards, connectors, and nodes
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);
  const nodesRef = useRef<Array<HTMLDivElement | null>>([]);
  const connectorsRef = useRef<Array<HTMLDivElement | null>>([]);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  // SVG path refs
  const baseCurveRef = useRef<SVGPathElement | null>(null);
  const activeCurveRef = useRef<SVGPathElement | null>(null);
  const [svgPathData, setSvgPathData] = useState<string>("");
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 3000,
  });

  // Active service index highlighted during scroll
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);

  // Dynamically compute curved SVG path intersecting all timeline nodes
  const updateTimelinePath = useCallback(() => {
    const container = timelineContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const cWidth = containerRect.width;
    const cHeight = containerRect.height;
    if (cWidth <= 0 || cHeight <= 0) return;

    setContainerDimensions({ width: cWidth, height: cHeight });

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const points: Array<{ x: number; y: number }> = [];

    // Collect center position of each node relative to timelineContainer
    nodesRef.current.forEach((node) => {
      if (node) {
        const nRect = node.getBoundingClientRect();
        const nx = nRect.left - containerRect.left + nRect.width / 2;
        const ny = nRect.top - containerRect.top + nRect.height / 2;
        points.push({ x: nx, y: ny });
      }
    });

    if (points.length < 2) return;

    // Build organic curved SVG path: starts slightly above first node, passes through all nodes, and extends to bottom
    const startY = 0;
    const startX = points[0].x;
    let pathStr = `M ${startX} ${startY}`;

    // Curve from top to first node
    pathStr += ` C ${startX} ${points[0].y * 0.4}, ${points[0].x} ${points[0].y * 0.7}, ${points[0].x} ${points[0].y}`;

    // Graceful alternating undulating curves between consecutive nodes
    for (let i = 0; i < points.length - 1; i++) {
      const pCurrent = points[i];
      const pNext = points[i + 1];
      const dy = pNext.y - pCurrent.y;
      const isEven = i % 2 === 0;

      // On desktop: curve swings gently left and right between alternating cards
      // On mobile: subtle organic micro-wave along the left track
      const waveOffset = isDesktop ? (isEven ? 38 : -38) : (isEven ? 6 : -6);

      const cp1x = pCurrent.x + waveOffset;
      const cp1y = pCurrent.y + dy * 0.38;
      const cp2x = pNext.x - waveOffset;
      const cp2y = pCurrent.y + dy * 0.62;

      pathStr += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pNext.x} ${pNext.y}`;
    }

    // Extend line smoothly past the last node to the bottom
    const lastPoint = points[points.length - 1];
    const endY = cHeight;
    pathStr += ` C ${lastPoint.x} ${lastPoint.y + (endY - lastPoint.y) * 0.5}, ${lastPoint.x} ${endY * 0.9}, ${lastPoint.x} ${endY}`;

    setSvgPathData(pathStr);
  }, []);

  // Update path on mount and resize
  useEffect(() => {
    updateTimelinePath();

    const container = timelineContainerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      updateTimelinePath();
    });
    observer.observe(container);

    window.addEventListener("resize", updateTimelinePath);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTimelinePath);
    };
  }, [updateTimelinePath]);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const container = timelineContainerRef.current;
    const activeCurve = activeCurveRef.current;
    if (!section || !heading || !container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([heading, subheading].filter(Boolean), { opacity: 1, y: 0 });
      if (activeCurve) {
        gsap.set(activeCurve, { strokeDashoffset: 0 });
      }
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, x: 0, y: 0 });
      });
      connectorsRef.current.forEach((conn) => {
        if (conn) gsap.set(conn, { scaleX: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. SECTION HEADING & SUBTITLE REVEAL
      gsap.fromTo(
        [heading, subheading].filter(Boolean),
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // 2. SCROLL-DRIVEN TIMELINE PATH PROGRESS DRAWING
      if (activeCurve && svgPathData) {
        const totalLen = activeCurve.getTotalLength() || 2500;
        gsap.set(activeCurve, {
          strokeDasharray: totalLen,
          strokeDashoffset: totalLen,
        });

        gsap.to(activeCurve, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 72%",
            end: "bottom 82%",
            scrub: 0.4,
          },
        });
      }

      // 3. PER-SERVICE CARD & CONNECTOR REVEAL WITH NODE ACTIVATION
      rowsRef.current.forEach((row, idx) => {
        if (!row) return;

        const card = cardsRef.current[idx];
        const connector = connectorsRef.current[idx];
        const node = nodesRef.current[idx];
        const isLeft = idx % 2 === 0;

        // Card initial state: slide in subtly from its side
        if (card) {
          gsap.set(card, {
            opacity: 0,
            x: isLeft ? -40 : 40,
          });
        }

        // Connector initial state
        if (connector) {
          gsap.set(connector, {
            scaleX: 0,
            transformOrigin: isLeft ? "right center" : "left center",
          });
        }

        // Timeline for the card entrance
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 78%",
            toggleActions: "play reverse play reverse",
            onEnter: () => setActiveNodeIndex(idx),
            onEnterBack: () => setActiveNodeIndex(idx),
          },
        });

        // Connector expands
        if (connector) {
          tl.to(connector, {
            scaleX: 1,
            duration: 0.45,
            ease: "power2.out",
          });
        }

        // Card reveals smoothly
        if (card) {
          tl.to(
            card,
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            connector ? "-=0.25" : 0
          );
        }
      });

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, [svgPathData]);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="What We Do — Interactive Curved Timeline Experience"
      className="relative z-10 w-full min-h-screen bg-transparent text-white selection:bg-[#EE4530] selection:text-white overflow-hidden pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
    >
      {/* Target anchor for 'Our Work' navigation */}
      <div
        id="work"
        className="absolute top-0 left-0 w-full h-0 pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
      />

      {/* Main Content Layout Container */}
      <div
        className="relative z-10 w-full flex flex-col pt-12 sm:pt-18 lg:pt-24 pb-20 sm:pb-28 lg:pb-36 pointer-events-auto"
        style={{
          paddingLeft: "clamp(20px, 6vw, 140px)",
          paddingRight: "clamp(20px, 6vw, 140px)",
        }}
      >
        {/* 1. SECTION HEADING: "WHAT WE DO" */}
        <div className="mb-14 sm:mb-20 lg:mb-24 select-none will-change-transform max-w-[1200px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#EE4530] animate-pulse" />
            <span className="text-[11px] sm:text-[12px] uppercase font-mono tracking-[0.24em] text-white/50">
              03 // Services & Capabilities
            </span>
          </div>

          <h2
            ref={headingRef}
            className="font-bold tracking-[-0.04em] leading-[0.92] text-[#EE4530]"
            style={{
              fontSize: "clamp(64px, 10.5vw, 180px)",
            }}
          >
            WHAT WE DO
          </h2>

          <p
            ref={subheadingRef}
            className="mt-4 sm:mt-6 text-white/80 font-normal tracking-[-0.02em] text-[20px] sm:text-[28px] lg:text-[34px] leading-[1.25] max-w-[840px]"
          >
            Everything Your Brand Needs to Grow Digitally.
          </p>
        </div>

        {/* 2. CURVED VERTICAL TIMELINE CONTAINER */}
        <div
          ref={timelineContainerRef}
          className="relative w-full max-w-[1320px] mx-auto flex flex-col"
        >
          {/* SVG Canvas for Background & Animated Curved Paths */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible"
            width={containerDimensions.width}
            height={containerDimensions.height}
            viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              {/* Subtle Glowing filter for active timeline path */}
              <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Inactive Curved Timeline (Neutral Dark) */}
            {svgPathData && (
              <path
                ref={baseCurveRef}
                d={svgPathData}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Active Scroll-Driven Curved Timeline (Glowing Orange) */}
            {svgPathData && (
              <path
                ref={activeCurveRef}
                d={svgPathData}
                stroke="#EE4530"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                filter="url(#orangeGlow)"
              />
            )}
          </svg>

          {/* 3. ALTERNATING SERVICE TIMELINE ROWS */}
          <div className="relative z-20 flex flex-col space-y-16 sm:space-y-24 lg:space-y-32">
            {SERVICES_DATA.map((service, index) => {
              const isEven = index % 2 === 0; // Even = Left on desktop, Odd = Right
              const isActive = activeNodeIndex === index;
              const isPast = activeNodeIndex > index;
              const serviceNum = `0${index + 1}`;

              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    rowsRef.current[index] = el;
                  }}
                  className={`relative w-full flex items-center ${
                    /* Desktop: alternating left/right grid; Mobile: single-sided on right of track */
                    "lg:justify-between flex-row"
                  }`}
                >
                  {/* DESKTOP TIMELINE CENTER NODE */}
                  <div
                    ref={(el) => {
                      nodesRef.current[index] = el;
                    }}
                    className={`absolute z-30 transition-all duration-400 ease-out flex items-center justify-center ${
                      /* Position: left: 28px on mobile, left: 50% - 14px on desktop */
                      "left-[20px] sm:left-[32px] lg:left-1/2 -translate-x-1/2"
                    }`}
                  >
                    {/* Outer Node Halo Ring */}
                    <div
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-[#EE4530]/20 border border-[#EE4530] scale-125 shadow-[0_0_24px_rgba(238,69,48,0.7)]"
                          : isPast
                          ? "bg-[#EE4530]/10 border border-[#EE4530]/40"
                          : "bg-[#0c0c0c] border border-white/20"
                      }`}
                    >
                      {/* Inner Node Core */}
                      <span
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-[#EE4530] animate-pulse"
                            : isPast
                            ? "bg-[#EE4530]/60"
                            : "bg-white/40"
                        }`}
                      />
                    </div>
                  </div>

                  {/* HORIZONTAL CONNECTOR LINE */}
                  {/* Desktop: Connects node at 50% to card. Mobile: Connects node at left track to card */}
                  <div
                    ref={(el) => {
                      connectorsRef.current[index] = el;
                    }}
                    className={`hidden lg:block absolute top-1/2 -translate-y-1/2 h-[1px] z-20 pointer-events-none transition-colors duration-300 ${
                      isActive
                        ? "bg-[#EE4530] shadow-[0_0_10px_rgba(238,69,48,0.5)]"
                        : "bg-white/15"
                    } ${
                      isEven
                        ? "right-1/2 w-[48px] xl:w-[64px]"
                        : "left-1/2 w-[48px] xl:w-[64px]"
                    }`}
                  />

                  {/* Mobile Connector Line */}
                  <div
                    className={`lg:hidden absolute top-1/2 -translate-y-1/2 left-[32px] sm:left-[44px] w-[20px] sm:w-[28px] h-[1px] z-20 pointer-events-none ${
                      isActive ? "bg-[#EE4530]" : "bg-white/15"
                    }`}
                  />

                  {/* SERVICE CARD CONTAINER */}
                  <div
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                    className={`relative z-20 w-full transition-all duration-300 ${
                      /* Mobile: pushed to right with margin */
                      "pl-14 sm:pl-20 lg:pl-0 " +
                      /* Desktop: Left card takes left half, Right card takes right half */
                      (isEven
                        ? "lg:mr-auto lg:w-[calc(50%-48px)] xl:lg:w-[calc(50%-64px)]"
                        : "lg:ml-auto lg:w-[calc(50%-48px)] xl:lg:w-[calc(50%-64px)]")
                    }`}
                  >
                    {/* Modern Editorial Card Shell */}
                    <div
                      className={`group relative rounded-2xl p-6 sm:p-8 lg:p-9 transition-all duration-300 backdrop-blur-xl border ${
                        isActive
                          ? "bg-[#0e0e0e]/95 border-[#EE4530]/35 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(238,69,48,0.12)]"
                          : "bg-[#0a0a0a]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#0d0d0d]/90 shadow-xl"
                      }`}
                    >
                      {/* Top Meta: Number + Category Badge */}
                      <div className="flex items-center pb-4 border-b border-white/[0.07]">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs sm:text-sm font-semibold tracking-wider transition-colors duration-300 ${
                              isActive ? "text-[#EE4530]" : "text-white/40"
                            }`}
                          >
                            {serviceNum}
                          </span>
                          <span className="text-white/20">/</span>
                          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                            {service.itemsLabel}
                          </span>
                        </div>
                      </div>

                      {/* Main Service Title */}
                      <h3
                        className="text-white font-bold tracking-[-0.03em] leading-[1.08] mt-5 transition-transform duration-300 group-hover:translate-x-1"
                        style={{
                          fontSize: "clamp(24px, 2.5vw, 42px)",
                        }}
                      >
                        {service.title}
                      </h3>

                      {/* Orange Service Tagline */}
                      <p className="mt-2.5 text-[#EE4530] font-medium tracking-[-0.01em] text-[15px] sm:text-[17px] lg:text-[18px] leading-snug">
                        {service.tagline}
                      </p>

                      {/* Service Description */}
                      <p className="mt-3.5 text-white/70 font-normal leading-[1.65] text-[14px] sm:text-[15px] max-w-[560px]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
