import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Heart,
  Rainbow,
  Shapes,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageHero } from "@/components/public/PageHero";
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
  },
  {
    name: "Sneha Balumani",
    role: "Founder",
    image: localImage("/images/about/sneha-balumani.webp", 1),
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

export const revalidate = 300;

export default async function Page() {
  const testimonials = await getPublic<Testimonial[]>("/testimonials");
  return (
    <PublicShell>
      {/* ======================================================
          HERO
      ====================================================== */}

      <PageHero
        eyebrow="About us"
        title="A School of Happiness in Tiruppur."
        description="A warm, joyful learning community created around childhood, curiosity and happiness."
        crumbs={[{ name: "About", path: "/about" }]}
      />

      {/* ======================================================
          OUR STORY
      ====================================================== */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        {/* Decorative shapes */}
        <div className="absolute -left-20 top-16 h-52 w-52 rounded-full bg-yellow-200/30 blur-3xl" />

        <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="absolute left-[7%] top-10 hidden rotate-12 text-4xl text-yellow-300/60 md:block">
          ★
        </div>

        <div className="absolute right-[6%] top-20 hidden -rotate-12 text-4xl text-pink-300/60 md:block">
          ♥
        </div>

        <div className="container-pad relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* ================= IMAGE ================= */}

            <div className="relative mx-auto w-full max-w-[590px] pb-14">
              <div className="relative h-[420px] overflow-hidden rounded-[60px_25px_70px_30px] border-[7px] border-white shadow-[0_25px_70px_rgba(15,23,42,0.14)] sm:h-[520px]">
                <Image
                  src={localImage("/images/about/kids-learning.webp", 0)}
                  alt="Children enjoying learning activities at Little Mahilam Preschool"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
              </div>

              {/* Small image */}

              <div className="absolute -bottom-2 right-0 h-40 w-40 overflow-hidden rounded-[35px] border-[6px] border-white shadow-xl sm:-right-5 sm:h-52 sm:w-52">
                <Image
                  src={localImage("/images/about/kids-playing.webp", 1)}
                  alt="Children playing together"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Floating School of Happiness */}

              <div className="absolute -left-2 top-12 rounded-[25px] bg-yellow-300 px-4 py-4 shadow-xl sm:-left-8 sm:px-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                    <Sun className="h-6 w-6 text-yellow-500" />
                  </span>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Welcome to
                    </div>

                    <div className="mt-0.5 font-black text-slate-900">
                      School of Happiness
                    </div>
                  </div>
                </div>
              </div>

              {/* Star */}

              <span className="absolute -right-3 top-8 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-[#ef9e8a] shadow-lg">
                <Star className="h-6 w-6 fill-white text-white" />
              </span>
            </div>

            {/* ================= CONTENT ================= */}

            <div>
              <div className="eyebrow">
                <Sparkles className="h-4 w-4" />
                Our Story
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-black leading-[1.15] tracking-tight text-emerald-950 sm:text-4xl lg:text-[46px]">
                A happy beginning for every
                <span className="text-[#ef9e8a]"> little learner.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg font-bold leading-8 text-slate-700">
                Little Mahilam Preschool is envisioned as a{" "}
                <span className="text-emerald-700">
                  School of Happiness
                </span>{" "}
                where children are encouraged to be curious, expressive and
                confident.
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                We believe childhood should be filled with meaningful
                experiences, joyful discoveries and opportunities to explore the
                world through play.
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                Our learning environment supports each child's individuality
                while helping them develop communication, creativity,
                independence, emotional confidence and a genuine love for
                learning.
              </p>

              {/* Mini values */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Learn through play",
                  "Explore with curiosity",
                  "Express with confidence",
                  "Grow with happiness",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl glass-card px-4 py-3 shadow-sm"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    </span>

                    <span className="text-sm font-bold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SCHOOL OF HAPPINESS
      ====================================================== */}

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute -top-12 right-[10%] h-24 w-24 rounded-full border-[18px] border-yellow-200/50" />

        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <Rainbow className="h-4 w-4" />
              Our Vision
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl">
              More than a school.
              <span className="text-[#ef9e8a]"> A place to be happy.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
              We want children to look forward to coming to school every day —
              meeting friends, discovering new ideas and enjoying meaningful
              childhood experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
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
            ].map((item, i) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[32px] glass-card p-7 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <span
                  className="absolute -right-5 -top-7 text-[100px] font-black leading-none opacity-[0.07]"
                  style={{
                    color: TINTS[i],
                  }}
                >
                  {item.number}
                </span>

                <span
                  className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black"
                  style={{
                    backgroundColor: `${TINTS[i]}25`,
                    color: TINTS[i],
                  }}
                >
                  {item.number}
                </span>

                <h3 className="relative mt-6 text-xl font-black text-emerald-950">
                  {item.title}
                </h3>

                <p className="relative mt-3 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FOUNDERS
      ====================================================== */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        <div className="container-pad">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            {/* Heading */}

            <div>
              <div className="eyebrow">
                <Heart className="h-4 w-4 fill-current" />
                Meet Our Founders
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">
                Built with a love for
                <span className="text-[#ef9e8a]"> childhood & learning.</span>
              </h2>

              <p className="mt-5 max-w-lg leading-8 text-slate-600">
                Little Mahilam was envisioned by educators who believe that
                early childhood education should feel joyful, meaningful and
                respectful of every child's uniqueness.
              </p>

              <div className="mt-7 rounded-[28px] glass-card p-6">
                <Sparkles className="h-6 w-6 text-emerald-700" />

                <p className="mt-4 font-bold leading-7 text-emerald-950">
                  “Every child deserves a place where learning begins with
                  happiness.”
                </p>
              </div>
            </div>

            {/* Founder Cards */}

            <div className="grid gap-6 sm:grid-cols-2">
              {founders.map((founder, i) => (
                <div
                  key={founder.name}
                  className={`group overflow-hidden rounded-[36px] glass-card shadow-[0_15px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    i === 1 ? "sm:translate-y-8 sm:hover:translate-y-6" : ""
                  }`}
                >
                  <div className="relative h-[340px] overflow-hidden bg-[#fffaf0]">
                    <Image
                      src={founder.image}
                      alt={`${founder.name}, founder of Little Mahilam Preschool`}
                      fill
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/45 via-transparent to-transparent" />

                    <span
                      className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white shadow-lg"
                      style={{
                        backgroundColor: TINTS[i],
                      }}
                    >
                      <Heart className="h-4 w-4 fill-white text-white" />
                    </span>
                  </div>

                  <div className="relative p-6">
                    <div
                      className="absolute inset-x-6 top-0 h-1 rounded-full"
                      style={{
                        backgroundColor: TINTS[i],
                      }}
                    />

                    <div className="pt-2 text-xs font-black uppercase tracking-[0.17em] text-emerald-700">
                      {founder.role}
                    </div>

                    <h3 className="mt-2 text-xl font-black text-emerald-950">
                      {founder.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Creating meaningful early-learning experiences with care,
                      creativity and happiness.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PHILOSOPHY
      ====================================================== */}

      <section className="relative overflow-hidden mesh-dark py-16 text-white md:py-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-800/40 blur-3xl" />

        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="container-pad relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <Sparkles className="h-4 w-4" />
              Our Philosophy
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              How we bring happiness
              <span className="text-yellow-300"> to learning.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/60">
              Our approach creates meaningful experiences that help children
              discover, participate, communicate and grow naturally.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className="group rounded-[32px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.09]"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                    style={{
                      backgroundColor: `${TINTS[i]}25`,
                    }}
                  >
                    <Icon
                      className="h-7 w-7"
                      style={{
                        color: TINTS[i],
                      }}
                    />
                  </span>

                  <h3 className="mt-6 text-xl font-black">{pillar.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          OUR VALUES
      ====================================================== */}

      <section className="overflow-hidden py-16 md:py-20">
        <div className="container-pad">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Content */}

            <div>
              <div className="eyebrow">
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                What Matters To Us
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">
                Childhood comes first in
                <span className="text-[#ef9e8a]"> everything we do.</span>
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Our values guide our classrooms, activities and interactions
                with children and families every day.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {values.map((value, i) => (
                  <div
                    key={value}
                    className="flex items-center gap-3 rounded-2xl glass-chip p-4"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${TINTS[i % TINTS.length]}22`,
                      }}
                    >
                      <CheckCircle2
                        className="h-5 w-5"
                        style={{
                          color: TINTS[i % TINTS.length],
                        }}
                      />
                    </span>

                    <span className="text-sm font-black text-slate-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Image */}

            <div className="relative mx-auto w-full max-w-[560px] py-6">
              <div className="relative h-[480px] overflow-hidden rounded-[100px_35px_100px_35px] border-[7px] border-white shadow-2xl">
                <Image
                  src={localImage("/images/about/kids-group.webp", 0)}
                  alt="Happy children learning and playing together"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -left-4 bottom-0 rounded-[25px] bg-[#ef9e8a] px-5 py-4 text-white shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <Users className="h-7 w-7" />

                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      Together we
                    </div>

                    <div className="font-black">Learn • Play • Grow</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-0 flex h-20 w-20 rotate-6 items-center justify-center rounded-[28px] bg-yellow-300 shadow-lg">
                <Sun className="h-9 w-9 text-yellow-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CLOSING STORY CTA
      ====================================================== */}

      <section className="section-tint py-14">
        <div className="container-pad">
          <div className="relative overflow-hidden rounded-[40px] glass-card px-7 py-10 md:px-12 md:py-12">
            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-yellow-200/50" />

            <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-pink-200/30" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  Little Mahilam Preschool
                </span>

                <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-emerald-950 sm:text-3xl">
                  Come experience our
                  <span className="text-[#ef9e8a]">
                    {" "}
                    School of Happiness.
                  </span>
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                  Discover our classrooms, activities, learning environment and
                  the joyful experiences we create for young children.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-emerald-900"
              >
                Visit Our School

                <ArrowRight className="h-4 w-4" />
              </Link>
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