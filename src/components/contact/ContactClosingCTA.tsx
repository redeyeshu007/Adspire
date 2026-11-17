"use client";

import React from "react";

export function ContactClosingCTA() {
  const scrollToForm = () => {
    const el = document.getElementById("contact-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full pt-16 sm:pt-24 pb-20 sm:pb-28 border-t border-white/[0.12] select-none will-change-transform">
      <div className="max-w-[960px] flex flex-col items-start">
        {/* Main Heading */}
        <h3
          className="font-bold tracking-[-0.04em] leading-[0.98] text-white"
          style={{
            fontSize: "clamp(36px, 5.2vw, 80px)",
          }}
        >
          <span>Your Next Stage of Growth </span>
          <span className="text-[#EE4530]">Starts Here.</span>
        </h3>

        {/* Supporting Paragraph */}
        <p className="mt-5 sm:mt-7 text-white/75 font-normal leading-[1.65] text-[17px] sm:text-[20px] lg:text-[22px] max-w-[720px]">
          Let&apos;s turn your ideas into stronger brands, smarter digital
          experiences and measurable growth.
        </p>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10">
          <button
            type="button"
            onClick={scrollToForm}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white font-medium text-[15px] tracking-wide uppercase transition-all duration-300 hover:border-[#EE4530] hover:text-[#EE4530] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE4530]"
          >
            <span>START A CONVERSATION</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1 font-bold">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactClosingCTA;