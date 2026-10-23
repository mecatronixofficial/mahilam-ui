import type { SectionContent } from "@/lib/page-content";
import type { ReactNode } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { Brain, Heart, Music, Shapes, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { AbcBlocks, Balloon, Cloud, DoodleArrow, HeartDoodle, SECTION_BG, StarDoodle, Wave } from "./Doodles";
import { SectionHeading } from "./motion";

export type Pillar = { title: string; description: string };

type Look = { bg: string; ink: string; icon: ReactNode; iconBg: string; shape: "cloud" | "brick" | "puzzle"; scene: ReactNode; emoji: string };

const LOOKS: Look[] = [
  {
    bg: BRAND.pink[50], ink: BRAND.pink[700], iconBg: BRAND.coral[300], shape: "cloud", emoji: "❤️",
    icon: <Heart className="h-9 w-9 fill-current" />,
    scene: <><HeartDoodle className="absolute right-6 top-24 w-8 rotate-12" color={BRAND.coral[300]} /><Balloon color={BRAND.pink[300]} className="absolute right-14 top-10 w-8" /></>,
  },
  {
    bg: BRAND.yellow[100], ink: BRAND.yellow[800], iconBg: BRAND.yellow[400], shape: "brick", emoji: "🔷",
    icon: <Shapes className="h-9 w-9" />,
    scene: <AbcBlocks className="absolute right-5 top-10 w-20" />,
  },
  {
    bg: BRAND.green[100], ink: BRAND.green[800], iconBg: BRAND.green[400], shape: "puzzle", emoji: "🧠",
    icon: <Brain className="h-9 w-9" />,
    scene: <><Music className="absolute right-8 top-12 h-7 w-7 -rotate-12 text-little-green-600" /><StarDoodle className="absolute right-16 top-24 w-7" /></>,
  },
];

const SPARKLES = ["right-5 bottom-20", "left-[46%] top-3", "left-4 bottom-5"];

/** "Our Philosophy" as three playful, tilt-on-hover cards: a cloud, a toy brick and a puzzle piece. */
export function LearningPlayground({ pillars, content }: { pillars: Pillar[]; content?: SectionContent }) {
  return (
    <section className="relative overflow-hidden pb-28 pt-14 md:pt-16" style={{ background: SECTION_BG.cream }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud color={BRAND.blue[100]} className="absolute left-[5%] top-14 w-28 animate-drift" />
        <DoodleArrow className="absolute right-[10%] top-24 hidden w-28 rotate-12 md:block" color={BRAND.blue[400]} />
      </div>

      <div className="container-pad relative">
        <SectionHeading content={content}
          eyebrow="Our Philosophy"
          icon={<Sparkles className="h-4 w-4 text-little-yellow-500" />}
          title={<>How do little minds <span className="text-little-blue-500">learn best?</span></>}
          lead="Our approach creates meaningful experiences that help children discover, participate, communicate and grow naturally."
        />

        <Group as="ul" className="hide-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-6 pt-12 md:gap-8 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {pillars.map((pillar, i) => {
            const look = LOOKS[i % LOOKS.length];
            return (
              <li
                key={pillar.title}
                className="fx w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto"
                style={fx({ y: 40, d: i * 0.1, dur: 0.9, ease: "spring" })}
              >
                <article className="group/card relative h-full transition-[translate,rotate] duration-300 ease-(--ease-back-strong) hover:-translate-y-2.5 hover:-rotate-[1.5deg]" style={{ borderRadius: 32 }}>
                  <CardShape look={look} />
                  <div className="relative flex h-full min-h-[340px] flex-col p-7 pt-9">
                    <div aria-hidden className="pointer-events-none">{look.scene}</div>
                    <span className="grid h-20 w-20 place-items-center rounded-[26px] transition-[scale] duration-300 group-hover/card:scale-106 group-hover/card:animate-[fx-boing_.8s_ease-out] text-little-green-950 shadow-[0_14px_24px_-14px_rgba(36,68,32,.6)]" style={{ background: look.iconBg }}>
                      {look.icon}
                    </span>
                    <span className="mt-6 text-xs font-extrabold uppercase tracking-[.18em]" style={{ color: look.ink }}>0{i + 1} · <span aria-hidden>{look.emoji}</span></span>
                    <h3 className="mt-1.5 font-display text-2xl font-bold text-little-green-950">{pillar.title}</h3>
                    <p className="mt-3 leading-7 text-little-neutral-600">{pillar.description}</p>
                    {SPARKLES.map((spot, s) => (
                      <span key={spot} aria-hidden className={`pointer-events-none absolute scale-30 opacity-0 transition-[opacity,scale,rotate] duration-300 ease-(--ease-back-strong) group-hover/card:scale-100 group-hover/card:rotate-20 group-hover/card:opacity-100 ${spot}`} style={{ transitionDelay: `${s * 0.08}s` }}>
                        <StarDoodle className="w-5" color={s === 1 ? BRAND.pink[300] : BRAND.yellow[400]} />
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </Group>
      </div>

      <Wave color={SECTION_BG.sky} className="absolute inset-x-0 bottom-0 h-14" />
    </section>
  );
}

/** The card body: a bumpy-topped cloud, a studded toy brick or a puzzle piece with a knob. */
function CardShape({ look }: { look: Look }) {
  const base = "absolute inset-0 rounded-[32px] shadow-[0_26px_50px_-34px_rgba(36,68,32,.55)]";
  if (look.shape === "cloud") {
    return (
      <span aria-hidden className="pointer-events-none">
        <span className={base} style={{ background: look.bg }} />
        <span className="absolute -top-7 left-[12%] h-16 w-16 rounded-full" style={{ background: look.bg }} />
        <span className="absolute -top-10 left-[32%] h-20 w-20 rounded-full" style={{ background: look.bg }} />
        <span className="absolute -top-6 left-[58%] h-14 w-14 rounded-full" style={{ background: look.bg }} />
      </span>
    );
  }
  if (look.shape === "brick") {
    return (
      <span aria-hidden className="pointer-events-none">
        <span className={`${base} rounded-[22px]`} style={{ background: look.bg, boxShadow: `inset 0 -10px 0 ${BRAND.yellow[300]}, 0 26px 50px -34px rgba(36,68,32,.55)` }} />
        <span className="absolute -top-4 left-[18%] flex gap-[14%]" style={{ width: "64%" }}>
          {[0, 1, 2].map((s) => <span key={s} className="h-5 flex-1 rounded-t-xl" style={{ background: look.bg, boxShadow: `inset 0 -4px 0 ${BRAND.yellow[300]}` }} />)}
        </span>
      </span>
    );
  }
  return (
    <span aria-hidden className="pointer-events-none">
      <span className={base} style={{ background: look.bg }} />
      <span className="absolute -top-6 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full" style={{ background: look.bg }} />
      <span className="absolute -right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full" style={{ background: look.bg }} />
      <span className="absolute -left-1 top-1/2 h-12 w-6 -translate-y-1/2 rounded-r-full" style={{ background: SECTION_BG.cream }} />
    </span>
  );
}
