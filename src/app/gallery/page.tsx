import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Camera,
  Heart,
  Images,
  Palette,
  Pin,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageBanner } from "@/components/public/PageBanner";
import { CardSlider } from "@/components/public/CardSlider";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { GalleryAlbums } from "@/components/public/GalleryAlbums";
import { getPublic, type GalleryAlbum } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Photo Gallery — Life at Our Preschool",
  description: "Photos of learning, art, play and celebrations at Little Mahilam Preschool, Kangayam Road, Tiruppur. See our classrooms and happy school moments.",
  path: "/gallery",
  keywords: ["preschool photos Tiruppur", "play school gallery Tiruppur"],
});

export const revalidate = 0;

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63", "#8cb9e8", "#b79ce6"];

const moments = [
  {
    icon: Camera,
    title: "Learning in Action",
    copy: "Hands-on classroom experiences, discovery activities and everyday learning moments.",
    image: localImage("/images/gallery/gallery-1.webp", 0),
  },
  {
    icon: Heart,
    title: "Happy Celebrations",
    copy: "Festivals, birthdays, special days and shared memories that bring everyone together.",
    image: localImage("/images/gallery/gallery-4.webp", 1),
  },
  {
    icon: Images,
    title: "Creative Expression",
    copy: "Art, craft, music, stories, movement and all the wonderful ways children express themselves.",
    image: localImage("/images/gallery/gallery-2.webp", 0),
  },
];

const gallery = [
  { src: localImage("/images/gallery/gallery-1.webp", 0), alt: "Children learning together", label: "Learning Time", className: "md:col-span-2 md:row-span-2" },
  { src: localImage("/images/gallery/gallery-2.webp", 1), alt: "Children enjoying art and craft", label: "Creative Fun", className: "" },
  { src: localImage("/images/gallery/gallery-3.webp", 0), alt: "Children playing together", label: "Play Time", className: "" },
  { src: localImage("/images/gallery/gallery-4.webp", 1), alt: "Preschool celebration", label: "Celebration", className: "" },
  { src: localImage("/images/gallery/gallery-5.webp", 0), alt: "Children enjoying classroom activity", label: "Discovery", className: "" },
  { src: localImage("/images/gallery/gallery-6.webp", 1), alt: "Children during story time", label: "Story Time", className: "sm:col-span-2 md:col-span-4" },
];

/** Photos pegged on the clothesline; `drop` follows the rope's sag. */
const clothesline = [
  { src: localImage("/images/gallery/kids-creative.webp", 0), alt: "Children enjoying creative activities", caption: "Little artists", rotate: "-5deg", drop: "md:translate-y-0" },
  { src: localImage("/images/gallery/kids-painting.webp", 1), alt: "Child enjoying painting activity", caption: "Paint party", rotate: "4deg", drop: "md:translate-y-8" },
  { src: localImage("/images/gallery/gallery-5.webp", 0), alt: "Children exploring in class", caption: "Big ideas", rotate: "-3deg", drop: "md:translate-y-8" },
  { src: localImage("/images/gallery/gallery-3.webp", 1), alt: "Children playing together", caption: "Play time", rotate: "5deg", drop: "md:translate-y-0" },
];

