"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import Image from "@/components/media/SchoolImage";
import { Hand, HeartHandshake, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Balloon, StarDoodle } from "@/components/about/Doodles";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Appear } from "@/components/animations/Appear";
import { Float } from "@/components/animations/FloatingShape";
import { Crayon, LetterBlock, PuzzlePiece } from "./Art";
import { Eyebrow, type Photo } from "@/components/public/PageKit";
import styles from "./learning.module.css";

export type PlayScene = Photo;

const MOMENTS: { label: string; icon: LucideIcon; color: string; caption: string; text: string }[] = [
  { label: "Hands-on", icon: Hand, color: BRAND.yellow[300], caption: "Learning by touching & making", text: "Sand, water, clay and blocks turn ideas like size, shape and number into something children can hold." },
  { label: "Together", icon: HeartHandshake, color: BRAND.pink[200], caption: "Learning with friends", text: "Shared games and group projects teach patience, kindness and how to work as a team." },
  { label: "Imagination", icon: Rocket, color: BRAND.blue[200], caption: "Learning through pretend", text: "Dress-up, puppets and role play let children try out new words, feelings and big ideas." },
];

/** "Learning Through Play": statement on the left; a morphing photo frame on the right that opens each new scene as a circle. */
export function PlayStory({ scenes }: { scenes: PlayScene[] }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  const choose = (i: number, event?: MouseEvent<HTMLButtonElement>) => {
    if (i === active) return;
    // Open the new photo from the side of the frame nearest the chosen button.
    if (event) setOrigin({ x: "0%", y: `${20 + i * 30}%` });
    setPrev(active);
    setActive(i);
  };

  const scene = scenes[active % scenes.length];
  const before = prev === null ? null : scenes[prev % scenes.length];
  const moment = MOMENTS[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
      {/* Words */}
      <div className="relative text-center lg:text-left">
        <Appear y={16} className="inline-block">
          <Eyebrow icon={<Sparkles className="h-4 w-4 text-little-coral-500" />}>Learning Through Play</Eyebrow>
        </Appear>
        <AnimatedText className="mt-5 text-balance font-display text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-[1.04] text-little-green-950">
          Play is how little ones <span className="text-little-coral-500">understand</span> the big world.
        </AnimatedText>
        <Appear d={0.2} className="mx-auto mt-5 max-w-xl space-y-3 text-[17px] leading-8 text-little-neutral-600 lg:mx-0">
          <p>When children play, they are busy testing ideas, solving problems, using new words and getting along with others.</p>
          <p>Our teachers plan that play with care — so every game, song and messy-art moment quietly builds skills for school and for life.</p>
        </Appear>

        {/* Scene picker */}
        <Appear d={0.3} className="mt-7">
          <div role="group" aria-label="Choose a way children play" className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {MOMENTS.map((m, i) => {
              const Icon = m.icon;
              const on = i === active;
              return (
                <button
                  key={m.label}
                  type="button"
                  aria-pressed={on}
                  onClick={(e) => choose(i, e)}
                  className={`group/tab inline-flex items-center gap-2 rounded-full py-2 pl-2 pr-4 font-display text-sm font-bold text-little-green-950 transition-[background-color,translate,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400 ${on ? "shadow-[0_12px_22px_-14px_rgba(36,68,32,.8)]" : "bg-white/70"}`}
                  style={on ? { background: m.color } : undefined}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-(--ease-back-strong) group-hover/tab:rotate-12 ${on ? "bg-white" : "bg-little-cream-100"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {m.label}
                </button>
              );
            })}
          </div>
          <p key={active} aria-live="polite" className="mx-auto mt-4 max-w-xl animate-fade-up text-[15px] font-semibold leading-7 text-little-green-900 motion-reduce:animate-none lg:mx-0">{moment.text}</p>
        </Appear>

        <Crayon color={BRAND.blue[400]} className="pointer-events-none absolute -left-10 -top-4 hidden w-24 -rotate-[24deg] xl:block" />
        <LetterBlock letter="P" color={BRAND.yellow[400]} className="pointer-events-none absolute -bottom-6 right-[6%] hidden w-12 rotate-12 lg:block" />
      </div>

      {/* Picture composition */}
      <Appear d={0.1} y={40} r={3} className="relative mx-auto w-full max-w-[460px]">
        <span aria-hidden className="absolute -inset-5 rotate-6 rounded-[44%_56%_52%_48%/52%_44%_56%_48%] transition-colors duration-700" style={{ background: moment.color }} />
        <div className={`relative aspect-[4/4.4] overflow-hidden border-[10px] border-white bg-little-cream-100 shadow-[0_30px_60px_-30px_rgba(36,68,32,.55)] ${styles.morph}`} style={{ borderRadius: "58% 42% 55% 45% / 48% 56% 44% 52%" }}>
          {before && <Image src={before.src} alt="" unoptimized={before.unoptimized} fill sizes="(min-width: 1024px) 440px, 90vw" className="object-cover" />}
          <div key={active} className={`absolute inset-0 ${prev === null ? "" : styles.iris}`} style={{ "--iris-x": origin.x, "--iris-y": origin.y } as CSSProperties}>
            <Image src={scene.src} alt={scene.alt} unoptimized={scene.unoptimized} fill sizes="(min-width: 1024px) 440px, 90vw" className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-105" />
          </div>
          <span key={`c${active}`} className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pop whitespace-nowrap rounded-full bg-white/95 px-4 py-2 font-display text-sm font-bold text-little-green-950 shadow-lg motion-reduce:animate-none">
            {moment.caption}
          </span>
        </div>

        {/* Floating objects */}
        <Float className="absolute -right-4 top-4 w-14" amp={10} rotate={14}><PuzzlePiece color={BRAND.green[400]} className="w-full" /></Float>
        <Float className="absolute -left-6 top-[38%] w-10" amp={12} duration={6}><Balloon color={BRAND.yellow[400]} className="w-full" /></Float>
        <Float className="absolute -bottom-4 right-[18%] w-12" amp={7} rotate={-10}><LetterBlock letter="Y" color={BRAND.pink[400]} className="w-full" /></Float>
        <StarDoodle color={BRAND.coral[400]} className="pointer-events-none absolute -left-2 bottom-10 w-7 animate-twinkle" />
      </Appear>
    </div>
  );
}
