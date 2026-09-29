import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, BookOpen, Brain, Camera, CheckCircle2, Heart, MapPin, Music2, Palette, Puzzle, Shapes, Sparkles, Star, Sun } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { AnnouncementBar } from "@/components/public/AnnouncementBar";
import { HeroSlider } from "@/components/public/HeroSlider";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { ExploreMore } from "@/components/public/ExploreMore";
import { TestimonialsDynamic } from "@/components/public/TestimonialsDynamic";
import { ParentReviewForm } from "@/components/public/ParentReviewForm";
import { Bunting } from "@/components/public/Bunting";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type Banner, type GalleryAlbum, type HomeData, type Program, type Testimonial } from "@/lib/server-api";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { isOptimizable } from "@/lib/media";
import { site } from "@/lib/site";
import { HOME_FAQS } from "@/lib/faqs";

export const revalidate = 300;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Best Preschool & Play School in Tiruppur",
    description: "Little Mahilam is a joyful, child-centric preschool on Kangayam Road, Tiruppur. Play Group, Pre-KG, LKG, UKG and Grades 1–3 with play-way learning. Admissions open — book a campus visit.",
    path: "/",
    keywords: ["preschool admission 2026 Tiruppur", "best play school near me Tiruppur"],
  }),
  title: { absolute: "Little Mahilam Preschool, Tiruppur | Best Play School on Kangayam Road" },
};

const TINTS = ["#d6a62d", "#e58d73", "#3f7a63", "#6aa0d8", "#9b7fd6"];

const FALLBACK_PROGRAMS = [
  { title: "Play Group", age: "2 – 3 years", image: "/imgs/home/kid1.jpg" },
  { title: "Pre-KG", age: "3 – 4 years", image: "/imgs/home/kid2.avif" },
  { title: "LKG", age: "4 – 5 years", image: "/imgs/home/kid1.jpg" },
  { title: "UKG", age: "5 – 6 years", image: "/imgs/home/kid2.avif" },
];

const ACTIVITIES = [
  { icon: Palette, title: "Art & Craft", text: "Colours, painting, craft and imagination." },
  { icon: Music2, title: "Music & Dance", text: "Rhythm, songs, movement and expression." },
  { icon: BookOpen, title: "Story Time", text: "Stories that grow vocabulary and imagination." },
  { icon: Puzzle, title: "Puzzle Play", text: "Fun challenges for thinking and problem-solving." },
  { icon: Shapes, title: "Creative Play", text: "Shapes, patterns and concepts through play." },
  { icon: Sun, title: "Outdoor Fun", text: "Running, games and happy outdoor time." },
];

const PILLARS = [
  { icon: Heart, title: "Child-Centric", text: "Every child learns at their own pace with care, attention and encouragement." },
  { icon: Shapes, title: "Play-Way Learning", text: "Concepts come alive through play, stories, games and hands-on activities." },
  { icon: Brain, title: "Multiple Intelligence", text: "We nurture creativity, language, movement, music, social and thinking skills." },
];

