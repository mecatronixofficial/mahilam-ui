import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Camera,
  Heart,
  Music2,
  PartyPopper,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { localImage } from "@/lib/images";
import { PageBanner } from "@/components/public/PageBanner";
import { CardSlider } from "@/components/public/CardSlider";
import { EventsList } from "@/components/public/EventsList";
import { AdmissionsCta } from "@/components/public/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublic, type SchoolEvent } from "@/lib/server-api";
import { eventsSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Events & School Calendar",
  description: "Upcoming celebrations, annual day, festival events and family moments at Little Mahilam Preschool, Kangayam Road, Tiruppur.",
  path: "/events",
  keywords: ["preschool events Tiruppur", "school annual day Tiruppur", "kids celebrations Tiruppur"],
});

const TINTS = ["#f7c85b", "#ef9e8a", "#a7d9c1", "#8cb9e8"];
const CONFETTI = ["#f7c85b", "#ef9e8a", "#a7d9c1", "#8cb9e8", "#c4b5fd", "#ffffff"];

const eventTypes = [
  { icon: PartyPopper, title: "Celebrations", description: "Festivals, birthdays and joyful occasions celebrated together with children." },
  { icon: Music2, title: "Performances", description: "Music, dance, storytelling and stage moments that build confidence." },
  { icon: Users, title: "Family Events", description: "Special opportunities for parents and families to be part of school life." },
  { icon: Camera, title: "Activity Days", description: "Theme days, creative activities and meaningful learning experiences." },
];

const eventHighlights = [
  {
    title: "Festival Celebrations",
    description: "Children experience traditions, colours, stories and togetherness through age-appropriate celebrations.",
    image: localImage("/images/events/festival.webp", 0),
    tag: "Celebration",
  },
  {
    title: "Creative Activity Days",
    description: "Special days filled with art, craft, music, storytelling and hands-on discovery.",
    image: localImage("/images/events/activity-day.webp", 1),
    tag: "Creativity",
  },
  {
    title: "Family Moments",
    description: "Events that help parents participate, connect and create meaningful school memories.",
    image: localImage("/images/events/family-event.webp", 0),
    tag: "Community",
  },
];

export const revalidate = 0;

/** Day/month/weekday for the tear-off calendar, in school (IST) time. */
function calendarParts(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  const part = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...options }).format(date);
  return { day: part({ day: "numeric" }), month: part({ month: "long" }), weekday: part({ weekday: "long" }) };
}

