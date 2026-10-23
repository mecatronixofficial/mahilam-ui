"use client";
import { contentText, type SectionContent } from "@/lib/page-content";

import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Heart, Quote, Smile, Sparkles, Star } from "lucide-react";
import type { Testimonial } from "@/lib/server-api";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Appear, Group } from "@/components/animations/Appear";
import { FloatingShape } from "@/components/animations/FloatingShape";
import { Reveal } from "@/components/animations/Reveal";
import { fx } from "@/components/animations/fx";
import { useInView } from "@/components/animations/motion";
import { MarkedWord, Shape, PALETTE, TONES, type ShapeName } from "./PlayShapes";
import { BRAND } from "@/lib/brand";

const QUOTE_SHAPES: ShapeName[] = ["blob", "cloud", "pebble", "flower"];
const SWIPE_PX = 80;
const LEAVE_MS = 550;

/** Where each card in the deck rests, by its distance from the front. */
const DECK = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 26, y: 18, rotate: 4.5, scale: 0.95, opacity: 1 },
  { x: -20, y: 34, rotate: -5, scale: 0.9, opacity: 1 },
];
const HIDDEN = { x: 0, y: 46, rotate: 0, scale: 0.85, opacity: 0 };
type Pose = typeof HIDDEN;
const pose = ({ x, y, rotate, scale, opacity }: Pose): CSSProperties => ({ transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`, opacity });

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "♥";

type Leaving = { index: number; dir: 1 | -1 } | null;

/**
 * Parent reviews as a swipeable deck of note cards, with a rating summary and a parent "rail" beside it.
 * Every review stays in the DOM (server-rendered), so they are all indexable. Motion is CSS transitions;
 * swiping uses plain pointer events.
 */
export function TestimonialsDynamic({ rows, variant = "default", content }: { content?: SectionContent; rows: Testimonial[]; variant?: "default" | "playful" }) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<Leaving>(null);
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15% 0px" });
  const leaveTimer = useRef(0);
  const drag = useRef<{ x: number; t: number; el: HTMLElement } | null>(null);
  const playful = variant === "playful";
  const count = rows.length;

  const average = useMemo(() => rows.reduce((sum, row) => sum + (row.rating || 5), 0) / Math.max(1, rows.length), [rows]);

  if (!count) return null;

  /** Bring `next` to the front; the current front card is flung out towards `dir` (1 = left, -1 = right). */
  const show = (next: number, dir: 1 | -1) => {
    if (next === active) return;
    setLeaving({ index: active, dir });
    setActive(next);
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setLeaving(null), LEAVE_MS);
  };
  const move = (dir: 1 | -1) => show((active + dir + count) % count, dir);

  // Swipe the front card: it follows the finger (with some give), then either flies off or snaps back.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    drag.current = { x: event.clientX, t: performance.now(), el: event.currentTarget };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.transition = "none";
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current.el.style.translate = `${(event.clientX - drag.current.x) * 0.8}px 0`;
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const dx = event.clientX - d.x;
    const speed = dx / Math.max(performance.now() - d.t, 1); // px per ms
    d.el.style.transition = "";
    d.el.style.translate = "";
    if (dx < -SWIPE_PX || speed < -0.5) move(1);
    else if (dx > SWIPE_PX || speed > 0.5) move(-1);
  };
  const paused = hovered || !inView;

  return (
    <section
      ref={sectionRef}
      className={`overflow-hidden ${playful ? "px-2 py-16 sm:px-3 md:py-20" : "py-16 md:py-20"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className={`relative mx-auto ${playful ? "lm-panel max-w-[1400px] overflow-hidden px-4 py-16 sm:px-8 md:py-20 lg:px-16" : "container-pad"}`}>
        <BackdropGraphics playful={playful} />

        <div className="relative grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          {/* Left: heading, rating summary, parent rail */}
          <div className="text-center lg:text-left">
            {playful ? (
              <>
                <Reveal as="span" variant="drop" className="lm-eyebrow">{contentText(content, "eyebrow") || "Parent voices"}</Reveal>
                <AnimatedText className="lm-title mt-4">{contentText(content, "heading") || <>What families <MarkedWord shape="blob" color={PALETTE.sky} rotate={-6}>say.</MarkedWord></>}</AnimatedText>
                <Reveal as="p" variant="rise" delay={0.2} className="lm-lead mx-auto mt-5 max-w-xl lg:mx-0">{contentText(content, "description") || "Real experiences shared by families in our Little Mahilam community."}</Reveal>
              </>
            ) : (
              <>
                <span className="eyebrow">{contentText(content, "eyebrow") || "Parent voices"}</span>
                <h2 className="section-title mt-4 text-little-green-950">{contentText(content, "heading") || "What families say."}</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-little-neutral-600 lg:mx-0">{contentText(content, "description") || "Real experiences shared by families in our Little Mahilam community."}</p>
              </>
            )}

            <Appear y={24} d={0.15} dur={0.8} className="mx-auto mt-8 flex max-w-md items-center gap-5 rounded-[28px] bg-white p-5 text-left shadow-[0_24px_50px_-30px_rgba(36,68,32,.45)] lg:mx-0">
              <div className="relative grid h-20 w-20 shrink-0 place-items-center">
                <span className="fx-spin absolute inset-0" style={{ "--fx-dur": "40s" } as CSSProperties}>
                  <Shape name="sun" color={PALETTE.sun} className="h-full w-full" />
                </span>
                <span className="relative font-display text-2xl font-extrabold text-little-green-950">{average.toFixed(1)}</span>
              </div>
              <div>
                <Stars rating={Math.round(average)} animate />
                <p className="mt-1.5 font-bold leading-snug text-little-green-950">Loved by our families</p>
                <p className="text-sm text-little-neutral-500">From {count} parent review{count === 1 ? "" : "s"}</p>
              </div>
            </Appear>

            {count > 1 && (
              <div className="mt-7 flex flex-col items-center gap-5 lg:items-start">
                <ul className="hide-scrollbar flex max-w-full gap-2 overflow-x-auto px-1 py-2" aria-label="Choose a review">
                  {rows.map((row, index) => {
                    const tone = TONES[index % TONES.length];
                    const current = index === active;
                    return (
                      <li key={row.id || index} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => show(index, index > active ? 1 : -1)}
                          aria-label={`Show review from ${row.parentName}`}
                          aria-current={current ? "true" : undefined}
                          className={`relative grid h-12 w-12 place-items-center rounded-full text-sm font-extrabold text-little-green-950 outline-none transition-[scale,translate] duration-300 ease-(--ease-back) hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-little-blue-300 ${current ? "-translate-y-[3px] scale-112" : ""}`}
                        >
                          <Shape name={QUOTE_SHAPES[index % QUOTE_SHAPES.length]} color={current ? tone.shape : tone.bg} className="absolute inset-0 h-full w-full transition-colors duration-300" />
                          <span className="relative">{initials(row.parentName)}</span>
                          {current && <span className="absolute -bottom-2 h-1.5 w-1.5 animate-[fx-in_.3s_var(--ease-back-strong)] rounded-full bg-little-green-900 [--fx-s:0]" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-center gap-3">
                  <ArrowButton label="Previous review" onClick={() => move(-1)} playful={playful}><ChevronLeft className="h-5 w-5" /></ArrowButton>
                  <span className="min-w-14 text-center text-sm font-extrabold tabular-nums text-little-green-900">
                    {String(active + 1).padStart(2, "0")} <span className="text-little-green-900/40">/ {String(count).padStart(2, "0")}</span>
                  </span>
                  <ArrowButton label="Next review" onClick={() => move(1)} playful={playful}><ChevronRight className="h-5 w-5" /></ArrowButton>
                </div>
              </div>
            )}
          </div>

          {/* Right: the deck */}
          <div
            className="relative mx-auto h-[470px] w-full max-w-[440px] outline-none sm:h-[440px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Parent testimonials"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}
          >
            <DeckGraphics />
            {rows.map((row, index) => {
              const depth = (index - active + count) % count;
              const isLeaving = leaving?.index === index;
              const front = depth === 0;
              const target = isLeaving
                ? { x: leaving.dir * -520, y: 40, rotate: leaving.dir * -20, scale: 0.92, opacity: 0 }
                : DECK[depth] ?? HIDDEN;
              return (
                <div
                  key={row.id || index}
                  className={`absolute inset-x-0 top-0 h-[420px] transition-[transform,opacity,translate] sm:h-[390px] ${isLeaving ? "duration-550 ease-[cubic-bezier(.4,0,.2,1)]" : "duration-500 ease-(--ease-back)"} ${front && count > 1 ? "cursor-grab touch-pan-y select-none active:cursor-grabbing" : ""} ${!front && !isLeaving && depth > 2 ? "pointer-events-none" : ""}`}
                  style={{ ...pose(target), zIndex: isLeaving ? 40 : 30 - depth }}
                  onPointerDown={front ? onPointerDown : undefined}
                  onPointerMove={front ? onPointerMove : undefined}
                  onPointerUp={front ? onPointerUp : undefined}
                  onPointerCancel={front ? onPointerUp : undefined}
                  onClick={() => { if (!front && depth <= 2) move(1); }}
                  aria-hidden={!front}
                >
                  <ReviewCard
                    row={row}
                    index={index}
                    front={front}
                    autoplay={front && count > 1 && !paused}
                    cycleKey={active}
                    onDone={() => move(1)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ row, index, front, autoplay, cycleKey, onDone }: { row: Testimonial; index: number; front: boolean; autoplay: boolean; cycleKey: number; onDone: () => void }) {
  const tone = TONES[index % TONES.length];
  const rating = row.rating || 5;
  return (
    <figure
      className="relative m-0 flex h-full flex-col overflow-hidden rounded-[32px] p-6 text-left shadow-[0_30px_60px_-34px_rgba(36,68,32,.55)] ring-1 ring-black/5 transition-colors duration-500 sm:p-8"
      style={{ backgroundColor: front ? "#fff" : tone.bg }}
    >
      {/* Washi tape */}
      <span aria-hidden className="absolute -top-1 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-b-md opacity-70" style={{ background: tone.shape }} />
      {/* Corner blob */}
      <Shape name={QUOTE_SHAPES[(index + 2) % QUOTE_SHAPES.length]} color={tone.bg} className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 opacity-70" />

      <div className="relative flex items-start justify-between gap-4">
        {/* The quote mark gives a little nod each time its card comes to the front */}
        <span key={front ? `quote-front-${cycleKey}` : "quote-back"} className={`relative grid h-14 w-14 place-items-center ${front ? "animate-[fx-jiggle_.7s_ease-in-out_.15s]" : ""}`}>
          <Shape name={QUOTE_SHAPES[index % QUOTE_SHAPES.length]} color={tone.shape} className="absolute inset-0 h-full w-full" />
          <Quote className="relative h-5 w-5 fill-little-green-900 text-little-green-900" />
        </span>
        <Stars key={front ? `stars-front-${cycleKey}` : "stars-back"} rating={rating} animate={front} now />
      </div>

      {row.subject && <h3 className="relative mt-5 text-xl font-bold tracking-tight text-little-green-950">{row.subject}</h3>}
      <blockquote className={`relative ${row.subject ? "mt-2" : "mt-5"} line-clamp-6 flex-1 text-[15px] leading-7 text-little-green-900/75 sm:text-base`}>“{row.testimonial}”</blockquote>

      <figcaption className="relative mt-5 flex items-center gap-3 border-t-2 border-dashed border-little-green-900/12 pt-4">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center text-sm font-extrabold text-little-green-950">
          <Shape name="flower" color={front ? tone.bg : "#fff"} className="absolute inset-0 h-full w-full" />
          <span className="relative">{initials(row.parentName)}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-bold text-little-green-950">{row.parentName}</span>
          {row.location && <span className="block truncate text-xs font-bold text-little-green-900/50">{row.location}</span>}
        </span>
        <Heart aria-hidden className="h-5 w-5 shrink-0 fill-little-pink-400 text-little-pink-400" />
      </figcaption>

      {/* Autoplay timer: the CSS animation pauses on hover and while off screen, and moves on when it ends. */}
      {front && (
        <span aria-hidden className="absolute inset-x-8 bottom-0 h-1 overflow-hidden rounded-t-full bg-little-green-900/8 motion-reduce:hidden">
          <span
            key={cycleKey}
            className="block h-full origin-left animate-progress rounded-full"
            style={{ background: tone.shape, animationPlayState: autoplay ? "running" : "paused" } as CSSProperties}
            onAnimationEnd={onDone}
          />
        </span>
      )}
    </figure>
  );
}

/** Five stars; with `animate` they pop in one after another — on mount with `now`, else when their group scrolls in. */
function Stars({ rating, animate = false, now = false }: { rating: number; animate?: boolean; now?: boolean }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`} {...(now ? { "data-in": "" } : {})}>
      {Array.from({ length: 5 }).map((_, star) => (
        <span key={star} className={animate ? "fx" : undefined} style={animate ? fx({ s: 0, o: 1, r: -60, d: 0.2 + star * 0.07, dur: 0.45, ease: "back-strong" }) : undefined}>
          <Star className={`h-4 w-4 ${star < rating ? "fill-little-yellow-400 text-little-yellow-500" : "text-little-neutral-200"}`} />
        </span>
      ))}
    </div>
  );
}

function ArrowButton({ label, onClick, playful, children }: { label: string; onClick: () => void; playful: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-[scale] duration-200 ease-(--ease-back) hover:scale-108 active:scale-[.92] ${playful ? "bg-little-green-900 text-white" : "glass-chip text-little-green-950"}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ graphics */

/** Bobbing speech bubbles, a self-drawing doodle and twinkles around the deck. */
function DeckGraphics() {
  const bubbles = [
    { icon: Heart, className: "-left-4 top-10 sm:-left-12", bg: PALETTE.blush, ink: "fill-little-pink-500 text-little-pink-500", delay: 0 },
    { icon: Star, className: "-right-3 top-1/3 sm:-right-10", bg: PALETTE.butter, ink: "fill-little-yellow-400 text-little-yellow-600", delay: 0.8 },
    { icon: Smile, className: "-left-2 bottom-20 sm:-left-9", bg: PALETTE.mint, ink: "text-little-green-700", delay: 1.6 },
  ];
  return (
    <Group aria-hidden className="pointer-events-none absolute -inset-10">
      <svg viewBox="0 0 520 540" className="absolute inset-0 h-full w-full" fill="none">
        <path
          d="M40 470 C 10 330 120 300 90 190 S 160 30 300 50 S 520 120 470 260 S 380 470 250 500"
          stroke={BRAND.blue[200]}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1 14"
          className="fx-fade"
          style={fx({ dur: 1.6 })}
        />
      </svg>
      <Quote className="absolute right-6 top-0 h-24 w-24 -rotate-12 fill-little-green-900/[.06] text-transparent" />
      {bubbles.map(({ icon: Icon, className, bg, ink, delay }, i) => (
        <span
          key={i}
          className={`fx absolute z-50 grid h-12 w-12 place-items-center rounded-[18px] rounded-bl-[4px] shadow-[0_12px_24px_-14px_rgba(36,68,32,.6)] sm:h-14 sm:w-14 ${className}`}
          style={{ ...fx({ s: 0, d: 0.4 + delay * 0.3, dur: 0.5, ease: "back-strong" }), background: bg }}
        >
          <span className="fx-hop" style={{ "--fx-hop": "-7px", "--fx-dur": "3.4s", "--fx-d": `${delay}s` } as CSSProperties}>
            <Icon className={`h-6 w-6 ${ink}`} />
          </span>
        </span>
      ))}
      {[
        { className: "right-10 -top-2", size: "h-5 w-5", delay: 0 },
        { className: "left-16 -bottom-1", size: "h-4 w-4", delay: 1.1 },
        { className: "-right-4 bottom-10", size: "h-3.5 w-3.5", delay: 2 },
      ].map((s, i) => (
        <span key={i} className={`absolute animate-twinkle ${s.className}`} style={{ animationDelay: `${s.delay}s`, animationDuration: "2.6s" }}>
          <Sparkles className={`${s.size} text-little-yellow-500`} />
        </span>
      ))}
    </Group>
  );
}

/** Large soft shapes floating behind the whole section. */
function BackdropGraphics({ playful }: { playful: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute left-[3%] top-10 w-14 md:w-20"><FloatingShape name="burst" color={PALETTE.sun} duration={5.6} /></div>
      <div className="absolute right-[4%] top-8 w-16 md:w-24"><FloatingShape name="leaf" color={playful ? PALETTE.pink : PALETTE.blush} rotate={-12} duration={6.4} /></div>
      <div className="absolute bottom-10 left-[40%] hidden w-16 lg:block"><FloatingShape name="squiggle" color={PALETTE.leaf} rotate={8} duration={7} /></div>
      <div className="absolute -bottom-6 right-[8%] hidden w-24 md:block"><FloatingShape name="cloud" color={PALETTE.sky} duration={6.8} /></div>
    </div>
  );
}
