"use client";

import React from "react";

export function ContactHero() {
  return (
    <div className="w-full select-none will-change-transform pb-12 sm:pb-16 lg:pb-20">
      {/* 1. Oversized Editorial Headline */}
      <h2
        className="font-bold tracking-[-0.045em] leading-[0.96] text-white max-w-[1200px]"
        style={{
          fontSize: "clamp(46px, 6.4vw, 96px)",
        }}
      >
        <span className="block">Have an Idea?</span>
        <span className="block mt-1 sm:mt-2">
          Let&apos;s <span className="text-[#EE4530]">Build It.</span>
        </span>
      </h2>

      {/* 2. Supporting Paragraph */}
      <p className="mt-6 sm:mt-8 text-white/75 font-normal leading-[1.65] text-[17px] sm:text-[20px] lg:text-[22px] max-w-[840px]">
        Whether you&apos;re building a new brand, trying to generate more
        customers, launching a website or looking for a long-term digital growth
        partner, we&apos;d love to understand what you&apos;re working on.
      </p>
    </div>
  );
}

export default ContactHero;