"use client";

import React from "react";
import { ContactWithGlobe } from "@/components/ui/contact-with-globe";
import { Footer } from "./Footer";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact Adspire — Start a Conversation"
      className="relative z-10 w-full min-h-screen bg-[#000000] text-white selection:bg-[#EE4530] selection:text-white overflow-hidden scroll-mt-[100px] sm:scroll-mt-[120px]"
    >
      {/* Interactive Contact Experience with 3D Rotating Wireframe Globe */}
      <ContactWithGlobe />

      {/* Official Halftone Wordmark Site Footer */}
      <Footer />
    </section>
  );
}

export default ContactSection;
