"use client";
import type { SectionContent } from "@/lib/page-content";

import { useRef, useState } from "react";
import { fx } from "@/components/animations/fx";
import { useReveal } from "@/components/animations/motion";
import { Clock } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Cloud, SchoolBus, SECTION_BG, SunDoodle, Tree, Wave } from "./Doodles";
import { SectionHeading } from "./motion";

const DAY = [
  { emoji: "🌞", time: "09:00", meridiem: "AM", title: "Hello School", bg: BRAND.yellow[100], ring: BRAND.yellow[400] },
  { emoji: "🎨", time: "10:00", meridiem: "AM", title: "Creative Time", bg: BRAND.pink[50], ring: BRAND.pink[300] },
  { emoji: "📖", time: "11:00", meridiem: "AM", title: "Story Time", bg: BRAND.blue[100], ring: BRAND.blue[400] },
  { emoji: "🍎", time: "12:00", meridiem: "PM", title: "Snack & Friends", bg: BRAND.coral[100], ring: BRAND.coral[400] },
  { emoji: "🎵", time: "01:00", meridiem: "PM", title: "Music & Movement", bg: BRAND.green[100], ring: BRAND.green[400] },
  { emoji: "🌈", time: "02:00", meridiem: "PM", title: "Happy Goodbye", bg: BRAND.yellow[50], ring: BRAND.yellow[300] },
];

/** A day at school as a road of activity bubbles; the active one grows as you hover or swipe, and a bus drives by. */
export function HappyDayTimeline({ content }: { content?: SectionContent } = {}) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLOListElement>(null);
  const ticking = useRef(false);
  useReveal(track);

  // On narrow screens the row scrolls sideways: the bubble nearest the centre becomes active.
  const onScroll = () => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const el = track.current;
      if (!el || el.scrollWidth <= el.clientWidth) return;
      const centre = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const node = child as HTMLElement;
        const distance = Math.abs(node.offsetLeft + node.offsetWidth / 2 - centre);
        if (distance < bestDistance) { bestDistance = distance; best = i; }
      });
      setActive(best);
    });
  };

  return (
    <section className="relative overflow-hidden pb-28 pt-14 md:pt-16" style={{ background: SECTION_BG.sky }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <SunDoodle className="absolute right-[6%] top-10 w-16 sm:w-20" />
        <Cloud className="absolute left-[4%] top-20 w-24 animate-drift" />
        <Cloud className="absolute right-[24%] top-6 hidden w-20 animate-drift opacity-80 [--drift:-30px] [animation-delay:-6s] md:block" />
      </div>

      <div className="container-pad relative">
        <SectionHeading content={content}
          eyebrow="Our Happy Day"
          icon={<Clock className="h-4 w-4" />}
          title={<>A little day at <span className="text-little-coral-500">Little Mahilam</span></>}
          lead="From the first hello to the happy goodbye, every hour has its own small adventure."
        />

        <div className="relative mt-12">
          <ol
            ref={track}
            data-fx-group=""
            onScroll={onScroll}
            aria-label="A typical day"
            className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%_-_88px)] pb-10 pt-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0"
          >
            {DAY.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.title} className="w-44 shrink-0 snap-center lg:w-auto">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`fx relative flex w-full flex-col items-center rounded-[30px] px-3 pb-6 pt-5 text-center outline-none transition-[scale,box-shadow] duration-300 ease-(--ease-back) focus-visible:ring-4 focus-visible:ring-little-blue-300 ${isActive ? "scale-108" : ""}`}
                    style={{ ...fx({ y: 30, d: i * 0.05, dur: 0.7, ease: "spring" }), background: item.bg, boxShadow: isActive ? `0 0 0 4px ${item.ring}, 0 24px 40px -24px rgba(36,68,32,.6)` : "0 14px 30px -24px rgba(36,68,32,.5)" }}
                  >
                    <span
                      aria-hidden
                      className={`grid h-16 w-16 place-items-center rounded-full bg-white text-3xl shadow-sm ${isActive ? "fx-cheer" : ""}`}
                    >
                      {item.emoji}
                    </span>
                    <span className="mt-3 rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-extrabold tabular-nums text-little-green-800">
                      {item.time} <span className="text-little-green-800/60">{item.meridiem}</span>
                    </span>
                    <span className="mt-2 font-display text-lg font-bold leading-tight text-little-green-950">{item.title}</span>
                    {/* Bubble tail pointing at the road */}
                    <span aria-hidden className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm" style={{ background: item.bg }} />
                  </button>
                </li>
              );
            })}
          </ol>

          {/* The road, with a school bus driving along it */}
          <div aria-hidden className="pointer-events-none relative -mt-4 h-16 overflow-hidden">
            <div className="absolute inset-x-0 bottom-2 h-7 rounded-full bg-little-neutral-600/85">
              <div className="absolute inset-x-4 top-1/2 h-1 -translate-y-1/2" style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0 18px, transparent 18px 34px)" }} />
            </div>
            <div className="absolute inset-0 animate-drive">
              <SchoolBus className="absolute bottom-4 left-0 w-20" />
            </div>
          </div>
          <Tree className="pointer-events-none absolute -bottom-1 left-0 hidden w-10 lg:block" />
          <Tree className="pointer-events-none absolute -bottom-1 right-0 hidden w-12 lg:block" />
        </div>
      </div>

      <Wave color={SECTION_BG.butter} flip className="absolute inset-x-0 bottom-0 h-14" />
    </section>
  );
}
