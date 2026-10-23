"use client";
import { contentText, contentImage, type SectionContent } from "@/lib/page-content";
import { isOptimizable } from "@/lib/media";

import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { fx } from "@/components/animations/fx";
import { useInView } from "@/components/animations/motion";
import { Heart, RotateCcw, Sparkles, Star } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Cloud, FlowerDoodle, SECTION_BG, StarDoodle, Wave } from "./Doodles";
import { SectionHeading } from "./motion";
import { handwriting } from "./fonts";

const COLORS = [BRAND.coral[300], BRAND.yellow[400], BRAND.green[300], BRAND.blue[300], BRAND.pink[300], BRAND.yellow[300]];

/** Shown once every balloon has flown — little pep talks from the school. */
const QUOTES = [
  "Little hands can do big things!",
  "You are brave, you are kind, and you can do amazing things.",
  "Every day is a new chance to learn something wonderful.",
  "Be curious, be happy, and never stop shining.",
  "Mistakes help us grow — keep trying, little star!",
  "Your smile makes the whole world brighter.",
  "Dream big, play lots and learn with a happy heart.",
];

type Point = readonly [number, number];
type Layout = {
  /** Balloon size relative to its 150×160 artwork. */
  scale: number;
  /** Size of a parked (flown-away) balloon, relative to `scale`. */
  parked: number;
  /** Knot of each balloon, as % of the card. */
  spots: readonly Point[];
  /** Where each string meets the children's hands (% of the card). */
  hands: readonly Point[];
  /** Corner parking spots: the first three cut balloons go right, the rest go left. */
  right: readonly Point[];
  left: readonly Point[];
};

/** Phones: two rows of three. Desktop/tablet: one arc. All coordinates are % of the card. */
const LAYOUTS: Record<"narrow" | "wide", Layout> = {
  narrow: {
    scale: 0.6,
    parked: 0.55,
    spots: [[19, 44], [50, 40], [81, 44], [19, 64], [50, 61], [81, 64]],
    hands: [[44, 78], [47, 78], [56, 78], [45, 78], [50, 78], [55, 78]],
    right: [[89, 19], [76, 17], [84, 31]],
    left: [[11, 19], [24, 17], [16, 31]],
  },
  wide: {
    scale: 0.82,
    parked: 0.52,
    spots: [[14, 58], [29, 44], [43, 36], [57, 36], [71, 44], [86, 58]],
    hands: [[44, 70], [46, 70], [48.5, 70], [51.5, 70], [54, 70], [56, 70]],
    right: [[93, 20], [85, 18], [89, 33]],
    left: [[7, 20], [15, 18], [11, 33]],
  },
};

/** Balloon artwork is 150×160 with the knot tip at (75, 160); the string ends 14px above that, hidden behind it. */
const KNOT = { x: 75, y: 146 };

const WIDE_QUERY = "(min-width: 640px)";
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
/** Server and first client render use the phone layout, so hydration always matches. */
const useWide = () => useSyncExternalStore(subscribe, () => window.matchMedia(WIDE_QUERY).matches, () => false);

function BalloonBody({ value, index, color }: { value: string; index: number; color: string }) {
  return (
    <span className="relative block h-[160px] w-[150px]">
      <svg aria-hidden viewBox="0 0 150 160" className="absolute inset-0 h-full w-full">
        <ellipse cx="75" cy="76" rx="70" ry="74" fill={color} />
        <ellipse cx="48" cy="44" rx="12" ry="20" fill="#fff" opacity=".35" transform="rotate(25 48 44)" />
        <path d="M67 160 L83 160 L75 148 Z" fill={color} />
      </svg>
      <span className="relative flex h-[150px] flex-col items-center justify-center px-6 text-center">
        <span className="font-display text-xs font-bold text-little-green-950/55">0{index + 1}</span>
        <span className="mt-0.5 font-display text-[15px] font-bold leading-tight text-little-green-950">{value}</span>
      </span>
    </span>
  );
}

