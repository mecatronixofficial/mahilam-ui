import { useId, type CSSProperties, type ReactNode } from "react";
import { Shape, type ShapeName } from "@/components/public/PlayShapes";

/** Stable 0–1 number from a string, so server and browser pick the same phase. */
function phase(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return (Math.abs(h) % 1000) / 1000;
}

/**
 * Gentle, organic bobbing — pure CSS (`.fx-float`). Vertical drift and tilt run on different periods so
 * nothing moves in lockstep; phones get a much smaller motion and reduced-motion users get none.
 */
export function Float({
  children,
  className = "",
  style,
  amp = 10,
  tilt = 4,
  duration = 5,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Vertical travel in px (desktop). */
  amp?: number;
  /** Rotation swing in degrees (desktop). */
  tilt?: number;
  /** Seconds for one vertical sweep. */
  duration?: number;
  /** Resting rotation; the float rocks around it. */
  rotate?: number;
}) {
  const offset = phase(useId());
  const vars = {
    "--fx-a": amp,
    "--fx-t": tilt,
    "--fx-dur": `${duration}s`,
    "--fx-rest": `${rotate}deg`,
    "--fx-d": `${(-offset * duration).toFixed(2)}s`,
    "--fx-d2": `${(-(1 - offset) * duration * 1.37).toFixed(2)}s`,
  } as CSSProperties;

  return (
    <span aria-hidden className={`fx-float pointer-events-none block ${className}`} style={{ ...vars, ...style }}>
      {children}
    </span>
  );
}

export function FloatingShape({ name, color, className, style, ...motion }: { name: ShapeName; color?: string; className?: string; style?: CSSProperties; amp?: number; tilt?: number; duration?: number; rotate?: number }) {
  return (
    <Float className={className} style={style} {...motion}>
      <Shape name={name} color={color} className="h-auto w-full" />
    </Float>
  );
}
