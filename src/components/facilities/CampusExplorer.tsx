"use client";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "@/components/media/SchoolImage";
import { Camera, Expand } from "lucide-react";
import { isOptimizable } from "@/lib/media";
import { Lightbox } from "@/components/media/Lightbox";
import { SPACE_ICONS, type Space } from "./data";

/** Pick a space (tabs: ←/→/Home/End), see its photos and what children do there, and open them full-screen. */
export function CampusExplorer({ spaces }: { spaces: Space[] }) {
  const [active, setActive] = useState(0);
  const [shot, setShot] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const space = spaces[active];
  const photo = space.photos[shot];
  const Icon = SPACE_ICONS[space.icon];

  const select = (i: number, focus = false) => {
    setActive(i);
    setShot(0);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (event: KeyboardEvent) => {
    const last = spaces.length - 1;
    const next = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select((next + spaces.length) % spaces.length, true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[.42fr_1fr] lg:gap-8">
      <div role="tablist" aria-label="School spaces" aria-orientation="vertical" onKeyDown={onKey} className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {spaces.map((s, i) => {
          const TabIcon = SPACE_ICONS[s.icon];
          const on = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => { tabs.current[i] = el; }}
              id={`${uid}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={`group/tab flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-[background-color,box-shadow] duration-300 focus-visible:outline-3 focus-visible:outline-little-pink-400 lg:w-full ${on ? "bg-white shadow-[0_14px_26px_-20px_rgba(36,68,32,.7)]" : "hover:bg-white/60"}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-little-green-900 transition-transform duration-300 group-hover/tab:scale-105" style={{ background: s.tint }}><TabIcon className="h-5 w-5" /></span>
              <span className="whitespace-nowrap font-display text-base font-bold text-little-green-950 lg:whitespace-normal">{s.title}</span>
              <span aria-hidden className={`ml-auto hidden h-2 w-2 rounded-full bg-little-coral-400 transition-opacity lg:block ${on ? "opacity-100" : "opacity-0"}`} />
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="overflow-hidden rounded-[36px] bg-white shadow-[0_30px_60px_-44px_rgba(36,68,32,.7)]">
        <div className="relative aspect-[16/10] bg-little-cream-100">
          {photo ? (
            <button type="button" onClick={() => setOpen(shot)} className="group/img absolute inset-0 block focus-visible:outline-none" aria-label={`View ${space.title} photos full screen`}>
              <span key={`${space.id}-${photo.id}`} className="absolute inset-0 animate-[fx-fade_.5s_ease-out] motion-reduce:animate-none">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 720px, 92vw" unoptimized={!isOptimizable(photo.src)} className="object-cover transition-transform duration-700 group-hover/img:scale-103" />
              </span>
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-little-green-950 shadow group-focus-visible/img:ring-4 group-focus-visible/img:ring-little-pink-300"><Expand className="h-3.5 w-3.5" />Full screen</span>
            </button>
          ) : (
            <div key={space.id} className="absolute inset-0 flex animate-[fx-fade_.5s_ease-out] flex-col items-center justify-center gap-3 motion-reduce:animate-none" style={{ background: space.tint }}>
              <span className="grid h-20 w-20 place-items-center rounded-[28px] bg-white text-little-green-900 shadow-sm"><Icon className="h-9 w-9" strokeWidth={1.8} /></span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.16em] text-little-green-900/55"><Camera className="h-3.5 w-3.5" />Photos of this space are coming soon</span>
            </div>
          )}
        </div>

        <div key={space.id} className="animate-fade-up p-5 motion-reduce:animate-none sm:p-7">
          <h3 className="font-display text-2xl font-bold text-little-green-950 sm:text-3xl">{space.title}</h3>
          <p className="mt-2 max-w-2xl text-[16px] leading-7 text-little-neutral-600">{space.inside}</p>
          {space.photos.length > 1 && (
            <ul aria-label={`${space.title} photos`} className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              {space.photos.map((p, i) => (
                <li key={p.id} className="shrink-0">
                  <button type="button" onClick={() => setShot(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === shot} className={`relative block h-16 w-20 overflow-hidden rounded-xl ring-offset-2 transition focus-visible:outline-3 focus-visible:outline-little-pink-400 ${i === shot ? "ring-3 ring-little-green-700" : "opacity-70 hover:opacity-100"}`}>
                    <Image src={p.src} alt="" fill sizes="80px" unoptimized={!isOptimizable(p.src)} className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Lightbox photos={space.photos} index={open} onIndex={(i) => { setOpen(i); setShot(i); }} onClose={() => setOpen(null)} label={`${space.title} photos`} />
    </div>
  );
}
