import type { ReactNode } from "react";
import Link from "next/link";
import { Appear } from "@/components/animations/Appear";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Bunny, Elephant, Lion } from "@/components/public/HeroAnimals";
import { BRAND } from "@/lib/brand";
import { Balloon, Cloud, FlowerDoodle, Hills, SECTION_BG, Tree } from "./Doodles";
import { handwriting } from "./fonts";

const ARCH = { borderTopLeftRadius: "50% 190px", borderTopRightRadius: "50% 190px" };

type GateLink = { href: string; label: string };

const DEFAULT_TITLE = <>Come <span className="text-little-coral-500">play</span>, <span className="text-little-blue-500">learn</span> &amp; <span className="text-little-green-600">grow</span> with us.</>;

/** Closing invitation drawn as the preschool's entrance gate, with a waving "Welcome!" flag. Copy and links can be swapped per page. */
export function SchoolGateCTA({
  eyebrow = "You're invited",
  title = DEFAULT_TITLE,
  text = "Visit Little Mahilam and experience our School of Happiness — our classrooms, activities, learning environment and the joyful experiences we create for young children.",
  primary = { href: "/contact", label: "Visit Our School" },
  secondary = { href: "/admissions", label: "Admissions Open" },
}: { eyebrow?: string; title?: ReactNode; text?: string; primary?: GateLink; secondary?: GateLink }) {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20" style={{ background: `linear-gradient(180deg, ${SECTION_BG.sky} 0%, ${BRAND.blue[100]} 100%)` }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute left-[5%] top-10 w-32 animate-drift" />
        <Cloud className="absolute right-[6%] top-24 w-24 animate-drift opacity-80 [--drift:-44px] [animation-delay:-10s]" />
        <Balloon color={BRAND.pink[300]} className="absolute left-[12%] top-[38%] hidden w-10 animate-float md:block" />
        <Balloon color={BRAND.yellow[400]} className="absolute right-[13%] top-[30%] hidden w-12 animate-float [animation-delay:-2s] md:block" />
      </div>

      <div className="container-pad relative">
        <Appear
          className="relative mx-auto max-w-3xl pt-16" y={60} dur={1}
        >
          {/* Flag on top of the arch */}
          <div aria-hidden className="absolute left-1/2 top-0 z-20 flex -translate-x-[2px] items-start">
            <span className="h-32 w-1.5 rounded-t-full bg-little-green-900" />
            <span className="mt-1 animate-flag rounded-r-lg bg-little-pink-400 py-2 pl-3 pr-6 font-display text-lg font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,86%_50%,100%_100%,0_100%)]" style={{ transformOrigin: "left center" }}>
              Welcome!
            </span>
          </div>

          {/* Gate: outer coral arch, inner butter arch, then the doorway */}
          <div className="relative mt-16 border-[18px] border-b-0 border-little-coral-400 sm:border-[24px] sm:border-b-0" style={ARCH}>
            <div className="border-[8px] border-b-0 border-little-yellow-300 sm:border-[10px] sm:border-b-0" style={ARCH}>
              <div className="relative overflow-hidden bg-white/85 px-6 pb-14 pt-24 text-center backdrop-blur-sm sm:px-12 sm:pt-28" style={ARCH}>
                {/* Name board hanging in the arch */}
                <span className="absolute left-1/2 top-6 -translate-x-1/2 rotate-[-2deg] rounded-xl bg-little-green-900 px-5 py-1.5 font-display text-sm font-bold tracking-wide text-little-yellow-300 shadow-md sm:top-8 sm:text-base">
                  Little Mahilam
                </span>
                <span className="text-xs font-extrabold uppercase tracking-[.2em] text-little-green-700">{eyebrow}</span>
                <h2 className="mx-auto mt-3 max-w-xl text-balance font-display text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.08] text-little-green-950">
                  {title}
                </h2>
                <p className="mx-auto mt-4 max-w-lg leading-8 text-little-neutral-600">
                  {text}
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <span className="fx-press">
                    <Link href={primary.href} className="inline-flex h-13 items-center gap-2 rounded-full bg-little-green-900 px-7 text-[15px] font-extrabold text-white shadow-[0_16px_30px_-16px_rgba(36,68,32,.9)]">
                      {primary.label} <ArrowRight className="h-4 w-4 text-little-yellow-400" />
                    </Link>
                  </span>
                  <span className="fx-press">
                    <Link href={secondary.href} className="inline-flex h-13 items-center gap-2 rounded-full bg-little-yellow-400 px-7 text-[15px] font-extrabold text-little-green-950 shadow-[0_14px_26px_-16px_rgba(185,143,19,.9)]">
                      <GraduationCap className="h-4 w-4" /> {secondary.label}
                    </Link>
                  </span>
                </div>
                <p className={`${handwriting.className} mt-6 text-2xl font-bold text-little-green-900/70`}>— with love, Little Mahilam</p>
              </div>
            </div>
            {/* Pillar caps */}
            <span aria-hidden className="absolute -bottom-1 -left-[26px] h-5 w-[34px] rounded-md bg-little-coral-500 sm:-left-[32px] sm:w-[40px]" />
            <span aria-hidden className="absolute -bottom-1 -right-[26px] h-5 w-[34px] rounded-md bg-little-coral-500 sm:-right-[32px] sm:w-[40px]" />
          </div>
        </Appear>

        {/* Friends waiting at the gate */}
        <div aria-hidden className="pointer-events-none">
          <span className="absolute bottom-6 left-0 hidden w-20 animate-bob sm:block md:left-[4%] lg:w-24"><Lion className="w-full" /></span>
          <span className="absolute bottom-6 left-[14%] hidden w-16 animate-bob [animation-delay:-1.5s] lg:block"><Elephant className="w-full" /></span>
          <span className="absolute bottom-6 right-0 hidden w-16 animate-bob [animation-delay:-2.5s] sm:block md:right-[5%] lg:w-20"><Bunny className="w-full" /></span>
          <Tree className="absolute bottom-6 right-[16%] hidden w-14 lg:block" />
        </div>
      </div>

      {/* Ground */}
      <div aria-hidden className="pointer-events-none relative -mt-2">
        <div className="absolute inset-x-0 bottom-8 flex justify-around px-[6%]">
          {[BRAND.pink[300], BRAND.yellow[400], BRAND.blue[300], BRAND.coral[300], BRAND.pink[200], BRAND.yellow[300]].map((color, i) => (
            <FlowerDoodle key={i} color={color} className={`h-8 w-auto sm:h-10 ${i > 3 ? "hidden sm:block" : ""}`} />
          ))}
        </div>
        <Hills className="h-16 sm:h-20" back={BRAND.green[300]} front={BRAND.green[400]} />
      </div>
    </section>
  );
}
