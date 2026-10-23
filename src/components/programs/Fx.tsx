"use client";
import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { BRAND } from "@/lib/brand";
import { Appear } from "@/components/animations/Appear";
import { finePointer, onEnter, prefersReducedMotion } from "@/components/animations/motion";

/**
 * 3D tilt toward the cursor, with a soft light "glare" that follows it. Max tilt is small on purpose.
 * Writes styles straight to the DOM (no React re-renders); a CSS transition smooths the movement.
 */
export function TiltCard({ children, className = "", max = 7, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    el.style.transform = `rotateX(${(0.5 - py) * 2 * max}deg) rotateY(${(px - 0.5) * 2 * max}deg)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.45), transparent 55%)`;
    }
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div className={`[perspective:1000px] ${className}`}>
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative h-full transition-transform duration-500 ease-(--ease-smooth) [transform-style:preserve-3d]">
        {children}
        {glare && <span ref={glareRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300" style={{ borderRadius: "inherit" }} />}
      </div>
    </div>
  );
}

/** Rises into place when scrolled into view; `index` staggers siblings (cycles every 3 for grid rows). */
export function RiseIn({ children, index = 0, className = "" }: { children: ReactNode; index?: number; className?: string }) {
  return (
    <Appear className={className} y={50} r={index % 2 ? 2 : -2} d={(index % 3) * 0.1} dur={0.9} ease="spring" start="top 90%">
      {children}
    </Appear>
  );
}

/** Pulls its child a few pixels toward the cursor while hovered — for call-to-action buttons. */
export function Magnetic({ children, strength = 0.25, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    el.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * strength}px, ${(event.clientY - rect.top - rect.height / 2) * strength}px)`;
  };
  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-(--ease-back) ${className}`}
      onPointerMove={onMove}
      onPointerLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
    >
      {children}
    </span>
  );
}

/** A small one-shot confetti burst (CSS `.fx-confetti`); remount it (change `key`) to fire again. */
export function Burst({ count = 18, spread = 160, className = "" }: { count?: number; spread?: number; className?: string }) {
  const pieces = useMemo(() => {
    const colors = [BRAND.yellow[400], BRAND.coral[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400]];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const distance = spread * (0.55 + Math.random() * 0.45);
      return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 30, rotate: Math.random() * 360, color: colors[i % colors.length], round: i % 3 === 0 };
    });
  }, [count, spread]);
  return (
    <span aria-hidden className={`pointer-events-none absolute left-1/2 top-1/2 ${className}`}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`fx-confetti absolute h-2 ${p.round ? "w-2 rounded-full" : "w-1.5 rounded-sm"}`}
          style={{ background: p.color, "--cx": `${p.x}px`, "--cy": `${p.y}px`, "--cr": `${p.rotate}deg`, "--cfall": "40px", "--c0": 0.4, "--fx-dur": "1.1s" } as CSSProperties}
        />
      ))}
    </span>
  );
}

/** Animated count-up from `from` to `to` when scrolled into view. Updates the text node directly. */
export function CountUp({ from = 0, to, suffix = "", duration = 1.4, delay = 0 }: { from?: number; to: number; suffix?: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.textContent = `${to}${suffix}`; return; }
    let frame = 0;
    const stop = onEnter(el, () => {
      const start = performance.now() + delay * 1000;
      const tick = (now: number) => {
        const t = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
        el.textContent = `${Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)))}${suffix}`;
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, "top 100%");
    return () => { stop(); cancelAnimationFrame(frame); };
  }, [from, to, suffix, duration, delay]);
  return <span ref={ref}>{`${from}${suffix}`}</span>;
}
