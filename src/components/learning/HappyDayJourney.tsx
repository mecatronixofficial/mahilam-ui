"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Music, Palette, Sunrise, Sunset, Trees, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Cloud, House, SunDoodle, Tree } from "@/components/about/Doodles";
import { handwriting } from "@/components/about/fonts";
import { prefersReducedMotion, useInView } from "@/components/animations/motion";
import styles from "./learning.module.css";

type Moment = { title: string; text: string; chips: string[]; icon: LucideIcon; color: string };

const MOMENTS: Moment[] = [
  { title: "Welcome and Circle Time", text: "Warm hellos, a gathering song and a little chat about the day help everyone feel settled and included.", chips: ["Greetings", "Feelings check-in", "Weather & calendar"], icon: Sunrise, color: BRAND.yellow[400] },
  { title: "Creative Exploration", text: "Art tables, building corners and discovery trays invite children to experiment, make and wonder.", chips: ["Painting", "Building", "Sensory trays"], icon: Palette, color: BRAND.pink[300] },
  { title: "Storytelling and Language", text: "Picture books, puppets and conversation grow new words, listening and imagination.", chips: ["Story circle", "Puppets", "New words"], icon: BookOpen, color: BRAND.blue[300] },
  { title: "Outdoor Play", text: "Running, climbing, sand and nature walks build strong bodies and curious minds.", chips: ["Active play", "Nature hunts", "Free play"], icon: Trees, color: BRAND.green[400] },
  { title: "Music and Movement", text: "Rhymes, rhythm instruments and dance help children move, count and express themselves.", chips: ["Rhymes", "Rhythm", "Dance"], icon: Music, color: BRAND.coral[300] },
  { title: "Reflection and Goodbye", text: "We look back on the day's discoveries, celebrate little wins and say a cheerful goodbye.", chips: ["Show & tell", "Celebrate", "See you tomorrow"], icon: Sunset, color: BRAND.pink[400] },
];

/* Checkpoints sit on a winding road; every segment is the same mirrored curve, so checkpoint i is exactly i/5 along it. */
const POINTS = MOMENTS.map((_, i) => ({ x: 100 + i * 200, y: i % 2 ? 90 : 210 }));
const ROAD = POINTS.reduce((d, p, i) => {
  if (i === 0) return `M${p.x} ${p.y}`;
  const prev = POINTS[i - 1];
  return `${d} C ${prev.x + 70} ${prev.y}, ${p.x - 70} ${p.y}, ${p.x} ${p.y}`;
}, "");
const LAST = MOMENTS.length - 1;

