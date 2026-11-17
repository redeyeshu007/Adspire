"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { ServiceVisualPreview } from "./ServiceVisualPreview";

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
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);
  const closingDividerRef = useRef<HTMLDivElement | null>(null);

  // Interactive Visual Preview States
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  // Mouse move handler with intelligent boundary placement to never obscure text
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const previewWidth = 380;
    const previewHeight = 260;
    const padding = 24;

    if (typeof window === "undefined") return;

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // Intelligent positioning:
    // If cursor is on the left half of the screen (hovering title/tagline/description),
    // position preview into the right zone so it NEVER obscures the editorial typography.
    let targetX: number;
    if (e.clientX < winW * 0.5) {
      targetX = Math.max(e.clientX + 48, winW * 0.52);
      if (targetX + previewWidth > winW - padding) {
        targetX = winW - previewWidth - padding;
      }
    } else {
      // If cursor is on the right half, position to the left of the cursor
      targetX = e.clientX - previewWidth - 48;
      if (targetX < padding) {
        targetX = padding;
      }
    }

    // Vertical positioning: smoothly follow cursor Y, clamped within viewport bounds
    let targetY = e.clientY - previewHeight / 2;
    if (targetY < padding) {
      targetY = padding;
    } else if (targetY + previewHeight > winH - padding) {
      targetY = winH - previewHeight - padding;
    }

    setCursorPos({ x: targetX, y: targetY });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const closingDivider = closingDividerRef.current;
    if (!section || !heading) return;

    // Respect user's motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([heading, subheading], { opacity: 1, y: 0 });
      rowsRef.current.forEach((row) => {
        if (row) {
          gsap.set(
            row.querySelectorAll(
              ".service-divider, .service-title, .service-tagline, .service-desc, .service-label, .service-capability"
            ),
            {
              opacity: 1,
              x: 0,
              y: 0,
              scaleX: 1,
            }
          );
        }
      });
      if (closingDivider) {
        gsap.set(closingDivider, { scaleX: 1 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. SECTION HEADING & SUBTITLE REVEAL (Supports Reverse Scroll)
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

      // 2. SEQUENTIAL SERVICE ROWS: CENTER-OUTWARD DIVIDER + INWARD CONTENT REVEALS
      rowsRef.current.forEach((row) => {
        if (!row) return;

        const divider = row.querySelector<HTMLElement>(".service-divider");
        const title = row.querySelector<HTMLElement>(".service-title");
        const tagline = row.querySelector<HTMLElement>(".service-tagline");
        const desc = row.querySelector<HTMLElement>(".service-desc");
        const rightLabel = row.querySelector<HTMLElement>(".service-label");
        const capabilities = row.querySelectorAll<HTMLElement>(".service-capability");

        // Initial setup for refined editorial entrance
        if (divider) {
          gsap.set(divider, { scaleX: 0, transformOrigin: "center center" });
        }
        if (title) {
          gsap.set(title, { x: -36, opacity: 0 });
        }
        if (tagline) {
          gsap.set(tagline, { x: -28, opacity: 0 });
        }
        if (desc) {
          gsap.set(desc, { y: 24, opacity: 0 });
        }
        if (rightLabel) {
          gsap.set(rightLabel, { x: 20, opacity: 0 });
        }
        if (capabilities.length > 0) {
          gsap.set(capabilities, { x: 28, opacity: 0 });
        }

        // Timeline triggered when service row enters the viewport
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        });

        // Step 1: Animated divider draws outward simultaneously from center to edges
        if (divider) {
          tl.to(divider, {
            scaleX: 1,
            duration: 0.65,
            ease: "power2.inOut",
          });
        }

        // Step 2: Left column reveals gently inward from left
        if (title) {
          tl.to(
            title,
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
            },
            divider ? "-=0.25" : 0
          );
        }

        if (tagline) {
          tl.to(
            tagline,
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.5"
          );
        }

        if (desc) {
          tl.to(
            desc,
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.45"
          );
        }

        // Step 3: Right column reveals gently inward from right
        if (rightLabel) {
          tl.to(
            rightLabel,
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.6"
          );
        }

        // Step 4: Capabilities appear sequentially with refined stagger
        if (capabilities.length > 0) {
          tl.to(
            capabilities,
            {
              x: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.4"
          );
        }
      });

      // 3. FINAL CLOSING DIVIDER LINE ANIMATION (Center-Outward)
      if (closingDivider) {
        gsap.set(closingDivider, { scaleX: 0, transformOrigin: "center center" });
        gsap.to(closingDivider, {
          scaleX: 1,
          duration: 0.65,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: closingDivider,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
        });
      }

      // Synchronize ScrollTrigger
      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="What We Do — Everything Your Brand Needs to Grow Digitally"
      className="relative z-10 w-full min-h-screen bg-transparent text-white selection:bg-[#EE4530] selection:text-white overflow-hidden pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
    >
      {/* Target anchor for 'Our Work' navigation */}
      <div
        id="work"
        className="absolute top-0 left-0 w-full h-0 pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
      />

      {/* Floating Interactive Visual Preview for Desktop */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300 ease-out hidden lg:block"
        style={{
          top: 0,
          left: 0,
          opacity: activePreviewId ? 1 : 0,
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) scale(${activePreviewId ? 1 : 0.94})`,
          transition: "opacity 0.22s ease, transform 0.1s ease-out",
          width: "380px",
          height: "260px",
        }}
        aria-hidden="true"
      >
        {activePreviewId && (
          <ServiceVisualPreview
            serviceId={activePreviewId}
            className="shadow-2xl shadow-black/90 ring-1 ring-white/20"
          />
        )}
      </div>

      {/* Main Content Layout Container with Matching Editorial Padding */}
      <div
        className="relative z-10 w-full flex flex-col pt-12 sm:pt-18 lg:pt-24 pb-20 sm:pb-28 lg:pb-36 pointer-events-auto"
        style={{
          paddingLeft: "clamp(24px, 8.8vw, 160px)",
          paddingRight: "clamp(24px, 8.8vw, 160px)",
        }}
      >
        {/* 1. SECTION HEADING: "WHAT WE DO" in Global Orange Accent + Subtitle */}
        <div className="mb-14 sm:mb-20 lg:mb-24 select-none will-change-transform">
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

        {/* 2. EDITORIAL SERVICE LIST (Two-Column Layout: Left ~60%, Right ~40%) */}
        <div className="flex flex-col w-full">
          {SERVICES_DATA.map((service, index) => {
            const indexFormatted = `0${index + 1}`;
            const isHovered = activePreviewId === service.id;
            const isMobileExpanded = expandedMobileId === service.id;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                className="relative w-full group transition-colors duration-300"
                onMouseEnter={() => setActivePreviewId(service.id)}
                onMouseLeave={() => setActivePreviewId(null)}
                onMouseMove={handleMouseMove}
              >
                {/* Centre-Outward Animated Divider Line */}
                <div
                  className="service-divider w-full h-[1px] bg-white/[0.14] transition-colors duration-300 group-hover:bg-white/[0.32]"
                  aria-hidden="true"
                />

                {/* Service Row Content Container — Balanced Editorial Spacing */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-16 lg:pb-20">
                  {/* LEFT COLUMN: Numbering, Title, Tagline & Description */}
                  <div className="service-left lg:col-span-7 flex flex-col will-change-transform">
                    {/* Index + Title Row */}
                    <div className="flex items-baseline gap-3 sm:gap-4">
                      <span className="font-mono text-white/30 text-base sm:text-lg lg:text-xl font-medium select-none">
                        {indexFormatted}
                      </span>

                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className="service-title text-white font-bold tracking-[-0.04em] leading-[1.02] transition-transform duration-300 group-hover:translate-x-1"
                          style={{
                            fontSize: "clamp(30px, 3.8vw, 60px)",
                          }}
                        >
                          {service.title}
                        </h3>

                        {/* Interactive Preview Badge Indicator on Desktop */}
                        <span
                          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all duration-300 ${
                            isHovered
                              ? "bg-[#EE4530]/20 text-[#EE4530] border border-[#EE4530]/40 opacity-100"
                              : "bg-white/5 text-white/40 border border-white/10 opacity-60 group-hover:opacity-100 group-hover:text-white/80"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                              isHovered ? "bg-[#EE4530] animate-pulse" : "bg-white/40"
                            }`}
                          />
                          Preview
                        </span>
                      </div>
                    </div>

                    <p className="service-tagline mt-3 sm:mt-4 text-[#EE4530] font-medium tracking-[-0.01em] text-[17px] sm:text-[20px] lg:text-[22px] leading-snug">
                      {service.tagline}
                    </p>

                    <p className="service-desc mt-3.5 sm:mt-4 text-white/70 font-normal leading-[1.65] text-[15px] sm:text-[17px] max-w-[620px]">
                      {service.description}
                    </p>

                    {/* Mobile & Tablet Interactive Preview Toggle Button */}
                    <div className="lg:hidden mt-5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedMobileId(isMobileExpanded ? null : service.id);
                        }}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                          isMobileExpanded
                            ? "bg-[#EE4530]/20 border-[#EE4530]/40 text-[#EE4530]"
                            : "bg-white/5 border-white/20 text-white/80 active:bg-white/10"
                        }`}
                        aria-expanded={isMobileExpanded}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isMobileExpanded ? "bg-[#EE4530] animate-pulse" : "bg-white/40"
                          }`}
                        />
                        <span>{isMobileExpanded ? "Hide Visual Preview" : "View Visual Preview"}</span>
                        <span className="text-[10px] opacity-70">
                          {isMobileExpanded ? "▲" : "▼"}
                        </span>
                      </button>

                      {/* Expandable preview container on mobile */}
                      {isMobileExpanded && (
                        <div className="mt-4 w-full h-[250px] transition-all duration-300">
                          <ServiceVisualPreview
                            serviceId={service.id}
                            className="shadow-xl ring-1 ring-white/20"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Capabilities/Solutions in Responsive 2-Col Grid */}
                  <div className="service-right lg:col-span-5 flex flex-col pt-4 lg:pt-2 will-change-transform">
                    <div className="service-label text-[11px] sm:text-[12px] uppercase font-mono tracking-[0.22em] text-white/40 mb-4 sm:mb-5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EE4530]" aria-hidden="true" />
                      <span>{service.itemsLabel}</span>
                    </div>

                    <ul
                      className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-3.5 list-none m-0 p-0"
                      aria-label={`${service.title} ${service.itemsLabel.toLowerCase()}`}
                    >
                      {service.capabilities.map((cap, capIdx) => (
                        <li
                          key={capIdx}
                          className="service-capability flex items-start gap-2.5 text-white/75 group-hover:text-white/95 text-[14px] sm:text-[15px] lg:text-[15px] leading-[1.4] transition-colors duration-200"
                        >
                          <span className="text-[#EE4530] text-sm leading-none font-bold select-none mt-0.5">
                            •
                          </span>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final closing subtle divider line with center-outward animation */}
          <div
            ref={closingDividerRef}
            className="w-full h-[1px] bg-white/[0.14]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
