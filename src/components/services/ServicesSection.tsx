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

export interface ServiceTheme {
  id: string;
  accent: string;
  accentSecondary: string;
  rgb: string;
  glow: string;
  fontFamily: string;
  headingStyle?: "normal" | "italic";
  headingWeight: number | string;
  headingLetterSpacing: string;
  taglineGradient: string;
  categoryBadge: string;
  badgeFont: string;
  atmosphereGlow: string;
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

export const SERVICE_THEMES: ServiceTheme[] = [
  {
    id: "performance-marketing",
    accent: "#EE4530",
    accentSecondary: "#FF7255",
    rgb: "238, 69, 48",
    glow: "rgba(238, 69, 48, 0.28)",
    fontFamily: "var(--font-hero-1), var(--font-heading), sans-serif",
    headingStyle: "normal",
    headingWeight: 800,
    headingLetterSpacing: "-0.045em",
    taglineGradient: "from-[#EE4530] via-[#FF6247] to-[#FFA07A]",
    categoryBadge: "01 // PERFORMANCE MARKETING",
    badgeFont: "font-mono tracking-[0.24em]",
    atmosphereGlow: "radial-gradient(circle, rgba(238, 69, 48, 0.16) 0%, transparent 70%)",
  },
  {
    id: "social-media-marketing",
    accent: "#FF3366",
    accentSecondary: "#FB7185",
    rgb: "255, 51, 102",
    glow: "rgba(255, 51, 102, 0.30)",
    fontFamily: "var(--font-syne), var(--font-heading), sans-serif",
    headingStyle: "normal",
    headingWeight: 700,
    headingLetterSpacing: "-0.02em",
    taglineGradient: "from-[#FF3366] via-[#FB7185] to-[#FDA4AF]",
    categoryBadge: "02 // SOCIAL MEDIA & CULTURE",
    badgeFont: "font-mono tracking-[0.22em]",
    atmosphereGlow: "radial-gradient(circle, rgba(255, 51, 102, 0.16) 0%, transparent 70%)",
  },
  {
    id: "branding-creative",
    accent: "#F59E0B",
    accentSecondary: "#FDE68A",
    rgb: "245, 158, 11",
    glow: "rgba(245, 158, 11, 0.28)",
    fontFamily: "var(--font-hero-2), serif",
    headingStyle: "italic",
    headingWeight: 400,
    headingLetterSpacing: "0.01em",
    taglineGradient: "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
    categoryBadge: "03 // BRANDING & CREATIVE DIRECTION",
    badgeFont: "font-mono tracking-[0.26em]",
    atmosphereGlow: "radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, transparent 70%)",
  },
  {
    id: "website-technology",
    accent: "#00F0FF",
    accentSecondary: "#38BDF8",
    rgb: "0, 240, 255",
    glow: "rgba(0, 240, 255, 0.30)",
    fontFamily: "var(--font-mono-tech), var(--font-hero-3), monospace",
    headingStyle: "normal",
    headingWeight: 700,
    headingLetterSpacing: "-0.035em",
    taglineGradient: "from-[#00F0FF] via-[#38BDF8] to-[#93C5FD]",
    categoryBadge: "04 // DIGITAL ARCHITECTURE & WEBGL",
    badgeFont: "font-mono tracking-[0.24em]",
    atmosphereGlow: "radial-gradient(circle, rgba(0, 240, 255, 0.16) 0%, transparent 70%)",
  },
  {
    id: "seo-local-growth",
    accent: "#10B981",
    accentSecondary: "#34D399",
    rgb: "16, 185, 129",
    glow: "rgba(16, 185, 129, 0.28)",
    fontFamily: "var(--font-hero-3), var(--font-heading), sans-serif",
    headingStyle: "normal",
    headingWeight: 700,
    headingLetterSpacing: "-0.03em",
    taglineGradient: "from-[#10B981] via-[#34D399] to-[#6EE7B7]",
    categoryBadge: "05 // ALGORITHMIC VISIBILITY & SEARCH",
    badgeFont: "font-mono tracking-[0.24em]",
    atmosphereGlow: "radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, transparent 70%)",
  },
  {
    id: "ai-automation",
    accent: "#A855F7",
    accentSecondary: "#C084FC",
    rgb: "168, 85, 247",
    glow: "rgba(168, 85, 247, 0.32)",
    fontFamily: "var(--font-syne), var(--font-hero-1), sans-serif",
    headingStyle: "normal",
    headingWeight: 800,
    headingLetterSpacing: "-0.025em",
    taglineGradient: "from-[#A855F7] via-[#C084FC] to-[#E9D5FF]",
    categoryBadge: "06 // ARTIFICIAL INTELLIGENCE & AUTOMATION",
    badgeFont: "font-mono tracking-[0.24em]",
    atmosphereGlow: "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%)",
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

  // Current active theme
  const currentTheme = SERVICE_THEMES[activeNodeIndex] || SERVICE_THEMES[0];

  // Dynamic Theme Synchronization: Update :root variables for the entire website
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--theme-accent", currentTheme.accent);
    root.style.setProperty("--theme-accent-rgb", currentTheme.rgb);
    root.style.setProperty("--theme-accent-glow", currentTheme.glow);
    root.style.setProperty("--theme-accent-secondary", currentTheme.accentSecondary);
    root.style.setProperty("--theme-heading-font", currentTheme.fontFamily);
  }, [currentTheme]);

