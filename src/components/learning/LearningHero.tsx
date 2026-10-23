import type { CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { Lightbulb } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Balloon, BookDoodle, PaperPlane, PencilDoodle, StarDoodle, Wave } from "@/components/about/Doodles";
import { Shape } from "@/components/public/PlayShapes";
import { fx } from "@/components/animations/fx";
import { Float } from "@/components/animations/FloatingShape";
import { MouseParallax } from "@/components/animations/MouseParallax";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Chalkboard, Crayon, IdeaBadge, LetterBlock, PuzzlePiece, Squiggle } from "./Art";
import { CtaLink, Eyebrow, type Photo } from "@/components/public/PageKit";
import styles from "./learning.module.css";

const rise = (d: number) => fx({ y: 26, d, dur: 0.9, ease: "spring" });
const pop = (d: number, r = -14) => fx({ s: 0.4, r, d, dur: 0.85, ease: "back" });

/** The four words from the subheading, as crayon labels. */
const VALUES = [
  { label: "Curiosity", color: BRAND.blue[300] },
  { label: "Creativity", color: BRAND.pink[300] },
  { label: "Confidence", color: BRAND.yellow[400] },
  { label: "Happiness", color: BRAND.green[300] },
];

/** A highlighted headline word: a hand-drawn squiggle draws itself underneath after the words land. */
function Hl({ children, color, d }: { children: string; color: string; d: number }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <Squiggle color={color} className="absolute -bottom-[0.12em] left-[-2%] h-[0.32em] w-[104%]" style={fx({ d, dur: 0.9, ease: "soft" })} />
    </span>
  );
}

