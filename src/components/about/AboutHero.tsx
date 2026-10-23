import { contentText, contentImage, type SectionContent } from "@/lib/page-content";
import { isOptimizable } from "@/lib/media";
import Image from "@/components/media/SchoolImage";
import type { CSSProperties } from "react";
import { fx } from "@/components/animations/fx";
import { ChevronDown, Sparkles } from "lucide-react";
import { Shape, shapeMask, PALETTE } from "@/components/public/PlayShapes";
import { BRAND } from "@/lib/brand";
import { AbcBlocks, Balloon, Cloud, HeartDoodle, Hills, PencilDoodle, Rainbow, SECTION_BG, StarDoodle, SunDoodle } from "./Doodles";

/** Load-in for the hero copy: plays from first paint (the section carries `data-in`). */
const rise = (delay: number) => fx({ y: 26, d: delay, dur: 0.9, ease: "spring" });

/** Floating props around the hero photo; CSS float keeps them off the main thread. */
const PROPS = [
  { el: <AbcBlocks className="w-20 sm:w-24" />, className: "-left-4 bottom-[12%] sm:-left-8", delay: "0s", r: "-6deg" },
  { el: <StarDoodle className="w-10 sm:w-12" />, className: "left-[6%] top-[4%]", delay: "-1.4s", r: "12deg" },
  { el: <Rainbow className="w-24 sm:w-32" />, className: "-right-2 -top-4 sm:-right-6", delay: "-2.6s", r: "6deg" },
  { el: <PencilDoodle className="w-20 sm:w-24" />, className: "-right-4 bottom-[30%] sm:-right-10", delay: "-0.8s", r: "-28deg" },
  { el: <Balloon color={BRAND.pink[400]} className="w-10 sm:w-12" />, className: "-left-2 top-[30%] sm:-left-10", delay: "-3.2s", r: "-8deg" },
  { el: <HeartDoodle className="w-9 sm:w-10" />, className: "right-[16%] bottom-[2%]", delay: "-2s", r: "-10deg" },
];

