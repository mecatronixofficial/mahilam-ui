"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogSummary } from "@/lib/server-api";
import { TallCard } from "./StoryCards";
import styles from "./journal.module.css";

/** "Learning Highlights": a swipeable, snap-scrolling rail with previous/next buttons that disable at either end. */
export function HighlightsRail({ posts }: { posts: BlogSummary[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  const scroll = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  const button = "grid h-11 w-11 place-items-center rounded-full bg-white text-little-green-950 shadow-[0_10px_20px_-14px_rgba(36,68,32,.8)] ring-2 ring-little-green-900/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-3 focus-visible:outline-little-pink-400";

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} disabled={edge.start} aria-label="Previous stories" aria-controls="highlights-rail" className={button}><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => scroll(1)} disabled={edge.end} aria-label="Next stories" aria-controls="highlights-rail" className={button}><ChevronRight className="h-5 w-5" /></button>
      </div>
      <ul id="highlights-rail" ref={rail} tabIndex={0} aria-label="Learning highlight stories" className={`-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 pt-1 outline-none focus-visible:ring-4 focus-visible:ring-little-pink-300 ${styles.rail}`}>
        {posts.map((post, i) => (
          <li key={post.id} className="w-[78%] shrink-0 sm:w-[46%] lg:w-[31%]"><TallCard post={post} i={i} /></li>
        ))}
      </ul>
    </div>
  );
}
