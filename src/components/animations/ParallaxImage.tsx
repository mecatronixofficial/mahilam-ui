import type { CSSProperties, ReactNode } from "react";

/**
 * Image that drifts inside its rounded, overflow-hidden frame as the page scrolls (CSS scroll timeline).
 * The inner layer is 20% taller than the frame, so the drift never exposes an edge. Off on phones.
 */
export function ParallaxImage({ children, className = "relative", style, amount = 8, ...rest }: { children: ReactNode; className?: string; style?: CSSProperties; amount?: number } & Record<`data-${string}`, string | undefined>) {
  return (
    <div className={`overflow-hidden ${className}`} style={style} {...rest}>
      <div className="fx-parallax absolute inset-x-0 -bottom-[10%] -top-[10%]" style={{ "--fx-parallax": amount } as CSSProperties}>{children}</div>
    </div>
  );
}

/** Decorative layer that drifts (and optionally turns) with scroll — for backdrops and big shapes. */
export function Drift({ children, className = "", y = 60, rotate = 0 }: { children: ReactNode; className?: string; y?: number; rotate?: number }) {
  return (
    <div aria-hidden className={`fx-drift pointer-events-none ${className}`} style={{ "--fx-drift-y": y, "--fx-drift-r": rotate } as CSSProperties}>
      {children}
    </div>
  );
}
