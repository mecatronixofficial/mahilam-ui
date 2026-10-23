import Image from "@/components/media/SchoolImage";
import type { CSSProperties } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { Camera, Heart, Images, Sparkles, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SECTION_BG } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";

export type Moment = { title: string; copy: string; image: string };

const LOOKS: { icon: LucideIcon; frame: string; mat: string; badge: string }[] = [
  { icon: Camera, frame: BRAND.coral[400], mat: BRAND.coral[50], badge: BRAND.yellow[400] },
  { icon: Heart, frame: BRAND.blue[400], mat: BRAND.blue[50], badge: BRAND.pink[300] },
  { icon: Images, frame: BRAND.green[500], mat: BRAND.green[50], badge: BRAND.blue[300] },
];


/** "Every day gives us something to remember": three framed pictures hanging from nails on a gallery wall. */
export function MomentFrames({ moments }: { moments: Moment[] }) {
  return (
    <section className="relative overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.cream }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Happy School Days"
          icon={<Sparkles className="h-4 w-4 text-little-yellow-600" />}
          title={<>Every day gives us <span className="text-little-pink-500">something to remember.</span></>}
          lead="Our gallery captures the smiles, activities, friendships and meaningful moments that make Little Mahilam a happy place to learn and grow."
        />

        <Group as="ul" className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {moments.map((moment, i) => {
            const look = LOOKS[i % LOOKS.length];
            const Icon = look.icon;
            return (
              <li
                key={moment.title}
                className={`fx relative flex flex-col items-center ${i === 1 ? "lg:mt-10" : ""}`}
                style={fx({ y: -40, r: i % 2 ? 8 : -8, d: i * 0.12, dur: 1.2, ease: "spring" })}
              >
                {/* Nail */}
                <span aria-hidden className="relative z-10 h-4 w-4 rounded-full bg-little-neutral-500 shadow-[inset_0_-2px_0_rgba(0,0,0,.25)]" />
                <figure
                  className="group/frame relative -mt-2 w-full max-w-[340px] cursor-pointer origin-top [--fx-sw:.55] hover:animate-[fx-swing_1.1s_ease-out] active:animate-[fx-swing_1.1s_ease-out]"
                >
                  {/* Hanging wire */}
                  <svg aria-hidden viewBox="0 0 200 40" className="mx-auto -mb-1 block h-8 w-1/2"><path d="M100 2 L10 38 M100 2 L190 38" stroke={BRAND.neutral[400]} strokeWidth="2" fill="none" /></svg>
                  <div className="rounded-[10px] p-3 shadow-[0_28px_44px_-26px_rgba(36,68,32,.65)]" style={{ background: look.frame, boxShadow: `inset 0 0 0 4px rgba(255,255,255,.25), 0 28px 44px -26px rgba(36,68,32,.65)` }}>
                    <div className="rounded-[4px] p-3" style={{ background: look.mat }}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                        <div className="absolute inset-0 transition-[scale] duration-600 group-hover/frame:scale-110">
                          <Image src={moment.image} alt="" fill sizes="(min-width: 1024px) 340px, 80vw" className="object-cover" />
                        </div>
                        <span className="absolute left-2.5 top-2.5 transition-[rotate,scale] duration-300 ease-(--ease-back-strong) group-hover/frame:-rotate-12 group-hover/frame:scale-115 grid h-10 w-10 place-items-center rounded-xl text-little-green-950 shadow-md" style={{ background: look.badge }}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Brass plaque */}
                  <figcaption className="relative mx-auto -mt-3 w-[88%] rounded-xl bg-white px-4 py-3 text-center shadow-md ring-1 ring-black/5">
                    <h3 className="font-display text-xl font-bold text-little-green-950">{moment.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-little-neutral-600">{moment.copy}</p>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </Group>
      </div>
    </section>
  );
}
