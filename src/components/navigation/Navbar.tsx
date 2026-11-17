"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = React.useRef(false);
  const { scrollTo } = useSmoothScroll();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      scrollTo(0, { duration: 1.3 });
      window.history.pushState(null, "", "/");
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollTo(href, { offset: -50, duration: 1.3 });
      window.history.pushState(null, "", href);
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };

  React.useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const y = window.scrollY;
      // Activation threshold: 28px (within 24-32px), Return-to-top threshold: 14px (hysteresis prevents flicker)
      const isScrolled = scrolledRef.current ? y > 14 : y > 28;

      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    // Initialize immediately on mount (handles page refresh while already scrolled)
    updateScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-auto bg-transparent border-b border-transparent">
      <nav
        className={`w-full flex items-center justify-between pb-4 transition-[padding] duration-300 ${
          scrolled ? "pt-5 sm:pt-6" : "pt-[42px] sm:pt-[46px]"
        }`}
        style={{
          paddingLeft: "clamp(24px, 8.8vw, 160px)",
          paddingRight: "clamp(24px, 8.8vw, 160px)",
        }}
        aria-label="Main Navigation"
      >
        {/* LEFT: Dynamic Scroll-Switched Adspire Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="group relative inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
          aria-label="Adspire Homepage"
        >
          <div className="relative flex items-center justify-start h-[52px] sm:h-[58px] md:h-[64px] w-[180px] sm:w-[190px] md:w-[200px]">
            {/* 1. Default State: Original Wordmark Logo (logo.png) */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 flex items-center transition-opacity ease-in-out motion-reduce:transition-none motion-reduce:delay-0 ${
                scrolled
                  ? "opacity-0 pointer-events-none duration-200 ease-out"
                  : "opacity-100 pointer-events-auto duration-300 delay-75"
              }`}
              aria-hidden={scrolled}
            >
              <Image
                src="/assets/logo.png"
                alt="Adspire Media"
                width={200}
                height={67}
                priority
                style={{ height: "auto" }}
                className="w-[180px] sm:w-[190px] md:w-[200px] object-contain object-left transition-opacity duration-300 group-hover:opacity-85"
              />
            </div>

            {/* 2. Scrolled State: Scrolled Emblem Logo (logo_2.png) */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 flex items-center transition-opacity ease-in-out motion-reduce:transition-none motion-reduce:delay-0 ${
                scrolled
                  ? "opacity-100 pointer-events-auto duration-300 delay-75"
                  : "opacity-0 pointer-events-none duration-200 ease-out"
              }`}
              aria-hidden={!scrolled}
            >
              <Image
                src="/assets/logo_2.png"
                alt="Adspire"
                width={1274}
                height={1234}
                priority
                style={{ height: "auto" }}
                className="w-[46px] sm:w-[50px] md:w-[54px] object-contain object-left transition-opacity duration-300 group-hover:opacity-85 translate-y-[2px] brightness-0 invert"
              />
            </div>
          </div>
        </Link>

        {/* RIGHT: Desktop Navigation (Home, About, Services, Our Work, Contact) */}
        <ul className="hidden lg:flex items-center gap-[22px] xl:gap-[32px] 2xl:gap-[40px]">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative text-[15px] xl:text-[16px] 2xl:text-[17px] font-medium tracking-[0.06em] uppercase text-white/90 hover:text-white transition-colors duration-200 py-1 group focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 whitespace-nowrap"
              >
                {item.label}
                {/* Subtle animated dynamic accent underline on hover */}
                <span
                  className="absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 ease-out group-hover:w-full"
                  style={{ backgroundColor: "var(--theme-accent, #EE4530)" }}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md p-2 z-50 text-white"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-6 h-[1.5px] bg-white transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-white transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
            }`}
          />
        </button>

        {/* Mobile Fullscreen Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-[#080808]/96 backdrop-blur-md flex flex-col justify-center px-8 transition-all duration-300 lg:hidden z-40 ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <ul className="flex flex-col space-y-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-2xl font-medium tracking-[0.08em] uppercase text-white hover:text-[#EE4530] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
