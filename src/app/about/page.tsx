import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Brain,
  Heart,
  Instagram,
  Rainbow,
  Shapes,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageBanner } from "@/components/public/PageBanner";
import { CardSlider } from "@/components/public/CardSlider";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { ExploreMore } from "@/components/public/ExploreMore";
import { TestimonialsDynamic } from "@/components/public/TestimonialsDynamic";
import { getPublic, type Testimonial } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63"];

const founders = [
  {
    name: "Ramya Mahilam",
    role: "Founder",
    image: localImage("/images/about/ramya-mahilam.webp", 0),
    instagram: "https://www.instagram.com/ramya.mahilam/?hl=en",
    handle: "@ramya.mahilam",
  },
  {
    name: "Sneha Balumani",
    role: "Founder",
    image: localImage("/images/about/sneha-balumani.webp", 1),
    instagram: "https://www.instagram.com/snehabalumani/?hl=en",
    handle: "@snehabalumani",
  },
];

const pillars = [
  {
    icon: Heart,
    title: "Child-Centric",
    description:
      "Every child's pace, curiosity, emotions and unique voice shape the way we teach and support learning.",
  },
  {
    icon: Shapes,
    title: "Play-Way Learning",
    description:
      "Children discover ideas through games, stories, exploration, creativity and meaningful hands-on activities.",
  },
  {
    icon: Brain,
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

const storyStickers = [
  { label: "Learn through play", tint: "#f7c85b", rotate: "-3deg" },
  { label: "Explore with curiosity", tint: "#a7d9c1", rotate: "2deg" },
  { label: "Express with confidence", tint: "#ef9e8a", rotate: "2.5deg" },
  { label: "Grow with happiness", tint: "#8cb9e8", rotate: "-2deg" },
];

export const metadata: Metadata = pageMetadata({
  title: "About Us — Our Story, Founders & Philosophy",
  description: "Meet Little Mahilam Preschool on Kangayam Road, Tiruppur: our founders, our child-centric School of Happiness philosophy and the values behind our play-way learning.",
  path: "/about",
  keywords: ["about Little Mahilam", "preschool founders Tiruppur", "child-centric philosophy"],
});

export const revalidate = 0;

/** Washi-tape strip for pinning photos. */
function Tape({ className, color = "#f7c85b" }: { className: string; color?: string }) {
  return <span aria-hidden className={`absolute z-10 block h-7 w-24 opacity-80 shadow-sm ${className}`} style={{ backgroundColor: color, clipPath: "polygon(3% 0, 97% 4%, 100% 50%, 97% 96%, 3% 100%, 0 50%)" }} />;
}

export default async function Page() {
  const testimonials = await getPublic<Testimonial[]>("/testimonials", 0);
  return (
    <PublicShell>
      <PageBanner
        theme="about"
        eyebrow="About us"
        icon={Heart}
        title="A School of Happiness in"
        highlight="Tiruppur"
        description="A warm, joyful learning community created around childhood, curiosity and happiness."
        crumbs={[{ name: "About", path: "/about" }]}
        image={{ src: localImage("/images/banners/about.webp", 0), alt: "Happy children at Little Mahilam Preschool, Tiruppur" }}
      />

      {/* ======================================================
          OUR STORY — scrapbook polaroids
      ====================================================== */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="eyebrow"><Sparkles className="h-4 w-4" /> Our Story</div>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-bold leading-[1.12] text-emerald-950 sm:text-4xl lg:text-[46px]">
              A happy beginning for every <span className="text-[#e2725b]">little learner.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg font-bold leading-8 text-slate-700">
              Little Mahilam Preschool is envisioned as a <span className="text-emerald-700">School of Happiness</span> where children are encouraged to be curious, expressive and confident.
            </p>
            <p className="mt-4 max-w-xl leading-8 text-slate-600">
              We believe childhood should be filled with meaningful experiences, joyful discoveries and opportunities to explore the world through play.
            </p>
            <p className="mt-4 max-w-xl leading-8 text-slate-600">
              Our learning environment supports each child&apos;s individuality while helping them develop communication, creativity, independence, emotional confidence and a genuine love for learning.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {storyStickers.map(({ label, tint, rotate }) => (
                <li key={label} className="rounded-2xl border-2 border-dashed bg-white px-4 py-2.5 font-display text-sm font-bold text-emerald-950 shadow-sm" style={{ borderColor: tint, rotate }}>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto h-[460px] w-full max-w-[500px] sm:h-[520px]">
            {/* Doodles */}
            <Sun aria-hidden className="absolute -top-2 right-2 h-16 w-16 animate-[spin_30s_linear_infinite] fill-[#f7c85b]/40 text-[#f7c85b]" />
            <svg aria-hidden viewBox="0 0 120 60" className="absolute bottom-6 left-0 hidden h-14 w-28 text-[#e2725b] sm:block">
              <path d="M5 45 C 30 5, 70 5, 100 30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 7" strokeLinecap="round" />
              <path d="M92 20 L102 31 L88 35" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <figure className="absolute left-0 top-6 w-[56%] -rotate-6 bg-white p-3 pb-14 shadow-[0_24px_45px_-20px_rgba(23,60,47,.45)]">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fffaf0]">
                <Image src={localImage("/images/about/kids-learning.webp", 0)} alt="Children enjoying learning activities at Little Mahilam Preschool" fill sizes="(min-width: 1024px) 300px, 60vw" className="object-cover" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-3 text-center font-display text-lg font-bold text-emerald-900">Learning time!</figcaption>
            </figure>

            <figure className="absolute bottom-0 right-0 w-[50%] rotate-[5deg] bg-white p-3 pb-14 shadow-[0_24px_45px_-20px_rgba(23,60,47,.45)]">
              <Tape className="-top-3 right-6 rotate-[8deg]" color="#a7d9c1" />
              <div className="relative aspect-square overflow-hidden bg-[#fffaf0]">
                <Image src={localImage("/images/about/kids-playing.webp", 1)} alt="Children playing together" fill sizes="(min-width: 1024px) 280px, 55vw" className="object-cover" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 font-display text-lg font-bold text-emerald-900">
                Best friends <Heart className="h-4 w-4 fill-[#ef9e8a] text-[#ef9e8a]" />
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ======================================================
          VISION — dotted path of steps
      ====================================================== */}
      <section className="section-mint relative overflow-hidden py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow"><Rainbow className="h-4 w-4" /> Our Vision</div>
            <h2 className="mt-5 font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">
              More than a school. <span className="text-[#e2725b]">A place to be happy.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              We want children to look forward to coming to school every day — meeting friends, discovering new ideas and enjoying meaningful childhood experiences.
            </p>
          </div>

          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            <svg aria-hidden viewBox="0 0 1000 60" preserveAspectRatio="none" className="absolute inset-x-[16%] top-5 hidden h-14 w-[68%] md:block">
              <path d="M0 30 C 160 -10, 330 70, 500 30 S 840 -10, 1000 30" fill="none" stroke="#3f7a63" strokeOpacity=".35" strokeWidth="3" strokeDasharray="4 12" strokeLinecap="round" />
            </svg>
            {vision.map((item, i) => (
              <li key={item.title} className="relative text-center">
                <span className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-white font-display text-2xl font-bold text-emerald-950 shadow-lg" style={{ backgroundColor: TINTS[i], rotate: i === 1 ? "4deg" : "-4deg" }}>
                  {item.number}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-emerald-950">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-slate-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ======================================================
          FOUNDERS — lanyard ID badges
      ====================================================== */}
      <section id="founders" className="relative scroll-mt-24 overflow-hidden py-16 md:py-20">
        <div className="container-pad grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="eyebrow"><Heart className="h-4 w-4 fill-current" /> Meet Our Founders</div>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
              Built with a love for <span className="text-[#e2725b]">childhood &amp; learning.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-8 text-slate-600">
              Little Mahilam was envisioned by educators who believe that early childhood education should feel joyful, meaningful and respectful of every child&apos;s uniqueness.
            </p>
            <p className="mt-5 max-w-lg font-display text-lg font-bold leading-8 text-emerald-950">
              School of Happiness envisioned by{" "}
              <a href="https://www.instagram.com/ramya.mahilam/?hl=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#e2725b] underline decoration-[#e2725b]/30 underline-offset-4 transition hover:text-emerald-700"><Instagram className="h-4 w-4" />@ramya.mahilam</a>
              {" "}&amp;{" "}
              <a href="https://www.instagram.com/snehabalumani/?hl=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#e2725b] underline decoration-[#e2725b]/30 underline-offset-4 transition hover:text-emerald-700"><Instagram className="h-4 w-4" />@snehabalumani</a>
            </p>
            <blockquote className="relative mt-8 max-w-md rounded-[28px] rounded-bl-md bg-emerald-900 p-6 text-white shadow-lg">
              <span aria-hidden className="absolute -top-5 left-6 font-display text-7xl leading-none text-[#f7c85b]">“</span>
              <p className="mt-2 font-display text-lg font-bold leading-7">Every child deserves a place where learning begins with happiness.</p>
              <footer className="mt-5 flex items-center gap-3 border-t border-white/15 pt-4">
                <div className="flex -space-x-2">
                  {founders.map((founder) => (
                    <span key={founder.name} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-emerald-900 bg-white">
                      <Image src={founder.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                  ))}
                </div>
                <span className="text-sm font-bold text-white/75">Ramya Mahilam &amp; Sneha Balumani</span>
              </footer>
            </blockquote>
          </div>

          <div className="grid gap-10 pt-6 sm:grid-cols-2 sm:gap-6">
            {founders.map((founder, i) => (
              <div key={founder.name} className="relative flex flex-col items-center" style={{ rotate: i ? "3deg" : "-3deg" }}>
                {/* Lanyard + clip */}
                <span aria-hidden className="h-14 w-3 rounded-b-sm" style={{ background: `repeating-linear-gradient(45deg, ${TINTS[i]}, ${TINTS[i]} 6px, #fff 6px, #fff 9px)` }} />
                <span aria-hidden className="-mt-1 h-5 w-9 rounded-md border-4 border-slate-300 bg-slate-100" />
                <article className="-mt-1 w-full max-w-[280px] overflow-hidden rounded-[26px] bg-white text-center shadow-[0_24px_45px_-22px_rgba(23,60,47,.45)] ring-1 ring-emerald-950/5">
                  <div className="h-16" style={{ background: `linear-gradient(120deg, ${TINTS[i]}, ${TINTS[(i + 1) % TINTS.length]})` }} />
                  <div className="relative mx-auto -mt-12 h-28 w-28 overflow-hidden rounded-full border-[5px] border-white bg-[#fffaf0] shadow-md">
                    <Image src={founder.image} alt={`${founder.name}, founder of Little Mahilam Preschool`} fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="px-5 pb-6 pt-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-emerald-700">{founder.role}</p>
                    <h3 className="mt-1 font-display text-xl font-bold text-emerald-950">{founder.name}</h3>
                    <a href={founder.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${founder.name} on Instagram`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#e2725b] transition hover:text-emerald-700">
                      <Instagram className="h-4 w-4" />{founder.handle}
                    </a>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Creating meaningful early-learning experiences with care, creativity and happiness.</p>
                    <div aria-hidden className="mx-auto mt-4 flex w-fit gap-1">
                      {[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-[#f7c85b] text-[#f7c85b]" />)}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          PHILOSOPHY — dark card slider
      ====================================================== */}
      <section className="relative overflow-hidden mesh-dark py-16 text-white md:py-20">
        <div className="container-pad relative">
          <CardSlider
            label="Our philosophy"
            tone="dark"
            heading={
              <>
                <span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#f7c85b]">Our Philosophy</span>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl lg:text-5xl">How we bring happiness <span className="text-[#f7c85b]">to learning.</span></h2>
                <p className="mt-4 max-w-2xl leading-8 text-white/60">Our approach creates meaningful experiences that help children discover, participate, communicate and grow naturally.</p>
              </>
            }
          >
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="group relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-7 transition-colors hover:bg-white/[0.1]">
                  <span aria-hidden className="absolute -right-3 -top-6 font-display text-[110px] font-bold leading-none text-white/[0.06]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-[22px] text-emerald-950 transition-transform duration-300 group-hover:-rotate-6" style={{ backgroundColor: TINTS[i] }}>
                    <Icon className="h-8 w-8" />
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl font-bold">{pillar.title}</h3>
                  <p className="relative mt-3 leading-7 text-white/65">{pillar.description}</p>
                </article>
              );
            })}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          VALUES — photo with orbiting value badges
      ====================================================== */}
      <section className="overflow-hidden py-16 md:py-24">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow"><Star className="h-4 w-4 fill-[#f7c85b] text-[#f7c85b]" /> What Matters To Us</div>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
              Childhood comes first in <span className="text-[#e2725b]">everything we do.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-600">Our values guide our classrooms, activities and interactions with children and families every day.</p>
          </div>

          <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
            <ul className="grid gap-4 lg:order-1">
              {values.slice(0, 3).map((value, i) => (
                <li key={value} className="flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 font-bold text-emerald-950 shadow-sm ring-1 ring-emerald-950/5 lg:flex-row-reverse lg:pl-5 lg:pr-2 lg:text-right">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-emerald-950" style={{ backgroundColor: TINTS[i % 3] }}>{i + 1}</span>
                  <span className="flex-1">{value}</span>
                </li>
              ))}
            </ul>

            <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 lg:order-2">
              <span aria-hidden className="absolute -inset-5 animate-[spin_40s_linear_infinite] rounded-full border-[3px] border-dashed border-[#f7c85b]" />
              <span aria-hidden className="absolute -inset-10 rounded-full border border-emerald-900/10" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-8 border-white shadow-2xl">
                <Image src={localImage("/images/about/kids-group.webp", 0)} alt="Happy children learning and playing together" fill sizes="320px" className="object-cover" />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#e2725b] px-5 py-2 font-display text-sm font-bold text-white shadow-lg">Learn • Play • Grow</span>
            </div>

            <ul className="grid gap-4 lg:order-3">
              {values.slice(3).map((value, i) => (
                <li key={value} className="flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 font-bold text-emerald-950 shadow-sm ring-1 ring-emerald-950/5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-emerald-950" style={{ backgroundColor: TINTS[(i + 3) % 3] }}>{i + 4}</span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================
          CLOSING — invitation letter with stamp
      ====================================================== */}
      <section className="section-peach py-16">
        <div className="container-pad">
          {/* Airmail-striped envelope border */}
          <div className="relative mx-auto max-w-4xl rounded-[10px] p-2.5 shadow-[0_30px_60px_-30px_rgba(23,60,47,.45)]" style={{ backgroundImage: "repeating-linear-gradient(135deg, #e2725b 0 14px, #fff 14px 24px, #8cb9e8 24px 38px, #fff 38px 48px)" }}>
            <div className="relative rounded-[4px] bg-[#fffdf6] p-7 sm:p-10">
              {/* Stamp */}
              <div aria-hidden className="absolute right-5 top-5 flex h-20 w-16 rotate-6 flex-col items-center justify-center bg-[#f7c85b] text-emerald-950 sm:right-8 sm:top-8" style={{ outline: "3px dashed #fffdf6", outlineOffset: "-6px" }}>
                <Heart className="h-7 w-7 fill-[#e2725b] text-[#e2725b]" />
                <span className="mt-1 text-[8px] font-extrabold uppercase tracking-wider">Tiruppur</span>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-[.2em] text-emerald-700">You&apos;re invited</span>
              <h2 className="mt-3 max-w-xl pr-20 font-display text-2xl font-bold leading-tight text-emerald-950 sm:text-3xl">
                Come experience our <span className="text-[#e2725b]">School of Happiness.</span>
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">Discover our classrooms, activities, learning environment and the joyful experiences we create for young children.</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900">
                  Visit Our School <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="font-display text-lg font-bold text-emerald-900/70">— with love, Little Mahilam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExploreMore />

      <TestimonialsDynamic rows={testimonials ?? []} />

      <AdmissionsCta />
    </PublicShell>
  );
}