export default async function Home() {
  const [banners, home, testimonials, programs, gallery] = await Promise.all([
    getPublic<Banner[]>("/banners"),
    getPublic<HomeData>("/home"),
    getPublic<Testimonial[]>("/testimonials"),
    getPublic<Program[]>("/programs"),
    getPublic<GalleryAlbum[]>("/gallery"),
  ]);

  const programCards = programs?.length
    ? programs.slice(0, 4).map((p, i) => ({ title: p.name, age: p.ageGroup || "", image: p.coverImage || FALLBACK_PROGRAMS[i % 4].image }))
    : FALLBACK_PROGRAMS;
  const photos = (gallery ?? []).flatMap((album) => album.items.map((item) => ({ src: item.imageUrl, alt: item.altText || item.caption || album.title }))).slice(0, 4);
  const moments = photos.length >= 4 ? photos : ["/imgs/home/kid1.jpg", "/imgs/home/kid2.avif", "/imgs/home/kid2.avif", "/imgs/home/kid1.jpg"].map((src, i) => ({ src, alt: `Happy school moment ${i + 1} at Little Mahilam` }));

  return (
    <PublicShell>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <AnnouncementBar announcement={home?.announcements?.[0] ?? null} />
      <HeroSlider banners={banners ?? []} />
      <Bunting className="text-emerald-950" />

      {/* Pillars */}
      <section className="relative py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow"><Sparkles className="h-3.5 w-3.5 text-[#d6a62d]" />Happy learning</span>
            <h2 className="section-title mt-5 text-emerald-950">Little minds. <span className="text-emerald-700">Big imagination.</span></h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">A joyful learning environment in Tiruppur where every child can play, explore, create, communicate and grow with confidence.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <article key={title} className="glass-card reveal group relative overflow-hidden p-7 transition duration-300 hover:-translate-y-2">
                <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-xl transition group-hover:opacity-40" style={{ backgroundColor: TINTS[i] }} />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-[20px]" style={{ backgroundColor: `${TINTS[i]}22`, color: TINTS[i] }}><Icon className="h-7 w-7" /></span>
                <h3 className="relative mt-6 text-xl font-bold text-emerald-950">{title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section-tint relative overflow-hidden py-20">
        <div className="container-pad grid items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[560px] pb-12">
            <div className="relative h-[440px] overflow-hidden rounded-[45px_90px_45px_90px] border-8 border-white/80 shadow-2xl shadow-emerald-950/15 sm:h-[520px]">
              <Image src="/imgs/home/kid1.jpg" alt="Children enjoying learning activities at Little Mahilam Preschool" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-3 -right-2 h-40 w-40 overflow-hidden rounded-[35px] border-[6px] border-white/80 shadow-xl sm:h-48 sm:w-48">
              <Image src="/imgs/home/kid2.avif" alt="Children playing together at school" fill sizes="192px" className="object-cover" />
            </div>
            <div className="glass absolute -left-3 top-10 rounded-3xl px-5 py-4 sm:-left-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white"><Heart className="h-5 w-5 fill-pink-400 text-pink-400" /></span>
                <div><div className="text-xs font-bold text-slate-500">Learning with</div><div className="font-display text-lg font-bold text-emerald-950">Love &amp; Joy</div></div>
              </div>
            </div>
          </div>
          <div>
            <span className="eyebrow"><Baby className="h-3.5 w-3.5" />Welcome little learners</span>
            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">A school filled with <span className="text-[#e2735b]">smiles, stories</span> and discovery.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Little Mahilam Preschool gives children in Tiruppur a happy, secure and inspiring beginning to their learning journey — through play, movement, stories, creativity and meaningful everyday experiences.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Happy learning spaces", "Caring, trained teachers", "Creative daily activities", "Individual attention", "Play-based curriculum", "Safe, child-friendly campus"].map((item) => (
                <li key={item} className="glass-chip flex items-center gap-3 rounded-2xl px-4 py-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /><span className="text-sm font-bold text-slate-700">{item}</span></li>
              ))}
            </ul>
            <Link href="/about" className="btn-primary mt-8 !px-7 !py-4">Discover our school <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="container-pad">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow"><Star className="h-3.5 w-3.5 fill-[#e58d73] text-[#e58d73]" />Our programs</span>
              <h2 className="section-title mt-5 max-w-2xl text-emerald-950">A happy learning journey <span className="text-emerald-700">for every age.</span></h2>
            </div>
            <Link href="/programs" className="inline-flex items-center gap-2 font-bold text-emerald-800">View all programs <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programCards.map((program, i) => (
              <Link href="/programs" key={program.title} className="glass-card reveal group overflow-hidden transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden">
                  <Image src={program.image} alt={`${program.title} children learning at Little Mahilam, Tiruppur`} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 92vw" unoptimized={!isOptimizable(program.image)} className="object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-xs font-black text-white shadow-lg" style={{ backgroundColor: TINTS[i % TINTS.length] }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-6">
                  {program.age && <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{program.age}</div>}
                  <h3 className="mt-2 text-2xl font-bold text-emerald-950">{program.title}</h3>
                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-800">Explore program <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section-mint py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow"><Sun className="h-3.5 w-3.5 text-[#d6a62d]" />Fun every day</span>
            <h2 className="section-title mt-5 text-emerald-950">More than books. <span className="text-[#e2735b]">More ways to grow.</span></h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Every day includes creative, physical, social and imaginative activities for young children.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="glass-card reveal group flex items-center gap-4 p-6 transition-all duration-300 hover:-translate-y-1">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] transition duration-300 group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: `${TINTS[i % TINTS.length]}22`, color: TINTS[i % TINTS.length] }}><Icon className="h-7 w-7" /></span>
                <div><h3 className="text-lg font-bold text-emerald-950">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-9 text-center"><Link href="/activities" className="btn-soft !px-7">Discover activities <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      {/* Moments */}
      <section className="section-peach overflow-hidden py-20">
        <div className="container-pad">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow"><Camera className="h-3.5 w-3.5 text-[#e58d73]" />Happy moments</span>
              <h2 className="section-title mt-5 max-w-2xl text-emerald-950">Little moments. <span className="text-[#e2735b]">Beautiful memories.</span></h2>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 font-bold text-emerald-800">Open gallery <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {moments.map((photo, i) => (
              <Link href="/gallery" key={`${photo.src}-${i}`} className={`group relative overflow-hidden shadow-lg ${["rounded-[50px_20px_50px_20px]", "rounded-[20px_50px_20px_50px]", "rounded-[50px_50px_20px_20px]", "rounded-[20px_20px_50px_50px]"][i % 4]}`}>
                <div className="relative aspect-[4/5]">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 25vw, 50vw" unoptimized={!isOptimizable(photo.src)} className="object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO */}
      <section className="py-20">
        <div className="container-pad grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="eyebrow"><MapPin className="h-3.5 w-3.5 text-[#e58d73]" />Right here in Tiruppur</span>
            <h2 className="section-title mt-5 text-emerald-950">A neighbourhood preschool families trust.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Located on Kangayam Road in Valliammai Nagar, Little Mahilam welcomes children from across {site.areasServed.slice(0, 4).join(", ")} and nearby areas of Tiruppur. Visit us to see why parents choose us as their child&apos;s first school.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {site.areasServed.map((area) => <span key={area} className="glass-chip rounded-full px-4 py-2 text-sm font-bold text-emerald-900">{area}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/preschool-in-tiruppur" className="btn-primary">Why parents choose us <ArrowRight className="h-4 w-4" /></Link>
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft">Get directions</a>
            </div>
          </div>
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-bold text-emerald-950">Parents often ask</h3>
            <div className="mt-4 divide-y divide-emerald-950/10">
              {HOME_FAQS.slice(0, 4).map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-emerald-950">{faq.q}<span className="text-xl text-emerald-700 transition group-open:rotate-45">+</span></summary>
                  <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
            <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800">All FAQs <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <ExploreMore />
      <TestimonialsDynamic rows={testimonials ?? []} />
      <ParentReviewForm />
      <AdmissionsCta />
    </PublicShell>
  );
}
