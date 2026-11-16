/**
 * Adspire Centralized Animation Toolkit
 * Unified entry point for GSAP, Motion, and Vector animation utilities.
 */

// GSAP Animation Engine (Primary)
export * from "./gsap";
export * from "./pixelScanTimeline";



// React UI Animation (Motion / modern motion/react)
export {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useVelocity,
  useInView,
  useAnimation,
  MotionConfig,
} from "motion/react";
export type {
  Variants,
  Transition,
  TargetAndTransition,
  MotionProps,
} from "motion/react";

// Vector Animation (Lottie)
export { Lottie, useLottie } from "lottie-react";
export type { LottieProps, UseLottieOptions } from "lottie-react";
