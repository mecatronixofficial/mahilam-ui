import Image from "next/image";
import { CalendarDays, Clock3, MapPin, PartyPopper } from "lucide-react";
import type { SchoolEvent } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";

/** Server-rendered event cards. `events === null` means the calendar couldn't be loaded. */
export function EventsList({ events }: { events: SchoolEvent[] | null }) {
  if (events === null) return <Status title="The calendar is taking a break." copy="We couldn't load events right now. Please check back shortly or contact the school for the latest dates." />;
  if (!events.length) return <Status title="New moments are on the way." copy="Upcoming celebrations, parent meetings and special school days will appear here once confirmed." />;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {events.map((event) => {
        const date = event.startDate || event.date;
        const start = date ? new Date(date) : null;
        return (
          <article key={event.id} className="glass-card reveal group overflow-hidden">
            {event.coverImage && (
              <div className="relative h-52 overflow-hidden">
                <Image src={event.coverImage} alt={event.title} fill sizes="(min-width: 768px) 560px, 100vw" unoptimized={!isOptimizable(event.coverImage)} className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
            )}
            <div className="flex gap-5 p-7">
              {start && (
                <div className="flex h-20 w-18 shrink-0 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] px-3 text-emerald-950 shadow-md">
                  <span className="text-xs font-black uppercase">{start.toLocaleString("en-IN", { month: "short" })}</span>
                  <span className="font-display text-3xl font-bold leading-none">{start.getDate()}</span>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-2xl font-bold text-emerald-950">{event.title}</h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-emerald-700" />{date ? formatDate(date, { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "Date to be announced"}{event.endDate ? ` – ${formatDate(event.endDate)}` : ""}</span>
                  {event.startTime && <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-[#df826d]" />{event.startTime}</span>}
                  {event.venue && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#d6a62d]" />{event.venue}</span>}
                </div>
                {event.description && <p className="mt-3 leading-7 text-slate-600">{event.description}</p>}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Status({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="glass-card p-10 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-emerald-950"><PartyPopper className="h-8 w-8" /></span>
      <h3 className="mt-5 text-2xl font-bold text-emerald-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg leading-7 text-slate-600">{copy}</p>
    </div>
  );
}
