"use client";
import { contentText, contentImage, type SectionContent } from "@/lib/page-content";


import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Banner } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Float, FloatingShape } from "@/components/animations/FloatingShape";
import { MouseParallax } from "@/components/animations/MouseParallax";
import { fx } from "@/components/animations/fx";
import { ArrowBubble, MarkedWord, PALETTE, Shape, type ShapeName } from "./PlayShapes";
import { ShapePile } from "./ShapePile";

const SLIDE_MS = 6500;
const imageFor = (banner: Banner) => banner.desktopImage || banner.mobileImage || "";
/** "Play · Learn · Grow" stickers: each word sits on its own shape. */
const STICKERS: { word: string; shape: ShapeName; color: string; rotate: number; className: string }[] = [
  { word: "Play", shape: "pebble", color: PALETTE.pink, rotate: -10, className: "left-[-4%] top-[8%]" },
  { word: "Learn", shape: "burst", color: PALETTE.sun, rotate: 8, className: "left-[10%] top-[34%]" },
  { word: "Grow", shape: "cloud", color: PALETTE.leaf, rotate: -4, className: "left-[-2%] top-[60%]" },
];

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  return words.length < 2 ? ["", title] : [words.slice(0, -1).join(" "), words.at(-1)!];
}

/**
 * Load sequence (alongside the header's glide-in): chip → photo wipes up while easing out of a zoom →
 * copy and buttons rise → shapes pop and stickers spring in → the shape pile tumbles down.
 * All CSS, rendered on the server with its delays, so it starts on first paint. While scrolling, the
 * photo drifts inside its frame (`[data-hero-parallax]`, a CSS scroll timeline).
 */
const intro = {
  chip: fx({ y: 20, d: 0.1, dur: 0.6 }),
  copy: (i: number) => fx({ y: 28, k: true, d: 0.5 + i * 0.08, dur: 0.7 }),
  deco: (i: number) => fx({ s: 0, r: -60, d: 0.6 + i * 0.1, dur: 0.8, ease: "back-strong" }),
  sticker: (i: number) => fx({ s: 0, r: -30, d: 0.75 + i * 0.1, dur: 0.7, ease: "back" }),
};

function Chip() {
  return (
    <span className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full bg-white py-1.5 pl-1.5 pr-4 text-xs font-bold sm:text-sm">
      <Shape name="burst" color={PALETTE.sun} className="h-6 w-6" />
      <span>School of Happiness</span>
      <span aria-hidden className="h-1 w-1 rounded-full bg-little-green-900/40" />
      <span className="inline-flex items-center gap-1 text-little-green-900/70"><MapPin className="h-3.5 w-3.5" /> Tiruppur</span>
    </span>
  );
}

/** Rounded photo frame: clip-path wipe on load, inner layers for the load zoom and scroll drift. */
function PhotoFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`fx-clip relative overflow-hidden rounded-[32px] bg-little-green-900 sm:rounded-[44px] ${className}`} style={fx({ clip: "inset(100% 0% 0% 0% round 44px)", d: 0.3, dur: 1.1, ease: "expo" })}>
      <div data-hero-parallax className="absolute inset-x-0 -bottom-[8%] -top-[8%]">
        <div className="fx-zoom absolute inset-0" style={fx({ s: 1.08, d: 0.3, dur: 1.4, ease: "soft" })}>{children}</div>
      </div>
    </div>
  );
}

function BackgroundShapes() {
  return (
    <div aria-hidden data-depth="1.6" className="pointer-events-none absolute inset-0">
      <div className="fx absolute -left-8 bottom-4 hidden w-28 opacity-80 lg:block" style={intro.deco(0)}>
        <FloatingShape name="squiggle" color={PALETTE.coral} rotate={-20} duration={6.5} />
      </div>
      <div className="fx absolute -top-4 right-[3%] w-12 sm:w-16" style={intro.deco(1)}>
        <FloatingShape name="plus" color={PALETTE.blue} rotate={12} amp={8} duration={5.2} />
      </div>
    </div>
  );
}

