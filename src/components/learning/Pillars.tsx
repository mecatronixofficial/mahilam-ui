import type { CSSProperties, ReactNode } from "react";
import { Blocks } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { DoodleArrow, SECTION_BG, StarDoodle, Wave } from "@/components/about/Doodles";
import { handwriting } from "@/components/about/fonts";
import { SectionHeading } from "@/components/about/motion";
import { Appear } from "@/components/animations/Appear";
import { Crayon, PuzzlePiece } from "./Art";
import { ChildPaths, PuzzlePlay, StrengthFlower } from "./PillarVisuals";

type Pillar = {
  no: string;
  title: ReactNode;
  quote: string;
  tags: string[];
  bg: string;
  accent: string;
  /** Panel silhouette — each pillar gets its own. */
  shape: string;
  visual: ReactNode;
  /** Handwritten line that leads into the next pillar. */
  bridge?: string;
};

const PILLARS: Pillar[] = [
  {
    no: "01",
    title: <>Child-Centred <span className="text-little-blue-600">Learning</span></>,
    quote: "Every child is unique, and every learning journey deserves individual attention.",
    tags: ["Their own pace", "Their own interests", "Their own voice"],
    bg: BRAND.blue[50],
    accent: BRAND.blue[400],
    shape: "rounded-[40px_40px_40px_120px] sm:rounded-[56px_56px_56px_160px]",
    visual: <ChildPaths />,
    bridge: "…so every child feels seen, and play can begin",
  },
  {
    no: "02",
    title: <>Play-Way <span className="text-little-coral-500">Learning</span></>,
    quote: "We turn meaningful play into opportunities for discovery, creativity, communication, and growth.",
    tags: ["Games with a purpose", "Hands-on discovery", "Learning by doing"],
    bg: BRAND.yellow[50],
    accent: BRAND.yellow[400],
    shape: "rounded-[120px_40px_40px_40px] sm:rounded-[160px_56px_56px_56px]",
    visual: <PuzzlePlay />,
    bridge: "…and through play, every kind of strength shows up",
  },
  {
    no: "03",
    title: <>Multiple <span className="text-little-pink-500">Intelligences</span></>,
    quote: "We celebrate different strengths and encourage children to learn through music, movement, language, logic, nature, art, and social experiences.",
    tags: ["Many ways to be clever", "Every strength valued", "Room to try new things"],
    bg: BRAND.pink[50],
    accent: BRAND.pink[300],
    shape: "rounded-[40px_120px_40px_40px] sm:rounded-[56px_160px_56px_56px]",
    visual: <StrengthFlower />,
  },
];

/** "Our Three Learning Pillars": alternating story panels, each with its own interactive toy, joined by handwritten bridges. */
export function Pillars({ nextBg }: { nextBg: string }) {
  return (
    <section id="pillars" className="relative scroll-mt-24 overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: SECTION_BG.cream }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Our Three Learning Pillars"
          icon={<Blocks className="h-4 w-4 text-little-coral-500" />}
          title={<>Three simple ideas behind <span className="text-little-pink-500">every happy day.</span></>}
          lead="Like building blocks, each idea supports the next — together they give children a strong, joyful foundation."
        />

        <div className="mt-8 space-y-2">
          {PILLARS.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={p.no}>
                <div className={`relative grid items-center gap-6 px-5 py-7 sm:px-8 md:grid-cols-2 md:gap-10 md:px-12 md:py-10 ${p.shape}`} style={{ background: p.bg }}>
                  {/* Corner doodles */}
                  <StarDoodle color={p.accent} className={`pointer-events-none absolute top-5 w-6 animate-twinkle ${flip ? "left-6" : "right-6"}`} />

                  <Appear x={flip ? 50 : -50} y={0} dur={0.9} className={`relative ${flip ? "md:order-2" : ""}`}>
                    <span
                      aria-hidden
                      className="block font-display text-[clamp(4.5rem,11vw,7.5rem)] font-bold leading-[.8] text-transparent"
                      style={{ WebkitTextStroke: `3px ${p.accent}` } as CSSProperties}
                    >
                      {p.no}
                    </span>
                    <p className="mt-3 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800/70">Pillar {p.no}</p>
                    <h3 className="mt-1 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold leading-[1.05] text-little-green-950">{p.title}</h3>
                    <p className="mt-4 max-w-md text-[17px] leading-8 text-little-neutral-700">
                      <span aria-hidden className="mr-1 font-display text-3xl leading-none" style={{ color: p.accent }}>“</span>
                      {p.quote}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((tag, t) => (
                        <li key={tag} className={`cursor-default rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-little-green-900 shadow-[0_6px_14px_-10px_rgba(36,68,32,.6)] transition-[translate,rotate] duration-300 ease-(--ease-back) hover:-translate-y-1 hover:rotate-0 ${t % 2 ? "rotate-1" : "-rotate-1"}`}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </Appear>

                  <Appear d={0.15} y={40} r={flip ? -3 : 3} dur={1} className={flip ? "md:order-1" : ""}>
                    {p.visual}
                  </Appear>
                </div>

                {p.bridge && (
                  <Appear y={16} className={`flex items-center gap-2 py-3 ${flip ? "justify-start pl-[8%]" : "justify-end pr-[8%]"}`}>
                    <DoodleArrow color={p.accent} className={`w-16 sm:w-20 ${flip ? "" : "-scale-x-100"} rotate-[30deg]`} />
                    <span className={`${handwriting.className} text-2xl font-bold text-little-green-900 sm:text-[28px]`}>{p.bridge}</span>
                  </Appear>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Crayon color={BRAND.green[400]} className="pointer-events-none absolute -left-6 top-24 hidden w-28 rotate-[24deg] lg:block" />
      <PuzzlePiece color={BRAND.coral[300]} className="pointer-events-none absolute -right-4 top-[48%] hidden w-16 -rotate-12 lg:block" />
      <Wave color={nextBg} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}
