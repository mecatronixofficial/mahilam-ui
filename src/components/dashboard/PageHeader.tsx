import type { LucideIcon } from "lucide-react";
import { Activity } from "lucide-react";

export function PageHeader({ eyebrow, title, description, icon: Icon, actions }: { eyebrow: string; title: string; description: string; icon: LucideIcon; actions?: React.ReactNode }) {
  return (
    <section className="dash-page-hero mb-6 overflow-hidden p-5 sm:mb-8 sm:p-7 lg:p-8">
      <span aria-hidden className="dash-page-orb dash-page-orb-one" />
      <span aria-hidden className="dash-page-orb dash-page-orb-two" />
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
          <span className="dash-page-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16 sm:rounded-[22px]"><Icon className="h-5 w-5 sm:h-7 sm:w-7" /></span>
          <div className="min-w-0">
            <div className="accent-text text-[10px] font-black uppercase tracking-[.2em] sm:text-[11px]">{eyebrow}</div>
            <h2 className="mt-1.5 text-2xl font-black tracking-[-.035em] text-little-neutral-950 sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-little-neutral-500 sm:text-base sm:leading-7">{description}</p>
          </div>
        </div>
        {actions ?? (
          <div className="dash-status-pill flex w-fit shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-little-neutral-600">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-little-green-50 text-little-green-600"><Activity className="h-4 w-4" /><span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full border-2 border-white bg-little-green-500" /></span>
            <span><span className="block text-[9px] uppercase tracking-[.15em] text-little-neutral-500">Workspace</span>Live &amp; secure</span>
          </div>
        )}
      </div>
    </section>
  );
}
