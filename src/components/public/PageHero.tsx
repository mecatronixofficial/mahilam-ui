import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

type Crumb = { name: string; path: string };

/**
 * Inner-page hero: mesh gradient, floating balloons, glass breadcrumb pill.
 * Emits BreadcrumbList structured data when `crumbs` is given.
 */
export function PageHero({ eyebrow, title, description, crumbs, children }: { eyebrow: string; title: string; description: string; crumbs?: Crumb[]; children?: React.ReactNode }) {
  return (
    <section className="mesh-hero grain relative overflow-hidden py-16 md:py-24">
      {crumbs && <JsonLd data={breadcrumbSchema(crumbs)} />}
      <span aria-hidden className="absolute left-[4%] top-[42%] hidden h-16 w-14 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,var(--color-little-yellow-50),var(--color-little-yellow-400)_45%,var(--color-little-coral-300))] opacity-70 md:block [--r:-8deg]" />
      <span aria-hidden className="absolute right-[6%] top-[30%] hidden h-12 w-10 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,var(--color-little-green-50),var(--color-little-green-200)_45%,var(--color-little-green-700))] opacity-70 [animation-delay:1.4s] md:block [--r:10deg]" />
      <div className="container-pad relative">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="glass-chip mb-6 inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full px-3 py-1.5 text-xs font-bold text-little-neutral-500">
            <Link href="/" className="hover:text-little-green-800">Home</Link>
            {crumbs.map((crumb, index) => (
              <span key={crumb.path} className="flex items-center gap-1 whitespace-nowrap">
                <ChevronRight className="h-3.5 w-3.5 text-little-neutral-300" />
                {index === crumbs.length - 1 ? <span aria-current="page" className="text-little-green-900">{crumb.name}</span> : <Link href={crumb.path} className="hover:text-little-green-800">{crumb.name}</Link>}
              </span>
            ))}
          </nav>
        )}
        <div className="max-w-4xl">
          <span className="eyebrow"><Sparkles className="h-3.5 w-3.5 text-little-yellow-700" />{eyebrow}</span>
          <h1 className="section-title mt-5 animate-fade-up text-little-green-950">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-little-neutral-600">{description}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
