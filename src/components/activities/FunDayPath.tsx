"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Music, Palette, Search, Smile, Sun, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { prefersReducedMotion } from "@/components/animations/motion";
import { handwriting } from "@/components/about/fonts";

type Stop = { title: string; text: string; ask: string; icon: LucideIcon; color: string };

const STOPS: Stop[] = [
  { title: "Welcome Play", text: "Warm greetings and free play help every child settle in at their own pace.", ask: "Who did you play with first?", icon: Smile, color: BRAND.yellow[400] },
  { title: "Creative Corner", text: "Paints, clay and collage invite little makers to try out their own ideas.", ask: "What colours did you use?", icon: Palette, color: BRAND.pink[300] },
  { title: "Little Explorers", text: "Discovery trays, puzzles and big questions turn curiosity into learning.", ask: "What did you find out today?", icon: Search, color: BRAND.blue[300] },
  { title: "Music & Movement", text: "Songs, rhymes and dance get bodies moving and voices singing.", ask: "Can you sing me the new song?", icon: Music, color: BRAND.coral[300] },
  { title: "Outdoor Adventures", text: "Running, climbing and games in the fresh air build strength and friendships.", ask: "What game did you play outside?", icon: Sun, color: BRAND.green[400] },
  { title: "Happy Moments", text: "We share what we enjoyed and celebrate every little win together.", ask: "What made you smile today?", icon: Heart, color: BRAND.pink[400] },
];

/** A ribbon that swings between checkpoints and draws itself as the visitor scrolls; each stop lights up as it's reached. */
export function FunDayPath() {
  const wrap = useRef<HTMLDivElement>(null);
  const progressPath = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number } | null>(null);

  // Build the ribbon through the measured checkpoint centres (re-measured on resize).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const pts = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"), (dot) => {
        const r = dot.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      if (pts.length < 2) return;
      const amp = box.width >= 768 ? 110 : 0;
      const d = pts.reduce((acc, p, i) => {
        if (i === 0) return `M${p.x} ${p.y}`;
        const a = pts[i - 1];
        const side = i % 2 ? 1 : -1;
        const dy = p.y - a.y;
        return `${acc} C ${a.x + side * amp} ${a.y + dy * 0.35}, ${p.x + side * amp} ${p.y - dy * 0.35}, ${p.x} ${p.y}`;
      }, "");
      setGeo({ d, w: box.width, h: box.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-linked drawing; writes straight to the DOM (no re-renders), and only while the section is on screen.
  useEffect(() => {
    const el = wrap.current;
    const path = progressPath.current;
    if (!el || !path || !geo) return;
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));
    const paint = (p: number) => {
      path.style.strokeDashoffset = String(1 - p);
      const reachedY = p * el.offsetHeight;
      dots.forEach((dot) => dot.toggleAttribute("data-reached", dot.offsetTop + dot.offsetHeight / 2 <= reachedY + 4));
    };
    if (prefersReducedMotion()) { paint(1); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      paint(Math.min(Math.max((window.innerHeight * 0.62 - r.top) / r.height, 0), 1));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { window.addEventListener("scroll", onScroll, { passive: true }); update(); }
      else window.removeEventListener("scroll", onScroll);
    });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [geo]);

  return (
    <div ref={wrap} className="relative mx-auto max-w-5xl">
      {geo && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${geo.w} ${geo.h}`} fill="none" strokeLinecap="round">
          <path d={geo.d} stroke="#fff" strokeWidth="18" />
          <path d={geo.d} stroke={BRAND.green[900]} strokeOpacity=".12" strokeWidth="3" strokeDasharray="6 14" />
          <path ref={progressPath} d={geo.d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke={BRAND.coral[400]} strokeWidth="8" />
        </svg>
      )}

      <ol className="relative space-y-5 md:space-y-0">
        {STOPS.map((s, i) => {
          const Icon = s.icon;
          const right = i % 2 === 1;
          return (
            <li key={s.title} className="grid grid-cols-[56px_1fr] items-center gap-4 md:min-h-[150px] md:grid-cols-[1fr_88px_1fr] md:gap-6">
              <span
                data-dot=""
                className="group/dot relative z-10 grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-little-cream-100 text-little-green-900/40 shadow-[0_10px_18px_-12px_rgba(36,68,32,.7)] transition-[background-color,color,scale] duration-500 ease-(--ease-back-strong) data-[reached]:scale-110 data-[reached]:text-little-green-950 md:col-start-2 md:row-start-1 md:mx-auto md:h-[72px] md:w-[72px]"
                style={{ ["--stop" as string]: s.color }}
              >
                <span aria-hidden className="absolute inset-0 rounded-full bg-(--stop) opacity-0 transition-opacity duration-500 group-data-[reached]/dot:opacity-100" />
                <Icon className="relative h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} />
              </span>
              <div className={`relative rounded-[28px] bg-white p-5 shadow-[0_16px_30px_-26px_rgba(36,68,32,.7)] md:row-start-1 ${right ? "md:col-start-3" : "md:col-start-1 md:text-right"}`}>
                <p className="text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800/50">Stop {i + 1}</p>
                <h3 className="mt-0.5 font-display text-xl font-bold text-little-green-950 md:text-2xl">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-7 text-little-neutral-600">{s.text}</p>
                <p className={`${handwriting.className} mt-2 text-xl font-bold text-little-coral-600`}>Ask: “{s.ask}”</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
