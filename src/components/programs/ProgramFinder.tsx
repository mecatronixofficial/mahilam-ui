"use client";
import { useState } from "react";
import Link from "next/link";
import { fx } from "@/components/animations/fx";
import { ArrowRight, MessageCircle, Sparkles, Wand2 } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Balloon, StarDoodle, SunDoodle } from "@/components/about/Doodles";
import { Burst, Magnetic } from "./Fx";
import type { Stage } from "./stages";

const AGES = [2, 3, 4, 5, 6];

/** "Need help choosing?" — pick the child's age and get the matching stage, with enquiry links. */
export function ProgramFinder({ stages }: { stages: Stage[] }) {
  const [age, setAge] = useState<number | null>(null);
  // The matching stage is the oldest one whose starting age the child has reached.
  const match = age === null ? null : [...stages].reverse().find((s) => age >= s.minAge) ?? stages[0];

  return (
    <section className="py-6 md:py-8">
      <div className="container-pad">
        <div className="relative overflow-hidden rounded-[40px] px-6 py-6 sm:px-8 md:py-8" style={{ background: `linear-gradient(120deg, ${BRAND.yellow[300]}, ${BRAND.coral[200]} 65%, ${BRAND.pink[200]})` }}>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <SunDoodle className="absolute -right-8 -top-8 w-40 opacity-70" />
            <Balloon color={BRAND.blue[300]} className="absolute bottom-6 right-[8%] hidden w-12 animate-float lg:block" />
            <StarDoodle color="#fff" className="absolute left-[42%] top-6 w-6 animate-twinkle" />
          </div>

          <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-950/65"><Wand2 className="h-4 w-4" /> Need help choosing?</span>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold leading-tight text-little-green-950">Find the right learning journey for your child.</h2>
              <p className="mt-3 max-w-xl leading-7 text-little-green-950/75">Our team can help you understand the appropriate program based on your child&apos;s age and learning stage.</p>

              <p className="mt-6 font-display text-lg font-bold text-little-green-950">How old is your little one?</p>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Child's age">
                {AGES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={age === a}
                    onClick={() => setAge(a)}
                    className={`h-12 min-w-14 rounded-2xl px-4 font-display text-lg font-bold transition-[color,background-color,translate,scale] duration-300 ease-(--ease-back-strong) hover:-translate-y-1 hover:animate-[fx-jiggle_.4s_ease-in-out] active:scale-[.94] ${age === a ? "bg-little-green-900 text-white" : "bg-white/80 text-little-green-950 hover:bg-white"}`}
                  >
                    {a === 6 ? "6+" : a}
                    <span className="ml-1 text-xs font-extrabold opacity-70">yrs</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative min-h-[230px]" aria-live="polite">
              {/* Confetti each time an age is picked */}
              {age !== null && <Burst key={age} count={22} spread={190} className="z-20" />}
                {match ? (
                  <div
                    key={match.slug}
                    data-in=""
                    className="fx rounded-[30px] bg-white p-6 shadow-[0_24px_50px_-30px_rgba(36,68,32,.7)] sm:p-7"
                    style={fx({ y: 20, r: -2, dur: 0.6, ease: "back" })}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-little-green-950" style={{ background: match.color }}>
                      <Sparkles className="h-3.5 w-3.5" /> We recommend
                    </span>
                    <h3 className="mt-3 font-display text-3xl font-bold text-little-green-950">{match.title}</h3>
                    <p className="text-sm font-extrabold" style={{ color: match.deep }}>{match.age}</p>
                    <p className="mt-3 leading-7 text-little-neutral-600">{match.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Magnetic>
                        <Link href="/admissions" className="group/cta inline-flex h-11 items-center gap-2 rounded-full bg-little-green-900 px-5 text-sm font-extrabold text-white transition-colors hover:bg-little-green-800">
                          Enquire for {match.title} <ArrowRight className="h-4 w-4 text-little-yellow-400 transition-transform group-hover/cta:translate-x-1" />
                        </Link>
                      </Magnetic>
                      <a href={`#${match.slug}`} className="inline-flex h-11 items-center rounded-full px-4 text-sm font-extrabold text-little-green-900 ring-2 ring-little-green-900/10 transition hover:bg-little-green-50">
                        See this stage
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    key="empty"
                    className="grid h-full min-h-[230px] animate-[fx-fade_.4s] place-items-center rounded-[30px] border-2 border-dashed border-white/80 bg-white/30 p-6 text-center"
                  >
                    <div>
                      <p className="font-display text-xl font-bold text-little-green-950">Pick an age to begin</p>
                      <p className="mt-1 text-sm text-little-green-950/70">We&apos;ll suggest the best-fit program.</p>
                      <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-full bg-little-green-900 px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5">
                        <MessageCircle className="h-4 w-4" /> Talk to Our Team
                      </Link>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
