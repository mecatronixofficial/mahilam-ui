import type { SectionContent } from "@/lib/page-content";
import { useId, type CSSProperties, type ReactNode } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { Rainbow as RainbowIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { BookDoodle, Cloud, FlowerDoodle, Hills, House, PencilDoodle, Rainbow, SECTION_BG, Sprout, StarDoodle } from "./Doodles";
import { SectionHeading } from "./motion";

type Stop = { number: string; title: string; text: string; emoji: string; ring: string; scene: ReactNode };

/** Desktop route through the three stops (at x = 200 / 600 / 1000, y = 80 in a 1200×160 box). */
const ROUTE = "M0 128 C 90 128 120 80 200 80 C 320 80 360 140 460 132 C 540 126 550 80 600 80 C 700 80 740 22 830 30 C 920 38 940 80 1000 80 C 1090 80 1120 44 1200 44";

const DRAW = fx({ dur: 2.2, ease: "soft" });

/** "Our Vision" as a journey map: a dotted trail draws itself between three bouncing destinations. */
export function AdventurePath({ vision, content }: { content?: SectionContent; vision: { number: string; title: string; text: string }[] }) {
  const maskId = useId();
  const extras = [
    { emoji: "😊", ring: BRAND.yellow[400], scene: <House className="w-16" /> },
    { emoji: "📚", ring: BRAND.coral[300], scene: <span className="relative block w-16"><BookDoodle className="w-16" /><PencilDoodle className="absolute -right-3 -top-3 w-10 rotate-[-30deg]" /></span> },
    { emoji: "🌱", ring: BRAND.green[400], scene: <span className="relative block w-16"><Sprout className="w-16" /><StarDoodle className="absolute -right-2 -top-2 w-6 animate-twinkle" /></span> },
  ];
  const stops: Stop[] = vision.map((item, i) => ({ ...item, ...extras[i % extras.length] }));

  return (
    <section className="relative overflow-hidden pb-40 pt-16 md:pt-20" style={{ background: SECTION_BG.mint }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute left-[3%] top-10 w-28 animate-drift" />
        <Cloud className="absolute right-[5%] top-28 w-20 animate-drift opacity-80 [--drift:-40px] [animation-delay:-8s]" />
        <Rainbow className="absolute -right-6 bottom-36 hidden w-36 opacity-70 lg:block" />
      </div>

      <div className="container-pad relative">
        <SectionHeading content={content}
          eyebrow="Our Vision"
          icon={<RainbowIcon className="h-4 w-4" />}
          title={<>More than a school. <span className="text-little-pink-500">A place to be happy.</span></>}
          lead="We want children to look forward to coming to school every day — meeting friends, discovering new ideas and enjoying meaningful childhood experiences."
        />

        <Group className="relative mt-14">
          {/* Desktop trail */}
          <svg aria-hidden viewBox="0 0 1200 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 w-full md:block">
            <defs>
              <mask id={maskId}>
                <path d={ROUTE} fill="none" stroke="#fff" strokeWidth="30" pathLength={1} strokeDasharray={1} className="fx-draw" style={DRAW} />
              </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
              <path d={ROUTE} fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d={ROUTE} fill="none" stroke={BRAND.green[600]} strokeOpacity=".55" strokeWidth="3.5" strokeDasharray="2 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            {/* Mobile trail */}
            <span
              aria-hidden
              className="fx-grow-y absolute bottom-10 left-[43px] top-10 w-1.5 origin-top rounded-full md:hidden"
              style={{ ...DRAW, backgroundImage: `repeating-linear-gradient(180deg, ${BRAND.green[600]}88 0 4px, transparent 4px 14px)` }}
            />
            {stops.map((stop, i) => (
              <li
                key={stop.title}
                className="fx relative grid grid-cols-[88px_1fr] items-start gap-4 md:flex md:flex-col md:items-center md:text-center"
                style={fx({ y: 30, d: 0.3 + i * 0.45, dur: 0.8, ease: "spring" })}
              >
                {/* Destination marker */}
                <div className="relative grid h-[88px] w-[88px] place-items-center md:mt-1 md:h-36 md:w-36">
                  <div
                    className="fx-hop relative grid h-full w-full place-items-center rounded-full bg-white shadow-[0_18px_30px_-18px_rgba(36,68,32,.6)]"
                    style={{ "--fx-hop": "-7px", "--fx-dur": "2.6s", "--fx-d": `${i * 0.5}s`, boxShadow: `0 0 0 6px ${stop.ring}, 0 18px 30px -18px rgba(36,68,32,.6)` } as CSSProperties}
                  >
                    <span className="scale-75 md:scale-110">{stop.scene}</span>
                  </div>
                  {/* Little flag with the stop number */}
                  <span className="absolute -right-1 -top-3 flex items-start md:-top-4 md:right-2">
                    <span className="h-10 w-0.5 rounded bg-little-green-900/70" />
                    <span className="animate-flag rounded-r-md px-1.5 py-0.5 font-display text-xs font-bold text-little-green-950" style={{ background: stop.ring, transformOrigin: "left center" }}>{stop.number}</span>
                  </span>
                </div>

                <div className="pt-2 md:pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[.16em] text-little-green-700">Stop {stop.number}</span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-little-green-950"><span aria-hidden className="mr-1.5">{stop.emoji}</span>{stop.title}</h3>
                  <p className="mt-2 max-w-xs leading-7 text-little-neutral-600 md:mx-auto">{stop.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Group>
      </div>

      {/* Cartoon hills with tiny flowers, blending into the founders section */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="relative">
          {[["6%", BRAND.pink[300]], ["14%", BRAND.yellow[400]], ["79%", BRAND.coral[300]], ["90%", BRAND.blue[300]]].map(([left, color], i) => (
            <FlowerDoodle key={left} color={color} className="absolute bottom-10 h-9 w-auto sm:bottom-14" style={{ left, transform: `rotate(${i % 2 ? 6 : -6}deg)` }} />
          ))}
          <Hills className="h-20 sm:h-28" back={BRAND.green[200]} front={SECTION_BG.peach} />
        </div>
      </div>
    </section>
  );
}
