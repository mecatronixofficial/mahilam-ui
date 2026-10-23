import { pageContent, contentText, contentImage } from "@/lib/page-content";
import type { Metadata } from "next";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage, existingImage } from "@/lib/images";
import { ExploreMore } from "@/components/public/ExploreMore";
import { TestimonialsDynamic } from "@/components/public/TestimonialsDynamic";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type Testimonial } from "@/lib/server-api";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";


import { AboutHero } from "@/components/about/AboutHero";
import { StoryBook } from "@/components/about/StoryBook";
import { AdventurePath } from "@/components/about/AdventurePath";
import { FounderCards } from "@/components/about/FounderCards";
import { LearningPlayground } from "@/components/about/LearningPlayground";
import { HappyDayTimeline } from "@/components/about/HappyDayTimeline";
import { BalloonValues } from "@/components/about/BalloonValues";
import { MemoryMatchGame } from "@/components/about/MemoryMatchGame";
import { SchoolGateCTA } from "@/components/about/SchoolGateCTA";
import { SECTION_BG, Wave } from "@/components/about/Doodles";

const founders = [
  {
    name: "Ramya Mahilam",
    role: "Founder",
    image: existingImage("/images/about/ramya-mahilam.webp") || "",
    instagram: "https://www.instagram.com/ramya.mahilam/?hl=en",
    handle: "@ramya.mahilam",
  },
  {
    name: "Sneha Balumani",
    role: "Founder",
    image: existingImage("/images/about/sneha-balumani.webp") || "",
    instagram: "https://www.instagram.com/snehabalumani/?hl=en",
    handle: "@snehabalumani",
  },
];

const pillars = [
  {
    title: "Child-Centric",
    description:
      "Every child's pace, curiosity, emotions and unique voice shape the way we teach and support learning.",
  },
  {
    title: "Play-Way Learning",
    description:
      "Children discover ideas through games, stories, exploration, creativity and meaningful hands-on activities.",
  },
  {
    title: "Multiple Intelligence",
    description:
      "We nurture different strengths including language, movement, creativity, music, logic and social intelligence.",
  },
];

const vision = [
  {
    number: "01",
    title: "Happy Children",
    text: "Creating a warm environment where children feel comfortable, valued and excited to participate.",
  },
  {
    number: "02",
    title: "Happy Learning",
    text: "Making learning enjoyable through play, stories, movement, creativity and exploration.",
  },
  {
    number: "03",
    title: "Happy Growth",
    text: "Supporting emotional, social, physical and intellectual development together.",
  },
];

const values = [
  "Learning with happiness",
  "Freedom to explore",
  "Confidence to express",
  "Respect for every child",
  "Creativity and curiosity",
  "Strong parent partnership",
];

export const metadata: Metadata = pageMetadata({
  title: "About Us — Our Story, Founders & Philosophy",
  description: "Meet Little Mahilam Preschool on Kangayam Road, Tiruppur: our founders, our child-centric School of Happiness philosophy and the values behind our play-way learning.",
  path: "/about",
  keywords: ["about Little Mahilam", "preschool founders Tiruppur", "child-centric philosophy"],
});

export const revalidate = 0;

/**
 * About page as the "Little Mahilam Learning World":
 * Hero → Story Book → Adventure Vision → Founders → Learning Playground → Happy Day → Balloon Values
 * → Parent voices → Memory Match → School Gate CTA.
 */
export default async function Page() {
  const [testimonials, settings] = await Promise.all([getPublic<Testimonial[]>("/testimonials", 0), getPublic<Record<string, unknown>>("/settings", 0)]);
  const content = pageContent(settings, "about");
  return (
    <PublicShell>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
        <AboutHero content={content.hero}
          image={localImage("/images/banners/about.webp", 0)}
          imageAlt="Happy children at Little Mahilam Preschool, Tiruppur"
          secondImage={localImage("/images/about/kids-playing.webp", 1)}
        />
        <StoryBook content={content.story} image={localImage("/images/about/kids-learning.webp", 0)} />
        <AdventurePath content={content.vision} vision={vision.map((item, i) => ({ ...item, title: contentText(content.vision, `title${i}`) || item.title, text: contentText(content.vision, `text${i}`) || item.text }))} />
        <FounderCards content={content.founders} founders={founders.map((founder, i) => ({ ...founder, name: contentText(content.founders, `name${i}`) || founder.name, role: contentText(content.founders, `role${i}`) || founder.role, image: contentImage(content.founders, `founder${i}`, founder.image, founder.name).src, imageAlt: contentImage(content.founders, `founder${i}`, founder.image, `${founder.name}, founder of Little Mahilam Preschool`).alt }))} />
        <LearningPlayground content={content.philosophy} pillars={pillars.map((item, i) => ({ ...item, title: contentText(content.philosophy, `title${i}`) || item.title, description: contentText(content.philosophy, `text${i}`) || item.description }))} />
        <HappyDayTimeline content={content.day} />
        <BalloonValues content={content.values} values={values} image={localImage("/images/about/kids-group.webp", 0)} />

        <div className="relative pb-14" style={{ background: SECTION_BG.cream }}>
          <TestimonialsDynamic content={content.testimonials} rows={testimonials ?? []} />
          <Wave color={SECTION_BG.mint} className="absolute inset-x-0 bottom-0 h-14" />
        </div>

        <MemoryMatchGame content={content.game} />
        <SchoolGateCTA title={contentText(content.invitation, "heading")} eyebrow={contentText(content.invitation, "eyebrow")} text={contentText(content.invitation, "description")} />

      <ExploreMore content={content.explore} />
    </PublicShell>
  );
}