export default async function Page() {
  const albums = ((await getPublic<GalleryAlbum[]>("/gallery", 0)) ?? []).filter((album) => album.items.length > 0);
  const cover = albums[0]?.items[0];
  return (
    <PublicShell>
      <PageBanner
        theme="gallery"
        eyebrow="Our gallery"
        icon={Camera}
        title="Little moments."
        highlight="Lasting memories."
        description="A colourful glimpse into the creativity, friendship, celebration and joyful discovery that fill our school days."
        crumbs={[{ name: "Gallery", path: "/gallery" }]}
        image={{ src: cover?.imageUrl || localImage("/images/banners/gallery.webp", 1), alt: cover?.altText || cover?.caption || "Happy moments at Little Mahilam Preschool" }}
      />

      {/* ======================================================
          INTRO + MOMENT TYPES — film-strip card slider
      ====================================================== */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Kinds of moments"
            heading={
              <>
                <div className="eyebrow"><Sparkles className="h-4 w-4" /> Happy School Days</div>
                <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">
                  Every day gives us <span className="text-[#e2725b]">something to remember.</span>
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-slate-600">
                  Our gallery captures the smiles, activities, friendships and meaningful moments that make Little Mahilam a happy place to learn and grow.
                </p>
              </>
            }
          >
            {moments.map(({ icon: Icon, title, copy, image }, index) => (
              <article key={title} className="film-strip group h-full rounded-[14px] px-3 py-[22px] shadow-[0_20px_40px_-24px_rgba(0,0,0,.6)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 380px, 80vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl text-emerald-950 shadow-md" style={{ backgroundColor: TINTS[index % TINTS.length] }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="absolute bottom-2 right-3 font-mono text-[10px] font-bold tracking-widest text-[#f7c85b]/90">FRAME {String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="px-1 pb-1 pt-4 text-white">
                  <h3 className="font-display text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{copy}</p>
                </div>
              </article>
            ))}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          MEMORY WALL — albums or mosaic
      ====================================================== */}
      <section id="memory-wall" className="relative scroll-mt-24 overflow-hidden section-tint py-16 md:py-20">
        <div className="container-pad relative">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="eyebrow"><Camera className="h-4 w-4" /> Memory Wall</div>
              <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
                Smiles, stories and <span className="text-[#e2725b]">colourful memories.</span>
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">A small collection of everyday moments from learning, play, creativity and school celebrations.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-800 px-6 py-3 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-800 hover:text-white">
              Visit Our Campus <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {albums.length > 0 ? (
            <div className="mt-10"><GalleryAlbums albums={albums} /></div>
          ) : (
            <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[240px] md:grid-cols-4">
              {gallery.map((item, index) => (
                <div key={item.label} className={`group relative overflow-hidden rounded-[28px] shadow-lg ${item.className}`}>
                  <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-emerald-950 shadow-sm backdrop-blur">{item.label}</span>
                  </div>
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white shadow-lg" style={{ backgroundColor: TINTS[index % TINTS.length] }}>
                    {index % 3 === 0 ? <Star className="h-4 w-4 fill-white text-white" /> : index % 3 === 1 ? <Heart className="h-4 w-4 fill-white text-white" /> : <Sun className="h-4 w-4 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          CREATIVE MOMENTS — photos on a clothesline
      ====================================================== */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow"><Palette className="h-4 w-4" /> Creative Moments</span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">
              Tiny hands. <span className="text-[#e2725b]">Big imagination.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              Painting, crafting, storytelling and imaginative play give children the freedom to create, explore and express their ideas — building confidence, fine motor skills and individuality.
            </p>
          </div>

          <div className="relative mt-14">
            <svg aria-hidden viewBox="0 0 1000 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 hidden h-20 w-full md:block">
              <path d="M0 6 Q 500 90 1000 6" fill="none" stroke="#9c6d3f" strokeWidth="3" />
            </svg>
            <ul className="relative grid grid-cols-2 gap-x-4 gap-y-10 pt-4 md:grid-cols-4 md:gap-x-8 md:pt-6">
              {clothesline.map((photo) => (
                <li key={photo.caption} className={`flex flex-col items-center ${photo.drop}`}>
                  {/* Wooden peg */}
                  <span aria-hidden className="relative z-10 -mb-3 h-8 w-3.5 rounded-sm bg-[#d9a86c] shadow-md ring-1 ring-[#9c6d3f]/40">
                    <span className="absolute inset-x-0 top-3 h-0.5 bg-[#9c6d3f]/50" />
                  </span>
                  <figure className="w-full bg-white p-2.5 pb-10 shadow-[0_22px_40px_-22px_rgba(23,60,47,.5)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]" style={{ rotate: photo.rotate }}>
                    <div className="relative aspect-square overflow-hidden bg-[#fffaf0]">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 260px, 45vw" className="object-cover" />
                    </div>
                    <figcaption className="mt-2 text-center font-display text-base font-bold text-emerald-900">{photo.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 text-center">
            <Link href="/activities" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900">
              Explore Activities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          PRIVACY NOTE — pinned sticky note
      ====================================================== */}
      <section className="section-mint py-16">
        <div className="container-pad grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md -rotate-2 bg-[#fde98a] p-8 pt-10 shadow-[0_26px_40px_-24px_rgba(23,60,47,.55)]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 90% 100%, 0 100%)" }}>
            <Pin aria-hidden className="absolute left-1/2 top-2 h-7 w-7 -translate-x-1/2 rotate-12 fill-[#e2725b] text-[#b4533d]" />
            <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-900/70"><ShieldCheck className="h-4 w-4" /> Child Privacy</span>
            <p className="mt-3 font-display text-2xl font-bold leading-snug text-emerald-950">Children&apos;s privacy always comes first.</p>
            <p className="mt-3 leading-7 text-emerald-950/75">
              School photos are shared thoughtfully and only after appropriate review and approval. New gallery moments will be added as they become available.
            </p>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-emerald-950 sm:text-4xl">See the smiles <span className="text-[#e2725b]">in person.</span></h2>
            <p className="mx-auto mt-4 max-w-lg leading-8 text-slate-600 lg:mx-0">The best way to feel the happiness of our classrooms is to visit. Plan a campus visit and meet our team.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f7c85b] px-7 py-4 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:-translate-y-1 hover:bg-[#fbd779]">
              Plan a Campus Visit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </PublicShell>
  );
}
