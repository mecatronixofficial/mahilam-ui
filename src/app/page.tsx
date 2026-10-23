import { pageContent, contentText, contentImage } from "@/lib/page-content";
import type { Metadata } from "next";
import Image from "@/components/media/SchoolImage";
import Link from "next/link";
import { ArrowRight, Baby, BookOpen, Brain, Bus, Camera, Heart, MapPin, Music2, Palette, Plus, Puzzle, Shapes, Sparkles, Star, Sun } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { AnnouncementBar } from "@/components/public/AnnouncementBar";
import { HeroSlider } from "@/components/public/HeroSlider";
import { HomeMarquee } from "@/components/public/HomeMarquee";
import { HomeIntro } from "@/components/public/HomeIntro";
import { WelcomeCollage } from "@/components/public/WelcomeCollage";
import { CardSlider } from "@/components/public/CardSlider";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { ExploreMore } from "@/components/public/ExploreMore";
import { TestimonialsDynamic } from "@/components/public/TestimonialsDynamic";
import { ParentReviewForm } from "@/components/public/ParentReviewForm";
import { ArrowBubble, MarkedWord, Shape, StairsBackdrop, PALETTE, TONES, type ShapeName } from "@/components/public/PlayShapes";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { CursorLabel } from "@/components/animations/CursorLabel";
import { FloatingShape } from "@/components/animations/FloatingShape";
import { Drift } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { ANNOUNCEMENT_POPUP_KEY, getPublic, isPopupEnabled, type Banner, type HomeData, type Program, type Testimonial } from "@/lib/server-api";
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

const FALLBACK_PROGRAMS = [
  { title: "Play Group", age: "2 – 3 years", image: "/images/programs/play-group.webp" },
  { title: "Pre-KG", age: "3 – 4 years", image: "/images/programs/pre-kg.webp" },
  { title: "LKG", age: "4 – 5 years", image: "/images/programs/kindergarten.webp" },
  { title: "UKG", age: "5 – 6 years", image: "/images/programs/primary.webp" },
];

const ACTIVITIES = [
  { icon: Palette, title: "Art & Craft", text: "Colours, painting, craft and imagination." },
  { icon: Music2, title: "Music & Dance", text: "Rhythm, songs, movement and expression." },
  { icon: BookOpen, title: "Story Time", text: "Stories that grow vocabulary and imagination." },
  { icon: Puzzle, title: "Puzzle Play", text: "Fun challenges for thinking and problem-solving." },
  { icon: Shapes, title: "Creative Play", text: "Shapes, patterns and concepts through play." },
  { icon: Sun, title: "Outdoor Fun", text: "Running, games and happy outdoor time." },
];
/** Each activity sits inside its own shape. */
const ACTIVITY_TILES: { shape: ShapeName; color: string; rotate: number }[] = [
  { shape: "cloud", color: PALETTE.pink, rotate: -4 },
  { shape: "pebble", color: PALETTE.mint, rotate: 3 },
  { shape: "flower", color: "#fff", rotate: -2 },
  { shape: "heart", color: PALETTE.peach, rotate: 4 },
  { shape: "blob", color: PALETTE.blush, rotate: -3 },
  { shape: "cloud", color: PALETTE.sun, rotate: 2 },
];

const PILLARS = [
  { icon: Heart, title: "Child-Centric", text: "Every child learns at their own pace with care, attention and encouragement." },
  { icon: Shapes, title: "Play-Way Learning", text: "Concepts come alive through play, stories, games and hands-on activities." },
  { icon: Brain, title: "Multiple Intelligence", text: "We nurture creativity, language, movement, music, social and thinking skills." },
];
const PILLAR_SHAPES: ShapeName[] = ["flower", "burst", "cloud"];
/** Child-Centric green, Play-Way Learning yellow, Multiple Intelligence blue (indexes into TONES). */
const PILLAR_TONES = [0, 1, 3];

const WELCOME = ["Happy learning spaces", "Caring, trained teachers", "Creative daily activities", "Individual attention", "Play-based curriculum", "Safe, child-friendly campus"];
const BULLET_SHAPES: ShapeName[] = ["pebble", "burst", "leaf", "plus", "flower", "tri"];

/** Fanned "hand of photos": rotation and horizontal offset per card (desktop). */
const FAN = [
  { rotate: "-14deg", left: "0%", top: "28px" },
  { rotate: "-5deg", left: "22%", top: "6px" },
  { rotate: "5deg", left: "44%", top: "6px" },
  { rotate: "14deg", left: "66%", top: "28px" },
];

