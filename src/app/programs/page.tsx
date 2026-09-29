import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Baby,
  BookOpen,
  Brain,
  CheckCircle2,
  Heart,
  Palette,
  Puzzle,
  Shapes,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageHero } from "@/components/public/PageHero";
import { ProgramsDynamic } from "@/components/public/ProgramsDynamic";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { getPublic, type Program } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Programs — Play Group, Pre-KG, LKG, UKG & Grades 1–3",
  description: "Explore age-appropriate programs at Little Mahilam Preschool, Tiruppur: Play Group (2–3 yrs), Pre-KG, LKG, UKG and Grades 1–3 with play-way, child-centric learning.",
  path: "/programs",
  keywords: ["play group Tiruppur", "Pre-KG admission Tiruppur", "LKG UKG school Tiruppur", "kindergarten programs Tiruppur"],
});

const TINTS = ["#f7c85b", "#ef9e8a", "#3f7a63", "#8cb9e8"];

const programJourney = [
  {
    icon: Baby,
    title: "Play Group",
    age: "2 – 3 Years",
    text: "A gentle beginning filled with sensory play, movement, songs and social interaction.",
    image: localImage("/images/programs/play-group.webp", 0),
  },
  {
    icon: Shapes,
    title: "Pre-KG",
    age: "3 – 4 Years",
    text: "Early concepts, language, creativity and confidence through playful learning experiences.",
    image: localImage("/images/programs/pre-kg.webp", 1),
  },
  {
    icon: BookOpen,
    title: "LKG & UKG",
    age: "4 – 6 Years",
    text: "Building strong foundations in literacy, numeracy, communication and independent learning.",
    image: localImage("/images/programs/kindergarten.webp", 0),
  },
  {
    icon: Brain,
    title: "Grades 1 – 3",
    age: "6+ Years",
    text: "Structured academics combined with creativity, exploration, communication and problem-solving.",
    image: localImage("/images/programs/primary.webp", 1),
  },
];

const learningAreas = [
  {
    icon: BookOpen,
    title: "Language",
    description:
      "Stories, phonics, vocabulary, speaking, listening and early reading skills.",
  },
  {
    icon: Brain,
    title: "Thinking Skills",
    description:
      "Observation, reasoning, problem-solving and age-appropriate concept learning.",
  },
  {
    icon: Palette,
    title: "Creativity",
    description:
      "Art, craft, colours, music and imaginative activities for self-expression.",
  },
  {
    icon: Users,
    title: "Social Growth",
    description:
      "Sharing, teamwork, communication, friendship and positive classroom interaction.",
  },
  {
    icon: Puzzle,
    title: "Hands-On Learning",
    description:
      "Puzzles, activities, games and practical experiences that make learning meaningful.",
  },
  {
    icon: Heart,
    title: "Emotional Growth",
    description:
      "Confidence, independence, empathy and a sense of belonging in the classroom.",
  },
];

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

export const revalidate = 300;

