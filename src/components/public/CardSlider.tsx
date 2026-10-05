"use client";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Tone = "light" | "dark";

/**
 * Horizontal card slider: native scroll-snap (swipe/trackpad/keyboard), arrow buttons and a progress bar.
 * Arrows and progress only appear when the cards overflow, so a row that fits stays a plain row.
 */
export function CardSlider({
  children,
  label,
  heading,
  itemClassName = "w-[82%] sm:w-[46%] lg:w-[31.8%]",
  tone = "light",
}: {
  children: ReactNode;
  label: string;
  heading?: ReactNode;
  itemClassName?: string;
  tone?: Tone;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ start: true, end: false, progress: 0, visible: 1 });
  const items = Children.toArray(children);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setView({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4, progress: max > 0 ? el.scrollLeft / max : 0, visible: el.scrollWidth ? Math.min(1, el.clientWidth / el.scrollWidth) : 1 });
  }, []);

  useEffect(() => {
    const el = track.current;
    measure();
    el?.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function step(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 20;
    el.scrollBy({ left: direction * ((card?.offsetWidth ?? el.clientWidth * 0.8) + gap), behavior: "smooth" });
  }

  const scrollable = view.visible < 0.999;
  const arrow = tone === "dark"
    ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 disabled:opacity-30"
    : "bg-white text-emerald-950 ring-1 ring-emerald-950/10 shadow-sm hover:bg-emerald-50 disabled:opacity-35";

  return (
    <div>
      {(heading || scrollable) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">{heading}</div>
          {scrollable && (
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={() => step(-1)} disabled={view.start} aria-label={`Previous — ${label}`} className={`flex h-12 w-12 items-center justify-center rounded-full transition disabled:cursor-default ${arrow}`}><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => step(1)} disabled={view.end} aria-label={`Next — ${label}`} className={`flex h-12 w-12 items-center justify-center rounded-full transition disabled:cursor-default ${arrow}`}><ChevronRight className="h-5 w-5" /></button>
            </div>
          )}
        </div>
      )}

      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={scrollable ? 0 : -1}
        className="hide-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-3 pt-1 outline-none sm:-mx-2 sm:scroll-px-2 sm:px-2"
      >
        {items.map((item, i) => (
          <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`} className={`shrink-0 snap-start ${itemClassName}`}>
            {item}
          </div>
        ))}
      </div>

      {scrollable && (
        <div aria-hidden className={`relative mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full ${tone === "dark" ? "bg-white/15" : "bg-emerald-950/10"}`}>
          <span
            className={`absolute inset-y-0 rounded-full transition-[left] duration-150 ${tone === "dark" ? "bg-[#f7c85b]" : "bg-emerald-800"}`}
            style={{ width: `${view.visible * 100}%`, left: `${view.progress * (1 - view.visible) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
