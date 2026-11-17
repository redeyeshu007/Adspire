"use client";

import React from "react";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

export function Footer() {
  return (
    <HalftoneWordmarkFooter
      wordmark="adspire"
      columns={[]}
      label={null}
      meta={null}
      copyright={<span>© 2026 Adspire Media. All rights reserved.</span>}
      palette={{
        background: "#000000",
        ink: "#ffffff",
        warm: "#EE4530",
      }}
      fontFamily='"Manrope", "Inter Tight", "Inter", "Helvetica Neue", Arial, sans-serif'
      fontWeight={800}
      height="clamp(360px, 48vh, 500px)"
      dotGap={6}
      radius={85}
      crop={0.16}
      grain={0.35}
      interactive={true}
      backToTop={true}
    />
  );
}

export default Footer;