  // When leaving the Services section, revert smoothly to the brand flame color
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 30%",
      onLeave: () => {
        const root = document.documentElement;
        root.style.setProperty("--theme-accent", "#EE4530");
        root.style.setProperty("--theme-accent-rgb", "238, 69, 48");
        root.style.setProperty("--theme-accent-glow", "rgba(238, 69, 48, 0.25)");
        root.style.setProperty("--theme-accent-secondary", "#FF6B4A");
        root.style.setProperty("--theme-heading-font", "var(--font-heading)");
      },
      onLeaveBack: () => {
        const root = document.documentElement;
        root.style.setProperty("--theme-accent", "#EE4530");
        root.style.setProperty("--theme-accent-rgb", "238, 69, 48");
        root.style.setProperty("--theme-accent-glow", "rgba(238, 69, 48, 0.25)");
        root.style.setProperty("--theme-accent-secondary", "#FF6B4A");
        root.style.setProperty("--theme-heading-font", "var(--font-heading)");
      },
      onEnter: () => {
        const root = document.documentElement;
        root.style.setProperty("--theme-accent", currentTheme.accent);
        root.style.setProperty("--theme-accent-rgb", currentTheme.rgb);
        root.style.setProperty("--theme-accent-glow", currentTheme.glow);
        root.style.setProperty("--theme-accent-secondary", currentTheme.accentSecondary);
        root.style.setProperty("--theme-heading-font", currentTheme.fontFamily);
      },
      onEnterBack: () => {
        const root = document.documentElement;
        root.style.setProperty("--theme-accent", currentTheme.accent);
        root.style.setProperty("--theme-accent-rgb", currentTheme.rgb);
        root.style.setProperty("--theme-accent-glow", currentTheme.glow);
        root.style.setProperty("--theme-accent-secondary", currentTheme.accentSecondary);
        root.style.setProperty("--theme-heading-font", currentTheme.fontFamily);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [currentTheme]);

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
      const cp1y = pCurrent.y + dy * 0.35;
      const cp2x = pNext.x - waveOffset;
      const cp2y = pNext.y - dy * 0.35;

