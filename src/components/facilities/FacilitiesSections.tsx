import Image from "@/components/media/SchoolImage";
import { Blocks, Camera, HeartHandshake, MapPin, Navigation, Phone, Smile, Sparkles, Sofa, Sprout } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { isOptimizable } from "@/lib/media";
import { site } from "@/lib/site";
import { StarDoodle } from "@/components/about/Doodles";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Appear } from "@/components/animations/Appear";
import { Reveal } from "@/components/animations/Reveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { fx } from "@/components/animations/fx";
import { CtaLink, Eyebrow, type Photo } from "@/components/public/PageKit";
import { SPACE_ICONS, type Space } from "./data";

const rise = (d: number) => fx({ y: 24, d, dur: 0.9, ease: "spring" });

/* ==================================================================
   Hero — "Welcome to Our Happy Spaces"
================================================================== */

export function FacilitiesHero({ photos }: { photos: [Photo, Photo | null] }) {
  const [main, second] = photos;
  return (
    <section className="relative overflow-hidden" style={{ background: BRAND.cream.base }}>
      <div data-in="" className="container-pad relative grid items-center gap-8 pb-12 pt-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-12 lg:pb-14 lg:pt-8">
        <div className="relative z-10 text-center lg:text-left">
          <span style={rise(0)} className="fx inline-block"><Eyebrow icon={<Sparkles className="h-4 w-4 text-little-yellow-600" />}>Our Facilities</Eyebrow></span>
          <AnimatedText as="h1" trigger="load" delay={0.1} className="mt-5 text-balance font-display text-[clamp(2.6rem,6.2vw,5.2rem)] font-bold leading-[1.02] tracking-tight text-little-green-950">
            Little Spaces. <span className="text-little-green-700">Big Possibilities.</span>
          </AnimatedText>
          <p style={rise(0.45)} className="fx mx-auto mt-5 max-w-xl text-lg leading-8 text-little-neutral-600 lg:mx-0">
            Thoughtfully designed spaces where children can explore, learn, play, and grow with happiness.
          </p>
          <div style={rise(0.55)} className="fx mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <CtaLink href="#spaces">Explore Our Spaces</CtaLink>
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-little-green-900 underline decoration-little-green-900/30 decoration-2 underline-offset-4 hover:decoration-little-green-900">
              <MapPin className="h-4 w-4 text-little-coral-500" /> Kangayam Road, Tiruppur
            </a>
          </div>
        </div>

        {/* Overlapping photo composition */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <span aria-hidden style={fx({ s: 0.6, d: 0.1, dur: 1 })} className="fx absolute -right-6 -top-6 h-40 w-40 rounded-full bg-little-yellow-200" />
          <span aria-hidden style={fx({ s: 0.6, d: 0.2, dur: 1 })} className="fx absolute -bottom-5 left-[18%] h-24 w-48 rounded-t-full bg-little-pink-100" />
          <Reveal variant="clip-up" className="relative">
            <ParallaxImage amount={6} className="relative aspect-[4/4.6] rounded-[44px] shadow-[0_40px_70px_-40px_rgba(36,68,32,.6)] sm:aspect-[4/4.2]">
              <div data-reveal-media="" className="absolute inset-0">
                <Image src={main.src} alt={main.alt} fill priority sizes="(min-width: 1024px) 560px, 92vw" unoptimized={main.unoptimized} className="object-cover" />
              </div>
            </ParallaxImage>
          </Reveal>
          {second && (
            <div style={fx({ x: -40, y: 30, d: 0.6, dur: 1, ease: "spring" })} className="fx absolute -bottom-6 -left-3 w-[40%] sm:-left-8">
              <div className="relative aspect-square overflow-hidden rounded-[32px] border-8 border-white shadow-xl transition-transform duration-500 hover:-rotate-2 hover:scale-105">
                <Image src={second.src} alt={second.alt} fill sizes="220px" unoptimized={second.unoptimized} className="object-cover" />
              </div>
            </div>
          )}
          <span style={fx({ y: -20, s: 0.7, d: 0.8, dur: 0.8, ease: "back" })} className="fx absolute -right-2 bottom-[14%] rounded-2xl bg-white px-4 py-3 text-left shadow-[0_18px_30px_-20px_rgba(36,68,32,.7)] sm:-right-6">
            <span className="block text-[11px] font-extrabold uppercase tracking-[.16em] text-little-green-800/60">Made for</span>
            <span className="block font-display text-lg font-bold text-little-green-950">little learners</span>
          </span>
          <StarDoodle className="pointer-events-none absolute left-[6%] top-[6%] w-7 animate-twinkle" />
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   Explore Our School — alternating editorial rows
================================================================== */

/** Soft illustrated panel for a space without photos yet (never a borrowed photo). */
export function SpacePlaceholder({ space, className = "" }: { space: Space; className?: string }) {
  const Icon = SPACE_ICONS[space.icon];
  return (
    <div className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden ${className}`} style={{ background: space.tint }}>
      <span aria-hidden className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/40" />
      <span aria-hidden className="absolute -bottom-12 -right-6 h-44 w-44 rounded-[40%] bg-white/30" />
      <span className="relative grid h-20 w-20 place-items-center rounded-[28px] bg-white text-little-green-900 shadow-sm"><Icon className="h-9 w-9" strokeWidth={1.8} /></span>
      <span className="relative inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.16em] text-little-green-900/55"><Camera className="h-3.5 w-3.5" />Photos coming soon</span>
    </div>
  );
}

export function SpacesEditorial({ spaces }: { spaces: Space[] }) {
  const featured = spaces.slice(0, 3);
  const rest = spaces.slice(3);
  return (
    <div>
      <div className="space-y-10 md:space-y-14">
        {featured.map((s, i) => {
          const flip = i % 2 === 1;
          const photo = s.photos[0];
          return (
            <article key={s.id} className="group/space grid items-center gap-6 md:grid-cols-2 md:gap-12">
              <Reveal variant={flip ? "clip-left" : "clip-up"} className={flip ? "md:order-2" : ""}>
                <div className="relative overflow-hidden rounded-[36px] shadow-[0_30px_60px_-40px_rgba(36,68,32,.6)] transition-[translate,box-shadow] duration-500 group-hover/space:-translate-y-1.5 group-hover/space:shadow-[0_40px_70px_-40px_rgba(36,68,32,.7)]">
                  {photo ? (
                    <div data-reveal-media="" className="relative aspect-[4/3]">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 50vw, 92vw" unoptimized={!isOptimizable(photo.src)} className="object-cover transition-transform duration-700 ease-out group-hover/space:scale-105" />
                    </div>
                  ) : (
                    <SpacePlaceholder space={s} className="aspect-[4/3]" />
                  )}
                </div>
              </Reveal>
              <Appear x={flip ? -30 : 30} y={0} className={flip ? "md:order-1" : ""}>
                <p className="font-display text-sm font-bold text-little-coral-500">0{i + 1}</p>
                <h3 className="mt-1 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-[1.08] text-little-green-950">{s.title}</h3>
                <p className="mt-3 max-w-md text-[17px] leading-8 text-little-neutral-600">{s.description}</p>
                {s.labels.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.labels.map((l) => <li key={l} className="rounded-full border border-little-green-900/15 bg-white px-3 py-1.5 text-sm font-bold text-little-green-900">{l}</li>)}
                  </ul>
                )}
              </Appear>
            </article>
          );
        })}
      </div>

      {rest.length > 0 && (
        <Reveal variant="rise" stagger={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => {
            const Icon = SPACE_ICONS[s.icon];
            const photo = s.photos[0];
            return (
              <article key={s.id} data-reveal-item="" className="group/space flex gap-4 rounded-[28px] bg-white p-4 shadow-[0_16px_30px_-26px_rgba(36,68,32,.6)] ring-1 ring-little-green-900/5 transition-[translate] duration-300 hover:-translate-y-1">
                <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[22px]" style={{ background: s.tint }}>
                  {photo ? <Image src={photo.src} alt={photo.alt} fill sizes="80px" unoptimized={!isOptimizable(photo.src)} className="object-cover" /> : <Icon className="h-8 w-8 text-little-green-900" strokeWidth={1.8} />}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-little-green-950">{s.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-little-neutral-600">{s.description}</p>
                </div>
              </article>
            );
          })}
        </Reveal>
      )}
    </div>
  );
}

/* ==================================================================
   Safe, Caring & Comfortable
================================================================== */

const PRACTICES = [
  { title: "Child-friendly learning spaces", text: "Rooms are organised around young learners, with ease of movement in mind.", icon: Smile },
  { title: "Clean, organised rooms", text: "Materials have a place, so children can find them, use them and help tidy up.", icon: Sparkles },
  { title: "Caring supervision", text: "Teachers stay close during play and learning, ready to help and encourage.", icon: HeartHandshake },
  { title: "Age-appropriate resources", text: "Toys, books and materials are matched to what each age group is ready to explore.", icon: Blocks },
  { title: "Comfortable spaces for play", text: "Cheerful, welcoming rooms help children feel relaxed and ready to join in.", icon: Sofa },
];

export function SafeCaring({ photo }: { photo: Photo | null }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
      <Reveal variant="clip-up" className="relative mx-auto w-full max-w-md">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[40px] bg-little-green-100">
          {photo ? (
            <div data-reveal-media="" className="absolute inset-0"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 420px, 90vw" unoptimized={photo.unoptimized} className="object-cover" /></div>
          ) : (
            <div className="grid h-full place-items-center"><Sprout className="h-20 w-20 text-little-green-600" strokeWidth={1.5} /></div>
          )}
        </div>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-little-green-950 shadow-lg">A calm place to begin</span>
      </Reveal>

      <div>
        <Appear y={20}>
          <Eyebrow icon={<HeartHandshake className="h-4 w-4 text-little-pink-500" />}>For Parents</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold leading-[1.08] text-little-green-950">Safe, caring <span className="text-little-green-700">&amp; comfortable.</span></h2>
          <p className="mt-3 max-w-xl text-[17px] leading-8 text-little-neutral-600">How our spaces and routines help little ones feel secure from the moment they arrive.</p>
        </Appear>
        <Reveal as="ul" variant="rise" stagger={0.08} className="mt-6 divide-y divide-little-green-900/10 border-y border-little-green-900/10">
          {PRACTICES.map(({ title, text, icon: Icon }) => (
            <li key={title} data-reveal-item="" className="group/p flex items-start gap-4 py-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-little-green-50 text-little-green-800 transition-colors duration-300 group-hover/p:bg-little-yellow-200"><Icon className="h-5 w-5" /></span>
              <div>
                <h3 className="font-display text-lg font-bold text-little-green-950">{title}</h3>
                <p className="mt-0.5 text-[15px] leading-7 text-little-neutral-600">{text}</p>
              </div>
            </li>
          ))}
        </Reveal>
        <p className="mt-4 text-sm font-semibold text-little-neutral-500">Have a question about our spaces or daily routines? We&apos;re happy to walk you through them in person.</p>
      </div>
    </div>
  );
}

/* ==================================================================
   Visit Our School
================================================================== */

export function VisitSchool() {
  return (
    <div className="grid overflow-hidden rounded-[40px] bg-white shadow-[0_30px_60px_-44px_rgba(36,68,32,.7)] ring-1 ring-little-green-900/5 lg:grid-cols-[1.1fr_.9fr] sm:rounded-[56px]">
      <div className="p-6 sm:p-10">
        <AnimatedText className="text-balance font-display text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[1.04] text-little-green-950">
          Come Explore Our <span className="text-little-coral-500">Happy Place!</span>
        </AnimatedText>
        <Appear d={0.15}>
          <p className="mt-4 max-w-lg text-lg leading-8 text-little-neutral-600">We would love to welcome you and show you the spaces where little learners begin their journeys.</p>
        </Appear>
        <Appear d={0.25} className="mt-6 flex flex-wrap gap-3">
          <CtaLink href="/admissions" tone="pink">Enquire About Admissions</CtaLink>
          <CtaLink href="/contact" tone="light">Contact Our School</CtaLink>
        </Appear>

        <address className="mt-8 not-italic">
          <p className="flex items-start gap-3 text-[15px] leading-7 text-little-green-950">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-little-coral-500" />
            <span><span className="block font-display font-bold">{site.name}</span>{site.fullAddress}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 pl-8 text-sm font-bold">
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-little-green-800 underline decoration-2 underline-offset-4">
              <Navigation className="h-4 w-4" /> Open in Google Maps
            </a>
            {site.phone && <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 text-little-green-800 underline decoration-2 underline-offset-4"><Phone className="h-4 w-4" />{site.phone}</a>}
          </div>
        </address>
      </div>

      {/* Little illustrated map */}
      <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Open our location in Google Maps" className="group/map relative block min-h-[260px] overflow-hidden bg-little-green-50">
        <svg aria-hidden viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <rect width="400" height="320" fill={BRAND.green[50]} />
          {[[30, 30, 90, 70], [150, 20, 110, 60], [290, 40, 90, 80], [20, 200, 100, 90], [270, 210, 110, 90]].map(([x, y, w, h]) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="14" fill={BRAND.green[100]} />)}
          <path d="M-10 150 C 120 130, 260 170, 410 140" stroke="#fff" strokeWidth="34" fill="none" />
          <path d="M-10 150 C 120 130, 260 170, 410 140" stroke={BRAND.yellow[300]} strokeWidth="3" strokeDasharray="14 12" fill="none" />
          <path d="M200 -10 C 190 90, 215 220, 200 330" stroke="#fff" strokeWidth="18" fill="none" />
          <text x="40" y="128" fontSize="14" fontWeight="800" fill={BRAND.green[800]} fontFamily="var(--font-fredoka), sans-serif">Kangayam Road</text>
          <circle cx="240" cy="110" r="40" fill={BRAND.coral[400]} opacity=".15" />
        </svg>
        <span className="absolute left-[60%] top-[34%] -translate-x-1/2 -translate-y-full">
          <span className="block animate-bounce motion-reduce:animate-none">
            <svg aria-hidden viewBox="0 0 40 52" className="w-11 drop-shadow-md"><path d="M20 50 C 20 50 2 30 2 18 A18 18 0 0 1 38 18 C 38 30 20 50 20 50 Z" fill={BRAND.coral[500]} /><circle cx="20" cy="18" r="7" fill="#fff" /></svg>
          </span>
        </span>
        <span className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-4 py-3 font-display text-sm font-bold text-little-green-950 shadow-md transition-transform group-hover/map:-translate-y-1">Little Mahilam · Valliammai Nagar, Tiruppur</span>
      </a>
    </div>
  );
}
