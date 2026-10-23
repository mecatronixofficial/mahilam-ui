import Image from "@/components/media/SchoolImage";
import { CalendarDays, Clock3, MapPin, PartyPopper } from "lucide-react";
import type { SchoolEvent } from "@/lib/server-api";
import { formatDate, isOptimizable } from "@/lib/media";
import { BRAND } from "@/lib/brand";
import { RiseIn, TiltCard } from "@/components/programs/Fx";

const TINTS = [
  { chip: BRAND.yellow[400], soft: BRAND.yellow[100] },
  { chip: BRAND.coral[300], soft: BRAND.coral[100] },
  { chip: BRAND.green[300], soft: BRAND.green[100] },
  { chip: BRAND.blue[300], soft: BRAND.blue[100] },
];

/** Server-rendered event timeline: date balloons on a dotted line, cards alternating sides. `events === null` means the calendar couldn't be loaded. */
export function EventsList({ events }: { events: SchoolEvent[] | null }) {
  if (events === null) return <Status title="The calendar is taking a break." copy="We couldn't load events right now. Please check back shortly or contact the school for the latest dates." />;
  if (!events.length) return <Status title="New moments are on the way." copy="Upcoming celebrations, parent meetings and special school days will appear here once confirmed." />;

  return (
    <ol className="relative mx-auto max-w-5xl">
      {/* Timeline */}
      <span aria-hidden className="absolute bottom-0 left-[31px] top-0 w-1 rounded-full md:left-1/2 md:-translate-x-1/2" style={{ backgroundImage: `repeating-linear-gradient(180deg, ${BRAND.coral[300]} 0 8px, transparent 8px 18px)` }} />
      {events.map((event, index) => {
        const date = event.startDate || event.date;
        const start = date ? new Date(date) : null;
        const tint = TINTS[index % TINTS.length];
        const right = index % 2 === 1;
        return (
          <li key={event.id} className={`relative mb-8 grid grid-cols-[64px_1fr] gap-4 md:grid-cols-2 md:gap-12`}>
            {/* Date balloon on the line */}
            <div className="relative z-10 md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full text-little-green-950 shadow-[0_10px_20px_-10px_rgba(36,68,32,.6)] ring-4 ring-white" style={{ background: tint.chip }}>
                {start ? (
                  <>
                    <span className="text-[10px] font-black uppercase leading-none">{start.toLocaleString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}</span>
                    <span className="font-display text-2xl font-bold leading-none">{start.toLocaleString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}</span>
                  </>
                ) : <PartyPopper className="h-6 w-6" />}
              </div>
            </div>

            <RiseIn index={index} className={right ? "md:col-start-2" : "md:col-start-1 md:row-start-1"}>
              <TiltCard max={5} className="rounded-[28px]">
                <article className="group overflow-hidden rounded-[28px] bg-white shadow-[0_22px_44px_-30px_rgba(36,68,32,.55)] ring-1 ring-black/5">
                  {event.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image src={event.coverImage} alt={event.title} fill sizes="(min-width: 768px) 480px, 100vw" unoptimized={!isOptimizable(event.coverImage)} className="object-cover transition duration-700 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-6" style={{ background: `linear-gradient(180deg, ${tint.soft}66, #fff 60%)` }}>
                    <h3 className="font-display text-2xl font-bold text-little-green-950">{event.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-little-neutral-500">
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-little-green-700" />{date ? formatDate(date, { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "Date to be announced"}{event.endDate ? ` – ${formatDate(event.endDate)}` : ""}</span>
                      {event.startTime && <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-little-coral-600" />{event.startTime}</span>}
                      {event.venue && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-little-yellow-700" />{event.venue}</span>}
                    </div>
                    {event.description && <p className="mt-3 leading-7 text-little-neutral-600">{event.description}</p>}
                  </div>
                </article>
              </TiltCard>
            </RiseIn>
          </li>
        );
      })}
    </ol>
  );
}

function Status({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[32px] bg-white p-10 text-center shadow-[0_22px_44px_-30px_rgba(36,68,32,.5)]">
      <span aria-hidden className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-little-yellow-100" />
      <span aria-hidden className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-little-pink-50" />
      <span className="relative mx-auto flex h-16 w-16 animate-bob items-center justify-center rounded-[22px] bg-gradient-to-br from-little-yellow-400 to-little-coral-300 text-little-green-950"><PartyPopper className="h-8 w-8" /></span>
      <h3 className="relative mt-5 font-display text-2xl font-bold text-little-green-950">{title}</h3>
      <p className="relative mx-auto mt-2 max-w-lg leading-7 text-little-neutral-600">{copy}</p>
    </div>
  );
}
