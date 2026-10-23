"use client";
import { useState } from "react";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { Camera, Expand } from "lucide-react";
import { isOptimizable } from "@/lib/media";
import { Lightbox } from "@/components/media/Lightbox";
import type { SpacePhoto } from "./data";

/** Editorial rhythm: every fifth photo is a large feature, the rest support it. Fixed aspect ratios keep the layout from shifting. */
const TILE = ["sm:col-span-2 sm:row-span-2", "", "", "sm:row-span-2", ""];

export function PhotoTour({ photos }: { photos: SpacePhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(10);

  if (photos.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[36px] border border-little-green-900/10 bg-white p-8 text-center shadow-[0_20px_40px_-34px_rgba(36,68,32,.6)]">
        <div aria-hidden className="grid grid-cols-3 gap-2">
          {["aspect-[3/4]", "aspect-square mt-6", "aspect-[3/4]"].map((c, i) => <span key={i} className={`w-16 rounded-2xl bg-little-cream-100 ${c}`} />)}
        </div>
        <Camera className="mt-5 h-7 w-7 text-little-green-800/50" />
        <h3 className="mt-3 font-display text-2xl font-bold text-little-green-950">Our photo tour is being prepared</h3>
        <p className="mt-2 max-w-md leading-7 text-little-neutral-600">We&apos;re photographing our classrooms and play spaces. Until then, the best tour is a real one — we&apos;d love to show you around.</p>
        <Link href="/contact" className="mt-5 font-display font-bold text-little-coral-600 underline decoration-2 underline-offset-4">Book a visit</Link>
      </div>
    );
  }

  const visible = photos.slice(0, shown);
  return (
    <div>
      <ul className="grid auto-rows-[160px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((p, i) => (
          <li key={p.id} className={TILE[i % TILE.length]}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.alt}`} className="group/ph relative block h-full w-full overflow-hidden rounded-[24px] bg-little-cream-100 shadow-[0_18px_30px_-26px_rgba(36,68,32,.7)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-little-pink-400 sm:rounded-[30px]">
              <Image src={p.src} alt={p.alt} fill loading="lazy" sizes={i % 5 === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} unoptimized={!isOptimizable(p.src)} className="object-cover transition-transform duration-700 ease-out group-hover/ph:scale-108" />
              <span className="absolute inset-0 bg-linear-to-t from-little-green-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/ph:opacity-100 group-focus-visible/ph:opacity-100" />
              {p.caption && <span className="absolute bottom-3 left-3 right-10 translate-y-2 truncate text-left font-display text-sm font-bold text-white opacity-0 transition duration-300 group-hover/ph:translate-y-0 group-hover/ph:opacity-100">{p.caption}</span>}
              <Expand aria-hidden className="absolute bottom-3 right-3 h-5 w-5 text-white opacity-0 transition-opacity group-hover/ph:opacity-100" />
            </button>
          </li>
        ))}
      </ul>
      {photos.length > shown && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={() => setShown((n) => n + 10)} className="rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-little-green-950 shadow-sm ring-2 ring-little-green-900/10 transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400">Show more photos</button>
        </div>
      )}
      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} label="Campus photo tour" />
    </div>
  );
}
