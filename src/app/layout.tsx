import type { Metadata } from "next";
import {
  Manrope,
  Inter,
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Space_Grotesk,
} from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-hero-1",
  weight: ["700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-hero-2",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-hero-3",
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adspire — Independent Branding & Creative Agency",
  description: "Strategy, identity and digital experiences for ambitious brands.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/assets/logo_2.png", type: "image/png" },
      { url: "/logo_2.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${plusJakartaSans.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#080808] text-white antialiased selection:bg-[#EE4530] selection:text-white"
        suppressHydrationWarning
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
