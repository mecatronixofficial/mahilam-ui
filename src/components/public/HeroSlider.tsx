"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Puzzle, Sparkles, Sprout } from "lucide-react";
import type { Banner } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";
import { Bunny, Elephant, Giraffe, Lion, Monkey } from "./HeroAnimals";

const SLIDE_MS = 6500;
const RIBBON = ["Joyful learning", "Child-centred care", "Play-way discovery", "Play Group to Grade 3", "School of Happiness"];
const imageFor = (banner: Banner) => banner.desktopImage || banner.mobileImage || "";
/** Toy-block tower: each word is a chunky block with a darker "side" for depth. */
const BLOCKS = [
  { word: "Play", icon: Puzzle, face: "#ef8a73", side: "#c9614b", tilt: "-4deg", shift: "0px" },
  { word: "Learn", icon: BookOpen, face: "#3f9a76", side: "#2a6f54", tilt: "3deg", shift: "14px" },
  { word: "Grow", icon: Sprout, face: "#4aa3d4", side: "#2f7aa6", tilt: "-2deg", shift: "4px" },
];
const peek = (from: string, delay: number, to = "0 0", dur = 9) => ({ "--peek-from": from, "--peek-to": to, "--peek-delay": `${delay}s`, "--peek-dur": `${dur}s` }) as CSSProperties;

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  return words.length < 2 ? ["", title] : [words.slice(0, -1).join(" "), words.at(-1)!];
}

