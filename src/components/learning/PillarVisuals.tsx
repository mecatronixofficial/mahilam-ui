"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Footprints, Leaf, MessageCircle, Music, Palette, Puzzle, Search, Shuffle, Sparkles, Sprout, Users, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { StarDoodle } from "@/components/about/Doodles";
import { Float } from "@/components/animations/FloatingShape";
import { prefersReducedMotion, useInView } from "@/components/animations/motion";
import { KidFace, LetterBlock } from "./Art";

/** Round trig results so server and browser render identical positions. */
const r2 = (v: number) => Math.round(v * 100) / 100;

/* ------------------------------------------------------------------
   Pillar 01 — three children, three different paths to the same star.
------------------------------------------------------------------- */

const PATHS = [
  { name: "The Explorer", note: "wanders, wonders and asks “why?”", color: BRAND.blue[500], hair: BRAND.green[900], variant: 0 as const, at: [50, 262], d: "M50 250 C 30 170, 140 210, 140 150 S 250 50, 320 84" },
  { name: "The Builder", note: "goes step by careful step", color: BRAND.coral[500], hair: BRAND.coral[800], variant: 2 as const, at: [170, 278], d: "M170 262 V222 H220 V178 H270 V134 H312 V96" },
  { name: "The Dreamer", note: "imagines first, then tries", color: BRAND.pink[500], hair: BRAND.yellow[700], variant: 1 as const, at: [292, 270], d: "M292 256 C 380 240, 220 196, 330 172 S 370 112, 330 96" },
];

export function ChildPaths() {
  const [active, setActive] = useState(0);
  return (
    <div className="relative">
      <div className="relative mx-auto aspect-[400/320] w-full max-w-[460px]">
        <svg aria-hidden viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {PATHS.map((p, i) => (
            <g key={p.name}>
              <path d={p.d} stroke={p.color} strokeOpacity=".22" strokeWidth="6" strokeDasharray="2 12" />
              <path
                d={p.d}
                pathLength={1}
                strokeDasharray="1"
                stroke={p.color}
                strokeWidth="7"
                className="transition-[stroke-dashoffset] duration-[1200ms] ease-(--ease-smooth) motion-reduce:transition-none"
                style={{ strokeDashoffset: active === i ? 0 : 1 }}
              />
            </g>
          ))}
        </svg>

        {/* The shared goal */}
        <span aria-hidden className="absolute left-[80%] top-[26%] w-[16%] -translate-x-1/2 -translate-y-1/2">
          <span key={active} className="block animate-[fx-cheer_.8s_ease-in-out_1s] motion-reduce:animate-none">
            <StarDoodle className="w-full drop-shadow-[0_8px_10px_rgba(220,181,28,.45)]" />
          </span>
        </span>
        <span className="absolute left-[80%] top-[8%] -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-little-green-900 shadow">Confident learner</span>

        {PATHS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            aria-pressed={active === i}
            aria-label={`${p.name}: ${p.note}`}
            onClick={() => setActive(i)}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(i); }}
            className="absolute w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[scale,translate] duration-300 ease-(--ease-back-strong) hover:scale-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-little-pink-400 aria-pressed:scale-115"
            style={{ left: `${(p.at[0] / 400) * 100}%`, top: `${(p.at[1] / 320) * 100}%` }}
          >
            <span className="block rounded-full bg-white p-[8%] shadow-[0_10px_18px_-10px_rgba(36,68,32,.7)] ring-4 transition-[--tw-ring-color]" style={{ "--tw-ring-color": active === i ? p.color : "transparent" } as CSSProperties}>
              <KidFace hair={p.hair} variant={p.variant} className="w-full" />
            </span>
          </button>
        ))}

        {/* Learning blocks bobbing around */}
        <Float className="absolute left-[2%] top-[4%] w-[13%]" amp={9} rotate={-10}><LetterBlock letter="1" color={BRAND.yellow[400]} className="w-full" /></Float>
        <Float className="absolute left-[44%] top-[2%] w-[10%]" amp={7} rotate={12} duration={6}><LetterBlock letter="b" color={BRAND.green[400]} className="w-full" /></Float>
      </div>

      <p aria-live="polite" className="mt-2 text-center font-display text-lg font-bold text-little-green-950">
        <span style={{ color: PATHS[active].color }}>{PATHS[active].name}</span> {PATHS[active].note}
      </p>
      <p className="text-center text-sm font-semibold text-little-neutral-500">Tap a child to see their path</p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Pillar 02 — a jigsaw that snaps together when it scrolls into view.
