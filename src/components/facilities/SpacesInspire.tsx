"use client";
import { useEffect, useRef, useState } from "react";
import { Compass, Footprints, MessageCircle, Palette, Rocket, Star, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";

type Pair = { skill: string; space: string; text: string; icon: LucideIcon; color: string };

const LINKS: Pair[] = [
  { skill: "Exploration", space: "Play spaces & activity zones", text: "Open shelves and discovery materials invite children to try things for themselves.", icon: Compass, color: BRAND.blue[300] },
  { skill: "Creativity", space: "Activity zones", text: "Room to paint, build and make lets ideas take shape.", icon: Palette, color: BRAND.pink[300] },
  { skill: "Communication", space: "Classrooms", text: "Circle time and small groups give every child a chance to speak and be heard.", icon: MessageCircle, color: BRAND.yellow[400] },
  { skill: "Imagination", space: "Reading corners", text: "Cosy book spaces turn stories into whole new worlds.", icon: Rocket, color: BRAND.coral[300] },
  { skill: "Movement", space: "Play spaces", text: "Space to move, balance and dance builds strong, confident bodies.", icon: Footprints, color: BRAND.green[400] },
  { skill: "Confidence", space: "Child-friendly design", text: "When a space is made for little hands, children can do more on their own.", icon: Star, color: BRAND.pink[200] },
];

/** Storytelling: a sticky word on the left changes as each space → skill pair scrolls past on the right. */
export function SpacesInspire() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = LINKS[active];
  const Icon = current.icon;

  return (
    <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-little-green-800/60">Spaces that inspire</p>
        <h2 className="mt-3 text-balance font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold leading-[1.08] text-little-green-950">Every space is <span className="text-little-green-700">a reason to learn.</span></h2>
        {/* The changing word (desktop) */}
        <div aria-hidden className="mt-8 hidden items-center gap-4 lg:flex">
          <span key={current.skill} className="grid h-20 w-20 animate-pop place-items-center rounded-[28px] text-little-green-950 shadow-[0_16px_30px_-20px_rgba(36,68,32,.7)] motion-reduce:animate-none" style={{ background: current.color }}>
            <Icon className="h-9 w-9" strokeWidth={2} />
          </span>
          <span key={`w-${current.skill}`} className="animate-fade-up font-display text-5xl font-bold text-little-green-950 motion-reduce:animate-none">{current.skill}</span>
        </div>
        <div aria-hidden className="mt-6 hidden gap-1.5 lg:flex">
          {LINKS.map((l, i) => <span key={l.skill} className="h-1.5 w-8 rounded-full transition-colors duration-300" style={{ background: i <= active ? current.color : BRAND.neutral[200] }} />)}
        </div>
      </div>

      <ol className="relative space-y-4">
        <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-0.5 bg-little-green-900/10" />
        {LINKS.map((l, i) => {
          const LIcon = l.icon;
          const on = i === active;
          return (
            <li key={l.skill} ref={(el) => { items.current[i] = el; }} data-index={i} className="relative flex items-start gap-4">
              <span className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 border-white text-little-green-950 shadow-md transition-[scale,background-color] duration-500 ${on ? "lg:scale-110" : ""}`} style={{ background: l.color }}>
                <LIcon className="h-6 w-6" />
              </span>
              <div className={`flex-1 rounded-[24px] bg-white p-5 transition-[opacity,translate,box-shadow] duration-500 lg:opacity-55 ${on ? "lg:translate-x-1 lg:opacity-100 lg:shadow-[0_18px_34px_-26px_rgba(36,68,32,.7)]" : ""}`}>
                <p className="text-xs font-extrabold uppercase tracking-[.16em] text-little-coral-600">{l.space}</p>
                <h3 className="mt-0.5 font-display text-xl font-bold text-little-green-950">→ {l.skill}</h3>
                <p className="mt-1 text-[15px] leading-7 text-little-neutral-600">{l.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
