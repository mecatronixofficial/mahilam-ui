import { BRAND } from "@/lib/brand";
import { Balloon, Cloud, Hills, StarDoodle } from "@/components/about/Doodles";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Float } from "@/components/animations/FloatingShape";
import { Appear } from "@/components/animations/Appear";
import { CtaLink } from "@/components/public/PageKit";
import { HotAirBalloon } from "./PlayArt";

/** "Every Day Is a New Adventure!": open sky with a drifting hot-air balloon — the hero's playground seen from above. */
export function AdventureCta() {
  return (
    <section className="relative overflow-hidden pb-24 pt-10 md:pb-32 md:pt-14" style={{ background: BRAND.blue[100] }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute left-[6%] top-[14%] w-28 animate-drift" />
        <Cloud className="absolute right-[8%] top-[8%] w-24 animate-drift [animation-delay:-11s]" />
        <Float className="absolute left-[4%] top-[34%] w-20 sm:left-[9%] sm:w-28 lg:w-36" amp={16} tilt={3} duration={7}><HotAirBalloon className="w-full" /></Float>
        <Float className="absolute right-[6%] top-[38%] hidden w-12 sm:block" amp={12} duration={6}><Balloon color={BRAND.pink[400]} className="w-full" /></Float>
        <Float className="absolute right-[13%] top-[52%] hidden w-9 md:block" amp={10} duration={5}><Balloon color={BRAND.yellow[400]} className="w-full" /></Float>
        <StarDoodle className="absolute left-[30%] top-[10%] w-6 animate-twinkle" />
        <StarDoodle color="#fff" className="absolute right-[30%] top-[22%] w-5 animate-twinkle [animation-delay:-1s]" />
        <Hills className="absolute inset-x-0 bottom-0 h-20 md:h-28" back={BRAND.green[300]} front={BRAND.green[400]} />
      </div>

      <div className="container-pad relative text-center">
        <Appear y={16} className="mx-auto max-w-2xl">
          <p className="font-display text-sm font-bold uppercase tracking-[.2em] text-little-green-800/70">For families</p>
        </Appear>
        <AnimatedText className="mx-auto mt-3 max-w-3xl text-balance font-display text-[clamp(2.3rem,6vw,4.4rem)] font-bold leading-[1.02] text-little-green-950">
          Every Day Is a <span className="text-little-coral-500">New Adventure!</span>
        </AnimatedText>
        <Appear d={0.2} className="mx-auto mt-4 max-w-xl">
          <p className="text-lg leading-8 text-little-green-950/75">Come and see how play, friendship and discovery fill each day for our little learners.</p>
        </Appear>
        <Appear d={0.3} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <CtaLink href="/programs">Explore Programs</CtaLink>
          <CtaLink href="/admissions" tone="pink">Enquire About Admissions</CtaLink>
        </Appear>
      </div>
    </section>
  );
}
