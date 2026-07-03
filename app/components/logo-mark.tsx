"use client";

import { useEffect, useId, useRef, useState } from "react";

/* The mark: a specimen case. A wireframe cube — hidden edges dotted — holding
   a soft-bodied cell grown from a seed. Every mount grows a new one; no two
   visits meet the same cell. Raw WebGL2 on a transparent canvas: the lines
   take the inherited text color, so the mark reads the room it hangs in.
   Falls back to a still drawing when WebGL is not available.

   Tuning props let the lab hold a specimen still, turn the case, resize the
   cell, shift its palette, and export the current frame as a PNG. */

const POOL = ["#c23b2a", "#de5397", "#d9a23b", "#3467c4", "#58a09a", "#7b5ea7", "#8d9a72"];

const VERT = `#version 300 es
void main() {
  vec2 v = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_seed;
uniform float u_size;
uniform vec3 u_cellA;
uniform vec3 u_cellB;
uniform vec3 u_cellC;
uniform vec3 u_line;

out vec4 outColor;

const float CAM = 3.6;
const float FOCAL = 2.2;
const float H = 0.75;
const float VIEW = 0.98;
const float TAU = 6.28318530718;
const int STEPS = 26;

const ivec2 EDGES[12] = ivec2[12](
  ivec2(0, 1), ivec2(0, 2), ivec2(0, 4), ivec2(1, 3),
  ivec2(1, 5), ivec2(2, 3), ivec2(2, 6), ivec2(3, 7),
  ivec2(4, 5), ivec2(4, 6), ivec2(5, 7), ivec2(6, 7));

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

mat3 rotX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

mat3 rotY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotZ(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
}

/* Paint premultiplied src over premultiplied dst. */
vec4 over(vec4 dst, vec4 src) {
  return src + dst * (1.0 - src.a);
}

float segment(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 ab = b - a;
  t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  float mn = min(u_res.x, u_res.y);
  vec2 uv = (2.0 * gl_FragCoord.xy - u_res) / mn * VIEW;
  float px = 2.0 * VIEW / mn;

  /* Seeded slow tumble. */
  float drift = u_time * 0.16;
  mat3 M = rotY(drift * 0.9 + hash1(u_seed * 3.1) * TAU)
    * rotX(drift * 0.62 + hash1(u_seed * 5.7) * TAU)
    * rotZ(sin(drift * 0.45 + hash1(u_seed * 9.3) * TAU) * 0.4);

  /* Rays into cube-local space (M is orthonormal; v * M applies the inverse). */
  vec3 ro = M * vec3(0.0, 0.0, -CAM);
  vec3 rd = M * normalize(vec3(uv, FOCAL));

  /* The cell: a membrane and two organelles on seeded, incommensurate orbits. */
  float bt = u_time * 0.5;
  float pA = hash1(u_seed * 12.9) * TAU;
  float pB = hash1(u_seed * 23.3) * TAU;
  float pC = hash1(u_seed * 31.7) * TAU;
  vec3 cm = 0.12 * H * vec3(sin(bt * 0.42 + pA), sin(bt * 0.31 + pB), cos(bt * 0.37 + pC));
  float rm = H * (0.72 + 0.05 * sin(bt * 0.6 + pA)) * u_size;
  vec3 c1 = cm + rm * 0.5 * vec3(sin(bt * 0.53 + pB), cos(bt * 0.47 + pC), sin(bt * 0.5 + pA));
  float r1 = rm * 0.5;
  vec3 c2 = cm + rm * 0.55 * vec3(cos(bt * 0.44 + pC), sin(bt * 0.56 + pA), cos(bt * 0.49 + pB));
  float r2 = rm * 0.34;

  /* March the interior between the entry and exit faces of the case. */
  vec3 sgn = step(vec3(0.0), rd) * 2.0 - 1.0;
  vec3 inv = 1.0 / (sgn * max(abs(rd), vec3(1e-5)));
  vec3 nn = inv * ro;
  vec3 kk = abs(inv) * H;
  vec3 tlo = -nn - kk;
  vec3 thi = -nn + kk;
  float tNear = max(max(tlo.x, tlo.y), tlo.z);
  float tFar = min(min(thi.x, thi.y), thi.z);

  vec4 orb = vec4(0.0);
  if (tNear < tFar) {
    float dt = (tFar - tNear) / float(STEPS);
    float tRay = tNear + dt * hash2(gl_FragCoord.xy + u_seed * 100.0);
    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * tRay;
      /* Membrane wobble. */
      vec3 q = p + 0.07 * vec3(
        sin(p.y * 4.6 + bt + pA * 3.0) * sin(p.z * 3.8 - bt * 0.7),
        sin(p.z * 4.2 + bt * 0.8 + pB * 3.0) * sin(p.x * 4.0 + bt * 0.6),
        sin(p.x * 4.4 - bt * 0.9 + pC * 3.0) * sin(p.y * 3.6 + bt * 0.5));
      vec3 dm = q - cm;
      vec3 d1 = q - c1;
      vec3 d2 = q - c2;
      float wm = 0.75 * exp(-dot(dm, dm) / (rm * rm) * 2.4);
      float w1 = 1.2 * exp(-dot(d1, d1) / (r1 * r1) * 3.0);
      float w2 = 1.2 * exp(-dot(d2, d2) / (r2 * r2) * 3.0);
      float wsum = wm + w1 + w2;
      /* The glass contains it: density dies in a thin layer at the walls. */
      vec3 ap = abs(p);
      float wall = smoothstep(0.0, 0.1, H - max(ap.x, max(ap.y, ap.z)));
      float a = 1.0 - exp(-wsum * wall * dt * 4.0);
      /* Sharpen each lobe's claim on its region; averaging greys them out. */
      float km = wm * sqrt(wm);
      float k1 = 2.0 * w1 * sqrt(w1);
      float k2 = 2.0 * w2 * sqrt(w2);
      vec3 col = (km * u_cellA + k1 * u_cellB + k2 * u_cellC) / max(km + k1 + k2, 1e-4);
      col = min(col * 1.15, vec3(1.0));
      orb.rgb += (1.0 - orb.a) * a * col;
      orb.a += (1.0 - orb.a) * a;
      if (orb.a > 0.985) break;
      tRay += dt;
    }
  }

  /* The case: project the corners; the three edges that meet the farthest
     corner are behind the body and drawn dotted. */
  vec2 pts[8];
  float depth[8];
  for (int i = 0; i < 8; i++) {
    vec3 corner = (vec3(float(i & 1), float((i >> 1) & 1), float((i >> 2) & 1)) * 2.0 - 1.0) * H;
    vec3 w = corner * M;
    depth[i] = w.z;
    pts[i] = w.xy * FOCAL / (w.z + CAM);
  }
  int backIdx = 0;
  for (int i = 1; i < 8; i++) {
    if (depth[i] > depth[backIdx]) backIdx = i;
  }

  float front = 0.0;
  float back = 0.0;
  for (int e = 0; e < 12; e++) {
    float t;
    float d = segment(uv, pts[EDGES[e].x], pts[EDGES[e].y], t);
    if (EDGES[e].x == backIdx || EDGES[e].y == backIdx) {
      float lpx = length(pts[EDGES[e].y] - pts[EDGES[e].x]) / px;
      float dots = 1.0 - smoothstep(0.16, 0.3, abs(fract(t * lpx / 7.5) - 0.5));
      back = max(back, (1.0 - smoothstep(0.4 * px, 1.5 * px, d)) * dots * 0.6);
    } else {
      front = max(front, (1.0 - smoothstep(0.5 * px, 1.7 * px, d)) * 0.95);
    }
  }

  vec4 frag = vec4(u_line * back, back);
  frag = over(frag, orb);
  frag = over(frag, vec4(u_line * front, front));

  /* Paper grain, fixed to the specimen. */
  float g = hash2(gl_FragCoord.xy * 0.77 + fract(u_seed * 71.3) * 421.0) - 0.5;
  frag.rgb = max(vec3(0.0), min(frag.rgb + g * 0.05 * frag.a, vec3(frag.a)));

  outColor = frag;
}`;

