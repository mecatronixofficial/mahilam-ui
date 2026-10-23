"use client";
import { useMemo, useState } from "react";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { Camera, Expand, Plus } from "lucide-react";
import type { GalleryAlbum } from "@/lib/server-api";
import { isOptimizable } from "@/lib/media";
import { BRAND } from "@/lib/brand";
import { Lightbox, type LightboxPhoto } from "@/components/media/Lightbox";
import styles from "./activities.module.css";

type Moment = LightboxPhoto & { group: string };

const FRAMES = ["46% 54% 42% 58% / 44% 46% 54% 56%", "32px", "999px 999px 32px 32px", "32px 96px 32px 32px", "58% 42% 60% 40% / 52% 40% 60% 48%", "32px 32px 96px 32px"];
const RINGS = [BRAND.yellow[300], BRAND.pink[200], BRAND.blue[200], BRAND.green[200], BRAND.coral[200]];
const PAGE = 12;

/** Masonry of real gallery photos with organic frames, album filters and a full-screen viewer. */
export function MomentsGallery({ albums }: { albums: GalleryAlbum[] }) {
  const all = useMemo<Moment[]>(
    () => albums.flatMap((a) => a.items.map((item) => ({ id: item.id, src: item.imageUrl, alt: item.altText || item.caption || `${a.title} at Little Mahilam Preschool`, caption: item.caption || a.title, group: a.category?.trim() || a.title }))),
    [albums],
  );
  const groups = useMemo(() => Array.from(new Set(all.map((p) => p.group))), [all]);
  const [group, setGroup] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());

  if (all.length === 0) return <EmptyMoments />;

  const photos = group ? all.filter((p) => p.group === group) : all;
  const visible = photos.slice(0, shown);

  return (
    <div>
      {groups.length > 1 && (
        <div role="group" aria-label="Filter photos" className="hide-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {["", ...groups].map((g, i) => {
            const on = group === g;
            return (
              <button
                key={g || "all"}
                type="button"
                aria-pressed={on}
                onClick={() => { setGroup(g); setShown(PAGE); }}
                className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold transition-[background-color,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400 ${on ? "text-little-green-950 shadow-md" : "bg-white text-little-green-900"}`}
                style={on ? { background: RINGS[i % RINGS.length] } : undefined}
              >
                {g || "All moments"}
              </button>
            );
          })}
        </div>
      )}

      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {visible.map((p, i) => (
          <li key={p.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${p.alt}`}
              className="group/ph relative block w-full overflow-hidden border-[6px] bg-white shadow-[0_16px_30px_-24px_rgba(36,68,32,.7)] transition-[translate] duration-300 hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-little-pink-400"
              style={{ borderRadius: FRAMES[i % FRAMES.length], borderColor: RINGS[i % RINGS.length] }}
            >
              <span className="block bg-little-cream-100">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={600}
                  height={i % 3 === 0 ? 780 : i % 3 === 1 ? 600 : 460}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  unoptimized={!isOptimizable(p.src)}
                  onLoad={() => setLoaded((s) => new Set(s).add(p.id))}
                  data-loading={loaded.has(p.id) ? undefined : ""}
                  className={`h-auto w-full object-cover group-hover/ph:scale-110 ${styles.loaded}`}
                />
              </span>
              <span aria-hidden className="absolute inset-0 grid place-items-center bg-little-green-950/0 transition-colors group-hover/ph:bg-little-green-950/25">
                <Expand className="h-7 w-7 scale-50 text-white opacity-0 transition group-hover/ph:scale-100 group-hover/ph:opacity-100" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {photos.length > shown && (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-little-green-950 shadow-sm ring-2 ring-little-green-900/10 transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-little-pink-400">
            <Plus className="h-4 w-4" /> Show more moments
          </button>
        </div>
      )}

      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} label="Little moments photo viewer" />
    </div>
  );
}

function EmptyMoments() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[40px] border-2 border-dashed border-little-green-900/15 bg-white/70 p-8 text-center">
      <div aria-hidden className="flex -space-x-4">
        {[BRAND.yellow[200], BRAND.pink[100], BRAND.blue[100]].map((c, i) => (
          <span key={c} className="grid h-20 w-16 place-items-center rounded-2xl border-4 border-white shadow-md" style={{ background: c, rotate: `${(i - 1) * 8}deg` }}>
            <Camera className="h-6 w-6 text-little-green-900/40" />
          </span>
        ))}
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-little-green-950">Fresh moments are on their way</h3>
      <p className="mt-2 max-w-md leading-7 text-little-neutral-600">Our teachers are choosing photos from recent activities. They&apos;ll appear here as soon as they&apos;re published.</p>
      <Link href="/gallery" className="mt-5 font-display font-bold text-little-coral-600 underline decoration-2 underline-offset-4">Visit the gallery</Link>
    </div>
  );
}