      pathStr += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pNext.x} ${pNext.y}`;
    }

    // Gentle runout curve from last node downwards to bottom of timeline container
    const lastPoint = points[points.length - 1];
    const endY = cHeight;
    pathStr += ` C ${lastPoint.x} ${lastPoint.y + (endY - lastPoint.y) * 0.4}, ${lastPoint.x} ${endY * 0.95}, ${lastPoint.x} ${endY}`;

    setSvgPathData(pathStr);
  }, []);

  // Recalculate SVG path on mount, resize, and DOM layout changes
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

        // Dedicated viewport center observer for smooth theme transitions during active reading
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => setActiveNodeIndex(idx),
          onEnterBack: () => setActiveNodeIndex(idx),
        });
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
      className="relative z-10 w-full min-h-screen bg-[#000000] text-white selection:bg-[var(--theme-accent)] selection:text-white overflow-hidden pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px] transition-colors duration-700"
    >
      {/* Target anchor for 'Our Work' navigation */}
      <div
        id="work"
        className="absolute top-0 left-0 w-full h-0 pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
      />

      {/* Dynamic Ambient Color Aura floating behind the active service */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
        aria-hidden="true"
      >
        <div
          className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full blur-[160px] sm:blur-[220px] pointer-events-none transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "50%",
            top: `${(activeNodeIndex + 0.6) * (100 / SERVICES_DATA.length)}%`,
            background: currentTheme.atmosphereGlow,
          }}
        />
      </div>

      {/* Main Content Layout Container */}
      <div
        className="relative z-10 w-full flex flex-col pt-12 sm:pt-18 lg:pt-24 pb-20 sm:pb-28 lg:pb-36 pointer-events-auto"
        style={{
          paddingLeft: "clamp(20px, 6vw, 140px)",
          paddingRight: "clamp(20px, 6vw, 140px)",
        }}
      >
        {/* 1. SECTION HEADING: "WHAT WE DO" with Dynamic Typography & Color */}
        <div className="mb-14 sm:mb-20 lg:mb-24 select-none will-change-transform max-w-[1200px] mx-auto w-full">
          {/* Active Category Pill */}
          <div className="flex items-center gap-3 mb-4 transition-all duration-500">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse transition-all duration-500"
              style={{
                backgroundColor: currentTheme.accent,
                boxShadow: `0 0 16px ${currentTheme.accent}`,
              }}
            />
            <span
              className="text-[11px] sm:text-[12px] uppercase font-mono tracking-[0.24em] transition-colors duration-500"
              style={{ color: "rgba(255, 255, 255, 0.75)" }}
            >
              {currentTheme.categoryBadge}
            </span>
          </div>

          {/* Morphing "WHAT WE DO" Title */}
          <h2
            ref={headingRef}
            className="leading-[0.92] transition-all duration-500 will-change-transform"
            style={{
              fontSize: "clamp(60px, 10vw, 175px)",
              color: currentTheme.accent,
              fontFamily: currentTheme.fontFamily,
              fontStyle: currentTheme.headingStyle || "normal",
              fontWeight: currentTheme.headingWeight,
              letterSpacing: currentTheme.headingLetterSpacing,
              textShadow: `0 0 40px ${currentTheme.glow}`,
            }}
          >
            WHAT WE DO
          </h2>

          {/* Subtitle with dynamic accent highlight */}
          <p
            ref={subheadingRef}
            className="mt-4 sm:mt-6 text-white/80 font-normal tracking-[-0.02em] text-[20px] sm:text-[28px] lg:text-[34px] leading-[1.25] max-w-[840px] transition-colors duration-500"
          >
            Everything Your Brand Needs to{" "}
            <span
              className="font-medium transition-colors duration-500"
              style={{ color: currentTheme.accent }}
            >
              Grow Digitally.
            </span>
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
              {/* Dynamic Glowing filter for active timeline path */}
              <filter id="activeTimelineGlow" x="-20%" y="-20%" width="140%" height="140%">
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

            {/* Active Scroll-Driven Curved Timeline with Dynamic Color */}
            {svgPathData && (
              <path
                ref={activeCurveRef}
                d={svgPathData}
                stroke={currentTheme.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                filter="url(#activeTimelineGlow)"
                style={{
                  transition: "stroke 0.5s ease",
                }}
              />
            )}
          </svg>

          {/* 3. ALTERNATING SERVICE TIMELINE ROWS */}
          <div className="relative z-20 flex flex-col space-y-16 sm:space-y-24 lg:space-y-32">
            {SERVICES_DATA.map((service, index) => {
              const isEven = index % 2 === 0; // Even = Left on desktop, Odd = Right
              const isActive = activeNodeIndex === index;
              const isPast = activeNodeIndex > index;
              const theme = SERVICE_THEMES[index] || SERVICE_THEMES[0];

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
                  {/* DESKTOP & MOBILE TIMELINE NODE */}
                  <div
                    ref={(el) => {
                      nodesRef.current[index] = el;
                    }}
                    className={`absolute z-30 transition-all duration-500 ease-out flex items-center justify-center ${
                      /* Position: left: 20px on mobile, left: 50% on desktop */
                      "left-[20px] sm:left-[32px] lg:left-1/2 -translate-x-1/2"
                    }`}
                  >
                    {/* Outer Node Halo Ring with Dynamic Color */}
                    <div
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive ? "scale-125" : ""
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? `rgba(${theme.rgb}, 0.22)`
                          : isPast
                          ? `rgba(${theme.rgb}, 0.10)`
                          : "#0c0c0c",
                        borderColor: isActive
                          ? theme.accent
                          : isPast
                          ? `rgba(${theme.rgb}, 0.40)`
                          : "rgba(255, 255, 255, 0.2)",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        boxShadow: isActive
                          ? `0 0 24px ${theme.accent}, 0 0 48px ${theme.glow}`
                          : "none",
                      }}
                    >
                      {/* Inner Node Core */}
                      <span
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
                          isActive ? "animate-pulse" : ""
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? theme.accent
                            : isPast
                            ? `rgba(${theme.rgb}, 0.65)`
                            : "rgba(255, 255, 255, 0.4)",
                        }}
                      />
                    </div>
                  </div>

                  {/* HORIZONTAL CONNECTOR LINE (Desktop) */}
                  <div
                    ref={(el) => {
                      connectorsRef.current[index] = el;
                    }}
                    className={`hidden lg:block absolute top-1/2 -translate-y-1/2 h-[1px] z-20 pointer-events-none transition-all duration-500 ${
                      isEven
                        ? "right-1/2 w-[48px] xl:w-[64px]"
                        : "left-1/2 w-[48px] xl:w-[64px]"
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(to ${isEven ? "left" : "right"}, ${theme.accent}, ${theme.accentSecondary})`
                        : "rgba(255, 255, 255, 0.15)",
                      boxShadow: isActive ? `0 0 12px ${theme.glow}` : "none",
                    }}
                  />

                  {/* Horizontal Connector Line (Mobile) */}
                  <div
                    className="lg:hidden absolute top-1/2 -translate-y-1/2 left-[32px] sm:left-[44px] w-[20px] sm:w-[28px] h-[1px] z-20 pointer-events-none transition-all duration-500"
                    style={{
                      background: isActive ? theme.accent : "rgba(255, 255, 255, 0.15)",
                      boxShadow: isActive ? `0 0 8px ${theme.glow}` : "none",
                    }}
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
                    {/* Modern Editorial Card Shell with Custom Theme & Typography */}
                    <div
                      className="group relative rounded-2xl p-6 sm:p-8 lg:p-9 transition-all duration-500 backdrop-blur-xl border overflow-hidden"
                      style={{
                        backgroundColor: isActive ? "#0e0e0e" : "rgba(10, 10, 10, 0.8)",
                        borderColor: isActive
                          ? `rgba(${theme.rgb}, 0.45)`
                          : "rgba(255, 255, 255, 0.08)",
                        boxShadow: isActive
                          ? `0 16px 48px rgba(0,0,0,0.85), 0 0 32px ${theme.glow}`
                          : "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Ambient radial inner aura on active card */}
                      {isActive && (
                        <div
                          className="absolute -top-[30%] -right-[30%] w-[320px] h-[320px] rounded-full pointer-events-none blur-[90px] opacity-35 transition-opacity duration-700"
                          style={{
                            background: theme.accent,
                          }}
                          aria-hidden="true"
                        />
                      )}

                      {/* Service Category & Number Badge */}
                      <div className="flex items-center gap-2.5 mb-3.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                          style={{
                            backgroundColor: theme.accent,
                            boxShadow: `0 0 8px ${theme.accent}`,
                          }}
                        />
                        <span
                          className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase transition-colors duration-500"
                          style={{
                            color: isActive ? theme.accent : "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {theme.categoryBadge}
                        </span>
                      </div>

                      {/* Main Service Title with Bespoke Typography */}
                      <h3
                        className="text-white leading-[1.08] transition-transform duration-300 group-hover:translate-x-1"
                        style={{
                          fontFamily: theme.fontFamily,
                          fontStyle: theme.headingStyle || "normal",
                          fontWeight: theme.headingWeight,
                          letterSpacing: theme.headingLetterSpacing,
                          fontSize:
                            theme.id === "branding-creative"
                              ? "clamp(28px, 3.2vw, 50px)"
                              : "clamp(24px, 2.5vw, 42px)",
                        }}
                      >
                        {service.title}
                      </h3>

                      {/* Dynamic Gradient Service Tagline */}
                      <p
                        className={`mt-2.5 font-medium tracking-[-0.01em] text-[15px] sm:text-[17px] lg:text-[18px] leading-snug transition-all duration-500 ${
                          isActive
                            ? `bg-gradient-to-r ${theme.taglineGradient} bg-clip-text text-transparent`
                            : "text-white/80"
                        }`}
                      >
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
