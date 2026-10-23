import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { ProgramsDynamic } from "@/components/public/ProgramsDynamic";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type Program } from "@/lib/server-api";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

import { SectionHeading } from "@/components/about/motion";
import { SECTION_BG } from "@/components/about/Doodles";
import { ProgramsHero } from "@/components/programs/ProgramsHero";
import { ProgramsIntro } from "@/components/programs/ProgramsIntro";
import { ProgramExplorer } from "@/components/programs/ProgramExplorer";
import { SkillsOrbit } from "@/components/programs/SkillsOrbit";
import { PlayLearning } from "@/components/programs/PlayLearning";
import { ProgramFinder } from "@/components/programs/ProgramFinder";
import { STAGE_COLORS, type Stage } from "@/components/programs/stages";

export const metadata: Metadata = pageMetadata({
  title: "Programs — Play Group, Pre-KG, LKG, UKG & Grades 1–3",
  description: "Explore age-appropriate programs at Little Mahilam Preschool, Tiruppur: Play Group (2–3 yrs), Pre-KG, LKG, UKG and Grades 1–3 with play-way, child-centric learning.",
  path: "/programs",
  keywords: ["play group Tiruppur", "Pre-KG admission Tiruppur", "LKG UKG school Tiruppur", "kindergarten programs Tiruppur"],
});

const programJourney = [
  {
    slug: "play-group",
    title: "Play Group",
    age: "2 – 3 Years",
    minAge: 2,
    text: "A gentle beginning filled with sensory play, movement, songs and social interaction.",
    focus: ["Sensory play", "Movement", "Songs & rhymes", "Making friends"],
    image: localImage("/images/programs/play-group.webp", 0),
  },
  {
    slug: "pre-kg",
    title: "Pre-KG",
    age: "3 – 4 Years",
    minAge: 3,
    text: "Early concepts, language, creativity and confidence through playful learning experiences.",
    focus: ["Early concepts", "Language", "Creativity", "Confidence"],
    image: localImage("/images/programs/pre-kg.webp", 1),
  },
  {
    slug: "lkg-ukg",
    title: "LKG & UKG",
    age: "4 – 6 Years",
    minAge: 4,
    text: "Building strong foundations in literacy, numeracy, communication and independent learning.",
    focus: ["Literacy", "Numeracy", "Communication", "Independent learning"],
    image: localImage("/images/programs/kindergarten.webp", 0),
  },
  {
    slug: "grades-1-3",
    title: "Grades 1 – 3",
    age: "6+ Years",
    minAge: 6,
    text: "Structured academics combined with creativity, exploration, communication and problem-solving.",
    focus: ["Structured academics", "Exploration", "Communication", "Problem-solving"],
    image: localImage("/images/programs/primary.webp", 1),
  },
];

const stages: Stage[] = programJourney.map((stage, i) => ({ ...stage, ...STAGE_COLORS[i % STAGE_COLORS.length] }));

const benefits = [
  "Age-appropriate curriculum",
  "Play-based learning",
  "Individual attention",
  "Interactive classrooms",
  "Creative activities",
  "Confidence building",
  "Language development",
  "Social-emotional learning",
];

// Programs are managed from the admin area and should appear as soon as they
// are published. The API remains the source of truth, so do not cache this
// request in Next's data cache.
export const revalidate = 0;

export default async function Page() {
  const programs = await getPublic<Program[]>("/programs", 0);
  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "Programs", path: "/programs" }])} />
        <ProgramsHero
          stages={stages}
          images={[localImage("/images/banners/programs.webp", 0), localImage("/images/programs/kids-learning.webp", 1)]}
        />

        <ProgramsIntro />

        <ProgramExplorer stages={stages} />

        {/* ======================================================
            ALL PROGRAMS — CMS tickets
        ====================================================== */}
        <section id="all-programs" className="relative scroll-mt-24 overflow-hidden py-6 md:py-8" style={{ background: SECTION_BG.cream }}>
          <div className="container-pad relative">
            <SectionHeading
              eyebrow="Explore Programs"
              icon={<BookOpen className="h-4 w-4" />}
              title={<>Find the right program for <span className="text-little-pink-500">your little learner.</span></>}
              lead="Explore every available program, age group, learning focus and activity designed for children at Little Mahilam."
            />
            <div className="mt-6">
              <ProgramsDynamic programs={programs} />
            </div>
          </div>
        </section>

        <SkillsOrbit />
        <PlayLearning
          benefits={benefits}
          images={[localImage("/images/programs/learning-through-play.webp", 0), localImage("/images/programs/kids-art.webp", 1)]}
        />
        <ProgramFinder stages={stages} />

      <div className="[&>section]:!py-6 md:[&>section]:!py-8">
        <AdmissionsCta />
      </div>
    </PublicShell>
  );
}
