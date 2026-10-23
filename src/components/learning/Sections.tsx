import type { CSSProperties, ReactNode } from "react";
import { Blocks, Footprints, HeartHandshake, Leaf, MessageCircle, Music, Palette, PartyPopper, Puzzle, ShieldCheck, Smile, Sprout, Star, Sun, Users } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Balloon, Rainbow, StarDoodle, SunDoodle, Wave } from "@/components/about/Doodles";
import { handwriting } from "@/components/about/fonts";
import { SectionHeading } from "@/components/about/motion";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Appear } from "@/components/animations/Appear";
import { Float } from "@/components/animations/FloatingShape";
import { Reveal } from "@/components/animations/Reveal";
import { Bunting } from "@/components/public/Bunting";
import { Shape } from "@/components/public/PlayShapes";
import { KidFace, LetterBlock } from "./Art";
import { Celebrate } from "./Celebrate";
import { HappyDayJourney } from "./HappyDayJourney";
import { CtaLink, Eyebrow } from "@/components/public/PageKit";
import styles from "./learning.module.css";

/* ==================================================================
   A Day of Happy Learning
================================================================== */

export function HappyDay({ bg, nextBg }: { bg: string; nextBg: string }) {
  return (
    <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: bg }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="A Day of Happy Learning"
          icon={<Sun className="h-4 w-4 text-little-yellow-600" />}
          title={<>From the first hello to <span className="text-little-green-700">the last wave goodbye.</span></>}
          lead="A gentle rhythm helps children feel secure. Follow the path to see the kinds of moments that fill a day with us."
        />
        <Appear d={0.1} y={30} className="mt-8 md:mt-10">
          <HappyDayJourney />
        </Appear>
      </div>
      <Wave color={nextBg} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}

/* ==================================================================
   Different Ways to Shine — bento grid
================================================================== */

type Tile = { title: string; text: string; icon: typeof Music; bg: string; span: string; art: ReactNode };

const NOTE_D = ["0s", "-.6s", "-1.2s"];

