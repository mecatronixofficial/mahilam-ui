import Link from "next/link";
import { ArrowRight, Phone, Smile } from "lucide-react";
import { resolvePublicSite, telHref } from "@/lib/site";
import { getPublic } from "@/lib/server-api";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { FloatingShape } from "@/components/animations/FloatingShape";
import { MouseParallax } from "@/components/animations/MouseParallax";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowBubble, Shape, PALETTE } from "./PlayShapes";

export async function AdmissionsCta({
  eyebrow = "Admissions open",
  title = "Give your child a happy beginning.",
  description = "Send an enquiry for Play Group, Pre-KG, LKG, UKG or Grades 1–3 and our team will call you back to arrange a campus visit.",
  ctaLabel = "Admission enquiry",
  ctaHref = "/admissions",
  variant = "default",
}: { eyebrow?: string; title?: string; description?: string; ctaLabel?: string; ctaHref?: string; variant?: "default" | "playful" }) {
  const settings = await getPublic<Record<string, unknown>>("/settings", 0);
  const details = resolvePublicSite(settings);

  if (variant === "playful") {
    return (
      <section className="px-2 py-16 sm:px-3 md:py-20">
        <Reveal variant="panel" className="mx-auto max-w-[1180px]">
          {/* Background shapes lean toward the mouse (desktop); the copy stays put */}
          <MouseParallax className="relative overflow-hidden rounded-[24px] bg-little-pink-300 px-4 py-5 text-little-green-900 sm:rounded-[32px] md:px-6 md:py-6" strength={28}>
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div data-depth="1.4" className="absolute -right-16 -top-20 w-72 md:w-96"><Shape name="flower" color={PALETTE.blush} className="w-full rotate-12" /></div>
              <div data-depth="-1" className="absolute bottom-6 right-[30%] hidden w-20 md:block"><FloatingShape name="squiggle" color={PALETTE.sun} duration={5.8} /></div>
              <div data-depth="0.8" className="absolute -bottom-24 -left-16 w-64"><Shape name="pebble" color={PALETTE.peach} className="w-full" /></div>
              <div data-depth="-1.6" className="absolute left-[46%] top-8 hidden w-12 lg:block"><FloatingShape name="heart" color={PALETTE.coral} rotate={-12} duration={4.6} /></div>
            </div>
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <Reveal as="span" variant="drop" delay={0.2} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold"><Smile className="h-4 w-4" /> {eyebrow}</Reveal>
                <AnimatedText className="mt-2 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">{title}</AnimatedText>
                <Reveal as="p" variant="rise" delay={0.3} className="mt-2 max-w-2xl text-sm leading-5 text-little-green-900/80">{description}</Reveal>
              </div>
              <Reveal variant="rise" delay={0.45} className="flex flex-col items-start gap-4">
                <Link href={ctaHref} className="lm-btn !gap-2 !px-3 !py-2 !text-xs [&>.lm-btn-arrow]:!h-6 [&>.lm-btn-arrow]:!w-6 [&_svg]:!h-3.5 [&_svg]:!w-3.5">{ctaLabel}<ArrowBubble /></Link>
                {details.phone && <a href={telHref(details.phone)} className="lm-link text-xs"><Phone className="h-3.5 w-3.5" /> Call {details.phone}</a>}
              </Reveal>
            </div>
          </MouseParallax>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container-pad">
        <div className="mesh-dark grain relative overflow-hidden rounded-[24px] p-4 text-white shadow-[0_30px_70px_-30px_rgba(36,68,32,.7)] md:p-6">
          <span aria-hidden className="absolute -right-10 -top-10 h-44 w-36 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,var(--color-little-yellow-50),var(--color-little-yellow-400)_45%,var(--color-little-coral-300))] opacity-25 [--r:12deg]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold text-little-yellow-400"><Smile className="h-3.5 w-3.5" /> {eyebrow}</span>
              <h2 className="mt-2 text-xl font-bold md:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-5 text-white/70">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href={ctaHref} className="btn-accent !gap-2 !px-3 !py-2 !text-xs">{ctaLabel} <ArrowRight size={14} /></Link>
              {details.phone && <a href={telHref(details.phone)} className="glass-dark inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold hover:bg-white/20"><Phone className="h-3.5 w-3.5" /> Call {details.phone}</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
