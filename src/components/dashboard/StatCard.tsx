import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function StatCard({ label, value, note, icon: Icon, tint = BRAND.blue[500], href, loading, unavailable }: {
  label: string;
  value: React.ReactNode;
  note?: string;
  icon?: LucideIcon;
  tint?: string;
  href?: string;
  loading?: boolean;
  unavailable?: boolean;
}) {
  const body = (
    <>
      <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30" style={{ backgroundColor: tint }} />
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 opacity-70" style={{ background: `linear-gradient(90deg, ${tint}, transparent 72%)` }} />
      <div className="relative flex items-center justify-between">
        {Icon && <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 shadow-sm" style={{ backgroundColor: `${tint}18`, color: tint }}><Icon className="h-5 w-5" /></span>}
        {href && <ArrowUpRight className="h-4 w-4 text-little-neutral-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-little-neutral-500" />}
      </div>
      <div className="relative mt-5 text-3xl font-black tracking-[-.04em] text-little-neutral-950 tabular-nums">
        {loading ? <span className="skeleton block h-8 w-16" /> : unavailable ? <span className="text-little-neutral-300" title="Unavailable">—</span> : value}
      </div>
      <div className="relative mt-1 text-sm font-bold text-little-neutral-500">{label}</div>
      {note && <div className="relative mt-2 text-xs font-bold" style={{ color: tint }}>{note}</div>}
    </>
  );
  const className = "panel group relative block min-h-[154px] overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_45px_-28px_rgba(21,23,17,.5)]";
  return href ? <Link href={href} className={className} data-stat-card>{body}</Link> : <div className={className} data-stat-card>{body}</div>;
}
