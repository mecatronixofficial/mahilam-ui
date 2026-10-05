import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, DoorOpen, Lightbulb, Paintbrush, Quote, Sparkles } from "lucide-react";
import { PublicShell } from "./PublicShell";
import { PageBanner } from "./PageBanner";
import { CardSlider } from "./CardSlider";
import { AdmissionsCta } from "./AdmissionsCta";
import { isOptimizable } from "@/lib/media";
import { localImage } from "@/lib/images";

export type CmsHighlight = { id: string; title: string; description?: string | null; image?: string | null; extra?: string | null };
export type HighlightTheme = "approach" | "activities" | "facilities";
type Item = { icon: LucideIcon; title: string; description: string };
type Card = { key: string; icon: LucideIcon; title: string; description?: string | null; image?: string | null; extra?: string | null };

const PAINTS = ["#f7c85b", "#ef9e8a", "#8cb9e8", "#a7d9c1", "#c4b5fd", "#f4a6c0"];
const BLOB = ["58% 42% 63% 37% / 45% 55% 45% 55%", "42% 58% 37% 63% / 55% 45% 55% 45%", "63% 37% 52% 48% / 38% 58% 42% 62%"];

/**
 * Shared template for Learning Approach, Activities and Facilities.
 * Each `theme` gets its own layout: lightbulb ideas, a paint palette, or a blueprint of rooms.
 */
export function SchoolHighlightsPage({ theme, eyebrow, icon, title, highlight, description, path, introTitle, intro, items, cmsItems, closingTitle, closing }: {
  theme: HighlightTheme;
  eyebrow: string; icon: LucideIcon; title: string; highlight?: string; description: string; path: string; introTitle: string; intro: string;
  items: readonly Item[];
  /** Published CMS entries replace the built-in cards when present. */
  cmsItems?: CmsHighlight[] | null;
  closingTitle: string; closing: string;
}) {
  const cards: Card[] = cmsItems?.length
    ? cmsItems.map((item, i) => ({ key: item.id, icon: items[i % items.length]?.icon ?? Sparkles, title: item.title, description: item.description, image: item.image, extra: item.extra }))
    : items.map((item) => ({ key: item.title, icon: item.icon, title: item.title, description: item.description }));

  return (
    <PublicShell>
      <PageBanner
        theme={theme}
        eyebrow={eyebrow}
        icon={icon}
        title={title}
        highlight={highlight}
        description={description}
        crumbs={[{ name: eyebrow, path }]}
        image={{ src: localImage(`/images/banners/${theme}.webp`, theme === "activities" ? 1 : 0), alt: `${eyebrow} at Little Mahilam Preschool, Tiruppur` }}
      />
      {theme === "approach" && <Approach introTitle={introTitle} intro={intro} cards={cards} closingTitle={closingTitle} closing={closing} />}
      {theme === "activities" && <Activities introTitle={introTitle} intro={intro} cards={cards} closingTitle={closingTitle} closing={closing} />}
      {theme === "facilities" && <Facilities introTitle={introTitle} intro={intro} cards={cards} closingTitle={closingTitle} closing={closing} />}
      <AdmissionsCta />
    </PublicShell>
  );
}

type SectionProps = { introTitle: string; intro: string; cards: Card[]; closingTitle: string; closing: string };

function CardImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 380px, 80vw" unoptimized={!isOptimizable(src)} className={`object-cover ${className}`} />;
}

