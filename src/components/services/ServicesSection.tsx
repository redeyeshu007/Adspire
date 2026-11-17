"use client";

import React, { useEffect, useRef } from "react";
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
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
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
            row.querySelectorAll(".service-left, .service-right, .service-divider"),
            {
              opacity: 1,
              y: 0,
              scaleX: 1,
            }
          );
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Main Heading & Subtitle Reveal
      gsap.fromTo(
        [heading, subheading].filter(Boolean),
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            once: true,
          },
        }
      );

      // 2. Sequential Service Rows Reveal
      rowsRef.current.forEach((row) => {
        if (!row) return;

        const leftCol = row.querySelector(".service-left");
        const rightCol = row.querySelector(".service-right");
        const divider = row.querySelector(".service-divider");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            once: true,
          },
        });

        // Subtle line expansion
        if (divider) {
          tl.fromTo(
            divider,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.6, ease: "power2.out" }
          );
        }

        // Title, Tagline and Description reveal
        if (leftCol) {
          tl.fromTo(
            leftCol,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
            divider ? "-=0.4" : 0
          );
        }

        // Capabilities column reveals smoothly together with the row
        if (rightCol) {
          tl.fromTo(
            rightCol,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
            "-=0.45"
          );
        }
      });

      // Synchronize ScrollTrigger with newly created section triggers
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
          {SERVICES_DATA.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                rowsRef.current[index] = el;
              }}
              className="relative w-full group"
            >
              {/* Subtle top divider line */}
              <div
                className="service-divider w-full h-[1px] bg-white/[0.12] transition-colors duration-300 group-hover:bg-white/[0.24]"
                aria-hidden="true"
              />

              {/* Service Row Content Container — Balanced Editorial Spacing */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-16 lg:pb-20">
                {/* LEFT COLUMN: Title, Tagline & Description */}
                <div className="service-left lg:col-span-7 flex flex-col will-change-transform">
                  <h3
                    className="text-white font-bold tracking-[-0.04em] leading-[1.02] transition-transform duration-300 group-hover:translate-x-1.5"
                    style={{
                      fontSize: "clamp(30px, 3.8vw, 60px)",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p className="mt-3 sm:mt-4 text-[#EE4530] font-medium tracking-[-0.01em] text-[17px] sm:text-[20px] lg:text-[22px] leading-snug">
                    {service.tagline}
                  </p>

                  <p className="mt-3.5 sm:mt-4 text-white/70 font-normal leading-[1.65] text-[15px] sm:text-[17px] max-w-[620px]">
                    {service.description}
                  </p>
                </div>

                {/* RIGHT COLUMN: Capabilities/Solutions in Responsive 2-Col Grid */}
                <div className="service-right lg:col-span-5 flex flex-col pt-4 lg:pt-2 will-change-transform">
                  <div className="text-[11px] sm:text-[12px] uppercase font-mono tracking-[0.22em] text-white/40 mb-4 sm:mb-5 flex items-center gap-2">
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
                        <span className="text-[#EE4530] text-sm leading-none font-bold select-none mt-0.5">•</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {/* Final closing subtle divider line */}
          <div
            className="w-full h-[1px] bg-white/[0.12]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;