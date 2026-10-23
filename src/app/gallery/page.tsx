import { schoolAlbums } from "@/lib/school-photos";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Pin, ShieldCheck } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { GalleryAlbums } from "@/components/public/GalleryAlbums";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type GalleryAlbum } from "@/lib/server-api";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

import { Appear, SectionHeading } from "@/components/about/motion";
import { SECTION_BG, StarDoodle, Wave } from "@/components/about/Doodles";
import { GalleryHero, type HeroPhoto } from "@/components/gallery/GalleryHero";
import { MomentFrames } from "@/components/gallery/MomentFrames";
import { Clothesline, type LinePhoto } from "@/components/gallery/Clothesline";

export const metadata: Metadata = pageMetadata({
  title: "Photo Gallery — Life at Our Preschool",
  description: "Photos of learning, art, play and celebrations at Little Mahilam Preschool, Kangayam Road, Tiruppur. See our classrooms and happy school moments.",
  path: "/gallery",
  keywords: ["preschool photos Tiruppur", "play school gallery Tiruppur"],
});

export const revalidate = 0;

const moments = [
  {
    title: "Learning in Action",
    copy: "Hands-on classroom experiences, discovery activities and everyday learning moments.",
    image: localImage("/images/gallery/gallery-1.webp", 0),
  },
  {
    title: "Happy Celebrations",
    copy: "Festivals, birthdays, special days and shared memories that bring everyone together.",
    image: localImage("/images/gallery/gallery-4.webp", 1),
  },
  {
    title: "Creative Expression",
    copy: "Art, craft, music, stories, movement and all the wonderful ways children express themselves.",
    image: localImage("/images/gallery/gallery-2.webp", 0),
  },
];

/** Shown on the memory wall until albums are published from the admin area. */
const gallery = [
  { src: localImage("/images/gallery/gallery-1.webp", 0), alt: "Children learning together", label: "Learning Time" },
  { src: localImage("/images/gallery/gallery-2.webp", 1), alt: "Children enjoying art and craft", label: "Creative Fun" },
  { src: localImage("/images/gallery/gallery-3.webp", 0), alt: "Children playing together", label: "Play Time" },
  { src: localImage("/images/gallery/gallery-4.webp", 1), alt: "Preschool celebration", label: "Celebration" },
  { src: localImage("/images/gallery/gallery-5.webp", 0), alt: "Children enjoying classroom activity", label: "Discovery" },
  { src: localImage("/images/gallery/gallery-6.webp", 1), alt: "Children during story time", label: "Story Time" },
];

/** Photos pegged on the clothesline; `drop` follows the rope's sag. */
const clothesline: LinePhoto[] = [
  { src: localImage("/images/gallery/kids-creative.webp", 0), alt: "Children enjoying creative activities", caption: "Little artists", rotate: -5, drop: false },
  { src: localImage("/images/gallery/kids-painting.webp", 1), alt: "Child enjoying painting activity", caption: "Paint party", rotate: 4, drop: true },
  { src: localImage("/images/gallery/gallery-5.webp", 0), alt: "Children exploring in class", caption: "Big ideas", rotate: -3, drop: true },
  { src: localImage("/images/gallery/gallery-3.webp", 1), alt: "Children playing together", caption: "Play time", rotate: 5, drop: false },
];

