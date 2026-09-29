"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/server-api";

const TINTS = ["#d6a62d", "#e58d73", "#3f7a63", "#e9b949", "#69a88d"];

/** 3D-ish carousel of approved reviews. Rows are server-rendered, so reviews are indexable. */
export function TestimonialsDynamic({ rows }: { rows: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (rows.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % rows.length), 6500);
    return () => window.clearInterval(timer);
  }, [rows.length, paused]);

  if (!rows.length) return null;
  const move = (direction: number) => setActive((current) => (current + direction + rows.length) % rows.length);

  return (
    <section className="overflow-hidden py-16 md:py-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-pad text-center">
        <span className="eyebrow">Parent voices</span>
        <h2 className="section-title mt-4 text-emerald-950">What families say.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Real experiences shared by families in our Little Mahilam community.</p>

        <div
          className="relative mt-10 h-[420px] outline-none sm:h-[400px]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Parent testimonials"
          tabIndex={0}
          onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}
        >
          {rows.map((testimonial, index) => {
            let position = index - active;
            if (position > rows.length / 2) position -= rows.length;
            if (position < -rows.length / 2) position += rows.length;
            const distance = Math.abs(position);
            const visible = distance <= 2;
            const tint = TINTS[index % TINTS.length];
            const rating = testimonial.rating || 5;
            return (
              <figure
                key={testimonial.id || index}
                aria-hidden={position !== 0}
                onClick={() => setActive(index)}
                className={`glass-card absolute left-1/2 top-0 m-0 flex min-h-[350px] w-[min(84vw,400px)] flex-col p-7 text-left transition-all duration-500 ease-out md:w-[min(34vw,400px)] ${visible ? "" : "pointer-events-none"} ${distance > 0 ? "hidden sm:flex" : "flex"} ${distance > 1 ? "sm:hidden lg:flex" : ""}`}
                style={{
                  transform: `translateX(calc(-50% + ${position} * clamp(190px, 24vw, 310px))) scale(${position === 0 ? 1 : distance === 1 ? 0.84 : 0.7})`,
                  opacity: visible ? (position === 0 ? 1 : distance === 1 ? 0.7 : 0.35) : 0,
                  zIndex: 10 - distance,
                  filter: position === 0 ? undefined : "saturate(.8)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${tint}22`, color: tint }}><Quote className="h-5 w-5" /></span>
                  <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, star) => <Star key={star} className={`h-4 w-4 ${star < rating ? "fill-[#f7c85b] text-[#d6a62d]" : "text-slate-200"}`} />)}
                  </div>
                </div>
                {testimonial.subject && <h3 className="mt-5 text-lg font-bold text-emerald-950">{testimonial.subject}</h3>}
                <blockquote className={`${testimonial.subject ? "mt-2" : "mt-5"} line-clamp-5 flex-1 leading-7 text-slate-600`}>“{testimonial.testimonial}”</blockquote>
                <figcaption className="mt-6 border-t border-emerald-950/10 pt-4">
                  <div className="font-bold text-emerald-950">{testimonial.parentName}</div>
                  {testimonial.location && <div className="mt-0.5 text-xs font-bold text-slate-400">{testimonial.location}</div>}
                </figcaption>
              </figure>
            );
          })}
        </div>

        {rows.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-4">
            <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial" className="glass-chip flex h-11 w-11 items-center justify-center rounded-full text-emerald-950 transition hover:scale-105"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex max-w-48 gap-2 overflow-hidden">
              {rows.map((testimonial, index) => (
                <button key={testimonial.id || index} type="button" onClick={() => setActive(index)} aria-label={`Show testimonial ${index + 1}`} aria-current={active === index ? "true" : undefined} className={`h-2.5 shrink-0 rounded-full transition-all ${active === index ? "w-7 bg-emerald-700" : "w-2.5 bg-emerald-950/20 hover:bg-emerald-950/40"}`} />
              ))}
            </div>
            <button type="button" onClick={() => move(1)} aria-label="Next testimonial" className="glass-chip flex h-11 w-11 items-center justify-center rounded-full text-emerald-950 transition hover:scale-105"><ChevronRight className="h-5 w-5" /></button>
          </div>
        )}
      </div>
    </section>
  );
}
