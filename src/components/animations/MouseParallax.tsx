"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { finePointer, prefersReducedMotion } from "./motion";

/**
 * Desktop-only depth: every `[data-depth]` layer inside leans toward the mouse by `depth × strength` px,
 * and settles back when the pointer leaves. Touch devices and reduced motion get a static layout.
 */
export function MouseParallax({ as: Tag = "div", children, className, style, strength = 18 }: { as?: ElementType; children: ReactNode; className?: string; style?: CSSProperties; strength?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.innerWidth < 1024 || !finePointer() || prefersReducedMotion()) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"), (layer) => ({ layer, depth: Number(layer.dataset.depth) || 1 }));
    layers.forEach(({ layer }) => layer.classList.add("fx-follow"));
    let dx = 0;
    let dy = 0;
    let frame = 0;
    const apply = () => {
      frame = 0;
      layers.forEach(({ layer, depth }) => { layer.style.transform = `translate3d(${dx * depth * strength}px, ${dy * depth * strength}px, 0)`; });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply); };
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      dx = (event.clientX - box.left) / box.width - 0.5;
      dy = (event.clientY - box.top) / box.height - 0.5;
      schedule();
    };
    const leave = () => { dx = 0; dy = 0; schedule(); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
      layers.forEach(({ layer }) => { layer.classList.remove("fx-follow"); layer.style.transform = ""; });
    };
  }, [strength]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