function mulberry32(seedInt: number) {
  let a = seedInt | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Resolve `#hex`, `rgb(…)`, or `color(srgb …)` to 0..1 channels. */
function cssColorToRgb(css: string): [number, number, number] {
  if (css.startsWith("#")) return hexToRgb(css);
  const parts = css.match(/-?[\d.]+/g);
  if (!parts || parts.length < 3) return [0.129, 0.114, 0.086];
  const scale = css.startsWith("color(") ? 1 : 1 / 255;
  return [Number(parts[0]) * scale, Number(parts[1]) * scale, Number(parts[2]) * scale];
}

/** The CSS filter hue-rotate matrix, so shifts match the cover art's dial. */
function hueRotate(rgb: [number, number, number], deg: number): [number, number, number] {
  if (!deg) return rgb;
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const [r, g, b] = rgb;
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  return [
    clamp01(
      (0.213 + c * 0.787 - s * 0.213) * r +
        (0.715 - c * 0.715 - s * 0.715) * g +
        (0.072 - c * 0.072 + s * 0.928) * b,
    ),
    clamp01(
      (0.213 - c * 0.213 + s * 0.143) * r +
        (0.715 + c * 0.285 + s * 0.14) * g +
        (0.072 - c * 0.072 - s * 0.283) * b,
    ),
    clamp01(
      (0.213 - c * 0.213 - s * 0.787) * r +
        (0.715 - c * 0.715 + s * 0.715) * g +
        (0.072 + c * 0.928 + s * 0.072) * b,
    ),
  ];
}

export type MarkApi = {
  /** Save the current frame as a PNG; `tile` composes it onto an app-icon slab. */
  exportPNG: (opts: { pixels: number; tile: boolean; fileName: string }) => void;
};

type MarkImpl = {
  applySeed: (value: number) => void;
  setPaused: (value: boolean) => void;
  setSize: (value: number) => void;
  setHue: (value: number) => void;
  setPose: (value: number) => void;
  setLineColor: (css: string | null) => void;
};

export function LogoMark({
  seed,
  className,
  label,
  paused = false,
  size = 1,
  hue = 0,
  pose,
  lineColor,
  apiRef,
}: {
  /** 0..1. Omit to grow a random specimen on mount. */
  seed?: number;
  className?: string;
  /** Accessible name. Omit when a labelled parent already describes the mark. */
  label?: string;
  /** Hold the specimen still. */
  paused?: boolean;
  /** Cell size multiplier; 1 is grown size. */
  size?: number;
  /** Palette shift in degrees, matching the cover art's hue dial. */
  hue?: number;
  /** Turn the case to a moment, in seconds from the specimen's birth. */
  pose?: number;
  /** Override the wireframe color; omit to inherit the room's text color. */
  lineColor?: string;
  /** Receives the export handle once the specimen is alive. */
  apiRef?: { current: MarkApi | null };
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const implRef = useRef<MarkImpl | null>(null);
  const seedRef = useRef(seed ?? Math.random());
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false });
    if (!gl) {
      setFallback(true);
      return;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vert || !frag || !program) {
      setFallback(true);
      return;
    }
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uSeed = gl.getUniformLocation(program, "u_seed");
    const uSize = gl.getUniformLocation(program, "u_size");
    const uCellA = gl.getUniformLocation(program, "u_cellA");
    const uCellB = gl.getUniformLocation(program, "u_cellB");
    const uCellC = gl.getUniformLocation(program, "u_cellC");
    const uLine = gl.getUniformLocation(program, "u_line");

    let time = 0;
    let seedBase = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let isPaused = false;
    let hueDeg = 0;
    let lineOverride: string | null = null;
    let baseColors: [number, number, number][] = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");

    const render = () => {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const uploadColors = () => {
      const [a, b, c] = baseColors.map((rgb) => hueRotate(rgb, hueDeg));
      gl.uniform3f(uCellA, ...a);
      gl.uniform3f(uCellB, ...b);
      gl.uniform3f(uCellC, ...c);
    };

    const applySeed = (value: number) => {
      /* 7 is prime, so any stride 1..6 walks three distinct palette colors. */
      const rand = mulberry32(Math.floor(value * 2 ** 31) + 1);
      const offset = Math.floor(rand() * POOL.length);
      const stride = 1 + Math.floor(rand() * (POOL.length - 1));
      baseColors = [0, 1, 2].map((i) => hexToRgb(POOL[(offset + i * stride) % POOL.length]));
      gl.uniform1f(uSeed, value);
      uploadColors();
      /* A fresh specimen also lands in a fresh pose. */
      seedBase = value * 400;
      time = seedBase;
      if (!raf) render();
    };

    const readLineColor = () => {
      const css = lineOverride ?? getComputedStyle(canvas).color;
      gl.uniform3f(uLine, ...cssColorToRgb(css));
      if (!raf) render();
    };

    const tick = (now: number) => {
      if (last) time += Math.min(now - last, 100) / 1000;
      last = now;
      render();
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      const run = visible && !document.hidden && !reduced.matches && !isPaused;
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        render();
      }
    };

    const exportPNG = ({ pixels, tile, fileName }: Parameters<MarkApi["exportPNG"]>[0]) => {
      const prevW = canvas.width;
      const prevH = canvas.height;
      canvas.width = pixels;
      canvas.height = pixels;
      render();
      const out = document.createElement("canvas");
      out.width = pixels;
      out.height = pixels;
      const ctx = out.getContext("2d");
      if (ctx) {
        if (tile) {
          ctx.beginPath();
          ctx.roundRect(0, 0, pixels, pixels, pixels * 0.22);
          ctx.fillStyle = "#211d16";
          ctx.fill();
          ctx.clip();
          const inset = pixels * 0.09;
          ctx.drawImage(canvas, inset, inset, pixels - inset * 2, pixels - inset * 2);
        } else {
          ctx.drawImage(canvas, 0, 0);
        }
        const link = document.createElement("a");
        link.href = out.toDataURL("image/png");
        link.download = fileName;
        link.click();
      }
      canvas.width = prevW;
      canvas.height = prevH;
      render();
    };

    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(entry.contentRect.width * dpr));
      const h = Math.max(1, Math.round(entry.contentRect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      render();
    });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });

    const onVisibility = () => sync();
    /* Recompute after the cascade settles on the new scheme. */
    const onSchemeChange = () => requestAnimationFrame(readLineColor);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setFallback(true);
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", sync);
    scheme.addEventListener("change", onSchemeChange);
    ro.observe(canvas);
    io.observe(canvas);

    implRef.current = {
      applySeed,
      setPaused: (value) => {
        isPaused = value;
        sync();
      },
      setSize: (value) => {
        gl.uniform1f(uSize, value);
        if (!raf) render();
      },
      setHue: (value) => {
        hueDeg = value;
        uploadColors();
        if (!raf) render();
      },
      setPose: (value) => {
        time = seedBase + value;
        if (!raf) render();
      },
      setLineColor: (css) => {
        lineOverride = css;
        readLineColor();
      },
    };
    if (apiRef) apiRef.current = { exportPNG };

    gl.uniform1f(uSize, 1);
    applySeed(seedRef.current);
    readLineColor();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      implRef.current = null;
      if (apiRef) apiRef.current = null;
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", sync);
      scheme.removeEventListener("change", onSchemeChange);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, []);

  useEffect(() => {
    if (seed === undefined) return;
    seedRef.current = seed;
    implRef.current?.applySeed(seed);
  }, [seed]);

  useEffect(() => {
    implRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    implRef.current?.setSize(size);
  }, [size]);

  useEffect(() => {
    implRef.current?.setHue(hue);
  }, [hue]);

  useEffect(() => {
    if (pose !== undefined) implRef.current?.setPose(pose);
  }, [pose]);

  useEffect(() => {
    implRef.current?.setLineColor(lineColor ?? null);
  }, [lineColor]);

  if (fallback) return <FallbackMark className={className} label={label} />;
  return (
    <canvas
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`block ${className ?? ""}`}
      ref={canvasRef}
      role={label ? "img" : undefined}
    />
  );
}

/** A still specimen for rooms without WebGL. */
function FallbackMark({ className, label }: { className?: string; label?: string }) {
  const id = useId();
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`block ${className ?? ""}`}
      fill="none"
      role={label ? "img" : undefined}
      viewBox="0 0 100 100"
    >
      <defs>
        <radialGradient cx="42%" cy="40%" id={id} r="62%">
          <stop offset="0%" stopColor="#de5397" />
          <stop offset="55%" stopColor="#7b5ea7" />
          <stop offset="100%" stopColor="#7b5ea7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M22 72 38 60M38 60 38 20M38 60 78 60"
        opacity="0.6"
        stroke="currentColor"
        strokeDasharray="2.5 3.5"
        strokeWidth="1.3"
      />
      <circle cx="50" cy="49" fill={`url(#${id})`} r="22" />
      <path d="M22 32 62 32 62 72 22 72Z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M22 32 38 20 78 20 62 32M78 20 78 60 62 72"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
