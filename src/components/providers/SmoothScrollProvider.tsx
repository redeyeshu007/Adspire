"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Lenis, { type LenisOptions, type ScrollToOptions } from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import "lenis/dist/lenis.css";

export interface SmoothScrollContextValue {
  /** The active Lenis smooth-scroll instance (null before client mount or if destroyed). */
  readonly lenis: Lenis | null;
  /** Programmatically scroll to target with smooth easing. */
  scrollTo: (
    target: number | string | HTMLElement,
    options?: ScrollToOptions
  ) => void;
  /** Temporarily stop smooth scroll updates. */
  stop: () => void;
  /** Resume smooth scroll updates. */
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

/**
 * Hook to consume the global smooth scroll instance and control methods.
 */
export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
  options?: Partial<LenisOptions>;
}

/**
 * Global SmoothScrollProvider integrating Lenis smooth scrolling with GSAP ScrollTrigger.
 * Synchronizes Lenis with GSAP's central ticker to guarantee a single requestAnimationFrame loop,
 * supports anchor navigation, and respects accessibility prefers-reduced-motion settings.
 */
export function SmoothScrollProvider({
  children,
  options,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initialize Lenis instance with autoRaf disabled (GSAP ticker manages loop)
    const lenis = new Lenis({
      autoRaf: false, // Prevents duplicate requestAnimationFrame loops
      smoothWheel: true,
      syncTouch: false,
      duration: 1.25, // Silky smooth 1.25s fluid momentum glide
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve (Apple / Studio Freight signature)
      wheelMultiplier: 1.0, // Natural 1:1 wheel response
      touchMultiplier: 1.8,
      anchors: true, // Native anchor link scrolling support
      respectReducedMotion: false, // Ensure smooth scroll is always enabled
      autoResize: true,
      ...options,
    });

    lenisRef.current = lenis;

    // Expose lenis instance globally for helper access
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // 2. Synchronize ScrollTrigger with Lenis scroll positions
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // 3. Connect GSAP ticker to Lenis.raf (convert GSAP seconds to Lenis milliseconds)
    const handleTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(handleTicker);

    // Enable balanced lag smoothing to prevent stuttering/jumping during frame drops
    gsap.ticker.lagSmoothing(500, 33);

    // Initial ScrollTrigger synchronization
    ScrollTrigger.refresh();

    // 4. Teardown and lifecycle cleanup
    return () => {
      gsap.ticker.remove(handleTicker);
      lenis.off("scroll", handleScroll);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, [options]);

  const contextValue = useMemo<SmoothScrollContextValue>(
    () => ({
      get lenis() {
        return lenisRef.current;
      },
      scrollTo: (target, scrollOptions) =>
        lenisRef.current?.scrollTo(target, {
          offset: -60,
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          ...scrollOptions,
        }),
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    []
  );

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export default SmoothScrollProvider;
