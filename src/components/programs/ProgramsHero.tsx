import type { CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { ArrowDown, Check, GraduationCap } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { AbcBlocks, Balloon, PaperPlane, PencilDoodle, StarDoodle } from "@/components/about/Doodles";
import { fx } from "@/components/animations/fx";
import { MouseParallax } from "@/components/animations/MouseParallax";
import { CountUp } from "./Fx";
import type { Stage } from "./stages";

/** Load-ins (CSS, from first paint — the hero carries `data-in`). */
const rise = (delay: number) => fx({ y: 24, d: delay, dur: 0.9, ease: "spring" });
const tileIn = (delay: number) => fx({ s: 0.6, r: -12, d: delay, dur: 0.8, ease: "back" });

const HIGHLIGHTS = ["Play-based learning", "Age-specific activities", "Creative classrooms", "Individual attention"];
const STAGE_EMOJI = ["🧸", "🎨", "📚", "🎓"];

/** On hover the tile pops and tilts, its photo zooms, its blocks wiggle. */
const TILE = "group/tile relative aspect-square cursor-pointer transition-[scale,rotate] duration-300 ease-(--ease-back-strong) hover:scale-105 hover:-rotate-2";
const PHOTO = "absolute inset-0 transition-[scale] duration-600 group-hover/tile:scale-112";

/** Programs hero: bold headline with age "stickers", and a playful, mouse-reactive mosaic of shapes and photos. */
export function ProgramsHero({ stages, images }: { stages: Stage[]; images: [string, string] }) {
  return (
    <MouseParallax as="section" strength={1} className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${BRAND.yellow[50]} 0%, ${BRAND.cream.base} 100%)` }}>
      <div data-in="">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-24 h-64 w-64 animate-float rounded-full bg-little-blue-100/70 [animation-duration:9s]" />
          <span className="absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-little-pink-50 [animation-delay:-3s] [animation-duration:11s]" />
          <StarDoodle className="absolute left-[44%] top-14 w-6 animate-twinkle" />
          <StarDoodle color={BRAND.blue[300]} className="absolute left-[8%] top-[70%] w-4 animate-twinkle [animation-delay:-1.4s]" />
          {/* A paper plane loops slowly across the sky */}
          <div className="absolute top-6 hidden w-24 animate-[fx-fly-across_26s_linear_infinite] md:block">
            <PaperPlane className="fx-hop w-full" style={{ "--fx-hop": "-18px", "--fx-dur": "5s" } as CSSProperties} />
          </div>
          <Balloon color={BRAND.coral[300]} className="absolute bottom-[18%] left-[47%] hidden w-8 animate-float [animation-duration:7s] lg:block" />
        </div>

        <div className="container-pad relative grid items-center gap-6 py-6 lg:grid-cols-[1.05fr_.95fr] lg:py-8">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <span style={rise(0)} className="fx inline-flex items-center gap-2 rounded-full bg-little-green-900 py-1.5 pl-1.5 pr-4 text-sm font-extrabold text-white">
              <span className="fx-wiggle grid h-7 w-7 place-items-center rounded-full bg-little-yellow-400 text-little-green-950" style={{ "--fx-w": "12deg", "--fx-dur": "4s" } as CSSProperties}>
                <GraduationCap className="h-4 w-4" />
              </span>
              Our Programs
            </span>
            <h1 style={rise(0.08)} className="fx mt-6 text-balance font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-little-green-950">
              Learning journeys for{" "}
              <span className="group relative isolate inline-block whitespace-nowrap">
                <span
                  aria-hidden
                  className="fx-grow-x absolute inset-x-[-4%] bottom-[8%] top-[48%] -z-10 origin-left -rotate-1 rounded-full bg-little-yellow-300 transition-colors duration-500 group-hover:bg-little-pink-200"
                  style={fx({ d: 0.6, dur: 0.6, ease: "expo" })}
                />
                every age.
              </span>
            </h1>
            <p style={rise(0.16)} className="fx mx-auto mt-6 max-w-xl text-lg leading-8 text-little-neutral-600 lg:mx-0">
              Age-appropriate learning journeys designed to help every child play, explore, discover and grow with happiness.
            </p>

            {/* Age stickers jump to that stage in the explorer; each pops its own emoji on hover */}
            <div style={rise(0.24)} className="fx mt-8">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800/70">Pick an age to explore</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                {stages.map((stage, i) => (
                  <a
                    key={stage.slug}
                    href={`#${stage.slug}`}
                    className="group/sticker relative inline-flex flex-col items-start rounded-2xl px-4 py-2.5 text-left shadow-[0_10px_20px_-14px_rgba(36,68,32,.6)] ring-2 ring-white transition-[translate,rotate,scale] duration-300 ease-(--ease-back-strong) hover:-translate-y-1.5 hover:-rotate-2 focus-visible:-translate-y-1.5 active:scale-95"
                    style={{ background: stage.color }}
                  >
                    <span aria-hidden className="absolute -right-2 -top-4 translate-y-2 -rotate-20 scale-30 text-2xl opacity-0 drop-shadow transition-[opacity,scale,rotate,translate] duration-300 ease-(--ease-back-strong) group-hover/sticker:translate-y-0 group-hover/sticker:rotate-0 group-hover/sticker:scale-100 group-hover/sticker:opacity-100 group-focus-visible/sticker:opacity-100">{STAGE_EMOJI[i % STAGE_EMOJI.length]}</span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-little-green-950/65">{stage.age}</span>
                    <span className="font-display text-base font-bold text-little-green-950">{stage.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shape mosaic — each tile sits at its own depth (follows the mouse) and reacts to hover */}
          <div className="relative mx-auto grid w-full max-w-[460px] grid-cols-2 gap-3 sm:gap-4">
            <div data-depth="-18">
              <div style={tileIn(0.15)} className={`fx ${TILE} overflow-hidden rounded-full ring-8 ring-white`}>
                <div className={PHOTO}>
                  <Image src={images[0]} alt="Children learning together in a Little Mahilam classroom" fill priority sizes="230px" className="object-cover" />
                </div>
              </div>
            </div>

            <div data-depth="12">
              <div style={tileIn(0.25)} className={`fx ${TILE} flex flex-col items-start justify-end overflow-hidden rounded-tl-[100%] bg-little-yellow-400 p-5 sm:p-6`}>
                <span aria-hidden className="absolute right-4 top-4 transition-[rotate,scale] duration-500 group-hover/tile:rotate-90 group-hover/tile:scale-120">
                  <StarDoodle color="#fff" className="w-7" />
                </span>
                <span className="font-display text-[clamp(2.4rem,7vw,3.6rem)] font-bold leading-none text-little-green-950">
                  2–<CountUp from={2} to={6} duration={1.2} delay={0.6} />+
                </span>
                <span className="mt-1 text-sm font-extrabold uppercase tracking-wider text-little-green-950/70">years</span>
              </div>
            </div>

            <div data-depth="22">
              <div style={tileIn(0.35)} className={`fx ${TILE} grid place-items-center rounded-t-full bg-little-green-300`}>
                <span className="block w-[58%] transition-[translate] duration-300 group-hover/tile:-translate-y-1.5 group-hover/tile:animate-[fx-jiggle_.7s_ease-in-out]">
                  <AbcBlocks className="w-full animate-float" />
                </span>
              </div>
            </div>

            <div data-depth="-10">
              <div style={tileIn(0.45)} className={`fx ${TILE} overflow-hidden rounded-[36px] rounded-br-[110px] ring-8 ring-little-blue-200`}>
                <div className={PHOTO}>
                  <Image src={images[1]} alt="Children enjoying preschool learning activities" fill sizes="230px" className="object-cover" />
                </div>
              </div>
            </div>

            <span aria-hidden className="fx pointer-events-none absolute -left-6 top-[46%] w-20 -rotate-30 sm:-left-10" style={fx({ x: -30, r: -30, d: 0.7, dur: 0.9, ease: "back" })}>
              <PencilDoodle className="w-full animate-bob" />
            </span>
            <StarDoodle color={BRAND.pink[300]} className="pointer-events-none absolute -right-2 top-[44%] w-9 animate-twinkle" />
          </div>
        </div>

        {/* Highlight strip */}
        <div className="container-pad relative pb-5">
          <ul style={rise(0.5)} className="fx mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-[28px] bg-white px-6 py-4 shadow-[0_18px_40px_-30px_rgba(36,68,32,.6)] sm:rounded-full">
            {HIGHLIGHTS.map((item, i) => (
              <li key={item} className="group flex cursor-default items-center gap-2 text-sm font-extrabold text-little-green-900 transition-[translate] hover:-translate-y-0.5">
                <span
                  className="fx grid h-6 w-6 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-[360deg] group-hover:scale-125"
                  style={{ ...fx({ s: 0, o: 1, d: 0.8 + i * 0.1, dur: 0.5, ease: "back-strong" }), background: stages[i % stages.length].color }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
            <li className="hidden sm:block">
              <a href="#explorer" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-little-coral-600">Explore <ArrowDown className="h-4 w-4 animate-bounce" /></a>
            </li>
          </ul>
        </div>
      </div>
    </MouseParallax>
  );
}
