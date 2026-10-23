"use client";
import { useState, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { fx } from "@/components/animations/fx";
import { ArrowDown, PartyPopper } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { isOptimizable } from "@/lib/media";
import { Balloon, SECTION_BG, StarDoodle, Wave } from "@/components/about/Doodles";
import { Burst, Magnetic } from "@/components/programs/Fx";
import { SchoolCalendar, type CalendarEvent } from "./SchoolCalendar";


const FLAGS = [BRAND.coral[400], BRAND.yellow[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400]];
const BALLOONS = [
  { left: "6%", color: BRAND.pink[300], delay: "0s", size: "w-10" },
  { left: "22%", color: BRAND.yellow[400], delay: "-4s", size: "w-8" },
  { left: "48%", color: BRAND.blue[300], delay: "-7s", size: "w-9" },
  { left: "72%", color: BRAND.green[300], delay: "-2s", size: "w-8" },
  { left: "90%", color: BRAND.coral[300], delay: "-5.5s", size: "w-10" },
];

/** Bunting: a string of triangle flags that each sway on their own beat. */
export function Bunting({ count = 18, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative h-14 ${className}`}>
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-6 w-full"><path d="M0 4 Q 500 40 1000 4" stroke={BRAND.neutral[400]} strokeWidth="2" fill="none" /></svg>
      <div className="absolute inset-x-0 top-0 flex justify-between px-[1%]">
        {Array.from({ length: count }, (_, i) => {
          const t = i / (count - 1);
          const sag = Math.round(Math.sin(t * Math.PI) * 20);
          return (
            <span
              key={i}
              className="block h-9 w-7 origin-top animate-flag"
              style={{ marginTop: sag, background: FLAGS[i % FLAGS.length], clipPath: "polygon(0 0, 100% 0, 50% 100%)", animationDelay: `${-i * 0.23}s` } as CSSProperties}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Events hero: rising balloons, a live month calendar of school events and a confetti button. */
export function EventsHero({ calendar, photo }: { calendar: { today: string; events: CalendarEvent[] }; photo: string }) {
  const [pops, setPops] = useState(0);

  return (
    <section data-in="" className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${BRAND.yellow[50]} 0%, ${SECTION_BG.peach} 100%)` }}>
      {/* Balloons drifting up */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {BALLOONS.map((b) => (
          <span key={b.left} className="absolute bottom-[-80px] animate-rise" style={{ left: b.left, animationDelay: b.delay, ["--rise" as string]: "-640px" } as CSSProperties}>
            <Balloon color={b.color} className={b.size} />
          </span>
        ))}
      </div>

      <div className="container-pad relative grid items-center gap-10 pb-14 pt-8 lg:grid-cols-[1.05fr_.95fr] lg:pb-16 lg:pt-10">
        <div className="text-center lg:text-left">
          <span style={fx({ y: 16, dur: 0.6 })} className="fx inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-extrabold text-little-coral-700 shadow-sm">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-little-coral-400 text-white"><PartyPopper className="h-4 w-4" /></span>
            School calendar
          </span>
          <h1
            aria-label="Moments we share together"
            style={fx({ y: 24, d: 0.08, dur: 0.9, ease: "spring" })}
            className="fx mt-5 text-balance font-display text-[clamp(2.5rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-tight text-little-green-950"
          >
            Moments we share{" "}
            <span aria-hidden className="inline-block">
              {"together".split("").map((letter, i) => (
                <span
                  key={i}
                  className="fx inline-block transition-[translate,rotate] duration-300 ease-(--ease-back-strong) hover:-translate-y-2.5 hover:rotate-(--hover)"
                  style={{ ...fx({ y: -40, r: -20, d: 0.4 + i * 0.05, dur: 0.6, ease: "back-strong" }), "--hover": `${i % 2 ? 10 : -10}deg`, color: FLAGS[i % FLAGS.length] } as CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>
          <p style={fx({ y: 20, d: 0.18, dur: 0.6 })} className="fx mx-auto mt-5 max-w-xl text-lg leading-8 text-little-neutral-600 lg:mx-0">
            Celebrations, learning experiences and family connections make our school community special.
          </p>
          <div style={fx({ y: 20, d: 0.26, dur: 0.6 })} className="fx mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Magnetic>
              <a href="#upcoming-events" className="inline-flex h-12 items-center gap-2 rounded-full bg-little-green-900 px-6 text-[15px] font-extrabold text-white shadow-[0_16px_30px_-16px_rgba(36,68,32,.9)]">
                View Upcoming Events <ArrowDown className="h-4 w-4 animate-bounce text-little-yellow-400" />
              </a>
            </Magnetic>
            <span className="relative">
              <button
                type="button"
                onClick={() => setPops((n) => n + 1)}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-little-yellow-400 px-6 transition-[scale] hover:animate-[fx-jiggle_.4s_ease-in-out] active:scale-[.92] text-[15px] font-extrabold text-little-green-950 shadow-[0_14px_26px_-16px_rgba(185,143,19,.9)]"
              >
                🎉 Celebrate!
              </button>
              {pops > 0 && <Burst key={pops} count={26} spread={170} className="z-30" />}
            </span>
          </div>
        </div>

        {/* Flip calendar with a party photo peeking out */}
        <div className="relative mx-auto w-full max-w-[380px] pt-6">
          <div
            className="fx absolute -right-4 top-0 h-52 w-40 rotate-8 overflow-hidden rounded-[22px] border-[6px] border-white shadow-xl transition-[rotate,scale] duration-300 ease-(--ease-back) hover:rotate-2 hover:scale-105 sm:-right-10"
            style={fx({ x: -40, r: -8, d: 0.5, dur: 0.9, ease: "back" })}
          >
            <Image src={photo} alt="Children celebrating a school event" fill sizes="160px" unoptimized={!isOptimizable(photo)} className="object-cover" />
          </div>

          {/* Month calendar: flips down into place, opens on today */}
          <div className="fx-flip origin-top" style={{ ...fx({ d: 0.4, dur: 1.1, ease: "spring" }), "--fx-rx": "-70deg", "--fx-ry": "0deg" } as CSSProperties}>
            <SchoolCalendar today={calendar.today} events={calendar.events} />
          </div>
          <StarDoodle className="absolute -left-4 top-1/2 w-8 animate-twinkle" />
        </div>
      </div>

      <Wave color={SECTION_BG.cream} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}
