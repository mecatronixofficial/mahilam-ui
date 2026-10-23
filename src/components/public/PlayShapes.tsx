import type { CSSProperties, ReactNode } from "react";
import { BRAND } from "@/lib/brand";

/**
 * Little Mahilam's playful shape set: soft, flat, child-drawn silhouettes in the brand's pastels.
 * Outlines are generated from simple maths (polar curves smoothed into quadratic paths), so they are
 * original, tiny in source, and identical on server and client. Pure SVG — safe in server components.
 */

const TAU = Math.PI * 2;
const n1 = (v: number) => Math.round(v * 10) / 10;

/** Closed smooth path through points: each point becomes a quadratic control between midpoints. */
function smooth(points: [number, number][]) {
  const mid = (a: [number, number], b: [number, number]) => `${n1((a[0] + b[0]) / 2)} ${n1((a[1] + b[1]) / 2)}`;
  let d = `M${mid(points[points.length - 1], points[0])}`;
  points.forEach((p, i) => { d += `Q${n1(p[0])} ${n1(p[1])} ${mid(p, points[(i + 1) % points.length])}`; });
  return `${d}Z`;
}

/** Sample a polar radius function around the centre of a 200×200 box. */
function polar(radius: (t: number) => number, steps = 72, sx = 1, sy = 1) {
  return smooth(Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * TAU - Math.PI / 2;
    const r = radius(t);
    return [100 + r * sx * Math.cos(t), 100 + r * sy * Math.sin(t)] as [number, number];
  }));
}

function polygon(points: [number, number][]) {
  return `M${points.map(([x, y]) => `${n1(x)} ${n1(y)}`).join("L")}Z`;
}

const burst = (spikes: number, outer: number, inner: number) =>
  polygon(Array.from({ length: spikes * 2 }, (_, i) => {
    const t = (i / (spikes * 2)) * TAU - Math.PI / 2;
    const r = i % 2 ? inner : outer;
    return [100 + r * Math.cos(t), 100 + r * Math.sin(t)];
  }));

const heart = smooth(Array.from({ length: 64 }, (_, i) => {
  const t = (i / 64) * TAU;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [100 + x * 5.6, 92 - y * 5.6] as [number, number];
}));

const leaf = smooth([
  ...Array.from({ length: 24 }, (_, i) => { const u = i / 23; return [10 + u * 180, 100 - 62 * Math.sin(Math.PI * u) ** 0.85] as [number, number]; }),
  ...Array.from({ length: 22 }, (_, i) => { const u = 1 - (i + 1) / 23; return [10 + u * 180, 100 + 48 * Math.sin(Math.PI * u) ** 0.85] as [number, number]; }),
]);

/** Rounded triangle: a triangle's polar outline blended with a circle. */
const tri = polar((t) => {
  const seg = TAU / 3;
  const local = ((((t + Math.PI / 2) % seg) + seg) % seg) - seg / 2;
  return 0.72 * (48 / Math.cos(local)) + 0.28 * 86;
}, 90);

type ShapeDef = { box: string; d: string; stroke?: number };

export const SHAPES = {
  flower: { box: "0 0 200 200", d: polar((t) => 80 + 15 * Math.cos(5 * t), 90) },
  cloud: { box: "0 0 200 200", d: polar((t) => 58 + 20 * Math.abs(Math.cos(2.5 * t)), 90, 1.22, 0.92) },
  burst: { box: "0 0 200 200", d: burst(11, 96, 58) },
  blob: { box: "0 0 200 200", d: polar((t) => 80 + 9 * Math.sin(2 * t + 1) + 6 * Math.cos(3 * t) + 4 * Math.sin(5 * t + 2)) },
  pebble: { box: "0 0 200 200", d: polar((t) => 82 + 5 * Math.sin(2 * t + 0.6), 48, 1.08, 0.94) },
  sun: { box: "0 0 200 200", d: polar((t) => 80 + 8 * Math.cos(12 * t), 120) },
  heart: { box: "0 0 200 190", d: heart },
  leaf: { box: "0 0 200 200", d: leaf },
  tri: { box: "0 0 200 200", d: tri },
  plus: { box: "0 0 200 200", d: "M80 12h40a12 12 0 0 1 12 12v56h56a12 12 0 0 1 12 12v16a12 12 0 0 1-12 12h-56v56a12 12 0 0 1-12 12H80a12 12 0 0 1-12-12v-56H12A12 12 0 0 1 0 108V92a12 12 0 0 1 12-12h56V24a12 12 0 0 1 12-12z" },
  arch: { box: "0 0 200 112", d: "M4 108A96 96 0 0 1 196 108H150A50 50 0 0 0 50 108Z" },
  squiggle: { box: "0 0 260 120", d: "M16 60C40 14 70 14 92 60S144 106 168 60 220 14 244 60", stroke: 22 },
} satisfies Record<string, ShapeDef>;

