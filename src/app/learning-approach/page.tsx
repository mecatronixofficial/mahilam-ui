import type { Metadata } from "next";

import { PublicShell } from "@/components/public/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { localImage } from "@/lib/images";
import { isOptimizable } from "@/lib/media";
import { getPublic } from "@/lib/server-api";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import type { Photo } from "@/components/public/PageKit";

import { SECTION_BG, Wave } from "@/components/about/Doodles";
import { LearningHero } from "@/components/learning/LearningHero";
import { Pillars } from "@/components/learning/Pillars";
import { HowChildrenLearn } from "@/components/learning/HowChildrenLearn";
import { PlayStory } from "@/components/learning/PlayStory";
import { FinalCta, HappyDay, ParentTrust, ShineBento } from "@/components/learning/Sections";

export const metadata: Metadata = pageMetadata({ title: "Learning Approach — Play-Way & Multiple Intelligence", description: "How Little Mahilam teaches: child-centric, play-way learning built on multiple intelligences, language, social-emotional growth and curiosity-led discovery.", path: "/learning-approach", keywords: ["play-way method preschool", "multiple intelligence preschool Tiruppur", "child-centric learning"] });

/** Section backgrounds, top to bottom; each wave edge blends into the next one. */
const BG = {
  pillars: SECTION_BG.cream,
  how: SECTION_BG.sky,
  day: SECTION_BG.mint,
  play: SECTION_BG.peach,
  shine: SECTION_BG.cream,
  trust: "#ffffff",
  cta: SECTION_BG.blush,
};

type CmsPhoto = { slot: string; imageUrl: string; altText?: string | null };

// Photos are managed in Admin → Learning Approach and should show as soon as they are saved.
export const revalidate = 0;

export default async function Page() {
  const cms = new Map((await getPublic<CmsPhoto[]>("/learning-photos", 0) ?? []).map((p) => [p.slot, p]));

  /** An uploaded photo for the slot if there is one; otherwise the local file, or a real campus photo. */
  const photo = (slot: string, file: string, fallback: number, alt: string): Photo => {
    const uploaded = cms.get(slot);
    if (uploaded?.imageUrl) return { src: uploaded.imageUrl, alt: uploaded.altText || alt, unoptimized: !isOptimizable(uploaded.imageUrl) };
    return { src: localImage(file, fallback), alt };
  };

  const heroImages: [Photo, Photo] = [
    photo("hero-main", "/images/learning-approach/hero-classroom.webp", 0, "Children discovering and learning together at Little Mahilam Preschool"),
    photo("hero-small", "/images/learning-approach/hero-child.webp", 1, "A happy child exploring a preschool activity"),
  ];
  const scenes = [
    photo("play-hands-on", "/images/learning-approach/play-hands-on.webp", 0, "Children learning with hands-on materials"),
    photo("play-together", "/images/learning-approach/play-together.webp", 1, "Children playing and learning together"),
    photo("play-imagination", "/images/learning-approach/play-imagination.webp", 0, "Children using their imagination in pretend play"),
  ];

  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Learning Approach", path: "/learning-approach" }])} />
      <div className="overflow-x-clip">
        <LearningHero images={heroImages} nextBg={BG.pillars} />
        <Pillars nextBg={BG.how} />
        <HowChildrenLearn bg={BG.how} nextBg={BG.day} />
        <HappyDay bg={BG.day} nextBg={BG.play} />

        <section className="relative overflow-hidden pb-12 pt-8 md:pb-14 md:pt-10" style={{ background: BG.play }}>
          <div className="container-pad relative">
            <PlayStory scenes={scenes} />
          </div>
          <Wave color={BG.shine} flip className="absolute inset-x-0 bottom-0 h-6" />
        </section>

        <ShineBento bg={BG.shine} nextBg={BG.trust} />
        <ParentTrust bg={BG.trust} nextBg={BG.cta} />
        <FinalCta bg={BG.cta} />
      </div>
    </PublicShell>
  );
}
