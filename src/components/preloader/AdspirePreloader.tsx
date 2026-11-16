"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { PixelScanScene } from "./PixelScanScene";
import "./pixel-scan.css";

export interface AdspirePreloaderProps {
  /** Optional callback fired when the pixel scan reveal sequence completes. */
  onComplete?: () => void;
  /** Custom logo asset URL (defaults to original Adspire logo at /assets/logo.png). */
  textureUrl?: string;
  /** Whether running in isolated preview mode where preloader stays pinned on screen. */
  isPreview?: boolean;
}

const emptySubscribe = () => () => {};

/**
 * Hook to safely detect client-side mounting without triggering cascading renders or hydration mismatches.
 */
function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Checks if WebGL is supported in the current client environment.
 */
function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Adspire Pixel Scan Reveal Preloader
 *
 * Cinematic digital scanning system reconstructing the original Adspire logo
 * through a controlled, left-to-right pixel-by-pixel reveal on a pure black background.
 * The stationary logo remains locked at (0, 0, 0) with zero rotation, resolving
 * into the razor-sharp original PNG at full quality.
 */
export function AdspirePreloader({
  onComplete,
  textureUrl = "/assets/logo.png",
  isPreview = false,
}: AdspirePreloaderProps) {
  const isClient = useIsClient();
  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  // Detect user's accessibility reduced-motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const webGLAvailable = isClient && isWebGLSupported() && !hasWebGLError;

  const handleSequenceComplete = () => {
    if (isPreview) {
      onComplete?.();
      return;
    }
    setIsExiting(true);
    // Trigger transition into website immediately as preloader begins its exit dissolve
    onComplete?.();
    setTimeout(() => {
      setIsRemoved(true);
    }, 850);
  };

  if (isRemoved) return null;

  return (
    <div
      className={`pixel-scan-container ${isExiting ? "is-exiting" : ""}`}
      role="status"
      aria-label="Adspire Preloader"
    >
      {isClient && !webGLAvailable ? (
        <div className="pixel-scan-fallback">
          <Image
            src={textureUrl}
            alt="Adspire"
            width={2172}
            height={724}
            priority
            className="pixel-scan-fallback-image"
          />
        </div>
      ) : (
        isClient && (
          <PixelScanScene
            textureUrl={textureUrl}
            reducedMotion={prefersReducedMotion}
            onComplete={handleSequenceComplete}
            onError={() => setHasWebGLError(true)}
          />
        )
      )}
    </div>
  );
}

export default AdspirePreloader;
