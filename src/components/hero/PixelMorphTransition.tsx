"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface PixelMorphTransitionRef {
  setProgress: (progress: number) => void;
  updateSourceTexture: () => void;
}

export interface PixelMorphTransitionProps {
  progress?: number;
  sourceCanvas?: HTMLCanvasElement | null;
  pixelSize?: number;
  gridSize?: number;
  gridColor?: string;
  copperColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uProgress;
uniform float uTime;
uniform float uPixelSize;
uniform float uGridSize;
uniform vec3 uGridColor;
uniform vec3 uCopperColor;
uniform sampler2D uSourceTexture;
uniform int uHasTexture;

// Stable deterministic pseudo-random hash functions
float hash1(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash2(vec2 p) {
  return vec2(
    fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123),
    fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453123)
  );
}

// Procedural representation of AcidSquares 3D tile field
vec3 sampleAcidProcedural(vec2 uv, vec2 pos) {
  vec2 tileCoord = pos / 52.0;
  vec2 tileFrac = fract(tileCoord);
  vec2 tileDist = min(tileFrac, 1.0 - tileFrac) * 52.0;
  float tileEdge = smoothstep(1.5, 3.5, min(tileDist.x, tileDist.y));
  
  float wave = sin(uv.x * 5.0 + uv.y * 3.5 + uTime * 0.5) * 0.5 + 0.5;
  float copperGlow = exp(-length(uv - vec2(0.60, 0.45)) * 2.0);
  vec3 copper = mix(vec3(0.03, 0.015, 0.008), uCopperColor * 2.2, copperGlow * wave);
  return mix(vec3(0.008, 0.008, 0.008), copper, tileEdge);
}

// Procedural CursorGrid line pattern
float getCursorGridLine(vec2 pos, float lineWidth) {
  vec2 g = pos / uGridSize;
  vec2 f = fract(g);
  vec2 edge = min(f, 1.0 - f) * uGridSize;
  float d = min(edge.x, edge.y);
  return clamp(lineWidth * 0.5 + 0.5 - d, 0.0, 1.0);
}

