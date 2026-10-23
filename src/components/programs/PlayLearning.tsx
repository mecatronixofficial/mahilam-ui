import Image from "@/components/media/SchoolImage";
import { Sparkles, Sun } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SECTION_BG, StarDoodle, Wave } from "@/components/about/Doodles";
import { Appear } from "@/components/about/motion";

const STICKER_COLORS = [BRAND.yellow[300], BRAND.coral[200], BRAND.green[200], BRAND.blue[200], BRAND.pink[100]];

function StickerRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Two copies side by side; the strip slides by half its width for a seamless loop.
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul className={`hero-marquee flex w-max gap-3 hover:[animation-play-state:paused] ${reverse ? "[animation-direction:reverse]" : ""}`} style={{ animationDuration: "36s" }}>
        {loop.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="group/sticker flex shrink-0 cursor-default items-center gap-2 rounded-full px-5 py-2.5 font-display text-base font-bold text-little-green-950 shadow-[0_8px_16px_-12px_rgba(36,68,32,.6)] transition-[translate,scale,box-shadow] duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_16px_24px_-14px_rgba(36,68,32,.7)]"
            style={{ background: STICKER_COLORS[i % STICKER_COLORS.length], rotate: `${i % 2 ? 1.5 : -1.5}deg` }}
          >
            <StarDoodle color="#fff" className="w-4 transition-transform duration-500 group-hover/sticker:rotate-[144deg] group-hover/sticker:scale-125" />{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Learning through play": statement + photo collage, then two rows of benefit stickers drifting in opposite directions. */
export function PlayLearning({ benefits, images }: { benefits: string[]; images: [string, string] }) {
  const half = Math.ceil(benefits.length / 2);
  return (
    <section className="relative overflow-hidden py-6 md:py-8" style={{ background: SECTION_BG.peach }}>
      <div className="container-pad relative grid items-center gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Appear className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800 shadow-sm">
            <Sparkles className="h-4 w-4 text-little-coral-500" /> Play • Explore • Learn
          </span>
          <h2 className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] text-little-green-950">
            When children enjoy learning, <span className="text-little-coral-500">learning becomes natural.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-8 text-little-neutral-600 lg:mx-0">
            Children are active participants in our classrooms. They learn through touching, observing, talking, creating, moving and experimenting.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {["Touching", "Observing", "Talking", "Creating", "Moving", "Experimenting"].map((verb, i) => (
              <span key={verb} className={`cursor-default ${i % 2 ? "rotate-2" : "-rotate-2"} rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-little-green-900 ring-1 ring-little-green-900/10 transition-[translate,rotate,background-color] duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:bg-little-yellow-100`}>{verb}</span>
            ))}
          </div>
        </Appear>

        <Appear delay={0.1} className="group/collage relative mx-auto w-full max-w-[440px]">
          <div className="relative aspect-square overflow-hidden rounded-[48%_52%_44%_56%/55%_45%_55%_45%] border-[10px] border-white shadow-[0_30px_60px_-30px_rgba(36,68,32,.55)] transition-[border-radius] duration-700 ease-out group-hover/collage:rounded-[56%_44%_58%_42%/44%_58%_42%_56%]">
            <Image src={images[0]} alt="Children learning through play" fill sizes="(min-width: 1024px) 440px, 90vw" className="object-cover transition-transform duration-700 ease-out group-hover/collage:scale-110" />
          </div>
          <div className="absolute -bottom-5 -left-3 h-36 w-36 rotate-[-6deg] overflow-hidden rounded-[28px] border-[6px] border-white shadow-xl transition-[rotate,scale,translate] duration-500 ease-out hover:z-10 group-hover/collage:-translate-y-2 group-hover/collage:rotate-0 group-hover/collage:scale-105 sm:h-40 sm:w-40">
            <Image src={images[1]} alt="Child enjoying creative art activity" fill sizes="160px" className="object-cover" />
          </div>
          <span className="absolute -right-2 top-6 flex h-24 w-24 rotate-12 animate-float flex-col items-center justify-center rounded-full bg-little-yellow-400 text-center font-display text-little-green-950 shadow-xl ring-4 ring-white" style={{ ["--r" as string]: "12deg" }}>
            <Sun className="mb-0.5 h-6 w-6 transition-transform duration-1000 ease-out group-hover/collage:rotate-[360deg]" />
            <span className="text-[11px] font-bold uppercase leading-4">Happy<br />Learning</span>
          </span>
        </Appear>
      </div>

      <div className="relative mt-6 space-y-2">
        <StickerRow items={benefits.slice(0, half)} />
        <StickerRow items={benefits.slice(half)} reverse />
      </div>

      <Wave color={SECTION_BG.cream} className="absolute inset-x-0 bottom-0 h-5" />
    </section>
  );
}
