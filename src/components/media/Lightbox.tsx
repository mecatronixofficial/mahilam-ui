"use client";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { isOptimizable } from "@/lib/media";
import { fx } from "@/components/animations/fx";

export type LightboxPhoto = { id: string; src: string; alt: string; caption?: string | null };

/**
 * Full-screen photo viewer. Escape closes, ←/→ step, Tab stays inside the dialog,
 * and focus returns to whatever opened it. The page behind doesn't scroll while open.
 */
export function Lightbox({ photos, index, onIndex, onClose, label = "Photo viewer" }: { photos: LightboxPhoto[]; index: number | null; onIndex: (i: number) => void; onClose: () => void; label?: string }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const direction = useRef(1);
  const open = index !== null && photos.length > 0;

  const step = useCallback((delta: number) => {
    if (index === null) return;
    direction.current = delta;
    onIndex((index + delta + photos.length) % photos.length);
  }, [index, onIndex, photos.length]);

  // Latest handlers, so the key listener below is bound once per opening (focus stays put while stepping).
  const handlers = useRef({ step, onClose });
  useEffect(() => { handlers.current = { step, onClose }; });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handlers.current.onClose();
      else if (event.key === "ArrowRight") handlers.current.step(1);
      else if (event.key === "ArrowLeft") handlers.current.step(-1);
      else if (event.key === "Tab" && dialog.current) {
        const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  const photo = photos[index];
  const many = photos.length > 1;

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label={label} onClick={onClose} className="fixed inset-0 z-[90] flex animate-[fx-fade_.25s_ease-out] items-center justify-center bg-little-green-950/90 p-3 backdrop-blur-md sm:p-6 motion-reduce:animate-none">
      <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close photo viewer" className="glass-dark absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full text-white transition hover:rotate-90 focus-visible:outline-3 focus-visible:outline-little-yellow-400 sm:right-5 sm:top-5"><X className="h-5 w-5" /></button>
      {many && <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="glass-dark absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white transition hover:-translate-x-0.5 focus-visible:outline-3 focus-visible:outline-little-yellow-400 sm:left-5"><ChevronLeft className="h-6 w-6" /></button>}

      <figure key={photo.id} data-in="" onClick={(e) => e.stopPropagation()} className="fx relative flex w-full max-w-5xl flex-col items-center" style={fx({ x: direction.current * 60, s: 0.96, dur: 0.45, ease: "spring" }) as CSSProperties}>
        <div className="relative h-[72vh] w-full">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 1024px, 96vw" unoptimized={!isOptimizable(photo.src)} className="object-contain" />
        </div>
        <figcaption className="mt-3 text-center text-sm font-bold text-white/90 sm:text-base">
          {photo.caption || photo.alt}
          {many && <span className="ml-2 text-white/55">{index + 1} / {photos.length}</span>}
        </figcaption>
      </figure>

      {many && <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="glass-dark absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white transition hover:translate-x-0.5 focus-visible:outline-3 focus-visible:outline-little-yellow-400 sm:right-5"><ChevronRight className="h-6 w-6" /></button>}
    </div>
  );
}
