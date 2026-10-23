"use client";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { fx } from "@/components/animations/fx";
import { ArrowRight, BookOpen, Pencil, Play, Smile, Star, X } from "lucide-react";
import { Lion } from "./HeroAnimals";
import { BRAND } from "@/lib/brand";
import { useSessionPopup } from "@/lib/use-session-popup";

/* ------------------------------------------------------------------ tuning */

const GOAL = 5;
const SPAWN_MS = 800;
const MAX_LIVE = 4;
const SPEED: [number, number] = [85, 115]; // px/s → roughly 2.5s from top to the lion
const ITEM = 40; // falling item size (px)
const MASCOT_W = 92;
const CATCH_RADIUS = 52; // horizontal reach either side of the lion's centre (px)
const CATCH_TOP = 96; // catch band, measured up from the game area's bottom edge (px)
const CATCH_BOTTOM = 22;
const KEY_STEP = 56;

type Kind = "star" | "balloon" | "pencil" | "book" | "block" | "smile";
const KINDS: Kind[] = ["star", "balloon", "pencil", "book", "block", "smile", "star"];
const LETTERS = ["A", "B", "C", "D"];

type Drop = { id: number; kind: Kind; letter: string };
type Live = { x: number; y: number; speed: number; el: HTMLDivElement | null };
type Burst = { id: number; x: number; y: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/* ------------------------------------------------------------------ popup */

export type AdmissionsGamePopupProps = {
  /** Remembered in sessionStorage once dismissed, so the popup shows once per visit. */
  sessionKey?: string;
  academicYear?: string;
  /** Optional admission details (e.g. the CMS announcement text), shown after the game or on skip. */
  details?: string | null;
  applyHref?: string;
  applyLabel?: string;
  exploreHref?: string;
  delayMs?: number;
  onClose?: () => void;
};

/** "Admissions Open" advert with an optional 5-second "Catch the Stars" mini game. */
export function AdmissionsGamePopup({
  sessionKey = "admissions-game",
  academicYear = "2026–27",
  details,
  applyHref = "/admissions",
  applyLabel = "Apply for Admission",
  exploreHref = "/about",
  delayMs = 1200,
  onClose,
}: AdmissionsGamePopupProps) {
  const [open, close] = useSessionPopup(sessionKey, delayMs);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [score, setScore] = useState(0);

  const dismiss = useCallback(() => { close(); onClose?.(); }, [close, onClose]);
  const handleCatch = useCallback(() => setScore((s) => Math.min(s + 1, GOAL)), []);
  const skip = () => { setSkipped(true); setCompleted(true); };

  // Let the last catch "pop" before swapping in the celebration.
  useEffect(() => {
    if (score < GOAL || completed) return;
    const timer = window.setTimeout(() => setCompleted(true), 450);
    return () => window.clearTimeout(timer);
  }, [score, completed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  return (
    <>
      {open && (
            <div
              key="admissions-popup"
              className="fixed inset-0 z-[60] grid animate-[fx-fade_.25s_ease-out] place-items-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admissions-popup-title"
            >
              <button type="button" aria-label="Close admissions popup" onClick={dismiss} className="absolute inset-0 bg-little-green-950/50 backdrop-blur-[3px]" />

              <div
                data-in=""
                style={fx({ s: 0.88, y: 28, dur: 0.6, ease: "back" })}
                className="fx relative max-h-[92dvh] w-full max-w-[640px] overflow-y-auto overflow-x-hidden rounded-[32px] bg-little-cream shadow-[0_40px_90px_-30px_rgba(21,42,18,.6),0_0_0_1px_rgba(255,255,255,.7)_inset] hide-scrollbar sm:rounded-[38px]"
              >
                <CardDoodles />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-3 px-5 pt-5 sm:px-8 sm:pt-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[.22em] text-little-green-800">Admissions {academicYear}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-little-green-100 px-2.5 py-1 text-[11px] font-extrabold text-little-green-800 ring-1 ring-little-green-200">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-little-green-500 opacity-60" />
                        <span className="relative h-2 w-2 rounded-full bg-little-green-500" />
                      </span>
                      Now Open
                    </span>
                  </div>
                  <button type="button" onClick={dismiss} aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-little-neutral-600 shadow-[0_6px_16px_-8px_rgba(21,42,18,.5)] transition hover:rotate-90 hover:text-little-neutral-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative px-5 sm:px-8">
                  <h2 id="admissions-popup-title" className="mt-1 text-balance font-display text-[1.6rem] font-bold leading-tight text-little-green-950 sm:text-[2rem]">
                    Admissions Open <span className="text-little-coral-500">{academicYear}</span>
                  </h2>
                  <p className="mt-1 text-[15px] leading-6 text-little-neutral-600">A happy beginning for every little learner.</p>
                </div>

                {/* Game area */}
                <div className="relative mx-3 mt-4 h-[236px] overflow-hidden rounded-[26px] bg-gradient-to-b from-little-blue-100 via-little-blue-50 to-little-yellow-50 ring-1 ring-little-blue-200/70 sm:mx-8 sm:h-[280px] sm:rounded-[30px]">
                  <SkyDecor />
                    {completed ? (
                      <WinPanel key="win" skipped={skipped} academicYear={academicYear} details={details} />
                    ) : started ? (
                      <div key="game" className="absolute inset-0 animate-[fx-fade_.3s_ease-out]">
                        <CatchGame onCatch={handleCatch} paused={score >= GOAL} />
                        <ScoreBadge score={score} />
                        <button type="button" onClick={skip} className="absolute right-3 top-3 z-20 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-extrabold text-little-neutral-600 shadow-sm transition hover:bg-white hover:text-little-neutral-900">
                          Skip game
                        </button>
                      </div>
                    ) : (
                      <IntroPanel key="intro" onPlay={() => setStarted(true)} onSkip={skip} />
                    )}
                </div>

                {/* CTAs — always visible: this is an advert first, a game second */}
                <div
                  className={`relative grid gap-2.5 px-5 pb-5 pt-4 [--fx-pulse:1.04] sm:grid-cols-[1.2fr_1fr] sm:px-8 sm:pb-7 sm:pt-5 ${completed && !skipped ? "animate-[fx-pulse_.6s_ease-in-out_.5s]" : ""}`}
                >
                  <BounceLink href={applyHref} onClick={dismiss} className="bg-little-green-900 text-white shadow-[0_14px_28px_-14px_rgba(36,68,32,.85)]">
                    {applyLabel}
                    <ArrowRight className="h-4 w-4 text-little-yellow-400 transition group-hover:translate-x-0.5" />
                  </BounceLink>
                  <BounceLink href={exploreHref} onClick={dismiss} className="bg-little-yellow-400 text-little-green-950 hover:bg-little-yellow-300">
                    Explore Our School
                  </BounceLink>
                </div>
              </div>
            </div>
      )}
    </>
  );
}

function BounceLink({ href, onClick, className, children }: { href: string; onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <div className="transition-[translate,scale] duration-300 ease-(--ease-back-strong) hover:-translate-y-[3px] active:scale-[.97]">
      <Link href={href} onClick={onClick} className={`group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold transition-colors sm:h-[52px] ${className}`}>
        {children}
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ game states */

function IntroPanel({ onPlay, onSkip }: { onPlay: () => void; onSkip: () => void }) {
  return (
    <div data-in="" className="fx absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center" style={fx({ y: 10, dur: 0.4 })}>
      <div className="fx-hop" style={{ "--fx-hop": "-6px", "--fx-dur": "1.8s" } as CSSProperties}>
        <Lion className="w-[72px] drop-shadow-md sm:w-20" />
      </div>
      <p className="mt-2 font-display text-lg font-bold text-little-green-950 sm:text-xl">Catch {GOAL} stars with our little lion</p>
      <p className="mt-0.5 text-[13px] text-little-neutral-600 sm:text-sm">Move or tap to catch the falling stars, books and balloons.</p>
      <div className="mt-4 flex items-center gap-2">
        <button type="button" autoFocus onClick={onPlay} className="inline-flex transition-[translate,scale] duration-300 ease-(--ease-back-strong) hover:-translate-y-0.5 active:scale-[.96] h-11 items-center gap-2 rounded-full bg-little-coral-500 px-6 text-sm font-extrabold text-white shadow-[0_12px_24px_-12px_rgba(232,94,75,.9)]">
          <Play className="h-4 w-4 fill-current" /> Play
        </button>
        <button type="button" onClick={onSkip} className="inline-flex h-11 items-center rounded-full bg-white/80 px-5 text-sm font-extrabold text-little-neutral-600 ring-1 ring-black/5 transition hover:bg-white hover:text-little-neutral-900">
          Skip game
        </button>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-little-green-900 shadow-sm" aria-live="polite">
      <Star className="h-4 w-4 fill-little-yellow-400 text-little-yellow-500" />
      <span className="relative inline-flex w-3 justify-center overflow-hidden">
          <span key={score} className="animate-[fx-in_.35s_var(--ease-back)] [--fx-s:1.4] [--fx-y:-14px]">
            {score}
          </span>
      </span>
      <span className="text-little-neutral-400">/ {GOAL}</span>
    </div>
  );
}

const PILLARS = [
  { word: "Play", bg: BRAND.yellow[100], ink: BRAND.yellow[800] },
  { word: "Learn", bg: BRAND.blue[100], ink: BRAND.blue[800] },
  { word: "Grow", bg: BRAND.green[100], ink: BRAND.green[800] },
  { word: "Shine", bg: BRAND.pink[50], ink: BRAND.pink[700] },
];

function WinPanel({ skipped, academicYear, details }: { skipped: boolean; academicYear: string; details?: string | null }) {
  return (
    <div data-in="" className="fx absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/45 px-5 text-center" style={fx({ s: 0.94, dur: 0.5, ease: "back" })}>
      {!skipped && <Confetti />}
      <p className="fx relative font-display text-2xl font-bold text-little-green-950 sm:text-[2rem]" style={fx({ s: 0.6, d: 0.1, dur: 0.5, ease: "back-strong" })}>
        {skipped ? "Welcome, little learner!" : "🎉 Yay! You did it!"}
      </p>
      <p className="relative mt-1.5 text-base font-extrabold text-little-coral-600 sm:text-lg">Admissions Open {academicYear}</p>
      <p className="relative mt-0.5 line-clamp-2 max-w-md text-[13px] leading-5 text-little-neutral-600 sm:text-sm">{details || "A happy beginning for every little learner."}</p>
      <ul className="relative mt-3 flex flex-wrap justify-center gap-1.5">
        {PILLARS.map(({ word, bg, ink }, i) => (
          <li key={word} className="fx rounded-full px-3 py-1 text-xs font-extrabold" style={{ ...fx({ y: 8, d: 0.25 + i * 0.08, dur: 0.4 }), background: bg, color: ink }}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}

const CONFETTI_COLORS = [BRAND.yellow[400], BRAND.coral[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400], BRAND.yellow[300]];

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    id: i,
    x: rand(-260, 260),
    y: rand(-130, -40),
    fall: rand(140, 220),
    rotate: rand(-300, 300),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 === 0,
    size: rand(6, 10),
    delay: rand(0, 0.15),
  })), []);
  const stars = useMemo(() => [
    { left: "12%", top: "22%", size: 18 }, { left: "84%", top: "18%", size: 22 }, { left: "20%", top: "76%", size: 14 }, { left: "80%", top: "72%", size: 16 },
  ], []);

  return (
    <div aria-hidden data-in="" className="pointer-events-none absolute inset-0">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`fx-confetti absolute left-1/2 top-1/2 ${p.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ width: p.size, height: p.round ? p.size : p.size * 0.5, background: p.color, "--cx": `${p.x}px`, "--cy": `${p.y}px`, "--cr": `${p.rotate}deg`, "--cfall": `${p.fall}px`, "--fx-d": `${p.delay}s` } as CSSProperties}
        />
      ))}
      {stars.map((s, i) => (
        <span key={i} className="fx absolute" style={{ ...fx({ s: 0, o: 1, r: -40, d: 0.15 + i * 0.1, dur: 0.5, ease: "back-strong" }), left: s.left, top: s.top }}>
          <Star className="fill-little-yellow-400 text-little-yellow-500" style={{ width: s.size, height: s.size }} />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ the game */

/**
 * Falling items are positioned by one requestAnimationFrame loop that writes transforms straight to the DOM,
 * so React only re-renders when an item spawns, is caught or leaves the area — never per frame.
 */
const CatchGame = memo(function CatchGame({ onCatch, paused }: { onCatch: () => void; paused: boolean }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const size = useRef({ w: 0, h: 0 });
  const live = useRef(new Map<number, Live>());
  const nextId = useRef(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);

  // The lion follows the pointer on a small spring, simulated in the same frame loop as the drops.
  const lion = useRef({ x: 0, v: 0, target: 0 });
  const lionRef = useRef<HTMLDivElement>(null);
  const placeLion = () => { if (lionRef.current) lionRef.current.style.transform = `translateX(${lion.current.x}px)`; };

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => { size.current = { w: el.clientWidth, h: el.clientHeight }; };
    measure();
    lion.current = { x: size.current.w / 2, v: 0, target: size.current.w / 2 };
    placeLion();
    el.focus({ preventScroll: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const collect = useCallback((id: number) => {
    const drop = live.current.get(id);
    if (!drop) return;
    live.current.delete(id);
    setDrops((list) => list.filter((d) => d.id !== id));
    setBursts((list) => [...list, { id, x: drop.x, y: drop.y }]);
    onCatch();
  }, [onCatch]);

  // Spawner — drops land near the lion so the game stays easy for little hands.
  useEffect(() => {
    if (paused) return;
    const spawn = () => {
      const { w } = size.current;
      if (!w || live.current.size >= MAX_LIVE) return;
      const id = ++nextId.current;
      const x = clamp(lion.current.x + (Math.random() - 0.5) * w * (id === 1 ? 0 : 0.6), ITEM, w - ITEM);
      live.current.set(id, { x, y: -ITEM, speed: rand(...SPEED), el: null });
      setDrops((list) => [...list, { id, kind: id === 1 ? "star" : KINDS[Math.floor(Math.random() * KINDS.length)], letter: LETTERS[id % LETTERS.length] }]);
    };
    spawn();
    const timer = window.setInterval(spawn, SPAWN_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  // Physics loop.
  useEffect(() => {
    if (paused) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const { h } = size.current;
      // Lion spring (stiffness 320, damping 30, mass 0.6), in small steps so it stays stable.
      const l = lion.current;
      for (let i = 0; i < 4; i++) {
        const step = dt / 4;
        l.v += ((320 * (l.target - l.x) - 30 * l.v) / 0.6) * step;
        l.x += l.v * step;
      }
      placeLion();
      const lionX = l.x;
      const missed: number[] = [];
      live.current.forEach((drop, id) => {
        drop.y += drop.speed * dt;
        const centreY = drop.y + ITEM / 2;
        if (centreY >= h - CATCH_TOP && centreY <= h - CATCH_BOTTOM && Math.abs(drop.x - lionX) <= CATCH_RADIUS) {
          collect(id);
          return;
        }
        if (drop.y > h) {
          live.current.delete(id);
          missed.push(id);
          return;
        }
        if (drop.el) drop.el.style.transform = `translate3d(${drop.x - ITEM / 2}px, ${drop.y}px, 0)`;
      });
      if (missed.length) setDrops((list) => list.filter((d) => !missed.includes(d.id)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, collect]);

  const moveTo = (clientX: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    lion.current.target = clamp(clientX - rect.left, MASCOT_W / 2, rect.width - MASCOT_W / 2);
  };
  const onPointer = (event: ReactPointerEvent<HTMLDivElement>) => moveTo(event.clientX);
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowLeft" ? -KEY_STEP : event.key === "ArrowRight" ? KEY_STEP : 0;
    if (!step) return;
    event.preventDefault();
    lion.current.target = clamp(lion.current.target + step, MASCOT_W / 2, size.current.w - MASCOT_W / 2);
  };

  return (
    <div
      ref={areaRef}
      tabIndex={0}
      role="application"
      aria-label="Catch the stars game. Use the left and right arrow keys, or move and tap, to move the lion."
      onPointerDown={onPointer}
      onPointerMove={onPointer}
      onKeyDown={onKeyDown}
      className="absolute inset-0 cursor-pointer touch-none select-none outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-little-blue-300"
    >
      {drops.map((drop) => (
        <div
          key={drop.id}
          ref={(el) => {
            const state = live.current.get(drop.id);
            if (!state) return;
            state.el = el;
            if (el) el.style.transform = `translate3d(${state.x - ITEM / 2}px, ${state.y}px, 0)`;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: ITEM, height: ITEM, transform: "translate3d(-100px, -100px, 0)" }}
          // Tapping an item catches it too — handy on phones.
          onPointerDown={(event) => { event.stopPropagation(); collect(drop.id); }}
        >
          <DropArt kind={drop.kind} letter={drop.letter} />
        </div>
      ))}

        {bursts.map((burst) => (
          <div
            key={burst.id}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 flex animate-[fx-pop-out_.55s_ease-out_forwards] items-center justify-center"
            style={{ width: ITEM, height: ITEM, left: burst.x - ITEM / 2, top: burst.y }}
            onAnimationEnd={() => setBursts((list) => list.filter((b) => b.id !== burst.id))}
          >
            <span className="absolute inset-0 rounded-full border-2 border-little-yellow-400" />
            <span className="text-sm font-extrabold text-little-coral-600">+1</span>
          </div>
        ))}

      {/* The lion with its basket */}
      <div ref={lionRef} aria-hidden className="pointer-events-none absolute bottom-1 left-0 z-10" style={{ width: MASCOT_W, marginLeft: -MASCOT_W / 2 }}>
        <div className="fx-hop" style={{ "--fx-hop": "-5px", "--fx-dur": "1.4s" } as CSSProperties}>
          <Lion className="relative mx-auto w-[68px] drop-shadow-md sm:w-[74px]" />
          <div className="relative -mt-4 h-6 w-full rounded-b-[20px] rounded-t-md bg-little-coral-400 shadow-[0_6px_12px_-6px_rgba(174,54,40,.7)]">
            <div className="absolute inset-x-2 top-1.5 h-px bg-white/40" />
            <div className="absolute inset-x-3 top-3 h-px bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
});

function DropArt({ kind, letter }: { kind: Kind; letter: string }) {
  const shell = "flex h-full w-full animate-sway items-center justify-center motion-reduce:animate-none";
  switch (kind) {
    case "star":
      return <span className={shell}><Star className="h-9 w-9 fill-little-yellow-400 text-little-yellow-500 drop-shadow-sm" /></span>;
    case "pencil":
      return <span className={`${shell} rounded-full bg-little-coral-100 text-little-coral-600 shadow-sm`}><Pencil className="h-5 w-5" /></span>;
    case "book":
      return <span className={`${shell} rounded-full bg-little-blue-100 text-little-blue-700 shadow-sm`}><BookOpen className="h-5 w-5" /></span>;
    case "smile":
      return <span className={`${shell} rounded-full bg-little-pink-100 text-little-pink-600 shadow-sm`}><Smile className="h-5 w-5" /></span>;
    case "block":
      return <span className={`${shell} rounded-[10px] bg-little-green-400 font-display text-lg font-bold text-white shadow-sm ring-2 ring-inset ring-white/40`}>{letter}</span>;
    case "balloon":
      return (
        <span className={shell}>
          <svg viewBox="0 0 40 40" className="h-10 w-10 drop-shadow-sm">
            <ellipse cx="20" cy="15" rx="11" ry="13" fill={BRAND.pink[400]} />
            <ellipse cx="16" cy="10" rx="3" ry="4.5" fill="white" opacity=".45" />
            <path d="M18 28 L22 28 L20 31 Z" fill={BRAND.pink[500]} />
            <path d="M20 31 Q17 35 20 39" stroke={BRAND.neutral[400]} strokeWidth="1.2" fill="none" />
          </svg>
        </span>
      );
  }
}

/* ------------------------------------------------------------------ decoration */

function Cloud({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 50" className={className}>
      <path d="M22 44 Q4 44 6 31 Q8 20 22 22 Q26 6 44 9 Q56 0 70 10 Q88 4 94 20 Q114 18 114 33 Q114 44 98 44 Z" fill="white" />
    </svg>
  );
}

function SkyDecor() {
  return (
    <div aria-hidden data-in="" className="pointer-events-none absolute inset-0">
      <Cloud className="absolute left-[6%] top-[14%] w-20 opacity-90 sm:w-24" />
      <Cloud className="absolute right-[8%] top-[30%] w-16 opacity-75 sm:w-20" />
      <span className="absolute left-[38%] top-[10%] h-1.5 w-1.5 rounded-full bg-little-yellow-400/70" />
      <span className="absolute right-[30%] top-[16%] h-2 w-2 rounded-full bg-little-pink-300/60" />
      {/* Grassy hill */}
      <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full">
        <path d="M0 22 Q125 4 250 18 T500 14 V40 H0 Z" fill={BRAND.green[200]} />
        <path d="M0 30 Q140 18 280 28 T500 26 V40 H0 Z" fill={BRAND.green[300]} />
      </svg>
    </div>
  );
}

function CardDoodles() {
  const blocks = [
    { letter: "A", className: "right-[22%] top-5 rotate-12 bg-little-yellow-200 text-little-yellow-800" },
    { letter: "B", className: "-left-2 top-[46%] -rotate-12 bg-little-blue-100 text-little-blue-700" },
    { letter: "C", className: "-right-2 bottom-24 rotate-6 bg-little-pink-100 text-little-pink-700" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-little-yellow-100/80" />
      <span className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-little-green-50" />
      {blocks.map((b) => (
        <span key={b.letter} className={`absolute hidden h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-bold opacity-70 sm:flex ${b.className}`}>{b.letter}</span>
      ))}
      <Star className="absolute left-[46%] top-4 h-3.5 w-3.5 fill-little-yellow-300 text-little-yellow-300" />
      <Star className="absolute bottom-6 right-[18%] h-3 w-3 fill-little-coral-200 text-little-coral-200" />
      <svg viewBox="0 0 60 20" className="absolute bottom-5 left-[14%] w-12 text-little-blue-300">
        <path d="M2 10 Q10 2 18 10 T34 10 T50 10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
