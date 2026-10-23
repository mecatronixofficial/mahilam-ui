import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";

/** Full-page status layout (404, 500, offline, forbidden, session expired) in the public glass style. */
export function StatusScreen({
  code,
  icon: Icon,
  title,
  description,
  children,
}: {
  code?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mesh-hero grain relative isolate flex min-h-[78vh] items-center overflow-hidden py-20">
      <span aria-hidden className="absolute left-[8%] top-[18%] h-16 w-14 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,var(--color-little-yellow-50),var(--color-little-yellow-400)_45%,var(--color-little-coral-300))] opacity-80 [--r:-6deg]" />
      <span aria-hidden className="absolute right-[10%] top-[26%] h-12 w-10 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,var(--color-little-green-50),var(--color-little-green-200)_45%,var(--color-little-green-700))] opacity-80 [animation-delay:1.2s] [--r:8deg]" />
      <div className="container-pad relative">
        <div className="glass mx-auto max-w-xl rounded-[36px] px-6 py-12 text-center sm:px-12">
          <span className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-[26px] bg-gradient-to-br from-little-yellow-400 to-little-coral-300 text-little-green-950 shadow-lg shadow-little-yellow-900/20">
            <Icon className="h-10 w-10" />
          </span>
          {code && <div className="mt-6 font-display text-7xl font-bold leading-none tracking-tight text-little-green-950/90 md:text-8xl">{code}</div>}
          <h1 className="mt-4 text-2xl font-bold text-little-green-950 md:text-3xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-lg leading-8 text-little-neutral-600">{description}</p>
          {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
          <Link href="/" className="mt-8 inline-flex transition hover:scale-[1.03]" aria-label="Little Mahilam Pre-school home">
            <BrandLogo className="h-auto w-36" />
          </Link>
        </div>
      </div>
    </section>
  );
}
