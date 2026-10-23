"use client";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { Appear } from "@/components/animations/Appear";
import { fx } from "@/components/animations/fx";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryAlbum } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";
import { BRAND } from "@/lib/brand";

type Photo = { id: string; src: string; alt: string; caption?: string | null; album: string };

const TILTS = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.2];
const TAPES = [BRAND.yellow[300], BRAND.pink[200], BRAND.blue[200], BRAND.green[200]];
const CRAYONS = [BRAND.coral[400], BRAND.yellow[400], BRAND.green[400], BRAND.blue[400], BRAND.pink[400]];

/** Crayon-shaped album filters + tilted polaroid masonry + animated, keyboard-accessible lightbox. */
export function GalleryAlbums({ albums }: { albums: GalleryAlbum[] }) {
  const [album, setAlbum] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const photos: Photo[] = albums
    .filter((a) => !album || a.slug === album)
    .flatMap((a) => a.items.map((item) => ({ id: item.id, src: item.imageUrl, alt: item.altText || item.caption || `${a.title} at Little Mahilam Preschool`, caption: item.caption, album: a.title })));

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((delta: number) => {
    setDirection(delta);
    setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    // Deep link: /gallery#annual-day opens that album.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && albums.some((a) => a.slug === hash)) setAlbum(hash);
  }, [albums]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <div>
      {albums.length > 1 && (
        <div className="hide-scrollbar -mx-4 mb-8 flex items-end gap-2 overflow-x-auto px-4 pb-1 pt-3" role="tablist" aria-label="Albums">
          {[{ slug: "", title: "All photos" }, ...albums].map((a, i) => {
            const selected = album === a.slug;
            const color = CRAYONS[i % CRAYONS.length];
            return (
              <button
                key={a.slug || "all"}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => { setAlbum(a.slug); history.replaceState(null, "", a.slug ? `#${a.slug}` : " "); }}
                className={`relative shrink-0 rounded-r-full rounded-l-md py-2 pl-4 pr-5 text-sm font-extrabold text-little-green-950 shadow-[0_8px_14px_-10px_rgba(36,68,32,.6)] transition-[translate] duration-300 ease-(--ease-back-strong) hover:-translate-y-1.5 ${selected ? "-translate-y-1.5" : ""}`}
                style={{ background: selected ? color : "#fff", boxShadow: selected ? `inset 6px 0 0 ${color}` : undefined }}
              >
                {/* Crayon tip */}
                <span aria-hidden className="absolute -left-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[10px] border-r-[12px] border-y-transparent" style={{ borderRightColor: color }} />
                {a.title}
              </button>
            );
          })}
        </div>
      )}

      <div className={`columns-2 gap-4 md:columns-3 md:gap-5 ${photos.length >= 8 ? "lg:columns-4" : ""}`}>
        {/* Polaroids */}
          {photos.map((photo, index) => (
            <Appear
              as="button"
              key={`${album}-${photo.id}`}
              type="button"
              onClick={() => { setDirection(1); setOpen(index); }}
              aria-label={`Open photo: ${photo.alt}`}
              className="group relative mb-4 block w-full break-inside-avoid bg-white p-2 pb-9 text-left shadow-[0_14px_26px_-18px_rgba(36,68,32,.6)] rotate-(--tilt) transition-[rotate,translate,scale] duration-300 ease-(--ease-back) hover:z-5 hover:-translate-y-2 hover:rotate-0 hover:scale-103 md:mb-5"
              y={30} s={0.92} d={(index % 4) * 0.05} dur={0.6} ease="back" start="top 95%"
              style={{ "--tilt": `${TILTS[index % TILTS.length]}deg` } as CSSProperties}
            >
              <span aria-hidden className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-2 opacity-80" style={{ background: TAPES[index % TAPES.length] }} />
              <span className="relative block overflow-hidden">
                <Image src={photo.src} alt={photo.alt} width={600} height={index % 3 === 0 ? 760 : 460} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" unoptimized={!isOptimizable(photo.src)} loading="lazy" className="h-auto w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-little-green-950/0 transition group-hover:bg-little-green-950/25">
                  <Expand className="h-7 w-7 scale-50 text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
                </span>
              </span>
              <span className="absolute inset-x-2 bottom-2 line-clamp-1 text-center font-display text-sm font-bold text-little-green-900">{photo.caption || photo.album}</span>
            </Appear>
          ))}
      </div>

        {current && (
          <div
            key="lightbox"
            className="fixed inset-0 z-[80] flex animate-[fx-fade_.25s_ease-out] items-center justify-center bg-little-green-950/85 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={close}
          >
            <button type="button" onClick={close} aria-label="Close" className="glass-dark absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:rotate-90"><X className="h-5 w-5" /></button>
            {photos.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="glass-dark absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:-translate-x-1"><ChevronLeft className="h-6 w-6" /></button>}
              <figure
                key={current.id}
                data-in=""
                className="fx relative flex max-h-[calc(100dvh-2rem)] max-w-5xl flex-col bg-white p-3 shadow-2xl"
                style={fx({ x: direction * 80, r: direction * 4, s: 0.92, dur: 0.45, ease: "spring" })}
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={current.src} alt={current.alt} width={1600} height={1200} unoptimized className="min-h-0 max-h-[74dvh] w-auto max-w-full self-center object-contain" />
                <figcaption className="mt-3 max-h-[25dvh] shrink-0 overflow-y-auto text-center font-display text-base font-bold text-little-green-900 [overflow-wrap:anywhere]">
                  {current.caption || current.album} <span className="text-little-neutral-400">· {open! + 1} / {photos.length}</span>
                </figcaption>
              </figure>
            {photos.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="glass-dark absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:translate-x-1"><ChevronRight className="h-6 w-6" /></button>}
          </div>
        )}
    </div>
  );
}
