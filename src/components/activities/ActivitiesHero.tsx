import type { CSSProperties } from "react";
import { PartyPopper } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Balloon, Cloud, Hills, Rainbow, StarDoodle, SunDoodle, Tree } from "@/components/about/Doodles";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Float } from "@/components/animations/FloatingShape";
import { MouseParallax } from "@/components/animations/MouseParallax";
import { fx } from "@/components/animations/fx";
import { Crayon, LetterBlock } from "@/components/learning/Art";
import { Eyebrow } from "@/components/public/PageKit";
import { Kite, Sandbox, Seesaw, Slide, SwingSet } from "./PlayArt";
import styles from "./activities.module.css";

const SMILE_COLORS = [BRAND.pink[500], BRAND.coral[500], BRAND.yellow[500], BRAND.green[600], BRAND.blue[500], BRAND.pink[400], BRAND.coral[400]];
const rise = (d: number) => fx({ y: 26, d, dur: 0.9, ease: "spring" });
/** Playground pieces spring up out of the grass. */
const sprout = (d: number) => fx({ y: 90, s: 0.85, d, dur: 1, ease: "back" });

/** "Adventure Hero": centred headline under a rainbow, with an illustrated playground growing out of the hills below. */
export function ActivitiesHero({ nextBg }: { nextBg: string }) {
  return (
    <MouseParallax as="section" strength={1} className="relative overflow-hidden" style={{ background: BRAND.blue[100] }}>
      <div data-in="" className="relative">
        {/* Sky */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div data-depth="-8" className="absolute left-1/2 top-[6%] w-[min(760px,120vw)] -translate-x-1/2 opacity-35">
            <Rainbow className="w-full" />
          </div>
          <div data-depth="-12" className="absolute left-[4%] top-8 w-16 sm:w-20"><SunDoodle className="w-full" /></div>
          <Cloud className="absolute left-[18%] top-[14%] w-24 animate-drift sm:w-32" />
          <Cloud className="absolute right-[22%] top-[6%] w-20 animate-drift [animation-delay:-9s] sm:w-28" />
          <div data-depth="18" className="absolute right-[4%] top-[10%] w-14 sm:w-20">
            <Kite className={`w-full ${styles.kite}`} />
          </div>
          <div data-depth="24" className="absolute left-[7%] top-[36%] hidden w-12 md:block">
            <Float amp={14} duration={6}><Balloon color={BRAND.pink[400]} className="w-full" /></Float>
          </div>
          <div data-depth="12" className="absolute left-[12%] top-[46%] hidden w-9 md:block">
            <Float amp={10} duration={7}><Balloon color={BRAND.yellow[400]} className="w-full" /></Float>
          </div>
          <div data-depth="28" className="absolute right-[10%] top-[40%] hidden w-11 md:block">
            <Float amp={12} duration={5.5}><Balloon color={BRAND.green[400]} className="w-full" /></Float>
          </div>
          <div data-depth="-20" className="absolute right-[16%] top-[56%] hidden w-24 lg:block">
            <Float amp={6} rotate={-18}><Crayon color={BRAND.blue[400]} className="w-full" /></Float>
          </div>
          <div data-depth="20" className="absolute left-[20%] top-[60%] hidden w-12 lg:block">
            <Float amp={8} rotate={12}><LetterBlock letter="★" color={BRAND.coral[400]} className="w-full" /></Float>
          </div>
          <StarDoodle className="absolute left-[30%] top-[28%] w-5 animate-twinkle" />
          <StarDoodle color={BRAND.pink[300]} className="absolute right-[30%] top-[30%] w-6 animate-twinkle [animation-delay:-1.6s]" />
          <StarDoodle color="#fff" className="absolute right-[40%] top-[12%] w-4 animate-twinkle [animation-delay:-.8s]" />
        </div>

        {/* Words */}
        <div className="container-pad relative z-10 pb-[clamp(170px,26vw,290px)] pt-8 text-center md:pt-12">
          <span style={rise(0)} className="fx inline-block">
            <Eyebrow icon={<PartyPopper className="h-4 w-4 text-little-pink-500" />}>Activities at Little Mahilam</Eyebrow>
          </span>
          <AnimatedText as="h1" trigger="load" delay={0.1} className="mx-auto mt-5 max-w-4xl text-balance font-display text-[clamp(2.7rem,7.4vw,6rem)] font-bold leading-[.98] tracking-tight text-little-green-950">
            Little <span className="relative inline-block rounded-[18px] bg-white px-3 shadow-[0_10px_0_rgba(36,68,32,.12)] -rotate-2">Adventures.</span> Big{" "}
            <span className="inline-block whitespace-nowrap">
              {"Smiles!".split("").map((ch, i) => (
                <span key={i} className="inline-block transition-transform duration-300 ease-(--ease-back-strong) hover:-translate-y-2 hover:rotate-6" style={{ color: SMILE_COLORS[i % SMILE_COLORS.length] }}>{ch}</span>
              ))}
            </span>
          </AnimatedText>
          <p style={rise(0.5)} className="fx mx-auto mt-5 max-w-2xl text-lg leading-8 text-little-green-950/75 sm:text-xl">
            Every day brings exciting opportunities to play, explore, create, and discover something wonderful.
          </p>

          {/* Scroll cue */}
          <a
            href="#explore"
            style={rise(0.7)}
            className="fx group mt-7 inline-flex items-center gap-3 rounded-full bg-little-green-900 py-2 pl-2 pr-5 font-display text-base font-bold text-white shadow-[0_14px_28px_-18px_rgba(36,68,32,.9)] transition-[background-color] hover:bg-little-green-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-little-pink-400"
          >
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-little-yellow-400">
              <span aria-hidden className={`block h-4 w-4 rounded-full bg-little-coral-500 ${styles.bounce}`} />
            </span>
            Let&apos;s go play
          </a>
        </div>

        {/* Playground */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(150px,24vw,270px)]">
          <Hills className="absolute inset-x-0 bottom-0 h-[62%]" back={BRAND.green[200]} front={nextBg} />
          <div data-depth="6" className="absolute bottom-[30%] left-[2%] w-[22%] max-w-[260px]"><div style={sprout(0.3)} className="fx"><Slide className="w-full" /></div></div>
          <div data-depth="10" className="absolute bottom-[36%] left-[27%] w-[18%] max-w-[210px]"><div style={sprout(0.45)} className="fx"><SwingSet className="w-full" /></div></div>
          <div data-depth="4" className="absolute bottom-[40%] left-[48%] w-[6%] max-w-[70px]"><div style={sprout(0.55)} className="fx"><Tree className="w-full" /></div></div>
          <div data-depth="12" className="absolute bottom-[26%] right-[22%] w-[18%] max-w-[210px]"><div style={sprout(0.6)} className="fx"><Seesaw className="w-full" /></div></div>
          <div data-depth="8" className="absolute bottom-[12%] right-[3%] w-[16%] max-w-[190px]"><div style={sprout(0.7)} className="fx"><Sandbox className="w-full" /></div></div>
          <div data-depth="5" className="absolute bottom-[34%] right-[14%] w-[5%] max-w-[60px]"><div style={sprout(0.65)} className="fx"><Tree className="w-full" /></div></div>
          {/* Flowers along the front hill */}
          {[8, 40, 62, 90].map((left, i) => (
            <span key={left} className="fx-hop absolute bottom-[8%] block h-3 w-3 rounded-full ring-4 ring-white/80" style={{ left: `${left}%`, background: [BRAND.pink[400], BRAND.yellow[400], BRAND.coral[400], BRAND.blue[400]][i], "--fx-hop": "-4px", "--fx-dur": `${2.4 + i * 0.3}s` } as CSSProperties} />
          ))}
        </div>
      </div>
    </MouseParallax>
  );
}
