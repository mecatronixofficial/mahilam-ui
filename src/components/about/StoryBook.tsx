import { contentText, contentImage, type SectionContent } from "@/lib/page-content";
import { isOptimizable } from "@/lib/media";
import Image from "@/components/media/SchoolImage";
import type { CSSProperties } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { BookOpen } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Butterfly, FlowerDoodle, PencilDoodle, SECTION_BG, StarDoodle, Wave } from "./Doodles";
import { SectionHeading } from "./motion";
import { handwriting } from "./fonts";

const BLOCKS = [
  { label: "Learn through play", face: BRAND.yellow[400], side: BRAND.yellow[600], ink: BRAND.green[950], tilt: -3 },
  { label: "Explore with curiosity", face: BRAND.green[300], side: BRAND.green[500], ink: BRAND.green[950], tilt: 2 },
  { label: "Express with confidence", face: BRAND.coral[300], side: BRAND.coral[500], ink: BRAND.green[950], tilt: -2 },
  { label: "Grow with happiness", face: BRAND.blue[300], side: BRAND.blue[500], ink: BRAND.green[950], tilt: 3 },
];

/** Each page swings open from the spine (`.fx-flip`, a CSS rotateY). */
const open = (ry: number, d = 0) => ({ ...fx({ d, dur: 1.3, ease: "spring" }), "--fx-ry": `${ry}deg` }) as CSSProperties;

