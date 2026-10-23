import Link from "next/link";
import type { CSSProperties } from "react";
import { Group } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { ArrowRight, Pencil } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SECTION_BG } from "@/components/about/Doodles";
import { Appear } from "@/components/about/motion";
import { Magnetic } from "./Fx";

const CRAYONS = [BRAND.coral[400], BRAND.yellow[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400]];

/** "Every age has its own special way to learn": self-drawing underline and arrow, bobbing crayons, magnetic CTA. */
export function ProgramsIntro() {
  return (
    <section className="relative overflow-hidden py-6 md:py-8" style={{ background: SECTION_BG.cream }}>
      {/* Crayon box peeking in from the right */}
      <Group aria-hidden className="pointer-events-none absolute -right-2 bottom-2 hidden items-end gap-1.5 xl:flex">
        {CRAYONS.map((color, i) => (
          <span
            key={color}
            className="fx relative block w-4 rounded-t-sm shadow-md"
            style={{ ...fx({ y: 60, o: 1, d: 0.2 + i * 0.08, dur: 0.7, ease: "back" }), backgroundColor: color, height: 46 + (i % 3) * 10 }}
          >
            <span className="absolute -top-2.5 left-0 h-2.5 w-4" style={{ backgroundColor: color, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            <span className="absolute inset-x-0 top-2 h-1 bg-black/15" />
          </span>
        ))}
      </Group>

      <div className="container-pad grid items-start gap-5 lg:grid-cols-[1.1fr_.9fr] lg:gap-8">
        <Appear>
          <span className="inline-flex items-center gap-2 rounded-full bg-little-green-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-800">
            <span className="fx-wiggle inline-flex" style={{ "--fx-w": "18deg", "--fx-dur": "3.5s" } as CSSProperties}><Pencil className="h-3.5 w-3.5" /></span>
            Learning Journey
          </span>
          <h2 className="mt-5 text-balance font-display text-[clamp(2.1rem,4.8vw,3.6rem)] font-bold leading-[1.05] text-little-green-950">
            Every age has its own{" "}
            <span className="relative inline-block text-little-coral-500">
              special way
              <svg aria-hidden viewBox="0 0 220 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3.5 w-full">
                <path
                  d="M3 10 C 40 2, 80 14, 120 8 S 190 4, 217 9"
                  fill="none"
                  stroke={BRAND.yellow[400]}
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  className="fx-draw"
                  style={fx({ d: 0.4, dur: 0.9, ease: "soft" })}
                />
              </svg>
            </span>{" "}
            to learn.
          </h2>
          {/* Doodle arrow draws itself toward the paragraph */}
          <svg aria-hidden viewBox="0 0 120 60" className="mt-4 hidden w-32 rotate-6 lg:block" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 45 C 30 5, 70 5, 100 30" stroke={BRAND.coral[500]} strokeWidth="3" pathLength={1} strokeDasharray={1} className="fx-draw" style={fx({ d: 0.8, dur: 0.9, ease: "soft" })} />
            <path d="M92 20 L102 31 L88 35" stroke={BRAND.coral[500]} strokeWidth="3" pathLength={1} strokeDasharray={1} className="fx-draw" style={fx({ d: 1.6, dur: 0.3 })} />
          </svg>
        </Appear>
        <Appear delay={0.1} className="lg:pt-4">
          <p className="text-lg leading-8 text-little-neutral-700">
            Our programs are designed around the developmental needs of children at every stage — from their first preschool experience to confident primary learning.
          </p>
          <p className="mt-4 leading-8 text-little-neutral-600">
            Each level combines guided learning with play, movement, creativity, stories, communication and hands-on exploration.
          </p>
          <Magnetic className="mt-7">
            <Link href="/admissions" className="group inline-flex h-13 items-center gap-2 rounded-full bg-little-yellow-400 px-7 text-[15px] font-extrabold text-little-green-950 shadow-[0_14px_26px_-16px_rgba(185,143,19,.9)] transition-colors hover:bg-little-yellow-300">
              Admission Enquiry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </Appear>
      </div>
    </section>
  );
}