/** Per-card hover personality: how far each program card lifts and which way it leans. */
const CARD_LIFT = [8, 6, 10, 7];
const CARD_TILT = [-0.8, 0.6, -0.4, 0.9];

/** Card colour variables for `.lm-card` (background + hover background, lift and lean). */
const cardVars = (i: number) => {
  const tone = TONES[i % TONES.length];
  return { "--bg": tone.bg, "--bg-hover": tone.hover, "--lift": `${CARD_LIFT[i % 4]}px`, "--tilt": `${CARD_TILT[i % 4]}deg` } as React.CSSProperties;
};

export default async function Home() {
  const [banners, home, testimonials, programs, settings] = await Promise.all([
    // Hero banners are managed live in Admin; never leave a newly published slide
    // hidden behind the general five-minute CMS cache.
    getPublic<Banner[]>("/banners", 0),
    getPublic<HomeData>("/home", 0),
    getPublic<Testimonial[]>("/testimonials", 0),
    // Programs are managed live in Admin; keep the homepage cards in sync
    // with the Programs page immediately after publishing.
    getPublic<Program[]>("/programs", 0),
    getPublic<Record<string, unknown>>("/settings", 0),
  ]);
  // Admins can switch the announcement popup off from Admin → Announcements.
  const content = pageContent(settings, "home");
  const showAnnouncement = isPopupEnabled(settings?.[ANNOUNCEMENT_POPUP_KEY]);

  const programCards = programs?.length
    ? programs.slice(0, 6).map((p, i) => ({ title: p.name, age: p.ageGroup || "", image: p.coverImage || FALLBACK_PROGRAMS[i % 4].image }))
    : FALLBACK_PROGRAMS;
  const defaultMoments = Array.from({ length: 4 }, (_, i) => ({ src: `/images/home/moment-${i}.webp`, alt: `School moment ${i + 1}` }));

  const moments = defaultMoments.map((photo, i) => contentImage(content.moments, `photo${i}`, photo.src, photo.alt));

  return (
    <PublicShell>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <AnnouncementBar announcement={showAnnouncement ? home?.announcements?.[0] ?? null : null} />
      <HomeIntro />
      <CursorLabel />
      <div className="lm-play">
        <HeroSlider content={content.hero} banners={banners ?? []} />
        <HomeMarquee />

        {/* ======================================================
            PILLARS — cards arrive fanned out and straighten up
        ====================================================== */}
        <section className="relative overflow-hidden pb-20 pt-12 md:pb-28 md:pt-16">
          <Drift className="absolute -left-14 top-28 hidden w-44 lg:block" y={50} rotate={18}><Shape name="arch" color={PALETTE.butter} /></Drift>
          <Drift className="absolute -right-10 bottom-10 hidden w-32 lg:block" y={70} rotate={-30}><Shape name="plus" color={PALETTE.mint} /></Drift>
          <div className="container-pad relative">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <Reveal as="span" variant="drop" className="lm-eyebrow"><Sparkles className="h-4 w-4" />{contentText(content.pillars, "eyebrow") || "Happy learning"}</Reveal>
              <AnimatedText className="lm-title mt-5">{contentText(content.pillars, "heading") || <>Little minds. <MarkedWord shape="burst" color={PALETTE.sun} rotate={8}>Big</MarkedWord> imagination.</>}</AnimatedText>
              <Reveal as="p" variant="rise" delay={0.25} className="lm-lead mx-auto mt-5 max-w-xl">{contentText(content.pillars, "description") || <>A joyful learning environment in Tiruppur where every child can play, explore, create, communicate and grow with confidence.</>}</Reveal>
            </div>
            <Reveal variant="tilt" className="grid gap-5 md:grid-cols-3">
              {PILLARS.map(({ icon: Icon, title, text }, i) => (
                <article key={title} data-reveal-item className="lm-card group relative flex flex-col items-start overflow-hidden px-8 pb-10 pt-8" style={cardVars(PILLAR_TONES[i])}>
                  <span data-pop className="relative grid h-24 w-24 place-items-center transition-[rotate] duration-500 group-hover:rotate-12">
                    <Shape name={PILLAR_SHAPES[i]} color={TONES[PILLAR_TONES[i]].shape} className="absolute inset-0 h-full w-full" />
                    <Icon className="relative h-9 w-9 text-little-green-900" />
                  </span>
                  <h3 className="mt-8 text-3xl font-extrabold tracking-tight">{contentText(content.pillars, `title${i}`) || title}</h3>
                  <p className="mt-3 max-w-xs leading-7 text-little-green-900/75">{contentText(content.pillars, `text${i}`) || text}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ======================================================
            WELCOME — scrapbook collage: taped polaroid, photo sticker, crayon doodles
        ====================================================== */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <Drift className="absolute -left-10 top-0 h-full w-[70%] lg:w-[48%]" y={40}><StairsBackdrop className="inset-0 h-full w-full" /></Drift>
          <div className="container-pad relative grid items-center gap-14 lg:grid-cols-2">
            <WelcomeCollage content={content.welcome} />
            <div>
              <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.blue } as React.CSSProperties}><Baby className="h-4 w-4" />{contentText(content.welcome, "eyebrow") || "Welcome little learners"}</Reveal>
              <AnimatedText className="lm-title mt-5 max-w-xl">{contentText(content.welcome, "heading") || <>A school filled with smiles, <MarkedWord shape="cloud" color={PALETTE.peach} rotate={-4}>stories</MarkedWord> and discovery.</>}</AnimatedText>
              <Reveal as="p" variant="rise" delay={0.2} className="lm-lead mt-6 max-w-xl">{contentText(content.welcome, "description") || <>Little Mahilam Preschool gives children in Tiruppur a happy, secure and inspiring beginning to their learning journey — through play, movement, stories, creativity and meaningful everyday experiences.</>}</Reveal>
              <Reveal as="ul" variant="drop" stagger={0.06} delay={0.3} className="mt-8 flex flex-wrap gap-2.5">
                {WELCOME.map((item, i) => (
                  <li key={item} data-reveal-item className="flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 text-sm font-bold ring-2 ring-little-green-900/10">
                    <Shape name={BULLET_SHAPES[i]} color={TONES[i % TONES.length].shape} className="h-5 w-5" />{item}
                  </li>
                ))}
              </Reveal>
              <Reveal variant="rise" delay={0.4} className="mt-9"><Link href="/about" className="lm-btn">Discover our school <ArrowBubble /></Link></Reveal>
            </div>
          </div>
        </section>

        {/* ======================================================
            PROGRAMS — every card rises with its own height and lean
        ====================================================== */}
        <section className="py-20 md:py-28">
          <div className="container-pad">
            <Reveal variant="cards">
              <CardSlider
                label="Our programs"
                itemClassName="w-[58%] sm:w-[30%] lg:w-[18%]"
                heading={
                  <>
                    <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.coral } as React.CSSProperties}><Star className="h-4 w-4" />{contentText(content.programs, "eyebrow") || "Our programs"}</Reveal>
                    <AnimatedText className="lm-title mt-5 max-w-3xl">{contentText(content.programs, "heading") || <>A happy learning journey for every <MarkedWord shape="heart" color={PALETTE.pink} rotate={-6}>age.</MarkedWord></>}</AnimatedText>
                    <Link href="/programs" className="lm-link mt-6">View all programs <ArrowRight className="h-4 w-4" /></Link>
                  </>
                }
              >
                {programCards.map((program, i) => {
                  const tone = TONES[i % TONES.length];
                  return (
                    <Link href="/programs" key={program.title} data-reveal-item data-cursor="View" className="lm-card group flex h-full flex-col p-2 pb-3" style={cardVars(i)}>
                      <div className="relative aspect-[5/4] overflow-hidden rounded-[16px]">
                        <Image src={program.image} alt={`${program.title} children learning at Little Mahilam, Tiruppur`} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 42vw, 78vw" unoptimized={!isOptimizable(program.image)} className="object-cover transition duration-700 group-hover:scale-105" />
                        <span data-drop className="absolute left-2 top-2 grid h-10 w-10 -rotate-6 place-items-center transition-[rotate] duration-500 group-hover:rotate-12">
                          <Shape name="burst" color={tone.shape} className="absolute inset-0 h-full w-full" />
                          <span className="relative text-base font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                        </span>
                      </div>
                      <div className="px-2 pt-3">
                        {program.age && <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold">{program.age}</span>}
                        <h3 className="mt-2 text-xl font-extrabold tracking-tight">{program.title}</h3>
                        <span className="lm-link mt-2 text-xs">Explore program <ArrowRight className="h-3.5 w-3.5" /></span>
                      </div>
                    </Link>
                  );
                })}
              </CardSlider>
            </Reveal>
          </div>
        </section>

        {/* ======================================================
            ACTIVITIES — panel grows in, toy-shaped tiles tumble down
        ====================================================== */}
        <section className="relative px-2 sm:px-3">
          {/* Shapes that sit across the panel's edge, tying it to the section above */}
          <div className="absolute left-[8%] -top-10 z-10 w-20 sm:w-28"><FloatingShape name="sun" color={PALETTE.sun} duration={6} /></div>
          <div className="absolute -bottom-8 right-[10%] z-10 w-16 sm:w-24"><FloatingShape name="heart" color={PALETTE.coral} rotate={10} duration={5.4} /></div>
          <Reveal variant="panel" start="top 90%" className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-little-blue-100 px-4 py-20 sm:rounded-[48px] md:py-28">
            <Drift className="absolute -right-24 -top-16 w-80 opacity-70" y={40} rotate={20}><Shape name="arch" color="#fff" /></Drift>
            <div className="absolute bottom-10 left-[3%] hidden w-24 lg:block"><FloatingShape name="squiggle" color={PALETTE.blue} rotate={18} duration={6.2} /></div>
            <div className="container-pad relative">
              <div className="mx-auto max-w-3xl text-center">
                <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.blue } as React.CSSProperties}><Sun className="h-4 w-4" />{contentText(content.activities, "eyebrow") || "Fun every day"}</Reveal>
                <AnimatedText className="lm-title mt-5">{contentText(content.activities, "heading") || <>More than books. More ways to <MarkedWord shape="leaf" color={PALETTE.leaf} rotate={-10}>grow.</MarkedWord></>}</AnimatedText>
                <Reveal as="p" variant="rise" delay={0.2} className="lm-lead mx-auto mt-5 max-w-2xl">{contentText(content.activities, "description") || <>Every day includes creative, physical, social and imaginative activities for young children.</>}</Reveal>
              </div>
              <Reveal variant="gravity" start="top 75%" className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {ACTIVITIES.map(({ icon: Icon, title, text }, i) => {
                  const tile = ACTIVITY_TILES[i];
                  return (
                    <div key={title} data-reveal-item className={`group mx-auto grid aspect-square w-full max-w-[290px] place-items-center ${i % 2 ? "lg:translate-y-10" : ""}`}>
                      <Shape name={tile.shape} color={tile.color} className="col-start-1 row-start-1 h-full w-full transition-transform duration-500 group-hover:scale-105" style={{ rotate: `${tile.rotate}deg` }} />
                      <div className="relative col-start-1 row-start-1 flex max-w-[78%] flex-col items-center text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-little-green-900 text-white transition-transform duration-500 group-hover:-rotate-12 sm:h-14 sm:w-14"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></span>
                        <h3 className="mt-3 text-base font-extrabold tracking-tight sm:text-2xl">{title}</h3>
                        <p className="mt-1 hidden text-sm leading-6 text-little-green-900/75 sm:block">{text}</p>
                      </div>
                    </div>
                  );
                })}
              </Reveal>
              <Reveal variant="rise" className="mt-20 text-center"><Link href="/activities" className="lm-btn">Discover activities <ArrowBubble /></Link></Reveal>
            </div>
          </Reveal>
        </section>

        {/* ======================================================
            MOMENTS — photos are dealt out into a fanned hand
        ====================================================== */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <Drift className="absolute -right-24 top-10 w-[420px] opacity-80" y={80} rotate={12}><Shape name="blob" color={PALETTE.blush} /></Drift>
          <div className="container-pad relative grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.pink } as React.CSSProperties}><Camera className="h-4 w-4" />{contentText(content.moments, "eyebrow") || "Happy moments"}</Reveal>
              <AnimatedText className="lm-title mt-5 max-w-xl">{contentText(content.moments, "heading") || <>Little moments. <MarkedWord shape="pebble" color={PALETTE.pink} rotate={0}>Beautiful</MarkedWord> memories.</>}</AnimatedText>
              <Reveal as="p" variant="rise" delay={0.2} className="lm-lead mt-5 max-w-md">{contentText(content.moments, "description") || <>A peek into the everyday smiles, friendships and discoveries at our school.</>}</Reveal>
              <Reveal variant="rise" delay={0.3} className="mt-8"><Link href="/gallery" className="lm-btn">Open gallery <ArrowBubble /></Link></Reveal>
            </div>
            {/* Phones: 2×2 grid. Large screens: fanned cards that spread on hover. */}
            <Reveal variant="deal" stagger={0.12} className="group/fan relative grid grid-cols-2 gap-3 lg:block lg:h-[400px]">
              {moments.map((photo, i) => (
                <Link
                  href="/gallery"
                  key={`${photo.src}-${i}`}
                  data-reveal-item
                  data-cursor="View"
                  className="relative block overflow-hidden rounded-[26px] border-[6px] border-little-cream-100 transition-all duration-500 lg:absolute lg:left-(--fan-left) lg:top-(--fan-top) lg:z-(--fan-z) lg:w-[34%] lg:[rotate:var(--fan-rotate)] lg:group-hover/fan:[rotate:0deg] lg:hover:z-20 lg:hover:scale-105"
                  style={{ "--fan-rotate": FAN[i].rotate, "--fan-left": FAN[i].left, "--fan-top": FAN[i].top, "--fan-z": i === 1 || i === 2 ? 2 : 1 } as React.CSSProperties}
                >
                  <div className="relative aspect-[3/4]">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 260px, 50vw" unoptimized={!isOptimizable(photo.src)} className="object-cover" />
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ======================================================
            LOCAL — route stops pop in one by one, FAQs slide in
        ====================================================== */}
        <section className="py-20 md:py-28">
          <div className="container-pad grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
            <div>
              <Reveal as="span" variant="drop" className="lm-eyebrow" style={{ "--dot": PALETTE.sun } as React.CSSProperties}><MapPin className="h-4 w-4" />{contentText(content.neighbourhood, "eyebrow") || "Right here in Tiruppur"}</Reveal>
              <AnimatedText className="lm-title mt-5">{contentText(content.neighbourhood, "heading") || <>A neighbourhood preschool families <MarkedWord shape="sun" color={PALETTE.sun} rotate={4}>trust.</MarkedWord></>}</AnimatedText>
              <Reveal as="p" variant="rise" delay={0.2} className="lm-lead mt-6 max-w-xl">{contentText(content.neighbourhood, "description") || <>
                Located on Kangayam Road in Valliammai Nagar, Little Mahilam welcomes children from across {site.areasServed.slice(0, 4).join(", ")} and nearby areas of Tiruppur. Visit us to see why parents choose us as their child&apos;s first school.
              </>}</Reveal>
              {/* Route through the neighbourhoods */}
              <Reveal variant="left" className="relative mt-9 overflow-hidden rounded-[28px] bg-little-yellow-100 p-6 sm:p-8">
                <Shape name="tri" color={PALETTE.sun} className="pointer-events-none absolute -right-6 -top-8 w-24 rotate-12" />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-little-green-900 text-white"><Bus className="h-6 w-6" /></span>
                  <p className="text-xl font-extrabold tracking-tight">Our happy route</p>
                </div>
                <Reveal as="ol" variant="pop" stagger={0.12} delay={0.3} className="relative mt-6 flex flex-wrap gap-x-2 gap-y-4">
                  {site.areasServed.map((area, i) => (
                    <li key={area} data-reveal-item className="flex items-center gap-2">
                      <span className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-bold">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-little-green-900 text-[11px] font-extrabold text-white">{i + 1}</span>
                        {area}
                      </span>
                      {i < site.areasServed.length - 1 && <span aria-hidden className="w-5 border-t-2 border-dashed border-little-green-900/40" />}
                    </li>
                  ))}
                </Reveal>
              </Reveal>
              <Reveal variant="rise" delay={0.2} className="mt-9 flex flex-wrap items-center gap-5">
                <Link href="/preschool-in-tiruppur" className="lm-btn">Why parents choose us <ArrowBubble /></Link>
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="lm-link">Get directions</a>
              </Reveal>
            </div>

            {/* FAQ accordion */}
            <Reveal variant="right" className="lm-panel relative overflow-hidden p-6 md:p-10">
              <Shape name="plus" color={PALETTE.pink} className="pointer-events-none absolute -right-6 -top-6 w-24 rotate-12" />
              <p className="relative text-3xl font-extrabold tracking-tight">Parents often ask</p>
              <Reveal variant="rise" stagger={0.08} delay={0.25} className="relative mt-6 border-b-2 border-little-green-900/15">
                {HOME_FAQS.slice(0, 4).map((faq) => (
                  <details key={faq.q} data-reveal-item className="group border-t-2 border-little-green-900/15 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold leading-snug">
                      {faq.q}
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-little-green-900 text-white transition-transform duration-300 group-open:rotate-45"><Plus className="h-4 w-4" /></span>
                    </summary>
                    <p className="mt-3 pr-12 leading-7 text-little-green-900/75">{faq.a}</p>
                  </details>
                ))}
              </Reveal>
              <Link href="/faq" className="lm-btn relative mt-8">All FAQs <ArrowBubble /></Link>
            </Reveal>
          </div>
        </section>

        <ExploreMore content={content.explore} variant="playful" />
        <TestimonialsDynamic content={content.testimonials} rows={testimonials ?? []} variant="playful" />
        <ParentReviewForm content={content["review-form"]} />
        <AdmissionsCta title={contentText(content.admissions, "heading")} eyebrow={contentText(content.admissions, "eyebrow")} description={contentText(content.admissions, "description")} variant="playful" />
      </div>
    </PublicShell>
  );
}