/** "A Day of Happy Learning": a winding road on wide screens, a vertical trail on phones. Plays through once when seen. */
export function HappyDayJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -30% 0px" });
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  // Walk through the day once, then stop; any click hands control to the visitor.
  useEffect(() => {
    if (!inView || !auto || prefersReducedMotion()) return;
    if (active >= LAST) return;
    const id = window.setTimeout(() => setActive((a) => a + 1), 2400);
    return () => window.clearTimeout(id);
  }, [inView, auto, active]);

  const choose = (i: number) => { setAuto(false); setActive(i); };
  const progress = active / LAST;
  const current = MOMENTS[active];
  const CurrentIcon = current.icon;

  return (
    <div ref={ref}>
      {/* ---------- Wide screens: winding road ---------- */}
      <div className="hidden md:block">
        <div className="relative mx-auto aspect-[1200/300] w-full">
          <svg aria-hidden viewBox="0 0 1200 300" className="absolute inset-0 h-full w-full overflow-visible" fill="none" strokeLinecap="round">
            <path d={ROAD} stroke="#fff" strokeWidth="34" />
            <path d={ROAD} stroke={BRAND.green[900]} strokeOpacity=".14" strokeWidth="3" strokeDasharray="10 18" className={styles.march} />
            <path
              d={ROAD}
              pathLength={1}
              strokeDasharray="1"
              stroke={BRAND.yellow[400]}
              strokeWidth="12"
              className="transition-[stroke-dashoffset] duration-[1400ms] ease-(--ease-smooth) motion-reduce:transition-none"
              style={{ strokeDashoffset: 1 - progress }}
            />
          </svg>

          {/* Scenery */}
          <SunDoodle className="pointer-events-none absolute left-[1%] top-[-6%] w-[7%]" />
          <Cloud className="pointer-events-none absolute left-[30%] top-[-4%] w-[8%] opacity-90" />
          <Tree className="pointer-events-none absolute bottom-[2%] left-[50%] w-[3.5%]" />
          <Tree className="pointer-events-none absolute left-[66%] top-[4%] w-[3%]" />
          <Cloud className="pointer-events-none absolute right-[18%] top-[-2%] w-[7%] opacity-90" />
          <House className="pointer-events-none absolute bottom-[2%] right-[0%] w-[6%]" />

          {MOMENTS.map((m, i) => {
            const Icon = m.icon;
            const on = i === active;
            const done = i < active;
            return (
              <button
                key={m.title}
                type="button"
                aria-pressed={on}
                onClick={() => choose(i)}
                className="group/cp absolute flex w-[13%] -translate-x-1/2 -translate-y-1/2 flex-col items-center focus-visible:outline-none"
                style={{ left: `${(POINTS[i].x / 1200) * 100}%`, top: `${(POINTS[i].y / 300) * 100}%` }}
              >
                <span className="relative grid h-16 w-16 place-items-center lg:h-[74px] lg:w-[74px]">
                  {on && <span aria-hidden className={`absolute inset-0 rounded-full ${styles.ping}`} style={{ background: m.color }} />}
                  <span
                    className={`relative grid h-full w-full place-items-center rounded-full border-4 border-white text-little-green-950 shadow-[0_12px_22px_-12px_rgba(36,68,32,.7)] transition-[scale,rotate,background-color] duration-500 ease-(--ease-back-strong) group-hover/cp:scale-110 group-hover/cp:-rotate-6 group-focus-visible/cp:ring-4 group-focus-visible/cp:ring-little-pink-300 ${on ? "scale-115" : ""}`}
                    style={{ background: on || done ? m.color : BRAND.cream[100] }}
                  >
                    <Icon className="h-7 w-7" strokeWidth={2.2} />
                  </span>
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-little-green-900 font-display text-xs font-bold text-white">{i + 1}</span>
                </span>
                <span className={`mt-2 rounded-full px-2.5 py-1 text-center font-display text-[13px] font-bold leading-tight transition-colors lg:text-sm ${on ? "bg-little-green-900 text-white" : "bg-white/80 text-little-green-950"}`}>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detail card for the chosen moment */}
        <div aria-live="polite" className="relative mx-auto mt-8 max-w-3xl">
          <div key={active} className="flex animate-fade-up items-center gap-5 rounded-[32px] bg-white p-5 shadow-[0_20px_40px_-30px_rgba(36,68,32,.6)] motion-reduce:animate-none lg:p-6">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[28px] text-little-green-950" style={{ background: current.color }}>
              <CurrentIcon className="h-9 w-9" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800/60">Moment {active + 1} of {MOMENTS.length}</p>
              <h3 className="mt-0.5 font-display text-2xl font-bold text-little-green-950">{current.title}</h3>
              <p className="mt-1 text-[15px] leading-7 text-little-neutral-600">{current.text}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {current.chips.map((c) => <li key={c} className="rounded-full bg-little-cream-100 px-3 py-1 text-xs font-extrabold text-little-green-900">{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Phones: vertical trail ---------- */}
      <ol className="relative mx-auto max-w-md md:hidden">
        {MOMENTS.map((m, i) => {
          const Icon = m.icon;
          const on = i === active;
          return (
            <li key={m.title} className="relative pb-3 last:pb-0">
              {/* Trail to the next stop; fills once this moment is behind us */}
              {i < LAST && (
                <span aria-hidden className="absolute bottom-0 left-7 top-7 w-2 -translate-x-1/2 overflow-hidden rounded-full bg-white">
                  <span className="block h-full w-full origin-top bg-little-yellow-400 transition-transform duration-700 ease-(--ease-smooth)" style={{ transform: `scaleY(${i < active ? 1 : 0})` }} />
                </span>
              )}
              <button type="button" aria-expanded={on} onClick={() => choose(i)} className="flex w-full items-center gap-4 text-left focus-visible:outline-none">
                <span
                  className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 border-white text-little-green-950 shadow-md transition-[scale] duration-300 ${on ? "scale-110" : ""}`}
                  style={{ background: i <= active ? m.color : BRAND.cream[100] }}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <span className="font-display text-lg font-bold text-little-green-950">{m.title}</span>
              </button>
              <div className={`grid pl-[4.5rem] transition-[grid-template-rows,opacity] duration-500 ease-(--ease-smooth) ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="pt-1 text-[15px] leading-7 text-little-neutral-600">{m.text}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5 pb-2">
                    {m.chips.map((c) => <li key={c} className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-little-green-900">{c}</li>)}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className={`${handwriting.className} mt-6 text-center text-2xl font-bold text-little-green-900`}>
        Every day is a little different — just like every child.
      </p>
    </div>
  );
}
