import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Baby,
  BookOpen,
  Brain,
  Check,
  GraduationCap,
  Heart,
  Palette,
  Pencil,
  Puzzle,
  Shapes,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageBanner } from "@/components/public/PageBanner";
import { CardSlider } from "@/components/public/CardSlider";
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

/** Bento tiles: the first is the large feature tile. */
const learningAreas = [
  { icon: BookOpen, title: "Language", description: "Stories, phonics, vocabulary, speaking, listening and early reading skills.", bg: "#fde9b8", ink: "#7a5a12" },
  { icon: Brain, title: "Thinking Skills", description: "Observation, reasoning, problem-solving and age-appropriate concept learning.", bg: "#dcefe5", ink: "#285744" },
  { icon: Palette, title: "Creativity", description: "Art, craft, colours, music and imaginative activities for self-expression.", bg: "#fbd9cf", ink: "#9a3f2b" },
  { icon: Users, title: "Social Growth", description: "Sharing, teamwork, communication, friendship and positive classroom interaction.", bg: "#dbe8f7", ink: "#2f5d94" },
  { icon: Puzzle, title: "Hands-On Learning", description: "Puzzles, activities, games and practical experiences that make learning meaningful.", bg: "#e9e1fb", ink: "#5b3fa8" },
  { icon: Heart, title: "Emotional Growth", description: "Confidence, independence, empathy and a sense of belonging in the classroom.", bg: "#fde2ea", ink: "#a33a5c" },
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

const CRAYONS = ["#e2725b", "#f7c85b", "#3f7a63", "#8cb9e8", "#b79ce6"];

// Programs are managed from the admin area and should appear as soon as they
// are published. The API remains the source of truth, so do not cache this
// request in Next's data cache.
export const revalidate = 0;

export default async function Page() {
  const programs = await getPublic<Program[]>("/programs", 0);
  return (
    <PublicShell>
      <PageBanner
        theme="programs"
        eyebrow="Our programs"
        icon={GraduationCap}
        title="Learning journeys for"
        highlight="every age"
        description="Age-appropriate learning journeys designed to help every child play, explore, discover and grow with happiness."
        crumbs={[{ name: "Programs", path: "/programs" }]}
        image={{ src: localImage("/images/banners/programs.webp", 0), alt: "Children learning together in a Little Mahilam classroom" }}
      />

      {/* ======================================================
          INTRO — chalkboard + arch window photo
      ====================================================== */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div className="chalkboard relative rounded-[18px] p-7 text-white sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[.18em] text-[#fde9b8]">
              <Pencil className="h-3.5 w-3.5" /> Learning Journey
            </span>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-bold leading-[1.15] sm:text-4xl">
              Every age has its own{" "}
              <span className="relative inline-block text-[#f7c85b]">
                special way to learn.
                <svg aria-hidden viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full opacity-80">
                  <path d="M3 9 C 60 3, 120 12, 180 6 S 270 5, 297 8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" />
                </svg>
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">
              Our programs are designed around the developmental needs of children at every stage — from their first preschool experience to confident primary learning.
            </p>
            <p className="mt-4 max-w-xl leading-8 text-white/65">
              Each level combines guided learning with play, movement, creativity, stories, communication and hands-on exploration.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Play-based learning", "Age-specific activities", "Creative classrooms", "Individual attention"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-display text-base font-bold text-white/90">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-white/70"><Check className="h-4 w-4 text-[#f7c85b]" strokeWidth={3} /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/admissions" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f7c85b] px-7 py-4 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:-translate-y-1 hover:bg-[#fbd779]">
              Admission Enquiry <ArrowRight className="h-4 w-4" />
            </Link>
            {/* Chalk tray */}
            <div aria-hidden className="absolute -bottom-[12px] left-8 right-8 h-3 translate-y-full rounded-b-md bg-[#9c6d3f]">
              <span className="absolute -top-1.5 left-10 h-2 w-8 rounded-full bg-white/90" />
              <span className="absolute -top-1.5 left-24 h-2 w-6 rounded-full bg-[#f7c85b]" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[400px] pt-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[36px] border-[8px] border-white shadow-[0_30px_60px_-28px_rgba(23,60,47,.5)]">
              <Image src={localImage("/images/programs/kids-learning.webp", 0)} alt="Children enjoying preschool learning activities" fill sizes="(min-width: 1024px) 400px, 90vw" className="object-cover" />
            </div>
            {/* Crayon row */}
            <div aria-hidden className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-end gap-1.5">
              {CRAYONS.map((color, i) => (
                <span key={color} className="relative block w-5 rounded-t-sm shadow-md" style={{ backgroundColor: color, height: `${58 + (i % 3) * 10}px` }}>
                  <span className="absolute -top-3 left-0 h-3 w-5" style={{ backgroundColor: color, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
                  <span className="absolute inset-x-0 top-3 h-1.5 bg-black/15" />
                </span>
              ))}
            </div>
            <span className="absolute -left-4 top-16 flex h-20 w-20 -rotate-12 flex-col items-center justify-center rounded-full bg-[#ef9e8a] font-display text-white shadow-lg">
              <span className="text-2xl font-bold leading-none">2–6+</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">years</span>
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================
          JOURNEY — card slider of age stages
      ====================================================== */}
      <section className="section-mint relative overflow-hidden py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Program stages"
            itemClassName="w-[82%] sm:w-[46%] lg:w-[31.8%]"
            heading={
              <>
                <span className="eyebrow"><Sun className="h-4 w-4 text-yellow-500" /> Our Learning Journey</span>
                <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">
                  Growing with your child <span className="text-[#e2725b]">every step of the way.</span>
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-slate-600">Each stage builds naturally on the previous one, helping children become confident learners while still enjoying childhood.</p>
              </>
            }
          >
            {programJourney.map((program, i) => {
              const Icon = program.icon;
              const tint = TINTS[i % TINTS.length];
              return (
                <article key={program.title} className="group flex h-full flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_18px_40px_-24px_rgba(23,60,47,.4)]" style={{ borderBottom: `6px solid ${tint}` }}>
                  <div className="relative h-52 overflow-hidden">
                    <Image src={program.image} alt={`${program.title} program`} fill sizes="(min-width: 1024px) 380px, 80vw" className="object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-emerald-950 backdrop-blur">Step {i + 1}</span>
                    <span className="absolute -bottom-6 right-5 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white text-white shadow-md" style={{ backgroundColor: tint }}>
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 pt-5">
                    <span className="text-xs font-extrabold uppercase tracking-[.15em]" style={{ color: tint === "#f7c85b" ? "#b8860b" : tint }}>{program.age}</span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-emerald-950">{program.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{program.text}</p>
                  </div>
                </article>
              );
            })}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          DYNAMIC PROGRAMS
      ====================================================== */}
      <section id="all-programs" className="relative scroll-mt-24 overflow-hidden py-16 md:py-20">
        <div className="container-pad relative">
          <div className="mb-10">
            <div className="eyebrow"><BookOpen className="h-4 w-4" /> Explore Programs</div>
            <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
              Find the right program for <span className="text-[#e2725b]">your little learner.</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">Explore every available program, age group, learning focus and activity designed for children at Little Mahilam.</p>
          </div>
          <ProgramsDynamic programs={programs} />
        </div>
      </section>

      {/* ======================================================
          LEARNING AREAS — colourful bento grid
      ====================================================== */}
      <section className="py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow"><Brain className="h-4 w-4" /> Whole Child Development</span>
            <h2 className="mt-5 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
              Learning goes <span className="text-[#e2725b]">beyond books.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">Our programs focus on academic readiness along with communication, creativity, confidence, movement and emotional development.</p>
          </div>

          {/* 4-column bento: wide feature + 2 tiles, then 3 tiles + a wide closer. */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningAreas.map((area, i) => {
              const Icon = area.icon;
              const feature = i === 0;
              const wide = feature || i === learningAreas.length - 1;
              return (
                <article
                  key={area.title}
                  className={`group relative overflow-hidden rounded-[30px] p-6 transition-transform duration-300 hover:-translate-y-1 ${wide ? "sm:col-span-2" : ""} ${feature ? "lg:p-8" : ""}`}
                  style={{ backgroundColor: area.bg, color: area.ink }}
                >
                  <Icon aria-hidden className={`absolute -bottom-6 -right-6 opacity-10 transition-transform duration-500 group-hover:rotate-12 ${feature ? "h-44 w-44" : "h-32 w-32"}`} />
                  <span className={`relative flex items-center justify-center rounded-full bg-white shadow-sm ${feature ? "h-16 w-16" : "h-14 w-14"}`}>
                    <Icon className={feature ? "h-8 w-8" : "h-7 w-7"} />
                  </span>
                  <h3 className={`relative font-display font-bold text-emerald-950 ${feature ? "mt-6 text-3xl" : "mt-5 text-xl"}`}>{area.title}</h3>
                  <p className={`relative leading-7 text-emerald-950/70 ${feature ? "mt-3 max-w-sm text-lg" : "mt-2 text-sm"}`}>{area.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          LEARNING THROUGH PLAY — notebook checklist
      ====================================================== */}
      <section className="section-peach overflow-hidden py-16 md:py-20">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div className="notebook relative rounded-[20px] py-8 pl-16 pr-6 shadow-[0_24px_50px_-26px_rgba(23,60,47,.45)] sm:pr-10">
            {/* Binder holes */}
            <div aria-hidden className="absolute left-4 top-8 flex flex-col gap-16">
              {[0, 1, 2].map((h) => <span key={h} className="h-5 w-5 rounded-full bg-[#f3e6d8] shadow-inner" />)}
            </div>
            <span className="eyebrow"><Sparkles className="h-4 w-4" /> Play • Explore • Learn</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
              When children enjoy learning, <span className="text-[#e2725b]">learning becomes natural.</span>
            </h2>
            <p className="mt-4 max-w-xl leading-[2.1rem] text-slate-600">
              Children are active participants in our classrooms. They learn through touching, observing, talking, creating, moving and experimenting.
            </p>
            <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <li key={benefit} className="flex h-[2.1rem] items-center gap-3 font-display text-[1.05rem] font-bold text-emerald-900">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-emerald-800/60">
                    <Check className="h-4 w-4" style={{ color: TINTS[i % TINTS.length] === "#f7c85b" ? "#d69e2e" : TINTS[i % TINTS.length] }} strokeWidth={3.5} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-white shadow-2xl">
              <Image src={localImage("/images/programs/learning-through-play.webp", 0)} alt="Children learning through play" fill sizes="(min-width: 1024px) 440px, 90vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-2 h-36 w-36 overflow-hidden rounded-[30px] border-[6px] border-white shadow-xl sm:h-40 sm:w-40">
              <Image src={localImage("/images/programs/kids-art.webp", 1)} alt="Child enjoying creative art activity" fill sizes="160px" className="object-cover" />
            </div>
            <span className="absolute -right-2 top-6 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full bg-[#f7c85b] text-center font-display text-emerald-950 shadow-xl ring-4 ring-white">
              <Sun className="mb-0.5 h-6 w-6" />
              <span className="text-[11px] font-bold uppercase leading-4">Happy<br />Learning</span>
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA — sunny band
      ====================================================== */}
      <section className="py-14">
        <div className="container-pad">
          <div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(120deg,#f7c85b,#f4b98a_60%,#ef9e8a)] px-7 py-10 text-emerald-950 md:px-12 md:py-12">
            <Sun aria-hidden className="absolute -right-10 -top-10 h-48 w-48 animate-[spin_40s_linear_infinite] text-white/35" />
            <Pencil aria-hidden className="absolute bottom-6 right-[38%] hidden h-10 w-10 -rotate-12 text-emerald-950/15 md:block" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-950/60">Need Help Choosing?</span>
                <h2 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight sm:text-3xl">Find the right learning journey for your child.</h2>
                <p className="mt-3 max-w-2xl leading-7 text-emerald-950/70">Our team can help you understand the appropriate program based on your child&apos;s age and learning stage.</p>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-950">
                Talk to Our Team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </PublicShell>
  );
}