export type ShapeName = keyof typeof SHAPES;

/** Little Mahilam palette for shapes and decoration — the logo swatches (green, pink, yellow, teal) plus soft tints. */
export const PALETTE = {
  ink: BRAND.green[900],
  sand: BRAND.cream[100],
  sun: BRAND.yellow[400],
  butter: BRAND.yellow[100],
  coral: BRAND.coral[300],
  peach: BRAND.coral[100],
  pink: BRAND.pink[400],
  blush: BRAND.pink[100],
  leaf: BRAND.green[400],
  mint: BRAND.green[100],
  blue: BRAND.blue[400],
  sky: BRAND.blue[100],
  violet: BRAND.pink[200],
  lilac: BRAND.pink[50],
} as const;

/** Light card background + stronger shape tone (+ hover background), cycled through cards: green, yellow, pink, blue. */
export const TONES = [
  { bg: PALETTE.mint, shape: PALETTE.leaf, hover: BRAND.green[200] },
  { bg: PALETTE.butter, shape: PALETTE.sun, hover: BRAND.yellow[200] },
  { bg: PALETTE.blush, shape: PALETTE.pink, hover: BRAND.pink[200] },
  { bg: PALETTE.sky, shape: PALETTE.blue, hover: BRAND.blue[200] },
] as const;

export function Shape({ name, color = PALETTE.pink, className = "", style }: { name: ShapeName; color?: string; className?: string; style?: CSSProperties }) {
  const shape: ShapeDef = SHAPES[name];
  return (
    <svg aria-hidden viewBox={shape.box} className={`block ${className}`} style={style} fill={shape.stroke ? "none" : color}>
      <path d={shape.d} {...(shape.stroke ? { stroke: color, strokeWidth: shape.stroke, strokeLinecap: "round" as const } : {})} />
    </svg>
  );
}

/** CSS mask that crops any element (e.g. a photo) to a filled shape's silhouette. */
export function shapeMask(name: ShapeName): CSSProperties {
  const shape: ShapeDef = SHAPES[name];
  const url = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${shape.box}' preserveAspectRatio='none'><path d='${shape.d}'/></svg>`)}")`;
  return { WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" };
}

/** Big staircase silhouette used as a section backdrop (building blocks). */
export function StairsBackdrop({ color = PALETTE.sand, className = "" }: { color?: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 900 1030" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`} fill={color}>
      <path d="M0 0H460Q500 0 500 40V230Q500 250 520 250H580Q600 250 600 270V450Q600 470 620 470H680Q700 470 700 490V680Q700 700 720 700H780Q800 700 800 720V1030H0Z" />
    </svg>
  );
}

/** A word with a pastel shape tucked behind it. */
export function MarkedWord({ children, shape = "flower", color = PALETTE.pink, rotate = -8 }: { children: ReactNode; shape?: ShapeName; color?: string; rotate?: number }) {
  return (
    <span className="lm-mark" style={{ "--rot": `${rotate}deg` } as CSSProperties}>
      <Shape name={shape} color={color} />
      {children}
    </span>
  );
}

/** Round arrow bubble used at the end of `.lm-btn*` pills. */
export function ArrowBubble() {
  return (
    <span aria-hidden className="lm-btn-arrow">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}
