import type { LucideIcon } from "lucide-react";

export function PageHeader({ eyebrow, title, description, icon: Icon, actions }: { eyebrow: string; title: string; description: string; icon: LucideIcon; actions?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="flex items-start gap-4">
        <span className="accent-bg hidden h-14 w-14 shrink-0 items-center justify-center rounded-[20px] shadow-sm sm:flex"><Icon className="h-6 w-6" /></span>
        <div>
          <div className="accent-text text-[11px] font-black uppercase tracking-[.18em]">{eyebrow}</div>
          <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-[2.2rem]">{title}</h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-500">{description}</p>
        </div>
      </div>
      {actions ?? (
        <div className="panel flex w-fit items-center gap-2 !rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-500">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
          Live &amp; secure
        </div>
      )}
    </div>
  );
}
