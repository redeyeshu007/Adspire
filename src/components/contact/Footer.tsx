"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="w-full bg-[#000000] border-t border-white/[0.12] pt-16 sm:pt-20 pb-12 select-none"
      aria-label="Site Footer"
    >
      <div className="w-full flex flex-col space-y-12 sm:space-y-16">
        {/* TOP ROW: Brand Wordmark, Tagline, Navigation & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Brand & Description (~4 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link
              href="/"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Adspire Homepage"
            >
              <Image
                src="/assets/logo.png"
                alt="Adspire Media"
                width={180}
                height={60}
                style={{ height: "auto" }}
                className="w-[160px] sm:w-[180px] object-contain object-left"
              />
            </Link>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-[#EE4530] font-medium">
              Strategy • Creative • Media • Technology
            </p>

            <p className="mt-4 text-sm text-white/60 font-normal leading-[1.6] max-w-[360px]">
              A dynamic digital growth agency combining strategy, creativity,
              performance marketing and technology to help businesses build
              stronger brands.
            </p>
          </div>

          {/* Quick Navigation (~3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
              NAVIGATION
            </span>
            <ul className="flex flex-col space-y-2.5 list-none m-0 p-0 text-sm">
              <li>
                <Link
                  href="#work"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  WORK
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  SERVICES
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Location (~4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
              CONNECT
            </span>
            <div className="flex flex-col space-y-2 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <span className="text-white/40">Location:</span>
                <span>Dindigul, Tamil Nadu</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-white/40">Phone:</span>
                <span className="text-white/50 font-mono text-xs">[Add Number]</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-white/40">Email:</span>
                <span className="text-white/50 font-mono text-xs">[Add Official Email]</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-white/40">Website:</span>
                <span className="text-white/50 font-mono text-xs">[Add Domain]</span>
              </p>
            </div>

            {/* Social links */}
            <div className="pt-3 flex items-center gap-5 text-sm">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#EE4530] transition-colors"
              >
                Instagram
              </a>
              <span className="text-white/20 select-none">•</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#EE4530] transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-white/20 select-none">•</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#EE4530] transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Copyright & Back-to-Top */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Adspire Media. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
          >
            <span>Back to top</span>
            <span className="transform transition-transform duration-200 group-hover:-translate-y-0.5 text-sm font-bold">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;