export function AboutHero({ image, imageAlt, secondImage, content }: { content?: SectionContent; image: string; imageAlt: string; secondImage: string }) {
  return (
    <section data-in="" className="relative isolate overflow-hidden" style={{ background: `linear-gradient(180deg, ${BRAND.blue[100]} 0%, ${SECTION_BG.sky} 55%, ${BRAND.yellow[50]} 100%)` }}>
      {/* Sky: sun and slowly drifting clouds */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <SunDoodle className="absolute left-[46%] top-8 hidden w-20 lg:block" />
        <Cloud className="absolute left-[4%] top-12 w-32 animate-drift opacity-90" />
        <Cloud className="absolute left-[34%] top-[58%] w-24 animate-drift opacity-70 [--drift:-36px] [animation-delay:-9s]" />
        <Cloud className="absolute right-[6%] top-[14%] hidden w-40 animate-drift opacity-80 [--drift:-56px] [animation-delay:-4s] md:block" />
        {[["12%", "48%"], ["40%", "16%"], ["58%", "70%"], ["90%", "56%"]].map(([left, top], i) => (
          <StarDoodle key={i} color={i % 2 ? BRAND.pink[200] : BRAND.yellow[300]} className="absolute w-4 animate-twinkle" style={{ left, top, animationDelay: `${-i * 0.8}s` }} />
        ))}
      </div>

      <div className="container-pad grid min-h-[calc(100svh-80px)] items-center gap-12 pb-36 pt-12 sm:pb-40 lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:pt-8">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <span style={rise(0)} className="fx inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-extrabold text-little-green-800 shadow-[0_10px_24px_-14px_rgba(36,68,32,.5)]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-little-yellow-400 text-little-green-950"><Sparkles className="h-4 w-4" /></span>
            {contentText(content, "eyebrow") || "Welcome to Little Mahilam"}
          </span>

          <h1 style={rise(0.08)} className="fx mt-6 text-balance font-display text-[clamp(2.6rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-tight text-little-green-950">{contentText(content, "heading") || <>
            Where little minds{" "}
            <span className="relative inline-block text-little-coral-500">
              learn
              <svg aria-hidden viewBox="0 0 120 14" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full">
                <path d="M3 9 Q30 2 60 8 T117 6" fill="none" stroke={BRAND.yellow[400]} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} className="fx-draw" style={fx({ d: 0.7, dur: 0.8, ease: "soft" })} />
              </svg>
            </span>
            , <span className="text-little-blue-500">play</span> &amp; <span className="text-little-pink-500">shine!</span>
          </>}</h1>

          <p style={rise(0.16)} className="fx mx-auto mt-6 max-w-xl text-lg leading-8 text-little-neutral-600 lg:mx-0">{contentText(content, "description") || <>
            A joyful <strong className="font-extrabold text-little-green-800">School of Happiness</strong> where every child gets the freedom to explore, imagine, create and grow.
          </>}</p>

          <div style={rise(0.24)} className="fx mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a href="#our-story" className="fx-press h-13 items-center gap-2 rounded-full bg-little-green-900 px-7 text-[15px] font-extrabold text-white shadow-[0_16px_30px_-16px_rgba(36,68,32,.9)]">
              Explore Our Story <span className="grid h-7 w-7 place-items-center rounded-full bg-little-yellow-400 text-little-green-950"><ChevronDown className="h-4 w-4" /></span>
            </a>
            <a href="#founders" className="fx-press h-13 items-center rounded-full bg-white px-7 text-[15px] font-extrabold text-little-green-900 shadow-[0_12px_26px_-16px_rgba(36,68,32,.6)] ring-1 ring-little-green-900/10">
              Meet Our Founders
            </a>
          </div>
        </div>

        {/* Illustration: photo in a blob, a second photo bubble and floating props */}
        <div className="fx relative mx-auto w-full max-w-[480px]" style={fx({ s: 0.9, r: -3, d: 0.15, dur: 1.1, ease: "spring" })}>
          <Shape name="blob" color={PALETTE.sun} className="absolute inset-0 h-full w-full translate-x-3 translate-y-4 rotate-6" />
          <Shape name="blob" color={PALETTE.pink} className="absolute inset-0 h-full w-full -translate-x-3 -rotate-3 opacity-60" />
          <div className="relative aspect-square w-full" style={shapeMask("blob")}>
            <Image {...contentImage(content, "main", image, imageAlt)} unoptimized={!isOptimizable(contentImage(content, "main", image, "").src)} fill priority sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
          </div>

          <div className="absolute -bottom-6 right-2 w-[34%] sm:right-0">
            <Shape name="flower" color="#fff" className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)]" />
            <div className="relative aspect-square" style={shapeMask("flower")}>
              <Image {...contentImage(content, "small", secondImage, "Children playing at Little Mahilam")} unoptimized={!isOptimizable(contentImage(content, "small", secondImage, "").src)} fill sizes="160px" className="object-cover" />
            </div>
          </div>

          {PROPS.map(({ el, className, delay, r }, i) => (
            <span key={i} aria-hidden className={`pointer-events-none absolute animate-float ${className}`} style={{ animationDelay: delay, ["--r" as string]: r }}>
              {el}
            </span>
          ))}
        </div>
      </div>

      {/* Hill + scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <Hills className="h-24 sm:h-32" back={BRAND.green[200]} front={SECTION_BG.cream} />
      </div>
      <a href="#our-story" className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-extrabold uppercase tracking-[.2em] text-little-green-800">
        Start Exploring
        <span style={{ "--fx-hop": "6px", "--fx-dur": "1.6s" } as CSSProperties} className="fx-hop grid h-9 w-9 place-items-center rounded-full bg-white text-little-green-900 shadow-md">
          <ChevronDown className="h-4 w-4" />
        </span>
      </a>
    </section>
  );
}
