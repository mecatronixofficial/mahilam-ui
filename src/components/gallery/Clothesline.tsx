import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { ArrowRight, Palette } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Butterfly, SECTION_BG, Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";
import { Magnetic } from "@/components/programs/Fx";

export type LinePhoto = { src: string; alt: string; caption: string; rotate: number; drop: boolean };


/** "Tiny hands. Big imagination.": photos pegged on a rope that draws itself, swinging in on scroll and in the breeze. */
export function Clothesline({ photos }: { photos: LinePhoto[] }) {
  return (
    <section className="relative overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.sky }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Butterfly className="absolute left-[6%] top-10 w-10 animate-float" />
        <Butterfly color={BRAND.pink[200]} className="absolute right-[7%] top-24 w-9 animate-float [animation-delay:-2s]" />
      </div>

      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Creative Moments"
          icon={<Palette className="h-4 w-4 text-little-coral-500" />}
          title={<>Tiny hands. <span className="text-little-pink-500">Big imagination.</span></>}
          lead="Painting, crafting, storytelling and imaginative play give children the freedom to create, explore and express their ideas — building confidence, fine motor skills and individuality."
        />

        <Group className="relative mt-10">
          {/* Rope */}
          <svg aria-hidden viewBox="0 0 1000 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 hidden h-20 w-full md:block">
            <path d="M0 6 Q 500 90 1000 6" fill="none" stroke="#9c6d3f" strokeWidth="3" pathLength={1} strokeDasharray={1} className="fx-draw" style={fx({ dur: 1.2, ease: "soft" })} />
          </svg>
          <ul className="relative grid grid-cols-2 gap-x-4 gap-y-10 pt-4 md:grid-cols-4 md:gap-x-8 md:pt-6">
            {photos.map((photo, i) => (
              <li
                key={photo.caption}
                className={`fx flex origin-top flex-col items-center ${photo.drop ? "md:translate-y-8" : ""}`}
                style={fx({ y: -30, r: i % 2 ? 35 : -35, d: 0.6 + i * 0.15, dur: 1.4, ease: "spring" })}
              >
                {/* Gentle breeze */}
                <div
                  className="fx-wiggle flex w-full origin-top flex-col items-center"
                  style={{ "--fx-w": "1.6deg", "--fx-dur": `${5 + i}s` } as CSSProperties}
                >
                  <div className="flex w-full origin-top flex-col items-center hover:animate-[fx-swing_1.2s_ease-out] active:animate-[fx-swing_1.2s_ease-out]">
                    {/* Wooden peg */}
                    <span aria-hidden className="relative z-10 -mb-3 h-8 w-3.5 rounded-sm bg-[#d9a86c] shadow-md ring-1 ring-[#9c6d3f]/40">
                      <span className="absolute inset-x-0 top-3 h-0.5 bg-[#9c6d3f]/50" />
                    </span>
                    <figure className="group w-full cursor-pointer bg-white p-2.5 pb-10 shadow-[0_22px_40px_-22px_rgba(36,68,32,.5)]" style={{ rotate: `${photo.rotate}deg` }}>
                      <div className="relative aspect-square overflow-hidden bg-little-cream">
                        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 260px, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <figcaption className="mt-2 text-center font-display text-base font-bold text-little-green-900">{photo.caption}</figcaption>
                    </figure>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Group>

        <div className="mt-14 text-center">
          <Magnetic>
            <Link href="/activities" className="group inline-flex h-12 items-center gap-2 rounded-full bg-little-green-900 px-7 text-sm font-extrabold text-white shadow-lg transition-colors hover:bg-little-green-800">
              Explore Activities <ArrowRight className="h-4 w-4 text-little-yellow-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </div>
      </div>

      <Wave color={SECTION_BG.mint} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}
