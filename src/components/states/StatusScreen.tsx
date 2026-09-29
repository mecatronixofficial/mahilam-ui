import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Smile } from "lucide-react";

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
      <span aria-hidden className="absolute left-[8%] top-[18%] h-16 w-14 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,#fff1cf,#f7c85b_45%,#ef9e8a)] opacity-80 [--r:-6deg]" />
      <span aria-hidden className="absolute right-[10%] top-[26%] h-12 w-10 animate-float rounded-[50%_50%_50%_50%/58%_58%_42%_42%] bg-[radial-gradient(circle_at_33%_28%,#eafff2,#a7d9c1_45%,#3f7a63)] opacity-80 [animation-delay:1.2s] [--r:8deg]" />
      <div className="container-pad relative">
        <div className="glass mx-auto max-w-xl rounded-[36px] px-6 py-12 text-center sm:px-12">
          <span className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-[26px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950 shadow-lg shadow-amber-900/20">
            <Icon className="h-10 w-10" />
          </span>
          {code && <div className="mt-6 font-display text-7xl font-bold leading-none tracking-tight text-emerald-950/90 md:text-8xl">{code}</div>}
          <h1 className="mt-4 text-2xl font-bold text-emerald-950 md:text-3xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-lg leading-8 text-slate-600">{description}</p>
          {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-800/80 hover:text-emerald-900">
            <Smile className="h-4 w-4" /> Little Mahilam · School of Happiness
          </Link>
        </div>
      </div>
    </section>
  );
}
