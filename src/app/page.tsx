import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, BookOpen, Brain, Bus, Camera, Flower2, Heart, MapPin, Music2, Palette, Pin, Puzzle, Shapes, Sparkles, Star, Sun } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { AnnouncementBar } from "@/components/public/AnnouncementBar";
import { HeroSlider } from "@/components/public/HeroSlider";
import { CardSlider } from "@/components/public/CardSlider";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { ExploreMore } from "@/components/public/ExploreMore";
import { TestimonialsDynamic } from "@/components/public/TestimonialsDynamic";
import { ParentReviewForm } from "@/components/public/ParentReviewForm";
import { Bunting } from "@/components/public/Bunting";
import { JsonLd } from "@/components/seo/JsonLd";
import { ANNOUNCEMENT_POPUP_KEY, getPublic, isPopupEnabled, type Banner, type GalleryAlbum, type HomeData, type Program, type Testimonial } from "@/lib/server-api";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { isOptimizable } from "@/lib/media";
import { site } from "@/lib/site";
import { HOME_FAQS } from "@/lib/faqs";

export const revalidate = 0;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Best Preschool & Play School in Tiruppur",
    description: "Little Mahilam is a joyful, child-centric preschool on Kangayam Road, Tiruppur. Play Group, Pre-KG, LKG, UKG and Grades 1–3 with play-way learning. Admissions open — book a campus visit.",
    path: "/",
    keywords: ["preschool admission 2026 Tiruppur", "best play school near me Tiruppur"],
  }),
  title: { absolute: "Little Mahilam Preschool, Tiruppur | Best Play School on Kangayam Road" },
};

const PASTELS = [
  { bg: "#fde9b8", ink: "#7a5a12", solid: "#f7c85b" },
  { bg: "#fbd9cf", ink: "#9a3f2b", solid: "#ef9e8a" },
  { bg: "#dcefe5", ink: "#285744", solid: "#3f7a63" },
  { bg: "#dbe8f7", ink: "#2f5d94", solid: "#8cb9e8" },
  { bg: "#e9e1fb", ink: "#5b3fa8", solid: "#c4b5fd" },
  { bg: "#fde2ea", ink: "#a33a5c", solid: "#f4a6c0" },
];
const BLOBS = ["58% 42% 63% 37% / 45% 55% 45% 55%", "42% 58% 37% 63% / 55% 45% 55% 45%", "63% 37% 52% 48% / 38% 58% 42% 62%"];

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

const WELCOME = ["Happy learning spaces", "Caring, trained teachers", "Creative daily activities", "Individual attention", "Play-based curriculum", "Safe, child-friendly campus"];

/** Fanned "hand of photos": rotation and horizontal offset per card (desktop). */
const FAN = [
  { rotate: "-14deg", left: "0%", top: "28px" },
  { rotate: "-5deg", left: "22%", top: "6px" },
  { rotate: "5deg", left: "44%", top: "6px" },
  { rotate: "14deg", left: "66%", top: "28px" },
];

