import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PublicShell } from "./PublicShell";
import { PageHero } from "./PageHero";
import { AdmissionsCta } from "./AdmissionsCta";
import { isOptimizable } from "@/lib/media";

const TINTS = ["#3f7a63", "#e58d73", "#d6a62d"];

export type CmsHighlight = { id: string; title: string; description?: string | null; image?: string | null; extra?: string | null };

export function SchoolHighlightsPage({ eyebrow, title, description, path, introTitle, intro, items, cmsItems, closingTitle, closing }: {
  eyebrow: string; title: string; description: string; path: string; introTitle: string; intro: string;
  items: readonly { icon: LucideIcon; title: string; description: string }[];
  /** Published CMS entries replace the built-in cards when present. */
  cmsItems?: CmsHighlight[] | null;
  closingTitle: string; closing: string;
}) {
  const live = cmsItems?.length ? cmsItems : null;
  return (
    <PublicShell>
      <PageHero eyebrow={eyebrow} title={title} description={description} crumbs={[{ name: eyebrow, path }]} />
      <section className="py-16 md:py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">The Little Mahilam way</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-emerald-950 md:text-4xl">{introTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{intro}</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-800">Talk to our team <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {live
              ? live.map((item, index) => (
                <article key={item.id} className="glass-card reveal group overflow-hidden transition-transform hover:-translate-y-1">
                  {item.image && (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw" unoptimized={!isOptimizable(item.image)} className="object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    {!item.image && <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${TINTS[index % 3]}1f`, color: TINTS[index % 3] }}><Sparkles className="h-6 w-6" /></span>}
                    <h3 className={`${item.image ? "" : "mt-5"} text-xl font-bold text-emerald-950`}>{item.title}</h3>
                    {item.description && <p className="mt-2 leading-7 text-slate-600">{item.description}</p>}
                    {item.extra && <p className="mt-3 flex gap-2 text-sm font-semibold leading-6 text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{item.extra}</p>}
                  </div>
                </article>
              ))
              : items.map(({ icon: Icon, title: itemTitle, description: itemDescription }, index) => (
                <article key={itemTitle} className="glass-card reveal group p-6 transition-transform hover:-translate-y-1">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: `${TINTS[index % 3]}1f`, color: TINTS[index % 3] }}><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 text-xl font-bold text-emerald-950">{itemTitle}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{itemDescription}</p>
                </article>
              ))}
          </div>
        </div>
      </section>
      <section className="section-tint py-16">
        <div className="container-pad">
          <div className="glass-card grid gap-7 p-8 md:grid-cols-[auto_1fr] md:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-7 w-7" /></span>
            <div>
              <h2 className="text-2xl font-bold text-emerald-950 md:text-3xl">{closingTitle}</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{closing}</p>
            </div>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </PublicShell>
  );
}
