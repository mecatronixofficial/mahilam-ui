"use client";
import { useState } from "react";
import { Hand, Handshake, MessageCircle, Mountain, Palette, Telescope, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { handwriting } from "@/components/about/fonts";

type Landmark = { place: string; skill: string; text: string; seen: string; icon: LucideIcon; color: string; x: number; y: number };

const LANDMARKS: Landmark[] = [
  { place: "Creativity Cove", skill: "Creativity", text: "Painting, building and pretend play let children turn ideas into something real.", seen: "A block tower that's secretly a rocket.", icon: Palette, color: BRAND.pink[300], x: 14, y: 32 },
  { place: "Confidence Peak", skill: "Confidence", text: "Trying, trying again and being cheered on helps children feel brave and capable.", seen: "“I did it by myself!”", icon: Mountain, color: BRAND.yellow[400], x: 37, y: 17 },
  { place: "Teamwork Bridge", skill: "Teamwork", text: "Group games and shared projects teach sharing, waiting and helping a friend.", seen: "Two friends carrying one big box together.", icon: Handshake, color: BRAND.green[400], x: 59, y: 38 },
  { place: "Chatter Lighthouse", skill: "Communication", text: "Songs, stories and show-and-tell help children speak up — and really listen.", seen: "A quiet child telling the class about their pet.", icon: MessageCircle, color: BRAND.blue[300], x: 85, y: 20 },
  { place: "Wiggle Meadow", skill: "Motor Skills", text: "Cutting, threading, climbing and dancing grow strong, steady hands and bodies.", seen: "Scissors that finally follow the line.", icon: Hand, color: BRAND.coral[300], x: 72, y: 73 },
  { place: "Wonder Cave", skill: "Curiosity", text: "Questions, little experiments and discovery keep young minds busy and bright.", seen: "“Why does the ice melt in my hand?”", icon: Telescope, color: BRAND.pink[200], x: 30, y: 72 },
];

const TRAIL = LANDMARKS.map((l, i) => {
  const x = l.x * 10;
  const y = l.y * 5.6;
  if (i === 0) return `M${x} ${y}`;
  const p = LANDMARKS[i - 1];
  return `Q ${((p.x + l.x) / 2) * 10 + (i % 2 ? 40 : -40)} ${((p.y + l.y) / 2) * 5.6 + (i % 2 ? -60 : 60)} ${x} ${y}`;
}).join(" ");

/** "Why Activities Matter" as a treasure map: each landmark is a skill; pick one to read what it looks like in class. */
export function LearningMap() {
  const [active, setActive] = useState(0);
  const current = LANDMARKS[active];
  const Icon = current.icon;

  const pick = (i: number) => setActive(i);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_.55fr] lg:items-center">
      {/* Map (tablet & desktop) */}
      <div className="relative hidden aspect-[1000/560] overflow-hidden rounded-[44px] border-[10px] border-white bg-little-blue-100 shadow-[0_30px_60px_-36px_rgba(36,68,32,.7)] md:block">
        <svg aria-hidden viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full">
          {/* Waves */}
          <g stroke="#fff" strokeOpacity=".7" strokeWidth="4" fill="none" strokeLinecap="round">
            {[[60, 500], [430, 520], [880, 480], [520, 80], [180, 120], [920, 330]].map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y} q 14 -12 28 0 t 28 0`} />)}
          </g>
          {/* Islands */}
          <path d="M40 240 C 20 120, 200 40, 330 70 C 460 20, 640 90, 700 200 C 760 110, 960 60, 970 200 C 990 320, 880 470, 720 470 C 600 520, 420 500, 300 470 C 150 470, 60 360, 40 240 Z" fill={BRAND.cream[200]} />
          <path d="M70 250 C 60 150, 210 80, 330 104 C 450 60, 620 120, 680 230 C 760 150, 930 110, 935 215 C 950 320, 860 440, 715 438 C 600 480, 430 466, 310 440 C 170 438, 80 350, 70 250 Z" fill={BRAND.green[100]} />
          {/* Trees & bumps */}
          {[[220, 380], [480, 120], [800, 400], [640, 300], [150, 200]].map(([x, y]) => (
            <g key={`t${x}`}><rect x={x - 3} y={y} width="6" height="16" rx="3" fill={BRAND.coral[700]} /><circle cx={x} cy={y - 4} r="14" fill={BRAND.green[400]} /></g>
          ))}
          {/* Trail */}
          <path d={TRAIL} fill="none" stroke={BRAND.coral[500]} strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" />
          {/* Compass */}
          <g transform="translate(905 470)">
            <circle r="40" fill="#fff" opacity=".85" />
            <path d="M0 -32 L8 0 L0 32 L-8 0 Z" fill={BRAND.coral[400]} />
            <path d="M-32 0 L0 -7 L32 0 L0 7 Z" fill={BRAND.blue[400]} />
            <text y="-42" textAnchor="middle" fontSize="16" fontWeight="800" fill={BRAND.green[900]} fontFamily="var(--font-fredoka), sans-serif">N</text>
          </g>
          {/* X marks the spot: the finish */}
          <path d="M270 418 L294 442 M294 418 L270 442" stroke={BRAND.pink[500]} strokeWidth="7" strokeLinecap="round" />
        </svg>

        {LANDMARKS.map((l, i) => {
          const LIcon = l.icon;
          const on = i === active;
          return (
            <button
              key={l.place}
              type="button"
              aria-pressed={on}
              onClick={() => pick(i)}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") pick(i); }}
              className="group/lm absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus-visible:outline-none"
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
            >
              <span className={`relative grid h-14 w-14 place-items-center rounded-[20px] border-4 border-white text-little-green-950 shadow-[0_12px_20px_-12px_rgba(36,68,32,.8)] transition-[scale,rotate] duration-400 ease-(--ease-back-strong) group-hover/lm:-rotate-6 group-hover/lm:scale-110 group-focus-visible/lm:ring-4 group-focus-visible/lm:ring-little-pink-300 lg:h-16 lg:w-16 ${on ? "scale-115 -rotate-6" : ""}`} style={{ background: l.color }}>
                <LIcon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={2.2} />
                {/* Flag on the chosen landmark */}
                <span aria-hidden className={`absolute -right-3 -top-5 origin-bottom-left transition-[scale,opacity] duration-300 ${on ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                  <svg viewBox="0 0 24 30" className="w-6"><path d="M3 2 V30" stroke={BRAND.green[900]} strokeWidth="2.5" /><path d="M4 3 H21 L16 9 L21 15 H4 Z" fill={BRAND.coral[500]} /></svg>
                </span>
              </span>
              <span className={`mt-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 font-display text-xs font-bold transition-colors lg:text-sm ${on ? "bg-little-green-900 text-white" : "bg-white/85 text-little-green-950"}`}>{l.place}</span>
            </button>
          );
        })}
      </div>

      {/* Trail list (phones) */}
      <ol className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 md:hidden">
        {LANDMARKS.map((l, i) => {
          const LIcon = l.icon;
          const on = i === active;
          return (
            <li key={l.place}>
              <button type="button" aria-pressed={on} onClick={() => pick(i)} className={`flex w-full items-center gap-2 rounded-2xl p-2 text-left transition-colors focus-visible:outline-3 focus-visible:outline-little-pink-400 ${on ? "bg-little-green-900 text-white" : "bg-white text-little-green-950"}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-little-green-950" style={{ background: l.color }}><LIcon className="h-5 w-5" /></span>
                <span className="font-display text-sm font-bold leading-tight">{l.skill}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Legend: the chosen landmark */}
      <div aria-live="polite" className="relative">
        <div key={active} className="animate-fade-up rounded-[32px] bg-white p-6 shadow-[0_24px_40px_-30px_rgba(36,68,32,.7)] motion-reduce:animate-none">
          <span className="grid h-14 w-14 place-items-center rounded-[20px] text-little-green-950" style={{ background: current.color }}><Icon className="h-7 w-7" /></span>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800/55">{current.place}</p>
          <h3 className="mt-0.5 font-display text-3xl font-bold text-little-green-950">{current.skill}</h3>
          <p className="mt-2 text-[15px] leading-7 text-little-neutral-600">{current.text}</p>
          <p className="mt-4 rounded-2xl bg-little-cream-100 px-4 py-3 text-sm font-semibold text-little-green-900">
            <span className="block text-[11px] font-extrabold uppercase tracking-[.16em] text-little-green-800/55">You might spot</span>
            <span className={`${handwriting.className} text-xl font-bold`}>{current.seen}</span>
          </p>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {LANDMARKS.map((l, i) => <span key={l.place} className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: i === active ? BRAND.coral[400] : BRAND.neutral[200] }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
