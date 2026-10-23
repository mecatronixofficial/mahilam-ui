"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/components/animations/motion";
import { PALETTE, Shape, type ShapeName } from "./PlayShapes";

/** Bottom row first, so each shape lands on the ones below it. */
const PILE: { name: ShapeName; color: string; w: string; left: string; bottom: string; rotate: number }[] = [
  { name: "pebble", color: PALETTE.pink, w: "26%", left: "0%", bottom: "0%", rotate: -8 },
  { name: "flower", color: PALETTE.sun, w: "30%", left: "22%", bottom: "0%", rotate: 6 },
  { name: "tri", color: PALETTE.blue, w: "20%", left: "50%", bottom: "0%", rotate: -14 },
  { name: "cloud", color: PALETTE.coral, w: "28%", left: "66%", bottom: "0%", rotate: 4 },
  { name: "burst", color: PALETTE.leaf, w: "24%", left: "10%", bottom: "30%", rotate: 12 },
  { name: "heart", color: PALETTE.violet, w: "22%", left: "36%", bottom: "34%", rotate: -6 },
  { name: "leaf", color: PALETTE.peach, w: "26%", left: "60%", bottom: "30%", rotate: -22 },
  { name: "blob", color: PALETTE.blush, w: "18%", left: "44%", bottom: "62%", rotate: 10 },
];

/**
 * Pile of shapes tipped into a corner. They fall in one after another and bounce to rest —
 * gravity simulated with a CSS bounce easing. `trigger="load"` plays it as part of an intro.
 */
export function ShapePile({ className = "", trigger = "scroll", delay = 0 }: { className?: string; trigger?: "load" | "scroll"; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const load = trigger === "load";
  useReveal(ref, "top 95%", !load);

  return (
    <div ref={ref} aria-hidden data-fx-group="" {...(load ? { "data-in": "" } : {})} className={`pointer-events-none ${className}`}>
      <div className="relative aspect-[5/3] w-full">
        {PILE.map(({ name, color, w, left, bottom, rotate }, i) => (
          <span
            key={name}
            className="fx absolute"
            style={{
              width: w, left, bottom, rotate: `${rotate}deg`,
              "--fx-y": "calc(-320% * var(--fx-scale))", "--fx-r": `${i % 2 ? 40 : -40}deg`, "--fx-d": `${delay + i * 0.09}s`, "--fx-dur": "1.1s", "--fx-ease": "var(--ease-bounce)",
            } as CSSProperties}
          >
            <Shape name={name} color={color} className="h-auto w-full" />
          </span>
        ))}
      </div>
    </div>
  );
}
