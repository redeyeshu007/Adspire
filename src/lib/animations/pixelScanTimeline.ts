import gsap from "gsap";
import { PixelScanScene } from "../three/pixelScanScene";

export interface PixelScanTimelineOptions {
  scene: PixelScanScene;
  onComplete?: () => void;
  reducedMotion?: boolean;
}

/**
 * Creates the cinematic "Pixel Scan Reveal" GSAP animation timeline.
 *
 * ANIMATION PHASES:
 * Stage 1 — Initial State (0.00s - 0.25s):
 *   Pure black background, logo completely hidden.
 * Stage 2 — Pixel Scan Sweep (0.25s - 1.80s, duration 1.55s):
 *   Controlled horizontal scan sweeps from left to right across the logo,
 *   revealing pixel cells with organic row-by-row timing variations.
 * Stage 3 — Pixel Reconstruction Completes (1.70s - 2.15s, duration 0.45s):
 *   Resolves all pixel-grid cells into the razor-sharp original PNG.
 * Stage 4 — Website Transition (2.15s+):
 *   Calls freezeFinalFrame() and triggers onComplete() to smoothly transition into the website.
 */
export function createPixelScanTimeline({
  scene,
  onComplete,
  reducedMotion = false,
}: PixelScanTimelineOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      scene.freezeFinalFrame();
      if (onComplete) {
        onComplete();
      }
    },
  });

  const state = scene.scanState;

  // Reduced motion: immediate resolution with a gentle 0.5s fade
  if (reducedMotion) {
    state.progress = 1.0;
    state.finalResolve = 1.0;
    tl.to(
      {},
      {
        duration: 0.5,
      }
    );
    return tl;
  }

  // Stage 1: Initial Black Void
  state.progress = 0.0;
  state.finalResolve = 0.0;

  tl.addLabel("start", 0.0);
  tl.addLabel("scanBegin", 0.30);

  // Stage 2: Controlled Pixel Scan Sweep (Left to Right)
  // Measured, slow cinematic scan across the entire Adspire identity
  tl.to(
    state,
    {
      progress: 1.0,
      duration: 3.50,
      ease: "sine.inOut",
    },
    "scanBegin"
  );

  // Stage 3: Smooth Pixel Reconstruction Resolve
  // Overlaps the tail end of the scan to resolve all pixel cells into the pristine original PNG
  tl.to(
    state,
    {
      finalResolve: 1.0,
      duration: 0.65,
      ease: "power2.out",
    },
    "scanBegin+=3.20"
  );

  return tl;
}
