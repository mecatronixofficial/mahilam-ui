"use client";
import { contentText, contentImage, type SectionContent } from "@/lib/page-content";
import { isOptimizable } from "@/lib/media";


import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import Image from "@/components/media/SchoolImage";
import { Heart } from "lucide-react";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { fx } from "@/components/animations/fx";
import { useReveal } from "@/components/animations/motion";
import { PALETTE, Shape, shapeMask } from "./PlayShapes";

/** Hand-drawn crayon line: wobbly edges come from the shared SVG filter; `draw()` paths draw themselves on. */
function Doodle({ children, viewBox, color, width = 6, filter, className = "", style, ...rest }: { children: ReactNode; viewBox: string; color: string; width?: number; filter: string; className?: string; style?: CSSProperties } & Record<`data-${string}`, string>) {
  return (
    <svg aria-hidden viewBox={viewBox} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" className={`pointer-events-none absolute overflow-visible ${className}`} style={{ filter: `url(#${filter})`, ...style }} {...rest}>
      {children}
    </svg>
  );
}

/** Props that let a path draw itself (CSS `.fx-draw`): its length is normalised to 1, so a dash offset of 1 hides it. */
const draw = (d: number, dur = 0.7) => ({ pathLength: 1, strokeDasharray: 1, className: "fx-draw", style: fx({ d, dur, ease: "soft" }) });

const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  const p = (r: number) => `${Math.round(50 + r * Math.cos(a))} ${Math.round(50 + r * Math.sin(a))}`;
  return `M${p(29)}L${p(42)}`;
});

/** Washi tape with torn zig-zag ends. */
const TAPE_CLIP = "polygon(0 8%, 4% 0, 8% 10%, 92% 0, 96% 10%, 100% 2%, 100% 92%, 96% 100%, 92% 90%, 8% 100%, 4% 90%, 0 98%)";

/**
 * "Welcome little learners" picture, styled like a child's scrapbook page: a taped polaroid, a scalloped
 * photo sticker and crayon doodles. As it scrolls in, the rainbow draws itself, the polaroid drops onto
 * the page, the tape sticks down, the photo sticker spins in, the doodles are drawn and the badge bounces on.
 */
