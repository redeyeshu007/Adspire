/**
 * Adspire 3D Environment & Three.js Integration Foundation
 * Centralizes Three.js, React Three Fiber (R3F), Drei, and Post-processing imports.
 * Designed for client-side WebGL execution to prevent server-side rendering errors.
 */

import * as THREE from "three";

// Three.js Core
export { THREE };
export type * from "three";

// React Three Fiber (R3F) Core
export {
  Canvas,
  useFrame,
  useThree,
  extend,
  createPortal,
} from "@react-three/fiber";

export type {
  RootState,
  RenderCallback,
  ThreeElements,
  ThreeEvent,
} from "@react-three/fiber";

// React Three Drei (Reusable 3D Utilities)
export {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
  Environment,
  Lightformer,
  Float,
  Center,
  useGLTF,
  useTexture,
  Preload,
  Html,
  ScrollControls,
  useScroll,
} from "@react-three/drei";

// Post Processing & Cinematic Visual Effects
export {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";

// Preloader 3D Pixel Scan Scene
export * from "./pixelScanScene";


