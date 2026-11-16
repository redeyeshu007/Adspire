"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    description:
      "We build clear brand foundations through research, positioning and strategic thinking, helping businesses define who they are, who they serve and why they matter.",
    capabilities: [
      "Brand Positioning",
      "Audience & Competitor Research",
      "Brand Architecture",
    ],
  },
  {
    id: "brand-identity-design",
    title: "Brand Identity & Design",
    description:
      "We create distinctive visual identities that give brands a recognisable voice, look and personality across every customer touchpoint.",
    capabilities: [
      "Logo & Identity Systems",
      "Typography & Colour Systems",
      "Creative Art Direction",
    ],
  },
  {
    id: "brand-naming-messaging",
    title: "Brand Naming & Messaging",
    description:
      "We shape meaningful brand names, stories and messaging that communicate your purpose and make your brand memorable.",
    capabilities: [
      "Brand Naming",
      "Taglines & Brand Voice",
      "Brand Storytelling",
    ],
  },
  {
    id: "brand-guidelines-systems",
    title: "Brand Guidelines & Systems",
    description:
      "We build flexible brand systems and clear guidelines that help teams maintain consistency as their business grows.",
    capabilities: [
      "Brand Guidelines",
      "Visual Design Systems",
      "Brand Asset Management",
    ],
  },
  {
    id: "packaging-print-design",
    title: "Packaging & Print Design",
    description:
      "We translate brand identity into tangible experiences through thoughtful packaging, print materials and physical brand touchpoints.",
    capabilities: [
      "Packaging Design",
      "Print & Editorial Design",
      "Labels & Stationery",
    ],
  },
  {
    id: "digital-brand-experiences",
    title: "Digital Brand Experiences",
    description:
      "We bring brand identities into the digital world through considered websites, digital interfaces and engaging online experiences.",
    capabilities: [
      "Website Art Direction",
      "Digital Identity",
      "UI & Experience Design",
    ],
  },
  {
    id: "campaigns-creative-direction",
    title: "Campaigns & Creative Direction",
    description:
      "We develop compelling creative concepts and brand campaigns that bring ideas to life and connect with the right audience.",
    capabilities: [
      "Campaign Concepts",
      "Social & Digital Creative",
      "Launch Art Direction",
    ],
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    // Respect user's motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(heading, { opacity: 1, y: 0 });
      rowsRef.current.forEach((row) => {
        if (row) {
          gsap.set(row.querySelectorAll(".service-animate"), {
            opacity: 1,
            y: 0,
          });
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Main Heading Reveal
      gsap.fromTo(
        heading,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

        // Title and Description reveal
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
      aria-label="What We Do — Branding & Creative Services"
      className="relative z-10 w-full min-h-screen bg-transparent text-white selection:bg-[#EE4530] selection:text-white overflow-hidden pointer-events-none scroll-mt-[100px] sm:scroll-mt-[120px]"
    >
      {/* Main Content Layout Container with Matching Editorial Padding */}
      <div
        className="relative z-10 w-full flex flex-col pt-10 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 lg:pb-36 pointer-events-auto"
        style={{
          paddingLeft: "clamp(24px, 8.8vw, 160px)",
          paddingRight: "clamp(24px, 8.8vw, 160px)",
        }}
      >
        {/* 1. SECTION HEADING: "WHAT WE DO" in Global Orange Accent */}
        <div className="mb-12 sm:mb-16 lg:mb-20 select-none will-change-transform">
          <h2
            ref={headingRef}
            className="font-bold tracking-[-0.04em] leading-[0.92] text-[#EE4530]"
            style={{
              fontSize: "clamp(80px, 11vw, 190px)",
            }}
          >
            WHAT WE DO
          </h2>
        </div>

        {/* 2. EDITORIAL SERVICE LIST (Two-Column Layout: Left ~65%, Right ~35%) */}
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-14 lg:pb-16">
                {/* LEFT COLUMN: Large White Service Title & Description (~65% width) */}
                <div className="service-left lg:col-span-8 flex flex-col will-change-transform">
                  <h3
                    className="text-white font-bold tracking-[-0.04em] leading-[0.98] transition-transform duration-300 group-hover:translate-x-1.5"
                    style={{
                      fontSize: "clamp(34px, 4.4vw, 76px)",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-4 sm:mt-5 text-white/75 font-normal leading-[1.6] text-[clamp(15px,1.15vw,20px)] max-w-[660px]">
                    {service.description}
                  </p>
                </div>

                {/* RIGHT COLUMN: Three Capabilities in Global Orange Accent (~35% width) */}
                <div className="service-right lg:col-span-4 flex flex-col pt-6 sm:pt-8 lg:pt-2.5 will-change-transform">
                  <ul
                    className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6 list-none m-0 p-0"
                    aria-label={`${service.title} key capabilities`}
                  >
                    {service.capabilities.map((cap, capIdx) => (
                      <li
                        key={capIdx}
                        className="service-capability text-[#EE4530] font-medium leading-[1.6] text-[clamp(15px,1.15vw,19px)] tracking-[-0.01em] transition-opacity duration-200 group-hover:opacity-95 will-change-transform"
                      >
                        {cap}
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