export default async function Page() {
  const publishedAlbums = ((await getPublic<GalleryAlbum[]>("/gallery", 0)) ?? []).filter((album) => album.items.length > 0);
  const albums = publishedAlbums.length ? publishedAlbums : schoolAlbums();
  const fallbackAlbum: GalleryAlbum = {
    id: "moments",
    title: "School moments",
    slug: "moments",
    items: gallery.map((photo, i) => ({ id: `moment-${i}`, imageUrl: photo.src, caption: photo.label, altText: photo.alt })),
  };

  // Hero polaroids: the latest published photos, or the gallery's own pictures.
  const published = albums.flatMap((album) => album.items.map((item) => ({ src: item.imageUrl, alt: item.altText || item.caption || album.title, caption: item.caption || album.title })));
  const heroPhotos: HeroPhoto[] = (published.length >= 3 ? published : [
    { src: localImage("/images/banners/gallery.webp", 1), alt: "Happy moments at Little Mahilam Preschool", caption: "Happy days" },
    ...gallery.slice(0, 3).map((photo) => ({ src: photo.src, alt: photo.alt, caption: photo.label })),
  ]).slice(0, 5);

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Gallery", path: "/gallery" }])} />
        <GalleryHero photos={heroPhotos} />
        <MomentFrames moments={moments} />

        {/* ======================================================
            MEMORY WALL — albums (or the school's own photos)
        ====================================================== */}
        <section id="memory-wall" className="relative scroll-mt-24 overflow-hidden py-8 md:py-10" style={{ background: SECTION_BG.butter }}>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <StarDoodle className="absolute left-[5%] top-16 w-6 animate-twinkle" />
            <StarDoodle color="#f9bbd9" className="absolute right-[6%] top-28 w-5 animate-twinkle [animation-delay:-1.5s]" />
          </div>
          <div className="container-pad relative">
            <SectionHeading
              eyebrow="Memory Wall"
              icon={<Camera className="h-4 w-4" />}
              title={<>Smiles, stories and <span className="text-little-pink-500">colourful memories.</span></>}
              lead="A small collection of everyday moments from learning, play, creativity and school celebrations."
            />
            <div className="mt-8">
              <GalleryAlbums albums={albums.length ? albums : [fallbackAlbum]} />
            </div>
            <div className="mt-6 text-center">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-little-green-800 px-6 py-3 text-sm font-extrabold text-little-green-800 transition hover:-translate-y-0.5 hover:bg-little-green-800 hover:text-white">
                Visit Our Campus <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <Wave color={SECTION_BG.sky} flip className="absolute inset-x-0 bottom-0 h-6" />
        </section>

        <Clothesline photos={clothesline} />

        {/* ======================================================
            PRIVACY NOTE — sticky note that peels on hover
        ====================================================== */}
        <section className="py-8 md:py-10" style={{ background: SECTION_BG.mint }}>
          <div className="container-pad grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <Appear className="relative mx-auto w-full max-w-md">
              <div
                className="group relative -rotate-2 bg-little-yellow-200 p-8 pt-10 shadow-[0_26px_40px_-24px_rgba(36,68,32,.55)] transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.02]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 90% 100%, 0 100%)" }}
              >
                <Pin aria-hidden className="absolute left-1/2 top-2 h-7 w-7 -translate-x-1/2 rotate-12 fill-little-coral-500 text-little-coral-600 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0" />
                {/* Folded corner grows as the note "peels" */}
                <span aria-hidden className="absolute bottom-0 right-0 h-[12%] w-[10%] bg-little-yellow-300 transition-all duration-500 group-hover:h-[18%] group-hover:w-[15%]" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-little-green-900/70"><ShieldCheck className="h-4 w-4" /> Child Privacy</span>
                <p className="mt-3 font-display text-2xl font-bold leading-snug text-little-green-950">Children&apos;s privacy always comes first.</p>
                <p className="mt-3 leading-7 text-little-green-950/75">
                  School photos are shared thoughtfully and only after appropriate review and approval. New gallery moments will be added as they become available.
                </p>
              </div>
            </Appear>
            <Appear delay={0.1} className="text-center lg:text-left">
              <h2 className="font-display text-3xl font-bold text-little-green-950 sm:text-4xl">See the smiles <span className="text-little-pink-500">in person.</span></h2>
              <p className="mx-auto mt-4 max-w-lg leading-8 text-little-neutral-600 lg:mx-0">The best way to feel the happiness of our classrooms is to visit. Plan a campus visit and meet our team.</p>
              <Link href="/contact" className="group mt-7 inline-flex items-center gap-2 rounded-full bg-little-yellow-400 px-7 py-4 text-sm font-extrabold text-little-green-950 shadow-lg transition hover:-translate-y-1 hover:bg-little-yellow-300">
                Plan a Campus Visit <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Appear>
          </div>
        </section>

      <AdmissionsCta />
    </PublicShell>
  );
}
