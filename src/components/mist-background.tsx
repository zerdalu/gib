import { useEffect, useRef, type ReactElement } from "react";

type RgbTuple = readonly [number, number, number];

interface ShaderThemeColors {
  readonly canvas: RgbTuple;
  readonly highlight: RgbTuple;
  readonly mist: RgbTuple;
  readonly ink: RgbTuple;
  readonly accent: RgbTuple;
}

interface ShaderUniformLocations {
  readonly resolution: WebGLUniformLocation | null;
  readonly time: WebGLUniformLocation | null;
  readonly canvas: WebGLUniformLocation | null;
  readonly highlight: WebGLUniformLocation | null;
  readonly mist: WebGLUniformLocation | null;
  readonly ink: WebGLUniformLocation | null;
  readonly accent: WebGLUniformLocation | null;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_canvas;
uniform vec3 u_highlight;
uniform vec3 u_mist;
uniform vec3 u_ink;
uniform vec3 u_accent;

varying vec2 v_uv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);

  for (int i = 0; i < 4; i++) {
    value += amplitude * valueNoise(p);
    p = rot * p * 2.03 + vec2(17.1, 31.7);
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 p = (v_uv - 0.5) * aspect;

  float t = u_time * 0.045;

  vec2 q = vec2(
    fbm(p * 1.45 + vec2(t * 0.7, -t * 0.25)),
    fbm(p * 1.45 + vec2(5.2 - t * 0.4, 1.3 + t * 0.35))
  );

  vec2 r = vec2(
    fbm(p * 1.9 + 1.1 * q + vec2(1.7 + t * 0.3, 9.2)),
    fbm(p * 1.9 + 1.1 * q + vec2(8.3, 2.8 - t * 0.25))
  );

  float mistField = fbm(p * 1.65 + 0.85 * r + vec2(t * 0.2, 0.0));

  float ridgeNoise = fbm(vec2(p.x * 1.35 + 2.4, 0.8));
  float ridgeY = 0.22 + 0.14 * (ridgeNoise - 0.5) - 0.08 * abs(p.x);
  float ridgeMask = smoothstep(ridgeY - 0.18, ridgeY + 0.12, p.y);

  float centerGlow = smoothstep(0.95, 0.05, length(p * vec2(0.75, 1.05) + vec2(0.0, 0.06)));
  float topMist = smoothstep(0.15, 0.55, p.y);

  vec3 color = mix(u_canvas, u_highlight, centerGlow * 0.65);
  color = mix(color, u_mist, clamp(mistField * 0.75 + topMist * 0.35, 0.0, 1.0));
  color = mix(color, u_ink, ridgeMask * (0.28 + 0.14 * mistField));

  float goldDrift = fbm(p * 2.4 + vec2(-t * 0.9, t * 0.55) + 0.5 * q);
  float goldMask = smoothstep(0.62, 0.92, goldDrift) * smoothstep(0.55, -0.35, p.y);
  color = mix(color, u_accent, goldMask * 0.085);

  float grain = (hash21(gl_FragCoord.xy) - 0.5) * 0.012;
  color = clamp(color + grain, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

const FALLBACK_COLORS: ShaderThemeColors = {
  canvas: [0.96, 0.957, 0.941],
  highlight: [0.988, 0.984, 0.973],
  mist: [0.894, 0.89, 0.867],
  ink: [0.784, 0.78, 0.753],
  accent: [0.875, 0.702, 0.149],
};

const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("WebGL shader compilation failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) {
      gl.deleteShader(vertexShader);
    }
    if (fragmentShader) {
      gl.deleteShader(fragmentShader);
    }
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("WebGL program link failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createProbeContext(): CanvasRenderingContext2D | null {
  const probeCanvas = document.createElement("canvas");
  probeCanvas.width = 1;
  probeCanvas.height = 1;
  return probeCanvas.getContext("2d", { willReadFrequently: true });
}

function readCssRgb(probeCtx: CanvasRenderingContext2D, varName: string, fallback: RgbTuple): RgbTuple {
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!rawValue) {
    return fallback;
  }

  probeCtx.fillStyle = "#010203";
  probeCtx.fillStyle = rawValue;
  if (probeCtx.fillStyle === "#010203") {
    return fallback;
  }

  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillRect(0, 0, 1, 1);
  const pixel = probeCtx.getImageData(0, 0, 1, 1).data;
  if (pixel.length < 3) {
    return fallback;
  }

  return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255];
}

