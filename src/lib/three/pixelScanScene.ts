import * as THREE from "three";

export const LOGO_ASPECT_RATIO = 3.0; // 2172 / 724 = 3.0 exact

export interface PixelScanSceneConfig {
  container: HTMLElement;
  textureUrl: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D u_texture;
uniform float u_progress;         // 0.0 to 1.0 (scan progress across logo)
uniform vec2 u_gridSize;          // Number of pixel cells (cols, rows)
uniform float u_rowJitter;        // Jitter magnitude across rows
uniform float u_cellJitter;       // Jitter magnitude per cell
uniform float u_edgeSoftness;     // Softness of scan threshold
uniform float u_resolveDistance;  // Distance behind scan edge where grid resolves
uniform float u_finalResolve;     // 0.0 during scan, blends to 1.0 at completion
uniform float u_scanLeadingEdge;  // Subtle highlight on the scanning front

varying vec2 vUv;

// Deterministic pseudo-random hash functions
float hash1(float n) {
  return fract(sin(n * 12.9898 + 78.233) * 43758.5453123);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec4 originalColor = texture2D(u_texture, vUv);

  // If source texel is transparent, discard early
  if (originalColor.a < 0.005) {
    discard;
  }

  // Quantize UV to discrete pixel cells
  vec2 cellIndex = floor(vUv * u_gridSize);
  vec2 cellUv = (cellIndex + 0.5) / u_gridSize;

  // Normalized horizontal position of this cell [0.0, 1.0]
  float cellX = cellIndex.x / max(u_gridSize.x - 1.0, 1.0);
  float rowY = cellIndex.y;

  // Row-by-row variation + slight individual cell jitter
  float rowNoise = (hash1(rowY * 19.37 + 4.1415) - 0.5) * 2.0; // [-1.0, 1.0]
  float cellNoise = (hash2(cellIndex * 6.43) - 0.5) * 2.0;     // [-1.0, 1.0]
  float totalJitter = rowNoise * u_rowJitter + cellNoise * u_cellJitter;

  // Progressive scan threshold sweeping from left to right with margin
  float margin = u_rowJitter + u_cellJitter + 0.06;
  float scanX = -margin + u_progress * (1.0 + margin * 2.0);

  // Distance of this cell from the current scan front
  float scanDist = scanX - (cellX + totalJitter);

  // Reveal factor for this cell
  float reveal = smoothstep(-u_edgeSoftness, u_edgeSoftness, scanDist);

  // If not revealed at all and not in final resolve, discard
  if (reveal <= 0.001 && u_finalResolve <= 0.0) {
    discard;
  }

  // Sample discrete pixelated color during active scan zone
  vec4 pixelatedColor = texture2D(u_texture, cellUv);

  // Blend from pixelated cell to full-resolution original PNG as scan advances past it
  float resolveFactor = clamp(scanDist / max(u_resolveDistance, 0.001), 0.0, 1.0);
  resolveFactor = max(resolveFactor, u_finalResolve);

  vec4 activeColor = mix(pixelatedColor, originalColor, resolveFactor);

  // Subtle leading scan edge highlight
  float edgeBand = smoothstep(0.0, 0.035, scanDist) * (1.0 - smoothstep(0.035, 0.10, scanDist));
  float edgeHighlight = edgeBand * u_scanLeadingEdge * (1.0 - u_finalResolve);

  vec3 finalRgb = activeColor.rgb + vec3(edgeHighlight);
  float finalAlpha = activeColor.a * reveal;

  // As final resolve completes, strictly guarantee 100% original pixel quality
  if (u_finalResolve >= 0.999) {
    finalRgb = originalColor.rgb;
    finalAlpha = originalColor.a;
  }

  gl_FragColor = vec4(finalRgb, finalAlpha);
}
`;

/**
 * Three.js Scene Controller for the Adspire Pixel Scan Reveal Preloader.
 *
 * ARCHITECTURAL CONSTRAINTS:
 * 1. The logo plane is 100% stationary at (0, 0, 0) with rotation (0, 0, 0) and scale (1, 1, 1).
 *    Its matrix is frozen (matrixAutoUpdate = false). It never rotates, tilts, or moves.
 * 2. Orthographic 2D projection ensures 1 world unit = 1 screen pixel with zero perspective distortion.
 * 3. The progressive pixel scan is driven by a custom GLSL shader controlled by GSAP.
 * 4. The scan resolves smoothly into the razor-sharp original PNG at full quality.
 */
export class PixelScanScene {
  private container: HTMLElement;
  private textureUrl: string;
  private onReady?: () => void;
  private onError?: (error: Error) => void;

  public scene: THREE.Scene;
  public camera: THREE.OrthographicCamera;
  public renderer: THREE.WebGLRenderer | null = null;
  public texture: THREE.Texture | null = null;
  public geometry: THREE.PlaneGeometry | null = null;
  public material: THREE.ShaderMaterial | null = null;
  public mesh: THREE.Mesh | null = null;

  // Animation state driven by GSAP
  public scanState = {
    progress: 0.0,      // Scan sweep across the logo (0.0 = hidden, 1.0 = fully swept)
    finalResolve: 0.0,  // Resolves pixel grid into sharp original PNG (0.0 = grid, 1.0 = sharp)
  };

  private animationFrameId: number | null = null;
  private isRendering = false;
  private isDisposed = false;
  private resizeObserver: ResizeObserver | null = null;

  public baseWidth = 540;
  public baseHeight = 180;
  public cellSize = 4.0; // CSS pixels per cell

  constructor(config: PixelScanSceneConfig) {
    this.container = config.container;
    this.textureUrl = config.textureUrl;
    this.onReady = config.onReady;
    this.onError = config.onError;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.position.set(0, 0, 0);
    this.scene.rotation.set(0, 0, 0);
    this.scene.scale.set(1, 1, 1);
    this.scene.matrixAutoUpdate = false;
    this.scene.updateMatrix();

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1:1 Orthographic camera
    this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    this.updateDimensions(width);
    this.init();
  }

  private init(): void {
    try {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0x000000, 1.0);

      const canvas = renderer.domElement;
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.pointerEvents = "none";

      this.container.appendChild(canvas);
      this.renderer = renderer;

      // Load original PNG texture with sRGB color space and anisotropic filtering
      const loader = new THREE.TextureLoader();
      loader.load(
        this.textureUrl,
        (tex) => {
          if (this.isDisposed) {
            tex.dispose();
            return;
          }
          this.texture = tex;
          this.texture.colorSpace = THREE.SRGBColorSpace;
          this.texture.generateMipmaps = true;
          this.texture.minFilter = THREE.LinearMipmapLinearFilter;
          this.texture.magFilter = THREE.LinearFilter;

          if (this.renderer) {
            tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
          }
          this.texture.needsUpdate = true;

          this.setupMesh();
          this.startRenderLoop();
          this.setupResizeHandler();

          if (this.onReady) {
            this.onReady();
          }
        },
        undefined,
        (err) => {
          console.error("Error loading logo texture:", err);
          if (this.onError) {
            this.onError(new Error("Failed to load logo.png texture"));
          }
        }
      );
    } catch (err) {
      console.error("WebGL initialization error:", err);
      if (this.onError) {
        this.onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }

  private updateDimensions(width: number): void {
    const isMobile = width < 768;
    const targetWidth = isMobile
      ? Math.min(width * 0.78, 420)
      : Math.min(width * 0.44, 560);

    this.baseWidth = Math.max(targetWidth, 240);
    this.baseHeight = this.baseWidth / LOGO_ASPECT_RATIO;
    // 3.5px on mobile, 4.5px on desktop for a fine, crisp digital pixel grid
    this.cellSize = isMobile ? 3.5 : 4.5;
  }

  private getGridSize(): THREE.Vector2 {
    const cols = Math.max(Math.round(this.baseWidth / this.cellSize), 40);
    const rows = Math.max(Math.round(this.baseHeight / this.cellSize), 14);
    return new THREE.Vector2(cols, rows);
  }

  private setupMesh(): void {
    if (!this.texture) return;

    this.geometry = new THREE.PlaneGeometry(this.baseWidth, this.baseHeight, 1, 1);
    const gridSize = this.getGridSize();

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_texture: { value: this.texture },
        u_progress: { value: this.scanState.progress },
        u_gridSize: { value: gridSize },
        u_rowJitter: { value: 0.035 },
        u_cellJitter: { value: 0.014 },
        u_edgeSoftness: { value: 0.015 },
        u_resolveDistance: { value: 0.18 },
        u_finalResolve: { value: this.scanState.finalResolve },
        u_scanLeadingEdge: { value: 0.12 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // Explicitly stationary at world origin
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.scale.set(1, 1, 1);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();

    this.scene.add(this.mesh);
  }

  public handleResize(): void {
    if (!this.renderer || !this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.updateDimensions(width);

    if (this.geometry && this.mesh) {
      this.geometry.dispose();
      this.geometry = new THREE.PlaneGeometry(this.baseWidth, this.baseHeight, 1, 1);
      this.mesh.geometry = this.geometry;
      this.mesh.position.set(0, 0, 0);
      this.mesh.rotation.set(0, 0, 0);
      this.mesh.scale.set(1, 1, 1);
      this.mesh.updateMatrix();
    }

    if (this.material) {
      this.material.uniforms.u_gridSize.value = this.getGridSize();
    }

    this.render();
  }

  private setupResizeHandler(): void {
    if (typeof window === "undefined") return;

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener("resize", () => this.handleResize());
    }
  }

  private startRenderLoop(): void {
    if (this.isRendering) return;
    this.isRendering = true;

    const loop = () => {
      if (this.isDisposed) return;
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public render(): void {
    if (!this.renderer || this.isDisposed) return;

    if (this.material) {
      this.material.uniforms.u_progress.value = this.scanState.progress;
      this.material.uniforms.u_finalResolve.value = this.scanState.finalResolve;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Freezes the animation loop upon completion, setting finalResolve to 1.0
   * to guarantee the original sharp PNG at full quality with zero pixel artifacts.
   */
  public freezeFinalFrame(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isRendering = false;

    this.scanState.progress = 1.0;
    this.scanState.finalResolve = 1.0;

    if (this.material) {
      this.material.uniforms.u_progress.value = 1.0;
      this.material.uniforms.u_finalResolve.value = 1.0;
    }

    this.render();
  }

  public dispose(): void {
    this.isDisposed = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh = null;
    }

    if (this.material) {
      this.material.dispose();
      this.material = null;
    }

    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }

    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
  }
}
