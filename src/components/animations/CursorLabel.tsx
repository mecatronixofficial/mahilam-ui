"use client";

import { useEffect, useRef, useState } from "react";
import { finePointer, prefersReducedMotion } from "./motion";

/**
 * Small label bubble ("View", "Drag") that trails the mouse while it is over an element with
 * `data-cursor="…"`. The normal cursor stays visible; touch devices and reduced motion never see it.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;
    let active: Element | null = null;

    // Ease toward the pointer each frame; the loop stops once it has caught up.
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.translate = `${x}px ${y}px`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      tx = event.clientX + 18;
      ty = event.clientY + 18;
      if (!frame) frame = requestAnimationFrame(tick);
      const target = (event.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (target === active) return;
      if (!active) { x = tx; y = ty; } // appear at the pointer instead of flying in from the corner
      active = target;
      if (target) setLabel(target.getAttribute("data-cursor") ?? "");
      el.style.scale = target ? "1" : "0";
      el.style.opacity = target ? "1" : "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] grid h-16 w-16 place-items-center rounded-full bg-little-green-900 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-[scale,opacity] duration-300 ease-[var(--ease-back)]" style={{ opacity: 0, scale: "0" }}>
      {label}
    </div>
  );
}
