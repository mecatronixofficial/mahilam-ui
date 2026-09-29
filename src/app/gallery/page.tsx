import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Camera,
  Heart,
  Images,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageHero } from "@/components/public/PageHero";
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

export const revalidate = 300;

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63", "#8cb9e8", "#b79ce6"];

const moments = [
  {
    icon: Camera,
    title: "Learning in Action",
    copy: "Hands-on classroom experiences, discovery activities and everyday learning moments.",
  },
  {
    icon: Heart,
    title: "Happy Celebrations",
    copy: "Festivals, birthdays, special days and shared memories that bring everyone together.",
  },
  {
    icon: Images,
    title: "Creative Expression",
    copy: "Art, craft, music, stories, movement and all the wonderful ways children express themselves.",
  },
];

const gallery = [
  {
    src: localImage("/images/gallery/gallery-1.webp", 0),
    alt: "Children learning together",
    label: "Learning Time",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: localImage("/images/gallery/gallery-2.webp", 1),
    alt: "Children enjoying art and craft",
    label: "Creative Fun",
    className: "",
  },
  {
    src: localImage("/images/gallery/gallery-3.webp", 0),
    alt: "Children playing together",
    label: "Play Time",
    className: "",
  },
  {
    src: localImage("/images/gallery/gallery-4.webp", 1),
    alt: "Preschool celebration",
    label: "Celebration",
    className: "",
  },
  {
    src: localImage("/images/gallery/gallery-5.webp", 0),
    alt: "Children enjoying classroom activity",
    label: "Discovery",
    className: "",
  },
  {
    src: localImage("/images/gallery/gallery-6.webp", 1),
    alt: "Children during story time",
    label: "Story Time",
    className: "md:col-span-2",
  },
];

export default async function Page() {
  const albums = ((await getPublic<GalleryAlbum[]>("/gallery")) ?? []).filter((album) => album.items.length > 0);
  return (
    <PublicShell>
      {/* HERO */}

      <PageHero
        eyebrow="Our gallery"
        title="Little moments. Lasting memories."
        description="A colourful glimpse into the creativity, friendship, celebration and joyful discovery that fill our school days."
        crumbs={[{ name: "Gallery", path: "/gallery" }]}
      />

      {/* INTRO */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-yellow-200/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="container-pad relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <Sparkles className="h-4 w-4" />
              Happy School Days
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl">
              Every day gives us
              <span className="text-[#ef9e8a]"> something to remember.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              Our gallery captures the smiles, activities, friendships and
              meaningful moments that make Little Mahilam a happy place to
              learn and grow.
            </p>
          </div>
        </div>
      </section>

      {/* MOMENT TYPES */}

      <section className="py-16">
        <div className="container-pad">
          <div className="grid gap-5 md:grid-cols-3">
            {moments.map(({ icon: Icon, title, copy }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-[32px] glass-card p-7 shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10"
                  style={{
                    backgroundColor: TINTS[index % TINTS.length],
                  }}
                />

                <span
                  className="relative flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                  style={{
                    backgroundColor: `${TINTS[index % TINTS.length]}22`,
                    color: TINTS[index % TINTS.length],
                  }}
                >
                  <Icon className="h-7 w-7" />
                </span>

                <h2 className="relative mt-5 text-xl font-black text-emerald-950">
                  {title}
                </h2>

                <p className="relative mt-2 leading-7 text-slate-600">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        <div className="absolute left-[5%] top-14 hidden rotate-12 text-4xl text-yellow-300/50 lg:block">
          ★
        </div>

        <div className="absolute right-[6%] bottom-20 hidden -rotate-12 text-4xl text-pink-300/50 lg:block">
          ♥
        </div>

        <div className="container-pad relative">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">
                <Camera className="h-4 w-4" />
                Memory Wall
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                Smiles, stories and
                <span className="text-[#ef9e8a]"> colourful memories.</span>
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                A small collection of everyday moments from learning, play,
                creativity and school celebrations.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-800 px-6 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-800 hover:text-white"
            >
              Visit Our Campus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {albums.length > 0 ? (
            <div className="mt-10"><GalleryAlbums albums={albums} /></div>
          ) : (
          <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[240px]">
            {gallery.map((item, index) => (
              <div
                key={item.label}
                className={`group relative overflow-hidden shadow-lg ${item.className} ${
                  index % 4 === 0
                    ? "rounded-[50px_24px_50px_24px]"
                    : index % 4 === 1
                      ? "rounded-[24px_50px_24px_50px]"
                      : index % 4 === 2
                        ? "rounded-[50px_50px_24px_24px]"
                        : "rounded-[24px_24px_50px_50px]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-emerald-950 shadow-sm backdrop-blur">
                    {item.label}
                  </span>
                </div>

                <div
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white shadow-lg"
                  style={{
                    backgroundColor: TINTS[index % TINTS.length],
                  }}
                >
                  {index % 3 === 0 ? (
                    <Star className="h-4 w-4 fill-white text-white" />
                  ) : index % 3 === 1 ? (
                    <Heart className="h-4 w-4 fill-white text-white" />
                  ) : (
                    <Sun className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CREATIVE MOMENTS */}

      <section className="overflow-hidden section-mint py-16 md:py-20">
        <div className="container-pad">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-[560px] pb-10">
              <div className="relative h-[440px] overflow-hidden rounded-[90px_35px_90px_35px] border-[7px] border-white shadow-2xl">
                <Image
                  src={localImage("/images/gallery/kids-creative.webp", 0)}
                  alt="Children enjoying creative activities"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -bottom-2 right-0 h-40 w-40 overflow-hidden rounded-full border-[6px] border-white shadow-xl sm:h-48 sm:w-48">
                <Image
                  src={localImage("/images/gallery/kids-painting.webp", 1)}
                  alt="Child enjoying painting activity"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              <div className="absolute -left-2 top-12 rounded-[24px] bg-yellow-300 px-5 py-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <Palette className="h-6 w-6 text-yellow-800" />

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                      Creative
                    </div>

                    <div className="font-black text-slate-900">
                      Little Artists
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="eyebrow">
                <Palette className="h-4 w-4" />
                Creative Moments
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">
                Tiny hands.
                <span className="text-[#ef9e8a]"> Big imagination.</span>
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Painting, crafting, storytelling and imaginative play give
                children the freedom to create, explore and express their ideas.
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                These creative moments are an important part of their learning,
                helping build confidence, fine motor skills and individuality.
              </p>

              <Link
                href="/activities"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900"
              >
                Explore Activities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY NOTE */}

      <section className="section-tint py-14 md:py-16">
        <div className="container-pad">
          <div className="relative overflow-hidden rounded-[40px] mesh-dark grain px-7 py-10 text-white md:px-12 md:py-12">
            <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-yellow-300/10" />

            <div className="absolute -bottom-16 right-28 h-44 w-44 rounded-full bg-pink-300/10" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10">
                <ShieldCheck className="h-8 w-8 text-yellow-300" />
              </span>

              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  Child Privacy
                </span>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Children's privacy always comes first.
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-white/60">
                  School photos are shared thoughtfully and only after
                  appropriate review and approval. New gallery moments will be
                  added as they become available.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-6 py-3.5 text-sm font-black text-emerald-950 transition hover:bg-yellow-200"
              >
                Plan a Campus Visit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </PublicShell>
  );
}