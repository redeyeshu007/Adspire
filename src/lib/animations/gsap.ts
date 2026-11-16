import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

let pluginsRegistered = false;

/**
 * Registers all core GSAP animation and scrolling plugins centrally.
 * Ensures plugins are registered exactly once and only in browser environments,
 * preventing duplicate registration and server-side execution errors in Next.js App Router.
 */
export function registerGSAPPlugins(): void {
  if (pluginsRegistered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin,
    CustomEase,
    Flip,
    Observer,
    ScrollToPlugin,
    useGSAP
  );

  pluginsRegistered = true;
}

// Auto-register on client-side evaluation
if (typeof window !== "undefined") {
  registerGSAPPlugins();
}

/**
 * Utility helper to kill all active GSAP animations, timelines, and ScrollTrigger instances
 * associated with specific elements or selectors for clean lifecycle management.
 */
export function killAnimations(targets: gsap.TweenTarget): void {
  gsap.killTweensOf(targets);
  if (typeof window !== "undefined") {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === targets || trigger.vars.trigger === targets) {
        trigger.kill();
      }
    });
  }
}

// Export configured GSAP instance, plugins, hooks, and types
export {
  gsap,
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  TextPlugin,
  CustomEase,
  Flip,
  Observer,
  ScrollToPlugin,
  useGSAP,
};

export type GSAPTimeline = gsap.core.Timeline;
export type GSAPTween = gsap.core.Tween;
export type GSAPContext = gsap.Context;

export default gsap;
