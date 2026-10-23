"use client";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/media/SchoolImage";
import { Brush, Footprints, GraduationCap, LayoutGrid, Sparkles, Sun, type LucideIcon } from "lucide-react";
import { isOptimizable } from "@/lib/media";
import { FILTERS, type ActivityFilter, type PlayActivity } from "./data";
import { ActivityIcon } from "./PlayArt";

const FILTER_ICON: Record<ActivityFilter | "all", LucideIcon> = { all: LayoutGrid, creative: Brush, physical: Footprints, educational: GraduationCap, outdoor: Sun };
const FILTER_LABEL: Record<ActivityFilter, string> = { creative: "Creative", physical: "Physical", educational: "Educational", outdoor: "Outdoor" };

/** "Interactive Activity Explorer": filter chips; only cards that newly appear animate, the rest stay still. */
export function ActivityExplorer({ activities }: { activities: PlayActivity[] }) {
  const [filter, setFilter] = useState<ActivityFilter | "all">("all");
  const visible = filter === "all" ? activities : activities.filter((a) => a.filters.includes(filter));

  // A zone link (#activity-…) to a card hidden by the current filter brings everything back first.
  const current = useRef(filter);
  useEffect(() => { current.current = filter; }, [filter]);
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const f = current.current;
      if (!id.startsWith("activity-") || f === "all") return;
      if (activities.some((a) => `activity-${a.id}` === id && a.filters.includes(f))) return;
      setFilter("all");
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "center" }));
    };
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [activities]);

  return (
    <div>
      <div role="group" aria-label="Filter activities" className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {FILTERS.map((f) => {
          const Icon = FILTER_ICON[f.id];
          const on = filter === f.id;
          const count = f.id === "all" ? activities.length : activities.filter((a) => a.filters.includes(f.id as ActivityFilter)).length;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              className={`group/f inline-flex shrink-0 items-center gap-2 rounded-full border-2 py-2 pl-2 pr-4 font-display text-sm font-bold transition-[background-color,border-color,color,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-little-pink-400 ${on ? "border-little-green-900 bg-little-green-900 text-white" : "border-little-green-900/10 bg-white text-little-green-950 hover:border-little-green-900/30"}`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-(--ease-back-strong) group-hover/f:rotate-12 ${on ? "bg-little-yellow-400 text-little-green-950" : "bg-little-cream-100"}`}>
                <Icon className="h-4 w-4" />
              </span>
              {f.label}
              <span className={`rounded-full px-1.5 text-xs ${on ? "bg-white/20" : "bg-little-green-900/5"}`}>{count}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">{`Showing ${visible.length} ${visible.length === 1 ? "activity" : "activities"}`}</p>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((a) => (
          <li
            key={a.id}
            id={`activity-${a.id}`}
            className="group/card relative flex scroll-mt-28 animate-pop items-start gap-4 overflow-hidden rounded-[30px] bg-white p-4 pr-5 shadow-[0_16px_30px_-26px_rgba(36,68,32,.7)] ring-1 ring-little-green-900/5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_36px_-26px_rgba(36,68,32,.75)] motion-reduce:animate-none sm:gap-5 sm:p-5"
          >
            {/* Stitched sticker edge */}
            <span aria-hidden className="pointer-events-none absolute inset-1.5 rounded-[26px] border-2 border-dashed opacity-50" style={{ borderColor: a.color }} />
            <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[26px] sm:h-24 sm:w-24" style={{ background: a.soft }}>
              {a.image ? (
                <Image src={a.image} alt={`${a.title} at Little Mahilam`} fill sizes="96px" unoptimized={!isOptimizable(a.image)} className="object-cover transition-transform duration-500 group-hover/card:scale-110" />
              ) : (
                <ActivityIcon art={a.art} className="w-14 transition-transform duration-500 ease-(--ease-back-strong) group-hover/card:-rotate-8 group-hover/card:scale-110 sm:w-16" />
              )}
            </span>
            <div className="relative min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-bold text-little-green-950">{a.title}</h3>
                {a.fromCms && <span className="inline-flex items-center gap-1 rounded-full bg-little-yellow-100 px-2 py-0.5 text-[11px] font-extrabold text-little-yellow-800"><Sparkles className="h-3 w-3" />From our classrooms</span>}
              </div>
              {a.text && <p className="mt-1 text-[15px] leading-7 text-little-neutral-600">{a.text}</p>}
              {a.skills.length > 0 && (
                <ul aria-label="Builds" className="mt-3 flex flex-wrap gap-1.5">
                  {a.skills.map((s) => <li key={s} className="rounded-full px-2.5 py-1 text-xs font-extrabold text-little-green-950" style={{ background: a.soft }}>{s}</li>)}
                </ul>
              )}
              {a.filters.length > 0 && <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-little-green-800/45">{a.filters.map((f) => FILTER_LABEL[f]).join(" · ")}</p>}
            </div>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="mt-8 text-center font-semibold text-little-neutral-500">No activities in this group yet — try another one.</p>}
    </div>
  );
}