export default async function Page() {
  const programs = await getPublic<Program[]>("/programs");
  return (
    <PublicShell>
      {/* ======================================================
          HERO
      ====================================================== */}

      <PageHero
        eyebrow="Programs"
        title="Learning journeys for every age."
        description="Age-appropriate learning journeys designed to help every child play, explore, discover and grow with happiness."
        crumbs={[{ name: "Programs", path: "/programs" }]}
      />

      {/* ======================================================
          PROGRAM INTRO
      ====================================================== */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-yellow-200/30 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="absolute left-[6%] top-12 hidden rotate-12 text-4xl text-yellow-300/50 lg:block">
          ★
        </div>

        <div className="absolute right-[7%] top-16 hidden text-4xl text-pink-300/50 lg:block">
          ♥
        </div>

        <div className="container-pad relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}

            <div className="relative mx-auto w-full max-w-[590px] pb-14">
              <div className="relative h-[430px] overflow-hidden rounded-[75px_30px_75px_30px] border-[7px] border-white shadow-[0_25px_70px_rgba(15,23,42,0.14)] sm:h-[520px]">
                <Image
                  src={localImage("/images/programs/kids-learning.webp", 0)}
                  alt="Children enjoying preschool learning activities"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
              </div>

              {/* Small image */}

              <div className="absolute -bottom-1 right-0 h-40 w-40 overflow-hidden rounded-[35px] border-[6px] border-white shadow-xl sm:-right-5 sm:h-52 sm:w-52">
                <Image
                  src={localImage("/images/programs/kids-playing.webp", 1)}
                  alt="Children enjoying play-based activities"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Floating card */}

              <div className="absolute -left-2 top-12 rounded-[25px] bg-yellow-300 px-5 py-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                  </span>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">
                      Learning through
                    </div>

                    <div className="font-black text-slate-900">
                      Play & Discovery
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}

            <div>
              <div className="eyebrow">
                <Star className="h-4 w-4 fill-current" />
                Learning Journey
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-black leading-[1.15] tracking-tight text-emerald-950 sm:text-4xl lg:text-[46px]">
                Every age has its own
                <span className="text-[#ef9e8a]"> special way to learn.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Our programs are designed around the developmental needs of
                children at every stage — from their first preschool experience
                to confident primary learning.
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-600">
                Each level combines guided learning with play, movement,
                creativity, stories, communication and hands-on exploration.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Play-based learning",
                  "Age-specific activities",
                  "Creative classrooms",
                  "Individual attention",
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

              <Link
                href="/admissions"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900"
              >
                Admission Enquiry

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PROGRAM JOURNEY
      ====================================================== */}

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <Sun className="h-4 w-4 text-yellow-500" />
              Our Learning Journey
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl">
              Growing with your child
              <span className="text-[#ef9e8a]"> every step of the way.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              Each stage builds naturally on the previous one, helping children
              become confident learners while still enjoying childhood.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programJourney.map((program, i) => {
              const Icon = program.icon;

              return (
                <div
                  key={program.title}
                  className="group overflow-hidden rounded-[32px] glass-card shadow-[0_15px_50px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={`${program.title} program`}
                      fill
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <span
                      className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white shadow-md"
                      style={{
                        backgroundColor: TINTS[i % TINTS.length],
                      }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                  </div>

                  <div className="p-6">
                    <div
                      className="text-xs font-black uppercase tracking-[0.15em]"
                      style={{
                        color: TINTS[i % TINTS.length],
                      }}
                    >
                      {program.age}
                    </div>

                    <h3 className="mt-2 text-xl font-black text-emerald-950">
                      {program.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {program.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          DYNAMIC PROGRAMS
      ====================================================== */}

      <section className="relative overflow-hidden section-tint py-16 md:py-20">
        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="container-pad relative">
          <div className="mb-10">
            <div className="eyebrow">
              <BookOpen className="h-4 w-4" />
              Explore Programs
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
              Find the right program for
              <span className="text-[#ef9e8a]"> your little learner.</span>
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              Explore every available program, age group, learning focus and
              activity designed for children at Little Mahilam.
            </p>
          </div>

          <ProgramsDynamic programs={programs} />
        </div>
      </section>

      {/* ======================================================
          WHAT CHILDREN LEARN
      ====================================================== */}

      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <Brain className="h-4 w-4" />
              Whole Child Development
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
              Learning goes
              <span className="text-[#ef9e8a]"> beyond books.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">
              Our programs focus on academic readiness along with communication,
              creativity, confidence, movement and emotional development.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {learningAreas.map((area, i) => {
              const Icon = area.icon;

              return (
                <div
                  key={area.title}
                  className="group relative overflow-hidden rounded-[30px] glass-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10"
                    style={{
                      backgroundColor: TINTS[i % TINTS.length],
                    }}
                  />

                  <span
                    className="relative flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform group-hover:rotate-6 group-hover:scale-110"
                    style={{
                      backgroundColor: `${TINTS[i % TINTS.length]}22`,
                    }}
                  >
                    <Icon
                      className="h-7 w-7"
                      style={{
                        color: TINTS[i % TINTS.length],
                      }}
                    />
                  </span>

                  <h3 className="relative mt-5 text-xl font-black text-emerald-950">
                    {area.title}
                  </h3>

                  <p className="relative mt-2 text-sm leading-7 text-slate-600">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          LEARNING THROUGH PLAY IMAGE SECTION
      ====================================================== */}

      <section className="overflow-hidden section-tint py-16 md:py-20">
        <div className="container-pad">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Content */}

            <div>
              <span className="eyebrow">
                <Sparkles className="h-4 w-4" />
                Play • Explore • Learn
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-emerald-950 sm:text-4xl">
                When children enjoy learning,
                <span className="text-[#ef9e8a]">
                  {" "}
                  learning becomes natural.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Children are active participants in our classrooms. They learn
                through touching, observing, talking, creating, moving and
                experimenting.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-2xl glass-chip px-4 py-3"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${TINTS[i % TINTS.length]}25`,
                      }}
                    >
                      <CheckCircle2
                        className="h-4 w-4"
                        style={{
                          color: TINTS[i % TINTS.length],
                        }}
                      />
                    </span>

                    <span className="text-sm font-bold text-slate-700">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}

            <div className="relative mx-auto w-full max-w-[590px] py-8">
              <div className="relative ml-auto h-[470px] w-[86%] overflow-hidden rounded-[100px_40px_100px_40px] border-[7px] border-white shadow-2xl">
                <Image
                  src={localImage("/images/programs/learning-through-play.webp", 0)}
                  alt="Children learning through play"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute bottom-0 left-0 h-44 w-44 overflow-hidden rounded-full border-[7px] border-white shadow-xl sm:h-52 sm:w-52">
                <Image
                  src={localImage("/images/programs/kids-art.webp", 1)}
                  alt="Child enjoying creative art activity"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              <div className="absolute right-0 top-0 flex h-24 w-24 rotate-6 flex-col items-center justify-center rounded-[30px] bg-yellow-300 text-center shadow-xl">
                <Sun className="mb-1 h-7 w-7 text-yellow-700" />

                <span className="text-[10px] font-black uppercase leading-4 text-slate-800">
                  Happy
                  <br />
                  Learning
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PROGRAM CTA
      ====================================================== */}

      <section className="py-14">
        <div className="container-pad">
          <div className="relative overflow-hidden rounded-[40px] mesh-dark grain px-7 py-10 text-white md:px-12 md:py-12">
            <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-yellow-300/10" />

            <div className="absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-pink-300/10" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  Need Help Choosing?
                </span>

                <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight sm:text-3xl">
                  Find the right learning journey for
                  <span className="text-yellow-300"> your child.</span>
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-white/60">
                  Our team can help you understand the appropriate program based
                  on your child's age and learning stage.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-7 py-4 text-sm font-black text-emerald-950 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Talk to Our Team

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