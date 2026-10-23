"use client";
import { useEffect, useRef, useState } from "react";
import { fx } from "@/components/animations/fx";
import { useInView } from "@/components/animations/motion";
import { BookOpen, Brain, Heart, Palette, Puzzle, Users, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SECTION_BG, StarDoodle, Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";

const AREAS: { icon: LucideIcon; title: string; description: string; bg: string; ink: string }[] = [
  { icon: BookOpen, title: "Language", description: "Stories, phonics, vocabulary, speaking, listening and early reading skills.", bg: BRAND.yellow[200], ink: BRAND.yellow[800] },
  { icon: Brain, title: "Thinking Skills", description: "Observation, reasoning, problem-solving and age-appropriate concept learning.", bg: BRAND.green[200], ink: BRAND.green[800] },
  { icon: Palette, title: "Creativity", description: "Art, craft, colours, music and imaginative activities for self-expression.", bg: BRAND.coral[200], ink: BRAND.coral[700] },
  { icon: Users, title: "Social Growth", description: "Sharing, teamwork, communication, friendship and positive classroom interaction.", bg: BRAND.blue[200], ink: BRAND.blue[700] },
  { icon: Puzzle, title: "Hands-On Learning", description: "Puzzles, activities, games and practical experiences that make learning meaningful.", bg: BRAND.pink[100], ink: BRAND.pink[700] },
  { icon: Heart, title: "Emotional Growth", description: "Confidence, independence, empathy and a sense of belonging in the classroom.", bg: BRAND.pink[200], ink: BRAND.pink[800] },
];

const AUTOPLAY_MS = 3200;

/** Six learning areas orbiting a "whole child" centre. Hover, focus or tap a planet to read about it. */
export function SkillsOrbit() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20% 0px" });
  const area = AREAS[active];
  const Icon = area.icon;

  // Gently cycle through the areas until the visitor picks one.
  useEffect(() => {
    if (touched || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((a) => (a + 1) % AREAS.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [touched, inView]);

  const pick = (i: number) => { setTouched(true); setActive(i); };

  const centre = (
      <div
        key={area.title}
        data-in=""
        className="fx flex flex-col items-center px-6 text-center"
        style={fx({ s: 0.85, dur: 0.5, ease: "back" })}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: area.bg, color: area.ink }}><Icon className="h-7 w-7" /></span>
        <h3 className="mt-3 font-display text-2xl font-bold text-little-green-950">{area.title}</h3>
        <p className="mt-2 text-sm leading-6 text-little-neutral-600">{area.description}</p>
      </div>
  );

  return (
    <section className="relative overflow-hidden py-6 md:py-8" style={{ background: SECTION_BG.sky }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <StarDoodle className="absolute left-[10%] top-[30%] w-6 animate-twinkle" />
        <StarDoodle color={BRAND.pink[200]} className="absolute right-[12%] top-[62%] w-5 animate-twinkle [animation-delay:-1.4s]" />
        <StarDoodle color={BRAND.blue[300]} className="absolute right-[24%] top-[18%] w-4 animate-twinkle [animation-delay:-2.2s]" />
      </div>

      <div className="container-pad relative" ref={ref}>
        <SectionHeading
          eyebrow="Whole Child Development"
          icon={<Brain className="h-4 w-4" />}
          title={<>Learning goes <span className="text-little-pink-500">beyond books.</span></>}
          lead="Our programs focus on academic readiness along with communication, creativity, confidence, movement and emotional development."
        />

        {/* Desktop / tablet orbit */}
        <div className="relative mx-auto mt-5 hidden aspect-square w-full max-w-[560px] md:block">
          <span aria-hidden className="absolute inset-[13%] animate-[spin_70s_linear_infinite] rounded-full border-[3px] border-dashed border-little-blue-300" />
          {/* Two little satellites travel around the ring */}
          <span aria-hidden className="absolute inset-[13%] animate-[spin_14s_linear_infinite]">
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-little-coral-400 shadow-[0_0_0_4px_rgba(255,255,255,.8)]" />
          </span>
          <span aria-hidden className="absolute inset-[13%] animate-[spin_22s_linear_infinite] [animation-direction:reverse]">
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-little-yellow-400 shadow-[0_0_0_3px_rgba(255,255,255,.8)]" />
          </span>
          <span aria-hidden className="absolute inset-[24%] rounded-full bg-white/60" />
          <div className="absolute inset-[28%] grid place-items-center rounded-full bg-white shadow-[0_24px_60px_-30px_rgba(36,68,32,.55)]" aria-live="polite">
            {centre}
          </div>
          {AREAS.map((a, i) => {
            const angle = (i / AREAS.length) * Math.PI * 2 - Math.PI / 2;
            const left = Math.round((50 + Math.cos(angle) * 37) * 100) / 100;
            const top = Math.round((50 + Math.sin(angle) * 37) * 100) / 100;
            const selected = i === active;
            const AreaIcon = a.icon;
            return (
              <button
                key={a.title}
                type="button"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                aria-pressed={selected}
                className={`group/planet absolute flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center outline-none transition-[scale,box-shadow,transform] duration-300 ease-(--ease-back-strong) hover:[transform:translateY(-6px)] focus-visible:ring-4 focus-visible:ring-little-blue-300 ${selected ? "scale-114" : ""}`}
                style={{ left: `${left}%`, top: `${top}%`, background: a.bg, color: a.ink, boxShadow: selected ? "0 0 0 6px #fff, 0 18px 30px -16px rgba(36,68,32,.6)" : "0 10px 22px -16px rgba(36,68,32,.5)" }}
              >
                <span className="inline-flex transition-[scale] duration-300 group-hover/planet:scale-115 group-hover/planet:animate-[fx-jiggle_.6s_ease-in-out]">
                  <AreaIcon className="h-7 w-7" />
                </span>
                <span className="mt-1 px-2 font-display text-[13px] font-bold leading-tight text-little-green-950">{a.title}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile: centre card + chips */}
        <div className="mt-5 md:hidden">
          <div className="grid min-h-56 place-items-center rounded-[32px] bg-white py-7 shadow-[0_24px_50px_-34px_rgba(36,68,32,.55)]" aria-live="polite">{centre}</div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {AREAS.map((a, i) => {
              const AreaIcon = a.icon;
              return (
                <button
                  key={a.title}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={i === active}
                  className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center ring-2 transition"
                  style={{ background: a.bg, color: a.ink, ["--tw-ring-color" as string]: i === active ? a.ink : "transparent" }}
                >
                  <AreaIcon className="h-5 w-5" />
                  <span className="font-display text-xs font-bold leading-tight text-little-green-950">{a.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Wave color={SECTION_BG.peach} flip className="absolute inset-x-0 bottom-0 h-5" />
    </section>
  );
}
