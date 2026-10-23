"use client";
import { useState, type CSSProperties } from "react";
import Image from "@/components/media/SchoolImage";
import { fx } from "@/components/animations/fx";
import { ArrowDown, Camera, Hand, MapPin } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { isOptimizable } from "@/lib/media";
import { Hills, SECTION_BG, StarDoodle } from "@/components/about/Doodles";
import { Magnetic } from "@/components/programs/Fx";

export type HeroPhoto = { src: string; alt: string; caption: string };

const TILTS = [-6, 5, -3, 7, -8];
const SPLASHES = [
  { color: BRAND.pink[200], className: "-left-10 top-10 w-44" },
  { color: BRAND.yellow[200], className: "left-[38%] -top-12 w-40" },
  { color: BRAND.blue[100], className: "-right-8 bottom-24 w-56" },
];

/** A paint splash: a blob with a few droplets. */
function Splash({ color, className }: { color: string; className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={`absolute animate-float [animation-duration:12s] ${className}`}>
      <path d="M100 22c28 0 33 26 54 30s34 22 26 46-6 34-24 50-48 28-72 18-38-14-48-40-20-36-6-60 42-44 70-44Z" fill={color} />
      <circle cx="176" cy="40" r="10" fill={color} />
      <circle cx="30" cy="170" r="8" fill={color} />
      <circle cx="186" cy="150" r="5" fill={color} />
    </svg>
  );
}

