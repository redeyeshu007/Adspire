"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";
import { ContactClosingCTA } from "./ContactClosingCTA";
import { Footer } from "./Footer";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Smooth entrance reveal for contact section elements
      const elements = section.querySelectorAll(".contact-reveal");
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact Adspire — Start a Conversation"
      className="relative z-10 w-full min-h-screen bg-transparent text-white selection:bg-[#EE4530] selection:text-white overflow-hidden scroll-mt-[100px] sm:scroll-mt-[120px]"
    >
      {/* Editorial Content Container */}
      <div
        className="relative z-10 w-full flex flex-col pt-16 sm:pt-24 lg:pt-32"
        style={{
          paddingLeft: "clamp(24px, 5.5vw, 110px)",
          paddingRight: "clamp(24px, 5.5vw, 110px)",
        }}
      >
        {/* 1. Contact Hero Opening Statement */}
        <div className="contact-reveal">
          <ContactHero />
        </div>

        {/* 2. Interactive Contact Form */}
        <div className="contact-reveal">
          <ContactForm />
        </div>

        {/* 3. Final Closing CTA */}
        <div className="contact-reveal">
          <ContactClosingCTA />
        </div>
      </div>

      {/* 4. Official Halftone Wordmark Site Footer */}
      <Footer />
    </section>
  );
}

export default ContactSection;