export function WelcomeCollage({ content }: { content?: SectionContent } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const crayon = `crayon${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useReveal(ref, "top 75%");

  return (
    <div ref={ref} data-fx-group="" className="group relative mx-auto aspect-[10/11] w-full max-w-[520px]">
      {/* Shared crayon texture for the doodles */}
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id={crayon}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>

      {/* Rainbow peeking out under the polaroid */}
      <Doodle viewBox="0 0 200 110" color={PALETTE.coral} width={12} filter={crayon} className="bottom-[-1%] left-[16%] w-[46%]">
        <path {...draw(0, 0.9)} d="M20 104A80 80 0 0 1 180 104" />
        <path {...draw(0.15, 0.9)} d="M38 104A62 62 0 0 1 162 104" stroke={PALETTE.sun} />
        <path {...draw(0.3, 0.9)} d="M56 104A44 44 0 0 1 144 104" stroke={PALETTE.leaf} />
      </Doodle>

      {/* Main polaroid */}
      <figure className="fx absolute left-[6%] top-[7%] m-0 w-[64%] rotate-[-5deg] rounded-[10px] bg-white p-[3.5%] pb-[13%] shadow-[0_22px_40px_-22px_rgba(36,68,32,.55)] transition-[rotate] duration-500 group-hover:rotate-[-2deg]" style={fx({ y: -140, k: true, r: -16, d: 0.1, dur: 1, ease: "back" })}>
        <ParallaxImage className="relative aspect-[4/5] rounded-[6px]" amount={5}>
          <Image {...contentImage(content, "main", "/images/home/welcome-main.webp", "Children enjoying learning activities at Little Mahilam Preschool")} unoptimized={!isOptimizable(contentImage(content, "main", "/images/home/welcome-main.webp", "").src)} fill sizes="(min-width: 1024px) 330px, 60vw" className="object-cover" />
        </ParallaxImage>
        {/* Smiley drawn in the polaroid's margin */}
        <Doodle viewBox="0 0 60 60" color={PALETTE.ink} width={4} filter={crayon} className="bottom-[2.5%] right-[8%] w-[16%]">
          <circle {...draw(0.9)} cx="30" cy="30" r="24" />
          <path {...draw(0.95)} d="M22 24v2M38 24v2" />
          <path {...draw(1)} d="M19 36q11 11 22 0" />
        </Doodle>
        <span className="fx-grow-x absolute -top-[4%] left-[-7%] h-[7%] w-[34%] origin-left rotate-[-28deg] bg-little-pink-300/80" style={{ clipPath: TAPE_CLIP, ...fx({ d: 0.75, dur: 0.45, ease: "soft" }) }} />
        <span className="fx-grow-x absolute -top-[3%] right-[-8%] h-[7%] w-[32%] origin-right rotate-[24deg] bg-little-yellow-400/80" style={{ clipPath: TAPE_CLIP, ...fx({ d: 0.87, dur: 0.45, ease: "soft" }) }} />
      </figure>

      {/* Scalloped photo sticker */}
      <div className="fx absolute bottom-[6%] right-0 w-[46%] rotate-[8deg] transition-[rotate] duration-500 group-hover:rotate-[16deg]" style={fx({ s: 0, o: 1, r: -90, d: 0.55, dur: 0.9, ease: "back" })}>
        <Shape name="sun" color="#fff" className="h-auto w-full drop-shadow-[0_16px_22px_rgba(36,68,32,.28)]" />
        <div className="absolute inset-[7%]" style={shapeMask("sun")}>
          <Image {...contentImage(content, "small", "/images/home/welcome-small.webp", "Little learners playing together at Little Mahilam Preschool")} unoptimized={!isOptimizable(contentImage(content, "small", "/images/home/welcome-small.webp", "").src)} fill sizes="(min-width: 1024px) 230px, 42vw" className="object-cover" />
        </div>
      </div>

      {/* Crayon sun with slowly turning rays */}
      <Doodle viewBox="0 0 100 100" color={PALETTE.sun} width={6} filter={crayon} className="right-[1%] top-[-2%] w-[25%]">
        <circle {...draw(1.05)} cx="50" cy="50" r="18" fill={PALETTE.butter} />
        <g className="lg:animate-[fx-spin_24s_linear_infinite]" style={{ transformOrigin: "50px 50px" }}>{RAYS.map((d, i) => <path key={d} {...draw(1.1 + i * 0.05)} d={d} />)}</g>
      </Doodle>

      {/* Paper plane with a looping dashed trail */}
      <div className="pointer-events-none absolute left-[24%] top-[-13%] w-[22%] lg:animate-[fx-hop_5.2s_ease-in-out_infinite]" style={{ "--fx-hop": "-8px" } as CSSProperties}>
        <Doodle viewBox="0 0 120 90" color={PALETTE.blue} width={4} filter={crayon} className="inset-0 h-auto w-full">
          <path {...draw(1.5)} d="M58 34 112 8 86 64 76 46Z" fill="#fff" />
          <path {...draw(1.55)} d="M76 46 112 8" />
        </Doodle>
        <svg aria-hidden viewBox="0 0 120 90" fill="none" stroke={PALETTE.blue} strokeWidth={3} strokeLinecap="round" strokeDasharray="5 8" className="fx-fade block h-auto w-full overflow-visible" style={fx({ d: 1.1, dur: 0.6 })}>
          <path d="M56 38C30 50 6 44 10 28S40 16 34 40 10 76 -8 84" />
        </svg>
      </div>

      {/* Scribbled sparkles */}
      <Doodle viewBox="0 0 40 40" color={PALETTE.pink} width={3.5} filter={crayon} className="right-[3%] top-[34%] w-[9%]">
        <path {...draw(1.6)} d="M20 2Q22 18 38 20 22 22 20 38 18 22 2 20 18 18 20 2Z" />
      </Doodle>
      <Doodle viewBox="0 0 40 40" color={PALETTE.leaf} width={3.5} filter={crayon} className="left-[-1%] top-[30%] w-[7%]">
        <path {...draw(1.65)} d="M20 2Q22 18 38 20 22 22 20 38 18 22 2 20 18 18 20 2Z" />
      </Doodle>

      {/* Love & Joy badge */}
      <div className="fx absolute bottom-[15%] left-[-3%] w-[30%]" style={fx({ y: -80, k: true, r: 20, d: 1.15, dur: 1, ease: "bounce" })}>
        <span className="grid rotate-[-8deg] place-items-center">
          <Shape name="pebble" color={PALETTE.sky} className="col-start-1 row-start-1 h-auto w-full" />
          <span className="col-start-1 row-start-1 flex flex-col items-center gap-1 text-center">
            <Heart className="h-5 w-5 fill-little-green-900 text-little-green-900" />
            <span className="text-base font-extrabold leading-none tracking-tight sm:text-lg">Love &amp; Joy</span>
          </span>
        </span>
      </div>
    </div>
  );
}
