"use client";

import React from "react";
import Image from "next/image";

export interface ServiceVisualPreviewProps {
  serviceId: string;
  className?: string;
}

export function ServiceVisualPreview({ serviceId, className = "" }: ServiceVisualPreviewProps) {
  switch (serviceId) {
    case "performance-marketing":
      return (
        <div
          className={`w-full h-full p-5 sm:p-6 rounded-lg bg-[#0c0c0c]/95 border border-white/15 backdrop-blur-md flex flex-col justify-between text-white select-none ${className}`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE4530] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                Performance Analytics // Live
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EE4530]/15 text-[#EE4530] border border-[#EE4530]/30 font-semibold">
              +142% ROAS
            </span>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Conversion
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                8.42%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Cost / Lead
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#EE4530] tracking-tight">
                -38.5%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Quality Score
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                9.8 / 10
              </span>
            </div>
          </div>

          {/* SVG Trend Chart */}
          <div className="relative w-full h-24 my-1">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 320 90"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EE4530" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#EE4530" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Background Grid Lines */}
              <line x1="0" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Area */}
              <path
                d="M0 75 Q 40 68, 80 55 T 160 38 T 240 22 T 320 10 L 320 90 L 0 90 Z"
                fill="url(#perfGrad)"
              />
              {/* Trend Line */}
              <path
                d="M0 75 Q 40 68, 80 55 T 160 38 T 240 22 T 320 10"
                stroke="#EE4530"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Active Point Indicator */}
              <circle cx="320" cy="10" r="4.5" fill="#EE4530" />
              <circle cx="320" cy="10" r="8" stroke="#EE4530" strokeWidth="1.5" strokeOpacity="0.5" className="animate-ping" />
            </svg>
          </div>

          {/* Footer Tags */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
            <span>GOOGLE ADS • META ADS</span>
            <span>OPTIMIZED DATA FUNNEL</span>
          </div>
        </div>
      );

    case "social-media-marketing":
      return (
        <div
          className={`w-full h-full p-5 sm:p-6 rounded-lg bg-[#0c0c0c]/95 border border-white/15 backdrop-blur-md flex flex-col justify-between text-white select-none ${className}`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE4530]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                Editorial Social Suite
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/50">
              34.8K REACH / MO
            </span>
          </div>

          {/* Story / Creative Avatars */}
          <div className="flex items-center gap-3 my-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#EE4530] via-orange-400 to-amber-300 flex items-center justify-center shrink-0"
              >
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white/80">
                  0{i}
                </div>
              </div>
            ))}
            <span className="text-[11px] font-mono text-white/40 ml-1">
              +Brand Stories
            </span>
          </div>

          {/* Multi-Format Post Mockups */}
          <div className="grid grid-cols-2 gap-2.5 my-1">
            <div className="p-3 rounded bg-white/[0.04] border border-white/[0.08] flex flex-col justify-between h-24">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#EE4530]">
                Carousel Story
              </span>
              <p className="text-[11px] font-semibold text-white/90 leading-tight">
                Visualizing Brand Impact & Retention
              </p>
              <span className="text-[10px] text-white/40 font-mono">♥ 1.8K • 290 Shares</span>
            </div>
            <div className="p-3 rounded bg-white/[0.04] border border-white/[0.08] flex flex-col justify-between h-24">
              <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400">
                Reel / Video
              </span>
              <p className="text-[11px] font-semibold text-white/90 leading-tight">
                High-Conversion Creative Motion
              </p>
              <span className="text-[10px] text-white/40 font-mono">▶ 28.4K Views</span>
            </div>
          </div>

          {/* Footer Tags */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
            <span>INSTAGRAM • LINKEDIN • X</span>
            <span>STRATEGIC CALENDAR</span>
          </div>
        </div>
      );

    case "branding-creative":
      return (
        <div
          className={`w-full h-full p-5 sm:p-6 rounded-lg bg-[#0c0c0c]/95 border border-white/15 backdrop-blur-md flex flex-col justify-between text-white select-none ${className}`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE4530]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                Brand Identity System
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/50">
              SPEC // 2026
            </span>
          </div>

          {/* Authentic Adspire Logo Centerpiece */}
          <div className="relative py-4 px-6 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="Adspire Media Brand Identity"
              width={200}
              height={68}
              className="w-[160px] sm:w-[190px] h-auto object-contain"
            />
          </div>

          {/* Palette Swatches & Typography Spec */}
          <div className="grid grid-cols-4 gap-2 my-2">
            <div className="flex flex-col items-center">
              <div className="w-full h-6 rounded bg-[#EE4530] border border-white/20" />
              <span className="text-[9px] font-mono text-white/60 mt-1">#EE4530</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-6 rounded bg-[#000000] border border-white/30" />
              <span className="text-[9px] font-mono text-white/60 mt-1">#000000</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-6 rounded bg-[#F76B4A] border border-white/20" />
              <span className="text-[9px] font-mono text-white/60 mt-1">#F76B4A</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-6 rounded bg-[#FFFFFF] border border-white/20" />
              <span className="text-[9px] font-mono text-black/90 mt-1">#FFFFFF</span>
            </div>
          </div>

          {/* Footer Tags */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
            <span>LOGO • TYPOGRAPHY • PACKAGING</span>
            <span>VECTOR ASSETS</span>
          </div>
        </div>
      );

    case "website-technology":
      return (
        <div
          className={`w-full h-full p-5 sm:p-6 rounded-lg bg-[#0c0c0c]/95 border border-white/15 backdrop-blur-md flex flex-col justify-between text-white select-none ${className}`}
        >
          {/* Top Browser Chrome Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] font-mono text-white/40 ml-2">adspiremedia.com</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              100% LIGHTHOUSE
            </span>
          </div>

          {/* Responsive Layout Wireframe Mockup */}
          <div className="relative p-3 my-2 rounded bg-white/[0.02] border border-white/[0.08] flex gap-3 items-center">
            {/* Desktop Mock */}
            <div className="flex-1 rounded border border-white/15 bg-black/60 p-2 flex flex-col gap-1.5">
              <div className="w-12 h-1.5 rounded bg-[#EE4530]" />
              <div className="w-full h-8 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="text-[9px] font-mono text-white/50">MODULAR GRID UI</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="h-4 rounded bg-white/[0.04]" />
                <div className="h-4 rounded bg-white/[0.04]" />
                <div className="h-4 rounded bg-white/[0.04]" />
              </div>
            </div>

            {/* Mobile Device Mock */}
            <div className="w-16 rounded-md border border-white/20 bg-black/80 p-1.5 flex flex-col gap-1 shrink-0">
              <div className="w-4 h-1 rounded-full bg-white/30 mx-auto" />
              <div className="w-full h-10 rounded bg-[#EE4530]/20 border border-[#EE4530]/30" />
              <div className="w-full h-3 rounded bg-white/[0.06]" />
              <div className="w-full h-3 rounded bg-white/[0.06]" />
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/60">
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06]">NEXT.JS 16</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06]">REACT 19</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06]">TAILWIND</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06]">THREE.JS</span>
          </div>

          {/* Footer Tags */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
            <span>HIGH CONVERSION UI/UX</span>
            <span>0.4S LOAD TIME</span>
          </div>
        </div>
      );

    case "seo-local-growth":
      return (
        <div
          className={`w-full h-full p-5 sm:p-6 rounded-lg bg-[#0c0c0c]/95 border border-white/15 backdrop-blur-md flex flex-col justify-between text-white select-none ${className}`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE4530]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                Search Engine Radar
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              #1 RANKED KEYWORDS
            </span>
          </div>

          {/* Search Result Showcase */}
          <div className="my-2 p-3 rounded bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
              <span>https://adspiremedia.com</span>
              <span className="text-white/30">•</span>
              <span className="text-white/50">Organic Top 3</span>
            </div>
            <p className="text-[12px] font-semibold text-[#EE4530]">
              Top Digital Growth & Performance Marketing Agency
            </p>
            <p className="text-[10px] text-white/60 leading-tight">
              Scale revenue with high-ROI digital campaigns, custom web applications and data-driven marketing.
            </p>
          </div>

          {/* Local Map Pack / Radius Indicator */}
          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE4530] animate-ping" />
              <span className="text-[10px] font-mono text-white/80">Google Local Pack Visibility</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-white">99.4% Top 3</span>
          </div>

          {/* Footer Tags */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
            <span>ON-PAGE & TECHNICAL</span>
            <span>HIGH COMMERCIAL INTENT</span>
          </div>
        </div>
      );

    case "ai-automation":
      return (
        <div
          className={`w-full h-full p-5 sm:p-6 rounded-lg bg-[#0c0c0c]/95 border border-white/15 backdrop-blur-md flex flex-col justify-between text-white select-none ${className}`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE4530] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                AI Pipeline & Automation Engine
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              ACTIVE WORKFLOWS
            </span>
          </div>

          {/* Node Diagram SVG */}
          <div className="relative w-full h-24 my-2 flex items-center justify-between px-2">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold">
                LEAD
              </div>
              <span className="text-[8px] font-mono text-white/40 mt-1">INBOUND</span>
            </div>

            <div className="flex-1 h-[2px] bg-gradient-to-r from-white/20 via-[#EE4530] to-white/20 relative mx-2">
              <div className="absolute top-[-3px] left-1/2 w-2 h-2 rounded-full bg-[#EE4530] animate-ping" />
            </div>

            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#EE4530]/20 border border-[#EE4530] flex items-center justify-center text-[10px] font-mono font-bold text-[#EE4530]">
                AI
              </div>
              <span className="text-[8px] font-mono text-[#EE4530] mt-1">QUALIFY</span>
            </div>

            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#EE4530] via-cyan-400 to-white/20 relative mx-2">
              <div className="absolute top-[-3px] left-1/2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold">
                CRM
              </div>
              <span className="text-[8px] font-mono text-white/40 mt-1">DISPATCH</span>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06] flex justify-between">
              <span className="text-white/40">Response Latency</span>
              <span className="text-white font-semibold">&lt; 1.2s</span>
            </div>
            <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06] flex justify-between">
              <span className="text-white/40">Manual Hours Saved</span>
              <span className="text-[#EE4530] font-semibold">120h / mo</span>
            </div>
          </div>

          {/* Footer Tags */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
            <span>WHATSAPP API • WORKFLOW NODES</span>
            <span>ZERO DROPPED LEADS</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default ServiceVisualPreview;
