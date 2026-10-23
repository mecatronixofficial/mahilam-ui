import { schoolAlbums } from "@/lib/school-photos";
import type { Metadata } from "next";
import { Camera, Filter, Map as MapIcon, Sun } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type GalleryAlbum } from "@/lib/server-api";
import { existingImage } from "@/lib/images";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

import { SECTION_BG, Wave } from "@/components/about/Doodles";
import { SectionHeading } from "@/components/about/motion";
import { Appear } from "@/components/animations/Appear";
import { ActivitiesHero } from "@/components/activities/ActivitiesHero";
import { ActivityZones } from "@/components/activities/ActivityZones";
import { ActivityExplorer } from "@/components/activities/ActivityExplorer";
import { FunDayPath } from "@/components/activities/FunDayPath";
import { MomentsGallery } from "@/components/activities/MomentsGallery";
import { LearningMap } from "@/components/activities/LearningMap";
import { AdventureCta } from "@/components/activities/AdventureCta";
import { mergeActivities, type CmsActivity } from "@/components/activities/data";

// Activities are edited in the CMS and need to be visible immediately after
// publishing instead of waiting for the general CMS revalidation window.
export const revalidate = 0;
export const metadata: Metadata = pageMetadata({ title: "Activities — Art, Music, Yoga & Play", description: "Art and craft, stories and phonics, music, yoga, role play and discovery games — the daily activities that help children at Little Mahilam, Tiruppur learn and grow.", path: "/activities", keywords: ["preschool activities Tiruppur", "kids art and music classes Tiruppur"] });

/** Section backgrounds, top to bottom; each wave edge blends into the next. */
const BG = { zones: SECTION_BG.mint, explorer: SECTION_BG.cream, day: SECTION_BG.butter, gallery: SECTION_BG.blush, map: SECTION_BG.cream };

export default async function Page() {
  const [cms, albums] = await Promise.all([getPublic<CmsActivity[]>("/activities", 0), getPublic<GalleryAlbum[]>("/gallery", 0)]);
  // A photo appears only when it's real: an admin upload, or a file dropped in /public/images/activities/<id>.webp.
  const activities = mergeActivities(cms).map((a) => ({ ...a, image: a.image || existingImage(`/images/activities/${a.id}.webp`) }));

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Activities", path: "/activities" }])} />
      <div className="overflow-x-clip">
        <ActivitiesHero nextBg={BG.zones} />
        <ActivityZones activities={activities} bg={BG.zones} nextBg={BG.explorer} />

        <section id="explorer" className="relative scroll-mt-24 overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BG.explorer }}>
          <div className="container-pad relative">
            <SectionHeading eyebrow="Activity Explorer" icon={<Filter className="h-4 w-4 text-little-coral-500" />} title={<>What does your child <span className="text-little-green-700">love to do?</span></>} lead="Pick a kind of play to see the activities that match." />
            <Appear d={0.1} className="mt-6"><ActivityExplorer activities={activities} /></Appear>
          </div>
          <Wave color={BG.day} className="absolute inset-x-0 bottom-0 h-6" />
        </section>

        <section className="relative overflow-hidden pb-12 pt-6 md:pb-14 md:pt-8" style={{ background: BG.day }}>
          <div className="container-pad relative">
            <SectionHeading eyebrow="A Day Filled With Fun" icon={<Sun className="h-4 w-4 text-little-yellow-600" />} title={<>Slide through a day of <span className="text-little-coral-500">happy moments.</span></>} lead="Every day is different — here's a taste of the moments children enjoy with us, not a fixed timetable." />
            <div className="mt-8"><FunDayPath /></div>
          </div>
          <Wave color={BG.gallery} flip className="absolute inset-x-0 bottom-0 h-6" />
        </section>

        <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BG.gallery }}>
          <div className="container-pad relative">
            <SectionHeading eyebrow="Little Moments" icon={<Camera className="h-4 w-4 text-little-pink-500" />} title={<>Snapshots from <span className="text-little-pink-500">our busy days.</span></>} lead="Real photos from our classrooms and celebrations. Tap any photo to see it larger." />
            <div className="mt-6"><MomentsGallery albums={(albums?.length ? albums : schoolAlbums()).filter((a) => a.items?.length)} /></div>
          </div>
          <Wave color={BG.map} className="absolute inset-x-0 bottom-0 h-6" />
        </section>

        <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8" style={{ background: BG.map }}>
          <div className="container-pad relative">
            <SectionHeading eyebrow="Why Activities Matter" icon={<MapIcon className="h-4 w-4 text-little-blue-600" />} title={<>A map of everything <span style={{ color: BRAND.coral[500] }}>play helps grow.</span></>} lead="Every game and project quietly builds skills for school and for life. Explore the map to see how." />
            <Appear d={0.1} className="mt-8"><LearningMap /></Appear>
          </div>
        </section>

        <AdventureCta />
      </div>
    </PublicShell>
  );
}
