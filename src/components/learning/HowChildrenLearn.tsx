import type { ComponentType, CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";
import { Reveal } from "@/components/animations/Reveal";
import { Shape, type ShapeName } from "@/components/public/PlayShapes";
import { IconCreate, IconExplore, IconExpress, IconGrow, IconPlay, IconSolve } from "./Art";

type Activity = { title: string; text: string; Icon: ComponentType<{ className?: string }>; shape: ShapeName; tint: string; soft: string; radius: string };

const ACTIVITIES: Activity[] = [
  { title: "Explore and Discover", text: "Little hands touch, look, listen and ask questions about the world around them.", Icon: IconExplore, shape: "cloud", tint: BRAND.blue[200], soft: BRAND.blue[50], radius: "38px 38px 38px 90px" },
  { title: "Create and Imagine", text: "Paint, clay, blocks and pretend play give big ideas a place to grow.", Icon: IconCreate, shape: "flower", tint: BRAND.pink[200], soft: BRAND.pink[50], radius: "90px 38px 38px 38px" },
  { title: "Play and Collaborate", text: "Games and group play teach sharing, turn-taking and how to be a good friend.", Icon: IconPlay, shape: "blob", tint: BRAND.coral[200], soft: BRAND.coral[50], radius: "38px 90px 38px 38px" },
  { title: "Think and Solve", text: "Puzzles, patterns and simple challenges build patient, curious thinkers.", Icon: IconSolve, shape: "pebble", tint: BRAND.green[200], soft: BRAND.green[50], radius: "38px 38px 90px 38px" },
  { title: "Express and Communicate", text: "Stories, songs and conversation help children share feelings and ideas.", Icon: IconExpress, shape: "sun", tint: BRAND.yellow[200], soft: BRAND.yellow[50], radius: "90px 38px 90px 38px" },
  { title: "Grow with Confidence", text: "Small successes are celebrated, so children feel brave enough to try again.", Icon: IconGrow, shape: "leaf", tint: BRAND.green[300], soft: BRAND.cream[100], radius: "38px 90px 38px 90px" },
];

/** "How Children Learn": six organic activity cards; on hover the shape spins, the icon bounces and the card lifts. */
export function HowChildrenLearn({ bg, nextBg }: { bg: string; nextBg: string }) {
  return (
    <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: bg }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="How Children Learn"
          icon={<Sparkles className="h-4 w-4 text-little-pink-500" />}
          title={<>Six happy ways <span className="text-little-blue-600">little ones learn.</span></>}
          lead="Children learn best when they are busy, curious and supported. Here is what that looks like in our classrooms."
        />

        <Reveal variant="cards" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map(({ title, text, Icon, shape, tint, soft, radius }, i) => (
            <article
              key={title}
              data-reveal-item=""
              tabIndex={0}
              className="group/act relative overflow-hidden bg-white p-6 shadow-[0_18px_40px_-30px_rgba(36,68,32,.55)] outline-none ring-1 ring-little-green-900/5 transition-[translate,rotate,box-shadow] duration-500 ease-(--ease-back) hover:-translate-y-2 hover:shadow-[0_28px_50px_-30px_rgba(36,68,32,.6)] focus-visible:-translate-y-2 focus-visible:ring-3 focus-visible:ring-little-pink-300 sm:p-7"
              style={{ borderRadius: radius, rotate: `${[-0.6, 0.5, -0.3, 0.6, -0.5, 0.4][i]}deg` } as CSSProperties}
            >
              {/* Soft colour pool that grows on hover */}
              <span aria-hidden className="absolute -right-16 -top-16 h-44 w-44 rounded-full transition-[scale] duration-700 ease-(--ease-smooth) group-hover/act:scale-[3.2] group-focus-visible/act:scale-[3.2]" style={{ background: soft }} />

              <div className="relative flex items-start justify-between">
                <div className="relative grid h-24 w-24 place-items-center">
                  <Shape name={shape} color={tint} className="absolute inset-0 h-full w-full transition-transform duration-1000 ease-(--ease-smooth) group-hover/act:rotate-[120deg] group-hover/act:scale-110" />
                  <span className="relative block w-14 group-hover/act:animate-[fx-boing_.8s_ease-out] motion-reduce:animate-none">
                    <Icon className="w-full" />
                  </span>
                </div>
                <span data-drop="" className="font-display text-sm font-bold text-little-green-900/40">0{i + 1}</span>
              </div>

              <h3 className="relative mt-4 font-display text-xl font-bold text-little-green-950">{title}</h3>
              <p className="relative mt-2 text-[15px] leading-7 text-little-neutral-600">{text}</p>

              {/* A dotted "learning trail" draws across the bottom */}
              <svg aria-hidden viewBox="0 0 200 12" className="relative mt-4 h-3 w-28" fill="none">
                <path d="M2 6 Q 25 0 50 6 T 100 6 T 150 6 T 198 6" stroke={tint} strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="transition-[stroke-dashoffset] duration-700 ease-(--ease-smooth) [stroke-dashoffset:.7] group-hover/act:[stroke-dashoffset:0] group-focus-visible/act:[stroke-dashoffset:0]" />
              </svg>
            </article>
          ))}
        </Reveal>
      </div>
      <Wave color={nextBg} flip className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}
