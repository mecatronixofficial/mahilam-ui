import type { CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { Compass } from "lucide-react";
import { Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";
import { Reveal } from "@/components/animations/Reveal";
import { isOptimizable } from "@/lib/media";
import type { PlayActivity } from "./data";
import { ActivityIcon } from "./PlayArt";

/** Each zone gets its own silhouette and grid footprint (12-col desktop, 2-col tablet, swipe row on phones). */
const ZONES = [
  { span: "sm:col-span-2 lg:col-span-5 lg:row-span-2", radius: "48px 48px 48px 150px", big: true },
  { span: "lg:col-span-4", radius: "999px 999px 36px 36px" },
  { span: "lg:col-span-3 lg:row-span-2", radius: "999px", tall: true },
  { span: "lg:col-span-4", radius: "36px 90px 36px 36px" },
  { span: "lg:col-span-3", radius: "58% 42% 52% 48% / 46% 56% 44% 54%" },
  { span: "lg:col-span-4 lg:row-span-2", radius: "150px 48px 48px 48px", big: true },
  { span: "lg:col-span-5 lg:row-span-2", radius: "48px 150px 48px 48px", big: true },
  { span: "sm:col-span-2 lg:col-span-3", radius: "36px 36px 90px 36px" },
];

/** "Explore Our Activities": eight playground zones, each a different shape, colour and little animation. */
export function ActivityZones({ activities, bg, nextBg }: { activities: PlayActivity[]; bg: string; nextBg: string }) {
  const zones = activities.slice(0, ZONES.length);
  return (
    <section id="explore" className="relative scroll-mt-24 overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: bg }}>
      <div className="container-pad relative">
        <SectionHeading
          eyebrow="Explore Our Activities"
          icon={<Compass className="h-4 w-4 text-little-blue-600" />}
          title={<>Eight happy zones to <span className="text-little-coral-500">play, make and move.</span></>}
          lead="Every corner of our day is an invitation. Tap a zone to read more about it."
        />

        <Reveal variant="gravity" className="hide-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-[170px] lg:grid-cols-12">
          {zones.map((a, i) => {
            const zone = ZONES[i];
            return (
              <a
                key={a.id}
                href={`#activity-${a.id}`}
                data-reveal-item=""
                className={`group/zone relative flex h-[280px] w-[78%] shrink-0 snap-center flex-col justify-between overflow-hidden p-6 outline-none transition-[translate,rotate,box-shadow] duration-500 ease-(--ease-back) hover:-translate-y-1.5 hover:-rotate-1 hover:shadow-[0_26px_40px_-28px_rgba(36,68,32,.7)] focus-visible:ring-4 focus-visible:ring-little-pink-300 sm:h-auto sm:min-h-[200px] sm:w-auto lg:min-h-0 ${zone.tall ? "items-center text-center" : ""} ${zone.span}`}
                style={{ borderRadius: zone.radius, background: a.color } as CSSProperties}
              >
                {/* Photo when one exists (admin upload or /images/activities/…), otherwise the illustration takes the stage */}
                {a.image && zone.big && (
                  <span aria-hidden className="absolute inset-0">
                    <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 40vw, 80vw" unoptimized={!isOptimizable(a.image)} className="object-cover opacity-90 transition-transform duration-700 group-hover/zone:scale-108" />
                    <span className="absolute inset-0 bg-linear-to-t from-little-green-950/55 to-transparent" />
                  </span>
                )}

                {/* Soft paper-cut circles */}
                <span aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/25 transition-transform duration-700 group-hover/zone:scale-125" />
                <span aria-hidden className="absolute -bottom-12 left-6 h-24 w-24 rounded-full bg-white/20" />

                <span className={`relative flex items-start justify-between ${zone.tall ? "w-full flex-col items-center gap-3 pt-6" : ""}`}>
                  <span className={`grid place-items-center rounded-[28px] bg-white/85 shadow-[0_10px_20px_-14px_rgba(36,68,32,.7)] transition-transform duration-500 ease-(--ease-back-strong) group-hover/zone:-rotate-6 group-hover/zone:scale-110 ${zone.big ? "h-24 w-24" : "h-18 w-18"} ${a.image && zone.big ? "hidden" : ""}`}>
                    <ActivityIcon art={a.art} className={`${zone.big ? "w-16" : "w-12"} group-hover/zone:animate-[fx-jiggle_.7s_ease-in-out] motion-reduce:animate-none`} />
                  </span>
                  <span className={`font-display text-sm font-bold ${a.image && zone.big ? "text-white/80" : "text-little-green-950/45"}`}>0{i + 1}</span>
                </span>

                <span className="relative block">
                  <span className={`block font-display font-bold leading-tight ${zone.big ? "text-3xl" : "text-2xl"} ${a.image && zone.big ? "text-white" : "text-little-green-950"}`}>{a.title}</span>
                  <span className={`mt-1 block text-[15px] font-semibold ${a.image && zone.big ? "text-white/85" : "text-little-green-950/70"}`}>{a.short}</span>
                </span>
              </a>
            );
          })}
        </Reveal>
        <p className="mt-2 text-center text-xs font-bold text-little-green-900/50 sm:hidden">Swipe to see every zone →</p>
      </div>
      <Wave color={nextBg} className="absolute inset-x-0 bottom-0 h-6" />
    </section>
  );
}