/* ─────────────── Learning approach: rainbow quote + lightbulb idea slider ─────────────── */
function Approach({ introTitle, intro, cards, closingTitle, closing }: SectionProps) {
  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[40px] bg-white px-7 pb-10 pt-8 text-center shadow-[0_30px_60px_-34px_rgba(23,60,47,.45)] sm:px-14">
            {/* Rainbow arch with a quote mark underneath */}
            <div aria-hidden className="relative mx-auto h-20 w-40">
              <span className="absolute inset-0 bg-[radial-gradient(circle_80px_at_50%_100%,transparent_46%,#8cb9e8_46%_58%,#a7d9c1_58%_70%,#f7c85b_70%_82%,#ef9e8a_82%_94%,transparent_94%)]" />
              <Quote className="absolute bottom-0 left-1/2 h-8 w-8 -translate-x-1/2 fill-[#e2725b] text-[#e2725b]" />
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">{introTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{intro}</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 font-extrabold text-emerald-800 hover:underline">Talk to our team <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Our learning ideas"
            heading={
              <>
                <span className="eyebrow"><Lightbulb className="h-4 w-4 text-[#d69e2e]" /> Big ideas</span>
                <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">The ideas that shape <span className="text-[#e2725b]">every school day.</span></h2>
              </>
            }
          >
            {cards.map(({ key, icon: Icon, title, description, image, extra }, i) => (
              <article key={key} className="group flex h-full flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_18px_40px_-26px_rgba(23,60,47,.45)]">
                {image ? (
                  <div className="relative h-44 overflow-hidden"><CardImage src={image} alt={title} className="transition duration-700 group-hover:scale-105" /></div>
                ) : (
                  <div className="relative flex h-36 items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle at 50% 70%, ${PAINTS[i % PAINTS.length]}66, transparent 65%)` }}>
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_0_0_10px_rgba(255,255,255,.55)] transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="h-9 w-9 text-emerald-900" />
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#d69e2e]">Idea {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-emerald-950">{title}</h3>
                  {description && <p className="mt-2 leading-7 text-slate-600">{description}</p>}
                  {extra && <p className="mt-3 flex gap-2 text-sm font-semibold leading-6 text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{extra}</p>}
                </div>
              </article>
            ))}
          </CardSlider>
        </div>
      </section>

      <section className="py-16">
        <div className="container-pad">
          <div className="grid items-center gap-6 rounded-[36px] border-2 border-dashed border-emerald-800/25 p-8 md:grid-cols-[auto_1fr_auto] md:p-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7c85b] text-emerald-950 shadow-[0_0_30px_rgba(247,200,91,.7)]"><Lightbulb className="h-8 w-8" /></span>
            <div>
              <h2 className="font-display text-2xl font-bold text-emerald-950 md:text-3xl">{closingTitle}</h2>
              <p className="mt-2 max-w-3xl text-lg leading-8 text-slate-600">{closing}</p>
            </div>
            <Link href="/programs" className="btn-primary">See our programs <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────── Activities: paint palette + splash cards ─────────────── */
function Activities({ introTitle, intro, cards, closingTitle, closing }: SectionProps) {
  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <span className="eyebrow"><Paintbrush className="h-4 w-4 text-[#e2725b]" /> The Little Mahilam way</span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">{introTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{intro}</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 font-extrabold text-emerald-800 hover:underline">Talk to our team <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {/* Paint palette */}
          <div aria-hidden className="relative mx-auto aspect-[5/4] w-full max-w-[460px] -rotate-6 bg-[#e9c79b] shadow-[0_30px_50px_-28px_rgba(90,60,20,.6)]" style={{ borderRadius: "48% 52% 44% 56% / 58% 50% 50% 42%" }}>
            <span className="absolute bottom-[18%] right-[16%] h-[18%] w-[15%] rounded-full bg-[#fffaf0] shadow-inner" />
            {PAINTS.map((color, i) => (
              <span key={color} className="absolute h-[17%] w-[15%] shadow-sm" style={{ backgroundColor: color, left: `${[14, 34, 55, 70, 20, 44][i]}%`, top: `${[20, 12, 14, 30, 50, 44][i]}%`, borderRadius: BLOB[i % 3] }} />
            ))}
            <span className="absolute -right-6 top-[8%] h-3 w-44 origin-right rotate-[-35deg] rounded-full bg-[#9c6d3f]">
              <span className="absolute -left-6 -top-1.5 h-6 w-8 rounded-l-full bg-[#e2725b]" />
            </span>
          </div>
        </div>
      </section>

      <section className="section-peach py-16 md:py-20">
        <div className="container-pad">
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ key, icon: Icon, title, description, image, extra }, i) => {
              const paint = PAINTS[i % PAINTS.length];
              return (
                <article key={key} className="group relative rounded-[28px] bg-white p-6 pt-0 shadow-[0_18px_40px_-26px_rgba(23,60,47,.45)]">
                  <div className="relative -mt-6 mb-4 flex h-28 items-end">
                    {image ? (
                      <span className="relative block h-28 w-36 overflow-hidden shadow-md" style={{ borderRadius: BLOB[i % 3] }}><CardImage src={image} alt={title} /></span>
                    ) : (
                      <span className="relative flex h-24 w-24 items-center justify-center text-emerald-950 shadow-md transition-transform duration-500 group-hover:rotate-12" style={{ backgroundColor: paint, borderRadius: BLOB[i % 3] }}>
                        <Icon className="h-10 w-10" />
                      </span>
                    )}
                    <span aria-hidden className="absolute bottom-2 left-24 h-3 w-3 rounded-full" style={{ backgroundColor: paint }} />
                    <span aria-hidden className="absolute bottom-7 left-28 h-2 w-2 rounded-full" style={{ backgroundColor: paint }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-emerald-950">{title}</h3>
                  <span aria-hidden className="mt-1.5 block h-1.5 w-16 rounded-full" style={{ backgroundColor: paint }} />
                  {description && <p className="mt-3 leading-7 text-slate-600">{description}</p>}
                  {extra && <p className="mt-3 flex gap-2 text-sm font-semibold leading-6 text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{extra}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-pad">
          <div className="rounded-[36px] p-[5px]" style={{ background: `linear-gradient(90deg, ${PAINTS.join(", ")})` }}>
            <div className="grid gap-6 rounded-[32px] bg-white p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <h2 className="font-display text-2xl font-bold text-emerald-950 md:text-3xl">{closingTitle}</h2>
                <p className="mt-2 max-w-3xl text-lg leading-8 text-slate-600">{closing}</p>
              </div>
              <Link href="/gallery" className="btn-accent">See them in the gallery <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────── Facilities: blueprint floor plan + house-shaped room cards ─────────────── */
const BLUEPRINT = "bg-[#2f5d94] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:24px_24px]";
const ROOM_SPANS = ["col-span-2 row-span-2", "", "", "col-span-2", "", ""];

function Facilities({ introTitle, intro, cards, closingTitle, closing }: SectionProps) {
  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow"><DoorOpen className="h-4 w-4 text-emerald-700" /> The Little Mahilam way</span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">{introTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{intro}</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 font-extrabold text-emerald-800 hover:underline">Talk to our team <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {/* Floor plan made from the room names */}
          <div className={`relative rounded-[24px] p-5 text-white shadow-[0_30px_60px_-30px_rgba(47,93,148,.7)] ${BLUEPRINT}`}>
            <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[.25em] text-white/70">Campus plan · Little Mahilam</p>
            <div className="grid auto-rows-[74px] grid-cols-4 gap-2 border-2 border-white/80 p-2">
              {cards.slice(0, 6).map((card, i) => (
                <div key={card.key} className={`flex items-end rounded-sm border border-dashed border-white/60 p-2 text-[11px] font-bold leading-tight sm:text-xs ${ROOM_SPANS[i] ?? ""}`}>{card.title}</div>
              ))}
            </div>
            <span className="absolute -bottom-3 right-6 rounded-full bg-[#f7c85b] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-950">Scale: made for little feet</span>
          </div>
        </div>
      </section>

      <section className="section-mint py-16 md:py-20">
        <div className="container-pad grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ key, icon: Icon, title, description, image, extra }, i) => {
            const roof = PAINTS[i % PAINTS.length];
            return (
              <article key={key} className="group flex flex-col">
                {/* Roof */}
                <span aria-hidden className="mx-3 block h-14" style={{ backgroundColor: roof, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
                <div className="flex flex-1 flex-col overflow-hidden rounded-b-[24px] bg-white shadow-[0_18px_40px_-26px_rgba(23,60,47,.45)]">
                  {image ? (
                    <div className="relative h-40 overflow-hidden"><CardImage src={image} alt={title} className="transition duration-700 group-hover:scale-105" /></div>
                  ) : (
                    <div className="flex justify-center gap-3 pt-6">
                      <span className="flex h-14 w-14 items-center justify-center rounded-lg border-4 text-emerald-900" style={{ borderColor: roof }}><Icon className="h-7 w-7" /></span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6 text-center">
                    <h3 className="font-display text-xl font-bold text-emerald-950">{title}</h3>
                    {description && <p className="mt-2 leading-7 text-slate-600">{description}</p>}
                    {extra && <p className="mt-3 text-sm font-semibold leading-6 text-emerald-800">{extra}</p>}
                    <span aria-hidden className="mx-auto mt-5 block h-8 w-6 rounded-t-md" style={{ backgroundColor: roof }} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="container-pad">
          <div className={`relative grid items-center gap-8 overflow-hidden rounded-[36px] p-8 text-white md:grid-cols-[auto_1fr_auto] md:p-10 ${BLUEPRINT}`}>
            <span className="flex h-24 w-16 items-center justify-center rounded-t-full border-4 border-white bg-[#f7c85b]/90 text-emerald-950"><DoorOpen className="h-8 w-8" /></span>
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">{closingTitle}</h2>
              <p className="mt-2 max-w-3xl text-lg leading-8 text-white/80">{closing}</p>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f7c85b] px-7 py-4 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:-translate-y-1">Book a campus visit <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
