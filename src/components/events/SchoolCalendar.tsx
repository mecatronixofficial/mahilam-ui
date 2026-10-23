"use client";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CalendarCheck2, ChevronLeft, ChevronRight, Clock3, MapPin, PartyPopper } from "lucide-react";
import { BRAND } from "@/lib/brand";

/** An event reduced to calendar days ("YYYY-MM-DD" in school time). */
export type CalendarEvent = { id: string; title: string; start: string; end?: string | null; startTime?: string | null; venue?: string | null };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DOTS = [BRAND.pink[500], BRAND.blue[500], BRAND.yellow[500], BRAND.green[600]];

// All date maths in UTC on plain calendar days, so server and browser always agree.
const key = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const parse = (k: string) => { const [y, m, d] = k.split("-").map(Number); return { y, m: m - 1, d }; };
const weekday = (k: string) => { const { y, m, d } = parse(k); return new Date(Date.UTC(y, m, d)).getUTCDay(); };
const longDate = (k: string) => { const { y, m, d } = parse(k); return `${WEEKDAYS[weekday(k)]}, ${d} ${MONTHS[m]} ${y}`; };
const shortDate = (k: string) => { const { m, d } = parse(k); return `${d} ${MONTHS[m].slice(0, 3)}`; };

/** Every day an event covers (capped, so a mistyped end date can't flood the calendar). */
function daysOf(e: CalendarEvent) {
  const out = [e.start];
  if (!e.end || e.end <= e.start) return out;
  const { y, m, d } = parse(e.start);
  for (let i = 1; i < 62; i++) {
    const day = new Date(Date.UTC(y, m, d + i));
    const k = key(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
    if (k > e.end) break;
    out.push(k);
  }
  return out;
}

/** Month calendar: opens on today (school time), marks scheduled events, and shows the chosen day's events. */
export function SchoolCalendar({ today, events }: { today: string; events: CalendarEvent[] }) {
  const t = parse(today);
  const [view, setView] = useState({ y: t.y, m: t.m });
  const [selected, setSelected] = useState(today);
  const cells = useRef<Record<string, HTMLButtonElement | null>>({});

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => daysOf(e).forEach((k) => map.set(k, [...(map.get(k) ?? []), e])));
    return map;
  }, [events]);

  const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
  const total = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const monthKey = key(view.y, view.m, 1).slice(0, 7);
  const inMonth = events.filter((e) => daysOf(e).some((k) => k.startsWith(monthKey))).length;
  const chosen = byDay.get(selected) ?? [];
  const next = events.filter((e) => (e.end ?? e.start) >= today).sort((a, b) => a.start.localeCompare(b.start))[0];

  const shift = (delta: number) => setView(({ y, m }) => { const d = new Date(Date.UTC(y, m + delta, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() }; });
  const goToday = () => { setView({ y: t.y, m: t.m }); setSelected(today); };

  // Arrow keys move the selection (into the next/previous month when needed); only the selected day is tabbable.
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (!step) return;
    event.preventDefault();
    const { y, m, d } = parse(selected);
    const nd = new Date(Date.UTC(y, m, d + step));
    const k = key(nd.getUTCFullYear(), nd.getUTCMonth(), nd.getUTCDate());
    setSelected(k);
    setView({ y: nd.getUTCFullYear(), m: nd.getUTCMonth() });
    requestAnimationFrame(() => cells.current[k]?.focus());
  };
  const tabbable = selected.startsWith(monthKey) ? selected : key(view.y, view.m, 1);

  return (
    <div className="relative -rotate-1 rounded-[26px] bg-white shadow-[0_30px_60px_-28px_rgba(36,68,32,.55)] transition-[rotate] duration-300 hover:rotate-0">
      {/* Binder rings */}
      <div aria-hidden className="absolute inset-x-0 -top-4 z-10 flex justify-center gap-16">
        {[0, 1, 2].map((r) => <span key={r} className="h-9 w-3.5 rounded-full border-[3px] border-little-neutral-400 bg-little-neutral-200" />)}
      </div>

      {/* Month header */}
      <div className="flex items-center justify-between gap-2 rounded-t-[26px] bg-little-coral-500 px-3 pb-3 pt-7 text-white">
        <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-white"><ChevronLeft className="h-5 w-5" /></button>
        <p aria-live="polite" className="text-center font-display text-lg font-bold uppercase tracking-[.14em]">{MONTHS[view.m]} {view.y}</p>
        <button type="button" onClick={() => shift(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-white"><ChevronRight className="h-5 w-5" /></button>
      </div>

      {/* Today */}
      <div className="flex items-center justify-between gap-2 border-b border-dashed border-little-green-900/10 px-4 py-2.5">
        <p className="text-sm font-bold text-little-green-950"><span className="text-little-neutral-500">Today · </span>{longDate(today)}</p>
        {(view.y !== t.y || view.m !== t.m || selected !== today) && (
          <button type="button" onClick={goToday} className="shrink-0 rounded-full bg-little-yellow-100 px-2.5 py-1 text-xs font-extrabold text-little-green-900 hover:bg-little-yellow-200">Today</button>
        )}
      </div>

      {/* Month grid */}
      <div className="px-3 pb-2 pt-2">
        <div aria-hidden className="grid grid-cols-7 text-center text-[11px] font-extrabold uppercase text-little-neutral-400">
          {WEEKDAYS.map((w) => <span key={w} className="py-1">{w.slice(0, 2)}</span>)}
        </div>
        <div role="group" aria-label={`${MONTHS[view.m]} ${view.y}`} className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: first }, (_, i) => <span key={`pad-${i}`} />)}
          {Array.from({ length: total }, (_, i) => {
            const k = key(view.y, view.m, i + 1);
            const dayEvents = byDay.get(k) ?? [];
            const isToday = k === today;
            const isSelected = k === selected;
            const past = k < today;
            return (
              <button
                key={k}
                ref={(el) => { cells.current[k] = el; }}
                type="button"
                tabIndex={k === tabbable ? 0 : -1}
                onClick={() => setSelected(k)}
                onKeyDown={onKey}
                aria-pressed={isSelected}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${longDate(k)}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}: ${dayEvents.map((e) => e.title).join(", ")}` : ""}`}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl font-display text-sm font-bold transition-[background-color,color,scale] duration-200 hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-little-pink-400 ${
                  isSelected ? "bg-little-green-900 text-white" : isToday ? "bg-little-coral-100 text-little-coral-700 ring-2 ring-little-coral-400" : dayEvents.length ? "bg-little-yellow-100 text-little-green-950" : past ? "text-little-neutral-400 hover:bg-little-cream-100" : "text-little-green-950 hover:bg-little-cream-100"
                }`}
              >
                {i + 1}
                {dayEvents.length > 0 && (
                  <span aria-hidden className="absolute bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e, j) => <span key={e.id} className="h-1.5 w-1.5 rounded-full" style={{ background: isSelected ? "#fff" : DOTS[j % DOTS.length] }} />)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* The chosen day */}
      <div aria-live="polite" className="rounded-b-[26px] bg-little-cream-100/70 px-4 pb-4 pt-3">
        {chosen.length > 0 ? (
          <>
            <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-little-green-800/60">{selected === today ? "Happening today" : longDate(selected)}</p>
            <ul className="mt-2 space-y-2">
              {chosen.map((e) => (
                <li key={e.id} className="rounded-2xl bg-white px-3 py-2.5 shadow-sm">
                  <p className="flex items-start gap-2 font-display text-base font-bold leading-snug text-little-green-950"><PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-little-coral-500" />{e.title}</p>
                  {(e.startTime || e.venue || (e.end && e.end !== e.start)) && (
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 pl-6 text-xs font-bold text-little-neutral-500">
                      {e.end && e.end !== e.start && <span className="inline-flex items-center gap-1"><CalendarCheck2 className="h-3.5 w-3.5" />{shortDate(e.start)} – {shortDate(e.end)}</span>}
                      {e.startTime && <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{e.startTime}</span>}
                      {e.venue && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.venue}</span>}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : next ? (
          <button type="button" onClick={() => { const n = parse(next.start); setView({ y: n.y, m: n.m }); setSelected(next.start); }} className="w-full rounded-2xl bg-white px-3 py-2.5 text-left shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400">
            <span className="block text-[11px] font-extrabold uppercase tracking-[.16em] text-little-green-800/60">{next.start <= today ? "Happening now" : `Next event · ${shortDate(next.start)}`}</span>
            <span className="mt-0.5 flex items-start gap-2 font-display text-base font-bold leading-snug text-little-green-950"><PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-little-coral-500" />{next.title}</span>
          </button>
        ) : (
          <p className="text-center text-sm font-semibold text-little-neutral-500">No events scheduled yet — new dates appear here as soon as they&apos;re planned.</p>
        )}
        {inMonth > 0 && <p className="mt-2 text-center text-xs font-bold text-little-neutral-500">{inMonth} event{inMonth > 1 ? "s" : ""} in {MONTHS[view.m]}</p>}
      </div>
    </div>
  );
}
