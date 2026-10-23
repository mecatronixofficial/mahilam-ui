import { type SectionContent } from "@/lib/page-content";
import { isOptimizable } from "@/lib/media";
import Image from "@/components/media/SchoolImage";
import type { CSSProperties } from "react";
import { Appear } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { Heart, Instagram } from "lucide-react";
import { Shape, shapeMask, PALETTE, type ShapeName } from "@/components/public/PlayShapes";
import { BRAND } from "@/lib/brand";
import { BookDoodle, FlowerDoodle, HeartDoodle, PaperPlane, PencilDoodle, SECTION_BG, StarDoodle, Wave } from "./Doodles";
import { SectionHeading } from "./motion";
import { handwriting } from "./fonts";

export type Founder = { name: string; role: string; image: string; imageAlt?: string; instagram: string; handle: string };

const LOOKS: { tint: string; blob: string; frame: ShapeName }[] = [
  { tint: BRAND.yellow[100], blob: PALETTE.sun, frame: "blob" },
  { tint: BRAND.blue[100], blob: PALETTE.blue, frame: "pebble" },
];

/** Founders as warm character cards, joined by a beating heart and a handwritten note. */
export function FounderCards({ founders, content }: { founders: Founder[]; content?: SectionContent }) {
  const [left, right] = founders;
  return (
    <section id="founders" className="relative scroll-mt-20 overflow-hidden pb-28 pt-12 md:pt-16" style={{ background: SECTION_BG.peach }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PaperPlane className="absolute left-[4%] top-16 hidden w-32 animate-float md:block" style={{ ["--r" as string]: "-6deg" }} />
        <StarDoodle className="absolute right-[10%] top-20 w-7 animate-twinkle" />
        <StarDoodle color={BRAND.blue[200]} className="absolute bottom-32 left-[8%] w-5 animate-twinkle [animation-delay:-1.2s]" />
      </div>

      <div className="container-pad relative">
        <SectionHeading content={content}
          eyebrow="Meet Our Founders"
          icon={<Heart className="h-4 w-4 fill-little-pink-400 text-little-pink-400" />}
          title={<>Meet the hearts behind our <span className="text-little-pink-500">School of Happiness</span></>}
          lead={<>Little Mahilam was envisioned by educators who believe that early childhood education should feel joyful, meaningful and respectful of every child&apos;s uniqueness.</>}
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_minmax(220px,280px)_1fr] lg:gap-6">
          {left && <FounderCard founder={left} index={0} />}

          {/* The note between the cards, joined by a heart */}
          <Appear
            className="relative mx-auto flex max-w-xs flex-col items-center text-center"
            y={0} s={0.8} d={0.3} dur={0.8} ease="back"
          >
            <svg aria-hidden viewBox="0 0 280 40" className="absolute -left-10 -right-10 top-10 hidden h-10 w-[calc(100%+80px)] lg:block" fill="none">
              <path d="M0 20 Q70 0 120 20" stroke={BRAND.pink[300]} strokeWidth="3" strokeDasharray="5 8" strokeLinecap="round" className="fx-fade" style={fx({ d: 0.6, dur: 1 })} />
              <path d="M280 20 Q210 0 160 20" stroke={BRAND.pink[300]} strokeWidth="3" strokeDasharray="5 8" strokeLinecap="round" className="fx-fade" style={fx({ d: 0.6, dur: 1 })} />
            </svg>
            <span
              className="relative grid h-20 w-20 animate-beat place-items-center rounded-full bg-white shadow-[0_16px_30px_-16px_rgba(235,76,153,.7)]"
            >
              <HeartDoodle className="w-10" />
            </span>
            <blockquote className={`${handwriting.className} relative mt-5 -rotate-2 rounded-[24px] bg-white px-6 py-5 text-[1.7rem] font-bold leading-[1.15] text-little-green-900 shadow-[0_18px_34px_-22px_rgba(36,68,32,.55)]`}>
              <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 rounded-sm bg-little-pink-200/80" />
              “Every child deserves a place where learning begins with happiness.”
              <footer className="mt-3 font-sans text-xs font-extrabold uppercase tracking-[.16em] text-little-neutral-500">{founders.map((f) => f.name).join(" & ")}</footer>
            </blockquote>
          </Appear>

          {right && <FounderCard founder={right} index={1} />}
        </div>
      </div>

      <Wave color={SECTION_BG.cream} flip className="absolute inset-x-0 bottom-0 h-14" />
    </section>
  );
}

const DOODLE_SPOTS = [
  { el: <BookDoodle className="w-12" />, className: "-left-3 top-10", turn: -14 },
  { el: <HeartDoodle className="w-8" />, className: "right-2 top-2", turn: 16 },
  { el: <StarDoodle className="w-8" />, className: "-right-3 top-[44%]", turn: 30 },
  { el: <PencilDoodle className="w-16" />, className: "-left-6 top-[58%] -rotate-[24deg]", turn: -10 },
  { el: <FlowerDoodle color={BRAND.pink[300]} className="h-12 w-auto" />, className: "right-6 top-[68%]", turn: 12 },
];

function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  const look = LOOKS[index % LOOKS.length];
  return (
    <Appear
      as="article"
      y={40} r={index ? 2 : -2} dur={0.9}
      style={{ "--rest": `${index ? 1 : -1}deg` } as CSSProperties}
      className="group relative mx-auto w-full max-w-[380px] rounded-[40px] bg-white p-6 pb-8 text-center shadow-[0_30px_60px_-36px_rgba(36,68,32,.6)] ring-1 ring-black/5 rotate-(--rest) transition-[translate,rotate] duration-500 ease-(--ease-back) hover:-translate-y-2.5 hover:rotate-0"
    >
      <div className="relative rounded-[32px] px-6 pb-4 pt-8" style={{ background: look.tint }}>
        {/* Doodles that turn a little on hover */}
        {DOODLE_SPOTS.map((spot, i) => (
          <span key={i} aria-hidden className={`pointer-events-none absolute z-10 transition-transform duration-500 ease-out ${spot.className}`} style={{ ["--turn" as string]: `${spot.turn}deg` }}>
            <span className="block transition-transform duration-500 group-hover:rotate-[var(--turn)] group-hover:scale-110">{spot.el}</span>
          </span>
        ))}
        <div className="relative mx-auto aspect-square w-[78%]">
          <Shape name={look.frame} color={look.blob} className="absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] rotate-6" />
          <div className="relative h-full w-full overflow-hidden" style={shapeMask(look.frame)}>
            {founder.image ? <Image src={founder.image} alt={founder.imageAlt || `${founder.name}, founder of Little Mahilam Preschool`} unoptimized={!isOptimizable(founder.image)} fill sizes="300px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" /> : <div className="grid h-full w-full place-items-center bg-little-green-100 font-display text-6xl font-bold text-little-green-800" aria-label={founder.name}>{founder.name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("")}</div>}
          </div>
        </div>
      </div>

      <p className="mt-6 inline-flex rounded-full bg-little-green-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.2em] text-little-green-800">{founder.role}</p>
      <h3 className="mt-2 font-display text-2xl font-bold text-little-green-950">{founder.name}</h3>
      <a href={founder.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${founder.name} on Instagram`} className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-extrabold text-little-coral-600 transition hover:text-little-pink-600">
        <Instagram className="h-4 w-4" />{founder.handle}
      </a>
      <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-6 text-little-neutral-500">Creating meaningful early-learning experiences with care, creativity and happiness.</p>
    </Appear>
  );
}