void main() {
  vec2 pos = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 uv = gl_FragCoord.xy / uResolution;
  float p = clamp(uProgress, 0.0, 1.0);

  // STAGE 01: p <= 0.001 (Pure AcidSquares)
  if (p <= 0.001) {
    if (uHasTexture == 1) {
      outColor = texture(uSourceTexture, uv);
    } else {
      outColor = vec4(sampleAcidProcedural(uv, pos), 1.0);
    }
    return;
  }

  // STAGE 06: p >= 0.999 (Pure CursorGrid)
  if (p >= 0.999) {
    float lineAlpha = getCursorGridLine(pos, 1.0) * 0.15;
    outColor = vec4(uGridColor * lineAlpha, lineAlpha);
    return;
  }

  // Controlled diagonal wave progression from top-left to bottom-right
  float wave = (uv.x * 0.55 + (1.0 - uv.y) * 0.45);
  float localP = clamp((p - wave * 0.22) / 0.78, 0.0, 1.0);

  // 1. QUANTIZATION / PIXEL ACTIVATION (Stage 2: 0.0 -> 0.25)
  // Transition pixel block size smoothly from 1.0 to uPixelSize
  float actP = smoothstep(0.0, 0.22, localP);
  float pixelSize = mix(1.0, uPixelSize, actP);

  vec2 blockId = floor(pos / pixelSize);
  vec2 blockCenter = (blockId + 0.5) * pixelSize;
  vec2 blockUV = blockCenter / uResolution;

  float h1 = hash1(blockId);
  vec2 h2 = hash2(blockId);

  // 2. PIXEL DISINTEGRATION & CONTROLLED DRIFT (Stage 3: 0.25 -> 0.55)
  float disP = smoothstep(0.20, 0.55, localP);
  
  // Controlled diagonal displacement with subtle radial spread
  vec2 driftAngle = vec2(cos(h1 * 6.28318), sin(h1 * 6.28318));
  vec2 driftOffset = vec2(1.2, -0.6) * 28.0 * disP + driftAngle * 18.0 * (h2.x - 0.5) * disP;

  // Individual block dissolve threshold
  float dissolveTime = h1 * 0.35 + 0.25;
  float blockDissolve = 1.0 - smoothstep(dissolveTime, dissolveTime + 0.30, localP);

  // 3. BLACK SURFACE EMERGENCE & GRID ALIGNMENT (Stage 4: 0.55 -> 0.80)
  float alignP = smoothstep(0.50, 0.82, localP);
  
  // Snap surviving pixels to nearest 60px grid intersections & lines
  vec2 targetGridSnap = round((blockCenter + driftOffset) / uGridSize) * uGridSize;
  vec2 gridLocal = fract((blockCenter + driftOffset) / uGridSize) * uGridSize;
  vec2 snapToLine = (blockCenter + driftOffset);
  if (gridLocal.x < gridLocal.y) {
    snapToLine.x = round((blockCenter.x + driftOffset.x) / uGridSize) * uGridSize;
  } else {
    snapToLine.y = round((blockCenter.y + driftOffset.y) / uGridSize) * uGridSize;
  }
  vec2 targetPos = mix(snapToLine, targetGridSnap, 0.5);

  // Reconstructed position morphing from disintegrated position into grid structure
  vec2 finalBlockPos = mix(blockCenter + driftOffset, targetPos, alignP);
  vec2 finalSampleUV = clamp(finalBlockPos / uResolution, 0.0, 1.0);

  // Sample background color at final sample UV
  vec3 acidColor;
  if (uHasTexture == 1) {
    acidColor = texture(uSourceTexture, finalSampleUV).rgb;
  } else {
    acidColor = sampleAcidProcedural(finalSampleUV, finalBlockPos);
  }

  // Pixel shape & clean square cell borders
  vec2 cellFrac = fract(pos / pixelSize);
  float cellBorder = step(0.06, cellFrac.x) * step(0.06, cellFrac.y) * 
                     step(cellFrac.x, 0.94) * step(cellFrac.y, 0.94);

  // Dim orange lighting as pixels dissolve
  float orangeFade = 1.0 - smoothstep(0.35, 0.85, localP);
  vec3 pixelColor = mix(uGridColor * 1.5, acidColor, orangeFade);
  float pixelAlpha = blockDissolve * cellBorder;

  // 4. CURSORGRID RECONSTRUCTION (Stage 5: 0.80 -> 0.95)
  float gridEmergence = smoothstep(0.55, 0.92, localP);
  float gridLine = getCursorGridLine(pos, mix(2.5, 1.0, smoothstep(0.75, 0.98, localP)));
  float gridAlpha = gridLine * 0.15 * gridEmergence;

  // Reconstructed pixels settling on grid lines emit a subtle amber glint
  float snapGlint = alignP * (1.0 - smoothstep(0.80, 0.95, localP)) * 0.6;
  vec3 glintColor = mix(pixelColor, uGridColor * 2.5, snapGlint);

  // Final composite over pure black #000000 background
  vec3 finalColor = mix(glintColor, uGridColor, gridEmergence);
  float finalAlpha = clamp(pixelAlpha + gridAlpha, 0.0, 1.0);

  outColor = vec4(finalColor * finalAlpha, finalAlpha);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [1, 1, 1];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export const PixelMorphTransition = forwardRef<PixelMorphTransitionRef, PixelMorphTransitionProps>(
  (
    {
      progress = 0,
      sourceCanvas,
      pixelSize = 10,
      gridSize = 60,
      gridColor = "#48250f",
      copperColor = "#671702",
      className = "",
      style,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const textureRef = useRef<WebGLTexture | null>(null);
    const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
    const progressRef = useRef(progress);
    const sourceCanvasRef = useRef(sourceCanvas);
    sourceCanvasRef.current = sourceCanvas;
    progressRef.current = progress;

    const renderRef = useRef<() => void>(() => {});

    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        progressRef.current = p;
        renderRef.current();
      },
      updateSourceTexture: () => {
        const gl = glRef.current;
        const texture = textureRef.current;
        const source = sourceCanvasRef.current;
        if (!gl || !texture || !source || source.width === 0 || source.height === 0) return;

        try {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
          const u = uniformsRef.current;
          if (u.uHasTexture) gl.uniform1i(u.uHasTexture, 1);
          renderRef.current();
        } catch {
          // Cross-origin or readback protection; fallback to procedural rendering
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext("webgl2", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
      });
      if (!gl) return;
      glRef.current = gl;

      // Compile Shader
      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, VERTEX_SHADER);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, FRAGMENT_SHADER);
      gl.compileShader(fs);

      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("PixelMorphTransition shader link error:", gl.getProgramInfoLog(program));
        return;
      }
      programRef.current = program;
      gl.useProgram(program);

      // Locate uniforms
      uniformsRef.current = {
        uResolution: gl.getUniformLocation(program, "uResolution"),
        uProgress: gl.getUniformLocation(program, "uProgress"),
        uTime: gl.getUniformLocation(program, "uTime"),
        uPixelSize: gl.getUniformLocation(program, "uPixelSize"),
        uGridSize: gl.getUniformLocation(program, "uGridSize"),
        uGridColor: gl.getUniformLocation(program, "uGridColor"),
        uCopperColor: gl.getUniformLocation(program, "uCopperColor"),
        uSourceTexture: gl.getUniformLocation(program, "uSourceTexture"),
        uHasTexture: gl.getUniformLocation(program, "uHasTexture"),
      };

      // Fullscreen Quad Buffer
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      const posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

      const aPos = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Create WebGL Texture
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      textureRef.current = texture;

      // 1x1 black fallback pixel
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 255])
      );

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.round(canvas.clientWidth * dpr);
        const h = Math.round(canvas.clientHeight * dpr);
        if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
      };

      const startTime = performance.now();
      const render = () => {
        if (!gl || !program) return;
        resize();

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        const u = uniformsRef.current;
        const now = (performance.now() - startTime) / 1000;

        gl.uniform2f(u.uResolution, canvas.width, canvas.height);
        gl.uniform1f(u.uProgress, progressRef.current);
        gl.uniform1f(u.uTime, now);
        gl.uniform1f(u.uPixelSize, pixelSize * (window.innerWidth < 768 ? 1.4 : 1.0));
        gl.uniform1f(u.uGridSize, gridSize);

        const gRgb = hexToRgb(gridColor);
        gl.uniform3f(u.uGridColor, gRgb[0], gRgb[1], gRgb[2]);

        const cRgb = hexToRgb(copperColor);
        gl.uniform3f(u.uCopperColor, cRgb[0], cRgb[1], cRgb[2]);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
        gl.uniform1i(u.uSourceTexture, 0);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
      };

      renderRef.current = render;
      window.addEventListener("resize", render);
      render();

      return () => {
        window.removeEventListener("resize", resize);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteTexture(texture);
        gl.deleteBuffer(posBuffer);
        gl.deleteVertexArray(vao);
      };
    }, [gridColor, copperColor, pixelSize, gridSize]);

    return (
      <div className={`w-full h-full relative overflow-hidden ${className}`} style={style}>
        <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
      </div>
    );
  }
);

PixelMorphTransition.displayName = "PixelMorphTransition";
export default PixelMorphTransition;
