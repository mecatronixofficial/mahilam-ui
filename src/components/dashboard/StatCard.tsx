import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({ label, value, note, icon: Icon, tint = "#0e9aa7", href, loading, unavailable }: {
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
      <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-35" style={{ backgroundColor: tint }} />
      <div className="relative flex items-center justify-between">
        {Icon && <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${tint}1c`, color: tint }}><Icon className="h-5 w-5" /></span>}
        {href && <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-500" />}
      </div>
      <div className="relative mt-5 text-3xl font-extrabold tracking-tight tabular-nums">
        {loading ? <span className="skeleton block h-8 w-16" /> : unavailable ? <span className="text-slate-300" title="Unavailable">—</span> : value}
      </div>
      <div className="relative mt-1 text-sm font-bold text-slate-500">{label}</div>
      {note && <div className="relative mt-2 text-xs font-bold" style={{ color: tint }}>{note}</div>}
    </>
  );
  const className = "panel group relative block overflow-hidden p-5 transition hover:-translate-y-0.5";
  return href ? <Link href={href} className={className}>{body}</Link> : <div className={className}>{body}</div>;
}