/** "Magical Learning World": headline + an illustrated classroom corner that leans toward the mouse. */
export function LearningHero({ images, nextBg }: { images: [Photo, Photo]; nextBg: string }) {
  return (
    <MouseParallax as="section" strength={1} className={`relative overflow-hidden ${styles.paper}`} style={{ backgroundColor: BRAND.yellow[50] }}>
      <div data-in="">
        {/* Soft background shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-little-blue-100/70 blur-[2px]" />
          <span className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-little-pink-50" />
          <StarDoodle className="absolute left-[46%] top-10 w-6 animate-twinkle" />
          <StarDoodle color={BRAND.blue[300]} className="absolute left-[6%] top-[78%] w-4 animate-twinkle [animation-delay:-1.2s]" />
          <div className="absolute top-4 hidden w-24 animate-[fx-fly-across_30s_linear_infinite] md:block">
            <PaperPlane className="fx-hop w-full" style={{ "--fx-hop": "-16px", "--fx-dur": "5s" } as CSSProperties} />
          </div>
        </div>

        <div className="container-pad relative grid items-center gap-8 pb-10 pt-6 lg:grid-cols-[1fr_1fr] lg:gap-6 lg:pb-12 lg:pt-8">
          {/* Copy */}
          <div className="relative z-10 text-center lg:text-left">
            <span style={rise(0)} className="fx inline-block">
              <Eyebrow icon={<Lightbulb className="h-4 w-4 text-little-yellow-600" />}>Our Learning Approach</Eyebrow>
            </span>

            <AnimatedText as="h1" trigger="load" delay={0.1} className="mt-5 text-balance font-display text-[clamp(2.6rem,6vw,4.9rem)] font-bold leading-[1.02] tracking-tight text-little-green-950">
              Little <Hl color={BRAND.pink[400]} d={0.55}>Minds.</Hl> Big <span className="text-little-pink-500"><Hl color={BRAND.yellow[400]} d={0.8}>Discoveries.</Hl></span>
            </AnimatedText>

            <p style={rise(0.45)} className="fx mx-auto mt-5 max-w-xl text-lg leading-8 text-little-neutral-600 lg:mx-0">
              Every child learns differently. At Little Mahilam, we nurture curiosity, creativity, confidence, and happiness through meaningful play.
            </p>

            <div style={rise(0.55)} className="fx mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <CtaLink href="#pillars">Explore Our Approach</CtaLink>
              <CtaLink href="/programs" tone="light">Discover Programs</CtaLink>
            </div>

            {/* Crayon labels */}
            <ul aria-label="What we nurture" className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {VALUES.map((v, i) => (
                <li
                  key={v.label}
                  style={{ ...fx({ x: -24, r: i % 2 ? 4 : -4, d: 0.7 + i * 0.08, dur: 0.7, ease: "back" }), background: v.color, clipPath: "polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)" }}
                  className={`fx cursor-default py-2 pl-6 pr-4 font-display text-sm font-bold text-little-green-950 transition-[translate,rotate] duration-300 ease-(--ease-back) hover:-translate-y-1 hover:translate-x-1 ${i % 2 ? "rotate-1" : "-rotate-1"}`}
                >
                  {v.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Illustrated classroom corner */}
          <div className="relative mx-auto aspect-[1/1] w-full max-w-[540px]">
            <div data-depth="-6" className="absolute inset-[2%]">
              <div style={pop(0.05, 0)} className="fx h-full w-full">
                <Shape name="blob" color={BRAND.yellow[200]} className="h-full w-full animate-[spin_80s_linear_infinite] motion-reduce:animate-none" />
              </div>
            </div>

            {/* Arched classroom window with the main photo */}
            <div data-depth="5" className="absolute bottom-[20%] left-[17%] right-[11%] top-[5%]">
              <div style={fx({ y: 50, s: 0.92, d: 0.15, dur: 1, ease: "spring" })} className="fx group/win relative h-full w-full overflow-hidden rounded-t-full border-[10px] border-white bg-little-blue-100 shadow-[0_30px_60px_-30px_rgba(36,68,32,.6)]">
                <Image src={images[0].src} alt={images[0].alt} unoptimized={images[0].unoptimized} fill priority sizes="(min-width: 1024px) 400px, 72vw" className="object-cover transition-transform duration-700 ease-out group-hover/win:scale-108" />
                {/* Window bars */}
                <span aria-hidden className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-white/85" />
                <span aria-hidden className="absolute inset-x-0 top-[42%] h-2 bg-white/85" />
              </div>
            </div>

            {/* Small round photo */}
            <div data-depth="12" className="absolute left-[0%] top-[26%] w-[27%]">
              <div style={pop(0.35, -18)} className="fx relative aspect-square overflow-hidden rounded-full border-[6px] border-white shadow-xl">
                <Image src={images[1].src} alt={images[1].alt} unoptimized={images[1].unoptimized} fill sizes="150px" className="object-cover" />
              </div>
            </div>

            <div data-depth="18" className="absolute bottom-[1%] left-[2%] w-[48%]">
              <div style={fx({ y: 60, r: -12, d: 0.45, dur: 0.9, ease: "back" })} className="fx -rotate-4">
                <Chalkboard className="w-full drop-shadow-[0_16px_18px_rgba(36,68,32,.25)]" />
              </div>
            </div>

            {/* Letter-block tower */}
            <div data-depth="26" className="absolute bottom-[3%] right-[1%] w-[26%]">
              <div style={fx({ y: -80, d: 0.6, dur: 1, ease: "bounce" })} className="fx relative">
                <LetterBlock letter="C" color={BRAND.green[400]} className="mx-auto w-[58%] -rotate-6" />
                <div className="-mt-[8%] flex">
                  <LetterBlock letter="A" color={BRAND.coral[400]} className="w-1/2 rotate-3" />
                  <LetterBlock letter="B" color={BRAND.blue[400]} className="-ml-[4%] w-1/2 -rotate-2" />
                </div>
              </div>
            </div>

            <div data-depth="-16" className="absolute -right-[3%] top-[0%] w-[25%]">
              <div style={pop(0.7, 40)} className="fx">
                <IdeaBadge className="w-full drop-shadow-[0_12px_16px_rgba(36,68,32,.2)]" />
              </div>
            </div>

            {/* Floating learning objects */}
            <div data-depth="30" className="absolute left-[8%] top-[4%] w-[22%]">
              <span style={pop(0.8, -30)} className="fx block"><Float amp={8} tilt={6} rotate={-28}><PencilDoodle className="w-full" /></Float></span>
            </div>
            <div data-depth="-22" className="absolute right-[2%] top-[38%] w-[13%]">
              <span style={pop(0.9)} className="fx block"><Float amp={10} duration={6}><Balloon color={BRAND.pink[400]} className="w-full" /></Float></span>
            </div>
            <div data-depth="14" className="absolute right-[13%] top-[30%] w-[8%]">
              <span style={pop(0.95)} className="fx block"><Float amp={12} duration={7}><Balloon color={BRAND.blue[400]} className="w-full" /></Float></span>
            </div>
            <div data-depth="-24" className="absolute bottom-[34%] left-[-3%] w-[14%]">
              <span style={pop(1)} className="fx block"><Float amp={8} rotate={-14}><BookDoodle className="w-full" /></Float></span>
            </div>
            <div data-depth="34" className="absolute bottom-[24%] right-[26%] w-[11%]">
              <span style={pop(1.05, 30)} className="fx block"><Float amp={9} tilt={10} rotate={18}><PuzzlePiece color={BRAND.yellow[400]} className="w-full" /></Float></span>
            </div>
            <div data-depth="20" className="absolute bottom-[-1%] left-[44%] w-[20%]">
              <span style={pop(1.1, 20)} className="fx block"><Float amp={5} tilt={3} rotate={8}><Crayon color={BRAND.pink[400]} className="w-full" /></Float></span>
            </div>
            <StarDoodle color={BRAND.pink[300]} className="pointer-events-none absolute left-[38%] top-[0%] w-[6%] animate-twinkle" />
            <StarDoodle color={BRAND.yellow[400]} className="pointer-events-none absolute bottom-[28%] right-[0%] w-[5%] animate-twinkle [animation-delay:-1.8s]" />
          </div>
        </div>
      </div>
      <Wave color={nextBg} className="absolute inset-x-0 bottom-0 h-6" />
    </MouseParallax>
  );
}
