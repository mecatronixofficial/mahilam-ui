import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Camera, Compass, School } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type GalleryAlbum } from "@/lib/server-api";
import { existingImage, localImage } from "@/lib/images";
import { isOptimizable } from "@/lib/media";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import type { Photo } from "@/components/public/PageKit";

import { SectionHeading } from "@/components/about/motion";
import { Appear } from "@/components/animations/Appear";
import { buildSpaces, campusPhotos, type CmsFacility } from "@/components/facilities/data";
import { FacilitiesHero, SafeCaring, SpacesEditorial, VisitSchool } from "@/components/facilities/FacilitiesSections";
import { CampusExplorer } from "@/components/facilities/CampusExplorer";
import { PhotoTour } from "@/components/facilities/PhotoTour";
import { SpacesInspire } from "@/components/facilities/SpacesInspire";

// Facilities are edited in the CMS and should show as soon as they're published.
export const revalidate = 0;
export const metadata: Metadata = pageMetadata({ title: "Facilities — A Safe, Bright Campus", description: "Welcoming classrooms, play spaces, reading corners and child-friendly design at Little Mahilam Preschool on Kangayam Road, Tiruppur. Book a campus visit.", path: "/facilities", keywords: ["preschool campus Tiruppur", "safe play school Tiruppur"] });

/** Sections overlap like stacked sheets of paper — a calmer transition that keeps attention on the photos. */
function Sheet({ id, bg, children, last = false }: { id?: string; bg: string; children: ReactNode; last?: boolean }) {
  return (
    <section id={id} className={`relative -mt-10 scroll-mt-24 rounded-t-[40px] pt-10 shadow-[0_-20px_40px_-36px_rgba(36,68,32,.35)] sm:rounded-t-[56px] md:pt-12 ${last ? "pb-10 md:pb-12" : "pb-16 md:pb-20"}`} style={{ background: bg }}>
      <div className="container-pad relative">{children}</div>
    </section>
  );
}

export default async function Page() {
  const [cms, albums] = await Promise.all([getPublic<CmsFacility[]>("/facilities", 0), getPublic<GalleryAlbum[]>("/gallery", 0)]);
  const published = (albums ?? []).filter((a) => a.items?.length);
  const spaces = buildSpaces(cms, published, (id) => existingImage(`/images/facilities/${id}.webp`));

  // Photo tour: campus albums plus every space photo, without duplicates.
  const seen = new Set<string>();
  const tour = [...spaces.flatMap((s) => s.photos.map((p) => ({ ...p, caption: p.caption || s.title }))), ...campusPhotos(published)].filter((p) => !seen.has(p.src) && seen.add(p.src));

  // Hero: real space photos first; otherwise the school's own campus photos.
  const toPhoto = (p: { src: string; alt: string }): Photo => ({ src: p.src, alt: p.alt, unoptimized: !isOptimizable(p.src) });
  const hero: [Photo, Photo | null] = tour.length
    ? [toPhoto(tour[0]), tour[1] ? toPhoto(tour[1]) : null]
    : [{ src: localImage("/images/facilities/hero.webp", 0), alt: "Children at Little Mahilam Preschool, Tiruppur" }, { src: localImage("/images/facilities/hero-2.webp", 1), alt: "A happy child at Little Mahilam Preschool" }];

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Facilities", path: "/facilities" }])} />
      <div className="overflow-x-clip">
        <FacilitiesHero photos={hero} />

        <Sheet id="spaces" bg="#ffffff">
          <SectionHeading eyebrow="Explore Our School" icon={<School className="h-4 w-4 text-little-green-700" />} title={<>Spaces made for <span className="text-little-green-700">little learners.</span></>} lead="A closer look at the places where our children learn, play and grow every day." />
          <div className="mt-10"><SpacesEditorial spaces={spaces} /></div>
        </Sheet>

        <Sheet bg={BRAND.neutral[50]}>
          <SectionHeading eyebrow="Campus Explorer" icon={<Compass className="h-4 w-4 text-little-coral-500" />} title={<>Step inside, <span className="text-little-coral-500">one space at a time.</span></>} lead="Choose a space to see its photos and what children get up to there." />
          <Appear d={0.1} className="mt-8"><CampusExplorer spaces={spaces} /></Appear>
        </Sheet>

        <Sheet bg="#ffffff">
          <SafeCaring photo={hero[1] ?? hero[0]} />
        </Sheet>

        <Sheet bg={BRAND.cream.base}>
          <SectionHeading eyebrow="Photo Tour" icon={<Camera className="h-4 w-4 text-little-pink-500" />} title={<>A walk around <span className="text-little-pink-500">our happy place.</span></>} lead="Real photos of our campus. Tap any photo to view it full screen; use the arrow keys to move between them." />
          <div className="mt-8"><PhotoTour photos={tour} /></div>
        </Sheet>

        <Sheet bg="#ffffff">
          <SpacesInspire />
        </Sheet>

        <Sheet bg={BRAND.green[50]} last>
          <VisitSchool />
        </Sheet>
      </div>
    </PublicShell>
  );
}