const TILES: Tile[] = [
  {
    title: "Language and Communication",
    text: "Stories, rhymes and everyday chats help children find their words.",
    icon: MessageCircle,
    bg: BRAND.yellow[100],
    span: "sm:col-span-2",
    art: (
      <div aria-hidden className="relative h-28 w-48 shrink-0">
        <span className="fx-hop absolute left-0 top-2 rounded-[22px_22px_22px_4px] bg-white px-4 py-2 font-display text-lg font-bold text-little-green-950 shadow-md" style={{ "--fx-hop": "-6px", "--fx-dur": "3s" } as CSSProperties}>Hello!</span>
        <span className="fx-hop absolute bottom-1 right-0 rounded-[22px_22px_4px_22px] bg-little-pink-400 px-4 py-2 font-display text-lg font-bold text-white shadow-md" style={{ "--fx-hop": "-6px", "--fx-dur": "3s", "--fx-d": "-1.5s" } as CSSProperties}>Tell me more!</span>
      </div>
    ),
  },
  {
    title: "Numbers and Logic",
    text: "Counting, sorting and patterns make maths feel like a game.",
    icon: Puzzle,
    bg: BRAND.blue[100],
    span: "",
    art: (
      <div aria-hidden className="flex items-end gap-1">
        {["1", "2", "3"].map((n, i) => (
          <LetterBlock key={n} letter={n} color={[BRAND.blue[400], BRAND.coral[400], BRAND.green[400]][i]} className="w-12 transition-transform duration-500 ease-(--ease-back-strong) group-hover/tile:-translate-y-2" style={{ transitionDelay: `${i * 70}ms` }} />
        ))}
      </div>
    ),
  },
  {
    title: "Music and Rhythm",
    text: "Clapping, singing and simple instruments build listening, memory and joy.",
    icon: Music,
    bg: BRAND.pink[100],
    span: "lg:row-span-2",
    art: (
      <div aria-hidden className="relative flex h-32 items-end gap-2 lg:h-48">
        {[0.9, 1.3, 0.75, 1.1, 1.5, 0.85].map((dur, i) => (
          <span key={i} className={`w-4 rounded-full ${styles.eq}`} style={{ height: `${55 + (i % 3) * 18}%`, background: [BRAND.pink[400], BRAND.yellow[400], BRAND.blue[400]][i % 3], "--eq-dur": `${dur}s`, "--eq-d": `${-i * 0.2}s` } as CSSProperties} />
        ))}
        {NOTE_D.map((d, i) => (
          <span key={d} className="fx-hop absolute font-display text-2xl font-bold text-little-pink-600" style={{ left: `${10 + i * 32}%`, top: `${-8 + (i % 2) * 14}%`, "--fx-hop": "-10px", "--fx-dur": "2.6s", "--fx-d": d } as CSSProperties}>♪</span>
        ))}
      </div>
    ),
  },
  {
    title: "Movement and Coordination",
    text: "Running, balancing and dancing grow strong, confident bodies.",
    icon: Footprints,
    bg: BRAND.coral[100],
    span: "",
    art: (
      <div aria-hidden className="relative h-24 w-24">
        <span className="fx-hop absolute left-1/2 top-0 block h-12 w-12 -translate-x-1/2 rounded-full" style={{ "--fx-hop": "-26px", "--fx-dur": "1.2s", background: `conic-gradient(${BRAND.coral[400]} 0 25%, ${BRAND.yellow[400]} 0 50%, ${BRAND.blue[400]} 0 75%, ${BRAND.green[400]} 0)` } as CSSProperties} />
        <span className="absolute bottom-2 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-little-green-900/15" />
      </div>
    ),
  },
  {
    title: "Visual Creativity",
    text: "Painting, drawing and building let imagination take shape and colour.",
    icon: Palette,
    bg: BRAND.green[50],
    span: "sm:col-span-2",
    art: (
      <div aria-hidden className="relative h-28 w-44 shrink-0">
        {[
          { name: "blob" as const, color: BRAND.pink[300], cls: "left-0 top-0 w-20" },
          { name: "flower" as const, color: BRAND.yellow[400], cls: "left-14 top-8 w-16" },
          { name: "cloud" as const, color: BRAND.blue[300], cls: "right-0 top-0 w-20" },
          { name: "leaf" as const, color: BRAND.green[400], cls: "bottom-0 right-12 w-12" },
        ].map((s, i) => (
          <Shape key={s.name} name={s.name} color={s.color} className={`absolute transition-transform duration-700 ease-(--ease-back) group-hover/tile:scale-110 ${i % 2 ? "group-hover/tile:-rotate-45" : "group-hover/tile:rotate-45"} ${s.cls}`} />
        ))}
      </div>
    ),
  },
  {
    title: "Nature and Discovery",
    text: "Plants, bugs and weather spark questions and gentle care for the world.",
    icon: Leaf,
    bg: BRAND.green[100],
    span: "",
    art: <span aria-hidden className="block w-16 origin-bottom animate-sway"><Sprout className="h-16 w-16 text-little-green-600" strokeWidth={1.8} /></span>,
  },
  {
    title: "Collaboration and Relationships",
    text: "Sharing, helping and playing together build friendships and kindness.",
    icon: Users,
    bg: BRAND.blue[50],
    span: "",
    art: (
      <div aria-hidden className="flex -space-x-3 transition-[gap] duration-500 group-hover/tile:space-x-1">
        {([[BRAND.green[900], 0], [BRAND.coral[800], 2], [BRAND.yellow[700], 1]] as const).map(([hair, variant], i) => (
          <span key={i} className="block w-14 rounded-full bg-white p-1 shadow-md transition-transform duration-500 ease-(--ease-back) group-hover/tile:-translate-y-1" style={{ transitionDelay: `${i * 60}ms` }}>
            <KidFace hair={hair} variant={variant} skin={["#f3c9a5", "#d9a17a", "#b97f5a"][i]} className="w-full" />
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Self-Awareness",
    text: "Naming feelings and noticing what they enjoy helps children understand themselves.",
    icon: Smile,
    bg: BRAND.cream[100],
    span: "sm:col-span-2",
    art: (
      <ul aria-label="Feelings children learn to name" className="flex flex-wrap gap-2">
        {[["😊", "Happy"], ["😌", "Calm"], ["🤩", "Proud"], ["🤔", "Curious"]].map(([emoji, label], i) => (
          <li key={label} className={`flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-extrabold text-little-green-900 shadow-sm transition-[translate,rotate] duration-300 ease-(--ease-back) group-hover/tile:-translate-y-1 ${i % 2 ? "group-hover/tile:rotate-3" : "group-hover/tile:-rotate-3"}`} style={{ transitionDelay: `${i * 50}ms` }}>
            <span aria-hidden className="text-lg">{emoji}</span>{label}
          </li>
        ))}
      </ul>
    ),
  },
];

export function ShineBento({ bg, nextBg }: { bg: string; nextBg: string }) {
  return (
    <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: bg }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Different Ways to Shine"
          icon={<Star className="h-4 w-4 text-little-yellow-600" />}
          title={<>Every child is clever <span className="text-little-pink-500">in their own way.</span></>}
          lead="Some children sing, some build, some ask a hundred questions. We notice and nurture each strength."
        />

        <Reveal variant="cards" className="mt-8 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(200px,auto)] lg:grid-cols-4">
          {TILES.map(({ title, text, icon: Icon, bg: tileBg, span, art }) => {
            const wide = span.includes("col-span-2");
            return (
              <article
                key={title}
                data-reveal-item=""
                className={`group/tile relative flex overflow-hidden rounded-[32px] p-6 transition-[translate,box-shadow] duration-500 ease-(--ease-back) hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-28px_rgba(36,68,32,.6)] ${wide ? "flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" : "flex-col justify-between gap-5"} ${span}`}
                style={{ background: tileBg }}
              >
                <div className={wide ? "max-w-xs" : ""}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-little-green-900 shadow-sm transition-transform duration-500 ease-(--ease-back-strong) group-hover/tile:-rotate-12 group-hover/tile:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold leading-tight text-little-green-950">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-6 text-little-neutral-600">{text}</p>
                </div>
                <div className={wide ? "" : "flex justify-end"}>{art}</div>
              </article>
            );
          })}
        </Reveal>
      </div>
      <Wave color={nextBg} flip className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}

/* ==================================================================
   Parent trust — how teachers support growth
================================================================== */

const SUPPORT = [
  { title: "Caring guidance", text: "Teachers stay close, listen patiently and help children feel safe asking for help.", icon: HeartHandshake, color: BRAND.pink[200] },
  { title: "Age-appropriate activities", text: "Activities are planned for each age group, so children feel challenged but never overwhelmed.", icon: Blocks, color: BRAND.yellow[300] },
  { title: "Positive encouragement", text: "Effort is noticed and celebrated, helping children believe in themselves.", icon: Star, color: BRAND.coral[200] },
  { title: "Individual learning pace", text: "Each child moves forward at their own speed — early childhood is not a race.", icon: Sprout, color: BRAND.green[200] },
  { title: "Safe exploration", text: "Thoughtfully arranged spaces let children explore and try new things with a caring adult nearby.", icon: ShieldCheck, color: BRAND.blue[200] },
];

export function ParentTrust({ bg, nextBg }: { bg: string; nextBg: string }) {
  return (
    // overflow-x-clip (not hidden) so the left column can stay sticky.
    <section className="relative overflow-x-clip pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: bg }}>
      <div className="container-pad relative grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <Appear x={-40} y={0} className="text-center lg:sticky lg:top-28 lg:text-left">
          <Eyebrow icon={<HeartHandshake className="h-4 w-4 text-little-pink-500" />}>For Parents</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] text-little-green-950">
            Gentle guidance, <span className="text-little-green-700">every step of the way.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[17px] leading-8 text-little-neutral-600 lg:mx-0">
            Handing over your little one is a big step. Here is how our teachers help each child feel secure, supported and ready to grow.
          </p>

          <figure className="relative mx-auto mt-7 max-w-md -rotate-2 rounded-[28px] bg-little-yellow-100 p-6 text-left shadow-[0_18px_30px_-24px_rgba(36,68,32,.6)] lg:mx-0">
            <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 rounded-sm bg-little-pink-200/80" />
            <blockquote className={`${handwriting.className} text-[26px] font-bold leading-snug text-little-green-900`}>
              We notice the small steps — the first shared toy, a brand-new word, a brave little try.
            </blockquote>
            <figcaption className="mt-2 text-sm font-extrabold text-little-green-800/70">— The Little Mahilam teachers</figcaption>
          </figure>
        </Appear>

        {/* A growing stem: each support is a leaf */}
        <div className="relative">
          <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-1.5 rounded-full bg-little-green-200 sm:left-[31px]" />
          <Reveal variant="right" stagger={0.12} as="ol" className="relative space-y-4">
            {SUPPORT.map(({ title, text, icon: Icon, color }, i) => (
              <li key={title} data-reveal-item="" className="group/sup relative flex items-start gap-4 sm:gap-5">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-[50%_50%_50%_12%] text-little-green-950 shadow-[0_10px_18px_-12px_rgba(36,68,32,.7)] ring-4 ring-white transition-[rotate,scale] duration-500 ease-(--ease-back-strong) group-hover/sup:rotate-[-18deg] group-hover/sup:scale-110 sm:h-16 sm:w-16" style={{ background: color }}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <div className="flex-1 rounded-[24px] bg-white p-5 shadow-[0_14px_30px_-26px_rgba(36,68,32,.6)] ring-1 ring-little-green-900/5 transition-[translate] duration-300 group-hover/sup:translate-x-1">
                  <p className="text-xs font-extrabold uppercase tracking-[.16em] text-little-green-800/50">0{i + 1}</p>
                  <h3 className="mt-0.5 font-display text-lg font-bold text-little-green-950">{title}</h3>
                  <p className="mt-1 text-[15px] leading-7 text-little-neutral-600">{text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
      <Wave color={nextBg} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}

/* ==================================================================
   Final CTA
================================================================== */

export function FinalCta({ bg }: { bg: string }) {
  return (
    <section className="relative overflow-hidden py-6 md:py-8" style={{ background: bg }}>
      <div className="container-pad relative">
        <Appear y={40} s={0.96} dur={1} className={`relative overflow-hidden rounded-[40px] bg-little-yellow-300 px-5 pb-10 pt-8 text-center sm:rounded-[56px] sm:px-10 md:pb-12 ${styles.paper}`}>
          <Bunting className="absolute inset-x-0 top-3 text-little-green-900" />

          {/* Decorations */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <SunDoodle className="absolute -left-6 -top-6 w-24 sm:w-28" />
            <Rainbow className="absolute -bottom-2 right-[4%] hidden w-36 sm:block" />
            <Float className="absolute left-[5%] top-[38%] hidden w-12 sm:block" amp={14} duration={6}><Balloon color={BRAND.pink[400]} className="w-full" /></Float>
            <Float className="absolute left-[12%] top-[56%] hidden w-9 md:block" amp={10} duration={7}><Balloon color={BRAND.blue[400]} className="w-full" /></Float>
            <Float className="absolute right-[6%] top-[16%] w-10 sm:w-12" amp={12} duration={5.5}><Balloon color={BRAND.coral[400]} className="w-full" /></Float>
            <Float className="absolute bottom-[10%] left-[6%] hidden w-12 md:block" amp={6} rotate={-10}><LetterBlock letter="J" color={BRAND.green[400]} className="w-full" /></Float>
            <StarDoodle color="#fff" className="absolute left-[30%] top-[14%] w-6 animate-twinkle" />
            <StarDoodle color={BRAND.pink[400]} className="absolute right-[24%] bottom-[18%] w-5 animate-twinkle [animation-delay:-1.4s]" />
          </div>

          <div className="relative mx-auto max-w-3xl pt-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800 shadow-sm">
              <PartyPopper className="h-4 w-4 text-little-pink-500" /> Come and see it for yourself
            </span>
            <AnimatedText className="mt-5 text-balance font-display text-[clamp(2.2rem,5.6vw,4.2rem)] font-bold leading-[1.04] text-little-green-950">
              Let&apos;s Make Learning a <span className="text-little-pink-600">Happy Adventure!</span>
            </AnimatedText>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-little-green-950/75">
              Discover a welcoming place where curiosity grows, confidence blossoms, and every little achievement matters.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Celebrate><CtaLink href="/programs">Explore Our Programs</CtaLink></Celebrate>
              <Celebrate><CtaLink href="/admissions" tone="pink">Enquire About Admissions</CtaLink></Celebrate>
            </div>
          </div>
        </Appear>
      </div>
    </section>
  );
}
