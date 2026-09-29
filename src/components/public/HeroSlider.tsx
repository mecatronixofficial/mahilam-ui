"use client";
import { useEffect, useState } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, MapPin, Pause, Play, Smile, Sparkles, Star } from "lucide-react";
import type { Banner } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63"];

export function HeroSlider({ banners: input }: { banners: Banner[] }) {
  const banners = input.filter((b) => b.active !== false && (b.desktopImage || b.mobileImage)).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (banners.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % banners.length), 6500);
    return () => window.clearInterval(timer);
  }, [banners.length, paused]);

  if (!banners.length) return <FallbackHero />;

  const go = (next: number) => setIndex((next + banners.length) % banners.length);

  return (
    <section
      className="relative overflow-hidden bg-[#173c2f]"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[600px] w-full md:h-[680px]">
        {banners.map((banner, i) => {
          const desktop = (banner.desktopImage || banner.mobileImage)!;
          const mobile = banner.mobileImage || desktop;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div key={banner.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${banners.length}`} aria-hidden={i !== index} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <BannerImage desktop={desktop} mobile={mobile} priority={i === 0} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173c2f]/90 via-[#173c2f]/30 to-[#173c2f]/40" />
              <div className="container-pad relative flex h-full flex-col items-start justify-end pb-20 md:pb-28">
                <div className="glass-dark max-w-2xl rounded-[32px] p-6 text-white md:p-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold"><Star className="h-3.5 w-3.5 fill-current text-[#f7c85b]" /> Little Mahilam · Tiruppur</span>
                  <Heading className="mt-4 text-4xl font-bold leading-[1.05] md:text-6xl">{banner.title}</Heading>
                  {banner.subtitle && <p className="mt-4 text-lg leading-8 text-white/85">{banner.subtitle}</p>}
                  <div className="mt-7 flex flex-wrap gap-3">
                    {banner.ctaLabel && banner.ctaLink && <Link href={banner.ctaLink} tabIndex={i === index ? 0 : -1} className="btn-accent !px-6 !py-3.5">{banner.ctaLabel} <ArrowRight className="h-4 w-4" /></Link>}
                    {banner.secondaryCtaLabel && banner.secondaryCtaLink && <Link href={banner.secondaryCtaLink} tabIndex={i === index ? 0 : -1} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3.5 font-bold hover:bg-white/25">{banner.secondaryCtaLabel}</Link>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-10">
          <div className="container-pad flex items-center justify-between gap-4">
            <div className="glass-dark flex items-center gap-2 rounded-full px-3 py-2">
              {banners.map((banner, i) => (
                <button key={banner.id} type="button" onClick={() => go(i)} aria-label={`Show slide ${i + 1}`} aria-current={index === i ? "true" : undefined} className={`h-2.5 rounded-full transition-all ${index === i ? "w-7" : "w-2.5 bg-white/50 hover:bg-white/80"}`} style={index === i ? { backgroundColor: TINTS[i % TINTS.length] } : undefined} />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** Art-directed banner: phones download only the mobile crop, larger screens only the desktop one. */
function BannerImage({ desktop, mobile, priority }: { desktop: string; mobile: string; priority: boolean }) {
  const common = { alt: "", fill: true, sizes: "100vw", priority } as const;
  if (desktop === mobile) return <Image {...common} src={desktop} unoptimized={!isOptimizable(desktop)} className="object-cover" />;
  const { props: { srcSet: desktopSrcSet } } = getImageProps({ ...common, src: desktop, unoptimized: !isOptimizable(desktop) });
  const { props: { srcSet: mobileSrcSet, ...rest } } = getImageProps({ ...common, src: mobile, unoptimized: !isOptimizable(mobile) });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet ?? desktop} />
      <img {...rest} srcSet={mobileSrcSet} className="object-cover" />
    </picture>
  );
}

function FallbackHero() {
  return (
    <section className="mesh-hero grain relative overflow-hidden py-16 md:py-24">
      <div className="container-pad relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span className="eyebrow"><MapPin className="h-3.5 w-3.5 text-[#e58d73]" /> Kangayam Road · Tiruppur</span>
          <h1 className="mt-5 animate-fade-up font-display text-5xl font-bold leading-[.98] tracking-tight text-emerald-950 md:text-7xl">
            A School of <span className="relative inline-block text-[#e2735b]">Happiness<svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none"><path d="M2 9c40-7 120-9 196-2" stroke="#f7c85b" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Little Mahilam is a child-centric preschool in Tiruppur where children explore, discover and grow through play-way learning and multiple intelligence — from Play Group to Grade 3.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admissions" className="btn-accent !px-6 !py-3.5">Book a campus visit <ArrowRight size={18} /></Link>
            <Link href="/programs" className="btn-soft !px-6 !py-3.5">Explore programs</Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3" aria-label="Highlights">
            {[[Smile, "Happy kids every day", "#d6a62d"], [Heart, "Child-centric care", "#e58d73"], [Sparkles, "Play-way learning", "#3f7a63"]].map(([Icon, label, tint]) => {
              const I = Icon as typeof Smile;
              return <li key={label as string} className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-emerald-950"><I className="h-4 w-4" style={{ color: tint as string }} />{label as string}</li>;
            })}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[48px_120px_48px_120px] border-[8px] border-white/80 shadow-2xl shadow-emerald-950/20">
            <Image src="/imgs/home/kid1.jpg" alt="Children learning happily at Little Mahilam Preschool, Tiruppur" fill priority sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-4 h-40 w-40 overflow-hidden rounded-[36px] border-[6px] border-white/80 shadow-xl sm:h-48 sm:w-48">
            <Image src="/imgs/home/kid2.avif" alt="Child enjoying a creative activity" fill sizes="192px" className="object-cover" />
          </div>
          <div className="glass absolute -right-2 top-8 rounded-3xl px-5 py-4 sm:-right-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a]"><Heart className="h-5 w-5 fill-white text-white" /></span>
              <div><div className="text-xs font-bold text-slate-500">Learning with</div><div className="font-display text-lg font-bold text-emerald-950">Love &amp; Joy</div></div>
            </div>
          </div>
          <div className="glass absolute -bottom-4 right-6 rounded-3xl px-5 py-3 text-center">
            <div className="font-display text-2xl font-bold text-emerald-950">2–9</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">years</div>
          </div>
        </div>
      </div>
    </section>
  );
}