export default async function Page() {
  const events = await getPublic<SchoolEvent[]>("/events?when=upcoming", 0);
  const cover = events?.find((event) => event.coverImage);
  const next = events?.[0];
  const cal = next ? calendarParts(next.startDate || next.date) : null;
  return (
    <PublicShell>
      <PageBanner
        theme="events"
        eyebrow="School calendar"
        icon={PartyPopper}
        title="Moments we share"
        highlight="together"
        description="Celebrations, learning experiences and family connections make our school community special."
        crumbs={[{ name: "Events", path: "/events" }]}
        image={{ src: cover?.coverImage || localImage("/images/banners/events.webp", 1), alt: cover ? cover.title : "Children celebrating a school event at Little Mahilam" }}
      />
      {events?.length ? <JsonLd data={eventsSchema(events)} /> : null}

      {/* ======================================================
          INTRO — tear-off calendar
      ====================================================== */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container-pad grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="eyebrow"><Sparkles className="h-4 w-4" /> School Life</div>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-bold leading-[1.15] text-emerald-950 sm:text-4xl lg:text-[46px]">
              Every celebration becomes a <span className="text-[#e2725b]">beautiful memory.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              School events give children opportunities to celebrate, participate, perform, create and enjoy meaningful experiences with friends, teachers and families.
            </p>
            <p className="mt-4 max-w-xl leading-8 text-slate-600">
              From festival celebrations to activity days, each event adds colour, confidence and community to a child&apos;s school journey.
            </p>
            <Link href="#upcoming-events" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900">
              View Upcoming Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[400px] pt-6">
            {/* Photo peeking behind the calendar */}
            <div className="absolute -right-4 top-0 h-56 w-44 rotate-6 overflow-hidden rounded-[24px] border-[6px] border-white shadow-xl sm:-right-10">
              <Image src={localImage("/images/events/kids-celebration.webp", 1)} alt="Children celebrating a school event" fill sizes="176px" className="object-cover" />
            </div>

            <div className="relative -rotate-2 overflow-visible rounded-[26px] bg-white shadow-[0_30px_60px_-28px_rgba(23,60,47,.55)]">
              {/* Binder rings */}
              <div aria-hidden className="absolute -top-4 inset-x-0 flex justify-center gap-16">
                {[0, 1, 2].map((r) => <span key={r} className="h-9 w-3.5 rounded-full border-[3px] border-slate-400 bg-slate-200" />)}
              </div>
              <div className="rounded-t-[26px] bg-[#e2725b] px-6 pb-4 pt-7 text-center text-white">
                <p className="font-display text-xl font-bold uppercase tracking-[.2em]">{cal ? cal.month : "School Calendar"}</p>
              </div>
              <div className="px-6 pb-7 pt-4 text-center">
                {cal && next ? (
                  <>
                    <p className="font-display text-[6.5rem] font-bold leading-none text-emerald-950">{cal.day}</p>
                    <p className="text-sm font-extrabold uppercase tracking-[.2em] text-slate-400">{cal.weekday}</p>
                    <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#fde9b8] px-4 py-3 font-display text-lg font-bold text-emerald-950">
                      <PartyPopper className="h-5 w-5 shrink-0 text-[#e2725b]" /> <span className="line-clamp-2">{next.title}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <PartyPopper className="mx-auto h-20 w-20 text-[#e2725b]" />
                    <p className="mt-3 font-display text-2xl font-bold text-emerald-950">Something to celebrate every month</p>
                    <p className="mt-2 text-sm text-slate-500">New dates are added here as they are planned.</p>
                  </>
                )}
              </div>
              {/* Torn pages underneath */}
              <span aria-hidden className="absolute inset-x-3 -bottom-2 -z-10 h-6 rounded-b-[22px] bg-white/80 shadow" />
              <span aria-hidden className="absolute inset-x-6 -bottom-4 -z-20 h-6 rounded-b-[22px] bg-white/60 shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          EVENT TYPES — ticket card slider
      ====================================================== */}
      <section className="section-peach relative overflow-hidden py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Kinds of events"
            itemClassName="w-[78%] sm:w-[44%] lg:w-[29%]"
            heading={
              <>
                <span className="eyebrow"><CalendarDays className="h-4 w-4" /> Our School Calendar</span>
                <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
                  So many reasons to <span className="text-[#e2725b]">celebrate together.</span>
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-slate-600">Events are designed to give children joyful experiences beyond their everyday classroom routine.</p>
              </>
            }
          >
            {eventTypes.map((item, i) => {
              const Icon = item.icon;
              const tint = TINTS[i % TINTS.length];
              return (
                <article key={item.title} className="ticket flex h-full flex-col bg-white shadow-[0_18px_36px_-22px_rgba(23,60,47,.45)]" style={{ "--notch": "132px" } as CSSProperties}>
                  <div className="flex h-[132px] items-center gap-4 px-6" style={{ backgroundColor: `${tint}40` }}>
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-950 shadow-sm"><Icon className="h-7 w-7" /></span>
                    <span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-[.2em] text-emerald-950/55">Admit all</span>
                      <span className="block font-display text-2xl font-bold leading-tight text-emerald-950">{item.title}</span>
                    </span>
                  </div>
                  <div className="mx-5 border-t-2 border-dashed border-emerald-950/15" />
                  <div className="flex flex-1 flex-col justify-between gap-4 px-6 pb-6 pt-4">
                    <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                    <span className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400">
                      <span className="flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5" /> No. {String(i + 1).padStart(3, "0")}</span>
                      <span>Little Mahilam</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          UPCOMING EVENTS
      ====================================================== */}
      <section id="upcoming-events" className="relative scroll-mt-24 overflow-hidden py-16 md:py-20">
        <div className="container-pad relative">
          <div className="mb-10">
            <span className="eyebrow"><CalendarDays className="h-4 w-4" /> Upcoming Events</span>
            <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
              What&apos;s happening at <span className="text-[#e2725b]">Little Mahilam?</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">Explore upcoming celebrations, activities and community moments planned for our children and families.</p>
          </div>
          <EventsList events={events} />
        </div>
      </section>

      {/* ======================================================
          HIGHLIGHTS — story-card slider
      ====================================================== */}
      <section className="section-mint py-16 md:py-20">
        <div className="container-pad">
          <CardSlider
            label="Event highlights"
            heading={
              <>
                <span className="eyebrow"><Camera className="h-4 w-4" /> Event Highlights</span>
                <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
                  Learning becomes even more special <span className="text-[#e2725b]">when we celebrate it.</span>
                </h2>
              </>
            }
          >
            {eventHighlights.map((item, i) => (
              <article key={item.title} className="group relative aspect-[3/4] overflow-hidden rounded-[30px] bg-emerald-950 text-white shadow-[0_24px_45px_-26px_rgba(23,60,47,.6)]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 380px, 80vw" className="object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-extrabold text-emerald-950 shadow-sm" style={{ backgroundColor: TINTS[i % TINTS.length] }}>{item.tag}</span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{item.description}</p>
                </div>
              </article>
            ))}
          </CardSlider>
        </div>
      </section>

      {/* ======================================================
          FAMILY & COMMUNITY — heart-shaped photo
      ====================================================== */}
      <section className="overflow-hidden py-16 md:py-24">
        <svg aria-hidden width="0" height="0" className="absolute">
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.24 C0.5,0.24 0.41,0.02 0.2,0.06 C0,0.1 -0.03,0.36 0.08,0.52 C0.2,0.7 0.5,0.95 0.5,0.95 C0.5,0.95 0.8,0.7 0.92,0.52 C1.03,0.36 1,0.1 0.8,0.06 C0.59,0.02 0.5,0.24 0.5,0.24 Z" />
          </clipPath>
        </svg>
        <div className="container-pad grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-[460px]">
            {/* Confetti */}
            <div aria-hidden className="pointer-events-none absolute -inset-6">
              {CONFETTI.map((color, i) => (
                <span key={i} className="banner-twinkle absolute block h-3 w-1.5 rounded-sm" style={{ backgroundColor: color === "#ffffff" ? "#e2725b" : color, left: `${[4, 92, 12, 84, 50, 70][i]}%`, top: `${[18, 12, 82, 76, 2, 94][i]}%`, rotate: `${i * 37}deg`, animationDelay: `${-i * 0.4}s` }} />
              ))}
            </div>
            <div className="relative aspect-square drop-shadow-[0_24px_30px_rgba(226,114,91,.35)]">
              <div className="absolute inset-0 bg-[#ef9e8a]" style={{ clipPath: "url(#heart-clip)", transform: "translate(10px, 10px)" }} />
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "url(#heart-clip)" }}>
                <Image src={localImage("/images/events/family-moment.webp", 1)} alt="Families participating in a school event" fill sizes="(min-width: 1024px) 460px, 90vw" className="object-cover" />
              </div>
            </div>
          </div>

          <div>
            <span className="eyebrow"><Users className="h-4 w-4" /> Family &amp; Community</span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
              School becomes stronger when <span className="text-[#e2725b]">families are part of the journey.</span>
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-600">Family participation helps children feel supported and creates stronger connections between home and school.</p>
            <p className="mt-4 max-w-xl leading-8 text-slate-600">Our community events give parents opportunities to participate, interact and enjoy memorable moments alongside their children.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900">
                Connect With Our School <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="flex items-center gap-2 font-display text-lg font-bold text-[#e2725b]"><Heart className="h-5 w-5 fill-current" /> Happy memories, together</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA — confetti party band
      ====================================================== */}
      <section className="py-14">
        <div className="container-pad">
          <div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(120deg,#ffd9cc,#f4c7e0_50%,#d9d0fb)] px-7 py-10 text-emerald-950 md:px-12 md:py-12">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className="absolute block h-3.5 w-2 rounded-sm opacity-70" style={{ backgroundColor: CONFETTI[i % 5], left: `${(i * 71) % 100}%`, top: `${(i * 37) % 100}%`, rotate: `${i * 29}deg` }} />
              ))}
            </div>
            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-[#e2725b] shadow-md"><PartyPopper className="h-8 w-8" /></span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-950/60">Be Part Of Our Community</span>
                <h2 className="mt-2 max-w-3xl font-display text-2xl font-bold leading-tight sm:text-3xl">Your family&apos;s journey can start here.</h2>
                <p className="mt-3 max-w-2xl leading-7 text-emerald-950/70">Visit Little Mahilam and discover a learning community filled with joyful experiences, celebrations and happy childhood memories.</p>
              </div>
              <Link href="/admissions" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-950">
                Explore Admissions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </PublicShell>
  );
}