/** "Our Story" as an open picture book; the pages swing open from the spine when scrolled into view. */
export function StoryBook({ image, content }: { image: string; content?: SectionContent }) {
  return (
    <section id="our-story" className="relative scroll-mt-20 overflow-hidden pb-28 pt-12 md:pt-16" style={{ background: SECTION_BG.cream }}>
      {/* Garden doodles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Butterfly className="absolute left-[6%] top-24 w-12 animate-float" style={{ ["--r" as string]: "-12deg" }} />
        <Butterfly color={BRAND.yellow[300]} className="absolute right-[7%] top-[38%] w-10 animate-float [animation-delay:-2.5s]" style={{ ["--r" as string]: "14deg" }} />
        <StarDoodle className="absolute right-[18%] top-16 w-6 animate-twinkle" />
        <StarDoodle color={BRAND.pink[200]} className="absolute left-[14%] bottom-48 w-5 animate-twinkle [animation-delay:-1.5s]" />
        <FlowerDoodle className="absolute bottom-24 left-[3%] hidden h-14 w-auto md:block" />
        <FlowerDoodle color={BRAND.yellow[400]} className="absolute bottom-24 right-[4%] hidden h-12 w-auto md:block" />
      </div>

      <div className="container-pad relative">
        <SectionHeading content={content} eyebrow="Our Story" icon={<BookOpen className="h-4 w-4" />} title={<>A happy beginning for every <span className="text-little-pink-500">little learner.</span></>} />

        {/* The book */}
        <Group className="relative mx-auto mt-12 max-w-5xl [perspective:1800px]">
          <div aria-hidden className="absolute inset-x-6 -bottom-4 h-10 rounded-[50%] bg-little-green-900/10 blur-xl" />
          <div className="relative grid rounded-[34px] bg-little-coral-400 p-2.5 shadow-[0_40px_70px_-40px_rgba(36,68,32,.6)] sm:p-3.5 md:grid-cols-2">
            {/* Left page — picture */}
            <div
              className="fx-flip relative overflow-hidden rounded-t-[26px] bg-[#fffdf7] p-6 sm:p-8 md:rounded-l-[26px] md:rounded-tr-none"
              style={{ ...open(70), transformOrigin: "right center", backgroundImage: "linear-gradient(90deg, transparent 88%, rgba(36,68,32,.07))" }}
            >
              <div className="relative mx-auto w-[92%] -rotate-2 rounded-[22px] bg-white p-2.5 pb-12 shadow-[0_20px_40px_-24px_rgba(36,68,32,.6)]">
                <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-little-yellow-400/80" />
                <div className="relative aspect-[4/3.6] overflow-hidden rounded-[16px] bg-little-cream">
                  <Image {...contentImage(content, "main", image, "Children enjoying learning activities at Little Mahilam Preschool")} unoptimized={!isOptimizable(contentImage(content, "main", image, "").src)} fill sizes="(min-width: 768px) 440px, 90vw" className="object-cover transition duration-700 hover:scale-105" />
                </div>
                <p className={`${handwriting.className} absolute inset-x-0 bottom-2 text-center text-2xl font-bold text-little-green-900`}>Learning time!</p>
              </div>
              <PencilDoodle className="absolute bottom-6 left-4 w-20 -rotate-12" />
              <FlowerDoodle color={BRAND.blue[300]} className="absolute bottom-4 right-6 h-10 w-auto" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold text-little-neutral-400">1</span>
            </div>

            {/* Right page — the story */}
            <div
              className="fx-flip relative overflow-hidden rounded-b-[26px] bg-[#fffdf7] p-6 sm:p-9 md:rounded-r-[26px] md:rounded-bl-none"
              style={{ ...open(-70, 0.12), transformOrigin: "left center", backgroundImage: "linear-gradient(270deg, transparent 88%, rgba(36,68,32,.07)), repeating-linear-gradient(180deg, transparent 0 31px, rgba(96,197,195,.16) 31px 32px)" }}
            >
              <p className={`${handwriting.className} text-[2rem] font-bold leading-none text-little-coral-500 sm:text-[2.4rem]`}>Once upon a little dream…</p>
              <p className="mt-5 text-[17px] font-bold leading-8 text-little-neutral-700 first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:rounded-xl first-letter:bg-little-green-400 first-letter:px-3 first-letter:py-0.5 first-letter:font-display first-letter:text-4xl first-letter:leading-[1.2] first-letter:text-white">
                Little Mahilam Preschool is envisioned as a <span className="text-little-green-700">School of Happiness</span> where children are encouraged to be curious, expressive and confident.
              </p>
              <p className="mt-4 leading-8 text-little-neutral-600">We believe childhood should be filled with meaningful experiences, joyful discoveries and opportunities to explore the world through play.</p>
              <p className="mt-4 leading-8 text-little-neutral-600">Our learning environment supports each child&apos;s individuality while helping them develop communication, creativity, independence, emotional confidence and a genuine love for learning.</p>
              <StarDoodle className="absolute right-5 top-5 w-7 animate-twinkle" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold text-little-neutral-400">2</span>
            </div>

            {/* Spine */}
            <span aria-hidden className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-6 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(36,68,32,.14),transparent)] md:block" />
            {/* Ribbon bookmark */}
            <span aria-hidden className="absolute -bottom-6 right-[18%] hidden h-16 w-6 bg-little-yellow-400 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] md:block" />
          </div>
        </Group>

        {/* Building blocks: drop in, then hop and lean the other way on hover */}
        <Group as="ul" className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {BLOCKS.map((block, i) => (
            <li
              key={block.label}
              className="fx relative flex min-h-24 items-center justify-center rounded-[20px] px-4 py-5 text-center font-display text-base font-bold leading-snug transition-[translate,rotate] duration-300 ease-(--ease-back-strong) rotate-(--rest) hover:-translate-y-2.5 hover:rotate-(--hover) sm:text-lg"
              style={{
                ...fx({ y: -40, r: block.tilt * 2, d: i * 0.08, dur: 0.7, ease: "back" }),
                "--rest": `${block.tilt}deg`, "--hover": `${-block.tilt * 1.5}deg`,
                background: block.face, color: block.ink, boxShadow: `inset 0 -8px 0 ${block.side}, 0 16px 24px -16px rgba(36,68,32,.6)`,
              } as CSSProperties}
            >
              {/* Studs on top, like a toy brick */}
              <span aria-hidden className="absolute -top-2.5 left-1/2 flex -translate-x-1/2 gap-3">
                <span className="h-4 w-7 rounded-t-lg" style={{ background: block.face, boxShadow: `inset 0 -3px 0 ${block.side}` }} />
                <span className="h-4 w-7 rounded-t-lg" style={{ background: block.face, boxShadow: `inset 0 -3px 0 ${block.side}` }} />
              </span>
              {block.label}
            </li>
          ))}
        </Group>
      </div>

      <Wave color={SECTION_BG.mint} className="absolute inset-x-0 bottom-0 h-14" />
    </section>
  );
}
