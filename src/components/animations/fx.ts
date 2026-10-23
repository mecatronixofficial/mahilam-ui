import type { CSSProperties } from "react";

/** Pure styling helpers for the CSS motion kit — safe to use from server components. */

export type Ease = "out" | "soft" | "expo" | "back" | "back-strong" | "spring" | "bounce" | "linear";
export type FxVars = {
  /** Start offset, px. */ x?: number; y?: number;
  /** Start scale / rotation (deg) / opacity. */ s?: number; r?: number; o?: number;
  /** Delay and duration, seconds. */ d?: number; dur?: number;
  ease?: Ease;
  /** Start clip-path for `.fx-clip`. */ clip?: string;
  /** Shrink the x/y offsets on smaller screens (full on desktop, 70% tablet, 45% phone). */ k?: boolean;
};

/** Inline CSS variables for the `.fx*` classes in globals.css. */
export function fx({ x, y, s, r, o, d, dur, ease, clip, k }: FxVars): CSSProperties {
  const px = (v: number) => (k ? `calc(${v}px * var(--fx-scale, 1))` : `${v}px`);
  const style: Record<string, string> = {};
  if (x !== undefined) style["--fx-x"] = px(x);
  if (y !== undefined) style["--fx-y"] = px(y);
  if (s !== undefined) style["--fx-s"] = String(s);
  if (r !== undefined) style["--fx-r"] = `${r}deg`;
  if (o !== undefined) style["--fx-o"] = String(o);
  if (d !== undefined) style["--fx-d"] = `${d}s`;
  if (dur !== undefined) style["--fx-dur"] = `${dur}s`;
  if (ease) style["--fx-ease"] = ease === "linear" ? "linear" : `var(--ease-${ease === "out" ? "smooth" : ease})`;
  if (clip) style["--fx-clip"] = clip;
  return style as CSSProperties;
}