function readThemeColors(probeCtx: CanvasRenderingContext2D | null): ShaderThemeColors {
  if (!probeCtx) {
    return FALLBACK_COLORS;
  }

  return {
    canvas: readCssRgb(probeCtx, "--color-surface-canvas", FALLBACK_COLORS.canvas),
    highlight: readCssRgb(probeCtx, "--color-surface-100", FALLBACK_COLORS.highlight),
    mist: readCssRgb(probeCtx, "--color-surface-sunken", FALLBACK_COLORS.mist),
    ink: readCssRgb(probeCtx, "--color-border-subtle", FALLBACK_COLORS.ink),
    accent: readCssRgb(probeCtx, "--color-accent-secondary", FALLBACK_COLORS.accent),
  };
}

function setUniformVec3(gl: WebGLRenderingContext, location: WebGLUniformLocation | null, rgb: RgbTuple): void {
  if (location) {
    gl.uniform3f(location, rgb[0], rgb[1], rgb[2]);
  }
}

export function MistBackground(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const probeCtx = createProbeContext();
    let colors = readThemeColors(probeCtx);

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;
    let uniforms: ShaderUniformLocations = {
      resolution: null,
      time: null,
      canvas: null,
      highlight: null,
      mist: null,
      ink: null,
      accent: null,
    };

    let animationFrameId = 0;
    let elapsedSeconds = 0;
    let lastTimestamp = 0;
    let isContextLost = false;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const disposeWebGl = (): void => {
      if (!gl) {
        return;
      }
      if (positionBuffer) {
        gl.deleteBuffer(positionBuffer);
        positionBuffer = null;
      }
      if (program) {
        gl.deleteProgram(program);
        program = null;
      }
    };

    const resizeCanvas = (): void => {
      if (!gl || isContextLost) {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const drawFrame = (timeSeconds: number): void => {
      if (!gl || !program || isContextLost) {
        return;
      }

      gl.useProgram(program);

      if (uniforms.resolution) {
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      }
      if (uniforms.time) {
        gl.uniform1f(uniforms.time, timeSeconds);
      }

      setUniformVec3(gl, uniforms.canvas, colors.canvas);
      setUniformVec3(gl, uniforms.highlight, colors.highlight);
      setUniformVec3(gl, uniforms.mist, colors.mist);
      setUniformVec3(gl, uniforms.ink, colors.ink);
      setUniformVec3(gl, uniforms.accent, colors.accent);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const initWebGl = (): boolean => {
      const context = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (!context) {
        return false;
      }

      gl = context;
      program = createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
      if (!program) {
        gl = null;
        return false;
      }

      const positionLocation = gl.getAttribLocation(program, "a_position");
      if (positionLocation < 0) {
        disposeWebGl();
        gl = null;
        return false;
      }

      positionBuffer = gl.createBuffer();
      if (!positionBuffer) {
        disposeWebGl();
        gl = null;
        return false;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      uniforms = {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        canvas: gl.getUniformLocation(program, "u_canvas"),
        highlight: gl.getUniformLocation(program, "u_highlight"),
        mist: gl.getUniformLocation(program, "u_mist"),
        ink: gl.getUniformLocation(program, "u_ink"),
        accent: gl.getUniformLocation(program, "u_accent"),
      };

      resizeCanvas();
      return true;
    };

    const stopLoop = (): void => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      lastTimestamp = 0;
    };

    const renderTick = (timestamp: number): void => {
      if (isContextLost || document.hidden || reducedMotionQuery.matches) {
        animationFrameId = 0;
        lastTimestamp = 0;
        return;
      }

      if (lastTimestamp !== 0) {
        const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
        elapsedSeconds += deltaSeconds;
      }
      lastTimestamp = timestamp;

      drawFrame(elapsedSeconds);
      animationFrameId = window.requestAnimationFrame(renderTick);
    };

    const startOrRenderStatic = (): void => {
      if (isContextLost || !gl) {
        return;
      }
      if (reducedMotionQuery.matches) {
        stopLoop();
        drawFrame(elapsedSeconds);
        return;
      }
      if (!document.hidden && animationFrameId === 0) {
        lastTimestamp = 0;
        animationFrameId = window.requestAnimationFrame(renderTick);
      }
    };

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        stopLoop();
      } else {
        startOrRenderStatic();
      }
    };

    const handleReducedMotionChange = (): void => {
      startOrRenderStatic();
    };

    const handleContextLost = (event: Event): void => {
      event.preventDefault();
      isContextLost = true;
      stopLoop();
      disposeWebGl();
    };

    const handleContextRestored = (): void => {
      isContextLost = false;
      if (initWebGl()) {
        startOrRenderStatic();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      if (reducedMotionQuery.matches) {
        drawFrame(elapsedSeconds);
      }
    });

    const themeObserver = new MutationObserver(() => {
      colors = readThemeColors(probeCtx);
      drawFrame(elapsedSeconds);
    });

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    if (initWebGl()) {
      startOrRenderStatic();
    }

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      disposeWebGl();
      gl = null;
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