export function HeroSlider({ banners: input }: { banners: Banner[] }) {
  const banners = input.filter((banner) => banner.active !== false && imageFor(banner)).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = banners.length;

  // Auto-advance; paused while the banner is hovered/focused, and off for reduced-motion visitors.
  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  if (!count) return <FallbackHero />;

  const banner = banners[index];
  const [lead, last] = splitTitle(banner.title);
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <section className="relative overflow-hidden bg-[#fffaf0] pt-8 sm:pt-10" aria-roledescription="carousel" aria-label="Homepage highlights">
      {/* Dotted paper texture + soft colour washes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(23,60,47,.12)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,#000_0%,transparent_85%)]" />
        <span className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#f7c85b]/25 blur-3xl" />
        <span className="absolute -right-20 bottom-10 h-[28rem] w-[28rem] rounded-full bg-[#a7d9c1]/35 blur-3xl" />
      </div>

      {/* Hide-and-seek: elephant peeks in from the left edge, monkey drops in at the top left */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-[46%] z-20 w-16 -translate-y-1/2 sm:w-24 lg:w-28">
        <div className="motion-safe:hero-peek motion-reduce:-translate-x-[35%]" style={peek("-100% 0", 1.5, "-35% 0", 9)}><Elephant className="w-full drop-shadow-lg" /></div>
      </div>
      <div aria-hidden className="pointer-events-none absolute left-[4%] top-0 z-20 w-16 motion-safe:hero-peek sm:w-20 lg:left-[3%]" style={peek("0 -100%", 4, "0 0", 10)}><Monkey className="w-full motion-safe:hero-swing" /></div>

      <div className="container-pad relative z-10 w-[min(1400px,calc(100%-32px))] pb-20 md:pb-24">
        {/* Auto-advances; hovering (or keyboard focus inside) the banner pauses it. */}
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchX.current === null) return; const distance = event.changedTouches[0].clientX - touchX.current; if (Math.abs(distance) > 50) go(index + (distance < 0 ? 1 : -1)); touchX.current = null; }}>
          {/* Lion peeking out diagonally from the rounded top-right corner. The wrapper is rotated 45°,
              so sliding "down" in its own space moves the lion bottom-left → top-right on screen. */}
          <div aria-hidden className="pointer-events-none absolute -right-[18px] -top-[18px] w-20 rotate-45 sm:-right-[16px] sm:-top-[16px] sm:w-28">
            <div className="motion-safe:hero-peek" style={peek("0 80%", 0, "0 0", 8)}><Lion className="w-full drop-shadow-lg" /></div>
          </div>

          {/* Playful colour cards stacked behind the banner */}
          <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-3 rotate-[1.2deg] rounded-[36px] rounded-tr-[120px] bg-[#f7c85b] sm:rounded-[56px] sm:rounded-tr-[180px]" />
          <div aria-hidden className="absolute inset-0 -translate-x-2 translate-y-2 -rotate-[1deg] rounded-[36px] rounded-tr-[120px] bg-[#a7d9c1] sm:rounded-[56px] sm:rounded-tr-[180px]" />

          {/* Banner: photo with the content in front of it */}
          <div className="relative flex min-h-[540px] overflow-hidden rounded-[36px] rounded-tr-[120px] border-[6px] border-white bg-emerald-950 shadow-[0_30px_70px_-30px_rgba(23,60,47,.6)] sm:min-h-[480px] sm:rounded-[56px] sm:rounded-tr-[180px] sm:border-[8px] lg:min-h-[520px]">
            {banners.map((item, itemIndex) => (
              <div key={item.id} role="group" aria-roledescription="slide" aria-label={`${itemIndex + 1} of ${count}`} aria-hidden={itemIndex !== index} className={`absolute inset-0 transition-opacity duration-700 ${itemIndex === index ? "opacity-100" : "opacity-0"}`}>
                <div key={itemIndex === index ? `zoom-${index}` : item.id} className={`absolute inset-0 ${itemIndex === index ? "motion-safe:hero-kenburns" : ""}`}>
                  <Image src={imageFor(item)} alt="" fill sizes="(min-width: 1400px) 1400px, 100vw" priority={itemIndex === 0} unoptimized={!isOptimizable(imageFor(item))} className="object-cover" />
                </div>
              </div>
            ))}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,35,27,.92)_0%,rgba(10,35,27,.62)_48%,rgba(10,35,27,.08)_80%)] lg:bg-[linear-gradient(90deg,rgba(10,35,27,.9)_0%,rgba(10,35,27,.62)_38%,rgba(10,35,27,0)_68%)]" />

            <div className="relative z-10 flex w-full min-w-0 flex-col justify-end p-6 pb-14 text-white sm:p-10 sm:pb-16 lg:max-w-[660px] lg:justify-center lg:px-16 lg:py-12">
              <div key={index} className="flex animate-fade-up flex-col items-start">
                <span className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-emerald-950/45 py-1.5 pl-1.5 pr-3.5 text-[11px] font-bold backdrop-blur-md sm:gap-2.5 sm:pr-4 sm:text-xs">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7c85b] text-emerald-950"><Sparkles className="h-3.5 w-3.5" /></span>
                  <span className="uppercase tracking-[.1em] sm:tracking-[.16em]">School of Happiness</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-white/50" />
                  <span className="inline-flex items-center gap-1 text-[#ffb59f]"><MapPin className="h-3.5 w-3.5" /> Tiruppur</span>
                </span>

                <h1 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.6vw,3.4rem)] font-bold leading-[1.08] tracking-[-.03em] drop-shadow-[0_4px_18px_rgba(0,0,0,.35)]">
                  {lead}{lead && " "}
                  <span className="relative inline-block whitespace-nowrap text-[#f7c85b]">
                    {last}
                    <svg aria-hidden className="absolute -bottom-2 left-0 h-3 w-full text-[#ef9e8a]" viewBox="0 0 200 16" preserveAspectRatio="none"><path d="M3 11 C40 3 70 15 105 8 S165 3 197 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
                  </span>
                </h1>

                {banner.subtitle && <p className="mt-5 max-w-lg border-l-4 border-[#ef9e8a] pl-4 text-sm leading-6 text-white/85 sm:text-base sm:leading-7">{banner.subtitle}</p>}

                {((banner.ctaLabel && banner.ctaLink) || (banner.secondaryCtaLabel && banner.secondaryCtaLink)) && (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {banner.ctaLabel && banner.ctaLink && <Link href={banner.ctaLink} className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#f7c85b] pl-6 pr-1.5 text-sm font-extrabold text-emerald-950 shadow-[0_14px_30px_-14px_rgba(0,0,0,.6)] transition hover:-translate-y-0.5 hover:bg-[#ffd36e]">{banner.ctaLabel}<span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-white"><ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span></Link>}
                    {banner.secondaryCtaLabel && banner.secondaryCtaLink && <Link href={banner.secondaryCtaLink} className="inline-flex h-12 items-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-bold backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20">{banner.secondaryCtaLabel}</Link>}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Floating sticker: "Play · Learn · Grow" as a little tower of toy blocks */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute right-6 top-[20%] hidden flex-col items-end gap-1.5 motion-safe:animate-[float_6s_ease-in-out_infinite] md:flex lg:right-12">
              {BLOCKS.map(({ word, icon: Icon, face, side, tilt, shift }) => (
                <span key={word} className="flex w-28 items-center justify-center gap-2 rounded-xl border-b-[5px] py-2 font-display text-base font-bold text-white shadow-[0_14px_24px_-12px_rgba(0,0,0,.55)] lg:w-32 lg:py-2.5 lg:text-lg" style={{ background: face, borderColor: side, rotate: tilt, marginRight: shift }}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/25"><Icon className="h-3.5 w-3.5" /></span>{word}
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          {count > 1 && (
            <div className="absolute -bottom-6 right-6 z-20 flex gap-2 rounded-full bg-white p-1.5 shadow-xl shadow-emerald-950/15 sm:right-12">
              {banners.map((item, itemIndex) => (
                <button key={item.id} type="button" onClick={() => go(itemIndex)} aria-label={`Show slide ${itemIndex + 1}`} aria-current={itemIndex === index} className={`relative h-11 w-11 overflow-hidden rounded-full ring-2 transition sm:h-12 sm:w-12 ${itemIndex === index ? "ring-[#e2725b] ring-offset-2" : "opacity-60 ring-transparent hover:opacity-100"}`}>
                  <Image src={imageFor(item)} alt="" fill sizes="48px" unoptimized={!isOptimizable(imageFor(item))} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrolling ribbon */}
      <div className="relative z-20 -rotate-1 bg-emerald-900 py-3 text-white">
        {/* Bunny and giraffe pop up from behind the ribbon */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-full h-56 overflow-hidden">
          <div className="absolute bottom-0 left-[8%] w-14 motion-safe:hero-peek sm:w-16" style={peek("0 100%", 2.5, "0 0", 7)}><Bunny className="w-full" /></div>
          <div className="absolute bottom-0 right-[42%] w-16 motion-safe:hero-peek sm:right-[24%] sm:w-20" style={peek("0 100%", 6, "0 0", 11)}><Giraffe className="w-full" /></div>
        </div>
        <div className="flex w-max motion-safe:hero-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {[...RIBBON, ...RIBBON].map((label, i) => <span key={i} className="flex items-center gap-6 px-6 font-display text-base font-bold sm:text-lg">{label}<Sparkles className="h-4 w-4 text-[#f7c85b]" /></span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FallbackHero() {
  return <section className="relative overflow-hidden bg-[#fffaf0] py-16 md:py-24"><div className="container-pad grid items-center gap-12 lg:grid-cols-[1fr_.9fr]"><div><span className="eyebrow"><MapPin className="h-4 w-4 text-[#e2725b]" /> Kangayam Road · Tiruppur</span><h1 className="mt-6 font-display text-5xl font-bold leading-[.95] tracking-tight text-emerald-950 md:text-7xl">A School of <span className="text-[#e2725b]">Happiness.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">A child-centric preschool where children explore, discover and grow through joyful play-way learning.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/admissions" className="btn-accent">Book a campus visit <ArrowRight className="h-4 w-4" /></Link><Link href="/programs" className="btn-soft">Explore programs</Link></div></div><div className="relative aspect-[4/3] overflow-hidden rounded-[40px] shadow-2xl"><Image src="/imgs/home/kid1.jpg" alt="Children learning at Little Mahilam Preschool" fill priority sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" /></div></div></section>;
}
