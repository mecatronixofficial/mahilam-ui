import type { CSSProperties } from "react";

/** Wavy balloon thread that wiggles from its top (the knot). Decorative only. */
export function BalloonString({ length = 48, color = "rgba(255,255,255,.55)", className = "", style }: { length?: number; color?: string; className?: string; style?: CSSProperties }) {
  // Gentle S-curves every 14px, continued smoothly with `T`.
  const waves = Math.max(1, Math.round(length / 14));
  const height = waves * 14;
  const d = `M6 0 Q 10 7 6 14${Array.from({ length: waves - 1 }, (_, i) => ` T 6 ${(i + 2) * 14}`).join("")}`;
  return (
    <svg aria-hidden width="12" height={height} viewBox={`0 0 12 ${height}`} className={`balloon-thread block overflow-visible ${className}`} style={style}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
