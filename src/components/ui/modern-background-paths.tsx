"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

// Geometric Grid Paths (Deterministic to guarantee zero hydration mismatch)
function GeometricPaths() {
  const gridSize = 40;
  const paths = useMemo(() => {
    const list: Array<{ id: string; d: string; delay: number }> = [];
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 12; y++) {
        // Deterministic pseudo-random distribution
        if (((x * 7 + y * 13) % 10) > 5) {
          list.push({
            id: `grid-${x}-${y}`,
            d: `M${x * gridSize},${y * gridSize} L${(x + 1) * gridSize},${y * gridSize} L${(x + 1) * gridSize},${(y + 1) * gridSize} L${x * gridSize},${(y + 1) * gridSize} Z`,
            delay: ((x * 3 + y * 5) % 50) / 10,
          });
        }
      }
    }
    return list;
  }, [gridSize]);

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40 text-[#EE4530]"
      viewBox="0 0 800 480"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.9, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 8,
            delay: path.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

// Organic Flow Paths
function FlowPaths() {
  const flowPaths = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const amplitude = 50 + i * 12;
      const offset = i * 55;

      return {
        id: `flow-${i}`,
        d: `M-100,${180 + offset} Q200,${180 + offset - amplitude} 500,${180 + offset} T900,${180 + offset}`,
        strokeWidth: 1.2 + i * 0.4,
        opacity: 0.2 + i * 0.06,
        delay: i * 0.7,
      };
    });
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-50 text-[#EE4530]"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
    >
      {flowPaths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={path.strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 0.85, 0],
            opacity: [0, path.opacity, path.opacity * 0.9, 0],
          }}
          transition={{
            duration: 13,
            delay: path.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

// Neural Network Paths (Deterministic nodes and connections for stable SSR)
function NeuralPaths() {
  const { nodes, connections } = useMemo(() => {
    const nodeCount = 55;
    const nList: Array<{ id: string; x: number; y: number }> = [];

    // Deterministic golden-ratio distribution
    for (let i = 0; i < nodeCount; i++) {
      const x = ((i * 137.5) % 760) + 20;
      const y = ((i * 223.7 + (i % 5) * 40) % 560) + 20;
      nList.push({ id: `node-${i}`, x, y });
    }

    const cList: Array<{ id: string; d: string; delay: number }> = [];
    nList.forEach((node, i) => {
      nList.forEach((other, j) => {
        if (i >= j) return;
        const dist = Math.sqrt(
          Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
        );
        if (dist < 150 && ((i * 3 + j * 7) % 10 > 2)) {
          cList.push({
            id: `conn-${i}-${j}`,
            d: `M${node.x},${node.y} L${other.x},${other.y}`,
            delay: ((i + j) % 20) * 0.35,
          });
        }
      });
    });

    return { nodes: nList, connections: cList };
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-45 text-[#EE4530]"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {connections.map((conn) => (
        <motion.path
          key={conn.id}
          d={conn.d}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: 6,
            delay: conn.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {nodes.map((node) => (
        <motion.circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r="3"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.4, 1],
            opacity: [0, 0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

// Spiral Paths
function SpiralPaths() {
  const spirals = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const centerX = 400 + ((i % 4) - 1.5) * 200;
      const centerY = 300 + Math.floor(i / 4 - 0.5) * 200;
      const radius = 80 + i * 16;
      const turns = 3 + i * 0.5;

      let path = `M${centerX + radius},${centerY}`;
      for (let angle = 0; angle <= turns * 360; angle += 6) {
        const radian = (angle * Math.PI) / 180;
        const currentRadius = radius * (1 - angle / (turns * 360));
        const x = centerX + currentRadius * Math.cos(radian);
        const y = centerY + currentRadius * Math.sin(radian);
        path += ` L${x.toFixed(1)},${y.toFixed(1)}`;
      }

      return {
        id: `spiral-${i}`,
        d: path,
        delay: i * 1.2,
      };
    });
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-45 text-[#EE4530]"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {spirals.map((spiral) => (
        <motion.path
          key={spiral.id}
          d={spiral.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            pathLength: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 24, repeat: Infinity, ease: "linear" },
            delay: spiral.delay,
          }}
        />
      ))}
    </svg>
  );
}

export interface ModernBackgroundPathsProps {
  title?: string;
  badge?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ModernBackgroundPaths({
  title = "ARCHITECTING DIGITAL ASCENT",
  badge = "ADDSPIRE MEDIA // GROWTH OPERATING SYSTEM",
  subtitle = "Engineering high-velocity brand narratives, algorithmic acquisition systems, and next-generation creative intelligence for iconic enterprises.",
  ctaText = "Explore Capabilities",
  ctaHref = "#services",
}: ModernBackgroundPathsProps) {
  const { scrollTo } = useSmoothScroll();
  const [currentPattern, setCurrentPattern] = useState(0);
  const patterns = ["neural", "flow", "geometric", "spiral"];
  const words = title.split(" ");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPattern((prev) => (prev + 1) % patterns.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [patterns.length]);

  const renderPattern = () => {
    switch (currentPattern) {
      case 0:
        return <NeuralPaths />;
      case 1:
        return <FlowPaths />;
      case 2:
        return <GeometricPaths />;
      case 3:
        return <SpiralPaths />;
      default:
        return <NeuralPaths />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#000000] text-white select-none">
      {/* Ambient Radial Flame Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(238, 69, 48, 0.12) 0%, rgba(255, 98, 71, 0.04) 45%, rgba(0, 0, 0, 0.95) 75%, #000000 100%)",
        }}
      />

      {/* Dynamic Background Patterns (Themed to Adspire Flame Vermilion) */}
      <div className="absolute inset-0 text-[#EE4530] pointer-events-none">
        <motion.div
          key={currentPattern}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8 }}
          className="w-full h-full"
        >
          {renderPattern()}
        </motion.div>
      </div>

      {/* Subtle Top & Bottom Fade Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/70" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/60" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center pt-20 sm:pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Main Title with Spring Letter-by-Letter Typography */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter leading-[0.95] flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block whitespace-nowrap"
                >
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 90, opacity: 0, rotateX: -90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      transition={{
                        delay: wordIndex * 0.12 + letterIndex * 0.035,
                        type: "spring",
                        stiffness: 110,
                        damping: 18,
                        duration: 0.85,
                      }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-100 to-[#FFA293] hover:from-[#EE4530] hover:via-[#FF6247] hover:to-white transition-all duration-500 cursor-default"
                      whileHover={{ scale: 1.08, y: -3 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.9 }}
              className="text-base sm:text-lg md:text-xl text-neutral-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed mt-4"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* CTA Button in Adspire Flame Vermilion Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.1,
              duration: 0.7,
              type: "spring",
              stiffness: 120,
            }}
            className="inline-block group mt-2"
          >
            <div className="relative p-[1.5px] bg-gradient-to-r from-[#EE4530] via-[#FF6247] to-[#FFA293] rounded-2xl group-hover:from-[#FF6247] group-hover:via-[#FFA293] group-hover:to-[#EE4530] transition-all duration-500 shadow-[0_0_25px_rgba(238,69,48,0.35)] group-hover:shadow-[0_0_40px_rgba(238,69,48,0.6)]">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  if (scrollTo) {
                    scrollTo(ctaHref, { offset: -50, duration: 1.3 });
                  } else {
                    const target = document.querySelector(ctaHref);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="relative rounded-[14.5px] px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg font-semibold bg-black/90 hover:bg-black/70 text-white transition-all duration-300 group-hover:-translate-y-0.5 border-0 backdrop-blur-md cursor-pointer"
              >
                <motion.span
                  className="flex items-center gap-3 text-white"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative">
                    {ctaText}
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#EE4530] to-[#FFA293] group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                  </span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-xl text-[#FF6247]"
                  >
                    →
                  </motion.span>
                </motion.span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Atmospheric Ambient Flame Floating Halos */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#EE4530]/15 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FF6247]/15 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 25, 0],
          x: [0, -25, 0],
          scale: [1, 0.9, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
}

export { ModernBackgroundPaths as BackgroundPaths, ModernBackgroundPaths as EnhancedBackgroundPaths };