/** Gallery hero: a pile of polaroids you can shuffle (tap the top one), with a camera that flashes now and then. */
export function GalleryHero({ photos }: { photos: HeroPhoto[] }) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [flying, setFlying] = useState<number | null>(null);
  // Reordering the pile re-inserts DOM nodes, which would replay the CSS entrance — so it only runs until the first shuffle.
  const [shuffled, setShuffled] = useState(false);
  // The top photo flies off to the right, then moves to the back of the pile.
  const shuffle = () => {
    if (flying !== null || photos.length < 2) return;
    setFlying(order[0]);
    setShuffled(true);
    window.setTimeout(() => {
      setOrder((list) => [...list.slice(1), list[0]]);
      setFlying(null);
    }, 340);
  };

  return (
    <section data-in="" className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${BRAND.pink[50]} 0%, ${SECTION_BG.cream} 100%)` }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPLASHES.map((s) => <Splash key={s.className} {...s} />)}
        <StarDoodle className="absolute left-[8%] top-[62%] w-5 animate-twinkle" />
        <StarDoodle color={BRAND.blue[300]} className="absolute right-[44%] top-16 w-4 animate-twinkle [animation-delay:-1.3s]" />
      </div>

      <div className="container-pad relative grid items-center gap-8 pb-16 pt-8 lg:grid-cols-[1fr_1fr] lg:pb-20 lg:pt-10">
        <div className="text-center lg:text-left">
          <span style={fx({ y: 16, dur: 0.6 })} className="fx inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-extrabold text-little-green-800 shadow-sm">
            <span className="relative grid h-7 w-7 place-items-center rounded-full bg-little-pink-400 text-white">
              <Camera className="h-4 w-4" />
              {/* Camera flash */}
              <span className="absolute inset-0 animate-[fx-flash_4s_linear_infinite] rounded-full bg-white opacity-0" />
            </span>
            Our gallery
          </span>
          <h1
            style={fx({ y: 24, d: 0.08, dur: 0.9, ease: "spring" })}
            className="fx mt-5 text-balance font-display text-[clamp(2.5rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-tight text-little-green-950"
          >
            Little moments.{" "}
            <span className="relative inline-block text-little-pink-500">
              Lasting memories.
              <svg aria-hidden viewBox="0 0 300 18" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-4 w-full">
                <path d="M4 12 Q 75 2 150 10 T 296 8" fill="none" stroke={BRAND.yellow[400]} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray={1} className="fx-draw" style={fx({ d: 0.7, dur: 0.8, ease: "soft" })} />
              </svg>
            </span>
          </h1>
          <p style={fx({ y: 20, d: 0.18, dur: 0.6 })} className="fx mx-auto mt-5 max-w-xl text-lg leading-8 text-little-neutral-600 lg:mx-0">
            A colourful glimpse into the creativity, friendship, celebration and joyful discovery that fill our school days.
          </p>
          <div style={fx({ y: 20, d: 0.26, dur: 0.6 })} className="fx mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Magnetic>
              <a href="#memory-wall" className="inline-flex h-12 items-center gap-2 rounded-full bg-little-green-900 px-6 text-[15px] font-extrabold text-white shadow-[0_16px_30px_-16px_rgba(36,68,32,.9)]">
                Open the Memory Wall <ArrowDown className="h-4 w-4 animate-bounce text-little-yellow-400" />
              </a>
            </Magnetic>
            <a href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-extrabold text-little-green-900 ring-1 ring-little-green-900/10 transition hover:-translate-y-0.5">
              <MapPin className="h-4 w-4 text-little-coral-500" /> Plan a Campus Visit
            </a>
          </div>
        </div>

        {/* Polaroid pile */}
        <div className="relative mx-auto mb-10 h-[380px] w-full max-w-[380px] sm:h-[440px]">
          {order.map((photoIndex, depth) => {
            const photo = photos[photoIndex];
            const tilt = TILTS[photoIndex % TILTS.length];
            const isTop = depth === 0;
            const isFlying = flying === photoIndex;
            return (
              <button
                key={photo.src + photoIndex}
                type="button"
                onClick={isTop ? shuffle : undefined}
                tabIndex={isTop ? 0 : -1}
                aria-label={isTop ? `Shuffle photos — showing “${photo.caption}”` : undefined}
                aria-hidden={!isTop}
                className={`${shuffled ? "" : "fx"} absolute inset-x-4 top-0 bg-white p-3 pb-14 shadow-[0_24px_40px_-24px_rgba(36,68,32,.6)] outline-none [transform:var(--t)] focus-visible:ring-4 focus-visible:ring-little-blue-300 ${isFlying ? "transition-transform duration-300 ease-in" : "transition-transform duration-500 ease-(--ease-back)"} ${isTop ? "cursor-pointer hover:[transform:translateY(-8px)_scale(1.02)]" : "pointer-events-none"}`}
                style={{
                  ...fx({ y: 60, r: tilt, d: depth * 0.06, dur: 0.8, ease: "spring" }),
                  zIndex: isFlying ? 50 : photos.length - depth,
                  "--t": isFlying ? `translate(300px, -30px) rotate(${tilt + 24}deg)` : `translateY(${depth * 6}px) rotate(${isTop ? tilt / 2 : tilt}deg) scale(${1 - depth * 0.03})`,
                } as CSSProperties}
              >
                <span className="relative block aspect-[4/4.2] overflow-hidden bg-little-cream">
                  <Image src={photo.src} alt={photo.alt} fill priority={depth === 0} sizes="360px" unoptimized={!isOptimizable(photo.src)} className="object-cover" />
                </span>
                <span className="absolute inset-x-0 bottom-3 text-center font-display text-xl font-bold text-little-green-900">{photo.caption}</span>
                {isTop && <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-little-yellow-300/80" />}
              </button>
            );
          })}
          {photos.length > 1 && (
            <span
              aria-hidden
              className="fx-hop absolute -bottom-12 left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-little-green-900 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md"
              style={{ "--fx-hop": "-4px", "--fx-dur": "1.8s" } as CSSProperties}
            >
              <Hand className="h-3.5 w-3.5 text-little-yellow-400" /> Tap the photo to shuffle
            </span>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0"><Hills className="h-14 sm:h-20" back={BRAND.pink[100]} front={SECTION_BG.cream} /></div>
    </section>
  );
}
