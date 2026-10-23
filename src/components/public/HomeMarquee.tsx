"use client";

import { useEffect, useRef } from "react";
import { getMotion } from "@/components/animations/motion";
import { PALETTE, Shape, type ShapeName } from "./PlayShapes";

const RIBBON = ["Joyful learning", "Child-centred care", "Play-way discovery", "Play Group to Grade 3", "School of Happiness"];
const SEPARATORS: { shape: ShapeName; color: string }[] = [
  { shape: "burst", color: PALETTE.sun },
  { shape: "heart", color: PALETTE.pink },
  { shape: "flower", color: PALETTE.leaf },
  { shape: "pebble", color: PALETTE.coral },
  { shape: "plus", color: PALETTE.blue },
];

/**
 * The homepage's single marquee: a big, slightly tilted band that crosses from the hero into the next
 * section. It drifts very slowly, speeds up with scroll velocity and follows the scroll direction.
 * Uses the browser's own Web Animations API — no animation library.
 */
export function HomeMarquee() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const track = el?.querySelector<HTMLElement>("[data-marquee-track]");
    const m = getMotion();
    if (!el || !track || m.reduce) return;
    const duration = (m.mobile ? 50 : 70) * 1000;
    const loop = track.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration, iterations: Infinity });
    loop.currentTime = duration * 50; // start mid-way so it can also run backwards
    if (m.mobile) return () => loop.cancel();

    let lastY = window.scrollY;
    let lastT = performance.now();
    let direction = 1;
    let boost = 1;
    let frame = 0;
    // After each scroll burst the speed eases back to normal, keeping the latest direction.
    const settle = () => {
      boost += (1 - boost) * 0.06;
      loop.playbackRate = direction * boost;
      frame = boost - 1 > 0.01 ? requestAnimationFrame(settle) : 0;
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const velocity = Math.abs(dy) / Math.max(now - lastT, 1) * 1000;
      lastY = window.scrollY;
      lastT = now;
      if (dy) direction = dy > 0 ? 1 : -1;
      boost = Math.min(6, Math.max(boost, 1 + velocity / 350));
      if (!frame) frame = requestAnimationFrame(settle);
    };
    // Only listen (and only run) while the band is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loop.play();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        loop.pause();
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      loop.cancel();
    };
  }, []);

  return (
    <section ref={ref} aria-label="Little Mahilam at a glance" className="relative z-10 -mt-8 overflow-x-clip py-8 sm:-mt-12">
      <div className="-ml-[5%] w-[110%] -rotate-2 bg-little-green-900 py-4 text-little-cream-100 sm:py-6">
        <div data-marquee-track className="flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {[...RIBBON, ...RIBBON].map((label, i) => (
                <span key={i} className="flex items-center gap-6 px-6 text-3xl font-extrabold tracking-tight sm:gap-10 sm:px-10 sm:text-5xl lg:text-6xl">
                  {label}
                  <Shape name={SEPARATORS[i % SEPARATORS.length].shape} color={SEPARATORS[i % SEPARATORS.length].color} className="h-7 w-7 sm:h-11 sm:w-11" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
