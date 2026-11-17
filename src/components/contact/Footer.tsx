"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const FOOTER_SERVICES = [
  "Performance Marketing",
  "Social Media Marketing",
  "Branding & Creative",
  "Website & Technology",
  "SEO & Local Growth",
  "AI & Automation",
];

const FOOTER_NAV = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

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
        {/* TOP ROW: 4 Balanced Columns Utilizing Full Width from Left to Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start w-full">
          {/* Column 1: Brand & Mission (~4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <Link
              href="/"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Adspire Homepage"
            >
              <Image
                src="/assets/logo.png"
                alt="Adspire Media"
                width={190}
                height={64}
                style={{ height: "auto" }}
                className="w-[170px] sm:w-[190px] object-contain object-left"
              />
            </Link>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-[#EE4530] font-medium">
              Strategy • Creative • Media • Technology
            </p>

            <p className="mt-4 text-sm text-white/60 font-normal leading-[1.65] max-w-[420px]">
              Adspire Media is a dynamic digital growth agency combining
              strategy, creativity, performance marketing and technology to help
              businesses build stronger brands and grow in the digital world.
            </p>
          </div>

          {/* Column 2: Services (~3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
              SERVICES
            </span>
            <ul className="flex flex-col space-y-2.5 list-none m-0 p-0 text-sm">
              {FOOTER_SERVICES.map((s) => (
                <li key={s}>
                  <Link
                    href="#services"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation (~2 cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-1">
              NAVIGATION
            </span>
            <ul className="flex flex-col space-y-2.5 list-none m-0 p-0 text-sm">
              {FOOTER_NAV.map((n) => (
                <li key={n.label}>
                  <Link
                    href={n.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {n.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect & Location (~3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
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
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 w-full">
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