------------------------------------------------------------------- */

type Piece = { label: string; icon: LucideIcon; color: string; pos: string; scatter: string; radius: string; z: number; knobs: string[] };

const PIECES: Piece[] = [
  { label: "Discovery", icon: Search, color: BRAND.blue[300], pos: "left-0 top-0", scatter: "translate(-14%, -10%) rotate(-12deg)", radius: "rounded-tl-[28px]", z: 4, knobs: ["right", "bottom"] },
  { label: "Creativity", icon: Palette, color: BRAND.pink[300], pos: "left-1/2 top-0", scatter: "translate(16%, -14%) rotate(10deg)", radius: "rounded-tr-[28px]", z: 3, knobs: ["bottom"] },
  { label: "Communication", icon: MessageCircle, color: BRAND.yellow[300], pos: "left-0 top-1/2", scatter: "translate(-12%, 16%) rotate(9deg)", radius: "rounded-bl-[28px]", z: 2, knobs: ["right"] },
  { label: "Growth", icon: Sprout, color: BRAND.green[300], pos: "left-1/2 top-1/2", scatter: "translate(14%, 12%) rotate(-10deg)", radius: "rounded-br-[28px]", z: 1, knobs: [] },
];

const KNOB: Record<string, string> = {
  right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
};

export function PuzzlePlay() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -25% 0px" });
  const [solved, setSolved] = useState(false);
  const touched = useRef(false);

  // Snap together shortly after it appears — unless the visitor already played with it.
  useEffect(() => {
    if (!inView || touched.current) return;
    const id = window.setTimeout(() => setSolved(true), prefersReducedMotion() ? 0 : 700);
    return () => window.clearTimeout(id);
  }, [inView]);

  const toggle = () => { touched.current = true; setSolved((s) => !s); };

  return (
    <div ref={ref} className="relative">
      <div className="relative mx-auto aspect-square w-full max-w-[340px]">
        {PIECES.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.label}
              className={`group/piece absolute h-1/2 w-1/2 transition-transform duration-[900ms] ease-(--ease-back) motion-reduce:transition-none ${p.pos}`}
              style={{ transform: solved ? "none" : p.scatter, zIndex: p.z }}
            >
              <div className={`relative flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center ${p.radius}`} style={{ background: p.color }}>
                {p.knobs.map((k) => <span key={k} aria-hidden className={`absolute aspect-square w-[30%] rounded-full ${KNOB[k]}`} style={{ background: p.color }} />)}
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-little-green-950 transition-transform duration-500 ease-(--ease-back-strong) group-hover/piece:-translate-y-1 group-hover/piece:rotate-12 sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
                </span>
                <span className="relative font-display text-sm font-bold text-little-green-950 sm:text-base">{p.label}</span>
              </div>
            </div>
          );
        })}
        {/* A little sparkle when it's complete */}
        <span aria-hidden className={`pointer-events-none absolute -right-3 -top-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-little-yellow-400 text-little-green-950 shadow-lg transition-[scale,rotate] duration-500 ease-(--ease-back-strong) ${solved ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}>
          <Sparkles className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-little-green-950 shadow-[0_10px_20px_-14px_rgba(36,68,32,.7)] ring-2 ring-little-green-900/10 transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-little-yellow-100 focus-visible:outline-3 focus-visible:outline-little-pink-400"
        >
          {solved ? <Shuffle className="h-4 w-4" /> : <Puzzle className="h-4 w-4" />}
          {solved ? "Mix up the puzzle" : "Put the puzzle together"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Pillar 03 — a flower of strengths: pick a petal to read about it.
------------------------------------------------------------------- */

const STRENGTHS = [
  { name: "Music", icon: Music, color: BRAND.pink[300], text: "Rhymes, rhythm and songs that help memory and joy grow together." },
  { name: "Movement", icon: Footprints, color: BRAND.coral[300], text: "Dancing, balancing and active games that build body confidence." },
  { name: "Language", icon: MessageCircle, color: BRAND.yellow[300], text: "Stories, talk and new words that help children share their ideas." },
  { name: "Logic", icon: Puzzle, color: BRAND.blue[300], text: "Sorting, patterns and puzzles that make thinking playful." },
  { name: "Nature", icon: Leaf, color: BRAND.green[300], text: "Plants, weather and little creatures that spark big questions." },
  { name: "Art", icon: Palette, color: BRAND.pink[200], text: "Colours, shapes and making things that let imagination show." },
  { name: "Social", icon: Users, color: BRAND.blue[200], text: "Sharing, turn-taking and teamwork that grow kindness." },
];

const PETALS = STRENGTHS.map((s, i) => {
  const a = (i / STRENGTHS.length) * Math.PI * 2 - Math.PI / 2;
  return { ...s, x: r2(50 + Math.cos(a) * 37), y: r2(50 + Math.sin(a) * 37) };
});

export function StrengthFlower() {
  const [active, setActive] = useState(0);
  const current = PETALS[active];
  const Icon = current.icon;
  return (
    <div>
    <div className="relative mx-auto aspect-square w-full max-w-[420px] [container-type:inline-size]">
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="37" fill="none" stroke={BRAND.green[900]} strokeOpacity=".12" strokeWidth=".6" strokeDasharray="1.5 2.5" />
        {PETALS.map((p, i) => (
          <line key={p.name} x1="50" y1="50" x2={p.x} y2={p.y} stroke={BRAND.green[900]} strokeOpacity={i === active ? 0.5 : 0.1} strokeWidth={i === active ? 1 : 0.6} className="transition-[stroke-opacity] duration-300" />
        ))}
      </svg>

      {/* Centre: the chosen strength */}
      <div aria-live="polite" className="absolute left-1/2 top-1/2 flex aspect-square w-[44%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white p-3 text-center shadow-[0_20px_40px_-24px_rgba(36,68,32,.6)] ring-8 transition-[--tw-ring-color] duration-500" style={{ "--tw-ring-color": current.color } as CSSProperties}>
        <span key={current.name} className="flex flex-col items-center animate-pop motion-reduce:animate-none">
          <Icon className="h-6 w-6 text-little-green-900 sm:h-7 sm:w-7" strokeWidth={2.2} />
          <span className="mt-1 font-display text-base font-bold leading-tight text-little-green-950 sm:text-lg">{current.name}</span>
          <span className="mt-1 hidden text-xs font-semibold leading-snug text-little-neutral-600 sm:block">{current.text}</span>
        </span>
      </div>

      {PETALS.map((p, i) => {
        const PetalIcon = p.icon;
        const on = i === active;
        return (
          <button
            key={p.name}
            type="button"
            aria-pressed={on}
            aria-label={p.name}
            onClick={() => setActive(i)}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(i); }}
            onFocus={() => setActive(i)}
            className="group/petal absolute flex aspect-square w-[21%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[46%_54%_50%_50%/55%_45%_55%_45%] text-little-green-950 shadow-[0_10px_18px_-12px_rgba(36,68,32,.7)] transition-[scale,rotate] duration-300 ease-(--ease-back-strong) hover:scale-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-little-pink-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color, scale: on ? "1.14" : undefined, rotate: on ? "-6deg" : undefined }}
          >
            <PetalIcon className="h-5 w-5 transition-transform duration-500 group-hover/petal:rotate-[-14deg] sm:h-6 sm:w-6" strokeWidth={2.2} />
            <span className="mt-0.5 text-[clamp(8px,3cqw,11px)] font-extrabold uppercase tracking-normal">{p.name}</span>
          </button>
        );
      })}
    </div>
    {/* Phones: the description sits under the flower, where there's room to read it. */}
    <p aria-live="polite" className="mx-auto mt-3 max-w-xs text-center text-sm font-semibold leading-6 text-little-neutral-600 sm:hidden">{current.text}</p>
    </div>
  );
}