export function HeroSlider({ banners: input, content }: { banners: Banner[]; content?: SectionContent }) {
  const banners = input.filter((banner) => banner.active !== false && imageFor(banner)).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  // After the first slide change, new slides animate on their own (no intro hiding / delay).
  const cycled = useRef(false);
  const count = banners.length;

  useEffect(() => {
    if (index !== 0) cycled.current = true;
  }, [index]);

  // Auto-advance; paused while the banner is hovered/focused, and off for reduced-motion visitors.
  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  if (!count) return <FallbackHero content={content} />;

  const banner = banners[index];
  const [lead, last] = splitTitle(banner.title);
  const go = (next: number) => setIndex((next + count) % count);
  const first = index === 0 && !cycled.current;

  return (
    <section data-in="" className="relative px-2 sm:px-3" aria-roledescription="carousel" aria-label="Homepage highlights">
      <div
        className="lm-panel relative overflow-hidden !rounded-t-none px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }}
        onTouchEnd={(event) => { if (touchX.current === null) return; const distance = event.changedTouches[0].clientX - touchX.current; if (Math.abs(distance) > 50) go(index + (distance < 0 ? 1 : -1)); touchX.current = null; }}
      >
        <MouseParallax className="relative mx-auto max-w-[1400px]">
          <BackgroundShapes />

          {/* Headline */}
          <div className="relative flex flex-col items-center text-center">
            <div className="fx" style={intro.chip}><Chip /></div>
            <AnimatedText key={`title-${index}`} as="h1" trigger="load" delay={first ? 0.2 : 0} className="lm-hero-title mt-6 max-w-5xl">
              {lead}{lead && " "}
              <MarkedWord shape="flower" color={PALETTE.pink}>{last}</MarkedWord>
            </AnimatedText>
          </div>

          <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
            {/* Copy + actions */}
            <div key={`copy-${index}`} className={`flex flex-col items-start lg:col-span-4 ${first ? "" : "animate-fade-up"}`}>
              {banner.subtitle && <p className={`lm-lead max-w-md ${first ? "fx" : ""}`} style={first ? intro.copy(0) : undefined}>{banner.subtitle}</p>}
              {((banner.ctaLabel && banner.ctaLink) || (banner.secondaryCtaLabel && banner.secondaryCtaLink)) && (
                <div className={`mt-7 flex flex-wrap items-center gap-4 ${first ? "fx" : ""}`} style={first ? intro.copy(1) : undefined}>
                  {banner.ctaLabel && banner.ctaLink && <Link href={banner.ctaLink} className="lm-btn">{banner.ctaLabel}<ArrowBubble /></Link>}
                  {banner.secondaryCtaLabel && banner.secondaryCtaLink && <Link href={banner.secondaryCtaLink} className="lm-link">{banner.secondaryCtaLabel}</Link>}
                </div>
              )}
              {count > 1 && (
                <div className={`mt-8 flex gap-2 rounded-full bg-white p-1.5 ${first ? "fx" : ""}`} style={first ? intro.copy(2) : undefined}>
                  {banners.map((item, itemIndex) => (
                    <button key={item.id} type="button" onClick={() => go(itemIndex)} aria-label={`Show slide ${itemIndex + 1}`} aria-current={itemIndex === index} className={`relative h-11 w-11 overflow-hidden rounded-full ring-2 transition sm:h-12 sm:w-12 ${itemIndex === index ? "ring-little-green-900 ring-offset-2" : "opacity-55 ring-transparent hover:opacity-100"}`}>
                      <Image src={imageFor(item)} alt="" fill sizes="48px" unoptimized={!isOptimizable(imageFor(item))} className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Photo with shapes */}
            <div className="relative lg:col-span-8">
              <div data-depth="0.4">
                <PhotoFrame className="aspect-[4/3] sm:aspect-[16/10]">
                  {banners.map((item, itemIndex) => (
                    <div key={item.id} role="group" aria-roledescription="slide" aria-label={`${itemIndex + 1} of ${count}`} aria-hidden={itemIndex !== index} className={`absolute inset-0 transition-opacity duration-700 ${itemIndex === index ? "opacity-100" : "opacity-0"}`}>
                      <div key={itemIndex === index ? `zoom-${index}` : item.id} className={`absolute inset-0 ${itemIndex === index && !first ? "motion-safe:hero-kenburns" : ""}`}>
                        <Image src={imageFor(item)} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" priority={itemIndex === 0} unoptimized={!isOptimizable(imageFor(item))} className="object-cover" />
                      </div>
                    </div>
                  ))}
                </PhotoFrame>
              </div>

              {/* Play · Learn · Grow stickers */}
              <div aria-hidden data-depth="-1.2" className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 md:block lg:-left-10">
                {STICKERS.map(({ word, shape, color, rotate, className }, i) => (
                  <div key={word} className={`fx absolute w-28 lg:w-32 ${className}`} style={intro.sticker(i)}>
                    <Float rotate={rotate} amp={7} duration={4.5 + i * 0.9} className="grid place-items-center">
                      <Shape name={shape} color={color} className="col-start-1 row-start-1 h-auto w-full" />
                      <span className="col-start-1 row-start-1 text-lg font-extrabold tracking-tight text-little-green-900 lg:text-xl">{word}</span>
                    </Float>
                  </div>
                ))}
              </div>

              <div data-depth="1.2" className="absolute -bottom-6 -right-2 w-36 sm:-bottom-8 sm:w-56 lg:-right-6 lg:w-72">
                <ShapePile trigger="load" delay={0.85} />
              </div>
            </div>
          </div>
        </MouseParallax>
      </div>
    </section>
  );
}

function FallbackHero({ content }: { content?: SectionContent }) {
  return (
    <section data-in="" className="relative px-2 sm:px-3">
      <div className="lm-panel relative overflow-hidden !rounded-t-none px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12">
        <MouseParallax className="relative mx-auto max-w-[1400px]">
          <BackgroundShapes />
          <div className="relative flex flex-col items-center text-center">
            <div className="fx" style={intro.chip}><span className="lm-eyebrow"><MapPin className="h-4 w-4" /> {contentText(content, "eyebrow") || "Kangayam Road · Tiruppur"}</span></div>
            <AnimatedText as="h1" trigger="load" delay={0.2} className="lm-hero-title mt-6">{contentText(content, "heading") || <>
              A School of <MarkedWord shape="flower" color={PALETTE.pink}>Happiness.</MarkedWord>
            </>}</AnimatedText>
          </div>
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="fx lm-lead max-w-md" style={intro.copy(0)}>{contentText(content, "description") || "A child-centric preschool where children explore, discover and grow through joyful play-way learning."}</p>
              <div className="fx mt-8 flex flex-wrap items-center gap-4" style={intro.copy(1)}>
                <Link href="/admissions" className="lm-btn">Book a campus visit <ArrowBubble /></Link>
                <Link href="/programs" className="lm-link">Explore programs</Link>
              </div>
            </div>
            <div className="relative lg:col-span-8">
              <div data-depth="0.4">
                <PhotoFrame className="aspect-[16/10]">
                  <Image {...contentImage(content, "main", "/images/home/hero.webp", "Children learning at Little Mahilam Preschool")} unoptimized={!isOptimizable(contentImage(content, "main", "/images/home/hero.webp", "").src)} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
                </PhotoFrame>
              </div>
              <div data-depth="1.2" className="absolute -bottom-6 -right-2 w-36 sm:-bottom-8 sm:w-56 lg:-right-6 lg:w-72">
                <ShapePile trigger="load" delay={0.85} />
              </div>
            </div>
          </div>
        </MouseParallax>
      </div>
    </section>
  );
}
