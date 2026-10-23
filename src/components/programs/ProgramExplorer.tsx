"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { fx } from "@/components/animations/fx";
import { ArrowRight, Baby, BookOpen, Brain, Shapes, Sun, type LucideIcon } from "lucide-react";
import { Giraffe } from "@/components/public/HeroAnimals";
import { Balloon, BookDoodle, Cloud, PencilDoodle, Rainbow, SECTION_BG, StarDoodle, Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";
import { Magnetic, TiltCard } from "./Fx";
import type { Stage } from "./stages";

const ICONS: LucideIcon[] = [Baby, Shapes, BookOpen, Brain];
/** A floating prop for each stage, shown on the photo panel. */
const PROPS = [
  <Balloon key="pg" color="#f06cab" className="w-10" />,
  <PencilDoodle key="pk" className="w-20 -rotate-[24deg]" />,
  <BookDoodle key="kg" className="w-16" />,
  <Rainbow key="gr" className="w-24" />,
];

/**
 * Stage explorer drawn as a child's height chart: stages climb from Play Group (bottom) to Grades 1–3 (top),
 * and the giraffe grows as you go up. Responds to #stage-slug links (e.g. from the hero's age stickers).
 */
export function ProgramExplorer({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stage = stages[active];
  const Icon = ICONS[active % ICONS.length];
  const next = stages[(active + 1) % stages.length];

  useEffect(() => {
    const fromHash = () => {
      const index = stages.findIndex((s) => `#${s.slug}` === window.location.hash);
      if (index < 0) return;
      setActive(index);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [stages]);

  return (
    <section ref={sectionRef} id="explorer" className="relative scroll-mt-20 overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: SECTION_BG.mint }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute left-[4%] top-12 w-28 animate-drift" />
        <Cloud className="absolute right-[6%] top-32 w-20 animate-drift opacity-80 [--drift:-36px] [animation-delay:-8s]" />
      </div>

      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Our Learning Journey"
          icon={<Sun className="h-4 w-4 text-little-yellow-600" />}
          title={<>Growing with your child <span className="text-little-pink-500">every step of the way.</span></>}
          lead="Each stage builds naturally on the previous one, helping children become confident learners while still enjoying childhood."
        />

        {/* Mobile / tablet tabs */}
        <div role="tablist" aria-label="Program stages" className="hide-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
          {stages.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className="shrink-0 rounded-2xl px-4 py-2.5 text-left ring-2 transition"
              style={{ background: i === active ? s.color : "#fff", ["--tw-ring-color" as string]: i === active ? s.deep : "transparent" }}
            >
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-little-green-950/60">{s.age}</span>
              <span className="block font-display text-[15px] font-bold text-little-green-950">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid items-center gap-5 lg:mt-6 lg:grid-cols-[360px_1fr] lg:gap-6">
          {/* Height chart (desktop) */}
          <div className="relative hidden h-[460px] lg:block" role="tablist" aria-label="Program stages" aria-orientation="vertical">
            {/* Giraffe grows with the stage */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 w-[80px] origin-bottom-left transition-transform duration-700 ease-(--ease-back)"
              style={{ transform: `scale(${0.6 + active * 0.25})` }}
            >
              {/* Wiggles each time the stage changes, then bobs gently */}
              <div key={active} className="origin-bottom animate-[fx-jiggle_.8s_ease-in-out]">
                <Giraffe className="w-full animate-bob drop-shadow-md" />
              </div>
            </div>

            {/* Ruler */}
            <div className="absolute bottom-0 left-[112px] top-0 flex w-12 flex-col-reverse overflow-hidden rounded-[18px] ring-4 ring-white shadow-[0_18px_40px_-26px_rgba(36,68,32,.6)]">
              {stages.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={() => setActive(i)}
                  className="group/seg relative flex-1 cursor-pointer"
                  style={{ background: s.color }}
                >
                  {/* Selected segment fills up like a thermometer */}
                  <span
                    className="absolute inset-x-0 bottom-0 bg-white/45 transition-[height] duration-500 ease-(--ease-back)"
                    style={{ height: i === active ? "100%" : "0%" }}
                  />
                  <span className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover/seg:bg-white/25" />
                  {[0.25, 0.5, 0.75].map((t) => (
                    <span key={t} className={`absolute left-0 h-0.5 bg-little-green-950/25 ${t === 0.5 ? "w-6" : "w-3"}`} style={{ top: `${t * 100}%` }} />
                  ))}
                </button>
              ))}
            </div>

            {/* "You are here" star sliding along the ruler */}
            <span
              aria-hidden
              className="absolute left-[92px] z-10 -mb-3 transition-[bottom,rotate] duration-700 ease-(--ease-back)"
              style={{ bottom: `${((active + 0.5) / stages.length) * 100}%`, rotate: `${active * 72}deg` }}
            >
              <StarDoodle className="w-6 drop-shadow" />
            </span>

            {/* Stage buttons beside each ruler segment */}
            <div className="absolute bottom-0 left-[174px] right-0 top-0 flex flex-col-reverse">
              {stages.map((s, i) => {
                const selected = i === active;
                return (
                  <div key={s.slug} className="flex flex-1 items-center">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActive(i)}
                      className={`relative w-full rounded-2xl px-3.5 py-2.5 text-left outline-none transition-[translate,background-color] duration-300 ease-(--ease-back) hover:translate-x-2 focus-visible:ring-4 focus-visible:ring-little-blue-300 ${selected ? "translate-x-2 bg-white" : "bg-white/0"}`}
                      style={{ boxShadow: selected ? "0 14px 30px -20px rgba(36,68,32,.7)" : "none" }}
                    >
                      {selected && <span aria-hidden className="absolute -left-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-r-[12px] border-y-transparent border-r-white" />}
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider" style={{ color: s.deep }}>{s.age}</span>
                      <span className="block whitespace-nowrap font-display text-lg font-bold text-little-green-950">{s.title}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage card */}
          <div className="relative min-h-[460px]">
              <article
                key={stage.slug}
                role="tabpanel"
                data-in=""
                className="fx relative grid overflow-hidden rounded-[36px] bg-white shadow-[0_30px_60px_-38px_rgba(36,68,32,.6)] md:grid-cols-[.9fr_1.1fr]"
                style={fx({ y: 24, r: -1, dur: 0.6, ease: "spring" })}
              >
                {/* Photo in an arch on the stage colour */}
                <div className="relative flex items-end justify-center px-6 pt-8 md:min-h-[460px] md:px-8" style={{ background: stage.color }}>
                  <span aria-hidden className="absolute left-5 top-5 font-display text-7xl font-bold leading-none text-white/60">0{active + 1}</span>
                  <StarDoodle color="#fff" className="absolute right-6 top-8 w-8 animate-twinkle" />
                  {/* Stage prop pops in, then floats */}
                  <span
                    aria-hidden
                    className="fx pointer-events-none absolute bottom-10 left-4 z-10"
                    style={fx({ s: 0, r: -30, d: 0.25, dur: 0.6, ease: "back-strong" })}
                  >
                    <span className="block animate-float">{PROPS[active % PROPS.length]}</span>
                  </span>
                  <div
                    className="fx relative w-full max-w-[280px]"
                    style={fx({ y: 40, o: 1, d: 0.05, dur: 0.7, ease: "spring" })}
                  >
                    <TiltCard max={8} className="rounded-t-full">
                      <div className="group/photo relative aspect-[4/5] w-full overflow-hidden rounded-t-full border-[6px] border-b-0 border-white">
                        <Image src={stage.image} alt={`${stage.title} program`} fill sizes="(min-width: 768px) 280px, 80vw" className="object-cover transition-transform duration-700 ease-out group-hover/photo:scale-110" />
                      </div>
                    </TiltCard>
                  </div>
                </div>

                <div className="flex flex-col p-7 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span
                      className="fx grid h-14 w-14 place-items-center rounded-2xl text-little-green-950"
                      style={{ ...fx({ s: 0, o: 1, r: -40, d: 0.1, dur: 0.6, ease: "back-strong" }), background: stage.color }}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[.16em]" style={{ color: stage.deep }}>Step {active + 1} · {stage.age}</p>
                      <h3 className="font-display text-3xl font-bold leading-tight text-little-green-950">{stage.title}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-[17px] leading-8 text-little-neutral-600">{stage.text}</p>

                  <p className="mt-6 text-xs font-extrabold uppercase tracking-[.16em] text-little-green-800/70">Focus areas</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stage.focus.map((item, i) => (
                      <li
                        key={item}
                        className="fx cursor-default rounded-full bg-(--bg) px-3.5 py-1.5 text-sm font-bold text-little-green-950 transition-[scale,rotate,background-color] duration-300 ease-(--ease-back-strong) hover:scale-108 hover:rotate-(--hover-r) hover:bg-(--hover-bg)"
                        style={{ ...fx({ y: 10, d: 0.15 + i * 0.06, dur: 0.4 }), "--bg": `${stage.color}99`, "--hover-bg": stage.color, "--hover-r": `${i % 2 ? 3 : -3}deg`, border: `1.5px dashed ${stage.deep}55` } as CSSProperties}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                    <Magnetic>
                      <Link href="/admissions" className="group/cta inline-flex h-12 items-center gap-2 rounded-full bg-little-green-900 px-6 text-sm font-extrabold text-white transition-colors hover:bg-little-green-800">
                        Enquire for {stage.title} <ArrowRight className="h-4 w-4 text-little-yellow-400 transition-transform group-hover/cta:translate-x-1" />
                      </Link>
                    </Magnetic>
                    <button type="button" onClick={() => setActive((active + 1) % stages.length)} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-extrabold text-little-green-900 ring-2 ring-little-green-900/10 transition hover:bg-little-green-50">
                      {active === stages.length - 1 ? "Back to" : "Next:"} {next.title}
                    </button>
                  </div>
                </div>
              </article>
          </div>
        </div>
      </div>

      <Wave color={SECTION_BG.cream} className="absolute inset-x-0 bottom-0 h-5" />
    </section>
  );
}