/** "✂️ snip!" burst where a string was cut. The wrapper positions it; the inner span animates (CSS, once). */
function Snip({ style }: { style: CSSProperties }) {
  return (
    <span aria-hidden className="pointer-events-none absolute z-30 -translate-x-1/2" style={style}>
      <span className="flex animate-[fx-snip_1.1s_ease-out_forwards] items-center gap-1 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-little-coral-600 opacity-0 shadow-md">
        ✂️ snip!
      </span>
    </span>
  );
}

/**
 * "What Matters To Us": six values on balloons held by the children, inside one card.
 * Tap a balloon to snip its string: it floats up to a corner cloud — three settle top-right, three top-left.
 * When all six have flown, a little quote from the school appears.
 */
export function BalloonValues({ values, image, content }: { values: string[]; image: string; content?: SectionContent }) {
  const [order, setOrder] = useState<number[]>([]); // balloon indexes in the order they were cut
  const [generation, setGeneration] = useState(0);
  const [quote, setQuote] = useState(0);
  const layout = LAYOUTS[useWide() ? "wide" : "narrow"];

  // One in-view check for the whole card starts every entrance (`data-in` on the card), and its pixel size drives the strings.
  const cardRef = useRef<HTMLDivElement>(null);
  const shown = useInView(cardRef);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const allGone = order.length === values.length;
  const release = (i: number) => {
    if (order.includes(i)) return;
    if (order.length === values.length - 1) setQuote(Math.floor(Math.random() * QUOTES.length));
    setOrder([...order, i]);
  };
  const bringBack = () => { setOrder([]); setGeneration((g) => g + 1); };
  const nextQuote = () => setQuote((q) => (q + 1) % QUOTES.length);

  /** Corner spot for the k-th cut balloon: 0–2 → right corner, 3+ → left corner. */
  const parkingSpot = (k: number): Point => (k < 3 ? layout.right[k] : layout.left[(k - 3) % layout.left.length]);
  const px = ([x, y]: Point) => [(x / 100) * size.w, (y / 100) * size.h] as const;

  return (
    <section className="relative overflow-hidden pb-24 pt-14 md:pt-16" style={{ background: SECTION_BG.butter }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <StarDoodle className="absolute left-[8%] top-[30%] w-5 animate-twinkle" />
        <StarDoodle color={BRAND.pink[200]} className="absolute right-[8%] top-[60%] w-4 animate-twinkle [animation-delay:-1.6s]" />
      </div>

      <div className="container-pad relative">
        <SectionHeading content={content}
          eyebrow="What Matters To Us"
          icon={<Star className="h-4 w-4 fill-little-yellow-400 text-little-yellow-500" />}
          title={<>Childhood comes first in <span className="text-little-pink-500">everything we do.</span></>}
          lead="Our values guide our classrooms, activities and interactions with children and families every day."
        />

        {/* The balloon card */}
        <div
          ref={cardRef}
          data-fx-group=""
          {...(shown ? { "data-in": "" } : {})}
          className="relative mx-auto mt-8 h-[500px] w-full max-w-[820px] overflow-hidden rounded-[32px] shadow-[0_30px_60px_-38px_rgba(36,68,32,.55)] ring-4 ring-white sm:h-[520px] sm:rounded-[44px]"
          style={{ background: `linear-gradient(180deg, ${BRAND.blue[100]} 0%, ${BRAND.blue[50]} 55%, ${BRAND.yellow[50]} 100%)` }}
        >
          {/* Sky + the two corner clouds the balloons rest on */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Cloud className="absolute -left-6 top-[20%] w-32 opacity-90 sm:w-44" />
            <Cloud className="absolute -right-6 top-[20%] w-32 -scale-x-100 opacity-90 sm:w-44" />
            <Cloud className="absolute left-[36%] top-[6%] hidden w-24 animate-drift opacity-60 sm:block" />
            <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full">
              <path d="M0 30 C 160 6 320 10 420 28 S 680 50 800 24 V60 H0 Z" fill={BRAND.green[200]} />
              <path d="M0 44 C 200 28 420 34 560 44 S 760 52 800 40 V60 H0 Z" fill={BRAND.green[300]} />
            </svg>
          </div>

          {/* Strings (in real pixels, so the draw/cut animation renders cleanly) run from the hands up to each knot.
              They draw themselves in (`.fx-draw`) and, once cut, retract with a transition. */}
          {size.w > 0 && (
            <svg aria-hidden width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="pointer-events-none absolute inset-0">
              {values.map((value, i) => {
                const [x, y] = px(layout.spots[i % layout.spots.length]);
                const [hx, hy] = px(layout.hands[i % layout.hands.length]);
                const bend = x < hx ? 14 : x > hx ? -14 : 0;
                const cut = order.includes(i);
                return (
                  <path
                    key={`${generation}-${value}`}
                    d={`M${hx} ${hy} Q${(x + hx) / 2 + bend} ${(y + hy) / 2 + 10} ${x} ${y}`}
                    fill="none"
                    stroke={BRAND.neutral[400]}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    className="fx-draw"
                    style={{ ...fx({ d: 0.3 + i * 0.08, dur: 1, ease: "soft" }), ...(cut ? { strokeDashoffset: 1, transition: "stroke-dashoffset .6s ease-in" } : null) }}
                  />
                );
              })}
            </svg>
          )}

          {/* Balloons */}
          {values.map((value, i) => {
            const [x, y] = layout.spots[i % layout.spots.length];
            const k = order.indexOf(i);
            const parked = k >= 0;
            const [sx, sy] = parked ? parkingSpot(k) : [x, y];
            return (
              <div
                key={`${generation}-${value}`}
                className={`absolute h-0 w-0 ${parked ? "animate-[fx-balloon-fly_1.8s_cubic-bezier(.4,0,.3,1)]" : "transition-[left,top] duration-700 ease-(--ease-smooth)"}`}
                style={{ zIndex: parked ? 20 : 10, left: `${sx}%`, top: `${sy}%`, "--x0": `${x}%`, "--y0": `${y}%`, "--x1": `${sx}%`, "--y1": `${sy}%` } as CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => release(i)}
                  disabled={parked}
                  aria-label={parked ? `${value} (flew away)` : `${value} — snip the string and let the balloon fly`}
                  title={parked ? value : undefined}
                  className="absolute block h-[160px] w-[150px] cursor-pointer rounded-full outline-none focus-visible:ring-4 focus-visible:ring-little-blue-300 disabled:cursor-default"
                  style={{ left: -KNOT.x, top: -KNOT.y, transformOrigin: `${KNOT.x}px ${KNOT.y}px`, transform: `scale(${layout.scale})` }}
                >
                  {/* Shrinks and leans as it parks on a cloud */}
                  <span
                    className="block transition-transform duration-[1800ms] ease-in-out"
                    style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px`, transform: parked ? `scale(${layout.parked}) rotate(${k < 3 ? 6 : -6}deg)` : undefined }}
                  >
                    {/* Entrance: floats up into place when the card scrolls into view */}
                    <span className="fx block" style={fx({ y: 60, s: 0.6, d: 0.2 + i * 0.1, dur: 1, ease: "spring" })}>
                      <span className="block animate-bob" style={{ animationDelay: `${-i * 0.9}s`, animationDuration: `${5 + (i % 3)}s` }}>
                        <span className={`block transition-[translate,scale] duration-300 ease-(--ease-back-strong) ${parked ? "" : "hover:-translate-y-1.5 hover:scale-104"}`}>
                          <BalloonBody value={value} index={i} color={COLORS[i % COLORS.length]} />
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            );
          })}

          {/* Snip labels at the cut knots */}
          {order.map((i) => {
            const [x, y] = layout.spots[i % layout.spots.length];
            return <Snip key={`${generation}-snip-${i}`} style={{ left: `${x}%`, top: `${y}%` }} />;
          })}

          {/* All balloons gone: a quote from the school, right where the balloons were */}
          {allGone && (
            <figure
              key={`quote-${generation}`}
              data-in=""
              className="fx absolute inset-x-4 top-[35%] z-30 mx-auto max-w-md sm:top-[28%]"
              style={fx({ s: 0.7, y: 30, d: 1.5, dur: 0.7, ease: "back" })}
            >
              <div className="relative rounded-[28px] bg-white/95 px-6 pb-5 pt-7 text-center shadow-[0_24px_50px_-28px_rgba(36,68,32,.6)] ring-1 ring-black/5 sm:px-8">
                <span className="absolute -top-5 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-little-yellow-400 text-little-green-950 shadow-md">
                  <Sparkles className="h-5 w-5" />
                </span>
                <StarDoodle className="absolute -left-2 -top-2 w-6 animate-twinkle" />
                <StarDoodle color={BRAND.pink[300]} className="absolute -bottom-2 -right-1 w-5 animate-twinkle [animation-delay:-1.2s]" />
                <blockquote
                  key={quote}
                  data-in=""
                  className={`fx ${handwriting.className} text-[1.65rem] font-bold leading-[1.15] text-little-green-900 sm:text-[2rem]`}
                  style={fx({ y: 8, dur: 0.3 })}
                >
                  “{QUOTES[quote]}”
                </blockquote>
                <figcaption className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.16em] text-little-coral-600">
                  <Heart className="h-3.5 w-3.5 fill-current" /> Little Mahilam Preschool
                </figcaption>
                <div className="mt-3">
                  <button type="button" onClick={nextQuote} className="text-xs font-extrabold text-little-green-700 underline decoration-little-green-700/30 underline-offset-4 transition hover:text-little-green-900">
                    Another happy thought ✨
                  </button>
                </div>
              </div>
            </figure>
          )}

          {/* The children holding the strings */}
          <div className="absolute bottom-0 left-1/2 z-[15] h-[120px] w-[200px] -translate-x-1/2 sm:h-[160px] sm:w-[280px]">
            <div className="relative h-full w-full overflow-hidden rounded-t-[999px] border-[6px] border-b-0 border-white shadow-[0_-10px_30px_-18px_rgba(36,68,32,.45)]">
              <Image {...contentImage(content, "main", image, "Happy children learning and playing together")} unoptimized={!isOptimizable(contentImage(content, "main", image, "").src)} fill sizes="280px" className="object-cover" />
            </div>
            <FlowerDoodle className="absolute -left-6 bottom-0 h-10 w-auto" color={BRAND.pink[300]} />
            <FlowerDoodle className="absolute -right-5 bottom-0 h-9 w-auto" color={BRAND.blue[300]} />
          </div>
        </div>

        {/* Hint / bring-back control */}
        <div className="mt-5 flex min-h-12 items-center justify-center px-2" aria-live="polite">
          {order.length === 0 ? (
            <p key="hint" data-in="" className="fx max-w-full rounded-full bg-white px-4 py-2 text-center text-sm font-bold leading-snug text-little-green-800 shadow-sm" style={fx({ y: 6, dur: 0.3 })}>
              <span aria-hidden>🎈 </span>Tap a balloon to snip its string!
            </p>
          ) : (
            <span key="back" data-in="" className="fx" style={fx({ s: 0.8, dur: 0.35, ease: "back" })}>
              <button
                type="button"
                onClick={bringBack}
                className="fx-press max-w-full items-center gap-2 rounded-full bg-little-green-900 px-5 py-2.5 text-center text-sm font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(36,68,32,.9)]"
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                {allGone ? "Bring the balloons back" : `Bring the balloons back (${order.length}/${values.length} flew)`}
              </button>
            </span>
          )}
        </div>
      </div>

      <Wave color={SECTION_BG.cream} className="absolute inset-x-0 bottom-0 h-14" />
    </section>
  );
}
