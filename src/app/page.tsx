"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { PersistentBackground } from "@/components/hero/PersistentBackground";
import { HeroSection } from "@/components/hero/HeroSection";
import { IntroSection } from "@/components/intro/IntroSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { AdspirePreloader } from "@/components/preloader/AdspirePreloader";

export default function Home() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-[#000000] overflow-x-hidden text-white selection:bg-[#EE4530] selection:text-white">
      {/* 1. Global Persistent 3D Background with Scroll-Driven Dissolve */}
      <PersistentBackground />

      {/* 2. Persistent Navigation Bar (Home, About, Services, Our Work, Contact) */}
      <Navbar />

      {/* 3. Section 01: Master Homepage Hero Section */}
      <HeroSection startEntrance={preloaderFinished} />

      {/* 4. Section 02: Cinematic Brand Introduction ("Hello") */}
      <IntroSection />

      {/* 5. Section 03: Editorial Services ("WHAT WE DO") */}
      <ServicesSection />

      {/* 6. Section 04: Editorial Contact Experience & Site Footer */}
      <ContactSection />

      {/* 7. Pixel Scan Reveal Preloader (Dissolves smoothly into the Hero) */}
      <AdspirePreloader
        isPreview={false}
        onComplete={() => setPreloaderFinished(true)}
      />
    </main>
  );
}
