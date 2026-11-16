"use client";

import React, { useEffect, useRef } from "react";
import { PixelScanScene as ThreePixelScanScene } from "@/lib/three/pixelScanScene";
import { createPixelScanTimeline } from "@/lib/animations/pixelScanTimeline";
import gsap from "gsap";

export interface PixelScanSceneProps {
  textureUrl: string;
  reducedMotion?: boolean;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * React Component hosting the Three.js WebGL canvas for the Pixel Scan Reveal.
 * Renders the stationary logo plane at (0, 0, 0) and drives the progressive
 * left-to-right digital pixel scan shader via GSAP.
 */
export function PixelScanScene({
  textureUrl,
  reducedMotion = false,
  onComplete,
  onError,
}: PixelScanSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const sceneRef = useRef<ThreePixelScanScene | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isCancelled = false;

    const sceneInstance = new ThreePixelScanScene({
      container,
      textureUrl,
      onReady: () => {
        if (isCancelled) return;
        const tl = createPixelScanTimeline({
          scene: sceneInstance,
          reducedMotion,
          onComplete,
        });
        timelineRef.current = tl;
        tl.play();
      },
      onError: (err) => {
        if (isCancelled) return;
        onError?.(err);
      },
    });

    sceneRef.current = sceneInstance;

    return () => {
      isCancelled = true;
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, [textureUrl, reducedMotion, onComplete, onError]);

  return (
    <div
      ref={containerRef}
      className="pixel-scan-canvas-wrapper"
      aria-hidden="true"
    />
  );
}

export default PixelScanScene;