export default async function Home() {
  const [banners, home, testimonials, programs, gallery, settings] = await Promise.all([
    // Hero banners are managed live in Admin; never leave a newly published slide
    // hidden behind the general five-minute CMS cache.
    getPublic<Banner[]>("/banners", 0),
    getPublic<HomeData>("/home", 0),
    getPublic<Testimonial[]>("/testimonials", 0),
    // Programs are managed live in Admin; keep the homepage cards in sync
    // with the Programs page immediately after publishing.
    getPublic<Program[]>("/programs", 0),
    getPublic<GalleryAlbum[]>("/gallery", 0),
    getPublic<Record<string, unknown>>("/settings", 0),
  ]);
  // Admins can switch the announcement popup off from Admin → Announcements.
  const showAnnouncement = isPopupEnabled(settings?.[ANNOUNCEMENT_POPUP_KEY]);

  const programCards = programs?.length
    ? programs.slice(0, 6).map((p, i) => ({ title: p.name, age: p.ageGroup || "", image: p.coverImage || FALLBACK_PROGRAMS[i % 4].image }))
    : FALLBACK_PROGRAMS;
  const photos = (gallery ?? []).flatMap((album) => album.items.map((item) => ({ src: item.imageUrl, alt: item.altText || item.caption || album.title }))).slice(0, 4);
  const moments = photos.length >= 4 ? photos : ["/imgs/home/kid1.jpg", "/imgs/home/kid2.avif", "/imgs/home/kid2.avif", "/imgs/home/kid1.jpg"].map((src, i) => ({ src, alt: `Happy school moment ${i + 1} at Little Mahilam` }));

  return (
    <PublicShell>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <AnnouncementBar announcement={showAnnouncement ? home?.announcements?.[0] ?? null : null} />
      <HeroSlider banners={banners ?? []} />
      <Bunting className="text-emerald-950" />

      {/* ======================================================
          PILLARS — organic blob cards
      ====================================================== */}
      <section className="relative py-16 md:py-20">
        <div className="container-pad">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow"><Sparkles className="h-3.5 w-3.5 text-[#d6a62d]" />Happy learning</span>
            <h2 className="mt-5 font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">Little minds. <span className="text-[#e2725b]">Big imagination.</span></h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">A joyful learning environment in Tiruppur where every child can play, explore, create, communicate and grow with confidence.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, text }, i) => {
              const tone = PASTELS[i];
              return (
                <article key={title} className="group relative px-8 pb-10 pt-12 text-center transition-transform duration-500 hover:-translate-y-2" style={{ backgroundColor: tone.bg, borderRadius: BLOBS[i] }}>
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-500 group-hover:rotate-12" style={{ color: tone.ink }}><Icon className="h-8 w-8" /></span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-emerald-950">{title}</h3>
                  <p className="mx-auto mt-3 max-w-xs leading-7" style={{ color: tone.ink }}>{text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          WELCOME — play-house window with shutters
      ====================================================== */}
      <section className="section-tint relative overflow-hidden py-20">
        <div className="container-pad grid items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[460px] pb-10">
            <div className="relative mx-auto flex items-stretch justify-center">
              {/* Left shutter */}
              <span aria-hidden className="w-[16%] origin-right -skew-y-6 rounded-l-xl bg-[repeating-linear-gradient(180deg,#ef9e8a_0_14px,#e2856d_14px_16px)] shadow-md" />
              {/* Window */}
              <div className="relative aspect-[4/5] w-[68%] overflow-hidden rounded-t-[26px] border-[10px] border-white bg-white shadow-xl">
                <Image src="/imgs/home/kid1.jpg" alt="Children enjoying learning activities at Little Mahilam Preschool" fill sizes="(min-width: 1024px) 320px, 70vw" className="object-cover" />
                <span aria-hidden className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-white" />
                <span aria-hidden className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-white" />
              </div>
              {/* Right shutter */}
              <span aria-hidden className="w-[16%] origin-left skew-y-6 rounded-r-xl bg-[repeating-linear-gradient(180deg,#ef9e8a_0_14px,#e2856d_14px_16px)] shadow-md" />
            </div>
            {/* Flower box */}
            <div aria-hidden className="relative mx-auto -mt-1 h-10 w-[76%] rounded-b-xl bg-[#9c6d3f] shadow-md">
              <div className="absolute -top-6 inset-x-3 flex justify-around">
                {["#f7c85b", "#ef9e8a", "#c4b5fd", "#f4a6c0", "#8cb9e8"].map((c) => <Flower2 key={c} className="h-8 w-8" style={{ color: c, fill: c }} />)}
              </div>
            </div>
            <span className="absolute -right-2 top-6 flex rotate-6 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-lg">
              <Heart className="h-5 w-5 fill-[#ef9e8a] text-[#ef9e8a]" />
              <span className="font-display text-base font-bold text-emerald-950">Love &amp; Joy</span>
            </span>
          </div>
          <div>
            <span className="eyebrow"><Baby className="h-3.5 w-3.5" />Welcome little learners</span>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">A school filled with <span className="text-[#e2735b]">smiles, stories</span> and discovery.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Little Mahilam Preschool gives children in Tiruppur a happy, secure and inspiring beginning to their learning journey — through play, movement, stories, creativity and meaningful everyday experiences.</p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {WELCOME.map((item, i) => (
                <li key={item} className="flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-bold text-emerald-950" style={{ backgroundColor: PASTELS[i % PASTELS.length].bg }}>
                  <Star className="h-4 w-4" style={{ color: PASTELS[i % PASTELS.length].ink, fill: PASTELS[i % PASTELS.length].ink }} />{item}
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-primary mt-8 !px-7 !py-4">Discover our school <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          PROGRAMS — arch-top card slider
      ====================================================== */}
      <section className="py-20">
        <div className="container-pad">
          <CardSlider
            label="Our programs"
            itemClassName="w-[74%] sm:w-[40%] lg:w-[23.2%]"
            heading={
              <>
                <span className="eyebrow"><Star className="h-3.5 w-3.5 fill-[#e58d73] text-[#e58d73]" />Our programs</span>
                <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">A happy learning journey <span className="text-[#e2725b]">for every age.</span></h2>
                <Link href="/programs" className="mt-4 inline-flex items-center gap-2 font-bold text-emerald-800 hover:underline">View all programs <ArrowRight className="h-4 w-4" /></Link>
              </>
            }
          >
            {programCards.map((program, i) => {
              const tone = PASTELS[i % PASTELS.length];
              return (
                <Link href="/programs" key={program.title} className="group flex h-full flex-col rounded-[30px] p-3 pb-6 transition-transform duration-300 hover:-translate-y-2" style={{ backgroundColor: tone.bg }}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[22px] border-4 border-white">
                    <Image src={program.image} alt={`${program.title} children learning at Little Mahilam, Tiruppur`} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 40vw, 74vw" unoptimized={!isOptimizable(program.image)} className="object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <span className="-mt-7 ml-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white font-display text-lg font-bold text-white shadow-md" style={{ backgroundColor: tone.solid }}>{String(i + 1).padStart(2, "0")}</span>
                  <div className="px-3 pt-3">
                    {program.age && <div className="text-xs font-extrabold uppercase tracking-[0.14em]" style={{ color: tone.ink }}>{program.age}</div>}
                    <h3 className="mt-1 font-display text-2xl font-bold text-emerald-950">{program.title}</h3>
                    <div className="mt-3 flex items-center gap-2 text-sm font-bold" style={{ color: tone.ink }}>Explore program <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                  </div>
                </Link>
              );
            })}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          ACTIVITIES — floating bubbles
      ====================================================== */}
      <section className="section-mint py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow"><Sun className="h-3.5 w-3.5 text-[#d6a62d]" />Fun every day</span>
            <h2 className="mt-5 font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">More than books. <span className="text-[#e2735b]">More ways to grow.</span></h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Every day includes creative, physical, social and imaginative activities for young children.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {ACTIVITIES.map(({ icon: Icon, title, text }, i) => {
              const tone = PASTELS[i % PASTELS.length];
              return (
                <div key={title} className={`group mx-auto flex aspect-square w-full max-w-[260px] flex-col items-center justify-center rounded-full p-5 text-center shadow-[inset_0_-10px_0_rgba(0,0,0,.05),0_18px_30px_-22px_rgba(23,60,47,.5)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-3 ${i % 2 ? "lg:translate-y-8" : ""}`} style={{ backgroundColor: tone.bg }}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm sm:h-14 sm:w-14" style={{ color: tone.ink }}><Icon className="h-6 w-6 sm:h-7 sm:w-7" /></span>
                  <h3 className="mt-3 font-display text-base font-bold text-emerald-950 sm:text-xl">{title}</h3>
                  <p className="mt-1 hidden max-w-[80%] text-sm leading-6 sm:block" style={{ color: tone.ink }}>{text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-16 text-center"><Link href="/activities" className="btn-soft !px-7">Discover activities <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      {/* ======================================================
          MOMENTS — fanned hand of photos
      ====================================================== */}
      <section className="section-peach overflow-hidden py-20">
        <div className="container-pad grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow"><Camera className="h-3.5 w-3.5 text-[#e58d73]" />Happy moments</span>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">Little moments. <span className="text-[#e2735b]">Beautiful memories.</span></h2>
            <p className="mt-4 max-w-md leading-7 text-slate-600">A peek into the everyday smiles, friendships and discoveries at our school.</p>
            <Link href="/gallery" className="btn-primary mt-7">Open gallery <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {/* Phones: 2×2 grid. Large screens: fanned cards that spread on hover. */}
          <div className="group/fan relative grid grid-cols-2 gap-3 lg:block lg:h-[380px]">
            {moments.map((photo, i) => (
              <Link
                href="/gallery"
                key={`${photo.src}-${i}`}
                className="relative block overflow-hidden rounded-[22px] border-[6px] border-white shadow-xl transition-all duration-500 lg:absolute lg:left-(--fan-left) lg:top-(--fan-top) lg:z-(--fan-z) lg:w-[34%] lg:[rotate:var(--fan-rotate)] lg:group-hover/fan:[rotate:0deg] lg:hover:z-20 lg:hover:scale-105"
                style={{ "--fan-rotate": FAN[i].rotate, "--fan-left": FAN[i].left, "--fan-top": FAN[i].top, "--fan-z": i === 1 || i === 2 ? 2 : 1 } as React.CSSProperties}
              >
                <div className="relative aspect-[3/4]">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 260px, 50vw" unoptimized={!isOptimizable(photo.src)} className="object-cover" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          LOCAL — bus route + cork notice board FAQs
      ====================================================== */}
      <section className="py-20">
        <div className="container-pad grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <span className="eyebrow"><MapPin className="h-3.5 w-3.5 text-[#e58d73]" />Right here in Tiruppur</span>
            <h2 className="mt-5 font-display text-3xl font-bold text-emerald-950 sm:text-4xl lg:text-5xl">A neighbourhood preschool <span className="text-[#e2725b]">families trust.</span></h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Located on Kangayam Road in Valliammai Nagar, Little Mahilam welcomes children from across {site.areasServed.slice(0, 4).join(", ")} and nearby areas of Tiruppur. Visit us to see why parents choose us as their child&apos;s first school.
            </p>
            {/* Bus route through the neighbourhoods */}
            <div className="relative mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_40px_-28px_rgba(23,60,47,.5)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7c85b] text-emerald-950"><Bus className="h-6 w-6" /></span>
                <p className="font-display text-lg font-bold text-emerald-950">Our happy route</p>
              </div>
              <ol className="relative mt-5 flex flex-wrap gap-x-2 gap-y-4">
                {site.areasServed.map((area, i) => (
                  <li key={area} className="flex items-center gap-2">
                    <span className="flex items-center gap-2 rounded-full border-2 bg-white py-1.5 pl-1.5 pr-3.5 text-sm font-bold text-emerald-950" style={{ borderColor: PASTELS[i % PASTELS.length].solid }}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ backgroundColor: PASTELS[i % PASTELS.length].solid }}>{i + 1}</span>
                      {area}
                    </span>
                    {i < site.areasServed.length - 1 && <span aria-hidden className="w-5 border-t-2 border-dashed border-emerald-900/30" />}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/preschool-in-tiruppur" className="btn-primary">Why parents choose us <ArrowRight className="h-4 w-4" /></Link>
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft">Get directions</a>
            </div>
          </div>

          {/* Cork notice board */}
          <div className="rounded-[28px] border-[10px] border-[#9c6d3f] bg-[#c99b6d] p-5 shadow-[0_24px_50px_-28px_rgba(90,60,20,.6)] [background-image:radial-gradient(rgba(0,0,0,.08)_1px,transparent_1.5px)] [background-size:9px_9px] md:p-7">
            <p className="mx-auto w-fit -rotate-2 bg-white px-5 py-2 font-display text-lg font-bold text-emerald-950 shadow">Parents often ask</p>
            <div className="mt-5 grid gap-4">
              {HOME_FAQS.slice(0, 4).map((faq, i) => (
                <details key={faq.q} className="group relative bg-[#fffdf6] px-5 pb-4 pt-5 shadow-md" style={{ rotate: i % 2 ? "0.8deg" : "-0.8deg" }}>
                  <Pin aria-hidden className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rotate-12" style={{ color: PASTELS[i].solid, fill: PASTELS[i].solid }} />
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-emerald-950">{faq.q}<span className="text-xl text-emerald-700 transition group-open:rotate-45">+</span></summary>
                  <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
            <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow">All FAQs <ArrowRight className="h-4 w-4" /></Link>
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
