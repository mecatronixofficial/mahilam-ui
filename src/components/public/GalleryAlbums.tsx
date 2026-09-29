"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryAlbum } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";

type Photo = { id: string; src: string; alt: string; caption?: string | null; album: string };

/** Album filter chips + masonry-style grid + keyboard-accessible lightbox. */
export function GalleryAlbums({ albums }: { albums: GalleryAlbum[] }) {
  const [album, setAlbum] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const photos: Photo[] = albums
    .filter((a) => !album || a.slug === album)
    .flatMap((a) => a.items.map((item) => ({ id: item.id, src: item.imageUrl, alt: item.altText || item.caption || `${a.title} at Little Mahilam Preschool`, caption: item.caption, album: a.title })));

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)), [photos.length]);

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
        <div className="hide-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Albums">
          {[{ slug: "", title: "All photos" }, ...albums].map((a) => (
            <button key={a.slug || "all"} type="button" role="tab" aria-selected={album === a.slug} onClick={() => { setAlbum(a.slug); history.replaceState(null, "", a.slug ? `#${a.slug}` : " "); }} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${album === a.slug ? "bg-[#285744] text-white shadow-md" : "glass-chip text-slate-600 hover:bg-white"}`}>
              {a.title}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
        {photos.map((photo, index) => (
          <button key={photo.id} type="button" onClick={() => setOpen(index)} className="group relative mb-3 block w-full overflow-hidden rounded-[22px] bg-white/50 shadow-md md:mb-4" aria-label={`Open photo: ${photo.alt}`}>
            <Image src={photo.src} alt={photo.alt} width={600} height={index % 3 === 0 ? 760 : 460} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" unoptimized={!isOptimizable(photo.src)} loading="lazy" className="h-auto w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-left text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
              <span className="line-clamp-1">{photo.caption || photo.album}</span><Expand className="h-4 w-4 shrink-0" />
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-emerald-950/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <button type="button" onClick={close} aria-label="Close" className="glass-dark absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white"><X className="h-5 w-5" /></button>
          {photos.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="glass-dark absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white"><ChevronLeft className="h-6 w-6" /></button>}
          <figure className="relative max-h-full max-w-5xl animate-pop" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[80vh] w-auto rounded-[24px] object-contain shadow-2xl" />
            <figcaption className="mt-3 text-center text-sm font-bold text-white/85">{current.caption || current.album} <span className="text-white/50">· {open! + 1} / {photos.length}</span></figcaption>
          </figure>
          {photos.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="glass-dark absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white"><ChevronRight className="h-6 w-6" /></button>}
        </div>
      )}
    </div>
  );
}
