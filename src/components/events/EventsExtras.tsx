"use client";
import { useState, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { ArrowRight, Camera, Heart, PartyPopper, RotateCw, Users } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { HeartDoodle, SECTION_BG, Wave } from "@/components/about/Doodles";
import { Appear, SectionHeading } from "@/components/about/motion";
import { Magnetic } from "@/components/programs/Fx";

export type Highlight = { title: string; description: string; image: string; tag: string };

const BACKS = [
  { bg: BRAND.yellow[300], emoji: "🪔" },
  { bg: BRAND.blue[200], emoji: "🎨" },
  { bg: BRAND.pink[200], emoji: "👨‍👩‍👧" },
];
const CONFETTI = [BRAND.yellow[400], BRAND.coral[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400]];

/** Event highlights as cards that flip over (hover, focus or tap) to tell their story. */
export function HighlightFlipCards({ items }: { items: Highlight[] }) {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <section className="relative overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.mint }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Event Highlights"
          icon={<Camera className="h-4 w-4" />}
          title={<>Learning becomes even more special <span className="text-little-pink-500">when we celebrate it.</span></>}
        />
        <Group as="ul" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const back = BACKS[i % BACKS.length];
            const isFlipped = flipped === i;
            return (
              <li
                key={item.title}
                className="fx [perspective:1200px]"
                style={fx({ y: 40, d: i * 0.1, dur: 0.9, ease: "spring" })}
              >
                <button
                  type="button"
                  aria-pressed={isFlipped}
                  aria-label={`${item.title}: ${item.description}`}
                  onClick={() => setFlipped(isFlipped ? null : i)}
                  onMouseEnter={() => setFlipped(i)}
                  onMouseLeave={() => setFlipped(null)}
                  onFocus={() => setFlipped(i)}
                  onBlur={() => setFlipped(null)}
                  className="relative block aspect-[3/4] w-full rounded-[30px] text-left outline-none transition-transform duration-700 ease-(--ease-back) [transform-style:preserve-3d] focus-visible:ring-4 focus-visible:ring-little-blue-300"
                  style={{ transform: isFlipped ? "rotateY(180deg)" : undefined }}
                >
                  {/* Front */}
                  <span className="absolute inset-0 overflow-hidden rounded-[30px] bg-little-green-950 text-white shadow-[0_24px_45px_-26px_rgba(36,68,32,.6)] [backface-visibility:hidden]">
                    <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 380px, 80vw" className="object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-little-green-950 via-little-green-950/25 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-extrabold text-little-green-950 shadow-sm" style={{ background: back.bg }}>{item.tag}</span>
                    <span className="absolute inset-x-0 bottom-0 p-6">
                      <span className="block font-display text-2xl font-bold">{item.title}</span>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-white/70"><RotateCw className="h-3.5 w-3.5" /> Flip to read</span>
                    </span>
                  </span>
                  {/* Back */}
                  <span className="absolute inset-0 flex flex-col justify-center rounded-[30px] p-7 text-little-green-950 shadow-[0_24px_45px_-26px_rgba(36,68,32,.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ background: back.bg }}>
                    <span aria-hidden className="text-5xl">{back.emoji}</span>
                    <span className="mt-4 block font-display text-2xl font-bold">{item.title}</span>
                    <span className="mt-3 block leading-7 text-little-green-950/80">{item.description}</span>
                    <span className="mt-5 inline-flex w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold">{item.tag}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </Group>
      </div>
      <Wave color={SECTION_BG.cream} flip className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}

const HEART_CLIP = "M0.5,0.24 C0.5,0.24 0.41,0.02 0.2,0.06 C0,0.1 -0.03,0.36 0.08,0.52 C0.2,0.7 0.5,0.95 0.5,0.95 C0.5,0.95 0.8,0.7 0.92,0.52 C1.03,0.36 1,0.1 0.8,0.06 C0.59,0.02 0.5,0.24 0.5,0.24 Z";

/** "Family & Community": a heart-shaped photo that beats, with little hearts floating up around it. */
export function FamilyHeart({ image }: { image: string }) {
  return (
    <section className="overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.cream }}>
      <svg aria-hidden width="0" height="0" className="absolute">
        <clipPath id="heart-clip" clipPathUnits="objectBoundingBox"><path d={HEART_CLIP} /></clipPath>
      </svg>
      <div className="container-pad grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Appear className="group relative mx-auto w-full max-w-[440px]">
          {/* Floating hearts */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-10 top-0">
            {[8, 26, 50, 72, 90].map((left, i) => (
              <span key={left} className="absolute bottom-0 animate-rise" style={{ left: `${left}%`, animationDelay: `${-i * 1.9}s`, animationDuration: `${8 + (i % 3)}s`, ["--rise" as string]: "-380px", ["--r" as string]: `${i % 2 ? 12 : -12}deg` } as CSSProperties}>
                <HeartDoodle color={CONFETTI[(i + 1) % CONFETTI.length]} className="w-6" />
              </span>
            ))}
          </div>
          <div className="relative aspect-square animate-beat drop-shadow-[0_24px_30px_rgba(232,94,75,.35)] transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 bg-little-coral-300" style={{ clipPath: "url(#heart-clip)", transform: "translate(10px, 10px)" }} />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "url(#heart-clip)" }}>
              <Image src={image} alt="Families participating in a school event" fill sizes="(min-width: 1024px) 440px, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        </Appear>

        <Appear delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800 shadow-sm"><Users className="h-4 w-4" /> Family &amp; Community</span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-little-green-950 sm:text-4xl">
            School becomes stronger when <span className="text-little-pink-500">families are part of the journey.</span>
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-little-neutral-600">Family participation helps children feel supported and creates stronger connections between home and school.</p>
          <p className="mt-4 max-w-xl leading-8 text-little-neutral-600">Our community events give parents opportunities to participate, interact and enjoy memorable moments alongside their children.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/contact" className="group/cta inline-flex items-center gap-2 rounded-full bg-little-green-900 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition-colors hover:bg-little-green-800">
                Connect With Our School <ArrowRight className="h-4 w-4 text-little-yellow-400 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </Magnetic>
            <span className="group/love flex cursor-default items-center gap-2 font-display text-lg font-bold text-little-coral-700">
              <Heart className="h-5 w-5 fill-current transition-transform duration-300 group-hover/love:scale-125" /> Happy memories, together
            </span>
          </div>
        </Appear>
      </div>
    </section>
  );
}

/** Closing party band: confetti keeps drifting down behind the invitation. */
export function PartyBand() {
  return (
    <section className="py-6 md:py-8">
      <div className="container-pad">
        <Appear className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,var(--color-little-coral-100),var(--color-little-pink-200)_50%,var(--color-little-yellow-200))] px-4 py-5 text-little-green-950 md:px-6 md:py-6">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                className="absolute top-0 block h-3.5 w-2 animate-fall rounded-sm"
                style={{ left: `${(i * 61) % 100}%`, background: CONFETTI[i % CONFETTI.length], animationDelay: `${-((i * 0.9) % 7)}s`, animationDuration: `${6 + (i % 4)}s`, ["--fall" as string]: "340px" } as CSSProperties}
              />
            ))}
          </div>
          <div className="relative grid items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
            <span className="fx-wiggle flex h-11 w-11 items-center justify-center rounded-[16px] bg-white text-little-coral-600 shadow-md" style={{ "--fx-w": "12deg", "--fx-dur": "3s" } as CSSProperties}>
              <PartyPopper className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[.18em] text-little-green-950/60">Be Part Of Our Community</span>
              <h2 className="mt-2 max-w-3xl font-display text-xl font-bold leading-tight sm:text-2xl">Your family&apos;s journey can start here.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-5 text-little-green-950/70">Visit Little Mahilam and discover a learning community filled with joyful experiences, celebrations and happy childhood memories.</p>
            </div>
            <Magnetic>
              <Link href="/admissions" className="group/cta inline-flex items-center justify-center gap-2 rounded-full bg-little-green-900 px-3 py-2 text-xs font-extrabold text-white shadow-lg transition-colors hover:bg-little-green-950">
                Explore Admissions <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </Appear>
      </div>
    </section>
  );
}
